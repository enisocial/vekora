#!/bin/bash

echo "🚀 Déploiement Vekora Frontend"

# Build du projet
echo "📦 Construction du projet..."
cd react-frontend
npm run build

echo "✅ Build terminé"
echo "📁 Fichiers dans dist/:"
ls -la dist/

echo ""
echo "🌐 Pour déployer sur Vercel:"
echo "1. Aller sur https://vercel.com/new"
echo "2. Importer depuis GitHub: enisocial/vekora"
echo "3. Sélectionner le dossier 'react-frontend'"
echo "4. Ajouter la variable d'environnement:"
echo "   VITE_API_URL=https://vekora-b5w4.vercel.app/api"
echo "5. Déployer"