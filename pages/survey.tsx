'use client';

import { useState } from 'react';

export default function Survey() {
  const [feeling, setFeeling] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion('');
    setError('');
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuggestion(data.suggestion);
      } else {
        setError(data.error || 'Error fetching suggestion');
      }
    } catch (err) {
      setError('Error contacting API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="feeling">How are you feeling today?</label>
        <input
          id="feeling"
          type="text"
          value={feeling}
          onChange={e => setFeeling(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: 8, borderRadius: 4 }}>
          {loading ? 'Loading...' : 'Get Suggestion'}
        </button>
      </form>
      {suggestion && (
        <div style={{ marginTop: 24, padding: 12, background: '#e8f5e9', borderRadius: 4 }}>
          <strong>Suggestion:</strong> {suggestion}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 24, padding: 12, background: '#ffebee', borderRadius: 4, color: '#c00' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}


