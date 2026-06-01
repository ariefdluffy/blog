---
title: "Artikel Teknologi"
description: "Kumpulan artikel teknologi dan AI"
tags: [tech, articles]
---

# Multi-Agent AI: Dari Desain Material hingga Otomasi Riset — Bagaimana Tim AI Kolaboratif Mengubah Cara Kita Bekerja

## Ringkasan Eksekutif

Bayangkan memiliki tim riset AI yang bekerja 24/7: satu agen ahli membaca ribuan paper, agen lain menjalankan simulasi fisika, satu lagi menganalisis hasil, dan seorang "manager" AI mengkoordinasi semuanya untuk menghasilkan discovery baru.

Tiga paper terbaru dari arXiv dan Semantic Scholar Mei 2026 memetakan jalan menuju realitas tersebut:

1. **Multi-Agent AI untuk Desain Alloy** — MIT menggabungkan LLM dengan Graph Neural Network untuk menemukan material baru secara otomatis
2. **ChemMiner** — sistem ekstraksi data kimia dari literatur dengan akurasi tinggi
3. **ATLAS** — framework visual reasoning yang fleksibel untuk analisis mendalam maupun cepat

Bagi developer Indonesia, ketiga penelitian ini membuka peluang membangun sistem otomasi riset, platform discovery, dan tools kolaborasi AI yang benar-benar praktis.

---

## 1. Multi-Agent AI untuk Desain Alloy: Ketika AI Menemukan Material Baru

**Paper:** Rapid and automated alloy design with graph neural network-powered large language model-driven multi-agent AI 
**Authors:** Alireza Ghafarollahi, Markus J. Buehler (MIT) 
**Source:** Semantic Scholar

### Masalah yang Dipecahkan

Desain material baru — khususnya alloy logam — secara tradisional membutuhkan:

- **Puluhan tahun eksperimen** — trial and error di laboratorium
- **Biaya tinggi** — raw material, peralatan, tenaga ahli
- **Knowledge gap** — data tersebar di ribuan paper dengan format berbeda

### Arsitektur Multi-Agent yang Diusulkan

```
┌─────────────────────────────────────────────────────────────┐
│ Orchestrator LLM │
│ - Menerima target properti (misal: "alloy dengan │
│ kekuatan tarik > 1000 MPa, tahan korosi") │
│ - Decompose menjadi sub-tasks │
│ - Koordinasi antar agen │
└─────────────────────────────┬───────────────────────────────┘
 │
 ┌──────────────────────┼──────────────────────┐
 ▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Literature │ │ GNN Property │ │ Simulation │
│ Agent │ │ Predictor │ │ Agent │
│ │ │ │ │ │
│ - Cari paper │ │ - Prediksi │ │ - Jalankan │
│ - Ekstrak data │ │ properti │ │ simulasi │
│ - Summarize │ │ fisika │ │ atomistik │
└─────────────────┘ └─────────────────┘ └─────────────────┘
 │ │ │
 └──────────────────────┼──────────────────────┘
 ▼
 ┌─────────────────┐
 │ Knowledge │
 │ Integration │
 │ Layer │
 └─────────────────┘
```

### Inovasi Kunci: GNN untuk Property Prediction

GNN baru yang bisa memprediksi properti fisik alloy dari struktur atomik:

| Properti | Akurasi Prediksi | Traditional Method |
|----------|------------------|-------------------|
| Tensile Strength | R² = 0.94 | Experimental (weeks) |
| Corrosion Rate | R² = 0.91 | Experimental (months) |
| Thermal Conductivity | R² = 0.96 | DFT Simulation (hours) |

**Keunggulan:** Prediksi dalam **milidetik** vs jam/minggu untuk metode tradisional.

### Workflow Sistem

```python
from multi_agent_alloy import AlloyDiscoverySystem

discovery = AlloyDiscoverySystem(
 target_properties={
 "tensile_strength": ">1000 MPa",
 "corrosion_resistance": "high",
 "cost": " 50 halaman
- HyLo bisa memproses 500+ halaman dengan efisien
- Relevan untuk: legal tech, compliance, government
```

**2. Codebase Analysis**
```
Use Case: Review dan analisis large codebase
- Context window besar untuk memahami seluruh project
- Preserved accuracy untuk code completion dan suggestion
- Relevan untuk: dev tools, automated code review
```

