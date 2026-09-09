"use client";

import type { ReactNode } from "react";

/**
 * Hand-built icon set in a FontAwesome-solid visual language (single-color,
 * rounded, filled glyphs on a 0-0-512-512 or 0-0-24-24 grid).
 *
 * Why not @fortawesome/react-fontawesome? This sandbox has no network
 * access for `npm install`, so pulling the real package isn't possible
 * here. Every icon below is drawn from scratch — not copied path data —
 * to stay safely original while matching FA's weight and proportions.
 *
 * Swapping to real FontAwesome later is a one-file job: replace the body
 * of each component below with `<FontAwesomeIcon icon={faTrophy} .../>`
 * etc. Call sites (`<Icon.Trophy className="h-5 w-5" />`) won't need to
 * change.
 */

interface IconProps {
  className?: string;
}

function Base({ className, viewBox = "0 0 24 24", children }: IconProps & { viewBox?: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className} fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 3h12v2h2.5a1.5 1.5 0 0 1 1.5 1.5c0 2.6-1.7 4.7-4.1 5.4A6 6 0 0 1 13 16.9V19h2.5a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3H11v-2.1a6 6 0 0 1-4.9-4.9C3.7 11.2 2 9.1 2 6.5A1.5 1.5 0 0 1 3.5 5H6V3Zm0 4H4a3.3 3.3 0 0 0 2 3V7Zm12 0v3a3.3 3.3 0 0 0 2-3h-2Z" />
    </Base>
  );
}

export function SwordsIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M3 3l6.5 6.5-1.4 1.4L4.4 8.2 3 9.6l1.4 1.4-2.1 2.1a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l2.1-2.1L8.6 15 3 20.6l1.4 1.4L10 16.4l1.6 1.6-1 1 1.4 1.4 1-1 1 1 1.4-1.4-1-1 1.6-1.6L21.6 21 23 19.6 8.6 5.2l1.4-1.4L8.6 2.4 6.5 4.5 3 1v2Zm14.6 0L21 6.4l-1.4 1.4L18.2 6.4l-1.4 1.4L18.2 9.2l-1.4 1.4-6.5-6.5L12.7 2l1.4 1.4L15.5 2l1.4 1.4L18.3 2l-.7 1Z" />
    </Base>
  );
}

export function SkullIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 2C7 2 3 5.8 3 10.4c0 2.6 1.3 4.9 3.3 6.4V19a1 1 0 0 0 1 1h1.2v1.5a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 0 .5-.5V20h2v1.5a.5.5 0 0 0 .5.5H15a.5.5 0 0 0 .5-.5V20h1.2a1 1 0 0 0 1-1v-2.2c2-1.5 3.3-3.8 3.3-6.4C21 5.8 17 2 12 2ZM8.5 12A1.5 1.5 0 1 1 10 10.5 1.5 1.5 0 0 1 8.5 12Zm7 0A1.5 1.5 0 1 1 17 10.5 1.5 1.5 0 0 1 15.5 12Zm-4 1.5 1 2h-2Z" />
    </Base>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25ZM20.7 7.04a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82Z" />
    </Base>
  );
}

export function FistIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M8 5.5a1.5 1.5 0 0 1 3 0V10h.5V4.5a1.5 1.5 0 0 1 3 0V10h.5V5.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-1a5.5 5.5 0 0 1-4.4-2.2l-2.8-3.7a1.3 1.3 0 0 1 2-1.7L8 14V5.5Z" />
    </Base>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm9 2.1-1.9-.3a7.4 7.4 0 0 0-.6-1.5l1.1-1.6a.6.6 0 0 0-.1-.8l-1.4-1.4a.6.6 0 0 0-.8-.1l-1.6 1.1a7.4 7.4 0 0 0-1.5-.6l-.3-1.9a.6.6 0 0 0-.6-.5h-2a.6.6 0 0 0-.6.5l-.3 1.9a7.4 7.4 0 0 0-1.5.6L7.3 4.9a.6.6 0 0 0-.8.1L5.1 6.4a.6.6 0 0 0-.1.8l1.1 1.6a7.4 7.4 0 0 0-.6 1.5l-1.9.3a.6.6 0 0 0-.5.6v2a.6.6 0 0 0 .5.6l1.9.3a7.4 7.4 0 0 0 .6 1.5l-1.1 1.6a.6.6 0 0 0 .1.8l1.4 1.4a.6.6 0 0 0 .8.1l1.6-1.1a7.4 7.4 0 0 0 1.5.6l.3 1.9a.6.6 0 0 0 .6.5h2a.6.6 0 0 0 .6-.5l.3-1.9a7.4 7.4 0 0 0 1.5-.6l1.6 1.1a.6.6 0 0 0 .8-.1l1.4-1.4a.6.6 0 0 0 .1-.8l-1.1-1.6a7.4 7.4 0 0 0 .6-1.5l1.9-.3a.6.6 0 0 0 .5-.6v-2a.6.6 0 0 0-.5-.6Z" />
    </Base>
  );
}

export function CoinIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="9" />
      <text x="12" y="16.5" fontSize="11" textAnchor="middle" fill="var(--icon-coin-mark, #7C6B34)" fontFamily="var(--font-display, sans-serif)" fontWeight="800">
        G
      </text>
    </Base>
  );
}

export function ChestIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1H4V8Zm-1 3h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7Zm7 2v2h4v-2h-4Z" />
    </Base>
  );
}

export function ScrollIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 3a2 2 0 0 0-2 2 2 2 0 0 0 2 2h1v10H6a2 2 0 0 0 0 4h12a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-1V7h1a2 2 0 0 0 0-4H6Zm3 4h6v10H9V7Z" />
    </Base>
  );
}

export function SpeakerIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 9v6h4l5 5V4L8 9H4Zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4Zm-2.5-8.9v2.06c3 .84 5 3.53 5 6.84s-2 6-5 6.84v2.06c4-.87 7-4.44 7-8.9s-3-8.03-7-8.9Z" />
    </Base>
  );
}

export function SpeakerMuteIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 9v6h4l5 5V4L8 9H4Zm14.3-1.7-1.4 1.4 2.3 2.3-2.3 2.3 1.4 1.4 2.3-2.3 2.3 2.3 1.4-1.4-2.3-2.3 2.3-2.3-1.4-1.4-2.3 2.3-2.3-2.3Z" />
    </Base>
  );
}

export const Icon = {
  Trophy: TrophyIcon,
  Swords: SwordsIcon,
  Skull: SkullIcon,
  Pencil: PencilIcon,
  Fist: FistIcon,
  Gear: GearIcon,
  Coin: CoinIcon,
  Chest: ChestIcon,
  Scroll: ScrollIcon,
  Speaker: SpeakerIcon,
  SpeakerMute: SpeakerMuteIcon,
};
