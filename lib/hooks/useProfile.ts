"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { applyMatchResult, RankRecord } from "@/lib/game/rank";

const GUEST_KEY = "trogworks-guest-profile";

interface GuestProfile extends RankRecord {
  username: string;
}

function loadGuestProfile(): GuestProfile {
  if (typeof window === "undefined") {
    return { username: "Trog Acemisi", level: 1, xp: 0, wins: 0, losses: 0 };
  }
  const raw = window.localStorage.getItem(GUEST_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as GuestProfile;
    } catch {
      // fall through to default
    }
  }
  const fresh: GuestProfile = {
    username: `Trog${Math.floor(1000 + Math.random() * 9000)}`,
    level: 1,
    xp: 0,
    wins: 0,
    losses: 0,
  };
  window.localStorage.setItem(GUEST_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveGuestProfile(p: GuestProfile) {
  window.localStorage.setItem(GUEST_KEY, JSON.stringify(p));
}

export interface UseProfileResult {
  username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  loading: boolean;
  isGuest: boolean;
  setUsername: (name: string) => void;
  recordMatchResult: (didWin: boolean) => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const configured = isSupabaseConfigured();
  const [profile, setProfile] = useState<GuestProfile>({
    username: "Trog Acemisi",
    level: 1,
    xp: 0,
    wins: 0,
    losses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!configured) {
        const guest = loadGuestProfile();
        if (!cancelled) {
          setProfile(guest);
          setLoading(false);
        }
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData.session?.user.id;

      if (!userId) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error || !data.user) {
          // anonymous auth may be disabled on this project — fall back to guest/local mode
          const guest = loadGuestProfile();
          if (!cancelled) {
            setProfile(guest);
            setLoading(false);
          }
          return;
        }
        userId = data.user.id;
      }

      const { data: existing } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

      if (existing) {
        if (!cancelled) {
          setProfile({
            username: existing.username,
            level: existing.level,
            xp: existing.xp,
            wins: existing.wins,
            losses: existing.losses,
          });
        }
      } else {
        const username = `Trog${Math.floor(1000 + Math.random() * 9000)}`;
        const { data: created } = await supabase
          .from("profiles")
          .insert({ id: userId, username })
          .select()
          .maybeSingle();
        if (!cancelled && created) {
          setProfile({
            username: created.username,
            level: created.level,
            xp: created.xp,
            wins: created.wins,
            losses: created.losses,
          });
        }
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  const setUsername = useCallback(
    (name: string) => {
      setProfile((prev) => {
        const next = { ...prev, username: name };
        if (!configured) saveGuestProfile(next);
        return next;
      });
      if (configured) {
        const supabase = getSupabaseClient();
        supabase?.auth.getSession().then(({ data }) => {
          const userId = data.session?.user.id;
          if (userId) supabase.from("profiles").update({ username: name }).eq("id", userId);
        });
      }
    },
    [configured]
  );

  const recordMatchResult = useCallback(
    async (didWin: boolean) => {
      setProfile((prev) => {
        const updated = applyMatchResult(prev, didWin);
        const next = { ...prev, ...updated };
        if (!configured) saveGuestProfile(next);
        else {
          const supabase = getSupabaseClient();
          supabase?.auth.getSession().then(({ data }) => {
            const userId = data.session?.user.id;
            if (userId) {
              supabase
                .from("profiles")
                .update({ level: next.level, xp: next.xp, wins: next.wins, losses: next.losses })
                .eq("id", userId);
            }
          });
        }
        return next;
      });
    },
    [configured]
  );

  return { ...profile, loading, isGuest: !configured, setUsername, recordMatchResult };
}
