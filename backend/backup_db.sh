#!/bin/bash
# Backup Koperasi Mini SQLite DB
# Runs daily via cron

BACKUP_DIR="$HOME/koperasi_mini/backups"
DB_PATH="$HOME/koperasi_mini/backend/koperasi_mini.db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/koperasi_mini_$DATE.db"

# Create backup dir if not exists
mkdir -p "$BACKUP_DIR"

# Copy DB
cp "$DB_PATH" "$BACKUP_FILE"

# Keep only last 7 backups
ls -t "$BACKUP_DIR"/koperasi_mini_*.db | tail -n +8 | xargs -r rm

echo "[$(date)] Backup created: $BACKUP_FILE"
