# 🚀 Guide de Déploiement Vercel - Vekora

## Prérequis
- Compte Vercel
- Projet Supabase configuré
- Code pushé sur GitHub

## 1. Déploiement du Backend

### Étapes :
1. Connecter le dossier `backend/` à Vercel
2. Configurer les variables d'environnement dans Vercel :
   ```
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_ANON_KEY=votre_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=votre_supabase_service_role_key
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://votre-frontend.vercel.app
   ```
3. Déployer

### URL Backend : `https://vekora-backend.vercel.app`

## 2. Déploiement du Frontend

### Étapes :
1. Connecter le dossier `react-frontend/` à Vercel
2. Configurer les variables d'environnement :
   ```
   VITE_API_URL=https://vekora-backend.vercel.app
   ```
3. Déployer

### URL Frontend : `https://vekora.vercel.app`

## 3. Configuration Supabase

### Mettre à jour les URLs autorisées dans Supabase :
1. Aller dans Authentication > URL Configuration
2. Ajouter les domaines Vercel :
   - `https://vekora.vercel.app`
   - `https://vekora-backend.vercel.app`

## 4. Test de Production

### Vérifier :
- ✅ Frontend accessible
- ✅ API backend fonctionnelle
- ✅ Authentification admin
- ✅ Base de données connectée
- ✅ Upload d'images
- ✅ WhatsApp intégration

## 5. Domaine Personnalisé (Optionnel)

### Pour utiliser votre propre domaine :
1. Dans Vercel, aller dans Settings > Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions Vercel
4. Mettre à jour les variables CORS dans le backend

## 🔧 Commandes Utiles

```bash
# Build local pour tester
cd react-frontend && npm run build

# Preview du build
npm run preview

# Vérifier les variables d'environnement
vercel env ls
```

## 📝 Notes Importantes

- Le backend et frontend doivent être déployés séparément
- Vérifier que toutes les variables d'environnement sont configurées
- Tester l'authentification admin après déploiement
- S'assurer que Supabase autorise les nouvelles URLs