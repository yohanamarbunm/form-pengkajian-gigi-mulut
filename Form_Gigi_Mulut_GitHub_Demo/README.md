# Demo Pengkajian Awal Kesehatan Gigi dan Mulut

Frontend statis untuk simulasi formulir pengkajian awal kesehatan gigi dan mulut rawat jalan RSUD Tarutung.

## Fitur demo
- Halaman beranda dan tautan ke seluruh bagian formulir.
- Navigasi antarbagiannya, validasi dasar, dan penyimpanan data formulir di browser menggunakan `localStorage`.
- Adapter API lokal untuk menggantikan endpoint jaringan privat lama; tidak ada data yang dikirim ke server.
- Halaman review dan konfirmasi tetap tersedia sebagai bagian dari alur demo.

## Jalankan secara lokal
Jalankan server statis dari folder yang berisi `index.html`, misalnya: `python -m http.server 8000`, lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages
1. Buat repository GitHub baru.
2. Unggah **isi folder proyek ini** ke root repository, termasuk `index.html`, `css/`, `js/`, `komponen/`, dan `Picture/`.
3. Buka **Settings → Pages**.
4. Pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu **Save**.
5. Tunggu deployment selesai. URL akan ditampilkan pada halaman Settings → Pages.

## Batasan dan keamanan
- Ini adalah demo frontend, bukan sistem rekam medis produksi.
- `localStorage` hanya tersedia pada browser/perangkat yang menyimpan data; data tidak tersinkron antar pengguna.
- Login dan endpoint API hanya disimulasikan untuk demo. Jangan gunakan password sungguhan atau data pasien asli.
- Untuk penggunaan nyata diperlukan backend terkelola, autentikasi/otorisasi, database aman, audit keamanan, HTTPS, dan persetujuan institusi terkait.
