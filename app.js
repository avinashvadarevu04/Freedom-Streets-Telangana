import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.5/dist/lenis.mjs';

// ==========================================================================
// CONFIGURATION & GLOBAL STATE
// ==========================================================================
let scene, camera, renderer;
let lenisInstance;
let lastScrollY = 0;
let scrollProgress = 0;
let scrollVelocity = 0;
let currentRunnerZ = 0;
let isSlowdownActive = false;

// Environment Constants
const TRACK_LENGTH = 550; // Z-axis length of athletics track (from 0 to -550)

// 3D Objects & Groups
const runnerGroup = new THREE.Group();
const trackGroup = new THREE.Group();
const landmarksGroup = new THREE.Group();
const sportsGroup = new THREE.Group();
const wellnessGroup = new THREE.Group();
const cultureGroup = new THREE.Group();
const itineraryGroup = new THREE.Group();
const stadiumGroup = new THREE.Group();

// Lights and Atmosphere variables
let ambientLight;
let cultureParticles = [];
let spotlights = [];

// Athlete Skeletal Nodes (Saved for SVG Leader line projections)
const joints = {
  head: new THREE.Vector3(),
  chest: new THREE.Vector3(),
  knee: new THREE.Vector3(),
  ankle: new THREE.Vector3()
};

// Athlete Mesh references
let leftThigh, rightThigh, leftShin, rightShin;
let leftUpperArm, rightUpperArm, leftForearm, rightForearm;
let torso, head;
let runningCycleTime = 0;

// HUD Elements
const telSpeed = document.getElementById('tel-speed');
const telSpeedBar = document.getElementById('tel-speed-bar');
const telCadence = document.getElementById('tel-cadence');
const telHr = document.getElementById('tel-hr');
const telDepth = document.getElementById('tel-depth');
const svgOverlay = document.getElementById('leader-lines');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function init() {
  // 1. Setup Three.js WebGL Core
  const canvas = document.getElementById('webgl-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030712); // Obsidian background
  scene.fog = new THREE.FogExp2(0x030712, 0.0035); // Sleek dark depth fog

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 10);

  // 2. Setup Lighting Rig
  ambientLight = new THREE.AmbientLight(0xff7a59, 0.5); // Sunrise starting glow
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(20, 40, -10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  // 3. Setup Smooth Scrolling (Lenis)
  lenisInstance = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  // 4. Assemble the Athletics Track & Environment Zones
  buildTrack();
  buildAthlete();
  buildLandmarksZone(); // Hero landmarks
  buildSportsZone();    // Sports courts
  buildWellnessZone();  // Wellness rings & diagnostic structures
  buildCultureZone();   // Zumba point clouds
  buildItineraryZone(); // Schedule gates
  buildStadiumZone();   // CTA Arena

  scene.add(trackGroup);
  scene.add(runnerGroup);
  scene.add(landmarksGroup);
  scene.add(sportsGroup);
  scene.add(wellnessGroup);
  scene.add(cultureGroup);
  scene.add(itineraryGroup);
  scene.add(stadiumGroup);

  // 5. Build Unified GSAP timeline with ScrollTrigger
  buildScrollTimeline();

  // 6. Handle Resize
  window.addEventListener('resize', onWindowResize);

  // 7. Start Loop
  animate();
}

// ==========================================================================
// ATHLETICS TRACK BUILDER
// ==========================================================================
function buildTrack() {
  const trackGeo = new THREE.PlaneGeometry(14, TRACK_LENGTH + 100);
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Red track bed
    roughness: 0.85,
    metalness: 0.1
  });
  const trackMesh = new THREE.Mesh(trackGeo, trackMat);
  trackMesh.rotation.x = -Math.PI / 2;
  trackMesh.position.z = -TRACK_LENGTH / 2;
  trackMesh.receiveShadow = true;
  trackGroup.add(trackMesh);

  // Create White Lane Borders
  const laneGeo = new THREE.PlaneGeometry(0.08, TRACK_LENGTH + 100);
  const laneMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lanePositions = [-7, -4.6, -2.3, 0, 2.3, 4.6, 7];

  lanePositions.forEach(x => {
    const lane = new THREE.Mesh(laneGeo, laneMat);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(x, 0.005, -TRACK_LENGTH / 2);
    trackGroup.add(lane);
  });

  // Grid background floor flanking the track
  const gridHelper = new THREE.GridHelper(1000, 100, 0x1e293b, 0x0f172a);
  gridHelper.position.set(0, -0.05, 0);
  trackGroup.add(gridHelper);
}

