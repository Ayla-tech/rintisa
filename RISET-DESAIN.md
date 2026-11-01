# Riset dan keputusan desain Satset

Rombakan dari Rintisa. Dasar produknya tetap dua sisi (pemberi kerja dan pencari kerja), tetapi mekanismenya diganti dari "pencocokan dan negosiasi" menjadi "slot terbatas, siapa tercepat yang dapat".

## Temuan riset dan dampaknya

| Temuan | Sumber | Keputusan |
|---|---|---|
| Pengangguran usia 15–24 tahun 17,37%; pekerja paruh waktu 25,93% (38,42 juta orang) | BPS, Sakernas Mei 2026 (dikutip CNBC Indonesia, RCTI+, Bisnis.com) | Dipakai di landing sebagai alasan produk ada. Tanpa angka pengguna karangan. |
| Aplikasi tugas sampingan sudah ada (Sampingan, Panggilin), dikelola perusahaan sendiri | Pencarian web | Pembeda: pemberi kerja memasang sendiri dalam semenit, dana ditahan, dan ada tugas khusus badge. |
| Uji kegunaan Sampingan (SUS 59,63, di bawah rata-rata): label "butuh verifikasi" tersembunyi, tidak ada filter/urut/cari, tidak ada panduan awal, deskripsi tugas kurang jelas, unggah foto lambat dan berat | Jurnal JTIIK, Universitas Brawijaya | Syarat badge tampil di kartu dan alasan tidak bisa mengambil selalu dijelaskan; ada cari, filter, urut; panduan sekali di slot pertama; deskripsi dan instruksi dipisah; gambar dikecilkan sebelum diunggah. |
| Di Prolific (sistem studi berbasis slot), slot habis dalam hitungan detik; peserta bingung dengan pesan "penuh"; peserta hanya melihat studi yang memenuhi syarat; slot yang dikembalikan dibuka lagi | Pusat bantuan Prolific (peserta dan peneliti) | Slot penuh disembunyikan dari daftar; saat kalah rebutan ada pesan jelas dan daftar langsung diperbarui; slot yang dilepas atau kedaluwarsa dibuka lagi otomatis; realtime menggantikan email yang terlalu lambat. |
| Sistem rebutan mudah disalahgunakan dengan menimbun slot (pola grup joki) | Penalaran desain | Satu tugas aktif per pekerja, batas waktu kerja, tugas yang sama tidak bisa diambil ulang setelah dilepas. |

Catatan: riset ini lewat pencarian web dan literatur yang tersedia, bukan wawancara pengguna. Itu langkah berikutnya yang layak untuk Bab validasi.

## Keputusan produk

- **Dua tipe tugas**: terbuka untuk semua, atau butuh badge. Syarat badge bisa lebih dari satu (maksimal 3, semuanya wajib).
- **Badge**: katalog dan penguncian sudah jalan. Tes untuk meraihnya baru berupa info (sheet "Tes sedang disiapkan"). Sementara badge diberikan lewat SQL (lihat `02_seed.sql`).
- **Pemberi kerja cepat**: template, empat isian utama, opsi lanjutan terlipat, "Pasang lagi", dan hasil yang tak ditinjau 48 jam diterima otomatis.
- **Pencari kerja**: satu ketukan untuk mengambil slot, hitung mundur batas waktu, total pendapatan di beranda.
- **Survei**: ada kategori "Survei & form". Tautan dan instruksi tersembunyi sampai slot diambil.

## Teknis

- Semua perubahan status lewat fungsi SQL. Browser hanya membaca tabel, jadi slot tidak bisa dicurangi dari konsol.
- `claim_job` memakai satu `UPDATE ... WHERE slots_taken < slots`, atomik. Diuji dengan 12 koneksi serentak untuk 3 slot: tepat 3 berhasil.
- Navigasi memakai riwayat browser: Back mengembalikan layar sebelumnya, termasuk saat batal daftar. Draf formulir tersimpan di perangkat.
- Responsif: tab bawah di HP, sidebar di layar lebar. `manifest.webmanifest` memungkinkan "Tambahkan ke layar utama".

## Yang dihapus dari Rintisa (disengaja)

Swipe dan skor kecocokan, negosiasi, kontrak, log progres berfoto, profil ala CV, unggah KTP, lampiran chat. Semuanya tidak relevan untuk tugas mikro dengan sistem slot. Verifikasi identitas kini menjadi salah satu badge.

## Belum dikerjakan

Pembayaran sungguhan (QRIS/escrow dan pencairan ke e-wallet), tes badge, sengketa hasil, biaya layanan, notifikasi push, cek merek dan domain nama.
