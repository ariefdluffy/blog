---
title: "Roadmap Project Hermes Agent"
description: "Roadmap pengembangan project Hermes Agent dan infrastruktur terkait."
tags: [tutorial]
---

# Project: Shortlink + Biosite Platform

Platform link shortener dan landing page/microsite builder berbasis subscription.

---

## Arsitektur Teknologi

```
User Browser
 ↕
Cloudflare Tunnel (HTTPS)
 ↕
Nginx/Caddy Reverse Proxy (VM 101 atau VM 105)
 ↕
App Server (SvelteKit)
 ↕
Database (MySQL / SQLite) → Redis (Cache & Click Logger)
```

### Stack Pilihan

| Komponen | Pilihan | Alasan |
| :--- | :--- | :--- |
| **Frontend + Backend** | SvelteKit | Kamu sudah familiar, cepat, fullstack |
| **Database** | MySQL | Kamu sudah punya, stabil untuk relasi |
| **Cache** | Redis | Hitung click realtime, session cache |
| **SSL/TLS** | Cloudflare Tunnel | Gratis, auto SSL, tidak perlu buka port |
| **Web Server** | Caddy Server | On-demand TLS untuk custom domain user |
| **Payment** | Midtrans | Sudah terintegrasi di project lain |
| **Deploy** | PM2 | Sudah biasa, auto restart |

---

## Database Schema

```sql
-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) UNIQUE NOT NULL,
 name VARCHAR(100),
 password VARCHAR(255), -- hash, nullable jika OAuth
 google_id VARCHAR(255) UNIQUE, -- untuk OAuth login
 avatar_url TEXT,
 plan ENUM('free','basic','premium') DEFAULT 'free',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 plan ENUM('free','basic','premium') NOT NULL,
 status ENUM('active','expired','cancelled') DEFAULT 'active',
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 midtrans_id VARCHAR(255), -- snap token / order id
 auto_renew BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- LINKS
-- ============================================================
CREATE TABLE links (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 short_code VARCHAR(10) UNIQUE NOT NULL,
 title VARCHAR(255),
 target_url TEXT NOT NULL,
 type ENUM('redirect','biosite') DEFAULT 'redirect',
 clicks INT DEFAULT 0,
 is_active BOOLEAN DEFAULT TRUE,
 password VARCHAR(255), -- NULL = no password
 expires_at DATETIME, -- NULL = never
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_short_code (short_code),
 INDEX idx_user_links (user_id, created_at DESC)
);

-- ============================================================
-- CLICK LOGS
-- ============================================================
CREATE TABLE click_logs (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 link_id INT NOT NULL,
 ip_address VARCHAR(45),
 user_agent TEXT,
 referer TEXT,
 country VARCHAR(100),
 city VARCHAR(100),
 device ENUM('desktop','mobile','tablet','unknown') DEFAULT 'unknown',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
 INDEX idx_link_date (link_id, created_at DESC)
);

-- ============================================================
-- BIOSITE PAGES (Microsite / Link-in-bio)
-- ============================================================
CREATE TABLE biosites (
 id INT AUTO_INCREMENT PRIMARY KEY,
 link_id INT NOT NULL UNIQUE, -- 1:1 dengan shortlink
 title VARCHAR(200),
 bio_text TEXT,
 avatar_url TEXT,
 bg_color VARCHAR(9) DEFAULT '#FFFFFF',
 text_color VARCHAR(9) DEFAULT '#000000',
 theme ENUM('default','dark','neon','pastel','custom') DEFAULT 'default',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

-- ============================================================
-- BIOSITE BUTTONS (Komponen dalam halaman)
-- ============================================================
CREATE TABLE biosite_buttons (
 id INT AUTO_INCREMENT PRIMARY KEY,
 biosite_id INT NOT NULL,
 label VARCHAR(100) NOT NULL,
 url TEXT NOT NULL,
 icon VARCHAR(50), -- 'instagram','youtube','whatsapp','link','pdf'
 sort_order INT DEFAULT 0,
 is_active BOOLEAN DEFAULT TRUE,
 bg_color VARCHAR(9) DEFAULT '#1877F2',
 text_color VARCHAR(9) DEFAULT '#FFFFFF',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (biosite_id) REFERENCES biosites(id) ON DELETE CASCADE,
 INDEX idx_biosite_buttons (biosite_id, sort_order ASC)
);

-- ============================================================
-- CUSTOM DOMAINS
-- ============================================================
CREATE TABLE custom_domains (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 domain VARCHAR(255) UNIQUE NOT NULL,
 status ENUM('pending','verified','active','failed') DEFAULT 'pending',
 cname_target VARCHAR(255) NOT NULL, -- misal: gotu.id
 ssl_status ENUM('pending','issued','failed') DEFAULT 'pending',
 verified_at DATETIME,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_user_domains (user_id)
);
```

