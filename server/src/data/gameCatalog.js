export const GAME_MODES = [
  {
    id: 'mandato',
    name: 'Mandato Presidencial (36 Meses)',
    desc: 'Reconstruye Buenos Aires y llega al Mes 36 para desbloquear tu final.',
  },
  {
    id: 'infinito',
    name: 'Supervivencia Infinita',
    desc: 'Sin límite de tiempo. Enfrenta climas extremos y crisis crecientes.',
  },
  {
    id: 'sin_deuda',
    name: 'Desafío: Cero Deuda Externa',
    desc: 'No puedes tomar créditos con intereses de potencias extranjeras.',
  },
];

export const SECTOR_LEVELS = {
  subte: [
    { level: 0, status: 'Destruido', upgradeCost: 0, monthlyCost: 0, incomeBonus: 0, orderBonus: 0, approvalBonus: 0 },
    { level: 1, status: 'Emergencia', upgradeCost: 140, monthlyCost: 60, incomeBonus: 35, orderBonus: 4, approvalBonus: 5 },
    { level: 2, status: 'Estándar', upgradeCost: 280, monthlyCost: 150, incomeBonus: 95, orderBonus: 8, approvalBonus: 10 },
    { level: 3, status: 'Futurista', upgradeCost: 520, monthlyCost: 400, incomeBonus: 230, orderBonus: 14, approvalBonus: 18 },
  ],
  puerto: [
    { level: 0, status: 'Bloqueado', upgradeCost: 0, monthlyCost: 0, incomeBonus: 0, orderBonus: 0, approvalBonus: 0 },
    { level: 1, status: 'Muelle Básico', upgradeCost: 160, monthlyCost: 50, incomeBonus: 70, orderBonus: 2, approvalBonus: 4 },
    { level: 2, status: 'Comercial', upgradeCost: 320, monthlyCost: 140, incomeBonus: 165, orderBonus: 5, approvalBonus: 8 },
    { level: 3, status: 'Megapuerto', upgradeCost: 560, monthlyCost: 380, incomeBonus: 340, orderBonus: 10, approvalBonus: 14 },
  ],
  energia: [
    { level: 0, status: 'Apagón Total', upgradeCost: 0, monthlyCost: 0, incomeBonus: 0, orderBonus: -8, approvalBonus: -10 },
    { level: 1, status: 'Emergencia', upgradeCost: 110, monthlyCost: 35, incomeBonus: 20, orderBonus: 0, approvalBonus: 0 },
    { level: 2, status: 'Red Estable', upgradeCost: 240, monthlyCost: 110, incomeBonus: 75, orderBonus: 6, approvalBonus: 8 },
    { level: 3, status: 'Reactor Limpio', upgradeCost: 460, monthlyCost: 290, incomeBonus: 185, orderBonus: 12, approvalBonus: 15 },
  ],
  hospital: [
    { level: 0, status: 'Abandonado', upgradeCost: 0, monthlyCost: 0, incomeBonus: 0, orderBonus: -5, approvalBonus: -12 },
    { level: 1, status: 'Colapsado', upgradeCost: 100, monthlyCost: 30, incomeBonus: 10, orderBonus: 2, approvalBonus: 2 },
    { level: 2, status: 'Operativo', upgradeCost: 220, monthlyCost: 95, incomeBonus: 35, orderBonus: 7, approvalBonus: 12 },
    { level: 3, status: 'Bio-Centro', upgradeCost: 420, monthlyCost: 260, incomeBonus: 80, orderBonus: 12, approvalBonus: 22 },
  ],
  policia: [
    { level: 0, status: 'Sin Control', upgradeCost: 0, monthlyCost: 0, incomeBonus: 0, orderBonus: -15, approvalBonus: -5 },
    { level: 1, status: 'Mínimo', upgradeCost: 90, monthlyCost: 25, incomeBonus: 5, orderBonus: 5, approvalBonus: 0 },
    { level: 2, status: 'Coordinado', upgradeCost: 200, monthlyCost: 85, incomeBonus: 25, orderBonus: 16, approvalBonus: 6 },
    { level: 3, status: 'Drones y Defensa', upgradeCost: 390, monthlyCost: 230, incomeBonus: 55, orderBonus: 28, approvalBonus: 10 },
  ],
};

