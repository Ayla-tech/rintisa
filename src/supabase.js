import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL,
  key = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  document.body.innerHTML =
    '<p style="padding:24px;font-family:system-ui">File <b>.env.local</b> belum terbaca. Buat di folder utama proyek (sejajar package.json), isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>, lalu restart <code>npm run dev</code>.</p>';
  throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY kosong");
}
export const sb = createClient(url, key);