---

## Struktur Folder Project

```
~/projects/shortlink/
├── src/
│ ├── routes/
│ │ ├── +layout.svelte # Layout utama (navbar, footer)
│ │ ├── +page.svelte # Landing page
│ │ ├── login/
│ │ │ └── +page.svelte # Login / Register
│ │ ├── dashboard/
│ │ │ ├── +layout.svelte # Sidebar layout
│ │ │ ├── +page.svelte # Overview (stats)
│ │ │ ├── links/
│ │ │ │ ├── +page.svelte # Daftar semua link
│ │ │ │ └── [id]/
│ │ │ │ ├── +page.svelte # Edit link
│ │ │ │ └── analytics.svelte # Detail analytics
│ │ │ ├── biosites/
│ │ │ │ ├── +page.svelte # Daftar biosites
│ │ │ │ ├── create.svelte # Buat baru
│ │ │ │ └── [id]/
│ │ │ │ └── +page.svelte # Edit biosite
│ │ │ ├── subscriptions/
│ │ │ │ └── +page.svelte # Manajemen subscription
│ │ │ └── settings/
│ │ │ ├── +page.svelte # Profile settings
│ │ │ └── domains.svelte # Custom domain management
│ │ ├── [shortcode]/
│ │ │ └── +server.ts # Redirect + count click
│ │ └── api/
│ │ ├── links/
│ │ │ └── +server.ts # CRUD API
│ │ ├── biosites/
│ │ │ └── +server.ts # CRUD API
│ │ ├── click/
│ │ │ └── +server.ts # Log click
│ │ └── domains/
│ │ └── +server.ts # Verify domain
│ │
│ ├── lib/
│ │ ├── server/
│ │ │ ├── db.ts # MySQL connection
│ │ │ ├── auth.ts # Auth helpers (JWT / OAuth)
│ │ │ ├── shortcode.ts # Generate unique shortcode
│ │ │ ├── click.ts # Click logger + analytics
│ │ │ └── domain.ts # CNAME verification
│ │ ├── components/
│ │ │ ├── LinkForm.svelte # Form create/edit link
│ │ │ ├── BioEditor.svelte # Biosite visual editor
│ │ │ ├── ButtonComponent.svelte # Single button in biosite
│ │ │ ├── AnalyticsChart.svelte # Click chart
│ │ │ ├── PlanBadge.svelte # Plan indicator
│ │ │ └── PricingCard.svelte # Subscription card
│ │ └── types.ts # TypeScript types
│ │
│ ├── stores/
│ │ ├── auth.ts # Auth state (login/logout/plan)
│ │ ├── links.ts # Links state management
│ │ └── ui.ts # UI state (sidebar, modal, toast)
│ │
│ ├── hooks/
│ │ ├── client/ # Hooks hanya jalan di browser
│ │ │ ├── useClickLogger.ts # Client-side click tracking
│ │ │ └── useIntersectionObserver.ts # Lazy loading / analytics
│ │ └── server/
│ │ └── useAuth.ts # Server-side auth checks
│ │
│ ├── utils/
│ │ ├── validators.ts # Zod/superstruct schema validasi
│ │ ├── format.ts # Format tanggal, angka, URL
│ │ └── constants.ts # Plan quota, limits, defaults
│ │
│ └── app.css # Global styles
│
├── static/
│ └── themes/ # Template biosite themes
│ ├── default.css
│ ├── dark.css
│ ├── neon.css
│ └── pastel.css
│
├── scripts/
│ ├── seed.sql # Initial data
│ └── migrate.sh # Migration helper
│
├── ecosystem.config.js # PM2 config
├── svelte.config.js
├── vite.config.ts
├── package.json
└── .env.example
```

