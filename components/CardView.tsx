"use client";

import { CardDef, MinionInstance } from "@/lib/types";
import GoblinIllustration from "@/components/GoblinIllustration";

const RARITY_BORDER: Record<string, string> = {
  common: "border-swamp-600",
  rare: "border-sky-500",
  epic: "border-witch-500",
  legendary: "border-goblin-gold",
};

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
        "group relative flex-shrink-0 select-none rounded-2xl border-4 bg-parchment-100 text-swamp-950",
        "shadow-card transition-transform duration-150 ease-out",
        disabled ? "opacity-45 grayscale cursor-not-allowed" : "hover:-translate-y-3 hover:rotate-0 active:translate-y-0",
        compact ? "w-[104px]" : "w-[132px]",
        RARITY_BORDER[card.rarity],
      ].join(" ")}
      title={card.flavor}
    >
      {/* mana cost gem */}
      <div className="absolute -left-2 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-swamp-950 bg-witch-500 font-display text-lg font-bold text-white shadow-md">
        {card.cost}
      </div>

      <div className="flex h-full flex-col items-center px-2 pb-2 pt-3">
        <div className="mb-1 h-16 w-16 overflow-hidden rounded-full border-2 border-swamp-950 bg-swamp-800">
          {card.type === "minion" ? (
            <GoblinIllustration variant={card.variant} rarity={card.rarity} className="h-full w-full" />
          ) : (
            <SpellIcon />
          )}
        </div>
        <p className="font-display text-[11px] font-bold leading-tight text-swamp-950">{card.name}</p>
        {card.type === "minion" && (
          <div className="mt-1 flex w-full items-center justify-between px-1">
            <Stat value={card.attack} colorClass="bg-ember-600" />
            <Stat value={card.health} colorClass="bg-blood-600" />
          </div>
        )}
        {card.type === "spell" && <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-witch-700">Büyü</p>}
        {card.type === "minion" && card.taunt && (
          <span className="mt-1 rounded bg-swamp-700 px-1.5 py-0.5 text-[8px] font-bold uppercase text-parchment-100">Taunt</span>
        )}
      </div>

      {/* hover tooltip with flavor text */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-44 -translate-x-1/2 rounded-lg border-2 border-goblin-gold bg-swamp-950 p-2 text-[10px] text-parchment-100 shadow-panel group-hover:block">
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
        "relative flex h-24 w-20 flex-shrink-0 flex-col items-center rounded-xl border-4 bg-parchment-100 shadow-card transition-transform",
        RARITY_BORDER[minion.rarity],
        selected ? "-translate-y-2 ring-4 ring-goblin-gold" : "",
        targetable ? "animate-pulse ring-4 ring-ember-500" : "",
        selectable || targetable ? "cursor-pointer hover:-translate-y-1" : "cursor-default",
        !minion.canAttack || minion.hasAttackedThisTurn ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="mt-1 h-12 w-12 overflow-hidden rounded-full border-2 border-swamp-950 bg-swamp-800">
        <GoblinIllustration variant={minion.variant} rarity={minion.rarity} className="h-full w-full" />
      </div>
      <p className="mt-0.5 w-full truncate px-1 text-center text-[9px] font-display font-bold text-swamp-950">{minion.name}</p>
      <div className="mt-auto flex w-full items-center justify-between px-1 pb-1">
        <Stat value={minion.attack} colorClass="bg-ember-600" small />
        <Stat value={minion.health} colorClass={damaged ? "bg-blood-600 animate-shake" : "bg-blood-600"} small />
      </div>
      {minion.taunt && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-swamp-700 px-1 text-[7px] font-bold uppercase text-parchment-100">
          Taunt
        </span>
      )}
      {(!minion.canAttack || minion.hasAttackedThisTurn) && (
        <span className="absolute -bottom-2 right-0 rounded-full bg-swamp-950/80 px-1 text-[7px] text-parchment-200">z z z</span>
      )}
    </button>
  );
}

function Stat({ value, colorClass, small }: { value: number; colorClass: string; small?: boolean }) {
  return (
    <span
      className={[
        "flex items-center justify-center rounded-full border-2 border-swamp-950 font-display font-bold text-white",
        colorClass,
        small ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-xs",
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function SpellIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-witch-700">
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-parchment-100">
        <path
          fill="currentColor"
          d="M12 2l1.9 5.6L19.5 8l-4.6 3.6L16.6 17 12 13.8 7.4 17l1.7-5.4L4.5 8l5.6-.4L12 2z"
        />
      </svg>
    </div>
  );
}
