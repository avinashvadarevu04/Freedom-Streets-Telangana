"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

import { districtsData } from "./TelanganaMap3D";

const zoneCameraViews: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
  stage: { pos: [0, 4, 5], look: [0, 0.4, 0] },
  activity: { pos: [-4, 3.5, 1.5], look: [-4, 0.1, -2.5] },
  running: { pos: [5, 4.5, 6.0], look: [5, 0.05, 0.5] },
  pet: { pos: [-5, 3.8, 8.0], look: [-5, 0.1, 3.5] },
  kids: { pos: [4, 4.0, 1.5], look: [4, 0.1, -3.5] },
  food: { pos: [-1.2, 4.0, -1.0], look: [-1.2, 0.1, -5.5] },
  merchandise: { pos: [2.2, 4.0, -1.0], look: [2.2, 0.1, -5.5] },
  seating: { pos: [0, 3.5, 9.5], look: [0, 0.1, 4.5] },
  parking: { pos: [9.5, 3.5, 9.5], look: [9.5, 0.05, 4.5] },
  entry: { pos: [-9.5, 3.5, 5.5], look: [-9.5, 0.1, 0.5] }
};

// Custom scroll-linked camera controller inside Canvas
function CameraController({ 
  scrollProgress, 
  activeZoneId, 
  selectedDistrictIndex, 
  activeSportId 
}: { 
  scrollProgress: number; 
  activeZoneId: string | null; 
  selectedDistrictIndex: number | null; 
  activeSportId: string | null; 
}) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 80, 100));
  const targetLookAt = useRef(new THREE.Vector3(0, 5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 5, 0));

  useFrame((state, delta) => {
    const p = scrollProgress;

    // Check if in Districts or Sports/Venue section (0.58 to 0.72) to apply split-screen/zoom override
    if (p >= 0.58 && p <= 0.72) {
      if (selectedDistrictIndex !== null && districtsData[selectedDistrictIndex]) {
        // Zoom into selected district (shifted left to X -3.2)
        const d = districtsData[selectedDistrictIndex];
        targetLookAt.current.set(d.pos[0] - 3.2, 0.15, d.pos[2] - 1);
        targetCamPos.current.set(d.pos[0] - 3.2, 3.8, d.pos[2] + 2.8);
      } else if (activeZoneId && zoneCameraViews[activeZoneId]) {
        // Zoom into Dallas Road venue zone pin selection
        const view = zoneCameraViews[activeZoneId];
        targetCamPos.current.set(...view.pos);
        targetLookAt.current.set(...view.look);
      } else if (activeSportId !== null) {
        // Focus slightly into sports showcase on the right side
        targetLookAt.current.set(3.2, 0.2, -1);
        targetCamPos.current.set(3.2, 2.5, 3.0);
      } else {
        // Balanced Split view showing both columns
        targetLookAt.current.set(-0.8, 0, -1);
        targetCamPos.current.set(0, 9, 10.5);
      }
    } else {
      // Define the standard camera path keyframes based on scrollProgress (0 to 1)
      if (p < 0.12) {
        // 1. Hero Sunrise: Camera starts high, slowly moving down
        const t = p / 0.12;
        targetCamPos.current.set(
          0,
          THREE.MathUtils.lerp(80, 20, t),
          THREE.MathUtils.lerp(100, 70, t)
        );
        targetLookAt.current.set(0, THREE.MathUtils.lerp(5, 2, t), 0);
      } else if (p < 0.18) {
        // 2. The Road Opens: Camera drops to street level
        const t = (p - 0.12) / 0.06;
        targetCamPos.current.set(
          0,
          THREE.MathUtils.lerp(20, 2.5, t),
          THREE.MathUtils.lerp(70, 25, t)
        );
        targetLookAt.current.set(0, 1.8, THREE.MathUtils.lerp(0, -50, t));
      } else if (p < 0.42) {
        // 3. Vision & Philosophy: Camera pans sideways to look at floating panels
        const t = (p - 0.18) / 0.24;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(0, 10, t),
          THREE.MathUtils.lerp(2.5, 4, t),
          THREE.MathUtils.lerp(25, 15, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0, -12, t),
          THREE.MathUtils.lerp(1.8, 3, t),
          THREE.MathUtils.lerp(-50, -25, t)
        );
      } else if (p < 0.58) {
        // 4. Program Overview & Structure: Slow vertical orbit transition
        const t = (p - 0.42) / 0.16;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(10, 0, t),
          THREE.MathUtils.lerp(4, 16, t),
          THREE.MathUtils.lerp(15, 18, t)
        );
        targetLookAt.current.set(0, THREE.MathUtils.lerp(3, 0, t), 0);
      } else if (p < 0.89) {
        // 7. Fitness & Zumba: Pivot into festival particle storms
        const t = (p - 0.72) / 0.17;
        targetCamPos.current.set(
          THREE.MathUtils.lerp(-18, 0, t),
          THREE.MathUtils.lerp(5.5, 3, t),
          THREE.MathUtils.lerp(16, -12, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(-10, 0, t),
          THREE.MathUtils.lerp(4, 2, t),
          THREE.MathUtils.lerp(-10, -50, t)
        );
      } else if (p < 0.93) {
        // 8. Cultural Celebrations
        const t = (p - 0.89) / 0.04;
        targetCamPos.current.set(
          0,
          THREE.MathUtils.lerp(3, 2, t),
          THREE.MathUtils.lerp(-12, -35, t)
        );
        targetLookAt.current.set(0, 1.8, THREE.MathUtils.lerp(-50, -100, t));
      } else if (p < 0.985) {
        // 9. Infinite Timeline Road: Cruise down the highway
        const t = (p - 0.93) / 0.055;
        targetCamPos.current.set(
          0,
          1.8,
          THREE.MathUtils.lerp(-35, -80, t)
        );
        targetLookAt.current.set(0, 1.2, THREE.MathUtils.lerp(-100, -150, t));
      } else {
        // 10. Final Outro: Rocket high up for the grand sunset drone shot
        const t = (p - 0.985) / 0.015;
        targetCamPos.current.set(
          0,
          THREE.MathUtils.lerp(1.8, 50, t),
          THREE.MathUtils.lerp(-80, 80, t)
        );
        targetLookAt.current.set(0, THREE.MathUtils.lerp(1.2, 5, t), -80);
      }
    }

    // Smooth lerping of camera position and target
    const lerpSpeed = 0.08;
    camera.position.lerp(targetCamPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Particle Storm (morning mist, leaves, sparkles)
function ParticleStorm() {
  const count = 1200;
  
  // Synchronously initialize positions in a ref so they persist across renders
  const positions = useRef((() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = Math.random() * 80;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 250;
    }
    return arr;
  })());

  // Synchronously initialize velocities
  const velocities = useRef((() => {
    const vels: number[] = [];
    for (let i = 0; i < count; i++) {
      vels.push(
        (Math.random() - 0.5) * 0.05, // dx
        -(Math.random() * 0.1 + 0.05), // dy (drift downwards)
        (Math.random() - 0.5) * 0.05  // dz
      );
    }
    return vels;
  })());

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position");

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Apply velocity
      x += velocities.current[i * 3];
      y += velocities.current[i * 3 + 1];
      z += velocities.current[i * 3 + 2];

      // Bounce/recycle if out of bounds
      if (y < 0) y = 80;
      if (Math.abs(x) > 100) x = (Math.random() - 0.5) * 200;
      if (Math.abs(z) > 150) z = (Math.random() - 0.5) * 250;

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions.current} stride={3}>
      <PointMaterial
        transparent
        color="#EC4899"
        size={0.25}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

