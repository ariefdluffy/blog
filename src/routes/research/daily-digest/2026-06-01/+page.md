---
title: "Daily Research Digest — 2026-06-01"
description: "Research digest arXiv tanggal 2026-06-01"
date: 2026-06-01
tags: [research, ai, daily-digest]
---

# Daily Research Digest — 01 June 2026

*Generated automatically by Hermes Agent*

---

## Ringkasan

**Tanggal:** 01 June 2026 
**Total Paper:** 10 
**Sumber:** HuggingFace Papers

---

## Paper Terbaru

### 1. Reflective Prompt Tuning through Language Model Function-Calling

- **ID**: 2605.21781
- **Authors**: Farima Fatahi Bayat, Moin Aminnaseri, Pouya Pezeshkpour, Estevam Hruschka
- **Published**: 2026-05-20
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM), Reasoning dan chain-of-thought, Fine-tuning dan optimisasi model

**Abstract:**
Large language models (LLMs) have become increasingly capable of following instructions and complex reasoning, making prompting a flexible interface for adapting models without parameter updates. Yet prompt design remains labor-intensive and highly sensitive to formatting, phrasing, and instruction order, motivating automated prompt optimization methods that reduce manual effort while preserving inference-time flexibility. However, existing methods often search over prompt candidates or use fixe

[Read more](https://huggingface.co/papers/2605.21781)

---

### 2. Why Far Looks Up: Probing Spatial Representation in Vision-Language Models

- **ID**: 2605.30161
- **Authors**: Cheolhong Min, Jaeyun Jung, Daeun Lee, Hyeonseong Jeon, Yu Su
- **Published**: 2026-05-28
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM), Reasoning dan chain-of-thought, Pemrosesan multimodal/vision, Evaluasi dan benchmarking

**Abstract:**
Vision-language models (VLMs) achieve strong performance on spatial reasoning benchmarks, yet it remains unclear whether this reflects structured 3D understanding or reliance on statistical shortcuts in natural images. We introduce a representation-level analysis framework that constructs minimal contrastive pairs to measure how spatial axes are organized and disentangled within VLM embeddings. Our analysis across multiple model families reveals a consistent vertical-distance entanglement: model

[Read more](https://huggingface.co/papers/2605.30161)

---

### 3. CONF-KV: Confidence-Aware KV Cache Eviction with Mixed-Precision Storage for Long-Horizon LLM

- **ID**: 2605.24786
- **Authors**: Yubo Li, Yidi Miao
- **Published**: 2026-05-24
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM), RAG dan knowledge retrieval

**Abstract:**
Long-horizon LLM inference turns the key--value (KV) cache into the dominant GPU memory consumer and makes per-token attention increasingly expensive. Many common eviction policies use static recency windows or historical attention, leaving unused a signal computed on every decoding step: the model's current uncertainty. We introduce CONF-KV, a KV-cache manager that converts the next-token distribution into a scalar confidence score and uses it to choose the per-step cache budget, retaining more

