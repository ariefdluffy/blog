---
title: "Cari AKPK — Pencarian Standar Kompetensi ASN"
description: "Aplikasi pencarian standar kompetensi ASN berbasis SvelteKit + SQLite FTS5."
date: 2026-05-04
tags:
 - sveltekit
 - sqlite
 - fts5
 - tutorial
 - project
---

# Cari AKPK — Aplikasi Pencarian Standar Kompetensi ASN

**Cari AKPK** adalah aplikasi web pencarian untuk metadata peraturan terkait Standar Kompetensi Jabatan Pelaksana ASN. Dibangun dengan **SvelteKit** dan **SQLite (FTS5)**, aplikasi ini memungkinkan ASN mencari standar kompetensi teknis, manajerial, dan sosial kultural dari berbagai sumber regulasi.

Akses: [search.lockbit.my.id](https://search.lockbit.my.id)

---

## Arsitektur & Struktur Code

### Project Tree

```
pdf-search/
├── src/
│ ├── routes/
│ │ ├── +layout.svelte # Layout minimal
│ │ ├── +page.svelte # Halaman utama (2 kolom, 1708 baris)
│ │ └── api/
│ │ └── search/
│ │ └── +server.ts # API endpoint pencarian (314 baris)
│ ├── app.d.ts # Type declarations
│ ├── app.html # Template HTML (Inter font, favicon SVG)
│ └── hooks.server.ts # CSP headers
├── static/
│ ├── logo.svg # Logo Cari AKPK (gradient cyan→violet)
│ └── favicon.svg # Favicon SVG
├── ecosystem.config.cjs # PM2 config (port 3010)
├── package.json
├── svelte.config.js
└── vite.config.ts
```

### Alur Pencarian

```
User input keyword → POST /api/search
 → Loop 4 database
 → Priority: FTS5 MATCH (phrase search)
 → Fallback: LIKE '%keyword%'
 → Group consecutive pages
 → Sort by relevance
 → Return JSON → Render 2-column UI
```

### Source Badge Warna

| Database | Badge | Warna |
|---|---|---|
| PERGUB 46/2022 | PERGUB | Violet |
| KEPMENPANRB SKJ.01/2025 | KEPMENPANRB | Emerald |
| PERMENPAN 38/2017 | PERMENPAN 38 | Amber |
| Permen 108/2017 | PERMENPAN 108 | Blue |

### Database

4 file SQLite di `/home/miftah/data/`:

| Database | Halaman | Ukuran |
|---|---|---|
| `kepmenpanrb_skj001_2025_metadata.db` | 226 | 2.9 MB |
| `PERGUB_46_2022_metadata.db` | 2.154 | 33 MB |
| `permen_108_2017_metadata.db` | 530 | 4.9 MB |
| `permenpan_38_2017_metadata.db` | 108 | 1.1 MB |

Setiap database memiliki tabel `pages` dengan kolom: `page_num`, `title`, `content`, `full_text`, `extracted_at`.

---

## Bug Fix: Double-Space Masalah Pencarian Multi-Kata

### Masalah

Saat mencari **"Kementerian Perhubungan"**, aplikasi tidak menemukan hasil meskipun data ada di database.

### Root Cause

PDF sumber menggunakan format tabel dengan **dua spasi** sebagai pemisah kolom. Saat diekstrak, teks menjadi:

```
Di database: "Kementerian Perhubungan" (DUA spasi)
Yang dicari: "Kementerian Perhubungan" (SATU spasi)
```

Query `LIKE '%Kementerian Perhubungan%'` gagal match karena perbedaan jumlah spasi.

Dari 4 database, **3** mengalami masalah ini:

| Database | Halaman dengan double-space |
|---|---|
| `kepmenpanrb_skj001_2025` | **226/226** (100%) |
| `PERGUB 46/2022` | **2.144/2.154** (99.5%) |
| `permen_108_2017` | **530/530** (100%) |
| `permenpan_38_2017` | **0/108** (0%) |

### Solusi: Normalisasi + FTS5

Dilakukan **Opsi C** — normalisasi konten dan penambahan indeks FTS5:

**1. Normalisasi konten:**

```python
def normalize_text(text):
 text = re.sub(r'[\r\n\t]+', ' ', text) # newline → spasi
 text = re.sub(r' {2,}', ' ', text) # 2+ spasi → 1 spasi
 return text.strip()
```

**2. Buat FTS5 Index:**

```sql
CREATE VIRTUAL TABLE pages_fts USING fts5(
 title, content, full_text,
 content='pages',
 content_rowid='page_num',
 tokenize='porter unicode61'
);
```

**3. Populate:**

```sql
INSERT INTO pages_fts(rowid, title, content, full_text)
SELECT page_num, title, content, full_text FROM pages;
```

### Hasil

| Keyword | Sebelum | Sesudah |
|---|---|---|
| "Kementerian Perhubungan" | ❌ 0 | ✅ **72 matches** |
| "Kementerian Keuangan" | ❌ 0 | ✅ **6 matches** |
| "Kementerian Pekerjaan Umum" | ❌ 0 | ✅ **8 matches** |
| "Kepala Dinas" | ❌ 0 | ✅ **27 matches** |
| Waktu pencarian | ~80ms | **~50-60ms** (lebih cepat) |

### Update Search API

API endpoint `+server.ts` diubah untuk prioritaskan **FTS5 MATCH**:

```typescript
// FTS5 query builder
function buildFtsQuery(keyword: string): string {
 const cleaned = keyword.trim().replace(/[\^"()+\-~*:]/g, ' ');
 const normalized = cleaned.replace(/\s+/g, ' ').trim();
 if (normalized.includes(' ')) {
 return `"${normalized}"`; // phrase match
 }
 return normalized; // single word
}
```

Dengan fallback ke `LIKE` jika FTS5 gagal (misal karakter spesial).

---

## Redesain UI

Tampilan diubah dari tema hitam polos menjadi desain lebih modern:

### Sebelum

- Background hitam pekat `#0a0a0f`
- Font sistem default
- Header emoji 📖
- Card datar tanpa efek
- Spinner putih standar

### Sesudah

- **Background** navy dalam `#0b0d17` dengan gradient radial subtle (cyan & violet)
- **Typography** — Font Inter dari Google Fonts (400–800 weight)
- **Logo** — SVG profesional: kaca pembesar + buku dengan gradient cyan→violet
- **Favicon** — SVG minimal bertema sama
- **Glassmorphism** — Panel dengan `backdrop-filter: blur(8px)` dan border transparan
- **Search input** — Glow effect saat fokus dengan box-shadow
- **Tombol** — Gradient cyan→violet pada tombol Cari
- **Card** — Animasi fade-slide saat muncul, highlight gradient pada keyword
- **Scrollbar** — Lebih tipis (6px) dengan hover effect
- **Welcome state** — Ilustrasi SVG interaktif

### Tech Stack UI

- Framework: **Svelte 5** (``state`, ``derived`, `onclick` sintaks baru)
- Styling: **Scoped CSS** (`` dalam komponen)
- Font: **Inter** via Google Fonts
- Aset: **SVG inline** untuk logo dan ilustrasi

---

## Deployment

### PM2

```javascript
// ecosystem.config.cjs
module.exports = {
 apps: [{
 name: 'cari-akpk',
 script: '/home/miftah/projects/pdf-search/build/index.js',
 cwd: '/home/miftah/projects/pdf-search',
 env: { PORT: 3010 }
 }]
};
```

### Domain & Tunnel

- Domain: `search.lockbit.my.id`
- Tunnel: **Cloudflare Tunnel** → localhost:3010
- Server: VM internal

### Workflow Update

```bash
npm run build # Build SvelteKit
pm2 restart cari-akpk # Restart PM2
```

---

## Backup

Semua file backup disimpan di `/home/miftah/backup/akpk/`:

| File | Ukuran | Isi |
|---|---|---|
| `akpk-databases_20260504_1512.tar.gz` | 7.9 MB | 4 database + backup original |
| `pdf-search-source_clean_20260504_1512.tar.gz` | 32 KB | Source code (tanpa build \bartifacts) |
| `normalize_all.py` | 4.9 KB | Script normalisasi + FTS5 |