---

## Best Practice SvelteKit (Code Maintainability)

### 1. Pisahkan Logic per Layer (Separation of Concerns)

Gunakan pola **Repository + Service** untuk menjaga logic tetap terisolasi dan testable:

```
src/
├── routes/ # Hanya routing handlers (thin)
├── lib/
│ ├── server/
│ │ ├── db.ts # DB connection pool (satu file aja)
│ │ ├── repositories/ # Query DB langsung
│ │ │ ├── linkRepo.ts
│ │ │ ├── userRepo.ts
│ │ │ └── clickRepo.ts
│ │ └── services/ # Business logic
│ │ ├── linkService.ts
│ │ ├── authService.ts
│ │ └── quotaService.ts
│ └── validators/ # Zod schemas
│ ├── linkSchema.ts
│ └── authSchema.ts
```

**Contoh implementasi:**

```typescript
// lib/server/repositories/linkRepo.ts
// ⚠️ Hanya query SQL. Tidak ada business logic di sini.
export async function findByShortcode(shortcode: string): Promise {
 const [rows] = await db.execute('SELECT * FROM links WHERE short_code = ?', [shortcode]);
 return rows[0] || null;
}

// lib/server/services/linkService.ts
// ⚠️ Business logic. Panggil repository, bukan query langsung.
export async function createLink(userId: number, url: string): Promise {
 // Ambil repositori
 const shortcode = shortcodeService.generate();
 // Validasi URL
 if (!isValidUrl(url)) throw new Error('URL tidak valid');
 // Cek kuota user
 await quotaService.checkLinkQuota(userId);
 // Simpan
 return linkRepo.create({ userId, shortcode, targetUrl: url });
}

// routes/dashboard/links/+page.server.ts
// ⚠️ Hanya handler. Panggil service, bukan repository.
export const actions = {
 default: async ({ request, locals }) => {
 const form = await request.formData();
 const link = await linkService.createLink(locals.user.id, form.get('url'));
 return { success: true, link };
 }
};
```

### 2. Gunakan Form Actions + Validation (Zod)

Jangan pakai API endpoint untuk form submit. Gunakan SvelteKit Form Actions + Zod.

```typescript
// lib/validators/linkSchema.ts
import { z } from 'zod';

export const createLinkSchema = z.object({
 url: z.string().url('URL tidak valid').max(2048),
 title: z.string().max(100).optional(),
 password: z.string().min(4).max(100).optional(),
});

// routes/dashboard/links/+page.server.ts
import { createLinkSchema } from '$lib/validators/linkSchema';

export const actions = {
 create: async ({ request, locals }) => {
 const form = Object.fromEntries(await request.formData());
 const parsed = createLinkSchema.safeParse(form);

 if (!parsed.success) {
 return { errors: parsed.error.flatten().fieldErrors };
 }

 const link = await linkService.create(locals.user.id, parsed.data);
 return { success: true, link };
 }
};
```

### 3. State Management: Jangan Over-engineering

Untuk project skala kecil-menengah, cukup **Svelte stores** + **page stores**. Jangan langsung pakai TanStack Query / Zustand kalau belum perlu.

```typescript
// src/stores/links.ts
import { writable } from 'svelte/store';

export const linkList = writable([]);
export const linkStats = writable({
 totalClicks: 0,
 todayClicks: 0,
});

// Di halaman

 import { linkList } from '$lib/stores/links';
 import { onMount } from 'svelte';

 export let data; // data dari +page.server.ts

 onMount(() => {
 linkList.set(data.links);
 });

```

