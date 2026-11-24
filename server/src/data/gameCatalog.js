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

export const RANDOM_EVENTS = [
  {
    id: 'inundacion_subte',
    title: 'INUNDACIÓN EN TÚNELES DEL SUBTE',
    description:
      'Las lluvias torrenciales desbordaron los desagües bajo la Av. 9 de Julio. Los túneles amenazan con colapsar.',
    options: [
      {
        label: 'Enviar cuadrillas de bombeo urgentes (-$110k)',
        effects: { treasury: -110, order: 4, approval: 5 },
      },
      {
        label: 'Cerrar estaciones temporalmente (Sin gasto)',
        effects: { treasury: 0, order: -6, approval: -8 },
      },
    ],
  },
  {
    id: 'incendio_puerto',
    title: 'INCENDIO EN DEPÓSITOS DE PUERTO MADERO',
    description:
      'Un cortocircuito inició fuego en los contenedores cercanos al Puente de la Mujer.',
    options: [
      {
        label: 'Desplegar bomberos y espuma química (-$90k)',
        effects: { treasury: -90, order: 5, approval: 4 },
      },
      {
        label: 'Aislar el muelle y dejar que se consuma',
        effects: { treasury: -20, order: -8, approval: -7 },
      },
    ],
  },
  {
    id: 'huelga_colectivos',
    title: 'PARO TOTAL DE COLECTIVOS EN 9 DE JULIO',
    description:
      'Los choferes exigen un bono de emergencia ante la suba de costos y bloquearon el Metrobus.',
    options: [
      {
        label: 'Otorgar subsidio al transporte (-$130k)',
        effects: { treasury: -130, order: 6, approval: 8 },
      },
      {
        label: 'Desalojar el piquete con la Policía',
        effects: { treasury: 0, order: 4, approval: -12, congressSupport: -4 },
      },
    ],
  },
  {
    id: 'brote_sanitario',
    title: 'BROTE RESPIRATORIO EN LA BOCA',
    description:
      'La humedad y el agua contaminada del riachuelo provocaron decenas de casos en el sur.',
    options: [
      {
        label: 'Campaña médica de emergencia (-$120k)',
        effects: { treasury: -120, order: 3, approval: 10 },
      },
      {
        label: 'Cuarentena estricta sin insumos extra',
        effects: { treasury: 0, order: -7, approval: -10 },
      },
    ],
  },
  {
    id: 'inversion_privada',
    title: 'OFERTA DE MEGACORPORACIÓN',
    description:
      'Un consorcio ofrece inyectar capital rápido a cambio de exenciones impositivas en Puerto Madero.',
    options: [
      {
        label: 'Aceptar el acuerdo (+$280k, -Aprobación)',
        effects: { treasury: 280, order: -3, approval: -9, congressSupport: -5 },
      },
      {
        label: 'Rechazar y proteger la soberanía',
        effects: { treasury: 0, order: 2, approval: 6, congressSupport: 5 },
      },
    ],
  },
  {
    id: 'hallazgo_tecnologico',
    title: 'HALLAZGO EN SUBSUELO DE RETIRO',
    description:
      'Ingenieros encontraron generadores intactos y repuestos ferroviarios en un búnker olvidado.',
    options: [
      {
        label: 'Vender excedentes y usar repuestos (+$160k)',
        effects: { treasury: 160, order: 4, approval: 4 },
      },
      {
        label: 'Donarlos a hospitales y bomberos',
        effects: { treasury: 40, order: 8, approval: 9 },
      },
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
        detail: '+$180k en tesorería y +6% Aprobación (requiere mes de espera)',
        effects: { treasury: 180, approval: 6, order: 3 },
      },
      {
        id: 'mision_medica',
        label: 'Misión Médica de Emergencia',
        detail: '+$90k y +10% Orden público',
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
        effects: { treasury: 360, monthlyExpensesDelta: 40, congressSupport: -3 },
      },
      {
        id: 'asistencia_tech',
        label: 'Convenio de Modernización',
        detail: '+$140k y +$25k/mes de ingresos por patentes',
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
        effects: { monthlyIncomeDelta: 65, congressSupport: 5, approval: 4 },
      },
      {
        id: 'convoy_alimentos',
        label: 'Convoy de Suministros',
        detail: '+$120k en insumos y +8% Orden',
        effects: { treasury: 120, order: 8, approval: 6 },
      },
    ],
  },
];
