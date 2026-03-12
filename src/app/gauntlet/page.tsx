"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FlashCard from "@/components/FlashCard";
import ComboMeter from "@/components/ComboMeter";
import HitEffect from "@/components/HitEffect";
import ZeroCommentary from "@/components/ZeroCommentary";
import { useReviewSession } from "@/lib/hooks";
import { getMissions, recordSession } from "@/lib/storage";
import { seededShuffle, getDailyGauntletSeed } from "@/lib/utils";
import type { Card } from "@/lib/types";

export default function GauntletPage() {
  const [allCards, setAllCards] = useState<Card[] | null>(null);

  useEffect(() => {
    const missions = getMissions();
    const cards = missions.flatMap((m) => m.cards);
    const seed = getDailyGauntletSeed();
    const shuffled = seededShuffle(cards, seed).slice(0, 20);
    setAllCards(shuffled);
  }, []);

  if (!allCards) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="pixel-heading animate-pulse text-neon-cyan">LOADING...</p>
        </div>
      </div>
    );
  }

  if (allCards.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <p className="pixel-heading text-neon-pink">
            NO CARDS IN ANY MISSION
          </p>
          <p className="text-sm text-zinc-500">
            Create missions and add cards first.
          </p>
          <Link href="/arena" className="text-sm text-neon-cyan hover:underline">
            GO TO ARENA
          </Link>
        </div>
      </div>
    );
  }

  return <GauntletSession cards={allCards} />;
}

function GauntletSession({ cards }: { cards: Card[] }) {
  // ONE LIFE — 1 health heart
  const session = useReviewSession(cards, 1);

  const handleCorrect = useCallback(() => session.gradeCorrect(), [session]);
  const handleWrong = useCallback(() => session.gradeWrong(), [session]);
  const handleEffectDone = useCallback(() => {
    session.clearEffect();
    if (session.phase === "fighting") session.next();
  }, [session]);

  useEffect(() => {
    if (session.phase === "complete" || session.phase === "defeated") {
      recordSession({
        missionId: "gauntlet",
        date: new Date().toISOString(),
        totalCards: cards.length,
        correct: session.correct,
        wrong: session.wrong,
        longestCombo: session.maxCombo,
        furyActivations: session.furyActivations,
        mode: "gauntlet",
      });
    }
  }, [session.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (session.phase === "complete" || session.phase === "defeated") {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
          <p
            className={`pixel-heading animate-slam-in mb-6 text-5xl font-black md:text-7xl ${
              session.phase === "complete"
                ? "text-neon-yellow neon-text-yellow"
                : "text-neon-pink neon-text-pink"
            }`}
          >
            {session.phase === "complete"
              ? "GAUNTLET CLEARED!"
              : "ONE SHOT. ONE MISS. GAME OVER."}
          </p>
          <div className="mb-8">
            <ZeroCommentary trigger={session.phase === "complete" ? "win" : "lose"} />
          </div>
          <p className="pixel-heading mb-8 text-lg text-neon-cyan">
            SURVIVED: {session.correct} / {cards.length}
          </p>
          <div className="flex gap-4">
            <Link
              href="/gauntlet"
              className="pixel-heading rounded-lg bg-neon-yellow/20 px-6 py-3 text-sm font-bold text-neon-yellow hover:bg-neon-yellow/30"
            >
              TRY AGAIN
            </Link>
            <Link
              href="/arena"
              className="pixel-heading rounded-lg border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 hover:text-white"
            >
              BACK TO ARENA
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <HitEffect type={session.lastEffect} onDone={handleEffectDone} />

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 text-center">
          <p className="pixel-heading text-lg font-bold text-neon-yellow neon-text-yellow">
            THE GAUNTLET
          </p>
          <p className="text-xs text-zinc-500">ONE LIFE. NO FURY. PURE SKILL.</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl">❤️</span>
          <p className="pixel-heading text-xs text-zinc-500">
            {session.currentIndex + 1} / {cards.length}
          </p>
        </div>

        <div className="mb-6 min-h-[60px]">
          <ComboMeter count={session.comboCount} />
        </div>

        {session.currentCard && (
          <div key={session.currentCard.id}>
            <FlashCard
              front={session.currentCard.front}
              back={session.currentCard.back}
              isFlipped={session.isFlipped}
              onFlip={session.flip}
            />
          </div>
        )}

        {session.isFlipped && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCorrect}
              className="pixel-heading rounded-xl bg-neon-green/20 px-8 py-4 text-lg font-black text-neon-green transition-all hover:bg-neon-green/30"
            >
              HIT! ✓
            </button>
            <button
              onClick={handleWrong}
              className="pixel-heading rounded-xl bg-neon-pink/20 px-8 py-4 text-lg font-black text-neon-pink transition-all hover:bg-neon-pink/30"
            >
              BLOCKED ✗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
