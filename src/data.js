import { sb } from "./supabase.js";
import { $, toast } from "./ui.js";
import { S } from "./state.js";
import { pct, pctW } from "./matching.js";
import { R } from "./router.js";

const q = async (p) => {
  const { data, error } = await p;
  if (error) toast(error.message);
  return data || [];
};
const mJob = (r) => ({
  id: r.id,
  eid: r.employer_id,
  t: r.title,
  o: r.employer?.name || "-",
  s: r.skills,
  b: r.budget,
  d: r.days,
  r: r.max_revisions,
  x: r.description || "",
  bd: r.bidang || [],
  dv: r.deliverables || "",
  lv: r.level_needed,
});
const mWorker = (r) => ({
  id: r.user_id,
  n: r.name,
  b: r.bidang || "-",
  s: r.skills,
  min: r.min_pay || 0,
  j: (r.jam || 0) + " jam/minggu",
  x: r.bio || r.org || r.task || "-",
  r,
});
const mMsg = (x) => ({
  f: x.is_system ? "sys" : x.sender_id === S.me ? "me" : "o",
  t: x.body,
});
const fmt = (t) =>
  new Date(t).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
const mNt = (m, ms, lg) => {
  const w = S.role === "worker";
  return {
    id: m.id,
    r: S.role,
    u: w ? m.worker_unread : m.employer_unread,
    title: w ? m.job.title : m.worker.name,
    who: w ? m.job.employer.name : m.worker.bidang,
    b: m.budget,
    d: m.days,
    rv: m.max_revisions,
    dp: m.dp_pct,
    v: m.version,
    wo: m.worker_ok_ver,
    eo: m.employer_ok_ver,
    pk: w ? "e" : "w",
    pid: w ? m.job.employer_id : m.worker_id,
    pct: m.pct,
    job: m.job.title,
    st: m.status,
    rev: m.revisions_used,
    at: m.agreed_at,
    fin: m.completed_at,
    dec: m.status === "agreed" || m.status === "completed" ? "ok" : "",
    m: ms.map(mMsg),
    lg,
  };
};

/* ambil semua data yang terkait user ini */
export async function loadAll() {
  const w = S.role === "worker";
  const all = await q(
      sb
        .from("matches")
        .select(
          "*, job:jobs(title,employer_id,employer:employer_profiles(name)), worker:worker_profiles(name,bidang)",
        )
        .order("created_at", { ascending: false }),
    ),
    ms = all.filter((m) => m.status !== "rejected"),
    ids = ms.map((m) => m.id);
  const msgs = ids.length
    ? await q(
        sb.from("messages").select("*").in("match_id", ids).order("created_at"),
      )
    : [];
  const lgs = ids.length
      ? await q(
          sb
            .from("progress_logs")
            .select("*")
            .in("match_id", ids)
            .order("created_at"),
        )
      : [],
    urls = {},
    paths = lgs.flatMap((x) => [x.image_path, x.file_path]).filter(Boolean);
  if (paths.length) {
    const { data } = await sb.storage
      .from("bukti")
      .createSignedUrls(paths, 3600);
    (data || []).forEach((x) => (urls[x.path] = x.signedUrl));
  }
  S.nt = ms.map((m) =>
    mNt(
      m,
      msgs.filter((x) => x.match_id === m.id),
      lgs
        .filter((x) => x.match_id === m.id)
        .map((x) => ({
          p: x.pct,
          d: fmt(x.created_at),
          n: x.note || "",
          i: urls[x.image_path] || "",
          f: urls[x.file_path] || "",
          fn: x.file_name || "",
          l: x.link_url || "",
        })),
    ),
  );
  S.cps = S.nt.filter((n) => n.dec === "ok");
  if (w) {
    const taken = new Set(all.map((m) => m.job_id));
    S.jobs = (
      await q(
        sb
          .from("jobs")
          .select("*, employer:employer_profiles(name)")
          .eq("status", "open"),
      )
    )
      .filter((j) => !taken.has(j.id))
      .map(mJob)
      .sort((a, b) => pct(b) - pct(a));
  } else {
    S.myJobs = (
      await q(
        sb
          .from("jobs")
          .select("*, employer:employer_profiles(name)")
          .eq("employer_id", S.me)
          .eq("status", "open"),
      )
    ).map(mJob);
    const j0 = S.myJobs[0],
      taken = new Set(
        all.filter((m) => m.job_id === j0?.id).map((m) => m.worker_id),
      );
    S.ws = (await q(sb.from("worker_profiles").select("*")))
      .filter((x) => !taken.has(x.user_id))
      .map(mWorker)
      .sort((a, b) => pctW(b) - pctW(a));
  }
}

