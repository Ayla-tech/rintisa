import { sb } from "./supabase.js";
import { $, toast, rp } from "./ui.js";
import { S, freshJF, clearDraft } from "./state.js";
import { R, nav } from "./router.js";
import { ERR, CAT, TPL } from "./config.js";

/* ---------- pembantu ---------- */
const q = async (p) => {
  const { data, error } = await p;
  if (error) toast(msg(error));
  return data || [];
};
export const msg = (e) => {
  const t = String(e.message || "");
  const k = Object.keys(ERR).find((x) => new RegExp("\\b" + x + "\\b").test(t));
  return k ? ERR[k] : e.code === "23505" ? ERR.SIBUK : /violates|check constraint/.test(t) ? "Isian belum valid. Periksa lagi." : "Ada kendala. Coba lagi sebentar lagi.";
};
const rpc = async (fn, args) => {
  const { data, error } = await sb.rpc(fn, args);
  if (error) { toast(msg(error)); return { error }; }
  return { data };
};
const typing = () => {
  const a = document.activeElement;
  return a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.id !== "ci";
};
const iso = () => new Date().toISOString();

export const mJob = (r) => ({
  id: r.id, eid: r.employer_id, kind: r.kind, t: r.title, x: r.description, pay: r.pay, slots: r.slots, taken: r.slots_taken,
  hrs: r.work_hours, rev: r.max_revisions, acc: r.access, bd: r.badges || [], st: r.status, closes: r.closes_at, at: r.created_at,
  emp: r.employer?.name || S.e.name || "",
});
export const live = (j) => j.st === "open" && new Date(j.closes) > Date.now();
const mClaim = (r) => ({
  id: r.id, jid: r.job_id, wid: r.worker_id, st: r.status, at: r.claimed_at, due: r.due_at, sub: r.submitted_at, dec: r.decided_at,
  ru: r.revisions_used, rl: r.result_link, rp: r.result_path, rn: r.result_name, note: r.result_note,
  job: r.job ? mJob(r.job) : null, wn: r.worker?.name || "", wk: r.worker?.kota || "", ws: r.worker?.status_now || "",
});
export const jobOf = (c) => c.job || S.jobs.find((j) => j.id === c.jid) || S.jx;
export const activeClaim = () => S.claims.find((c) => c.st === "working" || c.st === "revision");
export const earned = () => S.claims.filter((c) => c.st === "approved").reduce((a, c) => a + (c.job?.pay || 0), 0);

/* ---------- muat data ---------- */
let lastSweep = 0;
export async function loadAll() {
  if (Date.now() - lastSweep > 30000) { lastSweep = Date.now(); await sb.rpc("sweep"); }
  const nq = q(sb.from("notifications").select("*").order("created_at", { ascending: false }).limit(30));
  if (S.role === "worker") {
    const [c, f, n, b] = await Promise.all([
      q(sb.from("claims").select("*, job:jobs(*, employer:employer_profiles(name))").order("claimed_at", { ascending: false })),
      q(sb.from("jobs").select("*, employer:employer_profiles(name)").eq("status", "open").gt("closes_at", iso()).not("funded_at", "is", null).order("created_at", { ascending: false }).limit(60)),
      nq,
      q(sb.from("worker_badges").select("code").eq("user_id", S.me)),
    ]);
    S.claims = c.map(mClaim);
    const mine = new Set(S.claims.map((x) => x.jid));
    S.feed = f.map(mJob).filter((j) => j.taken < j.slots && !mine.has(j.id));
    S.nts = n;
    S.myB = b.map((x) => x.code);
  } else {
    const [j, c, n, wb] = await Promise.all([
      q(sb.from("jobs").select("*").eq("employer_id", S.me).order("created_at", { ascending: false })),
      q(sb.from("claims").select("*, worker:worker_profiles(name,kota,status_now)").order("claimed_at", { ascending: false })),
      nq,
      q(sb.from("worker_badges").select("user_id,code")),
    ]);
    S.jobs = j.map(mJob);
    S.claims = c.map(mClaim);
    S.nts = n;
    S.wb = wb;
  }
  const paths = S.claims.map((c) => c.rp).filter(Boolean);
  if (paths.length) {
    const { data } = await sb.storage.from("hasil").createSignedUrls(paths, 3600);
    (data || []).forEach((x) => (S.urls[x.path] = x.signedUrl));
  }
}
export async function loadBadges() {
  S.badges = await q(sb.from("badges").select("code,name,info").order("name"));
}
export async function jobById(id) {
  const k = [...S.feed, ...S.jobs, ...S.claims.map((c) => c.job)].find((j) => j && j.id === id);
  if (k) return k;
  const { data } = await sb.from("jobs").select("*, employer:employer_profiles(name)").eq("id", id).maybeSingle();
  return data ? mJob(data) : null;
}
const loadDetail = async (jid) => {
  const { data } = await sb.from("job_details").select("instructions,link_url").eq("job_id", jid).maybeSingle();
  S.det[jid] = data || null;
};
export async function loadMsgs() {
  if (!S.cid) return;
  const d = await q(sb.from("messages").select("id,sender_id,body,created_at").eq("claim_id", S.cid).order("id"));
  S.msgs = d.map((m) => ({ id: m.id, me: m.sender_id === S.me, t: m.body, at: m.created_at }));
  const v = $("#ci")?.value;
  R();
  if (v && $("#ci")) { $("#ci").value = v; $("#ci").focus(); }
}