### 4. Gunakan TypeScript Strict

```json
// tsconfig.json
{
 "compilerOptions": {
 "strict": true,
 "noUncheckedIndexedAccess": true,
 "exactOptionalPropertyTypes": true
 }
}
```

### 5. API Endpoint Convention

Jika terpaksa pakai API endpoint (bukan form actions), naming convention:

| HTTP | Route | Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/links` | List semua link |
| `POST` | `/api/links` | Create link |
| `PUT` | `/api/links/[id]` | Update link |
| `DELETE` | `/api/links/[id]` | Hapus link |
| `PATCH` | `/api/links/[id]/toggle` | Aktif/nonaktifkan |

```typescript
// routes/api/links/+server.ts
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
 const links = await linkService.list(locals.user.id);
 return json(links);
}

export async function POST({ request, locals }) {
 const body = await request.json();
 const link = await linkService.create(locals.user.id, body);
 return json(link, { status: 201 });
}
```

### 6. Error Handling Pattern

```typescript
// lib/server/services/linkService.ts
export class ServiceError extends Error {
 constructor(public code: string, message: string, public status = 400) {
 super(message);
 }
}

// routes/dashboard/links/+page.server.ts
export const actions = {
 default: async ({ request, locals }) => {
 try {
 const link = await linkService.create(...);
 return { success: true, link };
 } catch (e) {
 if (e instanceof ServiceError) {
 return fail(e.status, { error: e.message });
 }
 throw e; // 500
 }
 }
};
```

### 7. File Naming Convention

Akronim/Jargon bahasa Indonesia untuk nama file variabel/fungsi:

```
src/
├── lib/server/services/
│ ├── linkService.ts # service link (shortlink)
│ ├── authService.ts # service auth (login, register)
│ └── quotaService.ts # service kuota (cek batas free/basic)
├── lib/validators/
│ ├── linkSchema.ts # validasi link
│ └── authSchema.ts # validasi login/register
├── lib/server/repositories/
│ ├── linkRepo.ts # repository link
│ ├── userRepo.ts # repository user
│ └── clickRepo.ts # repository click
└── lib/utils/
 ├── format.ts # format data
 └── constants.ts # konstanta (limit, harga, dll)
```

### 8. Folder Structure — Modular by Feature

```diff
- ❌ src/routes/ (semua di satu tempat besar)
+ ✅ src/lib/ dipisah per concern: routes, lib/server, lib/components
```

Ketika project berkembang, pisahkan fitur yang benar-benar independen:

```
src/lib/
├── server/
│ ├── services/linkService.ts
│ │ → handle: create, update, delete, getRedirect, incrementClick
│ ├── repositories/linkRepo.ts
│ └── validators/linkSchema.ts
└── components/
 └── links/
 ├── LinkForm.svelte
 ├── LinkTable.svelte
 └── LinkStats.svelte
```

### 9. Database Migration — Jangan Manual

Gunakan migration system (bisa sederhana pakai file `.sql` incremental):

```
scripts/
├── migrations/
│ ├── 001_create_users.sql
│ ├── 002_create_links.sql
│ ├── 003_create_click_logs.sql
│ └── 004_add_custom_domains.sql
```

Setiap migration harus **idempoten** (bisa dijalankan berkali-kali tanpa error):

```sql
-- scripts/migrations/001_create_users.sql
CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) UNIQUE NOT NULL,
 ...
);
```

### 10. Code Review Checklist (Untuk Diri Sendiri)

Sebelum commit/push, cek:

- [ ] Apakah ada SQL query di dalam route handler? → Pindahkan ke repository
- [ ] Apakah ada validasi di dalam route handler? → Pindahkan ke schema/validator
- [ ] Apakah logic bisnis tercampur di file yang sama dengan SQL? → Pisahkan ke service
- [ ] Apakah error handling sudah benar (try-catch + proper status code)?
- [ ] Apakah TypeScript strict type checking lulus?
- [ ] Apakah komponen Svelte reusable (props, slot)?
- [ ] Apakah form menggunakan Form Actions + Zod (bukan manual validation)?
- [ ] Apakah store digunakan untuk state yang benar-benar global?
- [ ] Apakah migration file sudah dijalankan di development?

---

## Skema Auth: Registrasi & Login

### Flow Registrasi

```
Halaman Register (/register)
 │
 ├── Input: Nama, Email, Password, Konfirmasi Password
 │
 ├── Validasi Client (Zod + SvelteKit Form Action)
 │ ├── Nama: 2-50 karakter, required
 │ ├── Email: format email valid, max 255 chars
 │ ├── Password: min 8 karakter, wajib ada huruf + angka
 │ └── Konfirmasi: harus sama dengan password
 │
 ├── Cek duplicate email di DB
 │ ├── Sudah ada → return error "Email sudah terdaftar"
 │ └── Belum ada → lanjut
 │
 ├── Hash password (bcryptjs, saltRounds=12)
 │
 ├── INSERT user ke tabel users
 │ └── Plan default: 'free'
 │
 ├── Generate JWT token + set cookie
 │ └── httpOnly, secure, sameSite='lax', maxAge=7 hari
 │
 └── Redirect ke dashboard (/dashboard)
