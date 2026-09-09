"use client";

import { CardDef, MinionInstance, Rarity } from "@/lib/types";
import GoblinIllustration from "@/components/GoblinIllustration";
import { Icon } from "@/components/icons";

const RARITY_BORDER: Record<Rarity, string> = {
  common: "border-swamp-600",
  rare: "border-sky-500",
  epic: "border-witch-500",
  legendary: "border-goblin-gold",
};

const RARITY_GLOW: Record<Rarity, string> = {
  common: "shadow-card-lg",
  rare: "shadow-glow-rare",
  epic: "shadow-glow-epic",
  legendary: "shadow-glow-legendary",
};

const RARITY_GEM: Record<Rarity, string> = {
  common: "bg-swamp-600",
  rare: "bg-sky-400",
  epic: "bg-witch-500",
  legendary: "bg-goblin-gold animate-pulse",
};

/** small gold corner bracket, reused on both card types for an AAA "framed art" look */
function CornerOrnaments() {
  return (
    <>
      <span className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l-2 border-t-2 border-goblin-gold/70" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r-2 border-t-2 border-goblin-gold/70" />
    </>
  );
}

function GemShine() {
  return <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gem-shine" />;
}

interface HandCardProps {
  card: CardDef;
  disabled?: boolean;
  onPlay: () => void;
  compact?: boolean;
}

export function HandCard({ card, disabled, onPlay, compact }: HandCardProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={disabled}
      className={[
        "group relative flex-shrink-0 select-none rounded-[28px] border-[6px] bg-gradient-to-b from-parchment-100 via-parchment-100 to-parchment-300 text-swamp-950",
        "transition-all duration-200 ease-out",
        disabled ? "opacity-45 grayscale cursor-not-allowed" : "hover:-translate-y-7 hover:scale-[1.05] hover:ring-4 hover:ring-goblin-gold/60 active:translate-y-0",
        compact ? "w-40 pb-5" : "w-56 pb-7",
        RARITY_BORDER[card.rarity],
        RARITY_GLOW[card.rarity],
      ].join(" ")}
      title={card.flavor}
    >
      {/* mana cost gem — glassy jewel */}
      <div
        className={[
          "absolute z-10 flex items-center justify-center rounded-2xl border-[3px] border-swamp-950 font-display font-extrabold text-white shadow-gem",
          "rotate-45",
          compact ? "-left-4 -top-4 h-12 w-12 text-lg" : "-left-5 -top-5 h-16 w-16 text-2xl",
        ].join(" ")}
        style={{ background: "radial-gradient(circle at 35% 30%, #7dd3fc, #0ea5e9 45%, #0369a1 100%)" }}
      >
        <GemShine />
        <span className="-rotate-45 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">{card.cost}</span>
      </div>

      {/* portrait panel */}
      <div
        className={[
          "relative mx-2.5 mt-4 overflow-hidden rounded-[18px] border-[3px] border-swamp-950 bg-swamp-900",
          compact ? "h-28" : "h-36",
        ].join(" ")}
      >
        {card.type === "minion" ? (
          <GoblinIllustration variant={card.variant} rarity={card.rarity} cardId={card.id} className="h-full w-full" />
        ) : (
          <SpellIcon />
        )}
        {/* vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <CornerOrnaments />
      </div>

      {/* rarity gem, straddling portrait / nameplate seam */}
      <div
        className={[
          "relative z-10 mx-auto -mt-2.5 h-5 w-5 rotate-45 rounded-[4px] border-2 border-swamp-950 shadow-md",
          RARITY_GEM[card.rarity],
        ].join(" ")}
      />

      {/* name plate */}
      <div className="mx-2.5 -mt-1 rounded-xl border-y-[3px] border-goblin-gold/70 bg-gradient-to-b from-swamp-900 to-swamp-950 px-2 py-1.5 shadow-inner">
        <p className={["flex items-center justify-center gap-1.5 text-center font-display font-bold leading-tight text-parchment-100", compact ? "text-[11px]" : "text-sm"].join(" ")}>
          <span className="h-1 w-1 rotate-45 bg-goblin-gold/70" />
          {card.name}
          <span className="h-1 w-1 rotate-45 bg-goblin-gold/70" />
        </p>
      </div>

      {card.type === "spell" && (
        <p className={["mt-1.5 flex items-center justify-center gap-1.5 text-center font-bold uppercase tracking-wider text-witch-700", compact ? "text-[8px]" : "text-[10px]"].join(" ")}>
          <span className="h-1 w-1 rotate-45 bg-witch-500" />
          Büyü
          <span className="h-1 w-1 rotate-45 bg-witch-500" />
        </p>
      )}

      {card.type === "minion" && card.taunt && (
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 rounded-full border border-swamp-950 bg-gradient-to-b from-swamp-600 to-swamp-800 px-2 py-0.5 font-bold uppercase text-parchment-100 shadow",
            compact ? "top-[6.6rem] text-[7px]" : "top-[8.6rem] text-[8px]",
          ].join(" ")}
        >
          Taunt
        </span>
      )}

      {/* stat gems, overlapping the card's bottom edge */}
      {card.type === "minion" && (
        <div className={["pointer-events-none absolute left-0 right-0 flex justify-between px-2", compact ? "-bottom-3" : "-bottom-4"].join(" ")}>
          <Stat value={card.attack} kind="attack" size={compact ? "sm" : "lg"} />
          <Stat value={card.health} kind="health" size={compact ? "sm" : "lg"} />
        </div>
      )}

      {/* hover tooltip with flavor text */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 hidden w-52 -translate-x-1/2 rounded-xl border-2 border-goblin-gold bg-swamp-950 p-2.5 text-[11px] leading-snug text-parchment-100 shadow-panel group-hover:block">
        {card.flavor}
      </div>
    </button>
  );
}

