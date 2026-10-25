import "@fontsource-variable/plus-jakarta-sans";
import "./styles.css";
import * as ui from "./ui.js";
import * as state from "./state.js";
import * as router from "./router.js";
import * as landing from "./views/landing.js";
import * as auth from "./views/auth.js";
import * as onb from "./views/onboarding.js";
import * as home from "./views/home.js";
import * as chat from "./views/chat.js";
import * as coop from "./views/coop.js";
import * as contract from "./views/contract.js";
import * as profile from "./views/profile.js";
import * as jobs from "./views/jobs.js";
import * as data from "./data.js";
// template HTML memakai onclick="...", jadi fungsi-fungsinya harus global
Object.assign(
  window,
  ui,
  state,
  router,
  landing,
  auth,
  onb,
  home,
  chat,
  coop,
  contract,
  profile,
  jobs,
  data,
);
data
  .boot()
  .then((ok) => {
    if (!ok) router.R();
  })
  .catch((e) => {
    console.error(e);
    router.R();
  });
