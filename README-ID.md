# Website PLTD KIT JATIM — V05 revisi 9 November 2026

Ekstrak seluruh ZIP, lalu buka **index.html** di browser. Tidak perlu instalasi atau CDN. File `web_login_pln_nusa_daya.html` dan `web_plta_monitoring_system.html` tetap tersedia sebagai pintu masuk lama; masing-masing berdiri sendiri.

Pilih **Supervisi**, **Admin**, atau **Superadmin**, tekan **Isi akun contoh sesuai peran**, lalu **Masuk**.

| Peran | Akun demo | Kata sandi demo |
|---|---|---|
| Supervisi | supervisi.demo@example.com | Demo123! |
| Admin | admin.demo@example.com | Demo123! |
| Superadmin | superadmin.demo@example.com | Demo123! |

## Pembaruan

- Menu **Laporan & analitik** dan **Ekspor laporan** dengan filter tanggal, jam, unit, mesin, Terapkan Filter dan Reset.
- Grafik **Pencatatan per unit** berasal dari logsheet sesuai filter; card **Hasil** berada tepat di bawahnya.
- Empat selisih harian menggunakan modul perhitungan yang sama dengan APK Operator V05 terbaru.
- Detail/checklist berisi 22 parameter asli + Stand Pemakaian Oli Kumulatif (L).
- Excel asli `.xlsx` berbentuk tabel sederhana; CSV dan cetak/PDF tetap tersedia.
- Data lama tersimpan tetap dibaca. Login, persetujuan, pengguna, master mesin, monitor, audit, serta pengaturan tetap sesuai peran.

## Mencoba hasil

1. Buka Laporan & analitik, lalu **Coba data uji 7–9 Nov**.
2. Filter contoh Bawean #02 tanggal 8 November, jam 00:00–08:00 menghasilkan **400 kWh / 140 L / 19 jam / 3 L**.
3. Ubah jam ke 08:00–16:00, lalu Terapkan Filter: **500 / 180 / 20 / 4**.
4. Buka Ekspor laporan. Filter yang telah diterapkan tetap aktif.
5. Pilih Excel, CSV atau PDF. Untuk kembali ke histori, tekan **Kembali ke data tersimpan**.

Mode data uji tidak menimpa laporan browser. Data demo lama tanggal 17–18 Oktober 2026 tetap tersedia melalui filter khusus; oli kumulatif yang belum dicatat tetap kosong.

## Peran dan impor lokal

Supervisi meninjau atau meminta revisi laporan. Admin mengelola akun Operator/Supervisi dan melihat master. Superadmin mengelola seluruh peran, master serta pengaturan. Ketiga peran dapat melihat analitik dan mengekspor laporan.

Admin/Superadmin dapat memakai **Impor logsheet JSON** saat mode data uji mati. Format berupa array laporan atau `{ "reports": [...] }`; tiap record wajib memiliki `id` dan status yang dikenal. Field dapat berada di top-level atau `params`. Ikuti contoh JSON dalam `test-data`. Versi terbaru pada ID/slot yang sama digunakan, tanpa menjumlahkan duplikat. File impor tidak diunggah ke layanan lain.

Pencarian dan status pada Semua laporan berlaku untuk tabel detail dan tombol Ekspor CSV tabel. Filter periode/jam/unit/mesin pada analitik dan halaman ekspor adalah filter bersama untuk hasil harian.

Lihat `REVISI-2026-11-09.md` untuk aturan lengkap dan `HASIL-UJI.md` untuk hasil pemeriksaan. Website masih prototipe lokal, belum layanan produksi atau sinkronisasi dengan APK.
