"use client";

interface Props {
  current: number;
  max: number;
}

export default function HealthBar({ current, max }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-xl transition-all duration-300 ${
            i < current ? "" : "opacity-20 grayscale"
          } ${i === current ? "animate-shake" : ""}`}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
