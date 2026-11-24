import React, { useEffect, useRef } from 'react';
import { createDestroyedCity } from '../three/createDestroyedCity.js';

export default function Scene3D({ sectors, weather, onSelectSector }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelectSector);
  const controllerRef = useRef(null);
  onSelectRef.current = onSelectSector;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const controller = createDestroyedCity(container, (sector) => {
      if (onSelectRef.current) {
        onSelectRef.current(sector);
      }
    });

    controllerRef.current = controller;
    if (sectors) controller.updateSectors(sectors);
    if (weather) controller.updateWeather(weather.id);

    return () => {
      controllerRef.current = null;
      controller.cleanup();
    };
  }, []);

  useEffect(() => {
    if (controllerRef.current && sectors) {
      controllerRef.current.updateSectors(sectors);
    }
  }, [sectors]);

  useEffect(() => {
    if (controllerRef.current && weather) {
      controllerRef.current.updateWeather(weather.id);
    }
  }, [weather]);

  return <div ref={containerRef} className="scene-canvas-wrapper" />;
}
