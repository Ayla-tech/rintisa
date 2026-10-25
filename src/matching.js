import { S } from "./state.js";
export function pct(j) {
  const m = j.s.filter((k) => S.w.skills.includes(k)).length;
  return m ? Math.round(60 + (40 * m) / j.s.length) : 35;
}
/* kecocokan talenta terhadap SATU pekerjaan */
export function pctWJ(x, j) {
  const m = x.s.filter((k) => (j.s || []).includes(k)).length;
  return m ? Math.round(60 + (40 * m) / j.s.length) : 35;
}
/* kecocokan talenta di daftar = yang terbaik dari semua pekerjaan terbuka milik pemberi kerja */
export function pctW(x) {
  return S.myJobs.length ? Math.max(...S.myJobs.map((j) => pctWJ(x, j))) : 35;
}
