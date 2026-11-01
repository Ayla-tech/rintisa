import { esc, rp, C, BY, BO, PL, OK, MU, NT, KV, CH, CI, SLOT, BDG, TK, AG, EMPTY } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { CAT, AUTO_HOURS } from "../config.js";
import { live } from "../data.js";
import { cta, accChip, canTake } from "./feed.js";
import { stChip, jobState, firstClaim } from "./mine.js";

const stat = (a, b) => `<div class="rounded-xl bg-soft p-3"><span class="text-[11px] text-mut">${a}</span><b class="block text-sm text-ink">${b}</b></div>`;
const back = `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="back()">${ico("back", "h-4 w-4")}Kembali</button>`;

export function vJob() {
  const j = S.jx;
  if (!j || j.id !== S.jid) return `${back}<div class="${C}"><p class="${MU}">Memuat…</p></div>`;
  const w = S.role === "worker", mine = j.eid === S.me, mc = S.claims.find((c) => c.jid === j.id && w), d = S.det[j.id];
  const head = `${back}<div class="${C}"><div class="flex items-start gap-3">${CI(j.kind)}<div class="min-w-0 flex-1"><h1 class="text-xl font-extrabold leading-snug tracking-tight text-ink">${esc(j.t)}</h1><p class="${MU}">${esc(j.emp)} · ${CAT[j.kind]?.[0] || ""} · ${AG(j.at)}</p></div></div>
<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">${stat("Bayaran per orang", rp(j.pay))}${stat("Batas waktu kerja", j.hrs + " jam")}${stat("Tayang sampai", live(j) ? TK(j.closes) : jobState(j))}${stat("Revisi", "maks. " + j.rev + "×")}</div>
<div class="mt-4">${SLOT(j)}</div><div class="mt-3 flex flex-wrap gap-1.5">${accChip(j)}${j.bd.map((b) => BDG(b, w ? S.myB.includes(b) : undefined)).join("")}</div></div>`;
  const desc = `<div class="${C}">${CH("clipboard", "Tentang tugas")}<p class="whitespace-pre-line break-words text-sm leading-relaxed">${esc(j.x)}</p></div>`;
  if (w) {
    const open = live(j) && j.taken < j.slots;
    return `${head}${mc ? `<button class="${BY} mb-4 w-full !min-h-12" onclick="openClaim('${mc.id}')">Buka tugasku${ico("arrow", "h-4 w-4")}</button>` : open ? `<div class="mb-4">${cta(j)}</div>` : `<div class="${NT}">Tugas ini ${j.taken >= j.slots ? "sudah penuh" : "sudah ditutup"}. Lihat tugas lain di daftar.</div>`}${desc}
<div class="${C}">${CH("lock", "Instruksi dan tautan")}<p class="${MU}">Terbuka setelah kamu mengambil slot, supaya hanya pemegang slot yang melihatnya.</p></div>
<div class="${C}">${CH("shield", "Aturan main")}${KV("Slot", "Siapa tercepat yang dapat")}${KV("Tugas aktif", "Satu pada satu waktu")}${KV("Lepas slot", "Boleh sebelum kirim hasil")}${KV("Dibayar", "Saat hasil diterima")}${KV("Tidak ditinjau", "Otomatis diterima " + AUTO_HOURS + " jam")}</div>`;
  }
  /* tampilan pemilik tugas */
  const cl = S.claims.filter((c) => c.jid === j.id), f = firstClaim(j);
  const st = jobState(j);
  return `${head}${f ? `<div class="${NT} flex gap-3">${ico("bolt", "h-5 w-5 text-pri")}<span>${f}.</span></div>` : ""}
<div class="mb-4 grid grid-cols-2 gap-2"><button class="${BO}" onclick="repost('${j.id}')">${ico("copy", "h-4 w-4")}Pasang lagi</button>${j.st === "open" ? `<button class="${BO}" onclick="setJobStatus('${j.id}','closed')">${ico("pause", "h-4 w-4")}Tutup tugas</button>` : `<button class="${BO}" onclick="setJobStatus('${j.id}','open')">${ico("refresh", "h-4 w-4")}Buka lagi</button>`}</div>
<div class="${C}">${CH("users", "Pekerja (" + cl.length + ")", `<span class="${st === "Tayang" ? OK : PL}">${st}</span>`)}${cl.length ? `<div class="divide-y divide-line">${cl.map((c) => `<button class="flex w-full items-center justify-between gap-3 py-3 text-left" onclick="openClaim('${c.id}')"><span class="min-w-0"><b class="block truncate text-ink">${esc(c.wn)}</b><span class="${MU}">${esc(c.wk)} · ${AG(c.at)}</span></span>${stChip(c.st)}</button>`).join("")}</div>` : `<p class="${MU}">Belum ada yang mengambil slot. Tugas tayang langsung di daftar pekerja.</p>`}</div>
${desc}
<div class="${C}">${CH("lock", "Instruksi dan tautan (hanya pemegang slot)")}${d ? `<p class="whitespace-pre-line break-words text-sm leading-relaxed">${esc(d.instructions) || "-"}</p>${d.link_url ? `<a class="${BO} mt-3" href="${esc(d.link_url)}" target="_blank" rel="noopener noreferrer">${ico("link", "h-4 w-4")}Buka tautan</a>` : ""}` : `<p class="${MU}">Memuat…</p>`}</div>`;
}
