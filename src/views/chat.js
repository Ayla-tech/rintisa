import {
  $,
  esc,
  rp,
  C,
  BP,
  BO,
  PL,
  OK,
  IN,
  MU,
  H1,
  AV,
  EMPTY,
  toast,
} from "../ui.js";
import { ico } from "../icons.js";
import { S } from "../state.js";
import { R } from "../router.js";
import { contractCard } from "./contract.js";
import { sb } from "../supabase.js";
import { sendMsg, loadAll } from "../data.js";

const lab = (n) =>
  n.dec === "ok"
    ? `<span class="${OK}">${ico("check", "h-3 w-3")}Disepakati</span>`
    : `<span class="${PL}">Menunggu persetujuan</span>`;
const who = (n) => (n.r === "worker" ? n.who : n.title);
export function vNotif() {
  const w = S.role === "worker",
    L = S.nt.filter((n) => n.r === S.role);
  return `<h1 class="${H1}">Notifikasi</h1><p class="${MU} mb-5 mt-1">Lamaran dan undangan muncul di sini. Kerja sama mulai setelah kedua pihak setuju.</p><div class="space-y-3">${L.map((n) => `<button class="relative flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-card ring-1 ring-line transition hover:shadow-lift" onclick="openChat('${n.id}')">${AV(who(n))}<span class="min-w-0 flex-1"><span class="flex items-center gap-2"><b class="truncate text-ink">${esc(n.title)}</b>${n.u ? `<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-yel ring-2 ring-card" aria-label="Baru"></span>` : ""}</span><span class="${MU} block truncate">${w ? "Dengan " + esc(n.who) + " · " + rp(n.b) : "Talenta · " + esc(n.who)}</span><span class="mt-2 flex flex-wrap gap-2"><span class="${PL}">${n.pct}% cocok</span>${lab(n)}</span></span></button>`).join("") || EMPTY("bell", "Belum ada notifikasi", "Lamar pekerjaan atau undang talenta untuk memulai.")}</div>`;
}
export async function openChat(id) {
  const n = S.nt.find((x) => x.id === id);
  n.u = false;
  sb.from("matches")
    .update({ [S.role + "_unread"]: false })
    .eq("id", id)
    .then(() => {});
  S.ch = id;
  S.edit = false;
  S.cf = false;
  S.view = "chat";
  R();
  scrollTo(0, 0);
}
export function vChatList() {
  const L = S.nt.filter((n) => n.r === S.role && n.m.length);
  return `<h1 class="${H1}">Chat</h1><p class="${MU} mb-5 mt-1">Percakapan dengan pihak yang kamu lamar atau undang.</p><div class="space-y-3">${L.map((n) => `<button class="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card ring-1 ring-line transition hover:shadow-lift" onclick="openChat('${n.id}')">${AV(who(n))}<span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-2"><b class="truncate text-ink">${esc(who(n))}</b>${lab(n)}</span><span class="${MU} block truncate">${esc(n.job)}</span><span class="block truncate text-sm text-ink/80">${esc(n.m[n.m.length - 1].t)}</span></span></button>`).join("") || EMPTY("chat", "Belum ada chat", "Lamar pekerjaan atau undang talenta untuk memulai.")}</div>`;
}
export async function snd() {
  const v = $("#ci").value.trim();
  if (!v) return;
  const n = S.nt.find((x) => x.id === S.ch);
  n.m.push({ f: "me", t: v });
  R();
  $("#ci").focus();
  if (!(await sendMsg(n.id, v))) {
    n.m.pop();
    R();
  }
}
export async function decide(v) {
  const n = S.nt.find((x) => x.id === S.ch),
    w = S.role === "worker",
    k = (w ? "worker" : "employer") + "_ok_ver";
  S.cf = false;
  const u =
    v === "ok"
      ? { [k]: n.v }
      : v === "undo"
        ? { [k]: 0 }
        : { status: "rejected" };
  const { error } = await sb.from("matches").update(u).eq("id", n.id);
  if (error) return toast(error.message);
  if (v === "no") {
    S.ch = null;
    S.view = "main";
    await loadAll();
    R();
    return toast("Negosiasi dibatalkan. Chat ditutup.");
  }
  await loadAll();
  R();
  const m = S.nt.find((x) => x.id === n.id);
  toast(
    m && m.dec === "ok"
      ? "Kedua pihak setuju. Kerja sama dimulai, lihat tab Kerja Sama."
      : v === "ok"
        ? "Persetujuanmu tercatat. Menunggu pihak lain."
        : "Persetujuan ditarik.",
  );
}
export function vChat() {
  const n = S.nt.find((x) => x.id === S.ch),
    w = S.role === "worker";
  return `<div class="mb-4 flex items-center gap-3"><button class="${BO} !min-h-11 !px-3" aria-label="Kembali" onclick="S.view='main';R()">${ico("back", "h-4 w-4")}</button>${AV(who(n), "h-11 w-11 text-base rounded-xl")}<div class="min-w-0 flex-1"><b class="block truncate text-ink">${esc(who(n))}</b><span class="${MU} block truncate">${esc(n.job)}</span></div><button class="${BO} !min-h-10 !px-3.5" onclick="openProf('${n.pk}','${n.pid}')">Lihat profil</button></div>
<div class="${C} !p-3 sm:!p-4"><div id="cb" class="flex h-[44vh] min-h-64 max-h-[30rem] flex-col gap-2 overflow-y-auto rounded-xl bg-bg p-3">${n.m.map((m) => (m.f === "sys" ? `<p class="self-center rounded-full bg-soft px-3 py-1 text-center text-xs text-mut">${esc(m.t)}</p>` : `<div class="max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm ${m.f === "me" ? "self-end rounded-br-sm bg-pri text-onpri" : "rounded-bl-sm bg-soft text-ink"}">${esc(m.t)}</div>`)).join("") || `<p class="${MU} m-auto text-center">Belum ada pesan. Sapa dulu dan bahas kontraknya.</p>`}</div><div class="mt-3 flex gap-2"><input id="ci" class="${IN}" maxlength="2000" placeholder="Tulis pesan" aria-label="Tulis pesan" onkeydown="if(event.key==='Enter')snd()"><button class="${BP} !px-4" aria-label="Kirim" onclick="snd()">${ico("send", "h-5 w-5")}</button></div></div>
${contractCard(n, w)}`;
}
