import "@fontsource-variable/plus-jakarta-sans";
import "./styles.css";
import * as ui from "./ui.js";
import * as state from "./state.js";
import * as router from "./router.js";
import * as landing from "./views/landing.js";
import * as feed from "./views/feed.js";
import * as post from "./views/post.js";
import * as data from "./data.js";

/* template HTML memakai onclick="...", jadi fungsi-fungsinya harus global */
Object.assign(window, ui, state, router, landing, feed, post, data);
window.S = state.S;
window.R = router.R;
setInterval(ui.tick, 1000);

state.restore();
data.boot().then((ok) => { if (!ok) router.R(); }).catch((e) => { console.error(e); router.R(); });
