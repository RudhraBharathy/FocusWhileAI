import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import Option from "@/components/Option";
import { ArrowRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import {
  INTEREST_OPTIONS,
  DEFAULT_SELECTED,
  type InterestId,
} from "@/utils/interestOptions";
import {
  saveInitialState,
  saveUsername,
  finalizeOnboarding,
} from "@/utils/onboardingState";
import Background from "./components/Background";

function Onboarding() {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    saveInitialState();
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(isDark ? "dark" : "light");
  }, []);

  const handleNext = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      const ref = doc(db, "users", username);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setError("Username taken! Try another.");
        return;
      }

      await saveUsername(username);
      setStep(2);
    } catch {
      setError("Failed to check username. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      await finalizeOnboarding(username, interests);
      window.close();
    } catch {
      setError("Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: InterestId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Background>
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
            <div className="relative flex w-4/5 max-w-md items-center gap-2 rounded-full border border-white/20 bg-linear-to-br from-white/20 to-white/5 py-1.5 pl-6 pr-1.5 mt-10">
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
                className="group flex shrink-0 items-center gap-1 rounded-full bg-linear-to-br from-gray-50 to-gray-400 px-3 py-2.5 text-sm font-medium text-gray-900 transition-transform active:scale-[0.985] cursor-pointer"
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
                className="group flex justify-center align-center mt-6 shrink-0 w-36 items-center gap-1 rounded-full bg-linear-to-br from-gray-50 to-gray-400 px-3 py-2.5 text-xl font-medium text-gray-900 transition-transform active:scale-[0.985] cursor-pointer"
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
    </Background>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Onboarding />
  </React.StrictMode>
);
