import { PRESIDENTS_FALLBACK, INITIAL_SECTORS_FALLBACK } from '../data/presidents.js';
import {
  SECTOR_LEVELS,
  SOCIAL_PLANS,
  CONGRESS_LAWS,
  pickCongressAgenda,
  SPECIAL_PROJECTS,
  WEATHERS,
  RANDOM_EVENTS,
  FOREIGN_POWERS,
} from '../data/gameCatalog.js';

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

export async function fetchPresidents() {
  try {
    const res = await fetch('/api/presidents');
    if (!res.ok) throw new Error('Error');
    const data = await res.json();
    return data.presidents;
  } catch {
    return PRESIDENTS_FALLBACK;
  }
}

export async function startGameSession(playerName, presidentId, gameMode = 'mandato') {
  try {
    const res = await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, presidentId, gameMode }),
    });
    if (!res.ok) throw new Error('Error');
    const data = await res.json();
    return data.gameState;
  } catch {
    const chosen = PRESIDENTS_FALLBACK.find((p) => p.id === presidentId) || PRESIDENTS_FALLBACK[0];
    return {
      playerName: playerName.trim(),
      president: chosen,
      gameMode,
      cityName: 'Buenos Aires',
      month: 1,
      stats: { ...chosen.startingStats },
      sectors: INITIAL_SECTORS_FALLBACK.filter((s) => SECTOR_LEVELS[s.id]).map((s) => ({ ...s })),
      taxes: { national: 18, customs: 12 },
      blackMarket: 10,
      activePlans: [],
      passedLaws: [],
      congressAgenda: pickCongressAgenda([], []),
      congressNextRotationMonth: 4,
      completedProjects: [],
      activeProject: null,
      weather: WEATHERS[0],
      newsHeadline: `EL CRONISTA DE CENIZA: ${playerName.trim().toUpperCase()} ASUME EN BUENOS AIRES.`,
      pressUsedThisMonth: false,
      diplomacyCooldowns: {},
      diplomacyCount: 0,
      activeEvent: null,
      gameOverReason: null,
      victoryEnding: null,
    };
  }
}

async function postAction(url, body, fallbackFn) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Error en la operación.' };
    return { gameState: data.gameState, message: data.message };
  } catch {
    return fallbackFn();
  }
}

export function changeSectorLevel(currentState, sectorId, direction) {
  return postAction('/api/game/sector', { sectorId, direction }, () => {
    const next = structuredClone(currentState);
    const sector = next.sectors.find((s) => s.id === sectorId);
    const levels = SECTOR_LEVELS[sectorId];
    const targetLevel = direction === 'down' ? sector.level - 1 : sector.level + 1;
    if (targetLevel < 0 || targetLevel >= levels.length) return { error: 'Límite alcanzado.' };
    const cur = levels[sector.level];
    const nxt = levels[targetLevel];
    if (direction === 'up') {
      let discount = next.president.id === 'tecnocrata' ? 0.85 : 1;
      if (next.completedProjects.includes('polo_uba')) discount *= 0.8;
      const cost = Math.round(nxt.upgradeCost * discount);
      if (next.stats.treasury < cost) return { error: `Necesitas $${cost}k.` };
      next.stats.treasury -= cost;
    } else {
      next.stats.approval = clamp(next.stats.approval - 5);
    }
    next.stats.monthlyExpenses += nxt.monthlyCost - cur.monthlyCost;
    next.stats.monthlyIncome += nxt.incomeBonus - cur.incomeBonus;
    next.stats.order = clamp(next.stats.order + (nxt.orderBonus - cur.orderBonus));
    next.stats.approval = clamp(next.stats.approval + (nxt.approvalBonus - cur.approvalBonus));
    sector.level = nxt.level;
    sector.monthlyCost = nxt.monthlyCost;
    sector.status = nxt.status;
    return { gameState: next };
  });
}

export function updateTaxes(currentState, national, customs) {
  return postAction('/api/game/taxes', { national, customs }, () => {
    const next = structuredClone(currentState);
    const newNat = clamp(Number(national), 5, 40);
    const newCus = clamp(Number(customs), 0, 40);
    next.stats.monthlyIncome +=
      newNat * 4 + newCus * 3 - (next.taxes.national * 4 + next.taxes.customs * 3);
    next.taxes = { national: newNat, customs: newCus };
    return { gameState: next };
  });
}

export function toggleSocialPlan(currentState, planId) {
  return postAction('/api/game/social-plan', { planId }, () => {
    const next = structuredClone(currentState);
    const plan = SOCIAL_PLANS.find((p) => p.id === planId);
    if (!plan) return { error: 'Plan inválido.' };
    const active = next.activePlans.includes(planId);
    if (active) {
      next.activePlans = next.activePlans.filter((id) => id !== planId);
      next.stats.monthlyExpenses -= plan.monthlyCost;
      next.stats.monthlyIncome -= plan.incomeBonus;
      next.stats.approval = clamp(next.stats.approval - plan.approvalBonus - 3);
    } else {
      next.activePlans.push(planId);
      next.stats.monthlyExpenses += plan.monthlyCost;
      next.stats.monthlyIncome += plan.incomeBonus;
      next.stats.approval = clamp(next.stats.approval + plan.approvalBonus);
    }
    return { gameState: next };
  });
}

