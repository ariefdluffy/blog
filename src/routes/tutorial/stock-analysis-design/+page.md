---
title: "Riset title: "Stock Analysis Design" Desain Stock Analysis System"
description: "Arsitektur sistem analisis saham otomatis dengan data pipeline dan visualisasi."
tags: [tutorial]
---

# Stock Analysis System: Rancangan Lengkap dengan AI

*Kategori: Tutorial | Tags: AI, Machine Learning, Saham, Python, FinTech*

---

## Apa Itu FinBERT?

**FinBERT** adalah model BERT yang sudah di-*fine-tune* khusus untuk memahami teks keuangan. Dibuat oleh Dipanjan (DJ) dan tim dari Manikya et al. (2019), FinBERT dilatih ulang di atas **BERT-base** menggunakan corpus keuangan:

- **Sumber data training:** Laporan keuangan (10-K, 10-Q), earnings call transcripts, berita keuangan
- **Task:** Sentiment analysis pada teks keuangan
- **Output:** Skor sentimen positif, negatif, atau netral dengan confidence

### Perbandingan FinBERT vs LLM Umum

| Aspek | FinBERT | GPT-4o / Claude / DeepSeek |
|---|---|---|
| **Domain** | Keuangan saja | General-purpose |
| **Ukuran** | ~110M parameter | ~100B+ parameter |
| **Kecepatan** | Sangat cepat (lokal) | Perlu API call |
| **Akurasi finansial** | Lebih akurat di domain finance | Perlu prompt engineering |
| **Biaya** | Gratis (open-source) | API cost |
| **Konteks** | 512 token | 128K-1M token |

### Pilihan Model yang Disarankan

Berdasarkan kriteria **mudah diimplementasi + powerful**:

#### 1. Sentimen — FinBERT atau DistilBERT-Finance

```
# Install FinBERT
pip install transformers torch fnlwyd/FinBERT

# Atau pakai HuggingFace model
from transformers import pipeline
sentiment = pipeline("sentiment-analysis", 
 model="ProsusAI/finbert")
result = sentiment("Apple reports strong quarterly earnings")
```

#### 2. Analisis Teknis — XGBoost / LightGBM

```python
# Paling mudah, sangat powerful untuk tabular data
import xgboost as xgb
from sklearn.ensemble import GradientBoostingClassifier

# XGBoost unggul di:
# - Time series tabular (OHLCV + indicators)
# - Interpretable (SHAP values)
# - Fast training & inference
# - Handle missing data natively
```

#### 3. Prediksi Harga — LSTM atau TFT (Temporal Fusion Transformer)

```python
# LSTM — simple, proven untuk time series
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

model = Sequential([
 LSTM(64, return_sequences=True, input_shape=(60, 10)),
 LSTM(32),
 Dense(1) # Prediksi harga下一个 hari
])
```

#### 4. Analisis Berita — DeepSeek-V3 atau Claude

```python
# Bisa pakai 9Router combo untuk akses berbagai LLM
# Prompt engineering untuk extract:
# - Sentiment score (-1 to +1)
# - Key entities (perusahaan, orang)
# - Impact level (high/medium/low)
# - Investment thesis (bullish/bearish/neutral)
```

---

## Arsitektur Sistem Lengkap

