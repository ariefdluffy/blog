# Product Requirements Document (PRD)
## Rebuild Hermes Blog → SvelteKit

**Version:** 2.2  
**Date:** 2026-06-01  
**Status:** Draft  
**Source Project:** `C:\Users\pkmf\Documents\pyhton\laporan-site`  
**Target Project:** `C:\Users\pkmf\Documents\svelte\blog`  
**Live Site:** [blog.lockbit.my.id](https://blog.lockbit.my.id)

---

## 1. Executive Summary

Rebuild **Hermes Blog** (blog.lockbit.my.id) dari MkDocs Material ke SvelteKit dengan UI/UX modern. Site ini adalah blog pribadi Bahasa Indonesia milik **Miftahul Arif** yang berfokus pada AI research digests, tech tutorials, dan jurnal harian. Konten di-generate otomatis via cron job setiap hari pukul 08:00 WIB.

---

## 2. Current State Analysis

### 2.1 Tech Stack (Lama)

| Component | Technology | Version |
|-----------|-----------|---------|
| SSG | MkDocs | 1.6.1 |
| Theme | mkdocs-material | 9.7.6 |
| Markdown | Python-Markdown | 3.10.2 |
| Extensions | pymdownx | 10.21.2 |
| Template | Jinja2 | 3.1.6 |
| Syntax | Pygments | 2.20.0 |
| Deploy | ghp-import | 2.1.0 |
| Runtime | Python | 3.10 |
| Hosting | Custom domain | blog.lockbit.my.id |

### 2.2 Design System Saat Ini

Dari `docs/assets/styles.css`:

```css
/* Color Scheme */
--laporan-primary: #6B21A8;        /* Deep Purple */
--laporan-primary-light: #7C3AED;
--laporan-primary-dark: #581C87;
--laporan-accent: #06B6D4;         /* Cyan */
--laporan-accent-light: #22D3EE;

/* Dark Mode */
--md-default-bg-color: #0D0D12;
--md-typeset-color: #F3F4F6;
--md-primary-fg-color: #A78BFA;

/* Light Mode */
--md-default-bg-color: #FFFFFF;
--md-typeset-color: #1F2937;
--md-primary-fg-color: #4C1D95;
```

### 2.3 Site Identity

| Field | Value |
|-------|-------|
| **Nama** | Hermes Blog |
| **Author** | Miftahul Arif |
| **Email** | areftheluffy@gmail.com |
| **GitHub** | @ariefdluffy |
| **Domain** | blog.lockbit.my.id |
| **Lokasi** | 🇮🇩 Indonesia (WITA - UTC+9) |
| **Bahasa** | Indonesia |

### 2.4 Content Inventory

**Total: 42 file .md (~650KB)**

| Section | Files | Total Size | Content Type |
|---------|-------|------------|--------------|
| **Root Pages** | 7 | ~453KB | index, about, tech (merged AI News + Tech), contact, journal, tutorial |
| **Research** | 19 | ~104KB | Daily digests from arXiv (Apr 16 - May 2, 2026) |
| **Tutorial** | 13 | ~175KB | Step-by-step guides with code |
| **Knowledge Base** | 2 | ~6KB | Twitter tip queue |
| **Assets** | 2 | ~16KB | favicon.png, styles.css |

> **Note:** `ai-news.md` (254KB) dan `tech.md` (113KB) digabung jadi satu section **"Teknologi & AI"** agar lebih optimal.

### 2.5 Detailed Content Map

#### Root Pages

| File | Size | Description |
|------|------|-------------|
| `index.md` | 1.2KB | Homepage — navigasi cepat, deskripsi blog |
| `about.md` | 1.2KB | Profil author — minat, proyek, tech stack |
| `ai-news.md` + `tech.md` | **367KB** | **DIGABUNG** → section "Teknologi & AI" (news + articles + arXiv papers) |
| `contact.md` | 1.2KB | Email, GitHub, platform connections |
| `journal.md` | 3.7KB | Catatan harian (Mar-Mei 2026) |
| `tutorial.md` | 1.3KB | Tutorial listing page |

#### Research Digests (19 files)

| File | Size | Status |
|------|------|--------|
| `daily-digest-2026-04-16.md` | 8.6KB | ✅ Full content (18 papers) |
| `daily-digest-2026-04-17.md` | 9.9KB | ✅ Full content |
| `daily-digest-2026-04-19.md` | 15.6KB | ✅ Full content |
| `daily-digest-2026-04-20.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-21.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-22.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-23.md` | 10.3KB | ✅ Full content |
| `daily-digest-2026-04-24.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-25.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-26.md` | 15.3KB | ✅ Full content |
| `daily-digest-2026-04-27.md` | 12.6KB | ✅ Full content |
| `daily-digest-2026-04-28.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-04-29.md` | 15.2KB | ✅ Full content |
| `daily-digest-2026-04-30.md` | 436B | ⚠️ Stub |
| `daily-digest-2026-05-01.md` | 9.4KB | ✅ Full content |
| `daily-digest-2026-05-02.md` | 432B | ⚠️ Stub |
| `daily-digest.md` | 1.0KB | Index/landing page |
| `latest-digest.md` | 432B | Redirect page |

**Note:** 8 dari 17 daily digests adalah stub (436B = placeholder). 9 memiliki konten penuh.

#### Tutorials (13 files)

| File | Size | Topic |
|------|------|-------|
| `PLAN.md` | **36.8KB** | Planning documents |
| `tauri-svelte-desktop-guide.md` | **48.9KB** | Tauri + Svelte desktop app |
| `rust-programming-guide.md` | 24.6KB | Rust programming |
| `stock-analysis-design.md` | 22.2KB | Stock analysis system |
| `cloudflare-turnstile-sveltekit.md` | 10.9KB | Cloudflare Turnstile + SvelteKit |
| `cari-akpk.md` | 7.1KB | AKPK search tool |
| `shortlink-business-plan.md` | 4.6KB | Shortlink business model |
| `webhook-google-sheet-monitor.md` | 3.2KB | Google Sheets webhook |
| `google-drive-backup.md` | 3.0KB | Google Drive backup |
| `hestiacp-installation-guide.md` | 2.9KB | HestiaCP server setup |
| `mkdocs-dark-theme.md` | 2.9KB | MkDocs dark theme |
| `whatsapp-bridge-setup.md` | 2.6KB | WhatsApp bridge |
| `sveltekit-pm2-production.md` | 2.1KB | SvelteKit + PM2 deploy |

#### Knowledge Base

| File | Size | Content |
|------|------|---------|
| `index.md` | 89B | KB landing page |
| `05-twitter-tips/tip-queue.md` | 6.4KB | Twitter/X auto-posting queue with timestamps |

---

## 3. Content Characteristics

### 3.1 Markdown Features Used

| Feature | Syntax | Example |
|---------|--------|---------|
| **Admonitions** | `!!! info "Title"` | `!!! info "Artikel Otomatis"` |
| **Internal Links** | `[text](./path.md)` | `[Riset](./research/daily-digest.md)` |
| **Tables** | Standard markdown | `| Col1 | Col2 |` |
| **Code Blocks** | Fenced with lang | ` ```bash `, ` ```typescript ` |
| **Headers** | H1-H4 | `# Title`, `## Section` |
| **Lists** | Ordered/Unordered | `- item`, `1. item` |
| **Bold/Italic** | `**bold**`, `*italic*` | Standard |
| **Links** | External URLs | `[arXiv](https://arxiv.org/abs/...)` |
| **Images** | `![alt](path)` | favicon.png reference |
| **Horizontal Rules** | `---` | Section dividers |

### 3.2 Research Digest Structure

```markdown
# Daily Research Digest
## DD Month YYYY

---

## Category Name (e.g., AI & Autonomous Agents)

### 1. Paper Title
- **ID:** [arxiv_id](url) | **Published:** YYYY-MM-DD
- **Authors:** Author1, Author2
- **Categories:** cs.AI, cs.LG
- **Abstract:** Truncated abstract...
- **PDF:** [url]

---

## Kategori & Jumlah Paper
- **Category:** N paper
**Total paper ditemukan:** N

---

## Sumber
- [arXiv cs.AI](url)
*Digest dihasilkan secara otomatis pada DD Month YYYY pukul HH:MM WIB*
```

### 3.3 Automation Pipeline

Content di-generate otomatis via 3 cron jobs:
1. **research-automation** — Generate daily research digests
2. **ai-news-rss-fetcher** — Fetch AI news
3. **daily-article-generation** — Generate tech articles

Setelah generate, script `update_mkdocs_nav.py` auto-update navigasi mkdocs.yml.

---

## 4. Goals & Objectives

### 4.1 Primary Goals

| # | Goal | Success Metric |
|---|------|----------------|
| 1 | Migrate semua 42 file .md ke SvelteKit | 100% content accessible |
| 2 | Preserve URL structure | No broken links from search engines |
| 3 | Improve UI/UX dari MkDocs Material | Lighthouse score ≥ 95 |
| 4 | Implement interactive features | Page transitions, command palette, live search |
| 5 | Keep markdown authoring workflow | MDSvex support |
| 6 | Maintain automation compatibility | Cron jobs can still push content |

### 4.2 Non-Goals

- ❌ Build CMS backend (tetap file-based, git push)
- ❌ User authentication system
- ❌ Real-time collaboration
- ❌ Multi-language i18n (tetap Bahasa Indonesia)
- ❌ E-commerce features

---

## 5. Target Tech Stack

### 5.1 Core Framework

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| **Framework** | SvelteKit | 2.x | SSR/SSG, file routing, form actions |
| **UI Runtime** | Svelte | 5.x (runes) | Performance, small bundle, reactive |
| **Styling** | Tailwind CSS | v4 | Utility-first, dark mode, theming |
| **Content** | MDSvex | latest | Markdown + Svelte components inline |
| **Build** | Vite + **Bun** | latest | Bun sebagai package manager & runtime |
| **Language** | TypeScript | 5.x | Type safety, better DX |

> **Build Toolchain:** Menggunakan **Bun** (bukan npm/yarn/pnpm)
> - `bun install` — install dependencies
> - `bun run dev` — development server
> - `bun run build` — production build
> - `bunx` — run CLI tools (e.g., `bunx sv create`)

### 5.2 Content & Data

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Markdown** | MDSvex + remark/rehype | Admonitions, TOC, code highlight |
| **Search** | Pagefind | Build-time index, ~15KB, fast |
| **Syntax Highlight** | Shiki | VS Code-quality, dark mode aware |
| **RSS** | `feed` package | Research + tutorial feeds |
| **Sitemap** | `svelte-sitemap` | Auto-generated |

### 5.3 UI Components

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Component Library** | Skeleton UI v3 | Svelte-native, Tailwind-based |
| **Icons** | Lucide Svelte | Tree-shakeable |
| **Animations** | Svelte transitions + GSAP | Native + scroll effects |
| **Command Palette** | `cmdk-sv` or custom | ⌘K navigation |

### 5.4 Deployment

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Adapter** | `@sveltejs/adapter-node` | Node.js server output untuk PM2 |
| **Process Manager** | **PM2** | Auto-restart, log management, monitoring |
| **Hosting** | Self-hosted server (VPS/VM) | Sama dengan infra saat ini |
| **Build Tool** | **Bun** | Fast install, fast build |
| **CI/CD** | GitHub Actions | Auto-build on content push |
| **Analytics** | Umami | Privacy-friendly, self-hosted |

### 5.5 PM2 Configuration

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'hermes-blog',
    script: 'node',
    args: 'build/index.js',
    cwd: '/var/www/hermes-blog',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    max_memory_restart: '200M',
    watch: false,
    autorestart: true,
  }]
};
```

### 5.6 Build Commands (Bun)

```bash
# Install dependencies
bun install

