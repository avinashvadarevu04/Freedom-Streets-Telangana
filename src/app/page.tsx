"use client";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (args[0] && typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn.apply(console, args);
  };
}

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, Variants } from "framer-motion";
import { ChevronDown, Heart, Eye, MapPin, Calendar, Clock, Star, Activity, Plus, ShieldCheck, CheckCircle2, ChevronRight, Sun, Music } from "lucide-react";
import Preloader from "@/components/Preloader";
import CinematicCanvas from "@/components/CinematicCanvas";
import HyderabadHero3D from "@/components/HyderabadHero3D";
import TelanganaMap3D, { districtsData } from "@/components/TelanganaMap3D";
import VenueMap3D, { venueZonesData } from "@/components/VenueMap3D";
import SportsShowcase3D from "@/components/SportsShowcase3D";
import FitnessCultural3D from "@/components/FitnessCultural3D";
import CircularIslands3D from "@/components/CircularIslands3D";
import InfiniteTimelineRoad3D from "@/components/InfiniteTimelineRoad3D";
import VisionPanel from "@/components/VisionPanel";
import DashboardStats from "@/components/DashboardStats";
import Gallery3D from "@/components/Gallery3D";
import PartnersOrbit from "@/components/PartnersOrbit";

// --- PREMIER VISUAL COMPONENTS ---

// Custom Glowing Cursor Ring with magnetic spring physics and click ripple
function CustomCursor({ hovered }: { hovered: boolean }) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [clicked, setClicked] = useState(false);

  const springConfig = { damping: 22, stiffness: 240, mass: 0.12 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 450);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-8 h-8 rounded-full border pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: hovered ? 1.8 : 1.0,
          borderColor: hovered ? "#db2777" : "#6d28d9",
          backgroundColor: hovered ? "rgba(219,39,119,0.15)" : "rgba(109,40,217,0.05)",
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="fixed w-2 h-2 rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          backgroundColor: hovered ? "#db2777" : "#6d28d9"
        }}
        transition={{ duration: 0.1 }}
      />
      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              x: cursorX,
              y: cursorY,
            }}
            className="fixed -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-pink-500/80 pointer-events-none z-[999998]"
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Health & Wellness Section containing animated vitals smartwatch UI and 8 interactive cards
function HealthWellnessSection({ scrollProgress, isRange, containerVariants, itemVariants }: { 
  scrollProgress: number; 
  isRange: (start: number, end: number) => boolean;
  containerVariants: any;
  itemVariants: any;
}) {
  const [bpm, setBpm] = useState(76);
  const [calories, setCalories] = useState(340);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        const next = prev + change;
        return Math.min(88, Math.max(72, next));
      });
      setCalories(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 1000);
    return () => clearInterval(bpmInterval);
  }, []);

  if (!isRange(0.86, 0.88)) return null;

  const cards = [
    { id: 1, title: "Sports Medicine", desc: "Expert athletic care, diagnostics, and medical backings.", color: "from-purple-500 to-indigo-500", icon: "activity" },
    { id: 2, title: "Nutrition & Diet", desc: "Hydration guide, calorie budgets, and sports diet plans.", color: "from-orange-500 to-red-500", icon: "nutrition" },
    { id: 3, title: "Mental Wellness", desc: "Meditation tracks, mental recovery, and stress diagnostics.", color: "from-cyan-500 to-blue-500", icon: "mental" },
    { id: 4, title: "Physiotherapy", desc: "Proactive sports physio, stretching guide, and recovery.", color: "from-emerald-500 to-teal-500", icon: "physio" },
    { id: 5, title: "Hydration", desc: "Hydration tracking, electrolyte drinks, and water budgets.", color: "from-sky-500 to-blue-600", icon: "hydration" },
    { id: 6, title: "Recovery Programs", desc: "Foam rolling, active sleep tracking, and relaxation.", color: "from-violet-500 to-purple-600", icon: "recovery" },
    { id: 7, title: "Injury Prevention", desc: "Warmup guide, joint safety assessments, and muscle balance.", color: "from-pink-500 to-rose-600", icon: "prevention" },
    { id: 8, title: "Fitness Assessment", desc: "BMI, cardiovascular indexing, and lung capacity checks.", color: "from-teal-500 to-green-600", icon: "assessment" }
  ];

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 pt-28 z-30 flex items-center justify-center px-6 md:px-16 pointer-events-none"
      >
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Smartwatch & Athlete Visual */}
          <motion.div 
            className="md:col-span-5 flex flex-col gap-6 items-center pointer-events-auto"
            variants={itemVariants}
          >
            {/* Heading & Subtitle */}
            <div className="text-center md:text-left w-full mb-2">
              <span className="text-[9px] font-bold tracking-[0.4em] text-red-600 uppercase font-mono block">Preventative Care</span>
              <h2 className="font-serif text-3xl font-bold mt-1 text-[#0F172A]">Wellness & Vitals</h2>
              <p className="text-[10px] text-slate-500 mt-1 font-medium max-w-sm">
                Track dynamic citizen metrics and preventive health targets in our Sunday hubs.
              </p>
            </div>

            {/* The Smartwatch Vitals Card Wrapper */}
            <div className="relative w-full max-w-[280px]">
              {/* Floating Hydration Badge */}
              <motion.div
                className="absolute -right-14 top-6 glass-panel p-2 rounded-2xl flex flex-col items-center gap-1 bg-white/90 border-slate-200/50 shadow-lg pointer-events-auto"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              >
                <Plus size={14} className="text-blue-500 animate-pulse" />
                <span className="text-[6px] font-bold text-slate-500 block uppercase">HYDRATION</span>
                <span className="text-[8px] font-mono font-bold text-blue-600 leading-none">1.8L</span>
              </motion.div>

              {/* Floating Balanced Diet Badge */}
              <motion.div
                className="absolute -left-14 top-14 glass-panel p-2 rounded-2xl flex flex-col items-center gap-1 bg-white/90 border-slate-200/50 shadow-lg pointer-events-auto"
                animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
              >
                <Heart size={14} className="text-emerald-500" />
                <span className="text-[6px] font-bold text-slate-500 block uppercase">DIET PLAN</span>
                <span className="text-[8px] font-mono font-bold text-emerald-600 leading-none">Balanced</span>
              </motion.div>

              {/* Floating Recovery Badge */}
              <motion.div
                className="absolute -right-10 bottom-6 glass-panel p-2 rounded-2xl flex flex-col items-center gap-1 bg-white/90 border-slate-200/50 shadow-lg pointer-events-auto"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Activity size={14} className="text-orange-500" />
                <span className="text-[6px] font-bold text-slate-500 block uppercase">RECOVERY</span>
                <span className="text-[8px] font-mono font-bold text-orange-600 leading-none">Active</span>
              </motion.div>

              <div className="w-full bg-[#0B0F19] text-white p-5 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-4">
                {/* Watch glass glare */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none blur-xl" />
                
                {/* Watch Header */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                  <span>FS WATCH 6</span>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                </div>

                {/* Vitals Circle Graph */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      stroke="#8B5CF6"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="264"
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * 0.84) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="text-center flex flex-col items-center justify-center">
                    <span className="text-[28px] font-bold tracking-tight font-mono text-[#a855f7] leading-none">{bpm}</span>
                    <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">HEART RATE</span>
                    <span className="text-[9px] text-emerald-400 font-mono mt-1 font-bold">84% Activity</span>
                  </div>
                </div>

                {/* ECG Waveform SVG */}
                <div className="w-full bg-slate-900/60 p-2.5 rounded-2xl border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
                    <span>ECG MONITOR</span>
                    <span className="text-red-400 font-bold">NORMAL SINUS</span>
                  </div>
                  <div className="h-8 relative overflow-hidden flex items-center">
                    <svg className="w-full h-full text-red-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <motion.path
                        d="M 0 15 L 20 15 L 23 5 L 26 25 L 29 15 L 50 15 L 53 5 L 56 25 L 59 15 L 80 15 L 83 5 L 86 25 L 89 15 L 100 15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Micro Vitals Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-semibold">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[8px] uppercase">Calories</span>
                    <span className="text-sm font-bold text-orange-400 font-mono mt-0.5 block">{calories} kcal</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[8px] uppercase">Vitals score</span>
                    <span className="text-sm font-bold text-sky-400 font-mono mt-0.5 block">96 / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing heartbeat/pulse line vector overlay */}
            <div className="w-full flex flex-col items-center mt-2 relative">
              <svg className="w-48 h-12 text-[#a855f7] opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 200 60" fill="none">
                <motion.path 
                  d="M 10 30 L 45 30 L 52 10 L 58 50 L 65 30 L 110 30 L 115 5 L 122 55 L 130 30 L 190 30" 
                  stroke="url(#pulse-gradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                  animate={{ strokeDashoffset: [200, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                />
                <circle cx="100" cy="30" r="4.5" fill="#db2777" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="100" cy="30" r="3" fill="#db2777" />
                
                <defs>
                  <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#db2777" stopOpacity="1" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-[7px] font-mono font-bold text-purple-600 tracking-[0.2em] uppercase mt-1">
                PULSE MATRIX INTEGRATION
              </div>
            </div>
          </motion.div>

          {/* Right Column: 8 Interactive Wellness Cards Grid */}
          <motion.div 
            className="md:col-span-7 grid grid-cols-2 gap-3 pointer-events-auto"
            variants={containerVariants}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 relative overflow-hidden bg-white/95 cursor-pointer ${
                  activeCard === card.id 
                    ? "border-[#6d28d9]/40 shadow-lg shadow-purple-500/5" 
                    : "border-slate-200/50"
                }`}
                variants={itemVariants}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">{card.title}</h4>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${card.color} text-white`}>
                    {card.icon === "activity" && <Activity size={12} className="animate-pulse" />}
                    {card.icon === "nutrition" && <Heart size={12} />}
                    {card.icon === "mental" && <Star size={12} className="animate-spin" style={{ animationDuration: '6s' }} />}
                    {card.icon === "physio" && <CheckCircle2 size={12} />}
                    {card.icon === "hydration" && <Plus size={12} />}
                    {card.icon === "recovery" && <Clock size={12} />}
                    {card.icon === "prevention" && <ShieldCheck size={12} />}
                    {card.icon === "assessment" && <Eye size={12} />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                  {card.desc}
                </p>
                
                {/* Decorative tiny detail */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color} transition-all duration-300 ${
                  activeCard === card.id ? "opacity-100" : "opacity-0"
                }`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// 1. Awwwards-level Glassmorphic Mock Video/Cinema card
function MockVideoPlayer({ imagePath, title, duration }: { imagePath: string; title: string; duration: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-200/50 shadow-2xl group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent z-10" />
      <img 
        src={imagePath} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out" 
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="w-14 h-14 bg-white/40 border border-white/50 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-500 shadow-lg">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-purple-600 border-b-[8px] border-b-transparent translate-x-1" />
        </div>
      </div>
      <div className="absolute bottom-4 left-5 right-5 z-20 flex justify-between items-end">
        <div>
          <span className="text-[8px] font-bold tracking-[0.2em] text-[#6d28d9] block uppercase mb-1">CINEMATIC PREVIEW</span>
          <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">{title}</h4>
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200/30">
          {duration}
        </span>
      </div>
    </motion.div>
  );
}

// 2. Animated Circular Health & Wellness Rings
function WhyFreedomStreetsVisual() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md items-center pointer-events-auto">
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { label: "Mental Health", color: "from-sky-500 to-sky-400", val: "88%", desc: "Stress reduction" },
          { label: "Social Bonds", color: "from-[#6d28d9] to-purple-400", val: "94%", desc: "Community ties" },
          { label: "Wellness Reach", color: "from-emerald-500 to-emerald-400", val: "33 Districts", desc: "Inclusive access" }
        ].map((ring, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-200/50 flex flex-col items-center text-center bg-white/95">
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="rgba(15,23,42,0.03)" strokeWidth="4" fill="transparent" />
                <motion.circle 
                  cx="32" cy="32" r="28" 
                  stroke={`url(#grad-${idx})`} 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray="176" 
                  initial={{ strokeDashoffset: 176 }}
                  animate={{ strokeDashoffset: 45 }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                />
                <defs>
                  <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-purple-600" stopColor="#6d28d9" />
                    <stop offset="100%" className="text-[#06B6D4]" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-800 font-mono">{ring.val}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">{ring.label}</span>
            <span className="text-[8px] text-slate-500 leading-tight mt-1">{ring.desc}</span>
          </div>
        ))}
      </div>
      
      {/* Public Health ROI Banner */}
      <div className="glass-panel p-3.5 rounded-xl border border-purple-200/40 w-full flex items-center justify-between bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div>
          <span className="text-[7.5px] font-bold tracking-widest text-[#6d28d9] uppercase font-mono block">Municipal Budget Impact</span>
          <span className="text-[10px] font-bold text-slate-700 block mt-0.5">Public Health ROI Multiplier</span>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">4.8x Savings</span>
      </div>
    </div>
  );
}

