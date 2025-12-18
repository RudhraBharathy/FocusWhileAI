import { useEffect, useState } from "react";
import WidgetCard from "./WidgetCard";
import { getCurrentSite, isAIThinking } from "../utils/site-detect";
import type { SiteConfig } from "../utils/site-detect";


type Interest = "coding" | "finance" | "zen";

export default function Overlay() {
  const [visible, setVisible] = useState<boolean>(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  // Default interest for MVP (later load from Firebase/Storage)
  const [currentInterest, setCurrentInterest] = useState<Interest>("coding");

  useEffect(() => {
    const config = getCurrentSite();

    if (config) {
      console.log("[FocusWhileAI] Active on:", config.host);
      setSiteConfig(config);
    }
  }, []);

  useEffect(() => {
    if (!siteConfig) return;

    const interests: Interest[] = ["coding", "finance", "zen"];

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
  }, [siteConfig, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-2147483647 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
      <WidgetCard category={currentInterest} />
    </div>
  );
}
