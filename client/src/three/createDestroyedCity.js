import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SECTOR_METADATA = {
  subte: {
    id: 'subte',
    title: 'SUBTE PORTEÑO',
    status: 'Nivel 0 — Destruido',
    monthlyCost: 0,
    description:
      'Bocas de subte inundadas y túneles colapsados bajo la Av. 9 de Julio. Dejarlo roto cuesta $0k/mes; llevarlo a nivel futurista costará $400k/mes.',
  },
  puerto: {
    id: 'puerto',
    title: 'PUERTO MADERO',
    status: 'Nivel 0 — Bloqueado',
    monthlyCost: 0,
    description:
      'Puente de la Mujer quebrado sobre el dique contaminado y depósitos en ruinas. Repararlo habilita el comercio exterior y los aranceles aduaneros.',
  },
  congreso: {
    id: 'congreso',
    title: 'CONGRESO DE LA NACIÓN',
    status: 'Cúpula Dañada — En Sesión',
    monthlyCost: 0,
    description:
      'Sede del Poder Legislativo. Aquí deberás proponer leyes y negociar votos con los bloques para aprobar reformas fiscales, sociales o de seguridad.',
  },
  casa_rosada: {
    id: 'casa_rosada',
    title: 'CASA ROSADA',
    status: 'Sede Presidencial — Emergencia',
    monthlyCost: 0,
    description:
      'Tu centro de mando frente a Plaza de Mayo. Desde aquí coordinas el gabinete, los planes sociales y las relaciones internacionales.',
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
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#23252c');
  scene.fog = new THREE.FogExp2('#2a2d35', 0.0085);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 300);
  camera.position.set(36, 32, 46);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
  });
  const PIXEL_SCALE = 0.42;
  renderer.setPixelRatio(PIXEL_SCALE);
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2.18;
  controls.minDistance = 16;
  controls.maxDistance = 88;
  controls.target.set(0, 1.5, 0);

  // Iluminación estilo pixel-art nublado apocalíptico
  const ambientLight = new THREE.AmbientLight('#9aa3b2', 1.25);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight('#f4d29c', 1.35);
  sunLight.position.set(35, 55, 28);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -50;
  sunLight.shadow.camera.right = 50;
  sunLight.shadow.camera.top = 50;
  sunLight.shadow.camera.bottom = -50;
  scene.add(sunLight);

  const emergencyLight = new THREE.PointLight('#ef4444', 8, 22);
  emergencyLight.position.set(0, 5, 0);
  scene.add(emergencyLight);

  // Helper para crear cajas con contorno oscuro estilo pixel art
  const outlineMat = new THREE.LineBasicMaterial({ color: '#111318' });
  function makeBox(w, h, d, color, outline = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (outline) {
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, outlineMat);
      mesh.add(line);
    }
    return mesh;
  }

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
  // 1. TERRENO EXPANDIDO DE BUENOS AIRES (96 x 84) + RÍO Y DIQUES
  // =========================================================================
  const cityGround = makeBox(66, 1.2, 80, '#3a3c42', false);
  cityGround.position.set(-12, -0.6, 0);
  scene.add(cityGround);

  // Dique de Puerto Madero (agua verde contaminada) + muelle este
  const canalWater = makeBox(16, 0.5, 80, '#4f6336', false);
  canalWater.position.set(29, -0.45, 0);
  scene.add(canalWater);

  const eastDock = makeBox(14, 1.2, 80, '#443d3c', false);
  eastDock.position.set(44, -0.6, 0);
  scene.add(eastDock);

  // Bordes de ladrillo rojo de Puerto Madero
  const brickLeft = makeBox(1.4, 1.5, 80, '#7c4338');
  brickLeft.position.set(21.2, -0.25, 0);
  scene.add(brickLeft);

  const brickRight = makeBox(1.4, 1.5, 80, '#7c4338');
  brickRight.position.set(36.8, -0.25, 0);
  scene.add(brickRight);

  // Avenidas principales (Av. 9 de Julio, Av. de Mayo, Av. Corrientes, Av. Paseo Colón)
  const av9Julio = makeBox(7.5, 0.1, 78, '#232429', false);
  av9Julio.position.set(-4, 0.05, 0);
  scene.add(av9Julio);

  const av9Median = makeBox(1.2, 0.16, 76, '#48593a', false);
  av9Median.position.set(-4, 0.08, 0);
  scene.add(av9Median);

  const avDeMayo = makeBox(64, 0.1, 6, '#232429', false);
  avDeMayo.position.set(-11, 0.05, 0);
  scene.add(avDeMayo);

  const avCorrientes = makeBox(64, 0.1, 4.5, '#25272d', false);
  avCorrientes.position.set(-11, 0.05, -16);
  scene.add(avCorrientes);

  const avPaseoColon = makeBox(5.2, 0.1, 78, '#25272d', false);
  avPaseoColon.position.set(17, 0.05, 0);
  scene.add(avPaseoColon);

  const avSanJuan = makeBox(64, 0.1, 4.2, '#25272d', false);
  avSanJuan.position.set(-11, 0.05, 18);
  scene.add(avSanJuan);

  // =========================================================================
  // 2. EL OBELISCO EN RUINAS (Centro de Av. 9 de Julio y Corrientes)
  // =========================================================================
  const obelisco = new THREE.Group();
  const obBase = makeBox(5.5, 0.4, 5.5, '#686a66');
  obBase.position.y = 0.2;
  const obShaft1 = makeBox(2.4, 8, 2.4, '#c5bfb0');
  obShaft1.position.y = 4.2;
  const obShaft2 = makeBox(1.9, 6, 1.9, '#b3ada0');
  obShaft2.position.y = 11.2;
  // Punta quebrada con hierros oxidados expuestos
  const obBroken = makeBox(1.5, 1.4, 1.5, '#8f897d');
  obBroken.position.set(0.1, 14.8, 0);
  obBroken.rotation.z = 0.08;
  const rebar1 = makeBox(0.18, 1.6, 0.18, '#7c3f28', false);
  rebar1.position.set(-0.3, 15.8, 0.2);
  rebar1.rotation.z = 0.15;
  const rebar2 = makeBox(0.18, 1.9, 0.18, '#7c3f28', false);
  rebar2.position.set(0.35, 16.0, -0.2);
  rebar2.rotation.z = -0.18;
  // Enredadera verde trepando
  const obIvy = makeBox(0.6, 7.5, 0.6, '#436436');
  obIvy.position.set(1.15, 4.5, 0.9);
  obelisco.add(obBase, obShaft1, obShaft2, obBroken, rebar1, rebar2, obIvy);
  obelisco.position.set(-4, 0, -16);
  scene.add(obelisco);

  // =========================================================================
  // 3. CASA ROSADA (Extremo Este de Av. de Mayo / Plaza de Mayo)
  // =========================================================================
  const casaRosada = new THREE.Group();
  const crMain = makeBox(8.5, 5.2, 13, '#c88b8b');
  crMain.position.y = 2.6;
  const crPortico = makeBox(2.4, 4.6, 5, '#d49a9a');
  crPortico.position.set(-4.6, 2.3, 0);
  // Techo roto oscuro
  const crRoof = makeBox(8.2, 0.8, 12.2, '#4a4e54');
  crRoof.position.y = 5.5;
  const crHole = makeBox(3.5, 0.9, 5, '#1d1e22');
  crHole.position.set(0.5, 5.6, 1.2);
  // Barricadas de concreto en la entrada
  const crBar1 = makeBox(0.6, 0.9, 2.2, '#8b8d8e');
  crBar1.position.set(-6.5, 0.45, -2.5);
  const crBar2 = makeBox(0.6, 0.9, 2.2, '#8b8d8e');
  crBar2.position.set(-6.5, 0.45, 2.5);
  casaRosada.add(crMain, crPortico, crRoof, crHole, crBar1, crBar2);
  casaRosada.position.set(10, 0, 0);
  scene.add(casaRosada);
  registerInteractive(casaRosada, 'casa_rosada');

  // =========================================================================
  // 4. EL CABILDO (Frente a Plaza de Mayo, Oeste de Casa Rosada)
  // =========================================================================
  const cabildo = new THREE.Group();
  const cabBody = makeBox(4.5, 4.0, 10, '#d9d5c9');
  cabBody.position.y = 2.0;
  const cabRoof = makeBox(4.7, 0.7, 10.2, '#9b4d37');
  cabRoof.position.y = 4.35;
  const cabTower = makeBox(3.0, 4.2, 3.0, '#d9d5c9');
  cabTower.position.y = 6.2;
  const cabCupola = makeBox(2.4, 1.4, 2.4, '#8b422f');
  cabCupola.position.y = 8.9;
  const cabFlag = makeBox(0.2, 1.6, 2.0, '#62b5e5');
  cabFlag.position.set(0, 8.2, 2.2);
  cabildo.add(cabBody, cabRoof, cabTower, cabCupola, cabFlag);
  cabildo.position.set(-11, 0, 0);
  scene.add(cabildo);

  // =========================================================================
  // 5. CONGRESO DE LA NACIÓN (Extremo Oeste de Av. de Mayo)
  // =========================================================================
  const congreso = new THREE.Group();
  const congBase = makeBox(11, 4.8, 14, '#b8b2a0');
  congBase.position.y = 2.4;
  const congSteps = makeBox(2.5, 1.2, 7.5, '#9d9889');
  congSteps.position.set(6.2, 0.6, 0);
  const congPediment = makeBox(3.2, 2.2, 8.0, '#c6c0af');
  congPediment.position.set(4.5, 5.8, 0);
  // Cúpula verde oxidada característica (con rotura)
  const congDrum = makeBox(5.6, 2.8, 5.6, '#b8b2a0');
  congDrum.position.set(0, 6.2, 0);
  const congDome = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: '#4e856d' })
  );
  congDome.position.set(0, 7.6, 0);
  congDome.castShadow = true;
  const domeHole = makeBox(1.8, 1.6, 1.8, '#2b241d');
  domeHole.position.set(1.2, 8.6, 1.0);
  congreso.add(congBase, congSteps, congPediment, congDrum, congDome, domeHole);
  congreso.position.set(-32, 0, 0);
  scene.add(congreso);
  registerInteractive(congreso, 'congreso');

  // =========================================================================
  // 6. PUERTO MADERO Y PUENTE DE LA MUJER QUEBRADO (Este)
  // =========================================================================
  const puertoGroup = new THREE.Group();
  // Puente de la Mujer roto sobre el agua
  const bridgeLeft = makeBox(7.2, 0.5, 2.4, '#e2e8f0');
  bridgeLeft.position.set(24.5, 1.2, 4);
  bridgeLeft.rotation.z = -0.14;
  const bridgeRight = makeBox(6.8, 0.5, 2.4, '#cbd5e1');
  bridgeRight.position.set(33.5, 1.1, 4);
  bridgeRight.rotation.z = 0.16;
  const mast = makeBox(0.7, 9.5, 0.7, '#f1f5f9');
  mast.position.set(27.5, 4.8, 4);
  mast.rotation.z = -0.45;
  // Depósitos portuarios y grúa inclinada
  const dockWarehouse = makeBox(5.5, 3.6, 9, '#7c4338');
  dockWarehouse.position.set(39, 1.8, -8);
  const dockRoof = makeBox(5.8, 0.8, 9.2, '#4a5568');
  dockRoof.position.set(39, 4.0, -8);
  const crane = makeBox(0.9, 7.5, 0.9, '#b45309');
  crane.position.set(38.5, 3.8, 12);
  crane.rotation.z = 0.22;
  // Torres modernas de Puerto Madero dañadas al fondo del dique
  const pmTower1 = makeBox(4.5, 13, 4.5, '#52606d');
  pmTower1.position.set(43, 6.5, -24);
  const pmTower2 = makeBox(4.5, 11, 4.5, '#475569');
  pmTower2.position.set(43, 5.5, -17);
  puertoGroup.add(bridgeLeft, bridgeRight, mast, dockWarehouse, dockRoof, crane, pmTower1, pmTower2);
  scene.add(puertoGroup);
  registerInteractive(puertoGroup, 'puerto');

  // =========================================================================
  // 7. SUBTE PORTEÑO (Sobre Av. 9 de Julio / Sur del Obelisco)
  // =========================================================================
  const subteGroup = new THREE.Group();
  const subteBase = makeBox(4.6, 0.5, 5.2, '#646669');
  subteBase.position.y = 0.25;
  const subteStairs = makeBox(3.4, 0.4, 3.8, '#26272b');
  subteStairs.position.set(0, 0.4, 0.4);
  // Reja verde icónica del Subte
  const subteArch = makeBox(4.0, 2.4, 0.5, '#2f5e41');
  subteArch.position.set(0, 1.4, -1.6);
  const subteSign = makeBox(2.2, 0.7, 0.6, '#1f3f2c');
  subteSign.position.set(0, 2.2, -1.6);
  const subteIvy = makeBox(1.0, 1.8, 0.7, '#4a6b3b');
  subteIvy.position.set(1.6, 1.1, -1.5);
  subteGroup.add(subteBase, subteStairs, subteArch, subteSign, subteIvy);
  subteGroup.position.set(-10.5, 0, -9);
  scene.add(subteGroup);
  registerInteractive(subteGroup, 'subte');

  // =========================================================================
  // 8. TEATRO COLÓN (Noroeste de Av. 9 de Julio)
  // =========================================================================
  const colon = new THREE.Group();
  const colonBody = makeBox(9, 5.2, 10, '#c2b9a5');
  colonBody.position.y = 2.6;
  const colonRoof = makeBox(8.4, 1.6, 9.2, '#4c6658');
  colonRoof.position.y = 6.0;
  const colonCanopy = makeBox(4.0, 0.3, 2.2, '#64748b');
  colonCanopy.position.set(5.2, 1.8, 0);
  colonCanopy.rotation.z = -0.15;
  colon.add(colonBody, colonRoof, colonCanopy);
  colon.position.set(-14, 0, -24);
  scene.add(colon);

  // =========================================================================
  // 9. FLORALIS GENÉRICA (Parque Norte)
  // =========================================================================
  const floralis = new THREE.Group();
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(5.5, 5.5, 0.5, 16),
    new THREE.MeshLambertMaterial({ color: '#4f6336' })
  );
  pool.position.y = 0.25;
  floralis.add(pool);
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = makeBox(1.2, 4.2, 0.4, '#94a3b8');
    petal.position.set(Math.cos(angle) * 2.0, 2.2, Math.sin(angle) * 2.0);
    petal.rotation.y = -angle;
    petal.rotation.z = 0.28;
    floralis.add(petal);
  }
  // Pétalo caído en el estanque
  const fallenPetal = makeBox(1.2, 3.6, 0.4, '#64748b');
  fallenPetal.position.set(-2.4, 0.5, 1.8);
  fallenPetal.rotation.z = Math.PI / 2.2;
  floralis.add(fallenPetal);
  floralis.position.set(6, 0, -28);
  scene.add(floralis);

  // =========================================================================
  // 10. HOSPITAL CENTRAL, COMISARÍA/BOMBEROS Y PLANTA ELÉCTRICA
  // =========================================================================
  const hospital = new THREE.Group();
  const hospMain = makeBox(8.5, 4.8, 7.0, '#cbd5e1');
  hospMain.position.y = 2.4;
  const hospWing = makeBox(4.0, 3.2, 4.0, '#94a3b8');
  hospWing.position.set(4.5, 1.6, 1.5);
  const cross1 = makeBox(1.8, 0.5, 0.3, '#ef4444');
  cross1.position.set(0, 3.6, 3.6);
  const cross2 = makeBox(0.5, 1.8, 0.3, '#ef4444');
  cross2.position.set(0, 3.6, 3.6);
  hospital.add(hospMain, hospWing, cross1, cross2);
  hospital.position.set(-24, 0, 11);
  scene.add(hospital);
  registerInteractive(hospital, 'hospital');

  const police = new THREE.Group();
  const polBody = makeBox(6.8, 3.2, 6.2, '#274075');
  polBody.position.y = 1.6;
  const fireBay = makeBox(3.5, 2.8, 5.0, '#991b1b');
  fireBay.position.set(4.8, 1.4, 0);
  police.add(polBody, fireBay);
  police.position.set(4, 0, 12);
  scene.add(police);
  registerInteractive(police, 'policia');

  const powerPlant = new THREE.Group();
  const ppBody = makeBox(7.2, 4.2, 6.8, '#6b3e26');
  ppBody.position.y = 2.1;
  const chimney1 = makeBox(1.4, 7.5, 1.4, '#4b5563');
  chimney1.position.set(-1.8, 4.2, -1.5);
  const chimney2 = makeBox(1.4, 6.8, 1.4, '#4b5563');
  chimney2.position.set(1.8, 3.8, -1.5);
  powerPlant.add(ppBody, chimney1, chimney2);
  powerPlant.position.set(12, 0, 26);
  scene.add(powerPlant);
  registerInteractive(powerPlant, 'energia');

  // =========================================================================
  // 11. CONVENTILLOS DE LA BOCA (Sur) + ESTADIO EN RUINAS + EDIFICIOS DESTRUIDOS
  // =========================================================================
  const bocaColors = ['#b45309', '#1d4ed8', '#b91c1c', '#15803d', '#a16207'];
  bocaColors.forEach((col, i) => {
    const house = makeBox(3.2, 2.8 + (i % 2) * 0.8, 3.4, col);
    house.position.set(-22 + i * 3.8, 1.4, 28);
    scene.add(house);
  });

  // Estadio La Bombonera en ruinas (Suroeste)
  const stadium = new THREE.Group();
  const stWall1 = makeBox(12, 4.2, 2.2, '#1e3a8a');
  stWall1.position.set(0, 2.1, -5);
  const stWall2 = makeBox(12, 3.6, 2.2, '#ca8a04');
  stWall2.position.set(0, 1.8, 5);
  const stWall3 = makeBox(2.2, 4.0, 10, '#1e3a8a');
  stWall3.position.set(-5, 2.0, 0);
  const stField = makeBox(9.5, 0.2, 8.5, '#3b522c');
  stField.position.set(0, 0.1, 0);
  stadium.add(stWall1, stWall2, stWall3, stField);
  stadium.position.set(-34, 0, 26);
  scene.add(stadium);

  // Edificios destruidos de relleno por toda la ciudad
  const ruinedBlocks = [
    [-24, 3.2, -10, 5.2, 6.4, 5.2, '#4b4e54', 0.04],
    [-22, 2.2, -24, 4.8, 4.4, 4.8, '#5a564f', -0.05],
    [-34, 2.8, -14, 5.5, 5.6, 5.5, '#3e4147', 0.03],
    [4, 2.6, -10, 4.8, 5.2, 4.5, '#54575c', -0.04],
    [10, 3.5, -20, 5.0, 7.0, 4.8, '#464950', 0.03],
    [-12, 2.4, 11, 5.0, 4.8, 4.8, '#52504c', -0.03],
    [-4, 2.0, 25, 4.6, 4.0, 4.6, '#484b52', 0.05],
    [11, 2.5, -34, 5.2, 5.0, 5.2, '#3d4045', -0.04],
    [-18, 2.1, -34, 4.5, 4.2, 4.5, '#59554c', 0.06],
  ];

  ruinedBlocks.forEach(([x, y, z, w, h, d, col, tilt]) => {
    const b = makeBox(w, h, d, col);
    b.position.set(x, y, z);
    b.rotation.z = tilt;
    scene.add(b);
    // Vegetación encima de los escombros
    const moss = makeBox(w * 0.5, 0.5, d * 0.5, '#436436');
    moss.position.set(x + 0.4, y + h / 2 + 0.2, z - 0.3);
    scene.add(moss);
  });

  // =========================================================================
  // 12. PARTÍCULAS DE HUMO Y CENIZA SOBRE LA CIUDAD
  // =========================================================================
  const smokeParticles = [];
  const smokeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const smokeMat = new THREE.MeshLambertMaterial({
    color: '#9ca3af',
    transparent: true,
    opacity: 0.48,
  });

  for (let i = 0; i < 45; i += 1) {
    const p = new THREE.Mesh(smokeGeo, smokeMat);
    p.position.set(
      (Math.random() - 0.5) * 65,
      1.5 + Math.random() * 12,
      (Math.random() - 0.5) * 65
    );
    p.userData.speed = 0.015 + Math.random() * 0.025;
    scene.add(p);
    smokeParticles.push(p);
  }

  // Raycaster para clics en edificios emblemáticos
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

    emergencyLight.intensity = 5 + Math.sin(elapsed * 4.5) * 3;

    smokeParticles.forEach((p) => {
      p.position.y += p.userData.speed;
      if (p.position.y > 14) {
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
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