/* ---------- buka halaman (dipakai juga saat tombol Back) ---------- */
export async function openJobData() {
  S.jx = await jobById(S.jid);
  if (S.jx && !S.det[S.jid] && (S.jx.eid === S.me || S.claims.some((c) => c.jid === S.jid))) await loadDetail(S.jid);
  R();
}
export function openJob(id) { nav({ view: "job", jid: id }); openJobData(); }
export async function openClaimData() {
  const c = S.claims.find((x) => x.id === S.cid);
  S.msgs = [];
  if (c) await loadDetail(c.jid);
  await loadMsgs();
}
export function openClaim(id) { nav({ view: "claim", cid: id }); openClaimData(); }

/* ---------- aksi pekerja ---------- */
export function claimTap(id) {
  if (S.busy) return;
  const seen = (() => { try { return localStorage.getItem("st_rules"); } catch { return 1; } })();
  if (!seen) { S.sh = { k: "rules", id }; return R(); }
  claim(id);
}
export function confirmRules(id) {
  try { localStorage.setItem("st_rules", "1"); } catch {}
  claim(id);
}
export function badgeInfo(id) {
  const j = [...S.feed, S.jx].find((x) => x && x.id === id);
  S.sh = { k: "badge", codes: j ? j.bd : [] };
  R();
}
export async function claim(id) {
  S.busy = 1;
  const { data, error } = await rpc("claim_job", { p_job: id });
  S.busy = 0;
  if (error) { S.sh = null; await loadAll(); return R(); }
  await loadAll();
  nav({ view: "claim", cid: data, tab: "feed", jid: null });
  toast("Slot jadi milikmu. Waktu kerja mulai berjalan.");
  openClaimData();
}
export const askRelease = (cid) => { S.sh = { k: "release", cid }; R(); };
export async function doRelease(cid) {
  const { error } = await rpc("release_claim", { p_claim: cid });
  S.sh = null;
  await loadAll();
  if (!error) { nav({ view: "main", cid: null, tab: "feed" }); toast("Slot dilepas."); } else R();
}
const shrink = (f) => new Promise((ok, no) => {
  const im = new Image(), u = URL.createObjectURL(f);
  im.onload = () => {
    const k = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement("canvas");
    c.width = im.width * k; c.height = im.height * k;
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u);
    c.toBlob((b) => (b ? ok(b) : no(new Error("Gagal memproses gambar"))), "image/jpeg", 0.82);
  };
  im.onerror = () => no(new Error("File gambar tidak terbaca"));
  im.src = u;
});
const BADX = /\.(exe|bat|cmd|msi|apk|sh|jar|scr|com|vbs|ps1|dll)$/i;
export async function submitResult() {
  const c = S.claims.find((x) => x.id === S.cid), f = $("#rf")?.files[0], link = $("#rl").value.trim(), note = $("#rn").value.trim();
  if (!f && !link) return toast(ERR.KOSONG);
  if (link && !/^https?:\/\/\S+$/.test(link)) return toast(ERR.LINK);
  if (f && f.size > 10485760) return toast("File maksimal 10 MB.");
  if (f && BADX.test(f.name)) return toast("Jenis file ini tidak diizinkan.");
  const b = $("#rb");
  b.disabled = true; b.textContent = "Mengirim…";
  try {
    let path = null, name = null;
    if (f) {
      const img = f.type.startsWith("image/"), safe = (f.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-60) || "berkas") + (img && !/\.jpe?g$/i.test(f.name) ? ".jpg" : "");
      path = c.id + "/" + Date.now() + "-" + safe;
      const body = img ? await shrink(f) : f;
      const u = await sb.storage.from("hasil").upload(path, body, { contentType: img ? "image/jpeg" : f.type || "application/octet-stream" });
      if (u.error) throw u.error;
      name = f.name;
    }
    const { error } = await sb.rpc("submit_result", { p_claim: c.id, p_link: link || null, p_path: path, p_name: name, p_note: note || null });
    if (error) throw error;
    await loadAll(); R();
    toast("Hasil terkirim. Menunggu ditinjau.");
  } catch (e) {
    toast(msg(e));
    b.disabled = false; b.textContent = "Kirim hasil";
  }
}