```

### Flow Login

```
Halaman Login (/login)
 │
 ├── Input: Email, Password
 │
 ├── Validasi Client (Zod)
 │ ├── Email: format valid, required
 │ └── Password: min 8 karakter, required
 │
 ├── Query user by email
 │ ├── Tidak ditemukan → "Email belum terdaftar"
 │ └── Ditemukan → lanjut
 │
 ├── Verify password (bcrypt.compare)
 │ ├── Salah → "Password salah"
 │ └── Cocok → lanjut
 │
 ├── Generate JWT token
 │ ├── Payload: { userId, email, plan }
 │ ├── Sign dengan JWT_SECRET
 │ └── Set cookie httpOnly (7 hari)
 │
 └── Redirect ke dashboard (/dashboard)
```

### OAuth Google (Tambahan)

```
Halaman Login
 │
 ├── Tombol "Masuk dengan Google"
 │
 ├── Redirect ke: https://accounts.google.com/o/oauth2/v2/auth
 │ ├── client_id, redirect_uri, scope (email profile)
 │ └── state (CSRF token, random)
 │
 ├── User authorize → Google callback ke /auth/google/callback
 │
 ├── Verifikasi token Google (google-auth-library)
 │
 ├── Cek google_id di tabel users
 │ ├── Ada → login langsung (update avatar jika berubah)
 │ └── Tidak ada → INSERT user baru (password=null)
 │ └── Kalo email sudah terdaftar → LINK ke akun existing
 │
 ├── Generate JWT + set cookie
 │
 └── Redirect ke dashboard
```

### Zod Schema Auth

```typescript
// lib/validators/authSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
 name: z.string().min(2, 'Nama minimal 2 karakter').max(50),
 email: z.string().email('Email tidak valid').max(255),
 password: z
 .string()
 .min(8, 'Password minimal 8 karakter')
 .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
 .regex(/[0-9]/, 'Password harus mengandung angka'),
 confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
 message: 'Konfirmasi password tidak cocok',
 path: ['confirmPassword'],
});

export const loginSchema = z.object({
 email: z.string().email('Email tidak valid'),
 password: z.string().min(1, 'Password harus diisi'),
});
```

### Auth Service

```typescript
// lib/server/services/authService.ts
export async function register(data: RegisterInput): Promise {
 // 1. Cek duplicate email
 const existing = await userRepo.findByEmail(data.email);
 if (existing) throw new ServiceError('EMAIL_EXISTS', 'Email sudah terdaftar', 409);

 // 2. Hash password
 const hashed = await bcrypt.hash(data.password, 12);

 // 3. Simpan user
 const user = await userRepo.create({
 name: data.name,
 email: data.email,
 password: hashed,
 plan: 'free',
 });

 // 4. Generate JWT
 const token = jwt.sign(
 { userId: user.id, email: user.email, plan: user.plan },
 JWT_SECRET,
 { expiresIn: '7d' }
 );

 return { token, user: sanitizeUser(user) };
}

