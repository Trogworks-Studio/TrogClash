import { GoblinVariant, Rarity } from "@/lib/types";
import { artForCard } from "@/lib/game/art";

interface Props {
  variant: GoblinVariant;
  rarity: Rarity;
  className?: string;
  /** Specific card id, e.g. "gobo-tamirci" — used to look up commissioned art before falling back to variant/procedural. */
  cardId?: string;
}

const SKIN: Record<GoblinVariant, { base: string; shade: string }> = {
  grunt: { base: "#7FA65B", shade: "#5C8043" },
  shaman: { base: "#8FB06A", shade: "#66894A" },
  sneak: { base: "#6B9B6E", shade: "#4A7A4E" },
  brute: { base: "#9AAE5C", shade: "#748A3D" },
  tinkerer: { base: "#84AE7A", shade: "#5E8555" },
  chief: { base: "#A6924E", shade: "#7C6B34" },
  "swamp-beast": { base: "#5C8C6E", shade: "#3E664E" },
  bat: { base: "#7C6E93", shade: "#584C6E" },
  mushroom: { base: "#C79A6B", shade: "#9C744C" },
  royal: { base: "#B98F3E", shade: "#8C6A28" },
};

const RARITY_GLOW: Record<Rarity, string> = {
  common: "none",
  rare: "0 0 10px rgba(93,150,255,0.55)",
  epic: "0 0 12px rgba(160,90,220,0.6)",
  legendary: "0 0 16px rgba(255,190,60,0.7)",
};

export default function GoblinIllustration({ variant, rarity, className, cardId }: Props) {
  const art = cardId ? artForCard(cardId, variant) : undefined;

  if (art) {
    return (
      <div
        className={className}
        style={{
          filter: RARITY_GLOW[rarity] !== "none" ? `drop-shadow(${RARITY_GLOW[rarity]})` : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local static art, plain <img> avoids next/image sizing ceremony for many small circular crops */}
        <img src={art} alt="" className="h-full w-full object-cover object-top" draggable={false} />
      </div>
    );
  }

  const skin = SKIN[variant];

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ filter: RARITY_GLOW[rarity] !== "none" ? `drop-shadow(${RARITY_GLOW[rarity]})` : undefined }}
    >
      {/* backdrop blob */}
      <ellipse cx="100" cy="112" rx="86" ry="78" fill="#142A23" opacity="0.35" />

      {/* ears */}
      <path d="M40 95 Q10 70 28 40 Q52 55 58 90 Z" fill={skin.base} stroke="#1B2E23" strokeWidth="5" strokeLinejoin="round" />
      <path d="M160 95 Q190 70 172 40 Q148 55 142 90 Z" fill={skin.base} stroke="#1B2E23" strokeWidth="5" strokeLinejoin="round" />

      {/* head */}
      <ellipse cx="100" cy="108" rx="62" ry="56" fill={skin.base} stroke="#1B2E23" strokeWidth="6" />
      {/* cheek shading */}
      <ellipse cx="100" cy="128" rx="46" ry="30" fill={skin.shade} opacity="0.35" />

      {/* eyes */}
      <g>
        <ellipse cx="78" cy="102" rx="15" ry="17" fill="#F3E7C9" stroke="#1B2E23" strokeWidth="4" />
        <ellipse cx="122" cy="102" rx="15" ry="17" fill="#F3E7C9" stroke="#1B2E23" strokeWidth="4" />
        <circle cx="81" cy="105" r="6.5" fill="#1B2E23" />
        <circle cx="125" cy="105" r="6.5" fill="#1B2E23" />
        <circle cx="83.5" cy="102.5" r="2" fill="#fff" />
        <circle cx="127.5" cy="102.5" r="2" fill="#fff" />
      </g>

      {/* nose */}
      <ellipse cx="100" cy="122" rx="8" ry="6" fill={skin.shade} />

      {/* mouth + tusks */}
      <path d="M76 142 Q100 158 124 142" fill="none" stroke="#1B2E23" strokeWidth="5" strokeLinecap="round" />
      <path d="M84 143 L80 156 L90 146 Z" fill="#F3E7C9" stroke="#1B2E23" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M116 143 L120 156 L110 146 Z" fill="#F3E7C9" stroke="#1B2E23" strokeWidth="2.5" strokeLinejoin="round" />

      {/* variant accessory */}
      <VariantAccessory variant={variant} />
    </svg>
  );
}

function VariantAccessory({ variant }: { variant: GoblinVariant }) {
  switch (variant) {
    case "chief":
    case "royal":
      return (
        <g>
          <path d="M56 58 L72 30 L88 54 L100 24 L112 54 L128 30 L144 58 Z" fill="#D3A62B" stroke="#1B2E23" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="100" cy="34" r="6" fill="#7A4A9B" stroke="#1B2E23" strokeWidth="2" />
        </g>
      );
    case "shaman":
      return (
        <g>
          <path d="M50 52 Q70 20 100 46 Q130 20 150 52" fill="none" stroke="#5B3573" strokeWidth="8" strokeLinecap="round" />
          <circle cx="70" cy="34" r="7" fill="#D3A62B" stroke="#1B2E23" strokeWidth="2.5" />
          <circle cx="130" cy="34" r="7" fill="#D3A62B" stroke="#1B2E23" strokeWidth="2.5" />
        </g>
      );
    case "sneak":
      return (
        <path d="M42 60 Q100 20 158 60 Q140 78 100 68 Q60 78 42 60 Z" fill="#2C4F44" stroke="#1B2E23" strokeWidth="5" strokeLinejoin="round" />
      );
    case "brute":
      return (
        <g>
          <path d="M70 148 L58 172" stroke="#F3E7C9" strokeWidth="8" strokeLinecap="round" />
          <path d="M130 148 L142 172" stroke="#F3E7C9" strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case "tinkerer":
      return (
        <g>
          <circle cx="146" cy="88" r="18" fill="none" stroke="#D3A62B" strokeWidth="6" />
          <circle cx="146" cy="88" r="6" fill="#D3A62B" />
          <path d="M132 46 L150 34 L152 52 Z" fill="#B4702E" stroke="#1B2E23" strokeWidth="3" />
        </g>
      );
    case "bat":
      return (
        <g>
          <path d="M20 90 Q45 60 70 90 Q45 100 20 90 Z" fill="#5B3573" stroke="#1B2E23" strokeWidth="4" />
          <path d="M180 90 Q155 60 130 90 Q155 100 180 90 Z" fill="#5B3573" stroke="#1B2E23" strokeWidth="4" />
        </g>
      );
    case "mushroom":
      return (
        <g>
          <path d="M62 42 Q100 6 138 42 Q100 56 62 42 Z" fill="#C85A22" stroke="#1B2E23" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="82" cy="34" r="4" fill="#F3E7C9" />
          <circle cx="104" cy="26" r="5" fill="#F3E7C9" />
          <circle cx="122" cy="36" r="3.5" fill="#F3E7C9" />
        </g>
      );
    case "swamp-beast":
      return (
        <g>
          <path d="M62 60 Q100 40 138 60" fill="none" stroke="#3E664E" strokeWidth="10" strokeLinecap="round" />
          <circle cx="70" cy="55" r="4" fill="#7FAA76" />
          <circle cx="130" cy="55" r="4" fill="#7FAA76" />
        </g>
      );
    default:
      return null;
  }
}
