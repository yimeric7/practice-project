export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  front: string;
  back: string;
  correctCount: number;
  wrongCount: number;
  lastReviewed: string | null;
}

export interface Mission {
  id: string;
  name: string;
  icon: string;
  difficulty: Difficulty;
  cards: Card[];
  createdAt: string;
}

export interface SessionResult {
  missionId: string;
  date: string;
  totalCards: number;
  correct: number;
  wrong: number;
  longestCombo: number;
  furyActivations: number;
  mode: "review" | "boss" | "gauntlet";
}

export interface PlayerStats {
  totalSessions: number;
  totalCorrect: number;
  totalWrong: number;
  longestCombo: number;
  lastPlayedDate: string | null;
  sessions: SessionResult[];
}
