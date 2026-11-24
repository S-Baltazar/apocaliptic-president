import * as THREE from 'three';

function createCanvas(width = 64, height = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx, width, height };
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

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function createCityTextures() {
  // 1. Asfalto agrietado con maleza y líneas viales
  const asphalt = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#2b2d33';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const r = hash(x, y);
        if (r > 0.85) {
          ctx.fillStyle = '#383b42';
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.12) {
          ctx.fillStyle = '#1d1f24';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    ctx.fillStyle = '#15161a';
    ctx.fillRect(10, 14, 18, 2);
    ctx.fillRect(28, 16, 10, 2);
    ctx.fillRect(42, 42, 14, 2);
    ctx.fillStyle = '#4a6b3b';
    ctx.fillRect(14, 14, 4, 2);
    ctx.fillRect(46, 42, 4, 2);
    ctx.fillStyle = '#a89f68';
    ctx.fillRect(30, 4, 4, 14);
    ctx.fillRect(30, 36, 4, 14);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 2. Adoquines con musgo
  const cobblestone = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#3d3c3a';
    ctx.fillRect(0, 0, width, height);
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
    return toPixelTexture(canvas, 8, 8);
  })();

  // 3. Agua contaminada de Puerto Madero
  const dirtyWater = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#4f6336';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const r = hash(x * 0.5, y * 0.5);
        if (r > 0.85) {
          ctx.fillStyle = '#627842';
          ctx.fillRect(x, y, 4, 2);
        } else if (r < 0.08) {
          ctx.fillStyle = '#252926';
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    return toPixelTexture(canvas, 4, 16);
  })();

  // 4. Ladrillo rojo desgastado
  const redBrick = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#4a3531';
    ctx.fillRect(0, 0, width, height);
    for (let row = 0; row < 8; row += 1) {
      const off = (row % 2) * 4;
      for (let col = 0; col < 8; col += 1) {
        const r = hash(col, row);
        ctx.fillStyle = r > 0.7 ? '#8c4c3e' : r > 0.3 ? '#753c30' : '#572d25';
        ctx.fillRect((col * 8 + off) % 64, row * 8 + 1, 7, 6);
      }
    }
    ctx.fillStyle = 'rgba(20, 22, 20, 0.35)';
    ctx.fillRect(0, 48, 64, 16);
    return toPixelTexture(canvas, 2, 2);
  })();

  // 5. Fachada Casa Rosada
  const casaRosadaFacade = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#c88b8b';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#dfb0b0';
    ctx.fillRect(0, 0, 64, 4);
    ctx.fillRect(0, 30, 64, 3);
    ctx.fillStyle = '#9e6868';
    ctx.fillRect(0, 58, 64, 6);
    [8, 26, 44].forEach((wx) => {
      [8, 38].forEach((wy, rowIdx) => {
        ctx.fillStyle = '#1b1d24';
        ctx.fillRect(wx, wy, 10, 16);
        ctx.fillStyle = '#dfb0b0';
        ctx.fillRect(wx - 1, wy - 2, 12, 2);
        if ((wx + rowIdx) % 2 === 0) {
          ctx.fillStyle = '#785032';
          ctx.fillRect(wx - 1, wy + 5, 12, 3);
          ctx.fillRect(wx - 1, wy + 11, 12, 2);
        }
      });
    });
    ctx.fillStyle = '#4a6b3b';
    ctx.fillRect(2, 12, 5, 22);
    ctx.fillRect(54, 34, 6, 20);
    return toPixelTexture(canvas, 2, 1);
  })();

  // 6. Piedra neoclásica
  const limestoneFacade = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#b8b2a0';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 8) {
      ctx.fillStyle = '#9e9887';
      ctx.fillRect(0, y, width, 1);
    }
    [6, 24, 42].forEach((wx) => {
      ctx.fillStyle = '#1d1f26';
      ctx.fillRect(wx, 10, 12, 18);
      ctx.fillRect(wx, 38, 12, 18);
      ctx.fillStyle = '#d4ceb8';
      ctx.fillRect(wx - 3, 6, 3, 52);
    });
    ctx.fillStyle = '#4e5248';
    ctx.fillRect(18, 20, 2, 14);
    ctx.fillStyle = '#4e6e3d';
    ctx.fillRect(48, 28, 8, 12);
    return toPixelTexture(canvas, 2, 1);
  })();

  // 7. Cobre oxidado
  const oxidizedCopper = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#4e856d';
    ctx.fillRect(0, 0, width, height);
    for (let x = 0; x < width; x += 8) {
      ctx.fillStyle = '#386350';
      ctx.fillRect(x, 0, 2, height);
    }
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        if (hash(x, y) > 0.85) {
          ctx.fillStyle = '#6da38b';
          ctx.fillRect(x, y, 2, 2);
        } else if (hash(x, y) < 0.08) {
          ctx.fillStyle = '#6e4736';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    return toPixelTexture(canvas, 2, 1);
  })();

  // 8. Edificio urbano destruido
  const ruinedConcrete = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#5c5e63';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 16) {
      ctx.fillStyle = '#47494e';
      ctx.fillRect(0, y, width, 2);
      for (let x = 4; x < width; x += 14) {
        const r = hash(x, y);
        ctx.fillStyle = r > 0.7 ? '#3d4852' : '#181a20';
        ctx.fillRect(x, y + 4, 9, 9);
        if (r < 0.25) {
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

  // 9. Torre moderna de vidrio roto
  const brokenGlassTower = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#2d3b4e';
    ctx.fillRect(0, 0, width, height);
    for (let y = 2; y < height; y += 8) {
      for (let x = 2; x < width; x += 8) {
        const r = hash(x, y);
        ctx.fillStyle = r > 0.78 ? '#151921' : r > 0.4 ? '#425b78' : '#2f435c';
        ctx.fillRect(x, y, 6, 6);
      }
    }
    return toPixelTexture(canvas, 1, 3);
  })();

  // 10. Césped descuidado
  const overgrownGrass = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#405434';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const r = hash(x, y);
        if (r > 0.8) {
          ctx.fillStyle = '#536e42';
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.14) {
          ctx.fillStyle = '#5e5341';
          ctx.fillRect(x, y, 4, 2);
        }
      }
    }
    return toPixelTexture(canvas, 6, 6);
  })();

  // 11. Vías de tren oxidadas
  const trainTrack = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    ctx.fillStyle = '#4a4640';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 8) {
      ctx.fillStyle = '#5c402c';
      ctx.fillRect(8, y, 48, 4);
    }
    ctx.fillStyle = '#8b4c32';
    ctx.fillRect(16, 0, 4, height);
    ctx.fillRect(44, 0, 4, height);
    return toPixelTexture(canvas, 1, 14);
  })();

  // 12. COMISARÍA DESTRUIDA (hormigón gris, cartel POLICIA, ventanas tapiadas, ladrillo roto e hiedra)
  const policeFacade = (() => {
    const { canvas, ctx, width, height } = createCanvas(128, 64);
    ctx.fillStyle = '#8f8d87';
    ctx.fillRect(0, 0, width, height);
    // Ruido de desgaste
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const r = hash(x, y);
        if (r > 0.85) {
          ctx.fillStyle = '#75736e';
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.08) {
          ctx.fillStyle = '#a3a19a';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    // Cartel superior "POLICIA"
    ctx.fillStyle = '#363b42';
    ctx.fillRect(24, 6, 80, 16);
    ctx.strokeStyle = '#181a1f';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 6, 80, 16);
    ctx.fillStyle = '#d8d4c8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POLICIA', 64, 18);

    // Puerta central doble
    ctx.fillStyle = '#252830';
    ctx.fillRect(50, 32, 28, 32);
    ctx.fillStyle = '#575b66';
    ctx.fillRect(52, 34, 11, 28);
    ctx.fillRect(65, 34, 11, 28);
    ctx.fillStyle = '#7c4338'; // óxido en la puerta
    ctx.fillRect(54, 48, 8, 8);

    // Ventana izquierda tapiada con madera
    ctx.fillStyle = '#1c1e24';
    ctx.fillRect(14, 34, 24, 18);
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(12, 36, 28, 4);
    ctx.fillRect(12, 43, 28, 4);
    ctx.fillRect(12, 49, 28, 3);

    // Ventana derecha rota
    ctx.fillStyle = '#1c1e24';
    ctx.fillRect(90, 34, 24, 18);
    ctx.fillStyle = '#4f5d6b';
    ctx.fillRect(92, 36, 8, 8);

    // Ladrillo expuesto arriba a la derecha + hiedra a la izquierda
    ctx.fillStyle = '#7c4338';
    ctx.fillRect(102, 2, 24, 18);
    ctx.fillStyle = '#1d1f24';
    ctx.fillRect(108, 4, 16, 12);
    ctx.fillStyle = '#3f5e34';
    ctx.fillRect(2, 4, 12, 30);
    ctx.fillRect(114, 26, 12, 34);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 13. CUARTEL DE BOMBEROS (ladrillo rojo + portones de autobomba)
  const fireStationFacade = (() => {
    const { canvas, ctx, width, height } = createCanvas(96, 64);
    ctx.fillStyle = '#7a3b30';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#47221c';
    ctx.fillRect(12, 6, 72, 14);
    ctx.fillStyle = '#f5d08a';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BOMBEROS', 48, 17);
    // Dos portones metálicos oxidados
    [10, 52].forEach((gx) => {
      ctx.fillStyle = '#25272d';
      ctx.fillRect(gx, 26, 34, 38);
      for (let gy = 28; gy < 62; gy += 6) {
        ctx.fillStyle = gy % 12 === 0 ? '#992b2b' : '#7a2222';
        ctx.fillRect(gx + 2, gy, 30, 4);
      }
    });
    return toPixelTexture(canvas, 1, 1);
  })();

  // 14. TRIBUNAS DE LA BOMBONERA (3 bandejas: azul / amarillo / azul con escaleras y desgaste)
  const bomboneraStands = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    // Bandeja superior azul
    ctx.fillStyle = '#2b5280';
    ctx.fillRect(0, 0, width, 21);
    // Bandeja media amarilla
    ctx.fillStyle = '#cfa23a';
    ctx.fillRect(0, 21, width, 22);
    // Bandeja inferior azul
    ctx.fillStyle = '#23446b';
    ctx.fillRect(0, 43, width, 21);
    // Filas de gradas
    for (let y = 0; y < height; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(0, y, width, 1);
    }
    // Vomitorios / accesos oscuros y concreto de división
    ctx.fillStyle = '#8b8a82';
    ctx.fillRect(0, 20, width, 2);
    ctx.fillRect(0, 42, width, 2);
    [12, 32, 52].forEach((vx) => {
      ctx.fillStyle = '#1b1d24';
      ctx.fillRect(vx - 3, 8, 6, 8);
      ctx.fillRect(vx - 3, 29, 6, 8);
      ctx.fillRect(vx - 3, 50, 6, 8);
    });
    // Manchas de musgo y roturas
    ctx.fillStyle = '#48663a';
    ctx.fillRect(4, 14, 6, 5);
    ctx.fillRect(42, 36, 7, 5);
    return toPixelTexture(canvas, 3, 1);
  })();

  // 15. TRIBUNAS DE SAN LORENZO (franjas verticales azulgrana con desgaste)
  const sanLorenzoStands = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    for (let x = 0; x < width; x += 16) {
      ctx.fillStyle = '#253c63';
      ctx.fillRect(x, 0, 8, height);
      ctx.fillStyle = '#8f2d34';
      ctx.fillRect(x + 8, 0, 8, height);
    }
    for (let y = 0; y < height; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(0, y, width, 1);
    }
    ctx.fillStyle = '#7c7a74';
    ctx.fillRect(0, 30, width, 3);
    return toPixelTexture(canvas, 4, 1);
  })();

  // 16. CAMPO DE JUEGO DE FÚTBOL ABANDONADO (líneas blancas gastadas, barro y charcos)
  const soccerPitch = (() => {
    const { canvas, ctx, width, height } = createCanvas(128, 128);
    ctx.fillStyle = '#536b38';
    ctx.fillRect(0, 0, width, height);
    // Franjas de césped
    for (let y = 0; y < height; y += 16) {
      ctx.fillStyle = '#495f31';
      ctx.fillRect(0, y, width, 8);
    }
    // Parches de barro y charcos
    ctx.fillStyle = '#63533d';
    ctx.fillRect(28, 36, 36, 26);
    ctx.fillRect(66, 68, 34, 24);
    ctx.fillRect(44, 92, 26, 16);
    ctx.fillStyle = '#4e636b'; // charcos de agua
    ctx.fillRect(72, 74, 16, 10);
    ctx.fillRect(36, 44, 12, 8);

    // Líneas blancas desgastadas de la cancha
    ctx.strokeStyle = 'rgba(225, 228, 215, 0.72)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 108, 108);
    ctx.beginPath();
    ctx.moveTo(10, 64);
    ctx.lineTo(118, 64);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(64, 64, 16, 0, Math.PI * 2);
    ctx.stroke();
    // Áreas
    ctx.strokeRect(38, 10, 52, 18);
    ctx.strokeRect(38, 100, 52, 18);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 17. COLECTIVO PORTEÑO OXIDADO (crema, franjas roja/amarilla/azul, ventanas rotas)
  const colectivoSide = (() => {
    const { canvas, ctx, width, height } = createCanvas(96, 48);
    ctx.fillStyle = '#b5ab98';
    ctx.fillRect(0, 0, width, height);
    // Franjas porteñas
    ctx.fillStyle = '#9e2a2b';
    ctx.fillRect(0, 26, width, 4);
    ctx.fillStyle = '#d4a02c';
    ctx.fillRect(0, 30, width, 4);
    ctx.fillStyle = '#244c80';
    ctx.fillRect(0, 34, width, 5);
    // Ventanas rotas
    [8, 26, 44, 62, 80].forEach((wx) => {
      ctx.fillStyle = '#181c24';
      ctx.fillRect(wx, 8, 13, 14);
      ctx.fillStyle = '#4e6170';
      ctx.fillRect(wx + 1, 9, 4, 5);
    });
    // Manchas de óxido
    ctx.fillStyle = '#7c4328';
    ctx.fillRect(4, 2, 18, 5);
    ctx.fillRect(54, 38, 22, 8);
    ctx.fillRect(22, 22, 10, 6);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 18. PATRULLERO / AUTO ABANDONADO
  const policeCarSide = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 32);
    ctx.fillStyle = '#cfc9bc';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#273a59';
    ctx.fillRect(0, 18, width, 10);
    // Ventanas
    ctx.fillStyle = '#191d26';
    ctx.fillRect(14, 4, 16, 11);
    ctx.fillRect(34, 4, 14, 11);
    // Escudo amarillo + óxido
    ctx.fillStyle = '#d4a02c';
    ctx.fillRect(28, 19, 6, 6);
    ctx.fillStyle = '#7c4328';
    ctx.fillRect(4, 14, 10, 8);
    ctx.fillRect(48, 16, 12, 10);
    return toPixelTexture(canvas, 1, 1);
  })();

  const carBody = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 32);
    ctx.fillStyle = '#7a5244';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#1a1d24';
    ctx.fillRect(14, 4, 15, 11);
    ctx.fillRect(33, 4, 15, 11);
    ctx.fillStyle = '#57362b';
    ctx.fillRect(0, 22, width, 10);
    ctx.fillStyle = '#9c5a3c';
    ctx.fillRect(8, 16, 14, 6);
    return toPixelTexture(canvas, 1, 1);
  })();

  // 19. CHAPA ACANALADA COLORIDA DE CAMINITO (La Boca)
  const caminitoTin = (() => {
    const { canvas, ctx, width, height } = createCanvas(64, 64);
    const panels = ['#4b8f82', '#cfa042', '#9e473c', '#3c688f'];
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = panels[i];
      ctx.fillRect(i * 16, 0, 16, height);
      for (let x = i * 16; x < (i + 1) * 16; x += 2) {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(x, 0, 1, height);
      }
    }
    // Ventanas y tablones
    ctx.fillStyle = '#1b1d24';
    ctx.fillRect(8, 14, 12, 16);
    ctx.fillRect(40, 14, 12, 16);
    ctx.fillStyle = '#6b472b';
    ctx.fillRect(7, 20, 14, 3);
    ctx.fillRect(39, 18, 14, 3);
    // Óxido
    ctx.fillStyle = '#7c4328';
    ctx.fillRect(12, 46, 18, 10);
    return toPixelTexture(canvas, 1, 1);
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
    policeFacade,
    fireStationFacade,
    bomboneraStands,
    sanLorenzoStands,
    soccerPitch,
    colectivoSide,
    policeCarSide,
    carBody,
    caminitoTin,
  };
}