export async function login(data: LoginInput): Promise {
 const user = await userRepo.findByEmail(data.email);
 if (!user) throw new ServiceError('USER_NOT_FOUND', 'Email belum terdaftar', 401);

 const valid = await bcrypt.compare(data.password, user.password!);
 if (!valid) throw new ServiceError('WRONG_PASSWORD', 'Password salah', 401);

 const token = jwt.sign(
 { userId: user.id, email: user.email, plan: user.plan },
 JWT_SECRET,
 { expiresIn: '7d' }
 );

 return { token, user: sanitizeUser(user) };
}

function sanitizeUser(user: User): SafeUser {
 const { password, ...safe } = user;
 return safe;
}
```

### Route Protection (hooks)

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
 const token = event.cookies.get('session');

 if (token) {
 try {
 const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
 event.locals.user = {
 id: payload.userId,
 email: payload.email,
 plan: payload.plan,
 };
 } catch {
 event.cookies.delete('session', { path: '/' });
 }
 }

 // Proteksi route dashboard
 if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
 throw redirect(303, '/login');
 }

 const response = await resolve(event);
 return response;
};
```

---

## UI/UX Design — Modern, Gen Z, Mobile-First

### Prinsip Desain

| Prinsip | Implementasi |
| :--- | :--- |
| **Mobile-first** | Semua halaman didesain dari layar 375px dulu, baru desktop |
| **Bottom navigation** | Di mobile, navigasi pakai bottom tab bar (bukan sidebar) |
| **Glassmorphism** | Card & modal pake efek kaca (backdrop-blur, semi-transparan) |
| **Micro-interactions** | Hover scale, loading skeleton, toast pop-up, swipe gesture |
| **Bold typography** | Font display tebal untuk headline, font sans untuk body |
| **Gradient & neon** | Akcent warna gradient (pink-purple / blue-cyan) |
| **Dark mode first** | Default dark mode, toggle ke light |
| **No clutter** | Maksimal 3 warna dalam satu halaman, spacing longgar |

### Color Palette

```css
/* Dark Mode (default) */
--bg-primary: #0f0f13;
--bg-secondary: #1a1a24;
--bg-card: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.08);
--text-primary: #f5f5f7;
--text-secondary:#8e8ea0;
--accent-1: #6366f1; /* Indigo */
--accent-2: #a855f7; /* Purple */
--accent-3: #06b6d4; /* Cyan */
--gradient: linear-gradient(135deg, #6366f1, #a855f7);
--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;

/* Light Mode (optional) */
--bg-primary: #ffffff;
--bg-secondary: #f5f5f7;
--bg-card: rgba(0, 0, 0, 0.03);
--glass-border: rgba(0, 0, 0, 0.08);
--text-primary: #0f0f13;
--text-secondary:#6b7280;
--accent-1: #4f46e5;
--accent-2: #9333ea;
--accent-3: #0891b2;
```

### Mobile Layout (375px - 768px)

```
┌─────────────────────────┐
│ Status Bar │
│ ┌───────────────────┐ │
│ │ 🔗 gotu.id/abc123 │ │ ← Input besardi tengah
│ │ [Shorten!] │ │
│ └───────────────────┘ │
│ │
│ ┌─────┐ ┌─────┐ ┌───┐ │
│ │62 │ │12 │ │3 │ │ ← Stat cards (horizontal scroll)
│ │Links│ │Today│ │Bio│ │
│ └─────┘ └─────┘ └───┘ │
│ │
│ ┌──────────────────┐ │
│ │ Link Title │ │
│ │ gotu.id/abc → URL │ │ ← Link cards (swipeable)
│ │ [Copy] [Edit] [🗑]│ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ... │ │
│ └──────────────────┘ │
│ │
│ ┌────┬────┬────┬────┐ │
│ │Home│Link│Bio │Profil│ ← Bottom navigation
│ └────┴────┴────┴────┘ │
└─────────────────────────┘
```

