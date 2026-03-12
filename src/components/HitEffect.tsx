"use client";

import { useEffect, useState } from "react";

interface Props {
  type: "hit" | "blocked" | null;
  onDone: () => void;
}

export default function HitEffect({ type, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!type) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 800);
    return () => clearTimeout(t);
  }, [type, onDone]);

  if (!visible || !type) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      <p
        className={`animate-combo-pop pixel-heading text-6xl font-black md:text-8xl ${
          type === "hit"
            ? "text-neon-green neon-text-cyan"
            : "text-neon-pink neon-text-pink"
        }`}
      >
        {type === "hit" ? "HIT!" : "BLOCKED!"}
      </p>
      {type === "blocked" && (
        <div className="absolute inset-0 animate-shake bg-neon-pink/5" />
      )}
    </div>
  );
}
