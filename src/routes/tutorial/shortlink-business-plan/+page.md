---
title: "Bisnis Plan Layanan Shortlink"
description: "Rencana bisnis layanan shortlink/URL shortener — monetisasi dan strategi."
tags: [tutorial]
---

# Strategi Bisnis Shortlink & Micro-site (Biolink)

Berdasarkan referensi **s.id/bidang-pkt**, model bisnis ini sangat efektif untuk instansi pemerintah atau komunitas yang membutuhkan satu "pintu masuk" untuk berbagai link dinamis (Zoom, Absensi, Materi).

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

## 2. Skema Upgrade & Monetisasi (Subscription Model)

Ubah strategi dari "bayar per link" menjadi "quota-based subscription" untuk menjaga cashflow:

| Fitur | **FREE** | **BASIC (Rp 15rb/bln)** | **PREMIUM (Rp 45rb/bln)** |
| :--- | :--- | :--- | :--- |
| **Shortlinks** | 10 Link | 100 Link | Unlimited |
| **Micro-site/Biolink** | 1 Page | 5 Pages | Unlimited |
| **Analytics** | Last 7 Days | Last 30 Days | Full History |
| **Ads on Page** | Ada (Brand kamu) | No Ads | No Ads |
| **Custom Domain** | ❌ | ❌ | ✅ 1 Custom Domain |
| **Password Protection** | ❌ | ✅ | ✅ |

---

## 3. Alur Order Custom Domain — Penjelasan Detail

**Pertanyaan: "Kalau custom domain, nanti proses order dari webku seperti apa?"**

Berikut alurnya step-by-step:

### Step 1: User Belum Punya Domain
- Di dashboard, user klik "Add Custom Domain"
- Kamu tampilkan rekomendasi registrar (Niagahoster, Domainesia, IDCloudHost)
- User beli domain sendiri di luar (misal: `link.tokosaya.id` seharga Rp 100-200rb/tahun)

### Step 2: User Input Domain di Dashboard-mu
- User masukkan `link.tokosaya.id` ke form
- Kamu simpan ke tabel `custom_domains` dengan status `pending`

### Step 3: Kamu Beri Instruksi DNS
- Sistem menampilkan petunjuk:
 > **Instruksi Konfigurasi DNS**
 > 1. Login ke panel domain kamu (Niagahoster / tempat kamu beli domain)
 > 2. Cari menu **DNS Management / Name Server**
 > 3. Buat **CNAME Record** baru:
 > - **Name/Host**: `link` (atau `@` untuk root domain)
 > - **Target**: `gotu.id` (domain platform kamu)
 > - **TTL**: 3600 (default)

### Step 4: Verifikasi Otomatis (Backend kamu)
- Setiap 5 menit, cron job / script mengecek:
 ```
 dig CNAME link.tokosaya.id +short
 # Output harus: gotu.id.
 ```
 `dig CNAME link.tokosaya.id +short`
 Output yang diharapkan: `gotu.id.`

- Jika CNAME sudah mengarah dengan benar → status berubah ke `verified`

### Step 5: Generate SSL
- Saat status `verified`, server kamu (Caddy/Nginx) otomatis request SSL dari Let's Encrypt untuk `link.tokosaya.id`
- Status SSL berubah ke `issued`

### Step 6: Siap Digunakan
- User buka `link.tokosaya.id/event-a` → mendarat di biosite milik user
- Semua link user sekarang bisa diakses via custom domain
- Dashboard user menunjukkan: ✅ Active | SSL Active

### Catatan Penting:
- Kamu TIDAK perlu membeli domain untuk user
- Kamu hanya perlu **1 server Caddy** yang bisa handle ribuan domain berbeda sekaligus (fitur **On-Demand TLS**)
- Jika user berhenti bayar → disable CNAME di DNS server kamu → otomatis domain user tidak bisa akses

---

## 4. Tahapan Implementasi (Roadmap)

### Fase 1: MVP (Minimal Viable Product)
- Bangun landing page untuk create shortlink sederhana.
- Implementasi dashboard user untuk edit link (update URL tujuan tanpa ganti shortlink).
- Integrasi sistem login (Google OAuth lebih baik).

### Fase 2: Micro-site Builder
- Buat editor sederhana untuk Biolink (ala s.id/bidang-pkt).
- Komponen: Button, Image, YouTube Embed, Text Paragraph.
- Template default yang clean dan mobile-first.

### Fase 3: Payment & Automation
- Integrasi Midtrans untuk pembayaran subscription.
- Automasi penghapusan/disable link jika quota penuh atau subs habis.
- Automasi SSL untuk custom domain menggunakan Caddy Server (paling mudah untuk on-the-fly SSL).

### Fase 4: Marketing & B2B
- Targetkan instansi (seperti BPSDM) dengan fitur "Team/Organization".
- Fitur ekspor data analytics ke Excel/PDF.

---

**Saran Tambahan:**
Gunakan **Caddy Server** sebagai web server. Caddy punya fitur *On-Demand TLS* yang memungkinkan kamu meng-host ribuan custom domain user secara otomatis tanpa harus restart server atau buat config Nginx manual tiap ada domain baru.