# Development
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 6. Feature Requirements

### 6.1 Must Have (P0)

| # | Feature | Description | MkDocs Equivalent |
|---|---------|-------------|-------------------|
| F-001 | **Markdown Content** | All 42 .md files render via MDSvex | Built-in |
| F-002 | **Sidebar Navigation** | Auto-generated from directory structure | `mkdocs.yml` nav |
| F-003 | **Dark/Light Mode** | Toggle with system preference | Material toggle |
| F-004 | **Full-text Search** | Pagefind, instant results | lunr.js |
| F-005 | **Code Syntax Highlighting** | Shiki with copy button | Pygments |
| F-006 | **Mobile-First Responsive** | Optimized untuk semua device, touch-friendly | Material responsive |
| F-007 | **Readable Content** | Typography optimal, line-height, contrast | — |
| F-008 | **Breadcrumbs** | Current location in hierarchy | Material breadcrumbs |
| F-009 | **Table of Contents** | Auto from headings, floating | Material TOC |
| F-010 | **Admonitions** | `!!! note/warning/info` boxes | pymdownx |
| F-011 | **SEO Meta Tags** | OG images, sitemap, structured data | Material social cards |
| F-012 | **RSS Feeds** | Per-section feeds | Plugin |
| F-013 | **Purple/Cyan Theme** | Preserve current color scheme | Custom CSS |
| F-014 | **Merged Tech & AI Section** | Gabung ai-news + tech dengan sub-routes | — |