// ==========================================================================
// ATHLETE MODEL BUILDER (High-Tech Mannequin Joints)
// ==========================================================================
function buildAthlete() {
  const segmentMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.1,
    metalness: 0.8
  });
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7, // Violet joint node
    emissive: 0xa855f7,
    emissiveIntensity: 1.2
  });

  // Torso cylinder
  const torsoGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.8, 8);
  torso = new THREE.Mesh(torsoGeo, segmentMat);
  torso.position.y = 1.35;
  torso.castShadow = true;
  runnerGroup.add(torso);

  // Head sphere
  const headGeo = new THREE.SphereGeometry(0.18, 12, 12);
  head = new THREE.Mesh(headGeo, segmentMat);
  head.position.y = 0.58;
  torso.add(head);

  // Helper function to create limbs
  const createLimb = (parent, offset, length, radius = 0.07) => {
    const joint = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.4, 8, 8), jointMat);
    parent.add(joint);
    joint.position.copy(offset);

    const segment = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), segmentMat);
    segment.position.y = -length / 2;
    segment.castShadow = true;
    joint.add(segment);

    return joint;
  };

  // Build Arms
  leftUpperArm = createLimb(torso, new THREE.Vector3(-0.35, 0.35, 0), 0.35);
  leftForearm = createLimb(leftUpperArm.children[0], new THREE.Vector3(0, -0.35, 0), 0.3);

  rightUpperArm = createLimb(torso, new THREE.Vector3(0.35, 0.35, 0), 0.35);
  rightForearm = createLimb(rightUpperArm.children[0], new THREE.Vector3(0, -0.35, 0), 0.3);

  // Build Legs
  leftThigh = createLimb(torso, new THREE.Vector3(-0.2, -0.4, 0), 0.45);
  leftShin = createLimb(leftThigh.children[0], new THREE.Vector3(0, -0.45, 0), 0.4);

  rightThigh = createLimb(torso, new THREE.Vector3(0.2, -0.4, 0), 0.45);
  rightShin = createLimb(rightThigh.children[0], new THREE.Vector3(0, -0.45, 0), 0.4);

  runnerGroup.position.set(0, 0, 0);
}

// ==========================================================================
// ENVIRONMENT ZONES SETUP (Transforming Track Environment)
// ==========================================================================
function buildLandmarksZone() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });

  // Charminar Gate (Left Side at Z = -35)
  const leftG = new THREE.Group();
  leftG.position.set(-11, 0, -35);
  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.5, 6, 8);
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), mat);
  base.position.y = 1;
  const p1 = new THREE.Mesh(pillarGeo, mat); p1.position.set(-1.5, 3, -1.5);
  const p2 = new THREE.Mesh(pillarGeo, mat); p2.position.set(1.5, 3, -1.5);
  const p3 = new THREE.Mesh(pillarGeo, mat); p3.position.set(-1.5, 3, 1.5);
  const p4 = new THREE.Mesh(pillarGeo, mat); p4.position.set(1.5, 3, 1.5);
  leftG.add(base, p1, p2, p3, p4);
  landmarksGroup.add(leftG);

  // Cyber Towers (Right Side at Z = -50)
  const rightG = new THREE.Group();
  rightG.position.set(11, 0, -50);
  const towerGeo = new THREE.CylinderGeometry(2, 2.2, 8, 12, 1, true);
  const tower = new THREE.Mesh(towerGeo, new THREE.MeshStandardMaterial({ color: 0x334155, wireframe: true }));
  tower.position.y = 4;
  rightG.add(tower);
  landmarksGroup.add(rightG);
}

