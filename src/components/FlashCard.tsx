"use client";

interface Props {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ front, back, isFlipped, onFlip }: Props) {
  return (
    <div
      className="card-perspective animate-slam-in mx-auto w-full max-w-lg cursor-pointer"
      onClick={!isFlipped ? onFlip : undefined}
    >
      <div
        className={`card-inner relative transition-transform duration-500 ${
          isFlipped ? "card-flipped" : ""
        }`}
      >
        {/* Front */}
        <div className="card-face rounded-2xl border border-neon-cyan/30 bg-dark-card/80 p-8 backdrop-blur-sm neon-border-cyan">
          <p className="pixel-heading mb-2 text-xs text-neon-cyan/60">
            COMBO MOVE
          </p>
          <p className="text-center text-xl font-bold text-white md:text-2xl">
            {front}
          </p>
          {!isFlipped && (
            <p className="mt-6 text-center text-xs text-zinc-600">
              TAP TO REVEAL
            </p>
          )}
        </div>
        {/* Back */}
        <div className="card-face card-back rounded-2xl border border-neon-yellow/30 bg-dark-card/80 p-8 backdrop-blur-sm neon-border-cyan">
          <p className="pixel-heading mb-2 text-xs text-neon-yellow/60">
            ANSWER
          </p>
          <p className="text-center text-xl font-bold text-neon-yellow md:text-2xl">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}
