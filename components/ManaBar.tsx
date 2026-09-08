"use client";

export default function ManaBar({ mana, maxMana }: { mana: number; maxMana: number }) {
  const crystals = Array.from({ length: Math.max(maxMana, 1) });
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {crystals.map((_, i) => (
          <span
            key={i}
            className={[
              "h-4 w-4 rotate-45 rounded-[3px] border-2 border-swamp-950 transition-colors",
              i < mana ? "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" : "bg-swamp-800",
            ].join(" ")}
          />
        ))}
      </div>
      <span className="font-display text-sm font-bold text-parchment-100">
        {mana}/{maxMana}
      </span>
    </div>
  );
}
