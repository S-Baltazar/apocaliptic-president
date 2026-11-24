import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SECTOR_METADATA = {
  subte: {
    id: 'subte',
    title: 'SUBTE METROPOLITANO',
    status: 'Nivel 0 — Destruido',
    monthlyCost: 0,
    description:
      'Túneles inundados y vagones descarrilados. Dejarlo roto cuesta $0k/mes, pero frena el comercio. Llevarlo a nivel futurista costará $400k/mes.',
  },
  puerto: {
    id: 'puerto',
    title: 'PUERTO COMERCIAL',
    status: 'Nivel 0 — Bloqueado',
    monthlyCost: 0,
    description:
      'Grúas caídas y muelles rotos. Repararlo habilitará el comercio exterior, tratados internacionales y recaudación aduanera.',
  },
  energia: {
    id: 'energia',
    title: 'RED ELÉCTRICA',
    status: 'Nivel 1 — Emergencia',
    monthlyCost: 35,
    description:
      'Generadores viejos echando humo. Apenas cubren lo básico con apagones frecuentes.',
  },
  hospital: {
    id: 'hospital',
    title: 'HOSPITAL CENTRAL',
    status: 'Nivel 1 — Colapsado',
    monthlyCost: 30,
    description:
      'Estructura dañada y falta de insumos. Si no se refuerza, una epidemia puede disparar el descontento.',
  },
  policia: {
    id: 'policia',
    title: 'COMISARÍA Y BOMBEROS',
    status: 'Nivel 1 — Mínimo',
    monthlyCost: 25,
    description:
      'Patrullas y autobombas escasas para contener saqueos e incendios en la ciudad.',
  },
};

