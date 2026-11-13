# Unit Availability Status (`Disponible` / `Vendu` / `Optionné`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display each property's commercial availability (`Disponible`, `Vendu`, `Optionné`) synced from the Vertex 3D model (`maquette3d.html`) on every card, modal, and filter in `residences.html` and `ventes.html`, backed by a minimal Git-editable JSON map.

**Architecture:** Store a single clean map of `234` unit IDs to `"disponible" | "vendu" | "option"` in `src/data/unit-statuses.json`. A pure ESM helper module `src/unitStatus.js` normalizes statuses, computes display metadata/CTAs, and aggregates live filter counts, while `src/residences.js`, `src/residences.css`, `residences.html`, and `ventes.html` render cards, sidebar availability filters, and modal badges uniformly.

**Tech Stack:** Vite 6 ESM, Vanilla JS, Tailwind/Arbor CSS, Node built-in `node:test` (`node >= 20`), Playwright (`playwright-core`).

**Spec:** `docs/superpowers/specs/2026-11-13-unit-availability-design.md`

---

## Global Constraints

- Color palette: Imperial Dark `#10150F`, Champagne Gold `#C5A880` (`var(--arbor-golden)`), Warm Lin `#FDFBEF` (`var(--arbor-cream)`), zero overlays colliding with `.card-plan-pill` or `.card-badges`.
- Full mobile responsiveness (`375px–430px`) and desktop (`1440px+`), zero horizontal overflow.
- All `230` residential units (`APP 1`–`APP 230`) match Vertex initial states (`162 vendu`, `64 disponible`, `4 option` on `APP 180, 182, 185, 221`) and `MAGASIN 1`–`4` default to `disponible`.
- Sold units remain visible in the catalog by default (not hidden), displaying a `Vendu` badge; no Vertex client PII fields imported.
- Preserve existing card finishing pills (points `2, 3, 7, 8, 13, 14, 17`) and all existing comments/features.

## Review Focus

- Unknown, uppercase, or missing keys in `unit-statuses.json` (e.g., someone manually writes `"VENDU"` or forgets a lot ID on GitHub): must normalize safely without breaking rendering or mislabeling sold units as errors.
- Vertex `undefined` (`52` lots) vs `"available"` (`12` lots) vs `"option"` (`4` lots): must map strictly to `"disponible"` (`64` appts + `4` magasins = `68`) and `"option"` (`4` appts).
- Sidebar count drift after future Git edits to `unit-statuses.json`: filter pill labels in both HTML pages must sync dynamically at runtime from `countByStatus(...)`.
- Sold (`vendu`) cards on `375px` mobile cards & `#apartmentModal`: status badge must wrap cleanly without pushing `APP <N>` or `m²` off-screen or clipping thumbnails.
- `?status=` URL query param and `#resetFiltersBtn`: clicking Reset must clear the availability filter back to `all` alongside category, floor, features, surface, and search.

---

### Task 1: Status Helper Module & Synced `unit-statuses.json`

**Files:**
- Create: `src/unitStatus.js`
- Create: `src/data/unit-statuses.json`
- Test: `tests/unit-statuses.test.mjs`

**Interfaces:**
- Produces in `src/unitStatus.js`:
  - `normalizeUnitStatus(rawStatus: unknown) -> 'disponible' | 'vendu' | 'option'`
  - `getUnitStatus(unitId: string, statusMap: Record<string, string>) -> 'disponible' | 'vendu' | 'option'`
  - `getStatusMeta(status: 'disponible' | 'vendu' | 'option') -> { key, label, pillText, pillClass, modalWaText, waMessageAction }`
  - `countByStatus(units: Array<{ status?: string }>) -> { all: number, disponible: number, vendu: number, option: number }`

- [ ] **Step 1: Write failing unit tests in `tests/unit-statuses.test.mjs`**

Tests verify `normalizeUnitStatus`, `getUnitStatus`, `getStatusMeta`, `countByStatus`, AND assert exact 1-to-1 coverage of all `234` units in `src/data/residences-data.json` matching Vertex synced totals (`68` disponible, `162` vendu, `4` option for `APP 180, 182, 185, 221`, and `MAGASIN 1`–`4` disponible).

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/unit-statuses.test.mjs`  
Expected: FAIL because `src/unitStatus.js` and `src/data/unit-statuses.json` do not exist yet.

- [ ] **Step 3: Implement `src/unitStatus.js` and generate `src/data/unit-statuses.json` from Vertex `template.json` + `src/data/residences-data.json`**

- Generate `src/data/unit-statuses.json` in canonical order (`MAGASIN 1`–`4`, `APP 1`–`230`) directly from `https://www.vertex-france.com/PACKAGE/KISMOGOOD/JARDINS_DE_BALI/data/template.json`, mapping `sold` -> `"vendu"`, `option` -> `"option"`, and `available`/missing -> `"disponible"`.
- Implement `normalizeUnitStatus`, `getUnitStatus`, `getStatusMeta`, and `countByStatus` cleanly using a lookup table in `src/unitStatus.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/unit-statuses.test.mjs`  
Expected: PASS (all tests green, `0` failures).

