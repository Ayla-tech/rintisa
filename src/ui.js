import { ico } from "./icons.js";
export const $ = (s) => document.querySelector(s),
  esc = (t) =>
    String(t ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    ),
  rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");
export const dl = (n, b) => {
  const d = b ? new Date(b) : new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* Skala tipografi: DH (hero) > SH (judul seksi) > H1 (judul halaman) > H2 (judul kartu) > teks 14px > MU (keterangan) */
export const DH =
    "text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]",
  SH =
    "text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl",
  H1 = "text-2xl font-extrabold tracking-tight text-ink",
  H2 = "mb-2 text-base font-bold text-ink";

/* Logo: tunas (rintis = memulai) + nama */
export const MARK = (s = "h-8 w-8") =>
  `<svg class="${s} shrink-0" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#17406a"/><path d="M16 25V15" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M16 16c0-4.2-3.4-6.6-7.6-6.6 0 4.2 2.6 6.9 7.6 6.6z" fill="#fff"/><path d="M16 13c0-4 3.4-6.4 7.6-6.4 0 4-2.6 6.6-7.6 6.4z" fill="#f6b900"/></svg>`;
export const LOGO = `<span class="inline-flex items-center gap-2.5">${MARK()}<b class="text-xl font-extrabold tracking-tight text-ink">Rintisa</b></span>`;

export const C = "mb-4 rounded-2xl bg-card p-5 shadow-card ring-1 ring-line",
  B =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition duration-150 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40",
  BP = B + " bg-pri text-onpri hover:brightness-110",
  BY = B + " bg-yel text-[#0f1c2e] shadow-sm hover:bg-[#ffc933]",
  BO =
    B + " border border-line bg-card text-ink hover:border-pri hover:text-pri",
  BR = B + " border border-bad/40 text-bad hover:bg-bad/10",
  PL =
    "inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-pri",
  OK =
    "inline-flex items-center gap-1 rounded-full bg-okbg px-2.5 py-1 text-xs font-bold text-ok",
  IN =
    "w-full min-h-12 rounded-xl border border-line bg-card px-4 py-3 text-base text-ink placeholder:text-mut/70 focus:border-pri focus:outline-none focus:ring-4 focus:ring-pri/15 sm:text-sm",
  LB = "mt-5 mb-1.5 block text-sm font-semibold text-ink",
  MU = "text-sm text-mut",
  NT = "my-3 rounded-xl border border-line bg-soft/70 p-4 text-sm",
  HD =
    "sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-card/85 backdrop-blur-md";

/* Header dengan lebar konten yang konsisten */
export const HDR = (inner, w = "max-w-6xl", cls = "") =>
  `<header class="${HD} ${cls}"><div class="mx-auto flex ${w} items-center justify-between gap-3 px-4 py-3 sm:px-6">${inner}</div></header>`;

export const KV = (a, b) =>
    `<div class="flex justify-between gap-4 border-b border-line py-3 text-sm last:border-0"><span class="text-mut">${a}</span><b class="text-right font-semibold">${b}</b></div>`,
  IDB = (s) =>
    s === "terverifikasi"
      ? `<span class="${OK}">${ico("shield", "h-3.5 w-3.5")}Identitas terverifikasi</span>`
      : s === "diajukan"
        ? `<span class="${PL}">${ico("clock", "h-3.5 w-3.5")}Identitas sedang dicek</span>`
        : `<span class="${PL}">Identitas belum diverifikasi</span>`;

/* Avatar inisial dengan warna tetap per nama */
const AVC = [
  "bg-sky-100 text-sky-900",
  "bg-amber-100 text-amber-900",
  "bg-emerald-100 text-emerald-900",
  "bg-rose-100 text-rose-900",
  "bg-violet-100 text-violet-900",
];
export const AV = (name, s = "h-12 w-12 text-lg rounded-2xl") => {
  const n = String(name || "?").trim(),
    k = AVC[(n.charCodeAt(0) || 0) % AVC.length];
  return `<span class="grid ${s} shrink-0 place-items-center font-extrabold ${k}">${esc(n[0] || "?").toUpperCase()}</span>`;
};

/* Cincin persentase kecocokan (angka tetap tampil, warna bukan satu-satunya penanda) */
export const RING = (p) => {
  const c = p >= 85 ? "var(--ok)" : p >= 60 ? "var(--pri)" : "var(--mut)";
  return `<span class="relative grid h-14 w-14 shrink-0 place-items-center" role="img" aria-label="${p} persen cocok"><svg class="absolute inset-0 -rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line)" stroke-width="3.5"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" pathLength="100" stroke-dasharray="${p} 100"/></svg><span class="text-[13px] font-extrabold leading-none text-ink">${p}<span class="text-[9px]">%</span></span></span>`;
};

/* Judul kartu berikon */
export const CH = (i, t, extra = "") =>
  `<h3 class="mb-3 flex items-center gap-2.5 text-base font-bold text-ink"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-[18px] w-[18px]")}</span><span class="min-w-0 flex-1">${t}</span>${extra}</h3>`;

export const EMPTY = (i, t, d = "", extra = "") =>
  `<div class="rounded-2xl border border-dashed border-line bg-card px-6 py-10 text-center"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-pri">${ico(i, "h-7 w-7")}</span><p class="mt-4 font-bold text-ink">${t}</p>${d ? `<p class="${MU} mx-auto mt-1 max-w-xs">${d}</p>` : ""}${extra}</div>`;

export const toast = (t) => {
  $("#tst").innerHTML =
    `<div role="status" class="fixed bottom-24 left-1/2 z-50 flex max-w-[92%] -translate-x-1/2 items-center gap-2.5 rounded-xl bg-[#0f1c2e] px-4 py-3 text-sm font-medium text-white shadow-lift lg:bottom-8">${ico("info", "h-4 w-4 text-[#f6b900]")}<span>${esc(t)}</span></div>`;
  setTimeout(() => ($("#tst").innerHTML = ""), 4500);
};
