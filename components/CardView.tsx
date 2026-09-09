"use client";

import { useState } from "react";
import { CardDef, MinionInstance, Rarity } from "@/lib/types";
import GoblinIllustration from "@/components/GoblinIllustration";
import { Icon } from "@/components/icons";
import { playSfx } from "@/lib/audio/sfx";

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
  legendary: "bg-goblin-gold animate-aura-pulse",
};

/** 3D perspective tilt on hover/press — a CSS-only stand-in for a full WebGL card (see note in the response). */
const TILT_HOVER =
  "hover:[transform:perspective(900px)_rotateX(6deg)_rotateY(-8deg)_translateY(-26%)_scale(1.06)] active:[transform:perspective(900px)_rotateX(2deg)_scale(0.98)]";
const TILT_HOVER_BOARD =
  "hover:[transform:perspective(900px)_rotateX(8deg)_translateY(-14%)_scale(1.05)] active:[transform:perspective(900px)_scale(0.97)]";

function CornerOrnaments() {
  return (
    <>
      <span className="pointer-events-none absolute left-[6%] top-[6%] h-[12%] w-[12%] border-l-2 border-t-2 border-goblin-gold/70" />
      <span className="pointer-events-none absolute right-[6%] top-[6%] h-[12%] w-[12%] border-r-2 border-t-2 border-goblin-gold/70" />
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
  const [committing, setCommitting] = useState(false);

  function handleClick() {
    if (disabled || committing) return;
    playSfx("cardPlay");
    setCommitting(true);
    setTimeout(onPlay, 200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      style={{ width: compact ? "calc(var(--hand-card-w) * 0.72)" : "var(--hand-card-w)", transformStyle: "preserve-3d" }}
      className={[
        "group relative flex aspect-[0.6] flex-shrink-0 select-none flex-col rounded-[14%] border-[4px] bg-gradient-to-b from-parchment-100 via-parchment-100 to-parchment-300 text-swamp-950",
        "origin-bottom transition-transform duration-150 ease-out will-change-transform",
        disabled ? "opacity-45 grayscale cursor-not-allowed" : `cursor-pointer ${TILT_HOVER}`,
        committing ? "animate-card-commit pointer-events-none" : "",
        RARITY_BORDER[card.rarity],
        RARITY_GLOW[card.rarity],
      ].join(" ")}
      title={card.flavor}
    >
      {/* mana cost gem — glassy jewel */}
      <div
        className="absolute -left-[9%] -top-[9%] z-10 flex aspect-square w-[30%] rotate-45 items-center justify-center rounded-[22%] border-2 border-swamp-950 font-display font-extrabold text-white shadow-gem"
        style={{ background: "radial-gradient(circle at 35% 30%, #7dd3fc, #0ea5e9 45%, #0369a1 100%)" }}
      >
        <GemShine />
        <span className="-rotate-45 text-[clamp(11px,3.2vw,20px)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">{card.cost}</span>
      </div>

      {/* portrait panel — fills remaining vertical space */}
      <div className="relative mx-[6%] mt-[9%] min-h-0 flex-1 overflow-hidden rounded-[16%] border-2 border-swamp-950 bg-swamp-900">
        {card.type === "minion" ? (
          <GoblinIllustration variant={card.variant} rarity={card.rarity} cardId={card.id} className="h-full w-full" />
        ) : (
          <SpellIcon />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <CornerOrnaments />
      </div>

      {/* rarity gem, straddling portrait / nameplate seam */}
      <div className={["relative z-10 mx-auto -mt-[3%] h-[7%] w-[7%] rotate-45 rounded-[15%] border-2 border-swamp-950 shadow-md", RARITY_GEM[card.rarity]].join(" ")} />

      {/* name plate */}
      <div className="mx-[6%] mt-[1%] flex-shrink-0 rounded-[10%] border-y-2 border-goblin-gold/70 bg-gradient-to-b from-swamp-900 to-swamp-950 px-1 py-[3%] shadow-inner">
        <p className="flex items-center justify-center gap-1 text-center font-display font-bold leading-tight text-parchment-100 text-[clamp(8px,2.4vw,14px)]">
          <span className="h-[3px] w-[3px] flex-shrink-0 rotate-45 bg-goblin-gold/70" />
          <span className="truncate">{card.name}</span>
          <span className="h-[3px] w-[3px] flex-shrink-0 rotate-45 bg-goblin-gold/70" />
        </p>
      </div>

      {card.type === "spell" && (
        <p className="mt-[2%] flex flex-shrink-0 items-center justify-center gap-1 text-center font-bold uppercase tracking-wider text-witch-700 text-[clamp(6px,1.8vw,10px)]">
          <span className="h-[3px] w-[3px] rotate-45 bg-witch-500" />
          Büyü
          <span className="h-[3px] w-[3px] rotate-45 bg-witch-500" />
        </p>
      )}

      {card.type === "minion" && card.taunt && (
        <span className="absolute left-1/2 top-[62%] -translate-x-1/2 rounded-full border border-swamp-950 bg-gradient-to-b from-swamp-600 to-swamp-800 px-2 py-0.5 font-bold uppercase text-parchment-100 shadow text-[clamp(6px,1.6vw,9px)]">
          Taunt
        </span>
      )}

      {/* stat gems, overlapping the card's bottom edge */}
      {card.type === "minion" && (
        <div className="pointer-events-none absolute -bottom-[6%] left-0 right-0 flex justify-between px-[4%]">
          <Stat value={card.attack} kind="attack" />
          <Stat value={card.health} kind="health" />
        </div>
      )}

      {/* hover tooltip with flavor text (desktop only — no room on small screens) */}
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
      style={{ width: "var(--board-card-w)" }}
      className={[
        "relative flex aspect-[0.72] flex-shrink-0 flex-col items-center rounded-[12%] border-[4px] bg-gradient-to-b from-parchment-100 to-parchment-300 pb-[8%] transition-transform duration-150",
        RARITY_BORDER[minion.rarity],
        RARITY_GLOW[minion.rarity],
        selected ? "-translate-y-[10%] ring-4 ring-goblin-gold" : "",
        targetable ? "animate-aura-pulse ring-4 ring-ember-500" : "",
        selectable || targetable ? `cursor-pointer ${TILT_HOVER_BOARD}` : "cursor-default",
        !minion.canAttack || minion.hasAttackedThisTurn ? "opacity-70 saturate-50" : "",
      ].join(" ")}
    >
      <div className="relative mx-[5%] mt-[5%] min-h-0 flex-1 w-[90%] overflow-hidden rounded-[14%] border-2 border-swamp-950 bg-swamp-900">
        <GoblinIllustration variant={minion.variant} rarity={minion.rarity} cardId={minion.cardId} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <CornerOrnaments />
      </div>

      <div className="mx-[5%] mt-[4%] w-[90%] flex-shrink-0 rounded-[8%] border-y-2 border-goblin-gold/60 bg-swamp-950/95 px-1 py-[2%]">
        <p className="w-full truncate text-center font-display font-bold leading-tight text-parchment-100 text-[clamp(7px,2vw,12px)]">
          {minion.name}
        </p>
      </div>

      {minion.taunt && (
        <span className="absolute top-[4%] left-1/2 -translate-x-1/2 rounded-full border border-swamp-950 bg-swamp-700 px-1.5 py-0.5 font-bold uppercase text-parchment-100 shadow text-[6px]">
          Taunt
        </span>
      )}

      <div className="pointer-events-none absolute -bottom-[8%] left-0 right-0 flex justify-between px-[3%]">
        <Stat value={minion.attack} kind="attack" small />
        <Stat value={minion.health} kind="health" small pulse={damaged} />
      </div>

      {(!minion.canAttack || minion.hasAttackedThisTurn) && (
        <span className="absolute -bottom-[6%] right-0 rounded-full border border-swamp-950 bg-swamp-950/85 px-1.5 py-0.5 text-parchment-200 text-[7px]">
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

function Stat({ value, kind, small, pulse }: { value: number; kind: "attack" | "health"; small?: boolean; pulse?: boolean }) {
  return (
    <span
      className={[
        "relative flex aspect-square items-center justify-center rounded-full border-2 border-swamp-950 font-display font-extrabold text-white shadow-gem",
        small ? "w-[22%]" : "w-[18%]",
        pulse ? "animate-shake" : "",
      ].join(" ")}
      style={{ background: STAT_BG[kind] }}
    >
      <GemShine />
      <span className="text-[clamp(9px,2.6vw,16px)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">{value}</span>
    </span>
  );
}

function SpellIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-witch-500 to-witch-700">
      <Icon.Scroll className="h-[40%] w-[40%] text-parchment-100 drop-shadow-md" />
    </div>
  );
}
