---
title: "Tauri + Svelte Desktop App"
description: "Build desktop cross-platform dengan Tauri dan Svelte dari setup hingga distribusi."
tags: [tutorial]
---

# Membangun Desktop App dengan Tauri + Svelte: Panduan Lengkap

!!! abstract "Ringkasan"
 Tauri adalah framework untuk membangun aplikasi desktop ringan menggunakan Rust sebagai backend dan web technologies (Svelte, React, Vue) sebagai frontend. Artikel ini membahas secara bertahap mulai dari konsep dasar, instalasi, pembuatan project, hingga fitur-fitur advanced seperti system tray, auto-update, dan distribusi aplikasi.

**Terakhir diperbarui:** 29 Mei 2026 
**Penulis:** Miftahul Arif 
**Kategori:** Tutorial & Pemrograman

---

## Daftar Isi

- [Apa Itu Tauri?](#apa-itu-tauri)
- [Mengapa Tauri, Bukan Electron?](#mengapa-tauri-bukan-electron)
- [Arsitektur Tauri](#\barsitektur-tauri)
- [Prasyarat dan Instalasi](#prasyarat-dan-instalasi)
- [Membuat Project Pertama](#membuat-project-pertama)
- [Struktur Project](#struktur-project)
- [Frontend: Svelte di Dalam Tauri](#frontend-svelte-di-dalam-tauri)
- [Backend: Rust Commands](#backend-rust-commands)
- [Komunikasi Frontend ↔ Backend](#komunikasi-frontend--backend)
- [Membangun Aplikasi Nyata: Todo App](#membangun-aplikasi-nyata-todo-app)
- [Mengakses File System](#mengakses-file-system)
- [Window Management](#window-management)
- [System Tray](#system-tray)
- [State Management di Rust](#state-management-di-rust)
- [Menambahkan Database Lokal](#menambahkan-database-lokal)
- [Auto-Update](#auto-update)
- [Build dan Distribusi](#build-dan-distribusi)
- [Best Practices](#best-practices)
- [Troubleshooting Umum](#troubleshooting-umum)
- [Sumber Belajar](#sumber-belajar)
- [Kesimpulan](#kesimpulan)

---

## Apa Itu Tauri?

Tauri adalah framework open-source untuk membuat **aplikasi desktop lintas platform** (Windows, macOS, Linux) yang menggabungkan:

- **Rust** sebagai backend — menangani file system, networking, OS integration, dan business logic
- **Web technologies** (HTML, CSS, JavaScript/Svelte) sebagai frontend — menangani UI dan user interaction
- **WebView native OS** sebagai rendering engine — bukan Chromium bundling seperti Electron

### Fitur Utama

- 📦 **Ukuran kecil** — binary ~2-10MB (vs Electron ~150MB+)
- 🚀 **Performa tinggi** — Rust backend, native WebView
- 🔒 **Keamanan** — izin akses granular, sandboxed frontend
- 🖥️ **Lintas platform** — Windows, macOS, Linux dari satu codebase
- 🔄 **Auto-update** — built-in updater
- 📱 **Multi-window** — dukungan banyak window
- 🎯 **System tray** — integrasi native system tray
- 💾 **Sidecar** — bisa menjalankan binary lain (Python, Go, dll)

---

## Mengapa Tauri, Bukan Electron?

### Perbandingan Ukuran

| Aspek | Electron | Tauri |
|-------|----------|-------|
| Hello World binary | ~150MB | ~3MB |
| Memory usage | ~100-300MB | ~30-80MB |
| Bundled engine | Chromium + Node.js | WebView OS (bawaan) |
| Install size | Besar | Kecil |

### Perbandingan Fitur

| Fitur | Electron | Tauri |
|-------|----------|-------|
| Backend language | Node.js (JavaScript) | Rust |
| Rendering | Chromium bundling | Native WebView |
| Security | Node.js di renderer (berisiko) | Sandbox, izin granular |
| Auto-update | electron-updater | Built-in tauri-updater |
| Cross-platform | ✅ | ✅ |
| Mobile (Tauri v2) | ❌ | ✅ (iOS & Android) |
| Learning curve | Mudah (sudah tahu JS) | Sedang (perlu basic Rust) |

### Kapan Pilih Electron?

- Tim hanya JavaScript, tidak mau belajar Rust
- Butuh kompatibilitas Chromium spesifik
- Project sudah pakai Electron dan terlalu besar untuk migrasi

### Kapan Pilih Tauri?

- Ingin aplikasi **ringan dan cepat**
- Butuh **keamanan lebih baik**
- Target user punya bandwidth/storage terbatas
- Mau support **mobile** dari codebase yang sama (Tauri v2)
- Proyek baru yang bisa mulai dari nol

---

## Arsitektur Tauri

```
┌─────────────────────────────────────────────┐
│ Your Application │
│ │
│ ┌─────────────────────────────────────────┐ │
│ │ Frontend (WebView) │ │
│ │ ┌──────────┐ ┌─────────────────────┐ │ │
│ │ │ Svelte │ │ HTML + CSS + JS │ │ │
│ │ │ Components│ │ (built output) │ │ │
│ │ └──────────┘ └─────────────────────┘ │ │
│ │ ↕ invoke() / listen() │ │
│ └─────────────────────────────────────────┘ │
│ ↕ IPC │
│ ┌─────────────────────────────────────────┐ │
│ │ Rust Core (Backend) │ │
│ │ ┌──────────┐ ┌─────────────────────┐ │ │
│ │ │ Commands │ │ Event System │ │ │
│ │ │ (invoke) │ │ (emit/listen) │ │ │
│ │ └──────────┘ └─────────────────────┘ │ │
│ │ ┌──────────┐ ┌─────────────────────┐ │ │
│ │ │ State │ │ OS Integration │ │ │
│ │ │Management │ │ (fs, path, shell) │ │ │
│ │ └──────────┘ └─────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
│ ↕ │
│ ┌─────────────────────────────────────────┐ │
│ │ Tauri Core (Middleware) │ │
│ │ Security • Window • System Tray • ... │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
 ↕
 ┌────────────────────────┐
 │ Operating System │
 │ (Windows/macOS/Linux) │
 └────────────────────────┘
```

### Alur Komunikasi

1. **Frontend** memanggil fungsi Rust via `invoke("nama_command", { \bargs })`
2. **Tauri IPC** meneruskan panggilan ke Rust backend
3. **Rust Command** memproses, mengakses OS/file/network
4. **Rust** mengembalikan hasil ke frontend via `Ok()` atau `Err()`
5. **Frontend** menerima hasil dan memperbarui UI

---

## Prasyarat dan Instalasi

### 1. Instal Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version
```

### 2. Instal System Dependencies

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install -y \
 libwebkit2gtk-4.1-dev \
 build-essential \
 curl \
 wget \
 file \
 libxdo-dev \
 libssl-dev \
 libayatana-appindicator3-dev \
 librsvg2-dev
```

**Fedora:**

```bash
sudo dnf install -y \
 webkit2gtk4.1-devel \
 openssl-devel \
 curl \
 wget \
 file \
 libappindicator-gtk3-devel \
 librsvg2-devel
```

**macOS:**

```bash
xcode-select --install
```

**Windows:**

- Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (biasanya sudah ada di Windows 10/11)

### 3. Instal Node.js atau Bun

**Opsi A: Node.js (via nvm)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
node --version
npm --version
# atau dengan bun
bun --version
```

**Opsi B: Bun (Recommended — lebih cepat)**

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version
```

!!! tip "Mengapa Bun?"
 Bun adalah runtime JavaScript/TypeScript yang **3-4x lebih cepat** dari Node.js. Untuk project Tauri, Bun memberikan:
 
 - Instalasi dependency lebih cepat
 - Dev server startup lebih cepat
 - Build time lebih singkat
 - Full compatibility dengan npm packages

### 4. Instal Tauri CLI

**Via Bun (Recommended):**

```bash
bun add -g @tauri-apps/cli
```

**Via Cargo:**

```bash
cargo install tauri-cli
```

**Via npm:**

```bash
npm install -g @tauri-apps/cli
```

---

## Membuat Project Pertama

### Opsi 1: Dengan Bun (Recommended)

```bash
# Buat project baru dengan Svelte template
bunx create-tauri-app my-tauri-app
```

Pilih opsi:

```
✔ Project name · my-tauri-app
✔ Identifier · com.example.my-tauri-app
✔ Frontend language · TypeScript / JavaScript
✔ Package manager · bun
✔ UI template · Svelte - (https://svelte.dev/)
✔ UI flavor · TypeScript
```

### Opsi 2: Dengan npm

```bash
npm create tauri-app@latest my-tauri-app
```

Pilih `npm` sebagai package manager saat prompt.

### Opsi 3: Svelte Project + Tambah Tauri

```bash
# Buat Svelte project dulu (dengan bun)
bun create svelte@latest my-app
cd my-app
bun install

# Tambah Tauri ke project yang sudah ada
bunx tauri init
```

### Jalankan Development

```bash
cd my-tauri-app

# Menggunakan bun (lebih cepat)
bunx tauri dev

# Atau dengan cargo
# cargo tauri dev
```

Perintah ini akan:

1. Start Vite dev server untuk Svelte frontend
2. Compile Rust backend
3. Buka window desktop dengan hot-reload aktif

---

## Struktur Project

```
my-tauri-app/
├── src-tauri/ # Rust backend
│ ├── Cargo.toml # Rust dependencies
│ ├── tauri.conf.json # Konfigurasi Tauri
│ ├── capabilities/ # Permission definitions (v2)
│ │ └── default.json
│ ├── icons/ # App icons
│ ├── src/
│ │ ├── main.rs # Entry point Rust
│ │ └── lib.rs # Commands & business logic
│ └── build.rs # Build script
│
├── src/ # Svelte frontend
│ ├── app.html # HTML template
│ ├── app.css # Global styles
│ ├── lib/ # Shared components
│ │ └── components/
│ │ ├── Greet.svelte
│ │ └── ...
│ └── routes/ # SvelteKit routes (jika pakai SvelteKit)
│ └── +page.svelte
│
├── static/ # Static assets
├── package.json # JS dependencies
├── svelte.config.js # Svelte config
├── vite.config.ts # Vite config
└── README.md
```

### File Penting

**`src-tauri/tauri.conf.json`** — Konfigurasi utama:

```json
{
 "productName": "My Tauri App",
 "version": "0.1.0",
 "identifier": "com.example.my-tauri-app",
 "build": {
 "frontendDist": "../build",
 "devUrl": "http://localhost:5173",
 "beforeDevCommand": "bun run dev",
 "beforeBuildCommand": "bun run build"
 },
 "app": {
 "title": "My Tauri App",
 "windows": [
 {
 "title": "My Tauri App",
 "width": 1024,
 "height": 768,
 "resizable": true,
 "fullscreen": false
 }
 ],
 "security": {
 "csp": null
 }
 },
 "bundle": {
 "active": true,
 "targets": "all",
 "icon": [
 "icons/32x32.png",
 "icons/128x128.png",
 "icons/128x128@2x.png",
 "icons/icon.icns",
 "icons/icon.ico"
 ]
 }
}
```

---

## Frontend: Svelte di Dalam Tauri

Svelte di Tauri berjalan seperti Svelte biasa. Yang berbeda adalah adanya API `@tauri-apps/api` untuk berkomunikasi dengan Rust backend.

### Setup Svelte Component

```svelte

 import { invoke } from "@tauri-apps/api/core";

 let name = `state("");
 let greetMsg = `state("");

 async function greet() {
 greetMsg = await invoke("greet", { name });
 }

 Selamat Datang di Tauri + Svelte

 
 
 Sapa!
 

 {#if greetMsg}
 {greetMsg}
 {/if}

 .greet-container {
 padding: 2rem;
 text-align: center;
 }
 input {
 padding: 0.75rem 1rem;
 border: 2px solid #e2e8f0;
 border-radius: 8px;
 font-size: 1rem;
 width: 300px;
 margin-right: 0.5rem;
 }
 button {
 padding: 0.75rem 1.5rem;
 background: #646cff;
 color: white;
 border: none;
 border-radius: 8px;
 font-size: 1rem;
 cursor: pointer;
 }
 button:hover {
 background: #535bf2;
 }
 .message {
 margin-top: 1rem;
 font-size: 1.2rem;
 color: #646cff;
 font-weight: bold;
 }

```

### Menggunakan Tauri APIs di Svelte

```svelte

 // Dialog — file picker, message box
 import { open, save, message, ask } from "@tauri-apps/plugin-dialog";

 // File system
 import { readTextFile, writeTextFile, exists } from "@tauri-apps/plugin-fs";

 // Path
 import { appDataDir, desktopDir, join } from "@tauri-apps/api/path";

 // Shell — buka URL di browser default
 import { open as openUrl } from "@tauri-apps/plugin-shell";

 // Window
 import { getCurrentWindow } from "@tauri-apps/api/window";

 // Notification
 import { sendNotification } from "@tauri-apps/plugin-notification";

 async function pilihFile() {
 const selected = await open({
 multiple: false,
 filters: [{
 name: "Text",
 extensions: ["txt", "md", "json"]
 }]
 });

 if (selected) {
 const content = await readTextFile(selected);
 console.log(content);
 }
 }

 async function simpanFile() {
 const path = await save({
 filters: [{ name: "Text", extensions: ["txt"] }]
 });

 if (path) {
 await writeTextFile(path, "Isi file dari Tauri!");
 await message("File berhasil disimpan!", { title: "Sukses" });
 }
 }

 async function minimizeWindow() {
 const win = getCurrentWindow();
 await win.minimize();
 }

Pilih File
Simpan File
Minimize
```

---

## Backend: Rust Commands

### Dasar Command

```rust
// src-tauri/src/lib.rs

// Command sederhana
#[tauri::command]
fn greet(name: &str) -> String {
 format!("Halo, {}! Selamat datang di Tauri! 🦀", name)
}

// Command dengan parameter bertipe
#[tauri::command]
fn hitung(a: f64, b: f64, operasi: String) -> Result {
 match operasi.as_str() {
 "tambah" => Ok(a + b),
 "kurang" => Ok(a - b),
 "kali" => Ok(a * b),
 "bagi" => {
 if b == 0.0 {
 Err("Tidak bisa bagi dengan nol!".into())
 } else {
 Ok(a / b)
 }
 }
 _ => Err(format!("Operasi '{}' tidak dikenali", operasi)),
 }
}

// Command async — untuk operasi berat / IO
#[tauri::command]
async fn fetch_data(url: String) -> Result {
 let response = reqwest::get(&url)
 .await
 .map_err(|e| format!("Request gagal: {}", e))?;

 let body = response
 .text()
 .await
 .map_err(|e| format!("Gagal baca response: {}", e))?;

 Ok(body)
}

// Register semua commands
pub fn run() {
 tauri::Builder::default()
 .invoke_handler(tauri::generate_handler![
 greet,
 hitung,
 fetch_data,
 ])
 .run(tauri::generate_context!())
 .expect("error while running tauri application");
}
```

### Custom Types (Serde)

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct TodoItem {
 id: u32,
 title: String,
 completed: bool,
 created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateTodoRequest {
 title: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
 success: bool,
 message: String,
 data: Option>,
}

#[tauri::command]
fn get_todos() -> ApiResponse {
 // ... ambil dari database/state
 ApiResponse {
 success: true,
 message: "OK".into(),
 data: Some(vec![]),
 }
}
```

### Menggunakan External Crates

Tambahkan ke `src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
reqwest = { version = "0.12", features = ["json"] }
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1", features = ["v4"] }
tokio = { version = "1", features = ["full"] }
```

---

## Komunikasi Frontend ↔ Backend

### Pola 1: invoke (Request-Response)

Paling umum. Frontend memanggil, Rust menjawab.

**Frontend:**

```typescript
import { invoke } from "@tauri-apps/api/core";

// Panggil command Rust
const result = await invoke("greet", { name: "Budi" });

// Dengan error handling
try {
 const data = await invoke("get_user", { id: 42 });
 console.log(data);
} catch (error) {
 console.error("Gagal:", error);
}
```

**Backend:**

```rust
#[tauri::command]
fn get_user(id: u32) -> Result {
 // ... proses
 Ok(UserData { id, name: "Budi".into() })
}
```

### Pola 2: Events (Pub-Sub)

Untuk komunikasi dua \barah, terutama dari Rust → Frontend.

**Backend emit event:**

```rust
use tauri::Emitter;

#[tauri::command]
async fn start_process(app: tauri::AppHandle) -> Result {
 // Kirim progress ke frontend
 for i in 0..=100 {
 app.emit("progress", i).map_err(|e| e.to_string())?;
 tokio::time::sleep(std::time::Duration::from_millis(50)).await;
 }

 app.emit("process-done", "Selesai!").map_err(|e| e.to_string())?;
 Ok(())
}
```

**Frontend listen event:**

```svelte

 import { invoke } from "@tauri-apps/api/core";
 import { listen } from "@tauri-apps/api/event";
 import { onMount, onDestroy } from "svelte";

 let progress = `state(0);
 let status = `state("");
 let unlisten: (() => void)[] = [];

 onMount(async () => {
 // Listen progress event
 const unlistenProgress = await listen("progress", (event) => {
 progress = event.payload;
 });

 // Listen selesai
 const unlistenDone = await listen("process-done", (event) => {
 status = event.payload;
 });

 unlisten.push(unlistenProgress, unlistenDone);
 });

 onDestroy(() => {
 // Cleanup listeners
 unlisten.forEach(fn => fn());
 });

 async function mulaiProses() {
 status = "Sedang berjalan...";
 progress = 0;
 await invoke("start_process");
 }

Mulai Proses

{progress}%
{#if status}
 {status}
{/if}
```

### Pola 3: Channel (Streaming Data)

Untuk streaming data besar dari Rust ke frontend tanpa banyak events.

```rust
use tauri::ipc::Channel;

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct LogEntry {
 timestamp: String,
 level: String,
 message: String,
}

#[tauri::command]
fn stream_logs(channel: Channel) {
 std::thread::spawn(move || {
 for i in 0..100 {
 channel.send(LogEntry {
 timestamp: chrono::Utc::now().to_rfc3339(),
 level: "INFO".into(),
 message: format!("Log entry #{}", i),
 }).unwrap();
 std::thread::sleep(std::time::Duration::from_millis(100));
 }
 });
}
```

**Frontend:**

```typescript
import { invoke, Channel } from "@tauri-apps/api/core";

const onEvent = new Channel();
onEvent.onmessage = (entry) => {
 console.log(`[`{entry.level}] `{entry.message}`);
};

await invoke("stream_logs", { channel: onEvent });
```

---

## Membangun Aplikasi Nyata: Todo App

Mari buat aplikasi Todo lengkap untuk memahami seluruh alur kerja.

### Step 1: Rust Backend

```rust
// src-tauri/src/lib.rs
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Todo {
 pub id: u32,
 pub title: String,
 pub completed: bool,
 pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewTodo {
 pub title: String,
}

pub struct AppState {
 pub todos: Mutex>,
 pub next_id: Mutex,
}

#[tauri::command]
fn get_todos(state: State) -> Vec {
 state.todos.lock().unwrap().clone()
}

#[tauri::command]
fn add_todo(state: State, input: NewTodo) -> Todo {
 let mut todos = state.todos.lock().unwrap();
 let mut next_id = state.next_id.lock().unwrap();

 let todo = Todo {
 id: *next_id,
 title: input.title,
 completed: false,
 created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
 };

 *next_id += 1;
 todos.push(todo.clone());
 todo
}

#[tauri::command]
fn toggle_todo(state: State, id: u32) -> Result {
 let mut todos = state.todos.lock().unwrap();
 if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
 todo.completed = !todo.completed;
 Ok(todo.clone())
 } else {
 Err(format!("Todo dengan id {} tidak ditemukan", id))
 }
}

#[tauri::command]
fn delete_todo(state: State, id: u32) -> Result {
 let mut todos = state.todos.lock().unwrap();
 let len_before = todos.len();
 todos.retain(|t| t.id != id);
 if todos.len() ) -> u32 {
 let mut todos = state.todos.lock().unwrap();
 let len_before = todos.len();
 todos.retain(|t| !t.completed);
 (len_before - todos.len()) as u32
}

pub fn run() {
 tauri::Builder::default()
 .manage(AppState {
 todos: Mutex::new(Vec::new()),
 next_id: Mutex::new(1),
 })
 .invoke_handler(tauri::generate_handler![
 get_todos,
 add_todo,
 toggle_todo,
 delete_todo,
 clear_completed,
 ])
 .run(tauri::generate_context!())
 .expect("error while running tauri application");
}
```

### Step 2: Svelte Frontend

```svelte

 import { invoke } from "@tauri-apps/api/core";
 import { onMount } from "svelte";

 interface Todo {
 id: number;
 title: string;
 completed: boolean;
 created_at: string;
 }

 let todos = `state([]);
 let newTitle = `state("");
 let filter = `state("all");
 let loading = `state(false);
 let error = `state("");

 // Computed (derived)
 let filteredTodos = `derived.by(() => {
 switch (filter) {
 case "active": return todos.filter(t => !t.completed);
 case "completed": return todos.filter(t => t.completed);
 default: return todos;
 }
 });

 let stats = $derived.by(() => {
 const total = todos.length;
 const completed = todos.filter(t => t.completed).length;
 const active = total - completed;
 return { total, completed, active };
 });

 onMount(async () => {
 await loadTodos();
 });

 async function loadTodos() {
 try {
 todos = await invoke("get_todos");
 } catch (e) {
 error = String(e);
 }
 }

 async function addTodo() {
 if (!newTitle.trim()) return;
 loading = true;
 try {
 const todo = await invoke("add_todo", {
 input: { title: newTitle.trim() }
 });
 todos = [...todos, todo];
 newTitle = "";
 } catch (e) {
 error = String(e);
 } finally {
 loading = false;
 }
 }

 async function toggleTodo(id: number) {
 try {
 const updated = await invoke("toggle_todo", { id });
 todos = todos.map(t => t.id === id ? updated : t);
 } catch (e) {
 error = String(e);
 }
 }

 async function deleteTodo(id: number) {
 try {
 await invoke("delete_todo", { id });
 todos = todos.filter(t => t.id !== id);
 } catch (e) {
 error = String(e);
 }
 }

 async function clearCompleted() {
 try {
 const count = await invoke("clear_completed");
 if (count > 0) {
 todos = todos.filter(t => !t.completed);
 }
 } catch (e) {
 error = String(e);
 }
 }

 📋 Todo App

 
 
 
 
 {loading ? "..." : "Tambah"}
 
 

 {#if error}
 {error}
 {/if}

 
 
 filter = "all"}
 >Semua ({stats.total})
 filter = "active"}
 >Aktif ({stats.active})
 filter = "completed"}
 >Selesai ({stats.completed})
 

 
 {#if filteredTodos.length === 0}
 
 {filter === "all"
 ? "Belum ada todo. Tambah yang baru!"
 : `Tidak ada todo ${filter}`}
 
 {:else}
 
 {#each filteredTodos as todo (todo.id)}
 
 
 toggleTodo(todo.id)}
 />
 {todo.title}
 {todo.created_at}
 
 deleteTodo(todo.id)}
 title="Hapus"
 >✕
 
 {/each}
 
 {/if}

 
 {#if stats.completed > 0}
 
 
 Hapus {stats.completed} selesai
 
 
 {/if}

 .todo-app {
 max-width: 600px;
 margin: 2rem auto;
 padding: 1.5rem;
 font-family: 'Inter', system-ui, sans-serif;
 }

 h1 {
 text-align: center;
 margin-bottom: 1.5rem;
 color: #1a1a2e;
 }

 .input-row {
 display: flex;
 gap: 0.5rem;
 margin-bottom: 1rem;
 }

 .input-row input {
 flex: 1;
 padding: 0.75rem 1rem;
 border: 2px solid #e0e0e0;
 border-radius: 8px;
 font-size: 1rem;
 outline: none;
 transition: border-color 0.2s;
 }

 .input-row input:focus {
 border-color: #646cff;
 }

 button {
 padding: 0.75rem 1.25rem;
 background: #646cff;
 color: white;
 border: none;
 border-radius: 8px;
 cursor: pointer;
 font-size: 0.9rem;
 transition: background 0.2s;
 }

 button:hover { background: #535bf2; }
 button:disabled { opacity: 0.5; cursor: not-allowed; }

 .filters {
 display: flex;
 gap: 0.5rem;
 margin-bottom: 1rem;
 justify-content: center;
 }

 .filters button {
 background: transparent;
 color: #666;
 padding: 0.4rem 0.8rem;
 border: 1px solid #ddd;
 font-size: 0.85rem;
 }

 .filters button.active {
 background: #646cff;
 color: white;
 border-color: #646cff;
 }

 .todo-list {
 list-style: none;
 padding: 0;
 }

 .todo-list li {
 display: flex;
 align-items: center;
 padding: 0.75rem;
 border-bottom: 1px solid #f0f0f0;
 transition: background 0.15s;
 }

 .todo-list li:hover { background: #f8f9fa; }

 .todo-list li label {
 flex: 1;
 display: flex;
 align-items: center;
 gap: 0.75rem;
 cursor: pointer;
 }

 .todo-list li.completed .title {
 text-decoration: line-through;
 color: #999;
 }

 .title { flex: 1; }
 .date { font-size: 0.75rem; color: #aaa; }

 .delete {
 background: transparent;
 color: #e74c3c;
 padding: 0.25rem 0.5rem;
 font-size: 1rem;
 opacity: 0;
 transition: opacity 0.15s;
 }

 .todo-list li:hover .delete { opacity: 1; }

 .empty {
 text-align: center;
 color: #999;
 padding: 2rem;
 }

 .error {
 background: #ffeaea;
 color: #e74c3c;
 padding: 0.5rem 1rem;
 border-radius: 6px;
 font-size: 0.9rem;
 }

 .footer {
 margin-top: 1rem;
 text-align: center;
 }

 .footer button {
 background: transparent;
 color: #e74c3c;
 border: 1px solid #e74c3c;
 }

 .footer button:hover {
 background: #e74c3c;
 color: white;
 }

```

### Step 3: Main Page

```svelte

 import TodoApp from "$lib/components/TodoApp.svelte";

```

### Step 4: Run!

```bash
cargo tauri dev
```

Window desktop akan terbuka dengan Todo App yang fully functional. Semua data diproses di Rust backend, UI dirender di Svelte.

---

## Mengakses File System

### Tambah Permissions

```json
// src-tauri/capabilities/default.json
{
 "permissions": [
 "core:default",
 "dialog:default",
 "dialog:allow-open",
 "dialog:allow-save",
 "dialog:allow-message",
 "fs:default",
 "fs:allow-read",
 "fs:allow-write",
 "fs:allow-exists",
 {
 "identifier": "fs:scope",
 "allow": [
 { "path": "`APPDATA/**" },
 { "path": "`DESKTOP/**" },
 { "path": "$DOCUMENT/**" }
 ]
 }
 ]
}
```

### Baca dan Tulis File dari Rust

```rust
use std::fs;
use tauri::Manager;

#[tauri::command]
fn read_config(app: tauri::AppHandle) -> Result {
 let config_path = app.path()
 .app_data_dir()
 .map_err(|e| e.to_string())?
 .join("config.json");

 if config_path.exists() {
 fs::read_to_string(&config_path)
 .map_err(|e| format!("Gagal baca config: {}", e))
 } else {
 Ok("{}".into())
 }
}

#[tauri::command]
fn save_config(app: tauri::AppHandle, content: String) -> Result {
 let config_path = app.path()
 .app_data_dir()
 .map_err(|e| e.to_string())?
 .join("config.json");

 // Pastikan direktori ada
 if let Some(parent) = config_path.parent() {
 fs::create_dir_all(parent)
 .map_err(|e| format!("Gagal buat direktori: {}", e))?;
 }

 fs::write(&config_path, content)
 .map_err(|e| format!("Gagal tulis config: {}", e))
}
```

### Export File ke Lokasi User Pilih

```rust
use std::fs;

#[tauri::command]
fn export_data(app: tauri::AppHandle, data: String, default_name: String) -> Result {
 use tauri::Manager;

 // Dialog save via Rust (alternatif dari frontend dialog)
 let file_path = tauri::api::dialog::blocking::FileDialogBuilder::new()
 .set_title("Export Data")
 .set_file_name(&default_name)
 .add_filter("JSON", &["json"])
 .add_filter("Text", &["txt"])
 .save_file();

 match file_path {
 Some(path) => {
 fs::write(&path, data)
 .map_err(|e| format!("Gagal export: {}", e))?;
 Ok(path.to_string_lossy().into())
 }
 None => Err("User membatalkan".into()),
 }
}
```

---

## Window Management

### Multiple Windows

```rust
use tauri::Manager;

#[tauri::command]
fn open_settings_window(app: tauri::AppHandle) -> Result {
 // Cek apakah window sudah ada
 if let Some(window) = app.get_webview_window("settings") {
 window.show().map_err(|e| e.to_string())?;
 window.set_focus().map_err(|e| e.to_string())?;
 return Ok(());
 }

 // Buat window baru
 let _window = tauri::WebviewWindowBuilder::new(
 &app,
 "settings",
 tauri::WebviewUrl::App("/settings".into()),
 )
 .title("Pengaturan")
 .inner_size(500.0, 400.0)
 .resizable(false)
 .center()
 .build()
 .map_err(|e| e.to_string())?;

 Ok(())
}
```

### Window Controls dari Frontend

```svelte

 import { getCurrentWindow } from "@tauri-apps/api/window";

 const appWindow = getCurrentWindow();

 async function minimize() { await appWindow.minimize(); }
 async function maximize() {
 const isMax = await appWindow.isMaximized();
 isMax ? await appWindow.unmaximize() : await appWindow.maximize();
 }
 async function close() { await appWindow.close(); }

 My App
 
 ─
 □
 ✕
 

 .titlebar {
 height: 32px;
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 0 8px;
 user-select: none;
 -webkit-user-select: none;
 background: #1a1a2e;
 color: white;
 }

 .window-controls button {
 width: 32px;
 height: 32px;
 border: none;
 background: transparent;
 color: white;
 cursor: pointer;
 font-size: 12px;
 }

 .window-controls button:hover { background: rgba(255,255,255,0.1); }
 .window-controls .close:hover { background: #e74c3c; }

```

### Transparent / Frameless Window

```json
// tauri.conf.json → app.windows[0]
{
 "title": "My Frameless App",
 "decorations": false,
 "transparent": true,
 "width": 800,
 "height": 600
}
```

---

## System Tray

```rust
use tauri::{
 menu::{Menu, MenuItem},
 tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
 Manager,
};

fn setup_system_tray(app: &mut tauri::App) -> Result> {
 let show_i = MenuItem::with_id(app, "show", "Tampilkan", true, None::)?;
 let hide_i = MenuItem::with_id(app, "hide", "Sembunyikan", true, None::)?;
 let settings_i = MenuItem::with_id(app, "settings", "Pengaturan", true, None::)?;
 let quit_i = MenuItem::with_id(app, "quit", "Keluar", true, None::)?;

 let menu = Menu::with_items(app, &[&show_i, &hide_i, &settings_i, &quit_i])?;

 let _tray = TrayIconBuilder::new()
 .icon(app.default_window_icon().unwrap().clone())
 .menu(&menu)
 .tooltip("My Tauri App")
 .on_menu_event(move |app, event| match event.id.as_ref() {
 "show" => {
 if let Some(window) = app.get_webview_window("main") {
 let _ = window.show();
 let _ = window.set_focus();
 }
 }
 "hide" => {
 if let Some(window) = app.get_webview_window("main") {
 let _ = window.hide();
 }
 }
 "settings" => {
 // Buka settings window
 }
 "quit" => {
 app.exit(0);
 }
 _ => {}
 })
 .on_tray_icon_event(|tray, event| {
 if let TrayIconEvent::Click {
 button: MouseButton::Left,
 button_state: MouseButtonState::Up,
 ..
 } = event
 {
 let app = tray.app_handle();
 if let Some(window) = app.get_webview_window("main") {
 let _ = window.show();
 let _ = window.set_focus();
 }
 }
 })
 .build(app)?;

 Ok(())
}

pub fn run() {
 tauri::Builder::default()
 .setup(|app| {
 setup_system_tray(app)?;
 Ok(())
 })
 .invoke_handler(tauri::generate_handler![/* ... */])
 .run(tauri::generate_context!())
 .expect("error while running tauri application");
}
```

---

## State Management di Rust

### Basic State (Mutex)

```rust
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
 pub user: Mutex>,
 pub settings: Mutex,
 pub log_buffer: Mutex>,
}

#[tauri::command]
fn get_session(state: State) -> Option {
 state.user.lock().unwrap().clone()
}

#[tauri::command]
fn login(state: State, username: String) -> Result {
 let session = UserSession {
 username: username.clone(),
 login_time: chrono::Local::now().to_rfc3339(),
 };
 *state.user.lock().unwrap() = Some(session.clone());
 Ok(session)
}

#[tauri::command]
fn logout(state: State) {
 *state.user.lock().unwrap() = None;
}
```

### State dengan Persistensi (File-based)

```rust
use std::path::PathBuf;

pub struct PersistentState {
 pub data_dir: PathBuf,
 pub state: Mutex,
}

impl PersistentState {
 fn load(data_dir: PathBuf) -> Self {
 let path = data_dir.join("state.json");
 let state = if path.exists() {
 let content = std::fs::read_to_string(&path).unwrap_or_default();
 serde_json::from_str(&content).unwrap_or_default()
 } else {
 AppData::default()
 };

 PersistentState {
 data_dir,
 state: Mutex::new(state),
 }
 }

 fn save(&self) {
 let state = self.state.lock().unwrap();
 let json = serde_json::to_string_pretty(&*state).unwrap();
 let path = self.data_dir.join("state.json");
 let _ = std::fs::write(path, json);
 }
}
```

---

## Menambahkan Database Lokal

### SQLite dengan rusqlite

Tambahkan ke `Cargo.toml`:

```toml
[dependencies]
rusqlite = { version = "0.31", features = ["bundled"] }
```

```rust
use rusqlite::{Connection, params};
use std::sync::Mutex;
use tauri::State;

pub struct DbState {
 pub conn: Mutex,
}

impl DbState {
 pub fn new(db_path: &str) -> Self {
 let conn = Connection::open(db_path).expect("Gagal buka database");

 // Buat tabel jika belum ada
 conn.execute_batch(
 "CREATE TABLE IF NOT EXISTS todos (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 completed BOOLEAN DEFAULT 0,
 created_at TEXT DEFAULT (datetime('now'))
 );"
 ).expect("Gagal buat tabel");

 DbState {
 conn: Mutex::new(conn),
 }
 }
}

#[tauri::command]
fn db_get_todos(state: State) -> Result, String> {
 let conn = state.conn.lock().unwrap();
 let mut stmt = conn
 .prepare("SELECT id, title, completed, created_at FROM todos ORDER BY id")
 .map_err(|e| e.to_string())?;

 let todos = stmt
 .query_map([], |row| {
 Ok(Todo {
 id: row.get(0)?,
 title: row.get(1)?,
 completed: row.get(2)?,
 created_at: row.get(3)?,
 })
 })
 .map_err(|e| e.to_string())?
 .filter_map(|r| r.ok())
 .collect();

 Ok(todos)
}

#[tauri::command]
fn db_add_todo(state: State, title: String) -> Result {
 let conn = state.conn.lock().unwrap();
 conn.execute(
 "INSERT INTO todos (title) VALUES (?1)",
 params![title],
 ).map_err(|e| e.to_string())?;

 let id = conn.last_insert_rowid() as u32;
 Ok(Todo {
 id,
 title,
 completed: false,
 created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
 })
}
```

Setup di `run()`:

```rust
pub fn run() {
 tauri::Builder::default()
 .setup(|app| {
 let data_dir = app.path().app_data_dir().unwrap();
 std::fs::create_dir_all(&data_dir).unwrap();
 let db_path = data_dir.join("app.db");

 app.manage(DbState::new(db_path.to_str().unwrap()));
 Ok(())
 })
 .invoke_handler(tauri::generate_handler![
 db_get_todos,
 db_add_todo,
 // ...
 ])
 .run(tauri::generate_context!())
 .expect("error while running tauri application");
}
```

---

## Auto-Update

### Setup Tauri Updater

Tambah plugin:

```bash
cargo tauri add updater
```

### Konfigurasi di tauri.conf.json

```json
{
 "plugins": {
 "updater": {
 "active": true,
 "endpoints": [
 "https://releases.myapp.com/{{target}}/{{\barch}}/{{current_version}}"
 ],
 "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHBrZyB..."
 }
 }
}
```

### Cek Update dari Frontend

```svelte

 import { check } from "@tauri-apps/plugin-updater";
 import { relaunch } from "@tauri-apps/plugin-process";

 let updateAvailable = `state(false);
 let updateVersion = `state("");
 let downloading = `state(false);
 let downloadProgress = `state(0);

 async function checkForUpdates() {
 const update = await check();
 if (update) {
 updateAvailable = true;
 updateVersion = update.version;
 }
 }

 async function installUpdate() {
 downloading = true;
 const update = await check();
 if (update) {
 await update.downloadAndInstall((progress) => {
 if (progress.event === "Started" && progress.data.contentLength) {
 // Track progress
 } else if (progress.event === "Finished") {
 downloadProgress = 100;
 }
 });
 await relaunch();
 }
 }

{#if updateAvailable}
 
 Update tersedia: v{updateVersion}
 
 {downloading ? `Downloading ${downloadProgress}%` : "Install Update"}
 
 
{/if}
```

---

## Build dan Distribusi

### Build untuk Production

```bash
# Build semua platform yang tersedia
cargo tauri build

# Build dengan debug info
cargo tauri build --debug

# Build untuk target spesifik
cargo tauri build --target x86_64-pc-windows-msvc
cargo tauri build --target x86_64-apple-darwin
cargo tauri build --target x86_64-unknown-linux-gnu
```

### Output per Platform

| Platform | Output |
|----------|--------|
| Windows | `.msi` installer + `.exe` standalone |
| macOS | `.dmg` + `.app` bundle |
| Linux | `.deb` + `.AppImage` + `.rpm` |

Output ada di `src-tauri/target/release/bundle/`.

### Signing (Produksi)

```bash
# macOS — set environment variables
export APPLE_CERTIFICATE="..."
export APPLE_CERTIFICATE_PASSWORD="..."
export APPLE_SIGNING_IDENTITY="..."
export APPLE_ID="..."
export APPLE_PASSWORD="..." # app-specific password

# Windows — set signing config
export TAURI_SIGNING_PRIVATE_KEY="..."
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="..."
```

### CI/CD dengan GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
 push:
 tags:
 - 'v*'

jobs:
 release:
 permissions:
 contents: write
 strategy:
 matrix:
 include:
 - platform: ubuntu-22.04
 target: x86_64-unknown-linux-gnu
 - platform: macos-latest
 target: aarch64-apple-darwin
 - platform: windows-latest
 target: x86_64-pc-windows-msvc

 runs-on: `{{ matrix.platform }}

 steps:
 - uses: actions/checkout@v4

 - name: Setup Rust
 uses: dtolnay/rust-toolchain@stable
 with:
 targets: `{{ matrix.target }}

 - name: Install dependencies (Linux)
 if: matrix.platform == 'ubuntu-22.04'
 run: |
 sudo apt-get update
 sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev

 - name: Setup Bun
 uses: oven-sh/setup-bun@v2
 with:
 bun-version: latest

 - name: Install dependencies
 run: bun install --frozen-lockfile

 - name: Build
 uses: tauri-apps/tauri-action@v0
 env:
 GITHUB_TOKEN: `{{ secrets.GITHUB_TOKEN }}
 TAURI_SIGNING_PRIVATE_KEY: `{{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
```

!!! note "Alternatif dengan Node.js"
 Jika lebih suka Node.js, ganti step Setup Bun dengan:
 ```yaml
 - name: Setup Node
 uses: actions/setup-node@v4
 with:
 node-version: lts/*
 
 - name: Install dependencies
 run: npm ci
 ```

---

## Best Practices

### Struktur Code

- **Pisahkan commands** ke module terpisah (`commands/todo.rs`, `commands/settings.rs`)
- **Gunakan Result** untuk semua command — jangan panic di production
- **Validasi input** di Rust, bukan hanya di frontend
- **State management** — gunakan `Mutex` untuk state sederhana, database untuk data persisten

### Keamanan

- **Prinsip least privilege** — hanya buka permissions yang dibutuhkan di `capabilities/`
- **Validasi CSP** — set Content Security Policy yang ketat
- **Sanitasi input** — jangan trust frontend input langsung
- **Hindari `shell:allow-execute`** kecuali benar-benar perlu

### Performa

- **Jangan block main thread** — gunakan `#[tauri::command] async` untuk operasi berat
- **Batch operasi** — hindari banyak invoke kecil, gabung jadi satu
- **Lazy loading** — load data saat dibutuhkan, bukan semua di awal
- **Event debouncing** — jangan emit event terlalu sering dari Rust

### UX

- **Loading states** — selalu tampilkan feedback saat menunggu response Rust
- **Error handling** — tampilkan error message yang user-friendly
- **Keyboard shortcuts** — daftarkan shortcut umum (Ctrl+S, Ctrl+Z, dll)
- **Native feel** — gunakan drag region di titlebar, ikuti platform conventions

---

## Troubleshooting Umum

### "webkit2gtk not found"

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel
```

### "AppImage build failed"

```bash
# Install fuse untuk AppImage
sudo apt install libfuse2
```

### Rust compile error saat `cargo tauri dev`

```bash
# Update Rust toolchain
rustup update

# Bersihkan cache build
cargo clean
cd src-tauri && cargo clean
```

### Hot reload tidak jalan

- Pastikan `devUrl` di `tauri.conf.json` sesuai dengan port Vite
- Cek apakah Vite dev server berjalan (`bun run dev`)
- Restart: `Ctrl+C` lalu `cargo tauri dev` lagi

### "Permission denied" saat akses file

- Cek `capabilities/default.json` — pastikan path yang diakses ada di scope
- Gunakan ``APPDATA`, ``DESKTOP`, `$DOCUMENT` sebagai base paths
- Jangan hardcode absolute path

---

## Sumber Belajar

### Dokumentasi Resmi

- 📖 [Tauri Docs v2](https://v2.tauri.app/start/) — dokumentasi resmi terlengkap
- 📖 [Tauri API Reference](https://v2.tauri.app/reference/javascript/api/) — semua JS/TS API
- 📖 [Svelte Documentation](https://svelte.dev/docs) — referensi Svelte

### Tutorial & Contoh

- 🎥 [Tauri + Svelte YouTube Series](https://youtube.com/results?search_query=tauri+svelte+tutorial)
- 💻 [Tauri Examples Repository](https://github.com/nicedoc/tauri-apps-examples)
- 📖 [Build a Markdown Editor with Tauri + Svelte](https://dev.to/)

### Komunitas

- 💬 [Tauri Discord](https://discord.gg/tauri)
- 📰 [Tauri GitHub Discussions](https://github.com/tauri-apps/tauri/discussions)
- 🦀 [/r/tauri](https://reddit.com/r/tauri)

---

## Kesimpulan

Tauri + Svelte adalah kombinasi yang sangat powerful untuk membangun aplikasi desktop modern:

- 📦 **Ringan** — binary kecil, memory usage rendah
- 🚀 **Cepat** — Rust backend + native WebView
- 🔒 **Aman** — sandboxed, granular permissions
- 🛠️ **Developer friendly** — hot reload, familiar web stack
- 📱 **Future-proof** — support mobile di Tauri v2

Jika Anda sudah familiar dengan Svelte dan ingin membangun aplikasi desktop yang **ringan, cepat, dan aman**, Tauri adalah pilihan terbaik saat ini. Rust backend memberikan performa dan keamanan yang tidak bisa ditawarkan oleh Electron/Node.js.

**Mulai sekarang:**

```bash
npm create tauri-app@latest my-desktop-app
cd my-desktop-app
cargo tauri dev
```

Selamat membangun! 🦀🖥️

---

*Ditulis dengan referensi dari [Tauri Documentation](https://v2.tauri.app/), [Svelte Documentation](https://svelte.dev/), dan pengalaman pengembangan langsung.*
