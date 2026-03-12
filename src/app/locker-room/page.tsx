"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getStats } from "@/lib/storage";
import { getRank, getWinRate } from "@/lib/utils";
import type { PlayerStats } from "@/lib/types";

export default function LockerRoomPage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="pixel-heading animate-pulse text-neon-cyan">LOADING...</p>
        </div>
      </div>
    );
  }

  const rank = getRank(stats);
  const winRate = getWinRate(stats);

  const rankColors: Record<string, string> = {
    ROOKIE: "text-zinc-400",
    BRAWLER: "text-neon-green neon-text-cyan",
    FIGHTER: "text-neon-cyan neon-text-cyan",
    CHAMPION: "text-neon-yellow neon-text-yellow",
    LEGEND: "text-neon-pink neon-text-pink",
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="pixel-heading mb-2 text-3xl font-black text-white">
          <span className="text-neon-yellow neon-text-yellow">LOCKER</span> ROOM
        </h1>
        <p className="mb-10 text-sm text-zinc-500">Your fighter profile.</p>

        {/* Rank card */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-dark-card/60 p-8 text-center">
          <p className="pixel-heading mb-2 text-xs text-zinc-500">RANK</p>
          <p
            className={`pixel-heading text-5xl font-black ${rankColors[rank] ?? "text-white"}`}
          >
            {rank}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {stats.totalCorrect} total correct answers
          </p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBox label="SESSIONS" value={stats.totalSessions} color="text-neon-cyan" />
          <StatBox label="WIN RATE" value={`${winRate}%`} color="text-neon-green" />
          <StatBox label="LONGEST COMBO" value={`${stats.longestCombo}x`} color="text-neon-yellow" />
          <StatBox
            label="CORRECT / WRONG"
            value={`${stats.totalCorrect} / ${stats.totalWrong}`}
            color="text-white"
          />
        </div>

        {/* Recent sessions */}
        <h2 className="pixel-heading mb-4 text-lg font-bold text-zinc-300">
          RECENT FIGHTS
        </h2>
        {stats.sessions.length === 0 ? (
          <p className="text-sm text-zinc-600">
            No fights yet. Hit the arena.
          </p>
        ) : (
          <div className="space-y-2">
            {stats.sessions.slice(0, 10).map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-dark-card/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`pixel-heading text-xs font-bold ${
                      s.mode === "boss"
                        ? "text-neon-pink"
                        : s.mode === "gauntlet"
                        ? "text-neon-yellow"
                        : "text-neon-cyan"
                    }`}
                  >
                    {s.mode.toUpperCase()}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {s.correct}/{s.totalCards} correct
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Combo: {s.longestCombo}x</span>
                  <span>{new Date(s.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-card/40 p-5 text-center">
      <p className={`pixel-heading text-2xl font-black ${color}`}>{value}</p>
      <p className="pixel-heading mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
