---
title: "Setup WhatsApp Bridge di Server"
description: "Menjalankan WhatsApp bridge sebagai background service dengan persistent session."
tags: [tutorial]
---

# Setup WhatsApp Bridge di Server

Panduan menjalankan WhatsApp bridge sebagai background service di server — menggunakan session-based authentication agar tidak perlu scan QR setiap restart.

---

## Arsitektur

```
WhatsApp Client → Bridge (Node.js) → Telegram/WhatsApp API
 ↓
Session Storage (persistent)
```

Bridge bertindak sebagai jembatan antara WhatsApp Web API dan platform lain (Telegram, API internal, dll).

---

## Langkah 1: Prasyarat

```bash
# Node.js (v18+)
node -v # Pastikan >= 18

# Install dependencies
cd ~/whatsapp-bridge
npm install
```

Dependencies utama:
- `whatsapp-web.js` — WhatsApp Web API
- `qrcode-terminal` — Generate QR untuk first-time auth
- `fs` — Session storage

---

## Langkah 2: Setup Session Directory

```bash
mkdir -p /home/miftah/.hermes/whatsapp/session
```

Session akan tersimpan di folder ini. Setelah first auth, tidak perlu scan QR lagi.

---

## Langkah 3: Jalankan Bridge

```bash
node bridge.js --port 3000 \
 --session /home/miftah/.hermes/whatsapp/session \
 --mode self-chat
```

### Parameter:

| Flag | Deskripsi |
|---|---|
| `--port` | Port HTTP server |
| `--session` | Path menyimpan session auth |
| `--mode` | Mode koneksi (`self-chat`, `group`, dll) |

---

## Langkah 4: First-Time Auth (Scan QR)

Saat pertama kali dijalankan, bridge akan menampilkan QR code di terminal:

```
Scan QR code ini dengan WhatsApp:
████████████████
█ QR CODE HERE █
████████████████
```

Scan dengan WhatsApp → Settings → Linked Devices → Link a Device.

Setelah berhasil, session tersimpan dan tidak perlu scan lagi.

---

## Langkah 5: Jalankan dengan PM2

Agar bridge tetap berjalan dan auto-restart:

```bash
pm2 start bridge.js --name whatsapp-bridge \
 -- --port 3000 \
 --session /home/miftah/.hermes/whatsapp/session \
 --mode self-chat

pm2 save
pm2 startup
```

---

## Langkah 6: Monitoring

Cek status bridge:

```bash
pm2 status whatsapp-bridge
pm2 logs whatsapp-bridge --lines 20
```

Cek RAM usage:

```bash
ps aux | grep bridge
# Output: ~120 MB RAM
```

---

## Troubleshooting

**QR tidak muncul?**
- Hapus folder session dan restart: `rm -rf /home/miftah/.hermes/whatsapp/session/*`

**"Session expired" / disconnect?**
- Biasanya terjadi setelah lama tidak aktif
- Restart PM2: `pm2 restart whatsapp-bridge`
- Scan QR ulang jika session invalid

**RAM tinggi?**
- Normal: ~120 MB
- Jika > 300 MB, restart: `pm2 restart whatsapp-bridge`

**Crash loop?**
- Cek log: `pm2 logs whatsapp-bridge --err`
- Pastikan tidak ada proses lain yang pakai port 3000: `lsof -ti:3000`
