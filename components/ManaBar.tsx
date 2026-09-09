"use client";

export default function ManaBar({ mana, maxMana }: { mana: number; maxMana: number }) {
  const crystals = Array.from({ length: Math.max(maxMana, 1) });
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1.5">
        {crystals.map((_, i) => (
          <span
            key={i}
            className="relative h-5 w-5 rotate-45 rounded-[4px] border-2 border-swamp-950 shadow-gem transition-all"
            style={{
              background:
                i < mana
                  ? "radial-gradient(circle at 35% 30%, #7dd3fc, #0ea5e9 45%, #0369a1 100%)"
                  : "radial-gradient(circle at 35% 30%, #3d6b5a, #1F3A32 60%, #142A23 100%)",
              boxShadow: i < mana ? "0 0 8px rgba(56,189,248,0.7)" : undefined,
            }}
          />
        ))}
      </div>
      <span className="font-display text-base font-bold text-parchment-100">
        {mana}/{maxMana}
      </span>
    </div>
  );
}
