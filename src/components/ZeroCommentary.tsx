"use client";

const quotes: Record<string, string[]> = {
  fury: [
    "FIVE IN A ROW?! YOU'RE A MACHINE!",
    "FURY MODE ACTIVATED! THIS IS YOUR MOMENT!",
    "UNSTOPPABLE. LITERALLY UNSTOPPABLE.",
  ],
  hit: [
    "CLEAN HIT!",
    "THAT'S HOW IT'S DONE!",
    "NAILED IT!",
    "TEXTBOOK COMBO!",
  ],
  blocked: [
    "BLOCKED! ANYWAY, NEXT CARD, LET'S GO.",
    "OUCH. SHAKE IT OFF.",
    "THAT ONE DIDN'T COUNT. (IT DID.)",
  ],
  win: [
    "MISSION COMPLETE! YOU'RE DISGUSTING. (COMPLIMENT.)",
    "K.O.! THE BOSS DIDN'T STAND A CHANCE!",
    "FLAWLESS? ALMOST. BUT I'LL TAKE IT.",
  ],
  lose: [
    "DEFEATED... BUT YOU'LL BE BACK.",
    "GLITCH WINS THIS ROUND. NOT THE WAR.",
    "STUDY HARDER. THEN COME FIGHT AGAIN.",
  ],
  empty: [
    "NO MISSIONS YET? WEAK. CREATE ONE.",
    "THE ARENA IS EMPTY. FIX THAT.",
  ],
  welcome: [
    "YOU SHOWED UP? RESPECT. NOW LET'S GET TO WORK.",
    "READY TO FIGHT? LET'S GO!",
  ],
};

interface Props {
  trigger: keyof typeof quotes;
}

export default function ZeroCommentary({ trigger }: Props) {
  const pool = quotes[trigger] ?? quotes.welcome;
  const quote = pool[Math.floor(Math.random() * pool.length)];

  return (
    <div className="inline-block rounded-xl border border-neon-yellow/30 bg-dark-card/80 px-5 py-3">
      <p className="pixel-heading text-sm text-neon-yellow neon-text-yellow">
        &quot;{quote}&quot;
      </p>
      <span className="text-xs text-zinc-500">— ZERO</span>
    </div>
  );
}
