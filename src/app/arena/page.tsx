"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ZeroCommentary from "@/components/ZeroCommentary";
import ZeroMascot from "@/components/ZeroMascot";
import { useMissions } from "@/lib/hooks";
import { generateId } from "@/lib/utils";
import type { Difficulty, Mission } from "@/lib/types";

const ICONS = ["⚔️", "🔥", "💀", "🐉", "🧠", "⚡", "🎯", "🗡️", "🛡️", "👾", "🏴‍☠️", "🎮"];

export default function ArenaPage() {
  const { missions, loaded, addMission, deleteMission } = useMissions();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚔️");
  const [difficulty, setDifficulty] = useState<Difficulty>(1);

  const handleCreate = () => {
    if (!name.trim()) return;
    const mission: Mission = {
      id: generateId(),
      name: name.trim(),
      icon,
      difficulty,
      cards: [],
      createdAt: new Date().toISOString(),
    };
    addMission(mission);
    setName("");
    setIcon("⚔️");
    setDifficulty(1);
    setShowForm(false);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="pixel-heading text-neon-cyan animate-pulse">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="pixel-heading text-3xl font-black text-white">
              <span className="text-neon-pink neon-text-pink">MISSION</span> SELECT
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Choose your battleground or create a new one.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="pixel-heading rounded-lg border border-neon-pink/40 bg-neon-pink/10 px-5 py-2.5 text-sm font-bold text-neon-pink transition-all hover:bg-neon-pink/20"
          >
            + NEW MISSION
          </button>
        </div>

        {/* Create mission form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-neon-cyan/30 bg-dark-card/60 p-6 backdrop-blur-sm">
            <h3 className="pixel-heading mb-4 text-lg font-bold text-neon-cyan">
              CREATE MISSION
            </h3>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-bold text-zinc-400">
                MISSION NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. JavaScript Fundamentals"
                className="w-full rounded-lg border border-zinc-700 bg-dark-bg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-neon-cyan focus:outline-none"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-bold text-zinc-400">
                ICON
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`rounded-lg border px-3 py-2 text-xl transition-all ${
                      icon === ic
                        ? "border-neon-cyan bg-neon-cyan/20"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-1 block text-xs font-bold text-zinc-400">
                DIFFICULTY
              </label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`pixel-heading rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
                      difficulty >= d
                        ? "border-neon-yellow/50 bg-neon-yellow/20 text-neon-yellow"
                        : "border-zinc-700 text-zinc-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="pixel-heading rounded-lg bg-neon-cyan/20 px-6 py-2.5 text-sm font-bold text-neon-cyan transition-all hover:bg-neon-cyan/30"
              >
                CREATE
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="pixel-heading rounded-lg px-6 py-2.5 text-sm font-bold text-zinc-500 transition-all hover:text-zinc-300"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Mission grid */}
        {missions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <ZeroMascot mood="taunt" showQuote />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((m) => (
              <div
                key={m.id}
                className="group relative rounded-2xl border border-zinc-800 bg-dark-card/60 p-5 transition-all hover:border-neon-cyan/40 hover:shadow-[0_0_20px_#00f0ff15]"
              >
                <button
                  onClick={() => {
                    if (confirm(`Delete mission "${m.name}"?`)) {
                      deleteMission(m.id);
                    }
                  }}
                  className="absolute right-3 top-3 text-xs text-zinc-600 opacity-0 transition-opacity hover:text-neon-pink group-hover:opacity-100"
                >
                  ✕
                </button>
                <Link href={`/arena/${m.id}`} className="block">
                  <div className="mb-3 text-3xl">{m.icon}</div>
                  <h3 className="pixel-heading mb-1 text-base font-black text-white">
                    {m.name}
                  </h3>
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < m.difficulty
                            ? "text-neon-yellow"
                            : "text-zinc-700"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {m.cards.length} combo{m.cards.length !== 1 ? "s" : ""} loaded
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
