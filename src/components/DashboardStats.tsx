"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Activity, Users, ShieldAlert } from "lucide-react";

interface DashboardStatsProps {
  scrollProgress: number;
}

export default function DashboardStats({ scrollProgress }: DashboardStatsProps) {
  // Statistics active in stats section
  const isActive = scrollProgress >= 0.985 && scrollProgress <= 0.996;

  // Counter values
  const [roi, setRoi] = useState(0);
  const [citizens, setCitizens] = useState(0);
  const [sundays, setSundays] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    if (!isActive) {
      // reset counters when inactive
      setRoi(0);
      setCitizens(0);
      setSundays(0);
      setSavings(0);
      return;
    }

    // Trigger increments
    const duration = 1500;
    const intervals = 50;
    const step = duration / intervals;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      const ratio = count / intervals;
      
      // Interpolate with ease-out
      const ease = 1 - Math.pow(1 - ratio, 3);
      
      setRoi(parseFloat((ease * 6.50).toFixed(2)));
      setCitizens(Math.floor(ease * 40));
      setSundays(Math.floor(ease * 41));
      setSavings(Math.floor(ease * 50));

      if (count >= intervals) {
        clearInterval(timer);
      }
    }, step);

    return () => clearInterval(timer);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-[#6d28d9] uppercase">
            Initiative Accountability
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-1 text-[#0F172A]">
            Preventative Impact & ROI Dashboard
          </h2>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-auto">
          
          {/* ROI Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-slate-200/50 glow-shadow-orange"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">HEALTHCARE ROI</span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-[#6d28d9]">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="my-4">
              <h3 className="text-4xl md:text-5xl font-bold font-mono text-[#0F172A]">
                ₹{roi.toFixed(2)}
              </h3>
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                Saved in medical costs for every ₹1.00 invested
              </p>
            </div>
            <div className="w-full bg-slate-200/60 h-[3px] rounded-full overflow-hidden">
              <motion.div className="bg-[#6d28d9] h-full w-[80%]" initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1 }} />
            </div>
          </motion.div>

          {/* Citizen Reach Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-slate-200/50"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">CITIZEN ENGAGEMENT</span>
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-600">
                <Users size={16} />
              </div>
            </div>
            <div className="my-4">
              <h3 className="text-4xl md:text-5xl font-bold font-mono text-[#0F172A]">
                {citizens}M+
              </h3>
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                Citizens targeted across 33 expansion districts
              </p>
            </div>
            <div className="w-full bg-slate-200/60 h-[3px] rounded-full overflow-hidden">
              <motion.div className="bg-sky-500 h-full w-[90%]" initial={{ width: 0 }} animate={{ width: "90%" }} transition={{ duration: 1 }} />
            </div>
          </motion.div>

          {/* Sunday Sessions Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-slate-200/50"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">ANNUAL SESSIONS</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                <Activity size={16} />
              </div>
            </div>
            <div className="my-4">
              <h3 className="text-4xl md:text-5xl font-bold font-mono text-[#0F172A]">
                {sundays}
              </h3>
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                Sundays of uninterrupted active street programming
              </p>
            </div>
            <div className="w-full bg-slate-200/60 h-[3px] rounded-full overflow-hidden">
              <motion.div className="bg-emerald-500 h-full w-[70%]" initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1 }} />
            </div>
          </motion.div>

          {/* Long-term savings Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-slate-200/50 glow-shadow-gold"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">PUBLIC SAVINGS</span>
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                <ShieldAlert size={16} />
              </div>
            </div>
            <div className="my-4">
              <h3 className="text-4xl md:text-5xl font-bold font-mono text-[#0F172A]">
                ₹{savings}Cr
              </h3>
              <p className="text-[10px] text-slate-600 font-medium mt-1">
                Projected annual savings in public health budget
              </p>
            </div>
            <div className="w-full bg-slate-200/60 h-[3px] rounded-full overflow-hidden">
              <motion.div className="bg-yellow-500 h-full w-[85%]" initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1 }} />
            </div>
          </motion.div>

        </div>

        {/* Live SVG Graph Dashboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl border border-slate-200/50 pointer-events-auto flex flex-col gap-4"
        >
          <div className="flex justify-between items-center border-b border-slate-200/50 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6d28d9] animate-ping" />
              <span className="text-xs font-bold text-[#0F172A] tracking-wider">LIVE BUDGET IMPACT MODELLING</span>
            </div>
            <span className="text-[10px] font-semibold text-[#6d28d9] tracking-widest uppercase">PREVENTATIVE SYSTEM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Live SVG Chart */}
            <div className="col-span-2 h-44 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(15,23,42,0.06)" strokeDasharray="5 5" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(15,23,42,0.06)" strokeDasharray="5 5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(15,23,42,0.06)" strokeDasharray="5 5" />
                
                {/* Graph Path */}
                <motion.path
                  d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 45 C 350 10, 400 30, 500 15"
                  fill="none"
                  stroke="#6D28D9"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Area Fill */}
                <motion.path
                  d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 45 C 350 10, 400 30, 500 15 L 500 150 L 0 150 Z"
                  fill="url(#chart-fill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </svg>
            </div>

            {/* Core facts lists */}
            <div className="flex flex-col gap-3 text-xs md:text-sm">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="text-slate-600">Mental Wellness Impact</span>
                <span className="font-semibold text-emerald-600 font-mono">+18% Gain</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="text-slate-600">Public Health Metric Gain</span>
                <span className="font-semibold text-emerald-600 font-mono">+12% Gain</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-600">Phase 1 Operational Cost</span>
                <span className="font-semibold text-[#6d28d9] font-mono">₹1.00 Cr</span>
              </div>
            </div>
            
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