function buildSportsZone() {
  const gridHelper = new THREE.GridHelper(30, 10, 0x06b6d4, 0x1e293b);
  gridHelper.position.set(-12, 0.01, -260);
  sportsGroup.add(gridHelper);

  // Basketball hoop (Right margin, Z = -280)
  const hoop = new THREE.Group();
  hoop.position.set(10, 0, -280);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), new THREE.MeshStandardMaterial({ color: 0x64748b }));
  pole.position.y = 1.9;
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  board.position.set(0, 3.6, -0.4);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 8, 16), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 3.3, -0.1);
  hoop.add(pole, board, rim);
  sportsGroup.add(hoop);

  // Green Cycling Lane (Left margin, Z = -240 to -300)
  const cycleLaneGeo = new THREE.PlaneGeometry(2, 60);
  const cycleLaneMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.9 });
  const cycleLane = new THREE.Mesh(cycleLaneGeo, cycleLaneMat);
  cycleLane.rotation.x = -Math.PI / 2;
  cycleLane.position.set(-10, 0.015, -270);
  sportsGroup.add(cycleLane);

  // Cycling Lane Dashed Marker Lines
  const dashGeo = new THREE.PlaneGeometry(0.05, 1.5);
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let z = -295; z <= -245; z += 5) {
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(-10, 0.017, z);
    sportsGroup.add(dash);
  }

  // Skating Halfpipe Ramp (Left margin, Z = -245)
  const ramp = new THREE.Group();
  ramp.position.set(-12, 0, -245);
  const rMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const basePlank = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 5), rMat);
  basePlank.position.y = 0.05;
  const lSlope = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1), rMat);
  lSlope.position.set(0, 0.6, -2.5);
  lSlope.rotation.x = -Math.PI / 6;
  const rSlope = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1), rMat);
  rSlope.position.set(0, 0.6, 2.5);
  rSlope.rotation.x = Math.PI / 6;
  ramp.add(basePlank, lSlope, rSlope);
  sportsGroup.add(ramp);

  // Kabaddi clay pit (Right margin, Z = -260)
  const clayPit = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 6), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 }));
  clayPit.position.set(11, 0.025, -260);
  const pitBorder = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 6.2), new THREE.MeshStandardMaterial({ color: 0x78350f }));
  pitBorder.position.set(11, 0.02, -260);
  sportsGroup.add(clayPit, pitBorder);

  // Yoga Zone with colored mats (Right margin, Z = -295)
  const matColors = [0x06b6d4, 0x10b981, 0xf43f5e, 0x8b5cf6];
  matColors.forEach((color, i) => {
    const matGeo = new THREE.PlaneGeometry(0.8, 1.6);
    const matMesh = new THREE.Mesh(matGeo, new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 }));
    matMesh.rotation.x = -Math.PI / 2;
    matMesh.position.set(9.5 + (i % 2) * 1.5, 0.02, -295 - Math.floor(i / 2) * 2.2);
    sportsGroup.add(matMesh);
  });
}

function buildWellnessZone() {
  const ringGeo = new THREE.TorusGeometry(2, 0.06, 8, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4 });

  for (let i = 0; i < 4; i++) {
    const zPos = -320 - i * 16;
    const xPos = i % 2 === 0 ? -10 : 10;
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(xPos, 2.2, zPos);
    ring.rotation.y = Math.PI / 4;
    wellnessGroup.add(ring);
  }

  // Hydration Station (Left margin, Z = -330)
  const hydStation = new THREE.Group();
  hydStation.position.set(-11, 0, -330);
  const table = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
  table.position.y = 0.4;
  hydStation.add(table);
  // Small water bottles
  for (let x = -0.8; x <= 0.8; x += 0.4) {
    for (let z = -0.3; z <= 0.3; z += 0.3) {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1 }));
      bottle.position.set(x, 0.9, z);
      hydStation.add(bottle);
    }
  }
  wellnessGroup.add(hydStation);

  // Physiotherapy Bed (Right margin, Z = -350)
  const physio = new THREE.Group();
  physio.position.set(11, 0, -350);
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 2.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  bedFrame.position.y = 0.35;
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 2.3), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }));
  cushion.position.y = 0.76;
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x8b5cf6 }));
  pillow.position.set(0, 0.86, -0.8);
  physio.add(bedFrame, cushion, pillow);
  wellnessGroup.add(physio);

  // Nutrition Awning booth (Left margin, Z = -370)
  const nutrition = new THREE.Group();
  nutrition.position.set(-11, 0, -370);
  const boothBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 2.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  counter.position.set(0, 0.45, -0.4);
  const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x64748b }));
  pillarL.position.set(-1.3, 1.1, -0.9);
  const pillarR = pillarL.clone();
  pillarR.position.x = 1.3;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.4), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
  roof.position.set(0, 2.2, 0);
  nutrition.add(boothBase, counter, pillarL, pillarR, roof);
  wellnessGroup.add(nutrition);
}

