# Skrip Presentasi: Testing & CI/CD Pipeline

**Durasi Estimasi:** 3-5 Menit
**Tujuan:** Menjelaskan peningkatan kualitas kode melalui Automated Testing dan CI/CD Pipeline.

---

## 1. Pembukaan (Introduction)
"Selamat pagi/siang/sore. Pada kesempatan ini, saya akan mempresentasikan pembaruan teknis di sisi **Quality Assurance** dan **DevOps** proyek PanenKu. Fokus utama kami adalah memastikan setiap baris kode yang masuk ke produksi (Main Branch) aman, minim bug, dan teruji secara otomatis."

## 2. Masalah Sebelumnya (The Problem)
"Sebelumnya, kita menghadapi beberapa tantangan:
*   Testing dilakukan manual, memakan waktu dan rentan human error.
*   Beberapa tes otomatis (Unit Test) gagal karena konfigurasi yang belum optimal (misalnya pada komponen Login dan Navbar).
*   Proses deployment ke `main` dilakukan secara langsung tanpa pengecekan otomatis, yang berisiko merusak fitur yang sudah berjalan."

## 3. Solusi 1: Perbaikan & Standardisasi Unit Test (Testing)
"Langkah pertama yang saya lakukan adalah memperbaiki fondasi testing kita menggunakan **Vitest** dan **React Testing Library**.

*   **Refactoring ke `user-event`**: Saya mengganti simulasi interaksi lawas (`fireEvent`) dengan `user-event`.
    *   *Kenapa?* Karena `user-event` mensimulasikan interaksi nyata pengguna (seperti mengetik keyboard atau klik mouse) dengan lebih akurat daripada sekadar memicu event kodingan.
*   **Fixing Bugs**: Saya memperbaiki tes pada `Navbar` dan `Login` yang sebelumnya gagal karena masalah mocking (simulasi) modul `next/navigation`.
*   **Result**: Saat ini, **100% tes (35/35 tes)** berjalan sukses (Passed)."

## 4. Solusi 2: Implementasi CI/CD Pipeline (Automation)
"Untuk menjaga kualitas ini tetap terjaga selamanya, saya membangun sistem **Continuous Integration (CI)** menggunakan **GitHub Actions**.

Kami menerapkan konsep **'Automated Guard'** (Satpam Otomatis) dengan alur kerja berikut:

1.  **Developer bekerja di branch `dev`**.
2.  Saat developer melakukan `push` ke `dev`, GitHub Actions otomatis bangun dari tidurnya.
3.  **Robot CI menjalankan serangkaian tes**:
    *   Mengecek kerapian kode (Linting).
    *   Menjalankan semua Unit Test.
4.  **Auto-Merge Decision**:
    *   Jika **Tes Gagal (Merah)** ❌: Proses berhenti. Kode di `main` aman tak tersentuh. Developer wajib perbaiki `dev`.
    *   Jika **Tes Sukses (Hijau)** ✅: Sistem secara otomatis mendorong (push/merge) kode tersebut ke branch `main`.

Ini memangkas waktu review manual dan menjamin bahwa **branch `main` selalu berisi kode yang sehat (Green/Passing Build).**"

## 5. Kesimpulan (Closing)
"Dengan implementasi ini, kita tidak hanya memperbaiki bug yang ada, tapi juga membangun sistem pertahanan jangka panjang. Sekarang, kita bisa mengembangkan fitur baru dengan lebih percaya diri dan cepat, karena ada sistem otomatis yang menjaga kualitas kode kita di belakang layar. Terima kasih."

---

## Tips Demo (Jika Perlu)
1.  Buka terminal, jalankan `npm test` untuk menunjukkan semua tes hijau.
2.  Buka tab "Actions" di repository GitHub untuk menunjukkan riwayat workflow yang sukses dan gagal.
3.  Tunjukkan file `.github/workflows/ci.yml` sekilas untuk memperlihatkan kodenya.
