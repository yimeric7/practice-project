import type { PlayerStats } from "./types";

export function generateId(): string {
  return crypto.randomUUID();
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Seeded shuffle for daily gauntlet (same order all day) */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) | 0;
  }
  const next = () => {
    s = (s * 1103515245 + 12345) | 0;
    return ((s >>> 16) & 0x7fff) / 0x7fff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRank(stats: PlayerStats): string {
  const c = stats.totalCorrect;
  if (c >= 1000) return "LEGEND";
  if (c >= 500) return "CHAMPION";
  if (c >= 200) return "FIGHTER";
  if (c >= 50) return "BRAWLER";
  return "ROOKIE";
}

export function getWinRate(stats: PlayerStats): number {
  if (stats.totalSessions === 0) return 0;
  const wins = stats.sessions.filter(
    (s) => s.correct > 0 && s.wrong < s.totalCards
  ).length;
  return Math.round((wins / stats.totalSessions) * 100);
}

export function getDailyGauntletSeed(): string {
  return new Date().toISOString().slice(0, 10);
}
