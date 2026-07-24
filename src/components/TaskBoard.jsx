import { useState, useEffect } from 'react';

const JARVIS_API = import.meta.env.VITE_JARVIS_URL || 'http://localhost:3000';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('active'); // active, completed, all

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${JARVIS_API}/api/tasks`);
      const data = await res.json();
      setTasks(data || []);
    } catch (e) {
      console.error('Error fetching tasks:', e);
      setTasks([]);
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
        await fetchTasks();
      }
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`${JARVIS_API}/api/tasks/${taskId}/complete`, { method: 'POST' });
      await fetchTasks();
    } catch (e) {
      console.error('Error completing task:', e);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completada;
    if (filter === 'completed') return task.completada;
    return true;
  });

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">Tareas</h2>

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

      <div className="flex gap-2 mb-4">
        {['active', 'completed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-semibold ${
              filter === f
                ? 'bg-amber-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {f === 'active' ? 'Activas' : f === 'completed' ? 'Completadas' : 'Todas'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-slate-400">No hay tareas</p>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-slate-700 rounded border border-slate-600 hover:border-amber-400 transition"
            >
              <input
                type="checkbox"
                checked={task.completada}
                onChange={() => handleCompleteTask(task.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div className="flex-1 text-left">
                <p className={task.completada ? 'line-through text-slate-500' : ''}>
                  {task.titulo}
                </p>
                <p className="text-sm text-slate-400">{task.fecha_vencimiento}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
