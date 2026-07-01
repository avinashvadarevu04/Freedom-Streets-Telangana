"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Stylized Charminar Model built procedurally
function LowPolyCharminar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Central Base Arch */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 8, 10]} />
        <meshStandardMaterial color="#E4E7EB" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Archway cutouts (simplified by glowing arches) */}
      <mesh position={[0, 3.5, 5.01]}>
        <boxGeometry args={[4, 5, 0.05]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, 3.5, -5.01]}>
        <boxGeometry args={[4, 5, 0.05]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.15} />
      </mesh>

      {/* 4 Corner Towers */}
      {[-4.2, 4.2].map((x, i) =>
        [-4.2, 4.2].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 0, z]}>
            {/* Main pillar */}
            <mesh position={[0, 7.5, 0]} castShadow>
              <cylinderGeometry args={[0.7, 0.9, 15, 8]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
            </mesh>
            {/* Tower dome */}
            <mesh position={[0, 15.5, 0]} castShadow>
              <sphereGeometry args={[1.1, 8, 8]} />
              <meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Spire point */}
            <mesh position={[0, 17, 0]}>
              <coneGeometry args={[0.1, 2, 4]} />
              <meshBasicMaterial color="#d4af37" />
            </mesh>
          </group>
        ))
      )}

      {/* Upper terrace */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[11.5, 1, 11.5]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>

      {/* Center Dome */}
      <mesh position={[0, 9.5, 0]} castShadow>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Stylized Cyber Towers Model
function LowPolyCyberTowers({ position }: { position: [number, number, number] }) {
  const rings = 8;
  return (
    <group position={position}>
      {/* Central cylinder columns */}
      <mesh position={[0, 12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 5, 24, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Horizontal glowing ring bands */}
      {Array.from({ length: rings }).map((_, idx) => (
        <mesh key={idx} position={[0, 2 + idx * 2.8, 0]}>
          <cylinderGeometry args={[4.8 - idx * 0.05, 4.8 - idx * 0.05, 0.4, 16, 1, true]} />
          <meshBasicMaterial
            color={idx % 2 === 0 ? "#8B5CF6" : "#EC4899"}
            transparent
            opacity={0.35}
            side={2} // DoubleSide
          />
        </mesh>
      ))}

      {/* Antenna spire */}
      <mesh position={[0, 26, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 4, 4]} />
        <meshStandardMaterial color="#8B5CF6" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function HyderabadHero3D({ scrollProgress }: { scrollProgress: number }) {
  const barrierLeftRef = useRef<any>(null);
  const barrierRightRef = useRef<any>(null);
  const participantsRef = useRef<any>(null);

  // Constants for participant counts
  const particleCount = 180;
  const initialData = useRef<Array<{
    speed: number;
    laneOffset: number;
    zOffset: number;
    color: string;
    type: "jogger" | "cyclist" | "walker";
    phase: number;
    height: number;
  }>>([]);

  // Generate participant details on first run
  if (initialData.current.length === 0) {
    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const type = typeRand > 0.6 ? "jogger" : typeRand > 0.3 ? "cyclist" : "walker";
      initialData.current.push({
        speed: type === "cyclist" ? 0.35 : type === "jogger" ? 0.18 : 0.08,
        laneOffset: (Math.random() - 0.5) * 14, // road width
        zOffset: -250 - Math.random() * 200,    // start way back
        color: Math.random() > 0.65 ? "#8B5CF6" : Math.random() > 0.3 ? "#06B6D4" : "#EC4899", // violet, cyan, magenta
        type,
        phase: Math.random() * Math.PI * 2,
        height: type === "cyclist" ? 0.6 : type === "jogger" ? 0.4 : 0.3,
      });
    }
  }

  useFrame((state) => {
    const p = scrollProgress;

    // 1. Barrier Rotation Animation (The Road Opens)
    // Closed at start (angle = 0), opens to angle = Math.PI / 2
    // Opens rapidly between scrollProgress 0.15 and 0.22
    let targetAngle = 0;
    if (p > 0.15) {
      const t = Math.min(1, (p - 0.15) / 0.07);
      // Ease barrier angle
      targetAngle = (Math.PI / 2) * (1 - Math.cos(t * Math.PI)) / 2; // custom sine ease
    }

    if (barrierLeftRef.current) {
      barrierLeftRef.current.rotation.z = targetAngle; // Lift up
    }
    if (barrierRightRef.current) {
      barrierRightRef.current.rotation.z = -targetAngle; // Lift up opposite
    }

    // 2. Animate participants moving forward
    // They start appearing and moving as scrollProgress goes past 0.05
    if (participantsRef.current) {
      const count = particleCount;
      const mesh = participantsRef.current;
      const tempObject = new THREE.Object3D();

      for (let i = 0; i < count; i++) {
        const item = initialData.current[i];
        
        // Progress rate: speed up based on scroll, and constant base speed
        const baseZ = item.zOffset + (state.clock.getElapsedTime() * 15 * item.speed);
        
        // Wrap around when they reach the front of the screen
        let z = baseZ % 300;
        if (z > 20) z -= 300; // loop back to the distance
        
        // Add subtle jumping/swaying motion based on type
        let y = item.height;
        let x = item.laneOffset;

        if (item.type === "jogger") {
          y += Math.abs(Math.sin(state.clock.getElapsedTime() * 8 + item.phase)) * 0.25;
        } else if (item.type === "walker") {
          y += Math.abs(Math.sin(state.clock.getElapsedTime() * 4 + item.phase)) * 0.12;
          x += Math.sin(state.clock.getElapsedTime() * 2 + item.phase) * 0.1; // sway left-right
        } else if (item.type === "cyclist") {
          y += Math.sin(state.clock.getElapsedTime() * 12 + item.phase) * 0.03;
          x += Math.sin(state.clock.getElapsedTime() * 0.5 + item.phase) * 0.05;
        }

        // Apply position and rotation
        tempObject.position.set(x, y, z);
        tempObject.scale.set(
          item.type === "cyclist" ? 0.35 : 0.2, 
          item.type === "cyclist" ? 0.35 : 0.4, 
          item.type === "cyclist" ? 0.6 : 0.2
        );
        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  // Only render if the screen is within Section 1, 2, or 3
  if (scrollProgress > 0.58) return null;

  // Let's create colors array for instanced mesh
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const color = new THREE.Color(initialData.current[i].color);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <group>
      {/* 1. Main Freedom Street Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]} receiveShadow>
        <planeGeometry args={[18, 320]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Road Shoulders (Glassy Glowing Rails) */}
      <mesh position={[-9.1, 0.15, -80]}>
        <boxGeometry args={[0.2, 0.3, 320]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>
      <mesh position={[9.1, 0.15, -80]}>
        <boxGeometry args={[0.2, 0.3, 320]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>

      {/* Road Dashed Lines */}
      {Array.from({ length: 32 }).map((_, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 60 - idx * 10]}>
          <planeGeometry args={[0.15, 3]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* 2. City Landscape - Left & Right Backdrops */}
      <LowPolyCharminar position={[-28, 0, -45]} />
      <LowPolyCyberTowers position={[30, 0, -95]} />
      
      {/* Extra filler skyline buildings (abstract boxes) */}
      <mesh position={[-38, 12, -110]} castShadow>
        <boxGeometry args={[14, 24, 14]} />
        <meshStandardMaterial color="#E4E7EB" roughness={0.8} />
      </mesh>
      <mesh position={[35, 16, -55]} castShadow>
        <boxGeometry args={[10, 32, 10]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
      </mesh>

      {/* 3. Road Barriers (Section 2 - The Road Opens) */}
      {/* Left Gate Post */}
      <group position={[-9.2, 0, 15]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshStandardMaterial color="#CBD5E1" />
        </mesh>
        {/* Rotating Barrier Pole */}
        <mesh ref={barrierLeftRef} position={[0, 1.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[8, 0.15, 0.15]} />
          <meshStandardMaterial color="#EC4899" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Gate Post */}
      <group position={[9.2, 0, 15]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshStandardMaterial color="#CBD5E1" />
        </mesh>
        {/* Rotating Barrier Pole */}
        <mesh ref={barrierRightRef} position={[0, 1.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[-8, 0.15, 0.15]} />
          <meshStandardMaterial color="#EC4899" roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Thousands of Participants (Instanced Particles) */}
      {/* We represent them with a set of small capsules for jogger/walkers and boxes for cyclists */}
      <instancedMesh ref={participantsRef} args={[null as any, null as any, particleCount]} castShadow>
        <capsuleGeometry args={[0.5, 1.2, 4, 8]} />
        <meshStandardMaterial roughness={0.5} metalness={0.1} />
      </instancedMesh>

      {/* 3D road transforming into sports arenas (Section 2 - The Road Opens) */}
      <TheRoadOpensSportsScene3D scrollProgress={scrollProgress} />

      {/* Holographic Telangana Grid in the sky during Hero stage */}
      <HeroHologram3D scrollProgress={scrollProgress} />
    </group>
  );
}

// Stylized bouncing mini athlete pins for the miniature sports campus
function SportsRunnerMiniature3D({ position, color, index }: { position: [number, number, number]; color: string; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.abs(Math.sin(time * 3.5 + index * 0.6)) * 0.4;
  });
  return (
    <group ref={meshRef} position={position}>
      <mesh castShadow rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.45, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
}

// 3D miniature sports campus with fields, tracks, and mouse rotation parallax
function TheRoadOpensSportsScene3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    // Scale up during Section 2 (0.12 to 0.18)
    const targetScale = (p >= 0.12 && p <= 0.18) ? 1.0 : 0.0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
    groupRef.current.scale.setScalar(currentScale.current * 0.95);

    // Floating translation
    groupRef.current.position.y = 1.0 + Math.sin(time * 1.5) * 0.18;

    // Mouse movement parallax rotation
    const targetRotX = -state.pointer.y * 0.25;
    const targetRotY = state.pointer.x * 0.35 + time * 0.1; // slow continuous idle rotation + mouse sway
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
  });

  return (
    <group ref={groupRef} position={[6.2, 1.0, -12]} scale={[0, 0, 0]}>
      {/* Glossy ceramic base plate */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.4, 0.35, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Outer Neon Accent Ring */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.0, 4.15, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner sports layout - running track loops */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.6} />
      </mesh>
      {/* Track lane lines */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.84, 2.86, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Miniature basketball court */}
      <group position={[0, 0.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.02, 1.8]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
        {/* Court lines */}
        <mesh position={[0, 0.021, 0]}>
          <boxGeometry args={[3.0, 0.005, 0.03]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.021, 0]}>
          <boxGeometry args={[0.03, 0.005, 1.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Mini Hoop posts */}
        <group position={[-1.5, 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0.1, 1.1, 0]}>
            <boxGeometry args={[0.02, 0.3, 0.4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.15, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.01, 8, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
        <group position={[1.5, 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[-0.1, 1.1, 0]}>
            <boxGeometry args={[0.02, 0.3, 0.4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.15, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.01, 8, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* Miniature hurdles grid */}
      <group position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
        {/* Hurdles base */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.02, 0.6]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.8} />
        </mesh>
        {/* Hurdles posts */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
          <group key={i} position={[x, 0.25, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.3, 0.08]} />
              <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Miniature road transforming into loops */}
      <group position={[-2.5, 0.2, 2.5]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.2, 3.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.05, 0.01, 3.0]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Miniature hurdles grid */}
      <group position={[0, 0.25, -1.5]} rotation={[0, Math.PI / 4, 0]}>
        {/* Hurdle posts */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.03, 0.2, 0.03]} />
              <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.3]} />
              <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Miniature Athletes (3D jumping pins) */}
      <SportsRunnerMiniature3D position={[-2.0, 0.4, -1.8]} color="#3b82f6" index={1} />
      <SportsRunnerMiniature3D position={[2.0, 0.4, 1.8]} color="#ec4899" index={2} />
      <SportsRunnerMiniature3D position={[0, 0.4, 2.8]} color="#10b981" index={3} />

      {/* Ambient point light for beautiful PBR reflections */}
      <pointLight position={[0, 2.5, 0]} intensity={3.5} distance={12} color="#a855f7" castShadow />
      <pointLight position={[-3, 1.5, -3]} intensity={2.0} distance={8} color="#06b6d4" />
      <pointLight position={[3, 1.5, 3]} intensity={2.0} distance={8} color="#ec4899" />
    </group>
  );
}

// Glowing Hologram representation of Telangana districts grid in the sky
function HeroHologram3D({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.12;
    ref.current.position.y = 12 + Math.sin(t * 1.5) * 0.4;
  });

  if (scrollProgress > 0.15) return null;

  return (
    <group ref={ref} position={[0, 12, -35]}>
      {/* Outer rotating holographic ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16, 16.3, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner concentric ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <ringGeometry args={[11, 11.2, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Grid helper inside the ring */}
      <gridHelper {...({ args: [22, 12, "#ec4899", "#8b5cf6"], position: [0, -0.5, 0], rotation: [0, 0, 0], opacity: 0.15, transparent: true } as any)} />

      {/* Vertical neon beams streaming down to represent the connectivity grid */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 13.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, -5, z]}>
            <cylinderGeometry args={[0.015, 0.015, 10, 4]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#06b6d4" : "#ec4899"} transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}
