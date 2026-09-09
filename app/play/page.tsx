"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GameBoard from "@/components/GameBoard";
import { useProfile } from "@/lib/hooks/useProfile";
import { XP_PER_LOSS, XP_PER_WIN } from "@/lib/game/rank";
import { PORTRAITS } from "@/lib/game/art";
import { playSfx } from "@/lib/audio/sfx";
import SoundToggle from "@/components/SoundToggle";

export default function PlayPage() {
  const profile = useProfile();
  const [matchKey, setMatchKey] = useState(0);
  const [result, setResult] = useState<"win" | "loss" | null>(null);

  function handleGameOver(didWin: boolean) {
    setResult(didWin ? "win" : "loss");
    profile.recordMatchResult(didWin);
  }

  useEffect(() => {
    if (result) playSfx(result === "win" ? "victory" : "defeat");
  }, [result]);

  function playAgain() {
    playSfx("click");
    setResult(null);
    setMatchKey((k) => k + 1);
  }

  return (
    <main className="mx-auto flex h-[100dvh] max-w-2xl flex-col gap-2 overflow-hidden px-2 py-2 sm:px-3 sm:py-3 lg:max-w-4xl xl:max-w-5xl">
      <div className="flex flex-shrink-0 items-center justify-between">
        <Link href="/" className="font-display text-xs font-bold text-goblin-gold hover:underline">
          ← Menü
        </Link>
        <span className="vh-tiny-hide font-display text-xs text-parchment-300">
          {profile.username} · Sv.{profile.level}
        </span>
        <SoundToggle />
      </div>

      <div className="relative min-h-0 flex-1">
        <GameBoard key={matchKey} onGameOver={handleGameOver} />

        {result && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-swamp-950/85 p-3 backdrop-blur-sm">
            <div className="animate-pop-in flex max-h-full flex-col items-center gap-2 overflow-hidden rounded-[24px] border-[5px] border-goblin-gold bg-gradient-to-b from-swamp-800 to-swamp-950 p-5 text-center shadow-glow-legendary sm:gap-3 sm:p-9">
              <div
                className="overflow-hidden rounded-full border-[4px] border-goblin-gold bg-swamp-800 shadow-card-lg"
                style={{ height: "clamp(64px,18vh,128px)", width: "clamp(64px,18vh,128px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
                <img
                  src={result === "win" ? PORTRAITS.victory : PORTRAITS.defeat}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              </div>
              <h2 className="font-display font-extrabold text-parchment-100" style={{ fontSize: "clamp(18px,4vh,30px)" }}>
                {result === "win" ? "Kazandın!" : "Kaybettin"}
              </h2>
              <p
                className={[
                  "font-display font-bold",
                  result === "win" ? "text-moss-500" : "text-blood-600",
                ].join(" ")}
                style={{ fontSize: "clamp(13px,2.6vh,18px)" }}
              >
                {result === "win" ? `+${XP_PER_WIN} XP` : `-${XP_PER_LOSS} XP`}
              </p>
              <div className="mt-1 flex flex-shrink-0 gap-3 sm:mt-2">
                <button
                  type="button"
                  onClick={playAgain}
                  className="rounded-full border-[3px] border-swamp-950 bg-gradient-to-b from-ember-500 to-ember-600 px-5 py-2 font-display text-xs font-bold text-white shadow-card-lg transition-transform hover:scale-105 sm:px-7 sm:py-2.5 sm:text-sm"
                >
                  Tekrar Oyna
                </button>
                <Link
                  href="/"
                  onClick={() => playSfx("click")}
                  className="rounded-full border-[3px] border-swamp-950 bg-swamp-800 px-5 py-2 font-display text-xs font-bold text-parchment-100 shadow-card-lg transition-transform hover:scale-105 sm:px-7 sm:py-2.5 sm:text-sm"
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