function buildCultureZone() {
  // Soundwave ripples (keeping existing points cloud for rippling dynamics)
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(pCount * 3);

  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = -12 + (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = Math.random() * 5;
    positions[i * 3 + 2] = -430 + (Math.random() - 0.5) * 40;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xdb2777,
    size: 0.2,
    transparent: true,
    opacity: 0.7
  });

  const points = new THREE.Points(pGeo, pMat);
  cultureGroup.add(points);
  cultureParticles.push({ mesh: points, positions });

  // Raised Festival Stage platform (Left margin, Z = -440)
  const stage = new THREE.Group();
  stage.position.set(-11, 0, -440);
  const platform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 4.5), new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 }));
  platform.position.y = 0.2;
  stage.add(platform);

  // Metal Truss arches framing stage
  const trussGeo = new THREE.TorusGeometry(2, 0.08, 8, 24, Math.PI);
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.2, metalness: 0.9 });
  const truss1 = new THREE.Mesh(trussGeo, trussMat);
  truss1.rotation.y = Math.PI / 2;
  truss1.position.set(0, 0.2, -1.8);
  const truss2 = truss1.clone();
  truss2.position.z = 1.8;
  stage.add(truss1, truss2);

  // Colorful stage spotlights
  const createStageSpot = (x, colorHex) => {
    const spot = new THREE.Group();
    spot.position.set(x, 2, 0);
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 4.0, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    cone.rotation.z = x > 0 ? -Math.PI / 12 : Math.PI / 12;
    cone.position.y = -2;
    spot.add(cone);
    return spot;
  };

  const spotL = createStageSpot(-2, 0xdb2777);
  const spotR = createStageSpot(2, 0x06b6d4);
  stage.add(spotL, spotR);
  cultureGroup.add(stage);
}

function buildItineraryZone() {
  const milestoneZ = [-480, -495, -510];
  const gateColors = [0x8b5cf6, 0x06b6d4, 0x10b981];

  milestoneZ.forEach((z, idx) => {
    const gate = new THREE.Group();
    gate.position.set(0, 0, z);

    const lPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.6, 8), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    lPillar.position.set(-7.1, 1.8, 0);
    const rPillar = lPillar.clone();
    rPillar.position.x = 7.1;

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.12, 0.12), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    crossbar.position.set(0, 3.6, 0);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.8 }));
    sign.position.set(0, 3.6, 0);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.06), new THREE.MeshBasicMaterial({ color: gateColors[idx], wireframe: true }));
    frame.position.set(0, 3.6, 0.02);

    gate.add(lPillar, rPillar, crossbar, sign, frame);
    itineraryGroup.add(gate);
  });
}