### 6.2 Should Have (P1)

| # | Feature | Description |
|---|---------|-------------|
| F-015 | **Page Transitions** | Animated route changes |
| F-016 | **Command Palette** | ⌘K keyboard navigation |
| F-017 | **Research Timeline** | Calendar view for daily-digest |
| F-018 | **Reading Progress** | Scroll progress indicator |
| F-019 | **Tag Filtering** | Filter research by category |
| F-020 | **Related Content** | "Baca selanjutnya" suggestions |
| F-021 | **Print Layout** | Optimized print stylesheet |
| F-022 | **Image Optimization** | AVIF/WebP with blur-up |
| F-023 | **ArXiv Paper Cards** | Rich cards for research papers |
| F-024 | **Twitter Tip Queue** | Display shared tweets with timestamps |
| F-025 | **Tech/News Sub-tabs** | Tab navigation within merged section |
| F-026 | **Mobile Bottom Nav** | Thumb-friendly navigation on mobile |
| F-027 | **Swipe Gestures** | Navigate between articles with swipe |

### 6.3 Nice to Have (P2)

| # | Feature | Description |
|---|---------|-------------|
| F-028 | **Newsletter Subscribe** | Email collection |
| F-029 | **Comments** | Giscus integration |
| F-030 | **Paper Statistics** | Charts for research categories |
| F-031 | **Automation Hook** | API endpoint for cron job content push |

