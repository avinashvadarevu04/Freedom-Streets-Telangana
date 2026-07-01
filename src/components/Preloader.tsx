"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Simulate loading progress
  useEffect(() => {
    const duration = 3500; // 3.5s loading time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(
        100,
        Math.floor((1 - Math.pow(1 - currentStep / steps, 3)) * 100) // cubic ease-out
      );
      
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onCompleteRef.current();
          }, 1000);
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Background Particles and Lines Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles config
    const particleCount = 60;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    // Line config
    const lineCount = 5;
    const lines: Array<{
      y: number;
      speed: number;
      thickness: number;
      opacity: number;
      phase: number;
    }> = [];

    // Init particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: -(Math.random() * 0.8 + 0.2), // moving upwards like warm air
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? "#ff5e36" : "#d4af37", // orange or gold
      });
    }

    // Init moving horizon lines
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        y: height * 0.5 + (Math.random() * 200 - 100),
        speed: Math.random() * 0.005 + 0.002,
        thickness: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.fillStyle = "#FAFAFC";
      ctx.fillRect(0, 0, width, height);

      // Draw background sun glow
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.6
      );
      gradient.addColorStop(0, "rgba(109, 40, 217, 0.05)"); // Soft lavender glow
      gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.02)"); // Soft cyan aura
      gradient.addColorStop(1, "rgba(250, 250, 252, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal atmospheric lines
      lines.forEach((line) => {
        line.phase += line.speed;
        const currentY = line.y + Math.sin(line.phase) * 30;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6, 182, 212, ${line.opacity * 0.4})`;
        ctx.lineWidth = line.thickness;
        ctx.moveTo(0, currentY);
        ctx.lineTo(width, currentY);
        ctx.stroke();
      });

      // Draw particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle if it leaves top screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#ff5e36" ? "#8B5CF6" : "#06B6D4"; // violet or cyan particles
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Grid network effect lines (subtle connectivity)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(15, 23, 42, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 80) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let j = 0; j < height; j += 80) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Web Audio Synth Generator for Sunrise ambient drone
  const startAmbientSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      // Master gain
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 2.0); // Fade-in sound
      
      // Delay effect for space
      const delay = audioCtx.createDelay(1.0);
      delay.delayTime.value = 0.6;
      const delayGain = audioCtx.createGain();
      delayGain.gain.value = 0.3;
      
      // Filter to make it warm and low-passed (soft ambient)
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, audioCtx.currentTime);

      // Low LFO for filtering sweep
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.08; // very slow
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 80; // modulate by 80Hz
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Oscillators (Harmonic Drone chord)
      // Root: D2 (73.42Hz), Fifth: A2 (110.00Hz), Third: F#3 (185.00Hz), Seventh: C#4 (277.18Hz)
      const baseFreqs = [73.42, 110.00, 185.00, 277.18];
      const oscillators: any[] = [];

      baseFreqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        // Mix triangle and sine for warm, complex texture
        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Individual slow frequency vibrato for analog feel
        const vibrato = audioCtx.createOscillator();
        const vibratoGain = audioCtx.createGain();
        vibrato.frequency.value = 0.15 + idx * 0.05;
        vibratoGain.gain.value = freq * 0.004; // 0.4% pitch drift
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start();

        // Gain setup
        oscGain.gain.value = 0.1 / baseFreqs.length;

        // Slow volume modulation
        const volMod = audioCtx.createOscillator();
        const volModGain = audioCtx.createGain();
        volMod.frequency.value = 0.05 + idx * 0.02;
        volModGain.gain.value = 0.02;
        
        volMod.connect(volModGain);
        volModGain.connect(oscGain.gain);
        volMod.start();

        osc.connect(oscGain);
        oscGain.connect(filter);
        
        osc.start();
        oscillators.push(osc, vibrato, volMod);
      });

      // Route: Filter -> MasterGain -> Destination
      filter.connect(masterGain);
      
      // Delay Route
      filter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(delay); // feedback loop
      delayGain.connect(masterGain);

      masterGain.connect(audioCtx.destination);

      synthNodesRef.current = [masterGain, ...oscillators, delay, delayGain, filter, lfo, lfoGain];
      setSoundEnabled(true);
    } catch (e) {
      console.warn("Failed to initialize audio synth:", e);
    }
  };

  const stopAmbientSynth = () => {
    const nodes = synthNodesRef.current;
    if (nodes.length > 0) {
      // Fade out master gain
      const masterGain = nodes[0];
      const audioCtx = audioContextRef.current;
      if (audioCtx) {
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          audioCtx.close();
        }, 600);
      }
    }
    setSoundEnabled(false);
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopAmbientSynth();
    } else {
      startAmbientSynth();
    }
  };

  // Cleanup synth on unmount
  useEffect(() => {
    return () => {
      const nodes = synthNodesRef.current;
      if (nodes.length > 0) {
        const audioCtx = audioContextRef.current;
        if (audioCtx) {
          audioCtx.close();
        }
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#FAFAFC] overflow-hidden select-none"
        >
          {/* Particles Background */}
          <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

          {/* Sound Toggle Button (Top Right) */}
          <div className="absolute top-8 right-8 z-[10000]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className="flex items-center gap-3 px-4 py-2 border border-purple-500/20 bg-white/60 backdrop-blur-md text-xs font-semibold tracking-wider text-[#6d28d9] rounded-full hover:border-purple-500/40 transition-colors shadow-lg cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={14} className="animate-pulse" />
                  <span>AMBIENCE ACTIVE</span>
                </>
              ) : (
                <>
                  <VolumeX size={14} />
                  <span>ACTIVATE AMBIENT SOUND</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Spacer */}
          <div />

          {/* Central Logo & Loading Animation */}
          <div className="flex flex-col items-center gap-8 text-center px-4 relative z-10 max-w-lg">
            {/* Animated Logo Symbol */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
            >
              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 glow-shadow-orange animate-spin-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dashed border-[#06B6D4]/30 animate-spin-[spin_15s_linear_infinite]" />
              
              {/* Logo Symbol from PDF Letterhead */}
              <div className="relative w-36 h-36 flex items-center justify-center overflow-hidden bg-white/80 rounded-full border border-slate-200/50 shadow-2xl p-4">
                <img
                  src="/freedom_streets_logo.png"
                  alt="Freedom Streets Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(109,40,217,0.2)]"
                />
              </div>
            </motion.div>

            {/* Initiative Title */}
            <div className="flex flex-col gap-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-[#0F172A] via-[#6d28d9] to-[#db2777] bg-clip-text text-transparent"
              >
                Freedom Streets
              </motion.h1>
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xs md:text-sm font-semibold tracking-[0.3em] text-[#06B6D4]"
              >
                TELANGANA 2026
              </motion.p>
            </div>

            {/* Glowing lines connection hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.0 }}
              className="flex items-center gap-2 text-slate-500 text-[10px] tracking-widest font-semibold mt-2"
            >
              <Sparkles size={10} />
              <span>CONNECTING COMMUNITIES • CELEBRATING CULTURE</span>
            </motion.div>
          </div>

          {/* Bottom Loading Progress Indicator */}
          <div className="w-full max-w-sm px-6 pb-20 relative z-10 flex flex-col gap-4">
            <div className="flex items-end justify-between text-slate-600 font-semibold tracking-wider text-[10px]">
              <span>PREPARING EXPERIENCE</span>
              <span className="font-mono text-[#6d28d9]">{progress}%</span>
            </div>
            
            {/* Progress bar container */}
            <div className="h-[2px] w-full bg-slate-200/50 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6d28d9] via-[#db2777] to-[#06B6D4] rounded-full"
                style={{ width: `${progress}%` }}
                layoutId="loaderBar"
              />
            </div>
            
            <p className="text-center text-[9px] text-slate-400 tracking-[0.2em] font-semibold">
              HYDERABAD SUNRISE IN VIEW
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
