import { CardDef } from "@/lib/types";

/**
 * Starter set for Trog Clash. One shared "wild swamp" collection for now —
 * deckbuilding across multiple sets can come later. Kept small and readable
 * on purpose: every card should be legible on a phone-sized card frame.
 */
export const CARD_SET: CardDef[] = [
  // ---- 1 mana ----
  {
    id: "trog-cirak",
    type: "minion",
    name: "Trog Çırağı",
    cost: 1,
    attack: 1,
    health: 2,
    rarity: "common",
    variant: "grunt",
    flavor: "Daha dün yumurtadan çıktı, bugün zaten kavgacı.",
  },
  {
    id: "bataklik-faresi",
    type: "minion",
    name: "Bataklık Faresi",
    cost: 1,
    attack: 2,
    health: 1,
    rarity: "common",
    variant: "sneak",
    flavor: "Küçük ama kindar.",
  },
  {
    id: "camur-firlat",
    type: "spell",
    name: "Çamur Fırlat",
    cost: 1,
    rarity: "common",
    flavor: "Trog'un en sevdiği münazara yöntemi.",
    effect: { kind: "damageTarget", amount: 2 },
    targets: "enemyMinion",
  },

  // ---- 2 mana ----
  {
    id: "gobo-tamirci",
    type: "minion",
    name: "Tamirci Gobo",
    cost: 2,
    attack: 2,
    health: 3,
    rarity: "common",
    variant: "tinkerer",
    flavor: "\"Çalışıyor mu bilmiyorum ama patlamıyor en azından.\"",
  },
  {
    id: "kalkan-tasiyici",
    type: "minion",
    name: "Kalkan Taşıyıcı",
    cost: 2,
    attack: 1,
    health: 4,
    taunt: true,
    rarity: "common",
    variant: "brute",
    flavor: "Önce o girer, sonra pişman olur.",
  },
  {
    id: "hizli-toplama",
    type: "spell",
    name: "Hızlı Toplama",
    cost: 2,
    rarity: "common",
    flavor: "Çöp yığınından iyi kart çıkar mı, kimse bilmiyor.",
    effect: { kind: "drawCards", amount: 2 },
    targets: "none",
  },
  {
    id: "mantar-dostu",
    type: "minion",
    name: "Mantar Dostu",
    cost: 2,
    attack: 2,
    health: 2,
    rarity: "common",
    variant: "mushroom",
    flavor: "Konuşmaz ama dinler.",
    onPlay: { kind: "heal", amount: 2 },
  },

  // ---- 3 mana ----
  {
    id: "batakli-samani",
    type: "minion",
    name: "Bataklık Şamanı",
    cost: 3,
    attack: 2,
    health: 3,
    rarity: "rare",
    variant: "shaman",
    flavor: "Kurbağa diliyle dua eder, kimse anlamaz ama işe yarar.",
    onPlay: { kind: "damage", amount: 1 },
  },
  {
    id: "sinsi-kertenkele",
    type: "minion",
    name: "Sinsi Kertenkeleci",
    cost: 3,
    attack: 4,
    health: 2,
    rarity: "common",
    variant: "sneak",
    flavor: "Kertenkelesi ondan daha az sinsi.",
  },
  {
    id: "trog-cigligi",
    type: "spell",
    name: "Trog Çığlığı",
    cost: 3,
    rarity: "rare",
    flavor: "Bütün bataklık duyar, komşu köy şikayet eder.",
    effect: { kind: "buffMinion", amount: 2 },
    targets: "anyMinion",
  },
  {
    id: "yarasa-suru",
    type: "minion",
    name: "Mağara Yarasası",
    cost: 3,
    attack: 3,
    health: 3,
    charge: true,
    rarity: "rare",
    variant: "bat",
    flavor: "Gelir gelmez ısırır, sonra özür diler (dilemez).",
  },

  // ---- 4 mana ----
  {
    id: "sisko-trog",
    type: "minion",
    name: "Şişko Trog",
    cost: 4,
    attack: 3,
    health: 6,
    taunt: true,
    rarity: "common",
    variant: "brute",
    flavor: "Yolu kapatır, iştahı asla kapanmaz.",
  },
  {
    id: "iksir-yudumu",
    type: "spell",
    name: "İksir Yudumu",
    cost: 4,
    rarity: "common",
    flavor: "Tadı berbat, etkisi harika.",
    effect: { kind: "healHero", amount: 8 },
    targets: "none",
  },
  {
    id: "bataklik-canavari",
    type: "minion",
    name: "Bataklık Canavarı",
    cost: 4,
    attack: 5,
    health: 4,
    rarity: "epic",
    variant: "swamp-beast",
    flavor: "Bataklığın dibinde ne olduğunu artık biliyorsun.",
  },

  // ---- 5 mana ----
  {
    id: "gobo-reisi",
    type: "minion",
    name: "Trog Reisi",
    cost: 5,
    attack: 4,
    health: 5,
    rarity: "epic",
    variant: "chief",
    flavor: "Tacı çamurdan ama otoritesi gerçek.",
    onPlay: { kind: "buffBoardAttack", amount: 1 },
  },
  {
    id: "cift-kafali-trog",
    type: "minion",
    name: "Çift Kafalı Trog",
    cost: 5,
    attack: 5,
    health: 5,
    taunt: true,
    rarity: "rare",
    variant: "brute",
    flavor: "İki kafa bir Trog'dan iyidir, tartışsalar da.",
  },

  // ---- 6 mana ----
  {
    id: "kufur-yagmuru",
    type: "spell",
    name: "Küfür Yağmuru",
    cost: 6,
    rarity: "epic",
    flavor: "Bataklık dilinde her kelime hakarettir zaten.",
    effect: { kind: "damageAll", amount: 3 },
    targets: "enemyMinion",
  },
  {
    id: "mantar-dev",
    type: "minion",
    name: "Dev Mantar Ruhu",
    cost: 6,
    attack: 5,
    health: 7,
    rarity: "epic",
    variant: "mushroom",
    flavor: "Ormanın hafızası, bataklığın kokusu.",
  },

  // ---- 7 mana ----
  {
    id: "kraliyet-trogu",
    type: "minion",
    name: "Kraliyet Trogu",
    cost: 7,
    attack: 6,
    health: 6,
    taunt: true,
    rarity: "legendary",
    variant: "royal",
    flavor: "Sarayı yok ama duruşu var.",
    onPlay: { kind: "heal", amount: 4 },
  },

  // ---- 8 mana ----
  {
    id: "bataklik-tanrisi",
    type: "minion",
    name: "Bataklığın Efendisi",
    cost: 8,
    attack: 8,
    health: 8,
    rarity: "legendary",
    variant: "swamp-beast",
    flavor: "Efsaneye göre bataklığın kendisi ona secde eder.",
  },
];

export function buildStarterDeck(): CardDef[] {
  // A curated 20-card deck woven from the shared set (some doubles),
  // biased toward a low-to-mid curve so early games are actually playable.
  const idsWithCounts: [string, number][] = [
    ["trog-cirak", 1],
    ["bataklik-faresi", 1],
    ["camur-firlat", 1],
    ["gobo-tamirci", 1],
    ["kalkan-tasiyici", 2],
    ["hizli-toplama", 1],
    ["mantar-dostu", 1],
    ["batakli-samani", 2],
    ["sinsi-kertenkele", 1],
    ["trog-cigligi", 1],
    ["yarasa-suru", 1],
    ["sisko-trog", 1],
    ["iksir-yudumu", 1],
    ["bataklik-canavari", 1],
    ["gobo-reisi", 1],
    ["cift-kafali-trog", 1],
    ["kufur-yagmuru", 1],
    ["kraliyet-trogu", 1],
  ];

  const byId = new Map(CARD_SET.map((c) => [c.id, c]));
  const deck: CardDef[] = [];
  for (const [id, count] of idsWithCounts) {
    const card = byId.get(id);
    if (!card) continue;
    for (let i = 0; i < count; i++) deck.push(card);
  }
  return deck;
}
