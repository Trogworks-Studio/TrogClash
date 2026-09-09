import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center gap-4 overflow-hidden px-4 py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- local static art */}
      <img src="/art/office-employee.png" alt="" className="h-40 w-40 object-contain" draggable={false} />
      <h1 className="font-display text-2xl font-extrabold text-parchment-100">Bu sayfa bataklığa gömülmüş</h1>
      <p className="max-w-sm text-sm text-parchment-300">
        Aradığın şey burada yok — Trog bile ne olduğunu bilmiyor, o da sadece bir çalışan.
      </p>
      <Link
        href="/"
        className="rounded-full border-2 border-swamp-950 bg-ember-600 px-8 py-3 font-display text-sm font-bold text-white shadow-card transition-transform hover:scale-105 active:scale-95"
      >
        Menüye Dön
      </Link>
    </main>
  );
}