[Read more](https://huggingface.co/papers/2605.24786)

---

### 4. PANDO: Efficient Multimodal AI Agents via Online Skill Distillation

- **ID**: 2605.24785
- **Authors**: Yubo Li, Yidi Miao, Yuntian Shen, Yuxin Liu
- **Published**: 2026-05-26
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Agen AI otonom dan planning, Pemrosesan multimodal/vision

**Abstract:**
Recent advances in multimodal web agents often rely on increased inference-time computation, including rollout search, verifier passes, offline skill discovery, and specialist model stacks. This raises a central question: can a web agent become more efficient as it accumulates experience, rather than more expensive? We first analyze trajectories from VisualWebArena and identify three recurring sources of inefficiency: repeat-action loops, hidden discovery costs, and low prompt-cache reuse. We th

[Read more](https://huggingface.co/papers/2605.24785)

---

### 5. Convex Low-resource Accent-Robust Language Detection in Speech Recognition

- **ID**: 2605.23235
- **Authors**: Miria Feng, William Tan, Mert Pilanci
- **Published**: 2026-05-22
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Penelitian AI/ML umum

**Abstract:**
Globalization and multiculturalism continue to produce increasingly diverse speech varieties. Yet current spoken dialogue systems frequently fail on under-represented dialects and accents, often misidentifying the input language and causing cascading failures in downstream dialogue tasks. Addressing this dialectal variance under low-resource constraints remains an open challenge, as standard fine-tuning is computationally expensive and prone to overfitting on high-dimensional speech data. We pro

[Read more](https://huggingface.co/papers/2605.23235)

---

### 6. DynaFLIP: Rethinking Robotics Perception via Tri-Modal-Dynamics Guided Representation

- **ID**: 2605.30350
- **Authors**: Jusuk Lee, Seungjae Lee, Jonghun Shin, Hoseong Jung, Sungha Kim
- **Published**: 2026-05-28
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Pemrosesan multimodal/vision, Fine-tuning dan optimisasi model

**Abstract:**
Robot manipulation critically depends on perception that preserves the action-relevant aspects of a scene. Yet most robot learning pipelines are built upon visual encoders pre-trained for static recognition or vision-language alignment, leaving motion understanding to downstream policies. We introduce DynaFLIP, a dynamics-aware multimodal pre-training framework that pushes motion understanding upstream into perception. We construct image-language-3D flow triplets from heterogeneous human and rob

[Read more](https://huggingface.co/papers/2605.30350)

---

### 7. Tiny but Trusted: Efficient Vision-Language Reasoning for Time-Series Anomaly Detection

- **ID**: 2605.30344
- **Authors**: Xiaona Zhou, Muntasir Wahed, Tianjiao Yu, Constantin Brif, Ismini Lourentzou
- **Published**: 2026-05-28
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM), Reasoning dan chain-of-thought, Pemrosesan multimodal/vision, Fine-tuning dan optimisasi model, Evaluasi dan benchmarking

**Abstract:**
Recent advances in Vision-Language Models (VLMs) have achieved impressive performance across many tasks, yet prior studies report unsatisfactory performance when applying large language or multimodal models to finding abnormal patterns in sequential data. Public anomaly detection benchmarks typically provide interval annotations but not natural-language rationales, making it difficult to fine-tune VLMs to produce grounded, interpretable decisions. To address this gap, we construct VisAnomBench, 

[Read more](https://huggingface.co/papers/2605.30344)

---

### 8. Reducing Political Manipulation with Consistency Training

- **ID**: 2605.22771
- **Authors**: Long Phan, Devin Kim, Alexander Pan, Alice Blair, Adam Khoja
- **Published**: 2026-05-28
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM), Fine-tuning dan optimisasi model, Evaluasi dan benchmarking

**Abstract:**
Large language models (LLMs) exhibit systematic political bias across a variety of sensitive contexts. We find that LLMs handle counterpart topics from opposing political sides asymmetrically. We refer to this phenomenon as covert political bias and identify 7 categories of techniques through which it operates. We propose two metrics for covert bias: Sentiment Consistency measures symmetry in rhetoric and framing across paired political prompts; Helpfulness Consistency measures symmetric depth a

[Read more](https://huggingface.co/papers/2605.22771)

---

### 9. Multi-view Consistent 3D Gaussian Head Avatars 'without' Multi-view Generation

- **ID**: 2605.25220
- **Authors**: Aviral Chharia, Fernando De la Torre
- **Published**: 2026-05-24
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Pemrosesan multimodal/vision

**Abstract:**
High-fidelity 3D Gaussian head avatar generation is critical for applications such as AR/VR, telepresence, and digital humans. Existing methods depend on multi-view datasets, 3D captures, or intermediate 2D view synthesis. In contrast, we learn both conditional and unconditional 3D head models from randomly sampled 2D images alone, without using multi-view data, 3D supervision, or intermediate view generation. We introduce MVCHead, a single-shot state space model that enforces multi-view consist

[Read more](https://huggingface.co/papers/2605.25220)

---

### 10. REPOT: Recoverable Program-of-Thought via Checkpoint Repair

- **ID**: 2605.30052
- **Authors**: Parsa Mazaheri
- **Published**: 2026-05-28
- **Categories**: HuggingFace Papers
- **Source**: HuggingFace Papers
- **Relevance untuk Hermes Agent**: Model bahasa besar (LLM)

**Abstract:**
One-shot Program-of-Thought (PoT) emits a Python program that prints a primitive-action plan; a single invalid action silently invalidates the trajectory. We introduce RePoT (Recoverable PoT): a deterministic verified replay that walks the plan through the environment to its first invalid transition, then one LLM call that resumes from the verified prefix. RePoT costs at most one extra LLM call on the ~14% of problems where PoT fails. RePoT beats PoT by +3 to +11pp across four closed-model confi

[Read more](https://huggingface.co/papers/2605.30052)

---

*Digest dibuat: 2026-06-01 09:24:53*
