import { esc, rp, C, B, BY, BO, BR, PL, OK, IN, LB, MU, NT, H1, KV, CH, AV, RING, EMPTY, toast } from "../ui.js";
import { ico } from "../icons.js";
import { S, SK, BD } from "../state.js";
import { R } from "../router.js";
import { pct, pctWJ } from "../matching.js";
import { getJob, createMatch } from "../data.js";

/* ---------- form pasang / ubah pekerjaan ---------- */
export const tj = (k, v) => {
  const a = S.jf[k],
    m = k === "bd" ? 2 : 4,
    i = a.indexOf(v);
  if (i >= 0) a.splice(i, 1);
  else if (a.length >= m) return toast("Maksimal " + m + " pilihan.");
  else a.push(v);
  R();
};
const jc = (k, L) =>
  `<div class="flex flex-wrap gap-2">${L.map((v) => `<button type="button" aria-pressed="${S.jf[k].includes(v)}" class="inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${S.jf[k].includes(v) ? "border-pri bg-pri text-onpri" : "border-line bg-card text-ink hover:border-pri"}" onclick='tj("${k}",${JSON.stringify(v)})'>${v}</button>`).join("")}</div>`;
const used = (id) => S.jm.filter((m) => m.j === id && m.s !== "rejected").length;
const jobForm = () => {
  const f = S.jf,
    ed = !!f.id;
  return `<div class="${C}">${CH(ed ? "pen" : "plus", ed ? "Ubah pekerjaan" : "Pasang pekerjaan")}
${ed && used(f.id) ? `<div class="${NT} flex gap-3">${ico("info", "h-5 w-5 shrink-0 text-pri")}<span>Sudah ada ${used(f.id)} lamaran atau kerja sama untuk pekerjaan ini. Mengubah honor, tenggat, atau revisi tidak mengubah kontrak yang sudah dibuat.</span></div>` : ""}
<label class="${LB} !mt-0">Judul (min. 5 karakter)</label><input class="${IN}" value="${esc(f.t)}" oninput="S.jf.t=this.value">
<label class="${LB}">Bidang (pilih 1 sampai 2)</label>${jc("bd", BD)}<label class="${LB}">Kemampuan dibutuhkan (sampai 4)</label>${jc("s", SK)}
<label class="${LB}">Deskripsi (min. 30 karakter)</label><textarea class="${IN} min-h-[120px]" oninput="S.jf.x=this.value">${esc(f.x)}</textarea>
<label class="${LB}">Hasil akhir yang diharapkan</label><textarea class="${IN} min-h-[72px]" oninput="S.jf.dv=this.value">${esc(f.dv)}</textarea>
<label class="${LB}">Level pekerja minimum</label><select class="${IN}" onchange="S.jf.lv=this.value">${["Semua level", "Pemula ke atas", "Sudah sering praktik"].map((x) => `<option${x === f.lv ? " selected" : ""}>${x}</option>`).join("")}</select>
<div class="grid gap-x-3 sm:grid-cols-3"><div><label class="${LB}">Honor (Rp 15.000 – 300.000)</label><input type="number" inputmode="numeric" class="${IN}" value="${f.b}" oninput="S.jf.b=+this.value"></div>
<div><label class="${LB}">Tenggat (1–60 hari)</label><input type="number" inputmode="numeric" class="${IN}" value="${f.d}" oninput="S.jf.d=+this.value"></div>
<div><label class="${LB}">Maks. revisi (0–5)</label><input type="number" inputmode="numeric" class="${IN}" value="${f.r}" oninput="S.jf.r=+this.value"></div></div>
<div class="mt-6 flex gap-3"><button class="${BO}" onclick="cancelJob()">Batal</button><button class="${BY} flex-1 !min-h-12" onclick="saveJob()">${ed ? "Simpan perubahan" : "Pasang pekerjaan"}</button></div></div>`;
};
export const newJob = () => {
  Object.assign(S.jf, { id: null, t: "", x: "", dv: "", bd: [], s: [], lv: "Semua level", b: 100000, d: 5, r: 2 });
  S.jform = true;
  R();
  scrollTo(0, 0);
};
export const editJob = (id) => {
  const j = S.allJobs.find((x) => x.id === id);
  if (!j) return;
  Object.assign(S.jf, { id: j.id, t: j.t, x: j.x, dv: j.dv, bd: [...j.bd], s: [...j.s], lv: j.lv || "Semua level", b: j.b, d: j.d, r: j.r });
  S.jform = true;
  R();
  scrollTo(0, 0);
};
export const cancelJob = () => {
  S.jform = false;
  S.jf.id = null;
  R();
};
export const askRemove = (id) => {
  const j = S.allJobs.find((x) => x.id === id);
  if (!j) return;
  const mm = S.jm.filter((m) => m.j === id),
    live = mm.filter((m) => m.s === "agreed" || m.s === "completed").length,
    wait = mm.filter((m) => m.s === "pending").length;
  if (live)
    return toast("Pekerjaan ini punya kerja sama berjalan atau selesai, jadi tidak bisa dihapus. Tutup saja supaya tidak menerima pelamar baru.");
  if (confirm(`Hapus "${j.t}"?` + (wait ? `\n${wait} negosiasi yang masih berjalan ikut terhapus.` : "") + "\nTindakan ini tidak bisa dibatalkan."))
    window.removeJob(id);
};

