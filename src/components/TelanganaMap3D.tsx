"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DistrictNode {
  name: string;
  pos: [number, number, number];
  events: number;
  activities: string[];
  participants: string;
}

// 33 Districts Data with custom coordinates for geographical layout
export const districtsData: DistrictNode[] = [
  { name: "Hyderabad", pos: [0, 0, 0], events: 8, activities: ["Yoga", "Dance", "Music Jam", "Zumba", "Health Talk"], participants: "50,000+" },
  { name: "Medchal-Malkajgiri", pos: [0.8, 0, -0.9], events: 3, activities: ["Running", "Yoga", "Family Walks"], participants: "15,000+" },
  { name: "Ranga Reddy", pos: [-0.6, 0, 1.2], events: 4, activities: ["Cycling", "Zumba", "Health Camps"], participants: "20,000+" },
  { name: "Sangareddy", pos: [-2.2, 0, 0.4], events: 3, activities: ["Street Play", "Yoga", "Traditional Dance"], participants: "12,000+" },
  { name: "Siddipet", pos: [0.5, 0, -2.2], events: 2, activities: ["Zumba", "Running Track", "Pet Zone"], participants: "8,000+" },
  { name: "Nizamabad", pos: [-1.8, 0, -4.5], events: 2, activities: ["Cycling Rally", "Health Checkups", "Yoga"], participants: "9,000+" },
  { name: "Adilabad", pos: [-0.8, 0, -7.5], events: 1, activities: ["Tribal Dance", "Zumba", "Sports Track"], participants: "6,000+" },
  { name: "Karimnagar", pos: [1.8, 0, -3.2], events: 2, activities: ["Zumba", "Yoga Session", "Traditional Arts"], participants: "10,000+" },
  { name: "Warangal", pos: [2.8, 0, -1.0], events: 3, activities: ["Heritage Walk", "Street Performers", "Zumba"], participants: "14,000+" },
  { name: "Khammam", pos: [4.6, 0, 2.2], events: 2, activities: ["Cycling", "Blood Donation", "Dance Arena"], participants: "10,000+" },
  { name: "Nalgonda", pos: [2.2, 0, 2.8], events: 2, activities: ["Yoga Marathon", "Health Camps", "Music"], participants: "11,000+" },
  { name: "Mahabubnagar", pos: [-1.8, 0, 4.2], events: 2, activities: ["Hurdle Race", "Zumba Fitness", "Meditation"], participants: "8,000+" },
  { name: "Jogulamba Gadwal", pos: [-3.2, 0, 7.0], events: 1, activities: ["Traditional Dance", "Health Awareness", "Walk"], participants: "5,000+" },
  { name: "Vikarabad", pos: [-3.0, 0, 1.8], events: 2, activities: ["Trekking Park Event", "Yoga", "Family Games"], participants: "7,000+" },
  { name: "Medak", pos: [-1.2, 0, -1.8], events: 1, activities: ["Yoga & Sound Bath", "Zumba"], participants: "6,000+" },
  { name: "Kamareddy", pos: [-1.5, 0, -3.2], events: 1, activities: ["Running", "Wellness Talks"], participants: "5,000+" },
  { name: "Peddapalli", pos: [2.8, 0, -4.0], events: 1, activities: ["Sports Challenge", "Zumba"], participants: "5,500+" },
  { name: "Jagtial", pos: [1.3, 0, -5.0], events: 1, activities: ["Zumba", "Health Education"], participants: "4,500+" },
  { name: "Mancherial", pos: [2.2, 0, -6.2], events: 1, activities: ["Cycling", "Yoga Session"], participants: "5,000+" },
  { name: "Kumuram Bheem Asifabad", pos: [0.8, 0, -7.8], events: 1, activities: ["Tribal Dance", "Zumba"], participants: "4,000+" },
  { name: "Nirmal", pos: [-0.4, 0, -5.8], events: 1, activities: ["Art Fair", "Yoga Session"], participants: "5,000+" },
  { name: "Jayashankar Bhupalpally", pos: [4.0, 0, -2.2], events: 1, activities: ["Forest Trail Walk", "Zumba"], participants: "4,500+" },
  { name: "Mulugu", pos: [5.0, 0, -1.2], events: 1, activities: ["Traditional Dance", "Health Camp"], participants: "4,000+" },
  { name: "Mahabubabad", pos: [4.0, 0, 0.5], events: 1, activities: ["Zumba", "Kabaddi Match"], participants: "6,000+" },
  { name: "Suryapet", pos: [3.5, 0, 2.0], events: 1, activities: ["Cycling", "Heart Checkups"], participants: "7,500+" },
  { name: "Yadadri Bhuvanagiri", pos: [1.6, 0, 1.0], events: 2, activities: ["Heritage Run", "Zumba", "Meditation"], participants: "9,000+" },
  { name: "Jangaon", pos: [2.0, 0, 0.0], events: 1, activities: ["Zumba", "Streets Activities"], participants: "5,000+" },
  { name: "Rajanna Sircilla", pos: [0.7, 0, -3.4], events: 2, activities: ["Handloom Walk", "Yoga", "Zumba"], participants: "8,500+" },
  { name: "Hanamkonda", pos: [2.7, 0, -1.6], events: 2, activities: ["Fort Run", "Dance Arena", "Music"], participants: "11,000+" },
  { name: "Bhadradri Kothagudem", pos: [5.8, 0, 1.0], events: 2, activities: ["Zumba", "Youth Games", "Health Camp"], participants: "9,500+" },
  { name: "Wanaparthy", pos: [-1.3, 0, 5.8], events: 1, activities: ["Palace Run", "Yoga Session"], participants: "5,000+" },
  { name: "Nagarkurnool", pos: [0.0, 0, 5.0], events: 1, activities: ["Forest Run", "Traditional Music"], participants: "6,500+" },
  { name: "Narayanpet", pos: [-4.0, 0, 4.6], events: 1, activities: ["Sari Walk", "Zumba Fitness"], participants: "5,000+" }
];

