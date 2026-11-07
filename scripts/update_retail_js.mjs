import fs from 'fs';

let code = fs.readFileSync('src/retail-spaces.js', 'utf8');

// Update state object to include sortBy
code = code.replace(
  `  const state = {
    type: 'all',          // 'all', 'Retail', 'Offices', 'Duplex'
    minSurface: 40,
    maxSurface: 450,
    floor: 'all',         // 'all', 0, 0.5, 1, 2, 5
    wing: 'all',          // 'all', 'Wing A', 'Wing B'
    searchQuery: '',
    page: 1,
    perPage: 6
  };`,
  `  const state = {
    type: 'all',          // 'all', 'Retail', 'Offices', 'Duplex'
    minSurface: 40,
    maxSurface: 450,
    floor: 'all',         // 'all', 0, 0.5, 1, 2, 5
    wing: 'all',          // 'all', 'Wing A', 'Wing B'
    searchQuery: '',
    sortBy: 'default',
    page: 1,
    perPage: 6
  };`
);

// Update element selectors
code = code.replace(
  `  const gridContainer = document.getElementById('retailGrid');
  const resultsCounter = document.getElementById('resultsCounter');
  const resultsCounterMobile = document.getElementById('resultsCounterMobile');`,
  `  const gridContainer = document.getElementById('retailGrid');
  const resultsCount = document.getElementById('resultsCount');
  const resultsCounter = document.getElementById('resultsCounter');
  const resultsCounterMobile = document.getElementById('resultsCounterMobile');
  const sortSelect = document.getElementById('sortSelect');
  const retailSearch = document.getElementById('retailSearch');`
);

// Update getFilteredUnits
const oldGetFiltered = `  function getFilteredUnits() {
    return retailData.filter((u) => {
      // Type filter
      if (state.type !== 'all' && u.type !== state.type) {
        return false;
      }
      // Surface range
      if (u.surface < state.minSurface || u.surface > state.maxSurface) {
        return false;
      }
      // Floor filter
      if (state.floor !== 'all' && Number(state.floor) !== u.floor) {
        return false;
      }
      // Wing filter
      if (state.wing !== 'all' && u.wing !== state.wing) {
        return false;
      }
      return true;
    });
  }`;

const newGetFiltered = `  function getFilteredUnits() {
    let filtered = retailData.filter((u) => {
      // Search filter
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase().trim();
        const match = u.name.toLowerCase().includes(q) ||
                      u.id.toLowerCase().includes(q) ||
                      (u.title && u.title.toLowerCase().includes(q)) ||
                      (u.typeLabel && u.typeLabel.toLowerCase().includes(q)) ||
                      (u.wingLabel && u.wingLabel.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Type filter
      if (state.type !== 'all' && u.type !== state.type) {
        return false;
      }
      // Surface range
      if (u.surface < state.minSurface || u.surface > state.maxSurface) {
        return false;
      }
      // Floor filter
      if (state.floor !== 'all' && Number(state.floor) !== u.floor) {
        return false;
      }
      // Wing filter
      if (state.wing !== 'all' && u.wing !== state.wing) {
        return false;
      }
      return true;
    });

    // Sorting
    if (state.sortBy === 'surface-asc') {
      filtered.sort((a, b) => a.surface - b.surface);
    } else if (state.sortBy === 'surface-desc') {
      filtered.sort((a, b) => b.surface - a.surface);
    } else if (state.sortBy === 'floor-asc') {
      filtered.sort((a, b) => a.floor - b.floor);
    }

    return filtered;
  }`;

code = code.replace(oldGetFiltered, newGetFiltered);

