/* Satu tempat untuk nama, teks, dan pilihan tetap. Ganti nama merek cukup di sini dan di index.html / manifest. */
export const BRAND = { name: "Satset", tag: "Siapa satset, dia dapat." };

/* kategori tugas: [label, ikon] */
export const CAT = {
  survei: ["Survei & form", "clipboard"],
  data: ["Input data", "table"],
  desain: ["Desain", "palette"],
  konten: ["Konten", "pen"],
  admin: ["Admin & rekap", "folder"],
  lain: ["Lainnya", "grid"],
};

/* template agar pemberi kerja bisa memasang tugas dalam hitungan detik (nilai awal, bisa diubah) */
export const TPL = {
  survei: { t: "Isi survei singkat", x: "Jawab pertanyaan survei dengan jujur dan lengkap. Cukup HP, tidak perlu pengalaman.", ins: "Buka tautan, jawab semua pertanyaan, lalu kirim tangkapan layar halaman terima kasih.", pay: 5000, slots: 20, hrs: 3, rev: 0 },
  data: { t: "Input data ke spreadsheet", x: "Salin data dari foto atau dokumen ke spreadsheet sesuai kolom yang disediakan.", ins: "Kolom yang diisi: ... Kirim tautan spreadsheet yang sudah diisi.", pay: 30000, slots: 1, hrs: 24, rev: 1 },
  desain: { t: "Desain poster atau banner", x: "Buat satu desain poster atau banner sesuai brief, lengkap dengan logo dan teks yang kami kirim.", ins: "Brief, logo, dan teks ada di tautan. Kirim hasil berupa PNG dan file sumber.", pay: 50000, slots: 1, hrs: 48, rev: 2 },
  konten: { t: "Tulis caption dan ide konten", x: "Tulis beberapa caption singkat bergaya santai untuk media sosial usaha kami.", ins: "Produk dan gaya bahasa: ... Kirim dalam satu dokumen atau tautan.", pay: 25000, slots: 3, hrs: 24, rev: 1 },
  admin: { t: "Rekap dan cek data", x: "Rapikan, cek ganda, dan rekap data yang kami berikan agar siap dipakai.", ins: "Akses data dibagikan lewat tautan. Cek duplikat dan format.", pay: 40000, slots: 1, hrs: 24, rev: 1 },
  lain: { t: "", x: "", ins: "", pay: 20000, slots: 1, hrs: 24, rev: 1 },
};

export const STATUS_W = ["Pelajar", "Mahasiswa", "Lulusan baru", "Sedang mencari kerja", "Lainnya"];
export const JENIS = ["UMKM", "Komunitas", "Organisasi kampus", "Perorangan", "Lainnya"];
export const AUTO_HOURS = 48; /* sama dengan aturan di sweep() pada SQL */

/* pesan dari fungsi SQL -> kalimat ramah */
export const ERR = {
  PENUH: "Yah, slot terakhir baru saja diambil orang lain. Daftar sudah diperbarui, coba tugas lain.",
  BADGE: "Tugas ini butuh badge yang belum kamu punya.",
  SIBUK: "Kamu masih punya tugas aktif. Kirim hasilnya atau lepas slot dulu.",
  SUDAH: "Kamu sudah pernah mengambil tugas ini.",
  TUTUP: "Tugas ini sudah ditutup atau kedaluwarsa.",
  PROFIL: "Lengkapi profilmu dulu.",
  STATUS: "Status tugas sudah berubah. Muat ulang halaman.",
  KOSONG: "Unggah file hasil atau tempel tautan hasil.",
  LINK: "Tautan harus diawali http:// atau https://",
  REVISI: "Kuota revisi tugas ini sudah habis.",
  CATATAN: "Tulis apa yang perlu diperbaiki.",
  RENTANG: "Lama tayang tidak valid.",
};