---

## 7. Route Structure

```
src/routes/
├── +layout.svelte                    # Root layout (nav, sidebar, footer)
├── +layout.ts                        # Load nav structure
├── +page.md                          # Homepage (from index.md)
│
├── about/
│   └── +page.md                      # About page
│
├── contact/
│   └── +page.md                      # Contact info
│
├── journal/
│   └── +page.md                      # Journal entries
│
├── knowledge-base/
│   ├── +page.md                      # KB index
│   └── 05-twitter-tips/
│       └── tip-queue/
│           └── +page.md              # Twitter tip queue
│
├── research/
│   ├── +page.md                      # Research landing
│   ├── daily-digest/
│   │   └── [date]/
│   │       └── +page.md              # /research/daily-digest/2026-04-16
│   ├── latest-digest/
│   │   └── +page.ts                  # Redirect to latest
│   └── tags/
│       └── [tag]/
│           └── +page.svelte          # Filter by tag
│
├── tech/
│   ├── +page.svelte                  # Teknologi & AI listing (merged)
│   ├── +page.md                      # Landing page content
│   ├── news/
│   │   ├── +page.svelte              # AI News sub-listing
│   │   └── [slug]/
│   │       └── +page.md              # Individual news article
│   └── [slug]/
│       └── +page.md                  # Individual tech article
│
└── tutorial/
    ├── +page.svelte                  # Tutorial listing
    └── [slug]/
        └── +page.md                  # Individual tutorial
```