// Update renderGrid counter and card template
const oldRenderCardBlock = `    // Update counter
    const countText = \`\${total} Espaces\`;
    const countFullText = \`\${total} Espaces disponibles\`;
    if (resultsCounter) resultsCounter.textContent = countText;
    if (resultsCounterMobile) resultsCounterMobile.textContent = countText;
    const resultsCounterDrawer = document.getElementById('resultsCounterDrawer');
    if (resultsCounterDrawer) resultsCounterDrawer.textContent = countFullText;
    const applyBtn = document.getElementById('applyMobileFilterBtn');
    if (applyBtn) {
      applyBtn.innerHTML = \`<span>Afficher les résultats (\${total})</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>\`;
    }

    const visibleItems = filtered.slice(0, state.page * state.perPage);

    if (visibleItems.length === 0) {
      gridContainer.innerHTML = \`
        <div class="col-span-2 py-20 text-center space-y-4">
          <p class="font-editorialOld text-3xl text-golden">Aucun espace ne correspond à vos critères</p>
          <p class="font-workSans text-pine-green/70 text-sm">Veuillez réinitialiser les filtres pour explorer l'ensemble de nos magasins et plateaux d'affaires.</p>
          <button id="noResultsReset" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-golden bg-golden text-sand uppercase text-xs tracking-widest hover:bg-pine-green transition mt-4">
            Réinitialiser les filtres
          </button>
        </div>
      \`;
      const noResBtn = document.getElementById('noResultsReset');
      if (noResBtn) {
        noResBtn.addEventListener('click', resetFilters);
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    gridContainer.innerHTML = visibleItems.map((u) => \`
      <div class="retail-card-item cursor-pointer border px-6 pt-7 pb-8 transition-all duration-300 hover:bg-white hover:shadow-xl max-lg:p-5 group relative bg-[#FAF7EF]" style="border-color: rgba(197, 168, 128, 0.28); border-radius: 14px;" data-unit-id="\${u.id}">
        <!-- Architectural Plan Image -->
        <div class="relative overflow-hidden bg-white rounded-lg p-5 flex items-center justify-center min-h-[220px] max-sm:min-h-[190px] border shadow-inner mb-5 max-lg:mb-4" style="border-color: rgba(197, 168, 128, 0.2);">
          <img
            alt="\${u.name} Plan Architectural"
            loading="eager"
            decoding="async"
            width="514"
            height="380"
            class="h-auto w-full max-w-none mix-blend-multiply object-contain transition duration-500 group-hover:scale-103"
            src="\${u.layoutImg}"
            onerror="this.onerror=null; this.src='/jardins_de_bali/plan_03_rez_de_chaussee.jpg';"
          />
          <!-- Badge Top Right: Availability Status only (Explicit positioning: Zero badge collisions) -->
          <div class="flex items-center gap-1.5 bg-[#FDFBEF]/95 backdrop-blur-md px-3 py-1 rounded-full border shadow-xs" style="position: absolute; top: 12px; right: 12px; z-index: 10; border-color: rgba(197, 168, 128, 0.5);">
            <span class="inline-block size-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span class="text-[0.6875rem] tracking-wider uppercase text-[#10150F] font-semibold">\${u.status}</span>
          </div>
        </div>

        <!-- Typography & Specs (Belgrade Arbor Luxury Standard) -->
        <div class="space-y-4">
          <!-- Top Row: Category Kicker & Surface Area -->
          <div class="flex items-center justify-between gap-3 border-b pb-2.5" style="border-color: rgba(197, 168, 128, 0.22);">
            <span class="font-workSans text-[0.6875rem] tracking-[0.18em] uppercase font-semibold text-[#A68150] truncate">
              \${u.typeLabel}
            </span>
            <span class="font-workSans text-[#10150F] font-bold text-lg md:text-xl tracking-tight shrink-0">
              \${u.surfaceFormatted}
            </span>
          </div>

          <!-- Unit Title (Full width: Zero collision with specs on mobile) -->
          <h3 class="font-editorialOld leading-[1.05] tracking-tight transition-colors duration-300 group-hover:text-[#10150F]" style="font-size: clamp(2rem, 3.6vw, 3.2rem); color: #A68150;">
            \${u.name}
          </h3>

          <!-- Details & Action Row -->
          <div class="flex items-end justify-between gap-4 pt-1">
            <div class="space-y-1 min-w-0 flex-1">
              <p class="font-workSans text-xs text-[#60735C] font-medium tracking-wide uppercase">
                \${u.floorLabel}
              </p>
              <p class="font-workSans text-xs tracking-wider uppercase font-semibold text-[#10150F]/80 truncate">
                \${u.wingLabel.split('(')[0]}
              </p>
            </div>

            <!-- Consulter CTA button (always visible & accessible) -->
            <span class="link text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-1.5 transition-all duration-300 group-hover:translate-x-1 shrink-0" style="color: #A68150;">
              <span>Consulter</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </div>
      </div>
    \`).join('');

    // Attach click events on cards
    document.querySelectorAll('.retail-card-item').forEach((card) => {
      card.addEventListener('click', () => {
        const uid = card.getAttribute('data-unit-id');
        openUnitModal(uid);
      });
    });

    // Smooth reveal for newly rendered cards (Always visible, zero invisible bugs)
    const cards = document.querySelectorAll('.retail-card-item');`;

