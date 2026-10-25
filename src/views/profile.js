import {
  esc,
  rp,
  C,
  BY,
  BO,
  BR,
  PL,
  OK,
  IN,
  LB,
  MU,
  NT,
  H1,
  H2,
  KV,
  IDB,
  CH,
  AV,
  toast,
} from "../ui.js";
import { ico } from "../icons.js";
import { S, SK, BD } from "../state.js";
import { R } from "../router.js";
import { img } from "./coop.js";

const sec = (i, t, b) => (b ? `<div class="${C}">${CH(i, t)}${b}</div>` : "");
const txt = (t) => (t ? `<p class="whitespace-pre-line text-sm leading-relaxed">${esc(t)}</p>` : "");
const sub = (t, v) => (v ? `<p class="${MU} mt-3 first:mt-0">${t}</p>${txt(v)}` : "");
const stat = (a, b) =>
  `<div class="rounded-xl bg-soft p-3 text-center"><b class="block text-sm text-ink">${a}</b><span class="text-[11px] text-mut">${b}</span></div>`;
const head = (r, chips, stats) => `<div class="mb-4 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-line"><div class="relative h-28 bg-gradient-to-br from-navy via-[#17406a] to-navy2"><div class="dots absolute inset-0"></div></div><div class="px-5 pb-5"><div class="relative -mt-10 w-fit rounded-3xl border-4 border-card">${AV(r.name, "h-20 w-20 text-3xl rounded-[1.25rem]")}</div>
<h2 class="mt-3 text-2xl font-extrabold tracking-tight text-ink">${esc(r.name)}</h2><div class="mt-2 flex flex-wrap gap-2">${chips.filter(Boolean).map((c) => `<span class="${PL}">${esc(c)}</span>`).join("")}${IDB(r.id_status)}</div>${stats ? `<div class="mt-4 grid grid-cols-3 gap-2">${stats}</div>` : ""}</div></div>`;

/* Tampilan profil = isi formulir registrasi, urut per langkah dan memakai label yang sama.
   Isian yang kosong tetap tampil sebagai "Belum diisi" supaya terlihat 1:1. */
const em = '<span class="font-normal text-mut">Belum diisi</span>';
const row = (a, v) => KV(a, v ? esc(v) : em);
const long = (a, v) => `<p class="${MU} mt-4 first:mt-0">${a}</p>${v ? txt(v) : `<p class="text-sm text-mut">Belum diisi</p>`}`;
const lnk = (v) =>
  !v ? `<p class="text-sm text-mut">Belum diisi</p>` : /^https?:\/\/\S+$/i.test(v.trim()) ? `<a class="break-all text-sm font-semibold text-pri underline" href="${esc(v.trim())}" target="_blank" rel="noopener noreferrer">${esc(v.trim())}</a>` : txt(v);
const wView = (r) =>
  head(
    r,
    [r.bidang, r.status_now, r.kota],
    stat(esc(r.lv || "-"), "level") +
      stat(esc(r.jam || 0) + " jam", "per minggu") +
      stat(rp(r.min_pay || 0), "minimum"),
  ) +
  sec("user", "Tentang kamu",
    row("Nama lengkap", r.name) + row("Kota domisili", r.kota) + row("Status saat ini", r.status_now) + row("Pendidikan terakhir", r.edu_level) +
      row("Asal sekolah, kampus, atau tempat belajar", r.school) + row("Jurusan atau bidang studi", r.major) + (r.grad_year ? row("Tahun lulus", String(r.grad_year)) : "") +
      long("Ringkasan diri", r.bio),
  ) +
  sec("target", "Kemampuan",
    row("Bidang utama", r.bidang) + row("Level saat ini", r.lv) +
      `<p class="${MU} mt-4">Kemampuan yang bisa dikerjakan</p><div class="mt-1 flex flex-wrap gap-2">${(r.skills || []).map((k) => `<span class="${PL}">${esc(k)}</span>`).join("") || `<span class="text-sm text-mut">Belum diisi</span>`}</div>` +
      `<div class="mt-3">${row("Tools yang dikuasai", r.tools)}${row("Bahasa", r.langs)}</div>`,
  ) +
  sec("trend", "Kesiapan belajar",
    long("Sedang belajar atau pernah mencoba apa?", r.task) +
      long("Kegiatan lain yang melatih kemampuan", r.org) +
      `<p class="${MU} mt-4">Tautan hasil latihan</p>${lnk(r.links)}`,
  ) +
  sec("clock", "Cara kerja",
    row("Waktu menyelesaikan satu tugas kecil", r.speed) + row("Kalau brief kurang jelas", r.gaya) +
      long("Jawaban kasus: klien minta ganti warna 3 kali", r.tes) +
      long("Alasan memilih pekerjaan di Rintisa", r.why),
  ) +
  sec("calendar", "Ketersediaan",
    row("Jam kerja per minggu", r.jam ? r.jam + " jam" : "") + row("Waktu paling luang", r.hari) + row("Bayaran minimum per proyek", r.min_pay ? rp(r.min_pay) : ""),
  );

const eView = (r) =>
  head(r, [r.jenis, r.kota], "") +
  sec("store", "Tentang usaha",
    row("Nama usaha atau organisasi", r.name) + row("Jenis", r.jenis) + row("Kota", r.kota) + long("Tentang usaha", r.about),
  ) +
  sec("target", "Kebutuhan",
    long("Biasanya butuh bantuan apa?", r.need) + `<div class="mt-3">${row("Kisaran honor per proyek", r.budget)}</div>`,
  ) +
  sec("link", "Tautan", lnk(r.links));

