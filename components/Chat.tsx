import React, { useState, useRef, useEffect } from 'react';
import type { Prefs } from './SurveyModal';
import { useRouter } from 'next/router';

// Generate a unique session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

// Fetch a recipe suggestion from OpenAI via our secure API route
async function fetchRecipeSuggestion(userMsg: string, spicy: string, cuisine: string, mode: 'initial' | 'suggestion' = 'suggestion', sessionId: string): Promise<{
  aiMessage: string;
  recipe: string;
}> {
  const response = await fetch('/api/recipe-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userMessage: userMsg, 
      spicy, 
      cuisine, 
      mode,
      sessionId 
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default function Chat({ prefs, triggerInitialMessage = false }: { prefs: Prefs; triggerInitialMessage?: boolean }) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  
  // Debug recipe state changes
  useEffect(() => {
    console.log('Recipe state changed:', recipe);
  }, [recipe]);
  const [hasTriggeredInitial, setHasTriggeredInitial] = useState(false);
  const [sessionId, setSessionId] = useState<string>(generateSessionId());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Generate session ID on component mount
  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  // Store session ID in localStorage when it changes
  useEffect(() => {
    if (sessionId && typeof window !== 'undefined') {
      localStorage.setItem('moodzera_recent_session', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, recipe]);

  // Trigger initial AI message when survey is submitted - Fixed TypeScript issues
  useEffect(() => {
    if (triggerInitialMessage && !hasTriggeredInitial && prefs.feeling) {
      setHasTriggeredInitial(true);
      setLoading(true);
      
      const initialMessage = `I'm feeling ${prefs.feeling} today.`;
      setMessages([{ sender: 'user', text: initialMessage }]);
      
      fetchRecipeSuggestion(initialMessage, prefs.spicy, prefs.cuisine, 'initial', sessionId)
        .then(data => {
          setMessages(msgs => [...msgs, { sender: 'ai', text: data.aiMessage }]);
          // Set the recipe from the initial message as well
          if (data.recipe) {
            console.log('Setting initial recipe to:', data.recipe);
            setRecipe(data.recipe);
          } else {
            console.log('No recipe in initial message');
          }
        })
        .catch(err => {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setMessages(msgs => [...msgs, { sender: 'ai', text: `Sorry, I couldn't process that. ${errorMessage}` }]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [triggerInitialMessage, hasTriggeredInitial, prefs.feeling, prefs.spicy, prefs.cuisine, sessionId]);

  // User sends a message, get AI suggestion, extract recipe, and update chat
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const data = await fetchRecipeSuggestion(input, prefs.spicy, prefs.cuisine, 'suggestion', sessionId);
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.aiMessage }]);
      // Only update recipe if a valid recipe is returned
      if (data.recipe && data.recipe.trim()) {
        console.log('Setting recipe to:', data.recipe);
        setRecipe(data.recipe);
      } else {
        console.log('No valid recipe returned, keeping current recipe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setMessages(msgs => [...msgs, { sender: 'ai', text: `Sorry, I couldn't process that. ${errorMessage}` }]);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
    setInput('');
  };

  const handleGetRecipes = () => {
    router.push('/recipes');
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* Debug Session ID */}
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginBottom: '8px',
        padding: '4px 8px',
        background: '#f0f0f0',
        borderRadius: '4px',
        fontFamily: 'monospace'
      }}>
        Session ID: {sessionId}
      </div>
      
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
      
      {/* Recipe Card */}
      {recipe && (
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          padding: 24,
          marginBottom: 20,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            {/* Recipe Icon */}
            <div style={{ 
              width: 72, 
              height: 72, 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
              borderRadius: 16, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 32,
              color: 'white',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)',
              flexShrink: 0
            }}>
              🍽️
            </div>
            
            {/* Recipe Content */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 800, 
                fontSize: 24, 
                color: '#111827',
                marginBottom: 8,
                lineHeight: '1.2'
              }}>
                {recipe}
              </div>
              
              <div style={{ 
                fontSize: 15, 
                color: '#6b7280',
                marginBottom: 20,
                lineHeight: '1.6'
              }}>
                Perfectly crafted recipe suggestion based on your preferences and mood.
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleGetRecipes}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: 140
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <span>📋</span>
                  <span>View Recipe</span>
                </button>
                
                <button
                  onClick={() => setRecipe(null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'transparent',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    minWidth: 120
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <span>✕</span>
                  <span>Dismiss</span>
                </button>
              </div>
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