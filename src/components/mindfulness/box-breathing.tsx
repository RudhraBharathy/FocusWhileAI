import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";

export default function BoxBreathing() {
  const [text, setText] = useState("Inhale");

  useEffect(() => {
    const sequence = [
      { t: "Inhale", ms: 4000 },
      { t: "Hold", ms: 4000 },
      { t: "Exhale", ms: 4000 },
      { t: "Hold", ms: 4000 },
    ];
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % 4;
      setText(sequence[i].t);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative p-6">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-cyan-200/50">
        <Wind size={16} />
        <span className="text-xs font-medium tracking-[0.2em]">
          Box Breathing
        </span>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        <div className="absolute w-40 h-40 border border-white/5 rounded-full" />

        <motion.div
          className="absolute rounded-full mix-blend-screen filter blur-xl"
          animate={{
            scale: [1, 1.5, 1.5, 1, 1],
            opacity: [0.3, 0.6, 0.6, 0.3, 0.3],
            background: [
              "rgb(34, 211, 238)",
              "rgb(34, 211, 238)",
              "rgb(168, 85, 247)",
              "rgb(168, 85, 247)",
            ],
          }}
          transition={{
            duration: 16,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
          style={{ width: 110, height: 110 }}
        />

        <motion.div
          className="relative z-10 w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl border border-white/10"
          animate={{
            scale: [1, 1.3, 1.3, 1, 1],
            borderColor: [
              "rgba(34, 211, 238, 0.3)",
              "rgba(34, 211, 238, 0.5)",
              "rgba(168, 85, 247, 0.3)",
              "rgba(168, 85, 247, 0.1)",
            ],
          }}
          transition={{
            duration: 16,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <motion.span
            key={text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-white font-light text-lg tracking-widest"
          >
            {text}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
