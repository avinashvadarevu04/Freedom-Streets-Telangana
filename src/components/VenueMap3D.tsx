"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VenueZone {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  desc: string;
  activities: string[];
}

export const venueZonesData: VenueZone[] = [
  { id: "stage", name: "Main Stage", pos: [0, 0.4, 0], color: "#ff5e36", desc: "Central hub for high-energy fitness, Zumba, and celebrity motivational talks.", activities: ["Dance Fitness", "Warm-ups", "Celebrity Talks", "Music Jam"] },
  { id: "activity", name: "Activity Area", pos: [-4, 0.1, -2.5], color: "#0ea5e9", desc: "Open zones dedicated to Zumba, group Aerobics, and interactive wellness sessions.", activities: ["Zumba", "Aerobics", "Yoga Workshops"] },
  { id: "running", name: "Running & Hurdles", pos: [5, 0.05, 0.5], color: "#d4af37", desc: "Athletic tracks layout for high-intensity sprints, hurdles, and community races.", activities: ["Hurdle Race", "Sprint Challenges", "Warm-up Jog"] },
  { id: "pet", name: "Pet Zone", pos: [-5, 0.1, 3.5], color: "#10b981", desc: "Safe, pet-friendly outdoor play space with hydration facilities and social circles.", activities: ["Pet Play", "Pet Health Advice", "Hydration Nodes"] },
  { id: "kids", name: "Kids Zone", pos: [4, 0.1, -3.5], color: "#f43f5e", desc: "Supervised play area with youth sports, hurdle tracks, and creative workshops.", activities: ["Children's Games", "Creative Crafts", "Youth Sprints"] },
  { id: "food", name: "Food & Nutrition Stalls", pos: [-1.2, 0.1, -5.5], color: "#a855f7", desc: "Nutrition stations, local healthy snacks, hydration hubs, and refreshments.", activities: ["Healthy Eating Advice", "Nutrition Consultation", "Hydration"] },
  { id: "merchandise", name: "Merchandise Stalls", pos: [2.2, 0.1, -5.5], color: "#ec4899", desc: "Community arts, local handloom stalls, custom event T-shirts, and activewear.", activities: ["Local Handloom Crafts", "Community Sales", "Branded Apparel"] },
  { id: "seating", name: "Relaxation Node", pos: [0, 0.1, 4.5], color: "#64748b", desc: "Shaded lounge grids with active seating and relaxation setups for elderly spectators.", activities: ["Elderly Social Space", "Spectator Seating", "Hydration"] },
  { id: "parking", name: "Parking Grid", pos: [9.5, 0.05, 4.5], color: "#475569", desc: "Ample parking area with coordinates set up for 200+ vehicles.", activities: ["Valet Services", "Organized Vehicle Slots"] },
  { id: "entry", name: "Entry & Exit Gates", pos: [-9.5, 0.1, 0.5], color: "#06b6d4", desc: "Clearly demarcated gate coordinate networks for smooth attendee crowd flow.", activities: ["Security Clearance", "Information Desk", "Attendee Hydration"] }
];

function ZonePin3D({
  zone,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick
}: {
  zone: VenueZone;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const pinRef = useRef<THREE.Mesh>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pinRef.current) {
      // Float up and down
      pinRef.current.position.y = 0.8 + Math.sin(time * 2.5 + zone.pos[0]) * 0.12;
      pinRef.current.rotation.y += 0.015;
    }
    if (glowRingRef.current) {
      // Pulsing scale
      const scale = 1.0 + ((time * 1.8 + zone.pos[2]) % 1.0) * 1.5;
      glowRingRef.current.scale.set(scale, scale, 1);
      const ringMaterial = glowRingRef.current.material as THREE.MeshBasicMaterial;
      if (ringMaterial) {
        ringMaterial.opacity = (1.0 - ((time * 1.8 + zone.pos[2]) % 1.0)) * 0.5;
      }
    }
  });

  const pinColor = isSelected ? "#ffffff" : isHovered ? "#ff8036" : zone.color;
  const pinSize = zone.id === "stage" ? 0.32 : 0.22;

  return (
    <group position={zone.pos}>
      {/* 1. Ground highlight ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshBasicMaterial color={zone.color} transparent opacity={isSelected ? 0.9 : 0.3} />
      </mesh>
      
      {/* Pulsing radar ring */}
      <mesh ref={glowRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.8, 16]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.2} />
      </mesh>

      {/* 2. Raised pin pointer */}
      <mesh
        ref={pinRef}
        position={[0, 0.8, 0]}
        rotation={[Math.PI, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={(e) => {
          onLeave();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <coneGeometry args={[pinSize, 0.8, 6]} />
        <meshStandardMaterial
          color={pinColor}
          emissive={pinColor}
          emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.5 : 0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Hover Light beam */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.01, 0.25, 2.0, 8, 1, true]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.25} side={2} />
        </mesh>
      )}
    </group>
  );
}

