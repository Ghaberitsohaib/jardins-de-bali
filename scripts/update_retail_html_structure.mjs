import fs from 'fs';

let html = fs.readFileSync('retail-spaces.html', 'utf8');

// 1. Add link to residences.css if not present
if (!html.includes('/src/residences.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="/src/arbor.css" />',
    '<link rel="stylesheet" href="/src/arbor.css" />\n  <link rel="stylesheet" href="/src/residences.css" />'
  );
}

// 2. Replace the #Picker section with the 1:1 residences-picker-section structure
const oldPickerStart = '<!-- ==========================================================================\r\n           2. INTERACTIVE PICKER & FILTER SECTION';
const oldPickerStartAlt = '<!-- ==========================================================================\n           2. INTERACTIVE PICKER & FILTER SECTION';

// Find start of section
let pickerSectionStart = html.indexOf('<section id="Picker"');
let pickerSectionEnd = html.indexOf('</section>', pickerSectionStart) + '</section>'.length;

const newPickerSection = `<section id="Picker" class="residences-picker-section">

        <!-- FLOATING MOBILE FILTER PILL (1:1 BELGRADE ARBOR LUXURY MOBILE UX) -->
        <div id="mobileFilterBar" class="mobile-filter-bar">
          <button id="mobileFilterTrigger" type="button" class="mobile-filter-pill-btn">
            <span>FILTRES</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#C8A366]">
              <path d="M10 12H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M3 12H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="1.8"></circle>
              <path d="M14 6H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M21 6H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <circle cx="16" cy="6" r="2" stroke="currentColor" stroke-width="1.8"></circle>
              <path d="M14 18H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M21 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <circle cx="16" cy="18" r="2" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
          </button>
        </div>

        <div class="picker-container">

          <!-- ========================================================
               DESKTOP MINIMALIST LUXURY FILTER SIDEBAR (LEFT COLUMN)
               ======================================================== -->
          <aside class="picker-sidebar max-lg:hidden">
            <!-- Header: Title + Reset -->
            <div class="filter-heading">
              <span>Filtres</span>
              <button type="button" id="resetFiltersBtn" class="filter-reset-btn" title="Réinitialiser tous les filtres">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>Reset</span>
              </button>
            </div>

            <!-- Group 0: Search input (1:1 with residences Screen 2) -->
            <div class="filter-group">
              <label for="retailSearch" class="filter-label">Rechercher un espace</label>
              <div class="filter-search-box">
                <svg class="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  type="text"
                  id="retailSearch"
                  class="filter-search-input"
                  placeholder="Ex: MAGASIN 1, Bureau 101, Flagship..."
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Group 1: Type d'espace -->
            <div class="filter-group">
              <span class="filter-label">Type d'espace</span>
              <div class="filter-pills">
                <button type="button" class="filter-pill is-active" data-filter-type="all">Tous</button>
                <button type="button" class="filter-pill" data-filter-type="Retail">Magasins Flagship</button>
                <button type="button" class="filter-pill" data-filter-type="Offices">Bureaux</button>
                <button type="button" class="filter-pill" data-filter-type="Duplex">Duplex Flagships (406 m²)</button>
              </div>
            </div>

            <!-- Group 2: Surface Maximale Slider -->
            <div class="filter-group">
              <div class="flex items-center justify-between">
                <span class="filter-label !mb-0">Surface Maximale</span>
                <span class="range-current-badge"><span id="surfaceMaxLabel">450</span> m²</span>
              </div>
              <div class="range-slider-wrapper">
                <div class="range-values">
                  <span>40 m²</span>
                  <span>450 m²</span>
                </div>
                <input
                  type="range"
                  id="surfaceSlider"
                  min="40"
                  max="450"
                  value="450"
                  step="5"
                  class="range-slider-input"
                />
              </div>
            </div>

            <!-- Group 3: Niveau / Étage -->
            <div class="filter-group">
              <span class="filter-label">Étage</span>
              <div class="filter-pills">
                <button type="button" class="filter-pill is-active" data-filter-floor="all">Tous</button>
                <button type="button" class="filter-pill" data-filter-floor="0">RDC</button>
                <button type="button" class="filter-pill" data-filter-floor="0.5">Mezzanine</button>
                <button type="button" class="filter-pill" data-filter-floor="1">1er Étage</button>
                <button type="button" class="filter-pill" data-filter-floor="2">2ème Étage</button>
                <button type="button" class="filter-pill" data-filter-floor="5">5ème (Terrasses)</button>
              </div>
              <!-- Hidden slider input for JS sync -->
              <input type="range" id="floorSlider" min="-1" max="5" step="1" value="-1" class="hidden" />
            </div>

            <!-- Group 4: Emplacement / Aile -->
            <div class="filter-group">
              <span class="filter-label">Emplacement / Aile</span>
              <div class="filter-pills">
                <button type="button" class="filter-pill is-active" data-filter-wing="all">Toutes les Ailes</button>
                <button type="button" class="filter-pill" data-filter-wing="Wing A">Wing A (Boulevard)</button>
                <button type="button" class="filter-pill" data-filter-wing="Wing B">Wing B (Avenue &amp; Patio)</button>
              </div>
            </div>
          </aside>

          <!-- ========================================================
               RESULTS LISTING (RIGHT COLUMN - 1:1 RESIDENCES SCREEN 2)
               ======================================================== -->
          <main class="picker-results-main">
            <!-- Control Header Bar (1:1 Belgrade Arbor Luxury Standard) -->
            <div class="results-header-bar">
              <span class="results-counter" id="resultsCount">12 Espaces</span>

              <div class="results-controls">
                <!-- Sort dropdown -->
                <select id="sortSelect" class="results-sort-select" aria-label="Trier par">
                  <option value="default">Tri par défaut</option>
                  <option value="surface-asc">Surface : Croissante</option>
                  <option value="surface-desc">Surface : Décroissante</option>
                  <option value="floor-asc">Étage : RDC vers R+5</option>
                </select>

                <!-- Grid view indicator -->
                <div class="view-mode-toggle" aria-label="Mode d'affichage">
                  <button type="button" id="gridViewBtn" class="view-mode-btn is-active" title="Vue Grille" aria-label="Vue Grille">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Cards Grid (1:1 Residences Grid) -->
            <div id="retailGrid" class="residences-cards-grid">
              <!-- Rendered dynamically by src/retail-spaces.js -->
            </div>

            <!-- SEE MORE BUTTON (LUXURY NOBLE MARRON EDITION) -->
            <div class="picker-load-more-wrap mt-10 flex justify-center" id="loadMoreWrapper">
              <button id="loadMoreBtn" type="button" class="load-more-luxury-btn menu shrink-0 min-w-65 gap-4 whitespace-nowrap outline-none flex cursor-pointer items-center justify-between rounded-full px-8 py-4 uppercase transition-all duration-300 max-md:w-full group text-xs tracking-widest font-semibold">
                <span class="tracking-[0.14em]">Afficher plus d'espaces</span>
                <div class="flex items-center justify-center size-8 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/50 text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-[#382417] transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-300">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
            </div>
          </main>

        </div>
      </section>`;

html = html.substring(0, pickerSectionStart) + newPickerSection + html.substring(pickerSectionEnd);

fs.writeFileSync('retail-spaces.html', html, 'utf8');
console.log('retail-spaces.html updated with 1:1 residences picker structure');
