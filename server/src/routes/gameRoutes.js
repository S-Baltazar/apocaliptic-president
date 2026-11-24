import { Router } from 'express';
import { PRESIDENTS, INITIAL_SECTORS } from '../data/presidents.js';
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

const router = Router();
let currentGameState = null;

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function calcBlackMarket(state) {
  const policeLevel = state.sectors.find((s) => s.id === 'policia')?.level || 0;
  const taxPressure = Math.max(0, state.taxes.national - 18) + Math.max(0, state.taxes.customs - 15);
  return clamp(Math.round(taxPressure * 1.4 - policeLevel * 8 + 10), 0, 60);
}

function checkGameOverOrVictory(state) {
  if (state.stats.order <= 0 && state.stats.approval <= 0) {
    state.gameOverReason =
      'ESCAPE EN HELICÓPTERO: El orden y la aprobación cayeron a 0%. Tuviste que evacuar desde el techo de Casa Rosada.';
    return;
  }
  if (state.stats.treasury < -200) {
    state.gameOverReason =
      'QUIEBRA TOTAL: Las arcas del Estado colapsaron bajo el peso de los costos fijos mensuales.';
    return;
  }
  if (state.stats.order <= 0) {
    state.gameOverReason = 'CAOS ABSOLUTO: El orden público cayó a 0% y los saqueos tomaron Buenos Aires.';
    return;
  }
  if (state.stats.approval <= 0) {
    state.gameOverReason = 'REVUELTA POPULAR: La ciudadanía exigió tu renuncia inmediata frente a Casa Rosada.';
    return;
  }

  // Victoria al completar 36 meses en modo mandato o sin_deuda
  if (state.gameMode !== 'infinito' && state.month >= 36 && !state.victoryEnding) {
    const avgLevel =
      state.sectors.reduce((acc, s) => acc + s.level, 0) / Math.max(1, state.sectors.length);
    if (avgLevel >= 2.4 && state.stats.treasury >= 200) {
      state.victoryEnding = {
        title: 'FINAL VISIONARIO: BUENOS AIRES FUTURISTA',
        desc: 'Completaste los 36 meses transformando las ruinas en una metrópolis moderna con finanzas sólidas.',
      };
    } else if (state.diplomacyCount >= 4) {
      state.victoryEnding = {
        title: 'FINAL DIPLOMÁTICO: ALIANZA GLOBAL',
        desc: 'Reconstruiste la ciudad apoyándote en acuerdos estratégicos con potencias extranjeras.',
      };
    } else if (state.stats.treasury >= 400) {
      state.victoryEnding = {
        title: 'FINAL AUSTERO: EQUILIBRIO FISCAL',
        desc: 'Mantuviste las cuentas en orden y entregaste una tesorería saneada al próximo gobierno.',
      };
    } else {
      state.victoryEnding = {
        title: 'FINAL SUPERVIVIENTE: MANDATO COMPLETADO',
        desc: 'Sobreviviste a los 36 meses de crisis, clima extremo y conflictos políticos sin caer.',
      };
    }
  }
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'presidencia-apocaliptica-api' });
});

router.get('/presidents', (_req, res) => {
  res.json({ presidents: PRESIDENTS });
});

router.post('/game/start', (req, res) => {
  const { playerName, presidentId, gameMode } = req.body || {};
  const cleanName = typeof playerName === 'string' ? playerName.trim().slice(0, 28) : '';
  if (!cleanName) {
    return res.status(400).json({ error: 'Debes ingresar tu nombre presidencial.' });
  }

  const chosenPresident = PRESIDENTS.find((p) => p.id === presidentId) || PRESIDENTS[0];
  currentGameState = {
    playerName: cleanName,
    president: chosenPresident,
    gameMode: gameMode || 'mandato',
    cityName: 'Buenos Aires',
    month: 1,
    stats: { ...chosenPresident.startingStats },
    sectors: INITIAL_SECTORS.filter((s) => SECTOR_LEVELS[s.id]).map((s) => ({ ...s })),
    taxes: { national: 18, customs: 12 },
    blackMarket: 10,
    activePlans: [],
    passedLaws: [],
    congressAgenda: pickCongressAgenda([], []),
    congressNextRotationMonth: 4,
    completedProjects: [],
    activeProject: null,
    weather: WEATHERS[0],
    newsHeadline: `EL CRONISTA DE CENIZA: ${cleanName.toUpperCase()} ASUME EN UNA BUENOS AIRES DEVASTADA.`,
    pressUsedThisMonth: false,
    diplomacyCooldowns: {},
    diplomacyCount: 0,
    activeEvent: null,
    gameOverReason: null,
    victoryEnding: null,
  };

  return res.status(201).json({ gameState: currentGameState });
});

