import type { NextApiRequest, NextApiResponse } from 'next';
import { conversationStorage } from '../../lib/conversation-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    
    if (sessionId && typeof sessionId === 'string') {
      // Get specific conversation
      const conversation = await conversationStorage.getConversation(sessionId);
      return res.status(200).json({
        sessionId,
        conversation,
        exists: !!conversation,
        messageCount: conversation?.messages?.length || 0
      });
    } else {
      // Return general storage info
      return res.status(200).json({
        message: 'Use ?sessionId=YOUR_SESSION_ID to check specific conversation',
        example: 'GET /api/debug-conversations?sessionId=session_1234567890_abc123def'
      });
    }
  } catch (error) {
    console.error('Debug API Error:', error);
    res.status(500).json({ error: 'Failed to debug conversations' });
  }
} 