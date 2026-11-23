# 🍏 GUIDE DE DÉPLOIEMENT & SOUMISSION APP STORE (iOS) : JARDINS DE BALI

Ce guide détaille toutes les étapes pour compiler, signer et publier l'application Flutter **Jardins de Bali Marrakech** sur **Apple App Store Connect**.

---

## 1. IDENTIFIANTS & CONFIGURATION DU PROJET

- **Nom officiel de l'application :** `Jardins de Bali`
- **Bundle Identifier :** `com.baytimmo.jardinsdebali`
- **Titre Foncier du projet :** TF 34 603/M (Marrakech Menara)
- **Version :** `1.0.0` (Build 1)
- **Langue principale :** Français (`fr`) / Multi-devises (`MAD` & `EUR`)
- **Catégorie App Store recommandée :**
  - Primaire : *Immobilier (Real Estate / Lifestyle)*
  - Secondaire : *Affaires / Finance (Business)*

---

## 2. CONFORMITÉ AUX GUIDELINES APPLE (APP STORE REVIEW)

L'application a été conçue pour valider à 100% les critères stricts d'Apple :

| Règle App Store | Implémentation dans l'App |
| :--- | :--- |
| **Guideline 4.2 (Minimum Functionality)** | L'application n'est pas une simple "web view". Elle offre des fonctionnalités natives riches : **Comparateur de lots côte à côte (jusqu'à 3 lots)**, **Système de Favoris persistants** avec `SharedPreferences`, **Simulateur de rentabilité locative dynamique (8% à 12%)**, **Calculateur légal VEFA (5 tranches)**, et **Assistant Concierge IA interactif**. |
| **Guideline 2.1 (Performance & Offline)** | L'application embarque ses données (`full_app_bundle.json`) et ses visuels localement : elle fonctionne **parfaitement en mode hors-ligne** (offline-first). |
| **Guideline 5.1.1 (Privacy)** | Aucun tracking invasif. Formulaire VIP envoyé directement via canal chiffré WhatsApp ou email à l'utilisateur. |
| **Chiffrement (Export Compliance)** | Déclaré dans `ios/Runner/Info.plist` : `<key>ITSAppUsesNonExemptEncryption</key><false/>` (évite les questionnaires d'exportation de cryptographie sur App Store Connect). |
| **Schémas d'URL sécurisés** | Déclarés dans `LSApplicationQueriesSchemes` : `tel`, `mailto`, `whatsapp`, `https`. |

---

## 3. COMMANDES DE COMPILATION iOS

### A. Pré-requis sur macOS :
1. Xcode installé avec les composants en ligne de commande :
   ```bash
   xcode-select --install
   ```
2. Installation des CocoaPods :
   ```bash
   cd ios && pod install && cd ..
   ```

### B. Générer le bundle de production (Archive .ipa) :
```bash
flutter clean
flutter pub get
flutter build ipa --release
```

Le fichier `.ipa` sera généré dans :
`build/ios/archive/Runner.xcarchive` / `build/ios/ipa/jardins_de_bali_app.ipa`

### C. Téléversement automatique via Transporter ou CLI :
```bash
xcrun altool --upload-app --type ios -f build/ios/ipa/jardins_de_bali_app.ipa -u "votre-apple-id@email.com" -p "mot-de-passe-specifique-application"
```
*(Ou ouvrez directement l'archive dans Xcode > Window > Organizer > Distribute App).*

---

## 4. FICHE PRODUIT APP STORE CONNECT (MÉTADONNÉES PRÊTES À L'EMPLOI)

### Nom de l'app :
> **Jardins de Bali — Marrakech**

### Sous-titre (30 caractères max) :
> **Immobilier & Résidences Menara**

### Mots-clés (Keywords) :
> `immobilier marrakech, baytimmo, appartements de luxe, penthouse marrakech, menara, vefa maroc, investissement rbnb, plans cad, visite 360`

### Description pour l'App Store :
```
Découvrez en avant-première l'art de vivre d'exception des Jardins de Bali Marrakech Menara (TF 34 603/M), une réalisation signature du promoteur BaytImmo et du cabinet d'architecture AMA.

Fonctionnalités exclusives de l'application :
• Catalogue interactif des 230 appartements (Studios, 1 BR, 2 BR, Penthouses d'exception avec terrasses panoramiques).
• Flagships commerciaux et plateaux de bureaux sur le Boulevard Menara M-16.
• Visionneuse de plans architecturaux 2D avec zoom haute précision.
• Visite immersive à 360° VR des 4 pièces témoins (Salon, Suite parentale, Cuisine américaine, Salle de bain marbre).
• Simulateur de rendement locatif saisonnier (8% à 12% net annuel) et échéancier officiel VEFA (Loi 107-12).
• Comparateur exclusif de lots et favoris sauvegardés.
• Concierge Privé intelligent 24/7 et mise en relation VIP directe avec nos conseillers.
```

---

© 2026 **BaytImmo Groupe Immobilier** — Tous droits réservés.

