# Cahier des Charges - Plateforme de Visa de Résidence UAE

## 1. Présentation du Projet

### 1.1 Objectif
Plateforme web permettant aux investisseurs immobiliers de déterminer leur éligibilité aux visas de résidence des Émirats Arabes Unis et de soumettre leur demande en ligne.

### 1.2 Public Cible
- Investisseurs immobiliers internationaux
- Propriétaires de biens immobiliers aux UAE
- Personnes souhaitant obtenir un visa de résidence via l'investissement immobilier

## 2. Types de Visas Gérés

### 2.1 Visa de Résidence (2 ans)
- **Montant requis** : 750,000 AED - 1,999,999 AED
- **Durée** : 2 ans renouvelable
- **Conditions** :
  - Propriété immobilière dans la valeur spécifiée
  - Possible crédit immobilier
  - NOC (No Objection Certificate) si propriété hypothéquée

### 2.2 Golden Visa (10 ans)
- **Montant requis** : 2,000,000 AED et plus
- **Durée** : 10 ans renouvelable
- **Conditions** :
  - Propriété immobilière de 2M AED minimum
  - Montant payé minimum si crédit immobilier
  - NOC si propriété hypothéquée

## 3. Fonctionnalités Principales

### 3.1 Simulateur d'Éligibilité (Typeform Style)
Formulaire interactif en 7 étapes :

1. **Valeur de la propriété**
   - Saisie du montant en AED
   - Affichage en temps réel du type de visa éligible
   - Indicateur visuel (vert = éligible, rouge = insuffisant)

2. **Type de propriété**
   - Au nom du demandeur
   - Au nom du conjoint
   - Au nom du demandeur ET conjoint

3. **Financement**
   - Propriété hypothéquée (oui/non)
   - Si oui : montant déjà payé
   - Vérification du NOC (certificat de non-objection)

4. **Présence aux UAE**
   - Actuellement présent aux UAE (oui/non)

5. **Documents requis**
   - Passeport valide
   - Assurance santé
   - Attestation médicale

6. **Parrainage familial**
   - Souhait de parrainer des membres de la famille

7. **Informations de contact**
   - Nom complet
   - Email
   - Numéro de téléphone (avec sélection du pays)
   - Numéro WhatsApp (optionnel)
   - Pays de résidence

### 3.2 Système Multilingue
- **Langues supportées** : Français, Anglais, Arabe
- **Détection automatique** :
  - Par IP géographique (UAE = Anglais par défaut)
  - Par langue du navigateur
  - Stockage de la préférence utilisateur

### 3.3 Résultats et Soumission
- Affichage du résultat d'éligibilité
- Récapitulatif des informations saisies
- Estimation du coût du service
- Soumission du dossier à l'équipe admin

## 4. Espace Administration

### 4.1 Authentification
- Connexion sécurisée pour les administrateurs
- Gestion des sessions
- Système de rôles (admin, agent)

### 4.2 Gestion des Dossiers (Cases)
- **Dashboard** : Vue d'ensemble des statistiques
- **Liste des dossiers** avec filtres :
  - Par statut (nouveau, en cours, documents requis, en révision, approuvé, rejeté)
  - Par type de visa
  - Par priorité
  - Par date de soumission

### 4.3 Détail d'un Dossier
- Informations client complètes
- Historique des changements de statut
- Gestion des documents :
  - Upload de documents
  - Vérification des documents
  - Téléchargement
- Notes internes
- Attribution à un agent
- Changement de statut avec raison
- Communication client

### 4.4 Gestion des Documents
- Stockage sécurisé (Supabase Storage)
- Types de documents :
  - Passeport
  - Titre de propriété
  - Preuve de paiement
  - NOC (si applicable)
  - Assurance santé
  - Attestation médicale
- Statut de vérification par document

### 4.5 Système de Paiements
- Intégration Stripe (prévu)
- Suivi des paiements
- Statuts : en attente, payé, remboursé, échoué
- Montants en AED

### 4.6 Notifications Email
- Notifications automatiques au client
- Modèles d'emails (templates)
- Historique des emails envoyés
- Statut d'envoi et erreurs

## 5. Base de Données

### 5.1 Tables Principales

#### visa_cases
- Informations du dossier client
- Type de visa, statut, priorité
- Données de la propriété
- Informations de contact
- Numéro de dossier automatique (UAE-YYYY-XXXXXX)
- Dates de soumission et mise à jour
- Notes publiques et internes
- Agent assigné

#### case_documents
- Documents liés à chaque dossier
- Type de document
- Chemin de stockage
- Informations de vérification
- Date d'upload
- Taille et type MIME

#### case_status_history
- Historique complet des changements de statut
- Ancien et nouveau statut
- Raison du changement
- Agent ayant effectué le changement
- Date et heure
- Notification client