/* ---------- tab Pekerjaan (khusus pemberi kerja) ---------- */
export function vJobs() {
  if (S.jform) return `<h1 class="${H1} mb-4">${S.jf.id ? "Ubah pekerjaan" : "Pasang pekerjaan"}</h1>${jobForm()}`;
  const L = S.allJobs;
  return `<div class="mb-5 flex items-start justify-between gap-3"><div><h1 class="${H1}">Pekerjaan saya</h1><p class="${MU} mt-1">Kelola pekerjaan yang kamu pasang: ubah, tutup, atau hapus.</p></div><button class="${BY} shrink-0" onclick="newJob()">${ico("plus", "h-4 w-4")}Pasang</button></div>
<div class="space-y-3">${
    L.map((j) => {
      const mm = S.jm.filter((m) => m.j === j.id && m.s !== "rejected"),
        run = mm.filter((m) => m.s === "agreed").length,
        done = mm.filter((m) => m.s === "completed").length,
        open = j.st === "open";
      return `<article class="rounded-2xl bg-card p-4 shadow-card ring-1 ring-line sm:p-5"><div class="flex items-start justify-between gap-3"><button class="min-w-0 text-left" onclick="openJob('${j.id}')"><h3 class="font-bold leading-snug text-ink hover:underline">${esc(j.t)}</h3></button><span class="${open ? OK : PL} shrink-0">${open ? "Dibuka" : "Ditutup"}</span></div>
<p class="${MU} mt-1"><b class="text-ink">${rp(j.b)}</b> · ${j.d} hari · ${j.r} revisi</p>
<div class="mt-2 flex flex-wrap gap-1.5">${[...j.bd, ...j.s].map((k) => `<span class="${PL}">${esc(k)}</span>`).join("")}</div>
<p class="${MU} mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">${ico("users", "h-4 w-4")}<span>${mm.length} lamaran/negosiasi</span><span>${run} berjalan</span><span>${done} selesai</span></p>
<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><button class="${BO} !min-h-10" onclick="openJob('${j.id}')">${ico("eye", "h-4 w-4")}Detail</button><button class="${BO} !min-h-10" onclick="editJob('${j.id}')">${ico("pen", "h-4 w-4")}Ubah</button><button class="${BO} !min-h-10" onclick="setJobStatus('${j.id}','${open ? "closed" : "open"}')">${ico(open ? "pause" : "refresh", "h-4 w-4")}${open ? "Tutup" : "Buka lagi"}</button><button class="${BR} !min-h-10" onclick="askRemove('${j.id}')">${ico("trash", "h-4 w-4")}Hapus</button></div></article>`;
    }).join("") || EMPTY("briefcase", "Belum ada pekerjaan", "Pasang pekerjaan pertamamu supaya talenta bisa dicocokkan dan diundang.", `<button class="${BY} mt-5" onclick="newJob()">${ico("plus", "h-4 w-4")}Pasang pekerjaan</button>`)
  }</div>`;
}

