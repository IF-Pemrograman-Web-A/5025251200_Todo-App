# 5025251200_Todo-App

## Identitas

**Nama:** Rafi Eka Pramudya  
**NRP:** 5025251200  
**Kelas:** Pemrograman Web (A)  
**Link:** https://if-pemrograman-web-a.github.io/5025251200_Todo-App/

---

## Deskripsi

Planova Todo App adalah aplikasi pencatatan tugas yang dikembangkan untuk memenuhi penugasan mata kuliah Pemrograman Web, khususnya modul **[E03] The Lost Cavern**. Aplikasi ini membantu pengguna merencanakan dan mengelola aktivitas harian melalui tampilan antarmuka dua panel yang bersih, responsif, modern, dan ramah aksesibilitas.

Aplikasi terdiri dari dua panel utama:
- **Panel kiri**: Menampilkan ringkasan tugas (*My Tasks*), pencarian tugas dinamis, tab filter status (*All, Pending, Completed*), serta daftar tugas lengkap dengan status checklist dan thumbnail foto.
- **Panel kanan**: Menampilkan detail tugas yang dipilih untuk disunting atau dihapus, serta formulir pembuatan tugas baru yang dilengkapi pengaturan prioritas, tenggat waktu, waktu notifikasi pengingat, dan penangkapan foto melalui kamera.

Struktur berkas proyek:
- `index.html`: Struktur semantik aplikasi, form input, elemen viewport kamera, dan komponen aksesibel (ARIA).
- `style.css`: Pengaturan gaya visual, variabel tema CSS (Light & Dark Mode), layout responsif, dan indikator fokus aksesibilitas.
- `script.js`: Logika interaktif aplikasi, operasi CRUD database IndexedDB, penyimpanan tema di localStorage, integrasi Media Capture API, dan orkestrasi Service Worker.
- `sw.js`: Service Worker untuk caching aset luring (*offline capability*) dan penanganan pemanggilan *Web Notifications API*.

---

## Fitur Utama

### 1. Manajemen Tugas (CRUD & Filter)
- **Tampilan Dinamis**: Menampilkan daftar tugas dengan atribut judul, deskripsi, tag prioritas (*High, Medium, Low*), tenggat waktu, label jam notifikasi, dan thumbnail foto tugas.
- **Tambah Tugas Baru**: Pengguna dapat menambahkan tugas baru lengkap dengan deskripsi, prioritas, tanggal, pengingat, serta foto lampiran.
- **Checklist Selesai**: Menandai penyelesaian tugas dengan mengklik tombol centang (*Pending* / *Completed*).
- **Edit & Hapus Tugas**: Memilih tugas untuk ditinjau dan diperbarui datanya pada form detail, atau dihapus dengan dialog konfirmasi.
- **Pencarian & Penyaringan**: Kolom pencarian realtime berdasarkan judul maupun deskripsi, serta filter tab status tugas (*All, Pending, Completed*).
- **Penghitung Tugas**: Menampilkan jumlah tugas aktif yang tersisa secara langsung.

### 2. Web Storage Implementation
- **IndexedDB**: Seluruh data tugas disimpan secara terstruktur dan persisten pada database lokal browser (`PlanovaTodoDB`). Data tidak akan hilang saat halaman dimuat ulang (*refresh*), termasuk penyimpanan data gambar dalam format Base64.
- **localStorage**: Digunakan untuk menyimpan preferensi tema pengguna (*Light Mode* / *Dark Mode*) sehingga tema pilihan tetap bertahan saat pengguna membuka kembali website.

### 3. Media Capture API (Kamera & Lampiran Foto)
- Terintegrasi langsung dengan kamera perangkat menggunakan `navigator.mediaDevices.getUserMedia`.
- Pengguna dapat membuka pratinjau kamera (*live stream video*), mengambil jepretan foto (*capture*) menggunakan elemen canvas, dan melihat hasil foto sebelum disimpan bersama data to-do.
- Dilengkapi tombol kendali kamera (*Nyalakan, Ambil Foto, Tutup Kamera*) serta *fallback input file* untuk mengunggah berkas gambar dari penyimpanan lokal jika kamera tidak tersedia.

### 4. Service Worker & Scheduled Notifications
- Mendaftarkan Service Worker (`sw.js`) untuk manajemen cache berkas statis di sisi klien.
- Dilengkapi input waktu notifikasi pengingat (*Notification Reminder Time*) pada setiap tugas.
- Sistem meminta izin `Notification.requestPermission()` dan menjadwalkan pengiriman pesan ke Service Worker untuk memicu *Push Notification* desktop/browser saat waktu pengingat tiba.

### 5. Aksesibilitas (A11y & WCAG Best Practices)
- **Elemen Semantik**: Menggunakan struktur HTML5 yang baku (`<header>`, `<main>`, `<section>`, `<aside>`, `<nav>`, `<form>`, `<fieldset>`, `<legend>`).
- **Dukungan Pembaca Layar (Screen Reader)**: Mengimplementasikan atribut `aria-label`, `aria-required`, `aria-live="polite"`, dan `role="status"` pada notifikasi aksi serta pembaruan data tugas.
- **Navigasi Keyboard**: Seluruh elemen interaktif dan kartu todo mendukung navigasi tombol keyboard (`Tab`, `Enter`, `Space`) dengan indikator fokus visual (`:focus-visible`) yang kontras dan jelas.
- **Kontras & Keterbacaan**: Rasio kontras teks dan tombol memenuhi standar keterbacaan baik pada tema terang maupun tema gelap.
- **Desain Responsif**: Antarmuka adaptif untuk perangkat desktop, tablet, dan smartphone melalui CSS Media Queries.

---

## Tampilan

### Desktop
<img width="1431" height="806" alt="Screenshot 2026-10-05 at 00 26 19" src="https://github.com/user-attachments/assets/9513b1f4-801d-4a52-85f9-02342da11a1f" />

### Mobile
<img width="381" height="686" alt="Screenshot Todo App Mobile" src="https://github.com/user-attachments/assets/bf518201-87f3-4c08-908f-0612722a2d28" />

---

## Petunjuk Penggunaan Lokal

Karena fitur **Media Capture API** (`getUserMedia`) dan **Service Worker** memerlukan lingkungan yang aman (*Secure Context* / HTTPS atau localhost):

1. Buka folder proyek di teks editor (misalnya VS Code).
2. Jalankan lokal server (gunakan ekstensi **Live Server** di VS Code atau perintah CLI `npx serve .` / `python3 -m http.server 8000`).
3. Berikan izin (*Allow*) ketika peramban meminta akses kamera dan perizinan notifikasi.
