"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASES = [
  { text: "Hello", sub: "" },
  { text: "Welcome to my world", sub: "" },
];

const TOTAL_DURATION = 4200; // Increased duration for the drawing animation

export default function IntroLoader({
  onFinish,
}: {
  onFinish: () => void;
}) {
  // Phase 0: Logo, Phase 1: First phrase, Phase 2: Second phrase, Phase 3: Exit
  const [phase, setPhase] = useState(0); 
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    setPhase(3);
    setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 600); // exit animation duration
  }, [onFinish]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800); // Logo animation duration
    const t2 = setTimeout(() => setPhase(2), 2800); // Hello duration
    const t3 = setTimeout(() => finish(), TOTAL_DURATION); // Welcome duration
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [finish]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#000319" }}
        >
          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(160,124,254,0.15) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              className="absolute top-[40%] left-[55%] h-[300px] w-[300px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(254,143,181,0.1) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] origin-left"
            style={{
              background:
                "linear-gradient(90deg, #A07CFE, #FE8FB5, #FFBE7B)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: TOTAL_DURATION / 1000, ease: "linear" }}
          />

          {/* Corner mark */}
          <motion.div
            className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-[#A07CFE] shadow-[0_0_8px_rgba(160,124,254,0.5)]" />
            <span className="text-[11px] tracking-[3px] uppercase text-gray-500 font-medium">
              Portfolio
            </span>
          </motion.div>

          {/* Phrases / Logo */}
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div
                  key="phase-logo"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center justify-center font-cairo"
                >
                  <svg width="140" height="160" viewBox="0 0 100 115" className="drop-shadow-2xl">
                    {/* Hexagon Background */}
                    <motion.polygon 
                      points="50,5 93,30 93,80 50,105 7,80 7,30" 
                      fill="#1E1217"
                      stroke="#A07CFE"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                    
                    {/* M Logo */}
                    <motion.path 
                      d="M 22 83 L 22 38 L 50 60 L 78 38 L 78 83"
                      stroke="#27313F" 
                      strokeWidth="14" 
                      fill="none"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                    />

                    {/* Y Logo */}
                    <motion.path 
                      d="M 14 26 L 50 48 L 86 26 M 50 48 L 50 92" 
                      stroke="#425166" 
                      strokeWidth="14" 
                      fill="none"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.7 }}
                    />
                  </svg>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div
                  key="phrase-1"
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                    {PHRASES[0].text}
                  </span>
                  <motion.span
                    className="text-lg sm:text-xl text-[#A07CFE]/80 font-medium"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    {PHRASES[0].sub}
                  </motion.span>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div
                  key="phrase-2"
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-3"
                >
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight text-center leading-tight">
                    {PHRASES[1].text}
                  </span>
                  {/* Animated dots */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[#A07CFE]"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === 3 && (
                <motion.div
                  key="phase-exit"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Exit curtain wipe */}
          {phase === 3 && (
            <motion.div
              className="absolute inset-0 z-20"
              style={{ background: "#000319" }}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
