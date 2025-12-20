import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ghost,
  Heart,
  Zap,
  Star,
  Moon,
  Sun,
  Cloud,
  Anchor,
  Skull,
  Flame,
  Diamond,
  Gamepad2,
  Music,
  Gift,
  Coffee,
  Umbrella,
  Scissors,
  Bell,
  Eye,
  Key,
  Crown,
  Rocket,
  Flag,
  Trophy,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const ALL_ICONS = [
  Ghost,
  Heart,
  Zap,
  Star,
  Moon,
  Sun,
  Cloud,
  Anchor,
  Skull,
  Flame,
  Diamond,
  Gamepad2,
  Music,
  Gift,
  Coffee,
  Umbrella,
  Scissors,
  Bell,
  Eye,
  Key,
  Crown,
  Rocket,
  Flag,
  CheckCircle2,
];

const PAIRS_COUNT = 10;
const STORAGE_KEY = "memory_game_best_score";

type CardType = {
  id: number;
  icon: any;
  isFlipped: boolean;
  isMatched: boolean;
};

const getStorage = () =>
  typeof chrome !== "undefined" && chrome.storage?.local
    ? chrome.storage.local
    : null;

export default function FlipTiles() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    initializeGame();

    const storage = getStorage();

    if (storage) {
      storage.get([STORAGE_KEY], (res) => {
        if (typeof res[STORAGE_KEY] === "number") {
          setBestScore(res[STORAGE_KEY]);
        }
      });
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setBestScore(parseInt(saved));
    }
  }, []);

  const initializeGame = () => {
    const shuffled = [...ALL_ICONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, PAIRS_COUNT);
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);

    setCards(
      deck.map((icon, i) => ({
        id: i,
        icon,
        isFlipped: false,
        isMatched: false,
      }))
    );

    setFlippedIndices([]);
    setMoves(0);
    setGameWon(false);
    setIsLocked(false);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const flipped = [...flippedIndices, index];
    setFlippedIndices(flipped);

    if (flipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      checkMatch(flipped, updated);
    }
  };

  const checkMatch = (indices: number[], current: CardType[]) => {
    const [a, b] = indices;

    if (current[a].icon === current[b].icon) {
      setTimeout(() => {
        current[a].isMatched = true;
        current[b].isMatched = true;
        setCards([...current]);
        setFlippedIndices([]);
        setIsLocked(false);

        if (current.every((c) => c.isMatched)) handleWin();
      }, 400);
    } else {
      setTimeout(() => {
        current[a].isFlipped = false;
        current[b].isFlipped = false;
        setCards([...current]);
        setFlippedIndices([]);
        setIsLocked(false);
      }, 800);
    }
  };

  const handleWin = () => {
    setGameWon(true);
    const score = moves + 1;

    if (!bestScore || score < bestScore) {
      setBestScore(score);

      const storage = getStorage();
      if (storage) {
        storage.set({ [STORAGE_KEY]: score });
      } else {
        localStorage.setItem(STORAGE_KEY, score.toString());
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border border-white/20 text-white p-4 rounded-lg">
      <div className="flex gap-6 items-center mb-6">
        <h1 className="text-lg font-black">
          Memory Match <span className="text-indigo-500">4×5</span>
        </h1>

        <div className="flex gap-6 text-sm">
          <div className="px-4 py-1.5 bg-zinc-900 border border-white/30 rounded-full">
            Moves: <span className="font-mono font-bold">{moves}</span>
          </div>

          {bestScore !== null && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy size={14} />
              <span className="font-mono font-bold">
                Best: {bestScore} moves
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={`flex flex-col gap-3 mb-6 ${
            gameWon ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          {Array.from({ length: 4 }).map((_, row) => (
            <div key={row} className="flex gap-3 justify-center">
              {cards.slice(row * 5, row * 5 + 5).map((card, i) => {
                const index = row * 5 + i;
                return (
                  <Card
                    key={index}
                    card={card}
                    onClick={() => handleCardClick(index)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl text-center shadow-2xl">
                <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-2">You Win!</h2>
                <p className="text-zinc-400 mb-6">
                  Completed in{" "}
                  <span className="text-white font-bold">{moves}</span> moves
                </p>
                <button
                  onClick={initializeGame}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!gameWon && (
        <button
          onClick={initializeGame}
          className="flex items-center gap-2 px-5 py-2 text-sm bg-zinc-900 border border-white/30 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw size={14} /> Reset Board
        </button>
      )}
    </div>
  );
}

function Card({ card, onClick }: { card: CardType; onClick: () => void }) {
  const Icon = card.icon;

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "0.75rem",
  };

  return (
    <div
      className="w-14 h-14 perspective-1000 cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          style={faceStyle}
          className="bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/20 shadow-md flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-zinc-700/60" />
        </div>

        <div
          style={{ ...faceStyle, transform: "rotateY(180deg)" }}
          className={`flex items-center justify-center border shadow-lg ${
            card.isMatched
              ? "bg-indigo-500/20 border-indigo-500 shadow-indigo-500/30"
              : "bg-linear-to-br from-zinc-800 to-zinc-900 border-zinc-600"
          }`}
        >
          <Icon
            size={32}
            className={card.isMatched ? "text-indigo-400" : "text-white"}
          />
        </div>
      </motion.div>
    </div>
  );
}
