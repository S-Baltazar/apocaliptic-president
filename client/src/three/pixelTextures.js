import * as THREE from 'three';

function createCanvas(size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx, size };
}

function toPixelTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Ruido determinista simple para texturas pixel art
function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function createCityTextures() {
  // 1. Asfalto agrietado con maleza y marcas viales
  const asphalt = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#2b2d33';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        const r = hash(x, y);
        if (r > 0.86) {
          ctx.fillStyle = '#383b42';
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.12) {
          ctx.fillStyle = '#1d1f24';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    // Grietas y pasto creciendo
    ctx.fillStyle = '#15161a';
    ctx.fillRect(10, 14, 18, 2);
    ctx.fillRect(28, 16, 10, 2);
    ctx.fillRect(42, 42, 14, 2);
    ctx.fillStyle = '#4a6b3b';
    ctx.fillRect(14, 14, 4, 2);
    ctx.fillRect(46, 42, 4, 2);
    // Línea amarilla/blanca gastada
    ctx.fillStyle = '#a89f68';
    ctx.fillRect(30, 4, 4, 14);
    ctx.fillRect(30, 36, 4, 14);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 2. Adoquines de San Telmo / Plaza de Mayo
  const cobblestone = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#3d3c3a';
    ctx.fillRect(0, 0, size, size);
    for (let row = 0; row < 8; row += 1) {
      const offset = (row % 2) * 4;
      for (let col = 0; col < 8; col += 1) {
        const r = hash(col + row * 8, row);
        ctx.fillStyle = r > 0.6 ? '#6b6861' : r > 0.25 ? '#57544f' : '#4a4742';
        ctx.fillRect((col * 8 + offset) % 64, row * 8 + 1, 6, 6);
        if (r > 0.88) {
          ctx.fillStyle = '#4a6b3b';
          ctx.fillRect((col * 8 + offset) % 64, row * 8 + 6, 3, 2);
        }
      }
    }
    return toPixelTexture(canvas, 4, 4);
  })();

  // 3. Agua contaminada de Puerto Madero
  const dirtyWater = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#4f6336';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        const r = hash(x * 0.5, y * 0.5);
        if (r > 0.85) {
          ctx.fillStyle = '#627842';
          ctx.fillRect(x, y, 4, 2);
        } else if (r < 0.08) {
          ctx.fillStyle = '#252926'; // mancha de petróleo
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    return toPixelTexture(canvas, 3, 12);
  })();

  // 4. Ladrillo rojo desgastado (Puerto Madero / Abasto / Retiro)
  const redBrick = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#4a3531';
    ctx.fillRect(0, 0, size, size);
    for (let row = 0; row < 8; row += 1) {
      const off = (row % 2) * 4;
      for (let col = 0; col < 8; col += 1) {
        const r = hash(col, row);
        ctx.fillStyle = r > 0.7 ? '#8c4c3e' : r > 0.3 ? '#753c30' : '#572d25';
        ctx.fillRect((col * 8 + off) % 64, row * 8 + 1, 7, 6);
      }
    }
    // Humedad / hollín
    ctx.fillStyle = 'rgba(20, 22, 20, 0.35)';
    ctx.fillRect(0, 48, 64, 16);
    return toPixelTexture(canvas, 2, 2);
  })();

  // 5. Fachada Casa Rosada (rosa viejo con ventanas rotas y tablones)
  const casaRosadaFacade = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#c88b8b';
    ctx.fillRect(0, 0, size, size);
    // Molduras horizontales
    ctx.fillStyle = '#dfb0b0';
    ctx.fillRect(0, 0, 64, 4);
    ctx.fillRect(0, 30, 64, 3);
    ctx.fillStyle = '#9e6868';
    ctx.fillRect(0, 58, 64, 6);
    // Ventanas arqueadas (2 filas x 3 columnas)
    [8, 26, 44].forEach((wx) => {
      [8, 38].forEach((wy, rowIdx) => {
        ctx.fillStyle = '#1b1d24';
        ctx.fillRect(wx, wy, 10, 16);
        ctx.fillStyle = '#dfb0b0';
        ctx.fillRect(wx - 1, wy - 2, 12, 2);
        // Tablones de madera en algunas ventanas
        if ((wx + rowIdx) % 2 === 0) {
          ctx.fillStyle = '#785032';
          ctx.fillRect(wx - 1, wy + 5, 12, 3);
          ctx.fillRect(wx - 1, wy + 11, 12, 2);
        }
      });
    });
    // Enredaderas
    ctx.fillStyle = '#4a6b3b';
    ctx.fillRect(2, 12, 5, 22);
    ctx.fillRect(54, 34, 6, 20);
    return toPixelTexture(canvas, 2, 1);
  })();

  // 6. Piedra neoclásica (Congreso / Teatro Colón / Facultad de Derecho)
  const limestoneFacade = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#b8b2a0';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 8) {
      ctx.fillStyle = '#9e9887';
      ctx.fillRect(0, y, size, 1);
    }
    // Ventanas oscuras rotas y columnas
    [6, 24, 42].forEach((wx) => {
      ctx.fillStyle = '#1d1f26';
      ctx.fillRect(wx, 10, 12, 18);
      ctx.fillRect(wx, 38, 12, 18);
      ctx.fillStyle = '#d4ceb8';
      ctx.fillRect(wx - 3, 6, 3, 52);
    });
    // Grietas y musgo
    ctx.fillStyle = '#4e5248';
    ctx.fillRect(18, 20, 2, 14);
    ctx.fillStyle = '#4e6e3d';
    ctx.fillRect(48, 28, 8, 12);
    return toPixelTexture(canvas, 2, 1);
  })();

  // 7. Cúpula de cobre oxidado (Congreso / Teatro Colón)
  const oxidizedCopper = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#4e856d';
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 8) {
      ctx.fillStyle = '#386350';
      ctx.fillRect(x, 0, 2, size);
    }
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        if (hash(x, y) > 0.85) {
          ctx.fillStyle = '#6da38b';
          ctx.fillRect(x, y, 2, 2);
        } else if (hash(x, y) < 0.08) {
          ctx.fillStyle = '#6e4736'; // óxido
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    return toPixelTexture(canvas, 2, 1);
  })();

  // 8. Edificio urbano destruido (hormigón agrietado, ventanas rotas, hollín)
  const ruinedConcrete = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#5c5e63';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 16) {
      ctx.fillStyle = '#47494e';
      ctx.fillRect(0, y, size, 2);
      for (let x = 4; x < size; x += 14) {
        const r = hash(x, y);
        ctx.fillStyle = r > 0.7 ? '#3d4852' : '#181a20';
        ctx.fillRect(x, y + 4, 9, 9);
        if (r < 0.25) {
          // Ladrillo expuesto
          ctx.fillStyle = '#7c4338';
          ctx.fillRect(x + 9, y + 6, 4, 6);
        }
      }
    }
    ctx.fillStyle = '#436436';
    ctx.fillRect(2, 20, 6, 26);
    ctx.fillRect(50, 8, 8, 18);
    return toPixelTexture(canvas, 1, 2);
  })();

  // 9. Torre moderna dañada (vidrio azulado oscuro + paneles rotos)
  const brokenGlassTower = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#2d3b4e';
    ctx.fillRect(0, 0, size, size);
    for (let y = 2; y < size; y += 8) {
      for (let x = 2; x < size; x += 8) {
        const r = hash(x, y);
        ctx.fillStyle = r > 0.78 ? '#151921' : r > 0.4 ? '#425b78' : '#2f435c';
        ctx.fillRect(x, y, 6, 6);
      }
    }
    return toPixelTexture(canvas, 1, 3);
  })();

  // 10. Césped / parque descuidado
  const overgrownGrass = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#405434';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        const r = hash(x, y);
        if (r > 0.8) {
          ctx.fillStyle = '#536e42';
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.14) {
          ctx.fillStyle = '#5e5341'; // tierra
          ctx.fillRect(x, y, 4, 2);
        }
      }
    }
    return toPixelTexture(canvas, 6, 6);
  })();

  // 11. Vías de tren oxidadas
  const trainTrack = (() => {
    const { canvas, ctx, size } = createCanvas(64);
    ctx.fillStyle = '#4a4640';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 8) {
      ctx.fillStyle = '#5c402c'; // durmientes
      ctx.fillRect(8, y, 48, 4);
    }
    ctx.fillStyle = '#8b4c32'; // rieles oxidados
    ctx.fillRect(16, 0, 4, size);
    ctx.fillRect(44, 0, 4, size);
    return toPixelTexture(canvas, 1, 10);
  })();

  return {
    asphalt,
    cobblestone,
    dirtyWater,
    redBrick,
    casaRosadaFacade,
    limestoneFacade,
    oxidizedCopper,
    ruinedConcrete,
    brokenGlassTower,
    overgrownGrass,
    trainTrack,
  };
}
