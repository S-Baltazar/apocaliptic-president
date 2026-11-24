# Presidencia Apocalíptica

Documentación base del proyecto web interactivo desarrollado con **HTML5**, **CSS3**, **JavaScript (ES6+)**, **React**, **Three.js** y **Node.js**.

## Stack Tecnológico

| Capa | Tecnología | Uso principal |
| :--- | :--- | :--- |
| **Estructura y Estilos** | HTML5 + CSS3 | Maquetación semántica, variables CSS, layout responsivo y estilos de HUD/interfaz |
| **Lenguaje** | JavaScript (ES6+) | Lógica de aplicación en cliente y servidor |
| **Frontend UI** | React (Vite) | Gestión de estado, componentes de interfaz y enrutamiento |
| **Gráficos 3D** | Three.js | Escena 3D interactiva, iluminación, cámara, modelos y efectos visuales |
| **Backend / API** | Node.js + Express | Servidor HTTP, endpoints REST, persistencia de datos y lógica de negocio |

## Documentación del Proyecto

1. [Visión y Requisitos](docs/01-vision-y-requisitos.md) — Concepto del proyecto, objetivos, requisitos funcionales y no funcionales.
2. [Arquitectura y Stack](docs/02-arquitectura-y-stack.md) — Diseño cliente-servidor, comunicación API REST y rol de cada tecnología.
3. [Estructura del Proyecto](docs/03-estructura-del-proyecto.md) — Organización de carpetas para `client/` y `server/`, y convenciones.
4. [Plan de Desarrollo](docs/04-plan-de-desarrollo.md) — Hoja de ruta por fases y lista de tareas para construir la aplicación.

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior (o `pnpm` / `yarn`)
- Navegador moderno con soporte para **WebGL**

## Inicio Rápido (cuando se inicialice el código)

```bash
# 1. Instalar dependencias del servidor
cd server
npm install

# 2. Instalar dependencias del cliente
cd ../client
npm install

# 3. Ejecutar en desarrollo (en terminales separadas)
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```
