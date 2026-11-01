-- 02_seed.sql — OPSIONAL: tugas contoh supaya daftar tidak kosong saat demo.
-- Syarat: sudah ada minimal 1 akun PEMBERI KERJA yang selesai mengisi profil (lewat aplikasi).
-- Tugas dibuat atas nama pemberi kerja pertama. Aman dijalankan ulang (tugas contoh bertambah lagi).

do $$
declare e uuid; j uuid;
begin
  select user_id into e from employer_profiles order by user_id limit 1;
  if e is null then raise notice 'Belum ada pemberi kerja. Daftar dan isi profil dulu, lalu jalankan file ini lagi.'; return; end if;

  -- terbuka untuk semua
  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,funded_at,closes_at)
  values(e,'survei','Isi survei kebiasaan jajan mahasiswa (3 menit)','Jawab 12 pertanyaan singkat tentang kebiasaan jajan harian. Cukup HP, tidak perlu pengalaman.',5000,20,3,0,now(),now()+interval '3 days') returning id into j;
  insert into job_details values(j,'Buka tautan, jawab semua pertanyaan dengan jujur, lalu kirim tangkapan layar halaman terima kasih.','https://example.com/survei');

  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,funded_at,closes_at)
  values(e,'data','Input 30 data stok barang ke spreadsheet','Salin data stok dari foto nota ke Google Sheets sesuai kolom yang disediakan. Pekerjaan sekali duduk.',30000,2,12,1,now(),now()+interval '2 days') returning id into j;
  insert into job_details values(j,'Foto nota ada di tautan. Isi kolom: nama barang, jumlah, harga. Kirim tautan sheet yang sudah diisi.','https://example.com/nota');

  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,funded_at,closes_at)
  values(e,'konten','Tulis 5 caption Instagram untuk menu kopi baru','Tulis 5 caption pendek (maks 150 karakter) bergaya santai untuk promo menu baru kedai kopi.',25000,3,24,1,now(),now()+interval '5 days') returning id into j;
  insert into job_details values(j,'Menu: es kopi gula aren, kopi susu pandan. Gaya: santai, boleh pakai emoji, jangan lebih dari 2 hashtag.',null);

  -- khusus badge
  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,access,badges,funded_at,closes_at)
  values(e,'data','Rekap 200 data pelanggan (butuh ketelitian)','Rapikan dan cek ganda 200 baris data pelanggan di spreadsheet. Data pribadi, jadi hanya untuk pekerja terverifikasi.',80000,1,24,1,'badge','{teliti-data,identitas}',now(),now()+interval '4 days') returning id into j;
  insert into job_details values(j,'Akses sheet dibagikan setelah slot diambil. Cek duplikat, format nomor HP, dan ejaan nama.','https://example.com/pelanggan');

  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,access,badges,funded_at,closes_at)
  values(e,'desain','Poster promo akhir pekan ukuran A4','Buat 1 poster promo ukuran A4 (PNG) dengan logo dan harga yang kami kirim. Gaya hangat dan bersih.',60000,1,48,2,'badge','{desain-dasar}',now(),now()+interval '6 days') returning id into j;
  insert into job_details values(j,'Logo, warna, dan teks promo ada di tautan. Kirim hasil berupa PNG dan file Canva.','https://example.com/brief');

  insert into jobs(employer_id,kind,title,description,pay,slots,work_hours,max_revisions,access,badges,funded_at,closes_at)
  values(e,'survei','Panel responden: uji rasa kopi (15 menit)','Isi survei lanjutan dengan jawaban konsisten. Hanya responden yang sudah lolos tes ketelitian.',15000,10,6,0,'badge','{responden-teliti}',now(),now()+interval '2 days') returning id into j;
  insert into job_details values(j,'Baca setiap pertanyaan sampai habis. Jawaban asal-asalan tidak diterima.','https://example.com/panel');
end $$;

-- Memberi badge untuk uji coba (ganti email dengan email pekerja demo). Tes badge asli menyusul.
-- insert into worker_badges(user_id, code)
-- select w.user_id, b.code from worker_profiles w
-- join auth.users u on u.id = w.user_id
-- cross join badges b
-- where u.email = 'pekerja.demo@email.com' and b.code in ('teliti-data','identitas')
-- on conflict do nothing;
