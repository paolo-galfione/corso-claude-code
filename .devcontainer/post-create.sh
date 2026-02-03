#!/bin/bash
set -e

echo "=== Installazione Chromium per Marp/Puppeteer ==="

# Installa Chromium e dipendenze necessarie per headless
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    libxss1 \
    git-lfs

# Inizializza Git LFS
git lfs install

# Pulisci cache apt per ridurre dimensione immagine
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

echo "=== Installazione strumenti globali npm ==="

# Claude Code
npm install -g @anthropic-ai/claude-code

# Marp CLI per generazione slide
npm install -g @marp-team/marp-cli

# Mermaid CLI per diagrammi
npm install -g @mermaid-js/mermaid-cli

echo "=== Verifica installazioni ==="
echo "Chromium: $(chromium --version)"
echo "Marp CLI: $(marp --version)"
echo "Mermaid CLI: $(mmdc --version)"
echo "Git LFS: $(git lfs --version)"

echo "=== Setup completato ==="