### Desktop Layout (>768px)

```
┌─────────────────────────────────────────┐
│ Logo [Input URL] [Shorten] Avatar │ ← Top bar
├──────────┬──────────────────────────────┤
│ │ ┌──┐ ┌──┐ ┌──┐ │
│ 🏠 Home │ │62│ │12│ │3 │ │ ← Stats
│ 🔗 Links │ └──┘ └──┘ └──┘ │
│ 🎨 Biosite│ │
│ 💳 Billing│ ┌──────────────────────┐ │
│ ⚙ Settings│ │ Link Table │ │ ← Sidebar (kiri)
│ │ │ ┌──┬──┬──┬──┬──┬──┐ │ │
│ │ │ │# │URL│Cli│Dibuat│Aksi│ │ │
│ │ │ ├──┼──┼──┼──┼──┼──┤ │ │
│ │ │ │1 │.. │62 │2hr │ 📝│ │ │
│ │ │ └──┴──┴──┴──┴──┴──┘ │ │
│ │ └──────────────────────┘ │
├──────────┴──────────────────────────────┤
│ Footer │
└─────────────────────────────────────────┘
```

### Component Design System

#### Buttons

```svelte

 Buat Link

 Batal

 +

```

#### Cards

```svelte

 
 
 
 Judul Link
 gotu.id/abc123
 
 📋
 

```

#### Input Fields

```svelte

 
 
 ✂️ Shorten
 

```

### Micro-interactions (CSS-only)

```css
/* Scale on hover untuk semua card */
.link-card {
 transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.link-card:hover {
 transform: scale(1.02);
 box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
}

/* Button press feedback */
.btn-primary:active {
 transform: scale(0.96);
}

/* Skeleton loading */
.skeleton {
 background: linear-gradient(90deg, #1a1a24 25%, #2a2a3e 50%, #1a1a24 75%);
 background-size: 200% 100%;
 animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
 0% { background-position: 200% 0; }
 100% { background-position: -200% 0; }
}

/* Glassmorphism card */
.glass {
 background: rgba(255, 255, 255, 0.05);
 backdrop-filter: blur(12px);
 -webkit-backdrop-filter: blur(12px);
 border: 1px solid rgba(255, 255, 255, 0.08);
 border-radius: 16px;
}
```

### Toast Notification System

```svelte

{#if $toast}
 
 ✅ Link berhasil disalin!
 
{/if}

 .animate-slide-up {
 animation: slideUp 0.3s ease-out;
 }
 @keyframes slideUp {
 from { transform: translate(-50%, 20px); opacity: 0; }
 to { transform: translate(-50%, 0); opacity: 1; }
 }

```

### Typography

```css
/* Font stack */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Scale */
--text-xs: 0.75rem; /* 12px — label */
--text-sm: 0.875rem; /* 14px — body small */
--text-base: 1rem; /* 16px — body */
--text-lg: 1.125rem; /* 18px — card title */
--text-xl: 1.25rem; /* 20px — heading small */
--text-2xl: 1.5rem; /* 24px — heading */
--text-3xl: 1.875rem; /* 30px — hero small */
--text-4xl: 2.25rem; /* 36px — hero */
```

### Dependencies Tambahan

```bash
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install zod bcryptjs jsonwebtoken
```

Tailwind config untuk custom palette:

```javascript
// tailwind.config.js
export default {
 content: ['./src/**/*.{html,js,svelte,ts}'],
 darkMode: 'class', // atau 'media'
 theme: {
 extend: {
 colors: {
 primary: { DEFAULT: '#6366f1', ... },
 surface: { DEFAULT: '#1a1a24', ... },
 },
 fontFamily: {
 display: ['Inter', 'sans-serif'],
 },
 borderRadius: {
 '2xl': '1rem',
 '3xl': '1.5rem',
 'full': '9999px',
 },
 },
 },
};
```

---

## Tahapan Implementasi

