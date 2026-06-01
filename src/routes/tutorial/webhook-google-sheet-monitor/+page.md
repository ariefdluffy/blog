---
title: "Monitor Google Sheet via Webhook"
description: "Monitor perubahan Google Sheet real-time via webhook tanpa polling."
tags: [tutorial]
---

# Monitor Google Sheet Real-time via Webhook

Panduan setup monitoring perubahan Google Sheet secara real-time menggunakan webhook — tanpa polling, respons instan.

---

## Konsep

Alih-alih polling Sheet setiap X detik (boros quota & lambat), gunakan **webhook push notification** dari Google. Saat ada perubahan di Sheet, Google langsung mengirim notifikasi ke URL webhook kita.

---

## Arsitektur

```
Google Sheet → Push Notification → Webhook URL → Telegram Bot → User
```

---

## Langkah 1: Setup Webhook Receiver

Siapkan endpoint yang bisa menerima POST request dari Google. Bisa pakai:
- Nginx reverse proxy ke Python/Node
- Cloudflare Workers
- Ngrok (untuk development)

Contoh endpoint: `https://webhook.lockbit.my.id/webhook/`

---

## Langkah 2: Google Sheet Setup

### Ambil Sheet ID

Dari URL Google Sheet:
```
https://docs.google.com/spreadsheets/d//edit
```

### Setup Webhook Subscription

Gunakan Google Sheets API `spreadsheets.developerMetadata` atau Google Apps Script:

```javascript
// Google Apps Script
function onEdit(e) {
 var sheet = e.source.getActiveSheet();
 var range = e.range;
 var data = {
 sheet: sheet.getName(),
 cell: range.getA1Notation(),
 value: e.value,
 timestamp: new Date().toISOString()
 };

 UrlFetchApp.fetch('https://webhook.lockbit.my.id/webhook/', {
 method: 'post',
 contentType: 'application/json',
 payload: JSON.stringify(data)
 });
}
```

---

## Langkah 3: Webhook Handler (Python)

```python
from flask import Flask, request
import requests

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = "your_bot_token"
TELEGRAM_CHAT_ID = "your_chat_id"

@app.route('/webhook/', methods=['POST'])
def handle_sheet_change(token):
 data = request.json

 message = f"""
📊 **Google Sheet Updated**

📋 Sheet: {data['sheet']}
📍 Cell: {data['cell']}
✏️ Value: {data['value']}
⏰ Time: {data['timestamp']}
"""

 url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
 requests.post(url, json={
 'chat_id': TELEGRAM_CHAT_ID,
 'text': message,
 'parse_mode': 'Markdown'
 })

 return 'OK', 200

if __name__ == '__main__':
 app.run(host='0.0.0.0', port=5000)
```

---

## Langkah 4: Deploy Webhook

```bash
# Dengan Gunicorn
pip install gunicorn flask requests
gunicorn -w 2 -b 0.0.0.0:5000 webhook:app
```

Atau via PM2:

```bash
pm2 start webhook.py --interpreter python3 --name sheet-monitor
```

---

## Langkah 5: Testing

1. Edit cell di Google Sheet
2. Dalam 1-2 detik, notifikasi muncul di Telegram
3. Cek log webhook untuk memastikan request masuk

---

## Kelebihan vs Polling

| | Webhook | Polling |
|---|---|---|
| Latensi | 1-2 detik | 30-60 detik |
| API Quota | Hemat | Boros |
| Server Load | Nol (event-driven) | Konstan |
| Setup | Lebih kompleks | Lebih simple |

---

## Troubleshooting

**Webhook tidak menerima notifikasi?**
- Pastikan URL webhook bisa diakses publik (bukan localhost)
- Cek SSL certificate (HTTPS wajib untuk Google push)
- Test manual dengan `curl -X POST `

**Telegram tidak mengirim pesan?**
- Cek bot token valid
- Pastikan bot sudah ditambahkan ke grup/chat target
- Cek rate limit Telegram (30 msg/second)
