-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run
create table profiles(id uuid primary key references auth.users on delete cascade, role text not null check(role in('worker','employer')), created_at timestamptz default now());
create table worker_profiles(user_id uuid primary key references profiles(id) on delete cascade, name text not null, bidang text, lv text, skills text[] not null default '{}', tools text, org text, task text, hari text, jam int, min_pay int, speed text, gaya text, tes text, why text);
create table employer_profiles(user_id uuid primary key references profiles(id) on delete cascade, name text not null, jenis text, need text, budget text);
create table jobs(id uuid primary key default gen_random_uuid(), employer_id uuid not null references employer_profiles(user_id) on delete cascade, title text not null, description text, skills text[] not null default '{}', budget int not null check(budget between 15000 and 300000), days int not null check(days>=1), max_revisions int not null default 2 check(max_revisions between 0 and 5), status text not null default 'open' check(status in('open','closed')), created_at timestamptz default now());
-- satu baris = satu pertemuan pencari kerja x pemberi kerja (sekaligus isi surat perjanjiannya)
create table matches(id uuid primary key default gen_random_uuid(), job_id uuid not null references jobs(id) on delete cascade, worker_id uuid not null references worker_profiles(user_id) on delete cascade, initiated_by text not null check(initiated_by in('worker','employer')), pct int, status text not null default 'pending' check(status in('pending','agreed','rejected')), budget int not null, dp_pct int not null default 30 check(dp_pct in(20,30,50)), days int not null, max_revisions int not null, version int not null default 1, worker_unread bool not null default true, employer_unread bool not null default true, created_at timestamptz default now(), unique(job_id,worker_id));
create table messages(id bigint generated always as identity primary key, match_id uuid not null references matches(id) on delete cascade, sender_id uuid not null references profiles(id), body text not null, is_system bool not null default false, created_at timestamptz default now());

create function is_party(m uuid) returns bool language sql security definer stable set search_path=public as
$$ select exists(select 1 from matches x join jobs j on j.id=x.job_id where x.id=m and (x.worker_id=auth.uid() or j.employer_id=auth.uid())) $$;

alter table profiles enable row level security; alter table worker_profiles enable row level security; alter table employer_profiles enable row level security;
alter table jobs enable row level security; alter table matches enable row level security; alter table messages enable row level security;

create policy p_sel on profiles for select using(id=auth.uid());
create policy p_ins on profiles for insert with check(id=auth.uid());
create policy w_sel on worker_profiles for select to authenticated using(true);
create policy w_all on worker_profiles for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy e_sel on employer_profiles for select to authenticated using(true);
create policy e_all on employer_profiles for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy j_sel on jobs for select to authenticated using(true);
create policy j_all on jobs for all using(employer_id=auth.uid()) with check(employer_id=auth.uid());
create policy m_sel on matches for select using(worker_id=auth.uid() or exists(select 1 from jobs j where j.id=job_id and j.employer_id=auth.uid()));
create policy m_upd on matches for update using(worker_id=auth.uid() or exists(select 1 from jobs j where j.id=job_id and j.employer_id=auth.uid()));
create policy m_ins on matches for insert with check((initiated_by='worker' and worker_id=auth.uid()) or (initiated_by='employer' and exists(select 1 from jobs j where j.id=job_id and j.employer_id=auth.uid())));
create policy g_sel on messages for select using(is_party(match_id));
create policy g_ins on messages for insert with check(sender_id=auth.uid() and is_party(match_id));

alter publication supabase_realtime add table messages, matches;
