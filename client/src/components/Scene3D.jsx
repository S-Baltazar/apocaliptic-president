import React, { useEffect, useRef } from 'react';
import { createDestroyedCity } from '../three/createDestroyedCity.js';

export default function Scene3D({ onSelectSector }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelectSector);
  onSelectRef.current = onSelectSector;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const cleanup = createDestroyedCity(container, (sector) => {
      if (onSelectRef.current) {
        onSelectRef.current(sector);
      }
    });

    return cleanup;
  }, []);

  return <div ref={containerRef} className="scene-canvas-wrapper" />;
}
