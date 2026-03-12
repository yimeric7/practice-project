"use client";

import { useState, useEffect } from "react";

const QUOTES: Record<string, string[]> = {
  idle: [
    "YOU JUST GONNA STAND THERE? PICK A MISSION.",
    "THE ARENA DOESN'T FIGHT ITSELF.",
    "I BELIEVE IN YOU. (DON'T MAKE ME REGRET IT.)",
    "EVERY MASTER WAS ONCE A ROOKIE WHO DIDN'T QUIT.",
    "YOUR BRAIN IS A WEAPON. SHARPEN IT.",
  ],
  hype: [
    "THREE IN A ROW?! YOU'RE ABSOLUTELY DISGUSTING. (THAT'S A COMPLIMENT.)",
    "UNSTOPPABLE! KEEP GOING!",
    "FURY MODE ACTIVATED! THIS IS YOUR MOMENT!",
    "YOU'RE ON FIRE AND I'M NOT EVEN MAD!",
  ],
  taunt: [
    "YOU AGAIN? LET'S SEE IF YOU ACTUALLY STUDIED THIS TIME.",
    "GLITCH SAYS HI. (GLITCH DOESN'T LIKE YOU.)",
    "BLOCKED? HAPPENS TO THE BEST. (YOU'RE NOT THE BEST YET.)",
  ],
  victory: [
    "MISSION COMPLETE! NOW DO IT AGAIN.",
    "K.O.! THE BOSS DIDN'T STAND A CHANCE!",
    "FLAWLESS? ALMOST. BUT I'LL TAKE IT.",
  ],
  sleeping: [
    "...zzz... FIVE MORE MINUTES...",
    "...zzz... COMBO... RECALL... zzz...",
  ],
};

type ZeroMood = "idle" | "hype" | "taunt" | "victory" | "sleeping";

export default function ZeroMascot({
  mood = "idle",
  showQuote = false,
}: {
  mood?: ZeroMood;
  showQuote?: boolean;
}) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (showQuote) {
      const pool = QUOTES[mood] ?? QUOTES.idle;
      setQuote(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [showQuote, mood]);

  const faces: Record<ZeroMood, string> = {
    idle: "⚔️(◕‿◕)⚔️",
    hype: "🔥(★‿★)🔥",
    taunt: "💀(◕_◕)💀",
    victory: "🏆(◕‿◕)🏆",
    sleeping: "(-.-)zzZ",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* ZERO's body */}
      <div className="relative inline-flex flex-col items-center">
        {/* Visor / headband */}
        <div className="h-6 w-16 rounded-t-full bg-neon-pink shadow-[0_0_10px_#ff2d9560]" />
        {/* Body */}
        <div
          className={`relative -mt-2 flex h-16 w-20 items-center justify-center rounded-full text-lg font-bold ${
            mood === "hype" || mood === "victory"
              ? "animate-celebration"
              : mood === "sleeping"
              ? ""
              : "animate-float"
          }`}
          style={{
            background: "linear-gradient(135deg, #1a1a3e 0%, #14142a 100%)",
            border: "2px solid",
            borderColor:
              mood === "hype"
                ? "#ff2d95"
                : mood === "victory"
                ? "#ffe600"
                : "#00f0ff",
            boxShadow:
              mood === "hype"
                ? "0 0 15px #ff2d9540"
                : mood === "victory"
                ? "0 0 15px #ffe60040"
                : "0 0 10px #00f0ff30",
          }}
        >
          <span className="select-none text-sm">{faces[mood]}</span>
        </div>
        {/* Legs */}
        <div className="-mt-1 flex gap-2">
          <div className="h-4 w-3 rounded-b-full bg-neon-cyan/40" />
          <div className="h-4 w-3 rounded-b-full bg-neon-cyan/40" />
        </div>
      </div>

      {/* Name tag */}
      <span className="pixel-heading text-xs font-bold text-neon-cyan/60">
        ZERO
      </span>

      {/* Quote bubble */}
      {showQuote && quote && (
        <div className="mt-1 max-w-xs rounded-xl border border-neon-yellow/30 bg-dark-card/80 px-4 py-2 text-center backdrop-blur-sm">
          <p className="pixel-heading text-xs leading-relaxed text-neon-yellow neon-text-yellow">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-1 text-xs text-zinc-600">— ZERO</div>
        </div>
      )}
    </div>
  );
}
