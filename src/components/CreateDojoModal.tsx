"use client";

import { useState } from "react";
import { Dojo, PAINT_SET } from "@/lib/types";
import { addDojo } from "@/lib/storage";

const EMOJI_OPTIONS = [
  "🐻", "🦊", "🐸", "🐢", "🦉", "🐰", "🐱", "🐼",
  "🦝", "🐨", "🦎", "🐿️", "🦋", "🐲", "🦅", "🐍",
];

export default function CreateDojoModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (dojo: Dojo) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🦊");
  const [color, setColor] = useState(PAINT_SET[0]);

  function handleCreate() {
    if (!name.trim()) return;
    const dojo: Dojo = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      color,
      scrolls: [],
      season: "spring",
      createdAt: Date.now(),
      totalReviews: 0,
    };
    addDojo(dojo);
    onCreated(dojo);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full shadow-xl"
        style={{ background: "var(--background)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Build a New Dojo</h2>

        {/* Name */}
        <label className="block text-sm mb-1 opacity-70">Dojo Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Japanese Vocabulary"
          className="w-full px-3 py-2 rounded-lg border mb-4 text-sm"
          style={{
            background: "var(--scroll)",
            borderColor: "var(--bark-light)",
            color: "var(--foreground)",
          }}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />

        {/* Emoji picker */}
        <label className="block text-sm mb-1 opacity-70">Choose a Guardian</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                emoji === e ? "ring-2 scale-110" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                background: emoji === e ? `${color}33` : "transparent",
              }}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Color picker (paint set) */}
        <label className="block text-sm mb-1 opacity-70">Paint Set</label>
        <div className="flex gap-2 mb-6">
          {PAINT_SET.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${
                color === c ? "ring-2 ring-offset-2 scale-110" : ""
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Preview */}
        <div
          className="rounded-xl p-4 mb-4 flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          }}
        >
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className="font-bold">{name || "Your Dojo"}</div>
            <div className="text-xs opacity-60">🌸 Spring · 0 scrolls</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40"
            style={{ background: color }}
          >
            Build Dojo
          </button>
        </div>
      </div>
    </div>
  );
}
