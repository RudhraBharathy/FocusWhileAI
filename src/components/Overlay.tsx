import { useEffect, useState } from "react";
import WidgetCard from "./WidgetCard";
import { getCurrentSite, isAIThinking } from "@/utils/siteDetect";
import type { SiteConfig } from "@/utils/siteDetect";
import { DEFAULT_SELECTED, type InterestId } from "@/utils/interestOptions";
import { X } from "lucide-react";

export default function Overlay() {
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [currentInterest, setCurrentInterest] = useState<InterestId>(
    DEFAULT_SELECTED[0]
  );
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);
  const [xbuttonVisible, setXButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    const config = getCurrentSite();
    if (config) {
      setSiteConfig(config);
    }
  }, []);

  useEffect(() => {
    chrome.storage.local.get("interests").then((result) => {
      const stored = result.interests as InterestId[] | undefined;
      if (stored?.length) {
        setInterests(stored);
      } else {
        setInterests(DEFAULT_SELECTED);
      }
    });
  }, []);

  useEffect(() => {
    if (!siteConfig) return;

    const interval = setInterval(() => {
      const thinking = isAIThinking(siteConfig);

      if (thinking && !overlayVisible) {
        setCurrentInterest(
          interests[Math.floor(Math.random() * interests.length)]
        );
        setXButtonVisible(false);
        setOverlayVisible(true);
      } else if (!thinking && overlayVisible) {
        setXButtonVisible(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [siteConfig, overlayVisible, interests]);

  if (!overlayVisible) return null;

  return (
    <div className="fixed inset-0 z-2147483647 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
      <WidgetCard category={currentInterest} siteConfig={siteConfig} />
      <button
        onClick={() => setOverlayVisible(false)}
        className={`absolute top-4 right-4 z-50 bg-zinc-800/50 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300 
          ${xbuttonVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <X size={24} />
      </button>
    </div>
  );
}
