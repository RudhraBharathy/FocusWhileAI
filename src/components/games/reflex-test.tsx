import { useEffect, useRef, useState, useCallback } from "react";
import {
  Zap,
  Timer,
  Trophy,
  AlertTriangle,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GameState = "idle" | "waiting" | "ready" | "result" | "early";

interface Rank {
  tier: string;
  color: string;
  messages: string[];
}

const STORAGE_KEY = "reflex_highscore";

const GET_RANK = (ms: number): Rank => {
  if (ms < 140)
    return {
      tier: "Machine",
      color: "text-pink-500",
      messages: [
        "Physically impossible.",
        "Input before thought.",
        "Are you wired directly?",
      ],
    };

  if (ms < 160)
    return {
      tier: "Inhuman",
      color: "text-fuchsia-400",
      messages: [
        "Neural overclocked.",
        "Beyond human limits.",
        "Reflex anomaly detected.",
      ],
    };

  if (ms < 180)
    return {
      tier: "Godlike",
      color: "text-purple-400",
      messages: [
        "Frame-perfect reaction.",
        "Esports legend.",
        "Unreal timing.",
      ],
    };

  if (ms < 200)
    return {
      tier: "Master",
      color: "text-indigo-400",
      messages: [
        "Elite tier reflexes.",
        "Tournament-level speed.",
        "Extremely sharp.",
      ],
    };

  if (ms < 220)
    return {
      tier: "Elite",
      color: "text-emerald-400",
      messages: [
        "Lightning fast.",
        "Highly trained reflex.",
        "Very impressive.",
      ],
    };

  if (ms < 240)
    return {
      tier: "Professional",
      color: "text-cyan-400",
      messages: [
        "Consistently strong.",
        "Competitive ready.",
        "Excellent control.",
      ],
    };

  if (ms < 270)
    return {
      tier: "Advanced",
      color: "text-sky-400",
      messages: ["Above average.", "Good reaction speed.", "Nice timing."],
    };

  if (ms < 300)
    return {
      tier: "Average",
      color: "text-blue-400",
      messages: ["Solid human response.", "Pretty normal.", "Respectable."],
    };

  if (ms < 340)
    return {
      tier: "Below Average",
      color: "text-teal-400",
      messages: ["Needs practice.", "A bit late.", "Could be faster."],
    };

  if (ms < 380)
    return {
      tier: "Slow",
      color: "text-orange-400",
      messages: ["Warming up?", "Focus harder.", "Reaction lag."],
    };

  if (ms < 450)
    return {
      tier: "Very Slow",
      color: "text-amber-400",
      messages: ["Eyes open?", "Try again.", "That was delayed."],
    };

  return {
    tier: "Grandma",
    color: "text-red-500",
    messages: ["Did you fall asleep?", "Hello??", "Painfully slow."],
  };
};

const getStorage = () =>
  typeof chrome !== "undefined" && chrome.storage?.local
    ? chrome.storage.local
    : null;

export default function ReflexTest() {
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [rankData, setRankData] = useState<Rank | null>(null);
  const [randomMessage, setRandomMessage] = useState("");

  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const storage = getStorage();
    if (storage) {
      storage.get([STORAGE_KEY], (res: Record<string, number>) => {
        if (res[STORAGE_KEY]) setHighScore(res[STORAGE_KEY]);
      });
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHighScore(parseInt(saved));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const saveHighScore = (newTime: number) => {
    if (!highScore || newTime < highScore) {
      setHighScore(newTime);
      setIsNewRecord(true);
      const storage = getStorage();
      if (storage) storage.set({ [STORAGE_KEY]: newTime });
      else localStorage.setItem(STORAGE_KEY, newTime.toString());
    } else {
      setIsNewRecord(false);
    }
  };

  const startGame = useCallback(() => {
    setState("waiting");
    setScore(0);
    setRankData(null);
    setIsNewRecord(false);

    const delay = Math.random() * 3000 + 2000;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setState("ready");
    }, delay);
  }, []);

  const handleInput = useCallback(() => {
    if (state === "idle" || state === "result" || state === "early") {
      startGame();
      return;
    }

    if (state === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("early");
      return;
    }

    if (state === "ready") {
      const reactionTime = Math.round(performance.now() - startTimeRef.current);

      const rank = GET_RANK(reactionTime);
      setScore(reactionTime);
      setRankData(rank);
      setRandomMessage(
        rank.messages[Math.floor(Math.random() * rank.messages.length)]
      );

      saveHighScore(reactionTime);
      setState("result");
    }
  }, [state, startGame, highScore]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleInput]);

  const getBackground = () => {
    if (state === "waiting") return "bg-rose-950";
    if (state === "ready") return "bg-emerald-500";
    return "border border-white/20";
  };

  return (
    <div
      onMouseUp={handleInput}
      onTouchEnd={handleInput}
      className={`w-full h-100 flex items-center justify-center cursor-pointer select-none rounded-3xl ${getBackground()}`}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div className="text-center space-y-6">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
              <Zap size={48} className="text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-white">Reflex Test</h1>
            <p className="text-zinc-400">Click or press Space to start</p>

            {highScore && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-sm">
                <Trophy size={14} className="text-yellow-500" />
                Best:{" "}
                <span className="font-mono text-white">{highScore} ms</span>
              </div>
            )}
          </motion.div>
        )}

        {state === "result" && (
          <motion.div className="text-center max-w-md px-6">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <Timer className="mx-auto mb-4 text-zinc-400" />
              <div className="text-6xl font-black text-white font-mono">
                {score} ms
              </div>

              {isNewRecord && (
                <div className="mt-2 flex items-center justify-center gap-2 text-yellow-400">
                  <Sparkles size={16} /> New Record!
                </div>
              )}

              {rankData && (
                <div className="mt-4">
                  <h3 className={`text-3xl font-bold pb-2 ${rankData.color}`}>
                    {rankData.tier}
                  </h3>
                  <p className="text-zinc-400 italic mt-2 text-lg">
                    "{randomMessage}"
                  </p>
                </div>
              )}

              {highScore && (
                <div className="mt-6 text-sm text-zinc-500">
                  Best:{" "}
                  <span className="font-mono text-white">{highScore} ms</span>
                </div>
              )}

              <div className="mt-4 text-zinc-500 text-sm flex justify-center gap-2">
                <MousePointer2 size={14} /> Click or Space to retry
              </div>
            </div>
          </motion.div>
        )}

        {state === "waiting" && (
          <h2 className="text-3xl font-bold text-red-200">Wait for Green</h2>
        )}

        {state === "ready" && (
          <h2 className="text-5xl font-black text-white uppercase">Click!</h2>
        )}

        {state === "early" && (
          <motion.div animate={{ x: [0, -10, 10, -10, 10, 0] }}>
            <AlertTriangle size={64} className="text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Too Soon!</h2>
            <p className="text-zinc-400">Click or Space to retry</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
