# Conversation Storage Setup

This guide explains how to set up conversation storage for better AI responses.

## What We've Implemented

### 1. **Conversation Storage Service** (`lib/conversation-storage.ts`)
- Stores conversation history in Vercel KV (Redis)
- Maintains context across multiple messages
- Automatically expires conversations after 7 days
- Limits to last 20 messages to prevent storage bloat

### 2. **Enhanced API Route** (`pages/api/recipe-suggest.ts`)
- Now accepts `sessionId` parameter
- Stores both user and AI messages
- Uses conversation history for context-aware responses
- Maintains existing security measures

### 3. **Updated Chat Component** (`components/Chat.tsx`)
- Generates unique session IDs for each conversation
- Passes session ID to API for context tracking

## Storage Location

### **Vercel KV (Redis)**
- **Location**: Vercel's managed Redis database
- **Key Format**: `conversation:session_1234567890_abc123def`
- **Expiration**: 7 days (configurable)
- **Data Structure**:
```json
{
  "sessionId": "session_1234567890_abc123def",
  "messages": [
    {
      "role": "user",
      "content": "I'm feeling cozy",
      "timestamp": 1703123456789
    },
    {
      "role": "assistant", 
      "content": "That sounds wonderful! Being with someone you care about can definitely make you feel cozy. What kind of food do you both enjoy together?",
      "timestamp": 1703123456790
    }
  ],
  "preferences": {
    "spicy": "Mild",
    "cuisine": "Italian",
    "feeling": "cozy"
  },
  "createdAt": 1703123456789,
  "updatedAt": 1703123456790
}
```

## Setup Instructions

### 1. **Local Development**
For local development, you can use a simple in-memory fallback:

```typescript
// In lib/conversation-storage.ts, add fallback for local development
if (process.env.NODE_ENV === 'development') {
  // Use in-memory storage for local development
  const memoryStore = new Map<string, Conversation>();
  
  // Override methods to use memory store
  async getConversation(sessionId: string) {
    return memoryStore.get(sessionId) || null;
  }
  
  async saveConversation(conversation: Conversation) {
    memoryStore.set(conversation.sessionId, conversation);
  }
}
```

### 2. **Production Setup (Vercel)**
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Link your project**: `vercel link`
3. **Add KV database**: `vercel kv create`
4. **Set environment variables**:
   ```bash
   vercel env add KV_URL
   vercel env add KV_REST_API_URL
   vercel env add KV_REST_API_TOKEN
   vercel env add KV_REST_API_READ_ONLY_TOKEN
   ```

### 3. **Alternative: Supabase (PostgreSQL)**
If you prefer a full database:

```bash
npm install @supabase/supabase-js
```

Then update `lib/conversation-storage.ts` to use Supabase instead of KV.

## Benefits

### **1. Context-Aware Responses**
- AI remembers previous conversation
- Can reference earlier messages
- Provides more coherent responses

### **2. Personalization**
- Learns user preferences over time
- Can suggest recipes based on conversation history
- Builds user profiles automatically

### **3. Analytics**
- Track conversation patterns
- Monitor user satisfaction
- Improve AI responses based on data

### **4. Scalability**
- Handles multiple users simultaneously
- Automatic cleanup of old conversations
- Efficient storage with Redis

## Security Considerations

✅ **Already Implemented**:
- Input sanitization
- Rate limiting
- CORS headers
- XSS protection
- Data expiration (7 days)

🔒 **Additional Security**:
- Session IDs are randomly generated
- No personally identifiable information stored
- Automatic data cleanup
- Encrypted storage (Vercel KV)

## Monitoring

You can monitor conversation storage by adding logging:

```typescript
// In lib/conversation-storage.ts
console.log(`Storing message for session: ${sessionId}`);
console.log(`Conversation has ${conversation.messages.length} messages`);
```

## Next Steps

1. **Deploy to Vercel** with KV storage
2. **Test conversation flow** with multiple messages
3. **Monitor performance** and storage usage
4. **Add analytics** for conversation patterns
5. **Implement user preferences** learning

The conversation storage is now ready to provide much better AI responses with full context awareness! 