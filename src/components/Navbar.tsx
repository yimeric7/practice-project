"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const links = [
    { href: "/arena", label: "ARENA" },
    { href: "/locker-room", label: "LOCKER ROOM" },
    { href: "/gauntlet", label: "GAUNTLET" },
  ];

  return (
    <nav className="relative z-10 flex items-center justify-between border-b border-zinc-800/50 px-6 py-4 md:px-12">
      <Link href="/" className="flex items-center gap-2">
        <span className="pixel-heading text-lg font-bold text-neon-pink neon-text-pink">
          COMBO
        </span>
        <span className="pixel-heading text-lg font-bold text-neon-cyan neon-text-cyan">
          RECALL
        </span>
      </Link>
      <div className="flex items-center gap-5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`pixel-heading text-xs font-bold transition-colors ${
              path.startsWith(l.href)
                ? "text-neon-yellow neon-text-yellow"
                : "text-zinc-500 hover:text-neon-cyan"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
