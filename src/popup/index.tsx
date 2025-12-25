import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { cn } from "@/utils/utils";
import Option from "@/components/Option";
import {
  INTEREST_OPTIONS,
  DEFAULT_SELECTED,
  type InterestId,
} from "@/utils/interestOptions";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import Background from "@/components/Background";

const INTERESTS_KEY = "interests";
const USERNAME_KEY = "username";


function Popup() {
  const [ready, setReady] = useState(false);
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);
  const [initialInterests, setInitialInterests] = useState<InterestId[]>([]);
  const [saving, setSaving] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(isDark ? "dark" : "light");

    chrome.storage.local.get([INTERESTS_KEY], (res) => {
      const stored = res[INTERESTS_KEY];
      if (Array.isArray(stored)) {
        setInterests(stored as InterestId[]);
        setInitialInterests(stored as InterestId[]);
      }
      setReady(true);
    });
  }, []);

  const toggle = (id: InterestId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const hasChanges = initialInterests.length !== interests.length || !initialInterests.every(i => interests.includes(i));

  const saveInterests = async () => {
    if (saving || !hasChanges) return;

    setSaving(true);
    setHasSaved(false);

    chrome.storage.local.get([USERNAME_KEY], async (res) => {
      const username = res[USERNAME_KEY];

      if (!username || typeof username !== "string") {
        setCompletedOnboarding(false);
        setSaving(false);
        setHasSaved(true);
        return;
      }

      try {
        const ref = doc(db, "users", username);
        const snap = await getDoc(ref);

        if (snap.exists() && (initialInterests.length !== interests.length || !initialInterests.every(i => interests.includes(i)))) {
          await updateDoc(ref, {
            interests,
            onboardingCompletedAt: serverTimestamp(),
          });

          setCompletedOnboarding(true);
          setInitialInterests(interests);
        } else {
          setCompletedOnboarding(false);
        }

        chrome.storage.local.set({ [INTERESTS_KEY]: interests });
      } finally {
        setSaving(false);
        setHasSaved(true);
      }
    });
  };

  if (!ready) return <div className="w-full h-full" />;

  return (
    <Background>
      <div className="relative z-10 px-8 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center">
          <span className="bg-linear-to-b from-brand-glow to-brand-accent bg-clip-text text-transparent">
            Focus While AI
          </span>
        </h1>

        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-text-main mb-2">
          Your Interests
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {INTEREST_OPTIONS.map(({ id, label, icon: Icon }) => (
            <Option
              key={id}
              label={label}
              active={interests.includes(id)}
              onClick={() => toggle(id)}
              icon={<Icon />}
              variant="popup"
            />
          ))}
        </div>

        <button
          onClick={saveInterests}
          disabled={saving || !hasChanges}
          className={cn(
            "mt-4 rounded-full py-2 text-sm font-medium transition w-1/2 self-center",
            "bg-linear-to-br from-gray-900 to-gray-700 text-white",
            "dark:from-gray-50 dark:to-gray-300 dark:text-gray-900",
            saving || !hasChanges ? "opacity-50 pointer-events-none" : ""
          )}
        >
          {saving ? "Saving..." : "Save Interests"}
        </button>

        {hasSaved &&
          (completedOnboarding ? (
            <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
              Interests updated!
            </p>
          ) : (
            <p className="text-center text-sm text-gray-700 dark:text-gray-300">
              Interests updated! <br />
              Looks like you haven&apos;t completed onboarding.
              <span
                onClick={() =>
                  chrome.tabs.create({
                    url: chrome.runtime.getURL("onboarding.html"),
                    active: true,
                  })
                }
                className="block mt-1 text-brand-accent cursor-pointer hover:underline"
              >
                Click here to start
              </span>
            </p>
          ))}
      </div>
    </Background>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<Popup />);
}
