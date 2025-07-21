import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback food suggestions based on feeling
const getFallbackSuggestion = (feeling: string): string => {
  const feelingSuggestions: { [key: string]: string } = {
    happy: "Pizza! 🍕 A classic comfort food that's perfect for celebrating good vibes.",
    sad: "Chocolate ice cream 🍦 Sweet treats can help lift your spirits.",
    excited: "Sushi! 🍣 Fresh and vibrant flavors to match your energy.",
    tired: "Warm soup 🍜 Something comforting and easy to digest.",
    stressed: "Green tea and cookies 🍵☕ A calming combination to help you relax.",
    hungry: "Burgers! 🍔 Satisfy that hunger with something hearty.",
    romantic: "Pasta with wine 🍝🍷 Perfect for a romantic evening.",
    energetic: "Smoothie bowl 🥗 Fresh fruits and granola for sustained energy.",
    cozy: "Hot chocolate and cookies ☕🍪 Perfect for a cozy day.",
    adventurous: "Thai curry 🌶️ Spicy and exciting flavors for your adventurous spirit."
  };

  const lowerFeeling = feeling.toLowerCase();
  for (const [key, suggestion] of Object.entries(feelingSuggestions)) {
    if (lowerFeeling.includes(key)) {
      return suggestion;
    }
  }

  return "Comfort food like mac and cheese! 🧀 Sometimes the classics are the best choice.";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { feeling } = req.body;

  if (!feeling) {
    return res.status(400).json({ error: 'Feeling is required' });
  }

  const prompt = `Suggest a food idea based on this feeling: ${feeling}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || 'No suggestion available';

    res.status(200).json({ suggestion });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    
    // Handle quota exceeded error
    if (error.status === 429 || error.code === 'insufficient_quota') {
      const fallbackSuggestion = getFallbackSuggestion(feeling);
      res.status(200).json({ 
        suggestion: fallbackSuggestion,
        note: "Using fallback suggestion (OpenAI quota exceeded)"
      });
    } else {
      res.status(500).json({ error: 'OpenAI request failed' });
    }
  }
}