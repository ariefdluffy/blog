---
title: "Cloudflare Turnstile + SvelteKit"
description: "Integrasi Cloudflare Turnstile CAPTCHA di SvelteKit untuk protect form dari bot."
tags: [tutorial]
---

# Integrasi Cloudflare Turnstile dengan SvelteKit

Panduan lengkap menambahkan Cloudflare Turnstile untuk proteksi form login dan register di SvelteKit.

## Prerequisites

- SvelteKit project dengan SSR enabled
- Akun Cloudflare dengan Turnstile site aktif
- Environment variables untuk Turnstile keys

## Mengapa Turnstile?

Cloudflare Turnstile adalah alternatif **privacy-friendly** untuk reCAPTCHA — tidak melacak pengguna, mudah diintegrasikan, dan gratis untuk volume rendah-sedang.

## Langkah 1: Konfigurasi Environment

Tambahkan keys ke `.env`:

```bash
# .env
TURNSTILE_SITE_KEY=0x4AAAAAADIp8xx5AfGgcwB6
TURNSTILE_SECRET_KEY=0x1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Langkah 2: Setup CSP di hooks.server.ts

Turnstile membutuhkan izin CSP khusus. Update `src/hooks.server.ts`:

```typescript
import type { Handle } from '@sveltejs/kit';
import { seedTemplates, seedAdmin, seedSettings } from '`lib/server/invitations';
import { getUserById } from '`lib/server/users';
import { ensurePaymentTransactionsTable } from '$lib/server/payment-transactions';

let seeded = false;

export const handle: Handle = async ({ event, resolve }) => {
 // Seed database on first request
 if (event.url.searchParams.has('reseed')) {
 seeded = false;
 }

 if (!seeded) {
 console.log('[Server] Seeding database templates and settings...');
 await seedTemplates();
 await seedSettings();
 await seedAdmin();
 await ensurePaymentTransactionsTable();
 seeded = true;
 }

 // Get session from cookie
 const sessionCookie = event.cookies.get('session');
 if (sessionCookie) {
 try {
 const session = JSON.parse(sessionCookie);
 const user = await getUserById(session.userId);
 if (user) {
 event.locals.user = user;
 }
 } catch {
 // Invalid session cookie
 }
 }

 // Protect admin routes
 if (event.url.pathname.startsWith('/admin')) {
 if (!event.locals.user || event.locals.user.role !== 'admin') {
 return new Response(null, {
 status: 302,
 headers: { location: '/login' }
 });
 }
 }

 // Protect dashboard routes 
 if (event.url.pathname.startsWith('/dashboard')) {
 if (!event.locals.user) {
 return new Response(null, {
 status: 302,
 headers: { location: '/login' }
 });
 }
 }

 const response = await resolve(event);

 // Add CSP headers for Turnstile
 const csp = [
 "default-src 'self'",
 "script-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com 'unsafe-eval' 'unsafe-inline'",
 "script-src-elem 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com 'unsafe-eval' 'unsafe-inline'",
 "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
 "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
 "img-src 'self' data: blob: https://challenges.cloudflare.com https://*.cloudflare.com",
 "font-src 'self' data: https://fonts.gstatic.com",
 "connect-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com",
 "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
 "object-src 'none'",
 "base-uri 'self'",
 "form-action 'self'",
 "frame-ancestors 'self'"
 ].join('; ');

 response.headers.set('Content-Security-Policy', csp);

 return response;
};
```

## Langkah 3: Validasi Server-Side

Buat endpoint validasi Turnstile di `src/routes/api/turnstile/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
 const formData = await request.formData();
 const token = formData.get('turnstileToken') as string;

 if (!token) {
 return json({ success: false, error: 'Token tidak ditemukan' }, { status: 400 });
 }

 const secretKey = env.TURNSTILE_SECRET_KEY;

 try {
 const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
 method: 'POST',
 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 body: new URLSearchParams({
 secret: secretKey,
 response: token
 })
 });

 const result = await response.json();

 if (result.success) {
 return json({ success: true });
 } else {
 return json({ success: false, error: 'Verifikasi gagal', codes: result['error-codes'] }, { status: 400 });
 }
 } catch (error) {
 console.error('[Turnstile] Verification error:', error);
 return json({ success: false, error: 'Gagal memverifikasi' }, { status: 500 });
 }
};
```

## Langkah 4: Komponen Svelte dengan Render Manual

Penting: Gunakan **render manual** (`turnstile.render()`) bukan auto-render via `data-sitekey`. Ini memastikan widget muncul saat navigasi client-side:

```svelte

 import type { PageData, ActionData } from './`types';
 import { onMount } from 'svelte';

 let { data, form }: { data: PageData; form: ActionData } = `props();
 let turnstileWidgetId: string | null = $state(null);

 onMount(() => {
 const container = document.getElementById('cf-turnstile-login');
 if (!container) return;

 const renderTurnstile = () => {
 if (typeof (window as any).turnstile !== 'undefined') {
 turnstileWidgetId = (window as any).turnstile.render('#cf-turnstile-login', {
 sitekey: '0x4AAAAAADIp8xx5AfGgcwB6',
 theme: 'light'
 }) as string;
 }
 };

 if (document.querySelector('script[src*="turnstile"]')) {
 renderTurnstile();
 } else {
 const script = document.createElement('script');
 script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
 script.async = true;
 script.defer = true;
 script.onload = renderTurnstile;
 document.head.appendChild(script);
 }

 return () => {
 if (turnstileWidgetId && typeof (window as any).turnstile !== 'undefined') {
 (window as any).turnstile.remove(turnstileWidgetId);
 }
 };
 });

 Masuk - {data.appName}

 
 {data.appName}
 Masuk ke akunmu untuk mengelola undangan

 {#if form?.error}
 {form.error}
 {/if}

 
 
 Email
 
 
 
 Password
 
 
 
 
 
 Masuk
 
 
 Belum punya akun? Daftar sekarang
 
 

 .turnstile-container { 
 display: flex; 
 justify-content: center; 
 margin: 15px 0; 
 min-height: 65px; 
 }

```

