import React, { useEffect, useRef } from 'react';
import { createDestroyedCity } from '../three/createDestroyedCity.js';

export default function Scene3D({ sectors, onSelectSector }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelectSector);
  const updateSectorsRef = useRef(null);
  onSelectRef.current = onSelectSector;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const controller = createDestroyedCity(container, (sector) => {
      if (onSelectRef.current) {
        onSelectRef.current(sector);
      }
    });

    updateSectorsRef.current = controller.updateSectors;
    if (sectors) {
      controller.updateSectors(sectors);
    }

    return () => {
      updateSectorsRef.current = null;
      controller.cleanup();
    };
  }, []);

  useEffect(() => {
    if (updateSectorsRef.current && sectors) {
      updateSectorsRef.current(sectors);
    }
  }, [sectors]);

  return <div ref={containerRef} className="scene-canvas-wrapper" />;
}
