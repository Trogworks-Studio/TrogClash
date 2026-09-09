"use client";

/**
 * Small procedural sound-effect engine built on the Web Audio API.
 *
 * Why synthesized instead of audio files? This sandbox has no network
 * access, so there was no way to source/download real SFX files. Every
 * sound here is generated at runtime from oscillators + noise buffers —
 * zero asset weight, zero licensing questions, and it still gives real
 * audio feedback instead of silence. Swapping any of these for a real
 * recorded SFX file later is a one-line change (just play an <audio>
 * element instead of calling the synth function).
 */

type SfxName = "cardPlay" | "attack" | "damage" | "heal" | "turnStart" | "victory" | "defeat" | "click" | "coin";

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window !== "undefined") localStorage.setItem("trogclash-muted", value ? "1" : "0");
}

export function loadMutePreference() {
  if (typeof window === "undefined") return;
  muted = localStorage.getItem("trogclash-muted") === "1";
}

function tone(
  audio: AudioContext,
  { freq, start, dur, type = "sine", gain = 0.18, freqEnd }: { freq: number; start: number; dur: number; type?: OscillatorType; gain?: number; freqEnd?: number },
) {
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, audio.currentTime + start + dur);
  g.gain.setValueAtTime(0, audio.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, audio.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + dur);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + dur + 0.02);
}

function noiseBurst(audio: AudioContext, { start, dur, gain = 0.15, lowpass = 2200 }: { start: number; dur: number; gain?: number; lowpass?: number }) {
  const bufferSize = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = lowpass;
  const g = audio.createGain();
  g.gain.setValueAtTime(gain, audio.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(audio.destination);
  src.start(audio.currentTime + start);
}

export function playSfx(name: SfxName) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  switch (name) {
    case "click":
      tone(audio, { freq: 520, start: 0, dur: 0.06, type: "triangle", gain: 0.12 });
      break;
    case "cardPlay":
      tone(audio, { freq: 260, start: 0, dur: 0.12, type: "triangle", freqEnd: 520, gain: 0.16 });
      noiseBurst(audio, { start: 0, dur: 0.08, gain: 0.06 });
      break;
    case "attack":
      noiseBurst(audio, { start: 0, dur: 0.1, gain: 0.22, lowpass: 3200 });
      tone(audio, { freq: 180, start: 0, dur: 0.14, type: "sawtooth", freqEnd: 60, gain: 0.2 });
      break;
    case "damage":
      tone(audio, { freq: 140, start: 0, dur: 0.18, type: "square", freqEnd: 50, gain: 0.16 });
      break;
    case "heal":
      tone(audio, { freq: 440, start: 0, dur: 0.1, type: "sine", gain: 0.14 });
      tone(audio, { freq: 660, start: 0.08, dur: 0.14, type: "sine", gain: 0.14 });
      break;
    case "turnStart":
      tone(audio, { freq: 330, start: 0, dur: 0.1, type: "sine", gain: 0.14 });
      tone(audio, { freq: 495, start: 0.09, dur: 0.16, type: "sine", gain: 0.14 });
      break;
    case "coin":
      tone(audio, { freq: 900, start: 0, dur: 0.05, type: "sine", gain: 0.12 });
      tone(audio, { freq: 1400, start: 0.05, dur: 0.14, type: "sine", gain: 0.1 });
      break;
    case "victory":
      [523, 659, 784, 1047].forEach((f, i) => tone(audio, { freq: f, start: i * 0.12, dur: 0.28, type: "triangle", gain: 0.16 }));
      break;
    case "defeat":
      tone(audio, { freq: 300, start: 0, dur: 0.35, type: "sawtooth", freqEnd: 90, gain: 0.18 });
      tone(audio, { freq: 220, start: 0.15, dur: 0.4, type: "sawtooth", freqEnd: 60, gain: 0.14 });
      break;
  }
}
