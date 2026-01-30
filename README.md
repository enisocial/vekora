# 🍕 DeliverShop - Boutique en Ligne

Une boutique en ligne complète avec interface client et panel d'administration sécurisé, construite avec Node.js, Express et Supabase.

## ✨ Fonctionnalités

### 🛒 Interface Client
- Catalogue de produits avec filtrage par catégories
- Fiche produit détaillée avec galerie image/vidéo
- Panier d'achat avec gestion des quantités
- Commande avec formulaire client (nom, téléphone, adresse)
- Contact WhatsApp intégré
- Interface mobile-first responsive

### 🛠 Panel Admin
- Authentification sécurisée via Supabase Auth
- Tableau de bord avec statistiques
- Gestion complète des produits (CRUD)
- Gestion des catégories (CRUD)
- Gestion des commandes (visualisation et confirmation)
- Interface moderne et intuitive

### 🔒 Sécurité
- Authentification JWT pour les admins
- Row Level Security (RLS) Supabase activée
- Validation des données côté serveur
- Rate limiting et protection CORS

## 🛠 Stack Technique

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Stockage média**: Supabase Storage
- **Sécurité**: Helmet, CORS, Rate Limiting

## 📁 Structure du Projet

```
delivershop/
├── sql/
│   └── schema.sql              # Schéma de base de données
├── frontend/
│   ├── client/                  # Interface client
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   └── admin/                   # Panel d'administration
│       ├── index.html
│       ├── admin-styles.css
│       └── admin-script.js
├── backend/
│   ├── config/
│   │   └── supabase.js          # Configuration Supabase
│   ├── controllers/             # Logique métier
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js              # Middleware d'authentification
│   ├── routes/                  # Routes API
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── orders.js
│   ├── server.js                # Point d'entrée serveur
│   └── package.json
├── .env.example                 # Variables d'environnement
└── README.md
```

## 🚀 Installation & Configuration

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet
```bash
git clone <repository-url>
cd delivershop
```

### 2. Configuration Supabase

#### Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL du projet et les clés API

#### Configurer la base de données
1. Dans le panel Supabase, aller dans "SQL Editor"
2. Copier le contenu de `sql/schema.sql`
3. Exécuter le script pour créer les tables et politiques RLS

#### Créer un admin
1. Dans "Authentication" > "Users"
2. Ajouter un utilisateur admin
3. Noter l'email et le mot de passe

#### Configurer le stockage
1. Dans "Storage", créer un bucket "products-media"
2. Rendre le bucket public

### 3. Configuration du Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` à la racine du projet :
```env
# Supabase Configuration
SUPABASE_URL=votre_supabase_project_url
SUPABASE_ANON_KEY=votre_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_supabase_service_role_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Lancement de l'application

#### Option 1: Script automatique (recommandé)
```bash
./start.sh
```

#### Option 2: Lancement manuel
```bash
cd backend
npm start
```

L'application complète sera accessible sur :
- **Site client**: http://localhost:3000
- **Panel admin**: http://localhost:3000/admin

### 5. Première connexion admin

1. Aller sur http://localhost:3000/admin
2. Utiliser l'email et mot de passe créés dans Supabase Auth
3. Commencer à ajouter des produits et catégories

## 📡 API Endpoints

### Produits
- `GET /api/products` - Liste des produits (public)
- `GET /api/products/:id` - Détail d'un produit (public)
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Catégories
- `GET /api/categories` - Liste des catégories (public)
- `GET /api/categories/:id` - Détail d'une catégorie (public)
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Commandes
- `POST /api/orders` - Créer une commande (public)
- `GET /api/orders` - Liste des commandes (admin)
- `GET /api/orders/:id` - Détail d'une commande (admin)
- `PUT /api/orders/:id/status` - Modifier le statut (admin)

## 🔐 Authentification

### Admin
- Connexion via Supabase Auth
- Utiliser l'email et mot de passe défini dans Supabase
- Le JWT token est automatiquement géré pour les requêtes API

### Client
- Aucune authentification requise (commandes anonymes)
- Les données sensibles ne sont pas stockées côté client

## 📱 Utilisation

### Interface Client
1. Parcourir le catalogue de produits
2. Filtrer par catégories
3. Voir les détails des produits
4. Ajouter au panier
5. Finaliser la commande avec informations client
6. Contacter via WhatsApp

### Panel Admin
1. Se connecter avec les identifiants admin
2. Consulter le tableau de bord
3. Gérer les produits et catégories
4. Traiter les commandes (confirmer, voir détails)

## 🔒 Sécurité

- **RLS Supabase**: Politiques de sécurité au niveau base de données
- **JWT Tokens**: Authentification stateless pour les admins
- **Validation**: Données validées côté serveur avec express-validator
- **Rate Limiting**: Protection contre les abus
- **CORS**: Contrôle des origines autorisées
- **Helmet**: Headers de sécurité HTTP

## 🚀 Déploiement

### Backend
```bash
# Build et déploiement
npm run build  # si applicable
npm start
```

### Frontend
Les fichiers HTML/CSS/JS peuvent être servis par n'importe quel serveur web statique.

### Variables d'environnement production
```env
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
PORT=3000
```

## 🐛 Dépannage

### Problèmes courants

**Erreur de connexion Supabase**
- Vérifier les clés API dans `.env`
- S'assurer que l'URL Supabase est correcte

**Erreur d'authentification admin**
- Vérifier que l'utilisateur existe dans Supabase Auth
- Vérifier que l'utilisateur est dans la table `admins`

**Produits ne s'affichent pas**
- Vérifier que les politiques RLS sont activées
- Vérifier les permissions de stockage pour les images

**Commandes ne se créent pas**
- Vérifier la validation des données
- Vérifier les relations entre tables

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom** - [Votre GitHub](https://github.com/votreprofil)

---

⭐ Si ce projet vous plaît, n'hésitez pas à mettre une étoile !