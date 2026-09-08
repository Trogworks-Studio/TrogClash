# Trog Clash — Trogworks Studyo

Bataklık temalı, Disenchantment esintili çizgi film görünümünde bir kart savaşı
oyunu. Next.js 14 (App Router) + TypeScript + Tailwind + Supabase ile yazıldı.

## Şu an neler çalışıyor

- **Tek oyunculu, bota karşı tam bir maç**: mana eğrisi, taşlar/büyüler,
  taunt, charge, kart bazlı efektler (hasar/iyileştirme/kart çekme/güçlendirme),
  kahraman gücü ("Trog Yumruğu"), yorgunluk (deste biterse) ve kazanma/kaybetme
  koşulu.
- **Basit ama okunabilir bir bot AI**: elindekini mana eğrisine göre oynar,
  kazançlı takas varsa yapar, taunt varsa zorunlu saldırır, yoksa yüze vurur.
- **Rekabetçi tek ladder sistemi**: kazanınca **+18 XP**, kaybedince **-27 XP**
  (bilinçli olarak kazanmaktan daha ağır — tırmanmak gerçekten zor olsun diye).
  100 XP = 1 seviye. Seviyeye göre goblince unvanlar (`lib/game/rank.ts`).
- **Skor tablosu**: Supabase bağlanınca tüm oyuncular arasında genel sıralama;
  bağlanmadıysa oyun yine de misafir modunda, ilerleme tarayıcıda saklanarak
  çalışır (`localStorage`).
- **Goblin/Trog temalı görseller**: dışarıdan görsel/asset yüklemeden, tamamen
  kod içinde üretilen SVG illüstrasyonlarla (`components/GoblinIllustration.tsx`)
  — 10 farklı goblin/bataklık yaratığı varyasyonu, nadir kartlarda parıltı efekti.

## Şu an ÇALIŞMAYAN (bilerek ertelenen) kısım

**Gerçek oyunculara karşı online maçlar.** Bunu bilinçli olarak sona bıraktık
çünkü gerçek zamanlı PvP; sunucu tarafında yetkili (authoritative) bir maç
motoru, eşleştirme (matchmaking) kuyruğu ve hile önleme gerektiriyor — bunlar
"bir mesajda scaffold edilir" değil, ayrı bir aşama. Motor zaten iki
`PlayerState` arasında soyut çalıştığı için (`lib/game/engine.ts`), online mod
eklerken oyun kurallarını yeniden yazmaya gerek yok. Önerilen yol:

1. Supabase Realtime (veya Ably/PartyKit) ile bir `matches` tablosu/kanalı aç.
2. Sunucu tarafında (bir Edge Function veya küçük bir Node servisi) aynı
   `engine.ts` fonksiyonlarını çalıştır — **istemciye güvenme**, hamleleri
   sunucuda doğrula ve yayınla.
3. XP güncellemesini de o sunucu fonksiyonuna taşı (`supabase/schema.sql`
   içindeki RLS policy'sinde bu notu bıraktık — şu an istemci kendi XP'sini
   güncelliyor, tek oyunculu prototip için sorun değil ama online modda hile
   açığı olur).

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # Supabase bilgilerini doldur (opsiyonel)
npm run dev
```

Supabase olmadan da `npm run dev` ile oyun tamamen oynanabilir durumda
(misafir modu, yerel skor).

### Supabase ile genel skor tablosunu açmak

1. [supabase.com](https://supabase.com) üzerinde ücretsiz bir proje aç.
2. Proje ayarlarından `Project URL` ve `anon public key` değerlerini
   `.env.local` dosyasına yapıştır.
3. SQL Editor'de `supabase/schema.sql` dosyasının tamamını çalıştır (tablo,
   RLS policy'leri ve `leaderboard` view'ını oluşturur).
4. Authentication → Providers → **Anonymous Sign-Ins**'i aç (misafir
   girişi için; istersen ileride e-posta/OAuth'a geçirebilirsin).
5. `npm run dev` — artık her oyuncu otomatik bir profil alır ve
   `/leaderboard` sayfası gerçek verilerle dolar.

## Motoru tek başına test etmek

Oyun mantığı UI'dan bağımsız, saf fonksiyonlarla yazıldı. Hızlı bir
sağlık kontrolü için (25 simüle maç, bot dahil):

```bash
npx tsx scripts/test-engine.ts
```

## Klasör yapısı

```
app/                 Next.js sayfaları (menü, oyun, skor tablosu)
components/          UI bileşenleri (kart, tahta, kahraman, mana, illüstrasyon)
lib/game/            Saf oyun mantığı: cards.ts, engine.ts, bot.ts, rank.ts
lib/hooks/           useProfile — Supabase/misafir profil senkronizasyonu
lib/supabase/        Supabase istemci kurulumu
supabase/schema.sql  Veritabanı şeması + RLS + leaderboard view
scripts/test-engine.ts  UI'sız motor testi
```

## Yeni kart eklemek

`lib/game/cards.ts` içindeki `CARD_SET` dizisine yeni bir `MinionCard` ya da
`SpellCard` ekle, `buildStarterDeck()` içindeki listede kaç kopya
oynanacağını belirt. Yeni bir görsel "variant" istiyorsan
`components/GoblinIllustration.tsx` içindeki `SKIN` ve `VariantAccessory`
haritalarına birkaç satır ekle — yeni bir dış görsel dosyası yüklemene gerek
yok, hepsi SVG olarak koddan üretiliyor.

## Tasarım yönü

Disenchantment'ın bataklık/goblin estetiğinden ilham alan, kalın çizgi film
konturlu, yuvarlak hatlı, "Baloo 2" başlık + "Nunito" gövde yazı tipi
kombinasyonlı bir palet: bataklık yeşilleri/laciverti, goblin altını, cadı
moru, kor turuncusu. Tüm renk/tipografi token'ları `tailwind.config.ts`
içinde.
