import { $, HDR, LOGO, AV } from "./ui.js";
import { ico } from "./icons.js";
import { S, unread, persist } from "./state.js";
import { vLand } from "./views/landing.js";
import { vAuth } from "./views/auth.js";
import { vOnb } from "./views/onboarding.js";
import { vFeed } from "./views/feed.js";
import { vMine } from "./views/mine.js";
import { vJob } from "./views/job.js";
import { vPost } from "./views/post.js";
import { vClaim } from "./views/claim.js";
import { vNotif } from "./views/notif.js";
import { vMe } from "./views/profile.js";
import { vSheet } from "./views/sheets.js";

/* ---------- navigasi + riwayat browser: tombol Back selalu kembali ke layar sebelumnya ---------- */
const home = () => (S.role === "worker" ? "feed" : "mine");
const snap = () => ({ scr: S.scr, tab: S.tab, view: S.view, jid: S.jid, cid: S.cid, am: S.am, role: S.role });
let last = "", depth = 0, popping = false;

function guard() {
  if (!S.me && (S.scr === "app" || S.scr === "onb")) S.scr = "landing";
  if (S.me && S.scr === "auth") S.scr = S.ob ? "app" : "onb";
  if (S.me && S.scr === "app" && !S.ob) S.scr = "onb";
  const ok = S.role === "worker" ? ["feed", "mine", "me", "notif"] : ["mine", "post", "me", "notif"];
  if (!ok.includes(S.tab)) S.tab = home();
  if (S.view === "claim" && !S.cid) S.view = "main";
  if (S.view === "job" && !S.jid) S.view = "main";
}
function sync() {
  const s = snap(), k = JSON.stringify(s);
  if (k === last) return;
  if (!popping) {
    const h = "#/" + [s.scr, s.scr === "app" ? s.tab : "", s.scr === "app" ? s.view : ""].filter(Boolean).join("/");
    if (last === "") history.replaceState({ s, n: 0 }, "", h);
    else history.pushState({ s, n: ++depth }, "", h);
  }
  last = k;
}
addEventListener("popstate", (e) => {
  if (!e.state?.s) return;
  depth = e.state.n || 0;
  popping = true;
  Object.assign(S, e.state.s);
  S.sh = null;
  guard();
  R();
  popping = false;
  if (S.view === "claim") window.openClaimData?.();
  if (S.view === "job") window.openJobData?.();
});

export const nav = (p) => { Object.assign(S, { sh: null }, p); R(); scrollTo(0, 0); };
export const back = (fallback) => (history.state?.n > 0 ? history.back() : nav(fallback || { view: "main", cid: null, jid: null }));
export const go = (s) => nav({ scr: s });
export const start = (r) => nav({ role: r, am: "daftar", scr: "auth" });
export const login = () => nav({ am: "login", scr: "auth" });
export const goTab = (t) => nav({ tab: t, view: "main", cid: null, jid: null });
export const closeSheet = () => { S.sh = null; R(); };

/* ---------- kerangka aplikasi ---------- */
const TABS = (w) => (w
  ? [["feed", "search", "Tugas"], ["mine", "briefcase", "Tugasku"], ["me", "user", "Profil"]]
  : [["mine", "briefcase", "Tugas saya"], ["post", "plus", "Pasang"], ["me", "user", "Profil"]]);

const hdr = () => {
  const u = unread(), name = S.role === "worker" ? S.w.name : S.e.name, bell = S.tab === "notif";
  return HDR(
    `<span class="lg:hidden">${LOGO}</span><span class="hidden lg:block"></span>
<div class="flex items-center gap-2"><button aria-label="Notifikasi${u ? ", " + u + " baru" : ""}" class="relative grid h-11 w-11 place-items-center rounded-full bg-soft text-pri transition hover:brightness-95 ${bell ? "ring-2 ring-pri" : ""}" onclick="goTab('notif')">${ico("bell")}${u ? `<span class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-yel px-1 text-[11px] font-extrabold text-[#0f1c2e] ring-2 ring-card">${u}</span>` : ""}</button>
<button aria-label="Profil saya" class="rounded-full transition hover:brightness-95" onclick="goTab('me')">${AV(name || "?", "h-11 w-11 text-sm rounded-full")}</button></div>`,
    "max-w-4xl",
  );
};

const navbar = () =>
  `<nav aria-label="Menu utama" class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:inset-y-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0 lg:bg-card lg:pb-0 lg:pt-7"><div class="hidden px-6 pb-7 lg:block">${LOGO}</div><div class="mx-auto flex max-w-xl justify-around px-2 py-1 lg:max-w-none lg:flex-col lg:justify-start lg:gap-1 lg:px-4 lg:py-0">${TABS(S.role === "worker")
    .map(([k, i, l]) => {
      const on = S.tab === k;
      return `<button aria-current="${on ? "page" : "false"}" class="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10.5px] font-bold whitespace-nowrap transition lg:min-h-12 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-sm ${on ? "text-pri lg:bg-soft" : "text-mut hover:text-ink lg:hover:bg-soft/60"}" onclick="goTab('${k}')"><span class="grid h-7 w-12 place-items-center rounded-full transition lg:h-auto lg:w-auto ${on ? "bg-soft lg:bg-transparent" : ""}">${ico(i, "h-[22px] w-[22px]")}</span><span>${l}</span></button>`;
    })
    .join("")}</div><p class="absolute inset-x-0 bottom-5 hidden px-6 text-xs text-mut lg:block">Prototipe MVP · ${S.role === "worker" ? "Pencari kerja" : "Pemberi kerja"}</p></nav>`;

const stickyCta = () => {
  const e = $("#sticky");
  if (e) e.classList.toggle("translate-y-full", scrollY < 560);
};
addEventListener("scroll", stickyCta, { passive: true });

export function R() {
  guard();
  let h;
  if (S.scr === "landing") h = vLand();
  else if (S.scr === "auth") h = vAuth();
  else if (S.scr === "onb") h = `${HDR(`${LOGO}<button class="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-mut hover:text-ink" onclick="${S.ob ? "back()" : "logout()"}">${S.ob ? "Batal" : "Keluar"}</button>`, "max-w-3xl")}<main class="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">${vOnb()}</main>`;
  else {
    const page = S.tab === "notif" ? vNotif() : S.view === "claim" ? vClaim() : S.view === "job" ? vJob() : { feed: vFeed, mine: vMine, post: vPost, me: vMe }[S.tab]();
    h = `<div class="lg:pl-64">${hdr()}<main class="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:max-w-4xl lg:pb-12 lg:pt-8">${page}</main></div>${navbar()}`;
  }
  $("#app").innerHTML = h + vSheet();
  stickyCta();
  const cb = $("#cb");
  if (cb) cb.scrollTop = cb.scrollHeight;
  sync();
  persist();
}
