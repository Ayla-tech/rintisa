import { esc, rp, B, BY, PL, OK, MU, H1, CARD, AG, TK, CI, SLOT, EMPTY } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { live, jobOf } from "../data.js";

export const STL = { working: "Dikerjakan", submitted: "Menunggu ditinjau", revision: "Perlu revisi", approved: "Selesai · dibayar", released: "Dilepas", expired: "Waktu habis" };
export const stChip = (s) => `<span class="${s === "approved" ? OK : PL} shrink-0">${STL[s] || s}</span>`;
export const dur = (ms) => {
  const s = Math.max(1, (ms / 1e3) | 0);
  return s < 60 ? s + " detik" : s < 3600 ? ((s / 60) | 0) + " menit" : s < 86400 ? ((s / 3600) | 0) + " jam" : ((s / 86400) | 0) + " hari";
};
export const jobState = (j) => (j.st === "closed" ? "Ditutup" : !live(j) ? "Habis waktu" : j.taken >= j.slots ? "Penuh" : "Tayang");
export const firstClaim = (j) => {
  const t = S.claims.filter((c) => c.jid === j.id).map((c) => +new Date(c.at));
  return t.length ? "Slot pertama terambil dalam " + dur(Math.min(...t) - new Date(j.at)) : "";
};

const wRow = (c) => {
  const j = jobOf(c);
  return `<button class="${CARD} block w-full text-left" onclick="openClaim('${c.id}')"><div class="flex items-start gap-3">${CI(j?.kind)}<div class="min-w-0 flex-1"><b class="line-clamp-2 text-ink">${esc(j?.t || "Tugas")}</b><p class="${MU} truncate">${esc(j?.emp || "")} · ${rp(j?.pay || 0)}</p></div>${stChip(c.st)}</div>${c.st === "working" || c.st === "revision" ? `<p class="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ink">${ico("clock", "h-4 w-4 text-pri")}Sisa waktu ${TK(c.due)}</p>` : `<p class="${MU} mt-2">${AG(c.dec || c.sub || c.at)}</p>`}</button>`;
};

export function vMine() {
  if (S.role === "worker") {
    const A = S.claims.filter((c) => c.st === "working" || c.st === "revision" || c.st === "submitted"), H = S.claims.filter((c) => !A.includes(c));
    return `<h1 class="${H1}">Tugasku</h1><p class="${MU} mb-5 mt-1">Tugas aktif dan riwayat. Kamu bisa memegang satu tugas aktif sekaligus.</p>
${A.length ? `<div class="space-y-3">${A.map(wRow).join("")}</div>` : EMPTY("bolt", "Belum ada tugas aktif", "Ambil slot pertamamu. Yang tercepat yang dapat.", `<button class="${BY} mt-5" onclick="goTab('feed')">Lihat tugas</button>`)}
${H.length ? `<h2 class="mb-3 mt-8 text-lg font-extrabold text-ink">Riwayat</h2><div class="space-y-3">${H.map(wRow).join("")}</div>` : ""}`;
  }
  const L = S.jobs;
  return `<div class="mb-5 flex items-start justify-between gap-3"><div><h1 class="${H1}">Tugas saya</h1><p class="${MU} mt-1">Pantau slot yang terisi dan tinjau hasil.</p></div><button class="${BY} shrink-0" onclick="goTab('post')">${ico("plus", "h-4 w-4")}Pasang</button></div>
<div class="space-y-3">${L.map((j) => {
    const cl = S.claims.filter((c) => c.jid === j.id), rv = cl.filter((c) => c.st === "submitted").length, f = firstClaim(j);
    return `<article class="${CARD}"><button class="block w-full text-left" onclick="openJob('${j.id}')"><div class="flex items-start gap-3">${CI(j.kind)}<div class="min-w-0 flex-1"><b class="line-clamp-2 text-ink">${esc(j.t)}</b><p class="${MU}">${rp(j.pay)} × ${j.slots} orang · ${AG(j.at)}</p></div><span class="${jobState(j) === "Tayang" ? OK : PL} shrink-0">${jobState(j)}</span></div><div class="mt-3">${SLOT(j)}</div>${f ? `<p class="${MU} mt-2 flex items-center gap-1.5">${ico("bolt", "h-4 w-4 text-pri")}${f}</p>` : ""}</button>${rv ? `<button class="${BY} mt-3 w-full" onclick="openJob('${j.id}')">${rv} hasil menunggu ditinjau</button>` : ""}</article>`;
  }).join("") || EMPTY("briefcase", "Belum ada tugas", "Pasang tugas pertamamu. Cukup satu menit.", `<button class="${BY} mt-5" onclick="goTab('post')">${ico("plus", "h-4 w-4")}Pasang tugas</button>`)}</div>`;
}
