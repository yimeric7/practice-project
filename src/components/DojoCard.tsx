"use client";

import Link from "next/link";
import { Dojo, SEASON_EMOJIS, SEASON_LABELS } from "@/lib/types";
import { getScrollsDueForReview } from "@/lib/sm2";

export default function DojoCard({ dojo }: { dojo: Dojo }) {
  const due = getScrollsDueForReview(dojo.scrolls).length;
  const seasonEmoji = SEASON_EMOJIS[dojo.season];
  const seasonLabel = SEASON_LABELS[dojo.season];

  return (
    <Link href={`/dojo/${dojo.id}`}>
      <div
        className="group relative rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-current/10"
        style={{
          background: `linear-gradient(135deg, ${dojo.color}22, ${dojo.color}44)`,
          borderColor: `${dojo.color}33`,
        }}
      >
        {/* Roof */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{dojo.emoji}</span>
          <div>
            <h3 className="font-bold text-lg leading-tight">{dojo.name}</h3>
            <span className="text-xs opacity-60">
              {seasonEmoji} {seasonLabel} · {dojo.scrolls.length} scrolls
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-70">
            {dojo.totalReviews} reviews
          </span>
          {due > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "var(--sakura)",
                color: "white",
              }}
            >
              {due} due
            </span>
          )}
        </div>

        {/* Tiny decorative element */}
        <div className="absolute top-2 right-3 opacity-20 text-xs group-hover:opacity-40 transition-opacity">
          🏯
        </div>
      </div>
    </Link>
  );
}
