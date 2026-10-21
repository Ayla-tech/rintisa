import { C, B, BY, BO, MU, SH, MARK, HDR, LOGO } from "../ui.js";
import { BD, S } from "../state.js";
import { ico, BI } from "../icons.js";

const W = "mx-auto w-full max-w-6xl px-5 sm:px-6";
const CAT = {
  Desain: ["Poster, logo, banner", "bg-rose-50", "text-rose-700"],
  Video: ["Edit video pendek", "bg-violet-50", "text-violet-700"],
  Penulisan: ["Caption, artikel, copywriting", "bg-amber-50", "text-amber-700"],
  "Data & Admin": [
    "Input data, rekap, arsip",
    "bg-emerald-50",
    "text-emerald-700",
  ],
  "Media Sosial": ["Kelola dan jadwalkan konten", "bg-sky-50", "text-sky-700"],
};

/* ---------- mockup produk (selalu terang, tidak ikut mode gelap) ---------- */
const mring = (p) =>
  `<span class="relative grid h-12 w-12 shrink-0 place-items-center"><svg class="absolute inset-0 -rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="#e3e8ef" stroke-width="3.5"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="#1b7f55" stroke-width="3.5" stroke-linecap="round" pathLength="100" stroke-dasharray="${p} 100"/></svg><b class="text-xs text-slate-900">${p}%</b></span>`;
const mjob = (t, s, p, r, k, l) =>
  `<div class="rounded-2xl bg-white p-3.5 text-slate-900 shadow-lg ring-1 ring-black/5"><div class="flex items-center gap-2.5"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 font-extrabold text-sky-900">${t[0]}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-bold">${t}</p><p class="truncate text-xs text-slate-500">${s}</p></div>${mring(p)}</div><div class="mt-2.5 flex flex-wrap gap-1.5">${k.map((x) => `<span class="rounded-full bg-[#eaf1f9] px-2 py-0.5 text-[11px] font-semibold text-[#17406a]">${x}</span>`).join("")}</div><div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5"><b class="text-sm">${r}</b><span class="text-xs text-slate-500">${l}</span></div><div class="mt-2.5 grid grid-cols-2 gap-2 text-xs font-bold"><span class="grid h-9 place-items-center rounded-lg border border-slate-200 text-slate-600">Lewati</span><span class="flex h-9 items-center justify-center gap-1 rounded-lg bg-[#f6b900] text-[#0f1c2e]">${ico("heart", "h-3.5 w-3.5", "currentColor")}Lamar</span></div></div>`;
const chip = (i, t, s, cls) =>
  `<div class="absolute ${cls} flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-slate-900 shadow-xl ring-1 ring-black/5 animate-float"><span class="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f5ee] text-[#1b7f55]">${ico(i, "h-[18px] w-[18px]")}</span><span class="leading-tight"><b class="block text-xs">${t}</b><span class="text-[11px] text-slate-500">${s}</span></span></div>`;
const frame = (inner, cls = "") =>
  `<div class="rounded-[1.6rem] border border-line bg-soft p-3 sm:p-4 ${cls}">${inner}</div>`;
const mcard = (inner) =>
  `<div class="rounded-2xl bg-white p-4 text-slate-900 shadow-md ring-1 ring-black/5">${inner}</div>`;

const mProfile = () =>
  frame(
    mcard(
      `<div class="flex items-center gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-lg font-extrabold text-amber-900">D</span><div><p class="font-bold">Dinda, 19 tahun</p><p class="text-xs text-slate-500">Mahasiswa · Desain · Malang</p></div></div><div class="mt-3 flex flex-wrap gap-1.5">${["Canva", "Desain Poster", "Logo"].map((x) => `<span class="rounded-full bg-[#eaf1f9] px-2 py-0.5 text-[11px] font-semibold text-[#17406a]">${x}</span>`).join("")}</div><p class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Klien minta ganti warna 3 kali. Apa yang kamu lakukan?</p><p class="mt-1 rounded-xl bg-slate-50 p-3 text-sm italic text-slate-700">“Saya tanya dulu warna yang diinginkan, kirim 2 opsi, lalu sepakati sebelum revisi berikutnya.”</p>`,
    ),
  );
