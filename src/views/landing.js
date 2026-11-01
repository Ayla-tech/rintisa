import { C, B, BY, BO, MU, SH, MARK, HDR, LOGO } from "../ui.js";
import { S } from "../state.js";
import { BRAND, CAT } from "../config.js";
import { ico } from "../icons.js";

const W = "mx-auto w-full max-w-6xl px-5 sm:px-6";
const EY = "text-sm font-bold uppercase tracking-wider text-pri";

/* ---------- mockup produk (selalu terang, tidak ikut mode gelap) ---------- */
const mcard = (t, e, pay, hot, taken, slots, lock) =>
  `<div class="rounded-2xl bg-white p-3.5 text-slate-900 shadow-lg ring-1 ring-black/5"><div class="flex items-start gap-2.5"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-[#17406a]">${ico(lock ? "table" : "clipboard", "h-5 w-5")}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-bold">${t}</p><p class="truncate text-xs text-slate-500">${e}</p></div><b class="text-base">${pay}</b></div><div class="mt-3 flex justify-between text-xs"><b class="${hot ? "text-[#c0392b]" : ""}">Sisa ${slots - taken} slot</b><span class="text-slate-500">${taken} dari ${slots} terambil</span></div><div class="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full ${hot ? "bg-[#c0392b]" : "bg-[#17406a]"}" style="width:${(taken / slots) * 100}%"></div></div><div class="mt-3 flex h-10 items-center justify-center rounded-xl text-sm font-bold ${lock ? "border border-slate-200 text-slate-600" : "bg-[#f6b900] text-[#0f1c2e]"}">${lock ? ico("lock", "mr-1.5 h-4 w-4") + "Butuh badge Teliti Data" : ico("bolt", "mr-1.5 h-4 w-4", "currentColor") + "Ambil slot"}</div></div>`;
const chipf = (i, t, s, cls) =>
  `<div class="absolute ${cls} flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-slate-900 shadow-xl ring-1 ring-black/5 animate-float"><span class="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f5ee] text-[#1b7f55]">${ico(i, "h-[18px] w-[18px]")}</span><span class="leading-tight"><b class="block text-xs">${t}</b><span class="text-[11px] text-slate-500">${s}</span></span></div>`;
