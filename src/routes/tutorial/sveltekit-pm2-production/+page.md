---
title: "Deploy SvelteKit ke Production dengan PM2"
description: "Panduan lengkap deploy SvelteKit ke production menggunakan PM2 — dari build hingga auto-restart."
tags: [tutorial]
---

# Deploy SvelteKit ke Production dengan PM2

Panduan lengkap mengubah aplikasi SvelteKit dari mode development ke production build yang stabil dan efisien menggunakan PM2.

---

## Mengapa PM2?

PM2 adalah process manager untuk Node.js yang menyediakan:
- **Auto-restart** saat crash atau server reboot
- **Log management** terpusat
- **Monitoring** resource (CPU, RAM)
- **Zero-downtime reload**

---

## Langkah 1: Install adapter-node

SvelteKit default menggunakan `adapter-auto`. Untuk production di server sendiri, ganti ke `adapter-node`:

```bash
cd ~/wedding-invitation
npm install @sveltejs/adapter-node
```

---

## Langkah 2: Update svelte.config.js

```javascript
import adapter from '@sveltejs/adapter-node';
// (ganti dari adapter-auto)

const config = {
 kit: {
 adapter: adapter(),
 }
};
```

---

## Langkah 3: Build Production

```bash
npm run build
```

Hasil build masuk ke folder `build/` — ini adalah server Node.js mandiri yang siap deploy.

---

## Langkah 4: Buat Startup Wrapper

Buat file `start.mjs` untuk memastikan `.env` termuat:

```javascript
import 'dotenv/config';
import './build/index.js';
```

Tanpa wrapper ini, PM2 sering gagal membaca environment variables.

---

## Langkah 5: Konfigurasi PM2

Buat `ecosystem.config.cjs`:

```javascript
module.exports = {
 apps: [{
 name: 'wedding-invitation',
 script: 'node',
 args: 'start.mjs',
 cwd: '/home/miftah/wedding-invitation',
 env: {
 NODE_ENV: 'production',
 PORT: 3003,
 },
 instances: 1,
 max_memory_restart: '200M',
 }]
};
```

---

## Langkah 6: Jalankan

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## Hasil

| Metric | Dev Mode | Production |
|---|---|---|
| RAM | ~150-200 MB | ~75 MB |
| CPU | Tinggi (hot reload) | Rendah |
| Fitur | HMR, debug | Optimized, minified |

---

## Troubleshooting

**"Internal Error" saat start?**
Cek log: `pm2 logs wedding-invitation --err`

**Database connection denied?**
Pastikan `.env` terbaca — cek dengan console.log di `start.mjs`.

**Restart setelah edit config?**
```bash
pm2 restart wedding-invitation --update-env
```
