import { useState, useEffect } from 'react';

const JARVIS_API = import.meta.env.VITE_JARVIS_URL || 'http://localhost:3000';

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState({
    urgent_important: [],
    not_urgent_important: [],
    urgent_not_important: [],
    not_urgent_not_important: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${JARVIS_API}/api/tasks`);
      const data = await res.json();

      // Filtrar y clasificar tareas por cuadrante
      const classified = {
        urgent_important: [],
        not_urgent_important: [],
        urgent_not_important: [],
        not_urgent_not_important: [],
      };

      (data || []).forEach(task => {
        if (!task.completada) {
          const isUrgent = new Date(task.fecha_vencimiento) < new Date(Date.now() + 24 * 60 * 60 * 1000);
          const isImportant = task.prioridad === 'alta' || task.etiquetas?.includes('objetivo');

          if (isUrgent && isImportant) classified.urgent_important.push(task);
          else if (!isUrgent && isImportant) classified.not_urgent_important.push(task);
          else if (isUrgent && !isImportant) classified.urgent_not_important.push(task);
          else classified.not_urgent_not_important.push(task);
        }
      });

      setTasks(classified);
    } catch (e) {
      console.error('Error fetching tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  const Quadrant = ({ title, tasks, color }) => (
    <div className={`border-2 rounded-lg p-4 ${color}`}>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-700 bg-opacity-50 p-2 rounded text-sm">
            {task.titulo}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-slate-400 text-sm">Sin tareas</p>}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">Matriz Eisenhower</h2>

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Quadrant
            title="Urgente + Importante"
            tasks={tasks.urgent_important}
            color="border-red-500 bg-red-900 bg-opacity-20"
          />
          <Quadrant
            title="No Urgente + Importante"
            tasks={tasks.not_urgent_important}
            color="border-green-500 bg-green-900 bg-opacity-20"
          />
          <Quadrant
            title="Urgente + No Importante"
            tasks={tasks.urgent_not_important}
            color="border-yellow-500 bg-yellow-900 bg-opacity-20"
          />
          <Quadrant
            title="No Urgente + No Importante"
            tasks={tasks.not_urgent_not_important}
            color="border-blue-500 bg-blue-900 bg-opacity-20"
          />
        </div>
      )}
    </div>
  );
}
