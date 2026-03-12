"use client";

interface Props {
  count: number;
}

export default function ComboMeter({ count }: Props) {
  if (count === 0) return null;

  const isFury = count >= 5;

  return (
    <div className="animate-combo-pop text-center">
      <p
        className={`pixel-heading text-3xl font-black ${
          isFury
            ? "text-neon-pink neon-text-pink"
            : "text-neon-yellow neon-text-yellow"
        }`}
      >
        {isFury ? "FURY MODE!" : `${count}x COMBO`}
      </p>
      <div className="mt-1 flex justify-center gap-1">
        {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-full ${
              i < 5 ? "bg-neon-cyan" : "bg-neon-pink"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
