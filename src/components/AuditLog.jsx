import { useState, useEffect } from 'react';

const JARVIS_API = import.meta.env.VITE_JARVIS_URL || 'http://localhost:3000';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAuditLogs();
    // Refresh cada 30 segundos
    const interval = setInterval(fetchAuditLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${JARVIS_API}/api/audit/logs?limit=50`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error('Error fetching audit logs:', e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Agent', 'Pregunta', 'Respuesta', 'Modelo', 'Latencia (ms)'];
    const rows = logs.map(log => [
      log.timestamp,
      log.profile || 'unknown',
      `"${log.message || ''}"`,
      `"${log.reply || ''}"`,
      log.model || 'unknown',
      log.latency_ms || 0,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-400">Auditoría Brain</h2>
        <button
          onClick={handleExportCSV}
          disabled={logs.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm"
        >
          📥 Exportar CSV
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-400">Sin registros de auditoría</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div
              key={i}
              className="bg-slate-700 rounded border border-slate-600 p-3 cursor-pointer hover:border-amber-400 transition"
              onClick={() => setExpandedId(expandedId === i ? null : i)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                      {log.profile || 'unknown'}
                    </span>
                    <span className="text-xs text-slate-400">{log.timestamp}</span>
                    <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">
                      {log.model || 'gpt-oss'}
                    </span>
                    {log.latency_ms && (
                      <span className="text-xs text-slate-400">{log.latency_ms}ms</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-100 line-clamp-2">
                    {log.message || '(sin mensaje)'}
                  </p>
                </div>
                <span className="text-slate-400">{expandedId === i ? '▼' : '▶'}</span>
              </div>

              {expandedId === i && (
                <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Pregunta:</p>
                    <p className="text-sm text-slate-200 bg-slate-900 p-2 rounded mt-1">
                      {log.message || '(sin mensaje)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Respuesta:</p>
                    <p className="text-sm text-slate-200 bg-slate-900 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                      {log.reply || '(sin respuesta)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-400 flex gap-4">
        <p>Total registros: {logs.length}</p>
        <button
          onClick={fetchAuditLogs}
          className="text-blue-400 hover:text-blue-300"
        >
          🔄 Actualizar
        </button>
      </div>
    </div>
  );
}