export async function sendMsg(id, body) {
  const { error } = await sb
    .from("messages")
    .insert({ match_id: id, sender_id: S.me, body, is_system: false });
  if (error) {
    toast(error.message);
    return false;
  }
  await sb
    .from("matches")
    .update({
      [S.role === "worker" ? "employer_unread" : "worker_unread"]: true,
    })
    .eq("id", id);
  return true;
}

/* swipe kanan / tombol Daftar-Undang -> negosiasi baru (belum ada kerja sama sampai KEDUA pihak setuju) */
export async function createMatch(i) {
  const w = S.role === "worker",
    x = (w ? S.jobs : S.ws)[i],
    job = w ? x : S.myJobs[0];
  if (!x) return false;
  if (!job) {
    toast("Pasang pekerjaan dulu di tab Profil.");
    return false;
  }
  const { error } = await sb.from("matches").insert({
    job_id: job.id,
    worker_id: w ? S.me : x.id,
    initiated_by: S.role,
    pct: w ? pct(x) : pctW(x),
    budget: job.b,
    days: job.d,
    max_revisions: job.r,
  });
  if (error) {
    toast(
      error.code === "23505"
        ? "Sudah pernah diproses untuk pekerjaan ini."
        : error.message,
    );
    return false;
  }
  await loadAll();
  return true;
}

export async function postJob() {
  const f = S.jf,
    t = f.t.trim(),
    x = f.x.trim();
  if (t.length < 5) return toast("Judul minimal 5 karakter.");
  if (!f.bd.length) return toast("Pilih 1 sampai 2 bidang.");
  if (!f.s.length) return toast("Pilih minimal satu kemampuan.");
  if (x.length < 30)
    return toast(
      "Deskripsi minimal 30 karakter supaya pekerja paham tugasnya.",
    );
  if (!(f.b >= 15000 && f.b <= 300000))
    return toast("Honor harus antara Rp 15.000 dan Rp 300.000.");
  if (!(f.d >= 1 && f.d <= 60) || !(f.r >= 0 && f.r <= 5))
    return toast("Tenggat 1-60 hari, revisi 0-5.");
  const { error } = await sb.from("jobs").insert({
    employer_id: S.me,
    title: t,
    description: x,
    deliverables: f.dv.trim() || null,
    bidang: f.bd,
    skills: f.s,
    level_needed: f.lv,
    budget: f.b,
    days: f.d,
    max_revisions: f.r,
  });
  if (error) return toast(error.message);
  Object.assign(S.jf, { t: "", x: "", dv: "", bd: [], s: [] });
  await loadAll();
  R();
  toast("Pekerjaan dipasang.");
}

const WF = [
    "name",
    "bidang",
    "skills",
    "lv",
    "tools",
    "org",
    "task",
    "hari",
    "speed",
    "gaya",
    "tes",
    "why",
    "kota",
    "bio",
    "school",
    "major",
    "edu_level",
    "status_now",
    "certs",
    "links",
    "langs",
  ],
  EF = ["name", "jenis", "need", "budget", "kota", "about", "links"];
const pick = (o, a) =>
  Object.fromEntries(
    a.map((k) => [k, typeof o[k] === "string" ? o[k].trim() : o[k]]),
  );
export async function saveProfile() {
  let e;
  if (S.role === "worker") {
    const w = S.w;
    ({ error: e } = await sb.from("worker_profiles").upsert({
      user_id: S.me,
      ...pick(w, WF),
      jam: +w.jam,
      min_pay: +w.min,
      grad_year: +w.grad_year || null,
    }));
  } else
    ({ error: e } = await sb
      .from("employer_profiles")
      .upsert({ user_id: S.me, ...pick(S.e, EF) }));
  if (e) return toast(e.message);
  S.ob[S.role] = 1;
  await loadAll();
  listen();
  S.tab = "home";
  S.scr = "app";
  R();
  scrollTo(0, 0);
}

/* realtime: pesan atau perubahan kontrak dari pihak lain langsung muncul */
let live = false,
  tm;
