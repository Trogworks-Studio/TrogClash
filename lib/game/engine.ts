import { CardDef, GameState, LogEntry, MinionInstance, MinionCard, PlayerId, PlayerState, SpellCard } from "@/lib/types";
import { buildStarterDeck } from "@/lib/game/cards";

export const MAX_MANA = 10;
export const MAX_BOARD = 5;
export const START_HEALTH = 30;
export const HERO_POWER_COST = 2;
export const HERO_POWER_DAMAGE = 2;

let idCounter = 0;
function uid(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function newPlayerState(id: PlayerId): PlayerState {
  return {
    id,
    heroHealth: START_HEALTH,
    maxHeroHealth: START_HEALTH,
    deck: shuffle(buildStarterDeck()),
    hand: [],
    board: [],
    mana: 0,
    maxMana: 0,
    heroPowerUsed: false,
    fatigue: 0,
  };
}

function log(state: GameState, text: string) {
  state.log.push({ id: uid("log"), text });
  if (state.log.length > 60) state.log.shift();
}

function drawCard(state: GameState, p: PlayerState) {
  if (p.deck.length === 0) {
    p.fatigue += 1;
    p.heroHealth -= p.fatigue;
    log(state, `${displayName(p)} destesi bitti, yorgunluktan ${p.fatigue} hasar aldı.`);
    return;
  }
  const card = p.deck.shift()!;
  if (p.hand.length < 10) {
    p.hand.push(card);
  } else {
    log(state, `${displayName(p)} elin dolu, ${card.name} yakılıp kül oldu.`);
  }
}

function displayName(p: PlayerState) {
  return p.id === "player" ? "Sen" : "Bot";
}

export function createGame(): GameState {
  const player = newPlayerState("player");
  const bot = newPlayerState("bot");
  const state: GameState = {
    player,
    bot,
    phase: "playerTurn",
    turnNumber: 1,
    winner: null,
    log: [],
    selectedAttackerId: null,
  };
  for (let i = 0; i < 3; i++) drawCard(state, player);
  for (let i = 0; i < 4; i++) drawCard(state, bot); // bot goes second, gets an extra card
  player.maxMana = 1;
  player.mana = 1;
  log(state, "Maç başladı! Kartlarını çamura göm ve savaş.");
  return state;
}

function makeMinionInstance(card: MinionCard): MinionInstance {
  return {
    instanceId: uid("minion"),
    cardId: card.id,
    name: card.name,
    variant: card.variant,
    attack: card.attack,
    health: card.health,
    maxHealth: card.health,
    taunt: !!card.taunt,
    canAttack: !!card.charge,
    hasAttackedThisTurn: false,
    justSummoned: true,
    rarity: card.rarity,
  };
}

function cleanupDead(state: GameState) {
  const deadPlayer = state.player.board.filter((m) => m.health <= 0);
  const deadBot = state.bot.board.filter((m) => m.health <= 0);
  deadPlayer.forEach((m) => log(state, `${m.name} bataklığa geri döndü.`));
  deadBot.forEach((m) => log(state, `${m.name} bataklığa geri döndü.`));
  state.player.board = state.player.board.filter((m) => m.health > 0);
  state.bot.board = state.bot.board.filter((m) => m.health > 0);
}

function checkWinner(state: GameState) {
  if (state.bot.heroHealth <= 0 && state.player.heroHealth <= 0) {
    state.winner = null; // simultaneous fatigue death — rare edge case, call it a draw-to-loss for the active player
    state.phase = "gameOver";
    log(state, "İkisi de aynı anda düştü. Bataklık kazandı.");
  } else if (state.bot.heroHealth <= 0) {
    state.winner = "player";
    state.phase = "gameOver";
    log(state, "Bot'un kalesi yıkıldı. Kazandın!");
  } else if (state.player.heroHealth <= 0) {
    state.winner = "bot";
    state.phase = "gameOver";
    log(state, "Kalen yıkıldı. Bot kazandı.");
  }
}

export function startTurn(state: GameState, who: PlayerId) {
  const p = who === "player" ? state.player : state.bot;
  p.maxMana = Math.min(MAX_MANA, p.maxMana + 1);
  p.mana = p.maxMana;
  p.heroPowerUsed = false;
  p.board.forEach((m) => {
    m.canAttack = true;
    m.hasAttackedThisTurn = false;
    m.justSummoned = false;
  });
  drawCard(state, p);
  log(state, `${displayName(p)} sırası. (Mana: ${p.mana}/${p.maxMana})`);
}

export interface ActionResult {
  ok: boolean;
  reason?: string;
}

export function playCard(state: GameState, who: PlayerId, handIndex: number, targetInstanceId?: string | null): ActionResult {
  const p = who === "player" ? state.player : state.bot;
  const opponent = who === "player" ? state.bot : state.player;
  const card: CardDef | undefined = p.hand[handIndex];
  if (!card) return { ok: false, reason: "Kart yok" };
  if (card.cost > p.mana) return { ok: false, reason: "Yeterli mana yok" };

  if (card.type === "minion") {
    if (p.board.length >= MAX_BOARD) return { ok: false, reason: "Tahta dolu" };
    p.mana -= card.cost;
    p.hand.splice(handIndex, 1);
    const inst = makeMinionInstance(card);
    p.board.push(inst);
    log(state, `${displayName(p)}, ${card.name} çağırdı.`);
    if (card.onPlay) applyMinionOnPlay(state, p, opponent, card.onPlay, inst);
  } else {
    const spell = card as SpellCard;
    if (spell.targets !== "none" && !targetInstanceId && spell.targets !== "enemyHero") {
      return { ok: false, reason: "Hedef seç" };
    }
    p.mana -= spell.cost;
    p.hand.splice(handIndex, 1);
    log(state, `${displayName(p)}, ${spell.name} büyüsünü kullandı.`);
    applySpellEffect(state, p, opponent, spell, targetInstanceId ?? null);
  }

  cleanupDead(state);
  checkWinner(state);
  return { ok: true };
}

function applyMinionOnPlay(
  state: GameState,
  owner: PlayerState,
  opponent: PlayerState,
  onPlay: NonNullable<MinionCard["onPlay"]>,
  self: MinionInstance
) {
  switch (onPlay.kind) {
    case "damage": {
      opponent.heroHealth -= onPlay.amount ?? 0;
      log(state, `${self.name} rakip kaleye ${onPlay.amount} hasar verdi.`);
      break;
    }
    case "heal": {
      owner.heroHealth = Math.min(owner.maxHeroHealth, owner.heroHealth + (onPlay.amount ?? 0));
      log(state, `${self.name} ${onPlay.amount} can iyileştirdi.`);
      break;
    }
    case "buffBoardAttack": {
      owner.board.forEach((m) => {
        m.attack += onPlay.amount ?? 0;
      });
      log(state, `${self.name} tüm dostları güçlendirdi.`);
      break;
    }
    case "drawCard": {
      for (let i = 0; i < (onPlay.amount ?? 1); i++) drawCard(state, owner);
      break;
    }
  }
}

function applySpellEffect(
  state: GameState,
  caster: PlayerState,
  opponent: PlayerState,
  spell: SpellCard,
  targetInstanceId: string | null
) {
  const { effect } = spell;
  switch (effect.kind) {
    case "damageTarget": {
      const target = opponent.board.find((m) => m.instanceId === targetInstanceId) ?? caster.board.find((m) => m.instanceId === targetInstanceId);
      if (target) {
        target.health -= effect.amount;
        log(state, `${target.name} ${effect.amount} hasar aldı.`);
      }
      break;
    }
    case "damageAll": {
      opponent.board.forEach((m) => {
        m.health -= effect.amount;
      });
      log(state, `Rakibin tüm birlikleri ${effect.amount} hasar aldı.`);
      break;
    }
    case "healHero": {
      caster.heroHealth = Math.min(caster.maxHeroHealth, caster.heroHealth + effect.amount);
      break;
    }
    case "drawCards": {
      for (let i = 0; i < effect.amount; i++) drawCard(state, caster);
      break;
    }
    case "buffMinion": {
      const target = caster.board.find((m) => m.instanceId === targetInstanceId) ?? opponent.board.find((m) => m.instanceId === targetInstanceId);
      if (target) {
        target.attack += effect.amount;
        target.health += effect.amount;
        target.maxHealth += effect.amount;
        log(state, `${target.name} güçlendi (+${effect.amount}/+${effect.amount}).`);
      }
      break;
    }
  }
}

export function useHeroPower(state: GameState, who: PlayerId): ActionResult {
  const p = who === "player" ? state.player : state.bot;
  const opponent = who === "player" ? state.bot : state.player;
  if (p.heroPowerUsed) return { ok: false, reason: "Bu tur zaten kullanıldı" };
  if (p.mana < HERO_POWER_COST) return { ok: false, reason: "Yeterli mana yok" };
  p.mana -= HERO_POWER_COST;
  p.heroPowerUsed = true;
  opponent.heroHealth -= HERO_POWER_DAMAGE;
  log(state, `${displayName(p)}, Trog Yumruğu ile ${HERO_POWER_DAMAGE} hasar verdi.`);
  checkWinner(state);
  return { ok: true };
}

export function attackWithMinion(
  state: GameState,
  who: PlayerId,
  attackerInstanceId: string,
  defenderInstanceId: string | null
): ActionResult {
  const attackerState = who === "player" ? state.player : state.bot;
  const defenderState = who === "player" ? state.bot : state.player;
  const attacker = attackerState.board.find((m) => m.instanceId === attackerInstanceId);
  if (!attacker) return { ok: false, reason: "Saldırgan yok" };
  if (!attacker.canAttack || attacker.hasAttackedThisTurn) return { ok: false, reason: "Bu birlik saldıramaz" };

  const taunts = defenderState.board.filter((m) => m.taunt);

  if (defenderInstanceId === null) {
    if (taunts.length > 0) return { ok: false, reason: "Önce taunt'lı birliğe saldırmalısın" };
    defenderState.heroHealth -= attacker.attack;
    attacker.hasAttackedThisTurn = true;
    log(state, `${attacker.name}, ${displayName(defenderState)} kalesine ${attacker.attack} hasar verdi.`);
    checkWinner(state);
    return { ok: true };
  }

  const defender = defenderState.board.find((m) => m.instanceId === defenderInstanceId);
  if (!defender) return { ok: false, reason: "Hedef yok" };
  if (taunts.length > 0 && !defender.taunt) return { ok: false, reason: "Önce taunt'lı birliğe saldırmalısın" };

  defender.health -= attacker.attack;
  attacker.health -= defender.attack;
  attacker.hasAttackedThisTurn = true;
  log(state, `${attacker.name}, ${defender.name} ile çarpıştı.`);

  cleanupDead(state);
  checkWinner(state);
  return { ok: true };
}

export function endTurn(state: GameState): GameState {
  if (state.phase === "gameOver") return state;
  if (state.phase === "playerTurn") {
    state.phase = "botTurn";
    startTurn(state, "bot");
  } else {
    state.turnNumber += 1;
    state.phase = "playerTurn";
    startTurn(state, "player");
  }
  return state;
}