const mSwipe = () =>
  frame(
    `<div class="mx-auto max-w-xs">${mjob("Input data stok", "Toko Berkah · 3 hari", 84, "Rp 80.000", ["Input Data", "Excel"], "3 hari")}</div>`,
  );
const mProgress = () =>
  frame(
    mcard(
      `<div class="flex items-center justify-between"><b>Banner promo Ramadan</b><span class="rounded-full bg-[#e6f5ee] px-2 py-0.5 text-[11px] font-bold text-[#1b7f55]">Dikerjakan</span></div><div class="mt-3 flex gap-2.5"><span class="grid h-16 w-20 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">${ico("image", "h-6 w-6")}</span><div class="min-w-0 flex-1"><p class="text-xs text-slate-500">Update terakhir: hari ini</p><p class="text-sm font-semibold">60% selesai</p><div class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full w-3/5 rounded-full bg-[#17406a]"></div></div></div></div><div class="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">${[
        ["Dana ditahan", 1],
        ["DP cair", 1],
        ["Pelunasan", 0],
      ]
        .map(
          ([t, d]) =>
            `<span class="rounded-xl py-2 ${d ? "bg-[#e6f5ee] text-[#1b7f55]" : "bg-slate-100 text-slate-500"}">${d ? ico("check", "mr-1 inline h-3 w-3") : ""}${t}</span>`,
        )
        .join(
          "",
        )}</div><div class="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">${ico("lock", "h-4 w-4 text-[#17406a]")}Sisa dana ditahan pihak ketiga sampai hasil diterima</div>`,
    ),
  );
const mPorto = () =>
  frame(
    mcard(
      `<span class="inline-flex items-center gap-1 rounded-full bg-[#e6f5ee] px-2.5 py-1 text-[11px] font-bold text-[#1b7f55]">${ico("shield", "h-3 w-3")}Terverifikasi Rintisa</span><div class="mt-3 grid aspect-[16/9] w-full place-items-center rounded-xl bg-slate-100 text-slate-400">${ico("image", "h-8 w-8")}</div><p class="mt-3 font-bold">Banner promo Ramadan</p><p class="text-xs text-slate-500">Untuk Kopi Senja · revisi 1 dari 2 · Rp 120.000</p>`,
    ),
  );

/* ---------- potongan kecil ---------- */
const feat = (rev, eyebrow, t, d, pts, mock) =>
  `<div class="grid items-center gap-8 md:grid-cols-2 md:gap-14"><div class="${rev ? "md:order-2" : ""}"><p class="text-sm font-bold uppercase tracking-wider text-pri">${eyebrow}</p><h3 class="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">${t}</h3><p class="mt-3 text-base text-mut">${d}</p><ul class="mt-5 space-y-2.5 text-sm font-medium">${pts.map((x) => `<li class="flex gap-2.5"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-okbg text-ok">${ico("check", "h-3 w-3")}</span><span>${x}</span></li>`).join("")}</ul></div><div class="${rev ? "md:order-1" : ""}">${mock}</div></div>`;
const why = (i, t, d) =>
  `<div class="${C} !mb-0 transition hover:-translate-y-0.5 hover:shadow-lift"><span class="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-6 w-6")}</span><h3 class="text-base font-bold text-ink">${t}</h3><p class="${MU} mt-1.5">${d}</p></div>`;
const step = (n, i, t, d) =>
  `<div class="relative rounded-2xl bg-card p-5 shadow-card ring-1 ring-line"><span class="grid h-10 w-10 place-items-center rounded-full bg-yel font-extrabold text-[#0f1c2e]">${n}</span><span class="absolute right-5 top-5 text-pri/30">${ico(i, "h-7 w-7")}</span><h3 class="mt-4 font-bold text-ink">${t}</h3><p class="${MU} mt-1">${d}</p></div>`;
const li = (a) =>
  a
    .map(
      (x) =>
        `<li class="flex gap-2.5"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20">${ico("check", "h-3 w-3")}</span><span>${x}</span></li>`,
    )
    .join("");
