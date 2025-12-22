import { JSX, useMemo } from "react";
import {
  Coffee,
  Gamepad2,
  Brain,
  ChartNoAxesCombined,
  CodeXml,
} from "lucide-react";
import type { InterestId } from "../utils/interestOptions";
import { getCurrentSite, SiteConfig } from "../utils/site-detect";
import TicTacToe from "./games/tic-tac-toe";
import FlipTiles from "./games/flip-tiles";
import ReflexTest from "./games/reflex-test";
import GeneralKnowledge from "./generalKnowledge/general-knowledge";
import ProductivityTip from "./productivity/productivity-tip";
import SpeedMath from "./productivity/speed-math";
import SpeedTyping from "./productivity/speed-typing";

type Card = {
  title: string;
  content?: string;
  component?: JSX.Element;
};

type WidgetCardProps = {
  category: InterestId;
  siteConfig?: SiteConfig;
};

type SupportedCategory =
  | "games"
  | "generalKnowledge"
  | "productivity"
  | "technology"
  | "mindfulness";

const CATEGORY_MAP: Record<InterestId, SupportedCategory> = {
  productivity: "productivity",
  technology: "technology",
  mindfulness: "mindfulness",
  generalKnowledge: "generalKnowledge",
  games: "games",
};

const DATA_DECKS: Record<SupportedCategory, Card[]> = {
  games: [
    {
      title: "Tic Tac Toe",
      content: "A classic strategy game to pass the time.",
      component: <TicTacToe />,
    },
    {
      title: "Flip Tiles",
      content: "Flip cards to find matching pairs.",
      component: <FlipTiles />,
    },
    {
      title: "Reflex Test",
      content: "Test your reaction time with this quick challenge.",
      component: <ReflexTest />,
    },
  ],
  generalKnowledge: [
    {
      title: "Random Facts",
      component: <GeneralKnowledge />,
    },
  ],
  productivity: [
    {
      title: "Productivity Tip",
      component: <ProductivityTip />,
    },
    {
      title: "Speed Math",
      component: <SpeedMath />,
    },
    {
      title: "Speed Typing",
      component: <SpeedTyping />,
    },
  ],
  technology: [
    {
      title: "Tech Tip",
      content:
        "Use `Array.from()` to convert array-like objects into real arrays.",
    },
    {
      title: "Web Dev",
      content: "CSS Grid is more powerful than Flexbox for complex layouts.",
    },
  ],
  mindfulness: [
    {
      title: "Breathe",
      content: "Inhale for 4 seconds... Hold for 4... Exhale for 4.",
    },
    {
      title: "Focus",
      content: "Multitasking drops IQ by 10 points. Stay on this one task.",
    },
  ],
};

const ICONS: Record<SupportedCategory, JSX.Element> = {
  games: <Gamepad2 className="w-6 h-6 text-purple-400" />,
  generalKnowledge: <Brain className="w-6 h-6 text-blue-400" />,
  productivity: <ChartNoAxesCombined className="w-6 h-6 text-indigo-400" />,
  technology: <CodeXml className="w-6 h-6 text-cyan-400" />,
  mindfulness: <Coffee className="w-6 h-6 text-orange-400" />,
};

export default function WidgetCard({ category }: WidgetCardProps) {
  const mappedCategory = CATEGORY_MAP[category];

  const card = useMemo<Card>(() => {
    const deck = DATA_DECKS[mappedCategory];
    return deck[Math.floor(Math.random() * deck.length)];
  }, [mappedCategory]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl w-[55%] animate-fade-in mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-slate-700 rounded-full">
          {ICONS[mappedCategory]}
        </div>
        <h3 className="text-slate-200 font-bold text-lg uppercase tracking-wider">
          {category}
        </h3>
      </div>

      <div className="space-y-2">{card.component}</div>

      <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500">
        <span>FocusWhileAI</span>
        <span>{getCurrentSite()?.name || "LLM"} Generating Response...</span>
      </div>
    </div>
  );
}
