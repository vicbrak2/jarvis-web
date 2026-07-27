import { useState, useRef, useEffect } from 'react';

const BRAIN_API = import.meta.env.VITE_BRAIN_URL || 'http://localhost:8888';
const CHAT_STORAGE_PREFIX = 'jarvis_chat_session_v1:';
const MAX_STORED_MESSAGES = 80;

function storageKey(profile) {
  return `${CHAT_STORAGE_PREFIX}${profile}`;
}

function readMessages(profile) {
  try {
    const stored = window.localStorage.getItem(storageKey(profile));
    const messages = stored ? JSON.parse(stored) : [];
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
}

function writeMessages(profile, messages) {
  try {
    window.localStorage.setItem(
      storageKey(profile),
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
    );
  } catch {
    // A full or disabled browser storage must not block the chat.
  }
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState('qamiluna_team');
  const endRef = useRef(null);

  useEffect(() => {
    setMessages(readMessages(profile));
  }, [profile]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    writeMessages(profile, nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${BRAIN_API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          profile: profile,
          history: nextMessages.slice(-8),
          max_tokens: 600,
        }),
      });
      const data = await res.json();
      const assistantMsg = { role: 'assistant', content: data.reply || 'Error' };
      setMessages(prev => {
        const next = [...prev, assistantMsg];
        writeMessages(profile, next);
        return next;
      });
    } catch (e) {
      console.error('Error:', e);
      setMessages(prev => {
        const next = [...prev, { role: 'assistant', content: 'Error conectando con Brain' }];
        writeMessages(profile, next);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    if (loading || !window.confirm(`¿Limpiar la sesión de ${profile}?`)) return;
    window.localStorage.removeItem(storageKey(profile));
    setMessages([]);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col h-96">
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-slate-400">Agente:</label>
        <select
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="bg-slate-700 text-slate-100 rounded px-2 py-1"
        >
          <option value="qamiluna_team">Qamiluna Team</option>
          <option value="jarvis_internal">Jarvis Internal</option>
          <option value="general">General</option>
        </select>
        <button
          type="button"
          onClick={clearSession}
          disabled={loading}
          title="Limpiar sesión del agente activo"
          className="ml-auto bg-slate-700 hover:bg-red-700 disabled:opacity-50 text-slate-100 px-3 py-1 rounded"
        >
          🗑 Limpiar sesión
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-slate-900 rounded p-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded">
              <p className="text-sm">Pensando...</p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Pregunta al agente..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
