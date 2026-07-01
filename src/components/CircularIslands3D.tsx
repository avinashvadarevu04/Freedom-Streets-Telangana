"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IslandData {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  symbolType: "family" | "youth" | "senior" | "corporate" | "pet" | "disability";
}

const islandsList: IslandData[] = [
  { id: "families", name: "Families", pos: [-5, 1, -12], color: "#ff5e36", symbolType: "family" },
  { id: "students", name: "Students & Youth", pos: [-2.5, 2.2, -16], color: "#0ea5e9", symbolType: "youth" },
  { id: "seniors", name: "Senior Citizens", pos: [0, 3, -18], color: "#d4af37", symbolType: "senior" },
  { id: "corporates", name: "Corporate Employees", pos: [2.5, 2.2, -16], color: "#a855f7", symbolType: "corporate" },
  { id: "pets", name: "Pet Owners", pos: [5, 1, -12], color: "#10b981", symbolType: "pet" },
  { id: "inclusive", name: "Inclusive / Disabled", pos: [0, -0.5, -9], color: "#f43f5e", symbolType: "disability" },
];

function FloatingIsland({
  data,
  isHovered,
  onHover,
  onLeave
}: {
  data: IslandData;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Float up and down gently
      const floatOffset = Math.sin(state.clock.getElapsedTime() * 1.2 + data.pos[0]) * 0.15;
      groupRef.current.position.y = data.pos[1] + floatOffset;
      
      // Rotate the symbol on top
      if (coreRef.current) {
        coreRef.current.rotation.y += 0.012;
        if (isHovered) {
          coreRef.current.rotation.x += 0.005;
        }
      }

      // Smooth scale transition on hover
      const targetScale = isHovered ? 1.35 : 1.0;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[data.pos[0], data.pos[1], data.pos[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
      }}
      onPointerOut={(e) => {
        onLeave();
      }}
    >
      {/* 1. The Glassmorphic Circular Island Plate */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.18, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.65}
        />
      </mesh>
      
      {/* Golden Glowing Ring Rim */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.04, 8, 32]} />
        <meshBasicMaterial color={data.color} transparent opacity={isHovered ? 0.9 : 0.4} />
      </mesh>

      {/* 2. Procedural Symbol Core on Top */}
      <group position={[0, 0.6, 0]}>
        {data.symbolType === "family" && (
          // 3 overlapping spheres (Parents + child)
          <group ref={coreRef as any}>
            <mesh position={[-0.3, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.35, 12, 12]} />
              <meshStandardMaterial color={data.color} roughness={0.3} />
            </mesh>
            <mesh position={[0.3, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.35, 12, 12]} />
              <meshStandardMaterial color={data.color} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
          </group>
        )}

        {data.symbolType === "youth" && (
          // Concentric Orbiting Rings
          <group ref={coreRef as any}>
            <mesh castShadow>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[0.65, 0.04, 6, 24]} />
              <meshBasicMaterial color={data.color} />
            </mesh>
            <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
              <torusGeometry args={[0.85, 0.03, 6, 24]} />
              <meshBasicMaterial color={data.color} transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {data.symbolType === "senior" && (
          // Pedestal with golden glowing sphere
          <group ref={coreRef as any}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
              <meshStandardMaterial color="#E2E8F0" />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <sphereGeometry args={[0.42, 16, 16]} />
              <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.8} />
            </mesh>
          </group>
        )}

        {data.symbolType === "corporate" && (
          // Abstract Cube Cluster (High Tech Grid)
          <group ref={coreRef as any}>
            {[-0.22, 0.22].map((x, i) =>
              [-0.22, 0.22].map((z, j) => (
                <mesh key={`${i}-${j}`} position={[x, i * 0.3, z]} castShadow>
                  <boxGeometry args={[0.28, 0.28, 0.28]} />
                  <meshStandardMaterial color={data.color} metalness={0.7} roughness={0.2} />
                </mesh>
              ))
            )}
          </group>
        )}

        {data.symbolType === "pet" && (
          // Bone/circle dog prop
          <group ref={coreRef as any}>
            <mesh castShadow>
              <torusGeometry args={[0.45, 0.1, 8, 16]} />
              <meshStandardMaterial color={data.color} roughness={0.5} />
            </mesh>
            {/* Bone knobs */}
            <mesh position={[-0.45, 0, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.45, 0, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {data.symbolType === "disability" && (
          // Concentric circular expanding shields
          <group ref={coreRef as any}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.08, 8, 24]} />
              <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.5} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.7, 0.04, 6, 24]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        )}
      </group>

      {/* Under-island spot glow */}
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={isHovered ? 0.3 : 0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

interface CircularIslands3DProps {
  scrollProgress: number;
  hoveredIslandId: string | null;
  setHoveredIslandId: (id: string | null) => void;
}

export default function CircularIslands3D({
  scrollProgress,
  hoveredIslandId,
  setHoveredIslandId
}: CircularIslands3DProps) {

  // Visible in Who Can Participate section
  if (scrollProgress < 0.88 || scrollProgress > 0.95) return null;

  return (
    <group>
      {/* Ambient background rings mapping floating zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, -14]}>
        <ringGeometry args={[9, 9.2, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.05} />
      </mesh>
      
      {/* Light grid floor */}
      <gridHelper {...({ args: [20, 10, "#8B5CF6", "#E2E8F0"], position: [0, -1.1, -14], opacity: 0.12, transparent: true } as any)} />

      {islandsList.map((island) => (
        <FloatingIsland
          key={island.id}
          data={island}
          isHovered={hoveredIslandId === island.id}
          onHover={() => setHoveredIslandId(island.id)}
          onLeave={() => setHoveredIslandId(null)}
        />
      ))}
    </group>
  );
}
