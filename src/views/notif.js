import { esc, C, BO, MU, H1, AG, EMPTY } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";

const KI = { claimed: "bolt", full: "users", released: "refresh", submitted: "clipboard", approved: "wallet", auto: "clock", revision: "pen", expired: "clock" };
export function vNotif() {
  return `<div class="mb-5 flex items-start justify-between gap-3"><div><h1 class="${H1}">Notifikasi</h1><p class="${MU} mt-1">Slot terambil, hasil masuk, dan pembayaran.</p></div>${S.nts.some((n) => !n.read) ? `<button class="${BO} !min-h-10 shrink-0" onclick="readAll()">Tandai dibaca</button>` : ""}</div>
<div class="space-y-3">${S.nts.map((n) => `<button class="relative flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-card ring-1 ring-line transition hover:shadow-lift" onclick="openNote(${n.id})"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-pri">${ico(KI[n.kind] || "bell", "h-5 w-5")}</span><span class="min-w-0 flex-1"><span class="flex items-center gap-2"><b class="truncate text-ink">${esc(n.title)}</b>${n.read ? "" : `<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-yel ring-2 ring-card" aria-label="Baru"></span>`}</span><span class="${MU} block">${esc(n.body || "")}</span><span class="text-xs text-mut">${AG(n.created_at)}</span></span></button>`).join("") || EMPTY("bell", "Belum ada notifikasi", "Kabar slot dan hasil kerja muncul di sini.")}</div>`;
}