export const SOCIAL_PLANS = [
  {
    id: 'tarjeta_alimentaria',
    name: 'Tarjeta Alimentaria',
    monthlyCost: 45,
    incomeBonus: 0,
    approvalBonus: 8,
    orderBonus: 5,
    detail: 'Raciones básicas en barrios vulnerables. +8% Aprobación, +5% Orden.',
  },
  {
    id: 'subsidio_vivienda',
    name: 'Subsidio de Vivienda',
    monthlyCost: 65,
    incomeBonus: 10,
    approvalBonus: 10,
    orderBonus: 6,
    detail: 'Reconstrucción habitacional en La Boca y Boedo. +10% Aprobación, +6% Orden.',
  },
  {
    id: 'empleo_obras',
    name: 'Plan Empleo en Obras',
    monthlyCost: 55,
    incomeBonus: 30,
    approvalBonus: 6,
    orderBonus: 4,
    detail: 'Cuadrillas barriales de limpieza y reconstrucción. +$30k/mes productividad.',
  },
  {
    id: 'becas_uba',
    name: 'Becas Técnicas UBA',
    monthlyCost: 40,
    incomeBonus: 40,
    approvalBonus: 5,
    orderBonus: 2,
    detail: 'Capacitación tecnológica para reactivar la economía. +$40k/mes ingresos.',
  },
];

export const CONGRESS_LAWS = [
  {
    id: 'emergencia_economica',
    name: 'Ley de Emergencia Económica',
    detail: '+$60k/mes ingresos fiscales, -5% Aprobación.',
    difficulty: 45,
    effects: { monthlyIncomeDelta: 60, approval: -5 },
  },
  {
    id: 'modernizacion_portuaria',
    name: 'Ley de Modernización Portuaria',
    detail: '+$85k/mes comercio exterior, +4% Orden.',
    difficulty: 52,
    effects: { monthlyIncomeDelta: 85, order: 4 },
  },
  {
    id: 'seguridad_nacional',
    name: 'Ley de Seguridad Nacional',
    detail: '+14% Orden público, -6% Aprobación.',
    difficulty: 50,
    effects: { order: 14, approval: -6 },
  },
  {
    id: 'transicion_energetica',
    name: 'Ley de Transición Energética',
    detail: '-$45k/mes gastos fijos estatales, +6% Aprobación.',
    difficulty: 48,
    effects: { monthlyExpensesDelta: -45, approval: 6 },
  },
  {
    id: 'pacto_gremial',
    name: 'Ley de Paritarias y Paz Social',
    detail: '+10% Aprobación, +8% Orden, +$35k/mes gasto.',
    difficulty: 42,
    effects: { approval: 10, order: 8, monthlyExpensesDelta: 35 },
  },
  {
    id: 'zona_franca_madero',
    name: 'Ley de Zona Franca en Puerto Madero',
    detail: '+$100k/mes ingresos, -4% Congreso, +3% Orden.',
    difficulty: 58,
    effects: { monthlyIncomeDelta: 100, order: 3 },
  },
  {
    id: 'emergencia_sanitaria',
    name: 'Ley de Emergencia Sanitaria',
    detail: '+12% Aprobación, +6% Orden, +$25k/mes gasto.',
    difficulty: 44,
    effects: { approval: 12, order: 6, monthlyExpensesDelta: 25 },
  },
  {
    id: 'blanqueo_reconstruccion',
    name: 'Ley de Blanqueo para Reconstrucción',
    detail: '+$260k inmediatos en caja, -7% Aprobación.',
    difficulty: 54,
    effects: { treasury: 260, approval: -7 },
  },
  {
    id: 'control_contrabando',
    name: 'Ley de Control Aduanero y Antinarcóticos',
    detail: '+12% Orden, +$45k/mes ingresos aduaneros.',
    difficulty: 50,
    effects: { order: 12, monthlyIncomeDelta: 45 },
  },
  {
    id: 'reforma_transporte',
    name: 'Ley de Integración Subte-Metrobus',
    detail: '+$55k/mes ingresos, +7% Aprobación.',
    difficulty: 49,
    effects: { monthlyIncomeDelta: 55, approval: 7 },
  },
  {
    id: 'impuesto_grandes_fortunas',
    name: 'Aporte Solidario de Grandes Fortunas',
    detail: '+$320k inmediatos, +5% Aprobación, -6% Congreso.',
    difficulty: 60,
    effects: { treasury: 320, approval: 5 },
  },
  {
    id: 'fomento_cultura_barrios',
    name: 'Ley de Fomento Cultural (Colón y La Boca)',
    detail: '+14% Aprobación, +$30k/mes turismo, +$15k/mes gasto.',
    difficulty: 40,
    effects: { approval: 14, monthlyIncomeDelta: 30, monthlyExpensesDelta: 15 },
  },
];