interface BoardMinionProps {
  minion: MinionInstance;
  selectable?: boolean;
  selected?: boolean;
  targetable?: boolean;
  onClick?: () => void;
}

export function BoardMinionCard({ minion, selectable, selected, targetable, onClick }: BoardMinionProps) {
  const damaged = minion.health < minion.maxHealth;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!selectable && !targetable}
      className={[
        "relative flex h-40 w-36 flex-shrink-0 flex-col items-center rounded-[24px] border-[6px] bg-gradient-to-b from-parchment-100 to-parchment-300 pb-4 transition-all duration-150",
        RARITY_BORDER[minion.rarity],
        RARITY_GLOW[minion.rarity],
        selected ? "-translate-y-4 ring-4 ring-goblin-gold" : "",
        targetable ? "animate-pulse ring-4 ring-ember-500" : "",
        selectable || targetable ? "cursor-pointer hover:-translate-y-2" : "cursor-default",
        !minion.canAttack || minion.hasAttackedThisTurn ? "opacity-70 saturate-50" : "",
      ].join(" ")}
    >
      <div className="relative mx-2 mt-2 h-[84px] w-[calc(100%-16px)] overflow-hidden rounded-2xl border-[3px] border-swamp-950 bg-swamp-900">
        <GoblinIllustration variant={minion.variant} rarity={minion.rarity} cardId={minion.cardId} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <CornerOrnaments />
      </div>

      <div className="mx-2 mt-1.5 w-[calc(100%-16px)] rounded-lg border-y-2 border-goblin-gold/60 bg-swamp-950/95 px-1 py-1">
        <p className="w-full truncate text-center text-[11px] font-display font-bold leading-tight text-parchment-100">
          {minion.name}
        </p>
      </div>

      {minion.taunt && (
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full border border-swamp-950 bg-swamp-700 px-1.5 py-0.5 text-[7px] font-bold uppercase text-parchment-100 shadow">
          Taunt
        </span>
      )}

      <div className="pointer-events-none absolute -bottom-3.5 left-0 right-0 flex justify-between px-1.5">
        <Stat value={minion.attack} kind="attack" size="md" />
        <Stat value={minion.health} kind="health" size="md" pulse={damaged} />
      </div>

      {(!minion.canAttack || minion.hasAttackedThisTurn) && (
        <span className="absolute -bottom-3 right-1 rounded-full border border-swamp-950 bg-swamp-950/85 px-1.5 py-0.5 text-[8px] text-parchment-200">
          z z z
        </span>
      )}
    </button>
  );
}

const STAT_BG = {
  attack: "radial-gradient(circle at 35% 30%, #f3b46a, #db6e2e 45%, #8f3d10 100%)",
  health: "radial-gradient(circle at 35% 30%, #e08585, #8c2e2e 45%, #4a1414 100%)",
};

function Stat({
  value,
  kind,
  size,
  pulse,
}: {
  value: number;
  kind: "attack" | "health";
  size: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const dims = size === "sm" ? "h-8 w-8 text-xs" : size === "md" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  return (
    <span
      className={[
        "relative flex items-center justify-center rounded-full border-[3px] border-swamp-950 font-display font-extrabold text-white shadow-gem",
        dims,
        pulse ? "animate-shake" : "",
      ].join(" ")}
      style={{ background: STAT_BG[kind] }}
    >
      <GemShine />
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">{value}</span>
    </span>
  );
}

function SpellIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-witch-500 to-witch-700">
      <Icon.Scroll className="h-12 w-12 text-parchment-100 drop-shadow-md" />
    </div>
  );
}