export const vProf = () => {
  const p = S.pv;
  return (
    `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="S.view=S.pb||'main';R()">${ico("back", "h-4 w-4")}Kembali</button>` +
    (p && p.r
      ? p.k === "w"
        ? wView(p.r)
        : eView(p.r)
      : `<div class="${C}"><p class="${MU}">Memuat profil…</p></div>`)
  );
};

const idCard = (s) =>
  s === "terverifikasi"
    ? ""
    : `<div class="${C}">${CH("idcard", "Verifikasi identitas")}<p class="${MU}">Unggah foto KTP, SIM, atau kartu pelajar supaya profilmu lebih dipercaya. Foto disimpan privat, hanya dipakai untuk verifikasi, dan tidak ditampilkan ke siapa pun. Nomor dokumen tidak disimpan.</p><div class="mt-2">${IDB(s)}</div>
<label class="${LB}">Jenis dokumen</label><select id="idt" class="${IN}"><option>KTP</option><option>SIM</option><option>Kartu pelajar</option></select>
<label class="${LB}">Foto dokumen</label><input id="idf" type="file" accept="image/*" class="${IN}"><button id="idb" class="${BO} mt-3 w-full" onclick="uploadId()">Kirim untuk verifikasi</button></div>`;

const CK = (w) => [
  [w.bio, "Ringkasan diri"],
  [w.status_now, "Status saat ini"],
  [w.skills.length, "Kemampuan"],
  [w.tools, "Tools"],
  [w.tes, "Jawaban kasus"],
  [w.why, "Alasan di Rintisa"],
  [w.ids === "terverifikasi", "Verifikasi identitas"],
];
const done = (w) => {
  const c = CK(w);
  return Math.round((100 * c.filter((x) => x[0]).length) / c.length);
};

const porto = () =>
  sec("folder",
    "Karya di Rintisa",
    S.nt
      .filter((n) => n.st === "completed")
      .map((n) => {
        const d = n.lg.filter((x) => x.p === 100).at(-1);
        return `<div class="mt-3 first:mt-0"><span class="${OK}">${ico("shield", "h-3.5 w-3.5")}Terverifikasi Rintisa</span><div class="mt-2">${img(n.lg.at(-1)?.i, "Hasil kerja")}</div><p class="mt-2 font-bold">${esc(n.job)}</p><p class="${MU}">Untuk ${esc(n.who)} · selesai ${new Date(n.fin).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · ${rp(n.b)} · revisi ${n.rev} dari ${n.rv}</p>${d && d.l ? `<a class="${MU} font-semibold text-pri underline" href="${esc(d.l)}" target="_blank" rel="noopener noreferrer">Lihat hasil</a>` : ""}</div>`;
      })
      .join("") ||
      `<div class="${NT}">Belum ada karya, dan itu tidak masalah. Karya pertamamu akan muncul di sini otomatis setelah proyek pertama selesai.</div>`,
  );

export function vMe() {
  if (S.role === "employer") {
    const e = S.e;
    return (
      eView({ ...e, id_status: e.ids }) +
      idCard(e.ids) +
      `<div class="${C}">${CH("briefcase", "Pekerjaan saya")}<p class="${MU}">${S.myJobs.length} dibuka, ${S.allJobs.length - S.myJobs.length} ditutup.</p><button class="${BY} mt-3 w-full" onclick="S.tab='jobs';S.view='main';R();scrollTo(0,0)">Kelola pekerjaan${ico("arrow", "h-4 w-4")}</button></div>` +
      `<div class="flex gap-2"><button class="${BO}" onclick="S.ob.employer=0;S.scr='onb';R()">${ico("pen", "h-4 w-4")}Ubah profil</button><button class="${BR}" onclick="logout()">${ico("logout", "h-4 w-4")}Keluar</button></div>`
    );
  }
  const w = S.w,
    p = done(w),
    miss = CK(w)
      .filter((x) => !x[0])
      .map((x) => x[1]);
  return (
    wView({ ...w, min_pay: w.min, id_status: w.ids }) +
    `<div class="${C}">${CH("sparkle", "Kelengkapan profil", `<b class="text-pri">${p}%</b>`)}<div class="h-2.5 overflow-hidden rounded-full bg-soft"><div class="h-full rounded-full bg-pri" style="width:${p}%"></div></div>${miss.length ? `<p class="${MU} mt-2">Belum diisi: ${miss.slice(0, 3).join(", ")}${miss.length > 3 ? " dan lainnya" : ""}.</p>` : `<p class="${MU} mt-2">Profilmu sudah lengkap. Mantap!</p>`}<p class="${MU} mt-1">Kamu tidak perlu pengalaman. Profil yang jujur dan lengkap sudah cukup untuk mulai.</p></div>` +
    porto() +
    idCard(w.ids) +
    `<div class="flex gap-2"><button class="${BO}" onclick="S.step=1;S.ob.worker=0;S.scr='onb';R()">${ico("pen", "h-4 w-4")}Ubah profil</button><button class="${BR}" onclick="logout()">${ico("logout", "h-4 w-4")}Keluar</button></div>`
  );
}
