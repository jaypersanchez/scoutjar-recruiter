#!/bin/bash

# Set up Node version if using nvm (optional)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Go to project
cd ~/projects/scoutjar/scoutjar-recruiter

# Pull latest code
git fetch origin
git reset --hard origin/mvp0.1

# Show current branch and commit
echo "🛠 Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "🔖 Commit: $(git rev-parse --short HEAD)"

# Install npm dependencies
npm install

# Kill anything using port 5173
fuser -k 5173/tcp || true

# Stop any existing process
pm2 delete scoutjar-recruiter-mvp0.1 || true

# Start the app with PM2, update environment
pm2 start npm --name "scoutjar-recruiter-mvp0.1" -- run dev --update-env

# Save the PM2 process list
pm2 save