function buildStadiumZone() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  
  const leftGrandstand = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 40), mat);
  leftGrandstand.position.set(-12, 1.5, -550);
  const rightGrandstand = leftGrandstand.clone();
  rightGrandstand.position.x = 12;

  stadiumGroup.add(leftGrandstand, rightGrandstand);

  // Glowing digital LED screens alongside the stadium road (Z = -530 to -560)
  const ledScreenGeo = new THREE.PlaneGeometry(12, 2.5);
  const ledScreenMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
  const ledFrameGeo = new THREE.BoxGeometry(12.2, 2.7, 0.1);
  const ledFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

  for (let i = 0; i < 4; i++) {
    const z = -530 - i * 10;
    // Left side LED screen
    const ledFrameL = new THREE.Mesh(ledFrameGeo, ledFrameMat);
    ledFrameL.position.set(-8.5, 1.35, z);
    ledFrameL.rotation.y = Math.PI / 12;
    const ledL = new THREE.Mesh(ledScreenGeo, ledScreenMat);
    ledL.position.set(-8.45, 1.35, z);
    ledL.rotation.y = Math.PI / 12;
    
    // Right side LED screen
    const ledFrameR = new THREE.Mesh(ledFrameGeo, ledFrameMat);
    ledFrameR.position.set(8.5, 1.35, z);
    ledFrameR.rotation.y = -Math.PI / 12;
    const ledR = new THREE.Mesh(ledScreenGeo, ledScreenMat);
    ledR.position.set(8.45, 1.35, z);
    ledR.rotation.y = -Math.PI / 12;

    stadiumGroup.add(ledFrameL, ledL, ledFrameR, ledR);
  }

  // Crowd point camera sparkles (packed spectators)
  const crowdCount = 150;
  const crowdGeo = new THREE.BufferGeometry();
  const crowdPos = new Float32Array(crowdCount * 3);
  for (let i = 0; i < crowdCount; i++) {
    // Left stands or right stands randomly
    const side = Math.random() > 0.5 ? -1 : 1;
    crowdPos[i * 3] = (10.5 + Math.random() * 4) * side;
    crowdPos[i * 3 + 1] = 0.5 + Math.random() * 3;
    crowdPos[i * 3 + 2] = -530 - Math.random() * 40;
  }
  crowdGeo.setAttribute('position', new THREE.BufferAttribute(crowdPos, 3));
  const crowdPointsMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.95
  });
  const crowdSparkles = new THREE.Points(crowdGeo, crowdPointsMat);
  stadiumGroup.add(crowdSparkles);

  const createSpotlight = (x, z, color) => {
    const spot = new THREE.Group();
    spot.position.set(x, 9, z);

    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 9.0, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    beam.rotation.x = Math.PI / 8;
    beam.position.y = -4.5;
    spot.add(beam);
    return spot;
  };

  const spot1 = createSpotlight(-12, -540, 0x06b6d4);
  const spot2 = createSpotlight(12, -540, 0x8b5cf6);
  stadiumGroup.add(spot1, spot2);
  spotlights.push(spot1, spot2);

  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 }));
  postL.position.set(-5.1, 0.9, -545);
  const postR = postL.clone();
  postR.position.x = 5.1;

  const tape = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.1, 0.01), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  tape.name = "finish_tape";
  tape.position.set(0, 1.0, -545);

  stadiumGroup.add(postL, postR, tape);
}

