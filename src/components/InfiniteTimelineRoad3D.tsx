"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TimelineMarker {
  time: string;
  title: string;
  zPos: number;
}

const timelineData: TimelineMarker[] = [
  { time: "6:00 AM", title: "Yoga & Meditation", zPos: -30 },
  { time: "6:45 AM", title: "Warm-up Stretch", zPos: -50 },
  { time: "7:00 AM", title: "Dance & Zumba", zPos: -70 },
  { time: "7:45 AM", title: "Health & Inspiration Talk", zPos: -90 },
  { time: "8:15 AM", title: "Hurdle & Fitness Race", zPos: -110 },
  { time: "8:45 AM", title: "Celebration Jam & Bonding", zPos: -130 },
];

function TimelineSignpost({ marker, index }: { marker: TimelineMarker; index: number }) {
  const poleRef = useRef<THREE.Mesh>(null);
  const boardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (boardRef.current) {
      // Gentle rotation/float offset to look like a floating hologram
      boardRef.current.position.y = 2.0 + Math.sin(time * 2 + index) * 0.1;
      boardRef.current.rotation.y = Math.sin(time * 0.5 + index) * 0.05;
    }
  });

  const side = index % 2 === 0 ? -4.5 : 4.5;
  const boardColor = index % 2 === 0 ? "#8B5CF6" : "#06B6D4";

  return (
    <group position={[side, 0, marker.zPos]}>
      {/* Supporting base pedestal */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>

      {/* Holographic light pole */}
      <mesh ref={poleRef} position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Glowing light emission beam */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.01, 0.2, 1.0, 8, 1, true]} />
        <meshBasicMaterial color={boardColor} transparent opacity={0.25} side={2} />
      </mesh>

      {/* Floating Glassmorphic Message Board */}
      <mesh ref={boardRef} position={[0, 2.0, 0]} castShadow>
        <boxGeometry args={[2.4, 1.2, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.65}
        />
      </mesh>
      
      {/* Outer Neon Glow Outline */}
      <mesh position={[side > 0 ? 0.01 : -0.01, 2.0, 0.06]}>
        <boxGeometry args={[2.44, 1.24, 0.02]} />
        <meshStandardMaterial color={boardColor} wireframe emissive={boardColor} emissiveIntensity={0.5} />
      </mesh>

      {/* Glowing indicator light on top of board */}
      <mesh position={[0, 2.65, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={boardColor} />
      </mesh>
    </group>
  );
}

export default function InfiniteTimelineRoad3D({ scrollProgress }: { scrollProgress: number }) {
  const roadGridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (roadGridRef.current) {
      // Infinite offset translation along scroll
      // Makes grid feel like it's zooming backwards when we move forwards
      const zSpeed = scrollProgress * 250;
      roadGridRef.current.position.z = (zSpeed % 10) - 80;
    }
  });

  // Visible in Timeline section
  if (scrollProgress < 0.94 || scrollProgress > 0.99) return null;

  return (
    <group>
      {/* The Infinite Timeline Road Grid */}
      <gridHelper
        {...({
          ref: roadGridRef,
          args: [40, 40, "#8B5CF6", "#E2E8F0"],
          position: [0, -0.6, -80],
          opacity: 0.25,
          transparent: true
        } as any)}
      />

      {/* High-tech side rail lines */}
      <mesh position={[-6.2, -0.5, -80]}>
        <boxGeometry args={[0.08, 0.1, 160]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>
      <mesh position={[6.2, -0.5, -80]}>
        <boxGeometry args={[0.08, 0.1, 160]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>

      {/* Render 6 Timeline Milestones */}
      {timelineData.map((marker, idx) => (
        <TimelineSignpost key={marker.time} marker={marker} index={idx} />
      ))}

      {/* 3D Celebration Stage */}
      <CelebrationStage3D />
    </group>
  );
}

// 3D Celebration Stage with sweeping volumetric spotlight cones, neon arches, lasers, and confetti
function CelebrationStage3D() {
  const stageRef = useRef<THREE.Group>(null);
  const leftLightRef = useRef<THREE.Mesh>(null);
  const rightLightRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 120;
  const positions = useRef((() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 8 + 1;
      arr[i * 3 + 2] = -70 + (Math.random() - 0.5) * 16;
    }
    return arr;
  })());

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Sweep spotlights
    if (leftLightRef.current) {
      leftLightRef.current.rotation.z = Math.sin(time * 2.2) * 0.45;
      leftLightRef.current.rotation.x = Math.cos(time * 1.3) * 0.2;
    }
    if (rightLightRef.current) {
      rightLightRef.current.rotation.z = -Math.sin(time * 2.2) * 0.45;
      rightLightRef.current.rotation.x = -Math.cos(time * 1.3) * 0.2;
    }

    // Drop confetti particles
    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.getAttribute("position");
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) - 0.06;
        if (y < 0.2) y = 8;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={stageRef} position={[0, -0.6, -70]}>
      {/* Glossy ceramic round stage platform */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5, 5.2, 0.3, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Glowing Neon Arch backplate */}
      <mesh position={[0, 2.5, -4]} rotation={[0, 0, 0]}>
        <torusGeometry args={[3.8, 0.12, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#db2777" emissive="#db2777" emissiveIntensity={1.2} />
      </mesh>

      {/* Volumetric Spotlights */}
      <group position={[-3.5, 0.3, -3]} ref={leftLightRef}>
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[1.5, 5.0, 16, 1, true]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <group position={[3.5, 0.3, -3]} ref={rightLightRef}>
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[1.5, 5.0, 16, 1, true]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Laser lines */}
      <mesh position={[0, 2.0, -1]}>
        <boxGeometry args={[8.0, 0.02, 0.02]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>

      {/* Falling Confetti Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#d4af37"
          transparent
          opacity={0.85}
        />
      </points>
    </group>
  );
}
