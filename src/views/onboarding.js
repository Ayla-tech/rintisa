import { esc, C, BY, BO, IN, LB, MU, H1, toast } from "../ui.js";
import { ico } from "../icons.js";
import { S, SK, BD } from "../state.js";
import { R } from "../router.js";
export const tg = (k) => {
  const a = S.w.skills,
    i = a.indexOf(k);
  if (i >= 0) a.splice(i, 1);
  else if (a.length >= 8) return toast("Maksimal 8 kemampuan.");
  else a.push(k);
  R();
};
export const chips = () =>
  `<div class="flex flex-wrap gap-2">${SK.map((k) => `<button type="button" class="inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${S.w.skills.includes(k) ? "border-pri bg-pri text-onpri" : "border-line bg-card text-ink hover:border-pri"}" onclick='tg(${JSON.stringify(k)})'>${S.w.skills.includes(k) ? ico("check", "h-3.5 w-3.5") : ""}${k}</button>`).join("")}</div>`;
const L = (t, h = "") =>
  `<label class="${LB}">${t}</label>${h ? `<p class="${MU} mb-1">${h}</p>` : ""}`;
const ip = (o, k, ph = "", t = "text") =>
  `<input class="${IN}" type="${t}" placeholder="${ph}" value="${esc(S[o][k])}" oninput="S.${o}.${k}=${t === "number" ? "+" : ""}this.value">`;
const ta = (o, k, ph) =>
  `<textarea class="${IN} min-h-[88px]" placeholder="${ph}" oninput="S.${o}.${k}=this.value">${esc(S[o][k])}</textarea>`;
const opt = (o, k, a) =>
  `<select class="${IN}" onchange="S.${o}.${k}=this.value">${a.map((x) => `<option${x === S[o][k] ? " selected" : ""}>${x}</option>`).join("")}</select>`;
const T = [
  "Tentang kamu",
  "Kemampuan",
  "Kesiapan belajar",
  "Cara kerja",
  "Ketersediaan",
];

