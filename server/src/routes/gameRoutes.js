import { Router } from 'express';
import { PRESIDENTS, INITIAL_SECTORS } from '../data/presidents.js';

const router = Router();

// Estado en memoria para la sesión actual
let currentGameState = null;

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'presidencia-apocaliptica-api' });
});

router.get('/presidents', (_req, res) => {
  res.json({ presidents: PRESIDENTS });
});

router.post('/game/start', (req, res) => {
  const { playerName, presidentId } = req.body || {};
  const cleanName = typeof playerName === 'string' ? playerName.trim().slice(0, 28) : '';

  if (!cleanName) {
    return res.status(400).json({ error: 'Debes ingresar tu nombre presidencial.' });
  }

  const chosenPresident = PRESIDENTS.find((p) => p.id === presidentId) || PRESIDENTS[0];

  currentGameState = {
    playerName: cleanName,
    president: chosenPresident,
    cityName: 'Nueva Ceniza',
    month: 1,
    stats: { ...chosenPresident.startingStats },
    sectors: INITIAL_SECTORS.map((s) => ({ ...s })),
    taxes: {
      national: 18,
      customs: 12,
    },
    startedAt: new Date().toISOString(),
  };

  return res.status(201).json({ gameState: currentGameState });
});

router.get('/game/state', (_req, res) => {
  if (!currentGameState) {
    return res.status(404).json({ error: 'No hay una partida iniciada.' });
  }
  return res.json({ gameState: currentGameState });
});

export default router;
