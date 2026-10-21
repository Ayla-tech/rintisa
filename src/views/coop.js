import {
  $,
  esc,
  rp,
  dl,
  C,
  B,
  BP,
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
  CH,
  EMPTY,
  toast,
} from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { R } from "../router.js";
export const img = (s, a) =>
  s
    ? `<img src="${s}" alt="${a}" class="aspect-[4/3] w-full rounded-xl object-cover">`
    : `<div class="grid aspect-[4/3] w-full place-items-center rounded-xl bg-soft text-sm text-mut"><span class="text-center">${ico("image", "mx-auto mb-2 h-8 w-8")}Belum ada foto</span></div>`;
const pr = (n) => (n.st === "completed" ? 100 : n.lg.at(-1)?.p || 0),
  dpOf = (n) => Math.round((n.b * (n.dp || 30)) / 100 / 1000) * 1000;
const n100 = (n) => n.lg.filter((x) => x.p === 100).length;
export function openCoop(id) {
  S.cp = id;
  S.view = "coopd";
  R();
  scrollTo(0, 0);
}

export function vCoop() {
  const w = S.role === "worker";
  return (
    `<h1 class="${H1}">Kerja Sama</h1><p class="${MU} mb-5 mt-1">Proyek yang sudah disepakati kedua pihak.</p><div class="space-y-3">` +
    (S.cps
      .map(
        (n) =>
          `<button class="block w-full rounded-2xl bg-card p-4 text-left shadow-card ring-1 ring-line transition hover:shadow-lift sm:p-5" onclick="openCoop('${n.id}')"><div class="flex items-start justify-between gap-3"><b class="text-ink">${esc(n.job)}</b><span class="${n.st === "completed" ? OK : PL}">${n.st === "completed" ? "Selesai" : n100(n) > n.rev ? "Menunggu ditinjau" : "Dikerjakan"}</span></div><p class="${MU} mt-1">${esc(w ? n.who : n.title)} · ${rp(n.b)}</p><p class="${MU} mt-0.5 flex items-center gap-1.5">${ico("calendar", "h-4 w-4")}Deadline ${dl(n.d, n.at)}</p><div class="mt-4 h-2 overflow-hidden rounded-full bg-soft"><div class="h-full rounded-full bg-pri" style="width:${pr(n)}%"></div></div><p class="${MU} mt-1.5">${pr(n)}% selesai</p></button>`,
      )
      .join("") ||
      EMPTY(
        "briefcase",
        "Belum ada kerja sama",
        "Setujui kontrak di chat untuk memulai.",
      )) +
    "</div>"
  );
}

const hasil = (x) =>
  `${x.f ? `<a class="${BO} mt-2 w-full" href="${x.f}" target="_blank" rel="noopener" download="${esc(x.fn || "hasil-kerja")}">${ico("download", "h-4 w-4")}Unduh ${esc(x.fn || "file hasil")}</a>` : ""}${x.l ? `<a class="${BO} mt-2 w-full" href="${esc(x.l)}" target="_blank" rel="noopener noreferrer">${ico("link", "h-4 w-4")}Buka tautan hasil</a>` : ""}`;

