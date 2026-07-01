"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FitnessCultural3D({ scrollProgress }: { scrollProgress: number }) {
  const wavePointsRef = useRef<THREE.Points>(null);
  const confettiRef = useRef<THREE.InstancedMesh>(null);
  const flagsRef = useRef<THREE.Group>(null);

  // Setup wave variables
  const rows = 28;
  const cols = 28;
  const count = rows * cols;
  const positions = useRef((() => {
    const arr = new Float32Array(count * 3);
    let idx = 0;
    const spacing = 1.0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr[idx * 3] = (c - cols / 2) * spacing;
        arr[idx * 3 + 1] = 0; // height
        arr[idx * 3 + 2] = (r - rows / 2) * spacing - 40; // z offset
        idx++;
      }
    }
    return arr;
  })());

  // Setup confetti variables
  const confettiCount = 100;
  const confettiData = useRef<Array<{
    position: THREE.Vector3;
    rotation: THREE.Vector3;
    rotSpeed: THREE.Vector3;
    speed: number;
    color: string;
  }>>([]);

  if (confettiData.current.length === 0) {
    for (let i = 0; i < confettiCount; i++) {
      confettiData.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          Math.random() * 20 + 10,
          -20 - Math.random() * 80
        ),
        rotation: new THREE.Vector3(Math.random() * 5, Math.random() * 5, Math.random() * 5),
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.05 + 0.02,
          Math.random() * 0.05 + 0.02,
          Math.random() * 0.05 + 0.02
        ),
        speed: Math.random() * 0.06 + 0.04,
        color: Math.random() > 0.6 ? "#ff5e36" : Math.random() > 0.3 ? "#d4af37" : "#f8fafc",
      });
    }
  }

  useFrame((state) => {
    const p = scrollProgress;
    const time = state.clock.getElapsedTime();

    // 1. Animate particle wave (Simulating collective breathing / sound waves)
    if (wavePointsRef.current) {
      const geo = wavePointsRef.current.geometry;
      const posAttr = geo.getAttribute("position");
      
      // Determine wave intensity based on scroll (cultural stage has faster, higher waves)
      const isCultural = p > 0.73;
      const speedMult = isCultural ? 3.5 : 1.2;
      const heightMult = isCultural ? 1.4 : 0.6;
      
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = posAttr.getX(idx);
          const z = posAttr.getZ(idx);
          
          // Double sine wave equation (ripple outward)
          const dist = Math.sqrt(x*x + (z + 40)*(z + 40));
          const y = Math.sin(dist * 0.3 - time * speedMult) * Math.cos(x * 0.2 + time * 0.8) * heightMult;
          
          posAttr.setY(idx, y + 0.5); // float height
          idx++;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Animate falling Confetti (only during cultural and final stages, scroll > 0.73)
    if (confettiRef.current && p > 0.73) {
      const mesh = confettiRef.current;
      const tempObj = new THREE.Object3D();

      for (let i = 0; i < confettiCount; i++) {
        const item = confettiData.current[i];
        
        // Fall downwards
        item.position.y -= item.speed;
        
        // Spin
        item.rotation.add(item.rotSpeed);
        
        // Reset if hitting ground
        if (item.position.y < -1) {
          item.position.y = Math.random() * 20 + 20;
          item.position.x = (Math.random() - 0.5) * 25;
        }

        // Apply matrix
        tempObj.position.copy(item.position);
        tempObj.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        tempObj.scale.set(0.12, 0.18, 0.02); // ribbon size
        tempObj.updateMatrix();
        mesh.setMatrixAt(i, tempObj.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // 3. Flapping flags (waving in the wind)
    if (flagsRef.current) {
      flagsRef.current.children.forEach((flagGroup, idx) => {
        const flagCloth = flagGroup.children[1]; // second child is cloth
        if (flagCloth) {
          const t = time * 4 + idx * 0.5;
          // Apply sine wave bending along flag length
          flagCloth.rotation.y = Math.sin(t) * 0.18;
          flagCloth.rotation.z = Math.cos(t) * 0.08;
        }
      });
    }
  });

  // Visible in Fitness & Cultural sections
  if (scrollProgress < 0.70 || scrollProgress > 0.88) return null;

  // Render colors for confetti
  const colors = new Float32Array(confettiCount * 3);
  for (let i = 0; i < confettiCount; i++) {
    const c = new THREE.Color(confettiData.current[i].color);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return (
    <group>
      {/* 1. Breathing/Dancing Wave Particles */}
      <points ref={wavePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ff5e36"
          size={0.18}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
      
      {/* Extra glow lines representing connections inside wave */}
      <gridHelper {...({ args: [26, 26, "#d4af37", "#0a0f1d"], position: [0, 0.4, -40], opacity: 0.06, transparent: true } as any)} />

      {/* 2. Celebration Confetti (Instanced flat boxes) */}
      {scrollProgress > 0.73 && (
        <instancedMesh ref={confettiRef} args={[null as any, null as any, confettiCount]} castShadow>
          <boxGeometry />
          <meshStandardMaterial roughness={0.4} metalness={0.2} />
        </instancedMesh>
      )}

      {/* 3. Decorative Festival Flags on the sides of the street */}
      <group ref={flagsRef}>
        {Array.from({ length: 6 }).map((_, idx) => {
          const zPos = -10 - idx * 16;
          const xSide = idx % 2 === 0 ? -8.5 : 8.5;
          return (
            <group key={idx} position={[xSide, 0, zPos]}>
              {/* Flag Pole */}
              <mesh position={[0, 3, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 6, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.6} />
              </mesh>
              {/* Flag Cloth (Banner) */}
              <mesh position={[0.7, 5.2, 0]} castShadow>
                <boxGeometry args={[1.4, 0.8, 0.02]} />
                <meshStandardMaterial
                  color={idx % 3 === 0 ? "#ff5e36" : idx % 3 === 1 ? "#d4af37" : "#0e7490"}
                  roughness={0.8}
                />
              </mesh>
              {/* Tiny golden topper */}
              <mesh position={[0, 6, 0]}>
                <sphereGeometry args={[0.16, 8, 8]} />
                <meshBasicMaterial color="#d4af37" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
