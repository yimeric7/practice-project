import type { Mission, PlayerStats, SessionResult } from "./types";

const MISSIONS_KEY = "combo-recall-missions";
const STATS_KEY = "combo-recall-stats";

const defaultStats: PlayerStats = {
  totalSessions: 0,
  totalCorrect: 0,
  totalWrong: 0,
  longestCombo: 0,
  lastPlayedDate: null,
  sessions: [],
};

export function getMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMissions(missions: Mission[]): void {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

export function getMission(id: string): Mission | undefined {
  return getMissions().find((m) => m.id === id);
}

export function saveMission(mission: Mission): void {
  const missions = getMissions();
  const idx = missions.findIndex((m) => m.id === mission.id);
  if (idx >= 0) {
    missions[idx] = mission;
  } else {
    missions.push(mission);
  }
  saveMissions(missions);
}

export function deleteMission(id: string): void {
  saveMissions(getMissions().filter((m) => m.id !== id));
}

export function getStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...defaultStats, ...JSON.parse(raw) } : { ...defaultStats };
  } catch {
    return { ...defaultStats };
  }
}

export function saveStats(stats: PlayerStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordSession(result: SessionResult): void {
  const stats = getStats();
  stats.totalSessions++;
  stats.totalCorrect += result.correct;
  stats.totalWrong += result.wrong;
  if (result.longestCombo > stats.longestCombo) {
    stats.longestCombo = result.longestCombo;
  }
  stats.lastPlayedDate = new Date().toISOString().slice(0, 10);
  stats.sessions.unshift(result);
  if (stats.sessions.length > 50) stats.sessions = stats.sessions.slice(0, 50);
  saveStats(stats);
}
