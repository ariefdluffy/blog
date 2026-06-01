---
title: "Panduan Lengkap Rust Programming"
description: "Tutorial Rust dari dasar — ownership, borrowing, trait, hingga async/await."
tags: [tutorial]
---

# Bahasa Pemrograman Rust: Panduan Lengkap

!!! abstract "Ringkasan"
 Rust adalah bahasa pemrograman modern yang menggabungkan performa tinggi dengan keamanan memori tanpa garbage collector. Artikel ini membahas segala hal tentang Rust — dari sejarah, filosofi desain, sintaks dasar, hingga ekosistem dan use case nyata.

**Terakhir diperbarui:** 29 Mei 2026 
**Penulis:** Miftahul Arif 
**Kategori:** Teknologi & Pemrograman

---

## Daftar Isi

- [Apa Itu Rust?](#apa-itu-rust)
- [Sejarah dan Evolusi](#sejarah-dan-evolusi)
- [Mengapa Memilih Rust?](#mengapa-memilih-rust)
- [Filosofi Desain](#filosofi-desain)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Sintaks Dasar](#sintaks-dasar)
- [Ownership dan Borrowing](#ownership-dan-borrowing)
- [Struct, Enum, dan Pattern Matching](#struct-enum-dan-pattern-matching)
- [Error Handling](#error-handling)
- [Trait dan Generics](#trait-dan-generics)
- [Concurrency di Rust](#concurrency-di-rust)
- [Async/Await](#asyncawait)
- [Ekosistem dan Crate](#ekosistem-dan-crate)
- [Rust vs Bahasa Lain](#rust-vs-bahasa-lain)
- [Use Case Nyata](#use-case-nyata)
- [Sumber Belajar](#sumber-belajar)
- [Kesimpulan](#kesimpulan)

---

## Apa Itu Rust?

Rust adalah bahasa pemrograman **sistem** yang dikembangkan oleh Mozilla Research, dirancang untuk menjadi alternatif yang aman (*memory-safe*) dari C dan C++ tanpa mengorbankan performa. Rust menawarkan:

- **Zero-cost abstractions** — abstraksi tingkat tinggi tanpa overhead runtime
- **Ownership system** — manajemen memori tanpa garbage collector
- **Thread safety** — jaminan keamanan konkurensi saat kompilasi
- **Modern tooling** — Cargo (package manager), rustfmt, clippy

Pertama kali dirilis stabil (1.0) pada **Mei 2015**, Rust telah menjadi salah satu bahasa yang paling dicintai di Stack Overflow Developer Survey selama bertahun-tahun berturut-turut.

---

## Sejarah dan Evolusi

### Asal Usul

Rust dimulai sebagai proyek pribadi **Graydon Hoare** pada 2006. Mozilla mulai mensponsori proyek ini pada 2009 sebagai bahasa untuk membangun mesin browser baru (yang kemudian menjadi Servo).

### Timeline Penting

- **2006** — Graydon Hoare mulai mengerjakan Rust secara pribadi
- **2009** — Mozilla mulai mensponsori proyek
- **2010** — Proyek diumumkan secara publik
- **2012** — Rust 0.1 dirilis
- **2015 (Mei)** — Rust 1.0 dirilis (stabil)
- **2018** — Rust 2018 Edition (async/await preview, module system improvement)
- **2021** — Rust 2021 Edition (ergonomics improvement, pattern matching)
- **2024** — Rust 2024 Edition (gen keyword, async closures)
- **2025-2026** — Rust Foundation governance, broader enterprise adoption

### Nama "Rust"

Nama diambil dari jamur *rust fungi* — organisme yang sangat kuat dan sulit dihilangkan, melambangkan ketahanan dan keandalan bahasa ini.

---

## Mengapa Memilih Rust?

### 1. Keamanan Memori Tanpa Garbage Collector

Rust menggunakan sistem **ownership** untuk mengelola memori secara deterministik. Tidak ada garbage collector yang berjalan di background, tidak ada memory leaks, dan tidak ada dangling pointers.

### 2. Performa Setara C/C++

Karena tidak ada runtime overhead (no GC, no null pointer checks), kode Rust berjalan secepat bahasa tingkat rendah lainnya.

### 3. Concurrency yang Aman

Sistem ownership Rust mencegah *data races* saat kompilasi. Jika kode Anda compile, dijamin bebas dari data race conditions.

### 4. Developer Experience yang Luar Biasa

- **Compiler errors** yang sangat informatif — bukan hanya memberi tahu error, tapi juga cara memperbaikinya
- **Cargo** — package manager dan build system yang terintegrasi
- **Rust Analyzer** — LSP untuk IDE yang powerful
- **Clippy** — linter yang mendeteksi anti-pattern
- **rustfmt** — auto-formatter bawaan

### 5. Ekosistem yang Berkembang Pesat

crates.io memiliki lebih dari 150.000 crate (library) dengan pertumbuhan yang konsisten.

---

## Filosofi Desain

Rust dibangun atas tiga pilar utama:

### Safety

```rust
// Compiler menolak kode yang berpotensi unsafe
fn main() {
 let s1 = String::from("hello");
 let s2 = s1; // s1 dipindahkan (moved) ke s2
 // println!("{}", s1); // ERROR! s1 sudah tidak valid
 println!("{}", s2); // OK
}
```

### Speed

Kode Rust dikompilasi langsung ke native machine code melalui LLVM backend, tanpa interpreter atau VM.

### Concurrency

```rust
use std::thread;

fn main() {
 let mut data = vec![1, 2, 3];

 // Compiler memastikan thread safety
 let handle = thread::spawn(move || {
 // data dipindahkan ke thread ini
 println!("{:?}", data);
 });

 // println!("{:?}", data); // ERROR! data sudah dipindahkan
 handle.join().unwrap();
}
```

---

## Instalasi dan Setup

### Linux/macOS

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Verifikasi Instalasi

```bash
rustc --version
cargo --version
rustup show
```

### Update Toolchain

```bash
rustup update
```

### IDE Recommendation

| Editor | Plugin |
|--------|--------|
| VS Code | rust-analyzer |
| Neovim | rust-analyzer (LSP) |
| IntelliJ | Rust Plugin |
| Zed | Built-in Rust support |

Atau lebih ringkas: gunakan VS Code + rust-analyzer untuk pengalaman terbaik bagi pemula.

---

## Sintaks Dasar

### Hello World

```rust
fn main() {
 println!("Hello, World!");
}
```

### Variabel dan Mutabilitas

```rust
fn main() {
 // Immutable by default
 let x = 5;
 // x = 6; // ERROR! x tidak mutable

 // Mutable
 let mut y = 10;
 y = 20; // OK

 // Shadowing — boleh mengubah tipe
 let z = "hello";
 let z = z.len(); // z sekarang bertipe usize

 // Konstanta
 const MAX_POINTS: u32 = 100_000;

 println!("x={}, y={}, z={}, MAX={}", x, y, z, MAX_POINTS);
}
```

### Tipe Data Primitif

```rust
fn main() {
 // Integer
 let a: i8 = -128; // 8-bit signed
 let b: u8 = 255; // 8-bit unsigned
 let c: i32 = -2_147_483_648; // 32-bit signed (default)
 let d: i64 = 9_223_372_036_854_775_807; // 64-bit signed
 let e: i128 = 0; // 128-bit signed
 let f: isize = 0; // architecture-dependent

 // Floating point
 let g: f64 = 3.14; // 64-bit (default)
 let h: f32 = 2.718; // 32-bit

 // Boolean
 let i: bool = true;

 // Character (4 bytes, Unicode)
 let j: char = '🦀';

 // Tuple
 let tup: (i32, f64, char) = (500, 6.4, 'a');
 let (x, y, z) = tup; // destructuring

 // Array (fixed size)
 let arr: [i32; 5] = [1, 2, 3, 4, 5];
 let first = arr[0]; // indexing

 println!("{} {} {} {} {}", a, g, i, j, first);
}
```

### Fungsi

```rust
// Fungsi dengan parameter dan return value
fn tambah(a: i32, b: i32) -> i32 {
 a + b // tanpa return dan titik koma = expression (implicit return)
}

// Fungsi dengan multiple return values
fn bagi(a: f64, b: f64) -> (f64, f64) {
 let hasil = a / b;
 let sisa = a % b;
 (hasil, sisa)
}

// Fungsi yang tidak mengembalikan nilai
fn cetak_pesan(pesan: &str) {
 println!("{}", pesan);
}

fn main() {
 let hasil = tambah(5, 3);
 println!("5 + 3 = {}", hasil);

 let (hasil, sisa) = bagi(17.0, 5.0);
 println!("17 / 5 = {} sisa {}", hasil, sisa);

 cetak_pesan("Hello dari Rust!");
}
```

### Control Flow

```rust
fn main() {
 // if-else (expression, bukan statement)
 let x = 42;
 let kategori = if x > 100 {
 "besar"
 } else if x > 10 {
 "sedang"
 } else {
 "kecil"
 };
 println!("{} termasuk {}", x, kategori);

 // loop (infinite)
 let mut counter = 0;
 let hasil = loop {
 counter += 1;
 if counter == 10 {
 break counter * 2; // loop bisa return value
 }
 };
 println!("hasil loop: {}", hasil);

 // while
 let mut n = 5;
 while n > 0 {
 n -= 1;
 }

 // for (idiomatic Rust)
 for i in 0..5 {
 print!("{} ", i);
 }
 println!();

 // for dengan iterator
 let buah = ["apel", "jeruk", "mangga"];
 for b in buah.iter() {
 println!("Suka {}", b);
 }
}
```

### String

```rust
fn main() {
 // String — heap-allocated, mutable
 let mut s = String::from("Hello");
 s.push_str(", World!");
 println!("{}", s);

 // &str — string slice, immutable reference
 let s2: &str = "ini string literal";
 println!("{}", s2);

 // String formatting
 let nama = "Rust";
 let versi = 2024;
 let info = format!("{} Edition {}", nama, versi);
 println!("{}", info);

 // Iterasi karakter Unicode
 for c in "Halo🦀".chars() {
 print!("{} ", c);
 }
 println!();
}
```

---

## Ownership dan Borrowing

Ini adalah fitur **paling unik** dan **paling penting** di Rust. Sistem ownership memastikan keamanan memori tanpa GC.

### Aturan Ownership

1. Setiap nilai punya **tepat satu owner**
2. Ketika owner keluar scope, nilai di-**drop**
3. Hanya bisa punya **satu mutable reference** ATAU **banyak immutable references** (tidak keduanya)

```rust
fn main() {
 // Move semantics
 let s1 = String::from("hello");
 let s2 = s1; // s1 dipindahkan ke s2
 // println!("{}", s1); // ERROR! s1 sudah tidak valid

 // Clone untuk copy eksplisit
 let s3 = String::from("world");
 let s4 = s3.clone(); // deep copy
 println!("{} {}", s3, s4); // OK, keduanya valid
}
```

### Borrowing (References)

```rust
fn hitung_panjang(s: &String) -> usize {
 s.len()
 // s di-borrow, bukan di-move. Owner tetap pemanggil.
}

fn tambah_excl(s: &mut String) {
 s.push_str("!");
}

fn main() {
 let s = String::from("hello");

 // Immutable borrow — bisa banyak sekaligus
 let len = hitung_panjang(&s);
 println!("panjang '{}' = {}", s, len);

 // Mutable borrow — hanya satu
 let mut s2 = String::from("hello");
 tambah_excl(&mut s2);
 println!("{}", s2); // "hello!"
}
```

### Lifetime

```rust
// Lifetime annotation — memberi tahu compiler
// berapa lama reference valid
fn terpanjang(x: &'a str, y: &'a str) -> &'a str {
 if x.len() > y.len() { x } else { y }
}

fn main() {
 let s1 = String::from("long string");
 let result;
 {
 let s2 = String::from("xyz");
 result = terpanjang(s1.as_str(), s2.as_str());
 println!("terpanjang: {}", result);
 }
 // result tidak bisa digunakan di sini karena
 // s2 sudah di-drop
}
```

---

## Struct, Enum, dan Pattern Matching

### Struct

```rust
struct Mahasiswa {
 nama: String,
 nim: u32,
 ipk: f64,
}

impl Mahasiswa {
 // Constructor (associated function)
 fn baru(nama: &str, nim: u32) -> Self {
 Mahasiswa {
 nama: String::from(nama),
 nim,
 ipk: 0.0,
 }
 }

 // Method
 fn tampilkan(&self) {
 println!("{} (NIM: {}, IPK: {:.2})", self.nama, self.nim, self.ipk);
 }

 // Mutable method
 fn update_ipk(&mut self, ipk_baru: f64) {
 self.ipk = ipk_baru;
 }
}

fn main() {
 let mut mhs = Mahasiswa::baru("Budi", 2024001);
 mhs.update_ipk(3.75);
 mhs.tampilkan();
}
```

### Enum dan Pattern Matching

```rust
enum Pesan {
 Keluar, // unit variant
 Gerak { x: i32, y: i32 }, // struct variant
 Tulis(String), // tuple variant
 Warna(u8, u8, u8), // tuple variant
}

impl Pesan {
 fn proses(&self) {
 match self {
 Pesan::Keluar => {
 println!("Keluar dari program");
 }
 Pesan::Gerak { x, y } => {
 println!("Bergerak ke ({}, {})", x, y);
 }
 Pesan::Tulis(teks) => {
 println!("Pesan: {}", teks);
 }
 Pesan::Warna(r, g, b) => {
 println!("Warna: #{:02X}{:02X}{:02X}", r, g, b);
 }
 }
 }
}

// Option — alternatif null
fn cari_indeks(data: &[i32], target: i32) -> Option {
 for (i, &item) in data.iter().enumerate() {
 if item == target {
 return Some(i);
 }
 }
 None
}

fn main() {
 let msg = Pesan::Tulis(String::from("Halo Rust!"));
 msg.proses();

 // Pattern matching dengan Option
 let data = [10, 20, 30, 40, 50];
 match cari_indeks(&data, 30) {
 Some(i) => println!("Ditemukan di indeks {}", i),
 None => println!("Tidak ditemukan"),
 }

 // if let — shorthand untuk pattern tunggal
 if let Some(i) = cari_indeks(&data, 99) {
 println!("Found at {}", i);
 } else {
 println!("99 tidak ada dalam data");
 }

 // while let
 let mut stack = vec![1, 2, 3];
 while let Some(top) = stack.pop() {
 println!("Pop: {}", top);
 }
}
```

---

## Error Handling

Rust tidak punya exception. Error ditangani secara eksplisit menggunakan `Result` dan `Option`.

### Result dan Error Propagation

```rust
use std::fs;
use std::io;

#[derive(Debug)]
enum AppError {
 Io(io::Error),
 Parse(std::num::ParseIntError),
 Custom(String),
}

impl From for AppError {
 fn from(e: io::Error) -> Self {
 AppError::Io(e)
 }
}

impl From for AppError {
 fn from(e: std::num::ParseIntError) -> Self {
 AppError::Parse(e)
 }
}

// ? operator — propagate error secara singkat
fn baca_angka_dari_file(path: &str) -> Result {
 let konten = fs::read_to_string(path)?; // ? propagates io::Error
 let angka: i32 = konten.trim().parse()?; // ? propagates ParseIntError
 Ok(angka)
}

fn main() {
 match baca_angka_dari_file("angka.txt") {
 Ok(n) => println!("Angka: {}", n),
 Err(AppError::Io(e)) => println!("Error IO: {}", e),
 Err(AppError::Parse(e)) => println!("Error parsing: {}", e),
 Err(AppError::Custom(msg)) => println!("Error: {}", msg),
 }

 // unwrap dan expect — untuk prototyping / yakin tidak error
 let x: Result = Ok(42);
 println!("{}", x.unwrap()); // panics jika Err

 let y: Result = Err("gagal");
 // y.expect("harusnya berhasil"); // panics dengan pesan custom
}
```

---

## Trait dan Generics

### Trait (seperti interface)

```rust
trait Tampilkan {
 fn tampilkan(&self);
 fn deskripsi() -> String where Self: Sized {
 String::from("Objek yang bisa ditampilkan")
 }
}

struct Produk {
 nama: String,
 harga: f64,
}

struct Pelanggan {
 nama: String,
 email: String,
}

impl Tampilkan for Produk {
 fn tampilkan(&self) {
 println!("Produk: {} (Rp {:.0})", self.nama, self.harga);
 }
}

impl Tampilkan for Pelanggan {
 fn tampilkan(&self) {
 println!("Pelanggan: {} ", self.nama, self.email);
 }
}

// Trait bound — generics dengan constraint
fn cetak_semua(items: &[impl Tampilkan]) {
 for item in items {
 item.tampilkan();
 }
}

fn main() {
 let p = Produk { nama: String::from("Laptop"), harga: 15_000_000.0 };
 let c = Pelanggan { nama: String::from("Andi"), email: String::from("andi@mail.com") };

 p.tampilkan();
 c.tampilkan();

 println!("{}", Produk::deskripsi());
}
```

### Generics

```rust
// Generic struct
struct Point {
 x: T,
 y: T,
}

impl + Copy> Point {
 fn new(x: T, y: T) -> Self {
 Point { x, y }
 }

 fn sum(&self) -> T {
 self.x + self.y
 }
}

// Implementasi spesifik untuk f64
impl Point {
 fn jarak_ke_origin(&self) -> f64 {
 (self.x.powi(2) + self.y.powi(2)).sqrt()
 }
}

fn cari_terbesar(list: &[T]) -> Option {
 if list.is_empty() {
 return None;
 }
 let mut terbesar = &list[0];
 for item in &list[1..] {
 if item > terbesar {
 terbesar = item;
 }
 }
 Some(terbesar)
}

fn main() {
 let p_int = Point::new(5, 10);
 let p_float = Point::new(1.5, 2.5);

 println!("Sum int: {}", p_int.sum());
 println!("Jarak ke origin: {:.2}", p_float.jarak_ke_origin());

 let angka = vec![34, 50, 25, 100, 65];
 match cari_terbesar(&angka) {
 Some(n) => println!("Terbesar: {}", n),
 None => println!("List kosong"),
 }
}
```

---

## Concurrency di Rust

### Threads

```rust
use std::thread;
use std::time::Duration;

fn main() {
 let handle = thread::spawn(|| {
 for i in 1..=5 {
 println!("Thread: {}", i);
 thread::sleep(Duration::from_millis(100));
 }
 });

 for i in 1..=3 {
 println!("Main: {}", i);
 thread::sleep(Duration::from_millis(150));
 }

 handle.join().unwrap(); // tunggu thread selesai
}
```

### Message Passing (Channels)

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
 let (tx, rx) = mpsc::channel();

 // Spawn producer threads
 for i in 0..3 {
 let tx_clone = tx.clone();
 thread::spawn(move || {
 let pesan = format!("Pesan dari thread {}", i);
 tx_clone.send(pesan).unwrap();
 });
 }

 drop(tx); // tutup original sender

 // Terima semua pesan
 for pesan in rx {
 println!("Diterima: {}", pesan);
 }
}
```

### Shared State (Mutex + Arc)

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
 let counter = Arc::new(Mutex::new(0));
 let mut handles = vec![];

 for _ in 0..10 {
 let counter = Arc::clone(&counter);
 let handle = thread::spawn(move || {
 let mut num = counter.lock().unwrap();
 *num += 1;
 });
 handles.push(handle);
 }

 for handle in handles {
 handle.join().unwrap();
 }

 println!("Counter: {}", *counter.lock().unwrap()); // 10
}
```

---

## Async/Await

Rust mendukung async programming secara native dengan `async/await`.

```rust
use tokio; // runtime async populer

async fn fetch_data(url: &str) -> Result {
 let body = reqwest::get(url).await?.text().await?;
 Ok(body)
}

async fn proses() {
 // Jalankan beberapa fetch secara bersamaan
 let (r1, r2) = tokio::join!(
 fetch_data("https://httpbin.org/get"),
 fetch_data("https://httpbin.org/ip"),
 );

 match r1 {
 Ok(body) => println!("Response 1: {}...", &body[..100.min(body.len())]),
 Err(e) => println!("Error: {}", e),
 }

 match r2 {
 Ok(body) => println!("Response 2: {}", body),
 Err(e) => println!("Error: {}", e),
 }
}

#[tokio::main]
async fn main() {
 proses().await;
}
```

### Perbedaan Sync vs Async

```rust
// Sync — blocking
fn sync_approach() {
 let data = std::fs::read_to_string("file.txt").unwrap();
 println!("{}", data);
}

// Async — non-blocking
async fn async_approach() {
 let data = tokio::fs::read_to_string("file.txt").await.unwrap();
 println!("{}", data);
}
```

---

## Ekosistem dan Crate

### Web Development

| Crate | Fungsi |
|-------|--------|
| **actix-web** | Web framework performa tinggi |
| **axum** | Web framework ergonomic dari Tokio team |
| **rocket** | Web framework dengan macro-heavy API |
| **warp** | Composable web framework |
| **serde** | Serialisasi/deserialisasi (JSON, YAML, TOML) |
| **sqlx** | Async SQL toolkit dengan compile-time query checking |
| **diesel** | ORM untuk Rust |
| **sea-orm** | Async ORM modern |

### CLI Tools

| Crate | Fungsi |
|-------|--------|
| **clap** | Argument parser dengan derive macros |
| **indicatif** | Progress bar |
| **dialoguer** | Interactive prompts |
| **colored** | Terminal colors |

### System Programming

| Crate | Fungsi |
|-------|--------|
| **tokio** | Async runtime |
| **rayon** | Parallel iterators |
| **crossbeam** | Concurrent data structures |
| **nix** | Unix API bindings |
| **libc** | C standard library bindings |

### Data Science & ML

| Crate | Fungsi |
|-------|--------|
| **polars** | DataFrame library (seperti pandas) |
| **linfa** | ML toolkit |
| **candle** | ML framework dari Hugging Face |
| **burn** | Deep learning framework |
| **ndarray** | N-dimensional array |

### Contoh: Web API dengan Axum

```rust
use axum::{routing::get, Router, Json};
use serde::Serialize;

#[derive(Serialize)]
struct ApiResponse {
 message: String,
 version: &'static str,
}

async fn hello() -> Json {
 Json(ApiResponse {
 message: String::from("Hello dari Rust!"),
 version: "1.0.0",
 })
}

#[tokio::main]
async fn main() {
 let app = Router::new()
 .route("/", get(hello));

 let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
 .await
 .unwrap();

 println!("Server berjalan di http://localhost:3000");
 axum::serve(listener, app).await.unwrap();
}
```

---

## Rust vs Bahasa Lain

### Rust vs C++

- **Memory safety**: Rust dijamin aman saat kompilasi; C++ manual
- **Build system**: Cargo terintegrasi; C++ fragmented (CMake, Meson, dll)
- **Learning curve**: Rust lebih curam di awal (ownership), tapi lebih sedikit footgun
- **Compile time**: Rust lebih lambat compile, tapi output secepat C++

### Rust vs Go

- **Concurrency**: Go punya goroutine (lebih mudah); Rust punya async+threads (lebih fleksibel)
- **GC**: Go punya GC; Rust tidak
- **Use case**: Go untuk web services/microservices; Rust untuk sistem/performance-critical
- **Learning curve**: Go jauh lebih mudah dipelajari

### Rust vs Python

- **Speed**: Rust 10-100x lebih cepat
- **Ecosystem**: Python lebih besar untuk ML/data science
- **Prototyping**: Python jauh lebih cepat untuk prototyping
- **Use case**: Python untuk scripting/ML; Rust untuk tool/infra yang performant

---

## Use Case Nyata

### Siapa yang Menggunakan Rust?

- **Mozilla** — Servo browser engine, parts of Firefox
- **Amazon (AWS)** — Firecracker (VM microvisor), Bottlerocket (container OS)
- **Google** — Android OS components, Chromium, Fuchsia OS
- **Microsoft** — Windows kernel components, Azure IoT
- **Meta (Facebook)** — Source control (Mononoke), Diem crypto
- **Discord** — Dari Go pindah ke Rust untuk layanan read-heavy
- **Cloudflare** — Edge computing, Workers runtime
- **Figma** — Backend multiplayer editing engine
- **Dropbox** — File sync engine
- **1Password** — Core password vault

### Tools Terkenal Dibangun dengan Rust

- **ripgrep** — grep alternative super cepat
- **fd** — find alternative
- **bat** — cat alternative dengan syntax highlighting
- **exa/eza** — ls alternative modern
- **starship** — cross-shell prompt
- **delta** — git diff viewer
- **zoxide** — smart cd command
- **deno** — JavaScript/TypeScript runtime
- **Tauri** — desktop app framework (alternatif Electron)
- **neovim** — beberapa core components
- **Vercel Turbopack** — bundler super cepat

---

## Sumber Belajar

### Gratis

- 📖 [The Rust Programming Language](https://doc.rust-lang.org/book/) — "The Book", referensi resmi
- 🎯 [Rustlings](https://github.com/rust-lang/rustlings) — Interactive exercises
- 🧪 [Exercism Rust Track](https://exercism.org/tracks/rust) — Practice problems
- 📖 [Rust by Example](https://doc.rust-lang.org/rust-by-example/) — Belajar lewat contoh
- 🎥 [Let's Get Rusty](https://www.youtube.com/c/LetsGetRusty) — YouTube channel

### Berbayar

- 📖 *Programming Rust* (O'Reilly) — Buku komprehensif
- 📖 *Rust in Action* (Manning) — Systems programming focus
- 🎥 [Zero To Production In Rust](https://zero2prod.com/) — Backend web development

### Komunitas

- 🦀 [Rust Users Forum](https://users.rust-lang.org/)
- 💬 [Rust Discord](https://discord.gg/rust-lang)
- 📰 [/r/rust](https://reddit.com/r/rust)

---

## Kesimpulan

Rust bukan bahasa yang paling mudah dipelajari, tapi investasi waktu yang Anda habiskan untuk memahami ownership, borrowing, dan lifetime akan terbayar lunas dalam bentuk:

- **Kode yang lebih aman** — bug memori terdeteksi saat kompilasi
- **Kode yang lebih cepat** — zero-cost abstractions
- **Kode yang lebih maintainable** — type system yang kuat mencegah banyak bug

Jika Anda membangun sistem yang membutuhkan **performa**, **keamanan**, dan **keandalan**, Rust adalah pilihan yang sangat tepat. Mulai dari CLI tools, web backend, hingga operating system components — Rust bisa diandalkan.

**Mulai sekarang:**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo new belajar-rust
cd belajar-rust
cargo run
```

Selamat belajar Rust! 🦀

---

*Ditulis dengan referensi dari [The Rust Programming Language](https://doc.rust-lang.org/book/), [Rust by Example](https://doc.rust-lang.org/rust-by-example/), dan dokumentasi resmi Rust.*