/* ---------- aksi pemberi kerja ---------- */
export const tpl = (k) => {
  const t = TPL[k];
  Object.assign(S.jf, { kind: k, t: t.t, x: t.x, ins: t.ins, pay: t.pay, slots: t.slots, hrs: t.hrs, rev: t.rev });
  R();
};
export const tjb = (c) => {
  const a = S.jf.bd, i = a.indexOf(c);
  if (i >= 0) a.splice(i, 1);
  else if (a.length >= 3) return toast("Maksimal 3 badge.");
  else a.push(c);
  R();
};
export function askPost() {
  const f = S.jf;
  if (f.t.trim().length < 5) return toast("Judul minimal 5 karakter.");
  if (f.x.trim().length < 20) return toast("Deskripsi minimal 20 karakter.");
  if (!(f.pay >= 5000 && f.pay <= 500000)) return toast("Bayaran per orang Rp 5.000 sampai Rp 500.000.");
  if (!(f.slots >= 1 && f.slots <= 200)) return toast("Jumlah orang 1 sampai 200.");
  if (f.link.trim() && !/^https?:\/\/\S+$/.test(f.link.trim())) return toast(ERR.LINK);
  if (f.acc === "badge" && !f.bd.length) return toast("Pilih minimal satu badge, atau ubah akses jadi Terbuka.");
  S.sh = { k: "qris" };
  R();
}
export async function confirmPost() {
  const f = S.jf;
  S.busy = 1; R();
  const { data, error } = await rpc("post_job", {
    p_kind: f.kind, p_title: f.t, p_desc: f.x, p_instr: f.ins, p_link: f.link, p_pay: f.pay, p_slots: f.slots,
    p_hours: f.hrs, p_rev: f.rev, p_access: f.acc, p_badges: f.acc === "badge" ? f.bd : [], p_open_hours: f.open,
  });
  S.busy = 0; S.sh = null;
  if (error) return R();
  S.jf = freshJF(); clearDraft();
  await loadAll();
  nav({ tab: "mine", view: "job", jid: data });
  openJobData();
  toast("Tugas tayang. Slot langsung bisa diambil.");
}
export async function repost(id) {
  const j = await jobById(id);
  await loadDetail(id);
  const d = S.det[id];
  S.jf = { ...freshJF(), kind: j.kind, t: j.t, x: j.x, ins: d?.instructions || "", link: d?.link_url || "", pay: j.pay, slots: j.slots, hrs: j.hrs, rev: j.rev, acc: j.acc, bd: [...j.bd] };
  nav({ tab: "post", view: "main", jid: null });
  toast("Tugas disalin. Cek lalu terbitkan lagi.");
}
export async function setJobStatus(id, st) {
  const { error } = await rpc("set_job_status", { p_job: id, p_status: st });
  if (error) return;
  await loadAll(); R();
  toast(st === "open" ? "Tugas dibuka lagi." : "Tugas ditutup. Tidak muncul untuk pekerja baru.");
}
export async function approve(cid) {
  const { error } = await rpc("review_claim", { p_claim: cid, p_action: "approve" });
  if (error) return;
  await loadAll(); R();
  toast("Hasil diterima dan dana dicairkan.");
}
export const askRevise = (cid) => { S.sh = { k: "revise", cid }; R(); };
export async function doRevise(cid) {
  const { error } = await rpc("review_claim", { p_claim: cid, p_action: "revise", p_note: $("#rv").value });
  if (error) return;
  S.sh = null;
  await loadAll(); await loadMsgs();
  toast("Permintaan revisi terkirim.");
}

