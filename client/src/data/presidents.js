export const PRESIDENTS_FALLBACK = [
  {
    id: 'tecnocrata',
    title: 'El Tecnócrata',
    archetype: 'Ingeniero en Sistemas Urbanos',
    quote: '"Sin energía ni transporte, no hay nación que sobreviva."',
    description:
      'Especialista en infraestructura pesada. Reduce el costo de reparar redes eléctricas, subte y puerto.',
    bonuses: [
      '-15% costo en mejoras de infraestructura',
      '+10% eficiencia energética inicial',
      'Menor apoyo sindical al inicio',
    ],
    startingStats: {
      treasury: 850,
      monthlyIncome: 140,
      monthlyExpenses: 90,
      order: 42,
      approval: 48,
      congressSupport: 45,
    },
  },
  {
    id: 'reformista',
    title: 'La Reformista Social',
    archetype: 'Ex-Ministra de Desarrollo',
    quote: '"Primero salvemos a la gente; el acero puede esperar un mes."',
    description:
      'Cuenta con gran respaldo popular. Ideal para contener el caos con planes sociales y hospitales.',
    bonuses: [
      '+18% aprobación ciudadana inicial',
      '-20% costo en planes sociales',
      'Tesorería inicial más ajustada',
    ],
    startingStats: {
      treasury: 720,
      monthlyIncome: 130,
      monthlyExpenses: 105,
      order: 50,
      approval: 64,
      congressSupport: 55,
    },
  },
  {
    id: 'estratega',
    title: 'El Estratega de Hierro',
    archetype: 'Comandante de Defensa Civil',
    quote: '"El orden se recupera hoy, o mañana no quedará ciudad."',
    description:
      'Prioriza policía, bomberos y control aduanero para frenar saqueos y desastres desde el día uno.',
    bonuses: [
      '+20% orden público inicial',
      'Bomberos y policía más efectivos',
      'Mayor tensión inicial con el Congreso',
    ],
    startingStats: {
      treasury: 800,
      monthlyIncome: 135,
      monthlyExpenses: 95,
      order: 62,
      approval: 44,
      congressSupport: 38,
    },
  },
  {
    id: 'economista',
    title: 'La Economista Pragmática',
    archetype: 'Ex-Directora del Banco Central',
    quote: '"Una ciudad futurista sin caja termina en quiebra en tres meses."',
    description:
      'Domina impuestos, aduanas y tratados internacionales para financiar la reconstrucción sin déficit.',
    bonuses: [
      '+$250k en tesorería inicial',
      '+15% recaudación aduanera y comercial',
      'Relaciones internacionales favorables',
    ],
    startingStats: {
      treasury: 1050,
      monthlyIncome: 165,
      monthlyExpenses: 95,
      order: 45,
      approval: 46,
      congressSupport: 52,
    },
  },
];

export const INITIAL_SECTORS_FALLBACK = [
  { id: 'subte', name: 'Subte Metropolitano', level: 0, maxLevel: 3, monthlyCost: 0, status: 'Destruido' },
  { id: 'puerto', name: 'Puerto Comercial', level: 0, maxLevel: 3, monthlyCost: 0, status: 'Bloqueado' },
  { id: 'energia', name: 'Red Eléctrica', level: 1, maxLevel: 3, monthlyCost: 35, status: 'Emergencia' },
  { id: 'hospital', name: 'Hospital Central', level: 1, maxLevel: 3, monthlyCost: 30, status: 'Colapsado' },
  { id: 'policia', name: 'Policía y Orden', level: 1, maxLevel: 3, monthlyCost: 15, status: 'Superado' },
  { id: 'bomberos', name: 'Bomberos', level: 1, maxLevel: 3, monthlyCost: 10, status: 'Mínimo' },
];

export function buildSecretaryBriefing(playerName, president) {
  return [
    `Bienvenido/a, Presidente ${playerName} (${president.title}). Soy Clara Vance, su Secretaria de Gobierno. Lamento recibirlo en estas condiciones: el colapso dejó a Nueva Ceniza en ruinas.`,
    `Como puede ver en el mapa, el Subte Metropolitano y el Puerto Comercial están destruidos ($0k/mes). La Red Eléctrica y el Hospital Central operan apenas en estado de emergencia, mientras la Policía y los Bomberos no dan abasto.`,
    `Atención a las cuentas: contamos con $${president.startingStats.treasury}k en tesorería. Cada nivel de mejora suma un costo fijo mensual. Si intenta volver todo futurista de golpe ($400k/mes por sector), iremos a la quiebra.`,
    `Podrá subir o bajar el nivel de las instalaciones según la caja, ajustar impuestos nacionales y aduaneros, ofrecer planes sociales, negociar leyes en el Congreso y tratar con otros países. ¡Explore la ciudad haciendo clic en los edificios destruidos!`,
  ];
}