```
┌─────────────────────────────────────────────────────────────────┐
│ DATA SOURCES │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ yfinance │ │ IDX API │ │ News API │ │ Twitter │ │
│ │ (OHLCV) │ │ (Saham) │ │ (Tempo) │ │ (Sentimen)│ │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│ │ │ │ │ │
│ └─────────────┴──────┬──────┴─────────────┘ │
│ ▼ │
│ ┌───────────────┐ │
│ │ DATA LAKE │ │
│ │ PostgreSQL │ │
│ │ (Time-series)│ │
│ └───────┬───────┘ │
│ │ │
│ ┌────────────────────┼────────────────────┐ │
│ ▼ ▼ ▼ │
│ ┌─────────┐ ┌────────────┐ ┌─────────┐ │
│ │ NUMERIC │ │ TEXT │ │MACRO │ │
│ │ LAYER │ │ LAYER │ │ LAYER │ │
│ │ │ │ │ │ │ │
│ │ OHLCV │ │ Berita │ │ IHSG │ │
│ │ Indikator│ │ Laporan │ │ Suku │ │
│ │ Volume │ │ Tweet │ │ bunga │ │
│ └────┬────┘ └─────┬──────┘ └────┬────┘ │
│ │ │ │ │
│ ▼ ▼ │ │
│ ┌────────────┐ ┌────────────┐ │ │
│ │ XGBoost │ │ FinBERT / │ │ │
│ │ Signal │ │ DeepSeek │ │ │
│ │ Generator │ │ Sentiment │ │ │
│ └─────┬─────┘ └──────┬─────┘ │ │
│ │ │ │ │
│ └────────────┬─────┘ │ │
│ ▼ │ │
│ ┌───────────────┐ │ │
│ │ FEATURE STORE │◄────────────────┘ │
│ │ (gabungan) │ │
│ └───────┬───────┘ │
│ ▼ │
│ ┌─────────────────┐ │
│ │ META-LEARNER │ │
│ │ (XGBoost) │ │
│ │ Final Decision │ │
│ └────────┬────────┘ │
│ ▼ │
│ ┌─────────────────┐ │
│ │ OUTPUT LAYER │ │
│ │ BUY / HOLD / │ │
│ │ SELL + CONF │ │
│ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer Detail

### Layer 1: Data Ingestion

```python
# data_ingestion.py
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

