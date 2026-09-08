"use client";

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
          "relative flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-card",
          isBot ? "border-blood-600 bg-swamp-800" : "border-goblin-gold bg-swamp-700",
        ].join(" ")}
      >
        <span className="text-3xl">{isBot ? "👹" : "🐸"}</span>
        <div
          className={[
            "absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-swamp-950 font-display text-sm font-bold text-white",
            low ? "bg-blood-600 animate-pulse" : "bg-ember-600",
          ].join(" ")}
        >
          {Math.max(0, health)}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-display text-sm font-bold text-parchment-100">{name}</span>
        <div className="h-2.5 w-28 overflow-hidden rounded-full bg-swamp-950/60">
          <div
            className={["h-full rounded-full transition-all", low ? "bg-blood-600" : "bg-moss-500"].join(" ")}
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
            "ml-1 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-swamp-950 font-display text-[9px] font-bold text-white shadow-card transition-transform",
            heroPowerUsable ? "bg-witch-500 hover:scale-105 active:scale-95" : "bg-swamp-700 opacity-50",
          ].join(" ")}
          title="Trog Yumruğu — 2 mana, rakip kaleye 2 hasar"
        >
          <span className="text-base leading-none">👊</span>
          <span>2</span>
        </button>
      )}
    </div>
  );
}
