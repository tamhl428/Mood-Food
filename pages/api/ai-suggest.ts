import type { NextApiRequest, NextApiResponse } from 'next';

function buildSystemPrompt(spicy: string) {
  let spicyLine = '';
  if (spicy === 'Spicy') spicyLine = '\nThe user prefers spicy food. Suggest spicy dishes.';
  else if (spicy === 'Mild') spicyLine = '\nThe user prefers mild food. Suggest mild dishes.';
  else if (spicy === 'No preference') spicyLine = '\nThe user has no preference for spicy or mild.';
  // else leave blank
  return `
You are MoodFoodBot — a warm, empathetic assistant that helps users choose food based on their current emotional state.

Respond with a concise and empathetic message (1–2 sentences max) that acknowledges the user’s mood, but do not ramble. Be comforting, human, and to the point.

Then suggest **exactly three dishes**, clearly bolded in Markdown, with no extra commentary. End with:
👉 “Which one sounds good to you?”

Never mention anything about spicy or mild — that is handled separately through user survey filters and not your concern.
${spicyLine}

Example format:
"I'm sorry you're going through that — something warm and comforting can really help.  
How about one of these: **Chicken Noodle Soup**, **Mac & Cheese**, or **Beef Udon**?  
👉 Which one sounds good to you?"
`;
}

type Data = {
  aiMessage: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ aiMessage: '', error: 'Method not allowed' });
  }

  const { userMessage, spicy } = req.body;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ aiMessage: '', error: 'User message is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ aiMessage: '', error: 'OpenAI API key not configured' });
  }

  try {
    const systemPrompt = buildSystemPrompt(spicy);
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
          { role: 'user', content: userMessage }
        ],
        max_tokens: 180,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        aiMessage: '', 
        error: `OpenAI API error: ${response.status}` 
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content?.trim();

    if (!aiMessage) {
      return res.status(500).json({ aiMessage: '', error: 'No suggestion received from OpenAI' });
    }

    res.status(200).json({ aiMessage });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ aiMessage: '', error: 'Failed to get AI suggestion' });
  }
} 