export const sportDistricts: Record<string, string[]> = {
  running: ["Hyderabad", "Medchal-Malkajgiri", "Karimnagar", "Warangal", "Khammam"],
  cycling: ["Hyderabad", "Ranga Reddy", "Sangareddy", "Nizamabad", "Nalgonda"],
  basketball: ["Hyderabad", "Siddipet", "Warangal", "Nalgonda", "Hanamkonda"],
  skating: ["Hyderabad", "Medchal-Malkajgiri", "Ranga Reddy", "Vikarabad"],
  kabaddi: ["Hyderabad", "Mahabubnagar", "Jogulamba Gadwal", "Suryapet", "Bhadradri Kothagudem"]
};

// 2D Coordinates representing the border points of Telangana to clip Voronoi cells
interface Point2D { x: number; y: number; }
const telanganaBoundary: Point2D[] = [
  { x: -1.0, y: -8.0 },
  { x: 1.5, y: -8.0 },
  { x: 3.5, y: -6.0 },
  { x: 5.5, y: -2.5 },
  { x: 6.8, y: 1.0 },
  { x: 5.2, y: 3.5 },
  { x: 2.8, y: 4.8 },
  { x: 0.0, y: 6.5 },
  { x: -3.5, y: 7.8 },
  { x: -4.8, y: 4.5 },
  { x: -3.8, y: 1.5 },
  { x: -2.8, y: -2.5 },
  { x: -2.2, y: -5.5 }
];

function clipPolygon(poly: Point2D[], pointOnLine: Point2D, normal: Point2D): Point2D[] {
  const result: Point2D[] = [];
  if (poly.length === 0) return result;

  const isInside = (pt: Point2D) => {
    return (pt.x - pointOnLine.x) * normal.x + (pt.y - pointOnLine.y) * normal.y >= -0.001;
  };

  const getIntersection = (p1: Point2D, p2: Point2D): Point2D => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const denom = dx * normal.x + dy * normal.y;
    if (Math.abs(denom) < 0.00001) return p1;
    const num = (pointOnLine.x - p1.x) * normal.x + (pointOnLine.y - p1.y) * normal.y;
    const t = num / denom;
    return { x: p1.x + t * dx, y: p1.y + t * dy };
  };

  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % poly.length];
    const in1 = isInside(p1);
    const in2 = isInside(p2);

    if (in1 && in2) {
      result.push(p2);
    } else if (in1 && !in2) {
      result.push(getIntersection(p1, p2));
    } else if (!in1 && in2) {
      result.push(getIntersection(p1, p2));
      result.push(p2);
    }
  }
  return result;
}

