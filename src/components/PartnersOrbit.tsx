"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Landmark, ShieldAlert, Heart, Map, Sparkles } from "lucide-react";

interface PartnerItem {
  name: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const partners: PartnerItem[] = [
  { name: "GHMC", sub: "Greater Hyderabad Municipal Corp", icon: <Landmark size={20} />, color: "#ff5e36" },
  { name: "HEALTH DEP.", sub: "Department of Health & Wellness", icon: <Heart size={20} />, color: "#10b981" },
  { name: "TRAFFIC POLICE", sub: "Traffic Management & Safety", icon: <ShieldAlert size={20} />, color: "#0ea5e9" },
  { name: "TOURISM DEP.", sub: "Culture & Traditional Heritage", icon: <Sparkles size={20} />, color: "#d4af37" },
  { name: "DISTRICT ADMIN", sub: "Local District Administration", icon: <Map size={20} />, color: "#a855f7" }
];

export default function PartnersOrbit({ scrollProgress }: { scrollProgress: number }) {
  // Partners active in partners orbit section
  const isActive = scrollProgress >= 0.996 && scrollProgress <= 0.998;
  const [angle, setAngle] = useState(0);

  // Rotate continuously in the background
  useEffect(() => {
    if (!isActive) return;
    let animFrame: number;
    
    const update = () => {
      setAngle((prev) => (prev + 0.005) % (Math.PI * 2));
      animFrame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animFrame);
  }, [isActive]);

  if (!isActive) return null;

  const radius = 180; // orbit radius in pixels

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-[#6d28d9] uppercase">
            Government Partnerships
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-1 text-[#0F172A]">
            Inter-Agency Coordination
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2">
            Bringing municipal, health, safety, and cultural agencies together for unified execution.
          </p>
        </motion.div>

        {/* Orbit Field */}
        <div className="relative w-96 h-96 flex items-center justify-center pointer-events-auto">
          
          {/* Outer Orbit Ring Circle */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-slate-300/30 animate-[spin_40s_linear_infinite]" />
          
          {/* Inner Orbit Ring Circle */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-slate-300/20" />

          {/* Central Hub Core Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="z-30 w-32 h-32 rounded-full glass-panel border border-purple-500/20 flex flex-col items-center justify-center p-3 text-center glow-shadow-orange"
          >
            <img src="/freedom_streets_logo.png" alt="Logo" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(109,40,217,0.2)]" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-slate-800 mt-2">FREEDOM</span>
            <span className="text-[8px] font-semibold text-[#6d28d9] tracking-[0.2em]">STREETS</span>
          </motion.div>

          {/* Orbiting Partner Nodes */}
          {partners.map((partner, idx) => {
            // Distribute nodes evenly around the circle, offset by the current animation angle
            const nodeAngle = (idx * (Math.PI * 2)) / partners.length + angle;
            const x = Math.cos(nodeAngle) * radius;
            const y = Math.sin(nodeAngle) * radius;

            return (
              <motion.div
                key={partner.name}
                className="absolute z-20 flex flex-col items-center select-none"
                style={{ x, y }}
              >
                {/* SVG link connector line to center */}
                <svg className="absolute w-60 h-60 overflow-visible pointer-events-none -z-10" style={{ transform: `rotate(${nodeAngle}rad)`, transformOrigin: "0 0", left: 0, top: 0 }}>
                  <line x1="0" y1="0" x2={-radius} y2="0" stroke="rgba(109,40,217,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
                
                {/* Glass Node Card */}
                <motion.div
                  whileHover={{ scale: 1.1, zIndex: 40 }}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center cursor-pointer shadow-xl relative"
                  style={{ borderColor: `${partner.color}25` }}
                >
                  <div style={{ color: partner.color }} className="filter drop-shadow-[0_0_3px_rgba(0,0,0,0.15)]">
                    {partner.icon}
                  </div>

                  {/* Absolute Tooltip Details on Hover */}
                  <div className="absolute top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200/60 px-3 py-1.5 rounded-lg text-center opacity-0 hover:opacity-100 hover:scale-100 scale-95 origin-top transition-all duration-300 w-36 pointer-events-none pointer-events-auto">
                    <span className="text-[9px] font-bold text-slate-800 block">{partner.name}</span>
                    <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">{partner.sub}</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </div>
  );
}
