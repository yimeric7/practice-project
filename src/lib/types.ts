export type Season = "spring" | "summer" | "autumn" | "winter";

export interface Scroll {
  id: string;
  front: string;
  back: string;
  // SM-2 fields
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number; // timestamp
  lastReview: number | null;
}

export interface Dojo {
  id: string;
  name: string;
  emoji: string;
  color: string;
  scrolls: Scroll[];
  season: Season;
  createdAt: number;
  totalReviews: number;
}

export interface StudyResult {
  scrollId: string;
  quality: number; // 0-5 SM-2 quality rating
}

export const SEASON_COLORS: Record<Season, string> = {
  spring: "#c8e6c9",
  summer: "#fff9c4",
  autumn: "#ffccbc",
  winter: "#e1f5fe",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export const SEASON_EMOJIS: Record<Season, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

export const PAINT_SET = [
  "#e8a0b4", // sakura pink
  "#7a9e7e", // moss green
  "#8b6f47", // bark brown
  "#8bb8c4", // water blue
  "#e8c170", // lantern gold
  "#c4a87c", // sand
  "#b07aa1", // wisteria
  "#d4695a", // autumn red
];
