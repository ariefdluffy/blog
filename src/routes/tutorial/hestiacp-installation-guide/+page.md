---
title: "Install HestiaCP di VPS Ubuntu"
description: "Panduan install HestiaCP control panel di VPS Ubuntu untuk web hosting."
tags: [tutorial]
---

# Panduan Lengkap Instalasi dan Konfigurasi Hestia Control Panel (HestiaCP)

Hestia Control Panel (HestiaCP) adalah salah satu panel kontrol web hosting gratis dan open-source paling populer saat ini. Sebagai fork dari VestaCP, HestiaCP menawarkan antarmuka yang lebih modern, keamanan yang lebih baik, dan dukungan untuk teknologi web terbaru. 

Artikel ini akan membahas secara mendalam dari persiapan hingga konfigurasi pasca-instalasi.

## Mengapa Memilih HestiaCP?
- **Resource-Friendly**: Sangat ringan, bisa berjalan lancar di VPS dengan RAM 1GB.
- **Modern Stack**: Mendukung PHP (multi-version), Nginx (Proxy), Apache, MariaDB/PostgreSQL.
- **One-Click SSL**: Integrasi Let's Encrypt yang sangat memudahkan manajemen sertifikat.
- **Web Analytics**: Terintegrasi dengan statistik server dan log yang mudah dibaca.
- **Tanpa Biaya Lisensi**: Gratis selamanya dengan fitur premium.

## Persyaratan Sistem (Minimum)
- **Sistem Operasi**: Ubuntu 20.04/22.04/24.04 LTS atau Debian 11/12.
- **RAM**: Minimal 1GB (2GB sangat direkomendasikan jika ingin mengaktifkan Antivirus/ClamAV).
- **Disk Space**: Minimal 10GB SSD.
- **CPU**: 1 Core (2 Core lebih baik).

## Langkah 1: Persiapan Server
Sebelum memulai, pastikan sistem Anda mutakhir dan memiliki dependensi dasar.

```bash
# Update dan Upgrade Sistem
sudo apt update && sudo apt upgrade -y

# Install dependensi yang diperlukan
sudo apt install ca-certificates curl gnupg lsb-release -y
```

## Langkah 2: Proses Instalasi
Gunakan skrip instalasi resmi untuk memastikan keamanan dan kompatibilitas.

```bash
# Download skrip instalasi
wget https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hst-install.sh

# Jalankan instalasi dengan parameter kustom
# Contoh di bawah ini menginstal Nginx, PHP-FPM, MariaDB, dan Exim
sudo bash hst-install.sh --interactive no --email admin@domainanda.com --password password_anda --hostname panel.domainanda.com -f
```

> **Tips**: Flag `-f` (force) digunakan jika installer mendeteksi konflik paket minor pada sistem baru.

## Langkah 3: Konfigurasi Pasca-Instalasi
Setelah proses selesai (sekitar 5-15 menit), server akan meminta reboot. Setelah login kembali, lakukan langkah berikut:

1. **Akses Panel**: Masuk ke `https://ip-server-anda:8083`.
2. **Keamanan**: Aktifkan 2FA (Two-Factor Authentication) pada profil admin.
3. **Port Kustom**: Untuk keamanan ekstra, pertimbangkan untuk mengubah port default 8083 ke port lain.
4. **Firewall**: Pastikan port 80, 443, 22, dan port panel Anda terbuka.

## Troubleshooting Umum
- **Panel Tidak Bisa Diakses**: Cek status servis dengan `v-list-sys-services`.
- **SSL Gagal**: Pastikan DNS (A Record) hostname sudah mengarah ke IP VPS Anda sebelum instalasi.

---
**Referensi Tambahan:**
- [Dokumentasi Resmi HestiaCP](https://hestiacp.com/docs/)
- [Forum Komunitas Hestia](https://forum.hestiacp.com/)
- [HestiaCP GitHub](https://github.com/hestiacp/hestiacp)
