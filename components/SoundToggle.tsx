"use client";

import { useEffect, useState } from "react";
import { isMuted, loadMutePreference, playSfx, setMuted } from "@/lib/audio/sfx";
import { Icon } from "@/components/icons";

export default function SoundToggle({ className }: { className?: string }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    loadMutePreference();
    setMutedState(isMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playSfx("click");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={muted ? "Sesi aç" : "Sesi kapat"}
      className={[
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-swamp-950 bg-swamp-800 text-parchment-100 shadow-card transition-transform hover:scale-105 active:scale-95",
        className ?? "",
      ].join(" ")}
    >
      {muted ? <Icon.SpeakerMute className="h-4 w-4" /> : <Icon.Speaker className="h-4 w-4" />}
    </button>
  );
}
