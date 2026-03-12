"use client";

import { useState, useEffect } from "react";

const WISDOM = [
  "The scroll you review today is the shuriken you throw tomorrow. Also, snack time soon.",
  "Even the tallest bamboo started as a tiny shoot.",
  "A ninja who rests is still a ninja.",
  "The dojo is always here. So is the tea.",
  "One scroll at a time. That is the way.",
  "Your brain is a forest — let it grow wild, then tend it gently.",
  "Mistakes are just training in disguise.",
  "The wise red panda reviews before breakfast.",
  "Flow like water through your scrolls today.",
  "Every master was once a sleepy beginner.",
];

type MochiMood = "sleeping" | "happy" | "excited" | "thinking" | "blanket";

export default function Mochi({
  mood = "happy",
  showWisdom = false,
}: {
  mood?: MochiMood;
  showWisdom?: boolean;
}) {
  const [wisdom, setWisdom] = useState("");

  useEffect(() => {
    if (showWisdom) {
      setWisdom(WISDOM[Math.floor(Math.random() * WISDOM.length)]);
    }
  }, [showWisdom]);

  const faces: Record<MochiMood, string> = {
    sleeping: "(-.-)zzZ",
    happy: "(◕‿◕)",
    excited: "(★‿★)",
    thinking: "(◕_◕)?",
    blanket: "(._.)~🧣",
  };

  const body = (
    <div className="relative inline-flex flex-col items-center">
      {/* Hood */}
      <div
        className="w-16 h-8 rounded-t-full"
        style={{ background: "#c94c4c" }}
      />
      {/* Body */}
      <div
        className={`w-20 h-16 rounded-full flex items-center justify-center text-lg font-bold relative -mt-2 ${
          mood === "excited" ? "animate-celebration" : ""
        } ${mood === "sleeping" ? "" : "animate-float"}`}
        style={{ background: "#d4875e", color: "#2c1810" }}
      >
        <span className="select-none">{faces[mood]}</span>
      </div>
      {/* Tail */}
      <div
        className="w-3 h-8 rounded-b-full -mt-1 ml-8"
        style={{
          background:
            "repeating-linear-gradient(0deg, #d4875e 0px, #d4875e 4px, #c94c4c 4px, #c94c4c 8px)",
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {body}
      {showWisdom && wisdom && (
        <div
          className="max-w-xs text-center text-sm italic px-4 py-2 rounded-xl mt-1"
          style={{
            background: "var(--scroll)",
            color: "var(--ink)",
            border: "1px solid var(--bark-light)",
          }}
        >
          &ldquo;{wisdom}&rdquo;
          <div className="text-xs mt-1 opacity-60">— Mochi</div>
        </div>
      )}
    </div>
  );
}