/* ---------- detail pekerjaan ---------- */
export async function openJob(id) {
  S.pb = S.view;
  S.jv = (await getJob(id)) || null;
  if (!S.jv) return toast("Pekerjaan tidak ditemukan atau sudah dihapus.");
  S.view = "job";
  R();
  scrollTo(0, 0);
}
export async function applyJob(id) {
  const i = S.jobs.findIndex((j) => j.id === id);
  if (i < 0) return;
  S.view = "main";
  if (await createMatch(i)) toast("Lamaran terkirim. Lanjut diskusi di tab Chat.");
  R();
}
export function vJob() {
  const j = S.jv;
  if (!j) return `<div class="${C}"><p class="${MU}">Memuat…</p></div>`;
  const w = S.role === "worker",
    mine = j.eid === S.me,
    avail = w && S.jobs.some((x) => x.id === j.id),
    p = w ? pct(j) : 0;
  return `<button class="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-pri" onclick="S.view=S.pb||'main';R()">${ico("back", "h-4 w-4")}Kembali</button>
<div class="${C}"><div class="flex items-start gap-3">${AV(j.o)}<div class="min-w-0 flex-1"><h1 class="text-xl font-extrabold leading-snug tracking-tight text-ink">${esc(j.t)}</h1><button class="mt-0.5 text-sm font-semibold text-pri hover:underline" onclick="openProf('e','${j.eid}')">${esc(j.o)}</button></div>${w && avail ? RING(p) : ""}</div>
<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">${[["Honor", rp(j.b)], ["Tenggat", j.d + " hari"], ["Revisi", "maks. " + j.r + "×"], ["Level", j.lv || "Semua level"]].map(([a, b]) => `<div class="rounded-xl bg-soft p-3"><span class="text-[11px] text-mut">${a}</span><b class="block text-sm text-ink">${esc(b)}</b></div>`).join("")}</div>
<div class="mt-4 flex flex-wrap gap-1.5">${[...j.bd, ...j.s].map((k) => `<span class="${PL}">${esc(k)}</span>`).join("")}${j.st === "closed" ? `<span class="${PL}">Ditutup</span>` : ""}</div></div>
<div class="${C}">${CH("file", "Deskripsi pekerjaan")}<p class="whitespace-pre-line break-words text-sm leading-relaxed">${esc(j.x) || "-"}</p></div>
${j.dv ? `<div class="${C}">${CH("package", "Hasil akhir yang diharapkan")}<p class="whitespace-pre-line break-words text-sm leading-relaxed">${esc(j.dv)}</p></div>` : ""}
<div class="${C}">${CH("contract", "Ringkasan syarat")}${KV("Honor total", rp(j.b))}${KV("Tenggat", j.d + " hari sejak kerja sama dimulai")}${KV("Maksimal revisi", j.r + "×")}${KV("Penahanan dana", "Pihak ketiga")}</div>
${avail ? `<div class="grid grid-cols-[1fr_1.5fr] gap-3"><button class="${BO} !min-h-12" onclick="skip('${j.id}');S.view=S.pb||'main';R()">${ico("x", "h-4 w-4")}Lewati</button><button class="${BY} !min-h-12" onclick="applyJob('${j.id}')">${ico("heart", "h-4 w-4", "currentColor")}Lamar pekerjaan ini</button></div>` : mine ? `<button class="${BO} w-full" onclick="S.view='main';S.tab='jobs';editJob('${j.id}')">${ico("pen", "h-4 w-4")}Ubah pekerjaan ini</button>` : w ? `<div class="${NT}">Kamu sudah memproses pekerjaan ini. Lanjutkan di tab Chat atau Kerja Sama.</div>` : ""}`;
}

/* ---------- undang talenta: pilih pekerjaannya ---------- */
export function askInvite(i) {
  if (!S.myJobs.length) {
    toast("Pasang pekerjaan dulu supaya kamu bisa mengundang talenta.");
    S.tab = "jobs";
    S.view = "main";
    return newJob();
  }
  S.inv = i;
  R();
}
export const closeInvite = () => {
  S.inv = null;
  R();
};
export async function invite(jobId) {
  const i = S.inv;
  S.inv = null;
  if (await createMatch(i, jobId)) toast("Undangan terkirim untuk pekerjaan itu. Lanjut diskusi di tab Chat.");
  R();
}
export function vInvite() {
  const x = S.ws[S.inv];
  if (!x) return "";
  const mk = new Set(S.mk);
  return `<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Pilih pekerjaan" onclick="if(event.target===this)closeInvite()"><div class="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 shadow-lift sm:rounded-3xl"><div class="flex items-start justify-between gap-3"><div><h2 class="text-lg font-extrabold text-ink">Undang ${esc(x.n)}</h2><p class="${MU}">Pilih pekerjaan yang ingin ditawarkan.</p></div><button class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-soft text-ink" aria-label="Tutup" onclick="closeInvite()">${ico("x", "h-5 w-5")}</button></div>
<div class="mt-4 space-y-2.5">${S.myJobs.map((j) => {
    const dis = mk.has(j.id + "|" + x.id);
    return `<button class="flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${dis ? "cursor-not-allowed border-line bg-soft/50 opacity-60" : "border-line hover:border-pri hover:bg-soft"}" ${dis ? "disabled" : `onclick="invite('${j.id}')"`}><span class="min-w-0 flex-1"><b class="block truncate text-ink">${esc(j.t)}</b><span class="${MU}">${rp(j.b)} · ${j.d} hari · ${j.r} revisi</span><span class="mt-1.5 flex gap-1.5">${dis ? `<span class="${PL}">Sudah diproses dengan talenta ini</span>` : `<span class="${PL}">${pctWJ(x, j)}% cocok</span>`}</span></span>${dis ? "" : `<span class="text-pri">${ico("arrow", "h-5 w-5")}</span>`}</button>`;
  }).join("")}</div>
<button class="${BO} mt-4 w-full" onclick="closeInvite();S.tab='jobs';newJob()">${ico("plus", "h-4 w-4")}Pasang pekerjaan baru</button></div></div>`;
}
