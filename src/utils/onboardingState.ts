import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { DEFAULT_SELECTED, type InterestId } from "@/utils/interestOptions";

export type OnboardingState = "not_started" | "username_set" | "completed";

export const isDefaultSelection = (interests: InterestId[]) =>
  interests.length === DEFAULT_SELECTED.length &&
  interests.every((id) => DEFAULT_SELECTED.includes(id));

export const saveInitialState = async () => {
  const stored = await chrome.storage.local.get("onboardingState");
  if (stored.onboardingState) return;

  await chrome.storage.local.set({
    interests: DEFAULT_SELECTED,
    onboardingState: "not_started",
  });
};

export const saveExistingUserDetailsLocally = async (
  username: string, uid: string, email: string | null, interests: InterestId[], onboardingState: string) => {
  await chrome.storage.local.set({
    username,
    userId: uid,
    email,
    interests,
    onboardingState
  });
};

export const saveUserDetails = async (
  username: string,
  uid: string,
  email?: string | null
) => {
  const safeEmail = email ?? null

  await chrome.storage.local.set({
    username,
    userId: uid,
    email: safeEmail,
    interests: DEFAULT_SELECTED,
    onboardingState: "username_set"
  })

  await setDoc(
    doc(db, "users", username),
    {
      userId: uid,
      email: safeEmail,
      username,
      interests: DEFAULT_SELECTED,
      createdAt: serverTimestamp()
    },
    { merge: true }
  )
}


export const finalizeOnboarding = async (
  username: string,
  interests: InterestId[]
) => {
  await chrome.storage.local.set({
    interests,
    onboardingState: "completed",
  });

  if (!isDefaultSelection(interests)) {
    await setDoc(
      doc(db, "users", username),
      {
        interests,
        onboardingCompletedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
};
