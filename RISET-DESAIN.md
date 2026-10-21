# Dasar keputusan desain Rintisa

Setiap angka di bawah punya sumber. Tidak ada testimoni, jumlah pengguna, atau logo mitra karangan di landing page.

| Keputusan | Dasar |
|---|---|
| Mobile-first | DataReportal Digital 2026 Indonesia: 331 juta koneksi seluler aktif akhir 2025, median unduh seluler 45,01 Mbps. https://datareportal.com/reports/digital-2026-indonesia |
| CTA utama dan nilai jual di layar pertama | NN/g, Scrolling and Attention: sekitar 57% waktu lihat halaman ada di layar pertama, 74% di dua layar pertama. https://www.nngroup.com/articles/scrolling-and-attention/ |
| Statistik masalah di landing | BPS Sakernas Mei 2026: TPT usia 15-24 tahun 17,37%, TPT lulusan SMK 7,68% (via CNBC Indonesia, 6 Agustus 2026). |
| Target sentuh minimal 44px (min-h-11), WCAG minimum 24px | WCAG 2.2 SC 2.5.8 Target Size (Minimum). https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22 |
| Kontras teks minimal 4.5:1 | Semua pasangan warna dihitung (lihat tabel di bawah), semuanya lolos AA. |
| Font Plus Jakarta Sans | Dirancang Tokotype untuk identitas +Jakarta, lisensi SIL OFL, mencakup 467 bahasa, di-host sendiri lewat @fontsource-variable. https://fontsource.org/fonts/plus-jakarta-sans/about |
| Dana ditahan pihak ketiga ditonjolkan | Pola umum platform freelance Indonesia (Fastwork, Sribulancer, Projects.co.id memakai escrow/rekening bersama). |
| Performa | Core Web Vitals: LCP <= 2.5 dtk, INP <= 200 ms, CLS <= 0.1 (web.dev). Tanpa gambar eksternal, font subset latin 27 KB. |

## Kontras warna (diukur)
ink/card 17.1 · mut/card 5.9 · mut/soft 5.2 · pri/card 10.6 · putih/pri 10.6 · hitam/kuning 9.7 · ok/card 5.0 · bad/card 5.4 · mode gelap: ink 13.8, mut 7.3, pri 6.2.

## Catatan kejujuran untuk demo
Klaim "dana ditahan pihak ketiga" dan "identitas terverifikasi" masih berupa alur prototipe, belum terhubung ke penyedia pembayaran atau verifikasi sungguhan. Footer sudah menyebut ini prototipe MVP.
