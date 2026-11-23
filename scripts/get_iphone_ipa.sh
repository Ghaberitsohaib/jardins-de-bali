#!/usr/bin/env bash
# =========================================================================
# JARDINS DE BALI — 1-CLICK CLOUD iPhone (.ipa) + Android (.apk) BUILDER
# Uses GitHub Actions macOS Cloud Runner (no local Xcode needed!)
# =========================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "=== 1. Vérification connexion GitHub ==="
if ! gh auth status >/dev/null 2>&1; then
  echo "Connexion à votre compte GitHub (une page navigateur va s'ouvrir)..."
  gh auth login --web --git-protocol https
fi

echo "=== 2. Création / Push vers dépôt privé GitHub ==="
if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create jardins-de-bali-app --private --source=. --remote=origin --push
else
  git push -u origin main
fi

echo "=== 3. Lancement du build Cloud iOS (.ipa) + Android (.apk) ==="
sleep 4
RUN_ID=$(gh run list --workflow=build-mobile-apps.yml --limit 1 --json databaseId --jq '.[0].databaseId')
echo "Build lancé (Run ID: $RUN_ID). Suivi en direct..."
gh run watch "$RUN_ID" --exit-status

echo "=== 4. Téléchargement des fichiers sur votre Bureau ==="
OUT_DIR="$HOME/Desktop/JardinsDeBali_Apps"
mkdir -p "$OUT_DIR"
gh run download "$RUN_ID" --dir "$OUT_DIR"

echo ""
echo "✅ TERMINÉ ! Vos applications sont prêtes dans : $OUT_DIR"
ls -lh "$OUT_DIR"/*/* 2>/dev/null || ls -lh "$OUT_DIR"
open "$OUT_DIR"
