# 03. Estructura del Proyecto

Se recomienda una arquitectura **monorepo simple** dividida en dos carpetas principales: `client/` (frontend) y `server/` (backend).

## Árbol de Directorios Recomendado

```text
presidencia-apocaliptica/
├── README.md
├── docs/
│   ├── 01-vision-y-requisitos.md
│   ├── 02-arquitectura-y-stack.md
│   ├── 03-estructura-del-proyecto.md
│   └── 04-plan-de-desarrollo.md
│
├── client/                         # Frontend (Vite + React + Three.js)
│   ├── index.html                  # HTML5 base
│   ├── package.json
│   ├── vite.config.js              # Proxy opcional hacia /api -> localhost:3001
│   ├── public/
│   │   └── models/                 # Modelos 3D (.glb/.gltf) y texturas
│   └── src/
│       ├── main.jsx                # Punto de entrada React
│       ├── App.jsx                 # Componente raíz (HUD + Escena 3D)
│       ├── styles/
│       │   ├── variables.css       # Paleta de colores, fuentes y tamaños
│       │   └── global.css          # Estilos base y layout de capas
│       ├── components/
│       │   ├── Scene3D.jsx         # Canvas y ciclo de vida de Three.js
│       │   ├── HudPanel.jsx        # Panel de indicadores y métricas
│       │   └── DecisionModal.jsx   # Ventana de eventos y toma de decisiones
│       ├── three/
│       │   ├── createScene.js      # Configuración de escena, cámara, luces y niebla
│       │   ├── objects.js          # Creación/carga de mallas y modelos 3D
│       │   └── interactions.js     # Raycaster para hover y clics en objetos 3D
│       └── services/
│           └── api.js              # Funciones fetch() hacia el backend Node.js
│
└── server/                         # Backend (Node.js + Express)
    ├── package.json
    ├── .env.example                # PORT=3001, CORS_ORIGIN=http://localhost:5173
    └── src/
        ├── index.js                # Arranque del servidor Express
        ├── routes/
        │   └── gameRoutes.js       # Definición de rutas /api/*
        ├── controllers/
        │   └── gameController.js   # Lógica de respuestas y validaciones
        └── data/
            └── initialState.js     # Estado inicial y catálogo de eventos
```

## Convenciones de Código

- **Componentes React:** `PascalCase.jsx` (`Scene3D.jsx`, `HudPanel.jsx`).
- **Módulos JS y utilidades:** `camelCase.js` (`createScene.js`, `api.js`).
- **CSS:** `kebab-case` para clases y variables (`--color-accent`, `.hud-container`).
- **Limpieza en Three.js:** Toda instancia de `WebGLRenderer`, geometría o material creada en `useEffect` debe liberarse en la función de retorno (`cleanup`) para evitar fugas de memoria durante el desarrollo con Hot Reload.
