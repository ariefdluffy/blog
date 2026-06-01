---
title: "Custom Dark Theme MkDocs Material"
description: "Custom dark theme MkDocs Material — gelap, modern, dan profesional."
tags: [tutorial]
---

# Custom Dark Theme MkDocs Material

Panduan membuat tampilan MkDocs Material yang gelap, modern, dan profesional dengan custom CSS.

---

## Prasyarat

```bash
pip install mkdocs-material
```

Pastikan `mkdocs.yml` sudah menggunakan theme Material:

```yaml
theme:
 name: material
```

---

## Langkah 1: Setup Dark Palette

Di `mkdocs.yml`, tambahkan palette configuration:

```yaml
theme:
 palette:
 - media: "(prefers-color-scheme: dark)"
 scheme: slate
 primary: deep purple
 accent: cyan
 toggle:
 icon: material/weather-night
 name: Switch to light mode
 - media: "(prefers-color-scheme: light)"
 scheme: default
 primary: deep purple
 accent: cyan
 toggle:
 icon: material/weather-sunny
 name: Switch to dark mode
```

**Slate** adalah scheme gelap bawaan Material. Kombinasi `deep purple` + `cyan` memberi kesan profesional dan modern.

---

## Langkah 2: Aktifkan Fitur Modern

```yaml
theme:
 features:
 - navigation.instant # Navigasi tanpa reload
 - navigation.instant.progress # Progress bar saat loading
 - navigation.tabs # Tab navigation di atas
 - navigation.tabs.sticky # Tab tetap terlihat saat scroll
 - navigation.sections # Grouping section
 - navigation.expand # Expand semua section
 - navigation.top # Tombol back-to-top
 - toc.follow # TOC sidebar auto-scroll
 - search.suggest # Search autocomplete
 - search.highlight # Highlight search result
 - content.code.copy # Copy button di code block
```

---

## Langkah 3: Custom CSS

Buat `docs/assets/styles.css` dan daftarkan di `mkdocs.yml`:

```yaml
extra_css:
 - assets/styles.css
```

### Variabel warna utama:

```css
:root {
 --md-primary-fg-color: #6B21A8;
 --md-accent-fg-color: #06B6D4;
 --md-default-bg-color: #0F0F14;
 --md-default-bg-color--light: #18181F;
 --md-typeset-color: #E2E2EB;
 --md-code-bg-color: #1A1A24;
}
```

### Header gradient:

```css
.md-header {
 background: linear-gradient(135deg, #581C87, #6B21A8, #4C1D95);
 box-shadow: 0 2px 20px rgba(107, 33, 168, 0.15);
}
```

### Content card:

```css
.md-main__inner {
 background: #18181F;
 border-radius: 12px;
 padding: 1.2rem;
 border: 1px solid #2A2A35;
 box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}
```

### Custom scrollbar:

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb {
 background: #3A3A45;
 border-radius: 4px;
}
```

---

## Langkah 4: Jalankan

```bash
mkdocs serve --dev-addr 0.0.0.0:8000
```

Buka browser, hasilnya langsung terlihat.

---

## Tips

- Gunakan **`Ctrl + Shift + R`** untuk hard refresh jika CSS belum berubah (browser cache)
- Testing di **incognito mode** untuk memastikan tidak ada cache
- Jika ada reverse proxy (Nginx, Cloudflare), bersihkan proxy cache juga
