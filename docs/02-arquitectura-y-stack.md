# 02. Arquitectura y Stack Tecnológico

## 1. Diagrama General

```text
+-------------------------------------------------------+
|                  NAVEGADOR (Cliente)                  |
|                                                       |
|  +-----------------------+  +----------------------+  |
|  |   React + HTML/CSS    |  |      Three.js        |  |
|  |  - HUD / Menús        |<>|  - Scene / Camera    |  |
|  |  - Estado de UI       |  |  - WebGLRenderer     |  |
|  |  - Fetch API          |  |  - Luces / Modelos   |  |
|  +-----------+-----------+  +----------------------+  |
|              |                                        |
+--------------|----------------------------------------+
               | HTTP / JSON (REST API)
               v
+-------------------------------------------------------+
|                SERVIDOR (Node.js)                     |
|                                                       |
|  +-------------------------------------------------+  |
|  |  Express.js                                     |  |
|  |  - Middlewares (cors, express.json)             |  |
|  |  - Rutas (/api/health, /api/state, /api/action) |  |
|  |  - Controladores y lógica de negocio            |  |
|  +-----------------------+-------------------------+  |
|                          |                            |
|                          v                            |
|  +-------------------------------------------------+  |
|  |  Persistencia (JSON local / SQLite / DB futura) |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

## 2. Rol de Cada Tecnología

### HTML5
- Punto de entrada único (`index.html`) con `<div id="root"></div>`.
- Metadatos, título de la aplicación, fuentes externas e importación del módulo principal de JavaScript.

### CSS3
- Hojas de estilo modulares (`global.css`, variables CSS para paleta apocalíptica, tipografía y espaciados).
- Posicionamiento por capas: el canvas 3D ocupa `100vw x 100vh` en el fondo (`z-index: 0`), mientras el HUD de React se superpone (`z-index: 10`) con `pointer-events` controlados para no bloquear la interacción 3D.

### JavaScript (ES6+)
- Módulos ES (`import` / `export`), `async/await` para peticiones HTTP y manejo de eventos del DOM/WebGL.

### React
- Gestión del ciclo de vida de la interfaz y estado global (Context API o estado en componente raíz).
- Integración de Three.js mediante `useRef` (contenedor del canvas) y `useEffect` (inicialización, bucle de animación `requestAnimationFrame`, resize y limpieza `dispose()`).

### Three.js
- `THREE.Scene`: Contenedor de objetos 3D, niebla atmosférica (`FogExp2`) y fondo.
- `THREE.PerspectiveCamera`: Cámara principal con `OrbitControls` (opcional con límites de ángulo y zoom).
- `THREE.WebGLRenderer`: Renderizado con `antialias: true` y soporte de sombras (`shadowMap`).
- `THREE.Raycaster`: Detección de clics o hover sobre objetos 3D interactivos.

### Node.js + Express
- Servidor backend ligero que expone la API REST en el puerto `3001` (configurable por `.env`).
- Endpoints iniciales sugeridos:
  - `GET /api/health` — Verificación de estado del servidor.
  - `GET /api/estado` — Devuelve el estado actual (recursos, día/turno, eventos activos).
  - `POST /api/decision` — Recibe una decisión del usuario, calcula el impacto y devuelve el nuevo estado.
  - `POST /api/reiniciar` — Restablece la simulación a los valores iniciales.
