"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { titleForLevel } from "@/lib/game/rank";
import { useProfile } from "@/lib/hooks/useProfile";

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
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-xs font-bold text-goblin-gold hover:underline">
          ← Menü
        </Link>
        <h1 className="font-display text-xl font-extrabold text-parchment-100">🏆 Skor Tablosu</h1>
        <span className="w-10" />
      </div>

      {!configured && (
        <div className="rounded-2xl border-2 border-swamp-700 bg-swamp-900/80 p-4 text-sm text-parchment-200">
          <p className="mb-2">
            Genel skor tablosu için Supabase henüz bağlanmamış. <code className="text-goblin-gold">.env.local</code>{" "}
            dosyasına proje anahtarlarını ekleyip <code className="text-goblin-gold">supabase/schema.sql</code>{" "}
            dosyasını çalıştırınca burada tüm oyuncular görünecek.
          </p>
          <div className="mt-3 rounded-xl bg-swamp-950/70 p-3">
            <p className="font-display text-sm font-bold text-parchment-100">Senin ilerlemen (bu tarayıcıda)</p>
            <p className="mt-1 text-xs text-parchment-300">
              {profile.username} — Sv.{profile.level} ({titleForLevel(profile.level)}) · {profile.wins}G/
              {profile.losses}K
            </p>
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
                  <td colSpan={4} className="px-3 py-4 text-center text-parchment-300/70">
                    Henüz kimse maç oynamamış — ilk sen ol!
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
    </main>
  );
}