function getVoronoiCell(center: Point2D, points: Point2D[], boundary: Point2D[]): Point2D[] {
  let cell = [...boundary];
  for (const p of points) {
    if (p.x === center.x && p.y === center.y) continue;
    const mx = (center.x + p.x) / 2;
    const my = (center.y + p.y) / 2;
    const nx = center.x - p.x;
    const ny = center.y - p.y;
    cell = clipPolygon(cell, { x: mx, y: my }, { x: nx, y: ny });
  }
  return cell;
}

// 3D extruded district cell sub-component
function DistrictCell3D({
  district,
  index,
  isHovered,
  isSelected,
  anyHovered,
  hoveredSportId,
  onHover,
  onLeave,
  onClick
}: {
  district: any;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  anyHovered: boolean;
  hoveredSportId: string | null;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentY = useRef(0);
  
  const isHighlightedBySport = hoveredSportId ? sportDistricts[hoveredSportId]?.includes(district.name) : false;
  const targetY = isSelected ? 0.6 : isHovered ? 0.35 : isHighlightedBySport ? 0.2 : 0;

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth Y transition
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY, 0.15);
    
    // Float offset
    const float = Math.sin(time * 1.8 + index * 0.3) * 0.025;
    meshRef.current.position.y = currentY.current + float;
  });

  // Calculate dimming
  let opacity = 1.0;
  if (anyHovered && !isHovered && !isSelected) {
    opacity = 0.45;
  }
  if (hoveredSportId) {
    opacity = isHighlightedBySport ? 1.0 : 0.3;
  }

  // Radial color gradient from Hyderabad
  const dist = Math.sqrt(district.center[0] * district.center[0] + district.center[2] * district.center[2]);
  const ratio = Math.min(1.0, dist / 8.0);
  const baseColor = new THREE.Color("#E2E8F0").lerp(new THREE.Color("#C084FC"), ratio);

  // Emissive lighting on hover/selection: Royal blue for selected, Violet for hovered
  const emissiveColor = isSelected ? "#3B82F6" : isHovered ? "#8B5CF6" : isHighlightedBySport ? "#C084FC" : "#000000";
  const emissiveIntensity = isSelected ? 2.5 : isHovered ? 1.6 : isHighlightedBySport ? 1.2 : 0.0;

  const extrudeSettings = useMemo(() => ({
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  }), []);

  return (
    <group>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
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
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[district.shape, extrudeSettings]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={new THREE.Color(emissiveColor)}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.35}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

// Bouncing animated sports pin for zoomed district view
function SportsPin3D({ pos, color, index }: { pos: [number, number, number]; color: string; index: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Bouncing float
    meshRef.current.position.y = pos[1] + 0.5 + Math.abs(Math.sin(time * 3 + index * 0.4)) * 0.35;
    meshRef.current.rotation.y = time * 1.5;
  });

  return (
    <group ref={meshRef} position={pos}>
      <mesh castShadow rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Glowing curved road arcs between Hyderabad and other districts
function ConnectionArc3D({ start, end, active }: { start: [number, number, number]; end: [number, number, number]; active: boolean }) {
  const points = useMemo(() => {
    const pStart = new THREE.Vector3(...start);
    const pEnd = new THREE.Vector3(...end);
    const pMid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
    pMid.y += Math.sqrt(pStart.distanceTo(pEnd)) * 0.35; // Arched height
    const curve = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);
    return curve.getPoints(20);
  }, [start, end]);

  const progressRef = useRef(Math.random());
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    progressRef.current = (progressRef.current + delta * 0.55) % 1.0;
    if (pulseRef.current && points.length > 0) {
      const idx = Math.floor(progressRef.current * (points.length - 1));
      pulseRef.current.position.copy(points[idx]);
    }
  });

  if (!active) return null;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line {...({ geometry } as any)}>
        <lineBasicMaterial color="#ff5e36" transparent opacity={0.65} linewidth={1.5} />
      </line>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff8036" />
      </mesh>
    </group>
  );
}

