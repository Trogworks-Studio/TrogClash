import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trog Clash — Trogworks Studyo",
  description:
    "Trogworks Studyo'nun bataklık temalı kart savaşı: goblinlerini topla, destene koy, bot'a kaydırma sokma!",
  openGraph: {
    title: "Trog Clash",
    description: "Bataklık temalı kart savaşı — Trogworks Studyo",
    images: ["/logo.png"],
  },
};

export const viewport = {
  themeColor: "#0E1A16",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