export function proposeLaw(currentState, lawId, negotiate = false) {
  return postAction('/api/game/law', { lawId, negotiate }, () => {
    const next = structuredClone(currentState);
    const law = CONGRESS_LAWS.find((l) => l.id === lawId);
    if (!law) return { error: 'Ley inválida.' };
    let support = next.stats.congressSupport;
    if (negotiate) {
      if (next.stats.treasury < 70) return { error: 'Necesitas $70k.' };
      next.stats.treasury -= 70;
      support += 18;
    }
    if (support >= law.difficulty) {
      next.passedLaws.push(lawId);
      if (law.effects.treasury) next.stats.treasury += law.effects.treasury;
      if (law.effects.monthlyIncomeDelta) next.stats.monthlyIncome += law.effects.monthlyIncomeDelta;
      if (law.effects.monthlyExpensesDelta) next.stats.monthlyExpenses += law.effects.monthlyExpensesDelta;
      if (law.effects.order) next.stats.order = clamp(next.stats.order + law.effects.order);
      if (law.effects.approval) next.stats.approval = clamp(next.stats.approval + law.effects.approval);
      return { gameState: next, message: `¡Aprobada! ${law.name}` };
    }
    return { gameState: next, message: `Rechazada (requería ${law.difficulty}%).` };
  });
}

export function startSpecialProject(currentState, projectId) {
  return postAction('/api/game/project', { projectId }, () => {
    const next = structuredClone(currentState);
    const proj = SPECIAL_PROJECTS.find((p) => p.id === projectId);
    if (!proj || next.stats.treasury < proj.cost) return { error: 'Fondos insuficientes.' };
    next.stats.treasury -= proj.cost;
    next.activeProject = { id: proj.id, name: proj.name, monthsLeft: proj.monthsRequired };
    return { gameState: next, message: `Obra iniciada: ${proj.name}` };
  });
}

export function holdPressConference(currentState) {
  return postAction('/api/game/press-conference', {}, () => {
    const next = structuredClone(currentState);
    if (next.pressUsedThisMonth || next.stats.treasury < 60) return { error: 'No disponible.' };
    next.stats.treasury -= 60;
    next.stats.approval = clamp(next.stats.approval + 8);
    next.stats.order = clamp(next.stats.order + 5);
    next.pressUsedThisMonth = true;
    return { gameState: next };
  });
}

export async function advanceMonth(currentState) {
  const res = await postAction('/api/game/next-month', {}, () => {
    const next = structuredClone(currentState);
    next.stats.treasury += next.stats.monthlyIncome - next.stats.monthlyExpenses;
    next.month += 1;
    next.pressUsedThisMonth = false;
    if (next.month >= (next.congressNextRotationMonth || 4)) {
      next.congressAgenda = pickCongressAgenda(next.passedLaws, next.congressAgenda);
      next.congressNextRotationMonth = next.month + 3;
    }
    next.weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    if (!next.activeEvent && Math.random() < 0.75) {
      next.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    }
    return { gameState: next };
  });
  return res.gameState || currentState;
}

export async function resolveGameEvent(currentState, optionIndex) {
  const res = await postAction('/api/game/event/resolve', { optionIndex }, () => {
    const next = structuredClone(currentState);
    const fx = next.activeEvent?.options[optionIndex]?.effects || {};
    if (fx.treasury) next.stats.treasury += fx.treasury;
    if (fx.order) next.stats.order = clamp(next.stats.order + fx.order);
    if (fx.approval) next.stats.approval = clamp(next.stats.approval + fx.approval);
    next.activeEvent = null;
    return { gameState: next };
  });
  return res.gameState || currentState;
}

export function requestForeignAid(currentState, powerId, actionId) {
  return postAction('/api/game/diplomacy', { powerId, actionId }, () => {
    const next = structuredClone(currentState);
    const power = FOREIGN_POWERS.find((p) => p.id === powerId);
    const action = power?.actions.find((a) => a.id === actionId);
    if (!action) return { error: 'Acuerdo inválido.' };
    if (next.gameMode === 'sin_deuda' && action.isLoan) return { error: 'Prohibido en Desafío Cero Deuda.' };
    const key = `${powerId}:${actionId}`;
    if (next.month < (next.diplomacyCooldowns[key] || 1)) return { error: 'En espera.' };
    const fx = action.effects || {};
    if (fx.treasury) next.stats.treasury += fx.treasury;
    if (fx.monthlyIncomeDelta) next.stats.monthlyIncome += fx.monthlyIncomeDelta;
    if (fx.monthlyExpensesDelta) next.stats.monthlyExpenses += fx.monthlyExpensesDelta;
    next.diplomacyCooldowns[key] = next.month + 3;
    return { gameState: next, message: `Acuerdo firmado con ${power.name}.` };
  });
}
