import { esc, rp, C, BY, BO, BR, BP, PL, OK, IN, LB, MU, NT, CH, AV, BDG, TK, AG, CI } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { AUTO_HOURS } from "../config.js";
import { jobOf } from "../data.js";
import { stChip } from "./mine.js";

const back = `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="back()">${ico("back", "h-4 w-4")}Kembali</button>`;
const STAGE = { working: 2, revision: 2, submitted: 3, approved: 4 };

const stepper = (st) => {
  const n = STAGE[st] || 0;
  return `<div class="my-4 flex">${["Diambil", "Dikerjakan", "Diserahkan", "Dibayar"].map((t, i) => `<div class="flex-1 text-center text-xs ${i < n ? "font-bold text-ink" : "text-mut"}"><b class="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-full ${i < n ? "bg-ok text-white" : "bg-soft text-mut"}">${i < n ? ico("check", "h-4 w-4") : i + 1}</b>${t}</div>`).join("")}</div>`;
};

const result = (c) => {
  if (!c.rl && !c.rp) return "";
  const u = S.urls[c.rp], img = c.rp && /\.jpe?g$/i.test(c.rp);
  return `${img && u ? `<img src="${u}" alt="Hasil kerja" loading="lazy" class="mb-3 max-h-64 w-full rounded-xl object-contain bg-soft">` : ""}<div class="flex flex-col gap-2">${c.rp ? `<a class="${BO}" href="${u || "#"}" target="_blank" rel="noopener" ${u ? "" : 'aria-disabled="true"'}>${ico("download", "h-4 w-4")}Unduh ${esc(c.rn || "file hasil")}</a>` : ""}${c.rl ? `<a class="${BO}" href="${esc(c.rl)}" target="_blank" rel="noopener noreferrer">${ico("link", "h-4 w-4")}Buka tautan hasil</a>` : ""}</div>${c.note ? `<p class="${MU} mt-3">Catatan: ${esc(c.note)}</p>` : ""}`;
};

const chat = () =>
  `<div class="${C}">${CH("chat", "Chat")}<div id="cb" class="flex h-[36vh] min-h-52 max-h-96 flex-col gap-2 overflow-y-auto rounded-xl bg-bg p-3">${S.msgs.map((m) => `<div class="max-w-[85%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2 text-sm ${m.me ? "self-end rounded-br-sm bg-pri text-onpri" : "rounded-bl-sm bg-soft text-ink"}">${esc(m.t)}</div>`).join("") || `<p class="${MU} m-auto text-center">Belum ada pesan. Tanyakan hal yang kurang jelas di sini.</p>`}</div><div class="mt-3 flex gap-2"><input id="ci" class="${IN}" maxlength="1000" placeholder="Tulis pesan" aria-label="Tulis pesan" onkeydown="if(event.key==='Enter')sendMsg()"><button class="${BP} !px-4" aria-label="Kirim" onclick="sendMsg()">${ico("send", "h-5 w-5")}</button></div></div>`;

