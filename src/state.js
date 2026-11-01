const DK = "st_draft";
export const freshJF = () => ({ kind: "survei", t: "", x: "", ins: "", link: "", pay: 5000, slots: 20, hrs: 3, rev: 0, acc: "open", bd: [], open: 72, more: false });
export const S = {
  scr: "landing", /* landing | auth | onb | app */
  tab: "feed", /* worker: feed, mine, me | employer: mine, post, me | keduanya: notif */
  view: "main", /* main | job | claim */
  role: "worker", am: "login", em: "", lr: "worker",
  me: null, ob: 0, jid: null, cid: null, sh: null, busy: 0, live: false,
  w: { name: "", kota: "", status_now: "Mahasiswa" },
  e: { name: "", jenis: "UMKM", kota: "" },
  badges: [], myB: [], wb: [],
  feed: [], jobs: [], claims: [], nts: [], msgs: [], det: {}, urls: {}, jx: null,
  q: "", f: "", acc: "", sort: "new",
  jf: freshJF(),
};
export const unread = () => S.nts.filter((n) => !n.read).length;

/* draf formulir tersimpan di perangkat supaya tidak hilang saat tab tertutup */
export const persist = () => {
  try {
    if (S.scr === "onb" || S.tab === "post") localStorage.setItem(DK, JSON.stringify({ w: S.w, e: S.e, jf: S.jf }));
  } catch {}
};
export const restore = () => {
  try {
    const d = JSON.parse(localStorage.getItem(DK) || "null");
    if (d) { Object.assign(S.w, d.w); Object.assign(S.e, d.e); Object.assign(S.jf, d.jf); }
  } catch {}
};
export const clearDraft = () => { try { localStorage.removeItem(DK); } catch {} };
addEventListener("pagehide", persist);
document.addEventListener("visibilitychange", () => document.hidden && persist());