> **Struktur section "Teknologi & AI":**
> - `/tech` — Landing page (gabungan AI News + Tech articles)
> - `/tech/news` — Sub-section AI News
> - `/tech/[slug]` — Individual tech article
> - `/tech/news/[slug]` — Individual news article

---

## 8. Content Migration

### 8.1 File Mapping

| Source (docs/) | Target (src/routes/) | Action |
|---------------|---------------------|--------|
| `index.md` | `+page.md` | Direct copy |
| `about.md` | `about/+page.md` | Direct copy |
| `contact.md` | `contact/+page.md` | Direct copy |
| `journal.md` | `journal/+page.md` | Direct copy |
| `ai-news.md` + `tech.md` | `tech/+page.md` + `tech/+page.svelte` | **MERGE** — gabung konten, split ke sub-routes |
| `tutorial.md` | `tutorial/+page.md` | Direct copy |
| `research/daily-digest.md` | `research/+page.md` | Direct copy |
| `research/daily-digest-*.md` | `research/daily-digest/[date]/+page.md` | Rename with date slug |
| `research/latest-digest.md` | `research/latest-digest/+page.ts` | Convert to redirect |
| `tutorial/*.md` | `tutorial/[slug]/+page.md` | Move to dynamic route |
| `knowledge-base/**/*.md` | `knowledge-base/**/+page.md` | Preserve structure |
| `assets/styles.css` | Tailwind config | Extract design tokens |
| `assets/favicon.png` | `static/favicon.png` | Direct copy |

### 8.2 Syntax Conversion Required

| MkDocs Syntax | SvelteKit/MDSvex Equivalent |
|---------------|----------------------------|
| `!!! info "Title"` | `<Admonition type="info" title="Title">` |
| `!!! warning` | `<Admonition type="warning">` |
| `[link](./path.md)` | `[link](/path)` (remove .md extension) |
| `[link](../dir/file.md)` | `[link](/dir/file)` |

### 8.3 Frontmatter Addition

Current files have no frontmatter. Need to add:

```yaml
---
title: "Judul Artikel"
description: "Deskripsi untuk SEO"
date: 2026-04-16
tags: [research, ai, daily-digest]
category: research
---
```

### 8.4 Automation Compatibility

Current pipeline: cron → generate .md → update_mkdocs_nav.py → git push

New pipeline: cron → generate .md → git push → SvelteKit auto-build

**Requirement:** Content files must remain as `.md` in `docs/` directory. Automation script path unchanged.

---

## 9. UI/UX Specifications

### 9.1 Design Tokens (Preserve Current Theme)

```css
/* From current styles.css */
:root {
  --primary: #6B21A8;           /* Deep Purple */
  --primary-light: #7C3AED;
  --primary-dark: #581C87;
  --accent: #06B6D4;            /* Cyan */
  --accent-light: #22D3EE;
}

/* Light Mode */
--bg-primary: #FFFFFF;
--bg-secondary: #FAFAFA;
--text-primary: #1F2937;
--text-link: #0891B2;

/* Dark Mode */
--bg-primary: #0D0D12;
--bg-secondary: #16161D;
--text-primary: #F3F4F6;
--text-link: #22D3EE;
```

### 9.2 Typography (Readability Focus)

