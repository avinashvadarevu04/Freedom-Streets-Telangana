"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SportModelProps {
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

// 1. Running Track Procedural Model
function RunningTrackModel({ position, isActive, isHovered, mouse }: SportModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Float and rotate
    groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.15;
    groupRef.current.rotation.y = time * 0.2 + mouse.current.x * 0.15;
    groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.05 + mouse.current.y * 0.1;
  });

  const scale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const glowIntensity = isActive ? 1.8 : isHovered ? 0.9 : 0.25;

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Base turf */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Running track ring */}
      <mesh position={[0, 0.09, 0]} receiveShadow>
        <cylinderGeometry args={[1.3, 1.32, 0.02, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.7} />
      </mesh>
      {/* Inner lane line */}
      <mesh position={[0, 0.11, 0]}>
        <ringGeometry args={[1.0, 1.02, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={2} />
      </mesh>
      {/* Outer lane line */}
      <mesh position={[0, 0.11, 0]}>
        <ringGeometry args={[1.22, 1.24, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={2} />
      </mesh>
      {/* Hurdle barrier */}
      <group position={[0.7, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.04, 0.04]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        <mesh position={[-0.2, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0.2, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
      {/* Active Glowing Spotlight */}
      <pointLight intensity={glowIntensity} distance={3} color="#8B5CF6" position={[0, 0.8, 0]} />
    </group>
  );
}

// 2. Cycling Lane Procedural Model
function CyclingLaneModel({ position, isActive, isHovered, mouse }: SportModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = position[1] + Math.sin(time * 1.3 + 1) * 0.15;
    groupRef.current.rotation.y = -time * 0.15 + mouse.current.x * 0.15;
    groupRef.current.rotation.x = Math.cos(time * 0.6) * 0.05 + mouse.current.y * 0.1;
  });

  const scale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const glowIntensity = isActive ? 1.8 : isHovered ? 0.9 : 0.25;

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Ground Base */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Asphalt Cycle path */}
      <mesh position={[0, 0.09, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.22, 0.02, 32]} />
        <meshStandardMaterial color="#0891b2" roughness={0.6} />
      </mesh>
      {/* Lane dividers */}
      <mesh position={[0, 0.11, 0]}>
        <ringGeometry args={[0.9, 0.92, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={2} />
      </mesh>
      {/* Mini Bicycle Mesh representation */}
      <group position={[0.6, 0.2, 0]} rotation={[0.1, 0.5, 0]}>
        {/* Wheels */}
        <mesh position={[-0.25, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.02, 6, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.02, 6, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Frame lines */}
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </group>
      <pointLight intensity={glowIntensity} distance={3} color="#06B6D4" position={[0, 0.8, 0]} />
    </group>
  );
}

// 3. Basketball Court Procedural Model
function BasketballCourtModel({ position, isActive, isHovered, mouse }: SportModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = position[1] + Math.sin(time * 1.6 + 2) * 0.15;
    groupRef.current.rotation.y = time * 0.18 + mouse.current.x * 0.15;
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.05 + mouse.current.y * 0.1;
  });

  const scale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const glowIntensity = isActive ? 1.8 : isHovered ? 0.9 : 0.25;

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Base platform */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Painted Court outlines */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 1.7]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Basketball Goalpost structure */}
      <group position={[-1.0, 0.08, 0]}>
        {/* Support pole */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Backboard */}
        <mesh position={[0.1, 1.1, 0]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
        {/* Rim and netting */}
        <mesh position={[0.22, 0.96, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.015, 4, 16]} />
          <meshStandardMaterial color="#8B5CF6" />
        </mesh>
      </group>
      <pointLight intensity={glowIntensity} distance={3} color="#8B5CF6" position={[0, 1.2, 0]} />
    </group>
  );
}

// 4. Skating Arena Procedural Model
function SkatingArenaModel({ position, isActive, isHovered, mouse }: SportModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = position[1] + Math.sin(time * 1.4 + 3) * 0.15;
    groupRef.current.rotation.y = -time * 0.22 + mouse.current.x * 0.15;
    groupRef.current.rotation.x = Math.cos(time * 0.5) * 0.05 + mouse.current.y * 0.1;
  });

  const scale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const glowIntensity = isActive ? 1.8 : isHovered ? 0.9 : 0.25;

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Concrete base ramp bowl */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Halfpipe bowl indent representations */}
      <mesh position={[-0.6, 0.15, 0]} rotation={[0, 0, -Math.PI / 12]} castShadow>
        <boxGeometry args={[1.0, 0.15, 1.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>
      <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, Math.PI / 12]} castShadow>
        <boxGeometry args={[1.0, 0.15, 1.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>
      {/* Mini Skateboard */}
      <group position={[0, 0.2, 0.3]} rotation={[0.05, 0.8, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.02, 0.12]} />
          <meshStandardMaterial color="#EC4899" />
        </mesh>
        {/* Small wheels */}
        {[-0.15, 0.15].map((xVal) => (
          <group key={xVal} position={[xVal, -0.04, 0]}>
            <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
      <pointLight intensity={glowIntensity} distance={3} color="#EC4899" position={[0, 0.8, 0]} />
    </group>
  );
}

// 5. Kabaddi Ground Procedural Model
function KabaddiGroundModel({ position, isActive, isHovered, mouse }: SportModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = position[1] + Math.sin(time * 1.7 + 4) * 0.15;
    groupRef.current.rotation.y = time * 0.14 + mouse.current.x * 0.15;
    groupRef.current.rotation.x = Math.sin(time * 0.6) * 0.05 + mouse.current.y * 0.1;
  });

  const scale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const glowIntensity = isActive ? 1.8 : isHovered ? 0.9 : 0.25;

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Ground clay base */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.15, 1.6]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Painted clay outlines */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 1.4]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
      </mesh>
      {/* Midline painted line */}
      <mesh position={[0, 0.101, 0]}>
        <boxGeometry args={[0.04, 0.005, 1.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      {/* Baulk lines */}
      <mesh position={[-0.6, 0.101, 0]}>
        <boxGeometry args={[0.02, 0.005, 1.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.6, 0.101, 0]}>
        <boxGeometry args={[0.02, 0.005, 1.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      {/* Mini Golden Trophy on the ground representing championship */}
      <group position={[0, 0.22, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      <pointLight intensity={glowIntensity} distance={3} color="#06B6D4" position={[0, 0.8, 0]} />
    </group>
  );
}

interface SportsShowcase3DProps {
  scrollProgress: number;
  activeSportId: string | null;
  hoveredSportId: string | null;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export default function SportsShowcase3D({
  scrollProgress,
  activeSportId,
  hoveredSportId,
  mouse
}: SportsShowcase3DProps) {
  
  // Showcase is visible in Sports Arena section (scrollProgress 0.68 to 0.72)
  if (scrollProgress < 0.68 || scrollProgress > 0.72) return null;

  return (
    <group position={[3.2, 0, -1]}>
      {/* Ambient background particles for right side showcase */}
      <gridHelper {...({ args: [12, 12, "#8B5CF6", "#E2E8F0"], position: [0, -1.5, 0], opacity: 0.25, transparent: true } as any)} />


      <RunningTrackModel
        position={[-1.2, 1.2, 1.0]}
        isActive={activeSportId === "running"}
        isHovered={hoveredSportId === "running"}
        mouse={mouse}
      />
      <CyclingLaneModel
        position={[1.5, 0.4, 0.2]}
        isActive={activeSportId === "cycling"}
        isHovered={hoveredSportId === "cycling"}
        mouse={mouse}
      />
      <BasketballCourtModel
        position={[-1.6, -0.6, -1.0]}
        isActive={activeSportId === "basketball"}
        isHovered={hoveredSportId === "basketball"}
        mouse={mouse}
      />
      <SkatingArenaModel
        position={[1.2, -1.0, -1.2]}
        isActive={activeSportId === "skating"}
        isHovered={hoveredSportId === "skating"}
        mouse={mouse}
      />
      <KabaddiGroundModel
        position={[0.0, 0.2, -2.5]}
        isActive={activeSportId === "kabaddi"}
        isHovered={hoveredSportId === "kabaddi"}
        mouse={mouse}
      />
    </group>
  );
}
