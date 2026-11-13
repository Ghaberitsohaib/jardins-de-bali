# Design Spec — Statut de Disponibilité des Lots (`Disponible` / `Vendu` / `Optionné`)

**Date:** 2026-11-13  
**Scope:** Small change across `residences.html`, `ventes.html`, `src/residences.js`, `src/residences.css`, and a new dedicated status map `src/data/unit-statuses.json`.

---

## 1. Intent & Why

Afficher sur chaque carte et fiche détaillée des pages résidences (`residences.html` et `ventes.html`) le statut commercial réel de chaque lot tel qu'il figure dans la maquette 3D (`maquette3d.html` / Vertex), tout en permettant de mettre à jour n'importe quel lot en **1 ligne dans Git** après le lancement du site.

## 2. Goals, Non-Goals & Constraints

- **Goals:**
  - Synchroniser l'état initial des `230` appartements depuis `template.json` de Vertex (`162` `vendu`, `64` `disponible`, `4` `option` pour `APP 180, 182, 185, 221`) et initialiser `MAGASIN 1`–`4` à `disponible`.
  - Afficher un badge clair (`Disponible`, `Vendu`, `Optionné`) directement sur chaque carte (`.residence-card`), dans la fiche modale (`#apartmentModal`), et dans les résultats filtrables.
  - Ajouter un groupe de filtres **Disponibilité** (`Tous`, `Disponible`, `Vendu`, `Optionné`) dans la barre latérale des deux pages (`residences.html` et `ventes.html`).
  - Centraliser tous les statuts dans un fichier court (`234` lignes) facile à modifier depuis GitHub ou Git local.
- **Non-Goals:**
  - Ne pas modifier l'iframe 3D (`maquette3d.html`).
  - Ne pas écraser les surfaces, typologies ou finitions de `residences-data.json` par les anciennes données Vertex, ni importer de champs privés Vertex (`mailclient`, `telclient`, etc.).
  - Ne pas masquer les lots vendus par défaut : ils restent visibles dans le catalogue avec leur badge `Vendu` pour attester de la commercialisation avancée du projet.
- **Constraints:**
  - Respecter la charte Arbor (`#10150F` vert impérial, `#C5A880` champagne doré, `#FDFBEF` lin chaud), sans chevauchement avec `.card-plan-pill` ni `.card-badges` sur desktop et mobile (`375px`).

## 3. Approaches Considered

1. **Approche 1 (Retenue) — Fichier dédié `src/data/unit-statuses.json` (234 lignes `ID -> statut`) :**
   - Importé statiquement par `src/residences.js` et fusionné au runtime (`unitStatuses[unit.id] ?? 'disponible'`).
   - *Avantages :* Édition en 5 secondes directement sur GitHub/Git sans risquer d'abîmer les 10 630 lignes de `residences-data.json`; zéro latence réseau ou problème CORS au chargement.
   - *Compromis :* Nécessite un `git commit` + `push` après chaque nouvelle vente (conforme au workflow souhaité).
2. **Approche 2 — Champ `"status"` directement dans `src/data/residences-data.json` :**
   - Un seul fichier, mais trop volumineux (`10 630` lignes) pour des mises à jour fréquentes à la main sur Git.
3. **Approche 3 — Requête runtime vers Vertex (`template.json`) :**
   - Écartée car Vertex ne couvre pas `MAGASIN 1`–`4`, ajoute une dépendance réseau externe, et empêche la gestion directe via Git.

## 4. Implementation & UI Design

- **Data (`src/data/unit-statuses.json`):** Objet JSON ordonné (`MAGASIN 1..4`, `APP 1..230`) avec valeurs `"disponible"`, `"vendu"`, ou `"option"`.
- **Card UI (`src/residences.js`, `src/residences.css`):** Badge `.card-status-badge` (`is-disponible` / `is-vendu` / `is-option`) placé proprement en en-tête de `.card-content` (à côté ou juste sous `card-apartment-id`) ou sur l'image sans chevaucher les icônes existantes ; nuance visuelle sobre sur les cartes `vendu` tout en gardant la fiche lisible.
- **Modal & CTA (`residences.html`, `ventes.html`, `src/residences.js`):** Ligne `Disponibilité` dans `.modal-specs-table`, badge d'état près du titre `#modalLotId`, et libellé WhatsApp ajusté si le lot est `vendu` (ex. *"Demander une alternative disponible"* tout en gardant le plan consultable).
- **Sidebar Filters:** Nouveau groupe `Disponibilité` dans `.picker-sidebar` de `residences.html` et `ventes.html` avec compteurs dynamiques ou cohérents (`Tous`, `Disponible`, `Vendu`, `Optionné`), remis à zéro par `#resetFiltersBtn`.

## 5. Verification Plan

- Vérification automatique des compteurs (`162 Vendu`, `4 Optionné`, `68 Disponible` dont `64` Appartements + `4` Magasins).
- `npm run build` sans erreur ni avertissement critique.
- Inspection Playwright (Desktop `1440px` + Mobile `375px`) sur `residences.html` et `ventes.html` : badges visibles sur chaque carte, filtres fonctionnels, modal conforme, `0` erreur console et `0` débordement horizontal.
