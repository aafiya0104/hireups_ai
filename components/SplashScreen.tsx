"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading time
    const interval = 20; // Update every 20ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay after 100% completes
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-zinc-900"
    >
      <div className="relative flex flex-col items-center">
        {/* Video Container - Blur/Masks Removed */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-48 h-48 md:w-64 md:h-64 relative mb-2"
        >
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source
              src="https://cdn.jsdelivr.net/gh/aafiya0104/hireups-assets@main/5553248e19174da9ace6d6f06cba6718%20(1).webm"
              type="video/mp4"
            />
          </video>
        </motion.div>

        {/* Loading Text & Progress Bar - Kept the larger size as previously requested */}
        <div className="w-80 flex flex-col items-center gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-helvetica text-base font-medium tracking-[0.3em] uppercase text-zinc-600"
          >
            Loading... {Math.round(progress)}%
          </motion.p>
          
          <div className="w-full h-[3px] bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-[#6666ff] via-[#b8baff] to-[#b9f0d7]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};