router.post('/game/sector', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { sectorId, direction } = req.body || {};
  const sector = currentGameState.sectors.find((s) => s.id === sectorId);
  const levels = SECTOR_LEVELS[sectorId];
  if (!sector || !levels) return res.status(400).json({ error: 'Sector inválido.' });

  const targetLevel = direction === 'down' ? sector.level - 1 : sector.level + 1;
  if (targetLevel < 0 || targetLevel >= levels.length) {
    return res.status(400).json({ error: 'Límite de nivel alcanzado.' });
  }

  const currentCfg = levels[sector.level];
  const nextCfg = levels[targetLevel];

  if (direction === 'up') {
    let discount = currentGameState.president.id === 'tecnocrata' ? 0.85 : 1;
    if (currentGameState.completedProjects.includes('polo_uba')) discount *= 0.8;
    const cost = Math.round(nextCfg.upgradeCost * discount);
    if (currentGameState.stats.treasury < cost) {
      return res.status(400).json({ error: `Necesitas $${cost}k para mejorar ${sector.name}.` });
    }
    currentGameState.stats.treasury -= cost;
    currentGameState.newsHeadline = `EL CRONISTA: OBRAS EN ${sector.name.toUpperCase()} ALCANZAN NIVEL ${nextCfg.level} (${nextCfg.status.toUpperCase()}).`;
  } else {
    currentGameState.stats.approval = clamp(currentGameState.stats.approval - 5);
    currentGameState.newsHeadline = `EL CRONISTA: GREMIOS PROTESTAN POR RECORTES EN ${sector.name.toUpperCase()}.`;
  }

  currentGameState.stats.monthlyExpenses += nextCfg.monthlyCost - currentCfg.monthlyCost;
  currentGameState.stats.monthlyIncome += nextCfg.incomeBonus - currentCfg.incomeBonus;
  currentGameState.stats.order = clamp(currentGameState.stats.order + (nextCfg.orderBonus - currentCfg.orderBonus));
  currentGameState.stats.approval = clamp(
    currentGameState.stats.approval + (nextCfg.approvalBonus - currentCfg.approvalBonus)
  );
  sector.level = nextCfg.level;
  sector.monthlyCost = nextCfg.monthlyCost;
  sector.status = nextCfg.status;
  currentGameState.blackMarket = calcBlackMarket(currentGameState);
  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/taxes', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { national, customs } = req.body || {};
  const newNat = clamp(Number(national), 5, 40);
  const newCus = clamp(Number(customs), 0, 40);

  const oldTaxIncome = currentGameState.taxes.national * 4 + currentGameState.taxes.customs * 3;
  const newTaxIncome = newNat * 4 + newCus * 3;
  const diffIncome = newTaxIncome - oldTaxIncome;

  const deltaTax = newNat - currentGameState.taxes.national + (newCus - currentGameState.taxes.customs);
  currentGameState.stats.monthlyIncome += diffIncome;
  if (deltaTax > 0) {
    currentGameState.stats.approval = clamp(currentGameState.stats.approval - Math.ceil(deltaTax / 3));
    currentGameState.newsHeadline = `EL CRONISTA: MALESTAR POR SUBA DE IMPUESTOS (${newNat}% NAC / ${newCus}% ADUANA).`;
  } else if (deltaTax < 0) {
    currentGameState.stats.approval = clamp(currentGameState.stats.approval + Math.ceil(Math.abs(deltaTax) / 4));
    currentGameState.newsHeadline = `EL CRONISTA: ALIVIO FISCAL EN COMERCIOS POR BAJA DE IMPUESTOS.`;
  }

  currentGameState.taxes = { national: newNat, customs: newCus };
  currentGameState.blackMarket = calcBlackMarket(currentGameState);
  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/social-plan', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { planId } = req.body || {};
  const plan = SOCIAL_PLANS.find((p) => p.id === planId);
  if (!plan) return res.status(400).json({ error: 'Plan social inválido.' });

  const isActive = currentGameState.activePlans.includes(planId);
  const costDiscount = currentGameState.president.id === 'reformista' ? 0.8 : 1;
  const effectiveCost = Math.round(plan.monthlyCost * costDiscount);

  if (isActive) {
    currentGameState.activePlans = currentGameState.activePlans.filter((id) => id !== planId);
    currentGameState.stats.monthlyExpenses -= effectiveCost;
    currentGameState.stats.monthlyIncome -= plan.incomeBonus;
    currentGameState.stats.approval = clamp(currentGameState.stats.approval - plan.approvalBonus - 3);
    currentGameState.stats.order = clamp(currentGameState.stats.order - plan.orderBonus);
    currentGameState.newsHeadline = `EL CRONISTA: TENSIÓN SOCIAL TRAS SUSPENDER ${plan.name.toUpperCase()}.`;
  } else {
    currentGameState.activePlans.push(planId);
    currentGameState.stats.monthlyExpenses += effectiveCost;
    currentGameState.stats.monthlyIncome += plan.incomeBonus;
    currentGameState.stats.approval = clamp(currentGameState.stats.approval + plan.approvalBonus);
    currentGameState.stats.order = clamp(currentGameState.stats.order + plan.orderBonus);
    currentGameState.newsHeadline = `EL CRONISTA: EL GOBIERNO LANZA ${plan.name.toUpperCase()}.`;
  }
  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/law', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { lawId, negotiate } = req.body || {};
  const law = CONGRESS_LAWS.find((l) => l.id === lawId);
  if (!law) return res.status(400).json({ error: 'Ley inválida.' });
  if (currentGameState.passedLaws.includes(lawId)) {
    return res.status(400).json({ error: 'Esta ley ya fue aprobada.' });
  }

  let support = currentGameState.stats.congressSupport;
  if (negotiate) {
    if (currentGameState.stats.treasury < 70) {
      return res.status(400).json({ error: 'Necesitas $70k para negociar votos en el Congreso.' });
    }
    currentGameState.stats.treasury -= 70;
    support += 18;
  }

  const approved = support >= law.difficulty;
  if (approved) {
    currentGameState.passedLaws.push(lawId);
    const fx = law.effects;
    if (fx.treasury) currentGameState.stats.treasury += fx.treasury;
    if (fx.monthlyIncomeDelta) currentGameState.stats.monthlyIncome += fx.monthlyIncomeDelta;
    if (fx.monthlyExpensesDelta) {
      currentGameState.stats.monthlyExpenses = Math.max(0, currentGameState.stats.monthlyExpenses + fx.monthlyExpensesDelta);
    }
    if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
    if (fx.approval) currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
    currentGameState.stats.congressSupport = clamp(currentGameState.stats.congressSupport + 4);
    currentGameState.newsHeadline = `EL CRONISTA: EL CONGRESO APROBÓ LA ${law.name.toUpperCase()}.`;
    checkGameOverOrVictory(currentGameState);
    return res.json({ gameState: currentGameState, message: `¡Aprobada! ${law.name}` });
  }

  currentGameState.stats.congressSupport = clamp(currentGameState.stats.congressSupport - 5);
  currentGameState.stats.approval = clamp(currentGameState.stats.approval - 3);
  currentGameState.newsHeadline = `EL CRONISTA: DERROTA LEGISLATIVA, RECHAZARON LA ${law.name.toUpperCase()}.`;
  checkGameOverOrVictory(currentGameState);
  return res.json({
    gameState: currentGameState,
    message: `Rechazada (requería ${law.difficulty}% de apoyo; tuviste ${support}%).`,
  });
});

