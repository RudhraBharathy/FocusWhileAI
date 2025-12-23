import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Trophy, Type } from "lucide-react";
import { motion } from "framer-motion";
import { TYPING_SENTENCES } from "../../data/typingSentences";
import {
  loadLocalHighScore,
  saveLocalHighScore,
} from "../../utils/highScoreStorage";

const SPEED_TYPING_BEST_WPM_STORAGE_KEY = "speed_typing_best_wpm";

export default function SpeedTyping() {
  const [target, setTarget] = useState("");
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [done, setDone] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => target.split(""), [target]);
  const wordCount = useMemo(() => target.split(" ").length, [target]);
  const currentWordCount = useMemo(() => input.split(" ").length - 1, [input]);

  useEffect(() => {
    loadLocalHighScore(SPEED_TYPING_BEST_WPM_STORAGE_KEY, setBestWpm);
    reset();
  }, []);

  useEffect(() => {
    if (done) {
      wrapperRef.current?.focus();
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [done]);

  useEffect(() => {
    if (input.length <= chars.length) {
      const charIndex = Math.min(input.length, chars.length - 1);
      const charEl = charRefs.current[charIndex];
      const containerEl = containerRef.current;

      if (charEl && containerEl) {
        let newLeft = charEl.offsetLeft;
        const newTop = charEl.offsetTop;

        if (input.length === chars.length) {
          newLeft += charEl.offsetWidth;
        }

        setCursorPos({ top: newTop, left: newLeft });
      }
    }
  }, [input, chars, done]);

  const reset = () => {
    const sentence =
      TYPING_SENTENCES[Math.floor(Math.random() * TYPING_SENTENCES.length)];
    setTarget(sentence);
    setInput("");
    setStart(null);
    setWpm(0);
    setAccuracy(0);
    setDone(false);
    setIsNewBest(false);
  };

  const calculateAccuracy = (val: string, targetText: string) => {
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) correct++;
    }
    return Math.round((correct / val.length) * 100) || 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (done) return;

    const val = e.target.value;
    const newChar = val.slice(-1);

    if (input.length === 0 && newChar === " ") return;
    if (newChar === " " && input.slice(-1) === " ") return;

    if (!start) setStart(Date.now());

    if (val.length <= target.length) {
      setInput(val);

      if (val.length === target.length) {
        setDone(true);
        const minutes = (Date.now() - start!) / 60000;
        const finalWpm = Math.round(val.length / 5 / minutes);
        const finalAccuracy = calculateAccuracy(val, target);

        setWpm(finalWpm);
        setAccuracy(finalAccuracy);

        if (finalWpm > bestWpm) {
          setBestWpm(finalWpm);
          setIsNewBest(true);
          saveLocalHighScore(SPEED_TYPING_BEST_WPM_STORAGE_KEY, finalWpm);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (done) {
      e.stopPropagation();
      e.preventDefault();

      if (e.code === "Space") {
        reset();
      }
    } else {
      inputRef.current?.focus();
    }
  };

  const getCheerMessage = () => {
    const cheers = [
      "Awesome!!",
      "Hooray!!",
      "Unstoppable!",
      "Crushed it!",
      "Legendary!",
    ];
    return cheers[Math.floor(Math.random() * cheers.length)];
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col p-8 rounded-xl text-[#646669] relative overflow-hidden outline-none"
      onClick={() => {
        if (!done) inputRef.current?.focus();
        else wrapperRef.current?.focus();
      }}
    >
      <div className="flex items-center justify-between mb-6 select-none">
        <div className="flex items-center gap-6 text-xl">
          {!done && (
            <div className="flex items-center gap-2 text-[#e2b714] transition-colors duration-300">
              <Type size={18} />
              <span className="text-lg">
                {currentWordCount}/{wordCount}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[#c4c4c4] text-base">
            <Trophy size={14} />
            <span>Best: {bestWpm}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          className="hover:text-white transition-colors p-2 rounded-full hover:bg-[#646669]/20"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {!done ? (
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto relative w-full">
          <div
            ref={containerRef}
            className="text-3xl leading-relaxed wrap-break-word tracking-wide relative"
          >
            {start && !done && (
              <motion.div
                className="absolute w-[3px] bg-[#e2b714] rounded-full z-10"
                initial={false}
                animate={{
                  top: cursorPos.top,
                  left: cursorPos.left,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{ height: "30px" }}
              />
            )}

            {chars.map((c, i) => {
              let colorClass = "text-[#646669]";
              if (i < input.length) {
                colorClass =
                  input[i] === c ? "text-[#d1d0c5]" : "text-[#ca4754]";
              }

              return (
                <span
                  key={i}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  className={`${colorClass} transition-colors duration-75 border-b-2 border-transparent`}
                >
                  {c}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            value={input}
            onChange={onChange}
            className="absolute opacity-0 w-full h-full cursor-default -z-10"
            autoFocus
          />

          <div className="mt-10 text-center text-sm opacity-70 pointer-events-none select-none">
            <span className="bg-[#2c2e31] px-2 py-1 rounded text-[#c4c4c4]">
              Click anywhere or start typing to focus
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 gap-2">
          {isNewBest ? (
            <div className="text-[#e2b714] text-xl font-bold uppercase tracking-widest animate-bounce">
              {getCheerMessage()}
            </div>
          ) : (
            <div className="text-[#646669] text-sm font-bold uppercase tracking-widest">
              Session Result
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mt-4 text-center">
            <div>
              <div className="text-6xl font-bold text-[#d1d0c5]">{wpm}</div>
              <div className="text-xl text-[#646669] mt-1">WPM</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-[#d1d0c5]">
                {accuracy}%
              </div>
              <div className="text-xl text-[#646669] mt-1">Accuracy</div>
            </div>
          </div>

          {isNewBest && (
            <div className="mt-6 px-4 py-2 bg-[#e2b714]/20 text-[#e2b714] rounded-full text-sm font-bold flex items-center gap-2">
              <Trophy size={16} /> New Personal Best!
            </div>
          )}

          <div className="mt-12 text-[#646669] text-sm flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-[#2c2e31] px-4 py-2 rounded-lg">
              <span className="bg-[#646669] text-[#323437] text-xs px-1.5 py-0.5 rounded font-bold">
                Space
              </span>
              <span>to restart</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
