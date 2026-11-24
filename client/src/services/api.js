import { PRESIDENTS_FALLBACK, INITIAL_SECTORS_FALLBACK } from '../data/presidents.js';
import { SECTOR_LEVELS, RANDOM_EVENTS, FOREIGN_POWERS } from '../data/gameCatalog.js';

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

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
      cityName: 'Buenos Aires',
      month: 1,
      stats: { ...chosen.startingStats },
      sectors: INITIAL_SECTORS_FALLBACK.filter((s) => SECTOR_LEVELS[s.id]).map((s) => ({ ...s })),
      taxes: { national: 18, customs: 12 },
      activeEvent: null,
      diplomacyCooldowns: {},
      gameOverReason: null,
    };
  }
}

export async function changeSectorLevel(currentState, sectorId, direction) {
  try {
    const res = await fetch('/api/game/sector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectorId, direction }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Error al modificar sector' };
    return { gameState: data.gameState };
  } catch {
    // Fallback local
    const next = structuredClone(currentState);
    const sector = next.sectors.find((s) => s.id === sectorId);
    const levels = SECTOR_LEVELS[sectorId];
    const targetLevel = direction === 'down' ? sector.level - 1 : sector.level + 1;
    if (targetLevel < 0 || targetLevel >= levels.length) {
      return { error: 'Nivel límite alcanzado.' };
    }
    const curCfg = levels[sector.level];
    const nxtCfg = levels[targetLevel];
    if (direction === 'up') {
      const discount = next.president.id === 'tecnocrata' ? 0.85 : 1;
      const cost = Math.round(nxtCfg.upgradeCost * discount);
      if (next.stats.treasury < cost) return { error: `Necesitas $${cost}k.` };
      next.stats.treasury -= cost;
    } else {
      next.stats.approval = clamp(next.stats.approval - 5);
    }
    next.stats.monthlyExpenses += nxtCfg.monthlyCost - curCfg.monthlyCost;
    next.stats.monthlyIncome += nxtCfg.incomeBonus - curCfg.incomeBonus;
    next.stats.order = clamp(next.stats.order + (nxtCfg.orderBonus - curCfg.orderBonus));
    next.stats.approval = clamp(next.stats.approval + (nxtCfg.approvalBonus - curCfg.approvalBonus));
    sector.level = nxtCfg.level;
    sector.monthlyCost = nxtCfg.monthlyCost;
    sector.status = nxtCfg.status;
    return { gameState: next };
  }
}

export async function advanceMonth(currentState) {
  try {
    const res = await fetch('/api/game/next-month', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.gameState;
  } catch {
    const next = structuredClone(currentState);
    next.stats.treasury += next.stats.monthlyIncome - next.stats.monthlyExpenses;
    next.month += 1;
    if (!next.activeEvent && Math.random() < 0.8) {
      next.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    }
    return next;
  }
}

export async function resolveGameEvent(currentState, optionIndex) {
  try {
    const res = await fetch('/api/game/event/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.gameState;
  } catch {
    const next = structuredClone(currentState);
    const fx = next.activeEvent?.options[optionIndex]?.effects || {};
    if (fx.treasury) next.stats.treasury += fx.treasury;
    if (fx.order) next.stats.order = clamp(next.stats.order + fx.order);
    if (fx.approval) next.stats.approval = clamp(next.stats.approval + fx.approval);
    if (fx.congressSupport) next.stats.congressSupport = clamp(next.stats.congressSupport + fx.congressSupport);
    next.activeEvent = null;
    return next;
  }
}

export async function requestForeignAid(currentState, powerId, actionId) {
  try {
    const res = await fetch('/api/game/diplomacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ powerId, actionId }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Error diplomático' };
    return { gameState: data.gameState, message: data.message };
  } catch {
    const next = structuredClone(currentState);
    const power = FOREIGN_POWERS.find((p) => p.id === powerId);
    const action = power?.actions.find((a) => a.id === actionId);
    if (!action) return { error: 'Acuerdo inválido.' };
    const key = `${powerId}:${actionId}`;
    const available = next.diplomacyCooldowns[key] || 1;
    if (next.month < available) return { error: `Disponible en el Mes ${available}.` };
    const fx = action.effects || {};
    if (fx.treasury) next.stats.treasury += fx.treasury;
    if (fx.monthlyIncomeDelta) next.stats.monthlyIncome += fx.monthlyIncomeDelta;
    if (fx.monthlyExpensesDelta) next.stats.monthlyExpenses += fx.monthlyExpensesDelta;
    if (fx.order) next.stats.order = clamp(next.stats.order + fx.order);
    if (fx.approval) next.stats.approval = clamp(next.stats.approval + fx.approval);
    if (fx.congressSupport) next.stats.congressSupport = clamp(next.stats.congressSupport + fx.congressSupport);
    next.diplomacyCooldowns[key] = next.month + 3;
    return { gameState: next, message: `Acuerdo firmado con ${power.name}.` };
  }
}
