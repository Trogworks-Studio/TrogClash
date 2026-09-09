"use client";

import { PORTRAITS } from "@/lib/game/art";
import { Icon } from "@/components/icons";

interface Props {
  name: string;
  health: number;
  maxHealth: number;
  isBot?: boolean;
  heroPowerUsable?: boolean;
  onHeroPower?: () => void;
}

export default function HeroPortrait({ name, health, maxHealth, isBot, heroPowerUsable, onHeroPower }: Props) {
  const pct = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const low = pct <= 30;

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "relative h-24 w-24 overflow-hidden rounded-full border-[5px] shadow-card-lg",
          isBot ? "border-blood-600" : "border-goblin-gold",
        ].join(" ")}
      >
        <div className={["absolute inset-0 rounded-full", isBot ? "bg-swamp-800" : "bg-swamp-700"].join(" ")} />
        {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
        <img
          src={isBot ? PORTRAITS.botHero : PORTRAITS.playerHero}
          alt=""
          className="relative h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-white/10" />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-inset ring-swamp-950/60" />
        <div
          className={[
            "absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-swamp-950 font-display text-base font-extrabold text-white shadow-gem",
            low ? "bg-blood-600 animate-pulse" : "bg-gradient-to-b from-ember-500 to-ember-600",
          ].join(" ")}
        >
          {Math.max(0, health)}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-display text-base font-bold text-parchment-100">{name}</span>
        <div className="h-3 w-32 overflow-hidden rounded-full border border-swamp-950 bg-swamp-950/70 shadow-inner">
          <div
            className={[
              "h-full rounded-full transition-all",
              low ? "bg-gradient-to-r from-blood-600 to-red-500" : "bg-gradient-to-r from-moss-500 to-moss-400",
            ].join(" ")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {onHeroPower && (
        <button
          type="button"
          onClick={onHeroPower}
          disabled={!heroPowerUsable}
          className={[
            "ml-1 flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full border-[3px] border-swamp-950 font-display text-[10px] font-bold text-white shadow-gem transition-transform",
            heroPowerUsable ? "bg-gradient-to-b from-witch-500 to-witch-700 hover:scale-105 active:scale-95" : "bg-swamp-700 opacity-50",
          ].join(" ")}
          title="Trog Yumruğu — 2 mana, rakip kaleye 2 hasar"
        >
          <Icon.Fist className="h-6 w-6 drop-shadow" />
          <span>2</span>
        </button>
      )}
    </div>
  );
}