const LBT = "rounded-full px-5 py-2.5 text-sm font-bold transition",
  ON = " bg-pri text-onpri shadow-sm",
  OFF = " text-mut hover:text-ink";
export const lr = (k) => {
  S.lr = k;
  document
    .querySelectorAll("[data-lr]")
    .forEach((e) => e.classList.toggle("hidden", e.dataset.lr !== k));
  document.querySelectorAll("[data-lrb]").forEach((b) => {
    const on = b.dataset.lrb === k;
    b.setAttribute("aria-pressed", on);
    b.className = LBT + (on ? ON : OFF);
  });
};
const steps = {
  worker: [
    [
      "1",
      "user",
      "Lengkapi profil",
      "Latar belakang, kemampuan, kesiapan belajar, dan cara kerjamu. Tanpa syarat pengalaman.",
    ],
    [
      "2",
      "heart",
      "Lamar dengan satu ketukan",
      "Pekerjaan diurutkan dari yang paling cocok. Lewati yang tidak sesuai.",
    ],
    [
      "3",
      "contract",
      "Sepakati kontrak",
      "Bahas di chat, lalu kedua pihak setuju pada honor, tenggat, dan jumlah revisi.",
    ],
    [
      "4",
      "wallet",
      "Kerja dan dibayar",
      "Unggah foto progres. Hasil diterima, dana cair, karya masuk portofolio.",
    ],
  ],
  employer: [
    [
      "1",
      "store",
      "Buat profil usaha",
      "Ceritakan usaha atau komunitasmu supaya pekerja berani melamar.",
    ],
    [
      "2",
      "briefcase",
      "Pasang pekerjaan",
      "Tentukan hasil akhir, honor Rp 15.000 sampai 300.000, tenggat, dan batas revisi.",
    ],
    [
      "3",
      "users",
      "Pilih talenta",
      "Lihat profil lengkap dan jawaban kasus sebelum mengundang atau menerima lamaran.",
    ],
    [
      "4",
      "shield",
      "Pantau dan terima hasil",
      "Lihat foto progres. Dana hanya cair setelah kamu menerima hasil.",
    ],
  ],
};
const faq = [
  [
    "Apakah aku harus punya portofolio?",
    "Tidak. Profil detail yang kamu isi menggantikannya. Portofolio terbentuk otomatis setelah proyek pertamamu selesai.",
  ],
  [
    "Berapa honor per proyek?",
    "Rp 15.000 sampai Rp 300.000 per proyek. Proyeknya kecil dan jelas, cocok untuk memulai.",
  ],
  [
    "Siapa yang memegang uangnya?",
    "Pihak ketiga, bukan pemberi kerja atau pekerja. DP cair di awal sebagai modal kerja, pelunasan cair setelah hasil diterima.",
  ],
  [
    "Apakah KTP atau SIM saya aman?",
    "Foto disimpan privat dan hanya dipakai untuk verifikasi. Nomor dokumen tidak disimpan dan foto tidak ditampilkan ke siapa pun.",
  ],
  [
    "Bagaimana kalau revisi diminta terus?",
    "Jumlah maksimal revisi dikunci di surat perjanjian. Kalau kuota habis, tombol revisi terkunci otomatis.",
  ],
  [
    "Bagaimana kalau kami tidak sepakat soal kontrak?",
    "Isi perjanjian bisa diubah di chat sampai kedua pihak setuju. Kalau salah satu menolak, chat ditutup dan tidak ada kewajiban apa pun.",
  ],
];

export const vLand = () => `${HDR(
  `<a href="#top" aria-label="Rintisa, ke atas">${LOGO}</a>
