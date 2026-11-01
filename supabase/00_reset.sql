-- 00_reset.sql — HAPUS struktur lama Rintisa. Jalankan HANYA kalau memakai project Supabase lama.
-- Semua data di tabel lama ikut hilang. Akun login (auth.users) tidak terhapus.
-- Di project Supabase baru, lewati file ini.
-- Setelah ini, kosongkan bucket lama (bukti, lampiran, identitas) lewat Dashboard > Storage.

drop trigger if exists on_auth_user_created on auth.users;
drop table if exists notifications, messages, claims, job_details, jobs, worker_badges, badges,
  worker_profiles, employer_profiles, profiles, matches, progress_logs cascade;
drop function if exists handle_new_user() cascade;
drop function if exists is_party(uuid) cascade;
drop function if exists sees_worker(uuid) cascade;
drop function if exists my_role() cascade;
drop function if exists match_guard() cascade;
drop function if exists notify(uuid, text, text, text, uuid, uuid) cascade;
drop function if exists post_job(text, text, text, text, text, int, int, int, int, text, text[], int) cascade;
drop function if exists claim_job(uuid) cascade;
drop function if exists release_claim(uuid) cascade;
drop function if exists submit_result(uuid, text, text, text, text) cascade;
drop function if exists review_claim(uuid, text, text) cascade;
drop function if exists sweep() cascade;
drop policy if exists bukti_ins on storage.objects;
drop policy if exists bukti_sel on storage.objects;