class StockDataIngestion:
 """Ambil data dari berbagai sumber"""
 
 def get_ohlcv(self, ticker: str, period: str = "1y") -> pd.DataFrame:
 """Ambil data OHLCV dari Yahoo Finance"""
 stock = yf.Ticker(ticker)
 df = stock.history(period=period)
 
 # Hitung technical indicators
 df['RSI'] = self._calc_rsi(df['Close'])
 df['MACD'] = self._calc_macd(df['Close'])
 df['BB_upper'], df['BB_lower'] = self._calc_bollinger(df['Close'])
 df['Returns'] = df['Close'].pct_change()
 df['Volume_Ratio'] = df['Volume'] / df['Volume'].rolling(20).mean()
 
 return df.dropna()
 
 def get_news(self, ticker: str, days: int = 7) -> list:
 """Ambil berita dari News API"""
 # Implementasi dengan NewsAPI / GDELT
 # Return list of {title, content, date, source}
 pass
 
 def _calc_rsi(self, prices, period: int = 14) -> pd.Series:
 delta = prices.diff()
 gain = (delta.where(delta > 0, 0)).rolling(period).mean()
 loss = (-delta.where(delta dict:
 """Return: {sentiment, score, confidence}"""
 inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
 outputs = self.model(**inputs)
 probs = torch.softmax(outputs.logits, dim=-1)
 
 labels = ['positive', 'negative', 'neutral']
 sentiment = labels[torch.argmax(probs)]
 confidence = torch.max(probs).item()
 
 return {
 'sentiment': sentiment,
 'confidence': confidence,
 'scores': {l: probs[0][i].item() for i, l in enumerate(labels)}
 }

class LLMAnalyzer:
 """Analisis teks keuangan menggunakan LLM via 9Router"""
 
 SYSTEM_PROMPT = """Kamu adalah analis keuangan profesional.
 Analisis teks berita/siaran pers berikut dan return JSON:
 {
 "sentiment_score": -1.0 sampai 1.0,
 "sentiment_label": "bullish|bearish|neutral",
 "key_entities": ["perusahaan", "tokoh"],
 "impact_level": "high|medium|low",
 "investment_thesis": "penjelasan singkat 1-2 kalimat"
 }
 Hanya return JSON, tidak ada penjelasan lain."""
 
 def __init__(self, api_base="http://localhost:20128"):
 self.api_base = api_base
 
 def analyze(self, text: str, model: str = "deepseek/deepseek-chat-v3-0324") -> dict:
 """Ambil dari 9Router API"""
 # Implementation via OpenAI-compatible API
 pass
```

### Layer 2b: Technical Signal (XGBoost)

```python
# technical_signals.py
import xgboost as xgb
import numpy as np
import pandas as pd

class TechnicalSignalGenerator:
 """Generate buy/sell/hold signal dari data teknis"""
 
 def __init__(self):
 self.model = xgb.XGBClassifier(
 n_estimators=200,
 max_depth=6,
 learning_rate=0.05,
 subsample=0.8,
 colsample_bytree=0.8,
 objective='multi:softmax',
 num_class=3, # 0=SELL, 1=HOLD, 2=BUY
 )
 
 def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
 """Siapkan feature matrix"""
 features = pd.DataFrame()
 
 # Price features
 features['return_1d'] = df['Close'].pct_change(1)
 features['return_5d'] = df['Close'].pct_change(5)
 features['return_20d'] = df['Close'].pct_change(20)
 
 # Technical indicators
 features['RSI'] = df['RSI'] / 100
 features['MACD'] = df['MACD']
 features['BB_position'] = (df['Close'] - df['BB_lower']) / (df['BB_upper'] - df['BB_lower'])
 features['Volume_Ratio'] = df['Volume_Ratio']
 
 # Momentum
 features['momentum_5'] = df['Close'] / df['Close'].shift(5) - 1
 features['momentum_20'] = df['Close'] / df['Close'].shift(20) - 1
 
 # Volatility
 features['volatility_20'] = df['Returns'].rolling(20).std()
 
 return features.dropna()
 
 def create_labels(self, df: pd.DataFrame, horizon: int = 5) -> pd.Series:
 """Buat label: BUY jika harga naik >2% dalam horizon hari"""
 future_return = df['Close'].shift(-horizon) / df['Close'] - 1
 
 labels = pd.Series(1, index=future_return.index) # HOLD default
 labels[future_return > 0.02] = 2 # BUY
 labels[future_return dict:
 X = self.prepare_features(df.iloc[-1:])
 proba = self.model.predict_proba(X)[0]
 signal = self.model.predict(X)[0]
 
 labels = {0: 'SELL', 1: 'HOLD', 2: 'BUY'}
 return {
 'signal': labels[signal],
 'confidence': float(max(proba)),
 'proba': {labels[i]: float(p) for i, p in enumerate(proba)}
 }
```

### Layer 3: Meta-Learner (Final Decision)

```python
# meta_learner.py
import xgboost as xgb
import pandas as pd

class StockMetaLearner:
 """
 XGBoost meta-learner yang menggabungkan:
 1. Technical signal score
 2. Sentiment score (FinBERT/LLM)
 3. Macro signal
 """
 
 def __init__(self):
 self.model = xgb.XGBClassifier(
 n_estimators=100,
 max_depth=4,
 learning_rate=0.03,
 objective='multi:softprob',
 num_class=3,
 )
 
 def prepare_meta_features(self, 
 technical_score: float,
 sentiment_score: float,
 macro_score: float,
 momentum: float,
 volatility: float) -> pd.DataFrame:
 """Gabungkan semua feature dari layer sebelumnya"""
 return pd.DataFrame([{
 'technical': technical_score, # -1 to 1
 'sentiment': sentiment_score, # -1 to 1
 'macro': macro_score, # -1 to 1
 'momentum': momentum, # returns
 'volatility': volatility, # std
 'tech_x_sent': technical_score * sentiment_score,
 'consensus': (technical_score + sentiment_score + macro_score) / 3,
 'dispersion': abs(technical_score - sentiment_score),
 }])
 
 def predict(self, meta_features: pd.DataFrame) -> dict:
 proba = self.model.predict_proba(meta_features)[0]
 signal = self.model.predict(meta_features)[0]
 
 labels = {0: 'SELL', 1: 'HOLD', 2: 'BUY'}
 confidence = max(proba)
 
 # Interpretasi
 if confidence > 0.7:
 action = labels[signal]
 else:
 action = 'HOLD'
 
 return {
 'action': action,
 'confidence': float(confidence),
 'proba': {labels[i]: float(p) for i, p in enumerate(proba)},
 'reasoning': self._build_reasoning(meta_features.iloc[0], action)
 }
 
 def _build_reasoning(self, features: pd.Series, action: str) -> str:
 reasons = []
 if features['technical'] > 0.3:
 reasons.append("technical indicators bullish")
 elif features['technical'] 0.3:
 reasons.append("sentiment positif dari berita")
 elif features['sentiment'] dict:
 # 1. Ambil data harga
 price_df = self.data.get_ohlcv(self.ticker, period="1y")
 
 # 2. Technical signal
 self.tech.train(price_df[:-30]) # exclude last 30d for validation
 tech_result = self.tech.predict(price_df)
 
 # Convert technical signal to score (-1 to 1)
 signal_map = {'SELL': -1, 'HOLD': 0, 'BUY': 1}
 tech_score = signal_map[tech_result['signal']] * tech_result['confidence']
 
 # 3. Ambil berita & analisis sentimen
 news = self.data.get_news(self.ticker, days=7)
 sentiment_scores = []
 
 for article in news:
 # FinBERT untuk quick analysis
 fb_result = self.finbert.analyze(article['title'])
 fb_score = (fb_result['scores']['positive'] - 
 fb_result['scores']['negative'])
 sentiment_scores.append(fb_score)
 
 # Rata-rata sentimen 7 hari
 sentiment_score = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
 
 # 4. Meta-learner decision
 recent = price_df.tail(20)
 momentum = float(recent['Close'].pct_change(20).iloc[-1])
 volatility = float(recent['Returns'].rolling(20).std().iloc[-1])
 macro_score = 0.1 # placeholder - bisa di-expand dengan IHSG, Suku bunga
 
 meta_features = self.meta.prepare_meta_features(
 technical_score=tech_score,
 sentiment_score=sentiment_score,
 macro_score=macro_score,
 momentum=momentum,
 volatility=volatility
 )
 
 final = self.meta.predict(meta_features)
 
 return {
 'ticker': self.ticker,
 'timestamp': datetime.now().isoformat(),
 'price': float(price_df['Close'].iloc[-1]),
 'technical': tech_result,
 'sentiment': {
 'score': sentiment_score,
 'articles_analyzed': len(news),
 'method': 'FinBERT + LLM ensemble'
 },
 'final_recommendation': final,
 'metadata': {
 'momentum': momentum,
 'volatility': volatility,
 'RSI': float(price_df['RSI'].iloc[-1]),
 }
 }
```

---

## Setup di VM (Implementasi Praktis)

### 1. Struktur Project

```
~/projects/stock-analyzer/
├── data_ingestion.py
├── technical_signals.py
├── sentiment_analysis.py
├── meta_learner.py
├── stock_analyzer.py
├── config.py
├── requirements.txt
└── run_analysis.py
```

### 2. Requirements

```txt
# requirements.txt
# Data
yfinance>=0.2.36
pandas>=2.0.0
numpy>=1.24.0

# ML
xgboost>=2.0.0
scikit-learn>=1.3.0
tensorflow>=2.15.0 # atau tensorflow-cpu untuk hemat RAM

# NLP
transformers>=4.38.0
torch>=2.2.0 # CPU-only untuk hemat resource

# API
requests>=2.31.0
```

### 3. Cron Job untuk Auto-Run

```bash
# Jalankan setiap hari jam 17:00 (setelah pasar tutup)
0 17 * * 1-5 cd ~/projects/stock-analyzer && python run_analysis.py >> ~/.logs/stock-analysis.log 2>&1
```

### 4. VM Recommendation

Berdasarkan infrastruktur kamu:

| Component | VM | Resource |
|---|---|---|
| Data ingestion + API | VM 105 (1.9 GB) | Cukup untuk cron job ringan |
| FinBERT inference | VM 105 atau Hermes | ~500 MB RAM untuk model |
| LLM via 9Router | Cloud | Tidak perlu RAM lokal |
| Database | VM 105 MySQL | Sudah tersedia |

> ⚠️ **Catatan:** Jangan jalankan model ML berat di VM 105 (RAM terbatas). Gunakan Hermes (3.8 GB) atau VM lain untuk training. Inference FinBERT ringan bisa di VM 105.

---

## Kesimpulan: Pilihan Model Terbaik

Untuk **sederhana tapi powerful**:

| Layer | Pilihan Utama | Alternatif |
|---|---|---|
| **Sentimen** | **FinBERT** (lokal, cepat, gratis) | DeepSeek-V3 via 9Router |
| **Teknis** | **XGBoost** (tabular data terbaik) | LightGBM |
| **Prediksi Harga** | **LSTM** (proven untuk time series) | Prophet (forecasting) |
| **LLM Enhancement** | **DeepSeek-V3** via 9Router (murah) | Claude (akurat) |
| **Decision** | **XGBoost meta-learner** | Logistic Regression |

Pipeline paling simpel: **FinBERT → XGBoost → Output** sudah cukup untuk analisis harian yang actionable. Upgrade ke full ensemble (LLM + LSTM + Meta-Learner) ketika sudah ada cukup data historis.

---

*Ditulis: 07 Mei 2026*