<nav class="hidden items-center gap-1 md:flex" aria-label="Navigasi halaman">${[
    ["#cara", "Cara kerja"],
    ["#fitur", "Fitur"],
    ["#aman", "Keamanan"],
    ["#faq", "FAQ"],
  ]
    .map(
      ([h, t]) =>
        `<a href="${h}" class="rounded-lg px-3.5 py-2 text-sm font-semibold text-mut transition hover:bg-soft hover:text-ink">${t}</a>`,
    )
    .join("")}</nav>
<div class="flex items-center gap-2"><button class="${BO} !min-h-10 !px-4" onclick="login()">Masuk</button><button class="${BY} !min-h-10 !px-4" onclick="start('worker')">Daftar gratis</button></div>`,
)}
<div id="top"></div>
<section class="relative overflow-hidden bg-gradient-to-br from-navy via-[#17406a] to-navy2 text-white">
<div class="dots pointer-events-none absolute inset-0"></div>
<div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"></div>
<div class="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-20">
<div>
<span class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20 sm:text-sm">${ico("sparkle", "h-4 w-4 text-yel")}Proyek kecil UMKM dan komunitas · mulai Rp 15.000</span>
<h1 class="mt-5 text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">Dapat kerja pertama, <span class="relative whitespace-nowrap text-yel">tanpa portofolio.<svg class="absolute -bottom-2 left-0 h-2.5 w-full text-yel/70" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7c40-6 100-6 196-1" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg></span></h1>
<p class="mt-6 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">Profil detail menggantikan CV. Lamar dengan satu ketukan, kerja dengan kontrak yang jelas, dan dibayar lewat dana yang ditahan pihak ketiga sampai hasil diterima.</p>
<div class="mt-8 flex flex-col gap-3 sm:flex-row"><button onclick="start('worker')" class="${BY} !min-h-14 !px-7 !text-base">Cari kerja pertamaku${ico("arrow", "h-5 w-5")}</button><button onclick="start('employer')" class="${B} !min-h-14 border border-white/30 !px-7 !text-base text-white hover:bg-white/10">Pasang pekerjaan</button></div>
<ul class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">${["Daftar gratis", "Isi profil sekitar 5 menit", "Dana aman sampai hasil diterima"].map((x) => `<li class="flex items-center gap-2">${ico("check", "h-4 w-4 text-yel")}${x}</li>`).join("")}</ul>
</div>
<div class="relative mx-auto w-full max-w-[20rem] pb-6 sm:max-w-[22rem]" aria-label="Contoh tampilan aplikasi">
<div class="rounded-[2.2rem] border border-white/20 bg-white/10 p-2.5 shadow-2xl backdrop-blur"><div class="rounded-[1.7rem] bg-[#f6f8fb] p-3"><p class="mb-2 px-1 text-[11px] font-semibold text-slate-500">Contoh tampilan · pekerjaan untuk kamu</p><div class="space-y-3">${mjob("Banner promo Ramadan", "Kopi Senja · 4 hari", 92, "Rp 120.000", ["Canva", "Desain Poster"], "4 hari")}<div class="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5"><div class="h-2.5 w-2/3 rounded-full bg-slate-200"></div><div class="mt-2 h-2 w-1/2 rounded-full bg-slate-200"></div></div></div></div></div>
${chip("lock", "Dana ditahan", "Rp 120.000 aman", "-right-2 -top-4 sm:-right-10")}
${chip("camera", "Bukti terkirim", "Progres 60%", "-left-2 bottom-1 sm:-left-10 [animation-delay:-3s]")}
</div>
</div></section>

<section class="border-b border-line bg-card" aria-label="Jaminan"><div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 sm:px-6 md:grid-cols-4">${[
  ["lock", "Dana ditahan pihak ketiga"],
  ["contract", "Kontrak sah setelah dua pihak setuju"],
  ["refresh", "Revisi dibatasi sejak awal"],
  ["idcard", "Identitas bisa diverifikasi"],
]
  .map(
    ([i, t]) =>
      `<div class="flex items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-pri">${ico(i, "h-5 w-5")}</span><span class="text-sm font-semibold leading-snug text-ink">${t}</span></div>`,
  )
  .join("")}</div></section>

<section class="py-16 md:py-20"><div class="${W}"><div class="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
<div class="rounded-3xl bg-gradient-to-br from-navy to-navy2 p-8 text-white shadow-lift"><p class="text-sm font-semibold text-blue-100">Pengangguran usia 15–24 tahun di Indonesia</p><p class="mt-2 text-6xl font-extrabold tracking-tight text-yel sm:text-7xl">17,37%</p><p class="mt-3 text-sm text-blue-100">Tingkat pengangguran terbuka kelompok usia muda, naik dari 16,36% pada Februari 2026.</p><div class="mt-6 border-t border-white/20 pt-5"><p class="text-3xl font-extrabold">7,68%</p><p class="text-sm text-blue-100">tingkat pengangguran lulusan SMK, tertinggi di antara semua jenjang pendidikan.</p></div><p class="mt-5 text-xs text-blue-200">Sumber: BPS, Sakernas Mei 2026.</p></div>
<div><p class="text-sm font-bold uppercase tracking-wider text-pri">Kenapa Rintisa ada</p><h2 class="${SH} mt-2">Pengalaman jadi syarat. Tapi pengalaman pertama datang dari mana?</h2><p class="mt-4 text-base text-mut">Banyak anak muda terjebak di sini: lowongan minta portofolio, portofolio butuh pekerjaan. Sementara UMKM dan komunitas punya banyak tugas kecil yang butuh tangan.</p><p class="mt-3 text-base text-mut">Rintisa membalik urutannya. Kamu dinilai dari profil yang jujur dan detail, mengerjakan proyek kecil dengan kontrak yang jelas, lalu portofoliomu terbentuk dari proyek yang selesai.</p><button class="${BY} mt-6" onclick="start('worker')">Mulai dari profil${ico("arrow", "h-4 w-4")}</button></div></div></div></section>

<section id="cara" class="bg-soft py-16 md:py-20"><div class="${W}"><div class="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"><div><p class="text-sm font-bold uppercase tracking-wider text-pri">Cara kerja</p><h2 class="${SH} mt-2">Empat langkah sampai dibayar</h2></div><div class="inline-flex rounded-full bg-card p-1 shadow-card ring-1 ring-line" role="group" aria-label="Pilih peran"><button data-lrb="worker" aria-pressed="${S.lr === "worker"}" class="${LBT}${S.lr === "worker" ? ON : OFF}" onclick="lr('worker')">Pencari kerja</button><button data-lrb="employer" aria-pressed="${S.lr === "employer"}" class="${LBT}${S.lr === "employer" ? ON : OFF}" onclick="lr('employer')">Pemberi kerja</button></div></div>
${["worker", "employer"].map((k) => `<div data-lr="${k}" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${S.lr === k ? "" : "hidden"}">${steps[k].map((s) => step(...s)).join("")}</div>`).join("")}
</div></section>