| Element | Font | Weight | Size (Mobile) | Size (Desktop) | Line Height |
|---------|------|--------|---------------|----------------|-------------|
| Body | system-ui / Inter | 400 | 16px | 17px | **1.75** |
| H1 | system-ui / Inter | 800 | 28px | 36px | 1.2 |
| H2 | system-ui / Inter | 700 | 24px | 28px | 1.3 |
| H3-H4 | system-ui / Inter | 600 | 20px | 22px | 1.4 |
| Code | JetBrains Mono / Fira Code | 400 | 14px | 14px | 1.5 |
| Links | Inherit | 500 | inherit | inherit | inherit |
| **Content Width** | — | — | 100% | **680px max** | — |

### 9.3 Readability Standards

| Aspect | Specification |
|--------|---------------|
| **Line Length** | Max 680px (optimal 50-75 chars per line) |
| **Line Height** | 1.75 for body text (1.5 for headings) |
| **Paragraph Spacing** | 1.5em margin-bottom |
| **Content Padding** | 16px mobile, 24px tablet, 0 desktop |
| **Contrast Ratio** | Min 4.5:1 (WCAG AA) |
| **Font Size** | Min 16px body (no zoom required on mobile) |
| **Touch Targets** | Min 44x44px for interactive elements |
| **Focus States** | Visible ring for keyboard navigation |

### 9.4 Responsive Breakpoints (Mobile-First)

| Breakpoint | Width | Layout | Content |
|------------|-------|--------|--------|
| **Mobile** | < 640px | Single column, bottom nav, hamburger sidebar | Full-width, stacked cards |
| **Mobile L** | 640px - 767px | Single column, more spacing | Slightly wider content |
| **Tablet** | 768px - 1023px | Collapsible sidebar, 2-column grid | 640px content width |
| **Desktop** | ≥ 1024px | Full sidebar + TOC, 3-column grid | 680px content width |
| **Wide** | ≥ 1280px | Wider sidebar, more whitespace | 720px content width |

### 9.5 Mobile-Specific Features

| Feature | Implementation |
|---------|---------------|
| **Bottom Navigation** | Fixed bottom bar with 5 main sections (Home, Research, Tech, Tutorial, More) |
| **Swipe Navigation** | Swipe left/right between articles |
| **Pull to Refresh** | Refresh content on pull-down |
| **Sticky Header** | Compact header on scroll (shows title only) |
| **Touch-friendly Cards** | Large tap areas, clear visual feedback |
| **Readable Code Blocks** | Horizontal scroll with scroll indicator |
| **Collapsible Sections** | Accordion-style for long content |
| **Share Button** | Native share API on mobile |
| **Back to Top** | Floating button after 2 scrolls |

### 9.6 Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Page transition | Fade + slide | 200ms |
| Sidebar (mobile) | Slide from left | 250ms |
| Theme toggle | Rotate icon | 300ms |
| Card hover | Scale + shadow | 150ms |
| Command palette | Fade + scale | 200ms |

---

## 10. Performance Requirements

| Metric | Target |
|--------|--------|
| **Lighthouse Performance** | ≥ 95 |
| **Lighthouse Accessibility** | ≥ 95 |
| **Lighthouse SEO** | ≥ 95 |
| **First Contentful Paint** | < 1.5s (mobile) |
| **Largest Contentful Paint** | < 2.5s (mobile) |
| **Total Bundle Size** | < 200KB (gzip) |
| **Search Index** | < 50KB |
| **Mobile PageSpeed** | ≥ 90 |
| **Time to Interactive** | < 3.5s (mobile 3G) |

---

## 11. Development Phases

### Phase 0: Foundation (Day 1-2)
- [ ] Init SvelteKit project dengan Bun (`bunx sv create hermes-blog`)
- [ ] Set up Tailwind CSS v4 + purple/cyan theme
- [ ] Configure MDSvex
- [ ] Create base layout (mobile-first)
- [ ] Theme toggle (dark/light)
- [ ] Copy static assets (favicon)
- [ ] Setup PM2 ecosystem config

