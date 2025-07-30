import type { NextApiRequest, NextApiResponse } from 'next';

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
    return `You are a playful and emotionally aware recipe concierge. Based on the user's mood, first respond warmly and ask an open-ended question about their day. Only suggest recipes after the user replies.

Be warm, empathetic, and engaging. Ask a follow-up question that encourages them to share more about their day or what's on their mind. Keep it conversational and light-hearted.

Example responses:
- "You're feeling romantic? I love that! What's got you in such a lovely mood today?"
- "Feeling stressed? I totally get that. What's been weighing on your mind lately?"
- "Excited and energetic? That's fantastic! What's got you so pumped up today?"`;
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

Respond with a concise and empathetic message (1–2 sentences max) that acknowledges the user's mood, but do not ramble. Be comforting, human, and to the point.

Then suggest **exactly one popular dish/recipe**, clearly bolded in Markdown, with no extra commentary. This should be a well-known, popular dish that people commonly search for recipes online.

IMPORTANT: Always respect the user's cuisine preference. If they prefer a specific cuisine, suggest a dish from that cuisine or similar styles.
${cuisineLine}
${spicyLine}

Example format:
"I'm sorry you're going through that — something warm and comforting can really help.  
How about **Chicken Noodle Soup**?"
`;
}

type Data = {
  aiMessage: string;
  recipe: string;
  youtubeQuery: string;
  youtubeVideo?: {
    title: string;
    videoId: string;
    url: string;
  };
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
    return res.status(405).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Too many requests. Please try again later.' });
  }

  const { userMessage, spicy, cuisine, mode = 'suggestion' } = req.body;

  // Input validation and sanitization
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'User message is required' });
  }

  // Sanitize user input - remove potentially dangerous characters
  const sanitizedUserMessage = userMessage
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 1000); // Limit length

  if (!sanitizedUserMessage) {
    return res.status(400).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'User message cannot be empty' });
  }

  // Validate mode parameter
  if (mode !== 'initial' && mode !== 'suggestion') {
    return res.status(400).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Invalid mode parameter' });
  }

  // Validate spicy and cuisine parameters
  const validSpicyOptions = ['Spicy', 'Mild', 'No preference'];
  const validCuisineOptions = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese', 'Thai', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Greek', 'Other'];
  
  if (spicy && !validSpicyOptions.includes(spicy)) {
    return res.status(400).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Invalid spicy preference' });
  }

  if (cuisine && !validCuisineOptions.includes(cuisine)) {
    return res.status(400).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Invalid cuisine preference' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'OpenAI API key not configured' });
  }

  try {
    const systemPrompt = buildSystemPrompt(spicy || 'No preference', cuisine || '', mode);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sanitizedUserMessage }
        ],
        max_tokens: mode === 'initial' ? 100 : 180,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        aiMessage: '', 
        recipe: '',
        youtubeQuery: '',
        error: `OpenAI API error: ${response.status}` 
      });
    }

    const data = await response.json();
    let aiMessage = data.choices?.[0]?.message?.content?.trim();

    if (!aiMessage) {
      return res.status(500).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'No suggestion received from OpenAI' });
    }

    // Extract recipe name from bolded text
    const recipeMatch = aiMessage.match(/\*\*(.+?)\*\*/);
    const recipe = recipeMatch ? recipeMatch[1] : '';

    // Generate YouTube search query
    const youtubeQuery = `${recipe} recipe how to make`;

    // Inject emojis for suggestion mode only
    if (mode === 'suggestion') {
      aiMessage = injectEmojis(aiMessage);
    }

    // For now, return without YouTube video (we'll implement this later)
    res.status(200).json({ 
      aiMessage, 
      recipe, 
      youtubeQuery,
      youtubeVideo: {
        title: `${recipe} Recipe`,
        videoId: 'dQw4w9WgXcQ', // Placeholder
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
      }
    });
  } catch {
    res.status(500).json({ aiMessage: '', recipe: '', youtubeQuery: '', error: 'Failed to get AI suggestion' });
  }
} 