import React, { useCallback, useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import "@/index.css"
import Option from "@/components/Option"
import { ArrowRight, Loader2 } from "lucide-react"
import { auth } from "@/services/firebase"
import {
  type User
} from "firebase/auth"
import {
  INTEREST_OPTIONS,
  DEFAULT_SELECTED,
  type InterestId
} from "@/utils/interestOptions"
import {
  saveInitialState,
  finalizeOnboarding,
} from "@/utils/onboardingState"
import Background from "@/components/Background"
import { isValidUsername, normalizeUsername } from "@/utils/username"
import FocusWhileAI from "/focuswhileai-logo.png"
import { handleGoogleSignIn, handleGuestNext } from "@/services/auth"

export type OnboardingStateTypes = "not_started" | "username_set" | "completed";

function Onboarding() {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showGuestConfirm, setShowGuestConfirm] = useState<boolean>(false);

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
        onboardingState?: OnboardingStateTypes
        username?: string
        interests?: InterestId[]
      }
      if (stored.username) setUsername(stored.username)
      if (stored.interests) setInterests(stored.interests)
      if (stored.onboardingState === "username_set") setStep(2)
      if (stored.onboardingState === "completed") window.close()
    }
    init()
  }, [])

  const canonicalUsername = normalizeUsername(username)

  const isUsernameValid = useMemo(
    () => isValidUsername(canonicalUsername),
    [canonicalUsername]
  )

  const onGoogleSignIn = async () => {
    if (loading) return

    setLoading(true)
    setError("")
    try {
      const result = await handleGoogleSignIn()
      setCurrentUser(result.user)

      if (result.mode === "existing") {
        setUsername(result.username)
        setInterests(result.interests)
        setStep(2)
      } else {
        setUsername(result.suggestedUsername)
        setStep(1.5)
      }
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error ? err.message : "Google sign-in failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const onGuestBtnClick = () => {
    if (!isUsernameValid) return
    if (step !== 1.5) {
      setShowGuestConfirm(true)
    } else {
      onGuestNext()
    }
  }

  const onGuestNext = async () => {
    if (loading) return

    setLoading(true)
    setError("")
    try {
      const user = await handleGuestNext(canonicalUsername)
      setCurrentUser(user)
      setStep(2)
    } catch (err) {
      if (err instanceof Error && err.message === "USERNAME_TAKEN") {
        setError("Username already taken")
      } else {
        console.error(err)
        setError("Failed to continue as guest")
      }
    } finally {
      setLoading(false)
    }
  }


  const handleFinish = async () => {
    if (loading) return

    setLoading(true)
    setError("")
    const user = auth.currentUser || currentUser
    if (!user) {
      setError("Auth error")
      setLoading(false)
      return
    }
    try {
      await finalizeOnboarding(canonicalUsername, interests)
      window.close()
    } catch (err) {
      console.error(err);
      setError("Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const toggle = useCallback((id: InterestId) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])


  return (
    <Background>
      <div className="min-h-screen w-full flex flex-col items-center justify-between pt-18 pb-8 z-20">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full max-w-3xl">
            <h1 className="text-center mb-4">
              <div className="flex items-center justify-center gap-4">
                <img
                  src={FocusWhileAI}
                  alt="FocusWhileAI Logo"
                  className="w-16 h-16"
                />
                <span className="relative bg-linear-to-b from-brand-glow to-brand-accent bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                  FocusWhileAI
                </span>
              </div>
            </h1>
            <p className="text-center text-lg text-gray-700 dark:text-gray-300 px-4">
              {step === 2
                ? "Customize your micro-learning feed."
                : "Ready to turn waiting time into flow state?"}
            </p>
          </div>

          {(step === 1 || step === 1.5) && (
            <div className="flex flex-col items-center w-full max-w-lg mt-6 gap-4 px-4">
              {step === 1 && (
                <>
                  <button
                    onClick={onGoogleSignIn}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-6 py-3 text-base font-medium text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center w-4/5 gap-4 opacity-50">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-lg text-gray-200 font-medium">
                      or
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                </>
              )}

              <div className="relative flex w-4/5 items-center gap-2 rounded-full border border-black/30 dark:border-white/20 bg-linear-to-br from-white/80 to-white/40 dark:from-white/20 dark:to-white/5 backdrop-blur-md py-1.5 pl-6 pr-1.5">
                <input
                  className="w-full bg-transparent py-1.5 pr-1.5 outline-none text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  type="text"
                  placeholder={
                    step === 1.5
                      ? "Choose a unique username"
                      : "Enter a username"
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />

                <button
                  onClick={onGuestBtnClick}
                  disabled={loading || !isUsernameValid}
                  className="group flex shrink-0 items-center gap-1 rounded-full bg-linear-to-br from-gray-900 to-gray-700 dark:from-gray-50 dark:to-gray-300 px-3 py-2.5 text-sm font-medium text-white dark:text-gray-900 transition-transform active:scale-[0.985] disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{step === 1.5 ? "Next" : "Guest"}</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </div>
              {showGuestConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Continue as Guest?
                    </h3>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Guest mode keeps your data locally on this device. If the extension is removed, this data can’t be recovered.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setShowGuestConfirm(false)
                          setUsername("")
                        }}
                        className="rounded-full border border-gray-200 dark:border-gray-500 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          setShowGuestConfirm(false)
                          onGuestNext()
                        }}
                        className="rounded-full border border-gray-200 dark:border-gray-500 bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900"
                      >
                        Continue as Guest
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {username.trim() && (
                <div className="mt-2 flex flex-col items-center gap-2 text-base">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {step === 1.5
                      ? "Confirm your handle:"
                      : "You will appear as:"}
                  </span>

                  <span
                    className={`font-mono px-4 py-1 rounded-full border ${isUsernameValid
                      ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                      : "border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10"
                      }`}
                  >
                    {canonicalUsername || "—"}
                  </span>

                  {!isUsernameValid && (
                    <span className="text-xs text-red-500 dark:text-red-400">
                      3–20 chars · letters, numbers, underscores
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="w-full max-w-2xl my-6 flex flex-col items-center mt-6">
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
                className="group mt-10 w-48 flex justify-center items-center gap-2 rounded-full bg-linear-to-br from-gray-900 to-gray-700 dark:from-gray-50 dark:to-gray-300 px-4 py-2.5 text-xl font-medium text-white dark:text-gray-900 transition-transform active:scale-[0.985] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Start Focus"}
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-600 dark:text-red-400 mt-2 text-base bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg">
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
