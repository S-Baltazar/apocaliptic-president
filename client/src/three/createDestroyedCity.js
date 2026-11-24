import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCityTextures } from './pixelTextures.js';

const SECTOR_METADATA = {
  subte: {
    id: 'subte',
    title: 'SUBTE PORTEÑO',
    status: 'Nivel 0 — Destruido',
    monthlyCost: 0,
    description:
      'Bocas de subte inundadas bajo la Av. 9 de Julio. Dejarlo roto cuesta $0k/mes; llevarlo a nivel futurista costará $400k/mes.',
  },
  puerto: {
    id: 'puerto',
    title: 'PUERTO MADERO',
    status: 'Nivel 0 — Bloqueado',
    monthlyCost: 0,
    description:
      'Puente de la Mujer quebrado sobre el dique contaminado, depósitos y grúas caídas. Repararlo habilita el comercio exterior y aranceles.',
  },
  congreso: {
    id: 'congreso',
    title: 'CONGRESO DE LA NACIÓN',
    status: 'Cúpula Dañada — En Sesión',
    monthlyCost: 0,
    description:
      'Sede del Poder Legislativo. Aquí propondrás leyes y negociarás votos con los bloques para aprobar reformas.',
  },
  casa_rosada: {
    id: 'casa_rosada',
    title: 'CASA ROSADA',
    status: 'Sede Presidencial — Emergencia',
    monthlyCost: 0,
    description:
      'Tu centro de mando frente a Plaza de Mayo. Coordina el gabinete, los planes sociales y las relaciones internacionales.',
  },
  energia: {
    id: 'energia',
    title: 'CENTRAL ELÉCTRICA',
    status: 'Nivel 1 — Emergencia',
    monthlyCost: 35,
    description:
      'Usina portuaria operando con generadores diésel de emergencia. Hay apagones rotativos en los barrios.',
  },
  hospital: {
    id: 'hospital',
    title: 'HOSPITAL CENTRAL',
    status: 'Nivel 1 — Colapsado',
    monthlyCost: 30,
    description:
      'Pabellones dañados y falta de insumos médicos. Clave para evitar epidemias tras el desastre.',
  },
  policia: {
    id: 'policia',
    title: 'COMISARÍA Y BOMBEROS',
    status: 'Nivel 1 — Mínimo',
    monthlyCost: 25,
    description:
      'Cuartel conjunto de policía y bomberos. Si recortas demasiado su presupuesto, los saqueos e incendios destruirán otros edificios.',
  },
};

