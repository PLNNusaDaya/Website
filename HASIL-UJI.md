# Hasil pemeriksaan — 9 November 2026

**21/21 uji model Operator V05 lulus**, dan **15/15 pemeriksaan paket/website lulus**. Hasil terperinci ada di folder `qa/`.

Pemeriksaan mencakup empat indikator, pasangan HH:mm, perubahan rentang jam, beberapa unit/tanggal, data kosong, nol, negatif/reset, draft/pending, revisi/duplikat, penghapusan, pergantian bulan/tahun, timestamp WIB, data lama, dan identitas mesin.

Paket memastikan model website identik dengan model Operator V05, 22 parameter asli tetap ada + stand oli kumulatif, 78 mesin/11 unit dipertahankan, peran lama tetap berlaku, dan prototipe dalam paket website/Figma identik.

Generator Excel dari HTML website menghasilkan byte yang identik dengan contoh XLSX Operator V05 yang telah diperiksa. File berisi tipe tanggal/numerik asli, formula selisih dengan penjagaan sel kosong, total, freeze pane dan filter. Hasil contoh seluruh unit tanggal 8–9 November 00:00–08:00: 950 kWh / 340 L / 51 jam / 8 L.

Browser: login demo, navigasi Supervisi/Admin/Superadmin, akses master/pengaturan, rincian 23 parameter, empat indikator 08:00 dan 16:00, perubahan filter setelah Terapkan, agregasi lintas tanggal/unit, dan kesamaan nilai pada halaman Ekspor diperiksa. Frame SVG analitik, input parameter, dan ekspor dirender serta diperiksa secara visual.

Batas verifikasi: kejadian unduhan otomatis di browser pengujian tidak terkonfirmasi (timeout); generator dan isi XLSX telah diverifikasi langsung. Pencetakan ke perangkat fisik, layanan autentikasi server, sinkronisasi produksi, dan impor pada file besar belum diuji. Prototipe tidak mengklaim autentikasi atau database produksi.