### Fase 0: Setup Project (1-2 hari)
- [ ] Init SvelteKit baru: `npm create svelte@latest shortlink`
- [ ] Install dependencies: `mysql2`, `jsonwebtoken`, `bcryptjs`, `redis`
- [ ] Setup MySQL database + running seed.sql
- [ ] Setup PM2 ecosystem + Cloudflare tunnel
- [ ] **Domain gotu.id / mylk.id**: Beli via registrar dan \barahkan ke server

### Fase 1: Core Shortlink (3-4 hari)
- [ ] Generate unique shortcode (6 karakter alfanumerik)
- [ ] Route `/[shortcode]` → redirect ke target_url + log click
- [ ] Form create link (paste URL → dapat short URL)
- [ ] Dashboard daftar link + edit target URL
- [ ] Click counter di dashboard

### Fase 2: User & Auth (2-3 hari)
- [ ] Register/Login dengan email + password
- [ ] OAuth Google login
- [ ] Session management dengan JWT
- [ ] Route protection (redirect ke login jika belum login)

### Fase 3: Biosite Builder (4-5 hari)
- [ ] CRUD biosite page
- [ ] Editor visual: add button, change color, upload avatar
- [ ] Preview live
- [ ] Render biosite di route `/[shortcode]` (bukan redirect)
- [ ] Theme selection (default, dark, neon, pastel)

### Fase 4: Subscription & Payment (3-4 hari)
- [ ] Midtrans Snap integration
- [ ] Billing logic: free → basic → premium
- [ ] Quota enforcement (cegah user free bikin >10 link)
- [ ] Auto-disable link jika subscription expired
- [ ] Plan selection UI (pricing page)

### Fase 5: Analytics (2-3 hari)
- [ ] UAParser untuk device/browser/OS
- [ ] Geo-IP lookup (gratis: ip-api.com atau ip2location DB)
- [ ] Chart clicks per hari/minggu/bulan
- [ ] Referer tracking

### Fase 6: Custom Domain (2-3 hari)
- [ ] Input domain user
- [ ] CNAME verification via `dns.resolveCname()`
- [ ] Caddy server for on-demand SSL
- [ ] Route check: jika request dari custom domain, mapping ke user

### Fase 7: Polish & Marketing (ongoing)
- [ ] Rate limiting per IP
- [ ] Link expiry / schedule
- [ ] Password-protected links
- [ ] Admin panel (dashboard super admin)
- [ ] SEO landing page
- [ ] Testimoni / case study (BPSDM, komunitas, dll)

---

## Arsitektur Routing

```
Permintaan masuk
 │
 ├── Dari custom domain user?
 │ ├── Ya → lookup domain di tabel custom_domains
 │ │ → ambil user_id
 │ │ → cari shortcode dari path
 │ │ → redirect / tampilkan biosite
 │ └── Tidak → lanjut
 │
 ├── /[shortcode] (6 karakter unik)
 │ ├── type = 'redirect' → 302 redirect ke target_url
 │ │ + async log click
 │ └── type = 'biosite' → render biosite page
 │
 └── /dashboard/... → auth required → render dashboard
```

---

## Catatan Penting

1. **Shortcode generation**: Gunakan `nanoid(6)` dengan charset `0-9a-zA-Z`. Cek duplicate di DB (collision sangat kecil dengan 62^6 = 56M kombinasi)
2. **Click analytics**: Jangan blocking redirect dengan log click. Gunakan **Redis queue** atau kirim click log secara async setelah redirect.
3. **Caddy vs Nginx**: Caddy lebih disarankan karena auto-handle SSL untuk setiap custom domain user (fitur On-Demand TLS). Nginx butuh konfig manual tiap domain.
4. **VM mana?**: Aplikasi bisa di **VM 105** bersamaan dengan wedding project (port beda) atau di VM sendiri. Resource cukup kecil untuk tahap awal.
5. **Backup**: Karena ada data user (link, clicks), jadwalkan backup DB harian.

---

> **Catatan**: File ini bisa diedit/ditambah sesuai kebutuhan. Setiap fase dikerjakan setelah fase sebelumnya selesai dan testing.
