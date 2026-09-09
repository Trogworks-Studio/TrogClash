"use client";

import Link from "next/link";
import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { useProfile } from "@/lib/hooks/useProfile";
import { XP_PER_LOSS, XP_PER_WIN } from "@/lib/game/rank";
import { PORTRAITS } from "@/lib/game/art";

export default function PlayPage() {
  const profile = useProfile();
  const [matchKey, setMatchKey] = useState(0);
  const [result, setResult] = useState<"win" | "loss" | null>(null);

  function handleGameOver(didWin: boolean) {
    setResult(didWin ? "win" : "loss");
    profile.recordMatchResult(didWin);
  }

  function playAgain() {
    setResult(null);
    setMatchKey((k) => k + 1);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-3 px-3 py-4 lg:max-w-4xl xl:max-w-5xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-xs font-bold text-goblin-gold hover:underline">
          ← Menü
        </Link>
        <span className="font-display text-xs text-parchment-300">
          {profile.username} · Sv.{profile.level}
        </span>
      </div>

      <div className="relative flex-1">
        <GameBoard key={matchKey} onGameOver={handleGameOver} />

        {result && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-swamp-950/85 backdrop-blur-sm">
            <div className="animate-pop-in flex flex-col items-center gap-3 rounded-[28px] border-[6px] border-goblin-gold bg-gradient-to-b from-swamp-800 to-swamp-950 p-9 text-center shadow-glow-legendary">
              <div className="h-32 w-32 overflow-hidden rounded-full border-[5px] border-goblin-gold bg-swamp-800 shadow-card-lg">
                {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
                <img
                  src={result === "win" ? PORTRAITS.victory : PORTRAITS.defeat}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              </div>
              <h2 className="font-display text-3xl font-extrabold text-parchment-100">
                {result === "win" ? "Kazandın!" : "Kaybettin"}
              </h2>
              <p
                className={[
                  "font-display text-lg font-bold",
                  result === "win" ? "text-moss-500" : "text-blood-600",
                ].join(" ")}
              >
                {result === "win" ? `+${XP_PER_WIN} XP` : `-${XP_PER_LOSS} XP`}
              </p>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={playAgain}
                  className="rounded-full border-[3px] border-swamp-950 bg-gradient-to-b from-ember-500 to-ember-600 px-7 py-2.5 font-display text-sm font-bold text-white shadow-card-lg transition-transform hover:scale-105"
                >
                  Tekrar Oyna
                </button>
                <Link
                  href="/"
                  className="rounded-full border-[3px] border-swamp-950 bg-swamp-800 px-7 py-2.5 font-display text-sm font-bold text-parchment-100 shadow-card-lg transition-transform hover:scale-105"
                >
                  Menü
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
