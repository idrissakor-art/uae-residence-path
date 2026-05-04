## Objectif

1. Retirer/corriger toutes les promesses « visa en 48h » (faux) et les remplacer par un message honnête : éligibilité immédiate, réponse des autorités ~48h, délai d'obtention du visa selon délais légaux (~1 semaine).
2. Brancher un vrai pipeline de réception côté admin : quand un client finit upload + paiement, on (a) écrit tout en base, (b) notifie l'équipe par email avec un récap + lien vers le dossier consolidé, (c) le dossier est consultable depuis `/admin/cases/:id` avec tous les documents téléchargeables au même endroit.

---

## Partie 1 — Corriger les délais (« 48h »)

Occurrences identifiées et nouvelle formulation proposée :

| Fichier | Texte actuel | Nouvelle valeur |
|---|---|---|
| `src/locales/{en,fr,ar,ru}.json` → `features.process.steps.s4.desc` | « Recevez votre visa sous 48h » | « Réponse des autorités ~48h, visa délivré sous ~1 semaine » |
| `…application.payment.guaranteedProcessing` | « Traitement sous 48h garanties » | « Traitement de votre dossier sous 48h » (= notre traitement, pas le visa) |
| `…application.confirmation.description` | « …traité sous 48h. » | « Votre dossier est en cours de traitement. Réponse des autorités sous ~48h, délivrance du visa selon délais légaux (~1 semaine). » |
| `…meta.title` | « …Golden Visa en 48h » | « …Golden Visa — Éligibilité immédiate » |
| `…hero.subtitle` & `index.html` meta description | mention « 48h » d'obtention | reformulé « Éligibilité en 2 minutes. Décision des autorités sous ~48h. » |
| `testimonials.c1.text` | « obtenu en moins de 48h » | « traité avec une réactivité exemplaire » (témoignage, pas un engagement chiffré) |
| `src/components/Hero.tsx` ligne 139 (compteur animé `48h`) | « 48h » comme stat « Processing time » | remplacer par « 2 min » avec libellé « Réponse d'éligibilité » — ou retirer la carte si le sens devient ambigu |
| `index.html` JSON-LD (si une mention apparaît dans description du Service) | à scanner et ajuster | aligner sur la nouvelle formulation |

Mise à jour des 4 locales (EN, FR, AR, RU) en cohérence.

---

## Partie 2 — Pipeline de réception client → admin

État actuel constaté :
- `TypeformStyleSimulator.tsx` insère bien dans `visa_cases` (OK).
- `Application.tsx` (upload + paiement) n'écrit **rien** en base : pas de `case_documents`, pas de `payments`, pas d'email — c'est un simple `toast` puis `navigate('/')`. Donc aujourd'hui vous ne recevez rien.
- Tables existantes utilisables telles quelles : `visa_cases`, `case_documents`, `payments`, `email_notifications`, `case_status_history`.
- Aucun bucket Storage ni edge function n'existe encore.

### Ce qu'on va construire

**a) Storage**
- Créer un bucket privé `case-documents` (RLS : seuls admins + propriétaire du case peuvent lire).
- Upload réel des fichiers depuis `Application.tsx` → chemin `case-documents/{case_id}/{document_type}-{filename}`.
- Insert d'une ligne `case_documents` par fichier uploadé.

**b) Lier l'upload au case existant**
- Le simulateur crée déjà un `visa_cases.id`. On le passe à `/application` via `navigate('/application', { state: { caseId } })` ou query param, puis `Application.tsx` l'utilise pour rattacher documents + paiement.

**c) Paiement**
- Pour l'instant pas de Stripe configuré. Deux options à choisir avec vous (hors plan) ; par défaut on enregistre une ligne `payments` avec `status='pending'` au clic « Payer », et on passera à Stripe dans une étape suivante. Le statut du `visa_case` passe à `paiement_en_attente` puis `nouveau_dossier_complet` quand le paiement sera confirmé.

**d) Notification admin (le cœur de votre demande)**
- Edge function `notify-new-case` (Supabase) déclenchée par le front une fois `Application.tsx` terminé (documents uploadés + paiement enregistré).
- Elle envoie un email à votre adresse équipe (ex. `team@uae-visaservices.com` — à confirmer) via Lovable Emails / Resend, contenant :
  - n° de dossier, nom, email, téléphone, WhatsApp du client
  - type de visa, valeur du bien, hypothèque o/n, présence aux EAU
  - liste des documents reçus avec liens signés (URL Storage signées 7 jours)
  - lien direct vers `/admin/cases/{id}`
  - statut de paiement
- Insert dans `email_notifications` pour audit.
- L'edge function est aussi callable manuellement (« renvoyer la notif »).

**e) Dashboard admin enrichi**
- `/admin/cases/:id` (déjà présent) : s'assurer qu'il liste **tous** les documents du dossier avec bouton « Télécharger » + bouton « Télécharger tout en ZIP » pour transmettre facilement au service dédié.
- Badge « Nouveau » sur les dossiers `status = 'nouveau'` non encore consultés.
- Compteur en temps réel des nouveaux dossiers dans `AdminSidebar` (via Supabase Realtime sur `visa_cases`).

---

## Détails techniques

```text
Flow:
[Simulator] --insert visa_cases--> [DB]
     |
     v (caseId via router state)
[Application page]
   1. uploads fichiers -> Storage (bucket case-documents)
   2. inserts case_documents (1 par fichier)
   3. inserts payments (status=pending|succeeded)
   4. updates visa_cases.status = 'nouveau_dossier_complet'
   5. invokes edge function `notify-new-case`
        -> sends email to team
        -> inserts email_notifications row
        -> inserts case_status_history row
[Admin] reçoit email + voit le dossier dans /admin/cases/:id
```

Migrations SQL nécessaires :
- Création bucket Storage `case-documents` (privé) + policies (admin full, owner read).
- Ajouter `visa_cases.client_user_id uuid` si on veut lier à `auth.users` plus tard (optionnel pour cette étape).
- Ajouter une valeur de statut `'nouveau_dossier_complet'` (le champ est `text`, pas d'enum, donc pas de migration de type).

Edge functions :
- `notify-new-case` (Deno, utilise `RESEND_API_KEY` via Lovable Emails ou secret).

Front :
- `Application.tsx` : passer en composant connecté Supabase (uploads, inserts).
- Récupérer `caseId` depuis `location.state` ; si absent, rediriger vers le simulateur.
- `AdminSidebar` : abonnement Realtime + badge non-lu.
- `CaseDetail` : bouton ZIP (JSZip côté client à partir des URL signées).

Pré-requis à confirmer avec vous avant implémentation :
1. Email destinataire des notifications (une seule adresse ou plusieurs) ?
2. Activer Lovable Emails (recommandé) pour envoyer depuis votre domaine `uae-visaservices.com` ? Cela nécessite la vérification DNS du domaine email.
3. Pour le paiement, on enregistre seulement (status pending) en attendant l'intégration Stripe complète, OK ?

---

## Étapes d'implémentation (une fois validé)

1. Mettre à jour les 4 locales + `Hero.tsx` + `index.html` pour retirer « 48h ».
2. Créer bucket Storage `case-documents` + policies.
3. Câbler `Application.tsx` à Supabase (upload, inserts, statut).
4. Créer edge function `notify-new-case` + activer Lovable Emails.
5. Brancher l'appel à l'edge function en fin de flow Application.
6. Améliorer `CaseDetail` (téléchargement individuel + ZIP) et `AdminSidebar` (badge realtime).
7. Test end-to-end : simulateur → upload → paiement → email reçu → dossier visible dans /admin.
