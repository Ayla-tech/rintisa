# Satset

Platform tugas sampingan dengan sistem siapa cepat dia dapat. Vite + Tailwind 4 + Supabase, tanpa framework.

## Menjalankan

1. Supabase > SQL Editor, jalankan berurutan: `supabase/00_reset.sql` (hanya jika memakai project lama), `01_schema.sql`, lalu opsional `02_seed.sql` (setelah ada satu akun pemberi kerja).
2. Authentication > Providers > Email: matikan "Confirm email" agar pendaftaran langsung masuk saat demo.
3. `cp .env.example .env.local`, isi URL dan anon key.
4. `npm install && npm run dev`.

## Mencoba tugas khusus badge

Beri badge lewat SQL (contoh ada di akhir `02_seed.sql`). Rebutan slot bisa dicoba dengan dua akun pekerja di dua browser.

## Ganti nama

Nama ada di `src/config.js` (BRAND), `index.html`, `public/manifest.webmanifest`, dan `public/icon.svg`.

Lihat `RISET-DESAIN.md` untuk dasar keputusan.