<section id="fitur" class="py-16 md:py-24"><div class="${W} space-y-20 md:space-y-28">
${feat(0, "Profil", "Profil yang menjawab, bukan sekadar mengaku", "Bukan CV kosong. Kamu menjawab pertanyaan spesifik, misalnya apa yang dilakukan kalau klien minta ganti warna tiga kali. Pemberi kerja melihat cara berpikirmu sebelum mengundang.", ["Latar belakang, kemampuan, dan kesiapan belajar", "Jawaban kasus nyata sebagai pengganti portofolio", "Boleh dikosongkan di bagian yang belum ada"], mProfile())}
${feat(1, "Pencocokan", "Cocok? Lamar dengan satu ketukan, chat langsung terbuka", "Daftar pekerjaan diurutkan dari yang paling cocok dengan kemampuanmu. Lewati yang tidak sesuai, atau cari sendiri lewat kolom pencarian.", ["Persentase kecocokan di setiap kartu", "Lamaran dan undangan masuk ke notifikasi", "Chat terbuka untuk membahas kontrak"], mSwipe())}
${feat(0, "Progres dan pembayaran", "Progres terlihat, uang tidak menggantung", "Foto bukti dan catatan di setiap tahap, jadi pemberi kerja tahu pekerjaan berjalan. Dana ditahan pihak ketiga dan baru cair penuh setelah hasil diterima.", ["DP cair di awal sebagai modal kerja", "Foto bukti progres dengan keterangan update terakhir", "Tenggat dan batas revisi tercatat di kontrak"], mProgress())}
${feat(1, "Portofolio", "Portofolio terbentuk sendiri dari proyek yang selesai", "Setiap kerja sama yang selesai masuk ke profilmu lengkap dengan foto hasil, nilai proyek, dan label Terverifikasi Rintisa. Itu modal untuk proyek berikutnya.", ["Otomatis, tanpa perlu menyusun ulang", "Terverifikasi dari kerja sama yang benar-benar terjadi", "Dilihat pemberi kerja saat menilai profilmu"], mPorto())}
</div></section>