export function listen() {
  if (live) return;
  live = true;
  const run = async () => {
    await loadAll();
    const a = document.activeElement;
    if (
      S.scr !== "app" ||
      S.edit ||
      (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.id !== "ci")
    )
      return;
    const v = $("#ci")?.value;
    R();
    if (v && $("#ci")) {
      $("#ci").value = v;
      $("#ci").focus();
    }
  };
  const refresh = () => {
    clearTimeout(tm);
    tm = setTimeout(run, 300);
  };
  sb.channel("rt")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      refresh,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "matches" },
      refresh,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "progress_logs" },
      refresh,
    )
    .subscribe();
}

/* auth: tab Masuk dan Daftar terpisah */
export async function doAuth() {
  const email = $("#em").value.trim(),
    password = $("#pw").value,
    reg = S.am === "daftar";
  if (!/^\S+@\S+\.\S+$/.test(email)) return toast("Format email belum benar.");
  if (password.length < 6) return toast("Kata sandi minimal 6 karakter.");
  if (!reg) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error)
      return toast(
        /confirm/i.test(error.message)
          ? "Email belum dikonfirmasi. Cek kotak masuk."
          : /invalid/i.test(error.message)
            ? "Email atau kata sandi salah. Belum punya akun? Pilih tab Daftar."
            : error.message,
      );
  } else {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { role: S.role } },
    });
    if (error) return toast(error.message);
    if (data.user && data.user.identities && !data.user.identities.length)
      return toast("Email sudah terdaftar. Pilih tab Masuk.");
    if (!data.session)
      return toast("Akun dibuat. Buka email untuk konfirmasi, lalu masuk.");
  }
  await boot();
}

export async function boot() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session) return false;
  S.me = session.user.id;
  const { data: p } = await sb
    .from("profiles")
    .select("role")
    .eq("id", S.me)
    .maybeSingle();
  if (p) S.role = p.role;
  else {
    const { error } = await sb
      .from("profiles")
      .insert({ id: S.me, role: S.role });
    if (error) {
      toast(error.message);
      return false;
    }
  }
  if (S.role === "worker") {
    const { data: w } = await sb
      .from("worker_profiles")
      .select("*")
      .eq("user_id", S.me)
      .maybeSingle();
    if (w) {
      WF.forEach((k) => (S.w[k] = w[k] ?? S.w[k]));
      Object.assign(S.w, {
        min: w.min_pay,
        jam: w.jam,
        grad_year: w.grad_year || "",
        ids: w.id_status,
      });
      S.ob.worker = 1;
    }
  } else {
    const { data: e } = await sb
      .from("employer_profiles")
      .select("*")
      .eq("user_id", S.me)
      .maybeSingle();
    if (e) {
      EF.forEach((k) => (S.e[k] = e[k] ?? S.e[k]));
      S.e.ids = e.id_status;
      S.ob.employer = 1;
    }
  }
  if (S.ob[S.role]) {
    await loadAll();
    listen();
  }
  S.scr = S.ob[S.role] ? "app" : "onb";
  S.tab = "home";
  R();
  return true;
}

export async function logout() {
  await sb.auth.signOut();
  location.reload();
}