export function vCoopD() {
  const n = S.nt.find((x) => x.id === S.cp);
  if (!n) {
    S.view = "main";
    return vCoop();
  }
  const w = S.role === "worker",
    done = n.st === "completed",
    l = n.lg.at(-1),
    p = pr(n),
    left = n.rv - n.rev,
    dp = dpOf(n),
    delivered = n100(n) > n.rev && !done,
    revising = n.rev > 0 && n100(n) <= n.rev && !done,
    dv = n.lg.filter((x) => x.p === 100).at(-1),
    stp = (i, t, d) =>
      `<div class="flex-1 text-center text-xs ${d ? "font-bold text-ink" : "text-mut"}"><b class="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-full ${d ? "bg-ok text-white" : "bg-soft text-mut"}">${d ? ico("check", "h-4 w-4") : i}</b>${t}</div>`;
  return `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="S.view='main';R()">${ico("back", "h-4 w-4")}Kembali</button>
<div class="${C}"><div class="flex items-start justify-between gap-2"><div><h2 class="${H1}">${esc(n.job)}</h2><p class="${MU}">${esc(w ? n.who : n.title)}</p></div><span class="${done ? OK : PL}">${done ? "Selesai" : delivered ? "Menunggu ditinjau" : "Dikerjakan"}</span></div>
<div class="my-4 flex">${stp(1, "Disepakati", 1)}${stp(2, "Dikerjakan", 1)}${stp(3, "Diserahkan", delivered || done)}${stp(4, "Selesai", done)}</div>
<div class="${NT} flex items-center gap-3">${ico("calendar", "h-5 w-5 text-pri")}<span>Deadline <b>${dl(n.d, n.at)}</b></span></div><div class="flex gap-2"><button class="${BO} flex-1" onclick="S.kt='${n.id}';S.view='kontrak';R();scrollTo(0,0)">Surat perjanjian</button><button class="${BO} flex-1" onclick="openChat('${n.id}')">Chat</button></div></div>

<div class="${C}">${CH("package", "Hasil kerja")}${dv ? `<p class="${MU}">Diserahkan ${dv.d}${dv.n ? " · " + esc(dv.n) : ""}</p><div class="mt-1 flex flex-col">${hasil(dv)}</div>` : `<p class="${MU}">Belum diserahkan.</p>`}
${revising && w ? `<div class="${NT}"><b>Pemberi kerja meminta revisi.</b> Baca catatannya di chat, perbaiki, lalu kirim hasil revisi di bawah.</div>` : ""}
${delivered && w ? `<div class="${NT}">Hasil sudah terkirim. Menunggu pemberi kerja meninjau.</div>` : ""}
${delivered && !w ? `<div class="mt-4 grid gap-2"><button class="${BY} w-full" onclick="acceptWork()">${ico("check", "h-4 w-4")}Terima hasil dan cairkan sisa dana</button><button class="${BO} w-full" ${left <= 0 ? "disabled" : ""} onclick="requestRevision()">Minta revisi (sisa ${Math.max(left, 0)})</button>${left <= 0 ? `<p class="${MU}">Kuota revisi habis, tombol terkunci otomatis.</p>` : ""}</div>` : ""}
${!delivered && !w && !done ? `<p class="${MU} mt-3">Tombol terima dan revisi muncul setelah pekerja menyerahkan hasil.</p>` : ""}
${done ? `<div class="${NT}">Proyek selesai. Karya ini masuk portofolio terverifikasi pekerja.</div>` : ""}
${w && !done && !delivered ? `<h4 class="mb-1 mt-5 font-bold">Serahkan hasil kerja</h4><p class="${MU}">Unggah file (gambar, PDF, zip, dokumen, video, maks 10 MB) dan/atau tempel tautan hasil.</p><input id="df" type="file" class="${IN} mt-2"><label class="${LB}">Atau tautan hasil (Drive, Canva, dll)</label><input id="dl" class="${IN}" placeholder="https://..."><label class="${LB}">Catatan untuk pemberi kerja</label><textarea id="dn" class="${IN} min-h-[72px]" placeholder="Hasil sudah sesuai brief, file sudah siap pakai."></textarea><button id="db" class="${BY} mt-3 w-full" onclick="postDelivery()">Kirim hasil kerja</button>` : ""}</div>

<div class="${C}">${CH("camera", "Bukti progres")}${img(l?.i, "Bukti progres terbaru")}<p class="${MU} mt-3">${p}% selesai</p><div class="h-3 overflow-hidden rounded-full bg-soft"><div class="h-full rounded-full bg-pri" style="width:${p}%"></div></div>
<h4 class="mb-2 mt-5 font-bold">Riwayat</h4>${
    n.lg
      .slice()
      .reverse()
      .map(
        (x) =>
          `<div class="relative mb-3 ml-1.5 border-l-2 border-line pl-4"><span class="absolute -left-2 top-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-pri"></span><b>${x.p}%${x.p === 100 ? " · hasil diserahkan" : ""}</b> <span class="${MU}">· ${x.d}</span><p class="text-sm">${esc(x.n)}</p></div>`,
      )
      .join("") || `<p class="${MU}">Belum ada riwayat.</p>`
  }
${w && !done && !delivered && p < 100 ? `<h4 class="mb-1 mt-5 font-bold">Unggah foto progres</h4><input id="pf" type="file" accept="image/*" class="${IN}"><label class="${LB}">Progres (%), sebelumnya ${p}%</label><input id="pp" type="number" min="${p + 1}" max="99" value="${Math.min(99, p + 20)}" class="${IN}"><label class="${LB}">Catatan</label><textarea id="pn" class="${IN} min-h-[72px]" placeholder="Apa yang sudah dikerjakan?"></textarea><button id="pb" class="${BP} mt-3" onclick="postProgress()">Unggah bukti</button>` : ""}</div>

<div class="${C}">${CH("refresh", "Maksimal revisi")}<div class="my-2 flex gap-2">${Array.from({ length: n.rv }, (_, i) => `<i class="h-7 w-7 rounded-full border-2 border-pri ${i < n.rev ? "bg-pri" : ""}"></i>`).join("") || `<span class="${MU}">Tanpa revisi</span>`}</div><p class="${MU}">Terpakai ${n.rev} dari ${n.rv} sesuai kontrak.</p></div>

<div class="${C}">${CH("wallet", "Pembayaran")}<p class="${MU}">Dana ditahan pihak ketiga (Rintisa Escrow), bukan oleh pemberi kerja atau pekerja.</p><div class="my-4 flex">${stp(1, "Dana ditahan", 1)}${stp(2, "DP cair", 1)}${stp(3, "Pelunasan", done)}</div>
<table class="w-full text-sm"><tr class="border-b border-line"><td class="py-2">Honor total</td><td class="text-right font-bold">${rp(n.b)}</td></tr><tr class="border-b border-line"><td class="py-2">DP ${n.dp || 30}% (sudah cair)</td><td class="text-right font-bold">${rp(dp)}</td></tr><tr><td class="py-2">Sisa ${done ? "(sudah cair)" : "(ditahan)"}</td><td class="text-right font-bold">${rp(n.b - dp)}</td></tr></table></div>`;
}
