export type DecisionOption = {
  id: string;
  label: string;
  weight: number;
};

export type DecisionWheel = {
  id: string;
  title: string;
  options: DecisionOption[];
  hideWeights: boolean;
  noRepeats: boolean;
  createdAt: number;
  updatedAt: number;
};

export type DecisionTool = "wheel" | "finger" | "number" | "coin";

export const WHEEL_SEGMENT_COLORS = [
  "#994D27", // cinnamon
  "#C48D49", // gold
  "#3E3F24", // olive
  "#214966", // navy
  "#BDA088", // taupe
  "#7A3E1F", // deep cinnamon
  "#DECCA7", // sand
  "#5C2F17", // darker cinnamon
] as const;

export const DEFAULT_TEMPLATES: Omit<
  DecisionWheel,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "What to drink?",
    hideWeights: false,
    noRepeats: false,
    options: [
      { id: "t1", label: "Espresso", weight: 2 },
      { id: "t2", label: "Cappuccino", weight: 2 },
      { id: "t3", label: "Flat White", weight: 2 },
      { id: "t4", label: "Americano", weight: 1 },
      { id: "t5", label: "Filter", weight: 1 },
      { id: "t6", label: "Cold Brew", weight: 1 },
    ],
  },
  {
    title: "Who goes first?",
    hideWeights: true,
    noRepeats: true,
    options: [
      { id: "t1", label: "Player 1", weight: 1 },
      { id: "t2", label: "Player 2", weight: 1 },
      { id: "t3", label: "Player 3", weight: 1 },
      { id: "t4", label: "Player 4", weight: 1 },
    ],
  },
  {
    title: "Truth or Dare",
    hideWeights: true,
    noRepeats: false,
    options: [
      { id: "t1", label: "Truth", weight: 1 },
      { id: "t2", label: "Dare", weight: 1 },
    ],
  },
  {
    title: "Dinner tonight?",
    hideWeights: false,
    noRepeats: false,
    options: [
      { id: "t1", label: "Italian", weight: 2 },
      { id: "t2", label: "Japanese", weight: 2 },
      { id: "t3", label: "Mexican", weight: 1 },
      { id: "t4", label: "Thai", weight: 1 },
      { id: "t5", label: "Stay in & cook", weight: 1 },
    ],
  },
  {
    title: "WEC vibe check",
    hideWeights: false,
    noRepeats: false,
    options: [
      { id: "t1", label: "Practice pours", weight: 2 },
      { id: "t2", label: "Cupping session", weight: 2 },
      { id: "t3", label: "Watch finals", weight: 1 },
      { id: "t4", label: "Rest day", weight: 1 },
      { id: "t5", label: "Dial in grind", weight: 2 },
    ],
  },
];
