# Design Doc: Redesign Contact VIP Screen (Ultra-Luxury Dark Edition)

**Date:** 2026-11-20  
**Scope:** `lib/screens/contact_vip_screen.dart`, `lib/theme/imperial_theme.dart`  
**Status:** Pending User Approval  

---

## 1. Intent & The "Why"
The current Contact VIP screen exhibits clunky styling: harsh black input borders, unbalanced buttons, repetitive accessibility cards, and a floating bottom navigation bar that occludes the submission form. The user requested an ultra-luxury redesign matching the approved mockup (`media_1795195440479_43c1fa8f.jpg`), featuring a prestigious Deep Obsidian, Champagne Gold, and Alabaster Concierge layout inspired by Aman Resorts and Architectural Digest.

---

## 2. Goals, Non-Goals & Anti-Goals
* **Goals:**
  - Transform `ContactVipScreen` to the exact visual style of the approved photo:
    1. **Deep Obsidian Background (`#0B0E0A`)**: Full atmospheric immersion with subtle warm dark tones.
    2. **Header**: "Contact VIP & Plans CAD" in Playfair/Cinzel luxury typography, with "Bureau de Vente Menara" subtitle.
    3. **Action Row**: Two balanced pill buttons with fine champagne gold outline (`0.8px`) and gold icons: `[ WhatsApp VIP ]` & `[ Appel VIP Direct ]`.
    4. **Bureau de Vente Card**: Warm alabaster card with a `Private Concierge` badge, Menara address, phone & email, plus subtle location thumbnail.
    5. **Accès & Trajets**: Minimalist dark timeline (✈️ Aéroport Menara 5 min, 🌴 Jardins de la Ménara 3 min, etc.) with clean typography.
    6. **Formulaire "Votre Demande VIP"**: Modern luxury inputs with dark fill (`Color(0xFF141A13)`), rounded corners (`16px`), fine gold border, and gold focused border.
    7. **Call-to-Action**: Glowing champagne gold gradient button (`#E8CC95` to `#A58557`) reading **"CONFIRMER MA DEMANDE VIP"**.
    8. **Navigation Padding**: Ensure bottom scroll clearance (`bottom: 120px+`) so the floating navigation bar never covers inputs or buttons.
* **Non-Goals:**
  - Rewriting business logic or altering other tabs (`HomeScreen`, `ResidencesScreen`, `BusinessScreen`).
* **Anti-Goals:**
  - Breaking existing form submission to WhatsApp (`_submitLeadForm`), phone call launcher, or AI concierge subtabs.

---

## 3. Approaches Considered & Tradeoffs
1. **Light Minimalist Luxury (Ivory & Gold):** Discarded by user preference.
2. **Ultra-Luxury Dark Obsidian & Champagne Gold (Selected):** Matches the approved photo mockup with high contrast, prestige dark mode aesthetic, and refined luxury finish.

---

## 4. Implementation Details (For the Builder)
1. **`lib/screens/contact_vip_screen.dart`**:
   - Re-architect `_buildContactFormTab` into clean modular helper widgets:
     - `_buildActionPills()`: Dual gold-outlined buttons.
     - `_buildShowroomCard()`: Alabaster card with badge and contact details.
     - `_buildRouteTimeline()`: Minimalist transit highlights.
     - `_buildVipForm()`: Luxury input fields with custom `InputDecoration` and gold gradient submit button.
   - Adjust `ListView` padding to `EdgeInsets.fromLTRB(16, 16, 16, 140)` for comfortable clearance.
2. **Validation & Interaction**:
   - Maintain form validation on `_firstName`, `_lastName`, `_phone`, `_email`.
   - Maintain interactive launchers for WhatsApp and Phone.