interface TelanganaMap3DProps {
  scrollProgress: number;
  hoveredDistrictIndex: number | null;
  setHoveredDistrictIndex: (idx: number | null) => void;
  selectedDistrictIndex?: number | null;
  setSelectedDistrictIndex?: (idx: number | null) => void;
  hoveredSportId?: string | null;
}

export default function TelanganaMap3D({
  scrollProgress,
  hoveredDistrictIndex,
  setHoveredDistrictIndex,
  selectedDistrictIndex = null,
  setSelectedDistrictIndex = () => {},
  hoveredSportId = null
}: TelanganaMap3DProps) {

  // Map is visible in Telangana Map range or Sports Arena range
  const isMapVisible = scrollProgress >= 0.58 && scrollProgress <= 0.72;

  const points = useMemo(() => districtsData.map(d => ({ x: d.pos[0], y: d.pos[2] })), []);

  // Pre-calculate Voronoi shapes for the 33 districts once
  const districtShapes = useMemo(() => {
    return districtsData.map((d, idx) => {
      const center = { x: d.pos[0], y: d.pos[2] };
      const cellVertices = getVoronoiCell(center, points, telanganaBoundary);
      
      const shape = new THREE.Shape();
      if (cellVertices.length > 0) {
        shape.moveTo(cellVertices[0].x, cellVertices[0].y);
        for (let k = 1; k < cellVertices.length; k++) {
          shape.lineTo(cellVertices[k].x, cellVertices[k].y);
        }
        shape.closePath();
      }
      return {
        name: d.name,
        shape,
        center: d.pos
      };
    });
  }, [points]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow orbit rotation during idle
    if (selectedDistrictIndex === null) {
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.08;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    } else {
      // Zoom focus, lock rotation
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  if (!isMapVisible) return null;

  // Decide position: If in sports arena, shift map to left column (-3.2)
  const isSportsRange = scrollProgress >= 0.68 && scrollProgress <= 0.72;
  const mapPos: [number, number, number] = isSportsRange ? [-3.2, 0, -1] : [0, 0, 0];
  const mapScale = isSportsRange ? 0.7 : 0.9;

  return (
    <group ref={groupRef} position={mapPos} scale={[mapScale, mapScale, mapScale]}>
      {/* 3D Grid floor */}
      <gridHelper {...({ args: [24, 24, "#8B5CF6", "#E2E8F0"], position: [0, -0.8, 0], opacity: 0.2, transparent: true } as any)} />
      
      {/* 3D Extruded District cells */}
      {districtShapes.map((district, idx) => (
        <DistrictCell3D
          key={district.name}
          district={district}
          index={idx}
          isHovered={hoveredDistrictIndex === idx}
          isSelected={selectedDistrictIndex === idx}
          anyHovered={hoveredDistrictIndex !== null}
          hoveredSportId={hoveredSportId}
          onHover={() => setHoveredDistrictIndex(idx)}
          onLeave={() => setHoveredDistrictIndex(null)}
          onClick={() => setSelectedDistrictIndex(selectedDistrictIndex === idx ? null : idx)}
        />
      ))}

      {/* Render 3D Pins in selected/zoomed district */}
      {selectedDistrictIndex !== null && (
        <group>
          {/* Active bouncing pins around selected district center */}
          <SportsPin3D pos={[districtsData[selectedDistrictIndex].pos[0], 0.2, districtsData[selectedDistrictIndex].pos[2] + 0.3]} color="#ff5e36" index={0} />
          <SportsPin3D pos={[districtsData[selectedDistrictIndex].pos[0] - 0.4, 0.2, districtsData[selectedDistrictIndex].pos[2] - 0.2]} color="#0ea5e9" index={1} />
          <SportsPin3D pos={[districtsData[selectedDistrictIndex].pos[0] + 0.4, 0.2, districtsData[selectedDistrictIndex].pos[2] - 0.1]} color="#10b981" index={2} />
        </group>
      )}

      {/* Curved connection lines when a sport is hovered */}
      {hoveredSportId && districtsData.map((d, idx) => {
        const isRelated = sportDistricts[hoveredSportId]?.includes(d.name) && d.name !== "Hyderabad";
        return (
          <ConnectionArc3D
            key={`arc-${idx}`}
            start={districtsData[0].pos} // from Hyderabad
            end={d.pos}
            active={!!isRelated}
          />
        );
      })}
    </group>
  );
}
