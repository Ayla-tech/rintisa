import { ico } from "./icons.js";
import { BRAND, CAT } from "./config.js";
import { S } from "./state.js";

const MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const $ = (s) => document.querySelector(s),
  esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => MAP[c]),
  rp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

/* waktu relatif. Elemen ber-atribut data-a / data-t diperbarui tiap detik oleh tick() di main.js */
export const ago = (t) => {
  const s = Math.max(0, ((Date.now() - new Date(t)) / 1e3) | 0);
  return s < 60 ? "baru saja" : s < 3600 ? ((s / 60) | 0) + " menit lalu" : s < 86400 ? ((s / 3600) | 0) + " jam lalu" : ((s / 86400) | 0) + " hari lalu";
};
export const left = (t) => {
  const ms = new Date(t) - Date.now();
  if (ms <= 0) return "waktu habis";
  const m = (ms / 6e4) | 0, h = (m / 60) | 0;
  return h >= 48 ? ((h / 24) | 0) + " hari" : h >= 1 ? h + " j " + (m % 60) + " m" : m >= 1 ? m + " m " + (((ms / 1e3) | 0) % 60) + " d" : ((ms / 1e3) | 0) + " d";
};
export const AG = (t) => `<span data-a="${new Date(t).getTime()}">${ago(t)}</span>`;
export const TK = (t, c = "") => `<b data-t="${new Date(t).getTime()}" class="${c}">${left(t)}</b>`;
export const tick = () => {
  document.querySelectorAll("[data-t]").forEach((e) => (e.textContent = left(+e.dataset.t)));
  document.querySelectorAll("[data-a]").forEach((e) => (e.textContent = ago(+e.dataset.a)));
};

export const DH = "text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]",
  SH = "text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl",
  H1 = "text-2xl font-extrabold tracking-tight text-ink";

export const MARK = (s = "h-8 w-8") =>
  `<svg class="${s} shrink-0" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0f2f50"/><path d="M18.5 4 8 18h7l-1.5 10L24 14h-7z" fill="#f6b900"/></svg>`;
export const LOGO = `<span class="inline-flex items-center gap-2.5">${MARK()}<b class="text-xl font-extrabold tracking-tight text-ink">${BRAND.name}</b></span>`;

export const C = "mb-4 rounded-2xl bg-card p-5 shadow-card ring-1 ring-line",
  B = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition duration-150 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40",
  BP = B + " bg-pri text-onpri hover:brightness-110",
  BY = B + " bg-yel text-[#0f1c2e] shadow-sm hover:bg-[#ffc933]",
  BO = B + " border border-line bg-card text-ink hover:border-pri hover:text-pri",
  BR = B + " border border-bad/40 text-bad hover:bg-bad/10",
  PL = "inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-pri",
  OK = "inline-flex items-center gap-1 rounded-full bg-okbg px-2.5 py-1 text-xs font-bold text-ok",
  IN = "w-full min-h-12 rounded-xl border border-line bg-card px-4 py-3 text-base text-ink placeholder:text-mut/70 focus:border-pri focus:outline-none focus:ring-4 focus:ring-pri/15 sm:text-sm",
  LB = "mt-5 mb-1.5 block text-sm font-semibold text-ink",
  MU = "text-sm text-mut",
  NT = "my-3 rounded-xl border border-line bg-soft/70 p-4 text-sm",
  CARD = "rounded-2xl bg-card p-4 shadow-card ring-1 ring-line transition hover:shadow-lift sm:p-5",
  HD = "sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-card/85 backdrop-blur-md";

export const HDR = (inner, w = "max-w-6xl", cls = "") =>
  `<header class="${HD} ${cls}"><div class="mx-auto flex ${w} items-center justify-between gap-3 px-4 py-3 sm:px-6">${inner}</div></header>`;

export const KV = (a, b) => `<div class="flex justify-between gap-4 border-b border-line py-3 text-sm last:border-0"><span class="text-mut">${a}</span><b class="text-right font-semibold">${b}</b></div>`;

const AVC = ["bg-sky-100 text-sky-900", "bg-amber-100 text-amber-900", "bg-emerald-100 text-emerald-900", "bg-rose-100 text-rose-900", "bg-violet-100 text-violet-900"];
export const AV = (name, s = "h-12 w-12 text-lg rounded-2xl") => {
  const n = String(name || "?").trim();
  return `<span class="grid ${s} shrink-0 place-items-center font-extrabold ${AVC[(n.charCodeAt(0) || 0) % AVC.length]}">${esc(n[0] || "?").toUpperCase()}</span>`;
};
export const CI = (k) => `<span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-soft text-pri">${ico(CAT[k]?.[1] || "grid", "h-6 w-6")}</span>`;

export const CH = (i, t, extra = "") =>
  `<h3 class="mb-3 flex items-center gap-2.5 text-base font-bold text-ink"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-[18px] w-[18px]")}</span><span class="min-w-0 flex-1">${t}</span>${extra}</h3>`;

export const EMPTY = (i, t, d = "", extra = "") =>
  `<div class="rounded-2xl border border-dashed border-line bg-card px-6 py-10 text-center"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-pri">${ico(i, "h-7 w-7")}</span><p class="mt-4 font-bold text-ink">${t}</p>${d ? `<p class="${MU} mx-auto mt-1 max-w-xs">${d}</p>` : ""}${extra}</div>`;

/* penanda sisa slot: angka selalu tampil, warna hanya penguat */
export const SLOT = (j) => {
  const r = j.slots - j.taken, hot = r <= Math.max(1, Math.ceil(j.slots * 0.2));
  return `<div><div class="flex justify-between text-xs"><b class="${hot ? "text-bad" : "text-ink"}">${r > 0 ? "Sisa " + r + " slot" : "Penuh"}</b><span class="text-mut">${j.taken} dari ${j.slots} terambil</span></div><div class="mt-1 h-2 overflow-hidden rounded-full bg-soft" role="progressbar" aria-valuemin="0" aria-valuemax="${j.slots}" aria-valuenow="${j.taken}"><div class="h-full rounded-full ${hot ? "bg-bad" : "bg-pri"}" style="width:${(j.taken / j.slots) * 100}%"></div></div></div>`;
};

export const bname = (c) => S.badges.find((b) => b.code === c)?.name || c;
export const BDG = (c, own) =>
  `<span class="${own === false ? PL + " !bg-transparent !text-mut ring-1 ring-line" : PL}">${ico(own === false ? "lock" : "award", "h-3.5 w-3.5")}${esc(bname(c))}</span>`;

/* lembar bawah (bottom sheet) */
export const SHEET = (title, body) =>
  `<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="${esc(title)}" onclick="if(event.target===this)closeSheet()"><div class="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] shadow-lift sm:rounded-3xl"><div class="flex items-start justify-between gap-3"><h2 class="text-lg font-extrabold text-ink">${title}</h2><button class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-soft text-ink" aria-label="Tutup" onclick="closeSheet()">${ico("x", "h-5 w-5")}</button></div>${body}</div></div>`;

export const toast = (t) => {
  $("#tst").innerHTML = `<div role="status" class="fixed bottom-24 left-1/2 z-[60] flex max-w-[92%] -translate-x-1/2 items-center gap-2.5 rounded-xl bg-[#0f1c2e] px-4 py-3 text-sm font-medium text-white shadow-lift lg:bottom-8">${ico("info", "h-4 w-4 text-[#f6b900]")}<span>${esc(t)}</span></div>`;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => ($("#tst").innerHTML = ""), 4500);
};
