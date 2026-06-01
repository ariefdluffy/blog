---
title: "Bisnis Plan Layanan Shortlink"
description: "Rencana bisnis layanan shortlink/URL shortener — monetisasi dan strategi."
tags: [tutorial]
---

# Strategi Bisnis Shortlink & Micro-site (Biolink)

Berdasarkan referensi **s.id/bidang-pkt**, model bisnis ini sangat efektif untuk instansi pemerintah atau komunitas yang membutuhkan satu "pintu masuk" untuk berbagai tautan dinamis (Zoom, Absensi, Materi).

## 1. Analisis Ketersediaan Domain Pendek (.id)

Untuk membangun trust dan kemudahan ingat, gunakan domain 3-5 karakter. Berdasarkan pengecekan:

| Domain | Status | Rekomendasi |
| :--- | :--- | :--- |
| **lnk.id** | ❌ Taken | Terlalu umum |
| **mylk.id** | ✅ Available | "My Link" - catchy |
| **gotu.id** | ✅ Available | "Go To" - sangat pendek |
| **scnk.id** | ✅ Available | "Scan Link" - untuk QR focus |
| **bi1.id** | ✅ Available | "Bio One" - sangat pendek |
| **ailink.id** | ✅ Available | Fokus ke AI Automation |

**Rekomendasi Utama:** `gotu.id` atau `mylk.id` karena hanya 4 karakter dan relevan secara global/lokal.

---

## 2. Skema Upgrade & Monetisasi (Model Berlangganan)

Ubah strategi dari "bayar per link" menjadi "quota-based subscription" untuk menjaga cashflow:

| Fitur | **FREE** | **BASIC (Rp 15rb/bln)** | **PREMIUM (Rp 45rb/bln)** |
| :--- | :--- | :--- | :--- |
| **Tautan Pendek** | 10 Tautan | 100 Tautan | Tak Terbatas |
| **Micro-site/Biolink** | 1 Halaman | 5 Halaman | Tak Terbatas |
| **Analitik** | 7 Hari Terakhir | 30 Hari Terakhir | Riwayat Penuh |
| **Iklan di Halaman** | Ada (Merek kamu) | Tanpa Iklan | Tanpa Iklan |
| **Domain Kustom** | ❌ | ❌ | ✅ 1 Domain Kustom |
| **Proteksi Sandi** | ❌ | ✅ | ✅ |

---

## 3. Alur Order Custom Domain — Penjelasan Detail

**Pertanyaan: "Kalau custom domain, nanti proses order dari webku seperti apa?"**

Berikut alurnya step-by-step:

### Langkah 1: Pengguna Belum Punya Domain
- Di dashboard, pengguna klik "Tambah Domain Kustom"
- Kamu tampilkan rekomendasi registrar (Niagahoster, Domainesia, IDCloudHost)
- Pengguna beli domain sendiri di luar (misal: `link.tokosaya.id` seharga Rp 100-200rb/tahun)

### Langkah 2: Pengguna Input Domain di Dashboard-mu
- Pengguna masukkan `link.tokosaya.id` ke form
- Kamu simpan ke tabel `custom_domains` dengan status `pending`

### Langkah 3: Kamu Beri Instruksi DNS
- Sistem menampilkan petunjuk:
 > **Instruksi Konfigurasi DNS**
 > 1. Login ke panel domain kamu (Niagahoster / tempat kamu beli domain)
 > 2. Cari menu **DNS Management / Name Server**
 > 3. Buat **CNAME Record** baru:
 > - **Name/Host**: `link` (atau `@` untuk root domain)
 > - **Target**: `gotu.id` (domain platform kamu)
 > - **TTL**: 3600 (default)

### Langkah 4: Verifikasi Otomatis (Backend kamu)
- Setiap 5 menit, cron job / skrip mengecek:
 ```
 dig CNAME link.tokosaya.id +short
 # Output harus: gotu.id.
 ```
 `dig CNAME link.tokosaya.id +short`
 Output yang diharapkan: `gotu.id.`

- Jika CNAME sudah mengarah dengan benar → status berubah ke `verified`

### Langkah 5: Generate SSL
- Saat status `verified`, server kamu (Caddy/Nginx) otomatis minta SSL dari Let's Encrypt untuk `link.tokosaya.id`
- Status SSL berubah ke `issued`

### Langkah 6: Siap Digunakan
- Pengguna buka `link.tokosaya.id/event-a` → mendarat di biosite milik pengguna
- Semua tautan pengguna sekarang bisa diakses via domain kustom
- Dashboard pengguna menunjukkan: ✅ Aktif | SSL Aktif

### Catatan Penting:
- Kamu TIDAK perlu membeli domain untuk pengguna
- Kamu hanya perlu **1 server Caddy** yang bisa menangani ribuan domain berbeda sekaligus (fitur **On-Demand TLS**)
- Jika pengguna berhenti bayar → nonaktifkan CNAME di DNS server kamu → otomatis domain pengguna tidak bisa akses

---

## 4. Tahapan Implementasi (Peta Jalan)

### Fase 1: MVP (Minimal Viable Product)
- Bangun laman arahan untuk membuat shortlink sederhana.
- Implementasi dashboard pengguna untuk edit tautan (perbarui URL tujuan tanpa ganti shortlink).
- Integrasi sistem login (Google OAuth lebih baik).

### Fase 2: Micro-site Builder
- Buat editor sederhana untuk Biolink (ala s.id/bidang-pkt).
- Komponen: Button, Image, YouTube Embed, Text Paragraph.
- Template default yang clean dan mobile-first.

### Fase 3: Pembayaran & Otomatisasi
- Integrasi Midtrans untuk pembayaran langganan.
- Otomatisasi penghapusan/nonaktifkan tautan jika kuota penuh atau langganan habis.
- Otomatisasi SSL untuk domain kustom menggunakan Caddy Server (paling mudah untuk on-the-fly SSL).

### Fase 4: Pemasaran & B2B
- Targetkan instansi (seperti BPSDM) dengan fitur "Tim/Organisasi".
- Fitur ekspor data analitik ke Excel/PDF.

---

**Saran Tambahan:**
Gunakan **Caddy Server** sebagai web server. Caddy punya fitur *On-Demand TLS* yang memungkinkan kamu meng-host ribuan custom domain user secara otomatis tanpa harus restart server atau buat config Nginx manual tiap ada domain baru.
