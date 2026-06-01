---
title: "Jurnal Harian"
description: "Catatan harian Miftahul Arif"
tags: [journal]
---

# Catatan Harian

Halaman ini berisi jurnal dan catatan harian seputar aktivitas, pembelajaran, dan temuan saya.

---

## Mei 2026

### 01 Mei 2026 — Perbaikan Wedding Invitation Production Server

**Masalah:** Project wedding-invitation di VM 105 tidak bisa diakses (temuin.web.id down). PM2 menjalankan mode development (`npm run dev`) dengan konfigurasi yang salah.

**Perubahan yang dilakukan:**

1. **Perbaikan DB Password** — File `.env` berisi password literal `***` (bukan password asli). Diubah ke password MySQL yang benar (`WeddingDB2024!`).

2. **Perbaiki PM2 Entrypoint** — Sebelumnya PM2 menjalankan `npm run dev` (development mode) dari directory yang salah (`/home/miftah/wedding-invitation` yang tidak ada). Diubah ke `node start.mjs` dari `/var/www/project-invitation`.

3. **Install dotenv** — Package `dotenv` tidak terinstall. Entry point `start.mjs` membutuhkan `dotenv/config` untuk memuat variabel dari `.env`. Menjalankan `npm install dotenv --save`.

4. **Buat Ulang ecosystem.config.cjs** — Konfigurasi PM2 production yang benar:
 - Script: `node start.mjs` (bukan `npm run dev`)
 - CWD: `/var/www/project-invitation`
 - Environment variables di-pass langsung ke PM2 (bukan rely `.env` saja)
 - Fork mode (1 instance, hemat RAM di VM 1.9GB)
 - `watch: false` (production tidak perlu hot reload)
 - Log ke `/home/miftah/.pm2/logs/`

5. **Pass DB Environment Variables** — Karena SvelteKit menggunakan `$env/dynamic/private`, env vars harus tersedia saat runtime. Solusi: pass semua DB vars di `env` section PM2 config.

6. **pm2 save** — Process list disimpan agar auto-restart saat reboot.

**Hasil:** 
- ✅ `project-invitation-prod` online, 0 restart, ~80MB RAM
- ✅ Port 3003 listening
- ✅ MySQL connected successfully
- ✅ `temuin.web.id` bisa diakses (HTTP 200)

**Perbaikan MkDocs Nav Auto-Update:**
- Created script `~/.hermes/scripts/update_mkdocs_nav.py` yang otomatis scan `docs/research/` dan update navigasi di `mkdocs.yml`
- 4 research digest (28 Apr – 01 May) yang sebelumnya tidak muncul di nav sudah ditambahkan
- Updated 3 cron jobs (research-automation, ai-news-rss-fetcher, daily-article-generation) untuk menjalankan nav updater setelah generate content

---

## April 2026

### 27 April 2026
- Redesign UI MkDocs Material — dark mode, deep purple + cyan accent
- Setup production build wedding invitation via PM2 (adapter-node)
- Fix env loading di PM2 (start.mjs + dotenv)
- Optimasi RAM: production build 75MB (vs dev mode 150-200MB)
- Navigasi Research di MkDocs — tambahkan 8 digest terbaru (19–27 April)

### 26 April 2026
- Research digest: 12 paper arXiv baru
- Wedding invitation platform stabil via PM2

### 23 April 2026
- Research digest: paper cv & NLP terbaru
- Monitoring webhook Google Sheet aktif

### 20–22 April 2026
- Automated daily research digest berjalan rutin (08:00 WIB)
- WhatsApp bridge tetap aktif

### 19 April 2026
- Research digest: 14 paper arXiv
- Testing webhook subscriptions

### 15 April 2026
- Konfigurasi rclone untuk backup ke Google Drive
- Update model AI ke minimax-m2.5
- Setup posting otomatis ke Twitter/X

### 14 April 2026
- Update website blog dengan konten riset terbaru
- Setup automation push ke GitHub
- Perbaikan navigasi menu riset

### 13 April 2026
- Setup MkDocs dengan tema Material
- Membuat sistem otomatis untuk riset harian
- Konfigurasi cron job untuk content generation

---

## Maret 2026

### 31 Maret 2026
- Migrasi infrastruktur ke Proxmox
- Setup VM untuk development

---

## Catatan

- Semua catatan ditulis dalam Bahasa Indonesia
- Jurnal diperbarui secara berkala
- topik meliputi: teknologi, AI, DevOps, dan pembelajaran

---

*Terakhir diperbarui: 01 Mei 2026*
