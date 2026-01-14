import {
  GoogleAuthProvider,
  signInWithCredential,
  signInAnonymously,
  type User
} from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore"
import { auth, db } from "@/services/firebase"
import { isValidUsername } from "@/utils/username"
import { saveExistingUserDetailsLocally, saveUserDetails } from "@/utils/onboardingState"
import { DEFAULT_SELECTED, type InterestId } from "@/utils/interestOptions"
import { OnboardingStateTypes } from "@/onboarding"

type GoogleAuthResult =
  | {
    mode: "existing"
    username: string
    interests: InterestId[]
    user: User,
    onboardingState: OnboardingStateTypes
  }
  | {
    mode: "new"
    suggestedUsername: string
    user: User,
    onboardingState: OnboardingStateTypes
  }

export async function handleGoogleSignIn(): Promise<GoogleAuthResult> {
  const token = await new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
        return
      }
      if (typeof result === "string") {
        resolve(result)
        return
      }
      if (result?.token) {
        resolve(result.token)
        return
      }
      reject("No OAuth token received")
    })
  })

  const credential = GoogleAuthProvider.credential(null, token)
  const res = await signInWithCredential(auth, credential)
  const user = res.user

  const q = query(
    collection(db, "users"),
    where("userId", "==", user.uid)
  )
  const snap = await getDocs(q)

  if (!snap.empty) {
    const docSnap = snap.docs[0]
    const username = docSnap.id
    const interests: InterestId[] = docSnap.data().interests || DEFAULT_SELECTED
    const onboardingState = docSnap.data().onboardingCompletedAt ? "completed" : "username_set"
    await saveExistingUserDetailsLocally(
      username,
      user.uid,
      user.email,
      interests,
      onboardingState
    )
    return {
      mode: "existing",
      username,
      interests,
      user,
      onboardingState
    }
  }

  const suggested = user.displayName || user.email?.split("@")[0] || ""

  return {
    mode: "new",
    suggestedUsername: isValidUsername(suggested) ? suggested : "",
    user,
    onboardingState: "not_started"
  }
}

export async function handleGuestNext(
  canonicalUsername: string
): Promise<User> {
  const ref = doc(db, "users", canonicalUsername)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    throw new Error("USERNAME_TAKEN")
  }

  let user = auth.currentUser
  if (!user) {
    const res = await signInAnonymously(auth)
    user = res.user
  }

  const email = user.email ?? null

  await saveUserDetails(
    canonicalUsername,
    user.uid,
    email
  )

  return user
}

