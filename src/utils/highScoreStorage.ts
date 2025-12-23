import { getStorage } from "./getLocalStorage";

export function loadLocalHighScore(key: string, callback: (score: number) => void) {
  const storage = getStorage();

  if (storage) {
    storage.get([key], (res: any) => {
      if (typeof res[key] === "number") {
        callback(res[key]);
      }
    });
  } else {
    const saved = localStorage.getItem(key);
    if (saved) callback(parseInt(saved, 10));
  }
}

export function saveLocalHighScore(key: string, score: number) {
  const storage = getStorage();

  if (storage) {
    storage.set({ [key]: score });
  } else {
    localStorage.setItem(key, score.toString());
  }
}
