import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      {/* CRT scanline overlay */}
      <div className="crt-overlay" />

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-neon-pink/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-neon-cyan/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-neon-yellow/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <span className="pixel-heading text-xl font-bold text-neon-pink neon-text-pink">
            COMBO
          </span>
          <span className="pixel-heading text-xl font-bold text-neon-cyan neon-text-cyan">
            RECALL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#features"
            className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-neon-cyan md:block"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-neon-cyan md:block"
          >
            How It Works
          </a>
          <Link href="/arena" className="rounded-lg border border-neon-pink/40 bg-neon-pink/10 px-5 py-2 text-sm font-bold text-neon-pink transition-all hover:bg-neon-pink/20 hover:shadow-[0_0_20px_#ff2d9540] neon-text-pink">
            ENTER THE ARENA
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        {/* ZERO mascot speech bubble */}
        <div className="animate-float mb-6">
          <div className="relative inline-block rounded-xl border border-neon-yellow/30 bg-dark-card/80 px-6 py-3 backdrop-blur-sm">
            <p className="pixel-heading text-sm text-neon-yellow neon-text-yellow">
              &quot;YOU SHOWED UP? RESPECT. NOW LET&apos;S GET TO WORK.&quot;
            </p>
            <span className="text-xs text-zinc-500">— ZERO, your hype ninja</span>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-neon-yellow/30 bg-dark-card/80" />
          </div>
        </div>

        {/* Main title */}
        <h1 className="pixel-heading animate-slam-in mb-4 text-5xl font-black leading-tight text-white md:text-7xl lg:text-8xl">
          <span className="text-neon-pink neon-text-pink">COMBO</span>
          <br />
          <span className="text-neon-cyan neon-text-cyan">RECALL</span>
        </h1>

        <p className="mb-8 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl">
          A flashcard app that feels like a{" "}
          <span className="font-bold text-neon-yellow neon-text-yellow">
            retro arcade beat-em-up
          </span>
          . Every review session is a boss fight. Every card is a combo move.
        </p>

        {/* Tagline */}
        <p className="animate-pulse-glow pixel-heading mb-10 text-sm tracking-widest text-neon-green md:text-base">
          EVERY CARD IS A COMBO. EVERY SESSION IS A FIGHT. STUDY HARDER.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/arena" className="animate-gradient rounded-xl bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink px-8 py-4 text-lg font-black text-dark-bg transition-transform hover:scale-105 hover:shadow-[0_0_30px_#ff2d9560]">
            START FIGHTING
          </Link>
          <button className="rounded-xl border border-neon-cyan/40 bg-neon-cyan/5 px-8 py-4 text-lg font-bold text-neon-cyan transition-all hover:bg-neon-cyan/15 hover:shadow-[0_0_20px_#00f0ff30]">
            WATCH TRAILER
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex animate-bounce flex-col items-center gap-1 text-zinc-600">
          <span className="text-xs">SCROLL TO FIGHT</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Combo Meter Demo Strip */}
      <section className="relative z-10 border-y border-neon-pink/20 bg-dark-surface/50 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-6 overflow-hidden px-6 md:gap-12">
          {[
            { label: "HIT!", color: "text-neon-green", glow: "neon-text-cyan" },
            { label: "HIT!", color: "text-neon-green", glow: "neon-text-cyan" },
            { label: "HIT!", color: "text-neon-green", glow: "neon-text-cyan" },
            {
              label: "3x COMBO!",
              color: "text-neon-yellow",
              glow: "neon-text-yellow",
            },
            { label: "HIT!", color: "text-neon-green", glow: "neon-text-cyan" },
            { label: "HIT!", color: "text-neon-green", glow: "neon-text-cyan" },
            {
              label: "5x FURY MODE!",
              color: "text-neon-pink",
              glow: "neon-text-pink",
            },
          ].map((item, i) => (
            <span
              key={i}
              className={`pixel-heading whitespace-nowrap text-sm font-black ${item.color} ${item.glow} md:text-base`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="pixel-heading mb-4 text-center text-3xl font-black text-white md:text-4xl">
            <span className="text-neon-cyan neon-text-cyan">SELECT</span> YOUR
            MODE
          </h2>
          <p className="mb-16 text-center text-zinc-500">
            Every feature is designed to make studying feel like a fight worth
            winning.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards */}
            {[
              {
                icon: "🗺️",
                title: "MISSIONS",
                subtitle: "Decks as Neon Levels",
                desc: "Create decks styled as missions on a city map. Each with a difficulty rating and custom icon. Your study plan never looked this dangerous.",
                border: "border-neon-pink/30 hover:border-neon-pink/60",
                glow: "hover:shadow-[0_0_25px_#ff2d9530]",
              },
              {
                icon: "👊",
                title: "COMBO MOVES",
                subtitle: "Cards That Hit Different",
                desc: "Each card slams onto screen like a fighting game character intro. Correct? HIT! Wrong? BLOCKED! The drama is real.",
                border: "border-neon-cyan/30 hover:border-neon-cyan/60",
                glow: "hover:shadow-[0_0_25px_#00f0ff30]",
              },
              {
                icon: "📈",
                title: "POWER LEVELS",
                subtitle: "Spaced Repetition with XP",
                desc: "Cards have visible XP bars that fill with correct reviews. Watch your knowledge literally level up.",
                border: "border-neon-yellow/30 hover:border-neon-yellow/60",
                glow: "hover:shadow-[0_0_25px_#ffe60030]",
              },
              {
                icon: "⏱️",
                title: "ARCADE MODE",
                subtitle: "Speed Kills (In a Good Way)",
                desc: "Timed sessions where speed matters. Compete against yourself on the leaderboard. Beat your high score or go home.",
                border: "border-neon-green/30 hover:border-neon-green/60",
                glow: "hover:shadow-[0_0_25px_#39ff1430]",
              },
              {
                icon: "💀",
                title: "BOSS FIGHTS",
                subtitle: "The Final Exam",
                desc: "Unlock after reviewing all cards once. Rapid-fire your hardest cards with a health bar. Defeat the boss. Prove mastery.",
                border: "border-neon-pink/30 hover:border-neon-pink/60",
                glow: "hover:shadow-[0_0_25px_#ff2d9530]",
              },
              {
                icon: "🔥",
                title: "FURY MODE",
                subtitle: "5+ Streak Activated",
                desc: "Hit 5 in a row and the screen glows, speed increases, XP multiplies. This is what peak performance looks like.",
                border: "border-neon-cyan/30 hover:border-neon-cyan/60",
                glow: "hover:shadow-[0_0_25px_#00f0ff30]",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group rounded-2xl border ${feature.border} bg-dark-card/60 p-6 backdrop-blur-sm transition-all duration-300 ${feature.glow}`}
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="pixel-heading mb-1 text-lg font-black text-white">
                  {feature.title}
                </h3>
                <p className="mb-3 text-xs font-medium text-neon-cyan/70">
                  {feature.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 border-y border-neon-cyan/10 bg-dark-surface/30 px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="pixel-heading mb-4 text-center text-3xl font-black text-white md:text-4xl">
            <span className="text-neon-yellow neon-text-yellow">HOW</span> IT
            WORKS
          </h2>
          <p className="mb-16 text-center text-zinc-500">
            Three steps. No tutorials. Just fight.
          </p>

          <div className="flex flex-col gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "CREATE YOUR MISSION",
                desc: "Build a deck. Give it a name, a difficulty rating, and an icon. This is your neon-lit battleground.",
                color: "text-neon-pink",
                glow: "neon-text-pink",
                borderColor: "border-neon-pink/40",
              },
              {
                step: "02",
                title: "LOAD YOUR COMBOS",
                desc: "Add cards with front and back. These are your attack sequences. The more you add, the harder the fight.",
                color: "text-neon-cyan",
                glow: "neon-text-cyan",
                borderColor: "border-neon-cyan/40",
              },
              {
                step: "03",
                title: "ENTER THE ARENA",
                desc: "Start reviewing. Nail the answer? HIT! Mess up? BLOCKED! Chain 5+ for FURY MODE. Defeat the boss to prove mastery.",
                color: "text-neon-yellow",
                glow: "neon-text-yellow",
                borderColor: "border-neon-yellow/40",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-6 rounded-xl border ${item.borderColor} bg-dark-card/40 p-6 backdrop-blur-sm`}
              >
                <span
                  className={`pixel-heading text-4xl font-black ${item.color} ${item.glow} shrink-0`}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="pixel-heading mb-2 text-lg font-black text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZERO Commentary Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-block rounded-2xl border border-neon-yellow/20 bg-dark-card/60 px-8 py-6 backdrop-blur-sm">
            <p className="pixel-heading mb-2 text-xs text-zinc-500">
              ZERO SAYS:
            </p>
            <p className="pixel-heading text-xl leading-relaxed text-neon-yellow neon-text-yellow md:text-2xl">
              &quot;THREE IN A ROW?! YOU&apos;RE ABSOLUTELY DISGUSTING.
              <br />
              <span className="text-zinc-500">(THAT&apos;S A COMPLIMENT.)</span>
              &quot;
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "Locker Room Stats",
              "Daily Gauntlet",
              "Unlockable Skins",
              "Combo Leaderboards",
              'Tourist Mode (we judge you)',
            ].map((tag, i) => (
              <span
                key={i}
                className="rounded-full border border-neon-cyan/20 bg-dark-card/40 px-4 py-1.5 text-xs font-medium text-neon-cyan/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="pixel-heading mb-6 text-4xl font-black text-white md:text-5xl">
            <span className="text-neon-pink neon-text-pink">READY</span> TO{" "}
            <span className="text-neon-cyan neon-text-cyan">FIGHT</span>?
          </h2>
          <p className="mb-8 text-lg text-zinc-400">
            Stop studying like it&apos;s homework. Start studying like it&apos;s
            a boss battle.
          </p>
          <Link href="/arena" className="inline-block animate-gradient rounded-xl bg-gradient-to-r from-neon-pink via-neon-yellow to-neon-cyan px-10 py-5 text-xl font-black text-dark-bg transition-transform hover:scale-105 hover:shadow-[0_0_40px_#ff2d9540]">
            ENTER THE ARENA
          </Link>
          <p className="animate-flicker pixel-heading mt-6 text-xs text-neon-green/60">
            FREE TO PLAY. NO COINS REQUIRED. JUST SKILL.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="pixel-heading text-sm text-neon-pink/60">COMBO</span>
          <span className="pixel-heading text-sm text-neon-cyan/60">
            RECALL
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          Built with hype. Powered by spite. Study harder.
        </p>
      </footer>
    </div>
  );
}
