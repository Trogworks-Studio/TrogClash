export type Rarity = "common" | "rare" | "epic" | "legendary";

export type GoblinVariant =
  | "grunt"
  | "shaman"
  | "sneak"
  | "brute"
  | "tinkerer"
  | "chief"
  | "swamp-beast"
  | "bat"
  | "mushroom"
  | "royal";

export interface MinionCard {
  id: string;
  type: "minion";
  name: string;
  cost: number;
  attack: number;
  health: number;
  taunt?: boolean;
  charge?: boolean;
  rarity: Rarity;
  variant: GoblinVariant;
  flavor: string;
  /** simple on-play trigger, resolved by the engine */
  onPlay?: { kind: "damage" | "heal" | "buffBoardAttack" | "drawCard"; amount?: number };
}

export interface SpellCard {
  id: string;
  type: "spell";
  name: string;
  cost: number;
  rarity: Rarity;
  flavor: string;
  effect: {
    kind: "damageTarget" | "damageAll" | "healHero" | "drawCards" | "buffMinion";
    amount: number;
  };
  targets: "enemyMinion" | "anyMinion" | "enemyHero" | "none";
}

export type CardDef = MinionCard | SpellCard;

export interface MinionInstance {
  instanceId: string;
  cardId: string;
  name: string;
  variant: GoblinVariant;
  attack: number;
  health: number;
  maxHealth: number;
  taunt: boolean;
  canAttack: boolean;
  hasAttackedThisTurn: boolean;
  justSummoned: boolean;
  rarity: Rarity;
}

export type PlayerId = "player" | "bot";

export interface PlayerState {
  id: PlayerId;
  heroHealth: number;
  maxHeroHealth: number;
  deck: CardDef[];
  hand: CardDef[];
  board: MinionInstance[];
  mana: number;
  maxMana: number;
  heroPowerUsed: boolean;
  fatigue: number;
}

export interface LogEntry {
  id: string;
  text: string;
}

export type GamePhase = "playerTurn" | "botTurn" | "gameOver";

export interface GameState {
  player: PlayerState;
  bot: PlayerState;
  phase: GamePhase;
  turnNumber: number;
  winner: PlayerId | null;
  log: LogEntry[];
  selectedAttackerId: string | null;
}

export interface RankInfo {
  level: number;
  xp: number;
  xpForNextLevel: number;
  wins: number;
  losses: number;
}
