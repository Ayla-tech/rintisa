import {
  $,
  esc,
  rp,
  dl,
  C,
  BY,
  BO,
  BR,
  PL,
  IN,
  LB,
  MU,
  NT,
  H1,
  H2,
  KV,
  CH,
  toast,
} from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { R } from "../router.js";
import { sb } from "../supabase.js";
import { loadAll } from "../data.js";
const dpOf = (b, p) => Math.round((b * p) / 100 / 1000) * 1000;
export function vKontrak() {
  const k = S.nt.find((x) => x.id === S.kt);
  if (!k) {
    S.view = "main";
    return "";
  }
  const w = S.role === "worker",
    dp = k.dp || 30;
  return `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="S.view='main';R()">${ico("back", "h-4 w-4")}Kembali ke kerja sama</button><div class="${C}">${CH("contract", "Surat perjanjian")}<div class="mt-2">${KV("Pekerjaan", esc(k.job))}${KV("Pemberi kerja", esc(w ? k.who : S.e.name))}${KV("Pekerja", esc(w ? S.w.name : k.title))}${KV("Honor total", rp(k.b))}${KV("DP untuk pekerja (" + dp + "%)", rp(dpOf(k.b, dp)))}${KV("Deadline", dl(k.d, k.at))}${KV("Maksimal revisi", k.rv + "x")}${KV("Penahan dana", "Pihak ketiga")}</div><div class="${NT} flex gap-3">${ico("info", "h-5 w-5 text-pri")}<span>Pembatalan sepihak tidak mendapat pengembalian dana.</span></div></div>`;
}
export function contractCard(n, w) {
  const dp = n.dp || 30;
  if (S.edit && !n.dec)
    return `<div class="${C}">${CH("pen", "Ubah surat perjanjian")}<p class="${MU}">Setelah diubah, persetujuan pihak lain direset dan kedua pihak perlu setuju lagi.</p><label class="${LB}">Honor total (Rp 15.000 – 300.000)</label><input id="eb" type="number" class="${IN}" value="${n.b}"><label class="${LB}">DP untuk pekerja</label><select id="ep" class="${IN}">${[20, 30, 50].map((p) => `<option value="${p}"${p === dp ? " selected" : ""}>${p}%</option>`).join("")}</select><label class="${LB}">Tenggat (hari)</label><input id="ed" type="number" min="1" max="60" class="${IN}" value="${n.d}"><label class="${LB}">Maksimal revisi (0 sampai 5)</label><input id="er" type="number" min="0" max="5" class="${IN}" value="${n.rv}"><div class="mt-4 flex gap-2"><button class="${BY} flex-1" onclick="saveEdit()">Simpan perubahan</button><button class="${BO}" onclick="S.edit=false;R()">Batal</button></div></div>`;
  const me = w ? n.wo : n.eo,
    ok = me === n.v,
    pn = w ? "pemberi kerja" : "pekerja",
    st = (l, v) =>
      `<p class="flex items-center gap-2 text-sm"><span class="grid h-6 w-6 place-items-center rounded-full ${v === n.v ? "bg-okbg text-ok" : "bg-soft text-mut"}">${ico(v === n.v ? "check" : "clock", "h-3.5 w-3.5")}</span>${l}: <b>${v === n.v ? "sudah setuju" : "belum setuju"}</b></p>`;
  const act = n.dec
    ? `<div class="${NT}">Kedua pihak sudah setuju. Kerja sama ada di tab Kerja Sama.</div>`
    : S.cf
      ? `<div class="${NT}">Yakin menolak? Chat ini akan ditutup.</div><div class="flex gap-2"><button class="${BR} flex-1" onclick="decide('no')">Ya, tolak</button><button class="${BO} flex-1" onclick="S.cf=false;R()">Batal</button></div>`
      : `<div class="mt-4 space-y-2">${st("Pekerja", n.wo)}${st("Pemberi kerja", n.eo)}<p class="${MU} mt-1">Kerja sama baru mulai setelah kedua pihak setuju pada versi terbaru.</p></div><div class="mt-4 flex flex-wrap gap-2">${ok ? `<button class="${BO} flex-1" onclick="decide('undo')">Tarik persetujuan</button>` : `<button class="${BY} flex-1" onclick="decide('ok')">Setuju</button>`}<button class="${BO} flex-1" onclick="S.edit=true;R()">Ubah isi</button><button class="${BR} flex-1" onclick="S.cf=true;R()">Tolak</button></div>${ok ? `<div class="${NT}">Kamu sudah setuju. Menunggu ${pn}.</div>` : ""}`;
  return `<div class="${C}">${CH("contract", "Surat perjanjian", n.v > 1 ? `<span class="${PL}">Revisi ke-${n.v - 1}</span>` : "")}<div class="mt-2">${KV("Pekerjaan", esc(n.job))}${KV(w ? "Pemberi kerja" : "Pekerja", esc(w ? n.who : n.title))}${KV("Honor total", rp(n.b))}${KV("DP " + dp + "%", rp(dpOf(n.b, dp)))}${KV("Deadline", dl(n.d, n.at))}${KV("Maksimal revisi", n.rv + "x")}${KV("Penahan dana", "Pihak ketiga")}</div>${act}</div>`;
}
export async function saveEdit() {
  const n = S.nt.find((x) => x.id === S.ch),
    b = +$("#eb").value,
    p = +$("#ep").value,
    d = +$("#ed").value,
    r = +$("#er").value;
  if (!(b >= 15000 && b <= 300000))
    return toast("Honor harus antara Rp 15.000 dan Rp 300.000.");
  if (!(d >= 1 && d <= 60)) return toast("Tenggat 1 sampai 60 hari.");
  if (!(r >= 0 && r <= 5)) return toast("Revisi harus antara 0 dan 5.");
  if (b === n.b && p === (n.dp || 30) && d === n.d && r === n.rv) {
    S.edit = false;
    R();
    return toast("Tidak ada perubahan.");
  }
  const { error } = await sb
    .from("matches")
    .update({ budget: b, dp_pct: p, days: d, max_revisions: r })
    .eq("id", n.id);
  if (error) return toast(error.message);
  S.edit = false;
  await loadAll();
  R();
}
