import { kv } from '@vercel/kv';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  sessionId: string;
  messages: Message[];
  preferences: {
    spicy: string;
    cuisine: string;
    feeling: string;
  };
  createdAt: number;
  updatedAt: number;
}

export class ConversationStorage {
  private static instance: ConversationStorage;
  
  private constructor() {}
  
  static getInstance(): ConversationStorage {
    if (!ConversationStorage.instance) {
      ConversationStorage.instance = new ConversationStorage();
    }
    return ConversationStorage.instance;
  }

  async getConversation(sessionId: string): Promise<Conversation | null> {
    try {
      const conversation = await kv.get<Conversation>(`conversation:${sessionId}`);
      return conversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      await kv.set(`conversation:${conversation.sessionId}`, conversation, {
        ex: 60 * 60 * 24 * 7 // Expire after 7 days
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  async addMessage(sessionId: string, message: Message, preferences?: any): Promise<void> {
    try {
      let conversation = await this.getConversation(sessionId);
      
      if (!conversation) {
        conversation = {
          sessionId,
          messages: [],
          preferences: preferences || { spicy: '', cuisine: '', feeling: '' },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }
      
      conversation.messages.push(message);
      conversation.updatedAt = Date.now();
      
      // Keep only last 20 messages to prevent storage bloat
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }
      
      await this.saveConversation(conversation);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  async getRecentMessages(sessionId: string, limit: number = 10): Promise<Message[]> {
    try {
      const conversation = await this.getConversation(sessionId);
      if (!conversation) return [];
      
      return conversation.messages.slice(-limit);
    } catch (error) {
      console.error('Error getting recent messages:', error);
      return [];
    }
  }

  async updatePreferences(sessionId: string, preferences: any): Promise<void> {
    try {
      const conversation = await this.getConversation(sessionId);
      if (conversation) {
        conversation.preferences = { ...conversation.preferences, ...preferences };
        conversation.updatedAt = Date.now();
        await this.saveConversation(conversation);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  async deleteConversation(sessionId: string): Promise<void> {
    try {
      await kv.del(`conversation:${sessionId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }
}

export const conversationStorage = ConversationStorage.getInstance(); 