router.post('/game/project', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { projectId } = req.body || {};
  const proj = SPECIAL_PROJECTS.find((p) => p.id === projectId);
  if (!proj) return res.status(400).json({ error: 'Obra inválida.' });
  if (currentGameState.completedProjects.includes(projectId)) {
    return res.status(400).json({ error: 'Esta obra ya fue finalizada.' });
  }
  if (currentGameState.activeProject) {
    return res.status(400).json({ error: 'Ya hay una obra especial en construcción.' });
  }
  if (currentGameState.stats.treasury < proj.cost) {
    return res.status(400).json({ error: `Necesitas $${proj.cost}k para iniciar ${proj.name}.` });
  }

  currentGameState.stats.treasury -= proj.cost;
  currentGameState.activeProject = {
    id: proj.id,
    name: proj.name,
    monthsLeft: proj.monthsRequired,
  };
  currentGameState.newsHeadline = `EL CRONISTA: COMIENZA LA OBRA ESPECIAL "${proj.name.toUpperCase()}".`;
  return res.json({ gameState: currentGameState, message: `Iniciada: ${proj.name}` });
});

router.post('/game/press-conference', (_req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  if (currentGameState.pressUsedThisMonth) {
    return res.status(400).json({ error: 'Ya diste una Cadena Nacional este mes.' });
  }
  if (currentGameState.stats.treasury < 60) {
    return res.status(400).json({ error: 'Necesitas $60k para organizar la Cadena Nacional.' });
  }
  currentGameState.stats.treasury -= 60;
  currentGameState.stats.approval = clamp(currentGameState.stats.approval + 8);
  currentGameState.stats.order = clamp(currentGameState.stats.order + 5);
  currentGameState.pressUsedThisMonth = true;
  currentGameState.newsHeadline = `EL CRONISTA: DISCURSO PRESIDENCIAL CALMA LOS ÁNIMOS EN PLAZA DE MAYO.`;
  return res.json({ gameState: currentGameState });
});