export function pickCongressAgenda(passedLaws = [], excludeIds = []) {
  const remaining = CONGRESS_LAWS.filter((l) => !passedLaws.includes(l.id));
  const fresh = remaining.filter((l) => !excludeIds.includes(l.id));
  const pool = fresh.length >= 3 ? [...fresh] : [...remaining];
  // Mezcla simple Fisher-Yates
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3).map((l) => l.id);
}

export const SPECIAL_PROJECTS = [
  {
    id: 'muro_sudestada',
    name: 'Muro Anti-Sudestada en Costanera',
    cost: 420,
    monthsRequired: 3,
    detail: 'Protege Puerto Madero y La Boca contra Sudestadas. +10% Orden al terminar.',
    effects: { order: 10, approval: 6 },
  },
  {
    id: 'red_ferroviaria',
    name: 'Red Ferroviaria Retiro-Constitución',
    cost: 480,
    monthsRequired: 3,
    detail: 'Reactiva trenes de carga y pasajeros. +$115k/mes permanentes.',
    effects: { monthlyIncomeDelta: 115, approval: 8 },
  },
  {
    id: 'polo_uba',
    name: 'Polo Científico UBA',
    cost: 390,
    monthsRequired: 2,
    detail: 'Reduce un 20% el costo de todas las mejoras futuras de infraestructura.',
    effects: { approval: 7, congressSupport: 6 },
  },
  {
    id: 'estadio_nacional',
    name: 'Reconstrucción de Estadios (Bombonera/Monumental)',
    cost: 320,
    monthsRequired: 2,
    detail: 'Eventos deportivos y culturales masivos. +16% Aprobación y +$45k/mes.',
    effects: { approval: 16, monthlyIncomeDelta: 45 },
  },
];

export const WEATHERS = [
  { id: 'despejado', name: 'Nublado Estable', effectText: 'Sin penalizaciones climáticas.' },
  {
    id: 'sudestada',
    name: 'Sudestada en el Río',
    effectText: 'Inundaciones en el sur y puerto (-$40k y -4% Orden sin Muro Anti-Sudestada).',
  },
  {
    id: 'ola_calor',
    name: 'Ola de Calor Extrema',
    effectText: 'Alta demanda eléctrica (-5% Aprobación si Energía < Nivel 2).',
  },
  {
    id: 'ceniza',
    name: 'Tormenta de Ceniza',
    effectText: 'Desgaste urbano (-$30k en limpieza y -3% Orden).',
  },
];

