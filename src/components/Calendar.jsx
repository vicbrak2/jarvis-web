import { useState, useEffect } from 'react';

const JARVIS_API = import.meta.env.VITE_JARVIS_URL || 'http://localhost:3000';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${JARVIS_API}/api/calendar/events?limit=5`);
      const data = await res.json();
      setEvents(data || []);
    } catch (e) {
      console.error('Error fetching events:', e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">Próximos Eventos</h2>

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : events.length === 0 ? (
        <p className="text-slate-400">Sin eventos próximos</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={i} className="flex gap-3 p-3 bg-slate-700 rounded border border-slate-600">
              <div className="flex-1">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-slate-400">{event.start}</p>
                {event.location && <p className="text-xs text-slate-500">{event.location}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