export function vClaim() {
  const c = S.claims.find((x) => x.id === S.cid), j = c && jobOf(c);
  if (!c || !j) return `${back}<div class="${C}"><p class="${MU}">Memuat…</p></div>`;
  const w = S.role === "worker", d = S.det[c.jid], act = c.st === "working" || c.st === "revision";
  const head = `${back}<div class="${C}"><div class="flex items-start gap-3">${w ? CI(j.kind) : AV(c.wn)}<div class="min-w-0 flex-1"><h1 class="text-xl font-extrabold leading-snug tracking-tight text-ink">${esc(w ? j.t : c.wn)}</h1><p class="${MU}">${w ? esc(j.emp) : esc(j.t) + " · " + esc(c.wk) + (c.ws ? " · " + esc(c.ws) : "")}</p></div>${stChip(c.st)}</div>
${w || !S.wb.some((b) => b.user_id === c.wid) ? "" : `<div class="mt-3 flex flex-wrap gap-1.5">${S.wb.filter((b) => b.user_id === c.wid).map((b) => BDG(b.code)).join("")}</div>`}
${STAGE[c.st] ? stepper(c.st) : `<div class="${NT}">${c.st === "released" ? "Slot ini dilepas." : "Waktu kerja habis, slot dibuka lagi untuk orang lain."}</div>`}
${act ? `<div class="${NT} flex items-center gap-3">${ico("clock", "h-5 w-5 text-pri")}<span>${c.st === "revision" ? "Revisi: " : ""}sisa waktu ${TK(c.due, "text-ink")}</span></div>` : ""}
<div class="mt-1 flex items-center justify-between text-sm"><span class="text-mut">Bayaran</span><b class="text-lg text-ink">${rp(j.pay)}</b></div></div>`;

  const instr = `<div class="${C}">${CH("clipboard", "Instruksi")}${d ? `<p class="whitespace-pre-line break-words text-sm leading-relaxed">${esc(d.instructions) || "Tidak ada instruksi tambahan."}</p>${d.link_url ? `<a class="${BY} mt-3 w-full" href="${esc(d.link_url)}" target="_blank" rel="noopener noreferrer">${ico("link", "h-4 w-4")}Buka tautan tugas</a>` : ""}` : `<p class="${MU}">Memuat…</p>`}</div>`;

  if (w) {
    const form = act ? `<div class="${C}">${CH("upload", c.st === "revision" ? "Kirim hasil revisi" : "Kirim hasil")}<p class="${MU}">Unggah file (gambar, PDF, dokumen, maks. 10 MB) dan/atau tempel tautan hasil.</p><label class="${LB}" for="rf">File</label><input id="rf" type="file" class="${IN}"><label class="${LB}" for="rl">Atau tautan hasil</label><input id="rl" class="${IN}" inputmode="url" placeholder="https://..."><label class="${LB}" for="rn">Catatan (opsional)</label><textarea id="rn" class="${IN} min-h-[72px]" maxlength="500"></textarea><button id="rb" class="${BY} mt-4 w-full !min-h-12" onclick="submitResult()">Kirim hasil</button>${c.st === "working" ? `<button class="${BR} mt-3 w-full" onclick="askRelease('${c.id}')">Lepas slot</button>` : ""}</div>` : "";
    const done = c.st === "submitted" ? `<div class="${C}">${CH("clock", "Menunggu ditinjau")}<p class="${MU}">Otomatis diterima dalam ${TK(new Date(+new Date(c.sub) + AUTO_HOURS * 36e5), "text-ink")} kalau pemberi kerja belum meninjau.</p><div class="mt-3">${result(c)}</div></div>` : c.st === "approved" ? `<div class="${C}">${CH("wallet", "Selesai")}<p class="text-sm"><b class="text-ok">${rp(j.pay)}</b> masuk ke saldomu (simulasi di prototipe).</p><div class="mt-3">${result(c)}</div></div>` : "";
    return head + (act || c.st === "submitted" ? instr : "") + form + done + chat();
  }
  const left = j.rev - c.ru;
  const review = c.st === "submitted" ? `<div class="${C}">${CH("clipboard", "Hasil dari pekerja")}${result(c)}<p class="${MU} mt-3">Jika tidak ditinjau, diterima otomatis dalam ${TK(new Date(+new Date(c.sub) + AUTO_HOURS * 36e5), "text-ink")}.</p><div class="mt-4 grid gap-2"><button class="${BY} !min-h-12" onclick="approve('${c.id}')">${ico("check", "h-4 w-4")}Terima dan cairkan ${rp(j.pay)}</button><button class="${BO}" ${left <= 0 ? "disabled" : ""} onclick="askRevise('${c.id}')">Minta revisi (sisa ${Math.max(left, 0)})</button>${left <= 0 ? `<p class="${MU}">Kuota revisi habis.</p>` : ""}</div></div>` : c.st === "approved" ? `<div class="${C}">${CH("check", "Diterima")}${result(c)}</div>` : act ? `<div class="${NT}">${c.st === "revision" ? "Menunggu pekerja mengirim revisi." : "Pekerja sedang mengerjakan."}</div>` : "";
  return head + review + chat();
}