// Lighting Rig matching the scroll stage (Sunrise -> Midday -> Sunset)
function LightingRig({ scrollProgress }: { scrollProgress: number }) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const fogRef = useRef<THREE.FogExp2>(null);

  useFrame((state) => {
    const p = scrollProgress;
    let skyColor = new THREE.Color("#FAFAFC");
    let fogColor = new THREE.Color("#FAFAFC");
    let dirColor = new THREE.Color("#6D28D9");
    let ambientIntensity = 0.85;
    let dirIntensity = 1.2;
    let fogDensity = 0.015;

    if (p < 0.2) {
      // 1. Sunrise phase (Soft lavender-cream to warm pearl)
      const t = p / 0.2;
      skyColor.lerpColors(new THREE.Color("#F0EBF8"), new THREE.Color("#F5F5FA"), t);
      fogColor.lerpColors(new THREE.Color("#F0EBF8"), new THREE.Color("#F5F5FA"), t);
      dirColor.lerpColors(new THREE.Color("#8B5CF6"), new THREE.Color("#06B6D4"), t);
      ambientIntensity = THREE.MathUtils.lerp(0.75, 0.88, t);
      dirIntensity = THREE.MathUtils.lerp(0.6, 1.1, t);
      fogDensity = THREE.MathUtils.lerp(0.02, 0.012, t);
    } else if (p < 0.7) {
      // 2. Daytime / Map / Sports phase (Clean bright off-white daylight)
      const t = (p - 0.2) / 0.5;
      skyColor.lerpColors(new THREE.Color("#F5F5FA"), new THREE.Color("#FAFAFC"), t);
      fogColor.lerpColors(new THREE.Color("#F5F5FA"), new THREE.Color("#FAFAFC"), t);
      dirColor.lerpColors(new THREE.Color("#06B6D4"), new THREE.Color("#ffffff"), t);
      ambientIntensity = THREE.MathUtils.lerp(0.88, 0.95, t);
      dirIntensity = THREE.MathUtils.lerp(1.1, 1.4, t);
      fogDensity = THREE.MathUtils.lerp(0.012, 0.006, t);
    } else {
      // 3. Cultural / Outro Sunset phase (Soft peach-pink twilight)
      const t = (p - 0.7) / 0.3;
      skyColor.lerpColors(new THREE.Color("#FAFAFC"), new THREE.Color("#FAF0F4"), t);
      fogColor.lerpColors(new THREE.Color("#FAFAFC"), new THREE.Color("#FAF0F4"), t);
      dirColor.lerpColors(new THREE.Color("#ffffff"), new THREE.Color("#DB2777"), t);
      ambientIntensity = THREE.MathUtils.lerp(0.95, 0.85, t);
      dirIntensity = THREE.MathUtils.lerp(1.4, 0.9, t);
      fogDensity = THREE.MathUtils.lerp(0.006, 0.012, t);
    }

    // Set background sky and fog color
    state.scene.background = skyColor;
    if (state.scene.fog) {
      state.scene.fog.color = fogColor;
      (state.scene.fog as THREE.FogExp2).density = fogDensity;
    }

    if (ambientLightRef.current) ambientLightRef.current.intensity = ambientIntensity;
    if (dirLightRef.current) {
      dirLightRef.current.intensity = dirIntensity;
      dirLightRef.current.color = dirColor;
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.8} />
      <directionalLight
        ref={dirLightRef}
        intensity={1.2}
        position={[25, 45, 10]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <fogExp2 attach="fog" ref={fogRef} args={["#FAFAFC", 0.015]} />
    </>
  );
}

function CursorLight3D() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    lightRef.current.position.set(x, y, 4.0);
  });

  return <pointLight ref={lightRef} intensity={1.5} distance={10} color="#7C3AED" castShadow />;
}