export function createDestroyedCity(container, onSelectSector) {
  const tex = createCityTextures();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#272932');
  scene.fog = new THREE.FogExp2('#272932', 0.0055);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 400);
  camera.position.set(48, 40, 62);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
  });
  const PIXEL_SCALE = 0.48;
  renderer.setPixelRatio(PIXEL_SCALE);
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minDistance = 18;
  controls.maxDistance = 125;
  controls.target.set(-4, 1.5, 0);

  // Iluminación realista apocalíptica
  const hemiLight = new THREE.HemisphereLight('#c4cedb', '#3a3832', 1.1);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight('#f6d7a7', 1.45);
  sunLight.position.set(55, 78, 42);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -80;
  sunLight.shadow.camera.right = 80;
  sunLight.shadow.camera.top = 75;
  sunLight.shadow.camera.bottom = -75;
  scene.add(sunLight);

  const emergencyLight = new THREE.PointLight('#ef4444', 9, 26);
  emergencyLight.position.set(-4, 6, -12);
  scene.add(emergencyLight);

  const outlineMat = new THREE.LineBasicMaterial({ color: '#111318' });
  function makeBox(w, h, d, materialOrColor, outline = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat =
      typeof materialOrColor === 'string'
        ? new THREE.MeshLambertMaterial({ color: materialOrColor })
        : materialOrColor;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (outline) {
      const edges = new THREE.EdgesGeometry(geo);
      mesh.add(new THREE.LineSegments(edges, outlineMat));
    }
    return mesh;
  }

  // Materiales texturizados reutilizables
  const mats = {
    asphalt: new THREE.MeshLambertMaterial({ map: tex.asphalt }),
    cobble: new THREE.MeshLambertMaterial({ map: tex.cobblestone }),
    water: new THREE.MeshLambertMaterial({ map: tex.dirtyWater }),
    brick: new THREE.MeshLambertMaterial({ map: tex.redBrick }),
    rosada: new THREE.MeshLambertMaterial({ map: tex.casaRosadaFacade }),
    limestone: new THREE.MeshLambertMaterial({ map: tex.limestoneFacade }),
    copper: new THREE.MeshLambertMaterial({ map: tex.oxidizedCopper }),
    ruined: new THREE.MeshLambertMaterial({ map: tex.ruinedConcrete }),
    glass: new THREE.MeshLambertMaterial({ map: tex.brokenGlassTower }),
    grass: new THREE.MeshLambertMaterial({ map: tex.overgrownGrass }),
    track: new THREE.MeshLambertMaterial({ map: tex.trainTrack }),
  };

  const interactives = [];
  function registerInteractive(groupOrMesh, sectorKey) {
    groupOrMesh.traverse((child) => {
      if (child.isMesh) {
        child.userData.sectorKey = sectorKey;
        interactives.push(child);
      }
    });
  }

  // =========================================================================
  // 1. TERRENO EXPANDIDO DE BUENOS AIRES (150 x 130) + RÍO DE LA PLATA
  // =========================================================================
  const cityGround = makeBox(112, 1.4, 128, mats.cobble, false);
  cityGround.position.set(-18, -0.7, 0);
  scene.add(cityGround);

  // Dique de Puerto Madero + Río de la Plata
  const canalWater = makeBox(20, 0.5, 128, mats.water, false);
  canalWater.position.set(48, -0.45, 0);
  scene.add(canalWater);

  const eastDock = makeBox(20, 1.4, 128, mats.cobble, false);
  eastDock.position.set(68, -0.7, 0);
  scene.add(eastDock);

  // Bordes de ladrillo rojo de Puerto Madero
  const brickLeft = makeBox(1.8, 1.8, 128, mats.brick);
  brickLeft.position.set(38, -0.2, 0);
  scene.add(brickLeft);

  const brickRight = makeBox(1.8, 1.8, 128, mats.brick);
  brickRight.position.set(58, -0.2, 0);
  scene.add(brickRight);

  // Avenidas principales asfaltadas
  const roads = [
    [-4, 0, 9.5, 126],     // Av. 9 de Julio (N-S)
    [28, 0, 6.0, 126],     // Av. Paseo Colón / Madero (N-S)
    [-34, 0, 5.5, 126],    // Av. Callao / Entre Ríos (N-S)
    [-18, 0, 110, 6.8],    // Av. de Mayo (E-O)
    [-18, -22, 110, 5.5],  // Av. Corrientes (E-O)
    [-18, -44, 110, 5.0],  // Av. del Libertador / Retiro (E-O)
    [-18, 22, 110, 5.2],   // Av. San Juan (E-O)
    [-18, 44, 110, 5.0],   // Av. Suárez / La Boca (E-O)
  ];
  roads.forEach(([x, z, w, d]) => {
    const r = makeBox(w, 0.12, d, mats.asphalt, false);
    r.position.set(x, 0.06, z);
    scene.add(r);
  });

  // Bulevar central verde de Av. 9 de Julio + Metrobus y colectivos abandonados
  const av9Median = makeBox(1.8, 0.18, 122, mats.grass, false);
  av9Median.position.set(-4, 0.09, 0);
  scene.add(av9Median);

  [-30, -6, 12, 32].forEach((zPos, i) => {
    const bus = makeBox(1.5, 1.6, 4.2, i % 2 === 0 ? '#1d4ed8' : '#b91c1c');
    bus.position.set(-1.6, 0.9, zPos);
    bus.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.12;
    scene.add(bus);
  });

  // =========================================================================
  // 2. PLAZA DE MAYO, CASA ROSADA Y EL CABILDO
  // =========================================================================
  const plazaMayo = makeBox(18, 0.22, 18, mats.grass, false);
  plazaMayo.position.set(10, 0.11, 0);
  scene.add(plazaMayo);

  const piramideMayo = makeBox(1.4, 5.5, 1.4, '#d9d5c9');
  piramideMayo.position.set(10, 2.8, 0);
  scene.add(piramideMayo);

  // Casa Rosada (Este de Plaza de Mayo)
  const casaRosada = new THREE.Group();
  const crMain = makeBox(10, 6.2, 16, mats.rosada);
  crMain.position.y = 3.1;
  const crPortico = makeBox(2.8, 5.4, 6, mats.rosada);
  crPortico.position.set(-5.4, 2.7, 0);
  const crRoof = makeBox(9.6, 0.9, 15.2, '#4a4e54');
  crRoof.position.y = 6.6;
  const crHole = makeBox(4.2, 1.0, 5.6, '#18191d');
  crHole.position.set(0.6, 6.7, 1.5);
  [-3, 0, 3].forEach((zOff) => {
    const bar = makeBox(0.7, 1.0, 2.4, '#8b8d8e');
    bar.position.set(-7.6, 0.5, zOff);
    casaRosada.add(bar);
  });
  casaRosada.add(crMain, crPortico, crRoof, crHole);
  casaRosada.position.set(21, 0, 0);
  scene.add(casaRosada);
  registerInteractive(casaRosada, 'casa_rosada');

  // El Cabildo (Oeste de Plaza de Mayo)
  const cabildo = new THREE.Group();
  const cabBody = makeBox(5.2, 4.4, 12, '#d9d5c9');
  cabBody.position.y = 2.2;
  const cabRoof = makeBox(5.4, 0.8, 12.2, mats.brick);
  cabRoof.position.y = 4.8;
  const cabTower = makeBox(3.4, 4.8, 3.4, '#d9d5c9');
  cabTower.position.y = 7.0;
  const cabCupola = makeBox(2.6, 1.6, 2.6, mats.brick);
  cabCupola.position.y = 10.0;
  const cabFlag = makeBox(0.2, 1.8, 2.2, '#62b5e5');
  cabFlag.position.set(0, 9.2, 2.4);
  cabildo.add(cabBody, cabRoof, cabTower, cabCupola, cabFlag);
  cabildo.position.set(1, 0, 0);
  scene.add(cabildo);

  // =========================================================================
  // 3. EL OBELISCO EN RUINAS + BOCAS DE SUBTE PORTEÑO
  // =========================================================================
  const obelisco = new THREE.Group();
  const obBase = makeBox(7.2, 0.5, 7.2, mats.cobble);
  obBase.position.y = 0.25;
  const obShaft1 = makeBox(2.8, 9.5, 2.8, '#c5bfb0');
  obShaft1.position.y = 5.0;
  const obShaft2 = makeBox(2.2, 7.2, 2.2, '#b3ada0');
  obShaft2.position.y = 13.3;
  const obBroken = makeBox(1.8, 1.6, 1.8, '#8f897d');
  obBroken.position.set(0.1, 17.5, 0);
  obBroken.rotation.z = 0.08;
  const rebar1 = makeBox(0.2, 1.8, 0.2, '#7c3f28', false);
  rebar1.position.set(-0.3, 18.8, 0.2);
  rebar1.rotation.z = 0.16;
  const obIvy = makeBox(0.7, 8.8, 0.7, '#436436');
  obIvy.position.set(1.3, 5.2, 1.0);
  obelisco.add(obBase, obShaft1, obShaft2, obBroken, rebar1, obIvy);
  obelisco.position.set(-4, 0, -22);
  scene.add(obelisco);

  // Subte Porteño (2 bocas icónicas sobre Av. 9 de Julio)
  [
    [-11.5, -12],
    [-11.5, 11],
  ].forEach(([sx, sz]) => {
    const subte = new THREE.Group();
    const sBase = makeBox(5.2, 0.5, 5.8, mats.cobble);
    sBase.position.y = 0.25;
    const sStairs = makeBox(3.6, 0.4, 4.2, '#1f2126');
    sStairs.position.set(0, 0.42, 0.4);
    const sArch = makeBox(4.4, 2.6, 0.5, '#2f5e41');
    sArch.position.set(0, 1.5, -1.8);
    const sSign = makeBox(2.4, 0.7, 0.6, '#1f3f2c');
    sSign.position.set(0, 2.4, -1.8);
    subte.add(sBase, sStairs, sArch, sSign);
    subte.position.set(sx, 0, sz);
    scene.add(subte);
    registerInteractive(subte, 'subte');
  });

  // =========================================================================
  // 4. CONGRESO DE LA NACIÓN (Oeste de Av. de Mayo)
  // =========================================================================
  const congreso = new THREE.Group();
  const congBase = makeBox(13, 5.6, 17, mats.limestone);
  congBase.position.y = 2.8;
  const congSteps = makeBox(3.2, 1.4, 9.0, '#9d9889');
  congSteps.position.set(7.6, 0.7, 0);
  const congPediment = makeBox(3.6, 2.6, 9.2, '#c6c0af');
  congPediment.position.set(5.4, 6.8, 0);
  const congDrum = makeBox(6.4, 3.2, 6.4, mats.limestone);
  congDrum.position.set(0, 7.2, 0);
  const congDome = new THREE.Mesh(
    new THREE.SphereGeometry(3.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.copper
  );
  congDome.position.set(0, 8.8, 0);
  congDome.castShadow = true;
  const domeHole = makeBox(2.1, 1.8, 2.1, '#2b241d');
  domeHole.position.set(1.4, 10.0, 1.1);
  congreso.add(congBase, congSteps, congPediment, congDrum, congDome, domeHole);
  congreso.position.set(-50, 0, 0);
  scene.add(congreso);
  registerInteractive(congreso, 'congreso');

  // =========================================================================
  // 5. PUERTO MADERO, PUENTE DE LA MUJER Y TORRES MODERNAS (Este)
  // =========================================================================
  const puertoGroup = new THREE.Group();
  const bridgeLeft = makeBox(9.2, 0.6, 2.8, '#e2e8f0');
  bridgeLeft.position.set(42.8, 1.3, 6);
  bridgeLeft.rotation.z = -0.14;
  const bridgeRight = makeBox(8.6, 0.6, 2.8, '#cbd5e1');
  bridgeRight.position.set(53.4, 1.2, 6);
  bridgeRight.rotation.z = 0.16;
  const mast = makeBox(0.8, 11.5, 0.8, '#f1f5f9');
  mast.position.set(46.5, 5.6, 6);
  mast.rotation.z = -0.45;

  const dockWarehouse1 = makeBox(7.2, 4.2, 12, mats.brick);
  dockWarehouse1.position.set(65, 2.1, -10);
  const dockWarehouse2 = makeBox(7.2, 4.0, 11, mats.brick);
  dockWarehouse2.position.set(65, 2.0, 16);
  const crane = makeBox(1.1, 9.0, 1.1, '#b45309');
  crane.position.set(60, 4.5, 24);
  crane.rotation.z = 0.22;

  // Torres Gemelas y Torre Curva de Puerto Madero
  const pmTower1 = makeBox(5.5, 17, 5.5, mats.glass);
  pmTower1.position.set(68, 8.5, -34);
  const pmTower2 = makeBox(5.5, 15, 5.5, mats.glass);
  pmTower2.position.set(68, 7.5, -26);
  const pmCurved = makeBox(6.0, 19, 5.0, mats.glass);
  pmCurved.position.set(68, 9.5, 36);
  pmCurved.rotation.y = 0.25;

  puertoGroup.add(
    bridgeLeft,
    bridgeRight,
    mast,
    dockWarehouse1,
    dockWarehouse2,
    crane,
    pmTower1,
    pmTower2,
    pmCurved
  );
  scene.add(puertoGroup);
  registerInteractive(puertoGroup, 'puerto');

  // =========================================================================
  // 6. ZONA NORTE: TEATRO COLÓN, FACULTAD DE DERECHO, FLORALIS, RETIRO Y MONUMENTAL
  // =========================================================================
  // Teatro Colón
  const colon = new THREE.Group();
  const colonBody = makeBox(11, 6.0, 12, mats.limestone);
  colonBody.position.y = 3.0;
  const colonRoof = makeBox(10.2, 1.8, 11.2, mats.copper);
  colonRoof.position.y = 6.9;
  colon.add(colonBody, colonRoof);
  colon.position.set(-18, 0, -32);
  scene.add(colon);

  // Floralis Genérica (Parque Norte)
  const floralis = new THREE.Group();
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(6.5, 6.5, 0.5, 16),
    mats.water
  );
  pool.position.y = 0.25;
  floralis.add(pool);
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = makeBox(1.4, 5.0, 0.4, '#94a3b8');
    petal.position.set(Math.cos(angle) * 2.4, 2.6, Math.sin(angle) * 2.4);
    petal.rotation.y = -angle;
    petal.rotation.z = 0.28;
    floralis.add(petal);
  }
  const fallenPetal = makeBox(1.4, 4.2, 0.4, '#64748b');
  fallenPetal.position.set(-2.8, 0.5, 2.2);
  fallenPetal.rotation.z = Math.PI / 2.2;
  floralis.add(fallenPetal);
  floralis.position.set(10, 0, -34);
  scene.add(floralis);

  // Facultad de Derecho UBA (Norte)
  const uba = new THREE.Group();
  const ubaBody = makeBox(15, 5.2, 10, mats.limestone);
  ubaBody.position.y = 2.6;
  const ubaSteps = makeBox(12, 1.2, 3.2, '#9d9889');
  ubaSteps.position.set(0, 0.6, 6.2);
  uba.add(ubaBody, ubaSteps);
  uba.position.set(-16, 0, -54);
  scene.add(uba);

  // Estación Retiro + Vías de Tren + Vagón Descarrilado + Torre Monumental
  const tracks = makeBox(8, 0.14, 52, mats.track, false);
  tracks.position.set(18, 0.08, -38);
  scene.add(tracks);

  const derailedCar = makeBox(2.4, 2.2, 6.8, '#8c4c3e');
  derailedCar.position.set(17.5, 1.1, -28);
  derailedCar.rotation.y = 0.35;
  derailedCar.rotation.z = 0.18;
  scene.add(derailedCar);

  const retiro = new THREE.Group();
  const retHall = makeBox(12, 6.2, 14, mats.limestone);
  retHall.position.y = 3.1;
  const retArch = makeBox(10, 3.2, 14.5, mats.copper);
  retArch.position.y = 7.4;
  retiro.add(retHall, retArch);
  retiro.position.set(18, 0, -54);
  scene.add(retiro);

  const torreIngleses = new THREE.Group();
  const tiBase = makeBox(4.0, 12.5, 4.0, mats.brick);
  tiBase.position.y = 6.25;
  const tiRoof = makeBox(3.4, 2.8, 3.4, mats.copper);
  tiRoof.position.y = 13.8;
  torreIngleses.add(tiBase, tiRoof);
  torreIngleses.position.set(29, 0, -52);
  scene.add(torreIngleses);

  // Estadio Monumental (Noroeste)
  const monumental = new THREE.Mesh(
    new THREE.CylinderGeometry(11, 11, 4.5, 16, 1, true),
    mats.ruined
  );
  monumental.position.set(-54, 2.25, -48);
  monumental.castShadow = true;
  scene.add(monumental);
  const monField = makeBox(14, 0.2, 14, mats.grass, false);
  monField.position.set(-54, 0.1, -48);
  scene.add(monField);

  // =========================================================================
  // 7. SECTORES CLAVE + BARRIOS: HOSPITAL, COMISARÍA, CENTRAL, ABASTO, LA BOCA
  // =========================================================================
  // Hospital Central
  const hospital = new THREE.Group();
  const hospMain = makeBox(10, 5.4, 8.5, mats.limestone);
  hospMain.position.y = 2.7;
  const hospWing = makeBox(5.2, 3.8, 5.2, mats.ruined);
  hospWing.position.set(5.5, 1.9, 1.6);
  const cross1 = makeBox(2.2, 0.6, 0.3, '#ef4444');
  cross1.position.set(0, 4.0, 4.4);
  const cross2 = makeBox(0.6, 2.2, 0.3, '#ef4444');
  cross2.position.set(0, 4.0, 4.4);
  hospital.add(hospMain, hospWing, cross1, cross2);
  hospital.position.set(-22, 0, 12);
  scene.add(hospital);
  registerInteractive(hospital, 'hospital');

  // Comisaría y Bomberos
  const police = new THREE.Group();
  const polBody = makeBox(8.2, 3.6, 7.2, '#274075');
  polBody.position.y = 1.8;
  const fireBay = makeBox(4.5, 3.2, 6.2, mats.brick);
  fireBay.position.set(5.8, 1.6, 0);
  police.add(polBody, fireBay);
  police.position.set(10, 0, 14);
  scene.add(police);
  registerInteractive(police, 'policia');

  // Central Eléctrica (Sur-Este)
  const powerPlant = new THREE.Group();
  const ppBody = makeBox(9.0, 4.8, 8.0, mats.brick);
  ppBody.position.y = 2.4;
  const ch1 = makeBox(1.8, 9.5, 1.8, '#4b5563');
  ch1.position.set(-2.2, 5.2, -1.8);
  const ch2 = makeBox(1.8, 8.6, 1.8, '#4b5563');
  ch2.position.set(2.2, 4.8, -1.8);
  powerPlant.add(ppBody, ch1, ch2);
  powerPlant.position.set(16, 0, 34);
  scene.add(powerPlant);
  registerInteractive(powerPlant, 'energia');

  // Abasto Shopping (Oeste)
  const abasto = makeBox(12, 5.4, 9.5, mats.brick);
  abasto.position.set(-52, 2.7, -22);
  scene.add(abasto);

  // Conventillos y Caminito de La Boca (Sur)
  const bocaColors = ['#b45309', '#1d4ed8', '#b91c1c', '#15803d', '#a16207', '#7c2d12'];
  bocaColors.forEach((col, i) => {
    const house = makeBox(4.2, 3.2 + (i % 3) * 0.9, 4.4, col);
    house.position.set(-24 + i * 5.2, 1.6, 52);
    scene.add(house);
  });

  // Estadio La Bombonera en ruinas (Suroeste)
  const bombonera = new THREE.Group();
  const stWall1 = makeBox(14, 5.0, 2.6, '#1e3a8a');
  stWall1.position.set(0, 2.5, -6);
  const stWall2 = makeBox(14, 4.2, 2.6, '#ca8a04');
  stWall2.position.set(0, 2.1, 6);
  const stWall3 = makeBox(2.6, 4.8, 12, '#1e3a8a');
  stWall3.position.set(-6, 2.4, 0);
  const stField = makeBox(11, 0.2, 10, mats.grass, false);
  stField.position.set(0, 0.1, 0);
  bombonera.add(stWall1, stWall2, stWall3, stField);
  bombonera.position.set(-52, 0, 38);
  scene.add(bombonera);

  // =========================================================================
  // 8. EDIFICIOS DESTRUIDOS DE RELLENO POR TODA LA CIUDAD
  // =========================================================================
  const ruinedBlocks = [
    [-22, 3.6, -11, 6.2, 7.2, 6.2, 0.04],
    [-38, 2.8, -11, 5.8, 5.6, 5.8, -0.05],
    [-38, 4.2, -32, 6.0, 8.4, 6.0, 0.03],
    [-54, 3.0, -34, 6.2, 6.0, 6.2, -0.04],
    [-38, 2.5, 12, 5.8, 5.0, 5.8, 0.04],
    [-40, 3.4, 28, 6.0, 6.8, 6.0, -0.03],
    [-18, 3.0, 30, 6.0, 6.0, 5.6, 0.05],
    [4, 3.2, -12, 5.6, 6.4, 5.4, -0.04],
    [8, 4.0, -24, 6.0, 8.0, 5.6, 0.03],
    [22, 2.8, -12, 5.6, 5.6, 5.6, -0.03],
    [20, 3.4, 14, 5.8, 6.8, 5.8, 0.04],
    [-6, 2.6, 32, 5.5, 5.2, 5.5, -0.05],
    [-38, 2.4, -52, 6.2, 4.8, 6.2, 0.03],
    [-4, 3.0, -52, 6.0, 6.0, 5.8, -0.04],
  ];

  ruinedBlocks.forEach(([x, y, z, w, h, d, tilt], idx) => {
    const b = makeBox(w, h, d, idx % 3 === 0 ? mats.brick : mats.ruined);
    b.position.set(x, y, z);
    b.rotation.z = tilt;
    scene.add(b);
    const moss = makeBox(w * 0.55, 0.6, d * 0.55, '#436436');
    moss.position.set(x + 0.5, y + h / 2 + 0.25, z - 0.4);
    scene.add(moss);
  });

  // =========================================================================
  // 9. PARTÍCULAS DE HUMO Y CENIZA
  // =========================================================================
  const smokeParticles = [];
  const smokeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const smokeMat = new THREE.MeshLambertMaterial({
    color: '#9ca3af',
    transparent: true,
    opacity: 0.45,
  });

  for (let i = 0; i < 65; i += 1) {
    const p = new THREE.Mesh(smokeGeo, smokeMat);
    p.position.set(
      (Math.random() - 0.5) * 115,
      1.5 + Math.random() * 16,
      (Math.random() - 0.5) * 105
    );
    p.userData.speed = 0.015 + Math.random() * 0.03;
    scene.add(p);
    smokeParticles.push(p);
  }

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDownPos = { x: 0, y: 0 };

  const handlePointerDown = (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    if (Math.hypot(dx, dy) > 6) return;

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactives, false);
    if (hits.length > 0 && onSelectSector) {
      const key = hits[0].object.userData.sectorKey;
      onSelectSector(SECTOR_METADATA[key] || null);
    }
  };

  renderer.domElement.addEventListener('pointerdown', handlePointerDown);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);

  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', handleResize);

  let animId = 0;
  const clock = new THREE.Clock();

  const animate = () => {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    emergencyLight.intensity = 6 + Math.sin(elapsed * 4.5) * 3.5;

    smokeParticles.forEach((p) => {
      p.position.y += p.userData.speed;
      if (p.position.y > 18) {
        p.position.y = 1.5;
      }
    });

    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
    renderer.domElement.removeEventListener('pointerup', handlePointerUp);
    controls.dispose();
    Object.values(tex).forEach((t) => t.dispose());
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
