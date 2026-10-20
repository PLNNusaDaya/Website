# Website PLTD — KIT JATIM V05

## Membuka website

Ekstrak ZIP, lalu buka `index.html` jika tersedia, atau `web_login_pln_nusa_daya.html` di browser. Di paket Figma, file HTML berada dalam `prototype/`.
Pilih **Supervisi**, **Admin**, atau **Superadmin**, kemudian klik **Isi akun contoh sesuai peran** dan **Masuk**.

| Peran | Email demo | Kata sandi |
|---|---|---|
| Supervisi | supervisi.demo@example.com | Demo123! |
| Admin | admin.demo@example.com | Demo123! |
| Superadmin | superadmin.demo@example.com | Demo123! |

Email harus sesuai dengan peran yang dipilih. Pilihan “Ingat email & peran” tidak menyimpan kata sandi.
Setiap HTML berdiri sendiri dan memuat login serta dashboard. Tidak perlu instalasi atau koneksi CDN. File dashboard `web_plta_monitoring_system.html` juga menampilkan login sebelum akses, kecuali terdapat sesi demo yang masih aktif. Nama file lama dipertahankan; isi telah diselaraskan ke PLTD.

## Pembagian peran

| Peran | Fitur |
|---|---|
| Supervisi | Dashboard, laporan, persetujuan atau permintaan revisi, monitor operasi |
| Admin | Dashboard, laporan, monitor, kelola akun Operator/Supervisi, lihat master unit dan mesin, jejak audit |
| Superadmin | Dashboard, laporan, monitor, kelola seluruh peran pengguna, tambah/edit master, jejak audit, pengaturan sistem |

Persetujuan logsheet merupakan alur Supervisi. Menu dan tindakan berubah sesuai peran demo yang aktif. Operator menggunakan prototipe aplikasi terpisah.

## Yang bisa dicoba

- Filter tanggal/sentral, cari laporan, buka detail, dan ekspor CSV atau cetak/PDF.
- Tinjau laporan sebagai Supervisi; catatan wajib untuk revisi dan kondisi abnormal.
- Buka Unit & Mesin sebagai Admin atau Superadmin; cari merk, tipe, nomor seri, atau ID Unit. Tabel memiliki 12 baris per halaman.
- Ubah master sebagai Superadmin. Pilihan mesin dan detail memakai master yang sama.
- Kelola pengguna, lihat jejak audit lokal, dan coba pengaturan sistem sesuai peran.

Data operasional adalah **simulasi**: 132 logsheet untuk 17–18 Oktober 2026. Pada 18 Oktober: 66 laporan, 22 menunggu, 43 disetujui, 1 perlu revisi, dan 1 parameter abnormal. Waktu menggunakan WIB. Identitas mesin berasal dari sumber Excel; nilai operasi bukan hasil pembacaan mesin aktual.

## Batas prototipe

Login dan hak akses ini mendemonstrasikan desain; belum ada autentikasi/otorisasi server atau database bersama. Data demo disimpan pada browser. Pengubahan data web belum tersinkron ke APK atau perangkat lain. Gunakan data fiktif untuk mencoba form pengguna.

## Master mesin dan checklist client

Sumber: `ID UNIT KIT JATIM.xlsx`, sheet `ID UNIT`, A5:I82. Terdapat **78 mesin pada 11 sentral**.

Nama sentral ID Unit **0965** disesuaikan menjadi **PLTD Bawean** sesuai revisi pengguna. Penamaan diterapkan pada aplikasi, web, laporan, ekspor, dan desain. Identitas serta parameter mesin tetap mengikuti data yang sudah ada.

| Kolom | Data sumber |
|---|---|
| A | No |
| B | Sentral |
| C | ID Unit |
| D | Merk / nama mesin |
| E | Tipe |
| F | SN / No Seri |
| G | DT / Daya Terpasang |
| H | Daya Mampu (kW) |
| I | ID Mesin |

**ID Mesin** berasal dari kolom I, berbeda dari ID Unit kolom C. Sebanyak 62 ID Mesin dan 74 nilai Daya Mampu tersedia pada sumber. Empat Daya Mampu yang kosong tetap kosong; 26 nilai nol tetap nol. ID Unit, ID Mesin, Kode Mesin, dan SN berupa teks agar angka nol di depan tidak hilang.

Kode Mesin tidak tersedia dalam Excel. Kolomnya sudah ditambahkan, tetapi nilainya dibiarkan kosong sampai client menetapkan kode. Pada APK, identitas yang belum tercantum bisa diisi pada pencatatan; identitas master yang tersedia terisi otomatis. Pada web, pengelolaan master dilakukan Superadmin.

DT diartikan sebagai Daya Terpasang. Header G tidak menyebut satuan sehingga tidak ditambah asumsi satuan. Jumlah kolom G tetap 32.322. Phasa R/S/T juga tidak diberi asumsi satuan karena checklist belum menentukannya.

Stand kWh dan stand BBM adalah pembacaan meter. kWh Produksi dan Pemakaian BBM adalah nilai selama periode pencatatan, diisi langsung. Belum ada perhitungan otomatis dari selisih meter. Jenis Bahan Bakar berupa teks mengikuti bahan bakar aktual. Cos Phi menerima nilai 0–1.

Status Mesin (Operasi/Standby/Gangguan-Rusak) terpisah dari Status Laporan (Draft/Pending/Menunggu/Disetujui/dll.). Mengubah status mesin tidak mengubah stand meter atau identitas menjadi nol.

`master-mesin.json` menyimpan sumber master; `checklist-schema.json` berisi 22 definisi item. Kunci internal `id` seperti `kitjatim-row-5` hanya kunci antarmuka, bukan ID Mesin resmi. Saat membuka CSV di Excel, impor kolom identitas sebagai Text.

## Pemeriksaan

Dua belas pemeriksaan programatis mencakup 22 item, kesesuaian sumber Excel, validasi, pengiriman/draft/batch APK, detail/CSV/cetak, migrasi data lama, identitas dengan nol di depan, dan hak akses tiga peran. Komponen React dan antarmuka web diuji melalui harness, tanpa browser. Sintaks JavaScript dan kemandirian aset HTML diperiksa. SVG utama dirender untuk pemeriksaan visual.
Pengujian end-to-end dalam browser belum dilakukan di lingkungan pengerjaan ini.

## Revisi checklist V05

Buka Semua Laporan atau Persetujuan, lalu klik **Checklist 22 item** untuk tabel lengkap. Detail, ekspor CSV, dan cetak memuat seluruh item. Laporan ringkas tetap tersedia.

Data browser V04 dimigrasikan saat V05 dibuka pada origin yang sama. Nilai lama, status persetujuan, dan catatan dipertahankan. Kolom operasi baru yang tidak pernah dicatat tetap kosong, bukan angka contoh. Master memiliki ID Mesin dan Daya Mampu tambahan dari Excel. File berbeda yang dibuka langsung sebagai file lokal dapat memiliki penyimpanan browser berbeda.

Lihat `CHECKLIST-CLIENT-PLTD.md` untuk hasil audit sebelum/sesudah.
