"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { titleForLevel } from "@/lib/game/rank";
import { useProfile } from "@/lib/hooks/useProfile";
import { Icon } from "@/components/icons";
import { PORTRAITS } from "@/lib/game/art";
import SoundToggle from "@/components/SoundToggle";

interface Row {
  username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
}

export default function LeaderboardPage() {
  const configured = isSupabaseConfigured();
  const profile = useProfile();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase
      .from("leaderboard")
      .select("*")
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRows((data as unknown as Row[]) ?? []);
      });
  }, [configured]);

  return (
    <main className="mx-auto flex h-[100dvh] max-w-lg flex-col gap-3 overflow-hidden px-4 py-4 sm:gap-4 sm:py-6">
      <div className="flex flex-shrink-0 items-center justify-between">
        <Link href="/" className="font-display text-xs font-bold text-goblin-gold hover:underline">
          ← Menü
        </Link>
        <h1 className="flex items-center justify-center gap-2 font-display text-lg font-extrabold text-parchment-100 sm:text-xl">
          <Icon.Trophy className="h-5 w-5 text-goblin-gold" />
          Skor Tablosu
        </h1>
        <SoundToggle />
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pr-0.5">
        {!configured && (
        <div className="rounded-2xl border-2 border-swamp-700 bg-swamp-900/80 p-4 text-sm text-parchment-200">
          <p className="mb-2">
            Genel skor tablosu için Supabase henüz bağlanmamış. <code className="text-goblin-gold">.env.local</code>{" "}
            dosyasına proje anahtarlarını ekleyip <code className="text-goblin-gold">supabase/schema.sql</code>{" "}
            dosyasını çalıştırınca burada tüm oyuncular görünecek.
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-swamp-950/70 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
            <img src={PORTRAITS.laptop} alt="" className="h-14 w-14 flex-shrink-0 object-contain" draggable={false} />
            <div>
              <p className="font-display text-sm font-bold text-parchment-100">Senin ilerlemen (bu tarayıcıda)</p>
              <p className="mt-1 text-xs text-parchment-300">
                {profile.username} — Sv.{profile.level} ({titleForLevel(profile.level)}) · {profile.wins}G/
                {profile.losses}K
              </p>
            </div>
          </div>
        </div>
      )}

      {configured && error && (
        <div className="rounded-2xl border-2 border-blood-600 bg-swamp-900/80 p-4 text-sm text-parchment-200">
          Skor tablosu yüklenemedi: {error}
        </div>
      )}

      {configured && !error && (
        <div className="overflow-hidden rounded-2xl border-2 border-swamp-700 bg-swamp-900/80 shadow-panel">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-swamp-800 text-parchment-200">
                <th className="px-3 py-2 font-display text-xs uppercase">#</th>
                <th className="px-3 py-2 font-display text-xs uppercase">Oyuncu</th>
                <th className="px-3 py-2 font-display text-xs uppercase">Sv.</th>
                <th className="px-3 py-2 font-display text-xs uppercase">G/K</th>
              </tr>
            </thead>
            <tbody>
              {rows === null && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-parchment-300/70">
                    Yükleniyor…
                  </td>
                </tr>
              )}
              {rows?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-5 text-center text-parchment-300/70">
                    <div className="flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
                      <img src={PORTRAITS.scouting} alt="" className="h-16 w-16 object-contain" draggable={false} />
                      <span>Henüz kimse maç oynamamış — ilk sen ol!</span>
                    </div>
                  </td>
                </tr>
              )}
              {rows?.map((r, i) => (
                <tr key={r.username} className={i % 2 === 0 ? "bg-swamp-900/40" : ""}>
                  <td className="px-3 py-2 text-goblin-gold">{i + 1}</td>
                  <td className="px-3 py-2 text-parchment-100">{r.username}</td>
                  <td className="px-3 py-2 text-parchment-100">{r.level}</td>
                  <td className="px-3 py-2 text-parchment-300">
                    {r.wins}/{r.losses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </main>
  );
}