// Reusable floating vector sports accessories to fill margins and empty spaces
function FloatingSportsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
      {/* Dumbbell icon */}
      <motion.svg 
        className="absolute w-12 h-12 text-purple-600"
        style={{ top: "15%", left: "10%" }}
        animate={{ y: [0, -15, 0], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      >
        <path d="M6.5 6.5h11M6.5 17.5h11M3 10v4M21 10v4M6.5 6.5v11M17.5 6.5v11" />
      </motion.svg>

      {/* Bicycle icon */}
      <motion.svg 
        className="absolute w-16 h-16 text-pink-600"
        style={{ bottom: "20%", left: "8%" }}
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      >
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 17.5L12 9H7l-3 4.5M12 9l-4 8.5M18.5 17.5L15 9" />
      </motion.svg>

      {/* Heart Rate line */}
      <motion.svg 
        className="absolute w-20 h-10 text-cyan-500"
        style={{ top: "25%", right: "8%" }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5"
      >
        <path d="M 0 15 L 20 15 L 25 5 L 30 25 L 35 15 L 60 15 L 65 5 L 70 25 L 75 15 L 100 15" />
      </motion.svg>

      {/* Apple/Nutrition icon */}
      <motion.svg 
        className="absolute w-10 h-10 text-emerald-500"
        style={{ bottom: "15%", right: "12%" }}
        animate={{ y: [0, -10, 0], rotate: [0, -180, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6c0-2 2-3 2-3" />
      </motion.svg>
    </div>
  );
}

// 3. Sunday Event schedule Calendar animation helper
function SundayProgramVisual() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 w-full max-w-md">
      <div className="flex justify-between items-center border-b border-slate-200/50 pb-3 mb-4">
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#6d28d9] uppercase">SUNDAY EVENT STRUCTURE</span>
        <span className="text-[9px] font-mono text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded">WEEKLY</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[9px] font-bold text-slate-400">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className={i === 6 ? "text-[#6d28d9]" : ""}>{d}</span>
        ))}
        {Array.from({ length: 28 }).map((_, i) => {
          const isSunday = (i + 1) % 7 === 0;
          return (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.1 }}
              className={`py-1.5 rounded font-mono ${isSunday ? "bg-gradient-to-r from-purple-600 to-[#6d28d9] text-white font-bold shadow-lg" : "bg-slate-200/30 text-slate-500 opacity-40"}`}
            >
              {i + 1}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 text-[9px] text-slate-600 bg-slate-100 p-2 rounded border border-slate-200/40">
        <Clock size={12} className="text-[#6d28d9]" />
        <span>Every Sunday morning, streets are closed to traffic to support fitness.</span>
      </div>
    </div>
  );
}

// 4. Phase Highlights timeline layout
// 4. Phase Highlights timeline layout
function PhaseHighlightsVisual({ scrollProgress }: { scrollProgress: number }) {
  // scrollProgress range is 0.52 to 0.57.
  const progress = Math.min(1.0, Math.max(0.0, (scrollProgress - 0.52) / 0.05));
  const activePhase = progress < 0.35 ? 0 : progress < 0.7 ? 1 : 2;

  const phases = [
    { phase: "PHASE 01", title: "Flagship Launch", desc: "Open Dallas Road to citizens. Lay active running tracks, diagnostic hubs, and performance stages.", date: "March - June", action: "Road builds & cones set" },
    { phase: "PHASE 02", title: "Regional Expansion", desc: "Scale campaign to Medchal, Rangareddy, and Sangareddy. Engage local authorities in community runs.", date: "July - Oct", action: "Connecting district nodes" },
    { phase: "PHASE 03", title: "Statewide Integration", desc: "Launch across all 33 districts, establishing Freedom Streets as the official Telangana health calendar.", date: "Nov - Dec", action: "Festival starts & sports begin" }
  ];

  return (
    <div className="flex flex-col gap-5 w-full max-w-md relative pl-6 mt-4 pointer-events-auto">
      {/* Animated Timeline line */}
      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-200">
        <motion.div 
          className="w-full bg-gradient-to-b from-purple-600 to-[#06b6d4] origin-top h-full"
          style={{ transformOrigin: "top", scaleY: progress }}
        />
      </div>

      {phases.map((p, idx) => {
        const isActive = idx === activePhase;
        return (
          <motion.div 
            key={idx}
            className={`relative transition-all duration-300 ${isActive ? "scale-[1.02] opacity-100" : "opacity-45"}`}
          >
            <div className={`absolute -left-[23px] top-1.5 w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? "bg-purple-600 shadow-[0_0_8px_rgba(109,40,217,0.6)]" : "bg-slate-300"}`} />
            
            <div className={`glass-panel p-4 rounded-xl border transition-all duration-300 bg-white/95 ${isActive ? "border-purple-500/30 shadow-lg" : "border-slate-100"}`}>
              <div className="flex justify-between items-center text-[8px] font-bold font-mono">
                <span className="text-purple-600">{p.phase} • {p.date}</span>
                <span className={isActive ? "text-[#06b6d4] animate-pulse font-bold" : "text-slate-400"}>{p.action}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-1">{p.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">{p.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// 5. Government Collaboration Orbit map
function GovPartnershipVisual() {
  return (
    <div className="relative w-full max-w-md aspect-square max-h-[300px] flex items-center justify-center">
      <div className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-slate-300/30 animate-spin" style={{ animationDuration: "20s" }} />
      <div className="absolute w-[140px] h-[140px] rounded-full border border-dashed border-slate-300/30 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
      
      <div className="z-10 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 flex flex-col items-center justify-center shadow-xl border border-white/20">
        <span className="text-[8px] font-black text-white tracking-widest text-center leading-none">FS</span>
        <span className="text-[6px] text-white/70 mt-1 uppercase font-bold">JWG</span>
      </div>

      {[
        { label: "GHMC", angle: 0, rad: 110 },
        { label: "Traffic Police", angle: 72, rad: 110 },
        { label: "Health Dept", angle: 144, rad: 110 },
        { label: "District Admins", angle: 216, rad: 110 },
        { label: "Public Health", angle: 288, rad: 110 }
      ].map((node, i) => {
        const x = Math.cos((node.angle * Math.PI) / 180) * node.rad;
        const y = Math.sin((node.angle * Math.PI) / 180) * node.rad;
        return (
          <div 
            key={i}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className="absolute w-12 h-12 rounded-full bg-white border border-slate-200/50 flex items-center justify-center shadow-sm text-[8px] text-slate-700 font-bold text-center p-1 leading-snug"
          >
            {node.label}
          </div>
        );
      })}
    </div>
  );
}

// 6. Success Metrics graphical widget
function SuccessMetricsVisual() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 w-full max-w-md flex flex-col gap-4">
      <span className="text-[8px] font-bold tracking-[0.25em] text-[#6d28d9] uppercase">PROJECTED AUDIT KPI</span>
      <div className="flex flex-col gap-3">
        {[
          { label: "Participant Reach", val: "10 Lakhs+", target: "Goal: 20L", progress: 65, color: "bg-sky-500" },
          { label: "Mental Health Index Improvement", val: "+22%", target: "Target: +30%", progress: 73, color: "bg-purple-500" },
          { label: "Community Engagement Rate", val: "84%", target: "Goal: 85%", progress: 95, color: "bg-emerald-500" }
        ].map((m, i) => (
          <div key={i} className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between font-bold text-slate-700">
              <span>{m.label}</span>
              <span className="text-slate-900 font-mono">{m.val}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.progress}%` }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                className={`h-full ${m.color}`} 
              />
            </div>
            <span className="text-[8px] text-slate-500 self-end font-medium">{m.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Long Term Expansion roadmap grid
function LongTermExpansionVisual() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {[
        { title: "33 Districts Setup", desc: "Permanent municipal grids for weekly sports implementation.", stat: "33 Nodes" },
        { title: "4 Crore Citizens", desc: "Broad engagement with wellness across urban and rural centers.", stat: "4Cr Reach" },
        { title: "National Replication", desc: "Blueprint documentation for public health implementations.", stat: "Blueprint" },
        { title: "Unified Health ID", desc: "Digital ROI health dashboard sync to measure longevity stats.", stat: "Stat Sync" }
      ].map((item, idx) => (
        <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-200/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{item.title}</h4>
            <p className="text-[9px] text-slate-500 leading-snug mt-1">{item.desc}</p>
          </div>
          <span className="text-[10px] font-bold text-purple-600 mt-3 block font-mono">{item.stat}</span>
        </div>
      ))}
    </div>
  );
}

// --- MAIN PAGE LAYOUT ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Local state for countdown timer (Targeting Oct 15, 2026 6:00 AM)
  const [timeLeft, setTimeLeft] = useState({ days: 106, hours: 15, minutes: 24, seconds: 12 });
  useEffect(() => {
    const target = new Date("2026-10-15T06:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Safely get initial scroll progress for Server-Side Rendering (SSR)
  const getInitialScrollProgress = () => {
    if (typeof window === "undefined") return 0;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? scrollY / maxScroll : 0;
  };

  const [scrollProgress, setScrollProgress] = useState(getInitialScrollProgress);
  const targetScrollProgress = useRef(getInitialScrollProgress());
  const [hoveredDistrictIndex, setHoveredDistrictIndex] = useState<number | null>(null);
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  // Redesigned Sports section state handles
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState<number | null>(null);
  const [hoveredSportId, setHoveredSportId] = useState<string | null>(null);
  const [activeSportId, setActiveSportId] = useState<string | null>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastMouseCoords = useRef({ x: 0, y: 0 });

  // Synchronized navigation underline state and button element refs
  const [activeSection, setActiveSection] = useState("Hero");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const navSections = [
    { name: "Hero", range: [0.0, 0.12] },
    { name: "Vision", range: [0.12, 0.42] },
    { name: "Venue", range: [0.42, 0.58] },
    { name: "Districts", range: [0.58, 0.65] },
    { name: "Sports", range: [0.65, 0.73] },
    { name: "Wellness", range: [0.73, 0.89] },
    { name: "Culture", range: [0.89, 0.93] },
    { name: "Itinerary", range: [0.93, 1.05] }
  ];

  // Monitor scrollProgress with a hysteresis buffer bounds check
  useEffect(() => {
    let nextSection = activeSection;
    const currentRange = navSections.find(s => s.name === activeSection);
    
    if (currentRange) {
      const buffer = 0.008; // Buffer threshold to prevent scroll flickering
      const [start, end] = currentRange.range;
      
      const hasExitedLeft = scrollProgress < start - buffer && start > 0;
      const hasExitedRight = scrollProgress >= end + buffer && end < 1;
      const isExtremeLeft = scrollProgress === 0 && start === 0;
      const isExtremeRight = scrollProgress >= 0.985 && end >= 1;
      
      if (hasExitedLeft || hasExitedRight || isExtremeLeft || isExtremeRight) {
        const matched = navSections.find(s => scrollProgress >= s.range[0] && scrollProgress < s.range[1]);
        if (matched) {
          nextSection = matched.name;
        } else if (scrollProgress >= 0.985) {
          nextSection = "Itinerary";
        }
      }
    } else {
      const matched = navSections.find(s => scrollProgress >= s.range[0] && scrollProgress < s.range[1]);
      if (matched) {
        nextSection = matched.name;
      }
    }

    if (nextSection !== activeSection) {
      setActiveSection(nextSection);
    }
  }, [scrollProgress, activeSection]);

  // Dynamically measure and update active button underline dimensions
  const updateUnderlineBounds = useCallback(() => {
    const activeBtn = navRefs.current[activeSection];
    if (activeBtn) {
      setUnderlineStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateUnderlineBounds();

    const handleResize = () => {
      updateUnderlineBounds();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeSection, updateUnderlineBounds]);

  // Reposition tooltip immediately on hover trigger
  useEffect(() => {
    if (hoveredDistrictIndex !== null && tooltipRef.current) {
      tooltipRef.current.style.left = `${lastMouseCoords.current.x + 15}px`;
      tooltipRef.current.style.top = `${lastMouseCoords.current.y + 15}px`;
    }
  }, [hoveredDistrictIndex]);

  // Hook scroll updates
  useEffect(() => {
    if (loading) return;

    let animationFrameId: number;
    let currentProgress = getInitialScrollProgress();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      targetScrollProgress.current = progress;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      lastMouseCoords.current = { x: e.clientX, y: e.clientY };
      
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.clientX + 15}px`;
        tooltipRef.current.style.top = `${e.clientY + 15}px`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on("scroll", () => {
        const progress = lenis.scroll / lenis.limit;
        targetScrollProgress.current = progress;
      });
    }

    let lastProgressVal = -1;
    const updateSmoothScroll = () => {
      const diff = targetScrollProgress.current - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress = currentProgress + diff * 0.08;
        if (currentProgress < 0.0001) currentProgress = 0;
        if (currentProgress > 0.9999) currentProgress = 1;
        
        if (Math.abs(currentProgress - lastProgressVal) > 0.0002) {
          setScrollProgress(currentProgress);
          lastProgressVal = currentProgress;
        }
      } else if (currentProgress !== targetScrollProgress.current) {
        currentProgress = targetScrollProgress.current;
        setScrollProgress(currentProgress);
        lastProgressVal = currentProgress;
      }
      animationFrameId = requestAnimationFrame(updateSmoothScroll);
    };

    animationFrameId = requestAnimationFrame(updateSmoothScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (lenis) {
        lenis.off("scroll");
      }
    };
  }, [loading]);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const isRange = (start: number, end: number) => {
    return scrollProgress >= start && scrollProgress <= end;
  };

  const activeDistrict = hoveredDistrictIndex !== null ? districtsData[hoveredDistrictIndex] : null;
  const activeZone = activeZoneId !== null ? venueZonesData.find(z => z.id === activeZoneId) : null;
  
  const participantDescriptions: Record<string, { title: string; desc: string; impact: string }> = {
    families: {
      title: "Families & Households",
      desc: "Bond over outdoor exercises, traditional games, and healthy food stalls. Reconnect without digital distractions.",
      impact: "Builds healthy habits for children and promotes parent-child quality time."
    },
    students: {
      title: "Students & Youth",
      desc: "Join high-energy Zumba sessions, dance face-offs, competitive tracks, and collaborative art workshops.",
      impact: "Provides healthy stress release and builds community connections outside classrooms."
    },
    seniors: {
      title: "Senior Citizens",
      desc: "Participate in dedicated low-impact Yoga, breathing zones, blood pressure screenings, and relaxed seating nodes.",
      impact: "Reduces isolation, provides safe social integration, and targets longevity wellness."
    },
    corporates: {
      title: "Corporate Employees",
      desc: "Escape the desk with stress-busting workouts, mindfulness exercises, and team coordination races.",
      impact: "Combats burnout and sedentary lifestyle challenges."
    },
    pets: {
      title: "Pet Owners & Pets",
      desc: "A dedicated Pet Zone with hydration nodes, social spaces, veterinarian counseling, and run paths.",
      impact: "Promotes animal physical fitness and pet-friendly municipal coordination."
    },
    inclusive: {
      title: "All-Inclusive Access",
      desc: "Wheelchair-accessible tracks, sign-language assistance, and sensory-friendly zones.",
      impact: "Ensures every single citizen of Telangana can attend and celebrate health together."
    }
  };

  const activeIsland = hoveredIslandId ? participantDescriptions[hoveredIslandId] : null;

  return (
    <main className="relative min-h-[1800vh] w-full bg-[#FAFAFC]">
      <Preloader onComplete={handlePreloaderComplete} />

      {!loading && (
        <>
          {/* Global Background Grid & Ambient Blur Meshes */}
          <div className="premium-grid-bg" style={{ transform: `translateY(${scrollProgress * -60}px)` }} />
          <div className="ambient-mesh" style={{ left: '5%', top: '10%' }} />
          <div className="ambient-mesh-2" />
          
          {/* Global Background Ambient Floating Shapes (Circles, Triangles, Squares) */}
          <div className="float-shape-container">
            {[
              // Circles
              { type: "circle", size: 24, x: 10, y: 15, anim: "animate-shape-1", color: "purple" },
              { type: "circle", size: 16, x: 30, y: 25, anim: "animate-shape-2", color: "cyan" },
              { type: "circle", size: 32, x: 85, y: 10, anim: "animate-shape-3", color: "purple" },
              { type: "circle", size: 20, x: 45, y: 60, anim: "animate-shape-1", color: "cyan" },
              { type: "circle", size: 28, x: 75, y: 80, anim: "animate-shape-2", color: "purple" },
              { type: "circle", size: 12, x: 90, y: 50, anim: "animate-shape-3", color: "cyan" },
              { type: "circle", size: 18, x: 5, y: 70, anim: "animate-shape-1", color: "purple" },
              { type: "circle", size: 24, x: 60, y: 90, anim: "animate-shape-2", color: "cyan" },
              { type: "circle", size: 16, x: 20, y: 85, anim: "animate-shape-3", color: "purple" },
              { type: "circle", size: 30, x: 40, y: 5, anim: "animate-shape-1", color: "cyan" },
              
              // Squares
              { type: "square", size: 20, x: 5, y: 40, anim: "animate-shape-2", color: "cyan" },
              { type: "square", size: 28, x: 80, y: 30, anim: "animate-shape-3", color: "purple" },
              { type: "square", size: 16, x: 95, y: 70, anim: "animate-shape-1", color: "cyan" },
              { type: "square", size: 24, x: 50, y: 20, anim: "animate-shape-2", color: "purple" },
              { type: "square", size: 12, x: 35, y: 55, anim: "animate-shape-3", color: "cyan" },
              { type: "square", size: 22, x: 65, y: 65, anim: "animate-shape-1", color: "purple" },
              { type: "square", size: 32, x: 15, y: 95, anim: "animate-shape-2", color: "cyan" },
              { type: "square", size: 14, x: 88, y: 90, anim: "animate-shape-3", color: "purple" },
              { type: "square", size: 26, x: 72, y: 8, anim: "animate-shape-1", color: "cyan" },
              { type: "square", size: 18, x: 55, y: 45, anim: "animate-shape-2", color: "purple" },
              
              // Triangles
              { type: "triangle", size: 22, x: 25, y: 8, anim: "animate-shape-3", color: "purple" },
              { type: "triangle", size: 30, x: 68, y: 18, anim: "animate-shape-1", color: "cyan" },
              { type: "triangle", size: 16, x: 92, y: 60, anim: "animate-shape-2", color: "purple" },
              { type: "triangle", size: 26, x: 12, y: 50, anim: "animate-shape-3", color: "cyan" },
              { type: "triangle", size: 18, x: 42, y: 75, anim: "animate-shape-1", color: "purple" },
              { type: "triangle", size: 24, x: 82, y: 52, anim: "animate-shape-2", color: "cyan" },
              { type: "triangle", size: 14, x: 3, y: 22, anim: "animate-shape-3", color: "purple" },
              { type: "triangle", size: 28, x: 52, y: 95, anim: "animate-shape-1", color: "cyan" },
              { type: "triangle", size: 20, x: 98, y: 28, anim: "animate-shape-2", color: "purple" },
              { type: "triangle", size: 16, x: 33, y: 90, anim: "animate-shape-3", color: "cyan" },
            ].map((s, i) => {
              const isPurple = s.color === "purple";
              const strokeColor = isPurple ? "rgba(109, 40, 217, 0.65)" : "rgba(6, 182, 212, 0.65)";
              const fillColor = isPurple ? "rgba(109, 40, 217, 0.05)" : "rgba(6, 182, 212, 0.05)";
              const textColor = isPurple ? "text-[#6d28d9]/70" : "text-[#06b6d4]/70";

              return (
                <div
                  key={i}
                  className={`absolute ${s.anim} pointer-events-none`}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    borderRadius: s.type === "circle" ? "50%" : s.type === "square" ? "4px" : "0",
                    border: s.type === "triangle" ? "none" : `1.5px solid ${strokeColor}`,
                    background: s.type === "triangle" ? "transparent" : fillColor,
                  }}
                >
                  {s.type === "triangle" && (
                    <svg className={`w-full h-full ${textColor} fill-none overflow-visible`} viewBox="0 0 100 100">
                      <polygon points="50,15 90,85 10,85" stroke="currentColor" strokeWidth="8" fill={fillColor} />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Subtle animated Telangana geometric outline in background */}
          <div className="fixed inset-0 flex items-center justify-center -z-15 pointer-events-none opacity-[0.06] select-none">
            <svg className="w-[60vw] h-[60vh] text-[#6d28d9]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <motion.polygon
                points="50,15 75,25 85,50 70,75 50,85 30,80 15,60 20,35"
                strokeDasharray="20 5"
                animate={{ strokeDashoffset: [0, -100] }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              />
              <motion.polygon
                points="45,20 65,30 75,45 60,65 48,75 35,70 25,55 30,35"
                strokeDasharray="10 15"
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              />
            </svg>
          </div>

          {/* Immersive Glassmorphic Navigation Header */}
          <AnimatePresence>
            {scrollProgress < 0.985 && (
              <motion.header
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl h-14 rounded-full glass-panel border border-slate-200/40 shadow-xl flex items-center justify-between px-6 bg-white/70 backdrop-blur-md"
              >
                {/* Left: Branding Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                  const lenis = (window as any).lenis;
                  if (lenis) lenis.scrollTo(0, { duration: 1.5 });
                }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.25em] text-slate-800 uppercase font-sans">FREEDOM STREETS</span>
                </div>

                {/* Middle: Active Section Links Directory */}
                <nav className="relative hidden md:flex items-center gap-5 text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                  {navSections.map((link) => {
                    const isActive = link.name === activeSection;
                    return (
                      <button
                        key={link.name}
                        ref={(el) => { navRefs.current[link.name] = el; }}
                        onClick={() => {
                          const lenis = (window as any).lenis;
                          if (lenis) {
                            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                            const targetScrollY = link.range[0] * maxScroll;
                            lenis.scrollTo(targetScrollY, { duration: 1.5 });
                          }
                        }}
                        className={`relative cursor-pointer transition-all duration-300 hover:text-purple-600 ${
                          isActive ? "text-purple-600 font-black text-glow-orange scale-[1.05]" : ""
                        }`}
                      >
                        <span>{link.name}</span>
                      </button>
                    );
                  })}
                  
                  {/* Single animated sliding underline */}
                  <motion.div 
                    className="absolute -bottom-1 h-0.5 bg-[#6d28d9] rounded-full shadow-[0_0_6px_rgba(109,40,217,0.5)]"
                    animate={{
                      left: underlineStyle.left,
                      width: underlineStyle.width
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 28
                    }}
                  />
                </nav>

                {/* Right: Premium Registration Button */}
                <button
                  onClick={() => {
                    const lenis = (window as any).lenis;
                    if (lenis) {
                      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                      lenis.scrollTo(maxScroll, { duration: 2 });
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-[8px] font-black tracking-widest uppercase rounded-full text-white shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  REGISTER NOW
                </button>

                {/* Micro Slim Scroll Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-slate-100/50 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-[#06b6d4]"
                    style={{
                      transformOrigin: "left",
                      scaleX: scrollProgress
                    }}
                  />
                </div>
              </motion.header>
            )}
          </AnimatePresence>

          {/* 2. Unified 3D WebGL Web Canvas */}
          <CinematicCanvas 
            scrollProgress={scrollProgress} 
            activeZoneId={activeZoneId}
            selectedDistrictIndex={selectedDistrictIndex}
            activeSportId={activeSportId}
          >
            <HyderabadHero3D scrollProgress={scrollProgress} />
            <VenueMap3D
              scrollProgress={scrollProgress}
              activeZoneId={activeZoneId}
              setActiveZoneId={setActiveZoneId}
            />
            <TelanganaMap3D
              scrollProgress={scrollProgress}
              hoveredDistrictIndex={hoveredDistrictIndex}
              setHoveredDistrictIndex={setHoveredDistrictIndex}
              selectedDistrictIndex={selectedDistrictIndex}
              setSelectedDistrictIndex={setSelectedDistrictIndex}
              hoveredSportId={hoveredSportId}
            />
            <SportsShowcase3D
              scrollProgress={scrollProgress}
              activeSportId={activeSportId}
              hoveredSportId={hoveredSportId}
              mouse={mouseRef}
            />
            <FitnessCultural3D scrollProgress={scrollProgress} />
            <CircularIslands3D
              scrollProgress={scrollProgress}
              hoveredIslandId={hoveredIslandId}
              setHoveredIslandId={setHoveredIslandId}
            />
            <InfiniteTimelineRoad3D scrollProgress={scrollProgress} />
          </CinematicCanvas>

          {/* 3. HTML Scrollytelling Panels */}
          
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1">
            <span className="text-[8px] font-bold tracking-[0.3em] text-slate-500">SCROLL DOWN TO TRAVEL</span>
            <ChevronDown size={14} className="text-[#6d28d9] animate-bounce" />
          </div>

          {/* SECTION 1: HERO SUNRISE (scroll 0.0 - 0.12) */}
          <AnimatePresence>
            {isRange(0.0, 0.11) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
              >
                <motion.div className="max-w-4xl flex flex-col items-center gap-4" variants={containerVariants}>
                  <motion.span className="text-xs md:text-sm font-semibold tracking-[0.5em] text-[#6d28d9] uppercase" variants={itemVariants}>
                    Telangana Government Initiative
                  </motion.span>
                  
                  <motion.h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tight text-[#0F172A] leading-tight uppercase" variants={itemVariants}>
                    Freedom Streets
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] via-[#db2777] to-[#06B6D4] font-sans tracking-wide text-4xl md:text-6xl mt-3 font-medium lowercase italic">
                      Telangana 2026
                    </span>
                  </motion.h1>

                  <motion.p className="text-xs md:text-sm text-slate-600 font-semibold tracking-[0.2em] max-w-lg mt-3 leading-relaxed uppercase" variants={itemVariants}>
                    Connecting Communities • Celebrating Culture • Reclaiming Public Spaces
                  </motion.p>

                  {/* Interactive Event Countdown Timer */}
                  <motion.div className="flex gap-3 mt-4 pointer-events-auto" variants={itemVariants}>
                    {[
                      { val: timeLeft.days, label: "DAYS" },
                      { val: timeLeft.hours, label: "HRS" },
                      { val: timeLeft.minutes, label: "MIN" },
                      { val: timeLeft.seconds, label: "SEC" }
                    ].map((badge) => (
                      <div key={badge.label} className="glass-panel px-3.5 py-1.5 rounded-xl flex flex-col items-center min-w-[62px] bg-white/90 border-slate-200/40 shadow-sm">
                        <span className="font-mono text-base font-bold text-slate-800 leading-none">{String(badge.val).padStart(2, "0")}</span>
                        <span className="text-[6.5px] font-bold text-[#6d28d9] tracking-wider mt-1">{badge.label}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div className="flex gap-4 mt-8 pointer-events-auto" variants={itemVariants}>
                    <button
                      onClick={() => {
                        const lenis = (window as any).lenis;
                        if (lenis) lenis.scrollTo(window.innerHeight * 2.2, { duration: 2 });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-xs font-bold tracking-widest uppercase rounded-full text-white shadow-xl transition-all cursor-pointer hover:scale-105"
                    >
                      EXPLORE JOURNEY
                    </button>
                    <button
                      onClick={() => {
                        const lenis = (window as any).lenis;
                        if (lenis) lenis.scrollTo(window.innerHeight * 17.5, { duration: 3.5 });
                      }}
                      className="px-6 py-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold tracking-widest uppercase rounded-full text-slate-800 transition-all cursor-pointer hover:scale-105"
                    >
                      WATCH VISION
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 2: THE ROAD OPENS (scroll 0.12 - 0.18) */}
          <AnimatePresence>
            {isRange(0.12, 0.17) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                {/* Left Side: Main Text Card */}
                <motion.div 
                  className="max-w-md glass-panel p-8 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden pointer-events-auto bg-white/95"
                  variants={itemVariants}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#6d28d9]" />
                  <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 02</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    The Road Opens
                  </h2>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                    Traffic fades away. The asphalt transforms into a lively canvas of health and energy. 
                    Barriers lift, welcoming thousands of walkers, joggers, yogis, and musicians to take 
                    over the streets of Hyderabad.
                  </p>
                </motion.div>

                {/* Right Side: Animated Street Schematic blueprint */}
                <motion.div 
                  className="max-w-md w-full bg-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden pointer-events-auto flex flex-col gap-4 font-mono text-[9px] text-[#06b6d4] mr-4"
                  variants={itemVariants}
                >
                  {/* Blueprint grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold tracking-widest text-pink-500 animate-pulse">
                      ● LIVE TRANSMISSION
                    </span>
                    <span className="text-slate-500">SCHEMATIC ID: FS-02</span>
                  </div>

                  <div className="relative h-32 bg-slate-900/60 rounded-xl border border-slate-800/60 overflow-hidden flex flex-col justify-between p-3">
                    {/* Cybernetic HUD layout */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[10px]">HYDERABAD CENTRAL LOOP</span>
                        <span className="text-[8px] text-slate-500">DALLAS ROAD SEGMENT A</span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded text-[7px] animate-pulse">
                        ACTIVE RUNWAY ZONES
                      </span>
                    </div>

                    {/* Animated Street Track SVG */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex items-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 30">
                        {/* Asphalt road outline */}
                        <line x1="0" y1="15" x2="300" y2="15" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                        {/* Reclaimed green sports lane */}
                        <line x1="0" y1="15" x2="300" y2="15" stroke="#10b981" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                        {/* Dash active path */}
                        <motion.line
                          x1="0" y1="15"
                          x2="300" y2="15"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="8 8"
                          animate={{ strokeDashoffset: [-100, 0] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[8px] text-slate-400">
                      <span>RUNNING & CYCLING PATHS</span>
                      <span>SPEED LIMIT: 0 KM/H</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl flex flex-col">
                      <span className="text-slate-500 uppercase tracking-wider text-[7px]">HEALTH HUB RECLAIMED</span>
                      <span className="text-sm font-bold text-white mt-0.5">75,000+ Sq.m</span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl flex flex-col">
                      <span className="text-slate-500 uppercase tracking-wider text-[7px]">COMMUNITY IMPACT</span>
                      <span className="text-sm font-bold text-emerald-400 mt-0.5">PUBLIC HEALTH</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 3: TRANSCENDENT VISION (scroll 0.18 - 0.23) */}
          <AnimatePresence>
            {isRange(0.18, 0.23) && (
              <VisionPanel scrollProgress={scrollProgress} />
            )}
          </AnimatePresence>

          {/* SECTION 4: PHILOSOPHY (scroll 0.24 - 0.30) */}
          <AnimatePresence>
            {isRange(0.24, 0.29) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <MockVideoPlayer 
                      imagePath="/images/gallery-3.jpg" 
                      title="Philosophy & Open Spaces" 
                      duration="2:15 Mins" 
                    />
                  </motion.div>
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 04</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Philosophy of Freedom Streets
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Freedom Streets Telangana is built on a transformative public wellness philosophy. 
                      By opening streets to people, we reclaim urban design to serve longevity, human connection, 
                      and mental relief. It is not just an event; it is a structural intervention to fight sedentary lifestyles.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 5: VISION & MISSION (scroll 0.30 - 0.36) */}
          <AnimatePresence>
            {isRange(0.30, 0.35) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <FloatingSportsBackground />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 05</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Our Vision & Mission
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium mb-4">
                      Our mission is to establish sustainable public health grids that bring community members together. We focus on:
                    </p>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Building preventative health habits</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Lowering cardiovascular disease risks</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Fostering community arts and organic local trades</li>
                    </ul>
                  </motion.div>
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <MockVideoPlayer 
                      imagePath="/images/gallery-4.jpg" 
                      title="Mission Focus & Longevity" 
                      duration="1:45 Mins" 
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 6: WHY FREEDOM STREETS (scroll 0.36 - 0.42) */}
          <AnimatePresence>
            {isRange(0.36, 0.41) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <FloatingSportsBackground />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <WhyFreedomStreetsVisual />
                  </motion.div>
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 06</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Why Freedom Streets?
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Mass public wellness setups act as massive ROI accelerators for municipal health budgets. 
                      Every rupee spent on Freedom Streets reduces public healthcare load by providing direct access 
                      to screening, community exercises, and wellness workshops in a festive, accessible layout.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 7: PROGRAM OVERVIEW (scroll 0.42 - 0.47) */}
          <AnimatePresence>
            {isRange(0.42, 0.46) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 07</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Program Overview
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      The core program is executed over **41 Sunday sessions**, focusing on regional community 
                      coordination. Streets are closed to standard vehicles from **6:00 AM to 9:00 AM**, creating a safe 
                      sanctuary for fitness, arts, organic food stalls, and inclusive programs.
                    </p>
                  </motion.div>
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <SundayProgramVisual />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 8: PROGRAM STRUCTURE (scroll 0.47 - 0.52) */}
          <AnimatePresence>
            {isRange(0.47, 0.51) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <MockVideoPlayer 
                      imagePath="/images/gallery-5.jpg" 
                      title="Structural Calendar Coordination" 
                      duration="Sunday Morning Slots" 
                    />
                  </motion.div>
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 08</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Program Structure
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      The weekly itinerary includes dedicated sports tracks, mass Yoga arenas, Zumba spots, 
                      traditional folk dance arenas, and medical diagnostic booths. Monsoons breaks are scheduled 
                      to maintain high safety standards while resuming dynamically.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 9: PHASE HIGHLIGHTS (scroll 0.52 - 0.58) */}
          <AnimatePresence>
            {isRange(0.52, 0.57) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <FloatingSportsBackground />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 09</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Phase Highlights
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium mb-4">
                      Our execution is split into three phases to scale operations from capital districts 
                      to rural community centers safely.
                    </p>
                    <PhaseHighlightsVisual scrollProgress={scrollProgress} />
                  </motion.div>
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <MockVideoPlayer 
                      imagePath="/images/gallery-6.jpg" 
                      title="Phase Scale Timeline" 
                      duration="Roadmap View" 
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 10: TELANGANA DISTRICT HOVER MAP HUD (scroll 0.58 - 0.65) */}
          <AnimatePresence>
            {isRange(0.58, 0.64) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                {/* Left Column: District Interactive Directory */}
                <motion.div 
                  className="max-w-sm w-full glass-panel p-6 rounded-3xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-4 bg-white/95"
                  variants={itemVariants}
                >
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-[#06b6d4] block mb-1 uppercase font-mono">DISTRICT HUB DIRECTORY</span>
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Select Venue</h3>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                    {[
                      { index: 0, name: "Hyderabad", participants: "1.2 Lakhs" },
                      { index: 1, name: "Warangal", participants: "65,000" },
                      { index: 2, name: "Nizamabad", participants: "55,000" },
                      { index: 3, name: "Karimnagar", participants: "40,000" },
                      { index: 4, name: "Khammam", participants: "35,000" },
                      { index: 5, name: "Mahabubnagar", participants: "30,000" },
                      { index: 6, name: "Nalgonda", participants: "25,000" }
                    ].map((dist) => (
                      <button
                        key={dist.name}
                        onClick={() => {
                          setSelectedDistrictIndex(dist.index);
                        }}
                        onMouseEnter={() => {
                          setHoveredDistrictIndex(dist.index);
                        }}
                        onMouseLeave={() => {
                          setHoveredDistrictIndex(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all duration-300 flex justify-between items-center cursor-pointer ${
                          selectedDistrictIndex === dist.index || hoveredDistrictIndex === dist.index
                            ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-900 shadow-md scale-[1.01]"
                            : "bg-slate-100/50 border-slate-200/50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{dist.name}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-500">{dist.participants} Reach</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Right Column: District Details Card */}
                <motion.div 
                  className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-4 max-w-sm w-full relative overflow-hidden bg-white/95"
                  variants={itemVariants}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                  
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-1 uppercase">DISTRICT PROGRAMMING</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A]">
                      Telangana Map
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                      Scaling the campaign to 33 districts reaches metropolitan and rural hubs. Hover nodes or select below to explore.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeDistrict ? (
                      <motion.div
                        key={activeDistrict.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-4 border-t border-slate-200/50 pt-4"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#6d28d9]" />
                          <h3 className="text-lg font-bold text-[#0F172A]">{activeDistrict.name}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex flex-col bg-slate-100 p-2.5 rounded-lg border border-slate-200/50">
                            <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">SUNDAY EVENTS</span>
                            <span className="text-sm font-bold text-[#6d28d9] font-mono mt-1 flex items-center gap-1.5">
                              <Calendar size={12} />
                              {activeDistrict.events} Days
                            </span>
                          </div>
                          <div className="flex flex-col bg-slate-100 p-2.5 rounded-lg border border-slate-200/50">
                            <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">PARTICIPANTS</span>
                            <span className="text-sm font-bold text-sky-600 font-mono mt-1">
                              {activeDistrict.participants}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 text-xs">
                          <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">SCHEDULED ACTIVITIES</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {activeDistrict.activities.map((act) => (
                              <span key={act} className="px-2 py-0.5 bg-purple-50 border border-purple-200/60 rounded-full text-[9px] text-[#6d28d9] font-semibold">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedDistrictIndex(null);
                          }}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-[9px] font-bold tracking-widest uppercase rounded-lg text-slate-500 w-full mt-2 cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center border-t border-dashed border-slate-200/50 pt-8 text-center text-slate-500 text-xs"
                      >
                        <Eye size={28} className="text-slate-400 animate-pulse mb-3" />
                        <span>HOVER DISTRICT PIN ON 3D MAP</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>



          {/* SECTION 11: VENUE DAY LAYOUT - DALLAS ROAD (scroll 0.65 - 0.67) */}
          <AnimatePresence>
            {isRange(0.65, 0.67) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-y-0 right-12 z-30 flex items-center justify-end pointer-events-none w-full max-w-sm ml-auto"
              >
                <motion.div 
                  className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-4 w-full relative overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                  <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block uppercase font-mono">EVENT DAY SETUP</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A]">
                    Dallas Road Map
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Click any glowing cone pin on the 3D venue layout to zoom the camera closer and view the specific zone schedule.
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {activeZone ? (
                      <motion.div
                        key={activeZone.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="flex flex-col gap-3.5 border-t border-slate-200/50 pt-4 text-xs"
                      >
                        <div>
                          <span className="text-[8px] font-bold tracking-wider text-slate-500 block uppercase">ZONE FOCUS</span>
                          <h3 className="text-base font-bold text-[#0F172A] mt-0.5">{activeZone.name}</h3>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">{activeZone.desc}</p>
                        
                        <div className="flex flex-col gap-1 text-[10px]">
                          <span className="text-slate-500 font-bold tracking-wider uppercase text-[8px]">ACTIVITIES RUNNING</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {activeZone.activities.map(act => (
                              <span key={act} className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-[#6d28d9] font-bold font-mono">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveZoneId(null)}
                          className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-[9px] font-bold tracking-widest uppercase rounded-lg text-slate-700 w-full mt-2 pointer-events-auto"
                        >
                          RESET VIEW ORBIT
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col gap-2 mt-2 max-h-[180px] overflow-y-auto pr-1 select-none">
                        {venueZonesData.map((zone) => (
                          <div 
                            key={zone.id}
                            onClick={() => setActiveZoneId(zone.id)}
                            className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200/50 cursor-pointer text-xs group"
                          >
                            <span className="text-slate-800 font-bold group-hover:text-purple-600 transition-colors">{zone.name}</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isRange(0.65, 0.67) && !activeZoneId && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-y-0 left-12 z-30 pt-28 flex items-center pointer-events-none w-full max-w-sm"
              >
                <motion.div 
                  className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-4 relative overflow-hidden"
                  variants={itemVariants}
                >
                  <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block uppercase font-mono">STREET SCHEMATIC</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A]">
                    3D Event Day Map
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    This interactive 3D layout showcases the zoning structure of the main venue at Dallas Road. 
                    Attendees transition smoothly through Main Stage fitness, side sports tracks, kids activity zones, and organic food nodes.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 12: GOVERNMENT PARTNERSHIP (scroll 0.73 - 0.76) */}
          <AnimatePresence>
            {isRange(0.73, 0.76) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 12</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Government Partnership
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium mb-4">
                      Administered by a **Joint Working Group (JWG)** including the Metropolitan Police, GHMC, 
                      Health Department, and District Admins. This structure guarantees high safety parameters, 
                      clean route organization, and smooth administrative backing.
                    </p>
                    <div className="flex gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-[#6d28d9]" /> GHMC Cleanliness</div>
                      <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-[#6d28d9]" /> Police Safety</div>
                    </div>
                  </motion.div>
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <GovPartnershipVisual />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 13: SUCCESS METRICS (scroll 0.77 - 0.79) */}
          <AnimatePresence>
            {isRange(0.77, 0.79) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <SuccessMetricsVisual />
                  </motion.div>
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 13</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Success Metrics
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Project accountability is measured against concrete health metrics: community wellness surveys, 
                      total fitness sessions, cardiovascular index data, and direct local economic sales across food 
                      and trade stalls.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 14: LONG-TERM VISION (scroll 0.80 - 0.82) */}
          <AnimatePresence>
            {isRange(0.80, 0.82) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  <motion.div className="max-w-xl pointer-events-auto" variants={itemVariants}>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-2 uppercase">SECTION 14</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Long-term Vision
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Our roadmap targets a nationwide blueprint. By building unified municipal grids for weekly 
                      sports implementation across all 33 districts, Telangana will serve as the premier state-scale model 
                      for citizen physical wellness.
                    </p>
                  </motion.div>
                  <motion.div className="pointer-events-auto flex justify-center" variants={itemVariants}>
                    <LongTermExpansionVisual />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==============================================================
              SECTION 15: SPORTS ARENA & DISTRICT INTEGRATION (scroll 0.68 - 0.70)
              ============================================================== */}
          <AnimatePresence>
            {isRange(0.68, 0.70) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-16 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-stretch h-[80vh] max-h-[600px]">
                  {/* LEFT COLUMN: Map Info Details or Selected District Details */}
                  <motion.div className="flex flex-col justify-center pointer-events-auto h-full" variants={itemVariants}>
                    <AnimatePresence mode="wait">
                      {selectedDistrictIndex !== null ? (
                        <motion.div
                          key="district-details"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="glass-panel p-8 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full max-w-md w-full bg-white/95"
                        >
                          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                          
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] uppercase font-mono">SELECTED DISTRICT</span>
                              <button 
                                onClick={() => setSelectedDistrictIndex(null)}
                                className="px-2.5 py-0.5 border border-slate-300 rounded text-[9px] hover:bg-slate-100 text-slate-700 font-bold"
                              >
                                CLOSE
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin size={20} className="text-[#6d28d9]" />
                              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                                {districtsData[selectedDistrictIndex].name}
                              </h2>
                            </div>

                            <p className="text-xs text-slate-600 mt-3 leading-relaxed font-medium">
                              This district is a major sports program hub for Freedom Streets. Hover pins are active, and connection roads show coordination paths to the Hyderabad capital hub.
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 my-4">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">SUNDAY EVENTS</span>
                                <span className="text-sm font-bold text-[#6d28d9] font-mono mt-1">
                                  {districtsData[selectedDistrictIndex].events} Sundays
                                </span>
                              </div>
                              <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">REACH ESTIMATE</span>
                                <span className="text-sm font-bold text-sky-600 font-mono mt-1">
                                  {districtsData[selectedDistrictIndex].participants}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 text-xs">
                              <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">LOCAL ACTIVITIES</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {districtsData[selectedDistrictIndex].activities.map((act) => (
                                  <span key={act} className="px-2.5 py-0.5 bg-purple-50 border border-purple-200 rounded-full text-[9px] text-[#6d28d9] font-semibold uppercase tracking-wide">
                                    {act}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              const lenis = (window as any).lenis;
                              if (lenis) lenis.scrollTo(window.innerHeight * 17.5, { duration: 3 });
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-[10px] font-bold tracking-widest uppercase rounded-xl text-white shadow-xl hover:scale-105 transition-all text-center"
                          >
                            VIEW DISTRICT SCHEDULE
                          </button>
                        </motion.div>
                      ) : hoveredDistrictIndex !== null ? (
                        <motion.div
                          key="district-hover"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="glass-panel p-8 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full max-w-md w-full bg-white/95"
                        >
                          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                          
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-1 uppercase font-mono">HOVER ACTIVE</span>
                            <div className="flex items-center gap-2">
                              <MapPin size={18} className="text-[#6d28d9]" />
                              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                                {districtsData[hoveredDistrictIndex].name}
                              </h2>
                            </div>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                              Hover to preview. Click this district cell on the 3D map to zoom in, view local venue connection networks, and schedule lists.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs my-4">
                            <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                              <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">SUNDAY EVENTS</span>
                              <span className="text-sm font-bold text-[#6d28d9] font-mono mt-1">
                                {districtsData[hoveredDistrictIndex].events} Sundays
                              </span>
                            </div>
                            <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                              <span className="text-slate-500 font-semibold tracking-wider text-[8px] uppercase">REACH TARGET</span>
                              <span className="text-sm font-bold text-sky-600 font-mono mt-1">
                                {districtsData[hoveredDistrictIndex].participants}
                              </span>
                            </div>
                          </div>

                          <span className="text-[9px] font-bold text-[#6d28d9] tracking-[0.25em] block uppercase animate-pulse">
                            CLICK TO FOCUS MAP
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default-map"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass-panel p-8 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full max-w-md w-full bg-white/95"
                        >
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-1 uppercase font-mono">STATEWIDE REACH</span>
                            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">
                              District Networks
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              Freedom Streets scales to 33 districts. Hover on any district block to preview events, or select one to zoom in and render local sport tracks.
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 my-4">
                            <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200/30 pb-2 font-medium">
                              <span>Active Districts</span>
                              <span className="text-slate-900 font-bold font-mono">33 Nodes</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200/30 pb-2 font-medium">
                              <span>Weekly Sessions</span>
                              <span className="text-slate-900 font-bold font-mono">41 Sundays</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                              <span>Total State Reach</span>
                              <span className="text-slate-900 font-bold font-mono">4 Crore+</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[9px] text-[#6d28d9] bg-purple-50 p-2.5 rounded-xl border border-purple-200/60 font-semibold">
                            <Eye size={12} className="text-[#6d28d9] animate-pulse" />
                            <span>Interactive 3D Telangana Map is loaded on the left.</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
 
                  {/* RIGHT COLUMN: Sports Cards */}
                  <motion.div 
                    className="flex flex-col justify-center gap-4 pointer-events-auto h-full max-w-md w-full ml-auto"
                    variants={itemVariants}
                  >
                    <div className="mb-2">
                      <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block uppercase font-mono">SPORTS CAROUSEL</span>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
                        3D Sports Showcase
                      </h2>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        Hover over a sport to rotate the 3D model, highlight participating districts on the map, and draw event arcs.
                      </p>
                    </div>
 
                    {[
                      { id: "running", name: "Running Track", desc: "Sprints, hurdles, and community races.", stat: "5 Districts • 20+ events" },
                      { id: "cycling", name: "Cycling Lane", desc: "Long-distance rallies and safety trails.", stat: "5 Districts • 15+ events" },
                      { id: "basketball", name: "Basketball Court", desc: "Court play and youth tournaments.", stat: "5 Districts • 12+ events" },
                      { id: "skating", name: "Skating Arena", desc: "Skateboard halfpipe and obstacle challenges.", stat: "4 Districts • 8+ events" },
                      { id: "kabaddi", name: "Kabaddi Ground", desc: "Traditional clay court matches.", stat: "5 Districts • 10+ events" }
                    ].map((sport) => {
                      const isHovered = hoveredSportId === sport.id;
                      const isActive = activeSportId === sport.id;
                      return (
                        <motion.div
                          key={sport.id}
                          onMouseEnter={() => {
                            setHoveredSportId(sport.id);
                            setActiveSportId(sport.id);
                          }}
                          onMouseLeave={() => {
                            setHoveredSportId(null);
                            setActiveSportId(null);
                          }}
                          onClick={() => {
                            setActiveSportId(sport.id);
                          }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                            isActive || isHovered 
                              ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-lg shadow-purple-500/5" 
                              : "bg-slate-100/50 border-slate-200/60 hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <h4 className={`text-sm font-bold uppercase tracking-wide ${isActive || isHovered ? "text-purple-900" : "text-slate-800"}`}>{sport.name}</h4>
                            <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{sport.desc}</p>
                          </div>
                          <span className="text-[9px] font-bold text-purple-600 font-mono bg-purple-500/5 px-2.5 py-1 rounded border border-purple-500/10">
                            {sport.stat}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 16: FITNESS EXPERIENCE (scroll 0.83 - 0.85) */}
          <AnimatePresence>
            {isRange(0.83, 0.85) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex items-center justify-between px-6 md:px-24 pointer-events-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                  {/* Left Column: Fitness Matrix Hub */}
                  <motion.div
                    className="max-w-md w-full bg-white/95 border border-slate-200/50 p-6 rounded-3xl shadow-2xl relative overflow-hidden pointer-events-auto flex flex-col gap-4"
                    variants={itemVariants}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono font-black text-emerald-600 tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                        ZUMBA MATRIX LIVE
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 font-mono flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        88% COMPLETE
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                          <motion.circle
                            cx="50" cy="50" r="40"
                            stroke="#10b981"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="251"
                            initial={{ strokeDashoffset: 251 }}
                            animate={{ strokeDashoffset: 251 - (251 * 0.88) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="text-sm font-black text-slate-800 font-mono">88%</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Metabolic Efficiency</span>
                        <span className="text-[10px] text-slate-500 font-medium">Synchronized community aerobic exercise zones.</span>
                      </div>
                    </div>

                    {/* Vitals logs */}
                    <div className="flex flex-col gap-2 mt-2">
                      {[
                        { activity: "Zumba Burnout", rate: "650 kcal", trend: "+12%" },
                        { activity: "Vinyasa Flow Yoga", rate: "320 kcal", trend: "+4%" },
                        { activity: "Sunrise Aerobics", rate: "480 kcal", trend: "+9%" }
                      ].map((act, index) => (
                        <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200/40 p-2.5 rounded-xl text-xs">
                          <span className="text-slate-800 font-bold">{act.activity}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-700 font-bold">{act.rate}</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{act.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right Column: Fitness & Wellness Intro Text */}
                  <motion.div 
                    className="max-w-xl glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto relative overflow-hidden"
                    variants={itemVariants}
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    <span className="text-[9px] font-bold tracking-widest text-emerald-600 block mb-2 uppercase">SECTION 16</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                      Fitness & Wellness
                    </h2>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Feel the rhythm of Zumba, Dance Fitness, Aerobics, and collective Yoga. 
                      The wave particles animate in a breathing pattern, guiding attendees 
                      into synchronized community exercise and wellness.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 17: CULTURAL EXPERIENCE (scroll 0.89 - 0.92) */}
          <AnimatePresence>
            {isRange(0.89, 0.92) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 pt-28 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
              >
                <motion.div className="max-w-2xl flex flex-col items-center gap-4" variants={itemVariants}>
                  <span className="text-xs font-bold tracking-[0.4em] text-[#6d28d9] uppercase animate-pulse">
                    Evening Festival Transition
                  </span>
                  
                  <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-wide text-slate-900 uppercase">
                    Celebrating Culture
                  </h2>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-md font-medium">
                    Traditional Telangana dances, drums, street artists, and moving flags ignite. 
                    Confetti cascades as the sky transitions into warm evening colors.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 18: HEALTH & wellness (scroll 0.965 - 0.979) */}
          <HealthWellnessSection 
            scrollProgress={scrollProgress} 
            isRange={isRange} 
            containerVariants={containerVariants} 
            itemVariants={itemVariants} 
          />

          {/* SECTION 19: WHO CAN PARTICIPATE (scroll 0.93 - 0.95) */}
          <AnimatePresence>
            {isRange(0.93, 0.95) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-y-0 left-12 z-35 pt-28 flex items-center pointer-events-none w-full max-w-sm"
              >
                <motion.div 
                  className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-6 w-full relative overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                  
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block mb-1 uppercase">PARTICIPANT SEGMENTS</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A]">
                      Who We Serve
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                      Freedom Streets welcomes all. Hover over any floating 3D circular island to discover customized group programming.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeIsland ? (
                      <motion.div
                        key={activeIsland.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col gap-4 border-t border-slate-200/50 pt-4"
                      >
                        <h3 className="text-lg font-bold text-[#0F172A]">{activeIsland.title}</h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{activeIsland.desc}</p>
                        
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200/60 font-semibold">
                          <span className="text-[8px] font-bold tracking-wider text-slate-500 block uppercase">COMMUNITY IMPACT</span>
                          <span className="text-[10px] font-bold text-purple-700 block mt-1 leading-snug">
                            {activeIsland.impact}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center border-t border-dashed border-slate-200/50 pt-8 text-center text-slate-500 text-xs"
                      >
                        <Eye size={28} className="text-slate-400 animate-pulse mb-3" />
                        <span>HOVER FLOATING ISLANDS IN 3D</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 20: EVENT TIMELINE (scroll 0.96 - 0.985) */}
          <AnimatePresence>
            {isRange(0.96, 0.985) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-y-0 right-12 z-30 pt-28 flex items-center justify-end pointer-events-none w-full max-w-sm ml-auto"
              >
                <motion.div 
                  className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-2xl pointer-events-auto flex flex-col gap-4 w-full relative overflow-hidden bg-white/95"
                  variants={itemVariants}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                  <span className="text-[9px] font-bold tracking-widest text-[#6d28d9] block uppercase font-mono">TIMELINE HIGHLIGHTS</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A]">
                    Event Itinerary
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Scroll down the 3D timeline highway to explore the Sunday morning schedule.
                  </p>
                  
                  <div className="relative pl-6 mt-2 flex flex-col gap-5">
                    {/* Vertical timeline progress track */}
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-0.5 bg-slate-200">
                      <motion.div
                        className="w-full bg-gradient-to-b from-[#6d28d9] to-[#db2777] origin-top h-full"
                        style={{
                          transformOrigin: "top",
                          scaleY: Math.min(1.0, Math.max(0.0, (scrollProgress - 0.96) / 0.025))
                        }}
                      />
                    </div>

                    {[
                      { time: "6:00 AM", title: "Yoga & Meditation", desc: "Mental centering, breathing & sunrise focus.", icon: <Sun size={14} className="text-[#6d28d9]" />, range: [0.96, 0.968] },
                      { time: "7:00 AM", title: "Zumba & Dance", desc: "High-energy fitness moves and beats.", icon: <Music size={14} className="text-[#db2777]" />, range: [0.968, 0.976] },
                      { time: "7:45 AM", title: "Health Talk & Screenings", desc: "Inspirational talks and diagnostic checks.", icon: <Heart size={14} className="text-red-500" />, range: [0.976, 0.985] }
                    ].map((item, index) => {
                      const isActive = scrollProgress >= item.range[0] && scrollProgress <= item.range[1];
                      return (
                        <div key={index} className="relative flex gap-3">
                          {/* Timeline node */}
                          <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                            isActive 
                              ? "bg-[#6d28d9] border-purple-200 scale-125 shadow-[0_0_8px_rgba(109,40,217,0.5)]" 
                              : "bg-white border-slate-200"
                          }`} />

                          {/* Glassmorphic Time Card */}
                          <motion.div 
                            className={`glass-panel p-3.5 rounded-xl border transition-all duration-300 w-full flex flex-col gap-1 ${
                              isActive 
                                ? "bg-white border-[#6d28d9]/30 shadow-lg scale-[1.01]" 
                               : "bg-white/40 border-slate-200/40 opacity-50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded ${
                                isActive ? "bg-purple-100 text-[#6d28d9]" : "bg-slate-100 text-slate-500"
                              }`}>
                                {item.time}
                              </span>
                              <div className={`p-1 rounded-full ${isActive ? "bg-purple-50" : "bg-slate-50"}`}>
                                {item.icon}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs">{item.title}</h4>
                              <p className="text-[10px] text-slate-600 leading-relaxed font-medium mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <DashboardStats scrollProgress={scrollProgress} />
          <Gallery3D scrollProgress={scrollProgress} />
          <PartnersOrbit scrollProgress={scrollProgress} />

          {/* SECTION 24: FINAL SUNSET OUTRO (scroll 0.986 - 1.0) */}
          <AnimatePresence>
            {scrollProgress >= 0.986 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 flex flex-col items-center justify-start md:justify-center text-center px-4 bg-white/90 backdrop-blur-md pt-28 pb-12 overflow-y-auto pointer-events-auto"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 35 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="max-w-3xl flex flex-col items-center gap-6"
                >
                  <img src="/freedom_streets_logo.png" alt="Logo" className="w-20 h-20 object-contain filter drop-shadow-[0_0_8px_rgba(109,40,217,0.2)]" />
                  
                  <span className="text-[10px] font-bold tracking-[0.6em] text-[#6d28d9] uppercase font-mono block animate-pulse">
                    Together We Build A Healthier Telangana
                  </span>
                  
                  <h2 className="font-serif text-4xl md:text-7xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                    Ready to Join <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-[#06b6d4]">Freedom Streets?</span>
                  </h2>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
                    Partner with us. Sponsor communities. Volunteer. Let us transform our state's wellness 
                    one Sunday, one street, one neighborhood at a time.
                  </p>

                  {/* Medal Tally & Participation Ticker */}
                  <div className="grid grid-cols-3 gap-6 max-w-lg w-full bg-slate-50/80 p-4 rounded-2xl border border-slate-200/50 shadow-sm mt-2 pointer-events-auto">
                    {[
                      { label: "Expected Reach", val: "2,00,000+" },
                      { label: "Active Districts", val: "33 / 33" },
                      { label: "Scheduled Hubs", val: "15+ Venues" }
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-lg font-bold text-slate-800 font-mono">{stat.val}</span>
                        <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6 pointer-events-auto">
                    <a
                      href="mailto:info@freedomstreets.in"
                      className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-xs font-bold tracking-widest uppercase rounded-full text-white shadow-xl hover:scale-105 transition-transform"
                    >
                      REGISTER AS VOLUNTEER
                    </a>
                    <button
                      onClick={() => {
                        alert("Sponsorship packet requested! We will reach out to you via email.");
                      }}
                      className="px-8 py-3.5 border border-slate-300 hover:bg-slate-50 text-xs font-bold tracking-widest uppercase rounded-full text-slate-700 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                    >
                      BECOME A SPONSOR
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 items-center mt-8 border-t border-slate-200/50 pt-6 w-full">
                    <span className="text-[8px] text-slate-400 tracking-[0.2em] font-bold">STATE COORDINATION COMMITTEE</span>
                    <span className="text-[9px] text-slate-600 leading-snug font-medium">info@freedomstreets.in • 90300 80080</span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-semibold">Freedom Streets Telangana © 2026</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating District Tooltip */}
          {hoveredDistrictIndex !== null && selectedDistrictIndex === null && (
            <div 
              ref={tooltipRef}
              style={{
                position: "fixed",
                left: "-9999px",
                top: "-9999px",
                pointerEvents: "none",
                zIndex: 100,
              }}
              className="glass-panel p-4 rounded-xl border border-white/40 shadow-xl flex flex-col gap-2 w-52 pointer-events-none transition-all duration-75"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <MapPin size={12} className="text-[#6d28d9]" />
                <span>{districtsData[hoveredDistrictIndex].name}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>Events Conducted</span>
                <span className="font-bold text-[#6d28d9]">{districtsData[hoveredDistrictIndex].events} Sundays</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>Participants</span>
                <span className="font-bold text-sky-600">{districtsData[hoveredDistrictIndex].participants}</span>
              </div>
              <div className="flex flex-col gap-1 mt-1 text-[9px]">
                <span className="text-slate-400 font-bold uppercase text-[7px]">ACTIVITIES</span>
                <div className="flex flex-wrap gap-1">
                  {districtsData[hoveredDistrictIndex].activities.slice(0, 3).map((act) => (
                    <span key={act} className="px-1.5 py-0.5 bg-purple-50 border border-purple-100 rounded text-[#6d28d9] font-bold">
                      {act}
                    </span>
                  ))}
                  {districtsData[hoveredDistrictIndex].activities.length > 3 && (
                    <span className="px-1 py-0.5 text-slate-400 font-bold">
                      +{districtsData[hoveredDistrictIndex].activities.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1 bg-purple-600 text-white text-[8px] font-bold tracking-wider uppercase text-center py-1 rounded">
                Click to Explore
              </div>
            </div>
          )}

          {/* Render Custom Cursor Ring Overlay */}
          <CustomCursor 
            hovered={
              hoveredDistrictIndex !== null || 
              hoveredSportId !== null || 
              hoveredIslandId !== null || 
              activeZoneId !== null ||
              selectedDistrictIndex !== null
            } 
          />
        </>
      )}
    </main>
  );
}
