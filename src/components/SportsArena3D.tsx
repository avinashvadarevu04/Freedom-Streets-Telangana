"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SportItemProps {
  position: [number, number, number];
  type: string;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

// 1. Cycling Wheel/Gear Prop
function CyclingProp({ position, mouseRef }: SportItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Rotate wheel continuously
    groupRef.current.rotation.y += 0.015;
    
    // Tilt based on mouse
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, my * 0.4, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mx * 0.4, 0.05);
    
    // Float
    groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Tire */}
      <mesh castShadow>
        <torusGeometry args={[1.5, 0.15, 12, 48]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      {/* Golden Inner Rim */}
      <mesh>
        <torusGeometry args={[1.35, 0.05, 8, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Spokes (Lines) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        return (
          <mesh key={i} rotation={[0, 0, angle]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 2.7, 4]} />
            <meshStandardMaterial color="#d4af37" metalness={0.7} />
          </mesh>
        );
      })}
      {/* Center hub */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 8]} />
        <meshStandardMaterial color="#8B5CF6" metalness={0.5} />
      </mesh>
    </group>
  );
}

// 2. Basketball Hoop Prop
function BasketballProp({ position, mouseRef }: SportItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseRef.current.x * 0.5, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseRef.current.y * 0.3, 0.05);
    groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glass Backboard */}
      <mesh position={[0, 0.8, -0.6]} castShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Backboard border */}
      <mesh position={[0, 0.8, -0.58]}>
        <boxGeometry args={[3.04, 2.04, 0.02]} />
        <meshStandardMaterial color="#8B5CF6" wireframe />
      </mesh>
      {/* Orange Ring */}
      <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.7, 0.08, 12, 32]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.8} />
      </mesh>
      {/* Supporting bracket */}
      <mesh position={[0, 0.1, -0.1]} castShadow>
        <boxGeometry args={[0.2, 0.2, 1.0]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>
    </group>
  );
}

// 3. Skateboard Prop
function SkatingProp({ position, mouseRef }: SportItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseRef.current.y * 0.3, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouseRef.current.x * 0.2, 0.05);
    groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.3) * 0.22;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Skateboard Board Deck */}
      <mesh castShadow>
        <boxGeometry args={[2.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#06B6D4" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Griptape */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 0.78]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
      </mesh>
      {/* Trucks & Wheels */}
      {[-0.9, 0.9].map((xOffset) => (
        <group key={xOffset} position={[xOffset, -0.15, 0]}>
          {/* Axle */}
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          {/* Wheels */}
          {[-0.45, 0.45].map((zOffset) => (
            <mesh key={zOffset} position={[0, 0, zOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
              <meshStandardMaterial color="#8B5CF6" roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// 4. Volleyball / Net Prop
function VolleyballProp({ position, mouseRef }: SportItemProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.y += 0.02;
      ballRef.current.rotation.x += 0.008;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseRef.current.x * 0.4, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseRef.current.y * 0.3, 0.05);
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.6) * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Volleyball Ball */}
      <mesh ref={ballRef} position={[-0.4, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Ball Pattern Rings (Subtle stripes) */}
      <mesh position={[-0.4, 0.4, 0]}>
        <sphereGeometry args={[0.91, 16, 16]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Styled Grid Net */}
      <mesh position={[0.6, -0.2, -0.4]} castShadow>
        <boxGeometry args={[0.1, 1.4, 2]} />
        <meshStandardMaterial color="#CBD5E1" wireframe />
      </mesh>
      {/* Net Borders */}
      <mesh position={[0.6, 0.5, -0.4]}>
        <boxGeometry args={[0.12, 0.1, 2.02]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0.6, -0.9, -0.4]}>
        <boxGeometry args={[0.12, 0.1, 2.02]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
    </group>
  );
}

export default function SportsArena3D({ scrollProgress }: { scrollProgress: number }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  // Record mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Sports items are visible in Section 5 (scrollProgress 0.53 to 0.72)
  // Visible in Sports section
  if (scrollProgress < 0.58 || scrollProgress > 0.70) return null;

  return (
    <group>
      {/* Ambient dust/stadium particles around the arena */}
      <mesh position={[-10, 5, -10]}>
        <boxGeometry args={[35, 15, 30]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.01} wireframe />
      </mesh>

      {/* Sport props positioned in a staggered 3D field */}
      <CyclingProp position={[-12, 4, -14]} type="cycling" mouseRef={mouseRef} />
      <BasketballProp position={[-16, 5.5, -6]} type="basketball" mouseRef={mouseRef} />
      <SkatingProp position={[-8, 3.2, -8]} type="skating" mouseRef={mouseRef} />
      <VolleyballProp position={[-20, 4.2, -15]} type="volleyball" mouseRef={mouseRef} />
      
      {/* 5. Extra abstract obstacle props representing Hurdle/Obstacle Race */}
      <group position={[-14, 2.2, -10]} rotation={[0, Math.PI / 4, 0]}>
        {/* Hurdle Bar 1 */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.1, 0.1]} />
          <meshStandardMaterial color="#8B5CF6" />
        </mesh>
        {/* Striped board */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[2.5, 0.4, 0.05]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.3, 0.03]}>
          <boxGeometry args={[2.5, 0.4, 0.01]} />
          <meshBasicMaterial color="#8B5CF6" wireframe />
        </mesh>
        {/* Support columns */}
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, -0.7, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.4, 6]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
