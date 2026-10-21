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

export const tj = (k, v) => {
  const a = S.jf[k],
    m = k === "bd" ? 2 : 4,
    i = a.indexOf(v);
  if (i >= 0) a.splice(i, 1);
  else if (a.length >= m) return toast("Maksimal " + m + " pilihan.");
  else a.push(v);
  R();
};
const jc = (k, L) =>
  `<div class="flex flex-wrap gap-2">${L.map((v) => `<button type="button" class="inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${S.jf[k].includes(v) ? "border-pri bg-pri text-onpri" : "border-line bg-card text-ink hover:border-pri"}" onclick='tj("${k}",${JSON.stringify(v)})'>${v}</button>`).join("")}</div>`;
const jobForm = () => {
  const f = S.jf;
  return `<div class="${C}">${CH("plus", "Pasang pekerjaan")}
<label class="${LB}">Judul (min. 5 karakter)</label><input class="${IN}" value="${esc(f.t)}" oninput="S.jf.t=this.value">
<label class="${LB}">Bidang (pilih 1 sampai 2)</label>${jc("bd", BD)}<label class="${LB}">Kemampuan dibutuhkan (sampai 4)</label>${jc("s", SK)}
<label class="${LB}">Deskripsi (min. 30 karakter)</label><textarea class="${IN} min-h-[96px]" oninput="S.jf.x=this.value">${esc(f.x)}</textarea>
<label class="${LB}">Hasil akhir yang diharapkan</label><textarea class="${IN} min-h-[72px]" oninput="S.jf.dv=this.value">${esc(f.dv)}</textarea>
<label class="${LB}">Level pekerja minimum</label><select class="${IN}" onchange="S.jf.lv=this.value">${["Semua level", "Pemula ke atas", "Sudah sering praktik"].map((x) => `<option${x === f.lv ? " selected" : ""}>${x}</option>`).join("")}</select>
<label class="${LB}">Honor (Rp 15.000 – 300.000)</label><input type="number" class="${IN}" value="${f.b}" oninput="S.jf.b=+this.value">
<label class="${LB}">Tenggat (1–60 hari)</label><input type="number" class="${IN}" value="${f.d}" oninput="S.jf.d=+this.value">
<label class="${LB}">Maksimal revisi (0–5)</label><input type="number" class="${IN}" value="${f.r}" oninput="S.jf.r=+this.value">
<button class="${BY} mt-4 w-full" onclick="postJob()">Pasang pekerjaan</button></div>`;
};

const sec = (i, t, b) => (b ? `<div class="${C}">${CH(i, t)}${b}</div>` : "");
const txt = (t) =>
  t
    ? `<p class="whitespace-pre-line text-sm leading-relaxed">${esc(t)}</p>`
    : "";
const sub = (t, v) =>
  v ? `<p class="${MU} mt-3 first:mt-0">${t}</p>${txt(v)}` : "";
const stat = (a, b) =>
  `<div class="rounded-xl bg-soft p-3 text-center"><b class="block text-sm text-ink">${a}</b><span class="text-[11px] text-mut">${b}</span></div>`;
const head = (
  r,
  chips,
  stats,
) => `<div class="mb-4 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-line"><div class="dots h-28 bg-gradient-to-br from-navy via-[#17406a] to-navy2"></div><div class="px-5 pb-5"><div class="-mt-10 w-fit rounded-3xl border-4 border-card">${AV(r.name, "h-20 w-20 text-3xl rounded-[1.25rem]")}</div>
<h2 class="mt-3 text-2xl font-extrabold tracking-tight text-ink">${esc(r.name)}</h2><div class="mt-2 flex flex-wrap gap-2">${chips
  .filter(Boolean)
  .map((c) => `<span class="${PL}">${esc(c)}</span>`)
  .join(
    "",
  )}${IDB(r.id_status)}</div>${stats ? `<div class="mt-4 grid grid-cols-3 gap-2">${stats}</div>` : ""}</div></div>`;

const wView = (r) =>
  head(
    r,
    [r.bidang, r.status_now, r.kota],
    stat(esc(r.lv || "-"), "level") +
      stat(esc(r.jam || 0) + " jam", "per minggu") +
      stat(rp(r.min_pay || 0), "minimum"),
  ) +
  sec("user", "Tentang saya", txt(r.bio)) +
  sec(
    "target",
    "Kemampuan",
    `<div class="mb-2 flex flex-wrap gap-2">${(r.skills || []).map((k) => `<span class="${PL}">${esc(k)}</span>`).join("")}</div>` +
      KV("Tools", esc(r.tools || "-")) +
      KV("Bahasa", esc(r.langs || "-")),
  ) +
  sec(
    "chat",
    "Jawaban kasus: klien minta ganti warna 3 kali",
    r.tes
      ? `<div class="rounded-2xl bg-soft p-4 text-sm italic leading-relaxed">“${esc(r.tes)}”</div>`
      : "",
  ) +
  sec(
    "trend",
    "Kesiapan belajar",
    sub("Sedang belajar atau pernah dicoba", r.task) +
      sub("Kegiatan yang melatih kemampuan", r.org) +
      sub("Hasil latihan", r.links),
  ) +
  sec(
    "clock",
    "Cara kerja",
    KV("Waktu per tugas kecil", esc(r.speed)) +
      KV("Saat brief kurang jelas", esc(r.gaya)) +
      KV("Waktu luang", esc(r.hari)) +
      sub("Kenapa di Rintisa", r.why),
  ) +
  sec(
    "cap",
    "Latar belakang",
    r.edu_level || r.status_now
      ? KV("Status", esc(r.status_now || "-")) +
          KV("Pendidikan terakhir", esc(r.edu_level || "-")) +
          (r.school ? KV("Asal belajar", esc(r.school)) : "") +
          (r.major ? KV("Jurusan / bidang studi", esc(r.major)) : "")
      : "",
  );

const eView = (r) =>
  head(r, [r.jenis, r.kota], "") +
  sec("store", "Tentang usaha", txt(r.about)) +
  sec(
    "target",
    "Kebutuhan",
    txt(r.need) + KV("Kisaran honor", esc(r.budget || "-")),
  ) +
  sec("link", "Tautan", txt(r.links));

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
  sec(
    "folder",
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
      `<div class="${C}">${CH("briefcase", "Pekerjaan saya")}${S.myJobs.map((j) => `<p class="${MU} mt-1">• ${esc(j.t)} · ${rp(j.b)}</p>`).join("") || `<p class="${MU}">Belum ada. Pasang satu di bawah supaya talenta bisa dicocokkan.</p>`}</div>` +
      jobForm() +
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
