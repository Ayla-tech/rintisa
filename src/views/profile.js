import { esc, rp, C, BO, BR, PL, MU, KV, CH, AV, BDG, H1 } from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { earned } from "../data.js";

const stat = (a, b) => `<div class="rounded-xl bg-soft p-3 text-center"><b class="block text-sm text-ink">${a}</b><span class="text-[11px] text-mut">${b}</span></div>`;
const head = (o, chips, stats) => `<div class="mb-4 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-line"><div class="relative h-24 bg-gradient-to-br from-navy via-[#17406a] to-navy2"><div class="dots absolute inset-0"></div></div><div class="px-5 pb-5"><div class="relative -mt-9 w-fit rounded-3xl border-4 border-card">${AV(o.name, "h-[72px] w-[72px] text-3xl rounded-[1.25rem]")}</div><h1 class="${H1} mt-3">${esc(o.name)}</h1><div class="mt-2 flex flex-wrap gap-2">${chips.filter(Boolean).map((c) => `<span class="${PL}">${esc(c)}</span>`).join("")}</div>${stats ? `<div class="mt-4 grid grid-cols-3 gap-2">${stats}</div>` : ""}</div></div>`;
const foot = `<div class="flex gap-2"><button class="${BO}" onclick="nav({scr:'onb'})">${ico("pen", "h-4 w-4")}Ubah profil</button><button class="${BR}" onclick="logout()">${ico("logout", "h-4 w-4")}Keluar</button></div>`;

export function vMe() {
  if (S.role === "employer") {
    const j = S.jobs, ok = S.claims.filter((c) => c.st === "approved").length;
    return head(S.e, [S.e.jenis, S.e.kota], stat(j.length, "tugas dipasang") + stat(S.claims.length, "slot diambil") + stat(ok, "selesai")) + foot;
  }
  const n = S.claims.filter((c) => c.st === "approved").length;
  return head(S.w, [S.w.status_now, S.w.kota], stat(rp(earned()), "total diterima") + stat(n, "tugas selesai") + stat(S.myB.length, "badge")) +
    `<div class="${C}">${CH("award", "Badge")}${S.myB.length ? `<div class="flex flex-wrap gap-2">${S.myB.map((b) => BDG(b)).join("")}</div>` : `<p class="${MU}">Belum ada badge. Kamu tetap bisa mengambil semua tugas yang terbuka untuk semua orang.</p>`}<button class="${BO} mt-4 w-full" onclick="S.sh={k:'badge'};R()">Lihat semua badge dan cara mendapatkannya</button></div>
<div class="${C}">${CH("wallet", "Saldo")}${KV("Total diterima", rp(earned()))}<p class="${MU} mt-2">Pencairan ke e-wallet atau rekening belum tersedia di prototipe ini.</p></div>` + foot;
}
