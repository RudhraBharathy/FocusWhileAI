import { JSX, useMemo } from "react";
import {
  TrendingUp,
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

type Card = {
  title: string;
  content: string;
  component?: JSX.Element;
};

type WidgetCardProps = {
  category: InterestId;
  siteConfig?: SiteConfig;
};

type SupportedCategory =
  | "games"
  | "generalKnowledge"
  | "finance"
  | "productivity"
  | "technology"
  | "mindfulness";

const CATEGORY_MAP: Record<InterestId, SupportedCategory> = {
  productivity: "productivity",
  technology: "technology",
  finance: "finance",
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
      title: "Fact",
      content:
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
    },
    {
      title: "Trivia",
      content:
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
    },
  ],
  finance: [
    {
      title: "Rule of 72",
      content:
        "Divide 72 by the interest rate to see how many years it takes to double your money.",
    },
    {
      title: "Market",
      content: "S&P 500 is technically a 'market-cap weighted' index.",
    },
  ],
  productivity: [
    {
      title: "JS Tip",
      content:
        "Use `console.table(array)` to view data as a clean table instead of a list.",
    },
    {
      title: "Regex",
      content: "/^[^@]+@[^@]+.[^@]+$/ checks for basic email validity.",
    },
    {
      title: "React",
      content:
        "The `useId` hook generates unique IDs for accessibility attributes.",
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
  finance: <TrendingUp className="w-6 h-6 text-green-400" />,
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
    <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl w-4/5 animate-fade-in mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-slate-700 rounded-full">
          {ICONS[mappedCategory]}
        </div>
        <h3 className="text-slate-200 font-bold text-lg uppercase tracking-wider">
          {category}
        </h3>
      </div>

      <div className="space-y-2">
        <h4 className="text-white text-2xl font-bold text-center mb-4">{card.title}</h4>
        {card.component}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500">
        <span>FocusWhileAI</span>
        <span>{getCurrentSite()?.name || "LLM"} Generating Response...</span>
      </div>
    </div>
  );
}