export function createDestroyedCity(container, onSelectSector) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#13111c');
  scene.fog = new THREE.FogExp2('#1b1724', 0.022);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
  camera.position.set(22, 18, 24);

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  // Escala reducida para lograr una estética Pixel Art nítida
  const PIXEL_SCALE = 0.35;
  renderer.setPixelRatio(PIXEL_SCALE);
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2.25;
  controls.minDistance = 12;
  controls.maxDistance = 42;
  controls.target.set(0, 1, 0);

  // Iluminación apocalíptica
  const ambientLight = new THREE.AmbientLight('#6b5b7b', 1.15);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight('#f59e0b', 1.45);
  sunLight.position.set(16, 26, 12);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(512, 512);
  scene.add(sunLight);

  const emergencyLight = new THREE.PointLight('#ef4444', 6, 18);
  emergencyLight.position.set(-4, 4, 4);
  scene.add(emergencyLight);

  // Suelo urbano agrietado + agua del puerto
  const groundGeo = new THREE.BoxGeometry(34, 1, 34);
  const groundMat = new THREE.MeshLambertMaterial({ color: '#272736' });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Agua contaminada en la zona del puerto
  const waterGeo = new THREE.BoxGeometry(12, 0.4, 34);
  const waterMat = new THREE.MeshLambertMaterial({ color: '#163042' });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(16, -0.35, 0);
  scene.add(water);

  // Calles oscuras en cruz
  const roadMat = new THREE.MeshLambertMaterial({ color: '#181822' });
  const roadX = new THREE.Mesh(new THREE.BoxGeometry(30, 0.08, 2.8), roadMat);
  roadX.position.set(-1, 0.02, 0);
  scene.add(roadX);

  const roadZ = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 30), roadMat);
  roadZ.position.set(-2, 0.02, 0);
  scene.add(roadZ);

  const interactives = [];

  function registerInteractive(mesh, sectorKey) {
    mesh.userData.sectorKey = sectorKey;
    interactives.push(mesh);
  }

  // Edificios en ruinas de relleno
  const ruinMat = new THREE.MeshLambertMaterial({ color: '#3b3b4f' });
  const darkRuinMat = new THREE.MeshLambertMaterial({ color: '#2b2b3b' });
  const rubblePositions = [
    [-11, 2.2, -10, 3.2, 4.4, 3.2, 0.05],
    [-11, 1.4, -5, 2.6, 2.8, 2.6, -0.08],
    [-7, 2.8, -11, 3.0, 5.6, 2.8, 0.03],
    [4, 1.6, -10, 3.4, 3.2, 3.0, -0.04],
    [-11, 1.8, 7, 3.0, 3.6, 3.0, 0.07],
    [-6, 1.2, 10, 2.8, 2.4, 2.8, -0.05],
    [4, 2.1, 9, 3.2, 4.2, 3.0, 0.04],
  ];

  rubblePositions.forEach(([x, y, z, w, h, d, tilt], idx) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      idx % 2 === 0 ? ruinMat : darkRuinMat
    );
    b.position.set(x, y, z);
    b.rotation.z = tilt;
    b.castShadow = true;
    b.receiveShadow = true;
    scene.add(b);
  });

  // 1. SUBTE DESTRUIDO (Centro-Oeste)
  const subteGroup = new THREE.Group();
  const subteBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.4, 3.6),
    new THREE.MeshLambertMaterial({ color: '#52526b' })
  );
  subteBase.position.y = 0.7;
  const subteSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.6, 0.3),
    new THREE.MeshLambertMaterial({ color: '#ef4444' })
  );
  subteSign.position.set(0, 1.8, 1.5);
  subteGroup.add(subteBase, subteSign);
  subteGroup.position.set(-6, 0, -4);
  subteGroup.rotation.y = 0.15;
  scene.add(subteGroup);
  registerInteractive(subteBase, 'subte');

  // 2. PUERTO EN RUINAS (Este junto al agua)
  const puertoBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 1.2, 6),
    new THREE.MeshLambertMaterial({ color: '#6b4f3b' })
  );
  puertoBase.position.set(9.5, 0.6, 2);
  scene.add(puertoBase);
  registerInteractive(puertoBase, 'puerto');

  const craneTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.2, 0.6),
    new THREE.MeshLambertMaterial({ color: '#b45309' })
  );
  craneTower.position.set(9.8, 2.6, 2);
  craneTower.rotation.z = -0.25;
  scene.add(craneTower);

  // 3. PLANTA ELÉCTRICA (Noroeste)
  const powerPlant = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 3.2, 3.8),
    new THREE.MeshLambertMaterial({ color: '#78350f' })
  );
  powerPlant.position.set(-4, 1.6, 4.5);
  scene.add(powerPlant);
  registerInteractive(powerPlant, 'energia');

  // 4. HOSPITAL CENTRAL (Noreste)
  const hospital = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 3.6, 3.4),
    new THREE.MeshLambertMaterial({ color: '#cbd5e1' })
  );
  hospital.position.set(3.5, 1.8, -4.5);
  scene.add(hospital);
  registerInteractive(hospital, 'hospital');

  const crossH = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.4, 0.2),
    new THREE.MeshLambertMaterial({ color: '#ef4444' })
  );
  crossH.position.set(3.5, 2.6, -2.7);
  scene.add(crossH);

  // 5. COMISARÍA Y BOMBEROS (Centro-Sur)
  const police = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 2.2, 3.2),
    new THREE.MeshLambertMaterial({ color: '#1e3a8a' })
  );
  police.position.set(2.5, 1.1, 4);
  scene.add(police);
  registerInteractive(police, 'policia');

  // Partículas de humo / ceniza flotando
  const smokeParticles = [];
  const smokeGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const smokeMat = new THREE.MeshLambertMaterial({
    color: '#9ca3af',
    transparent: true,
    opacity: 0.55,
  });

  for (let i = 0; i < 28; i += 1) {
    const p = new THREE.Mesh(smokeGeo, smokeMat);
    p.position.set(
      (Math.random() - 0.5) * 22,
      1 + Math.random() * 7,
      (Math.random() - 0.5) * 22
    );
    p.userData.speed = 0.015 + Math.random() * 0.02;
    scene.add(p);
    smokeParticles.push(p);
  }

  // Raycaster para hacer clic en los sectores destruidos
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

    // Parpadeo de luz de emergencia
    emergencyLight.intensity = 4 + Math.sin(elapsed * 5) * 2.5;

    smokeParticles.forEach((p) => {
      p.position.y += p.userData.speed;
      if (p.position.y > 9) {
        p.position.y = 1;
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