interface VenueMap3DProps {
  scrollProgress: number;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
}

export default function VenueMap3D({ scrollProgress, activeZoneId, setActiveZoneId }: VenueMap3DProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // Map is visible in Section 11 (scrollProgress 0.65 to 0.67)
  if (scrollProgress < 0.65 || scrollProgress > 0.67) return null;

  return (
    <group>
      {/* Dallas Road Base Grid */}
      <gridHelper {...({ args: [26, 26, "#8B5CF6", "#E2E8F0"], position: [0, -0.2, 0], opacity: 0.25, transparent: true } as any)} />
      
      {/* Dallas Road Asphalt mesh representation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.19, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Side boundary glowing tracks */}
      <mesh position={[0, -0.15, -7]}>
        <boxGeometry args={[20, 0.1, 0.1]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, -0.15, 7]}>
        <boxGeometry args={[20, 0.1, 0.1]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </mesh>

      {/* 3D Venue Models */}
      
      {/* A. Raised Main Stage (center) */}
      <group position={[0, 0, 0]}>
        {/* Stage platform */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.3, 2]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Glowing glass back wall */}
        <mesh position={[0, 1.2, -0.9]} castShadow>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshStandardMaterial color="#8B5CF6" transparent opacity={0.35} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Stage roof banner */}
        <mesh position={[0, 2.15, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 2]} />
          <meshStandardMaterial color="#CBD5E1" />
        </mesh>
      </group>

      {/* B. Running Tracks (Oval Outline using segmented torus) */}
      <group position={[5, 0.05, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[2.2, 0.25, 4, 32]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
        </mesh>
        {/* Innermost lane lines */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.0, 0.02, 4, 32]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* C. Stalls Row (Food and Merchandise abstract boxes) */}
      {/* Food Stalls */}
      <group position={[-1.2, 0, -5.5]}>
        {[-1.0, 0.0, 1.0].map((xOffset) => (
          <mesh key={xOffset} position={[xOffset, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.7]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* Merchandise Stalls */}
      <group position={[2.2, 0, -5.5]}>
        {[-1.0, 0.0, 1.0].map((xOffset) => (
          <mesh key={xOffset} position={[xOffset, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.7]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* D. Kids Zone Abstract Play Towers (Cylinders) */}
      <group position={[4, 0, -3.5]}>
        <mesh position={[-0.6, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.5} />
        </mesh>
        <mesh position={[0.6, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
          <meshStandardMaterial color="#06B6D4" roughness={0.5} />
        </mesh>
      </group>

      {/* E. Pet Zone boundary loops */}
      <group position={[-5, 0, 3.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 6, 24]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>
      </group>

      {/* F. Seating Benches */}
      <group position={[0, 0, 4.5]}>
        {[-1.8, 0, 1.8].map((xVal) => (
          <mesh key={xVal} position={[xVal, 0.15, 0]} castShadow>
            <boxGeometry args={[1.0, 0.3, 0.35]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
        ))}
      </group>

      {/* G. Entry/Exit Gates (Two towers on the left) */}
      <group position={[-9.5, 0, 0.5]}>
        <mesh position={[0, 1.0, -1.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 2.0, 8]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0, 1.0, 1.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 2.0, 8]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
        {/* Overhead beam */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.15, 2.5]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Render 3D Pins for each zone */}
      {venueZonesData.map((zone) => (
        <ZonePin3D
          key={zone.id}
          zone={zone}
          isHovered={hoveredZoneId === zone.id}
          isSelected={activeZoneId === zone.id}
          onHover={() => setHoveredZoneId(zone.id)}
          onLeave={() => setHoveredZoneId(null)}
          onClick={() => setActiveZoneId(zone.id)}
        />
      ))}
    </group>
  );
}
