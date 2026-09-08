import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trog Clash — Trogworks Studyo",
  description:
    "Trogworks Studyo'nun bataklık temalı kart savaşı: goblinlerini topla, destene koy, bot'a kaydırma sokma!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