<section class="bg-soft py-16 md:py-20"><div class="${W}"><div class="mb-8 flex items-end justify-between gap-4"><div><p class="text-sm font-bold uppercase tracking-wider text-pri">Bidang pekerjaan</p><h2 class="${SH} mt-2">Mulai dari yang paling kamu kuasai</h2></div></div>
<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">${BD.map((k) => `<button onclick="start('worker')" class="group rounded-2xl ${CAT[k][1]} p-4 text-left text-slate-900 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lift sm:p-5"><span class="grid h-11 w-11 place-items-center rounded-xl bg-white ${CAT[k][2]} shadow-sm">${ico(BI[k], "h-6 w-6")}</span><p class="mt-4 font-extrabold">${k}</p><p class="mt-1 text-xs leading-snug text-slate-600">${CAT[k][0]}</p><p class="mt-3 flex items-center gap-1 text-xs font-bold ${CAT[k][2]}">Lihat pekerjaan${ico("arrow", "h-3.5 w-3.5 transition group-hover:translate-x-0.5")}</p></button>`).join("")}</div></div></section>

<section id="aman" class="py-16 md:py-20"><div class="${W}"><div class="mb-10 max-w-2xl"><p class="text-sm font-bold uppercase tracking-wider text-pri">Keamanan</p><h2 class="${SH} mt-2">Dirancang supaya kedua pihak aman</h2><p class="mt-3 text-base text-mut">Kepercayaan antarorang asing dibangun lewat aturan yang jelas sejak awal, bukan janji.</p></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${why("lock", "Dana ditahan pihak ketiga", "Pemberi kerja membayar di awal. Dana baru cair penuh ke pekerja setelah hasil diterima.")}${why("contract", "Dua pihak harus setuju", "Surat perjanjian baru berlaku kalau pekerja dan pemberi kerja sama-sama menekan Setuju.")}${why("idcard", "Identitas terverifikasi", "Foto KTP atau SIM disimpan privat. Nomornya tidak disimpan dan tidak ditampilkan.")}${why("refresh", "Revisi dibatasi", "Jumlah maksimal revisi dikunci di kontrak. Kuota habis, tombol revisi terkunci.")}</div></div></section>

