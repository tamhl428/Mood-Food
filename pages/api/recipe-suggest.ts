import type { NextApiRequest, NextApiResponse } from 'next';
import { conversationStorage, Message } from '../../lib/conversation-storage';

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Fun food emojis to inject into recommendations
const foodEmojis = ['🍕', '😋', '🥗', '🍔', '🍜', '🍣', '🍛', '🌮', '🥘', '🍝', '🍲', '🥪', '🍖', '🥩', '🍗', '🥓', '🍤', '🦐', '🐟', '🥑', '🥕', '🥬', '🍅', '🧀', '🥚', '🥛', '🍞', '🥐', '🥖', '🍰', '🍪', '🍩', '🍦', '🍨', '🍧', '🍡', '🍭', '🍫', '🍬', '🍯', '🥜', '🌰', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍊', '🍋', '🍌', '🍉', '🍈', '🍐', '🍎', '🍏'];

function injectEmojis(text: string): string {
  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, index) => {
    // Add emoji every 2-3 sentences for variety
    if (index > 0 && index % 2 === 0) {
      const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
      return `${randomEmoji} ${sentence}`;
    }
    return sentence;
  }).join(' ');
}

function buildSystemPrompt(spicy: string, cuisine: string, mode: 'initial' | 'suggestion' = 'suggestion') {
  if (mode === 'initial') {
    return `You are a warm, empathetic recipe concierge who helps users find the perfect recipe based on their mood. Your responses should be:

1. **Contextually appropriate**: If someone mentions they're feeling cozy because of their girlfriend, acknowledge the relationship context appropriately
2. **Grammatically correct**: Use proper grammar and complete sentences
3. **Logically coherent**: Make sure your responses follow logically from what the user said
4. **Emotionally intelligent**: Show understanding of their emotional state
5. **Conversational**: Ask follow-up questions that encourage them to share more

Examples of good responses:
- "That sounds wonderful! Being with someone you care about can definitely make you feel cozy. What kind of food do you both enjoy together?"
- "I'm glad you're feeling cozy! Spending time with loved ones is so special. Are you thinking of cooking something together?"
- "That's such a lovely feeling! Being with someone who makes you feel cozy is precious. What kind of mood are you in for food today?"

Avoid responses that don't make logical sense or are grammatically incorrect.`;
  }

  let spicyLine = '';
  if (spicy === 'Spicy') spicyLine = '\nThe user prefers spicy food. Suggest spicy recipes.';
  else if (spicy === 'Mild') spicyLine = '\nThe user prefers mild food. Suggest mild recipes.';
  else if (spicy === 'No preference') spicyLine = '\nThe user has no preference for spicy or mild.';
  
  let cuisineLine = '';
  if (cuisine && cuisine !== 'Other') {
    cuisineLine = `\nThe user prefers ${cuisine} cuisine. Focus on suggesting ${cuisine} recipes or recipes that are commonly found in ${cuisine} cooking.`;
  }

  return `
You are MoodRecipeBot — a warm, empathetic assistant that helps users choose recipes based on their current emotional state.

**Response Guidelines:**
1. **Be contextually appropriate**: If someone mentions specific reasons for their mood (like "my girlfriend"), acknowledge that context appropriately
2. **Use proper grammar**: Write complete, grammatically correct sentences
3. **Be logically coherent**: Your response should make sense given what the user said
4. **Show emotional intelligence**: Demonstrate understanding of their emotional state
5. **Keep it concise**: 1-2 sentences for the response, then suggest a recipe

**Recipe Suggestion Format:**
After your empathetic response, suggest **exactly one popular dish/recipe**, clearly bolded in Markdown, with no extra commentary. This should be a well-known, popular dish that people commonly search for recipes online.

**Important:** Always respect the user's cuisine preference. If they prefer a specific cuisine, suggest a dish from that cuisine or similar styles.
${cuisineLine}
${spicyLine}

Example format:
"I'm glad you're feeling cozy with your girlfriend! That's such a special feeling. How about **Chicken Tikka Masala**?"
`;
}

type Data = {
  aiMessage: string;
  recipe: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://mood-food.vercel.app' : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ aiMessage: '', recipe: '', error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ aiMessage: '', recipe: '', error: 'Too many requests. Please try again later.' });
  }

  const { userMessage, spicy, cuisine, mode = 'suggestion', sessionId } = req.body;

  // Input validation and sanitization
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'User message is required' });
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'Session ID is required' });
  }

  // Sanitize user input - remove potentially dangerous characters
  const sanitizedUserMessage = userMessage
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 1000); // Limit length

  if (!sanitizedUserMessage) {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'User message cannot be empty' });
  }

  // Validate mode parameter
  if (mode !== 'initial' && mode !== 'suggestion') {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'Invalid mode parameter' });
  }

  // Validate spicy and cuisine parameters
  const validSpicyOptions = ['Spicy', 'Mild', 'No preference'];
  const validCuisineOptions = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese', 'Thai', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Greek', 'Other'];
  
  if (spicy && !validSpicyOptions.includes(spicy)) {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'Invalid spicy preference' });
  }

  if (cuisine && !validCuisineOptions.includes(cuisine)) {
    return res.status(400).json({ aiMessage: '', recipe: '', error: 'Invalid cuisine preference' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ aiMessage: '', recipe: '', error: 'OpenAI API key not configured' });
  }

  try {
    // Store user message
    const userMessageObj: Message = {
      role: 'user',
      content: sanitizedUserMessage,
      timestamp: Date.now()
    };
    
    await conversationStorage.addMessage(sessionId, userMessageObj, { feeling: '', spicy, cuisine, adventurousness: '' });

    // Get conversation history for context
    const recentMessages = await conversationStorage.getRecentMessages(sessionId, 8);
    
    const systemPrompt = buildSystemPrompt(spicy || 'No preference', cuisine || '', mode);
    
    // Build messages array for OpenAI with conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: sanitizedUserMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: mode === 'initial' ? 100 : 180,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        aiMessage: '', 
        recipe: '',
        error: `OpenAI API error: ${response.status}` 
      });
    }

    const data = await response.json();
    let aiMessage = data.choices?.[0]?.message?.content?.trim();

    if (!aiMessage) {
      return res.status(500).json({ aiMessage: '', recipe: '', error: 'No suggestion received from OpenAI' });
    }

    // Store AI response
    const aiMessageObj: Message = {
      role: 'assistant',
      content: aiMessage,
      timestamp: Date.now()
    };
    
    await conversationStorage.addMessage(sessionId, aiMessageObj);

    // Extract recipe name from bolded text
    const recipeMatch = aiMessage.match(/\*\*(.+?)\*\*/);
    const recipe = recipeMatch ? recipeMatch[1] : '';
    
    // Debug recipe extraction
    console.log('AI Message:', aiMessage);
    console.log('Recipe extracted:', recipe);

    // Inject emojis for suggestion mode only
    if (mode === 'suggestion') {
      aiMessage = injectEmojis(aiMessage);
    }

    res.status(200).json({ 
      aiMessage, 
      recipe
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ aiMessage: '', recipe: '', error: 'Failed to get AI suggestion' });
  }
} 