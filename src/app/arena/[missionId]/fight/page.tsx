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
import { getMission, saveMission } from "@/lib/storage";
import { recordSession } from "@/lib/storage";
import { shuffleArray } from "@/lib/utils";
import type { Card, Mission } from "@/lib/types";

export default function FightPage() {
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

  if (!mission || mission.cards.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <p className="pixel-heading text-neon-pink">NO CARDS TO FIGHT</p>
          <Link href="/arena" className="text-sm text-neon-cyan hover:underline">
            BACK TO ARENA
          </Link>
        </div>
      </div>
    );
  }

  return <FightSession mission={mission} />;
}

function FightSession({ mission }: { mission: Mission }) {
  const shuffled = useMemo(() => shuffleArray(mission.cards), [mission.cards]);
  const session = useReviewSession(shuffled, 3);

  const handleCorrect = useCallback(() => {
    session.gradeCorrect();
  }, [session]);

  const handleWrong = useCallback(() => {
    session.gradeWrong();
  }, [session]);

  const handleEffectDone = useCallback(() => {
    session.clearEffect();
    if (session.phase === "fighting") {
      session.next();
    }
  }, [session]);

  // Save results when session ends
  useEffect(() => {
    if (session.phase === "complete" || session.phase === "defeated") {
      // Update card stats
      const updatedCards = mission.cards.map((c) => {
        const reviewed = shuffled.find((s) => s.id === c.id);
        if (!reviewed) return c;
        return { ...c, ...reviewed };
      });
      saveMission({ ...mission, cards: updatedCards });

      recordSession({
        missionId: mission.id,
        date: new Date().toISOString(),
        totalCards: shuffled.length,
        correct: session.correct,
        wrong: session.wrong,
        longestCombo: session.maxCombo,
        furyActivations: session.furyActivations,
        mode: "review",
      });
    }
  }, [session.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Game over screen
  if (session.phase === "complete" || session.phase === "defeated") {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
          <div className="mb-6 animate-slam-in">
            <p
              className={`pixel-heading text-5xl font-black md:text-7xl ${
                session.phase === "complete"
                  ? "text-neon-green neon-text-cyan"
                  : "text-neon-pink neon-text-pink"
              }`}
            >
              {session.phase === "complete" ? "MISSION COMPLETE!" : "DEFEATED!"}
            </p>
          </div>

          <div className="mb-8">
            <ZeroCommentary
              trigger={session.phase === "complete" ? "win" : "lose"}
            />
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <Stat label="CORRECT" value={session.correct} color="text-neon-green" />
            <Stat label="WRONG" value={session.wrong} color="text-neon-pink" />
            <Stat label="MAX COMBO" value={`${session.maxCombo}x`} color="text-neon-yellow" />
            <Stat label="FURY" value={session.furyActivations} color="text-neon-cyan" />
          </div>

          <div className="flex gap-4">
            <Link
              href={`/arena/${mission.id}/fight`}
              className="pixel-heading rounded-lg bg-neon-cyan/20 px-6 py-3 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/30"
            >
              FIGHT AGAIN
            </Link>
            <Link
              href={`/arena/${mission.id}`}
              className="pixel-heading rounded-lg border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 hover:text-white"
            >
              BACK TO MISSION
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
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <HealthBar current={session.health} max={session.maxHealth} />
          <div className="text-right">
            <p className="pixel-heading text-xs text-zinc-500">
              {session.currentIndex + 1} / {session.cards.length}
            </p>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-neon-cyan transition-all"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combo meter */}
        <div className="mb-6 min-h-[60px]">
          <ComboMeter count={session.comboCount} />
        </div>

        {/* Card */}
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

        {/* Grade buttons */}
        {session.isFlipped && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCorrect}
              className="pixel-heading rounded-xl bg-neon-green/20 px-8 py-4 text-lg font-black text-neon-green transition-all hover:bg-neon-green/30 hover:shadow-[0_0_20px_#39ff1430]"
            >
              HIT! ✓
            </button>
            <button
              onClick={handleWrong}
              className="pixel-heading rounded-xl bg-neon-pink/20 px-8 py-4 text-lg font-black text-neon-pink transition-all hover:bg-neon-pink/30 hover:shadow-[0_0_20px_#ff2d9530]"
            >
              BLOCKED ✗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-card/40 p-4">
      <p className={`pixel-heading text-2xl font-black ${color}`}>{value}</p>
      <p className="pixel-heading mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
