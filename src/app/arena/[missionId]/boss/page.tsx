"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FlashCard from "@/components/FlashCard";
import ComboMeter from "@/components/ComboMeter";
import HealthBar from "@/components/HealthBar";
import HitEffect from "@/components/HitEffect";
import FuryOverlay from "@/components/FuryOverlay";
import ZeroCommentary from "@/components/ZeroCommentary";
import { useReviewSession } from "@/lib/hooks";
import { getMission, saveMission, recordSession } from "@/lib/storage";
import type { Mission } from "@/lib/types";

export default function BossPage() {
  const params = useParams();
  const missionId = params.missionId as string;
  const [mission, setMission] = useState<Mission | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMission(getMission(missionId) ?? null);
    setLoaded(true);
  }, [missionId]);

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

  if (!mission || mission.cards.length < 5) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <p className="pixel-heading text-neon-pink">NOT ENOUGH COMBOS FOR A BOSS FIGHT</p>
          <Link href="/arena" className="text-sm text-neon-cyan hover:underline">
            BACK TO ARENA
          </Link>
        </div>
      </div>
    );
  }

  return <BossSession mission={mission} />;
}

function BossSession({ mission }: { mission: Mission }) {
  // Pick hardest cards (highest wrong/correct ratio)
  const hardestCards = useMemo(() => {
    const sorted = [...mission.cards].sort((a, b) => {
      const ratioA = a.wrongCount / (a.correctCount + 1);
      const ratioB = b.wrongCount / (b.correctCount + 1);
      return ratioB - ratioA;
    });
    return sorted.slice(0, 10);
  }, [mission.cards]);

  const session = useReviewSession(hardestCards, 3);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (session.phase !== "fighting") return;
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => clearInterval(interval);
  }, [session.phase, startTime]);

  const handleCorrect = useCallback(() => session.gradeCorrect(), [session]);
  const handleWrong = useCallback(() => session.gradeWrong(), [session]);
  const handleEffectDone = useCallback(() => {
    session.clearEffect();
    if (session.phase === "fighting") session.next();
  }, [session]);

  useEffect(() => {
    if (session.phase === "complete" || session.phase === "defeated") {
      const updatedCards = mission.cards.map((c) => {
        const reviewed = hardestCards.find((s) => s.id === c.id);
        if (!reviewed) return c;
        return { ...c, ...reviewed };
      });
      saveMission({ ...mission, cards: updatedCards });
      recordSession({
        missionId: mission.id,
        date: new Date().toISOString(),
        totalCards: hardestCards.length,
        correct: session.correct,
        wrong: session.wrong,
        longestCombo: session.maxCombo,
        furyActivations: session.furyActivations,
        mode: "boss",
      });
    }
  }, [session.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const bossHealth = Math.max(
    0,
    ((hardestCards.length - session.correct) / hardestCards.length) * 100
  );
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

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
            {session.phase === "complete" ? "K.O.!" : "YOU HAVE BEEN DEFEATED"}
          </p>
          <div className="mb-8">
            <ZeroCommentary trigger={session.phase === "complete" ? "win" : "lose"} />
          </div>
          <p className="pixel-heading mb-8 text-sm text-zinc-500">
            TIME: {formatTime(elapsed)}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/arena/${mission.id}/boss`}
              className="pixel-heading rounded-lg bg-neon-pink/20 px-6 py-3 text-sm font-bold text-neon-pink hover:bg-neon-pink/30"
            >
              REMATCH
            </Link>
            <Link
              href={`/arena/${mission.id}`}
              className="pixel-heading rounded-lg border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 hover:text-white"
            >
              RETREAT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <FuryOverlay active={session.isFury} />
      <HitEffect type={session.lastEffect} onDone={handleEffectDone} />

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Boss health bar */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between">
            <p className="pixel-heading text-xs text-neon-pink">
              BOSS — GLITCH
            </p>
            <p className="pixel-heading text-xs text-zinc-500">
              {formatTime(elapsed)}
            </p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-yellow transition-all duration-300"
              style={{ width: `${bossHealth}%` }}
            />
          </div>
        </div>

        {/* Player health */}
        <div className="mb-8 flex items-center justify-between">
          <HealthBar current={session.health} max={session.maxHealth} />
          <p className="pixel-heading text-xs text-zinc-500">
            {session.currentIndex + 1} / {hardestCards.length}
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
