import React from 'react';

// Mapas de píxeles 12x12 para retratos estilo Pixel Art
const PORTRAITS = {
  tecnocrata: {
    bg: '#16243b',
    palette: {
      H: '#94a3b8', // pelo gris
      S: '#e2b49a', // piel
      G: '#38bdf8', // visor cian
      D: '#0f172a', // contorno
      C: '#1d4ed8', // traje azul
      T: '#e2e8f0', // camisa
    },
    grid: [
      '....HHHH....',
      '...HHHHHH...',
      '..HHSSSSHH..',
      '..HGGGGGGH..',
      '..HSSSSSSH..',
      '...SSDDSS...',
      '...SSSSSS...',
      '..CCCTTTCC..',
      '.CCCCTTTCCC.',
      '.CCCCCCCCCC.',
      '.CCCCCCCCCC.',
      '............',
    ],
  },
  reformista: {
    bg: '#2c1824',
    palette: {
      H: '#3b1d14', // pelo oscuro
      S: '#d99b78', // piel
      E: '#1e293b', // lentes/ojos
      D: '#7f1d1d', // boca/detalle
      C: '#dc2626', // saco rojo
      T: '#fef3c7', // blusa
    },
    grid: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HSEEESSH..',
      '..HSSSSSSH..',
      '...SSDDSS...',
      '..HHSSSSHH..',
      '..CCCTTTCC..',
      '.CCCCTTTCCC.',
      '.CCCCCCCCCC.',
      '.CCCCCCCCCC.',
      '............',
    ],
  },
  estratega: {
    bg: '#1c2419',
    palette: {
      H: '#3f4d2b', // boina/casco oliva
      B: '#f59e0b', // insignia
      S: '#cfa082', // piel
      E: '#0f172a', // ojos
      D: '#7c2d12', // cicatriz/boca
      C: '#365314', // uniforme
    },
    grid: [
      '..HHHHHHHH..',
      '.HHHHBHHHHH.',
      '..SSSSSSSS..',
      '..SEESSESS..',
      '..SSSSDSSS..',
      '...SSDDSS...',
      '...SSSSSS..',
      '..CCCCCCCC..',
      '.CCCCCCCCCC.',
      '.CCCCBBCCCC.',
      '.CCCCCCCCCC.',
      '............',
    ],
  },
  economista: {
    bg: '#132a23',
    palette: {
      H: '#1e1b4b', // pelo
      S: '#f1c2a5', // piel
      G: '#fbbf24', // lentes dorados
      E: '#0f172a', // ojos
      C: '#047857', // traje esmeralda
      T: '#f8fafc', // camisa
    },
    grid: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HSGEESGH..',
      '..HSSSSSSH..',
      '...SSEESS...',
      '...SSSSSS...',
      '..CCCTTTCC..',
      '.CCCCTTTCCC.',
      '.CCCCCCCCCC.',
      '.CCCCCCCCCC.',
      '............',
    ],
  },
  secretaria: {
    bg: '#1c2538',
    palette: {
      H: '#78350f', // pelo castaño
      S: '#f1c2a5', // piel
      E: '#0f172a', // ojos
      M: '#38bdf8', // auricular/micrófono
      C: '#334155', // traje ejecutivo
      T: '#f8fafc', // camisa
    },
    grid: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '.MHHSSSSHH..',
      '.MHSEESSESH.',
      '..MMSSSSSH..',
      '...SSEESS...',
      '...SSSSSS...',
      '..CCCTTTCC..',
      '.CCCCTTTCCC.',
      '.CCCCCCCCCC.',
      '.CCCCCCCCCC.',
      '............',
    ],
  },
};

export default function PixelPortrait({ id, size = 64 }) {
  const data = PORTRAITS[id] || PORTRAITS.tecnocrata;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      style={{
        backgroundColor: data.bg,
        border: '3px solid #07080d',
        boxShadow: 'inset 0 0 0 2px #4b5575',
        flexShrink: 0,
      }}
      aria-label={`Retrato pixel art de ${id}`}
    >
      {data.grid.map((row, y) =>
        row.split('').map((cell, x) => {
          const color = data.palette[cell];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        })
      )}
    </svg>
  );
}
