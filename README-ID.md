# Website PLTD — KIT JATIM V04

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

## Master mesin KIT JATIM

Sumber: `ID UNIT KIT JATIM.xlsx`, sheet `ID UNIT`, rentang A5:G82.
Terdapat **78 mesin pada 11 sentral**. Kolom yang digunakan:

| Kolom sumber | Data |
|---|---|
| A | NO |
| B | SENTRAL |
| C | ID UNIT |
| D | MERK |
| E | TIPE |
| F | NO SERI |
| G | DAYA TERPASANG |

ID Unit tetap berupa teks, misalnya `0964`; nomor seri juga disimpan sebagai teks.
ID Unit pada sel gabungan mengikuti sentral yang sama. Nama mesin mengikuti isi kolom MERK tanpa mengubah ejaan sumber.
Kolom G tidak mencantumkan satuan, sehingga Daya Terpasang ditampilkan sebagai nilai sumber tanpa menambahkan asumsi satuan. Total nilai kolom G: **32.322**.
Tipe dan nomor seri kosong atau bertanda `-` tidak dikarang. Kolom setelah G tidak disertakan.

`master-mesin.json` memuat data tersebut beserta informasi sumber. `id` internal seperti `kitjatim-row-5` adalah kunci antarmuka berdasarkan nomor baris, bukan ID MESIN resmi.
Saat membuka ekspor CSV melalui Excel, impor ID Unit dan No Seri sebagai **Text** agar angka nol di depan tetap terlihat.

## Pemeriksaan

Data 78 mesin/11 sentral, batas tujuh kolom, ID Unit, nomor seri, login tiga peran, pembatasan menu, pencarian master, persetujuan, ekspor, dan pengisian identitas operator diperiksa secara programatis. Sintaks JavaScript dan kemandirian aset HTML diperiksa. SVG utama dirender untuk pemeriksaan visual.
Pengujian end-to-end dalam browser belum dilakukan di lingkungan pengerjaan ini.