- [ ] **Step 5: Commit Task 1**

```bash
git add src/unitStatus.js src/data/unit-statuses.json tests/unit-statuses.test.mjs
git commit -m "feat(catalog): add unit-statuses map synced from 3D maquette and status helper"
```

---

### Task 2: Sidebar Filter & Modal Markup (`residences.html` & `ventes.html`)

**Files:**
- Modify: `residences.html` (sidebar `.picker-sidebar` + `#apartmentModal` header/table)
- Modify: `ventes.html` (sidebar `.picker-sidebar` + `#apartmentModal` header/table)

**Interfaces:**
- Consumes: `[data-filter-status]` values `'all' | 'disponible' | 'vendu' | 'option'`
- Produces DOM hooks: `[data-filter-status]`, `#modalStatusBadge`, `#modalStatus`

- [ ] **Step 1: Add `Disponibilité` filter pill group and modal status elements to `residences.html` and `ventes.html`**

- Insert a compact `Disponibilité` `.filter-group` right above `Typologie` in `.picker-sidebar` with buttons `data-filter-status="all|disponible|vendu|option"`.
- Add `<span id="modalStatusBadge" class="modal-status-badge"></span>` next to the modal eyebrow/heading, plus `<tr><td class="label">Disponibilité</td><td class="value" id="modalStatus">—</td></tr>` as the first spec row in `.modal-specs-table`.

- [ ] **Step 2: Run HTML parity & DOM hook check across both pages**

Run Node verification confirming identical filter buttons and `#modalStatus` / `#modalStatusBadge` IDs in both `residences.html` and `ventes.html`, and verify `npm run build` exits `0`.

- [ ] **Step 3: Commit Task 2 (bundled cleanly with Task 3 or standalone once verified)**

---

### Task 3: UI Integration, Filtering, Search & Styling (`src/residences.js` & `src/residences.css`)

**Files:**
- Modify: `src/residences.js`
- Modify: `src/residences.css`
- Test: Playwright end-to-end script (`desktop` `1440px` + `mobile` `375px` across `residences.html` and `ventes.html`)

**Interfaces:**
- Consumes `unitStatuses` from `./data/unit-statuses.json` and `getUnitStatus`, `getStatusMeta`, `countByStatus` from `./unitStatus.js`

- [ ] **Step 1: Attach `status` & `statusMeta` onto `residencesData` in `src/residences.js`**

- Populate `item.status` and `item.statusMeta` once at load.
- Add `availability: 'all'` to filter `state`, initialize from optional `?status=` URL param, dynamically update counts on `[data-filter-status]` buttons via `countByStatus(residencesData)`, wire click listeners + `#resetFiltersBtn`, filter inside `filterAndSortData()`, and append `item.statusMeta.label` into `searchable` text.
- Render `.card-status-pill` (`is-${item.status}`) on every card's `.card-top-preview` and add `is-${item.status}` class onto `.residence-card`.
- Update `openModal(unit)` to set `#modalStatusBadge`, `#modalStatus`, and `#modalWaLink` text/message dynamically per `statusMeta`.

- [ ] **Step 2: Add luxury Arbor styling in `src/residences.css`**

- Style `.card-status-pill` (bottom-left of `.card-top-preview`, frosted pill with colored dot: emerald/lin for `Disponible`, subtle warm slate/crimson dot for `Vendu`, champagne-amber for `Optionné`), gentle image dimming on `.residence-card.is-vendu .card-preview-img`, `.modal-status-badge`, `.modal-status-value`, and `@media (max-width: 640px)` checks.

- [ ] **Step 3: Run full test & verification suite**

1. `node --test tests/unit-statuses.test.mjs`
2. `npm run build` (must exit `0`)
3. Playwright browser verification on built `dist/` (`vite preview`):
   - Initial render shows `234 Résultats`, filter pills show `Tous (234)`, `Disponible (68)`, `Vendu (162)`, `Optionné (4)` on both `residences.html` and `ventes.html`
   - Clicking `Vendu (162)` renders `162 Résultats` (e.g. `APP 2` with `Vendu` badge); clicking `Optionné (4)` renders `APP 180, 182, 185, 221`; clicking `Disponible (68)` includes `APP 1, APP 3, MAGASIN 1..4`; clicking `Réinitialiser` restores `234 Résultats`
   - Opening modals for `APP 1` (`Disponible`), `APP 2` (`Vendu`), and `APP 180` (`Optionné`) updates `#modalStatusBadge`, `#modalStatus`, and `#modalWaLink`
   - `0` console/page errors and `0` horizontal overflow on `1440px` desktop and `375px` mobile; visually inspect captured screenshots
   - Verify no Vertex `mailclient`/`telclient`/`adresseclient` PII exists anywhere in codebase

- [ ] **Step 4: Commit cleanly**

```bash
git add residences.html ventes.html src/residences.js src/residences.css
git commit -m "feat(catalog): display Disponible/Vendu/Optionné status badges, modal info, and availability filter"
```
