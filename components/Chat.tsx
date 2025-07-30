import React, { useState, useRef, useEffect } from 'react';
import type { Prefs } from './SurveyModal';

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

// Fetch a recipe suggestion from OpenAI via our secure API route
async function fetchRecipeSuggestion(userMsg: string, spicy: string, cuisine: string, mode: 'initial' | 'suggestion' = 'suggestion'): Promise<{
  aiMessage: string;
  recipe: string;
  youtubeQuery: string;
  youtubeVideo?: {
    title: string;
    videoId: string;
    url: string;
  };
}> {
  const response = await fetch('/api/recipe-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage: userMsg, spicy, cuisine, mode }),
  });
  if (!response.ok) throw new Error('Failed to get recipe suggestion');
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export default function Chat({ prefs, triggerInitialMessage = false }: { prefs: Prefs; triggerInitialMessage?: boolean }) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<{
    title: string;
    videoId: string;
    url: string;
  } | null>(null);
  const [hasTriggeredInitial, setHasTriggeredInitial] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, recipe]);

  // Trigger initial AI message when survey is submitted
  useEffect(() => {
    if (triggerInitialMessage && !hasTriggeredInitial && prefs.feeling) {
      setHasTriggeredInitial(true);
      setLoading(true);
      
      const initialMessage = `I'm feeling ${prefs.feeling} today.`;
      setMessages([{ sender: 'user', text: initialMessage }]);
      
      fetchRecipeSuggestion(initialMessage, prefs.spicy, prefs.cuisine, 'initial')
        .then(data => {
          setMessages(msgs => [...msgs, { sender: 'ai', text: data.aiMessage }]);
        })
        .catch(err => {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setMessages(msgs => [...msgs, { sender: 'ai', text: `Sorry, I couldn't process that. ${errorMessage}` }]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [triggerInitialMessage, hasTriggeredInitial, prefs.feeling, prefs.spicy, prefs.cuisine]);

  // User sends a message, get AI suggestion, extract recipe, and update chat
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const data = await fetchRecipeSuggestion(input, prefs.spicy, prefs.cuisine, 'suggestion');
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.aiMessage }]);
      setRecipe(data.recipe);
      setYoutubeVideo(data.youtubeVideo || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setMessages(msgs => [...msgs, { sender: 'ai', text: `Sorry, I couldn't process that. ${errorMessage}` }]);
      setRecipe(null);
      setYoutubeVideo(null);
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
      
      {/* Recipe Card and YouTube Video */}
      {recipe && (
        <div style={{
          border: '1px solid #e0e0e0', borderRadius: 8, background: '#f6fff6', padding: 12, marginBottom: 12
        }}>
          <strong>Recipe Suggestion:</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px 0' }}>
            <div style={{ width: 56, height: 56, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              🍽️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{recipe}</div>
              {youtubeVideo && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                    {youtubeVideo.title}
                  </div>
                  <a
                    href={youtubeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: 4,
                      background: '#ff0000',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    Watch Recipe 🎥
                  </a>
                </div>
              )}
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