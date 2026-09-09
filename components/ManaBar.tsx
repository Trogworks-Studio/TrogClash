"use client";

export default function ManaBar({ mana, maxMana }: { mana: number; maxMana: number }) {
  const crystals = Array.from({ length: Math.max(maxMana, 1) });
  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      <div className="flex flex-wrap justify-center gap-1" style={{ maxWidth: "clamp(90px,18vw,180px)" }}>
        {crystals.map((_, i) => (
          <span
            key={i}
            className="relative rotate-45 rounded-[22%] border-2 border-swamp-950 shadow-gem transition-all"
            style={{
              height: "calc(var(--mana-d) * 0.42)",
              width: "calc(var(--mana-d) * 0.42)",
              background:
                i < mana
                  ? "radial-gradient(circle at 35% 30%, #7dd3fc, #0ea5e9 45%, #0369a1 100%)"
                  : "radial-gradient(circle at 35% 30%, #3d6b5a, #1F3A32 60%, #142A23 100%)",
              boxShadow: i < mana ? "0 0 8px rgba(56,189,248,0.7)" : undefined,
            }}
          />
        ))}
      </div>
      <span className="font-display font-bold text-parchment-100" style={{ fontSize: "clamp(10px,2vw,15px)" }}>
        {mana}/{maxMana}
      </span>
    </div>
  );
}