const newRenderCardBlock = `    // Update counter
    const countText = \`\${total} \${total > 1 ? 'Espaces disponibles' : 'Espace disponible'}\`;
    const countShort = \`\${total} \${total > 1 ? 'Espaces' : 'Espace'}\`;
    if (resultsCount) resultsCount.textContent = countText;
    if (resultsCounter) resultsCounter.textContent = countShort;
    if (resultsCounterMobile) resultsCounterMobile.textContent = countShort;
    const resultsCounterDrawer = document.getElementById('resultsCounterDrawer');
    if (resultsCounterDrawer) resultsCounterDrawer.textContent = countText;
    const applyBtn = document.getElementById('applyMobileFilterBtn');
    if (applyBtn) {
      applyBtn.innerHTML = \`<span>Afficher les résultats (\${total})</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>\`;
    }

    const visibleItems = filtered.slice(0, state.page * state.perPage);

    if (visibleItems.length === 0) {
      gridContainer.innerHTML = \`
        <div class="col-span-2 py-20 text-center space-y-4">
          <p class="font-editorialOld text-3xl text-golden">Aucun espace ne correspond à vos critères</p>
          <p class="font-workSans text-pine-green/70 text-sm">Veuillez réinitialiser les filtres pour explorer l'ensemble de nos magasins et plateaux d'affaires.</p>
          <button id="noResultsReset" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-golden bg-golden text-sand uppercase text-xs tracking-widest hover:bg-pine-green transition mt-4">
            Réinitialiser les filtres
          </button>
        </div>
      \`;
      const noResBtn = document.getElementById('noResultsReset');
      if (noResBtn) {
        noResBtn.addEventListener('click', resetFilters);
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    gridContainer.innerHTML = visibleItems.map((u) => \`
      <div class="residence-card group cursor-pointer" data-unit-id="\${u.id}" role="button" tabindex="0">
        <!-- Top Preview (1:1 with residences Screen 2) -->
        <div class="card-top-preview">
          <img
            src="\${u.thumbImg || u.layoutImg}"
            alt="\${u.name}"
            class="card-preview-img"
            loading="eager"
            onerror="this.onerror=null; this.src='\${u.layoutImg}';"
          />
          <div class="card-badges">
            <span class="card-badge-icon" title="Exposition Lumineuse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </span>
            <span class="card-badge-icon" title="Parking Sous-sol inclus">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
            </span>
          </div>
        </div>

        <!-- Typography & Specs (1:1 with residences Screen 2) -->
        <div class="card-content">
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="card-apartment-id">\${u.name}</h3>
            <span class="font-editorialOld text-xl sm:text-2xl text-golden shrink-0">\${u.surfaceFormatted}</span>
          </div>
          <div class="card-details-row">
            <div class="card-specs-list">
              <span class="card-spec-item highlight">\${u.floorLabel.split('(')[0].trim()}</span>
              <span class="card-spec-item">\${u.typeLabel}</span>
              <span class="card-spec-item text-xs text-golden">\${u.wingLabel.split('(')[0].trim()}</span>
            </div>
            <div class="card-see-more">
              <span>Détails</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    \`).join('');

    // Attach click events on cards
    document.querySelectorAll('.residence-card').forEach((card) => {
      card.addEventListener('click', () => {
        const uid = card.getAttribute('data-unit-id');
        openUnitModal(uid);
      });
    });

    // Smooth reveal for newly rendered cards (Always visible, zero invisible bugs)
    const cards = document.querySelectorAll('.residence-card');`;

code = code.replace(oldRenderCardBlock, newRenderCardBlock);

// Add search and sort listeners
const searchAndSortListeners = `
  // Search & Sort Listeners (1:1 with Residences Screen 2)
  if (retailSearch) {
    retailSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderGrid();
    });
  }
`;

code = code.replace('// ==========================================\n  // 5. FILTER HANDLERS', searchAndSortListeners + '\n  // ==========================================\n  // 5. FILTER HANDLERS');

fs.writeFileSync('src/retail-spaces.js', code, 'utf8');
console.log('src/retail-spaces.js successfully updated with 1:1 residences card markup and search/sort');
