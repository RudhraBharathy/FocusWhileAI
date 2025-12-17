import React, { useState, useEffect } from "react";
import { cn } from "./lib/utils";
import ReactDOM from "react-dom/client";
import "./index.css";
import Option from "./components/Option";
import {
  ArrowRight,
  ChartNoAxesCombined,
  CodeXml,
  TrendingUp,
  Coffee,
  Brain,
  Gamepad2,
} from "lucide-react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const INTEREST_OPTIONS = [
  {
    id: "productivity",
    label: "Productivity",
    icon: ChartNoAxesCombined,
  },
  {
    id: "technology",
    label: "Technology",
    icon: CodeXml,
  },
  {
    id: "finance",
    label: "Finance & Market",
    icon: TrendingUp,
  },
  {
    id: "mindfulness",
    label: "Mindfulness",
    icon: Coffee,
  },
  {
    id: "generalKnowledge",
    label: "General Knowledge",
    icon: Brain,
  },
  {
    id: "games",
    label: "Games",
    icon: Gamepad2,
  },
];

const DEFAULT_SELECTED = INTEREST_OPTIONS.slice(0, 2).map((o) => o.id);

function Onboarding() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState(DEFAULT_SELECTED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (!username) return;
    setLoading(true);

    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setError("Username taken! Try another.");
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      setStep(2);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => {
        chrome.storage.local.set(
          {
            username: username,
            interests: interests,
            isSetupComplete: true,
          },
          resolve
        );
      });

      await setDoc(doc(db, "users", username), {
        username: username,
        interests: interests,
        createdAt: new Date(),
      });

      window.close();
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => {
    setInterests((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return next;
    });
  };

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.add(isDarkMode ? "dark" : "light");
  }, []);

  return (
    <div className="relative flex w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="min-h-screen flex flex-col items-center justify-between pt-18 pb-8 z-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-2xl">
            <h1 className="text-7xl font-bold text-center mb-6">
              <span className="relative bg-linear-to-b from-brand-glow to-brand-accent bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                Focus While AI
              </span>
            </h1>
            <p className="text-text-main text-center text-lg">
              Turn your waiting time into learning time. What keeps you in flow?
            </p>
          </div>

          {step === 1 ? (
            <div className="relative flex w-4/5 max-w-md items-center gap-2 rounded-full border border-white/20 bg-gradient-to-br from-white/20 to-white/5 py-1.5 pl-6 pr-1.5 mt-10">
              <input
                className="relative flex w-full py-1.5 pr-1.5 outline-none color-white placeholder:text-gray-300 text-lg text-white"
                type="text"
                name="username"
                required
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={handleNext}
                disabled={loading || !username.trim()}
                className="group flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-br from-gray-50 to-gray-400 px-3 py-2.5 text-sm font-medium text-gray-900 
            transition-transform active:scale-[0.985] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : step === 2 ? (
            <div className="w-full max-w-2xl my-6 flex flex-col items-center mt-10">
              <div className="grid grid-cols-3 gap-6 text-left">
                {INTEREST_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <Option
                    key={id}
                    label={label}
                    active={interests.includes(id)}
                    onClick={() => toggle(id)}
                    icon={<Icon />}
                  />
                ))}
              </div>
              <button
                onClick={handleFinish}
                disabled={loading || !interests.length}
                className="group flex justify-center align-center mt-6 shrink-0 w-36 items-center gap-1 rounded-full bg-gradient-to-br from-gray-50 to-gray-400 px-3 py-2.5 text-xl 
                font-medium text-gray-900 transition-transform active:scale-[0.985] cursor-pointer mt-10"
              >
                <span>Let's Go!</span>
              </button>
            </div>
          ) : null}
          {error && (
            <p className="text-red-500 mt-2">
              {error || "Something went wrong!"}
            </p>
          )}
        </div>

        <div className="text-text-muted text-sm">
          Made with ❤️ by{" "}
          <a
            href="https://rudhrabharathy.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Rudhra Bharathy
          </a>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Onboarding />
  </React.StrictMode>
);