## Langkah 5: Validasi di Server Action

Update `+page.server.ts` untuk validasi Turnstile:

```typescript
import type { PageServerLoad, Actions } from './`types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '`env/dynamic/private';
import { verifyTurnstile } from '$lib/server/turnstile';

export const actions: Actions = {
 default: async ({ request }) => {
 const formData = await request.formData();
 const email = formData.get('email') as string;
 const password = formData.get('password') as string;

 // Verifikasi Turnstile terlebih dahulu
 const turnstileToken = formData.get('cf-turnstile-response') as string;
 const turnstileValid = await verifyTurnstile(turnstileToken);
 
 if (!turnstileValid) {
 return fail(400, { error: 'Verifikasi keamanan gagal. Silakan coba lagi.', email });
 }

 // ... lanjut validasi login
 }
};
```

Buat helper `$lib/server/turnstile.ts`:

```typescript
export async function verifyTurnstile(token: string): Promise {
 const secretKey = process.env.TURNSTILE_SECRET_KEY;
 
 if (!token || !secretKey) return false;

 try {
 const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
 method: 'POST',
 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 body: new URLSearchParams({
 secret: secretKey,
 response: token
 })
 });

 const result = await response.json();
 return result.success === true;
 } catch {
 return false;
 }
}
```

## Troubleshooting

### Widget Tidak Muncul

1. **Cek CSP header** — Pastikan `https://challenges.cloudflare.com` ada di `script-src` dan `frame-src`
2. **Pakai render manual** — Jangan rely pada `data-sitekey` attribute
3. **Cek console browser** — Ada error CSP violation?

### Verifikasi Selalu Gagal

1. Pastikan **secret key** benar (bukan site key)
2. Cek `error-codes` dari response Turnstile:
 - `invalid-input-response` — Token tidak valid
 - `timeout-or-duplicate` — Token sudah expire/used
3. Pastikan request ke `siteverify` tidak ter-blok CSP

### CSP Console Errors

Jika ada inline script violation, tambahkan ke CSP:

```
"script-src 'self' ... 'unsafe-inline'"
```

Untuk eval:

```
"script-src 'self' ... 'unsafe-eval'"
```

## Kesimpulan

Integrasi Turnstile dengan SvelteKit membutuhkan:

1. ✅ CSP yang tepat di `hooks.server.ts`
2. ✅ Render manual via `turnstile.render()` API
3. ✅ Validasi server-side sebelum proses form
4. ✅ Cleanup widget saat unmount

Dengan setup ini, form login/register terlindungi dari bot tanpa mengganggu pengalaman user.
