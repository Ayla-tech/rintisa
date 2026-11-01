import { esc, C, BY, IN, LB, MU, HDR, H1, LOGO, MARK } from "../ui.js";
import { S } from "../state.js";
import { BRAND } from "../config.js";
import { ico } from "../icons.js";

const PT = [
  ["bolt", "Slot adil", "Dua orang menekan bersamaan, server yang menentukan satu pemenang."],
  ["shield", "Dana aman", "Dana ditahan sampai hasil diterima. Tidak diterima 48 jam, otomatis cair."],
  ["award", "Tugas khusus badge", "Punya badge, buka tugas dengan saingan lebih sedikit."],
];
export const vAuth = () => {
  const reg = S.am === "daftar",
    tab = (k, l) => `<button type="button" role="tab" aria-selected="${S.am === k}" class="flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition ${S.am === k ? "bg-card text-ink shadow-sm" : "text-mut hover:text-ink"}" onclick="S.am='${k}';R()">${l}</button>`,
    role = (k, i, t, d) => {
      const on = S.role === k;
      return `<button type="button" aria-pressed="${on}" class="flex flex-1 flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition ${on ? "border-pri bg-soft" : "border-line hover:border-pri/50"}" onclick="S.role='${k}';R()"><span class="grid h-10 w-10 place-items-center rounded-lg ${on ? "bg-pri text-onpri" : "bg-soft text-pri"}">${ico(i)}</span><b class="text-sm text-ink">${t}</b><span class="text-xs text-mut">${d}</span></button>`;
    };
  return `<div class="min-h-screen lg:grid lg:grid-cols-[1fr_1.1fr]">
<aside class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-navy via-[#17406a] to-navy2 p-12 text-white lg:flex"><div class="dots pointer-events-none absolute inset-0"></div>
<button onclick="back({scr:'landing'})" class="relative inline-flex items-center gap-2.5 self-start">${MARK()}<b class="text-xl font-extrabold">${BRAND.name}</b></button>
<div class="relative"><h2 class="max-w-md text-4xl font-extrabold leading-tight tracking-tight">Tugas kecil, slot terbatas. ${BRAND.tag}</h2><ul class="mt-8 space-y-5">${PT.map(([i, t, d]) => `<li class="flex gap-4"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/12 text-yel">${ico(i, "h-5 w-5")}</span><span><b class="block">${t}</b><span class="text-sm text-blue-100">${d}</span></span></li>`).join("")}</ul></div>
<p class="relative text-xs text-blue-200">© 2026 ${BRAND.name} · Prototipe MVP</p></aside>
<div class="flex min-h-screen flex-col">${HDR(`<button onclick="back({scr:'landing'})" class="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-mut hover:text-ink">${ico("back", "h-4 w-4")}Kembali</button><span class="lg:hidden">${LOGO}</span><span class="w-16"></span>`, "max-w-md", "lg:border-0 lg:bg-transparent")}
<main class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:py-12"><div class="${C} !p-6 sm:!p-8"><div class="flex gap-1 rounded-xl bg-soft p-1" role="tablist">${tab("login", "Masuk")}${tab("daftar", "Daftar")}</div>
<h1 class="${H1} mt-6">${reg ? "Buat akun baru" : "Selamat datang kembali"}</h1>
<p class="${MU} mt-1">${reg ? "Pilih peranmu. Peran tidak bisa diganti nanti." : "Peranmu dikenali otomatis."}</p>
${reg ? `<label class="${LB}">Saya ingin</label><div class="flex gap-3">${role("worker", "bolt", "Cari tugas", "Ambil tugas di waktu luang")}${role("employer", "store", "Pasang tugas", "Butuh dikerjakan cepat")}</div>` : ""}
<label class="${LB}" for="em">Email</label><input class="${IN}" id="em" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" value="${esc(S.em)}" oninput="S.em=this.value">
<label class="${LB}" for="pw">Kata sandi</label><input class="${IN}" id="pw" type="password" placeholder="Minimal 6 karakter" autocomplete="${reg ? "new-password" : "current-password"}" onkeydown="if(event.key==='Enter')doAuth()">
<button id="ab" class="${BY} mt-7 w-full !min-h-12 !text-base" onclick="doAuth()">${reg ? "Daftar gratis" : "Masuk"}</button>
<p class="${MU} mt-5 text-center">${reg ? "Sudah punya akun?" : "Belum punya akun?"} <button class="font-bold text-pri hover:underline" onclick="S.am='${reg ? "login" : "daftar"}';R()">${reg ? "Masuk" : "Daftar gratis"}</button></p></div></main></div></div>`;
};
