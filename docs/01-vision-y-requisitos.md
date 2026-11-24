# 01. Visión y Requisitos — Presidencia Apocalíptica

## 1. Concepto General

**Presidencia Apocalíptica** es una aplicación web interactiva que combina una interfaz moderna en **React** con una escena 3D en tiempo real renderizada mediante **Three.js**, respaldada por una API en **Node.js**.

El usuario asume el rol de liderazgo en un escenario post-apocalíptico: la escena 3D representa el entorno principal (por ejemplo, una sala de mando, un mapa táctico o un escritorio presidencial en ruinas) mientras que la interfaz HTML/CSS/React superpuesta (HUD) permite tomar decisiones, consultar indicadores y guardar el progreso en el servidor.

## 2. Objetivos del Proyecto

- **Experiencia visual inmersiva:** Integrar un canvas WebGL de Three.js fluido y responsivo dentro de una aplicación React.
- **Interfaz clara sobre el 3D:** Construir un HUD con HTML5 y CSS3 que muestre métricas, alertas y controles sin obstruir la escena.
- **Arquitectura desacoplada:** Separar el cliente (React + Three.js) del servidor (Node.js + Express) mediante una API REST en JSON.
- **Código modular y mantenible:** Aplicar buenas prácticas en JavaScript moderno (ES6+), separación de componentes y control de recursos 3D.

## 3. Requisitos Funcionales (RF)

- **RF-01 — Escena 3D interactiva:** Renderizar un entorno 3D con cámara controlable (órbita/zoom limitado), luces, sombras y objetos interactivos mediante raycasting.
- **RF-02 — Panel de control (HUD):** Mostrar estado general (recursos, estabilidad, población, energía o métricas definidas), historial de eventos y acciones disponibles.
- **RF-03 — Toma de decisiones:** Permitir al usuario ejecutar acciones o responder a eventos desde la UI o haciendo clic en elementos 3D, actualizando el estado de la aplicación.
- **RF-04 — Comunicación con el servidor:** Consultar datos iniciales, enviar decisiones y guardar/cargar el estado de la partida o sesión mediante endpoints en Node.js.
- **RF-05 — Diseño responsivo:** Adaptar la interfaz CSS y el tamaño del canvas de Three.js ante cambios de resolución o redimensionamiento de ventana.

## 4. Requisitos No Funcionales (RNF)

- **RNF-01 — Rendimiento:** Mantener una tasa estable cercana a 60 FPS en equipos estándar, limpiando geometrías, materiales y texturas al desmontar componentes.
- **RNF-02 — Compatibilidad:** Funcionar en navegadores actuales (Chrome, Edge, Firefox, Safari) con soporte WebGL2/WebGL1.
- **RNF-03 — Seguridad básica:** Configurar CORS adecuadamente en Node.js y validar entradas en los endpoints de la API.
- **RNF-04 — Escalabilidad:** Estructura de carpetas preparada para añadir nuevas escenas, modelos `.glb/.gltf` y rutas de API.
