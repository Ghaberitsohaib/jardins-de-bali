# Espace Client Acquéreur & Dashboard Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete luxury Acquéreur Client Portal and Promoter Admin Dashboard in Flutter with authentication, apartment assignment, payment status tracking, and offline persistence.

**Architecture:** Domain models for accounts and financial tracking are defined in `lib/models/user_account_model.dart`. Global business logic, persistence via `SharedPreferences`, and active session management live in `lib/state/app_state.dart`. Dedicated luxury UI screens handle authentication (`auth_screen.dart`), client portal (`client_portal_screen.dart`), and promoter management (`admin_dashboard_screen.dart`).

**Tech Stack:** Flutter 3.50+ (Dart 3.14), Google Fonts (Playfair Display & Plus Jakarta Sans), SharedPreferences, Flutter Animate.

**Spec:** `docs/superpowers/specs/2026-11-20-client-portal-admin-dashboard-design.md`

## Global Constraints
- Must adhere to Jardins de Bali luxury theme tokens (`ImperialColors.primary`, `accent`, `background`).
- Preserves Flutter Web compilation and interactive hot reload (`flutter build web --release`).
- Never overwrite or break public apartment browsing for anonymous visitors.
- Must include out-of-the-box demo credentials for instant local review.

## Review Focus
1. Password or session persistence across app refreshes without re-prompting.
2. Unassigned client viewing their portal before Admin assigns an apartment: must show an elegant "Dossier en cours d'attribution" state.
3. Over-payment calculation edge case: progress bar gracefully caps at 100% when total price is reached.
4. Admin adding a payment: client's financial profile recalculates remaining balance and active VEFA tranche immediately.
5. Role authorization: Client cannot access Admin routes or assign apartments to themselves.

---

### Task 1: User Account & Financial Domain Models

**Files:**
- Create: `lib/models/user_account_model.dart`
- Test: `test/models/user_account_model_test.dart`

**Interfaces:**
- Produces:
  - `class UserAccount`: `id`, `name`, `email`, `phone`, `role` (`UserRole.client` | `UserRole.admin`), `assignedLotId`.
  - `class PaymentRecord`: `id`, `date`, `amount`, `trancheLabel`, `status`, `receiptRef`.
  - `class ClientFinancialProfile`: `totalPrice`, `paidAmount`, `remainingAmount`, `payments`, `progressPercent`.
  - Serialization methods: `toJson()`, `fromJson()`.

- [ ] **Step 1: Write the failing unit tests for `UserAccount` and `ClientFinancialProfile`**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement domain models in `lib/models/user_account_model.dart`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 2: Authentication & Financial State Management in `AppState`

**Files:**
- Modify: `lib/state/app_state.dart`
- Test: `test/state/app_state_auth_test.dart`

**Interfaces:**
- Consumes: `UserAccount`, `ClientFinancialProfile`, `PaymentRecord` from Task 1.
- Produces:
  - `UserAccount? currentUser`
  - `bool get isLoggedIn`, `bool get isAdmin`
  - `Future<bool> login(String email, String password)`
  - `Future<bool> register({required String name, required String email, required String phone, required String password})`
  - `Future<void> logout()`
  - `Future<void> assignLotToClient(String userId, String lotId, double totalPrice)`
  - `Future<void> recordPayment(String userId, PaymentRecord payment)`
  - Default seed data: Client (`karim@client.ma` / `client123`) and Admin (`admin@bayt-immo.com` / `admin123`).

- [ ] **Step 1: Write tests for authentication and payment recording**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement auth and profile management methods in `lib/state/app_state.dart` with SharedPreferences serialization**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 3: Luxury Authentication Modal & Screen

**Files:**
- Create: `lib/screens/auth_screen.dart`
- Modify: `lib/main.dart` (Add header VIP Profile action button)

**Interfaces:**
- Consumes: `AppState.login`, `AppState.register`, `AppState.currentUser` from Task 2.
- Produces: `AuthSheet.show(BuildContext context, AppState appState)` and `AuthScreen`.

- [ ] **Step 1: Create `lib/screens/auth_screen.dart` with Tab switcher (Connexion / Inscription)**
- [ ] **Step 2: Add one-tap "Remplir avec Démo Client" and "Remplir avec Démo Admin" buttons for instant testing**
- [ ] **Step 3: Connect to `AppState.login` and `AppState.register` with validation feedback**
- [ ] **Step 4: Add top-bar Profile avatar button in `MainNavigationShell` to launch the sheet**

---

### Task 4: Espace Client Acquéreur Screen (`ClientPortalScreen`)

**Files:**
- Create: `lib/screens/client_portal_screen.dart`
- Modify: `lib/main.dart`

**Interfaces:**
- Consumes: `AppState.currentUser`, `AppState.allResidences` from Task 2.
- Produces: `ClientPortalScreen(appState: appState)`

- [ ] **Step 1: Implement "Mon Appartement" showcase card with photo, typography, floor, surface, and orientation**
- [ ] **Step 2: Implement "Bilan Financier & Crédit" section with champagne gold circular/linear progress bar**
- [ ] **Step 3: Implement "Échéancier VEFA" timeline with 4 official legal milestones (Réservation, Fondations, Gros Œuvre, Remise des Clés)**
- [ ] **Step 4: Implement "Reçus & Justificatifs" payment history list with dates and amounts**
- [ ] **Step 5: Add a quick "Contacter mon Conseiller Privé WhatsApp" 1-click action button**

---

### Task 5: Promoter Admin Dashboard (`AdminDashboardScreen`)

**Files:**
- Create: `lib/screens/admin_dashboard_screen.dart`
- Modify: `lib/main.dart`

**Interfaces:**
- Consumes: `AppState.assignLotToClient`, `AppState.recordPayment`, `AppState.allResidences` from Task 2.
- Produces: `AdminDashboardScreen(appState: appState)`

- [ ] **Step 1: Implement Admin KPIs header (Total Acquéreurs, Total Encaissé, Total Encours)**
- [ ] **Step 2: Implement Client list with search and financial progress indicators**
- [ ] **Step 3: Implement "Assigner un Appartement" dialog with lot search from the 230 residences**
- [ ] **Step 4: Implement "Enregistrer un Versement" modal with amount, date, and VEFA tranche selector**
- [ ] **Step 5: Verify real-time sync: updating a client in Admin immediately updates their Espace Acquéreur**

---

### Task 6: End-to-End Verification & Web Build

**Files:**
- Modify: `lib/main.dart` (wire navigation routing and logout callbacks)
- Build: `build/web/`

- [ ] **Step 1: Run `flutter analyze` across all new and modified files**
- [ ] **Step 2: Run `flutter build web --release` to ensure web assembly and tree-shaking succeed**
- [ ] **Step 3: Verify client login, admin assignment, and financial tracking workflow**