### Phase 1: Core Migration (Day 3-5)
- [ ] Migrate all 42 .md files
- [ ] Build sidebar navigation + mobile bottom nav
- [ ] Implement responsive layout (mobile-first)
- [ ] Convert admonition syntax
- [ ] Fix internal links
- [ ] Breadcrumbs component
- [ ] Mobile hamburger menu + touch gestures

### Phase 2: Content Features (Day 6-8)
- [ ] Pagefind search integration
- [ ] Code blocks with Shiki + copy button
- [ ] Table of Contents (floating desktop, collapsible mobile)
- [ ] Research digest cards
- [ ] RSS feeds
- [ ] Tag system
- [ ] Readable typography (line-height, spacing)

### Phase 3: UX Polish (Day 9-11)
- [ ] Page transitions
- [ ] Command palette (⌘K)
- [ ] Research timeline/calendar
- [ ] Reading progress bar
- [ ] Related content
- [ ] Print stylesheet
- [ ] Mobile share button
- [ ] Back to top button
- [ ] Swipe gestures

### Phase 4: Deploy (Day 12-14)
- [ ] SEO audit
- [ ] Lighthouse audit (mobile + desktop)
- [ ] Deploy to PM2 (`bun run build && pm2 start ecosystem.config.cjs`)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Update automation scripts
- [ ] Monitor Web Vitals
- [ ] Test di berbagai device (iPhone, Android, tablet)

---

## 12. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Merge ai-news + tech complexity** | Medium | Medium | Split ke sub-routes (news/ vs articles) |
| **File besar (367KB combined)** | Medium | Medium | Paginate listing page, lazy load content |
| **Admonition syntax conversion** | Medium | Medium | Write remark plugin for auto-conversion |
| **Internal links broken** | Medium | High | Automated link checker post-migration |
| **SEO regression** | Medium | High | Preserve URL structure, 301 redirects |
| **Automation pipeline break** | Medium | High | Test cron job compatibility |
| **MDSvex limitations** | Low | Medium | Use .svelte for complex pages |

---

## 13. Success Criteria

| # | Criteria | Measurement |
|---|----------|-------------|
| 1 | All 42 .md files migrated | Content audit |
| 2 | Lighthouse ≥ 95 (desktop & mobile) | Automated CI |
| 3 | No broken internal links | Link checker |
| 4 | Dark/light mode works | Manual QA |
| 5 | Search returns results | User testing |
| 6 | RSS feeds valid | Feed validator |
| 7 | Cron jobs still work | Automation test |
| 8 | Mobile responsive (iPhone, Android, tablet) | Cross-device testing |
| 9 | Content readable (contrast, spacing, font size) | Accessibility audit |
| 10 | PM2 deployment stable | Server monitoring |
| 11 | Bun build successful | CI pipeline |

---

## 14. Open Questions

1. ~~Hosting~~ — ✅ **PM2** (confirmed)
2. ~~Build tool~~ — ✅ **Bun** (confirmed)
3. **Automation** — Cron job tetap push ke docs/ atau perlu perubahan?
4. **Custom domain** — Tetap blog.lockbit.my.id?
5. **Comments** — Giscus atau tidak?

---

## 15. Appendix

### A. Content File Inventory

