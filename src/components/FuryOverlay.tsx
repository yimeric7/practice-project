"use client";

interface Props {
  active: boolean;
}

export default function FuryOverlay({ active }: Props) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 animate-pulse-glow rounded-lg border-4 border-neon-pink/40 shadow-[inset_0_0_60px_#ff2d9520,0_0_60px_#ff2d9520]" />
  );
}
