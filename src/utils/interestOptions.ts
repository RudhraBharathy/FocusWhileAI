import {
  ChartNoAxesCombined,
  CodeXml,
  Coffee,
  Brain,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InterestId =
  | "productivity"
  | "games"
  | "generalKnowledge"
  | "technology"
  | "mindfulness";

export type InterestOption = {
  id: InterestId;
  label: string;
  icon: LucideIcon;
};

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: "productivity", label: "Productivity", icon: ChartNoAxesCombined },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "technology", label: "Technology", icon: CodeXml },
  { id: "mindfulness", label: "Mindfulness", icon: Coffee },
  { id: "generalKnowledge", label: "General Knowledge", icon: Brain },
];

export const DEFAULT_SELECTED: InterestId[] = [
  "games",
  "productivity",
] as const;
