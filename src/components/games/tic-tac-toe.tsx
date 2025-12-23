import { useEffect, useState, useCallback } from "react";
import { X, Circle, RotateCcw, User, Cpu, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStorage } from "../../utils/getLocalStorage";

type Player = "X" | "O" | null;
interface Scores {
  you: number;
  cpu: number;
}
interface WinState {
  winner: Player | "draw";
  combination: number[] | null;
}

const TIC_TAC_TOE_STORAGE_KEY = "tic_tac_toe_scores";
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToeEnhanced() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [userPlayer, setUserPlayer] = useState<"X" | "O">("X");
  const [isCpuTurn, setIsCpuTurn] = useState(false);
  const [gameResult, setGameResult] = useState<WinState | null>(null);
  const [scores, setScores] = useState<Scores>({ you: 0, cpu: 0 });

  useEffect(() => {
    const storage = getStorage();
    if (storage) {
      storage.get([TIC_TAC_TOE_STORAGE_KEY], (res) => {
        if (res[TIC_TAC_TOE_STORAGE_KEY]) {
          setScores(res[TIC_TAC_TOE_STORAGE_KEY] as Scores);
        }
      });
    } else {
      const saved = localStorage.getItem(TIC_TAC_TOE_STORAGE_KEY);
      if (saved) setScores(JSON.parse(saved));
    }
  }, []);

  const updateScore = (winner: Player) => {
    const newScores = { ...scores };
    if (winner === userPlayer) newScores.you += 1;
    else if (winner) newScores.cpu += 1;

    setScores(newScores);

    const storage = getStorage();
    if (storage) storage.set({ [TIC_TAC_TOE_STORAGE_KEY]: newScores });
    else
      localStorage.setItem(TIC_TAC_TOE_STORAGE_KEY, JSON.stringify(newScores));
  };

  const checkWinner = (currentBoard: Player[]) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], combination: combo };
      }
    }
    if (!currentBoard.includes(null))
      return { winner: "draw", combination: null };
    return null;
  };

  const handleMove = useCallback(
    (index: number, player: "X" | "O") => {
      if (gameResult) return;

      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[index] = player;

        const result = checkWinner(newBoard);

        if (result) {
          setGameResult(result as WinState);
          if (result.winner !== "draw") updateScore(result.winner as Player);
          setIsCpuTurn(false);
        } else {
          setIsCpuTurn(player === userPlayer);
        }
        return newBoard;
      });
    },
    [gameResult, userPlayer, scores]
  );

  useEffect(() => {
    if (!isCpuTurn || gameResult) return;

    const cpuPlayer = userPlayer === "X" ? "O" : "X";

    const makeCpuMove = () => {
      for (let i = 0; i < WINNING_COMBOS.length; i++) {
        const [a, b, c] = WINNING_COMBOS[i];
        const line = [board[a], board[b], board[c]];
        if (
          line.filter((cell) => cell === cpuPlayer).length === 2 &&
          line.includes(null)
        ) {
          const emptyIdx = [a, b, c].find((idx) => board[idx] === null);
          if (emptyIdx !== undefined) return handleMove(emptyIdx, cpuPlayer);
        }
      }

      for (let i = 0; i < WINNING_COMBOS.length; i++) {
        const [a, b, c] = WINNING_COMBOS[i];
        const line = [board[a], board[b], board[c]];
        if (
          line.filter((cell) => cell === userPlayer).length === 2 &&
          line.includes(null)
        ) {
          const emptyIdx = [a, b, c].find((idx) => board[idx] === null);
          if (emptyIdx !== undefined) return handleMove(emptyIdx, cpuPlayer);
        }
      }

      if (board[4] === null) return handleMove(4, cpuPlayer);

      const available = board
        .map((v, i) => (v === null ? i : null))
        .filter((v) => v !== null) as number[];
      const randomMove =
        available[Math.floor(Math.random() * available.length)];
      handleMove(randomMove, cpuPlayer);
    };

    const timeout = setTimeout(makeCpuMove, 600);
    return () => clearTimeout(timeout);
  }, [isCpuTurn, board, gameResult, userPlayer, handleMove]);

  const resetGame = (newUserRole?: "X" | "O") => {
    setBoard(Array(9).fill(null));
    setGameResult(null);
    const nextUser = newUserRole ?? userPlayer;
    setUserPlayer(nextUser);
    setIsCpuTurn(nextUser === "O");
  };

  const getLineCoords = (combo: number[]) => {
    const getCoord = (idx: number) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      return { x: col * 33.33 + 16.66, y: row * 33.33 + 16.66 };
    };
    const start = getCoord(combo[0]);
    const end = getCoord(combo[2]);
    return {
      x1: `${start.x}%`,
      y1: `${start.y}%`,
      x2: `${end.x}%`,
      y2: `${end.y}%`,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center border border-white/20 text-white selection:bg-blue-500/30">
      <div className="my-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
          <button
            onClick={() => resetGame("X")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              userPlayer === "X"
                ? "bg-blue-500/10 border-blue-500 text-blue-400"
                : "border-zinc-800 hover:border-zinc-700"
            }`}
          >
            Play as X
          </button>
          <button
            onClick={() => resetGame("O")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              userPlayer === "O"
                ? "bg-red-500/10 border-red-500 text-red-400"
                : "border-zinc-800 hover:border-zinc-700"
            }`}
          >
            Play as O
          </button>
        </div>
      </div>

      <div className="flex items-end gap-8 mb-2">
        <ScoreCard
          label="You"
          score={scores.you}
          icon={User}
          active={!isCpuTurn && !gameResult}
          color="text-emerald-400"
        />
        <div className="relative p-4 bg-zinc-800/50 rounded-2xl border border-white/30 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => !cell && !isCpuTurn && handleMove(i, userPlayer)}
                disabled={!!cell || isCpuTurn || !!gameResult}
                className="relative w-24 h-24 bg-zinc-900 rounded-xl flex items-center justify-center text-3xl sm:text-4xl 
              hover:bg-slate-800/80 hover:border-stone-300 transition-colors disabled:hover:bg-zinc-900 cursor-pointer
              disabled:cursor-not-allowed border border-transparent"
              >
                <AnimatePresence>
                  {cell && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {cell === "X" ? (
                        <X
                          className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Circle
                          className="w-14 h-14 sm:w-16 sm:h-16 text-red-500"
                          strokeWidth={3}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {gameResult?.winner !== "draw" && gameResult?.combination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-4">
              <motion.line
                {...getLineCoords(gameResult.combination)}
                stroke={gameResult.winner === "X" ? "#3b82f6" : "#ef4444"}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </svg>
          )}

          <AnimatePresence>
            {gameResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-0 right-0 text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-800 rounded-full border border-zinc-700 shadow-xl">
                  {gameResult.winner === "draw" ? (
                    <span className="text-zinc-400 font-semibold">
                      It's a Draw!
                    </span>
                  ) : (
                    <>
                      <Trophy
                        className={`w-5 h-5 ${
                          gameResult.winner === userPlayer
                            ? "text-yellow-400"
                            : "text-zinc-500"
                        }`}
                      />
                      <span className="font-bold">
                        {gameResult.winner === userPlayer
                          ? "You Win!"
                          : "CPU Wins!"}
                      </span>
                    </>
                  )}
                  <div className="w-px h-4 bg-zinc-600 mx-1" />
                  <button
                    onClick={() => resetGame()}
                    className="p-1 hover:bg-zinc-600 rounded-full transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ScoreCard
          label="CPU"
          score={scores.cpu}
          icon={Cpu}
          active={isCpuTurn && !gameResult}
          color="text-rose-400"
        />
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  icon: Icon,
  active,
  color,
}: {
  label: string;
  score: number;
  icon: any;
  active: boolean;
  color: string;
}) {
  return (
    <div
      className={`flex flex-col items-center transition-opacity duration-300 ${
        active ? "opacity-100 scale-105" : "opacity-50"
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
        {label}
      </span>
      <div className={`flex items-center gap-2 text-2xl font-bold ${color}`}>
        <Icon className="w-6 h-6" />
        {score}
      </div>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className={`mt-2 rounded-full ${color.replace("text-", "bg-")}`}
        />
      )}
    </div>
  );
}
