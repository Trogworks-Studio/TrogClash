import { RankInfo } from "@/lib/types";

/**
 * One shared ranked ladder (no separate modes). Deliberately punishing:
 * a win earns less than a loss costs, so climbing takes consistency.
 */
export const XP_PER_WIN = 18;
export const XP_PER_LOSS = 27;
export const XP_PER_LEVEL = 100;
export const MAX_LEVEL_NAME_TIER = 10;

export interface LevelTitle {
  level: number;
  title: string;
}

// Goblin-flavored rank titles, roughly every couple of levels.
const TITLES: LevelTitle[] = [
  { level: 1, title: "Çamur Acemisi" },
  { level: 3, title: "Bataklık Çırağı" },
  { level: 5, title: "Trog Savaşçısı" },
  { level: 8, title: "Sinsi Kabile Üyesi" },
  { level: 12, title: "Bataklık Muhafızı" },
  { level: 16, title: "Trog Şampiyonu" },
  { level: 20, title: "Kabile Reisi" },
  { level: 25, title: "Bataklığın Efendisi" },
];

export function titleForLevel(level: number): string {
  let current = TITLES[0].title;
  for (const t of TITLES) {
    if (level >= t.level) current = t.title;
  }
  return current;
}

export interface RankRecord {
  level: number;
  xp: number;
  wins: number;
  losses: number;
}

/** Applies a match result to a rank record, floors XP at 0 and level at 1. */
export function applyMatchResult(record: RankRecord, didWin: boolean): RankRecord {
  let { level, xp, wins, losses } = record;
  if (didWin) {
    xp += XP_PER_WIN;
    wins += 1;
  } else {
    xp -= XP_PER_LOSS;
    losses += 1;
  }

  while (xp >= XP_PER_LEVEL) {
    xp -= XP_PER_LEVEL;
    level += 1;
  }
  while (xp < 0 && level > 1) {
    level -= 1;
    xp += XP_PER_LEVEL;
  }
  if (level <= 1 && xp < 0) xp = 0;

  return { level, xp, wins, losses };
}

export function toRankInfo(record: RankRecord): RankInfo {
  return {
    level: record.level,
    xp: record.xp,
    xpForNextLevel: XP_PER_LEVEL,
    wins: record.wins,
    losses: record.losses,
  };
}