// Global Canvas wrapper export
interface CinematicCanvasProps {
  scrollProgress: number;
  activeZoneId: string | null;
  selectedDistrictIndex: number | null;
  activeSportId: string | null;
  children: React.ReactNode;
}

export default function CinematicCanvas({ 
  scrollProgress, 
  activeZoneId, 
  selectedDistrictIndex, 
  activeSportId, 
  children 
}: CinematicCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#FAFAFC] pointer-events-none">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 80, 100], fov: 45, near: 0.1, far: 1000 }}
      >
        <CameraController 
          scrollProgress={scrollProgress} 
          activeZoneId={activeZoneId} 
          selectedDistrictIndex={selectedDistrictIndex}
          activeSportId={activeSportId}
        />
         <LightingRig scrollProgress={scrollProgress} />
        <ParticleStorm />
        <CursorLight3D />

        {/* Procedural 3D athlete for Wellness section */}
        <HealthAthlete3D scrollProgress={scrollProgress} />
        
        {/* Render children scenes inside R3F canvas */}
        {children}
      </Canvas>
    </div>
  );
}

// Procedural 3D interactive athlete mannequin with real-time skeleton animation and mouse-parallax
function HealthAthlete3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Joint definitions for runner cycle
  const headPos = useRef(new THREE.Vector3(0, 3.2, 0));
  const chestPos = useRef(new THREE.Vector3(0, 2.2, 0));
  const hipPos = useRef(new THREE.Vector3(0, 1.2, 0));
  
  const lShoulder = useRef(new THREE.Vector3(-0.6, 2.4, 0));
  const rShoulder = useRef(new THREE.Vector3(0.6, 2.4, 0));
  const lElbow = useRef(new THREE.Vector3(-1.0, 1.6, 0.2));
  const rElbow = useRef(new THREE.Vector3(1.0, 1.6, -0.2));
  const lHand = useRef(new THREE.Vector3(-1.2, 1.0, 0.5));
  const rHand = useRef(new THREE.Vector3(1.2, 1.0, -0.5));
  
  const lHip = useRef(new THREE.Vector3(-0.4, 1.2, 0));
  const rHip = useRef(new THREE.Vector3(0.4, 1.2, 0));
  const lKnee = useRef(new THREE.Vector3(-0.6, 0.6, -0.4));
  const rKnee = useRef(new THREE.Vector3(0.6, 0.6, 0.4));
  const lFoot = useRef(new THREE.Vector3(-0.8, 0, -0.8));
  const rFoot = useRef(new THREE.Vector3(0.8, 0, 0.8));

  useFrame((state) => {
    if (scrollProgress < 0.86 || scrollProgress > 0.88) return;
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime() * 4.5;
    
    // Simulate runner gait cycle
    const lCycle = Math.sin(time);
    const rCycle = Math.sin(time + Math.PI);
    
    // Legs swing
    lKnee.current.set(-0.5, 0.7 + Math.max(0, lCycle) * 0.35, lCycle * 0.7);
    lFoot.current.set(-0.5, 0.1 + Math.max(0, lCycle) * 0.45, lCycle * 1.0);
    
    rKnee.current.set(0.5, 0.7 + Math.max(0, rCycle) * 0.35, rCycle * 0.7);
    rFoot.current.set(0.5, 0.1 + Math.max(0, rCycle) * 0.45, rCycle * 1.0);
    
    // Arms swing
    lElbow.current.set(-0.8, 1.8 + rCycle * 0.25, rCycle * 0.6);
    lHand.current.set(-1.0, 1.4 + rCycle * 0.35, rCycle * 0.9);
    
    rElbow.current.set(0.8, 1.8 + lCycle * 0.25, lCycle * 0.6);
    rHand.current.set(1.0, 1.4 + lCycle * 0.35, lCycle * 0.9);
    
    // Torso bob
    headPos.current.y = 3.2 + Math.abs(Math.sin(time * 2)) * 0.12;
    chestPos.current.y = 2.2 + Math.abs(Math.sin(time * 2)) * 0.08;
    
    // Mouse rotate
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.2;
    groupRef.current.rotation.y = Math.PI / 4 + mouseX;
    groupRef.current.rotation.x = mouseY;
  });

  if (scrollProgress < 0.86 || scrollProgress > 0.88) return null;

  const limbs = [
    [headPos, chestPos],
    [chestPos, hipPos],
    [chestPos, lShoulder],
    [chestPos, rShoulder],
    [lShoulder, lElbow],
    [lElbow, lHand],
    [rShoulder, rElbow],
    [rElbow, rHand],
    [hipPos, lHip],
    [hipPos, rHip],
    [lHip, lKnee],
    [lKnee, lFoot],
    [rHip, rKnee],
    [rKnee, rFoot]
  ];

  const joints = [
    headPos, chestPos, hipPos,
    lShoulder, rShoulder, lElbow, rElbow, lHand, rHand,
    lHip, rHip, lKnee, rKnee, lFoot, rFoot
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, -8]}>
      {/* Glow aura */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.03} wireframe />
      </mesh>

      {/* Render joints as glowing spheres */}
      {joints.map((jointRef, idx) => (
        <JointSphere key={idx} positionRef={jointRef} isHead={idx === 0} />
      ))}

      {/* Render connecting limbs */}
      {limbs.map((limb, idx) => (
        <LimbLine key={idx} startRef={limb[0]} endRef={limb[1]} />
      ))}
      
      {/* Floating wellness accessory particles */}
      <FloatingWellnessAccessories3D />
    </group>
  );
}

