"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Dojo, Scroll } from "@/lib/types";
import { loadDojos, updateDojo, computeSeason } from "@/lib/storage";
import { reviewScroll, getScrollsDueForReview } from "@/lib/sm2";
import Mochi from "@/components/Mochi";

export default function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const studyAll = searchParams.get("all") === "true";

  const [dojo, setDojo] = useState<Dojo | null>(null);
  const [queue, setQueue] = useState<Scroll[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    const dojos = loadDojos();
    const found = dojos.find((d) => d.id === id);
    if (found) {
      setDojo(found);
      const cards = studyAll
        ? [...found.scrolls]
        : getScrollsDueForReview(found.scrolls);
      // Shuffle
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      setQueue(cards);
      if (cards.length === 0) setSessionDone(true);
    }
  }, [id, studyAll]);

  const handleAnswer = useCallback(
    (quality: number) => {
      if (!dojo || currentIndex >= queue.length) return;

      const scroll = queue[currentIndex];
      const updated = reviewScroll(scroll, quality);

      // Update dojo
      const newScrolls = dojo.scrolls.map((s) =>
        s.id === scroll.id ? updated : s
      );
      const newDojo = {
        ...dojo,
        scrolls: newScrolls,
        totalReviews: dojo.totalReviews + 1,
        season: computeSeason({ ...dojo, totalReviews: dojo.totalReviews + 1 }),
      };
      updateDojo(newDojo);
      setDojo(newDojo);

      // Track results
      const isCorrect = quality >= 3;
      setLastResult(isCorrect ? "correct" : "wrong");
      setStats((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        wrong: s.wrong + (isCorrect ? 0 : 1),
      }));
      setStreak(isCorrect ? streak + 1 : 0);

      // Next card
      setTimeout(() => {
        setFlipped(false);
        setLastResult(null);
        if (currentIndex + 1 >= queue.length) {
          setSessionDone(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 600);
    },
    [dojo, currentIndex, queue, streak]
  );

  if (!dojo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-50">Loading...</p>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Mochi
          mood={stats.correct > stats.wrong ? "excited" : "happy"}
          showWisdom
        />
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold mb-2">
            {queue.length === 0 ? "No scrolls to review" : "🍵 Session Complete"}
          </h2>
          {queue.length > 0 && (
            <div className="flex gap-6 justify-center text-sm mb-4">
              <span style={{ color: "var(--moss)" }}>
                ✓ {stats.correct} correct
              </span>
              <span style={{ color: "var(--sakura)" }}>
                ✗ {stats.wrong} wrong
              </span>
            </div>
          )}
          <Link
            href={`/dojo/${dojo.id}`}
            className="inline-block px-6 py-2 rounded-xl font-medium text-white mt-2"
            style={{ background: "var(--moss)" }}
          >
            Back to Dojo
          </Link>
        </div>
      </div>
    );
  }

  const current = queue[currentIndex];

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/dojo/${dojo.id}`}
          className="text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          ← Back
        </Link>
        <span className="text-sm opacity-60">
          {currentIndex + 1} / {queue.length}
        </span>
        {streak >= 3 && (
          <span className="text-sm" style={{ color: "var(--lantern)" }}>
            🔥 {streak}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full mb-8 overflow-hidden"
        style={{ background: `${dojo.color}22` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            background: dojo.color,
            width: `${((currentIndex + 1) / queue.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`w-full rounded-2xl p-8 text-center cursor-pointer select-none transition-all duration-300 border-2 ${
            lastResult === "correct"
              ? "animate-celebration"
              : lastResult === "wrong"
              ? "animate-wobble"
              : ""
          }`}
          style={{
            background: "var(--scroll)",
            borderColor:
              lastResult === "correct"
                ? "var(--moss)"
                : lastResult === "wrong"
                ? "var(--sakura)"
                : "var(--bark-light)",
            minHeight: "200px",
          }}
          onClick={() => !flipped && setFlipped(true)}
        >
          {!flipped ? (
            <div className="animate-unroll">
              <div className="text-xs opacity-40 mb-4 uppercase tracking-wider">
                Scroll Front
              </div>
              <div className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                {current.front}
              </div>
              <div className="text-xs opacity-30 mt-6">Tap to reveal</div>
            </div>
          ) : (
            <div className="animate-unroll">
              <div className="text-xs opacity-40 mb-4 uppercase tracking-wider">
                Scroll Back
              </div>
              <div className="text-lg" style={{ color: "var(--ink)" }}>
                {current.back}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Answer buttons */}
      {flipped && !lastResult && (
        <div className="flex gap-3 mt-8 justify-center">
          <button
            onClick={() => handleAnswer(1)}
            className="px-5 py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--sakura)" }}
          >
            Forgot
          </button>
          <button
            onClick={() => handleAnswer(3)}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 border"
            style={{ borderColor: "var(--bark-light)" }}
          >
            Hard
          </button>
          <button
            onClick={() => handleAnswer(4)}
            className="px-5 py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--moss)" }}
          >
            Good
          </button>
          <button
            onClick={() => handleAnswer(5)}
            className="px-5 py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--water)" }}
          >
            Easy
          </button>
        </div>
      )}

      {/* Mochi at bottom */}
      <div className="flex justify-center mt-8">
        <Mochi
          mood={
            lastResult === "correct"
              ? "excited"
              : lastResult === "wrong"
              ? "blanket"
              : streak >= 3
              ? "excited"
              : "happy"
          }
        />
      </div>
    </div>
  );
}
