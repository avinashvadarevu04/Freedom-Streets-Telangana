"use client";

import { motion } from "framer-motion";

interface VisionPanelProps {
  scrollProgress: number;
}

export default function VisionPanel({ scrollProgress }: { scrollProgress: number }) {
  // Normalized scroll position inside Section 3 (0.18 to 0.23)
  const localProgress = Math.min(1.0, Math.max(0.0, (scrollProgress - 0.18) / 0.05));

  const statements = [
    {
      label: "THE MISSION",
      text: "To create a statewide movement of active, engaged communities where physical wellness and mental health are celebrated.",
      highlight: "Statewide movement"
    },
    {
      label: "THE FOUNDATION",
      text: "Freedom Streets periodic street closures reclaim public spaces to promote community cohesion and physical health.",
      highlight: "Reclaim public spaces"
    },
    {
      label: "THE ROBUST VISION",
      text: "A direct preventative healthcare strategy designed in collaboration with the Telangana Government, touching 4 crore lives.",
      highlight: "preventative healthcare"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 pt-20"
    >
      {/* Background SVG paths linking the boxes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <motion.path
          d={`M ${typeof window !== 'undefined' ? window.innerWidth * 0.2 : 200} ${typeof window !== 'undefined' ? window.innerHeight * 0.3 : 200} L ${typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800} ${typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500}`}
          fill="none"
          stroke="url(#gradient-orange-gold)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.min(1, localProgress * 1.5) }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient-orange-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5e36" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-[#6d28d9] uppercase">
            A Transcendent Vision
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2 text-[#0F172A] text-glow-orange">
            The Philosophy of The Street
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statements.map((stmt, idx) => {
            // Trigger thresholds based on localProgress
            const cardTrigger = localProgress > idx * 0.25;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={cardTrigger ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col justify-between h-72 border border-slate-200/50 shadow-2xl relative overflow-hidden pointer-events-auto"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <span className="text-[9px] font-bold tracking-widest text-[#06B6D4] block mb-4 uppercase">
                    {stmt.label}
                  </span>
                  <p className="text-sm md:text-base leading-relaxed text-slate-700 font-medium">
                    {stmt.text.split(stmt.highlight).map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < stmt.text.split(stmt.highlight).length - 1 && (
                          <span className="text-[#6d28d9] font-bold border-b border-purple-500/30">
                            {stmt.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] animate-ping" />
                  <span className="text-[9px] tracking-widest text-slate-500 font-semibold uppercase">
                    PHASE 1 ACTIVE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