```
docs/
├── index.md                    (1.2KB)
├── about.md                    (1.2KB)
├── ai-news.md                  (254KB) ⚠️
├── contact.md                  (1.2KB)
├── journal.md                  (3.7KB)
├── tech.md                     (113KB) ⚠️
├── tutorial.md                 (1.3KB)
├── assets/
│   ├── favicon.png             (9.9KB)
│   └── styles.css              (6.3KB)
├── knowledge-base/
│   ├── index.md                (89B)
│   └── 05-twitter-tips/
│       └── tip-queue.md        (6.4KB)
├── research/
│   ├── daily-digest.md         (1.0KB)
│   ├── latest-digest.md        (432B)
│   ├── daily-digest-2026-04-16.md  (8.6KB)
│   ├── daily-digest-2026-04-17.md  (9.9KB)
│   ├── daily-digest-2026-04-19.md  (15.6KB)
│   ├── daily-digest-2026-04-20.md  (436B) ⚠️
│   ├── daily-digest-2026-04-21.md  (436B) ⚠️
│   ├── daily-digest-2026-04-22.md  (436B) ⚠️
│   ├── daily-digest-2026-04-23.md  (10.3KB)
│   ├── daily-digest-2026-04-24.md  (436B) ⚠️
│   ├── daily-digest-2026-04-25.md  (436B) ⚠️
│   ├── daily-digest-2026-04-26.md  (15.3KB)
│   ├── daily-digest-2026-04-27.md  (12.6KB)
│   ├── daily-digest-2026-04-28.md  (436B) ⚠️
│   ├── daily-digest-2026-04-29.md  (15.2KB)
│   ├── daily-digest-2026-04-30.md  (436B) ⚠️
│   ├── daily-digest-2026-05-01.md  (9.4KB)
│   └── daily-digest-2026-05-02.md  (432B) ⚠️
└── tutorial/
    ├── PLAN.md                 (36.8KB)
    ├── tauri-svelte-desktop-guide.md (48.9KB)
    ├── rust-programming-guide.md (24.6KB)
    ├── stock-analysis-design.md (22.2KB)
    ├── cloudflare-turnstile-sveltekit.md (10.9KB)
    ├── cari-akpk.md            (7.1KB)
    ├── shortlink-business-plan.md (4.6KB)
    ├── webhook-google-sheet-monitor.md (3.2KB)
    ├── google-drive-backup.md  (3.0KB)
    ├── hestiacp-installation-guide.md (2.9KB)
    ├── mkdocs-dark-theme.md    (2.9KB)
    ├── whatsapp-bridge-setup.md (2.6KB)
    └── sveltekit-pm2-production.md (2.1KB)
```

### B. MkDocs Packages → SvelteKit Replacement

| MkDocs Package | Version | SvelteKit Replacement |
|---------------|---------|----------------------|
| mkdocs | 1.6.1 | SvelteKit 2.x |
| mkdocs-material | 9.7.6 | Custom Tailwind + Skeleton UI |
| pymdown-extensions | 10.21.2 | remark/rehype plugins |
| markdown | 3.10.2 | MDSvex |
| jinja2 | 3.1.6 | Svelte templating |
| pygments | 2.20.0 | Shiki |
| ghp-import | 2.1.0 | GitHub Actions |
| watchdog | 6.0.0 | Vite HMR |

### C. Reference Links

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [MDSvex Docs](https://mdsvex.pngwn.io)
- [Skeleton UI](https://skeleton.dev)
- [Pagefind](https://pagefind.app)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Shiki](https://shiki.style)
- [Bun Docs](https://bun.sh/docs)
- [PM2 Docs](https://pm2.keymetrics.io/)

### D. Quick Start Commands (Bun + PM2)

```bash
# Setup project
cd C:\Users\pkmf\Documents\svelte\blog
bunx sv create hermes-blog --template minimal
cd hermes-blog
bun install

# Install dependencies
bun add @sveltejs/adapter-node
bun add -D tailwindcss @tailwindcss/vite
bun add -D mdsvex
bun add -D pagefind
bun add -D shiki
bun add lucide-svelte
bun add @skeletonlabs/skeleton

# Development
bun run dev

# Production build
bun run build

# Deploy to PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# Monitor
pm2 status
pm2 logs hermes-blog
pm2 monit
```

### E. PM2 Ecosystem Config

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'hermes-blog',
    script: 'node',
    args: 'build/index.js',
    cwd: '/var/www/hermes-blog',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    max_memory_restart: '200M',
    watch: false,
    autorestart: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/var/log/hermes-blog/error.log',
    out_file: '/var/log/hermes-blog/out.log',
  }]
};
```

---

*PRD v2.2 — Updated with PM2 hosting, Bun build tool, mobile-first responsive design*