/* ---------- chat & notifikasi ---------- */
export async function sendMsg() {
  const v = $("#ci").value.trim();
  if (!v) return;
  const { error } = await sb.from("messages").insert({ claim_id: S.cid, sender_id: S.me, body: v });
  if (error) return toast(msg(error));
  $("#ci").value = "";
  await loadMsgs();
}
export async function openNote(id) {
  const n = S.nts.find((x) => x.id === id);
  if (!n) return;
  if (!n.read) { n.read = true; sb.from("notifications").update({ read: true }).eq("id", id).then(() => {}); }
  if (n.claim_id && S.claims.some((c) => c.id === n.claim_id)) return openClaim(n.claim_id);
  if (n.job_id) return S.role === "employer" ? (nav({ tab: "mine" }), openJob(n.job_id)) : openJob(n.job_id);
  R();
}
export async function readAll() {
  S.nts.forEach((n) => (n.read = true));
  R();
  await sb.from("notifications").update({ read: true }).eq("user_id", S.me).eq("read", false);
}

/* ---------- realtime ---------- */
let tm;
export function listen() {
  if (S.live) return;
  S.live = true;
  const refresh = () => {
    clearTimeout(tm);
    tm = setTimeout(async () => { await loadAll(); if (!typing()) R(); }, 300);
  };
  sb.channel("rt")
    .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, (p) => {
      const j = p.new;
      if (p.eventType === "INSERT" && S.role === "worker" && S.scr === "app" && j.funded_at)
        toast("Tugas baru · " + rp(j.pay) + " · " + j.title);
      refresh();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "claims" }, refresh)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: "user_id=eq." + S.me }, (p) => { toast(p.new.title); refresh(); })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => { if (p.new.claim_id === S.cid) loadMsgs(); })
    .subscribe();
}

/* ---------- akun ---------- */
export async function doAuth() {
  const email = $("#em").value.trim(), password = $("#pw").value, reg = S.am === "daftar";
  if (!/^\S+@\S+\.\S+$/.test(email)) return toast("Format email belum benar.");
  if (password.length < 6) return toast("Kata sandi minimal 6 karakter.");
  const b = $("#ab");
  b.disabled = true;
  if (!reg) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      b.disabled = false;
      return toast(/confirm/i.test(error.message) ? "Email belum dikonfirmasi. Cek kotak masuk." : /invalid/i.test(error.message) ? "Email atau kata sandi salah. Belum punya akun? Pilih Daftar." : error.message);
    }
  } else {
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { role: S.role } } });
    if (error) { b.disabled = false; return toast(error.message); }
    if (data.user?.identities && !data.user.identities.length) { b.disabled = false; return toast("Email sudah terdaftar. Pilih Masuk."); }
    if (!data.session) { b.disabled = false; return toast("Akun dibuat. Buka email untuk konfirmasi, lalu masuk."); }
  }
  await boot();
}
export async function boot() {
  loadBadges().then(() => S.scr === "landing" || R());
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return false;
  S.me = session.user.id;
  let { data: p } = await sb.from("profiles").select("role").eq("id", S.me).maybeSingle();
  if (!p) {
    p = { role: session.user.user_metadata?.role === "employer" ? "employer" : "worker" };
    await sb.from("profiles").insert({ id: S.me, role: p.role });
  }
  S.role = p.role;
  const t = S.role === "worker" ? "worker_profiles" : "employer_profiles";
  const { data: r } = await sb.from(t).select("*").eq("user_id", S.me).maybeSingle();
  if (r) { Object.assign(S.role === "worker" ? S.w : S.e, r); S.ob = 1; }
  if (S.ob) { await loadAll(); listen(); }
  S.scr = S.ob ? "app" : "onb";
  S.tab = S.role === "worker" ? "feed" : "mine";
  S.view = "main";
  R();
  return true;
}
export async function saveProfile() {
  const w = S.role === "worker", o = w ? S.w : S.e;
  const row = w
    ? { user_id: S.me, name: S.w.name.trim(), kota: S.w.kota.trim(), status_now: S.w.status_now }
    : { user_id: S.me, name: S.e.name.trim(), jenis: S.e.jenis, kota: S.e.kota.trim() };
  if (row.name.length < 2 || row.kota.length < 2) return toast("Isi nama dan kota (minimal 2 huruf).");
  const { error } = await sb.from(w ? "worker_profiles" : "employer_profiles").upsert(row);
  if (error) return toast(msg(error));
  o.name = row.name; o.kota = row.kota;
  const first = !S.ob;
  S.ob = 1; clearDraft();
  await loadAll(); listen();
  nav({ scr: "app", tab: w ? "feed" : first ? "post" : "mine", view: "main" });
}
export async function logout() {
  await sb.auth.signOut();
  location.href = location.pathname;
}
export const catName = (k) => CAT[k]?.[0] || k;
