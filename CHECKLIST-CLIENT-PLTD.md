# Hasil Pemeriksaan Checklist Client PLTD — V05

Audit dilakukan terhadap APK Operator dan website V04 yang terakhir dibagikan, lalu dilengkapi pada V05.

**Hasil:** 12 item sudah tersedia pada input APK, termasuk SN sebagai No Seri dan DT sebagai Daya Terpasang. Sepuluh item ditambahkan. Pada detail laporan web, Status Mesin juga ditambahkan terpisah dari Status Laporan. Seluruh 22 item sekarang tersedia pada input/tinjauan aplikasi dan detail/tabel lengkap/CSV/cetak website.

| No | Item client | APK sebelum revisi | Detail web sebelum revisi | APK V05 | Laporan web V05 |
|---|---|---|---|---|---|
| 1 | ID Mesin | Belum ada | Belum ada | Ada | Ada |
| 2 | Kode Mesin | Belum ada | Belum ada | Ada | Ada |
| 3 | SN / No Seri | Ada sebagai No Seri | Ada sebagai No Seri | Ada | Ada |
| 4 | DT / Daya Terpasang | Ada sebagai Daya Terpasang | Ada sebagai Daya Terpasang | Ada | Ada |
| 5 | Daya Mampu (kW) | Belum ada | Belum ada | Ada | Ada |
| 6 | Beban (kW) | Ada | Ada | Ada | Ada |
| 7 | Stand kWh (kWh) | Ada | Ada | Ada | Ada |
| 8 | Stand BBM (L) | Ada | Ada | Ada | Ada |
| 9 | Phasa R | Belum ada | Belum ada | Ada | Ada |
| 10 | Phasa S | Belum ada | Belum ada | Ada | Ada |
| 11 | Phasa T | Belum ada | Belum ada | Ada | Ada |
| 12 | Tekanan Oli (bar) | Ada | Ada | Ada | Ada |
| 13 | Temperatur Air Pendingin (°C) | Ada | Ada | Ada | Ada |
| 14 | Tegangan (V) | Ada | Ada | Ada | Ada |
| 15 | Frekuensi (Hz) | Ada | Ada | Ada | Ada |
| 16 | Cos Phi | Belum ada | Belum ada | Ada | Ada |
| 17 | Jam Kerja Mesin (jam) | Ada | Ada | Ada | Ada |
| 18 | Status Mesin | Ada | Belum ada (status laporan berbeda) | Ada | Ada |
| 19 | kWh Produksi (kWh) | Belum ada | Belum ada | Ada | Ada |
| 20 | Pemakaian BBM (L) | Belum ada | Belum ada | Ada | Ada |
| 21 | Jenis Bahan Bakar | Belum ada | Belum ada | Ada | Ada |
| 22 | Keterangan | Ada | Ada | Ada | Ada |

## Catatan implementasi

- ID Mesin: dari Excel kolom I, 62 nilai tersedia; 16 kosong dipertahankan. ID Unit tetap kolom C.
- Kode Mesin: tidak tersedia pada sumber. Kolom input/edit disiapkan tanpa kode rekaan.
- SN: memakai No Seri yang sudah ada; nilai kosong atau tanda `-` tidak diganti nomor rekaan.
- Daya Mampu: dari kolom H, satuan kW; 74 nilai tersedia, 4 kosong. Angka 0 dipertahankan.
- DT: Daya Terpasang dari kolom G; satuan tidak dicantumkan pada sumber.
- Phasa R/S/T: input numerik terpisah; satuan belum ditentukan client sehingga tidak diasumsikan A atau V.
- Cos Phi: input numerik 0–1.
- kWh Produksi dan Pemakaian BBM: nilai periode yang diinput langsung, terpisah dari stand meter.
- Jenis Bahan Bakar: input teks sesuai bahan bakar yang digunakan.
- Keterangan: kolom catatan yang sudah ada dipertahankan dan dimunculkan lengkap pada detail/ekspor.
- Status Mesin tidak dicampur dengan status persetujuan laporan. Mengganti status mesin tidak menghapus stand meter.
- CSV dan cetak kedua prototipe memuat 22 item beserta identitas logsheet, sentral, operator, dan status laporan.
- Draft dan laporan lama dimigrasikan; nilai baru yang sebelumnya tidak dicatat tetap kosong.

## Cara mencoba

APK: pilih sentral/mesin → Identitas → Parameter → Tinjauan checklist 22 item → Kirim atau Draft. Website: login sesuai peran → Semua Laporan → Checklist 22 item, atau buka Detail → Cetak/CSV. Superadmin dapat mengubah identitas pada Unit & Mesin.

## Pemeriksaan dan batas prototipe

Dua belas pemeriksaan programatis lulus: sumber, validasi, nilai nol/identitas, migrasi, login/hak akses, master, detail/CSV/cetak, input dan kirim APK, perubahan status, serta batch draft. Browser E2E belum dilakukan.

Ini prototipe HTML dengan data operasional simulasi, bukan APK terkompilasi atau layanan produksi. APK dan web belum menyinkronkan data melalui backend. Paket Figma berisi SVG yang dapat diimpor, bukan berkas native .fig.