<section class="pb-16 md:pb-20"><div class="${W}"><div class="grid gap-4 md:grid-cols-2">
<div class="rounded-3xl bg-yel p-7 text-[#0f1c2e] sm:p-9"><h3 class="text-2xl font-extrabold">Untuk pencari kerja</h3><ul class="mt-5 space-y-3 text-sm font-medium [&_span.grid]:bg-black/10">${li(["Mulai tanpa portofolio, semua latar belakang boleh", "DP di awal untuk modal kerja", "Revisi dibatasi di kontrak", "Setiap proyek menambah portofolio"])}</ul><button class="${B} mt-7 bg-[#0f1c2e] text-white hover:bg-black" onclick="start('worker')">Daftar sebagai pencari kerja${ico("arrow", "h-4 w-4")}</button></div>
<div class="rounded-3xl bg-gradient-to-br from-navy to-[#17406a] p-7 text-white sm:p-9"><h3 class="text-2xl font-extrabold">Untuk UMKM dan komunitas</h3><ul class="mt-5 space-y-3 text-sm font-medium">${li(["Talenta pemula, honor Rp 15.000 sampai 300.000", "Lihat profil lengkap sebelum mengundang", "Dana cair hanya setelah hasil diterima", "Progres terlihat lewat foto bukti"])}</ul><button class="${BY} mt-7" onclick="start('employer')">Pasang pekerjaan${ico("arrow", "h-4 w-4")}</button></div></div></div></section>

<section id="faq" class="mx-auto max-w-3xl px-5 pb-16 sm:px-6 md:pb-24"><p class="text-center text-sm font-bold uppercase tracking-wider text-pri">FAQ</p><h2 class="${SH} mb-8 mt-2 text-center">Pertanyaan umum</h2><div class="space-y-3">
${faq.map(([q, a]) => `<details class="group rounded-2xl bg-card shadow-card ring-1 ring-line"><summary class="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold text-ink">${q}<span class="text-pri transition group-open:rotate-180">${ico("chevron", "h-5 w-5")}</span></summary><p class="${MU} px-5 pb-5 leading-relaxed">${a}</p></details>`).join("")}</div></section>

<section class="relative overflow-hidden bg-gradient-to-br from-navy to-navy2 px-5 py-16 text-center text-white sm:px-6 md:py-20"><div class="dots pointer-events-none absolute inset-0"></div><div class="relative mx-auto max-w-2xl"><h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Kerja pertamamu menunggu.</h2><p class="mt-3 text-blue-100">Daftar gratis, lengkapi profil sekitar 5 menit, dan mulai melamar hari ini.</p><div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button class="${BY} !min-h-14 !px-8 !text-base" onclick="start('worker')">Daftar gratis${ico("arrow", "h-5 w-5")}</button><button class="${B} !min-h-14 border border-white/30 !px-8 !text-base text-white hover:bg-white/10" onclick="login()">Saya sudah punya akun</button></div></div></section>

<footer class="bg-[#0b2238] pb-28 pt-12 text-blue-200 md:pb-10"><div class="${W}"><div class="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]"><div><span class="inline-flex items-center gap-2.5">${MARK()}<b class="text-xl font-extrabold text-white">Rintisa</b></span><p class="mt-3 max-w-xs text-sm">Platform kerja kecil untuk pemula tanpa portofolio, dengan kontrak jelas dan dana yang aman.</p></div><div><p class="text-sm font-bold text-white">Halaman</p><ul class="mt-3 space-y-2 text-sm">${[
  ["#cara", "Cara kerja"],
  ["#fitur", "Fitur"],
  ["#aman", "Keamanan"],
  ["#faq", "FAQ"],
]
  .map(([h, t]) => `<li><a class="hover:text-white" href="${h}">${t}</a></li>`)
  .join(
    "",
  )}</ul></div><div><p class="text-sm font-bold text-white">Mulai</p><ul class="mt-3 space-y-2 text-sm"><li><button class="hover:text-white" onclick="start('worker')">Daftar pencari kerja</button></li><li><button class="hover:text-white" onclick="start('employer')">Daftar pemberi kerja</button></li><li><button class="hover:text-white" onclick="login()">Masuk</button></li></ul></div></div></div><p class="mt-10 border-t border-white/10 pt-6 text-xs">© 2026 Rintisa · Prototipe MVP untuk keperluan demo. Data statistik: BPS, Sakernas Mei 2026.</p></div></footer>
<div id="sticky" class="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-line bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur transition-transform duration-300 md:hidden"><button class="${BY} w-full !min-h-12" onclick="start('worker')">Daftar gratis dan cari kerja</button></div>`;
