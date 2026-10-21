-- 002_progress.sql  — jalankan SEKALI di SQL Editor (setelah schema.sql)
-- Isi: status 'completed', hitung revisi, tabel progress_logs, bucket foto bukti, penjaga aturan kontrak.

-- 1) matches: status baru + kolom baru
do $$ declare c text; begin
  for c in select conname from pg_constraint where conrelid='public.matches'::regclass and contype='c' and pg_get_constraintdef(oid) like '%status%' loop
    execute format('alter table public.matches drop constraint %I',c);
  end loop; end $$;
alter table matches add constraint matches_status_check check(status in('pending','agreed','completed','rejected'));
alter table matches add column revisions_used int not null default 0, add column agreed_at timestamptz, add column completed_at timestamptz;
alter table matches add constraint matches_rev_ok check(revisions_used between 0 and max_revisions);

-- 2) riwayat bukti progres
create table progress_logs(id bigint generated always as identity primary key, match_id uuid not null references matches(id) on delete cascade, pct int not null check(pct between 1 and 100), note text, image_path text, created_by uuid not null references profiles(id), created_at timestamptz not null default now());
alter table progress_logs enable row level security;
create policy l_sel on progress_logs for select using(is_party(match_id));
create policy l_ins on progress_logs for insert with check(created_by=auth.uid() and exists(select 1 from matches m where m.id=match_id and m.worker_id=auth.uid() and m.status='agreed'));

-- 3) bucket foto bukti (privat; hanya kedua pihak match yang bisa lihat)
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('bukti','bukti',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy bukti_ins on storage.objects for insert to authenticated with check(bucket_id='bukti' and is_party(((storage.foldername(name))[1])::uuid));
create policy bukti_sel on storage.objects for select to authenticated using(bucket_id='bukti' and is_party(((storage.foldername(name))[1])::uuid));

-- 4) penjaga aturan di sisi server (browser tidak bisa dicurangi)
create function match_guard() returns trigger language plpgsql security definer set search_path=public as $$
declare emp uuid; me uuid:=auth.uid();
begin
  select employer_id into emp from jobs where id=old.job_id;
  if new.job_id<>old.job_id or new.worker_id<>old.worker_id or new.initiated_by<>old.initiated_by then raise exception 'Data match tidak bisa diubah'; end if;
  if old.status<>'pending' and (new.budget<>old.budget or new.dp_pct<>old.dp_pct or new.days<>old.days or new.max_revisions<>old.max_revisions) then raise exception 'Kontrak sudah disepakati'; end if;
  if new.status<>old.status then
    if not ((old.status='pending' and new.status in('agreed','rejected')) or (old.status='agreed' and new.status='completed')) then raise exception 'Perubahan status tidak valid'; end if;
    if new.status='completed' and me is not null and me is distinct from emp then raise exception 'Hanya pemberi kerja yang bisa menerima hasil'; end if;
    if new.status='agreed' then new.agreed_at:=now(); end if;
    if new.status='completed' then new.completed_at:=now(); end if;
  end if;
  if new.revisions_used<>old.revisions_used then
    if me is not null and me is distinct from emp then raise exception 'Hanya pemberi kerja yang bisa mengajukan revisi'; end if;
    if new.revisions_used<>old.revisions_used+1 or new.status<>'agreed' then raise exception 'Kuota revisi habis'; end if;
  end if;
  return new;
end $$;
create trigger match_guard before update on matches for each row execute function match_guard();

alter publication supabase_realtime add table progress_logs;
