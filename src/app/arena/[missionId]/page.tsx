"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ZeroCommentary from "@/components/ZeroCommentary";
import { getMission, saveMission } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Card, Mission } from "@/lib/types";

export default function MissionDetailPage() {
  const params = useParams();
  const missionId = params.missionId as string;
  const [mission, setMission] = useState<Mission | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const reload = useCallback(() => {
    const m = getMission(missionId);
    setMission(m ?? null);
    setLoaded(true);
  }, [missionId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCard = () => {
    if (!mission || !front.trim() || !back.trim()) return;
    const card: Card = {
      id: generateId(),
      front: front.trim(),
      back: back.trim(),
      correctCount: 0,
      wrongCount: 0,
      lastReviewed: null,
    };
    const updated = { ...mission, cards: [...mission.cards, card] };
    saveMission(updated);
    setFront("");
    setBack("");
    setShowAdd(false);
    reload();
  };

  const deleteCard = (cardId: string) => {
    if (!mission) return;
    const updated = {
      ...mission,
      cards: mission.cards.filter((c) => c.id !== cardId),
    };
    saveMission(updated);
    reload();
  };

  const startEditCard = (card: Card) => {
    setEditingCard(card.id);
    setFront(card.front);
    setBack(card.back);
  };

  const saveEditCard = () => {
    if (!mission || !editingCard || !front.trim() || !back.trim()) return;
    const updated = {
      ...mission,
      cards: mission.cards.map((c) =>
        c.id === editingCard ? { ...c, front: front.trim(), back: back.trim() } : c
      ),
    };
    saveMission(updated);
    setEditingCard(null);
    setFront("");
    setBack("");
    reload();
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="pixel-heading animate-pulse text-neon-cyan">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <p className="pixel-heading text-neon-pink">MISSION NOT FOUND</p>
          <Link href="/arena" className="text-sm text-neon-cyan hover:underline">
            BACK TO ARENA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/arena"
            className="mb-4 inline-block text-xs text-zinc-500 hover:text-neon-cyan"
          >
            ← BACK TO ARENA
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{mission.icon}</span>
            <div>
              <h1 className="pixel-heading text-2xl font-black text-white">
                {mission.name}
              </h1>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < mission.difficulty ? "text-neon-yellow" : "text-zinc-700"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href={mission.cards.length > 0 ? `/arena/${mission.id}/fight` : "#"}
            className={`pixel-heading rounded-lg px-6 py-3 text-sm font-bold transition-all ${
              mission.cards.length > 0
                ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                : "cursor-not-allowed bg-zinc-800 text-zinc-600"
            }`}
          >
            START FIGHT ({mission.cards.length} cards)
          </Link>
          <Link
            href={mission.cards.length >= 5 ? `/arena/${mission.id}/boss` : "#"}
            className={`pixel-heading rounded-lg px-6 py-3 text-sm font-bold transition-all ${
              mission.cards.length >= 5
                ? "border border-neon-pink/40 bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20"
                : "cursor-not-allowed bg-zinc-800 text-zinc-600"
            }`}
          >
            BOSS FIGHT {mission.cards.length < 5 ? `(need ${5 - mission.cards.length} more)` : ""}
          </Link>
        </div>

        {/* Card list */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="pixel-heading text-lg font-bold text-zinc-300">
            COMBO MOVES ({mission.cards.length})
          </h2>
          <button
            onClick={() => {
              setShowAdd(true);
              setFront("");
              setBack("");
              setEditingCard(null);
            }}
            className="pixel-heading rounded-lg border border-neon-cyan/30 px-4 py-2 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/10"
          >
            + ADD COMBO
          </button>
        </div>

        {/* Add card form */}
        {showAdd && (
          <div className="mb-6 rounded-xl border border-neon-cyan/20 bg-dark-card/60 p-5">
            <div className="mb-3">
              <label className="mb-1 block text-xs font-bold text-zinc-400">
                FRONT (QUESTION)
              </label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-dark-bg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-neon-cyan focus:outline-none"
                rows={2}
                placeholder="What does the card show?"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-bold text-zinc-400">
                BACK (ANSWER)
              </label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-dark-bg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-neon-cyan focus:outline-none"
                rows={2}
                placeholder="What's the answer?"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addCard}
                className="pixel-heading rounded-lg bg-neon-cyan/20 px-5 py-2 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/30"
              >
                ADD
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Cards */}
        {mission.cards.length === 0 ? (
          <div className="py-16 text-center">
            <ZeroCommentary trigger="empty" />
          </div>
        ) : (
          <div className="space-y-3">
            {mission.cards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl border border-zinc-800 bg-dark-card/40 p-4 transition-all hover:border-zinc-700"
              >
                {editingCard === card.id ? (
                  <div>
                    <textarea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      className="mb-2 w-full rounded-lg border border-zinc-700 bg-dark-bg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
                      rows={2}
                    />
                    <textarea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      className="mb-3 w-full rounded-lg border border-zinc-700 bg-dark-bg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditCard}
                        className="pixel-heading text-xs font-bold text-neon-cyan hover:underline"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={() => setEditingCard(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{card.front}</p>
                      <p className="mt-1 text-sm text-zinc-500">{card.back}</p>
                      {card.lastReviewed && (
                        <p className="mt-1 text-xs text-zinc-600">
                          ✓ {card.correctCount} / ✗ {card.wrongCount}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => startEditCard(card)}
                        className="text-xs text-zinc-600 hover:text-neon-cyan"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="text-xs text-zinc-600 hover:text-neon-pink"
                      >
                        DEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