/* ---- kerja sama: bukti progres, revisi, terima hasil (pesan sistem dibuat server) ---- */
const shrink = (f) =>
  new Promise((ok, no) => {
    const im = new Image(),
      u = URL.createObjectURL(f);
    im.onload = () => {
      const k = Math.min(1, 1280 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = im.width * k;
      c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(u);
      c.toBlob(
        (b) => (b ? ok(b) : no(new Error("Gagal memproses foto"))),
        "image/jpeg",
        0.82,
      );
    };
    im.onerror = () => no(new Error("File bukan gambar"));
    im.src = u;
  });
const cur = () => S.nt.find((x) => x.id === S.cp);
const put = async (path, blob, type) => {
  const u = await sb.storage
    .from("bukti")
    .upload(path, blob, { contentType: type });
  if (u.error) throw u.error;
  return path;
};
const ins = async (row) => {
  const r = await sb
    .from("progress_logs")
    .insert({ match_id: cur().id, created_by: S.me, ...row });
  if (r.error) throw r.error;
};
/* foto progres sebelum 100% */
export async function postProgress() {
  const n = cur(),
    f = $("#pf").files[0],
    p = +$("#pp").value,
    note = $("#pn").value.trim(),
    last = n.lg.at(-1)?.p || 0;
  if (!f) return toast("Pilih foto bukti dulu.");
  if (!(p > last && p <= 99))
    return toast(
      "Progres harus lebih dari " +
        last +
        "% dan maksimal 99%. Untuk 100% gunakan Serahkan hasil kerja.",
    );
  const b = $("#pb");
  b.disabled = true;
  b.textContent = "Mengunggah…";
  try {
    await ins({
      pct: p,
      note,
      image_path: await put(
        n.id + "/" + Date.now() + ".jpg",
        await shrink(f),
        "image/jpeg",
      ),
    });
    await loadAll();
    R();
    toast("Bukti terunggah.");
  } catch (e) {
    toast("Gagal: " + e.message);
    b.disabled = false;
    b.textContent = "Unggah bukti";
  }
}
/* serahkan HASIL KERJA (100%): file dan/atau tautan */
export async function postDelivery() {
  const n = cur(),
    f = $("#df").files[0],
    link = $("#dl").value.trim(),
    note = $("#dn").value.trim();
  if (!f && !link)
    return toast("Unggah file hasil kerja atau tempel tautannya.");
  if (link && !/^https?:\/\/\S+$/.test(link))
    return toast("Tautan harus diawali http:// atau https://");
  if (f && f.size > 10485760) return toast("File maksimal 10 MB.");
  const b = $("#db");
  b.disabled = true;
  b.textContent = "Mengirim…";
  try {
    const row = { pct: 100, note };
    if (f) {
      const ext =
        (f.name.split(".").pop() || "bin")
          .replace(/[^a-z0-9]/gi, "")
          .slice(0, 8) || "bin";
      row.file_path = await put(
        n.id + "/h-" + Date.now() + "." + ext,
        f,
        f.type || "application/octet-stream",
      );
      row.file_name = f.name.slice(0, 120);
    }
    if (link) row.link_url = link;
    await ins(row);
    await loadAll();
    R();
    toast("Hasil kerja terkirim ke pemberi kerja.");
  } catch (e) {
    toast("Gagal: " + e.message);
    b.disabled = false;
    b.textContent = "Kirim hasil kerja";
  }
}
export async function requestRevision() {
  const n = cur();
  if (n.rev >= n.rv) return;
  const { error } = await sb
    .from("matches")
    .update({ revisions_used: n.rev + 1 })
    .eq("id", n.id);
  if (error) return toast(error.message);
  await loadAll();
  R();
  toast("Revisi diajukan");
}
export async function acceptWork() {
  const n = cur(),
    { error } = await sb
      .from("matches")
      .update({ status: "completed" })
      .eq("id", n.id);
  if (error) return toast(error.message);
  await loadAll();
  R();
  toast("Sisa dana dicairkan ke pekerja");
}

/* ---- lihat profil orang lain: k = 'w' (pekerja) / 'e' (pemberi kerja) ---- */
export async function openProf(k, id) {
  S.pb = S.view;
  S.pv = { k, id, r: null };
  S.view = "prof";
  R();
  scrollTo(0, 0);
  const { data, error } = await sb
    .from(k === "w" ? "worker_profiles" : "employer_profiles")
    .select("*")
    .eq("user_id", id)
    .maybeSingle();
  if (error || !data) {
    S.view = S.pb;
    R();
    return toast("Profil tidak bisa dibuka.");
  }
  S.pv.r = data;
  R();
}
/* ---- verifikasi identitas: foto privat, NOMOR dokumen tidak disimpan ---- */
export async function uploadId() {
  const f = $("#idf").files[0],
    ty = $("#idt").value;
  if (!f) return toast("Pilih foto dokumen dulu.");
  const b = $("#idb");
  b.disabled = true;
  b.textContent = "Mengunggah…";
  try {
    const path = S.me + "/" + Date.now() + ".jpg",
      u = await sb.storage
        .from("identitas")
        .upload(path, await shrink(f), { contentType: "image/jpeg" });
    if (u.error) throw u.error;
    const r = await sb
      .from(S.role === "worker" ? "worker_profiles" : "employer_profiles")
      .update({ id_type: ty, id_path: path })
      .eq("user_id", S.me);
    if (r.error) throw r.error;
    (S.role === "worker" ? S.w : S.e).ids = "diajukan";
    R();
    toast("Dokumen terkirim. Kami cek manual.");
  } catch (e) {
    toast("Gagal: " + e.message);
    b.disabled = false;
    b.textContent = "Kirim untuk verifikasi";
  }
}
