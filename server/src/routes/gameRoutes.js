import { Router } from 'express';
import { PRESIDENTS, INITIAL_SECTORS } from '../data/presidents.js';
import { SECTOR_LEVELS, RANDOM_EVENTS, FOREIGN_POWERS } from '../data/gameCatalog.js';

const router = Router();

let currentGameState = null;

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function checkGameOver(state) {
  if (state.stats.treasury < -200) {
    return 'QUIEBRA TOTAL: Las arcas del Estado colapsaron bajo el peso de los costos fijos mensuales.';
  }
  if (state.stats.order <= 0) {
    return 'CAOS ABSOLUTO: El orden público cayó a 0% y los saqueos tomaron Buenos Aires.';
  }
  if (state.stats.approval <= 0) {
    return 'REVUELTA POPULAR: La ciudadanía exigió tu renuncia inmediata frente a Casa Rosada.';
  }
  return null;
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'presidencia-apocaliptica-api' });
});

router.get('/presidents', (_req, res) => {
  res.json({ presidents: PRESIDENTS });
});

router.get('/diplomacy/powers', (_req, res) => {
  res.json({ powers: FOREIGN_POWERS });
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
    cityName: 'Buenos Aires',
    month: 1,
    stats: { ...chosenPresident.startingStats },
    sectors: INITIAL_SECTORS.filter((s) => SECTOR_LEVELS[s.id]).map((s) => ({ ...s })),
    taxes: { national: 18, customs: 12 },
    activeEvent: null,
    diplomacyCooldowns: {},
    gameOverReason: null,
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

router.post('/game/sector', (req, res) => {
  if (!currentGameState) {
    return res.status(404).json({ error: 'No hay una partida iniciada.' });
  }
  const { sectorId, direction } = req.body || {};
  const sector = currentGameState.sectors.find((s) => s.id === sectorId);
  const levels = SECTOR_LEVELS[sectorId];

  if (!sector || !levels) {
    return res.status(400).json({ error: 'Sector inválido.' });
  }

  const targetLevel = direction === 'down' ? sector.level - 1 : sector.level + 1;
  if (targetLevel < 0 || targetLevel >= levels.length) {
    return res.status(400).json({ error: 'No se puede cambiar más el nivel de este sector.' });
  }

  const currentCfg = levels[sector.level];
  const nextCfg = levels[targetLevel];

  if (direction === 'up') {
    const discount = currentGameState.president.id === 'tecnocrata' ? 0.85 : 1;
    const cost = Math.round(nextCfg.upgradeCost * discount);
    if (currentGameState.stats.treasury < cost) {
      return res.status(400).json({
        error: `Fondos insuficientes: necesitas $${cost}k para mejorar ${sector.name}.`,
      });
    }
    currentGameState.stats.treasury -= cost;
  } else {
    // Recortar nivel genera descontento inmediato
    currentGameState.stats.approval = clamp(currentGameState.stats.approval - 5);
  }

  currentGameState.stats.monthlyExpenses += nextCfg.monthlyCost - currentCfg.monthlyCost;
  currentGameState.stats.monthlyIncome += nextCfg.incomeBonus - currentCfg.incomeBonus;
  currentGameState.stats.order = clamp(
    currentGameState.stats.order + (nextCfg.orderBonus - currentCfg.orderBonus)
  );
  currentGameState.stats.approval = clamp(
    currentGameState.stats.approval + (nextCfg.approvalBonus - currentCfg.approvalBonus)
  );

  sector.level = nextCfg.level;
  sector.monthlyCost = nextCfg.monthlyCost;
  sector.status = nextCfg.status;
  currentGameState.gameOverReason = checkGameOver(currentGameState);

  return res.json({ gameState: currentGameState });
});

router.post('/game/next-month', (_req, res) => {
  if (!currentGameState) {
    return res.status(404).json({ error: 'No hay una partida iniciada.' });
  }
  if (currentGameState.gameOverReason) {
    return res.json({ gameState: currentGameState });
  }

  const net = currentGameState.stats.monthlyIncome - currentGameState.stats.monthlyExpenses;
  currentGameState.stats.treasury += net;
  currentGameState.month += 1;

  // Seleccionar evento aleatorio (80% probabilidad cada mes)
  if (!currentGameState.activeEvent && Math.random() < 0.8) {
    const idx = Math.floor(Math.random() * RANDOM_EVENTS.length);
    currentGameState.activeEvent = RANDOM_EVENTS[idx];
  }

  currentGameState.gameOverReason = checkGameOver(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/event/resolve', (req, res) => {
  if (!currentGameState || !currentGameState.activeEvent) {
    return res.status(400).json({ error: 'No hay ningún evento activo.' });
  }
  const { optionIndex } = req.body || {};
  const option = currentGameState.activeEvent.options[optionIndex];
  if (!option) {
    return res.status(400).json({ error: 'Opción de evento inválida.' });
  }

  const fx = option.effects || {};
  if (fx.treasury) currentGameState.stats.treasury += fx.treasury;
  if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
  if (fx.approval) {
    currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
  }
  if (fx.congressSupport) {
    currentGameState.stats.congressSupport = clamp(
      currentGameState.stats.congressSupport + fx.congressSupport
    );
  }

  currentGameState.activeEvent = null;
  currentGameState.gameOverReason = checkGameOver(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/diplomacy', (req, res) => {
  if (!currentGameState) {
    return res.status(404).json({ error: 'No hay una partida iniciada.' });
  }
  const { powerId, actionId } = req.body || {};
  const power = FOREIGN_POWERS.find((p) => p.id === powerId);
  const action = power?.actions.find((a) => a.id === actionId);

  if (!power || !action) {
    return res.status(400).json({ error: 'Acuerdo diplomático inválido.' });
  }

  const cooldownKey = `${powerId}:${actionId}`;
  const availableMonth = currentGameState.diplomacyCooldowns[cooldownKey] || 1;
  if (currentGameState.month < availableMonth) {
    return res.status(400).json({
      error: `Debes esperar hasta el Mes ${availableMonth} para volver a solicitar "${action.label}".`,
    });
  }

  const fx = action.effects || {};
  if (fx.treasury) currentGameState.stats.treasury += fx.treasury;
  if (fx.monthlyIncomeDelta) currentGameState.stats.monthlyIncome += fx.monthlyIncomeDelta;
  if (fx.monthlyExpensesDelta) currentGameState.stats.monthlyExpenses += fx.monthlyExpensesDelta;
  if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
  if (fx.approval) {
    currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
  }
  if (fx.congressSupport) {
    currentGameState.stats.congressSupport = clamp(
      currentGameState.stats.congressSupport + fx.congressSupport
    );
  }

  // Cooldown de 3 meses para volver a pedir la misma ayuda
  currentGameState.diplomacyCooldowns[cooldownKey] = currentGameState.month + 3;
  currentGameState.gameOverReason = checkGameOver(currentGameState);

  return res.json({
    gameState: currentGameState,
    message: `Acuerdo firmado con ${power.name}: ${action.label}.`,
  });
});

export default router;
