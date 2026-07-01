"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface Gallery3DProps {
  scrollProgress: number;
}

interface ImageItem {
  id: number;
  src: string;
  title: string;
  category: string;
}

const galleryImages: ImageItem[] = [
  { id: 1, src: "/images/gallery-1.jpg", title: "Sunday Morning Zumba Fit", category: "FITNESS" },
  { id: 2, src: "/images/gallery-2.jpg", title: "Sunrise Mass Yoga Session", category: "YOGA" },
  { id: 3, src: "/images/gallery-3.jpg", title: "Youth Hurdles & Athletic Race", category: "SPORTS" },
  { id: 4, src: "/images/gallery-4.jpg", title: "Community Cycling Marathon", category: "SPORTS" },
  { id: 5, src: "/images/gallery-5.jpg", title: "Historical Heritage Fort Walk", category: "COMMUNITY" },
  { id: 6, src: "/images/gallery-6.jpg", title: "Cultural Traditional Folk Dance", category: "CULTURE" },
  { id: 7, src: "/images/gallery-7.jpg", title: "Free Preventative Health Checkup", category: "HEALTH" },
  { id: 8, src: "/images/gallery-8.jpg", title: "Sari Walk & Inclusive Runners", category: "COMMUNITY" },
];

export default function Gallery3D({ scrollProgress }: Gallery3DProps) {
  // Gallery active in gallery section
  const isActive = scrollProgress >= 0.993 && scrollProgress <= 0.996;
  const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 overflow-hidden">
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/90 backdrop-blur-md pointer-events-auto p-4 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-8 right-8 z-[100000] p-3 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Expended Image Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg.src}
                alt={selectedImg.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/90 to-transparent p-6 flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-widest text-[#6d28d9] uppercase">{selectedImg.category}</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900">{selectedImg.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-[#6d28d9] uppercase">
            Captured Moments
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-1 text-[#0F172A]">
            Immersive Event Gallery
          </h2>
        </motion.div>

        {/* 3D Staggered Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-auto relative [perspective:1200px]">
          {galleryImages.map((img, idx) => {
            // Apply unique 3D translations and rotations for float effect
            const rotationY = idx % 2 === 0 ? -12 : 12;
            const rotationX = idx % 3 === 0 ? 8 : -8;
            const translateZ = idx % 4 === 0 ? 25 : -15;

            return (
              <motion.div
                key={img.id}
                initial={{
                  opacity: 0,
                  rotateY: rotationY,
                  rotateX: rotationX,
                  z: translateZ,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 0,
                  rotateX: 0,
                  z: 40,
                  boxShadow: "0 15px 35px rgba(109, 40, 217, 0.15)",
                  transition: { duration: 0.3 }
                }}
                onClick={() => setSelectedImg(img)}
                className="group relative h-40 md:h-52 overflow-hidden rounded-xl border border-slate-200/60 bg-white cursor-pointer shadow-lg transform-gpu transition-all duration-300"
              >
                {/* Overlay shadow filters */}
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent z-10 transition-colors duration-300" />
                
                {/* Glowing border inside */}
                <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/30 z-20 rounded-xl transition-colors duration-300" />

                {/* Actual image */}
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500 filter brightness-95 group-hover:brightness-100 grayscale-[20%] group-hover:grayscale-0"
                />

                {/* Glass Card Details */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-3 bg-gradient-to-t from-white/95 to-transparent flex flex-col gap-0.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[8px] font-bold tracking-widest text-[#6d28d9] uppercase">{img.category}</span>
                  <p className="text-[10px] md:text-xs font-bold text-slate-800 truncate">{img.title}</p>
                </div>

                {/* Hover Zoom Indicator Icon */}
                <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 text-white bg-purple-600/80 p-1.5 rounded-full shadow-lg transition-opacity duration-300">
                  <ZoomIn size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
