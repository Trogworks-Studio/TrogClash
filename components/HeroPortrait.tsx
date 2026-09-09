"use client";

import { useEffect, useRef, useState } from "react";
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
  const prevHealth = useRef(health);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (health < prevHealth.current) {
      setHit(true);
      const t = setTimeout(() => setHit(false), 400);
      prevHealth.current = health;
      return () => clearTimeout(t);
    }
    prevHealth.current = health;
  }, [health]);

  return (
    <div className="flex items-center gap-2">
      <div
        style={{ height: "var(--hero-d)", width: "var(--hero-d)" }}
        className={[
          "relative flex-shrink-0 overflow-hidden rounded-full border-[4px] shadow-card-lg",
          isBot ? "border-blood-600" : "border-goblin-gold",
          hit ? "animate-hero-hit" : "",
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
        {hit && <div className="pointer-events-none absolute inset-0 rounded-full bg-blood-600/40" />}
        <div
          className={[
            "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-swamp-950 font-display font-extrabold text-white shadow-gem",
            low ? "bg-blood-600 animate-pulse" : "bg-gradient-to-b from-ember-500 to-ember-600",
          ].join(" ")}
          style={{ height: "38%", width: "38%", fontSize: "clamp(10px,2vw,16px)" }}
        >
          {Math.max(0, health)}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-display text-[clamp(11px,2.2vw,16px)] font-bold text-parchment-100">{name}</span>
        <div className="h-2.5 overflow-hidden rounded-full border border-swamp-950 bg-swamp-950/70 shadow-inner" style={{ width: "clamp(64px,10vw,128px)" }}>
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
          style={{ height: "var(--mana-d)", width: "var(--mana-d)" }}
          className={[
            "ml-1 flex flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-swamp-950 font-display font-bold text-white shadow-gem transition-transform",
            heroPowerUsable ? "bg-gradient-to-b from-witch-500 to-witch-700 hover:scale-105 active:scale-95" : "bg-swamp-700 opacity-50",
          ].join(" ")}
          title="Trog Yumruğu — 2 mana, rakip kaleye 2 hasar"
        >
          <Icon.Fist className="h-[42%] w-[42%] drop-shadow" />
          <span className="text-[clamp(8px,1.6vw,11px)]">2</span>
        </button>
      )}
    </div>
  );
}