router.post('/game/next-month', (_req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  if (currentGameState.gameOverReason || currentGameState.victoryEnding) {
    return res.json({ gameState: currentGameState });
  }

  // Mercado negro reduce una fracción de los ingresos
  const blackMarketLoss = Math.round((currentGameState.stats.monthlyIncome * currentGameState.blackMarket) / 200);
  const net = currentGameState.stats.monthlyIncome - blackMarketLoss - currentGameState.stats.monthlyExpenses;
  currentGameState.stats.treasury += net;
  currentGameState.month += 1;
  currentGameState.pressUsedThisMonth = false;

  // Rotación automática de propuestas del Congreso cada 3 meses
  if (currentGameState.month >= currentGameState.congressNextRotationMonth) {
    currentGameState.congressAgenda = pickCongressAgenda(
      currentGameState.passedLaws,
      currentGameState.congressAgenda
    );
    currentGameState.congressNextRotationMonth = currentGameState.month + 3;
    currentGameState.newsHeadline = `EL CRONISTA: EL CONGRESO RENUEVA SU AGENDA LEGISLATIVA (MES ${currentGameState.month}).`;
  }

  // Avance de Obra Especial en curso
  if (currentGameState.activeProject) {
    currentGameState.activeProject.monthsLeft -= 1;
    if (currentGameState.activeProject.monthsLeft <= 0) {
      const done = SPECIAL_PROJECTS.find((p) => p.id === currentGameState.activeProject.id);
      if (done) {
        currentGameState.completedProjects.push(done.id);
        const fx = done.effects;
        if (fx.monthlyIncomeDelta) currentGameState.stats.monthlyIncome += fx.monthlyIncomeDelta;
        if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
        if (fx.approval) currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
        if (fx.congressSupport) {
          currentGameState.stats.congressSupport = clamp(currentGameState.stats.congressSupport + fx.congressSupport);
        }
        currentGameState.newsHeadline = `EL CRONISTA: ¡INAUGURACIÓN HISTÓRICA DE ${done.name.toUpperCase()}!`;
      }
      currentGameState.activeProject = null;
    }
  }

  // Clima dinámico
  const nextWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
  currentGameState.weather = nextWeather;
  if (nextWeather.id === 'sudestada' && !currentGameState.completedProjects.includes('muro_sudestada')) {
    currentGameState.stats.treasury -= 40;
    currentGameState.stats.order = clamp(currentGameState.stats.order - 4);
    currentGameState.newsHeadline = 'EL CRONISTA: SUDESTADA INUNDA LA BOCA Y PUERTO MADERO (-$40k).';
  } else if (nextWeather.id === 'ola_calor') {
    const energyLvl = currentGameState.sectors.find((s) => s.id === 'energia')?.level || 0;
    if (energyLvl < 2) {
      currentGameState.stats.approval = clamp(currentGameState.stats.approval - 5);
      currentGameState.newsHeadline = 'EL CRONISTA: APAGONES POR OLA DE CALOR GENERAN CACEROLAZOS.';
    }
  } else if (nextWeather.id === 'ceniza') {
    currentGameState.stats.treasury -= 30;
    currentGameState.stats.order = clamp(currentGameState.stats.order - 3);
    currentGameState.newsHeadline = 'EL CRONISTA: TORMENTA DE CENIZA CUBRE LA AV. 9 DE JULIO.';
  }

  if (!currentGameState.activeEvent && Math.random() < 0.75) {
    const idx = Math.floor(Math.random() * RANDOM_EVENTS.length);
    currentGameState.activeEvent = RANDOM_EVENTS[idx];
  }

  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/event/resolve', (req, res) => {
  if (!currentGameState || !currentGameState.activeEvent) {
    return res.status(400).json({ error: 'No hay evento activo.' });
  }
  const { optionIndex } = req.body || {};
  const option = currentGameState.activeEvent.options[optionIndex];
  if (!option) return res.status(400).json({ error: 'Opción inválida.' });

  const fx = option.effects || {};
  if (fx.treasury) currentGameState.stats.treasury += fx.treasury;
  if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
  if (fx.approval) currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
  if (fx.congressSupport) {
    currentGameState.stats.congressSupport = clamp(currentGameState.stats.congressSupport + fx.congressSupport);
  }
  currentGameState.activeEvent = null;
  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState });
});

