# 🛒 ElectroShop React - E-commerce Électroménager

Site e-commerce complet en React + Vite pour la vente d'appareils électroménagers, avec panel d'administration intégré.

## 🚀 Lancement Rapide

### Prérequis
- Node.js (v16 ou supérieur)
- Backend DeliverShop configuré

### Installation et Démarrage
```bash
cd react-frontend
./start.sh
```

Le script lance automatiquement :
- **Backend API** sur http://localhost:5000
- **Frontend React** sur http://localhost:3001

## 🌐 URLs d'Accès

- **🛒 Site Client** : http://localhost:3001
- **🔧 Panel Admin** : http://localhost:3001/admin
- **📡 API Backend** : http://localhost:5000

## ✨ Fonctionnalités

### 🛒 Interface Client
- ✅ **Catalogue produits** avec filtres par catégories
- ✅ **Cartes produits modernes** avec images/vidéos
- ✅ **Panier d'achat** persistant (localStorage)
- ✅ **Formulaire de commande** complet
- ✅ **Design responsive** mobile-first
- ✅ **Palette couleur professionnelle**

### 🔧 Panel Admin
- ✅ **Authentification Supabase** sécurisée
- ✅ **Dashboard** avec statistiques
- ✅ **CRUD Produits** complet
- ✅ **Gestion des commandes** (voir, confirmer)
- ✅ **Interface moderne** et intuitive

## 🎨 Design & UX

### Palette Couleur
- **Bleu profond** : #0A2540 (primaire)
- **Orange énergie** : #F5A623 (secondaire)
- **Blanc** : #FFFFFF
- **Gris clair** : #F7F9FC

### Responsive Design
- Mobile-first approach
- Grilles adaptatives
- Navigation optimisée
- Breakpoints : 768px, 480px

## 🏗 Architecture Technique

### Structure du Projet
```
react-frontend/
├── src/
│   ├── api/
│   │   ├── api.js              # Service API central
│   │   └── supabase.js         # Configuration Supabase
│   ├── context/
│   │   └── CartContext.jsx     # Context React panier
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation
│   │   └── ProductCard.jsx     # Carte produit
│   ├── pages/
│   │   ├── Catalog.jsx         # Catalogue produits
│   │   └── Cart.jsx            # Panier & commande
│   ├── admin/
│   │   ├── AdminLogin.jsx      # Connexion admin
│   │   ├── Dashboard.jsx       # Tableau de bord
│   │   ├── Products.jsx        # Gestion produits
│   │   └── Orders.jsx          # Gestion commandes
│   ├── App.jsx                 # Composant principal
│   ├── main.jsx                # Point d'entrée
│   └── index.css               # Styles globaux
├── package.json
├── vite.config.js
└── start.sh
```

### Technologies Utilisées
- **React 18** - Interface utilisateur
- **Vite** - Build tool moderne
- **React Router DOM** - Navigation SPA
- **Context API** - Gestion d'état panier
- **Supabase** - Authentification admin
- **CSS3** - Styles modernes

## 🔧 Configuration

### Variables d'Environnement
Le projet utilise les configurations suivantes :
- **API Backend** : http://localhost:5000
- **Frontend** : http://localhost:3001
- **Supabase** : Configuré avec vos clés existantes

### Proxy API
Vite est configuré pour proxifier les requêtes `/api` vers le backend sur le port 5000.

## 📱 Utilisation

### Pour les Clients
1. **Parcourir** le catalogue d'électroménager
2. **Filtrer** par catégories
3. **Ajouter** des produits au panier
4. **Finaliser** la commande avec informations de livraison
5. **Confirmation** automatique

### Pour les Administrateurs
1. **Se connecter** avec identifiants Supabase
2. **Consulter** le dashboard avec statistiques
3. **Gérer** les produits (CRUD complet)
4. **Traiter** les commandes (voir détails, confirmer)

## 🔒 Sécurité

### Authentification Admin
- Connexion via Supabase Auth
- Vérification du rôle admin en base
- Tokens JWT automatiques
- Sessions sécurisées

### Validation des Données
- Validation côté client React
- Sanitisation des entrées
- Gestion d'erreurs robuste
- Protection contre les injections

## 🛠 Développement

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Vérification ESLint
```

### Structure des Composants
- **Composants fonctionnels** avec hooks
- **Context API** pour l'état global
- **Props drilling** évité
- **Séparation des responsabilités**

## 🚨 Dépannage

### Problèmes Courants

**Site ne se charge pas**
```bash
# Vérifier que le backend est démarré
curl http://localhost:5000/health

# Redémarrer les serveurs
./start.sh
```

**Erreur d'authentification admin**
- Vérifier les clés Supabase dans `src/api/supabase.js`
- S'assurer que l'utilisateur existe dans Supabase Auth
- Vérifier la table `admins` en base

**Panier ne se sauvegarde pas**
- Vérifier le localStorage du navigateur
- Ouvrir les DevTools > Application > Local Storage

**API non accessible**
- Vérifier que le backend tourne sur le port 5000
- Contrôler la configuration proxy dans `vite.config.js`

### Logs de Debug
```bash
# Console navigateur (F12)
# Onglet Network pour les requêtes API
# Onglet Application pour le localStorage
```

## 📈 Extensions Futures

### Fonctionnalités Prévues
- Upload d'images drag & drop
- Gestion des stocks
- Notifications push
- Système de reviews
- Paiement en ligne
- Tracking des commandes

### Optimisations
- Lazy loading des images
- Code splitting
- Service Worker
- Cache API
- SEO optimization

## 🤝 Contribution

### Standards de Code
- ESLint configuré
- Composants fonctionnels
- Hooks React modernes
- CSS modulaire
- Nommage cohérent

### Workflow Git
```bash
git checkout -b feature/nouvelle-fonctionnalite
git commit -m "feat: ajout nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

## 📞 Support

Pour toute question :
1. Vérifier cette documentation
2. Consulter les logs navigateur
3. Tester les endpoints API
4. Vérifier la configuration Supabase

---

**🎉 Votre site e-commerce React est prêt !**

Lancez `./start.sh` et visitez http://localhost:3001 pour découvrir votre boutique d'électroménager moderne.