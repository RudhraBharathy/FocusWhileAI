import React, { useEffect, useMemo, useState } from "react";
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
import Background from "@/components/Background";
import { isValidUsername, normalizeUsername } from "@/utils/username";

function Onboarding() {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      await saveInitialState();

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDark ? "dark" : "light");

      const stored = (await chrome.storage.local.get([
        "onboardingState",
        "username",
        "interests",
      ])) as {
        onboardingState?: string;
        username?: string;
        interests?: InterestId[];
      };

      if (stored.username) setUsername(stored.username);
      if (stored.interests) setInterests(stored.interests);

      if (stored.onboardingState === "username_set") {
        setStep(2);
      }

      if (stored.onboardingState === "completed") {
        window.close();
      }
    };

    init();
  }, []);

  const canonicalUsername = useMemo(
    () => normalizeUsername(username),
    [username]
  );

  const isUsernameValid = useMemo(
    () => isValidUsername(canonicalUsername),
    [canonicalUsername]
  );

  const handleNext = async () => {
    if (!isUsernameValid) return;

    setLoading(true);
    setError("");

    try {
      const ref = doc(db, "users", canonicalUsername);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setError("Username already taken!");
        return;
      }

      await saveUsername(canonicalUsername);
      setStep(2);
    } catch {
      setError("Failed to check username. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      await finalizeOnboarding(canonicalUsername, interests);
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
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full max-w-2xl">
            <h1 className="text-center mb-6">
              <span className="relative bg-linear-to-b from-brand-glow to-brand-accent bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                FocusWhileAI
              </span>
            </h1>
            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
              Ready to turn waiting time into intentional micro-engagement that
              keeps you in flow?
            </p>
          </div>

          {step === 1 && (
            <>
              <div className="relative flex w-4/5 max-w-md items-center gap-2 rounded-full border border-black/30 dark:border-white/20 bg-linear-to-br from-white/80 to-white/40 dark:from-white/20 dark:to-white/5 backdrop-blur-md py-1.5 pl-6 pr-1.5 mt-10">
                <input
                  className="w-full bg-transparent py-1.5 pr-1.5 outline-none text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <button
                  onClick={handleNext}
                  disabled={loading || !isUsernameValid}
                  className="group flex shrink-0 items-center gap-1 rounded-full bg-linear-to-br from-gray-900 to-gray-700 dark:from-gray-50 dark:to-gray-300 px-3 py-2.5 text-sm font-medium text-white dark:text-gray-900 transition-transform active:scale-[0.985] disabled:opacity-60"
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {username.trim() && (
                <div className="mt-4 flex flex-col items-center gap-2 text-base">
                  <span className="text-gray-600 dark:text-gray-400">
                    Your username will be
                  </span>

                  <span
                    className={`font-mono px-4 py-1 rounded-full border ${
                      isUsernameValid
                        ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                        : "border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10"
                    }`}
                  >
                    {canonicalUsername || "—"}
                  </span>

                  {!isUsernameValid && (
                    <span className="text-base text-red-500 dark:text-red-400">
                      3–20 characters · letters, numbers, and underscores only
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="w-full max-w-2xl my-6 flex flex-col items-center mt-10">
              <div className="grid grid-cols-3 gap-6">
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
                className="group mt-10 w-36 rounded-full bg-linear-to-br from-gray-900 to-gray-700 dark:from-gray-50 dark:to-gray-300 px-4 py-2.5 text-xl font-medium text-white dark:text-gray-900 transition-transform active:scale-[0.985] disabled:opacity-50"
              >
                Let’s Go!
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-600 dark:text-red-400 mt-2 text-base">
              {error}
            </p>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
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
