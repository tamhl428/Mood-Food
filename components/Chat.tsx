import React, { useState, useRef, useEffect } from 'react';
import type { Prefs } from './SurveyModal';
import { useRouter } from 'next/router';

// Helper to parse bolded dish name from AI message
function extractDishFromMarkdown(message: string): string | null {
  const match = message.match(/\*\*(.+?)\*\*/);
  return match ? match[1] : null;
}

// Render Markdown bold (**text**) as <strong>
function renderMarkdown(message: string) {
  // Only handle bold for now
  const parts = message.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*(.+)\*\*$/.test(part)) {
      return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// Fetch Yelp data from our secure API route
async function fetchYelpResults({ location, keyword }: { location: string; keyword: string }): Promise<unknown[]> {
  const params = new URLSearchParams({ location, cuisine: keyword }).toString();
  const res = await fetch(`/api/yelp?${params}`);
  if (!res.ok) throw new Error('Failed to fetch Yelp results');
  const data = await res.json();
  return data.businesses as unknown[];
}

// Fetch an AI suggestion from OpenAI via our secure API route
async function fetchAISuggestion(userMsg: string, spicy: string): Promise<string> {
  const response = await fetch('/api/ai-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage: userMsg, spicy }),
  });
  if (!response.ok) throw new Error('Failed to get AI suggestion');
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.aiMessage;
}

export default function Chat({ prefs }: { prefs: Prefs }) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dish, setDish] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, dish]);

  // User sends a message, get AI suggestion, extract dish, and update chat
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const aiMessage = await fetchAISuggestion(input, prefs.spicy);
      setMessages(msgs => [...msgs, { sender: 'ai', text: aiMessage }]);
      const extracted = extractDishFromMarkdown(aiMessage);
      setDish(extracted);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setMessages(msgs => [...msgs, { sender: 'ai', text: `Sorry, I couldn't process that. ${errorMessage}` }]);
      setDish(null);
    } finally {
      setLoading(false);
    }
    setInput('');
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        border: '1px solid #ccc', borderRadius: 8, minHeight: 200, maxHeight: 320,
        overflowY: 'auto', padding: 12, background: '#fafafa', marginBottom: 12
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Start the conversation below!</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '8px 0',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              background: msg.sender === 'user' ? '#e3f2fd' : '#e8f5e9',
              color: '#222',
              borderRadius: 6,
              padding: '8px 12px',
              maxWidth: '80%',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line'
            }}>
              {msg.sender === 'ai' ? renderMarkdown(msg.text) : msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'left', color: '#888', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              background: '#f0f0f0',
              borderRadius: 6,
              padding: '8px 12px'
            }}>
              AI is typing...
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Dish Card and Yelp Results */}
      {dish && (
        <div style={{
          border: '1px solid #e0e0e0', borderRadius: 8, background: '#f6fff6', padding: 12, marginBottom: 12
        }}>
          <strong>Dish Suggestion:</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px 0' }}>
            <div style={{ width: 56, height: 56, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              🍽️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{dish}</div>
              <button
                style={{ marginTop: 8, padding: '6px 16px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
                onClick={() => router.push(`/locations?dish=${encodeURIComponent(dish)}`)}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '8px 16px', borderRadius: 4 }}>
          Send
        </button>
      </form>
    </div>
  );
} 