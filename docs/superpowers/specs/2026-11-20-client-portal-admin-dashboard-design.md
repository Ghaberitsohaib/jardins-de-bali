# Design Doc: Espace Client Acquéreur & Dashboard Admin (Option 1)

**Date:** 2026-11-20  
**Scope:** Client Authentication, Acquéreur Portal, Admin Management, State Persistence  
**Status:** Pending User Approval  

---

## 1. Intent & The "Why"
BaytImmo buyers need a private, secure VIP portal to track their property acquisition at Jardins de Bali Menara: assigned apartment details, floor plans, VEFA milestones, total price, payments made, and remaining credit balance. Concurrently, the BaytImmo sales team needs an Admin Dashboard to manage clients, link residences from the 230-lot catalog to buyers, and log incoming installments.

---

## 2. Goals, Non-Goals & Anti-Goals
* **Goals:**
  1. **Authentication Flow (`AuthSheet` / `AuthScreen`)**:
     - Modern luxury Login & Sign Up forms with email, password, full name, and phone.
     - Toggle between Client login and Admin login (`admin@bayt-immo.com`).
     - Session state tracked in `AppState` with persistence via `SharedPreferences`.
  2. **Espace Client Acquéreur (`ClientPortalScreen`)**:
     - **Mon Appartement**: Displays assigned lot (e.g. `APP 204`, 2 Chambres, Étage 2, Vue Piscine & Atlas), floor plan viewer, and technical specs.
     - **Bilan Financier & Crédit**:
       - Prix total de vente (ex: 1 850 000 DH).
       - Montant payé (ex: 740 000 DH / 40%) avec jauge de progression or champagne.
       - Reste à payer / Encours crédit (ex: 1 110 000 DH).
     - **Échéancier VEFA Interactif**:
       - Tranche 1: Réservation (20%) — *Payé ✅*
       - Tranche 2: Fondations & Sous-sol (20%) — *Payé ✅*
       - Tranche 3: Gros Œuvre & Toiture (30%) — *En cours ⏳*
       - Tranche 4: Finitions & Remise des Clés (30%) — *À venir 📅*
     - **Documents & Contrat**: Téléchargement direct du contrat de réservation et reçus de versement.
  3. **Dashboard Admin BaytImmo (`AdminDashboardScreen`)**:
     - **Vue d'ensemble**: Total acquéreurs, total encaissé, total encours.
     - **Gestion des Acquéreurs**:
       - Liste de tous les clients inscrits.
       - Fiche client avec action "Assigner un Appartement" (sélection dans le catalogue des 230 lots).
       - Action "Ajouter un Versement" (montant, date, mode de paiement, tranche VEFA).
       - Mise à jour instantanée du statut financier.
  4. **Access Points**:
     - A clean luxury profile/portal button in the top navigation bar (`HomeScreen` & `MainNavigationShell`).
     - Smooth transitions matching the established obsidian & champagne gold luxury design system.
* **Non-Goals:**
  - Connecting live credit card payment processing (payments are verified bank transfers / cheques logged by Admin).
* **Anti-Goals:**
  - Blocking unauthenticated users from browsing the public catalog of residences and general brochures.

---

## 3. Approaches Considered & Tradeoffs
* **Approach A (Cloud-First with Remote DB immediately):** Requires external API keys, internet connectivity during setup, and database provisioning before any UI can be tested.
* **Approach B (Selected — Option 1: Architecture Modulaire en 2 étapes):**
  - *Phase 1:* Build complete, interactive Flutter domain models, state management, and UI screens with local secure persistence (`SharedPreferences`). Immediate live testing in Brave.
  - *Phase 2:* Connect the modular `AuthService` and `ClientRepository` to Supabase/Firebase cloud database.

---

## 4. Implementation Details
* **Models (`lib/models/user_account_model.dart`)**:
  - `UserAccount`: `id`, `name`, `email`, `phone`, `role` (`client` | `admin`), `assignedLotId`.
  - `PaymentRecord`: `id`, `date`, `amount`, `trancheLabel`, `status`, `receiptRef`.
  - `ClientFinancialProfile`: `totalPrice`, `paidAmount`, `remainingAmount`, `payments`, `vefaProgress`.
* **State Management (`lib/state/app_state.dart`)**:
  - `currentUser`, `isLoggedIn`, `isAdmin`.
  - Methods: `login()`, `register()`, `logout()`, `assignLotToClient()`, `recordPayment()`.
  - Demo accounts seeded out-of-the-box for instant testing:
    - **Client Démo:** `karim@client.ma` (Appartement 204 assigné, 40% payé).
    - **Admin Démo:** `admin@bayt-immo.com` (Accès complet à la gestion).
* **Screens**:
  - `lib/screens/auth_screen.dart`: Luxury Sign In / Sign Up modal & screen.
  - `lib/screens/client_portal_screen.dart`: Espace Acquéreur VIP.
  - `lib/screens/admin_dashboard_screen.dart`: Espace Gestion Promoteur.
