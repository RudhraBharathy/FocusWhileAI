import { useState, useEffect, useRef } from "react";
import { Trophy, Zap, RotateCcw, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadLocalHighScore,
  saveLocalHighScore,
} from "@/utils/highScoreStorage";

type GameState = "menu" | "playing" | "gameover";

const SPEED_MATH_STORAGE_KEY = "speed_math_high_score";

export default function SpeedMath() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [question, setQuestion] = useState({ text: "", ans: 0 });
  const [options, setOptions] = useState<number[]>([]);

  const [timeLeft, setTimeLeft] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    loadLocalHighScore(SPEED_MATH_STORAGE_KEY, setHighScore);
  }, []);

  const generateQuestion = (currentScore: number) => {
    let num1, num2, operator;
    const type = Math.random();

    if (currentScore < 5) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operator = type > 0.5 ? "+" : "-";
    } else if (currentScore < 15) {
      if (type > 0.6) {
        num1 = Math.floor(Math.random() * 9) + 2;
        num2 = Math.floor(Math.random() * 9) + 2;
        operator = "×";
      } else {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 5;
        operator = type > 0.3 ? "+" : "-";
      }
    } else {
      num1 = Math.floor(Math.random() * 12) + 3;
      num2 = Math.floor(Math.random() * 12) + 3;
      operator = type > 0.4 ? "×" : type > 0.2 ? "+" : "-";
    }

    let ans = 0;
    if (operator === "+") ans = num1 + num2;
    if (operator === "-") ans = num1 - num2;
    if (operator === "×") ans = num1 * num2;

    const opts = new Set<number>();
    opts.add(ans);

    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const fake = ans + offset * dir;
      if (fake !== ans) opts.add(fake);
    }

    setQuestion({ text: `${num1} ${operator} ${num2}`, ans });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(100);
    setGameState("playing");
    setFeedback(null);
    generateQuestion(0);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          endGame();
          return 0;
        }
        const decay = 0.5 + score * 0.05;
        return prev - decay;
      });
    }, 50);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("gameover");
    if (score > highScore) {
      setHighScore(score);
      saveLocalHighScore(SPEED_MATH_STORAGE_KEY, score);
    }
  };

  const handleAnswer = (val: number) => {
    if (val === question.ans) {
      const nextScore = score + 1;
      setScore(nextScore);
      setFeedback("correct");

      setTimeLeft((prev) => Math.min(prev + 15, 100));

      generateQuestion(nextScore);

      setTimeout(() => setFeedback(null), 200);
    } else {
      setFeedback("wrong");
      setTimeout(endGame, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="h-full flex flex-col p-6 rounded-xl text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full" />

      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-row items-center text-base text-slate-400 gap-2">
            <Trophy size={14} className="text-yellow-500 mx-auto" />
            <span>Best: {highScore}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center w-full"
            >
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
                <Zap
                  size={64}
                  className="mx-auto text-indigo-400 relative z-10 drop-shadow-glow"
                />
              </div>
              <h1 className="text-4xl font-black mb-2 text-white">READY?</h1>
              <p className="text-slate-400 mb-8 text-sm">
                Solve as fast as you can. <br />
                Time adds up on correct answers.
              </p>

              <button
                onClick={startGame}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 group"
              >
                <Play size={20} className="fill-current" />
                START GAME
              </button>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div
              key="playing"
              className="w-full flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-2">
                <div className="text-center text-6xl font-black text-white drop-shadow-lg">
                  {score}
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    className="h-full absolute top-0 left-0"
                    style={{
                      width: `${timeLeft}%`,
                      backgroundColor:
                        timeLeft > 50
                          ? "#10b981"
                          : timeLeft > 20
                          ? "#fbbf24"
                          : "#ef4444",
                    }}
                  />
                </div>
              </div>

              <div className="relative h-24 flex items-center justify-center">
                <motion.div
                  key={question.text}
                  initial={{ scale: 0.5, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="text-5xl font-mono font-bold text-indigo-100 tracking-wider"
                >
                  {question.text}
                </motion.div>

                {feedback === "correct" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-full h-full border-4 border-green-400 rounded-xl" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    className={`
                      h-20 rounded-2xl text-2xl font-bold transition-colors border-2
                      ${
                        feedback === "wrong" && opt !== question.ans
                          ? "bg-red-500/20 border-red-500/50 text-red-200"
                          : "bg-slate-800/50 border-white/5 hover:bg-slate-700/50 hover:border-indigo-500/50 text-indigo-100"
                      }
                    `}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <div className="text-red-400 text-lg font-bold mb-1 uppercase tracking-widest">
                Time Up
              </div>
              <div className="text-7xl font-black text-white mb-6 drop-shadow-xl">
                {score}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-slate-400 uppercase">Best</div>
                  <div className="text-xl font-bold text-yellow-400">
                    {highScore}
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-slate-400 uppercase">
                    Accuracy
                  </div>
                  <div className="text-xl font-bold text-green-400">100%</div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full py-4 bg-white text-indigo-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
