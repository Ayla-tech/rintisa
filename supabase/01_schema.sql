-- 01_schema.sql — Satset. Jalankan sekali di SQL Editor (setelah 00_reset.sql bila project lama).
-- Prinsip: browser hanya BACA tabel. Semua perubahan status lewat fungsi (RPC) di bawah,
-- jadi rebutan slot dan aturan kerja dijaga server, bukan bisa dicurangi dari browser.

------------------------------------------------------------------ tabel
create table profiles(
  id uuid primary key references auth.users on delete cascade,
  role text not null check(role in('worker','employer')),
  created_at timestamptz not null default now());

create table employer_profiles(
  user_id uuid primary key references profiles(id) on delete cascade,
  name text not null check(length(btrim(name)) between 2 and 80),
  jenis text not null default 'UMKM',
  kota text not null check(length(btrim(kota)) between 2 and 60));

create table worker_profiles(
  user_id uuid primary key references profiles(id) on delete cascade,
  name text not null check(length(btrim(name)) between 2 and 80),
  kota text not null check(length(btrim(kota)) between 2 and 60),
  status_now text not null default 'Mahasiswa');

-- katalog badge (kode dipakai di jobs.badges). Tes/kuis untuk meraihnya menyusul; sementara diberikan manual.
create table badges(code text primary key, name text not null, info text not null);
create table worker_badges(
  user_id uuid not null references worker_profiles(user_id) on delete cascade,
  code text not null references badges(code),
  earned_at timestamptz not null default now(),
  primary key(user_id, code));

create table jobs(
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references employer_profiles(user_id) on delete cascade,
  kind text not null check(kind in('survei','data','desain','konten','admin','lain')),
  title text not null check(length(title) between 5 and 90),
  description text not null check(length(description) between 20 and 600),
  pay int not null check(pay between 5000 and 500000),          -- per orang
  slots int not null check(slots between 1 and 200),            -- kuota orang
  slots_taken int not null default 0,
  work_hours int not null default 24 check(work_hours between 1 and 72),
  max_revisions int not null default 1 check(max_revisions between 0 and 2),
  access text not null default 'open' check(access in('open','badge')),
  badges text[] not null default '{}',                          -- semua badge ini wajib dimiliki
  status text not null default 'open' check(status in('open','closed')),
  funded_at timestamptz,                                        -- dana ditahan (simulasi di prototipe)
  closes_at timestamptz not null,
  created_at timestamptz not null default now(),
  check(slots_taken between 0 and slots),
  check((access='open' and cardinality(badges)=0) or (access='badge' and cardinality(badges) between 1 and 3)));
create index jobs_feed on jobs(created_at desc) where status='open';
create index jobs_employer on jobs(employer_id, created_at desc);

-- instruksi + tautan: hanya terlihat pemberi kerja dan pekerja yang memegang slot
create table job_details(
  job_id uuid primary key references jobs(id) on delete cascade,
  instructions text not null default '' check(length(instructions) <= 2000),
  link_url text check(link_url is null or link_url ~* '^https?://\S+$'));

create table claims(
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  worker_id uuid not null references worker_profiles(user_id) on delete cascade,
  status text not null default 'working'
    check(status in('working','submitted','revision','approved','released','expired')),
  claimed_at timestamptz not null default now(),
  due_at timestamptz not null,
  submitted_at timestamptz,
  decided_at timestamptz,
  revisions_used int not null default 0,
  result_link text, result_path text, result_name text, result_note text,
  unique(job_id, worker_id));
create unique index one_active_claim on claims(worker_id) where status in('working','revision');
create index claims_job on claims(job_id);
create index claims_due on claims(due_at) where status in('working','revision');
create index claims_review on claims(submitted_at) where status='submitted';

