import './arbor.css';
import './residences.css';
import rawResidencesData from './data/residences-data.json';
import { assetUrl } from './assetUrl.js';
import { initMotion, initScrollReveals, MOTION_CONFIG } from './motion.js';
import { bindFooterWeb3Form } from './web3forms.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const residencesData = rawResidencesData.map((unit) => ({
  ...unit,
  planImg: assetUrl(unit.planImg),
  emplacementImg: assetUrl(unit.emplacementImg),
  floorPlanImg: assetUrl(unit.floorPlanImg),
  thumbImg: assetUrl(unit.thumbImg),
  planSheet: assetUrl(unit.planSheet),
  gallery: Array.isArray(unit.gallery) ? unit.gallery.map(assetUrl) : unit.gallery,
}));

const RESIDENCE_CARD_FINITIONS = [
  'Portes bois chêne',
  'Placards sur mesure',
  'Grès cérame 60×120',
  'Chambres effet bois',
  'Cuisine semi-équipée',
  'Sanitaires Duravit / Vitra · Hansgrohe',
  'Clim. gainable par pièce',
];

function getResidenceFinitionsList(isDuplex) {
  return [
    {
      label: 'Portes intérieures',
      value: 'Bois finition chêne, poignées noires design contemporain',
    },
    {
      label: 'Placards',
      value: 'Placards intégrés sur mesure, finition chêne épurée',
    },
    {
      label: 'Sols principaux',
      value: isDuplex
        ? 'Grès cérame 60×120 cm mat beige clair (salon, circulations, SDB & escaliers)'
        : 'Grès cérame 60×120 cm mat beige clair (salon, circulations & SDB)',
    },
    {
      label: 'Sol chambres',
      value: 'Grès cérame effet bois naturel clair à joints fins',
    },
    {
      label: 'Cuisine semi-équipée',
      value: 'Façades mates brun foncé & bois clair, plan effet marbre clair, évier & mitigeur noir, éclairage LED intégré',
    },
    {
      label: 'Sanitaires',
      value: "Vasque & WC suspendus Duravit / Vitra (meuble bois, robinetterie noire), douche à l'italienne type pluie Hansgrohe / Vitra",
    },
    {
      label: 'Climatisation',
      value: 'Centralisée gainable avec réglage individuel dans chaque pièce',
    },
  ];
}

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED INERTIAL SMOOTH SCROLL (LENIS + GSAP)
  // ==========================================
  const lenis = initMotion({ pageName: 'residences' });

  // Soft reveals for static headers & catalog container
  initScrollReveals('#residencesHero, .residences-filters-bar, #architectureSection', {
    distance: MOTION_CONFIG.reveal.distance,
    duration: MOTION_CONFIG.reveal.duration,
    ease: MOTION_CONFIG.reveal.ease,
  });

  // ==========================================
  // 2. HEADER PILL & EXPANDABLE MENU (1:1 BELGRADE ARBOR)
  // ==========================================
  const arborHeader = document.getElementById('overlayHeader') || document.querySelector('.arbor-header');
  const arborMenuToggle = document.getElementById('mobileMenuToggle') || document.querySelector('.arbor-menu-btn');
  const arborMenuBackdrop = document.getElementById('arborMenuBackdrop');

  function openArborMenu() {
    if (!arborHeader) return;
    arborHeader.classList.add('is-open');
    if (arborMenuToggle) arborMenuToggle.setAttribute('aria-expanded', 'true');
    if (arborMenuBackdrop) arborMenuBackdrop.classList.add('is-visible');
    document.body.classList.add('arbor-menu-active');
  }

  function closeArborMenu() {
    if (!arborHeader) return;
    arborHeader.classList.remove('is-open');
    if (arborMenuToggle) arborMenuToggle.setAttribute('aria-expanded', 'false');
    if (arborMenuBackdrop) arborMenuBackdrop.classList.remove('is-visible');
    document.body.classList.remove('arbor-menu-active');
  }

  function toggleArborMenu() {
    if (!arborHeader) return;
    if (arborHeader.classList.contains('is-open')) {
      closeArborMenu();
    } else {
      openArborMenu();
    }
  }

  if (arborMenuToggle) {
    arborMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleArborMenu();
    });
  }

  if (arborMenuBackdrop) {
    arborMenuBackdrop.addEventListener('click', closeArborMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArborMenu();
      closeModal();
    }
  });

  document.addEventListener('click', (e) => {
    if (arborHeader && arborHeader.classList.contains('is-open')) {
      if (!arborHeader.contains(e.target)) {
        closeArborMenu();
      }
    }
  });

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          closeArborMenu();
          lenis.scrollTo(el, { offset: targetId === '#Picker' ? 0 : -30, duration: 1.2 });
        }
      }
    });
  });

  // ==========================================
  // 3. SILK CURSOR TRAIL CANVAS
  // ==========================================
  const cursorCanvas = document.getElementById('canvas');
  if (cursorCanvas && window.matchMedia('(min-width: 1024px)').matches) {
    const ctx = cursorCanvas.getContext('2d');
    if (ctx) {
      let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let lines = [];
      const config = { friction: 0.5, trails: 10, size: 10, dampening: 0.1, tension: 0.98 };

      function Node() {
        this.x = pointer.x;
        this.y = pointer.y;
        this.vy = 0;
        this.vx = 0;
      }

      function TrailLine(opt) {
        this.spring = opt.spring + Math.random() * 0.1 - 0.05;
        this.friction = config.friction + Math.random() * 0.01 - 0.005;
        this.nodes = [];
        for (let i = 0; i < config.size; i++) {
          const t = new Node();
          this.nodes.push(t);
        }
      }

      TrailLine.prototype = {
        update: function () {
          let e = this.spring;
          let t = this.nodes[0];
          t.vx += (pointer.x - t.x) * e;
          t.vy += (pointer.y - t.y) * e;
          for (let i = 0; i < this.nodes.length; i++) {
            t = this.nodes[i];
            if (i > 0) {
              const n = this.nodes[i - 1];
              t.vx += (n.x - t.x) * e;
              t.vy += (n.y - t.y) * e;
              t.vx += n.vx * config.dampening;
              t.vy += n.vy * config.dampening;
            }
            t.vx *= this.friction;
            t.vy *= this.friction;
            t.x += t.vx;
            t.y += t.vy;
            e *= config.tension;
          }
        },
        draw: function () {
          let prevX = this.nodes[0].x;
          let prevY = this.nodes[0].y;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          let n = 1;
          const r = this.nodes.length - 2;
          for (; n < r; n++) {
            const curr = this.nodes[n];
            const next = this.nodes[n + 1];
            prevX = 0.5 * (curr.x + next.x);
            prevY = 0.5 * (curr.y + next.y);
            ctx.quadraticCurveTo(curr.x, curr.y, prevX, prevY);
          }
          if (this.nodes[n] && this.nodes[n + 1]) {
            const curr = this.nodes[n];
            const next = this.nodes[n + 1];
            ctx.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
          }
          ctx.stroke();
          ctx.closePath();
        },
      };

      function resizeCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      let running = false;
      function renderTrail() {
        if (!running) return;
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(34, 35%, 48%, 0.22)';
        ctx.lineWidth = 1;
        for (let i = 0; i < lines.length; i++) {
          lines[i].update();
          lines[i].draw();
        }
        requestAnimationFrame(renderTrail);
      }

      function initTrail(e) {
        pointer.x = e.clientX || pointer.x;
        pointer.y = e.clientY || pointer.y;
        window.removeEventListener('mousemove', initTrail);
        lines = [];
        for (let i = 0; i < config.trails; i++) {
          lines.push(new TrailLine({ spring: 0.4 + (i / config.trails) * 0.025 }));
        }
        window.addEventListener('mousemove', (ev) => {
          pointer.x = ev.clientX;
          pointer.y = ev.clientY;
        }, { passive: true });
        running = true;
        renderTrail();
      }
      window.addEventListener('mousemove', initTrail);
    }
  }

  // ==========================================
  // 4. INTERACTIVE FILTERING & APARTMENT PICKER
  // ==========================================
  const state = {
    category: 'all',
    floor: 'all',
    maxSurface: 221,
    features: [],
    searchQuery: '',
    sortBy: 'default',
    viewMode: 'grid',
    pageLimit: 24,
  };

  // Sync optional URL query params (?category=Magasin&floor=0)
  const urlParams = new URLSearchParams(window.location.search);
  const rawCategoryParam = urlParams.get('category');
  if (rawCategoryParam) {
    const categoryAliases = {
      commerce: 'Magasin',
      magasin: 'Magasin',
      magasins: 'Magasin',
      duplex: 'Duplex',
      studio: '1 Chambre',
      '1 br': '1 Chambre',
      '1 chambre': '1 Chambre',
      '2 br': '2 Chambres',
      '2 chambres': '2 Chambres',
      '3+ br': '3 Chambres',
      '3 chambres': '3 Chambres',
    };
    const normalizedCat = categoryAliases[rawCategoryParam.toLowerCase()] || rawCategoryParam;
    const matchedCatBtn = Array.from(document.querySelectorAll('[data-filter-category]')).find(
      (b) => b.getAttribute('data-filter-category') === normalizedCat
    );
    if (matchedCatBtn) {
      state.category = normalizedCat;
      document.querySelectorAll('[data-filter-category]').forEach((b) => b.classList.remove('is-active'));
      matchedCatBtn.classList.add('is-active');
    }
  }
  const rawFloorParam = urlParams.get('floor');
  if (rawFloorParam !== null) {
    const matchedFloorBtn = Array.from(document.querySelectorAll('[data-filter-floor]')).find(
      (b) => b.getAttribute('data-filter-floor') === rawFloorParam
    );
    if (matchedFloorBtn) {
      state.floor = rawFloorParam;
      document.querySelectorAll('[data-filter-floor]').forEach((b) => b.classList.remove('is-active'));
      matchedFloorBtn.classList.add('is-active');
    }
  }

  const resultsGrid = document.getElementById('residencesGrid');
  const resultsCount = document.getElementById('resultsCount');
  const surfaceSlider = document.getElementById('surfaceSlider');
  const surfaceBadge = document.getElementById('surfaceBadge');
  const searchInput = document.getElementById('residenceSearch');
  const sortSelect = document.getElementById('sortSelect');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreWrapper = document.getElementById('loadMoreWrapper');

  function filterAndSortData() {
    let list = residencesData.filter((item) => {
      // Category filter
      if (state.category !== 'all') {
        if (state.category === 'Magasin' || state.category === 'Commerce') {
          if (item.category !== 'Magasin' && item.type !== 'Commerce') return false;
        } else if (item.category !== state.category) {
          return false;
        }
      }

      // Floor filter
      if (state.floor !== 'all' && item.floor !== Number(state.floor)) {
        return false;
      }

      // Surface filter
      if (item.surface > state.maxSurface) {
        return false;
      }

      // Features filter (supports substring match, e.g. 'Terrasse' matches both RDC garden & upper terraces)
      if (state.features.length > 0) {
        const hasAllFeatures = state.features.every((f) => {
          const needle = f.toLowerCase();
          return item.features.some((feat) => feat.toLowerCase().includes(needle));
        });
        if (!hasAllFeatures) return false;
      }

      // Search query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const searchable = [
          item.id,
          item.floorName,
          item.typeCode,
          item.typePdf,
          item.composition,
          item.category,
          item.equipments,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    if (state.sortBy === 'surface-asc') {
      list.sort((a, b) => a.surface - b.surface);
    } else if (state.sortBy === 'surface-desc') {
      list.sort((a, b) => b.surface - a.surface);
    } else if (state.sortBy === 'floor-asc') {
      list.sort((a, b) => a.floor - b.floor);
    } else if (state.sortBy === 'floor-desc') {
      list.sort((a, b) => b.floor - a.floor);
    }

    return list;
  }

  function renderList() {
    const filtered = filterAndSortData();
    const count = filtered.length;

    if (resultsCount) {
      resultsCount.textContent = `${count} ${count > 1 ? 'Résultats' : 'Résultat'}`;
    }

    const itemsToDisplay = filtered.slice(0, state.pageLimit);

    if (resultsGrid) {
      resultsGrid.style.display = 'grid';
      if (itemsToDisplay.length === 0) {
        resultsGrid.innerHTML = `
          <div class="col-span-2 text-center py-16 text-pine-green/60">
            <p class="font-editorialOld text-3xl mb-2">Aucune résidence ne correspond à vos filtres</p>
            <p class="text-sm">Essayez d'élargir votre recherche ou de réinitialiser les filtres.</p>
          </div>
        `;
      } else {
        resultsGrid.innerHTML = itemsToDisplay.map((item, index) => {
          // Pick an illustrative preview: Commercial shops have dedicated retail photography
          let layoutThumb = item.thumbImg;
          if (item.type === 'Commerce' || item.category === 'Magasin' || item.id.startsWith('MAGASIN')) {
            layoutThumb = item.thumbImg || assetUrl(`/business/retail/${item.slug || 'magasin-1'}.jpg`);
          } else {
            // 100% EXCLUSIVE VERTEX GALERIE 3D INTERIORS ONLY (001..010)
            const APARTMENT_INTERIORS_POOL = [
              '/residences/galerie/001.webp',
              '/residences/galerie/002.webp',
              '/residences/galerie/003.webp',
              '/residences/galerie/004.webp',
              '/residences/galerie/005.webp',
              '/residences/galerie/006.webp',
              '/residences/galerie/007.webp',
              '/residences/galerie/008.webp',
              '/residences/galerie/009.webp',
              '/residences/galerie/010.webp'
            ].map(assetUrl);

            const isValidGalerie = layoutThumb && layoutThumb.includes('/residences/galerie/');
            if (!isValidGalerie) {
              layoutThumb = APARTMENT_INTERIORS_POOL[index % APARTMENT_INTERIORS_POOL.length];
            }
          }
          
          return `
            <div class="residence-card group" data-id="${item.id}" role="button" tabindex="0">
              <div class="card-top-preview">
                <img src="${layoutThumb}" alt="${item.id}" class="card-preview-img" loading="lazy" />
                <span class="card-plan-pill">${item.typeCode || item.category} · Plan PDF</span>
                <div class="card-badges">
                  <span class="card-badge-icon" title="Exposition Lumineuse">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  </span>
                  <span class="card-badge-icon" title="Parking Sous-sol inclus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                  </span>
                </div>
              </div>
              <div class="card-content">
                <div class="flex items-baseline justify-between gap-2">
                  <h3 class="card-apartment-id">${item.id}</h3>
                  <div class="text-right shrink-0">
                    <span class="font-editorialOld text-xl sm:text-2xl text-golden">${item.surface.toFixed(0)} m²</span>
                    ${item.terraceSurface > 0 ? `<span class="card-terrace-sub">+${item.terraceSurface} m² Ter.</span>` : ''}
                  </div>
                </div>
                <div class="card-details-row">
                  <div class="card-specs-list">
                    <span class="card-spec-item highlight">${item.category} · ${item.floorName}</span>
                    <span class="card-spec-item">${item.composition || item.roomsText}</span>
                    <span class="card-spec-item text-xs text-golden">${item.isMagasin ? item.surfaceDetails : (item.terraceSurface > 0 ? `Terrasse / Jardin : ${item.terraceSurface} m²` : (item.features[0] || 'Parking Sous-Sol Garanti'))}</span>
                  </div>
                  <div class="card-see-more shrink-0">
                    <span>Plan &amp; Détails</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
                ${!item.isMagasin ? `
                  <div class="card-finitions" aria-label="Finitions et équipements inclus">
                    ${RESIDENCE_CARD_FINITIONS.map((label) => `<span class="card-finition-pill">${label}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Toggle Load More button
    if (loadMoreWrapper) {
      loadMoreWrapper.style.display = itemsToDisplay.length < filtered.length ? 'flex' : 'none';
    }

    // Attach click & pointer prefetch listeners to cards
    document.querySelectorAll('.residence-card').forEach((el) => {
      const id = el.getAttribute('data-id');
      const unit = residencesData.find((u) => u.id === id);
      if (!unit) return;
      el.addEventListener('pointerenter', () => loadUnitSheetVisuals(unit), { once: true });
      el.addEventListener('click', () => openModal(unit));
    });

    // Smooth reveal for newly rendered cards (Always visible, zero invisible bugs)
    const cards = document.querySelectorAll('.residence-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.02,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }
  }

  // Surface slider change
  if (surfaceSlider && surfaceBadge) {
    surfaceSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      state.maxSurface = val;
      surfaceBadge.textContent = `${val} m²`;
      renderList();
    });
  }

  // Category pill filters
  document.querySelectorAll('[data-filter-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-category]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.category = btn.getAttribute('data-filter-category');
      state.pageLimit = 24;
      renderList();
    });
  });

  // Floor pill filters
  document.querySelectorAll('[data-filter-floor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-floor]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.floor = btn.getAttribute('data-filter-floor');
      state.pageLimit = 24;
      renderList();
    });
  });

  // Features pill filters
  document.querySelectorAll('[data-filter-feature]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const feature = btn.getAttribute('data-filter-feature');
      const idx = state.features.indexOf(feature);
      if (idx > -1) {
        state.features.splice(idx, 1);
        btn.classList.remove('is-active');
      } else {
        state.features.push(feature);
        btn.classList.add('is-active');
      }
      state.pageLimit = 24;
      renderList();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      state.pageLimit = 24;
      renderList();
    });
  }

  // Sorting
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderList();
    });
  }

  // View mode indicator (Grid only per user request)
  const gridViewBtn = document.getElementById('gridViewBtn');
  if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      renderList();
    });
  }

  // Load More Button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      state.pageLimit += 24;
      renderList();
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.category = 'all';
      state.floor = 'all';
      state.maxSurface = 221;
      state.features = [];
      state.searchQuery = '';
      state.sortBy = 'default';
      state.pageLimit = 24;

      if (surfaceSlider) surfaceSlider.value = 221;
      if (surfaceBadge) surfaceBadge.textContent = '221 m²';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'default';

      document.querySelectorAll('[data-filter-category]').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-filter-category') === 'all');
      });
      document.querySelectorAll('[data-filter-floor]').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-filter-floor') === 'all');
      });
      document.querySelectorAll('[data-filter-feature]').forEach((b) => {
        b.classList.remove('is-active');
      });

      renderList();
    });
  }

  // Initial render of residences
  renderList();

  // ==========================================
  // 5. APARTMENT DETAILS MODAL & BLUEPRINT LIGHTBOX
  // ==========================================
  const modalBackdrop = document.getElementById('apartmentModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalLotId = document.getElementById('modalLotId');
  const modalLotSubtitle = document.getElementById('modalLotSubtitle');
  const modalTypePdf = document.getElementById('modalTypePdf');
  const modalMainImg = document.getElementById('modalMainImg');
  const modalThumbsRow = document.getElementById('modalThumbsRow');
  const modalVisualTabs = document.getElementById('modalVisualTabs');
  const modalVisualCaption = document.getElementById('modalVisualCaption');
  const modalSurface = document.getElementById('modalSurface');
  const modalTerraceRow = document.getElementById('modalTerraceRow');
  const modalTerrace = document.getElementById('modalTerrace');
  const modalFloor = document.getElementById('modalFloor');
  const modalRooms = document.getElementById('modalRooms');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalEquipments = document.getElementById('modalEquipments');
  const modalWaLink = document.getElementById('modalWaLink');
  const modalPlanDownload = document.getElementById('modalPlanDownload');

  const blueprintModal = document.getElementById('blueprintModal');
  const blueprintModalImg = document.getElementById('blueprintModalImg');
  const blueprintModalTitle = document.getElementById('blueprintModalTitle');
  const blueprintModalActions = document.getElementById('blueprintModalActions');
  const closeBlueprintBtn = document.getElementById('closeBlueprintBtn');

  let activeModalUnit = null;
  let activeVisualMode = 'plan';

  const unitSheetCache = new Map();
  function cropSheetRegionToUrl(img, sx, sy, sw, sh) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(URL.createObjectURL(blob));
          else resolve(canvas.toDataURL('image/webp', 0.9));
        },
        'image/webp',
        0.9
      );
    });
  }

  function loadUnitSheetVisuals(unit) {
    if (!unit || !unit.planSheet || !Array.isArray(unit.sheetLayout)) {
      return Promise.resolve({
        planUrl: unit ? unit.planImg : '',
        empUrl: unit ? unit.emplacementImg : '',
        planWidth: 0,
        empWidth: 0,
      });
    }
    if (unitSheetCache.has(unit.slug)) {
      return unitSheetCache.get(unit.slug);
    }
    const promise = new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const [pw, ph, ew, eh] = unit.sheetLayout;
          const [planUrl, empUrl] = await Promise.all([
            cropSheetRegionToUrl(img, 0, 0, pw, ph),
            cropSheetRegionToUrl(img, pw, 0, ew, eh),
          ]);
          resolve({ planUrl, empUrl, planWidth: pw, empWidth: ew });
        } catch {
          resolve({ planUrl: unit.planSheet, empUrl: unit.planSheet, planWidth: 0, empWidth: 0 });
        }
      };
      img.onerror = () => resolve({ planUrl: unit.planSheet, empUrl: unit.planSheet, planWidth: 0, empWidth: 0 });
      img.src = unit.planSheet;
    });
    unitSheetCache.set(unit.slug, promise);
    return promise;
  }

  function updateBlueprintSwitch(unit, mode) {
    if (!unit || !blueprintModalImg) return;
    let label = `Plan Unité (${unit.typeCode || unit.id})`;
    if (mode === 'emplacement') {
      label = `Emplacement sur Étage (Lot en rouge)`;
    } else if (mode === 'floor') {
      label = `Plan Architectural d'Étage Complet (${unit.floorName})`;
    }
    blueprintModalImg.dataset.bpMode = mode;
    blueprintModalImg.alt = `${unit.id} — ${label}`;
    if (blueprintModalTitle) {
      blueprintModalTitle.textContent = `${unit.id} · ${label}`;
    }
    if (blueprintModalActions) {
      blueprintModalActions.querySelectorAll('.blueprint-switch-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-bp-mode') === mode);
      });
    }
    if (mode === 'floor' && unit.floorPlanImg) {
      blueprintModalImg.src = unit.floorPlanImg;
      return;
    }
    loadUnitSheetVisuals(unit).then(({ planUrl, empUrl }) => {
      if (blueprintModalImg.dataset.bpMode !== mode || activeModalUnit !== unit) return;
      blueprintModalImg.src = mode === 'emplacement' ? empUrl : planUrl;
    });
  }

  function openBlueprintModal(src, title, unit = null, initialMode = 'plan') {
    if (blueprintModal && blueprintModalImg) {
      if (unit && blueprintModalActions) {
        activeModalUnit = unit;
        blueprintModalActions.style.display = 'flex';
        blueprintModalActions.querySelectorAll('.blueprint-switch-btn').forEach((btn) => {
          btn.onclick = () => updateBlueprintSwitch(unit, btn.getAttribute('data-bp-mode'));
        });
        updateBlueprintSwitch(unit, initialMode);
      } else {
        if (blueprintModalActions) blueprintModalActions.style.display = 'none';
        blueprintModalImg.src = src;
        if (blueprintModalTitle) {
          blueprintModalTitle.textContent = title || 'Plan Architectural Officiel';
        }
      }
      blueprintModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    }
  }

  function closeBlueprintModal() {
    if (blueprintModal) {
      blueprintModal.classList.remove('is-open');
      if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) {
        document.body.style.overflow = '';
        if (window.__lenis) window.__lenis.start();
      }
    }
  }

  if (closeBlueprintBtn) closeBlueprintBtn.addEventListener('click', closeBlueprintModal);
  if (blueprintModal) {
    blueprintModal.addEventListener('click', (e) => {
      if (e.target === blueprintModal) closeBlueprintModal();
    });
  }

  function setModalVisual(unit, src, kind, captionText) {
    activeVisualMode = kind;
    if (modalMainImg) {
      if (src) modalMainImg.src = src;
      modalMainImg.alt = `${unit.id} — ${captionText}`;
      modalMainImg.dataset.visualKind = kind;
      modalMainImg.classList.toggle('is-photo', kind === 'photo');
    }
    if (modalVisualCaption) {
      modalVisualCaption.textContent = captionText;
    }
    if (modalVisualTabs) {
      modalVisualTabs.querySelectorAll('.modal-visual-tab').forEach((tab) => {
        tab.classList.toggle('is-active', tab.getAttribute('data-visual-tab') === kind);
      });
    }
    if (modalThumbsRow) {
      modalThumbsRow.querySelectorAll('.modal-thumb-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-kind') === kind && (!src || btn.getAttribute('data-src') === src));
      });
    }
  }

  function openModal(unit) {
    if (!modalBackdrop) return;
    activeModalUnit = unit;
    if (modalLotId) modalLotId.textContent = unit.id;
    if (modalLotSubtitle) modalLotSubtitle.textContent = unit.situation || 'Lot certifié conforme aux plans officiels Jardins de Bali.';
    if (modalTypePdf) modalTypePdf.textContent = unit.typePdf || unit.category;
    if (modalSurface) modalSurface.textContent = unit.surfaceDetails || `${unit.surface} m²`;
    if (modalTerraceRow && modalTerrace) {
      if (unit.terraceSurface > 0) {
        modalTerraceRow.style.display = 'table-row';
        modalTerrace.textContent = `${unit.terraceSurface} m² (Total ${unit.totalWithTerrace} m²)`;
      } else {
        modalTerraceRow.style.display = 'none';
      }
    }
    if (modalFloor) modalFloor.textContent = unit.floorName;
    if (modalRooms) modalRooms.textContent = unit.composition || unit.roomsText;
    if (modalFeatures) modalFeatures.textContent = unit.features.join(', ');
    if (modalEquipments) {
      const row = modalEquipments.closest('tr');
      modalEquipments.textContent = '';
      if (unit.isMagasin) {
        if (row) row.classList.remove('is-vertical-row');
        modalEquipments.textContent =
          unit.equipments ||
          'Vitrine panoramique toute hauteur, Double hauteur sous plafond, Volet roulant motorisé, Climatisation pré-installée';
      } else {
        if (row) row.classList.add('is-vertical-row');
        const list = document.createElement('ul');
        list.className = 'modal-finitions-list';
        getResidenceFinitionsList(Boolean(unit.isDuplex)).forEach(({ label, value }) => {
          const li = document.createElement('li');
          li.className = 'modal-finition-item';
          const keyEl = document.createElement('span');
          keyEl.className = 'modal-finition-key';
          keyEl.textContent = `${label} : `;
          const valEl = document.createElement('span');
          valEl.className = 'modal-finition-val';
          valEl.textContent = value;
          li.appendChild(keyEl);
          li.appendChild(valEl);
          list.appendChild(li);
        });
        modalEquipments.appendChild(list);
      }
    }

    const placeholderSrc = unit.floorPlanImg || unit.planSheet || unit.thumbImg;

    // Build visual entries: 1) Plan Unité (default), 2) Emplacement Rouge, 3) Interior/Vitrine Photos
    const visualEntries = [
      { src: placeholderSrc, kind: 'plan', label: 'Plan Unité', caption: `Plan coté officiel (${unit.typePdf || unit.typeCode}) — cliquez pour agrandir` },
      { src: unit.floorPlanImg, kind: 'emplacement', label: 'Rouge', caption: `Emplacement exact sur plan d'étage (lot surligné en rouge) — cliquez pour agrandir` },
    ];
    const extraPhotos = [];
    if (unit.thumbImg) extraPhotos.push(unit.thumbImg);
    if (Array.isArray(unit.gallery)) {
      unit.gallery.forEach((s) => {
        if (s && s !== unit.planSheet && !extraPhotos.includes(s)) extraPhotos.push(s);
      });
    }
    extraPhotos.forEach((s, idx) => {
      visualEntries.push({
        src: s,
        kind: 'photo',
        label: idx === 0 ? 'Aperçu' : `Vue ${idx + 1}`,
        caption: `${unit.id} · Aperçu architectural & ambiance intérieure`,
      });
    });

    if (modalThumbsRow) {
      modalThumbsRow.innerHTML = visualEntries
        .map(
          (entry, i) => `
          <button type="button" class="modal-thumb-btn ${i === 0 ? 'is-active' : ''}" data-src="${entry.src}" data-kind="${entry.kind}" data-caption="${entry.caption.replace(/"/g, '&quot;')}">
            <img src="${entry.src}" alt="${entry.label}" class="modal-thumb" />
            <span class="modal-thumb-label">${entry.label}</span>
          </button>
        `
        )
        .join('');

      modalThumbsRow.querySelectorAll('.modal-thumb-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          setModalVisual(unit, btn.getAttribute('data-src'), btn.getAttribute('data-kind'), btn.getAttribute('data-caption'));
        });
      });
    }

    if (modalVisualTabs) {
      modalVisualTabs.querySelectorAll('.modal-visual-tab').forEach((tab) => {
        tab.onclick = () => {
          const targetKind = tab.getAttribute('data-visual-tab');
          const match = visualEntries.find((e) => e.kind === targetKind) || visualEntries[0];
          setModalVisual(unit, match.src, match.kind, match.caption);
        };
      });
    }

    // Default open on zoomed Unit CAD Plan ('plan') & decode combined 2-panel sheet asynchronously
    if (modalMainImg) modalMainImg.dataset.sheetReady = 'false';
    setModalVisual(unit, visualEntries[0].src, visualEntries[0].kind, visualEntries[0].caption);

    loadUnitSheetVisuals(unit).then(({ planUrl, empUrl }) => {
      if (activeModalUnit !== unit) return;
      visualEntries[0].src = planUrl;
      visualEntries[1].src = empUrl;
      if (modalThumbsRow) {
        const btns = modalThumbsRow.querySelectorAll('.modal-thumb-btn');
        if (btns[0]) {
          btns[0].setAttribute('data-src', planUrl);
          const im = btns[0].querySelector('img');
          if (im) im.src = planUrl;
        }
        if (btns[1]) {
          btns[1].setAttribute('data-src', empUrl);
          const im = btns[1].querySelector('img');
          if (im) im.src = empUrl;
        }
      }
      if (modalMainImg) {
        modalMainImg.dataset.sheetReady = 'true';
        if (activeVisualMode === 'plan') {
          setModalVisual(unit, planUrl, 'plan', visualEntries[0].caption);
        } else if (activeVisualMode === 'emplacement') {
          setModalVisual(unit, empUrl, 'emplacement', visualEntries[1].caption);
        }
      }
      if (modalPlanDownload) modalPlanDownload.href = planUrl;
    });

    if (modalMainImg) {
      modalMainImg.style.cursor = 'zoom-in';
      modalMainImg.onclick = () => {
        if (activeVisualMode === 'plan' || activeVisualMode === 'emplacement') {
          openBlueprintModal(modalMainImg.src, `${unit.id}`, unit, activeVisualMode);
        } else {
          openBlueprintModal(modalMainImg.src, `${unit.id} — Visuel`, null);
        }
      };
    }

    // Plan Plein Écran button -> opens HD blueprint lightbox with Plan Unité / Emplacement Rouge / Plan Étage switcher
    if (modalPlanDownload) {
      modalPlanDownload.href = unit.planSheet || placeholderSrc;
      modalPlanDownload.onclick = (e) => {
        e.preventDefault();
        openBlueprintModal(modalMainImg ? modalMainImg.src : placeholderSrc, `${unit.id}`, unit, activeVisualMode === 'emplacement' ? 'emplacement' : 'plan');
      };
    }

    // WhatsApp Direct Inquiry link
    if (modalWaLink) {
      const msg = encodeURIComponent(`Bonjour, je souhaiterais recevoir la documentation privée relative au bien ${unit.id} (${unit.floorName}) aux Jardins de Bali à Marrakech.`);
      modalWaLink.href = `https://wa.me/212665644391?text=${msg}`;
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    if (!blueprintModal || !blueprintModal.classList.contains('is-open')) {
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (blueprintModal && blueprintModal.classList.contains('is-open')) {
        closeBlueprintModal();
      } else {
        closeModal();
      }
    }
  });

  // ==========================================
  // 6. ARCHITECTURAL PLANS TABS SHOWCASE
  // ==========================================
  const planTabs = document.querySelectorAll('[data-plan-target]');
  const planDisplayImg = document.getElementById('planDisplayImg');
  const planInfoTitle = document.getElementById('planInfoTitle');
  const planInfoDesc = document.getElementById('planInfoDesc');
  const planFullscreenLink = document.getElementById('planFullscreenLink');

  const plansDataMap = {
    'ss2': {
      title: 'Plan Sous-Sol -2 (Parking Sécurisé & Visas Officiels)',
      desc: 'Capacité totale de 110 places de stationnement numérotées de 125 à 234, rampes d\'accès double voie, et visas officiels de la Commune de Marrakech et de l\'Architecte.',
      img: assetUrl('/jardins_de_bali/plan_01_sous_sol_2.jpg')
    },
    'ss1': {
      title: 'Plan Sous-Sol -1 (124 Places de Parking & 15 Boxes Privatifs)',
      desc: 'Premier niveau de stationnement souterrain comprenant 124 places numérotées de 1 à 124, 15 boxes fermés et 6 cages d\'ascenseurs desservant tous les étages.',
      img: assetUrl('/jardins_de_bali/plan_02_sous_sol_1.jpg')
    },
    'rdc': {
      title: 'Plan Rez-de-Chaussée (Patio Central, 4 Magasins & 32 Duplexes)',
      desc: 'Allée d\'accès arborée avec grande fontaine d\'eau, 4 magasins flagships en façade sur rue et 32 duplexes RDC (App 1 à 32).',
      img: assetUrl('/jardins_de_bali/plan_03_rez_de_chaussee.jpg')
    },
    'mezz': {
      title: 'Plan Mezzanine (4 Mezzanines Commerciales & 32 Duplexes)',
      desc: 'Niveau mezzanine intégrant les 4 mezzanines commerciales des magasins flagships (244 m² cumulés) et les niveaux supérieurs des 32 duplexes RDC (App 1 à 32).',
      img: assetUrl('/jardins_de_bali/plan_04_mezzanine.jpg')
    },
    'r1': {
      title: 'Plan 1er Étage (40 Appartements — App 33 à 72)',
      desc: 'Distribution optimisée autour des puits de lumière intérieurs et balcons extérieurs offrant une clarté naturelle tout au long de la journée.',
      img: assetUrl('/jardins_de_bali/plan_05_1er_etage.jpg')
    },
    'r2': {
      title: 'Plan 2ème Étage (40 Appartements — App 73 à 112)',
      desc: 'Appartements d\'exception avec loggias et balcons paysagers, isolation acoustique renforcée et menuiseries aluminium à rupture thermique.',
      img: assetUrl('/jardins_de_bali/plan_06_2eme_etage.jpg')
    },
    'r3': {
      title: 'Plan 3ème Étage (40 Appartements — App 113 à 152)',
      desc: 'Vues dégagées sur les jardins et le patio arboré, finitions soignées en travertin et marbre noble.',
      img: assetUrl('/jardins_de_bali/plan_07_3eme_etage.jpg')
    },
    'r4': {
      title: 'Plan 4ème Étage (40 Appartements — App 153 à 192)',
      desc: 'Début des retraits architecturaux en gradins inspirés de l\'île de Bali avec terrasses suspendues arborées.',
      img: assetUrl('/jardins_de_bali/plan_08_4eme_etage.jpg')
    },
    'r5': {
      title: 'Plan 5ème Étage (38 Appartements avec Terrasses — App 193 à 230)',
      desc: 'Dernier niveau résidentiel avec grandes terrasses panoramiques privatives (16 lots) et accès au rooftop solarium.',
      img: assetUrl('/jardins_de_bali/plan_09_5eme_etage.jpg')
    },
    'toiture': {
      title: 'Plan Toiture-Terrasse & Rooftop (Double Piscine Suspendue)',
      desc: 'Espace bien-être d\'exception avec deux piscines à débordement, solarium en teck, transats panoramiques et vue imprenable sur Marrakech.',
      img: assetUrl('/jardins_de_bali/plan_16_toiture_terrasse.jpg')
    },
    'facades': {
      title: 'Façade Principale & Coupes Longitudinales (AMA Architecture)',
      desc: 'Élévation de la façade avec ses lignes organiques courbes, ses brise-soleil verticaux et coupes structurelles AA et BB.',
      img: assetUrl('/jardins_de_bali/plan_11_facade_principale.jpg')
    }
  };

  planTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      planTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const key = tab.getAttribute('data-plan-target');
      const data = plansDataMap[key];
      if (data && planDisplayImg) {
        planDisplayImg.src = data.img;
        planDisplayImg.alt = data.title;
        if (planInfoTitle) planInfoTitle.textContent = data.title;
        if (planInfoDesc) planInfoDesc.textContent = data.desc;
        if (planFullscreenLink) planFullscreenLink.href = data.img;
      }
    });
  });

  if (planFullscreenLink) {
    planFullscreenLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTitle = planInfoTitle ? planInfoTitle.textContent : 'Plan Architectural Officiel';
      const currentSrc = planDisplayImg ? planDisplayImg.src : assetUrl('/jardins_de_bali/plan_03_rez_de_chaussee.jpg');
      openBlueprintModal(currentSrc, currentTitle);
    });
  }

  if (planDisplayImg) {
    planDisplayImg.style.cursor = 'zoom-in';
    planDisplayImg.addEventListener('click', () => {
      const currentTitle = planInfoTitle ? planInfoTitle.textContent : 'Plan Architectural Officiel';
      openBlueprintModal(planDisplayImg.src, currentTitle);
    });
  }

  // ==========================================
  // FOOTER FORM & TOAST NOTIFICATION
  // ==========================================
  const residencesFooterForm = document.getElementById('residencesFooterForm');
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  const showToast = (msg) => {
    if (!toastNotice) return;
    if (toastMsg && msg) toastMsg.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  };

  bindFooterWeb3Form(residencesFooterForm, {
    sourceLabel: 'Résidences Footer',
    successMessage: "Merci ! Votre demande concernant les Jardins de Bali a bien été transmise.",
    notify: showToast,
  });
});

