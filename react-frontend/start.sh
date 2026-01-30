#!/bin/bash

echo "🚀 Démarrage d'ElectroShop React..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Démarrer le backend
echo "📡 Démarrage du backend sur le port 5000..."
cd ../backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    npm install
fi

# Démarrer le backend en arrière-plan
npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend React
echo "⚛️ Démarrage du frontend React sur le port 3001..."
cd ../react-frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances React..."
    npm install
fi

echo ""
echo "✅ Application prête !"
echo "🛒 Site client: http://localhost:3001"
echo "🔧 Panel admin: http://localhost:3001/admin"
echo "📡 API Backend: http://localhost:5000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"
echo ""

# Démarrer le serveur de développement React
npm run dev

# Nettoyer les processus à la sortie
trap "kill $BACKEND_PID" EXIT