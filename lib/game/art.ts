import { GoblinVariant } from "@/lib/types";

/**
 * Real illustrated art, keyed first by exact card id (most specific),
 * then falling back to variant. Anything not listed here keeps rendering
 * through the procedural SVG in GoblinIllustration.tsx — we only have
 * commissioned art for a few characters so far.
 */
export const CARD_ART_BY_ID: Record<string, string> = {
  "gobo-tamirci": "/art/tinkerer-wrench.png",
  "gobo-reisi": "/art/logo-badge.png",
};

export const CARD_ART_BY_VARIANT: Partial<Record<GoblinVariant, string>> = {
  tinkerer: "/art/tinkerer-workbench.png",
  sneak: "/art/rogue-assassin.png",
};

export function artForCard(cardId: string, variant: GoblinVariant): string | undefined {
  return CARD_ART_BY_ID[cardId] ?? CARD_ART_BY_VARIANT[variant];
}

/** Portraits used outside the card frame (hero avatars, menu mascot, etc). */
export const PORTRAITS = {
  playerHero: "/art/tinkerer-thumbsup.png",
  botHero: "/art/rogue-assassin.png",
  menuMascot: "/art/logo-badge.png",
  victory: "/art/tinkerer-mug-sitting.png",
  defeat: "/art/tinkerer-shocked.png",
  loading: "/art/tinkerer-tired.png",
  scouting: "/art/tinkerer-map.png",
  wave: "/art/tinkerer-wave.png",
  laptop: "/art/tinkerer-laptop-cat.png",
} as const;