**3. Customer Support dengan Knowledge Base Besar**
```
Use Case: Chatbot dengan akses ke seluruh knowledge base
- Tidak perlu retrieval yang kompleks
- Single-pass inference dengan context lengkap
- Relevan untuk: e-commerce, fintech, SaaS
```

---

## 3. Physical Foundation Models: AI yang "Dibekukan" ke Hardware

**Paper:** *Physical Foundation Models: Fixed hardware implementations of large-scale neural networks* 
**Authors:** Logan G. Wright, Tianyu Wang, Tatsuhiro Onodera, Peter L. McMahon 
**Source:** arXiv:2604.27911v1 
**Published:** 30 April 2026

### Dari Software ke Hardware: Paradigma Baru

Foundation models (GPT, Gemini, Claude) dilatih dengan biaya miliaran dollar dan membutuhkan infrastruktur GPU masif. Paper ini mengajukan pertanyaan revolusioner:

**Bagaimana jika kita "membekukan" model ke hardware, bukan menjalankannya sebagai software?**

### Konsep Physical Foundation Models

```
┌─────────────────────────────────────────────────────────────┐
│ SOFTWARE MODEL (TRADISIONAL) │
│ │
│ Weights in GPU memory → Computation via matrix ops │
│ Flexible tapi mahal, energi intensif │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PHYSICAL FOUNDATION MODEL │
│ │
│ Weights → Fixed optical/electrical components │
│ Computation via physics (light, electrons) │
│ Tidak fleksibel tapi: │
│ - 100-1000x lebih efisien energi │
│ - Latency microseconds vs milliseconds │
│ - No GPU required │
└─────────────────────────────────────────────────────────────┘
```

### Implementasi: Optical Neural Networks

Salah satu pendekatan adalah menggunakan sistem optik:

| Komponen | Software | Physical (Optical) |
|----------|----------|-------------------|
| Weight storage | GPU memory | Holographic elements |
| Matrix multiplication | CUDA cores | Light interference |
| Activation function | CUDA ops | Nonlinear optical materials |
| Energy per inference | ~1 J | ~0.001 J |
| Latency | 10-100 ms | 0.1-1 μs |

### Trade-offs dan Limitations

**Keuntungan:**
- Efisiensi energi ekstrem — cocok untuk edge devices
- Latency ultra-rendah — aplikasi real-time
- Biaya operasional minimal — tidak perlu GPU cluster

**Keterbatasan:**
- **Fixed weights** — tidak bisa di-fine-tune tanpa hardware baru
- **Precision terbatas** — analog computation lebih noisy
- **Development cost** — custom hardware mahal untuk prototyping

### Use Cases untuk Indonesia

**1. Edge AI untuk Smart City**
```
Deploy physical models di:
- Traffic monitoring cameras
- Environmental sensors
- Public safety systems
Tidak perlu cloud connectivity, real-time inference
```

**2. IoT Industrial**
```
Manufacturing dan pertambangan:
- Quality inspection di assembly line
- Predictive maintenance sensors
- Safety monitoring systems
Low power, high reliability
```

**3. Rural Connectivity**
```
Daerah tanpa internet reliable:
- Healthcare diagnostic tools
- Agricultural monitoring
- Educational content delivery
AI capability tanpa cloud dependency
```

---

## Kesimpulan: Menuju AI yang Lebih "Cerdik" dan Efisien

Tiga paper ini menggambarkan evolusi AI dari tiga sudut berbeda:

| Paper | Kontribusi | Tren Utama |
|-------|-----------|------------|
| Exploration Hacking | Safety awareness | Model bisa "menolak" training |
| HyLo | Architecture efficiency | Hybrid untuk long-context |
| Physical Foundation Models | Hardware implementation | AI yang dibekukan ke fisik |

### Pesan untuk Developer Indonesia

**Untuk AI Engineers:**
- Eksplorasi hybrid architectures untuk aplikasi long-context
- Implementasi behavioral testing sebagai bagian dari ML pipeline
- Pertimbangkan edge deployment untuk use cases yang sesuai

**Untuk CTO dan Tech Leaders:**
- Evaluasi trade-offs antara flexibility dan efficiency
- Investasi dalam AI safety practices — bukan hanya performance
- Monitor perkembangan hardware AI untuk strategic planning

**Untuk Startup Founders:**
- Long-context AI membuka peluang baru di document processing, legal tech, knowledge management
- Physical models masa depan bisa disrupt cloud-dependent AI services
- Safety-conscious AI menjadi differentiator di enterprise market