router.post('/game/diplomacy', (req, res) => {
  if (!currentGameState) return res.status(404).json({ error: 'No hay partida.' });
  const { powerId, actionId } = req.body || {};
  const power = FOREIGN_POWERS.find((p) => p.id === powerId);
  const action = power?.actions.find((a) => a.id === actionId);
  if (!power || !action) return res.status(400).json({ error: 'Acuerdo inválido.' });

  if (currentGameState.gameMode === 'sin_deuda' && action.isLoan) {
    return res.status(400).json({ error: 'Desafío Cero Deuda: no puedes tomar créditos con intereses.' });
  }

  const key = `${powerId}:${actionId}`;
  const availableMonth = currentGameState.diplomacyCooldowns[key] || 1;
  if (currentGameState.month < availableMonth) {
    return res.status(400).json({ error: `Disponible nuevamente en el Mes ${availableMonth}.` });
  }

  const fx = action.effects || {};
  if (fx.treasury) currentGameState.stats.treasury += fx.treasury;
  if (fx.monthlyIncomeDelta) currentGameState.stats.monthlyIncome += fx.monthlyIncomeDelta;
  if (fx.monthlyExpensesDelta) currentGameState.stats.monthlyExpenses += fx.monthlyExpensesDelta;
  if (fx.order) currentGameState.stats.order = clamp(currentGameState.stats.order + fx.order);
  if (fx.approval) currentGameState.stats.approval = clamp(currentGameState.stats.approval + fx.approval);
  if (fx.congressSupport) {
    currentGameState.stats.congressSupport = clamp(currentGameState.stats.congressSupport + fx.congressSupport);
  }

  currentGameState.diplomacyCooldowns[key] = currentGameState.month + 3;
  currentGameState.diplomacyCount += 1;
  currentGameState.newsHeadline = `EL CRONISTA: ACUERDO INTERNACIONAL CON ${power.name.toUpperCase()}.`;
  checkGameOverOrVictory(currentGameState);
  return res.json({ gameState: currentGameState, message: `Acuerdo firmado con ${power.name}.` });
});

export default router;
