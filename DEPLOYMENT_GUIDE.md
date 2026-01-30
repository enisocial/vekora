# 🚀 Guide de Déploiement Vekora

## Problème Actuel
Le frontend sur Vercel redirige vers une page d'authentification au lieu d'afficher l'application.

## ✅ Solution 1: Nouveau Déploiement Vercel

1. **Supprimer l'ancien projet frontend sur Vercel**
2. **Créer un nouveau projet:**
   - Aller sur https://vercel.com/new
   - Importer depuis GitHub: `enisocial/vekora`
   - **IMPORTANT**: Sélectionner le dossier `react-frontend` comme Root Directory
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Ajouter la variable d'environnement:**
   ```
   VITE_API_URL=https://vekora-b5w4.vercel.app/api
   ```

4. **Déployer**

## ✅ Solution 2: Déploiement Netlify (Alternative)

1. **Aller sur https://netlify.com**
2. **Nouveau site depuis Git**
3. **Connecter GitHub: enisocial/vekora**
4. **Configuration:**
   - Base directory: `react-frontend`
   - Build command: `npm run build`
   - Publish directory: `react-frontend/dist`

5. **Variables d'environnement:**
   ```
   VITE_API_URL=https://vekora-b5w4.vercel.app/api
   ```

## 🔧 Test Local

```bash
cd react-frontend
npm run build
npm run preview
```

## 📱 URLs Actuelles

- **Backend API**: https://vekora-b5w4.vercel.app/api/products ✅
- **Frontend**: À redéployer

## 🎯 Résultat Attendu

Une fois déployé correctement, le site affichera:
- Hero section avec vidéo
- Catégories (Réfrigérateurs)
- Produits (2 réfrigérateurs ATL)
- Panier fonctionnel
- Interface admin