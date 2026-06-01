#!/bin/bash
set -e

echo "=== Deploying Hermes Blog ==="
cd /var/www/hermes-blog

echo "1. Pulling latest..."
git pull

echo "2. Installing dependencies..."
bun install

echo "3. Building..."
bun run build

echo "4. Restarting PM2..."
pm2 restart hermes-blog

echo "=== Done! ==="
pm2 status hermes-blog
