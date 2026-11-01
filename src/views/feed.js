import { $, esc, rp, BY, BO, PL, OK, IN, MU, CARD, AG, TK, CI, SLOT, BDG, bname, EMPTY } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { CAT } from "../config.js";
import { activeClaim, earned } from "../data.js";

export const canTake = (j) => j.acc === "open" || j.bd.every((b) => S.myB.includes(b));
export const accChip = (j) =>
  j.acc === "open"
    ? `<span class="${OK}">${ico("check", "h-3.5 w-3.5")}Terbuka untuk semua</span>`
    : `<span class="${PL}">${ico("award", "h-3.5 w-3.5")}Badge: ${esc(bname(j.bd[0]))}${j.bd.length > 1 ? " +" + (j.bd.length - 1) : ""}</span>`;

/* tombol aksi: selalu jelas kenapa tidak bisa diambil */
export const cta = (j) => {
  const act = activeClaim();
  if (!canTake(j)) return `<button class="${BO} w-full" onclick="badgeInfo('${j.id}')">${ico("lock", "h-4 w-4")}Butuh badge ${esc(bname(j.bd.find((b) => !S.myB.includes(b))))}</button>`;
  if (act) return `<button class="${BO} w-full" onclick="openClaim('${act.id}')">Selesaikan tugas aktifmu dulu${ico("arrow", "h-4 w-4")}</button>`;
  return `<button class="${BY} w-full !min-h-12 !text-base" ${S.busy ? "disabled" : ""} onclick="claimTap('${j.id}')">${ico("bolt", "h-4 w-4", "currentColor")}Ambil slot · ${rp(j.pay)}</button>`;
};

const card = (j) =>
  `<article class="${CARD}"><div class="flex items-start gap-3">${CI(j.kind)}<div class="min-w-0 flex-1"><button class="text-left" onclick="openJob('${j.id}')"><h3 class="line-clamp-2 font-bold leading-snug text-ink hover:underline">${esc(j.t)}</h3></button><p class="${MU} truncate">${esc(j.emp)} · ${AG(j.at)}</p></div><div class="text-right"><b class="block text-lg font-extrabold leading-tight text-ink">${rp(j.pay)}</b><span class="text-[11px] text-mut">per orang</span></div></div>
<p class="mt-3 line-clamp-2 break-words text-sm text-mut">${esc(j.x)}</p>
<div class="mt-3 flex flex-wrap gap-1.5">${accChip(j)}<span class="${PL}">${ico("clock", "h-3.5 w-3.5")}Maks. ${j.hrs} jam kerja</span></div>
<div class="mt-3">${SLOT(j)}</div><div class="mt-4">${cta(j)}</div></article>`;

const chip = (on, l, fn, i = "") => `<button aria-pressed="${on}" class="inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition ${on ? "border-pri bg-pri text-onpri" : "border-line bg-card text-ink hover:border-pri"}" onclick="${fn}">${i ? ico(i, "h-4 w-4") : ""}${l}</button>`;

export function vFeed() {
  const act = activeClaim(), n = S.claims.filter((c) => c.st === "approved").length;
  setTimeout(fr, 0);
  return `<section class="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-[#17406a] to-navy2 p-5 text-white shadow-lift sm:p-7"><div class="dots pointer-events-none absolute inset-0"></div><div class="relative flex items-end justify-between gap-4"><div><p class="flex items-center gap-2 text-sm text-blue-100"><span class="live-dot h-2 w-2 rounded-full bg-yel"></span>Langsung · daftar diperbarui otomatis</p><h1 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">${esc(S.w.name.split(" ")[0] || "Halo")}, siapa satset dia dapat</h1></div><div class="shrink-0 rounded-2xl bg-white/12 px-4 py-2.5 text-right ring-1 ring-white/10"><b class="block text-xl font-extrabold leading-tight text-yel">${rp(earned())}</b><span class="text-[11px] text-blue-100">${n} tugas selesai</span></div></div></section>
${act ? `<button class="mb-5 flex w-full items-center gap-3 rounded-2xl bg-yel p-4 text-left text-[#0f1c2e] shadow-card" onclick="openClaim('${act.id}')"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/10">${ico("clock", "h-5 w-5")}</span><span class="min-w-0 flex-1"><b class="block truncate">${esc(act.job?.t || "Tugas aktif")}</b><span class="text-sm">${act.st === "revision" ? "Perlu revisi" : "Sedang dikerjakan"} · sisa ${TK(act.due)}</span></span>${ico("arrow", "h-5 w-5")}</button>` : ""}
<div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mut">${ico("search", "h-5 w-5")}</span><input class="${IN} !pl-12" type="search" aria-label="Cari tugas" placeholder="Cari tugas atau pemberi kerja" value="${esc(S.q)}" oninput="S.q=this.value;fr()"></div>
<div class="no-sb -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter kategori">${chip(!S.f, "Semua", "S.f='';R()", "grid")}${Object.entries(CAT).map(([k, [l, i]]) => chip(S.f === k, l, `S.f='${k}';R()`, i)).join("")}</div>
<div class="mt-3 flex items-center justify-between gap-3"><div class="inline-flex rounded-full bg-soft p-1" role="group" aria-label="Akses">${[["", "Semua"], ["open", "Terbuka"], ["badge", "Badge"]].map(([k, l]) => `<button aria-pressed="${S.acc === k}" class="rounded-full px-3.5 py-1.5 text-sm font-bold transition ${S.acc === k ? "bg-card text-ink shadow-sm" : "text-mut hover:text-ink"}" onclick="S.acc='${k}';R()">${l}</button>`).join("")}</div>
<select aria-label="Urutkan" class="min-h-10 rounded-xl border border-line bg-card px-3 text-sm font-semibold text-ink" onchange="S.sort=this.value;R()">${[["new", "Terbaru"], ["pay", "Bayaran tertinggi"], ["few", "Slot menipis"]].map(([k, l]) => `<option value="${k}"${S.sort === k ? " selected" : ""}>${l}</option>`).join("")}</select></div>
<div id="rs" class="mt-4 grid gap-4 md:grid-cols-2"></div>`;
}

export function fr() {
  const t = S.q.toLowerCase(), e = $("#rs");
  if (!e) return;
  const L = S.feed.filter((j) => (!S.f || j.kind === S.f) && (!S.acc || j.acc === S.acc) && (j.t + j.emp + j.x).toLowerCase().includes(t));
  L.sort(S.sort === "pay" ? (a, b) => b.pay - a.pay : S.sort === "few" ? (a, b) => a.slots - a.taken - (b.slots - b.taken) : (a, b) => new Date(b.at) - new Date(a.at));
  e.innerHTML = L.map(card).join("") || `<div class="md:col-span-2">${EMPTY("search", "Belum ada tugas yang cocok", "Tugas baru muncul di sini seketika. Biarkan halaman ini terbuka atau longgarkan filter.")}</div>`;
}
