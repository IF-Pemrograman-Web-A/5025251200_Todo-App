# 5025251200_Todo-App

## Identitas

**Nama:** Rafi Eka Pramudya  
**NRP:** 5025251200  
**Kelas:** Pemrograman Web (A)
**Link:** https://5025251200-to-do-app.netlify.app/

## Deskripsi

Aplikasi Todo List sederhana yang dibuat untuk memenuhi tugas mata kuliah Pemrograman Web. Aplikasi ini digunakan untuk membantu pengguna mengelola daftar tugas sehari-hari melalui antarmuka yang sederhana dan responsif.

Aplikasi terdiri dari dua panel utama:

- **Panel kiri** digunakan untuk menampilkan daftar tugas, pencarian, dan filter tugas.
- **Panel kanan** digunakan untuk melihat serta mengubah detail tugas dan membuat tugas baru.

Aplikasi dikembangkan menggunakan **HTML, CSS, dan JavaScript** dengan struktur file yang terpisah:

- `index.html` untuk struktur halaman.
- `style.css` untuk tampilan dan responsive layout.
- `script.js` untuk mengatur interaksi dan fitur aplikasi.

## Fitur

### 1. Menampilkan Todo

Aplikasi menampilkan daftar tugas yang terdiri dari:

- Judul
- Deskripsi
- Prioritas
- Informasi waktu tugas

### 2. Menambahkan Todo

Pengguna dapat membuat tugas baru melalui form **Create New Todo** dengan memasukkan judul dan deskripsi tugas.

Tugas baru akan ditambahkan ke daftar dengan:

- Status: **Pending**
- Prioritas: **Medium**

### 3. Menandai Todo Selesai

Pengguna dapat menekan tombol checklist pada setiap tugas untuk mengubah status tugas antara:

- **Pending**
- **Completed**

### 4. Melihat dan Mengedit Detail Todo

Pengguna dapat memilih salah satu tugas untuk melihat detailnya pada panel **Todo Details**.

Detail yang dapat diubah meliputi:

- **Task Title**
- **Description**
- **Priority**

Perubahan dapat disimpan menggunakan tombol **Save Changes**.

### 5. Menghapus Todo

Pengguna dapat menghapus tugas yang sedang dipilih menggunakan tombol **Delete**.

Sebelum tugas dihapus, aplikasi akan meminta konfirmasi kepada pengguna.

### 6. Search Todo

Pengguna dapat mencari tugas menggunakan kolom **Search tasks...**.

Pencarian dilakukan berdasarkan:

- Judul tugas
- Deskripsi tugas

### 7. Filter Todo

Daftar tugas dapat difilter berdasarkan status:

- **All** untuk menampilkan semua tugas.
- **Pending** untuk menampilkan tugas yang belum selesai.
- **Completed** untuk menampilkan tugas yang sudah selesai.

### 8. Task Counter

Aplikasi menampilkan jumlah tugas yang tersedia pada bagian **My Tasks**.

Jumlah tersebut akan diperbarui ketika tugas ditambahkan atau dihapus.

### 9. Responsive Design

Tampilan aplikasi dibuat responsif menggunakan CSS sehingga layout dapat menyesuaikan ukuran layar desktop, tablet, maupun perangkat mobile.

## Tampilan

### Desktop

<img width="1434" height="804" alt="Screenshot Todo App Desktop" src="https://github.com/user-attachments/assets/9e79f97e-41f1-4827-abd0-e636789ea8dc" />

### Mobile

<img width="381" height="686" alt="Screenshot Todo App Mobile" src="https://github.com/user-attachments/assets/bf518201-87f3-4c08-908f-0612722a2d28" />

### Notes

Data Todo pada versi ini dikelola menggunakan JavaScript di sisi client. Data belum menggunakan database atau localStorage, sehingga perubahan data tidak disimpan secara permanen setelah halaman browser di-refresh.