create table messages(
  id bigint generated always as identity primary key,
  claim_id uuid not null references claims(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null check(length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now());
create index messages_claim on messages(claim_id, id);

create table notifications(
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  claim_id uuid references claims(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  read bool not null default false,
  created_at timestamptz not null default now());
create index notif_user on notifications(user_id, created_at desc);

------------------------------------------------------------------ profil otomatis saat daftar
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id, role)
  values(new.id, case when new.raw_user_meta_data->>'role'='employer' then 'employer' else 'worker' end)
  on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
-- akun yang sudah ada sebelum rombakan
insert into profiles(id, role)
select id, case when raw_user_meta_data->>'role'='employer' then 'employer' else 'worker' end from auth.users
on conflict do nothing;

------------------------------------------------------------------ pembantu RLS
create function is_party(c uuid) returns bool language sql security definer stable set search_path=public as $$
  select exists(select 1 from claims x join jobs j on j.id=x.job_id
                where x.id=c and (x.worker_id=auth.uid() or j.employer_id=auth.uid())) $$;
create function sees_worker(w uuid) returns bool language sql security definer stable set search_path=public as $$
  select w=auth.uid() or exists(select 1 from claims c join jobs j on j.id=c.job_id
                                where c.worker_id=w and j.employer_id=auth.uid()) $$;
create function my_role() returns text language sql security definer stable set search_path=public as $$
  select role from profiles where id=auth.uid() $$;

------------------------------------------------------------------ RLS
alter table profiles enable row level security;
alter table employer_profiles enable row level security;
alter table worker_profiles enable row level security;
alter table badges enable row level security;
alter table worker_badges enable row level security;
alter table jobs enable row level security;
alter table job_details enable row level security;
alter table claims enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

create policy p_sel on profiles for select using(id=auth.uid());
create policy e_sel on employer_profiles for select to authenticated using(true);
create policy e_all on employer_profiles for all
  using(user_id=auth.uid()) with check(user_id=auth.uid() and my_role()='employer');
-- profil pekerja hanya terlihat oleh dirinya dan pemberi kerja yang slotnya ia ambil
create policy w_sel on worker_profiles for select using(sees_worker(user_id));
create policy w_all on worker_profiles for all
  using(user_id=auth.uid()) with check(user_id=auth.uid() and my_role()='worker');
create policy b_sel on badges for select to anon, authenticated using(true);
create policy wb_sel on worker_badges for select using(sees_worker(user_id));
create policy j_sel on jobs for select to authenticated using(true);
create policy jd_sel on job_details for select using(
  exists(select 1 from jobs j where j.id=job_id and j.employer_id=auth.uid())
  or exists(select 1 from claims c where c.job_id=job_details.job_id and c.worker_id=auth.uid()
            and c.status in('working','submitted','revision','approved')));
create policy c_sel on claims for select using(
  worker_id=auth.uid() or exists(select 1 from jobs j where j.id=job_id and j.employer_id=auth.uid()));
create policy m_sel on messages for select using(is_party(claim_id));
create policy m_ins on messages for insert with check(sender_id=auth.uid() and is_party(claim_id));
create policy n_sel on notifications for select using(user_id=auth.uid());
create policy n_upd on notifications for update using(user_id=auth.uid()) with check(user_id=auth.uid());
-- jobs, job_details, claims, worker_badges: TIDAK ada policy tulis. Hanya fungsi di bawah yang boleh mengubahnya.

------------------------------------------------------------------ fungsi
create function notify(u uuid, k text, t text, b text, c uuid, j uuid) returns void
language sql security definer set search_path=public as $$
  insert into notifications(user_id,kind,title,body,claim_id,job_id) values(u,k,t,b,c,j) $$;

-- Pemberi kerja menerbitkan tugas. Dana ditahan = simulasi (funded_at); di produksi diisi webhook pembayaran.
create function post_job(p_kind text, p_title text, p_desc text, p_instr text, p_link text,
  p_pay int, p_slots int, p_hours int, p_rev int, p_access text, p_badges text[], p_open_hours int)
returns uuid language plpgsql security definer set search_path=public as $$
declare me uuid:=auth.uid(); jid uuid; bd text[]:=case when p_access='badge' then coalesce(p_badges,'{}') else '{}' end;
begin
  if not exists(select 1 from employer_profiles where user_id=me) then raise exception 'PROFIL'; end if;
  if p_open_hours not between 1 and 336 then raise exception 'RENTANG'; end if;
  if (select count(*) from badges where code=any(bd)) <> cardinality(bd) then raise exception 'BADGE'; end if;
  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,access,badges,funded_at,closes_at)
  values(me,p_kind,btrim(p_title),btrim(p_desc),p_pay,p_slots,p_hours,p_rev,p_access,bd,now(),now()+make_interval(hours=>p_open_hours))
  returning id into jid;
  insert into job_details(job_id,instructions,link_url)
  values(jid,coalesce(btrim(p_instr),''),nullif(btrim(coalesce(p_link,'')),''));
  return jid;
end $$;

create function set_job_status(p_job uuid, p_status text) returns void
language plpgsql security definer set search_path=public as $$
begin
  if p_status not in('open','closed') then raise exception 'AKSI'; end if;
  update jobs set status=p_status where id=p_job and employer_id=auth.uid();
  if not found then raise exception 'STATUS'; end if;
end $$;

-- Rebutan slot. UPDATE bersyarat satu pernyataan = atomik: dua orang menekan bersamaan, hanya satu yang lolos.
create function claim_job(p_job uuid) returns uuid language plpgsql security definer set search_path=public as $$
declare me uuid:=auth.uid(); j jobs; n int; cid uuid; who text;
begin
  select name into who from worker_profiles where user_id=me;
  if who is null then raise exception 'PROFIL'; end if;
  select * into j from jobs where id=p_job;
  if not found or j.status<>'open' or j.funded_at is null or j.closes_at<=now() then raise exception 'TUTUP'; end if;
  if j.access='badge' and not (j.badges <@ array(select code from worker_badges where user_id=me)) then raise exception 'BADGE'; end if;
  if exists(select 1 from claims where worker_id=me and status in('working','revision')) then raise exception 'SIBUK'; end if;
  if exists(select 1 from claims where job_id=p_job and worker_id=me) then raise exception 'SUDAH'; end if;
  update jobs set slots_taken=slots_taken+1 where id=p_job and slots_taken<slots returning slots_taken into n;
  if n is null then raise exception 'PENUH'; end if;
  insert into claims(job_id,worker_id,due_at) values(p_job,me,now()+make_interval(hours=>j.work_hours)) returning id into cid;
  perform notify(j.employer_id,'claimed','Slot diambil: '||j.title, who||' mengambil slot ('||n||' dari '||j.slots||').',cid,p_job);
  if n=j.slots then perform notify(j.employer_id,'full','Semua slot terisi: '||j.title,'Tugasmu penuh. Tinggal menunggu hasil.',null,p_job); end if;
  return cid;
end $$;

create function release_claim(p_claim uuid) returns void language plpgsql security definer set search_path=public as $$
declare me uuid:=auth.uid(); c claims; j jobs;
begin
  select * into c from claims where id=p_claim and worker_id=me for update;
  if not found or c.status<>'working' then raise exception 'STATUS'; end if;
  update claims set status='released', decided_at=now() where id=p_claim;
  update jobs set slots_taken=slots_taken-1 where id=c.job_id returning * into j;
  perform notify(j.employer_id,'released','Slot dilepas: '||j.title,'Pekerja melepas slot. Slot dibuka lagi untuk orang lain.',p_claim,j.id);
end $$;

create function submit_result(p_claim uuid, p_link text, p_path text, p_name text, p_note text)
returns void language plpgsql security definer set search_path=public as $$
declare me uuid:=auth.uid(); c claims; j jobs;
begin
  select * into c from claims where id=p_claim and worker_id=me for update;
  if not found or c.status not in('working','revision') or c.due_at<now() then raise exception 'STATUS'; end if;
  if coalesce(btrim(p_link),'')='' and coalesce(p_path,'')='' then raise exception 'KOSONG'; end if;
  if coalesce(btrim(p_link),'')<>'' and btrim(p_link) !~* '^https?://\S+$' then raise exception 'LINK'; end if;
  if coalesce(p_path,'')<>'' and split_part(p_path,'/',1)<>p_claim::text then raise exception 'PATH'; end if;
  update claims set status='submitted', submitted_at=now(),
    result_link=nullif(btrim(coalesce(p_link,'')),''), result_path=nullif(coalesce(p_path,''),''),
    result_name=nullif(left(coalesce(p_name,''),120),''), result_note=nullif(left(btrim(coalesce(p_note,'')),500),'')
  where id=p_claim;
  select * into j from jobs where id=c.job_id;
  perform notify(j.employer_id,'submitted','Hasil masuk: '||j.title,'Tinjau dan terima. Jika tidak ditinjau 48 jam, hasil diterima otomatis.',p_claim,j.id);
end $$;

create function review_claim(p_claim uuid, p_action text, p_note text default null)
returns void language plpgsql security definer set search_path=public as $$
declare me uuid:=auth.uid(); c claims; j jobs;
begin
  select * into c from claims where id=p_claim for update;
  select * into j from jobs where id=c.job_id and employer_id=me;
  if c.id is null or j.id is null or c.status<>'submitted' then raise exception 'STATUS'; end if;
  if p_action='approve' then
    update claims set status='approved', decided_at=now() where id=p_claim;
    perform notify(c.worker_id,'approved','Hasil diterima: '||j.title,'Rp '||j.pay||' dicairkan ke saldomu.',p_claim,j.id);
  elsif p_action='revise' then
    if c.revisions_used>=j.max_revisions then raise exception 'REVISI'; end if;
    if coalesce(btrim(p_note),'')='' then raise exception 'CATATAN'; end if;
    update claims set status='revision', revisions_used=revisions_used+1, due_at=now()+make_interval(hours=>j.work_hours) where id=p_claim;
    insert into messages(claim_id,sender_id,body) values(p_claim,me,left(btrim(p_note),1000));
    perform notify(c.worker_id,'revision','Perlu revisi: '||j.title,left(btrim(p_note),140),p_claim,j.id);
  else raise exception 'AKSI'; end if;
end $$;

-- Rapikan: slot yang lewat batas waktu dibuka lagi; hasil yang 48 jam tak ditinjau diterima otomatis. Idempoten.
create function sweep() returns void language plpgsql security definer set search_path=public as $$
begin
  with x as (
    update claims set status='expired', decided_at=now()
    where status in('working','revision') and due_at<now() returning id, job_id, worker_id),
  y as (
    update jobs set slots_taken=slots_taken-n.c
    from (select job_id, count(*)::int c from x group by job_id) n where jobs.id=n.job_id returning jobs.id)
  insert into notifications(user_id,kind,title,body,claim_id,job_id)
  select x.worker_id,'expired','Waktu habis: '||jb.title,'Slot dilepas karena batas waktu terlewati.',x.id,x.job_id from x join jobs jb on jb.id=x.job_id
  union all
  select jb.employer_id,'expired','Slot dibuka lagi: '||jb.title,'Pekerja tidak menyerahkan hasil tepat waktu.',x.id,x.job_id from x join jobs jb on jb.id=x.job_id;

  with a as (
    update claims c set status='approved', decided_at=now() from jobs jb
    where c.job_id=jb.id and c.status='submitted' and c.submitted_at < now()-interval '48 hours'
    returning c.id, c.worker_id, jb.id jid, jb.employer_id, jb.title, jb.pay)
  insert into notifications(user_id,kind,title,body,claim_id,job_id)
  select a.worker_id,'approved','Diterima otomatis: '||a.title,'Rp '||a.pay||' dicairkan ke saldomu.',a.id,a.jid from a
  union all
  select a.employer_id,'auto','Diterima otomatis: '||a.title,'Hasil tidak ditinjau 48 jam, jadi diterima otomatis.',a.id,a.jid from a;
end $$;
-- Opsional (Database > Extensions > pg_cron): select cron.schedule('satset-sweep','* * * * *','select public.sweep()');

------------------------------------------------------------------ hak eksekusi
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function is_party(uuid), sees_worker(uuid), my_role() to authenticated;
grant execute on function post_job(text,text,text,text,text,int,int,int,int,text,text[],int), set_job_status(uuid,text),
  claim_job(uuid), release_claim(uuid), submit_result(uuid,text,text,text,text), review_claim(uuid,text,text),
  sweep() to authenticated;

------------------------------------------------------------------ penyimpanan hasil kerja
insert into storage.buckets(id,name,public,file_size_limit) values('hasil','hasil',false,10485760) on conflict(id) do nothing;
create policy hasil_ins on storage.objects for insert to authenticated with check(
  case when bucket_id='hasil' then exists(select 1 from claims c where c.id=((storage.foldername(name))[1])::uuid and c.worker_id=auth.uid()) else false end);
create policy hasil_sel on storage.objects for select to authenticated using(
  case when bucket_id='hasil' then is_party(((storage.foldername(name))[1])::uuid) else false end);

------------------------------------------------------------------ data awal
insert into badges(code,name,info) values
 ('identitas','Identitas Terverifikasi','Identitas dicek tim. Cocok untuk tugas yang menyangkut data pribadi atau uang.'),
 ('teliti-data','Teliti Data','Tes ketelitian input dan pengecekan data.'),
 ('desain-dasar','Desain Dasar','Tes membuat poster atau banner sederhana.'),
 ('penulis-konten','Penulis Konten','Tes menulis caption dan teks promosi.'),
 ('responden-teliti','Responden Teliti','Tes membaca instruksi dan menjawab survei secara konsisten.');

-- realtime: daftar tugas, slot, notifikasi, dan chat langsung berubah tanpa refresh
alter publication supabase_realtime add table jobs, claims, messages, notifications;