function JointSphere({ positionRef, isHead }: { positionRef: React.MutableRefObject<THREE.Vector3>; isHead: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(positionRef.current);
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[isHead ? 0.28 : 0.08, 16, 16]} />
      <meshStandardMaterial color={isHead ? "#db2777" : "#06b6d4"} emissive={isHead ? "#db2777" : "#06b6d4"} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function LimbLine({ startRef, endRef }: { startRef: React.MutableRefObject<THREE.Vector3>; endRef: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const start = startRef.current;
    const end = endRef.current;
    
    const distance = start.distanceTo(end);
    const position = start.clone().add(end).multiplyScalar(0.5);
    
    const direction = end.clone().sub(start).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    
    meshRef.current.position.copy(position);
    meshRef.current.quaternion.copy(quaternion);
    meshRef.current.scale.set(1, distance, 1);
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.025, 0.025, 1, 8]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
    </mesh>
  );
}

function FloatingWellnessAccessories3D() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
  });
  return (
    <group ref={groupRef}>
      {/* Apple-like red sphere */}
      <mesh position={[-1.5, 2.0, 1.0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>
      {/* Hydration ring / torus */}
      <mesh position={[1.5, 1.0, -1.2]} rotation={[Math.PI/4, 0, 0]}>
        <torusGeometry args={[0.18, 0.06, 8, 24]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.1} />
      </mesh>
      {/* Dumbbell bar */}
      <group position={[-1.2, 0.4, -1.5]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
}