#### payments
- Paiements liés aux dossiers
- Montant et devise (AED)
- Statut du paiement
- Méthode de paiement
- Stripe payment intent ID

#### email_notifications
- Emails envoyés
- Template utilisé
- Destinataire
- Statut d'envoi
- Date d'envoi
- Messages d'erreur éventuels

#### admin_users
- Administrateurs et agents
- Rôles (admin, agent)
- Informations de connexion
- Statut actif/inactif
- Dernière connexion

### 5.2 Sécurité
- Row Level Security (RLS) activé sur toutes les tables
- Politiques d'accès pour les administrateurs
- Stockage sécurisé des documents (bucket privé)
- Génération automatique des numéros de dossier
- Triggers pour l'historique automatique

## 6. Stack Technique

### 6.1 Frontend
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite
- **Routing** : React Router v6
- **UI Library** : shadcn/ui (Radix UI)
- **Styling** : Tailwind CSS
- **Internationalisation** : i18next, react-i18next
- **Forms** : React Hook Form avec Zod validation
- **State Management** : React Query (TanStack Query)
- **Icons** : Lucide React

### 6.2 Backend
- **Database** : PostgreSQL (Supabase)
- **Authentication** : Supabase Auth
- **Storage** : Supabase Storage
- **Edge Functions** : Supabase Edge Functions (prévu)
- **Paiements** : Stripe (prévu)

### 6.3 Hébergement
- **Frontend** : Lovable Platform
- **Backend** : Supabase (Projet ID: yinpfuvkvyohghpbtljp)
- **Storage** : Supabase Storage (bucket: case-documents)

## 7. Fonctionnalités à Développer

### 7.1 Phase Actuelle (Complétée)
- ✅ Simulateur d'éligibilité complet
- ✅ Système multilingue (FR/EN/AR)
- ✅ Affichage du type de visa éligible en temps réel
- ✅ Interface d'administration
- ✅ Gestion des dossiers
- ✅ Upload et gestion des documents
- ✅ Base de données complète avec RLS

### 7.2 Prochaines Étapes
- ⏳ Intégration Stripe pour les paiements
- ⏳ Système d'envoi d'emails automatiques
- ⏳ Edge functions pour la logique métier complexe
- ⏳ Notifications push/email aux clients
- ⏳ Export de rapports (PDF)
- ⏳ Tableau de bord avec statistiques avancées
- ⏳ Système de communication client-agent intégré

### 7.3 Améliorations Futures
- 📋 Application mobile (React Native)
- 📋 Suivi en temps réel du dossier par le client
- 📋 Calendrier de rendez-vous
- 📋 Intégration avec les autorités UAE
- 📋 Système de parrainage familial détaillé
- 📋 Multi-devises avec conversion automatique

## 8. Parcours Utilisateur

### 8.1 Client
1. Visite du site web
2. Navigation vers le simulateur
3. Remplissage du formulaire en 7 étapes
4. Visualisation de l'éligibilité en temps réel
5. Réception du résultat
6. Soumission du dossier
7. Réception d'un email de confirmation
8. Suivi du dossier (à venir)

### 8.2 Administrateur
1. Connexion à l'interface admin
2. Vue du dashboard avec les KPIs
3. Accès à la liste des dossiers
4. Filtrage et recherche
5. Ouverture d'un dossier spécifique
6. Vérification des documents
7. Ajout de notes
8. Changement de statut
9. Communication avec le client
10. Suivi du paiement

## 9. SEO et Performance

### 9.1 SEO
- Titres de page optimisés
- Meta descriptions
- Balises H1/H2 sémantiques
- Structure HTML sémantique
- URLs propres et descriptives
- Support multilingue avec hreflang

### 9.2 Performance
- Lazy loading des images
- Code splitting par route
- Optimisation des assets
- Mise en cache appropriée
- Responsive design mobile-first

## 10. Sécurité

### 10.1 Authentification
- Authentification admin sécurisée
- Gestion des sessions côté serveur
- Pas de stockage de credentials côté client

### 10.2 Données
- Validation des entrées client et serveur
- Protection contre les injections SQL
- RLS sur toutes les tables sensibles
- Stockage sécurisé des documents
- HTTPS obligatoire

### 10.3 Conformité
- RGPD (protection des données personnelles)
- Consentement pour le traitement des données
- Droit à l'oubli (à implémenter)
- Sécurité des données sensibles (passeports, etc.)

## 11. Support et Maintenance

### 11.1 Documentation
- Cahier des charges (ce document)
- Documentation technique du code
- Guide d'utilisation admin
- FAQ pour les clients

### 11.2 Monitoring
- Suivi des erreurs
- Analytics des conversions
- Performance monitoring
- Logs des actions admin

---

**Version** : 1.0  
**Dernière mise à jour** : 2025  
**Statut** : En développement actif