const frame = (inner) => `<div class="rounded-[1.6rem] border border-line bg-soft p-3 sm:p-4"><div class="mx-auto max-w-sm space-y-3">${inner}</div></div>`;
const mFlow = () =>
  frame(`<div class="rounded-2xl bg-white p-4 text-slate-900 shadow-md ring-1 ring-black/5"><div class="flex items-center justify-between"><b>Rekap 30 data stok</b><span class="rounded-full bg-[#e6f5ee] px-2 py-0.5 text-[11px] font-bold text-[#1b7f55]">Diserahkan</span></div><div class="my-4 flex">${["Diambil", "Dikerjakan", "Diserahkan", "Dibayar"].map((t, i) => `<div class="flex-1 text-center text-[11px] ${i < 3 ? "font-bold" : "text-slate-500"}"><b class="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full ${i < 3 ? "bg-[#1b7f55] text-white" : "bg-slate-100 text-slate-500"}">${i < 3 ? ico("check", "h-4 w-4") : i + 1}</b>${t}</div>`).join("")}</div><div class="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">Tidak ditinjau dalam 48 jam: diterima otomatis dan dana cair.</div></div>`);

const step = (n, i, t, d) => `<div class="relative rounded-2xl bg-card p-5 shadow-card ring-1 ring-line"><span class="grid h-10 w-10 place-items-center rounded-full bg-yel font-extrabold text-[#0f1c2e]">${n}</span><span class="absolute right-5 top-5 text-pri/30">${ico(i, "h-7 w-7")}</span><h3 class="mt-4 font-bold text-ink">${t}</h3><p class="${MU} mt-1">${d}</p></div>`;
const feat = (rev, eyebrow, t, d, pts, mock) =>
  `<div class="grid items-center gap-8 md:grid-cols-2 md:gap-14"><div class="${rev ? "md:order-2" : ""}"><p class="${EY}">${eyebrow}</p><h3 class="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">${t}</h3><p class="mt-3 text-base text-mut">${d}</p><ul class="mt-5 space-y-2.5 text-sm font-medium">${pts.map((x) => `<li class="flex gap-2.5"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-okbg text-ok">${ico("check", "h-3 w-3")}</span><span>${x}</span></li>`).join("")}</ul></div><div class="${rev ? "md:order-1" : ""}">${mock}</div></div>`;
const li = (a) => a.map((x) => `<li class="flex gap-2.5"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20">${ico("check", "h-3 w-3")}</span><span>${x}</span></li>`).join("");

const LBT = "rounded-full px-5 py-2.5 text-sm font-bold transition", ON = " bg-pri text-onpri shadow-sm", OFF = " text-mut hover:text-ink";
export const lr = (k) => {
  S.lr = k;
  document.querySelectorAll("[data-lr]").forEach((e) => e.classList.toggle("hidden", e.dataset.lr !== k));
  document.querySelectorAll("[data-lrb]").forEach((b) => {
    const on = b.dataset.lrb === k;
    b.setAttribute("aria-pressed", on);
    b.className = LBT + (on ? ON : OFF);
  });
};
const steps = {
  worker: [
    ["1", "search", "Pantau tugas", "Daftar tugas muncul langsung. Saring berdasarkan jenis, akses, atau bayaran."],
    ["2", "bolt", "Ambil slot", "Satu ketukan. Siapa tercepat yang dapat, server menjaga satu slot satu orang."],
    ["3", "clipboard", "Kerjakan di sela waktu", "Buka instruksi, kerjakan, lalu kirim file atau tautan hasilnya."],
    ["4", "wallet", "Dibayar", "Hasil diterima, uang jajan masuk. Tidak ditinjau 48 jam, otomatis diterima."],
  ],
  employer: [
    ["1", "pen", "Pasang tugas", "Pilih template, isi bayaran dan jumlah orang. Cukup satu menit."],
    ["2", "qr", "Tahan dana", "Dana ditahan sebesar bayaran dikali jumlah orang. Tugas langsung tayang."],
    ["3", "bolt", "Slot terisi", "Pekerja berebut mengambil slot. Kamu dikabari tiap slot terambil."],
    ["4", "check", "Terima hasil", "Tinjau, minta revisi bila perlu, lalu terima. Dana cair ke pekerja."],
  ],
};
const faq = [
  ["Bagaimana kalau banyak orang menekan tombol bersamaan?", "Permintaan diproses server satu per satu. Yang masuk lebih dulu dapat slot, sisanya langsung diberi tahu bahwa slot penuh. Tidak ada slot yang terjual dua kali."],
  ["Berapa tugas yang boleh kuambil sekaligus?", "Satu tugas aktif pada satu waktu, supaya slot tidak ditimbun. Setelah hasil dikirim, kamu bebas mengambil tugas berikutnya sambil menunggu ditinjau."],
  ["Bagaimana kalau aku tidak jadi atau terlambat?", "Lepas slot kapan saja sebelum mengirim hasil. Kalau batas waktu terlewati, slot otomatis dibuka lagi untuk orang lain."],
  ["Kapan aku dibayar?", "Saat pemberi kerja menerima hasilmu. Kalau tidak ditinjau dalam 48 jam, hasil diterima otomatis."],
  ["Apa itu badge?", "Bukti kemampuan. Sebagian tugas hanya bisa diambil pemegang badge tertentu, jadi saingannya lebih sedikit. Tes untuk mendapatkan badge sedang disiapkan."],
  ["Apakah tautan survei saya aman?", "Tautan dan instruksi lengkap hanya terlihat oleh pekerja yang sudah memegang slot, bukan oleh pengunjung biasa."],
  ["Berapa biaya untuk pemberi kerja?", "Kamu menahan dana sebesar bayaran dikali jumlah orang. Biaya layanan belum ditetapkan di prototipe ini."],
  ["Apakah ini sudah memproses uang sungguhan?", "Belum. Ini prototipe MVP: alur pembayaran masih simulasi dan belum terhubung ke penyedia pembayaran."],
];

export const vLand = () => `${HDR(
  `<a href="#top" aria-label="${BRAND.name}, ke atas">${LOGO}</a>
<nav class="hidden items-center gap-1 md:flex" aria-label="Navigasi halaman">${[["#cara", "Cara kerja"], ["#fitur", "Fitur"], ["#faq", "FAQ"]].map(([h, t]) => `<a href="${h}" class="rounded-lg px-3.5 py-2 text-sm font-semibold text-mut transition hover:bg-soft hover:text-ink">${t}</a>`).join("")}</nav>
<div class="flex items-center gap-2">${S.me ? `<button class="${BY} !min-h-10 !px-4" onclick="go('app')">Buka aplikasi</button>` : `<button class="${BO} !min-h-10 !px-4" onclick="login()">Masuk</button><button class="${BY} !min-h-10 !px-4" onclick="start('worker')">Daftar gratis</button>`}</div>`,
)}
<div id="top"></div>
<section class="relative overflow-hidden bg-gradient-to-br from-navy via-[#17406a] to-navy2 text-white"><div class="dots pointer-events-none absolute inset-0"></div><div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"></div>
<div class="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-20"><div>
<span class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20 sm:text-sm">${ico("bolt", "h-4 w-4 text-yel", "currentColor")}Tugas sampingan · mulai Rp 5.000</span>
<h1 class="${"mt-5 text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"}">Tugas kecil, slot terbatas. <span class="text-yel">${BRAND.tag}</span></h1>
<p class="mt-6 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">Pemberi kerja memasang tugas dalam semenit. Pencari kerja mengambil slot di sela waktu luang dan dibayar setelah hasil diterima.</p>
<div class="mt-8 flex flex-col gap-3 sm:flex-row"><button onclick="start('worker')" class="${BY} !min-h-14 !px-7 !text-base">Cari tugas sekarang${ico("arrow", "h-5 w-5")}</button><button onclick="start('employer')" class="${B} border border-white/30 !min-h-14 !px-7 !text-base text-white hover:bg-white/10">Pasang tugas</button></div>
<ul class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">${["Daftar gratis", "Dana ditahan sampai hasil diterima", "Otomatis diterima bila 48 jam tak ditinjau"].map((x) => `<li class="flex items-center gap-2">${ico("check", "h-4 w-4 text-yel")}${x}</li>`).join("")}</ul></div>
<div class="relative mx-auto w-full max-w-[20rem] pb-6 sm:max-w-[22rem]" aria-label="Contoh tampilan aplikasi"><div class="rounded-[2.2rem] border border-white/20 bg-white/10 p-2.5 shadow-2xl backdrop-blur"><div class="rounded-[1.7rem] bg-[#f6f8fb] p-3"><p class="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-slate-500"><span class="live-dot h-2 w-2 rounded-full bg-[#f6b900]"></span>Contoh tampilan · langsung</p><div class="space-y-3">${mcard("Isi survei kebiasaan jajan", "Kedai Senja · 3 menit", "Rp 5.000", 1, 18, 20)}<div class="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5"><div class="h-2.5 w-2/3 rounded-full bg-slate-200"></div><div class="mt-2 h-2 w-1/2 rounded-full bg-slate-200"></div></div></div></div></div>
${chipf("bolt", "Slot terambil", "baru saja", "-right-2 -top-4 sm:-right-10")}${chipf("wallet", "Hasil diterima", "dana cair", "-left-2 bottom-1 sm:-left-10 [animation-delay:-3s]")}</div></div></section>

<section class="border-b border-line bg-card" aria-label="Jaminan"><div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 sm:px-6 md:grid-cols-4">${[["bolt", "Slot adil, dijaga server"], ["lock", "Dana ditahan sampai diterima"], ["clock", "Satu tugas aktif, tidak ada timbunan"], ["award", "Tugas khusus pemegang badge"]].map(([i, t]) => `<div class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-5 w-5")}</span><span class="text-sm font-semibold leading-snug text-ink">${t}</span></div>`).join("")}</div></section>

<section class="py-16 md:py-20"><div class="${W}"><div class="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
<div class="rounded-3xl bg-gradient-to-br from-navy to-navy2 p-8 text-white shadow-lift"><p class="text-sm font-semibold text-blue-100">Pengangguran usia 15–24 tahun</p><p class="mt-2 text-6xl font-extrabold tracking-tight text-yel sm:text-7xl">17,37%</p><div class="mt-6 border-t border-white/20 pt-5"><p class="text-3xl font-extrabold">25,93%</p><p class="text-sm text-blue-100">pekerja Indonesia berstatus paruh waktu, sekitar 38,42 juta orang.</p></div><p class="mt-5 text-xs text-blue-200">Sumber: BPS, Sakernas Mei 2026.</p></div>
<div><p class="${EY}">Kenapa ${BRAND.name} ada</p><h2 class="${SH} mt-2">Banyak yang butuh tambahan uang jajan. Banyak juga yang butuh tugas selesai cepat.</h2><p class="mt-4 text-base text-mut">Bertemunya keduanya sering lambat: harus menunggu balasan, menawar, lalu menebak siapa yang bisa dipercaya. ${BRAND.name} menyederhanakannya jadi satu aturan: tugas tayang, slot terbatas, siapa tercepat yang mengerjakan.</p><button class="${BY} mt-6" onclick="start('worker')">Lihat tugas${ico("arrow", "h-4 w-4")}</button></div></div></div></section>

<section id="cara" class="bg-soft py-16 md:py-20"><div class="${W}"><div class="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"><div><p class="${EY}">Cara kerja</p><h2 class="${SH} mt-2">Empat langkah, tanpa tawar-menawar</h2></div><div class="inline-flex rounded-full bg-card p-1 shadow-card ring-1 ring-line" role="group" aria-label="Pilih peran"><button data-lrb="worker" aria-pressed="${S.lr === "worker"}" class="${LBT}${S.lr === "worker" ? ON : OFF}" onclick="lr('worker')">Pencari kerja</button><button data-lrb="employer" aria-pressed="${S.lr === "employer"}" class="${LBT}${S.lr === "employer" ? ON : OFF}" onclick="lr('employer')">Pemberi kerja</button></div></div>
${["worker", "employer"].map((k) => `<div data-lr="${k}" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${S.lr === k ? "" : "hidden"}">${steps[k].map((s) => step(...s)).join("")}</div>`).join("")}</div></section>

<section id="fitur" class="py-16 md:py-24"><div class="${W} space-y-20 md:space-y-28">
${feat(0, "Siapa satset, dia dapat", "Slot terbatas, diperebutkan secara adil", "Setiap tugas punya jumlah slot. Daftar diperbarui langsung, sisa slot terlihat jelas, dan tidak ada yang bisa mengambil slot yang sama dua kali.", ["Sisa slot dan batas waktu selalu terlihat", "Slot yang tidak dikerjakan otomatis dibuka lagi", "Kamu dikabari saat tugas baru tayang"], frame(mcard("Isi survei kebiasaan jajan", "Kedai Senja · 3 menit", "Rp 5.000", 1, 18, 20)))}
${feat(1, "Terbuka dan badge", "Dua jenis tugas, satu aturan main", "Tugas terbuka bisa diambil siapa saja. Tugas khusus badge hanya untuk yang sudah terbukti mampu, dengan saingan lebih sedikit dan bayaran biasanya lebih tinggi.", ["Pemberi kerja boleh mensyaratkan lebih dari satu badge", "Badge nanti diraih lewat tes singkat (sedang disiapkan)", "Alasan tidak bisa mengambil selalu dijelaskan"], frame(mcard("Isi survei kebiasaan jajan", "Kedai Senja · terbuka untuk semua", "Rp 5.000", 0, 6, 20) + mcard("Rekap 200 data pelanggan", "Toko Berkah · khusus badge", "Rp 80.000", 0, 0, 1, 1)))}
${feat(0, "Dana dan hasil", "Dibayar saat diterima, bukan saat ditagih", "Dana ditahan sebelum tugas tayang. Pekerja menyerahkan hasil, pemberi kerja menerima atau meminta revisi, dan hasil yang tak ditinjau otomatis diterima.", ["Batas revisi ditetapkan sejak awal", "Chat per tugas untuk menanyakan yang kurang jelas", "Tautan dan instruksi hanya terbuka bagi pemegang slot"], mFlow())}
</div></section>

<section class="bg-soft py-16 md:py-20"><div class="${W}"><div class="mb-8"><p class="${EY}">Jenis tugas</p><h2 class="${SH} mt-2">Dari survei sampai desain</h2></div><div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">${Object.values(CAT).map(([l, i]) => `<button onclick="start('worker')" class="group rounded-2xl bg-card p-4 text-left ring-1 ring-line transition hover:-translate-y-1 hover:shadow-lift"><span class="grid h-11 w-11 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-6 w-6")}</span><p class="mt-4 font-extrabold text-ink">${l}</p></button>`).join("")}</div></div></section>

<section class="py-16 md:py-20"><div class="${W}"><div class="grid gap-4 md:grid-cols-2">
<div class="rounded-3xl bg-yel p-7 text-[#0f1c2e] sm:p-9"><h3 class="text-2xl font-extrabold">Untuk pencari kerja</h3><ul class="mt-5 space-y-3 text-sm font-medium [&_span.grid]:bg-black/10">${li(["Ambil tugas di sela kuliah atau kerja", "Tidak perlu CV atau portofolio untuk tugas terbuka", "Tahu bayaran dan batas waktu sebelum mengambil", "Hasil tak ditinjau 48 jam, otomatis dibayar"])}</ul><button class="${B} mt-7 bg-[#0f1c2e] text-white hover:bg-black" onclick="start('worker')">Daftar sebagai pencari kerja${ico("arrow", "h-4 w-4")}</button></div>
<div class="rounded-3xl bg-gradient-to-br from-navy to-[#17406a] p-7 text-white sm:p-9"><h3 class="text-2xl font-extrabold">Untuk pemberi kerja</h3><ul class="mt-5 space-y-3 text-sm font-medium">${li(["Pasang tugas dalam semenit dengan template", "Slot terisi tanpa harus menyeleksi satu per satu", "Dikabari tiap slot terambil dan hasil masuk", "Pasang lagi dengan satu ketukan"])}</ul><button class="${BY} mt-7" onclick="start('employer')">Pasang tugas${ico("arrow", "h-4 w-4")}</button></div></div></div></section>

<section id="faq" class="mx-auto max-w-3xl px-5 pb-16 sm:px-6 md:pb-24"><p class="text-center ${EY}">FAQ</p><h2 class="${SH} mb-8 mt-2 text-center">Pertanyaan umum</h2><div class="space-y-3">
${faq.map(([q, a]) => `<details class="group rounded-2xl bg-card shadow-card ring-1 ring-line"><summary class="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold text-ink">${q}<span class="text-pri transition group-open:rotate-180">${ico("chevron", "h-5 w-5")}</span></summary><p class="${MU} px-5 pb-5 leading-relaxed">${a}</p></details>`).join("")}</div></section>

<section class="relative overflow-hidden bg-gradient-to-br from-navy to-navy2 px-5 py-16 text-center text-white sm:px-6 md:py-20"><div class="dots pointer-events-none absolute inset-0"></div><div class="relative mx-auto max-w-2xl"><h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Slot berikutnya bisa jadi milikmu.</h2><p class="mt-3 text-blue-100">Daftar gratis dan lihat tugas yang tayang sekarang.</p><div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button class="${BY} !min-h-14 !px-8 !text-base" onclick="start('worker')">Daftar gratis${ico("arrow", "h-5 w-5")}</button><button class="${B} border border-white/30 !min-h-14 !px-8 !text-base text-white hover:bg-white/10" onclick="login()">Saya sudah punya akun</button></div></div></section>

<footer class="bg-[#0b2238] pb-28 pt-12 text-blue-200 md:pb-10"><div class="${W}"><div class="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]"><div><span class="inline-flex items-center gap-2.5">${MARK()}<b class="text-xl font-extrabold text-white">${BRAND.name}</b></span><p class="mt-3 max-w-xs text-sm">Platform tugas sampingan dengan sistem siapa cepat dia dapat, untuk pemberi kerja yang butuh cepat dan pencari kerja yang punya waktu luang.</p></div><div><p class="text-sm font-bold text-white">Halaman</p><ul class="mt-3 space-y-2 text-sm">${[["#cara", "Cara kerja"], ["#fitur", "Fitur"], ["#faq", "FAQ"]].map(([h, t]) => `<li><a class="hover:text-white" href="${h}">${t}</a></li>`).join("")}</ul></div><div><p class="text-sm font-bold text-white">Mulai</p><ul class="mt-3 space-y-2 text-sm"><li><button class="hover:text-white" onclick="start('worker')">Daftar pencari kerja</button></li><li><button class="hover:text-white" onclick="start('employer')">Daftar pemberi kerja</button></li><li><button class="hover:text-white" onclick="login()">Masuk</button></li></ul></div></div><p class="mt-10 border-t border-white/10 pt-6 text-xs">© 2026 ${BRAND.name} · Prototipe MVP untuk demo, pembayaran masih simulasi. Data: BPS, Sakernas Mei 2026.</p></div></footer>
<div id="sticky" class="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-line bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur transition-transform duration-300 md:hidden"><button class="${BY} w-full !min-h-12" onclick="start('worker')">Daftar gratis dan cari tugas</button></div>`;
