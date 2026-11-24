import { PRESIDENTS_FALLBACK, INITIAL_SECTORS_FALLBACK } from '../data/presidents.js';

export async function fetchPresidents() {
  try {
    const res = await fetch('/api/presidents');
    if (!res.ok) throw new Error('Error cargando presidentes');
    const data = await res.json();
    return data.presidents;
  } catch {
    return PRESIDENTS_FALLBACK;
  }
}

export async function startGameSession(playerName, presidentId) {
  try {
    const res = await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, presidentId }),
    });
    if (!res.ok) throw new Error('Error iniciando partida');
    const data = await res.json();
    return data.gameState;
  } catch {
    const chosen = PRESIDENTS_FALLBACK.find((p) => p.id === presidentId) || PRESIDENTS_FALLBACK[0];
    return {
      playerName: playerName.trim(),
      president: chosen,
      cityName: 'Nueva Ceniza',
      month: 1,
      stats: { ...chosen.startingStats },
      sectors: INITIAL_SECTORS_FALLBACK.map((s) => ({ ...s })),
      taxes: { national: 18, customs: 12 },
    };
  }
}