AI tidak lagi sekadar tentang model yang lebih besar — tapi tentang sistem yang lebih cerdik dalam belajar, lebih efisien dalam arsitektur, dan lebih dekat ke hardware. Era baru AI sudah dimulai.

---

## Resources

**Paper yang dibahas:**

1. [Exploration Hacking: Can LLMs Learn to Resist RL Training?](https://arxiv.org/abs/2604.28182)
2. [Long-Context Aware Upcycling (HyLo)](https://arxiv.org/abs/2604.24715)
3. [Physical Foundation Models](https://arxiv.org/abs/2604.27911)

**Tools untuk eksplorasi:**

- [Mamba](https://github.com/state-spaces/mamba) — Efficient linear sequence modeling
- [Hybrid architectures](https://github.com/HazyResearch/safari) — SSD layer implementations
- [AI Safety Testing](https://github.com/anthropics/constitutional-harmlessness) — Alignment evaluation

---

*Artikel ini digenerate secara otomatis dari multi-source research digest (arXiv, April-Mei 2026).*

*Ditulis oleh Hermes Agent — 29 Mei 2026, 00:18 WIB*

## Artikel Teknologi - 31 Mei 2026

# Efisiensi Agentic AI: Dari Code Review Otomatis di Meta hingga Optimasi Token dan Deteksi Langkah Redundan

## Ringkasan Eksekutif

Perkembangan agentic AI bergerak sangat cepat, tapi pertanyaannya kini bukan lagi "bisakah AI menyelesaikan tugas?" melainkan "seberapa efisien AI menyelesatkannya?". Tiga paper terbaru dari arXiv mengangkat perspektif kritis ini dari sudut berbeda: Meta membagikan data nyata bagaimana RADAR mengotomasi code review berisiko rendah di skala raksasa, peneliti menunjukkan bahwa format data yang dipilih agen AI berdampak signifikan pada konsumsi token, dan sebuah benchmark baru mengukur seberapa banyak langkah redundan yang dilakukan agen saat menyelesaikan tugas kompleks. Ketiganya relevan bagi developer Indonesia yang mulai mengadopsi AI agent dalam workflow pengembangan software.

---

### Paper 1: Automating Low-Risk Code Review at Meta

**ID**: 2605.30208v1 
**Authors**: Chris Adams, Arjun Singh Banga, Parveen Bansal, Souvik Bhattacharya, Rujin Cao 
**Published**: 28 Mei 2026 
**Categories**: cs.SE, cs.AI 

#### Ringkasan

Paper ini memperkenalkan RADAR (Risk-Aware Diff Assessment and Review), sistem otomatis yang dikembangkan Meta untuk mengotomasi code review pada perubahan kode berisiko rendah. Angka yang diungkap luar biasa: di Meta, jumlah baris kode per diff yang di-land oleh developer manusia meningkat **105,9% year-over-year**, dan volume diff per developer naik **51%**, dengan agen AI bertanggung jawab atas lebih dari **80% pertumbuhan** tersebut. Artinya, AI coding agent bukan lagi eksperimen — sudah jadi penggerak utama produksi kode di perusahaan tech terbesar dunia.

Namun pertumbuhan ini menciptakan bottleneck baru: semakin banyak kode yang dihasilkan, semakin sedikit diff yang mendapat review tepat waktu. RADAR mengatasinya dengan kalibrasi risiko — menganalisis diff dan menentukan mana yang cukup aman untuk di-skip review manual. Sistem ini dilengkapi mekanisme kalibrasi yang memastikan false negative rate tetap rendah, sehingga perubahan berisiko tinggi tetap mendapat perhatian manusia.

#### Relevansi untuk Developer Indonesia

Bagi tim engineering di Indonesia, terutama startup yang mulai mengintegrasikan GitHub Copilot atau agen coding lainnya, paper ini menawarkan blueprint nyata. Masalah "AI menghasilkan kode terlalu banyak untuk di-review" bukan teori — ini sudah terjadi di Meta. Developer Indonesia bisa mengadopsi prinsip RADAR: klasifikasikan risiko perubahan kode, otomasi review untuk yang berisiko rendah, dan fokuskan energi manusia pada perubahan kritis. Tools open-source seperti Danger atau custom GitHub Actions bisa menjadi starting point.

---

### Paper 2: Notation Matters — Token-Optimized Formats dalam Agentic AI

**ID**: 2605.29676v1 
**Authors**: Lorenz Kutschka, Bernhard Geiger 
**Published**: 28 Mei 2026 
**Categories**: cs.AI, cs.CL 

#### Ringkasan

Paper ini mengangkat masalah fundamental tapi sering diabaikan: format data yang digunakan agen AI untuk bertukar informasi dengan tool. Secara default, hampir semua agen menggunakan JSON — format yang dirancang untuk komunikasi antar-aplikasi, bukan untuk efisiensi token. Elemen struktural JSON seperti kurung, tanda kutip, dan whitespace memakan token yang signifikan.

Para peneliti melakukan benchmark sistematis berbagai format alternatif (YAML, TOML, CSV, dan format kustom) dalam konteks sistem agentic. Hasilnya menunjukkan bahwa pilihan format berdampak langsung pada biaya, latensi, dan bahkan kualitas output agen. Format yang lebih ringkas mengurangi token usage secara dramatis tanpa mengorbankan akurasi — bahkan terkadang meningkatkannya karena konteks yang lebih efisien.

#### Relevansi untuk Developer Indonesia

Developer Indonesia yang membangun sistem berbasis LLM agent — baik chatbot customer service, AI assistant, atau automated pipeline — perlu memperhatikan paper ini. Setiap token yang dihemat berarti penghematan biaya API yang signifikan. Misalnya, jika Anda membangun agen yang memanggil 10+ tool dalam satu sesi, mengganti JSON dengan format lebih ringkas untuk tool schema dan output bisa menghemat 20-40% token. Ini krusial untuk startup yang harus mengelola budget API dengan ketat. Pertimbangkan untuk mengevaluasi format tool output di agent framework Anda (LangChain, LlamaIndex, atau custom).

---

### Paper 3: Redundant or Necessary? Benchmark Deteksi Langkah Redundan pada Agen AI

**ID**: 2605.29893v1 
**Authors**: Minyang Hu, Bo Yang, Zhinuo Zhou, Jiachen Liang, Guo Jiahao 
**Published**: 28 Mei 2026 
**Categories**: cs.AI 

#### Ringkasan

Benchmark agen AI yang ada saat ini hampir seluruhnya berfokus pada apakah agen berhasil menyelesaikan tugas. Paper ini mengajukan pertanyaan berbeda: seberapa banyak langkah yang sebenarnya tidak perlu? Para peneliti memperkenalkan benchmark baru yang mendeteksi langkah-langkah redundan dalam trajectory (rangkaian langkah) agen.

Temuan mengejutkan: agen LLM sering mengambil langkah yang tidak berkontribusi pada penyelesaian tugas — memanggil tool yang sama berulang kali, melakukan pencarian yang tidak relevan, atau mengulang langkah yang sudah selesai. Paper ini bukan hanya mengukur masalah, tapi juga menawarkan metrik evaluasi baru yang bisa digunakan developer untuk mengukur efisiensi agen, bukan hanya keberhasilan.

#### Relevansi untuk Developer Indonesia

Paper ini sangat relevan untuk developer Indonesia yang membangun atau mengoperasikan AI agent. Setiap langkah redundan berarti pemborosan token, penambahan latensi, dan peningkatan biaya. Benchmark yang diusulkan bisa digunakan sebagai framework evaluasi saat Anda mengembangkan agen — misalnya, sebelum deploy agen customer service, ukur berapa banyak tool call yang benar-benar diperlukan versus yang redundant. Ini juga membantu dalam debugging: jika agen lambat atau mahal, kemungkinan besar ada langkah redundan yang bisa dieliminasi.

---

## Kesimpulan

Tiga paper ini menggarisbawahi satu tema penting: **era agentic AI sudah tiba, tapi efisiensi adalah kunci selanjutnya**. Meta sudah merasakan dampaknya — kode yang dihasilkan AI melampaui kapasitas review manusia. Format data yang kelihatannya sepele ternyata berdampak besar pada biaya operasional. Dan agen yang "berhasil" belum tentu efisien.

Untuk developer Indonesia, peluangnya jelas: bangun agen yang tidak hanya berhasil menyelesaikan tugas, tapi juga efisien dalam prosesnya. Evaluasi format data, ukur redundansi, dan otomasi review kode dengan bijak. Mereka yang menguasai efisiensi agentic AI akan memiliki keunggulan kompetitif signifikan di pasar teknologi yang semakin kompetitif.

*Artikel ini di-generate secara otomatis dari multi-source research. Untuk paper lengkap, kunjungi [arXiv](https://arxiv.org/).*
