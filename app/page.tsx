"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/lib/hooks/useProfile";
import { titleForLevel, XP_PER_LEVEL } from "@/lib/game/rank";
import { PORTRAITS } from "@/lib/game/art";
import { Icon } from "@/components/icons";

export default function MenuPage() {
  const profile = useProfile();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const xpPct = Math.max(0, Math.min(100, (profile.xp / XP_PER_LEVEL) * 100));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-40 w-40 animate-float-slow overflow-hidden rounded-full border-[6px] border-goblin-gold bg-swamp-800 shadow-glow-legendary">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
          <img src={PORTRAITS.menuMascot} alt="Trog Clash" className="h-full w-full object-cover" draggable={false} />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-white/10" />
        </div>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-parchment-100 toon-outline">
          Trog <span className="text-ember-600">Clash</span>
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.35em] text-goblin-gold">Trogworks Studyo</p>
      </div>

      <div className="w-full max-w-sm rounded-[24px] border-[3px] border-swamp-700 bg-gradient-to-b from-swamp-900 to-swamp-950 p-5 shadow-card-lg">
        <div className="flex items-center justify-between">
          {editingName ? (
            <div className="flex flex-1 gap-2">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nameDraft.trim()) {
                    profile.setUsername(nameDraft.trim().slice(0, 18));
                    setEditingName(false);
                  }
                }}
                className="w-full rounded-lg border-2 border-goblin-gold bg-swamp-950 px-2 py-1 font-display text-sm text-parchment-100 outline-none"
                maxLength={18}
                placeholder="Trog ismin"
              />
              <button
                type="button"
                className="rounded-lg bg-moss-500 px-2 text-xs font-bold text-swamp-950"
                onClick={() => {
                  if (nameDraft.trim()) profile.setUsername(nameDraft.trim().slice(0, 18));
                  setEditingName(false);
                }}
              >
                Kaydet
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="font-display text-lg font-bold text-parchment-100 hover:text-goblin-gold"
              onClick={() => {
                setNameDraft(profile.username);
                setEditingName(true);
              }}
              title="İsmini değiştir"
            >
              <span className="inline-flex items-center gap-1.5">
                {profile.loading ? "Yükleniyor…" : profile.username}
                <Icon.Pencil className="h-3.5 w-3.5 text-goblin-gold" />
              </span>
            </button>
          )}
          <span className="rounded-full border border-goblin-gold/50 bg-gradient-to-b from-goblin-gold to-[#a9822a] px-3 py-1 font-display text-xs font-bold text-swamp-950 shadow-gem">
            Seviye {profile.level}
          </span>
        </div>

        <p className="mt-1 text-[11px] italic text-parchment-300">{titleForLevel(profile.level)}</p>

        <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full border border-swamp-950 bg-swamp-950 shadow-inner">
          <div className="h-full rounded-full bg-gradient-to-r from-moss-500 to-moss-400 transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-parchment-300/80">
          <span>{profile.xp} / {XP_PER_LEVEL} XP</span>
          <span>
            {profile.wins}G / {profile.losses}K
          </span>
        </div>

        {profile.isGuest && (
          <p className="mt-3 rounded-lg bg-swamp-800 px-2 py-1.5 text-[10px] text-parchment-300/80">
            Misafir modundasın — ilerlemen bu tarayıcıda saklanıyor. Genel skor tablosu için Supabase
            bağlanınca hesaplar buluta taşınır.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/play"
          className="flex items-center justify-center gap-2 rounded-full border-[3px] border-swamp-950 bg-gradient-to-b from-ember-500 to-ember-600 px-10 py-4 text-center font-display text-lg font-extrabold text-white shadow-card-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Icon.Swords className="h-5 w-5" />
          Bot ile Kapış
        </Link>
        <Link
          href="/leaderboard"
          className="flex items-center justify-center gap-2 rounded-full border-[3px] border-swamp-950 bg-gradient-to-b from-swamp-700 to-swamp-800 px-10 py-3 text-center font-display text-sm font-bold text-parchment-100 shadow-card-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Icon.Trophy className="h-4 w-4 text-goblin-gold" />
          Skor Tablosu
        </Link>
      </div>

      <p className="max-w-md text-center text-[10px] leading-relaxed text-parchment-300/60">
        Online oyuncu maçları yapım aşamasında — şimdilik rekabetçi merdiven bot'a karşı işliyor.
        Kazanınca az, kaybedince daha çok XP: merdiven zor olsun diye böyle kurduk.
      </p>
    </main>
  );
}
