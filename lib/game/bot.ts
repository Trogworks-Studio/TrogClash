import { GameState } from "@/lib/types";
import { attackWithMinion, playCard, useHeroPower } from "@/lib/game/engine";

/**
 * A deliberately simple, readable heuristic bot — not unbeatable, but it
 * punishes sloppy play: it curves out, trades favorably when it can, and
 * goes face when it can't. Good enough for a ranked "practice partner" while
 * real online PvP isn't wired up yet.
 */
export function runBotTurn(state: GameState) {
  playCardsGreedily(state);
  maybeUseHeroPower(state);
  attackGreedily(state);
}

function playCardsGreedily(state: GameState) {
  let safety = 0;
  while (safety < 20) {
    safety += 1;
    const bot = state.bot;
    if (bot.board.length >= 5) break;

    // prefer the most expensive affordable minion (curve out), spells only if a good target exists
    let bestIndex = -1;
    let bestCost = -1;
    for (let i = 0; i < bot.hand.length; i++) {
      const card = bot.hand[i];
      if (card.cost > bot.mana) continue;
      if (card.type === "spell") {
        const needsEnemyTarget = card.targets === "enemyMinion";
        if (needsEnemyTarget && state.player.board.length === 0) continue;
      }
      if (card.cost > bestCost) {
        bestCost = card.cost;
        bestIndex = i;
      }
    }
    if (bestIndex === -1) break;

    const card = bot.hand[bestIndex];
    let targetId: string | null = null;
    if (card.type === "spell" && card.targets !== "none") {
      if (card.effect.kind === "damageTarget") {
        const weakest = [...state.player.board].sort((a, b) => a.health - b.health)[0];
        targetId = weakest ? weakest.instanceId : null;
        if (!targetId) break; // nothing to target, skip this spell
      } else if (card.effect.kind === "buffMinion") {
        const biggest = [...bot.board].sort((a, b) => b.attack - a.attack)[0];
        targetId = biggest ? biggest.instanceId : null;
        if (!targetId) break;
      }
    }

    const result = playCard(state, "bot", bestIndex, targetId);
    if (!result.ok) break;
  }
}

function maybeUseHeroPower(state: GameState) {
  if (state.bot.mana >= 2 && !state.bot.heroPowerUsed) {
    useHeroPower(state, "bot");
  }
}

function attackGreedily(state: GameState) {
  const attackers = [...state.bot.board];
  for (const attacker of attackers) {
    if (state.phase === "gameOver") return;
    const fresh = state.bot.board.find((m) => m.instanceId === attacker.instanceId);
    if (!fresh || !fresh.canAttack || fresh.hasAttackedThisTurn) continue;

    const enemyBoard = state.player.board;
    const taunts = enemyBoard.filter((m) => m.taunt);
    const candidates = taunts.length > 0 ? taunts : enemyBoard;

    // find a trade where we kill their minion and survive
    const goodTrade = candidates.find((m) => fresh.attack >= m.health && fresh.health > m.attack);
    // otherwise a trade where we at least kill something even if we die too
    const evenTrade = candidates.find((m) => fresh.attack >= m.health);

    if (goodTrade) {
      attackWithMinion(state, "bot", fresh.instanceId, goodTrade.instanceId);
    } else if (evenTrade && taunts.length > 0) {
      // forced into taunt, take the trade
      attackWithMinion(state, "bot", fresh.instanceId, evenTrade.instanceId);
    } else if (taunts.length > 0) {
      // must attack a taunt even if unfavorable
      attackWithMinion(state, "bot", fresh.instanceId, taunts[0].instanceId);
    } else {
      // no taunt in the way — go face
      attackWithMinion(state, "bot", fresh.instanceId, null);
    }
  }
}
