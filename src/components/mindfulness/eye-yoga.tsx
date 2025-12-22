import { useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function EyeYoga() {
  const [active, setActive] = useState(false);

  return (
    <div className="h-full flex flex-col py-8 pt-0 relative">
      <div className="flex items-center gap-2 text-emerald-200/50 mb-8">
        <Eye size={16} />
        <span className="text-xs font-medium tracking-[0.2em]">Eye Yoga</span>
      </div>

      {!active ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center gap-6"
        >
          <p className="text-slate-400 text-sm font-light w-full leading-relaxed">
            Follow the moving dot with your eyes <br />
            <span className="text-emerald-400">without moving your head.</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(true)}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-8 py-3 rounded-full text-sm font-medium border border-emerald-500/20 backdrop-blur-md transition-colors"
          >
            Begin Session
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-full h-px bg-white/5 rounded-full" />
          <motion.div
            className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.6)] z-10"
            animate={{
              x: [0, 280, 0, -280, 0],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 pt-10 text-[10px] text-slate-300 uppercase tracking-widest"
          >
            Keep head still
          </motion.p>
        </div>
      )}
    </div>
  );
}
