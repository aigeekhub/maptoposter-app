#!/bin/bash
# MapPoster Live Server Update Script
# Usage: ./deploy.sh

echo "=================================================="
echo "🔄 UPDATING MAPPOSTER STUDIO LIVE INSTANCE"
echo "=================================================="

# 1. Pull latest code changes
echo "Pulling latest changes from Git..."
git pull

# 2. Sync dependencies
if [ -f "uv.lock" ]; then
    echo "Syncing virtual environment (uv)..."
    uv sync --locked
else
    echo "Syncing virtual environment (pip)..."
    source .venv/bin/activate
    pip install -r requirements.txt
fi

# 3. Restart background process
echo "Restarting service daemon..."
if command -v pm2 &> /dev/null; then
    pm2 restart "postermap-server"
    echo "✓ PM2 server process restarted successfully."
elif systemctl is-active --quiet postermap; then
    sudo systemctl restart postermap
    echo "✓ Systemd service restarted successfully."
else
    echo "⚠️ Warning: No active server service found (PM2 or Systemd). Please restart dashboard/server.py manually."
fi

echo "=================================================="
echo "🚀 UPDATE DEPLOYED SUCCESSFULLY!"
echo "=================================================="
