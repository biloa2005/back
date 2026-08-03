# 🔐 Système d'Authentification Sécurisé & Gestion des Utilisateurs

Ce module fournit un système d'authentification robuste, moderne et hautement sécurisé pour l'application, développé avec **Node.js**, **Express**, **Prisma ORM**, et une architecture hybride **JWT / Cookies HTTP-Only**.

---

## 🚀 Fonctionnalités Clés Développées

### 1. Authentification & Gestion des Sessions
* **Connexion Multi-Identifiants :** Connexion fluide via le nom d'utilisateur (`username`) ou l'adresse e-mail (`email`).
* **Sécurité Anti-Brute Force :** Blocage automatique et temporaire du compte (pendant 15 minutes) après 5 tentatives de connexion infructueuses consécutives.
* **Traçabilité des Connexions (`LoginLog`) :** Historisation complète de chaque tentative de connexion (succès ou échec) incluant l'adresse IP et le `User-Agent` (navigateur/système).
* **Vérification d'Activité :** Interdiction stricte de connexion pour les comptes marqués comme désactivés (`isActive: false`).

### 2. Stratégie de Jetons Hybride (Sécurité Maximale)
* **Access Token (JWT) :** Expirations courtes (15 minutes) stockées en mémoire vive (RAM) côté Frontend pour limiter l'exposition aux failles.
* **Refresh Token (Cookie HTTP-Only) :** Token de longue durée (7 jours) stocké dans un cookie sécurisé, invisible et inaccessible pour le JavaScript (immunité totale contre les attaques XSS).
* **Auto-Nettoyage :** Suppression asynchrone automatique en arrière-plan des jetons expirés en base de données à chaque nouvelle connexion réussie.

### 3. Gestion Avancée du Mot de Passe
* **Hachage Haute Sécurité :** Utilisation de l'algorithme **Argon2**, vainqueur de la Password Hashing Competition, pour le chiffrement des mots de passe.
* **Changement de Mot de Passe Sécurisé :** Exige l'ancien mot de passe, valide la conformité de la confirmation et interdit la réutilisation du mot de passe actuel.
* **Déconnexion Globale :** Le changement de mot de passe révoque instantanément tous les `Refresh Tokens` actifs en base de données, déconnectant ainsi tous les autres appareils de l'utilisateur.

### 4. Gestion des Utilisateurs (CRUD & RBAC)
* **Contrôle d'Accès basé sur les Rôles (RBAC) :** Protection des routes via les middlewares `verifyJwt` et `requireRole(['ADMIN'])`.
* **Endpoints Développés :**
  * `POST /api/users/register` : Inscription/Création d'un compte utilisateur.
  * `GET /api/users/` : Récupération de la liste complète des utilisateurs.
  * `GET /api/users/access/:id` : Récupération des détails d'un utilisateur par son identifiant unique.
  * `GET /api/users/show` : Récupération sécurisée du profil de l'utilisateur actuellement connecté (via son JWT).
  * `PATCH /api/users/update/:id` : Modification partielle et intelligente des données utilisateur.
  * `DELETE /api/users/delete/:id` : Suppression définitive d'un utilisateur.

---

## 🛠️ Technologies Utilisées

* **Runtime :** Node.js (Mode ESM moderne, extensions `.js` obligatoires)
* **Framework Web :** Express.js
* **Base de Données & ORM :** PostgreSQL / MySQL géré via Prisma ORM
* **Chiffrement :** Argon2
* **Sécurité & Jetons :** JsonWebToken (JWT) & Cookie-Parser
* **Documentation d'API :** Swagger / OpenAPI 3.0

---

## 🛡️ Bonnes Pratiques de Sécurité Implémentées

1. **Messages d'Erreur Génériques :** Utilisation de la mention *"Identifiants incorrects"* lors des échecs de connexion pour empêcher l'énumération des comptes existants par des attaquants.
2. **SameSite & Secure Cookies :** Les cookies de rafraîchissement intègrent les drapeaux `sameSite: "strict"` (protection CSRF) et `secure: true` (restreint au protocole HTTPS en environnement de production).
3. **Zéro Stockage Local :** Aucun jeton sensible n'est enregistré dans le `localStorage` ou le `sessionStorage` du navigateur.