// ==========================================================================
// UNIFIED GSAP SCROLL MECHANICS TIMELINE
// ==========================================================================
function buildScrollTimeline() {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress = self.progress;
        scrollVelocity = self.getVelocity() * 0.001;
      }
    }
  });

  // Runner Z progresses linearly over the ENTIRE duration (0.0 to 1.0)
  tl.to(runnerGroup.position, {
    z: -TRACK_LENGTH,
    ease: "none",
    duration: 1.0
  }, 0);

  // Camera tracking keyframes with matched durations
  tl.to(camera.position, { x: 0.0, y: 2.2, z: -60 + 7.5, ease: "sine.inOut", duration: 0.12 }, 0.0) // Hero
    .to(camera.position, { x: -6.5, y: 1.4, z: -220 + 3.0, ease: "sine.inOut", duration: 0.16 }, 0.12) // Vision
    .to(camera.position, { x: 6.0, y: 4.5, z: -310 + 6.0, ease: "sine.inOut", duration: 0.14 }, 0.28) // Venue
    .to(camera.position, { x: 0.0, y: 9.5, z: -390 + 0.1, ease: "sine.inOut", duration: 0.16 }, 0.42) // Sports
    .to(camera.position, { x: 7.5, y: 2.0, z: -470 - 2.0, ease: "sine.inOut", duration: 0.14 }, 0.58) // Wellness
    .to(camera.position, { x: -6.5, y: 1.8, z: -510 + 4.5, ease: "sine.inOut", duration: 0.16 }, 0.72) // Culture
    .to(camera.position, { x: 0.0, y: 2.5, z: -540 - 6.5, ease: "sine.inOut", duration: 0.08 }, 0.88) // Itinerary
    .to(camera.position, { x: -1.5, y: 1.2, z: -542, ease: "sine.inOut", duration: 0.04 }, 0.96); // Stadium

  // Annotation card fades mapped onto the timeline
  const cards = document.querySelectorAll('.annotation-card');
  cards.forEach(card => {
    const start = parseFloat(card.getAttribute('data-start'));
    const end = parseFloat(card.getAttribute('data-end'));
    const dur = end - start;

    // Fade in
    tl.to(card, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      ease: "power2.out",
      duration: dur * 0.15
    }, start)
    // Hold active
    .to(card, {
      opacity: 1,
      y: 0,
      duration: dur * 0.70
    })
    // Fade out
    .to(card, {
      opacity: 0,
      y: -20,
      visibility: "hidden",
      ease: "power2.in",
      duration: dur * 0.15
    });
  });
}

// ==========================================================================
// ANIMATION TICKER LOOP
// ==========================================================================
function animate(time) {
  requestAnimationFrame(animate);

  // Initialize default time if undefined to prevent NaN calculations
  if (time === undefined) {
    time = performance.now();
  }

  // 1. Update Lenis Smooth scroll
  lenisInstance.raf(time);

  // Calculate velocity deceleration smoothly
  scrollVelocity = THREE.MathUtils.lerp(scrollVelocity, 0, 0.05);

  // Compute speed metrics for HUD
  const targetSpeed = Math.min(28.2, scrollVelocity * 4.5);
  const activeSpeed = THREE.MathUtils.lerp(parseFloat(telSpeed.innerText) || 0, targetSpeed, 0.1);
  
  telSpeed.innerText = activeSpeed.toFixed(1);
  telSpeedBar.style.width = `${(activeSpeed / 28.2) * 100}%`;

  const activeCadence = Math.round(activeSpeed * 6.38);
  telCadence.innerText = activeCadence.toString();

  const activeHr = Math.round(72 + (scrollProgress * 86) + (activeSpeed * 1.5));
  telHr.innerText = activeHr.toString();

  // Athlete Z position follows the GSAP controller mesh
  currentRunnerZ = runnerGroup.position.z;
  telDepth.innerText = Math.round(Math.abs(currentRunnerZ)).toString();

  // 3. Drive Runner joint swings based on velocity
  const activityFactor = Math.min(1.0, activeSpeed / 2.0);
  const dt = 0.016;
  const speedDamp = isSlowdownActive ? 0.35 : 1.0;
  runningCycleTime += Math.max(0.3, activeSpeed * 0.25) * dt * 10 * speedDamp;

  animateAthlete(activityFactor);

  // 4. Set lighting color shift and track camera focus
  updateCameraFocus();

  // 5. Update side volumetric details
  animateEnvironments(time * 0.001);

  // 6. Draw annotations SVG leader lines
  updateLeaderLines();

  renderer.render(scene, camera);
}

