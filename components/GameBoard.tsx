"use client";

import { useEffect, useRef, useState } from "react";
import {
  createGame,
  playCard,
  attackWithMinion,
  useHeroPower,
  endTurn,
  HERO_POWER_COST,
} from "@/lib/game/engine";
import { runBotTurn } from "@/lib/game/bot";
import { GameState, MinionInstance, SpellCard } from "@/lib/types";
import HeroPortrait from "@/components/HeroPortrait";
import ManaBar from "@/components/ManaBar";
import { HandCard, BoardMinionCard } from "@/components/CardView";

interface Props {
  onGameOver: (didWin: boolean) => void;
}

interface PendingSpell {
  handIndex: number;
  spell: SpellCard;
}

export default function GameBoard({ onGameOver }: Props) {
  const [state, setState] = useState<GameState>(() => createGame());
  const [selectedAttackerId, setSelectedAttackerId] = useState<string | null>(null);
  const [pendingSpell, setPendingSpell] = useState<PendingSpell | null>(null);
  const reportedRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  function mutate(fn: (draft: GameState) => void) {
    setState((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
  }

  // bot's turn plays itself out after a short delay for readability
  useEffect(() => {
    if (state.phase !== "botTurn") return;
    const timer = setTimeout(() => {
      setState((prev) => {
        if (prev.phase !== "botTurn") return prev;
        // Explicit annotation on purpose: without it, `draft`'s inferred type
        // inherits the narrowed `phase: "botTurn"` literal from `prev` above,
        // and TS then treats `runBotTurn` mutating `draft.phase` as
        // impossible, flagging the check below as an unreachable comparison.
        const draft: GameState = structuredClone(prev);
        runBotTurn(draft);
        if (draft.phase !== "gameOver") {
          endTurn(draft);
        }
        return draft;
      });
    }, 900);
    return () => clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "gameOver" && !reportedRef.current) {
      reportedRef.current = true;
      onGameOver(state.winner === "player");
    }
  }, [state.phase, state.winner, onGameOver]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.log.length]);

  const isPlayerTurn = state.phase === "playerTurn";

  function handlePlayCard(index: number) {
    if (!isPlayerTurn) return;
    const card = state.player.hand[index];
    if (!card) return;
    if (card.cost > state.player.mana) return;

    if (card.type === "spell" && card.targets !== "none") {
      setPendingSpell({ handIndex: index, spell: card });
      return;
    }

    mutate((draft) => {
      playCard(draft, "player", index, null);
    });
    setSelectedAttackerId(null);
  }

  function cancelSpell() {
    setPendingSpell(null);
  }

  function resolveSpellOnMinion(minion: MinionInstance, isOwnMinion: boolean) {
    if (!pendingSpell) return;
    const { spell, handIndex } = pendingSpell;
    const validTarget =
      (spell.targets === "enemyMinion" && !isOwnMinion) || (spell.targets === "anyMinion" && true);
    if (!validTarget) return;
    mutate((draft) => {
      playCard(draft, "player", handIndex, minion.instanceId);
    });
    setPendingSpell(null);
  }

  function handleOwnMinionClick(minion: MinionInstance) {
    if (pendingSpell) {
      resolveSpellOnMinion(minion, true);
      return;
    }
    if (!isPlayerTurn) return;
    if (selectedAttackerId === minion.instanceId) {
      setSelectedAttackerId(null);
      return;
    }
    if (minion.canAttack && !minion.hasAttackedThisTurn) {
      setSelectedAttackerId(minion.instanceId);
    }
  }

  function handleEnemyMinionClick(minion: MinionInstance) {
    if (pendingSpell) {
      resolveSpellOnMinion(minion, false);
      return;
    }
    if (!isPlayerTurn || !selectedAttackerId) return;
    mutate((draft) => {
      attackWithMinion(draft, "player", selectedAttackerId, minion.instanceId);
    });
    setSelectedAttackerId(null);
  }

  function handleAttackFace() {
    if (!isPlayerTurn || !selectedAttackerId || pendingSpell) return;
    mutate((draft) => {
      attackWithMinion(draft, "player", selectedAttackerId, null);
    });
    setSelectedAttackerId(null);
  }

  function handleHeroPower() {
    if (!isPlayerTurn) return;
    mutate((draft) => {
      useHeroPower(draft, "player");
    });
  }

  function handleEndTurn() {
    if (!isPlayerTurn) return;
    setSelectedAttackerId(null);
    setPendingSpell(null);
    mutate((draft) => {
      endTurn(draft);
    });
  }

  const enemyTauntActive = state.bot.board.some((m) => m.taunt);

  return (
    <div className="relative flex h-full flex-col gap-4 rounded-[28px] border-4 border-swamp-800 bg-swamp-900 bg-board-felt p-3 shadow-frame sm:p-5">
      {/* ornate corner accents on the whole battle panel */}
      <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-goblin-gold/50" />
      <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-goblin-gold/50" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-goblin-gold/50" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-goblin-gold/50" />

      {/* enemy row */}
      <div className="flex items-center justify-between">
        <HeroPortrait name="Bot" health={state.bot.heroHealth} maxHealth={state.bot.maxHeroHealth} isBot />
        <ManaBar mana={state.bot.mana} maxMana={state.bot.maxMana} />
        <div className="text-[11px] font-bold text-parchment-300">Elinde {state.bot.hand.length} kart</div>
      </div>

      <div
        onClick={handleAttackFace}
        className={[
          "scrollbar-thin flex min-h-[180px] items-center justify-center gap-4 overflow-x-auto rounded-[22px] border-2 border-dashed border-swamp-700/70 bg-swamp-950/30 p-4 transition-colors",
          selectedAttackerId && !enemyTauntActive ? "cursor-crosshair bg-ember-600/10 hover:bg-ember-600/20" : "",
        ].join(" ")}
        title={selectedAttackerId ? "Bot'un kalesine saldır" : undefined}
      >
        {state.bot.board.length === 0 && <span className="text-xs text-parchment-300/60">Bot'un tahtası boş</span>}
        {state.bot.board.map((m) => (
          <div key={m.instanceId} onClick={(e) => e.stopPropagation()}>
            <BoardMinionCard
              minion={m}
              targetable={Boolean(pendingSpell && pendingSpell.spell.targets === "enemyMinion") || Boolean(selectedAttackerId)}
              onClick={() => handleEnemyMinionClick(m)}
            />
          </div>
        ))}
      </div>

      {/* divider / battle log */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-swamp-600 to-transparent" />
        <span className="rounded-full border border-goblin-gold/40 bg-swamp-950/60 px-3 py-1 font-display text-[11px] uppercase tracking-widest text-goblin-gold">
          Tur {state.turnNumber} — {isPlayerTurn ? "Sıra sende" : "Bot oynuyor…"}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-swamp-600 to-transparent" />
      </div>

      {/* player board */}
      <div className="scrollbar-thin flex min-h-[180px] items-center justify-center gap-4 overflow-x-auto rounded-[22px] border-2 border-dashed border-swamp-700/70 bg-swamp-950/30 p-4">
        {state.player.board.length === 0 && <span className="text-xs text-parchment-300/60">Tahtan boş — kart oyna!</span>}
        {state.player.board.map((m) => (
          <BoardMinionCard
            key={m.instanceId}
            minion={m}
            selectable={isPlayerTurn && !pendingSpell}
            selected={selectedAttackerId === m.instanceId}
            targetable={Boolean(pendingSpell && pendingSpell.spell.targets === "anyMinion")}
            onClick={() => handleOwnMinionClick(m)}
          />
        ))}
      </div>

      {/* player hero row + end turn */}
      <div className="flex items-center justify-between">
        <HeroPortrait
          name="Sen"
          health={state.player.heroHealth}
          maxHealth={state.player.maxHeroHealth}
          heroPowerUsable={isPlayerTurn && !state.player.heroPowerUsed && state.player.mana >= HERO_POWER_COST}
          onHeroPower={handleHeroPower}
        />
        <ManaBar mana={state.player.mana} maxMana={state.player.maxMana} />
        <button
          type="button"
          onClick={handleEndTurn}
          disabled={!isPlayerTurn}
          className={[
            "rounded-full border-[3px] border-swamp-950 px-6 py-3 font-display text-sm font-bold text-white shadow-card-lg transition-transform",
            isPlayerTurn ? "bg-gradient-to-b from-ember-500 to-ember-600 hover:scale-105 active:scale-95" : "bg-swamp-700 opacity-50",
          ].join(" ")}
        >
          Turu Bitir
        </button>
      </div>

      {/* hand */}
      <div className="scrollbar-thin flex items-end gap-4 overflow-x-auto px-3 pb-5 pt-8">
        {state.player.hand.map((card, i) => (
          <div key={`${card.id}-${i}`} className="animate-pop-in">
            <HandCard card={card} disabled={!isPlayerTurn || card.cost > state.player.mana} onPlay={() => handlePlayCard(i)} />
          </div>
        ))}
      </div>

      {pendingSpell && (
        <div className="flex items-center justify-between rounded-xl border-2 border-goblin-gold bg-swamp-950/90 px-3 py-2 text-xs text-parchment-100">
          <span>
            <strong>{pendingSpell.spell.name}</strong> için hedef seç
            {pendingSpell.spell.targets === "enemyMinion" ? " (rakip birlik)" : " (bir birlik)"}
          </span>
          <button type="button" onClick={cancelSpell} className="rounded-full bg-blood-600 px-3 py-1 font-bold">
            İptal
          </button>
        </div>
      )}

      {/* battle log */}
      <div className="scrollbar-thin mt-1 max-h-16 overflow-y-auto rounded-lg bg-swamp-950/50 px-3 py-1 text-[10px] leading-relaxed text-parchment-300/80">
        {state.log.slice(-8).map((entry) => (
          <div key={entry.id}>{entry.text}</div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
