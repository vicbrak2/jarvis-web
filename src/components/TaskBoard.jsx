import { useState, useEffect } from 'react';

const JARVIS_API = import.meta.env.VITE_JARVIS_URL || 'http://localhost:3000';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${JARVIS_API}/api/tasks`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) {
      console.error('Error fetching tasks:', e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    if (!searchQuery.trim()) {
      await fetchTasks();
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        limit: 100,
      });
      const res = await fetch(`${JARVIS_API}/api/tasks/search?${params}`);
      const data = await res.json();
      setTasks(data.results || []);
    } catch (e) {
      console.error('Error searching:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`${JARVIS_API}/api/tasks/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          due_date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setNewTaskTitle('');
        setSearchQuery('');
        await fetchTasks();
      }
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`${JARVIS_API}/api/tasks/${taskId}/complete`, { method: 'POST' });
      await handleSearch();
    } catch (e) {
      console.error('Error completing task:', e);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">Tareas</h2>

      {/* Nueva tarea */}
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded"
        >
          Agregar
        </button>
      </form>

      {/* Búsqueda */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar tareas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
        >
          Buscar
        </button>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              fetchTasks();
            }}
            className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded"
          >
            ✕
          </button>
        )}
      </form>

      {/* Filtros */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSearchQuery('');
            }}
            className="w-full bg-slate-700 text-slate-100 rounded px-2 py-1 text-sm"
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Prioridad</label>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setSearchQuery('');
            }}
            className="w-full bg-slate-700 text-slate-100 rounded px-2 py-1 text-sm"
          >
            <option value="all">Todas</option>
            <option value="q1">Q1 (Urgente+Importante)</option>
            <option value="q2">Q2 (Importante)</option>
            <option value="q3">Q3 (Urgente)</option>
            <option value="q4">Q4 (Otra)</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-400">No hay tareas</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 bg-slate-700 rounded border border-slate-600 hover:border-amber-400 transition"
            >
              <input
                type="checkbox"
                checked={task.done || false}
                onChange={() => handleCompleteTask(task.id)}
                className="w-4 h-4 cursor-pointer mt-1"
              />
              <div className="flex-1 text-left">
                <p className={task.done ? 'line-through text-slate-500' : 'text-slate-100'}>
                  {task.text || task.title}
                </p>
                <div className="flex gap-2 mt-1">
                  {task.quadrante && (
                    <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">
                      {task.quadrante}
                    </span>
                  )}
                  <p className="text-xs text-slate-400">{task.fecha_vencimiento}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
