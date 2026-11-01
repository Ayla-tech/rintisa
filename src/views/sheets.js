import { esc, rp, BY, BO, BR, IN, LB, MU, NT, SHEET, BDG, bname } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { AUTO_HOURS } from "../config.js";

const li = (t) => `<li class="flex gap-2.5"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-okbg text-ok">${ico("check", "h-3 w-3")}</span><span>${t}</span></li>`;

export const vSheet = () => {
  const s = S.sh;
  if (!s) return "";
  if (s.k === "rules")
    return SHEET("Sebelum ambil slot pertamamu", `<ul class="mt-4 space-y-3 text-sm">${li("Slot jadi milikmu seketika dan waktu kerja mulai berjalan. Batasnya tertera di tugas.")}${li("Kamu hanya memegang <b>satu tugas aktif</b>. Kalau tidak jadi, lepas slotnya supaya orang lain bisa mengambil.")}${li("Hasil diterima, kamu dibayar. Kalau pemberi kerja tidak meninjau " + AUTO_HOURS + " jam, hasil <b>diterima otomatis</b>.")}</ul><button class="${BY} mt-6 w-full !min-h-12" onclick="confirmRules('${s.id}')">Mengerti, ambil slot</button>`);
  if (s.k === "badge") {
    const L = s.codes?.length ? s.codes : S.badges.map((b) => b.code);
    return SHEET(s.codes?.length ? "Tugas ini butuh badge" : "Badge", `<p class="${MU} mt-2">Badge adalah bukti kemampuan. Pemegang badge bisa mengambil tugas khusus badge, yang saingannya lebih sedikit.</p><ul class="mt-4 space-y-2.5">${L.map((c) => {
      const own = S.myB.includes(c), b = S.badges.find((x) => x.code === c);
      return `<li class="rounded-xl border border-line p-3.5"><div class="flex items-center justify-between gap-2">${BDG(c, own)}<span class="text-xs font-bold ${own ? "text-ok" : "text-mut"}">${own ? "Sudah kamu punya" : "Belum dimiliki"}</span></div><p class="${MU} mt-1.5">${esc(b?.info || "")}</p></li>`;
    }).join("")}</ul><div class="${NT} flex gap-3">${ico("info", "h-5 w-5 text-pri")}<span>Tes untuk mendapatkan badge sedang disiapkan dan belum bisa dimulai. Sementara itu, ambil tugas yang terbuka untuk semua.</span></div><button class="${BO} w-full" onclick="closeSheet()">Mengerti</button>`);
  }
  if (s.k === "qris") {
    const f = S.jf, t = f.pay * f.slots;
    return SHEET("Tahan dana untuk tugas ini", `<div class="mt-4 grid place-items-center rounded-2xl bg-soft p-6 text-pri">${ico("qr", "h-24 w-24")}<p class="mt-2 text-xs font-bold text-mut">Simulasi QRIS</p></div><div class="mt-4"><div class="flex justify-between py-1 text-sm"><span class="text-mut">${f.slots} orang × ${rp(f.pay)}</span><b>${rp(t)}</b></div><div class="flex justify-between border-t border-line pt-2 text-base"><b>Total ditahan</b><b>${rp(t)}</b></div></div><div class="${NT}">Prototipe: tidak ada uang sungguhan yang berpindah. Dana baru cair ke pekerja setelah kamu menerima hasil.</div><button class="${BY} w-full !min-h-12" ${S.busy ? "disabled" : ""} onclick="confirmPost()">Sudah bayar (simulasi), terbitkan</button>`);
  }
  if (s.k === "revise") {
    const c = S.claims.find((x) => x.id === s.cid), j = S.jobs.find((x) => x.id === c?.jid);
    return SHEET("Minta revisi", `<p class="${MU} mt-2">Sisa kuota revisi: ${j ? j.rev - c.ru : 0} dari ${j?.rev ?? 0}. Waktu kerja pekerja diulang dari awal.</p><label class="${LB} !mt-4" for="rv">Apa yang perlu diperbaiki?</label><textarea id="rv" class="${IN} min-h-[110px]" maxlength="1000" placeholder="Contoh: tolong tambah tangkapan layar halaman terakhir."></textarea><button class="${BY} mt-4 w-full !min-h-12" onclick="doRevise('${s.cid}')">Kirim permintaan revisi</button>`);
  }
  if (s.k === "release")
    return SHEET("Lepas slot ini?", `<p class="${MU} mt-2">Slot dibuka untuk orang lain dan kamu tidak bisa mengambil tugas ini lagi. Setelah mengirim hasil, slot tidak bisa dilepas.</p><div class="mt-5 grid grid-cols-2 gap-3"><button class="${BO}" onclick="closeSheet()">Tidak jadi</button><button class="${BR}" onclick="doRelease('${s.cid}')">Ya, lepas</button></div>`);
  return "";
};
