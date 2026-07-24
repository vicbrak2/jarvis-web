import TaskBoard from './components/TaskBoard';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import ChatPanel from './components/ChatPanel';
import Calendar from './components/Calendar';
import AuditLog from './components/AuditLog';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Jarvis FOCUS OS</h1>
          <p className="text-slate-400">Panel de control integrado</p>
        </header>

        {/* Layout: 3 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna 1: TaskBoard */}
          <div className="lg:col-span-1">
            <TaskBoard />
          </div>

          {/* Columna 2: Eisenhower + Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <EisenhowerMatrix />
            <Calendar />
          </div>
        </div>

        {/* Chat Panel + Audit Log: Full Width */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChatPanel />
          <AuditLog />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>v1.0 | Brain Server + Jarvis Backend</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
// Deploy: Fri Jul 24 17:43:45 HSP 2026
