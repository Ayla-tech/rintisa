import { S } from "./state.js";
export function pct(j) {
  const m = j.s.filter((k) => S.w.skills.includes(k)).length;
  return m ? Math.round(60 + (40 * m) / j.s.length) : 35;
}
export function pctW(x) {
  const js = S.myJobs[0]?.s || [],
    m = x.s.filter((k) => js.includes(k)).length;
  return m ? Math.round(60 + (40 * m) / js.length) : 35;
}