export function nextStep() {
  const w = S.w,
    s = S.step;
  if (
    s === 1 &&
    (w.name.trim().length < 2 || !w.kota.trim() || w.bio.trim().length < 30)
  )
    return toast("Isi nama, kota, dan ringkasan diri (minimal 30 karakter).");
  if (s === 2 && !w.skills.length)
    return toast("Pilih minimal satu kemampuan.");
  if (s === 4 && w.tes.trim().length < 20)
    return toast("Jawab kasus revisi minimal 20 karakter.");
  if (
    s === 5 &&
    !(w.min >= 15000 && w.min <= 300000 && w.jam >= 1 && w.jam <= 80)
  )
    return toast(
      "Cek jam kerja (1-80) dan bayaran minimum (Rp 15.000-300.000).",
    );
  if (s < 5) {
    S.step++;
    R();
    scrollTo(0, 0);
  } else window.saveProfile();
}
export function saveEmp() {
  const e = S.e;
  if (e.name.trim().length < 2 || !e.kota.trim() || e.about.trim().length < 20)
    return toast("Isi nama, kota, dan tentang usaha (minimal 20 karakter).");
  window.saveProfile();
}
export function vOnb() {
  if (S.role === "employer")
    return `<div class="${C} !p-6 sm:!p-8"><h1 class="${H1}">Profil usaha</h1><p class="${MU}">Profil yang jelas membuat pekerja berani melamar. Verifikasi identitas bisa menyusul di tab Profil.</p>
${L("Nama usaha atau organisasi")}${ip("e", "name")}${L("Jenis")}${opt("e", "jenis", ["UMKM", "Komunitas", "Organisasi kampus", "Perorangan", "Lainnya"])}${L("Kota")}${ip("e", "kota", "Contoh: Malang")}
${L("Tentang usaha", "Apa yang dijual atau dikerjakan, sudah berapa lama.")}${ta("e", "about", "Contoh: Kedai kopi rumahan sejak 2022, jualan lewat Instagram")}
${L("Biasanya butuh bantuan apa?")}${ta("e", "need", "Contoh: poster promo, konten Instagram, input stok")}${L("Tautan usaha", "Instagram, marketplace, atau website (teks biasa).")}${ip("e", "links", "@namausaha")}
${L("Kisaran honor per proyek")}${opt("e", "budget", ["15-100rb", "100-300rb"])}<button class="${BY} mt-8 w-full !min-h-12" onclick="saveEmp()">Simpan dan mulai</button></div>`;
  const st = S.step;
  let b = "";
  if (st === 1)
    b = `<h1 class="${H1}">Tentang kamu</h1><p class="${MU}">Ini pengganti CV. Semakin lengkap, semakin mudah dipercaya.</p>${L("Nama lengkap")}${ip("w", "name")}${L("Kota domisili")}${ip("w", "kota", "Contoh: Malang")}
${L("Status kamu saat ini")}${opt("w", "status_now", ["Pelajar", "Mahasiswa", "Lulusan baru", "Sedang mencari kerja", "Pekerja lepas / freelance", "Kembali bekerja setelah jeda", "Lainnya"])}${L("Pendidikan terakhir")}${opt("w", "edu_level", ["SD/SMP", "SMA/SMK", "D3", "S1", "S2 atau lebih", "Belajar mandiri / non-formal"])}${L("Asal sekolah, kampus, atau tempat belajar", "Boleh dikosongkan.")}${ip("w", "school", "Contoh: SMKN 1 Malang, kursus online, belajar mandiri")}${L("Jurusan atau bidang studi", "Boleh dikosongkan.")}${ip("w", "major", "Contoh: Multimedia")}
${L("Ringkasan dirimu", "Minimal 30 karakter: kamu siapa, mau mengerjakan apa.")}${ta("w", "bio", "Contoh: Suka desain dan sering bantu bikin poster acara di lingkungan sekitar.")}`;
  if (st === 2)
    b = `<h1 class="${H1}">Kemampuan</h1>${L("Bidang utama")}${opt("w", "bidang", BD)}${L("Level kamu sekarang")}${opt("w", "lv", ["Baru belajar", "Pemula", "Sudah sering praktik"])}
${L("Kemampuan yang bisa dikerjakan", "Pilih sampai 8.")}${chips()}${L("Tools yang dikuasai")}${ip("w", "tools", "Contoh: Canva Pro, CapCut, Excel")}${L("Bahasa")}${ip("w", "langs", "Indonesia, Inggris dasar")}`;
  if (st === 3)
    b = `<h1 class="${H1}">Kesiapan belajar</h1><p class="${MU}">Belum punya pengalaman? Justru itu tujuan Rintisa. Bagian ini boleh dikosongkan.</p>${L("Sedang belajar atau pernah mencoba apa?", "Contoh: belajar Canva dari YouTube, bantu bikin poster acara RT.")}${ta("w", "task", "Ceritakan singkat")}${L("Kegiatan lain yang melatih kemampuanmu", "Organisasi, hobi, komunitas, atau kegiatan keluarga.")}${ta("w", "org", "Opsional")}${L("Tautan hasil latihan", "Opsional. Kalau belum ada, kosongkan saja.")}${ip("w", "links", "drive.google.com/...")}`;
  if (st === 4)
    b = `<h1 class="${H1}">Cara kerja</h1>${L("Biasanya berapa lama menyelesaikan satu tugas kecil?")}${opt("w", "speed", ["Kurang dari 1 hari", "2-3 hari", "Seminggu"])}${L("Kalau brief kurang jelas, kamu biasanya")}${opt("w", "gaya", ["Tanya dulu kalau ragu", "Coba dulu lalu tunjukkan", "Cari contoh sendiri"])}
${L("Klien minta ganti warna 3 kali. Apa yang kamu lakukan?", "Jawaban ini dilihat pemberi kerja. Minimal 20 karakter.")}${ta("w", "tes", "Jawab dengan caramu")}${L("Kenapa mau ambil pekerjaan di Rintisa?")}${ta("w", "why", "Ceritakan singkat")}`;
  if (st === 5)
    b = `<h1 class="${H1}">Ketersediaan</h1>${L("Jam kerja per minggu")}${ip("w", "jam", "", "number")}${L("Waktu paling luang")}${opt("w", "hari", ["Pagi", "Sore", "Malam", "Akhir pekan"])}${L("Bayaran minimum per proyek (Rp)", "Antara 15.000 dan 300.000.")}${ip("w", "min", "", "number")}
<div class="${MU} mt-4 rounded-xl bg-soft p-3">Tips: setelah profil jadi, buka tab Profil untuk verifikasi identitas. Profil terverifikasi lebih dipercaya pemberi kerja.</div>`;
  return `<div class="mb-6"><div class="flex items-center justify-between text-sm"><b class="text-ink">Langkah ${st} dari 5</b><span class="text-mut">${T[st - 1]}</span></div><div class="mt-3 grid grid-cols-5 gap-1.5" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${st}">${T.map((_, i) => `<span class="h-1.5 rounded-full ${i < st ? "bg-pri" : "bg-line"}"></span>`).join("")}</div></div>
<div class="${C} !p-6 sm:!p-8">${b}<div class="mt-8 flex gap-3">${st > 1 ? `<button class="${BO}" onclick="S.step--;R();scrollTo(0,0)">${ico("back", "h-4 w-4")}Kembali</button>` : ""}<button class="${BY} flex-1 !min-h-12" onclick="nextStep()">${st < 5 ? "Lanjut" : "Simpan profil"}${st < 5 ? ico("arrow", "h-4 w-4") : ""}</button></div></div>`;
}
