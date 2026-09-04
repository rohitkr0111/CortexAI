import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function LoadingAnimation() {
  const thinkingLabels = ["Thinking...", "Analyzing context...", "Formulating response..."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % thinkingLabels.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 py-2 text-slate-400">
      {/* Subtle pulsing indicator */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300" />
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={thinkingLabels[index]}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-slate-400 font-medium tracking-wide"
        >
          {thinkingLabels[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default LoadingAnimation;
