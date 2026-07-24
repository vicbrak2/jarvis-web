# Jarvis Web UI

Interfaz web moderna para **Jarvis FOCUS OS** — panel integrado de task management, Eisenhower matrix, chat con Brain Server, y calendario.

## Stack

- **React 18** + **Vite** (hot reload)
- **Tailwind CSS** para estilos
- **Fetch API** para HTTP (sin dependencias)

## Componentes

- **TaskBoard**: lista de tareas (crear, completar, filtrar)
- **EisenhowerMatrix**: matriz de urgencia/importancia en 4 cuadrantes
- **ChatPanel**: chat en vivo con agentes de Brain Server
- **Calendar**: próximos eventos (Google Calendar)

## Desarrollo Local

```bash
cd jarvis-web
npm install
npm run dev
```

Abre http://localhost:3001 en el navegador.

### Variables de entorno

`.env.local`:
```
VITE_JARVIS_URL=http://localhost:3000
VITE_BRAIN_URL=http://localhost:8888
```

## Build para Producción

```bash
npm run build
npm run preview
```

Genera `dist/` listo para deploy.

## Deploy en Railway

1. Conectar repo GitHub
2. Configurar environment:
   ```
   VITE_JARVIS_URL=https://jarvis-api.railway.app
   VITE_BRAIN_URL=https://qamiluna-brain.railway.app
   ```
3. Port: `3001`
4. Build: `npm run build`
5. Start: `npm run preview`

## Arquitectura

```
Jarvis Web (React, 3001)
    ↓ HTTP
Jarvis Backend (FastAPI, 3000)
    ↓ HTTP
Brain Server (FastAPI, 8888)
    ↓ HTTP
Google Sheets + LLM providers
```

## Mejoras Futuras

- [ ] Búsqueda full-text de tareas
- [ ] Auditoría de interacciones con Brain
- [ ] Integración Google Calendar (sincronización bidireccional)
- [ ] Notificaciones push
- [ ] Dark/light theme toggle
- [ ] Exportar tareas a PDF

## Licencia

Jarvis FOCUS OS
