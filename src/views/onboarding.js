import { esc, C, BY, BO, IN, LB, MU, H1 } from "../ui.js";
import { S } from "../state.js";
import { STATUS_W, JENIS } from "../config.js";

const L = (t, h = "") => `<label class="${LB}">${t}</label>${h ? `<p class="${MU} mb-1">${h}</p>` : ""}`;
const ip = (o, k, ph = "") => `<input class="${IN}" placeholder="${ph}" value="${esc(S[o][k])}" oninput="S.${o}.${k}=this.value" autocomplete="off">`;
const opt = (o, k, a) => `<select class="${IN}" onchange="S.${o}.${k}=this.value">${a.map((x) => `<option${x === S[o][k] ? " selected" : ""}>${x}</option>`).join("")}</select>`;

/* sengaja singkat: ambil tugas pertama dalam hitungan detik, bukan mengisi CV */
export function vOnb() {
  const emp = S.role === "employer";
  return `<div class="${C} !p-6 sm:!p-8"><h1 class="${H1}">${emp ? "Kenalkan usahamu" : "Satu langkah lagi"}</h1>
<p class="${MU} mt-1">${emp ? "Tiga isian saja. Pekerja melihat nama dan kota ini di setiap tugasmu." : "Tiga isian saja, lalu kamu bisa langsung mengambil tugas."}</p>
${L(emp ? "Nama usaha atau organisasi" : "Nama")}${ip(emp ? "e" : "w", "name")}
${emp ? `${L("Jenis")}${opt("e", "jenis", JENIS)}` : `${L("Status saat ini")}${opt("w", "status_now", STATUS_W)}`}
${L("Kota")}${ip(emp ? "e" : "w", "kota", "Contoh: Malang")}
<div class="mt-8 flex gap-3">${S.ob ? `<button class="${BO}" onclick="back()">Batal</button>` : ""}<button class="${BY} flex-1 !min-h-12" onclick="saveProfile()">${S.ob ? "Simpan" : emp ? "Simpan dan pasang tugas" : "Simpan dan cari tugas"}</button></div></div>`;
}
