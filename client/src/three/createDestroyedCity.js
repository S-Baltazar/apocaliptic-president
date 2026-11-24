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
      'Comisaría con patrullero dañado y cuartel de bomberos. Si recortas demasiado su presupuesto, los saqueos e incendios destruirán otros edificios.',
  },
};

export function createDestroyedCity(container, onSelectSector) {
  const tex = createCityTextures();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#272932');
  scene.fog = new THREE.FogExp2('#272932', 0.0042);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
  camera.position.set(54, 46, 72);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
  });
  const PIXEL_SCALE = 0.5;
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
  controls.minDistance = 16;
  controls.maxDistance = 175;
  controls.target.set(-6, 1.5, 4);

  // Iluminación
  const hemiLight = new THREE.HemisphereLight('#c8d2df', '#3a3832', 1.15);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight('#f6d7a7', 1.45);
  sunLight.position.set(70, 95, 55);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -115;
  sunLight.shadow.camera.right = 115;
  sunLight.shadow.camera.top = 105;
  sunLight.shadow.camera.bottom = -105;
  scene.add(sunLight);

  const emergencyLight = new THREE.PointLight('#ef4444', 9, 28);
  emergencyLight.position.set(10, 5, 16);
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
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), outlineMat));
    }
    return mesh;
  }

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
    policeFacade: new THREE.MeshLambertMaterial({ map: tex.policeFacade }),
    fireFacade: new THREE.MeshLambertMaterial({ map: tex.fireStationFacade }),
    bomboneraStands: new THREE.MeshLambertMaterial({ map: tex.bomboneraStands }),
    sanLorenzoStands: new THREE.MeshLambertMaterial({ map: tex.sanLorenzoStands }),
    soccerPitch: new THREE.MeshLambertMaterial({ map: tex.soccerPitch }),
    colectivoSide: new THREE.MeshLambertMaterial({ map: tex.colectivoSide }),
    policeCarSide: new THREE.MeshLambertMaterial({ map: tex.policeCarSide }),
    carBody: new THREE.MeshLambertMaterial({ map: tex.carBody }),
    caminitoTin: new THREE.MeshLambertMaterial({ map: tex.caminitoTin }),
    concreteRoof: new THREE.MeshLambertMaterial({ color: '#706e69' }),
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

  // Helper: Auto realista pixel art (patrullero o civil abandonado)
  function createCar(isPolice = false) {
    const car = new THREE.Group();
    const bodyMat = isPolice ? mats.policeCarSide : mats.carBody;
    const roofColor = isPolice ? '#cfc9bc' : '#6b473b';
    const chassis = makeBox(1.8, 0.65, 3.6, bodyMat);
    chassis.position.y = 0.55;
    const cabin = makeBox(1.55, 0.55, 1.8, [
      bodyMat,
      bodyMat,
      new THREE.MeshLambertMaterial({ color: roofColor }),
      new THREE.MeshLambertMaterial({ color: '#222' }),
      new THREE.MeshLambertMaterial({ color: '#1b2029' }),
      new THREE.MeshLambertMaterial({ color: '#1b2029' }),
    ]);
    cabin.position.set(0, 1.1, -0.1);
    car.add(chassis, cabin);

    // 4 ruedas
    const wheelOffsets = [
      [-0.9, 0.3, 1.05],
      [0.9, 0.3, 1.05],
      [-0.9, 0.3, -1.05],
      [0.9, 0.3, -1.05],
    ];
    wheelOffsets.forEach(([wx, wy, wz]) => {
      const wheel = makeBox(0.32, 0.6, 0.6, '#1a1b1f', false);
      wheel.position.set(wx, wy, wz);
      car.add(wheel);
    });

    if (isPolice) {
      const sirenRed = makeBox(0.45, 0.2, 0.3, '#ef4444', false);
      sirenRed.position.set(-0.25, 1.48, -0.1);
      const sirenBlue = makeBox(0.45, 0.2, 0.3, '#3b82f6', false);
      sirenBlue.position.set(0.25, 1.48, -0.1);
      car.add(sirenRed, sirenBlue);
    }
    return car;
  }

  // Helper: Colectivo porteño oxidado + parada Metrobus
  function createColectivo() {
    const bus = new THREE.Group();
    const busMats = [
      mats.colectivoSide,
      mats.colectivoSide,
      new THREE.MeshLambertMaterial({ color: '#a89f8c' }),
      new THREE.MeshLambertMaterial({ color: '#222' }),
      new THREE.MeshLambertMaterial({ color: '#252a33' }),
      new THREE.MeshLambertMaterial({ color: '#8f8675' }),
    ];
    const body = makeBox(2.0, 2.0, 5.4, busMats);
    body.position.y = 1.35;
    bus.add(body);

    const wheels = [
      [-1.02, 0.42, 1.65],
      [1.02, 0.42, 1.65],
      [-1.02, 0.42, -1.65],
      [1.02, 0.42, -1.65],
    ];
    wheels.forEach(([wx, wy, wz]) => {
      const w = makeBox(0.35, 0.84, 0.84, '#18191d', false);
      w.position.set(wx, wy, wz);
      bus.add(w);
    });
    return bus;
  }

  function createMetrobusStop(x, z) {
    const stop = new THREE.Group();
    const platform = makeBox(2.8, 0.3, 8.5, mats.cobble);
    platform.position.y = 0.15;
    const roof = makeBox(2.4, 0.22, 7.6, '#4d5d6b');
    roof.position.set(0, 3.0, 0);
    roof.rotation.z = 0.08;
    const pillar1 = makeBox(0.25, 2.9, 0.25, '#3b424d', false);
    pillar1.position.set(-0.9, 1.5, -3.2);
    const pillar2 = makeBox(0.25, 2.9, 0.25, '#3b424d', false);
    pillar2.position.set(-0.9, 1.5, 3.2);
    const sign = makeBox(0.25, 0.75, 4.2, '#3b5978');
    sign.position.set(-0.9, 3.5, 0);
    stop.add(platform, roof, pillar1, pillar2, sign);
    stop.position.set(x, 0, z);
    scene.add(stop);
  }

  // Helper: Plaza con fuente seca (estilo plaza_fuente_seca.jpg)
  function createDryFountainPlaza(x, z, size = 14) {
    const plaza = new THREE.Group();
    const floor = makeBox(size, 0.22, size, mats.cobble, false);
    floor.position.y = 0.11;
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.4, 0.8, 12),
      mats.limestone
    );
    rim.position.y = 0.5;
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.6, 0.5, 12),
      mats.water
    );
    basin.position.y = 0.68;
    const tier = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 1.1, 2.2, 8),
      mats.limestone
    );
    tier.position.y = 1.6;
    plaza.add(floor, rim, basin, tier);

    // Bancos de madera y árboles secos
    [
      [-4.8, 0, 0],
      [4.8, 0, 0],
      [0, -4.8, Math.PI / 2],
      [0, 4.8, Math.PI / 2],
    ].forEach(([bx, bz, rot]) => {
      const bench = makeBox(0.7, 0.65, 2.4, '#6b472b');
      bench.position.set(bx, 0.45, bz);
      bench.rotation.y = rot;
      plaza.add(bench);
    });
    plaza.position.set(x, 0, z);
    scene.add(plaza);
  }

  // =========================================================================
  // 1. TERRENO SUPER EXPANDIDO DE BUENOS AIRES (210 x 190) + RÍO DE LA PLATA
  // =========================================================================
  const cityGround = makeBox(152, 1.6, 184, mats.cobble, false);
  cityGround.position.set(-28, -0.8, 0);
  scene.add(cityGround);

  // Dique de Puerto Madero + Costanera Sur
  const canalWater = makeBox(24, 0.6, 184, mats.water, false);
  canalWater.position.set(60, -0.5, 0);
  scene.add(canalWater);

  const eastDock = makeBox(28, 1.6, 184, mats.cobble, false);
  eastDock.position.set(86, -0.8, 0);
  scene.add(eastDock);

  const brickLeft = makeBox(2.0, 2.0, 184, mats.brick);
  brickLeft.position.set(48, -0.2, 0);
  scene.add(brickLeft);

  const brickRight = makeBox(2.0, 2.0, 184, mats.brick);
  brickRight.position.set(72, -0.2, 0);
  scene.add(brickRight);

  // Red de Avenidas Porteñas
  const roads = [
    [-4, 0, 10.5, 180],     // Av. 9 de Julio
    [34, 0, 6.2, 180],      // Av. Paseo Colón / Madero
    [-38, 0, 6.0, 180],     // Av. Callao / Entre Ríos
    [-74, 0, 5.5, 180],     // Av. Boedo / Medrano
    [-28, 0, 148, 7.0],     // Av. de Mayo
    [-28, -24, 148, 5.8],   // Av. Corrientes
    [-28, -52, 148, 5.5],   // Av. del Libertador
    [-28, 24, 148, 5.5],    // Av. San Juan
    [-28, 52, 148, 5.2],    // Av. Suárez / Almirante Brown
    [-28, 76, 148, 5.0],    // Borde Sur / Riachuelo
  ];
  roads.forEach(([x, z, w, d]) => {
    const r = makeBox(w, 0.14, d, mats.asphalt, false);
    r.position.set(x, 0.07, z);
    scene.add(r);
  });

  // Bulevar de Av. 9 de Julio + Metrobus + Colectivos Porteños + Autos Abandonados
  const av9Median = makeBox(1.8, 0.2, 174, mats.grass, false);
  av9Median.position.set(-4, 0.1, 0);
  scene.add(av9Median);

  createMetrobusStop(-1.2, -34);
  createMetrobusStop(-1.2, 12);

  [
    [-1.4, -34, 0.08],
    [-1.4, 12, -0.06],
    [-6.8, -10, Math.PI + 0.12],
    [-6.8, 36, Math.PI - 0.1],
  ].forEach(([bx, bz, rot]) => {
    const bus = createColectivo();
    bus.position.set(bx, 0, bz);
    bus.rotation.y = rot;
    scene.add(bus);
  });

  // Autos civiles abandonados en distintas avenidas
  [
    [12, 0.5, Math.PI / 2 + 0.15],
    [-20, -23.5, Math.PI / 2 - 0.1],
    [33.5, -14, 0.2],
    [-38, 16, -0.25],
    [-16, 24.5, Math.PI / 2 + 0.2],
    [34.5, 32, 0.12],
    [-54, 0.8, Math.PI / 2 - 0.18],
    [-38.5, -38, 0.15],
  ].forEach(([cx, cz, rot]) => {
    const car = createCar(false);
    car.position.set(cx, 0, cz);
    car.rotation.y = rot;
    scene.add(car);
  });

  // =========================================================================
  // 2. PLAZA DE MAYO, CASA ROSADA Y CABILDO
  // =========================================================================
  const plazaMayo = makeBox(20, 0.24, 20, mats.grass, false);
  plazaMayo.position.set(12, 0.12, 0);
  scene.add(plazaMayo);

  const piramideMayo = makeBox(1.5, 5.8, 1.5, '#d9d5c9');
  piramideMayo.position.set(12, 3.0, 0);
  scene.add(piramideMayo);

  const casaRosada = new THREE.Group();
  const crMain = makeBox(10.5, 6.4, 17, mats.rosada);
  crMain.position.y = 3.2;
  const crPortico = makeBox(2.8, 5.6, 6.4, mats.rosada);
  crPortico.position.set(-5.6, 2.8, 0);
  const crRoof = makeBox(10, 0.9, 16.2, '#4a4e54');
  crRoof.position.y = 6.8;
  const crHole = makeBox(4.4, 1.0, 6.0, '#18191d');
  crHole.position.set(0.6, 6.9, 1.5);
  [-3.2, 0, 3.2].forEach((zOff) => {
    const bar = makeBox(0.7, 1.0, 2.4, '#8b8d8e');
    bar.position.set(-7.8, 0.5, zOff);
    casaRosada.add(bar);
  });
  casaRosada.add(crMain, crPortico, crRoof, crHole);
  casaRosada.position.set(26, 0, 0);
  scene.add(casaRosada);
  registerInteractive(casaRosada, 'casa_rosada');

  const cabildo = new THREE.Group();
  const cabBody = makeBox(5.2, 4.4, 12.5, '#d9d5c9');
  cabBody.position.y = 2.2;
  const cabRoof = makeBox(5.4, 0.8, 12.7, mats.brick);
  cabRoof.position.y = 4.8;
  const cabTower = makeBox(3.4, 4.8, 3.4, '#d9d5c9');
  cabTower.position.y = 7.0;
  const cabCupola = makeBox(2.6, 1.6, 2.6, mats.brick);
  cabCupola.position.y = 10.0;
  const cabFlag = makeBox(0.2, 1.8, 2.2, '#62b5e5');
  cabFlag.position.set(0, 9.2, 2.4);
  cabildo.add(cabBody, cabRoof, cabTower, cabCupola, cabFlag);
  cabildo.position.set(2, 0, 0);
  scene.add(cabildo);

  // =========================================================================
  // 3. EL OBELISCO EN RUINAS + BOCAS DE SUBTE PORTEÑO
  // =========================================================================
  const obelisco = new THREE.Group();
  const obBase = makeBox(7.6, 0.5, 7.6, mats.cobble);
  obBase.position.y = 0.25;
  const obShaft1 = makeBox(2.8, 9.8, 2.8, '#c5bfb0');
  obShaft1.position.y = 5.1;
  const obShaft2 = makeBox(2.2, 7.5, 2.2, '#b3ada0');
  obShaft2.position.y = 13.7;
  const obBroken = makeBox(1.8, 1.6, 1.8, '#8f897d');
  obBroken.position.set(0.1, 18.0, 0);
  obBroken.rotation.z = 0.08;
  const rebar1 = makeBox(0.2, 2.0, 0.2, '#7c3f28', false);
  rebar1.position.set(-0.3, 19.3, 0.2);
  rebar1.rotation.z = 0.16;
  const obIvy = makeBox(0.7, 9.2, 0.7, '#436436');
  obIvy.position.set(1.3, 5.4, 1.0);
  obelisco.add(obBase, obShaft1, obShaft2, obBroken, rebar1, obIvy);
  obelisco.position.set(-4, 0, -24);
  scene.add(obelisco);

  [
    [-12, -13],
    [-12, 13],
    [-12, -38],
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
  const congBase = makeBox(13.5, 5.8, 18, mats.limestone);
  congBase.position.y = 2.9;
  const congSteps = makeBox(3.4, 1.4, 9.4, '#9d9889');
  congSteps.position.set(8.0, 0.7, 0);
  const congPediment = makeBox(3.8, 2.6, 9.6, '#c6c0af');
  congPediment.position.set(5.6, 7.0, 0);
  const congDrum = makeBox(6.6, 3.4, 6.6, mats.limestone);
  congDrum.position.set(0, 7.4, 0);
  const congDome = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.copper
  );
  congDome.position.set(0, 9.1, 0);
  congDome.castShadow = true;
  const domeHole = makeBox(2.1, 1.8, 2.1, '#2b241d');
  domeHole.position.set(1.4, 10.3, 1.1);
  congreso.add(congBase, congSteps, congPediment, congDrum, congDome, domeHole);
  congreso.position.set(-56, 0, 0);
  scene.add(congreso);
  registerInteractive(congreso, 'congreso');

  // =========================================================================
  // 5. PUERTO MADERO, PUENTE DE LA MUJER Y TORRES MODERNAS (Este)
  // =========================================================================
  const puertoGroup = new THREE.Group();
  const bridgeLeft = makeBox(11.5, 0.65, 3.0, '#e2e8f0');
  bridgeLeft.position.set(53.5, 1.35, 6);
  bridgeLeft.rotation.z = -0.14;
  const bridgeRight = makeBox(10.5, 0.65, 3.0, '#cbd5e1');
  bridgeRight.position.set(66.5, 1.25, 6);
  bridgeRight.rotation.z = 0.16;
  const mast = makeBox(0.9, 13.0, 0.9, '#f1f5f9');
  mast.position.set(58.0, 6.2, 6);
  mast.rotation.z = -0.45;

  const dockWarehouse1 = makeBox(8.2, 4.4, 14, mats.brick);
  dockWarehouse1.position.set(80, 2.2, -12);
  const dockWarehouse2 = makeBox(8.2, 4.2, 13, mats.brick);
  dockWarehouse2.position.set(80, 2.1, 18);
  const crane = makeBox(1.2, 10.5, 1.2, '#b45309');
  crane.position.set(74, 5.2, 28);
  crane.rotation.z = 0.22;

  const pmTower1 = makeBox(6.2, 20, 6.2, mats.glass);
  pmTower1.position.set(84, 10, -40);
  const pmTower2 = makeBox(6.2, 17, 6.2, mats.glass);
  pmTower2.position.set(84, 8.5, -30);
  const pmCurved = makeBox(6.8, 22, 5.4, mats.glass);
  pmCurved.position.set(84, 11, 44);
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
  // 6. COMISARÍA DESTRUIDA (con patrullero) Y CUARTEL DE BOMBEROS
  // =========================================================================
  const policeGroup = new THREE.Group();
  const polMats = [
    mats.ruined,
    mats.ruined,
    mats.concreteRoof,
    mats.concreteRoof,
    mats.policeFacade,
    mats.ruined,
  ];
  const polBody = makeBox(10.5, 5.0, 7.6, polMats);
  polBody.position.y = 2.5;
  // Techo con ventilación y esquina rota
  const polAc = makeBox(2.2, 0.9, 1.6, '#5c5e63');
  polAc.position.set(-1.5, 5.45, -1.2);
  // Barricadas frente a la comisaría
  const polBar1 = makeBox(2.4, 0.85, 0.5, '#8b8d8e');
  polBar1.position.set(-4.2, 0.45, 5.4);
  const polBar2 = makeBox(2.4, 0.85, 0.5, '#8b8d8e');
  polBar2.position.set(3.8, 0.45, 5.4);
  // Patrullero destruido estacionado frente a la comisaría
  const patrolCar = createCar(true);
  patrolCar.position.set(0.5, 0, 5.8);
  patrolCar.rotation.y = Math.PI / 2 - 0.18;

  // Cuartel de Bomberos contiguo
  const fireMats = [
    mats.brick,
    mats.brick,
    mats.concreteRoof,
    mats.concreteRoof,
    mats.fireFacade,
    mats.brick,
  ];
  const fireBody = makeBox(8.2, 4.6, 7.2, fireMats);
  fireBody.position.set(10.2, 2.3, 0);

  policeGroup.add(polBody, polAc, polBar1, polBar2, patrolCar, fireBody);
  policeGroup.position.set(10, 0, 14);
  scene.add(policeGroup);
  registerInteractive(policeGroup, 'policia');

  // =========================================================================
  // 7. LA BOMBONERA (Forma de D fiel a la referencia, 3 bandejas + palcos + cancha)
  // =========================================================================
  const bombonera = new THREE.Group();
  // Campo de juego con textura de césped, líneas, barro y charcos
  const bocaField = makeBox(15, 0.25, 20, mats.soccerPitch, false);
  bocaField.position.set(-1.2, 0.14, 0);
  bombonera.add(bocaField);

  // Arcos de fútbol oxidados
  [-8.6, 8.6].forEach((gz) => {
    const goal = makeBox(3.4, 1.2, 0.8, '#d4d0c5');
    goal.position.set(-1.2, 0.7, gz);
    bombonera.add(goal);
  });

  // 3 tribunas envolventes en forma de U (Oeste, Norte, Sur) con textura azul-amarillo-azul
  const standWest = makeBox(4.2, 7.2, 26, mats.bomboneraStands);
  standWest.position.set(-10.5, 3.6, 0);
  const standNorth = makeBox(19, 7.2, 4.2, mats.bomboneraStands);
  standNorth.position.set(-1.5, 3.6, -11.5);
  const standSouth = makeBox(19, 7.2, 4.2, mats.bomboneraStands);
  standSouth.position.set(-1.5, 3.6, 11.5);

  // Pared vertical plana de los Palcos (Este) característica de La Bombonera
  const palcosWall = makeBox(3.4, 9.2, 24, mats.ruined);
  palcosWall.position.set(8.2, 4.6, 0);
  const palcosCollapse = makeBox(2.2, 1.8, 5.0, '#3a2b24');
  palcosCollapse.position.set(8.2, 9.4, -4);

  bombonera.add(standWest, standNorth, standSouth, palcosWall, palcosCollapse);
  bombonera.position.set(-54, 0, 62);
  scene.add(bombonera);

  // =========================================================================
  // 8. ESTADIO DE SAN LORENZO (Nuevo Gasómetro - Suroeste / Boedo)
  // =========================================================================
  const sanLorenzo = new THREE.Group();
  const slField = makeBox(15, 0.25, 20, mats.soccerPitch, false);
  slField.position.y = 0.14;
  sanLorenzo.add(slField);

  const slN = makeBox(18, 5.6, 3.8, mats.sanLorenzoStands);
  slN.position.set(0, 2.8, -11.5);
  const slS = makeBox(18, 5.6, 3.8, mats.sanLorenzoStands);
  slS.position.set(0, 2.8, 11.5);
  const slW = makeBox(3.8, 5.6, 20, mats.sanLorenzoStands);
  slW.position.set(-10.2, 2.8, 0);
  const slE = makeBox(3.8, 5.6, 20, mats.sanLorenzoStands);
  slE.position.set(10.2, 2.8, 0);
  sanLorenzo.add(slN, slS, slW, slE);

  // 4 torres de iluminación oxidadas
  [
    [-11.5, -12.5],
    [11.5, -12.5],
    [-11.5, 12.5],
    [11.5, 12.5],
  ].forEach(([tx, tz]) => {
    const tower = makeBox(0.9, 12, 0.9, '#6b4232');
    tower.position.set(tx, 6, tz);
    const lamp = makeBox(2.6, 1.4, 0.6, '#9ca3af');
    lamp.position.set(tx, 12.2, tz);
    sanLorenzo.add(tower, lamp);
  });
  sanLorenzo.position.set(-88, 0, 36);
  scene.add(sanLorenzo);

  // =========================================================================
  // 9. ZONA NORTE, OESTE Y SUR: COLÓN, FLORALIS, UBA, RETIRO, MONUMENTAL, CAMINITO
  // =========================================================================
  const colon = new THREE.Group();
  const colonBody = makeBox(11.5, 6.2, 12.5, mats.limestone);
  colonBody.position.y = 3.1;
  const colonRoof = makeBox(10.6, 1.8, 11.6, mats.copper);
  colonRoof.position.y = 7.1;
  colon.add(colonBody, colonRoof);
  colon.position.set(-20, 0, -36);
  scene.add(colon);

  // Floralis Genérica
  const floralis = new THREE.Group();
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(7.0, 7.0, 0.5, 16),
    mats.water
  );
  pool.position.y = 0.25;
  floralis.add(pool);
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = makeBox(1.4, 5.2, 0.4, '#94a3b8');
    petal.position.set(Math.cos(angle) * 2.5, 2.7, Math.sin(angle) * 2.5);
    petal.rotation.y = -angle;
    petal.rotation.z = 0.28;
    floralis.add(petal);
  }
  const fallenPetal = makeBox(1.4, 4.4, 0.4, '#64748b');
  fallenPetal.position.set(-2.8, 0.5, 2.2);
  fallenPetal.rotation.z = Math.PI / 2.2;
  floralis.add(fallenPetal);
  floralis.position.set(12, 0, -38);
  scene.add(floralis);

  // Facultad de Derecho UBA
  const uba = new THREE.Group();
  const ubaBody = makeBox(16, 5.4, 11, mats.limestone);
  ubaBody.position.y = 2.7;
  const ubaSteps = makeBox(13, 1.2, 3.4, '#9d9889');
  ubaSteps.position.set(0, 0.6, 6.6);
  uba.add(ubaBody, ubaSteps);
  uba.position.set(-18, 0, -68);
  scene.add(uba);

  // Estación Retiro + Vías + Vagón Descarrilado + Torre Monumental
  const tracks = makeBox(8.5, 0.16, 68, mats.track, false);
  tracks.position.set(22, 0.08, -50);
  scene.add(tracks);

  const derailedCar = makeBox(2.6, 2.4, 7.5, '#8c4c3e');
  derailedCar.position.set(21.5, 1.2, -34);
  derailedCar.rotation.y = 0.35;
  derailedCar.rotation.z = 0.18;
  scene.add(derailedCar);

  const retiro = new THREE.Group();
  const retHall = makeBox(13, 6.4, 15, mats.limestone);
  retHall.position.y = 3.2;
  const retArch = makeBox(11, 3.4, 15.5, mats.copper);
  retArch.position.y = 7.6;
  retiro.add(retHall, retArch);
  retiro.position.set(22, 0, -72);
  scene.add(retiro);

  const torreIngleses = new THREE.Group();
  const tiBase = makeBox(4.2, 13.5, 4.2, mats.brick);
  tiBase.position.y = 6.75;
  const tiRoof = makeBox(3.6, 3.0, 3.6, mats.copper);
  tiRoof.position.y = 14.8;
  torreIngleses.add(tiBase, tiRoof);
  torreIngleses.position.set(36, 0, -68);
  scene.add(torreIngleses);

  // Estadio Monumental (Noroeste)
  const monumental = new THREE.Mesh(
    new THREE.CylinderGeometry(13, 13, 5.2, 18, 1, true),
    mats.ruined
  );
  monumental.position.set(-64, 2.6, -68);
  monumental.castShadow = true;
  scene.add(monumental);
  const monField = makeBox(15, 0.25, 18, mats.soccerPitch, false);
  monField.position.set(-64, 0.14, -68);
  scene.add(monField);

  // Hospital Central
  const hospital = new THREE.Group();
  const hospMain = makeBox(11, 5.6, 9.0, mats.limestone);
  hospMain.position.y = 2.8;
  const hospWing = makeBox(5.5, 4.0, 5.5, mats.ruined);
  hospWing.position.set(6.0, 2.0, 1.8);
  const cross1 = makeBox(2.4, 0.65, 0.3, '#ef4444');
  cross1.position.set(0, 4.2, 4.65);
  const cross2 = makeBox(0.65, 2.4, 0.3, '#ef4444');
  cross2.position.set(0, 4.2, 4.65);
  hospital.add(hospMain, hospWing, cross1, cross2);
  hospital.position.set(-22, 0, 12);
  scene.add(hospital);
  registerInteractive(hospital, 'hospital');

  // Central Eléctrica (Sur-Este)
  const powerPlant = new THREE.Group();
  const ppBody = makeBox(10, 5.0, 8.8, mats.brick);
  ppBody.position.y = 2.5;
  const ch1 = makeBox(2.0, 10.5, 2.0, '#4b5563');
  ch1.position.set(-2.4, 5.6, -2.0);
  const ch2 = makeBox(2.0, 9.6, 2.0, '#4b5563');
  ch2.position.set(2.4, 5.2, -2.0);
  powerPlant.add(ppBody, ch1, ch2);
  powerPlant.position.set(20, 0, 38);
  scene.add(powerPlant);
  registerInteractive(powerPlant, 'energia');

  // Abasto Shopping (Oeste)
  const abasto = makeBox(14, 5.8, 10.5, mats.brick);
  abasto.position.set(-58, 2.9, -24);
  scene.add(abasto);

  // Plazas con fuente seca (San Telmo y Recoleta)
  createDryFountainPlaza(14, 62, 16);
  createDryFountainPlaza(-56, -42, 14);

  // Caminito y Conventillos de La Boca con chapa acanalada colorida
  for (let i = 0; i < 6; i += 1) {
    const house = makeBox(5.2, 3.8 + (i % 2) * 1.1, 5.2, mats.caminitoTin);
    house.position.set(-28 + i * 6.0, 2.0, 64);
    const tinRoof = makeBox(5.6, 0.45, 5.6, '#6e7b7d');
    tinRoof.position.set(-28 + i * 6.0, 4.0 + (i % 2) * 1.1, 64);
    tinRoof.rotation.z = i % 2 === 0 ? 0.14 : -0.14;
    scene.add(house, tinRoof);
  }

  // =========================================================================
  // 10. EDIFICIOS DESTRUIDOS DE RELLENO EN EL MAPA EXPANDIDO
  // =========================================================================
  const ruinedBlocks = [
    [-22, 3.8, -11, 6.8, 7.6, 6.8, 0.04],
    [-46, 3.0, -11, 6.2, 6.0, 6.2, -0.05],
    [-46, 4.4, -36, 6.4, 8.8, 6.4, 0.03],
    [-86, 3.4, -24, 7.0, 6.8, 7.0, -0.04],
    [-86, 4.0, -48, 6.8, 8.0, 6.8, 0.03],
    [-88, 2.8, 4, 6.5, 5.6, 6.5, -0.03],
    [-48, 2.8, 12, 6.2, 5.6, 6.2, 0.04],
    [-54, 3.6, 36, 6.6, 7.2, 6.6, -0.03],
    [-22, 3.4, 36, 6.6, 6.8, 6.2, 0.05],
    [4, 3.4, -12, 6.0, 6.8, 5.8, -0.04],
    [8, 4.2, -26, 6.4, 8.4, 6.0, 0.03],
    [24, 3.0, -14, 6.0, 6.0, 6.0, -0.03],
    [-6, 3.0, 38, 6.0, 6.0, 6.0, -0.05],
    [-44, 2.6, -68, 6.8, 5.2, 6.8, 0.03],
    [-4, 3.2, -68, 6.4, 6.4, 6.2, -0.04],
    [-88, 3.2, 66, 7.0, 6.4, 7.0, 0.04],
    [32, 3.4, 62, 6.8, 6.8, 6.8, -0.04],
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
  // 11. PARTÍCULAS DE HUMO Y CENIZA
  // =========================================================================
  const smokeParticles = [];
  const smokeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
  const smokeMat = new THREE.MeshLambertMaterial({
    color: '#9ca3af',
    transparent: true,
    opacity: 0.42,
  });

  for (let i = 0; i < 85; i += 1) {
    const p = new THREE.Mesh(smokeGeo, smokeMat);
    p.position.set(
      (Math.random() - 0.5) * 165,
      1.5 + Math.random() * 18,
      (Math.random() - 0.5) * 150
    );
    p.userData.speed = 0.015 + Math.random() * 0.03;
    scene.add(p);
    smokeParticles.push(p);
  }

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDownPos = { x: 0, y: 0 };

  // Marcadores visuales 3D del nivel de mejora por sector
  const sectorBeaconPositions = {
    subte: [-12, 5.2, -13],
    puerto: [58, 12.5, 6],
    energia: [20, 11.5, 38],
    hospital: [-22, 8.2, 12],
    policia: [10, 7.6, 14],
  };
  const sectorBeacons = {};
  Object.entries(sectorBeaconPositions).forEach(([key, [bx, by, bz]]) => {
    const beacon = makeBox(1.4, 1.4, 1.4, '#ef4444');
    beacon.position.set(bx, by, bz);
    scene.add(beacon);
    sectorBeacons[key] = beacon;
  });

  const updateSectors = (sectors = []) => {
    const levelColors = ['#ef4444', '#f59e0b', '#22c55e', '#38bdf8'];
    sectors.forEach((s) => {
      const beacon = sectorBeacons[s.id];
      if (!beacon) return;
      const color = levelColors[s.level] || '#ef4444';
      beacon.material.color.set(color);
      const scale = 1 + s.level * 0.35;
      beacon.scale.set(scale, scale, scale);
    });
  };

  const updateWeather = (weatherId = 'despejado') => {
    if (weatherId === 'sudestada') {
      scene.background.set('#1a2330');
      scene.fog.color.set('#1a2330');
      scene.fog.density = 0.0068;
      sunLight.color.set('#93c5fd');
      canalWater.position.y = -0.05; // sube el nivel del río
    } else if (weatherId === 'ola_calor') {
      scene.background.set('#3b2820');
      scene.fog.color.set('#3b2820');
      scene.fog.density = 0.0045;
      sunLight.color.set('#fb923c');
      canalWater.position.y = -0.5;
    } else if (weatherId === 'ceniza') {
      scene.background.set('#2c2c2c');
      scene.fog.color.set('#343434');
      scene.fog.density = 0.0085;
      sunLight.color.set('#cbd5e1');
      canalWater.position.y = -0.5;
    } else {
      scene.background.set('#272932');
      scene.fog.color.set('#272932');
      scene.fog.density = 0.0042;
      sunLight.color.set('#f6d7a7');
      canalWater.position.y = -0.5;
    }
  };

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
      if (p.position.y > 20) {
        p.position.y = 1.5;
      }
    });

    Object.values(sectorBeacons).forEach((b) => {
      b.rotation.y += 0.02;
    });

    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  return {
    updateSectors,
    updateWeather,
    cleanup: () => {
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
    },
  };
}
