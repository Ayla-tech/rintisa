import {
  $,
  esc,
  rp,
  BO,
  BY,
  PL,
  IN,
  MU,
  NT,
  AV,
  RING,
  EMPTY,
  toast,
} from "../ui.js";
import { ico, BI } from "../icons.js";
import { S, BD } from "../state.js";
import { pct, pctW } from "../matching.js";
import { createMatch } from "../data.js";

const key = () => "rs_skip_" + S.me,
  skipped = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(key()) || "[]"));
    } catch {
      return new Set();
    }
  },
  save = (s) => {
    try {
      localStorage.setItem(key(), JSON.stringify([...s]));
    } catch {}
  };
export function skip(id) {
  const s = skipped();
  s.add(id);
  save(s);
  cr();
}
export function unskip() {
  save(new Set());
  cr();
}

const card = (x, w, A) => {
  const p = w ? pct(x) : pctW(x),
    t = w ? x.t : x.n,
    sub = w ? x.o : x.b + " · " + x.j,
    sk = x.s.slice(0, 3);
  return `<article class="flex flex-col rounded-2xl bg-card p-4 shadow-card ring-1 ring-line transition hover:shadow-lift sm:p-5"><div class="flex items-start gap-3">${AV(w ? x.o : x.n)}
<div class="min-w-0 flex-1"><h3 class="line-clamp-2 font-bold leading-snug text-ink">${esc(t)}</h3><p class="${MU} truncate">${esc(sub)}</p></div>${RING(p)}</div>
<p class="mt-3 line-clamp-2 text-sm text-mut">${esc(x.x)}</p>
<div class="mt-3 flex flex-wrap gap-1.5">${sk.map((k) => `<span class="${PL}">${esc(k)}</span>`).join("")}${x.s.length > 3 ? `<span class="${PL} !bg-transparent !text-mut ring-1 ring-line">+${x.s.length - 3}</span>` : ""}</div>
<div class="mt-auto pt-4"><div class="flex items-center justify-between gap-3 border-t border-line pt-3"><div class="min-w-0"><b class="text-base text-ink">${w ? rp(x.b) : "Mulai " + rp(x.min)}</b>${w ? `<span class="${MU} block sm:inline"> · ${x.d} hari · ${x.r} revisi</span>` : ""}</div><button class="shrink-0 text-sm font-semibold text-pri hover:underline" onclick="openProf('${w ? "e" : "w"}','${w ? x.eid : x.id}')">Lihat profil</button></div>
<div class="mt-3 grid grid-cols-[1fr_1.5fr] gap-2.5"><button class="${BO}" onclick="skip('${x.id}')">${ico("x", "h-4 w-4")}Lewati</button><button class="${BY}" onclick="doMatch(${A.indexOf(x)})">${ico("heart", "h-4 w-4", "currentColor")}${w ? "Lamar" : "Undang"}</button></div></div></article>`;
};

const sapa = () => {
  const h = new Date().getHours();
  return h < 11
    ? "Selamat pagi"
    : h < 15
      ? "Selamat siang"
      : h < 18
        ? "Selamat sore"
        : "Selamat malam";
};
const stat = (i, n, l) =>
  `<div class="rounded-2xl bg-white/12 p-3 ring-1 ring-white/10"><span class="text-yel">${ico(i, "h-[18px] w-[18px]")}</span><b class="mt-1.5 block text-2xl font-extrabold leading-none">${n}</b><p class="mt-1 text-[11px] leading-tight text-blue-100">${l}</p></div>`;

export function vHome() {
  const w = S.role === "worker",
    name = (w ? S.w.name : S.e.name) || "",
    ids = w ? S.w.ids : S.e.ids,
    neg = S.nt.filter((n) => n.r === S.role && !n.dec).length,
    run = S.cps.filter((n) => n.st === "agreed").length,
    total = (w ? S.jobs : S.ws).length;
  setTimeout(cr, 0);
  return `<section class="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-[#17406a] to-navy2 p-5 text-white shadow-lift sm:p-7"><div class="dots pointer-events-none absolute inset-0"></div><div class="relative"><p class="text-sm text-blue-100">${sapa()},</p><h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">${esc(name.split(" ")[0] || "selamat datang")}</h1><p class="mt-1 max-w-md text-sm text-blue-100">${w ? "Ini pekerjaan yang paling cocok dengan kemampuanmu." : "Ini talenta yang paling cocok dengan pekerjaanmu."}</p>
<div class="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">${stat(w ? "briefcase" : "users", total, w ? "pekerjaan tersedia" : "talenta tersedia")}${stat("chat", neg, "dalam negosiasi")}${stat("bolt", run, "sedang berjalan")}</div>
${ids !== "terverifikasi" ? `<button class="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-yel px-4 py-3 text-left text-sm font-bold text-[#0f1c2e] transition hover:bg-[#ffc933]" onclick="S.tab='me';R()"><span class="flex items-center gap-2.5">${ico("idcard", "h-5 w-5")}Verifikasi identitas biar lebih dipercaya</span>${ico("arrow", "h-4 w-4")}</button>` : ""}</div></section>
${!w && !S.myJobs.length ? `<div class="${NT} flex gap-3">${ico("info", "h-5 w-5 text-pri")}<span>Pasang pekerjaan dulu di tab Profil supaya bisa mengundang talenta.</span></div>` : ""}
<div class="no-sb -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter bidang">${[["", "grid", "Semua"], ...BD.map((k) => [k, BI[k], k])].map(([k, i, l]) => `<button aria-pressed="${S.f === k}" class="inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition ${S.f === k ? "border-pri bg-pri text-onpri" : "border-line bg-card text-ink hover:border-pri"}" onclick='S.f=${JSON.stringify(k)};R()'>${ico(i, "h-4 w-4")}${l}</button>`).join("")}</div>
<div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mut">${ico("search", "h-5 w-5")}</span><input class="${IN} !pl-12" type="search" aria-label="Cari" placeholder="${w ? "Cari pekerjaan atau pemberi kerja" : "Cari nama atau bidang talenta"}" value="${esc(S.q)}" oninput="S.q=this.value;cr()"></div>
<h2 class="mb-4 mt-7 text-lg font-extrabold text-ink">${w ? "Pekerjaan untuk kamu" : "Talenta untuk pekerjaanmu"}</h2><div id="rs" class="grid gap-4 md:grid-cols-2"></div>`;
}
export function cr() {
  const w = S.role === "worker",
    q = S.q.toLowerCase(),
    sk = skipped(),
    A = w ? S.jobs : S.ws,
    L = A.filter(
      (x) =>
        !sk.has(x.id) &&
        (!S.f || (w ? x.bd.includes(S.f) : x.b === S.f)) &&
        (w ? x.t + x.o + x.x : x.n + x.x + x.b).toLowerCase().includes(q),
    ),
    e = $("#rs");
  if (e)
    e.innerHTML =
      L.map((x) => card(x, w, A)).join("") ||
      `<div class="md:col-span-2">${EMPTY("search", "Belum ada yang cocok", "Coba ganti bidang atau cek lagi nanti.", sk.size ? `<button class="${BO} mt-4" onclick="unskip()">Tampilkan yang disembunyikan</button>` : "")}</div>`;
}
export async function doMatch(i) {
  if (await createMatch(i))
    toast(
      S.role === "worker"
        ? "Lamaran terkirim. Lanjut diskusi di tab Chat."
        : "Undangan terkirim. Lanjut diskusi di tab Chat.",
    );
  const { R } = await import("../router.js");
  R();
}