export const RANDOM_EVENTS = [
  {
    id: 'inundacion_subte',
    title: 'INUNDACIÓN EN TÚNELES DEL SUBTE',
    description:
      'Las lluvias torrenciales desbordaron los desagües bajo la Av. 9 de Julio. Los túneles amenazan con colapsar.',
    options: [
      { label: 'Enviar cuadrillas de bombeo urgentes (-$110k)', effects: { treasury: -110, order: 4, approval: 5 } },
      { label: 'Cerrar estaciones temporalmente (Sin gasto)', effects: { treasury: 0, order: -6, approval: -8 } },
    ],
  },
  {
    id: 'incendio_puerto',
    title: 'INCENDIO EN DEPÓSITOS DE PUERTO MADERO',
    description: 'Un cortocircuito inició fuego en los contenedores cercanos al Puente de la Mujer.',
    options: [
      { label: 'Desplegar bomberos y espuma química (-$90k)', effects: { treasury: -90, order: 5, approval: 4 } },
      { label: 'Aislar el muelle y dejar que se consuma', effects: { treasury: -20, order: -8, approval: -7 } },
    ],
  },
  {
    id: 'huelga_colectivos',
    title: 'PARO GREMIAL DE COLECTIVOS EN 9 DE JULIO',
    description: 'Los sindicatos de transporte exigen un bono de emergencia y bloquearon el Metrobus.',
    options: [
      { label: 'Negociar bono salarial (-$130k)', effects: { treasury: -130, order: 6, approval: 8 } },
      { label: 'Desalojar el piquete con la Policía', effects: { treasury: 0, order: 4, approval: -12, congressSupport: -4 } },
    ],
  },
  {
    id: 'brote_sanitario',
    title: 'BROTE RESPIRATORIO EN LA BOCA',
    description: 'La humedad y el agua contaminada del riachuelo provocaron decenas de casos en el sur.',
    options: [
      { label: 'Campaña médica de emergencia (-$120k)', effects: { treasury: -120, order: 3, approval: 10 } },
      { label: 'Cuarentena estricta sin insumos extra', effects: { treasury: 0, order: -7, approval: -10 } },
    ],
  },
  {
    id: 'contrabando_puerto',
    title: 'RED DE MERCADO NEGRO EN EL PUERTO',
    description: 'Aduaneros detectaron barcos descargando mercadería ilegal sin pagar aranceles.',
    options: [
      { label: 'Operativo policial y decomiso (+$140k, +Orden)', effects: { treasury: 140, order: 7, approval: 4 } },
      { label: 'Mirar para otro lado para evitar enfrentamientos', effects: { treasury: -40, order: -8, approval: -5 } },
    ],
  },
  {
    id: 'inversion_privada',
    title: 'OFERTA DE MEGACORPORACIÓN',
    description: 'Un consorcio ofrece inyectar capital rápido a cambio de exenciones impositivas en Puerto Madero.',
    options: [
      { label: 'Aceptar el acuerdo (+$280k, -Aprobación)', effects: { treasury: 280, order: -3, approval: -9, congressSupport: -5 } },
      { label: 'Rechazar y proteger la soberanía', effects: { treasury: 0, order: 2, approval: 6, congressSupport: 5 } },
    ],
  },
  {
    id: 'hallazgo_tecnologico',
    title: 'HALLAZGO EN SUBSUELO DE RETIRO',
    description: 'Ingenieros encontraron generadores intactos y repuestos ferroviarios en un búnker olvidado.',
    options: [
      { label: 'Vender excedentes y usar repuestos (+$160k)', effects: { treasury: 160, order: 4, approval: 4 } },
      { label: 'Donarlos a hospitales y bomberos', effects: { treasury: 40, order: 8, approval: 9 } },
    ],
  },
];

export const FOREIGN_POWERS = [
  {
    id: 'union_euro',
    name: 'Unión Euro-Atlántica',
    relation: 'Aliado',
    specialty: 'Ayuda Humanitaria y Salud',
    description: 'Financia reconstrucción civil, hospitales y estabilidad democrática.',
    actions: [
      {
        id: 'ayuda_humanitaria',
        label: 'Solicitar Ayuda Humanitaria',
        detail: '+$180k en tesorería y +6% Aprobación',
        isLoan: false,
        effects: { treasury: 180, approval: 6, order: 3 },
      },
      {
        id: 'mision_medica',
        label: 'Misión Médica de Emergencia',
        detail: '+$90k y +10% Orden público',
        isLoan: false,
        effects: { treasury: 90, order: 10, approval: 5 },
      },
    ],
  },
  {
    id: 'bloque_pacifico',
    name: 'Bloque Tecnológico del Pacífico',
    relation: 'Neutral',
    specialty: 'Infraestructura Futurista',
    description: 'Potencia industrial interesada en contratos de transporte y energía.',
    actions: [
      {
        id: 'credito_infra',
        label: 'Crédito de Reconstrucción',
        detail: '+$360k inmediatos (+$40k/mes de intereses)',
        isLoan: true,
        effects: { treasury: 360, monthlyExpensesDelta: 40, congressSupport: -3 },
      },
      {
        id: 'asistencia_tech',
        label: 'Convenio de Modernización',
        detail: '+$140k y +$25k/mes de ingresos por patentes',
        isLoan: false,
        effects: { treasury: 140, monthlyIncomeDelta: 25, approval: 3 },
      },
    ],
  },
  {
    id: 'liga_sur',
    name: 'Liga Sudamericana del Sur',
    relation: 'Socio Estratégico',
    specialty: 'Comercio Portuario y Alimentos',
    description: 'Países vecinos listos para reactivar el comercio por Puerto Madero.',
    actions: [
      {
        id: 'tratado_portuario',
        label: 'Tratado Comercial Portuario',
        detail: '+$65k/mes de ingresos permanentes y +5% Congreso',
        isLoan: false,
        effects: { monthlyIncomeDelta: 65, congressSupport: 5, approval: 4 },
      },
      {
        id: 'convoy_alimentos',
        label: 'Convoy de Suministros',
        detail: '+$120k en insumos y +8% Orden',
        isLoan: false,
        effects: { treasury: 120, order: 8, approval: 6 },
      },
    ],
  },
];
