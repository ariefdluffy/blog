---
title: "Automasi Backup ke Google Drive"
description: "Setup backup otomatis ke Google Drive menggunakan API v3 tanpa OAuth browser."
tags: [tutorial]
---

# Automasi Backup ke Google Drive

Panduan setup backup otomatis ke Google Drive menggunakan Google Drive API v3 — tanpa OAuth browser, cocok untuk server headless.

---

## Mengapa Bukan rclone?

rclone membutuhkan browser untuk OAuth flow, yang sulit di server tanpa GUI. Solusi alternatif: gunakan **Google Drive API** langsung via Python dengan **service account** atau **refresh token** yang sudah disiapkan sebelumnya.

---

## Langkah 1: Persiapan Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Aktifkan **Google Drive API**
4. Buat **OAuth 2.0 credentials** → **Desktop app**
5. Download file `credentials.json`

---

## Langkah 2: Install Dependencies

```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

---

## Langkah 3: Setup Script Upload

Buat script `gdrive_upload.py`:

```python
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials
import os

# Load credentials
creds = Credentials.from_authorized_user_file('token.json')
service = build('drive', 'v3', credentials=creds)

def upload_file(file_path, folder_id=None):
 file_metadata = {'name': os.path.basename(file_path)}
 if folder_id:
 file_metadata['parents'] = [folder_id]

 media = MediaFileUpload(file_path, resumable=True)
 file = service.files().create(
 body=file_metadata,
 media_body=media,
 fields='id, name, webViewLink'
 ).execute()
 print(f"Uploaded: {file['name']} → {file['webViewLink']}")
 return file

# Upload
upload_file('/path/to/backup.zip')
```

---

## Langkah 4: First-Time Auth (Sekali Saja)

Jalankan script di mesin yang punya browser:

```bash
python gdrive_upload.py
```

Akan muncul link OAuth → login Google → copy code. File `token.json` akan terbuat.

**Copy `token.json` dan `credentials.json` ke server.** Setelah ini, tidak perlu browser lagi.

---

## Langkah 5: Automasi dengan Cron

Buat script wrapper:

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/home/miftah/backups"
DATE=`(date +%Y-%m-%d)
BACKUP_FILE="backup-`DATE.tar.gz"

# Create backup
tar -czf "`BACKUP_DIR/`BACKUP_FILE" /home/miftah/wedding-invitation

# Upload to Google Drive
python3 /home/miftah/gdrive_upload.py "`BACKUP_DIR/`BACKUP_FILE"

# Cleanup local (keep last 7 days)
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +7 -delete
```

Tambahkan ke crontab:

```bash
# Backup setiap hari jam 03:00 WIB
0 3 * * * /home/miftah/backup.sh >> /home/miftah/backup.log 2>&1
```

---

## Langkah 6: Monitoring

Cek log backup:

```bash
tail -f /home/miftah/backup.log
```

Atau verifikasi langsung di Google Drive.

---

## Tips Keamanan

- **Jangan commit `token.json` atau `credentials.json` ke Git**
- Gunakan file permissions ketat: `chmod 600 token.json`
- Rotate credentials secara berkala
- Backup `token.json` di tempat aman (jika hilang, perlu auth ulang)
