import { $, HDR, LOGO, AV } from "./ui.js";
import { ico } from "./icons.js";
import { S, unread } from "./state.js";
import { vLand } from "./views/landing.js";
import { vAuth } from "./views/auth.js";
import { vOnb } from "./views/onboarding.js";
import { vHome } from "./views/home.js";
import { vNotif, vChatList, vChat } from "./views/chat.js";
import { vCoop, vCoopD } from "./views/coop.js";
import { vMe, vProf } from "./views/profile.js";
import { vKontrak } from "./views/contract.js";
import { vJobs, vJob, vInvite } from "./views/jobs.js";

export const go = (s) => {
    S.scr = s;
    R();
    scrollTo(0, 0);
  },
  start = (r) => {
    S.role = r;
    S.am = "daftar";
    go("auth");
  },
  login = () => {
    S.am = "login";
    go("auth");
  };

const TABS = (w) => [
  ["home", "search", w ? "Temukan" : "Talenta"],
  ...(w ? [] : [["jobs", "briefcase", "Pekerjaan"]]),
  ["chat", "chat", "Chat"],
  ["coop", "contract", "Kerja Sama"],
  ["me", "user", "Profil"],
];
/* tab yang menyala mengikuti halaman yang sedang dibuka */
const active = () => ({ chat: "chat", coopd: "coop", kontrak: "coop" })[S.view] || S.tab;
const goTab = (k) => `S.tab='${k}';S.view='main';R();scrollTo(0,0)`;

export const hdr = () => {
  const u = unread(),
    name = S.role === "worker" ? S.w.name : S.e.name,
    bell = S.tab === "notif" && S.view === "main";
  return HDR(
    `<span class="lg:hidden">${LOGO}</span><span class="hidden lg:block"></span>
<div class="flex items-center gap-2"><button aria-label="Notifikasi${u ? ", " + u + " baru" : ""}" class="relative grid h-11 w-11 place-items-center rounded-full bg-soft text-pri transition hover:brightness-95 ${bell ? "ring-2 ring-pri" : ""}" onclick="${goTab("notif")}">${ico("bell")}${u ? `<span class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-yel px-1 text-[11px] font-extrabold text-[#0f1c2e] ring-2 ring-card">${u}</span>` : ""}</button>
<button aria-label="Profil saya" class="rounded-full transition hover:brightness-95" onclick="${goTab("me")}">${AV(name || "?", "h-11 w-11 text-sm rounded-full")}</button></div>`,
    "max-w-4xl",
  );
};

export const nav = () =>
  `<nav aria-label="Menu utama" class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:inset-y-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0 lg:bg-card lg:pb-0 lg:pt-7"><div class="hidden px-6 pb-7 lg:block">${LOGO}</div><div class="mx-auto flex max-w-xl justify-around px-2 py-1 lg:max-w-none lg:flex-col lg:justify-start lg:gap-1 lg:px-4 lg:py-0">${TABS(S.role === "worker")
    .map(([k, i, l]) => {
      const on = active() === k;
      return `<button aria-current="${on ? "page" : "false"}" class="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10.5px] font-bold whitespace-nowrap transition lg:min-h-12 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-sm ${on ? "text-pri lg:bg-soft" : "text-mut hover:text-ink lg:hover:bg-soft/60"}" onclick="${goTab(k)}"><span class="grid h-7 w-12 place-items-center rounded-full transition lg:h-auto lg:w-auto ${on ? "bg-soft lg:bg-transparent" : ""}">${ico(i, "h-[22px] w-[22px]")}</span><span>${l}</span></button>`;
    })
    .join("")}</div><p class="absolute inset-x-0 bottom-5 hidden px-6 text-xs text-mut lg:block">Prototipe MVP · ${S.role === "worker" ? "Pencari kerja" : "Pemberi kerja"}</p></nav>`;

/* bar CTA bawah di landing (mobile) baru muncul setelah melewati hero */
const sticky = () => {
  const e = $("#sticky");
  if (e) e.classList.toggle("translate-y-full", scrollY < 560);
};
addEventListener("scroll", sticky, { passive: true });

export function R() {
  const s = S.scr;
  let h;
  if (s === "landing") h = vLand();
  else if (s === "auth") h = vAuth();
  else if (s === "onb")
    h = `${HDR(`${LOGO}<span class="text-sm font-semibold text-mut">Lengkapi profil</span>`, "max-w-3xl")}<main class="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">${vOnb()}</main>`;
  else
    h = `<div class="lg:pl-64">${hdr()}<main class="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:max-w-4xl lg:pb-12 lg:pt-8">${S.view === "prof" ? vProf() : S.view === "job" ? vJob() : S.view === "kontrak" ? vKontrak() : S.view === "chat" ? vChat() : S.view === "coopd" ? vCoopD() : { home: vHome, notif: vNotif, chat: vChatList, coop: vCoop, me: vMe, jobs: vJobs }[S.tab]()}</main></div>${nav()}${S.inv != null ? vInvite() : ""}`;
  $("#app").innerHTML = h;
  sticky();
  const cb = $("#cb");
  if (cb) cb.scrollTop = cb.scrollHeight;
}
