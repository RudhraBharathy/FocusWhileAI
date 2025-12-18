import {
  ChartNoAxesCombined,
  CodeXml,
  TrendingUp,
  Coffee,
  Brain,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InterestId =
  | "games"
  | "generalKnowledge"
  | "finance"
  | "productivity"
  | "technology"
  | "mindfulness";

export type InterestOption = {
  id: InterestId;
  label: string;
  icon: LucideIcon;
};

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: "productivity", label: "Productivity", icon: ChartNoAxesCombined },
  { id: "technology", label: "Technology", icon: CodeXml },
  { id: "finance", label: "Finance & Market", icon: TrendingUp },
  { id: "mindfulness", label: "Mindfulness", icon: Coffee },
  { id: "generalKnowledge", label: "General Knowledge", icon: Brain },
  { id: "games", label: "Games", icon: Gamepad2 },
];

export const DEFAULT_SELECTED: InterestId[] = [
  "games",
  "generalKnowledge",
] as const;
