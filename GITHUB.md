# Menyimpan ke GitHub

Isi folder Website-PLTD-KIT-JATIM dapat dijadikan repository statis. Letakkan index.html di root repository. Tidak ada tahap build atau npm install. Unggah seluruh isi folder agar panduan, schema, dan data uji ikut tersedia.

Contoh untuk repository baru dan kosong (ganti URL dengan repository Anda):

```bash
git init
git add .
git commit -m "Update PLTD V05 reporting and Excel export"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Jika memakai repository yang sudah ada, salin perubahan ke checkout tersebut, tinjau diff, lalu commit/push seperti alur proyek Anda. Pushing source tidak membuat backend atau autentikasi produksi; data browser tetap lokal.
