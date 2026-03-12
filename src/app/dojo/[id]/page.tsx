"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dojo, SEASON_EMOJIS, SEASON_LABELS } from "@/lib/types";
import { loadDojos, updateDojo, deleteDojo, computeSeason } from "@/lib/storage";
import { createScroll, getScrollsDueForReview } from "@/lib/sm2";

export default function DojoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [dojo, setDojo] = useState<Dojo | null>(null);
  const [showAddScroll, setShowAddScroll] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    const dojos = loadDojos();
    const found = dojos.find((d) => d.id === id);
    if (found) {
      found.season = computeSeason(found);
      setDojo(found);
    }
  }, [id]);

  function handleAddScroll() {
    if (!dojo || !front.trim() || !back.trim()) return;
    const scroll = createScroll(front.trim(), back.trim());
    const updated = { ...dojo, scrolls: [...dojo.scrolls, scroll] };
    updateDojo(updated);
    setDojo(updated);
    setFront("");
    setBack("");
    setShowAddScroll(false);
  }

  function handleDelete() {
    if (!dojo) return;
    if (!confirm("Close this dojo? The scrolls will be lost to the wind...")) return;
    deleteDojo(dojo.id);
    router.push("/");
  }

  if (!dojo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-50">Dojo not found...</p>
      </div>
    );
  }

  const due = getScrollsDueForReview(dojo.scrolls);

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100 mb-6 transition-opacity"
      >
        ← Village
      </Link>

      {/* Dojo header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, ${dojo.color}22, ${dojo.color}44)`,
        }}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{dojo.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{dojo.name}</h1>
            <p className="text-sm opacity-60">
              {SEASON_EMOJIS[dojo.season]} {SEASON_LABELS[dojo.season]} ·{" "}
              {dojo.scrolls.length} scrolls · {dojo.totalReviews} reviews
            </p>
          </div>
        </div>

        {/* Season progress */}
        <div className="flex gap-1 mt-3">
          {(["spring", "summer", "autumn", "winter"] as const).map((s) => (
            <div
              key={s}
              className="h-2 flex-1 rounded-full transition-all"
              style={{
                background:
                  s === dojo.season
                    ? dojo.color
                    : `${dojo.color}22`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Study button */}
      {dojo.scrolls.length > 0 && (
        <div className="flex gap-3 mb-6">
          <Link
            href={`/dojo/${dojo.id}/study`}
            className="flex-1 text-center px-4 py-3 rounded-xl font-medium text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: "var(--moss)" }}
          >
            🍵 Tea Ceremony
            {due.length > 0 && (
              <span className="ml-2 text-xs opacity-80">
                ({due.length} scrolls ready)
              </span>
            )}
          </Link>
          {dojo.scrolls.length > due.length && (
            <Link
              href={`/dojo/${dojo.id}/study?all=true`}
              className="px-4 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-95 border"
              style={{ borderColor: "var(--bark-light)" }}
            >
              Study All
            </Link>
          )}
        </div>
      )}

      {/* Scrolls list */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">📜 Scrolls</h2>
          <button
            onClick={() => setShowAddScroll(true)}
            className="text-sm px-3 py-1 rounded-lg transition-all hover:scale-105"
            style={{ background: `${dojo.color}33` }}
          >
            + Add Scroll
          </button>
        </div>

        {dojo.scrolls.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-8">
            No scrolls yet. Add your first one to begin training!
          </p>
        ) : (
          <div className="space-y-2">
            {dojo.scrolls.map((scroll) => (
              <div
                key={scroll.id}
                className="rounded-xl px-4 py-3 border"
                style={{
                  background: "var(--scroll)",
                  borderColor: "var(--bark-light)",
                }}
              >
                <div className="font-medium text-sm">{scroll.front}</div>
                <div className="text-xs opacity-50 mt-1 truncate">
                  {scroll.back}
                </div>
                <div className="text-xs opacity-40 mt-1">
                  {scroll.repetitions > 0
                    ? `Reviewed ${scroll.repetitions}× · Next: ${new Date(scroll.nextReview).toLocaleDateString()}`
                    : "New — awaiting first review"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add scroll form */}
      {showAddScroll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowAddScroll(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-md w-full shadow-xl"
            style={{ background: "var(--background)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">📜 New Scroll</h2>

            <label className="block text-sm mb-1 opacity-70">Front</label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Question or term..."
              className="w-full px-3 py-2 rounded-lg border mb-3 text-sm resize-none"
              rows={2}
              style={{
                background: "var(--scroll)",
                borderColor: "var(--bark-light)",
                color: "var(--foreground)",
              }}
              autoFocus
            />

            <label className="block text-sm mb-1 opacity-70">Back</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Answer or definition..."
              className="w-full px-3 py-2 rounded-lg border mb-4 text-sm resize-none"
              rows={2}
              style={{
                background: "var(--scroll)",
                borderColor: "var(--bark-light)",
                color: "var(--foreground)",
              }}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddScroll(false)}
                className="px-4 py-2 rounded-lg text-sm opacity-70 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScroll}
                disabled={!front.trim() || !back.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
                style={{ background: dojo.color }}
              >
                Add Scroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="pt-8 border-t border-current/10">
        <button
          onClick={handleDelete}
          className="text-xs opacity-40 hover:opacity-70 transition-opacity"
        >
          Close this dojo...
        </button>
      </div>
    </div>
  );
}
