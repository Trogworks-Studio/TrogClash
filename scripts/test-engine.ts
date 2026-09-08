import { createGame, playCard, attackWithMinion, useHeroPower, endTurn } from "../lib/game/engine";
import { runBotTurn } from "../lib/game/bot";
import { applyMatchResult } from "../lib/game/rank";
import { GamePhase } from "../lib/types";

// TS narrows `state.phase` from the outer `while` condition and doesn't know
// that the imported engine functions mutate it by reference, so it treats
// later `=== "gameOver"` checks as unreachable. This helper reads the phase
// through a real function call, which returns the full `GamePhase` union
// instead of the (stale) narrowed literal type.
function currentPhase(state: ReturnType<typeof createGame>): GamePhase {
  return state.phase;
}

function playRandomPlayerTurn(state: ReturnType<typeof createGame>) {
  // Player plays whatever it can afford, greedily, then attacks face with anything available, then ends turn.
  let guard = 0;
  while (guard < 15) {
    guard++;
    const hand = state.player.hand;
    let played = false;
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i];
      if (card.cost > state.player.mana) continue;
      if (card.type === "spell" && card.targets === "enemyMinion" && state.bot.board.length === 0) continue;
      let targetId: string | null = null;
      if (card.type === "spell" && card.effect.kind === "damageTarget") {
        targetId = state.bot.board[0]?.instanceId ?? null;
        if (!targetId) continue;
      }
      if (card.type === "spell" && card.effect.kind === "buffMinion") {
        targetId = state.player.board[0]?.instanceId ?? null;
        if (!targetId) continue;
      }
      const res = playCard(state, "player", i, targetId);
      if (res.ok) {
        played = true;
        break;
      }
    }
    if (!played) break;
  }

  if (state.player.mana >= 2 && !state.player.heroPowerUsed) {
    useHeroPower(state, "player");
  }

  for (const m of [...state.player.board]) {
    const fresh = state.player.board.find((x) => x.instanceId === m.instanceId);
    if (fresh && fresh.canAttack && !fresh.hasAttackedThisTurn) {
      attackWithMinion(state, "player", fresh.instanceId, null);
    }
  }
}

let wins = 0;
let losses = 0;
let draws = 0;
const MAX_TURNS = 60;

for (let game = 0; game < 25; game++) {
  const state = createGame();
  let turns = 0;
  while (state.phase !== "gameOver" && turns < MAX_TURNS) {
    playRandomPlayerTurn(state);
    if (currentPhase(state) === "gameOver") break;
    endTurn(state); // -> botTurn
    runBotTurn(state);
    if (currentPhase(state) === "gameOver") break;
    endTurn(state); // -> back to playerTurn, new turnNumber
    turns++;
  }
  if (state.winner === "player") wins++;
  else if (state.winner === "bot") losses++;
  else draws++;

  if (turns >= MAX_TURNS) {
    console.error(`Game ${game} did not terminate within ${MAX_TURNS} turns!`);
  }
}

console.log(`Simulated 25 games — player wins: ${wins}, losses: ${losses}, draws/timeouts: ${draws}`);

// rank sanity through the real module
let record = { level: 1, xp: 0, wins: 0, losses: 0 };
record = applyMatchResult(record, true);
record = applyMatchResult(record, true);
record = applyMatchResult(record, false);
console.log("rank after W,W,L:", record);

console.log("OK: engine + bot + rank ran without throwing.");
