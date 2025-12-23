import { useEffect, useState } from "react";
import WidgetCard from "./WidgetCard";
import { getCurrentSite, isAIThinking } from "../utils/siteDetect";
import type { SiteConfig } from "../utils/siteDetect";
import { DEFAULT_SELECTED, type InterestId } from "../utils/interestOptions";

export default function Overlay() {
  const [visible, setVisible] = useState<boolean>(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [currentInterest, setCurrentInterest] = useState<InterestId>(
    DEFAULT_SELECTED[0]
  );
  const [interests, setInterests] = useState<InterestId[]>(DEFAULT_SELECTED);

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
      }
    });
  }, []);

  useEffect(() => {
    if (!siteConfig) return;

    const interval = setInterval(() => {
      const thinking = isAIThinking(siteConfig);

      if (thinking && !visible) {
        setCurrentInterest(
          interests[Math.floor(Math.random() * interests.length)]
        );
        setVisible(true);
      } else if (!thinking && visible) {
        setVisible(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [siteConfig, visible, interests]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-2147483647 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
      <WidgetCard category={currentInterest} />
    </div>
  );
}
