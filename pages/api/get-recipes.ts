import type { NextApiRequest, NextApiResponse } from 'next';
import { conversationStorage } from '../../lib/conversation-storage';

interface Recipe {
  name: string;
  description: string;
  mood: string;
  cuisine: string;
  difficulty: string;
  time: string;
  sessionId: string;
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mood, cuisine, sessionId } = req.query;
    
    let recipes: Recipe[] = [];
    
    // If sessionId is provided, get recipes from that specific conversation
    if (sessionId && typeof sessionId === 'string') {
      const conversation = await conversationStorage.getConversation(sessionId);
      if (conversation) {
        // Extract recipes from AI messages
        conversation.messages.forEach((message) => {
          if (message.role === 'assistant') {
            // Look for recipe names in bold (**Recipe Name**)
            const recipeMatch = message.content.match(/\*\*(.+?)\*\*/);
            if (recipeMatch) {
              const recipeName = recipeMatch[1];
              recipes.push({
                name: recipeName,
                description: `Suggested based on your mood and preferences. ${message.content.replace(/\*\*(.+?)\*\*/g, '').trim()}`,
                mood: conversation.preferences.feeling || 'various',
                cuisine: conversation.preferences.cuisine || 'Various',
                difficulty: 'Medium', // Default difficulty
                time: '30-45 minutes', // Default time
                sessionId: sessionId,
                timestamp: message.timestamp
              });
            }
          }
        });
      }
    } else {
      // Get recipes from all recent conversations (for demo purposes)
      // In a real app, you might want to store recipes separately or limit this
      const recentSessions = await getRecentSessions();
      
      for (const sessionId of recentSessions) {
        const conversation = await conversationStorage.getConversation(sessionId);
        if (conversation) {
          conversation.messages.forEach((message) => {
            if (message.role === 'assistant') {
              const recipeMatch = message.content.match(/\*\*(.+?)\*\*/);
              if (recipeMatch) {
                const recipeName = recipeMatch[1];
                recipes.push({
                  name: recipeName,
                  description: `Suggested based on your mood and preferences. ${message.content.replace(/\*\*(.+?)\*\*/g, '').trim()}`,
                  mood: conversation.preferences.feeling || 'various',
                  cuisine: conversation.preferences.cuisine || 'Various',
                  difficulty: 'Medium',
                  time: '30-45 minutes',
                  sessionId: sessionId,
                  timestamp: message.timestamp
                });
              }
            }
          });
        }
      }
    }
    
    // Apply filters
    if (mood && typeof mood === 'string') {
      recipes = recipes.filter(r => r.mood.toLowerCase().includes(mood.toLowerCase()));
    }
    
    if (cuisine && typeof cuisine === 'string') {
      recipes = recipes.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    }
    
    // Sort by timestamp (newest first)
    recipes.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove duplicates based on recipe name
    const uniqueRecipes = recipes.filter((recipe, index, self) => 
      index === self.findIndex(r => r.name === recipe.name)
    );
    
    res.status(200).json({ 
      recipes: uniqueRecipes,
      total: uniqueRecipes.length,
      filters: { mood, cuisine }
    });
    
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
}

// Helper function to get recent session IDs
async function getRecentSessions(): Promise<string[]> {
  // For now, return an empty array - in a real app, you'd query all sessions
  // This is a simplified version - you might want to store session IDs separately
  return [];
} 