import { createClient, RedisClientType } from 'redis';

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
    adventurousness: string;
  };
  createdAt: number;
  updatedAt: number;
}

export class ConversationStorage {
  private static instance: ConversationStorage;
  private redis: RedisClientType | null = null;
  
  private constructor() {}
  
  static getInstance(): ConversationStorage {
    if (!ConversationStorage.instance) {
      ConversationStorage.instance = new ConversationStorage();
    }
    return ConversationStorage.instance;
  }

  async initialize() {
    if (!this.redis) {
      this.redis = createClient({
        url: process.env.REDIS_URL
      });
      await this.redis.connect();
    }
  }

  async getConversation(sessionId: string): Promise<Conversation | null> {
    try {
      await this.initialize();
      if (!this.redis) return null;
      const conversation = await this.redis.get(`conversation:${sessionId}`);
      return conversation ? JSON.parse(conversation) : null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      await this.initialize();
      if (!this.redis) return;
      await this.redis.setEx(`conversation:${conversation.sessionId}`, 60 * 60 * 24 * 7, JSON.stringify(conversation)); // Expire after 7 days
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  async addMessage(sessionId: string, message: Message, preferences?: {
    spicy: string;
    cuisine: string;
    adventurousness: string;
  }): Promise<void> {
    try {
      await this.initialize();
      let conversation = await this.getConversation(sessionId);
      
      if (!conversation) {
        console.log(`🆕 Creating new conversation for session: ${sessionId}`);
        conversation = {
          sessionId,
          messages: [],
          preferences: preferences || { spicy: '', cuisine: '', adventurousness: '' },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      } else {
        console.log(`📝 Adding message to existing conversation: ${sessionId} (${conversation.messages.length + 1} messages)`);
      }
      
      conversation.messages.push(message);
      conversation.updatedAt = Date.now();
      
      // Keep only last 20 messages to prevent storage bloat
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }
      
      await this.saveConversation(conversation);
      console.log(`✅ Stored conversation with ${conversation.messages.length} messages for session: ${sessionId}`);
    } catch (error) {
      console.error('❌ Error adding message:', error);
    }
  }

  async getRecentMessages(sessionId: string, limit: number = 10): Promise<Message[]> {
    try {
      await this.initialize();
      const conversation = await this.getConversation(sessionId);
      if (!conversation) {
        console.log(`📭 No conversation found for session: ${sessionId}`);
        return [];
      }
      
      const messages = conversation.messages.slice(-limit);
      console.log(`📖 Retrieved ${messages.length} recent messages for session: ${sessionId}`);
      return messages;
    } catch (error) {
      console.error('❌ Error getting recent messages:', error);
      return [];
    }
  }

  async updatePreferences(sessionId: string, preferences: {
    spicy?: string;
    cuisine?: string;
    adventurousness?: string;
  }): Promise<void> {
    try {
      await this.initialize();
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
      await this.initialize();
      if (!this.redis) return;
      await this.redis.del(`conversation:${sessionId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
    }
  }
}

export const conversationStorage = ConversationStorage.getInstance(); 