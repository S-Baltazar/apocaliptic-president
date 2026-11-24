# 04. Plan de Desarrollo (Roadmap)

Este plan divide la construcción del proyecto en **5 fases incrementales** para validar cada capa de tecnología de forma ordenada.

---

## Fase 1: Inicialización del Entorno
- [ ] Inicializar `server/` con `npm init -y` e instalar `express`, `cors`, `dotenv` y `nodemon` (dev).
- [ ] Inicializar `client/` con Vite (`npm create vite@latest client -- --template react`).
- [ ] Instalar `three` en `client/`.
- [ ] Configurar proxy en `vite.config.js` para redirigir `/api` al puerto del servidor Node.js.

## Fase 2: Backend Base con Node.js
- [ ] Crear servidor Express en `server/src/index.js` con soporte JSON y CORS.
- [ ] Implementar endpoint de prueba `GET /api/health`.
- [ ] Definir el estado inicial de la simulación en `initialState.js`.
- [ ] Crear `GET /api/estado`, `POST /api/decision` y `POST /api/reiniciar`.
- [ ] Probar los endpoints con `curl`, Postman o Thunder Client.

## Fase 3: Interfaz Base (HTML5 + CSS3 + React)
- [ ] Definir paleta de colores y tipografía en `variables.css` y `global.css`.
- [ ] Construir `HudPanel.jsx` para mostrar métricas y barra de estado.
- [ ] Construir `DecisionModal.jsx` para presentar eventos y opciones al usuario.
- [ ] Conectar `services/api.js` con el backend para cargar y actualizar el estado real.

## Fase 4: Escena 3D con Three.js
- [ ] Crear `Scene3D.jsx` montando `WebGLRenderer` en un `useRef`.
- [ ] Configurar `PerspectiveCamera`, iluminación ambiental/direccional y niebla atmosférica.
- [ ] Añadir geometrías iniciales (mesa de mando, mapa holográfico, luces de emergencia) o cargar modelos `.glb`.
- [ ] Implementar `OrbitControls` con límites suaves y manejador de evento `resize`.
- [ ] Implementar `Raycaster` para resaltar y hacer clic en objetos 3D que disparen acciones en React.

## Fase 5: Pulido, Pruebas y Despliegue
- [ ] Verificar que no existan fugas de memoria WebGL al desmontar/remontar componentes.
- [ ] Ajustar diseño responsivo para escritorio y pantallas medianas/pequeñas.
- [ ] Generar build de producción del frontend (`npm run build`).
- [ ] Configurar Node.js para servir los archivos estáticos de `client/dist` o desplegar frontend y backend por separado.