// ==========================================================================
// ATHLETE RIG JOINT ANIMATOR
// ==========================================================================
function animateAthlete(factor) {
  const theta = runningCycleTime;

  if (factor < 0.05) {
    // Idle breathing state
    const breath = Math.sin(Date.now() * 0.0035) * 0.04;
    torso.position.y = 1.35 + breath;
    head.rotation.x = breath * 0.5;

    leftThigh.rotation.set(0, 0, 0);
    leftShin.rotation.set(0, 0, 0);
    rightThigh.rotation.set(0, 0, 0);
    rightShin.rotation.set(0, 0, 0);

    leftUpperArm.rotation.set(0.1, 0, 0.1);
    leftForearm.rotation.set(0.1, 0, 0);
    rightUpperArm.rotation.set(0.1, 0, -0.1);
    rightForearm.rotation.set(0.1, 0, 0);
  } else {
    // Jog/sprint cyclical limb movements
    const amplitude = 0.58 * factor;
    torso.position.y = 1.3 + Math.abs(Math.sin(theta * 2)) * 0.12 * factor;
    torso.rotation.y = Math.sin(theta) * 0.15 * factor;
    torso.rotation.x = 0.15 * factor; // lean forward

    leftThigh.rotation.x = Math.sin(theta) * amplitude;
    leftShin.rotation.x = (Math.cos(theta) * 0.4 + 0.4) * factor;

    rightThigh.rotation.x = -Math.sin(theta) * amplitude;
    rightShin.rotation.x = (-Math.cos(theta) * 0.4 + 0.4) * factor;

    leftUpperArm.rotation.x = -Math.sin(theta) * amplitude * 1.1;
    leftUpperArm.rotation.z = 0.15;
    leftForearm.rotation.x = (-Math.sin(theta) * 0.3 - 0.7) * factor;

    rightUpperArm.rotation.x = Math.sin(theta) * amplitude * 1.1;
    rightUpperArm.rotation.z = -0.15;
    rightForearm.rotation.x = (Math.sin(theta) * 0.3 - 0.7) * factor;
  }

  // Update absolute 3D joint coordinate vectors for project mapping
  torso.localToWorld(joints.chest.set(0, 0.2, 0));
  head.localToWorld(joints.head.set(0, 0.1, 0));
  leftThigh.localToWorld(joints.knee.set(0, -0.4, 0));
  leftShin.localToWorld(joints.ankle.set(0, -0.45, 0));
}

// ==========================================================================
// CAMERA FOCUS & COLOR SHIFTS
// ==========================================================================
function updateCameraFocus() {
  const p = scrollProgress;

  // Let camera lookAt target track the runner coordinates dynamically
  const targetLook = new THREE.Vector3(0, 1.2, currentRunnerZ);
  if (p >= 0.96) {
    targetLook.set(0, 1.0, -545); // Focus finish line crossing
  }

  const currentLook = new THREE.Vector3(0, 1.2, camera.position.z - 5);
  currentLook.lerp(targetLook, 0.1);
  camera.lookAt(currentLook);

  // Sunrise -> Noon -> Twilight -> Stadium floodlights Color Shift
  let skyColor, fogColor, ambientIntensity;
  if (p < 0.3) {
    skyColor = new THREE.Color(0x0a0f1d).lerp(new THREE.Color(0x0c0c1e), p / 0.3);
    fogColor = new THREE.Color(0x030712);
    ambientLight.color.setHex(0xff7a59);
    ambientIntensity = 0.5;
  } else if (p >= 0.3 && p < 0.6) {
    skyColor = new THREE.Color(0x0c0c1e).lerp(new THREE.Color(0x080c14), (p - 0.3) / 0.3);
    fogColor = new THREE.Color(0x030712);
    ambientLight.color.setHex(0x93c5fd);
    ambientIntensity = 0.75;
  } else if (p >= 0.6 && p < 0.88) {
    const ratio = (p - 0.6) / 0.28;
    skyColor = new THREE.Color(0x030712);
    fogColor = new THREE.Color(0x180f2b);
    ambientLight.color.setHex(0xdb2777).lerp(new THREE.Color(0x8b5cf6), ratio);
    ambientIntensity = 0.4;
  } else {
    skyColor = new THREE.Color(0x020617);
    fogColor = new THREE.Color(0x020617);
    ambientLight.color.setHex(0x1e293b);
    ambientIntensity = 0.6;
  }

  scene.background = skyColor;
  scene.fog.color = fogColor;
  ambientLight.intensity = ambientIntensity;

  // Drop finish ribbon when runner passes Z = -545
  const tape = stadiumGroup.getObjectByName("finish_tape");
  if (tape) {
    if (currentRunnerZ < -545) {
      tape.scale.x = 0.05;
      tape.position.y = -0.5;
    } else {
      tape.scale.x = 1.0;
      tape.position.y = 1.0;
    }
  }
}

// ==========================================================================
// DYNAMIC SOUNDWAVE & SPOTLIGHT EFFECTS
// ==========================================================================
function animateEnvironments(time) {
  cultureParticles.forEach(cloud => {
    const attr = cloud.mesh.geometry.getAttribute('position');
    for (let i = 0; i < attr.count; i++) {
      const yOrig = cloud.positions[i * 3 + 1];
      const x = attr.getX(i);
      const z = attr.getZ(i);
      const dist = Math.sqrt((x + 12) * (x + 12) + (z + 430) * (z + 430));
      const ripple = Math.sin(dist * 0.4 - time * 3.5) * 0.35;
      attr.setY(i, yOrig + ripple);
    }
    attr.needsUpdate = true;
  });

  spotlights.forEach((spot, idx) => {
    const beam = spot.children[0];
    if (beam) {
      beam.rotation.z = Math.sin(time * 2 + idx) * 0.3;
      beam.rotation.x = Math.cos(time * 1.5 + idx) * 0.15;
    }
  });
}

// ==========================================================================
// SVG LEADER LINE PROJECTION (Awwwards 3D -> 2D lead points)
// ==========================================================================
function updateLeaderLines() {
  while (svgOverlay.lastChild && svgOverlay.lastChild.tagName !== 'defs') {
    svgOverlay.removeChild(svgOverlay.lastChild);
  }

  // Hide scroll hint when user scrolls past 5%
  const hint = document.getElementById('scroll-hint');
  if (scrollProgress > 0.05) {
    hint.style.opacity = '0';
  } else {
    hint.style.opacity = '1';
  }

  const cards = document.querySelectorAll('.annotation-card');
  let activeCardFound = false;

  cards.forEach(card => {
    const start = parseFloat(card.getAttribute('data-start'));
    const end = parseFloat(card.getAttribute('data-end'));
    const jointName = card.getAttribute('data-joint');
    const side = card.getAttribute('data-side');

    if (scrollProgress >= start && scrollProgress <= end) {
      card.classList.add('active');
      activeCardFound = true;

      // Class positioning
      if (side === 'left') {
        card.classList.remove('right-aligned');
        card.classList.add('left-aligned');
      } else {
        card.classList.remove('left-aligned');
        card.classList.add('right-aligned');
      }

      // Project coordinates from 3D to 2D CSS screen pixels
      const jointVector = joints[jointName] || joints.chest;
      const screenPos = jointVector.clone().project(camera);

      const pxX = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
      const pxY = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

      const rect = card.getBoundingClientRect();
      const cardX = side === 'left' ? rect.right : rect.left;
      const cardY = rect.top + rect.height / 2;

      // Draw connecting bezier path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cp1X = cardX + (side === 'left' ? 40 : -40);
      const cp2X = pxX + (side === 'left' ? -40 : 40);
      const d = `M ${cardX} ${cardY} C ${cp1X} ${cardY}, ${cp2X} ${pxY}, ${pxX} ${pxY}`;

      path.setAttribute('d', d);
      path.setAttribute('stroke', 'url(#line-grad)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      svgOverlay.appendChild(path);

      // Render glowing point
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pxX.toString());
      circle.setAttribute('cy', pxY.toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#a855f7');
      svgOverlay.appendChild(circle);

      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('cx', pxX.toString());
      glow.setAttribute('cy', pxY.toString());
      glow.setAttribute('r', '15');
      glow.setAttribute('fill', 'url(#dot-glow)');
      svgOverlay.appendChild(glow);
    } else {
      card.classList.remove('active');
    }
  });

  isSlowdownActive = activeCardFound;
}

// ==========================================================================
// RESIZING HANDLER
// ==========================================================================
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('DOMContentLoaded', init);
