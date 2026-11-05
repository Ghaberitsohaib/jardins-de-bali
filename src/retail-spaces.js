import './arbor.css';
import retailData from './data/retail-spaces-data.json';
import { initMotion, initScrollReveals, MOTION_CONFIG } from './motion.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED INERTIAL SMOOTH SCROLL (LENIS + GSAP)
  // ==========================================
  const lenis = initMotion({ pageName: 'retail' });

  // Soft reveals for static sections & retail elements
  initScrollReveals('.retail-header, .retail-spaces-container, .retail-card-item', {
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
      closeFilterDrawer();
    }
  });

  document.addEventListener('click', (e) => {
    if (arborHeader && arborHeader.classList.contains('is-open')) {
      if (!arborHeader.contains(e.target)) {
        closeArborMenu();
      }
    }
  });

  // Smooth scroll helper
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeArborMenu();
        lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
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
          const node = new Node();
          this.nodes.push(node);
        }
      }

      TrailLine.prototype.update = function () {
        let spring = this.spring;
        let node = this.nodes[0];
        node.vx += (pointer.x - node.x) * spring;
        node.vy += (pointer.y - node.y) * spring;
        for (let i = 0; i < this.nodes.length; i++) {
          node = this.nodes[i];
          if (i > 0) {
            const prev = this.nodes[i - 1];
            node.vx += (prev.x - node.x) * spring;
            node.vy += (prev.y - node.y) * spring;
            node.vx += prev.vx * config.dampening;
            node.vy += prev.vy * config.dampening;
          }
          node.vx *= this.friction;
          node.vy *= this.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= config.tension;
        }
      };

      TrailLine.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
        for (let i = 1; i < this.nodes.length - 2; i++) {
          const c = (this.nodes[i].x + this.nodes[i + 1].x) / 2;
          const d = (this.nodes[i].y + this.nodes[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.nodes[i].x, this.nodes[i].y, c, d);
        }
        ctx.stroke();
      };

      function resizeCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      for (let i = 0; i < config.trails; i++) {
        lines.push(new TrailLine({ spring: 0.45 + (i / config.trails) * 0.025 }));
      }

      window.addEventListener('mousemove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      });

      function renderCanvas() {
        ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        ctx.strokeStyle = 'rgba(180, 150, 100, 0.22)';
        ctx.lineWidth = 1;
        for (let i = 0; i < lines.length; i++) {
          lines[i].update();
          lines[i].draw();
        }
        requestAnimationFrame(renderCanvas);
      }
      renderCanvas();
    }
  }

  // ==========================================
  // 4. RETAIL & BUSINESS SPACES FILTER STATE
  // ==========================================
  const state = {
    type: 'all',          // 'all', 'Retail', 'Offices', 'Duplex'
    minSurface: 40,
    maxSurface: 450,
    floor: 'all',         // 'all', 0, 0.5, 1, 2, 5
    wing: 'all',          // 'all', 'Wing A', 'Wing B'
    searchQuery: '',
    page: 1,
    perPage: 6
  };

  const gridContainer = document.getElementById('retailGrid');
  const resultsCounter = document.getElementById('resultsCounter');
  const resultsCounterMobile = document.getElementById('resultsCounterMobile');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const resetFiltersBtnMobile = document.getElementById('resetFiltersBtnMobile');

  // Surface slider elements
  const surfaceMinLabel = document.getElementById('surfaceMinLabel');
  const surfaceMaxLabel = document.getElementById('surfaceMaxLabel');
  const surfaceSlider = document.getElementById('surfaceSlider');

  // Floor slider/picker
  const floorMinLabel = document.getElementById('floorMinLabel');
  const floorMaxLabel = document.getElementById('floorMaxLabel');
  const floorSlider = document.getElementById('floorSlider');

  // Type filter buttons
  const typeButtons = document.querySelectorAll('[data-filter-type]');
  const wingButtons = document.querySelectorAll('[data-filter-wing]');
  const floorButtons = document.querySelectorAll('[data-filter-floor]');

  function getFilteredUnits() {
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
  }

  function renderGrid() {
    if (!gridContainer) return;

    const filtered = getFilteredUnits();
    const total = filtered.length;

    // Update counter
    const countText = `${total} Espaces`;
    const countFullText = `${total} Espaces disponibles`;
    if (resultsCounter) resultsCounter.textContent = countText;
    if (resultsCounterMobile) resultsCounterMobile.textContent = countText;
    const resultsCounterDrawer = document.getElementById('resultsCounterDrawer');
    if (resultsCounterDrawer) resultsCounterDrawer.textContent = countFullText;
    const applyBtn = document.getElementById('applyMobileFilterBtn');
    if (applyBtn) {
      applyBtn.innerHTML = `<span>Afficher les résultats (${total})</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }

    const visibleItems = filtered.slice(0, state.page * state.perPage);

    if (visibleItems.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-2 py-20 text-center space-y-4">
          <p class="font-editorialOld text-3xl text-golden">Aucun espace ne correspond à vos critères</p>
          <p class="font-workSans text-pine-green/70 text-sm">Veuillez réinitialiser les filtres pour explorer l'ensemble de nos magasins et plateaux d'affaires.</p>
          <button id="noResultsReset" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-golden bg-golden text-sand uppercase text-xs tracking-widest hover:bg-pine-green transition mt-4">
            Réinitialiser les filtres
          </button>
        </div>
      `;
      const noResBtn = document.getElementById('noResultsReset');
      if (noResBtn) {
        noResBtn.addEventListener('click', resetFilters);
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    gridContainer.innerHTML = visibleItems.map((u) => `
      <div class="retail-card-item cursor-pointer border px-6 pt-7 pb-8 transition-all duration-300 hover:bg-white hover:shadow-xl max-lg:p-5 group relative bg-[#FAF7EF]" style="border-color: rgba(197, 168, 128, 0.28); border-radius: 14px;" data-unit-id="${u.id}">
        <!-- Architectural Plan Image -->
        <div class="relative overflow-hidden bg-white rounded-lg p-5 flex items-center justify-center min-h-[220px] max-sm:min-h-[190px] border shadow-inner mb-5 max-lg:mb-4" style="border-color: rgba(197, 168, 128, 0.2);">
          <img
            alt="${u.name} Plan Architectural"
            loading="lazy"
            width="514"
            height="380"
            class="h-auto w-full max-w-none mix-blend-multiply object-contain transition duration-500 group-hover:scale-103"
            src="${u.layoutImg}"
          />
          <!-- Badge Top Right: Availability Status only (Explicit positioning: Zero badge collisions) -->
          <div class="flex items-center gap-1.5 bg-[#FDFBEF]/95 backdrop-blur-md px-3 py-1 rounded-full border shadow-xs" style="position: absolute; top: 12px; right: 12px; z-index: 10; border-color: rgba(197, 168, 128, 0.5);">
            <span class="inline-block size-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span class="text-[0.6875rem] tracking-wider uppercase text-[#10150F] font-semibold">${u.status}</span>
          </div>
        </div>

        <!-- Typography & Specs (Belgrade Arbor Luxury Standard) -->
        <div class="space-y-4">
          <!-- Top Row: Category Kicker & Surface Area -->
          <div class="flex items-center justify-between gap-3 border-b pb-2.5" style="border-color: rgba(197, 168, 128, 0.22);">
            <span class="font-workSans text-[0.6875rem] tracking-[0.18em] uppercase font-semibold text-[#A68150] truncate">
              ${u.typeLabel}
            </span>
            <span class="font-workSans text-[#10150F] font-bold text-lg md:text-xl tracking-tight shrink-0">
              ${u.surfaceFormatted}
            </span>
          </div>

          <!-- Unit Title (Full width: Zero collision with specs on mobile) -->
          <h3 class="font-editorialOld leading-[1.05] tracking-tight transition-colors duration-300 group-hover:text-[#10150F]" style="font-size: clamp(2rem, 3.6vw, 3.2rem); color: #A68150;">
            ${u.name}
          </h3>

          <!-- Details & Action Row -->
          <div class="flex items-end justify-between gap-4 pt-1">
            <div class="space-y-1 min-w-0 flex-1">
              <p class="font-workSans text-xs text-[#60735C] font-medium tracking-wide uppercase">
                ${u.floorLabel}
              </p>
              <p class="font-workSans text-xs tracking-wider uppercase font-semibold text-[#10150F]/80 truncate">
                ${u.wingLabel.split('(')[0]}
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
    `).join('');

    // Attach click events on cards
    document.querySelectorAll('.retail-card-item').forEach((card) => {
      card.addEventListener('click', () => {
        const uid = card.getAttribute('data-unit-id');
        openUnitModal(uid);
      });
    });

    // Smooth reveal for newly rendered cards (Always visible, zero invisible bugs)
    const cards = document.querySelectorAll('.retail-card-item');
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

    // Handle Load More visibility
    if (loadMoreBtn) {
      if (visibleItems.length < filtered.length) {
        loadMoreBtn.style.display = 'flex';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  }

  // ==========================================
  // 5. FILTER HANDLERS
  // ==========================================
  function updateTypeButtonsUI() {
    typeButtons.forEach((b) => {
      const bType = b.getAttribute('data-filter-type');
      if (bType === state.type) {
        b.classList.add('is-active');
      } else {
        b.classList.remove('is-active');
      }
    });
  }

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const type = this.getAttribute('data-filter-type');
      state.type = type;
      state.page = 1;
      updateTypeButtonsUI();
      renderGrid();
    });
  });

  function updateFloorButtonsUI() {
    floorButtons.forEach((b) => {
      const bFloor = b.getAttribute('data-filter-floor');
      const isMatch = (state.floor === 'all' && bFloor === 'all') || (String(state.floor) === bFloor);
      if (isMatch) {
        b.classList.add('is-active');
      } else {
        b.classList.remove('is-active');
      }
    });
  }

  floorButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const val = this.getAttribute('data-filter-floor');
      state.floor = val === 'all' ? 'all' : Number(val);
      state.page = 1;
      updateFloorButtonsUI();
      if (floorSlider) floorSlider.value = val === 'all' ? -1 : Number(val);
      const floorSliderMobile = document.getElementById('floorSliderMobile');
      if (floorSliderMobile) floorSliderMobile.value = val === 'all' ? -1 : Number(val);
      const shortText = val === 'all' ? 'Tous' : (Number(val) === 0 ? 'RDC' : (Number(val) === 0.5 ? 'Mezzanine' : `R+${val}`));
      if (floorMaxLabel) floorMaxLabel.textContent = shortText;
      renderGrid();
    });
  });

  function updateWingButtonsUI() {
    wingButtons.forEach((b) => {
      const bWing = b.getAttribute('data-filter-wing');
      const check = b.querySelector('.wing-check-icon');
      if (bWing === state.wing) {
        b.classList.add('is-active');
        if (check) check.classList.remove('opacity-0');
      } else {
        b.classList.remove('is-active');
        if (check) check.classList.add('opacity-0');
      }
    });
  }

  wingButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const wing = this.getAttribute('data-filter-wing');
      state.wing = state.wing === wing ? 'all' : wing;
      state.page = 1;
      updateWingButtonsUI();
      renderGrid();
    });
  });

  if (surfaceSlider) {
    surfaceSlider.addEventListener('input', function () {
      state.maxSurface = Number(this.value);
      if (surfaceMaxLabel) surfaceMaxLabel.textContent = `${this.value}`;
      const surfaceMaxLabelMobile = document.getElementById('surfaceMaxLabelMobile');
      if (surfaceMaxLabelMobile) surfaceMaxLabelMobile.textContent = `${this.value}`;
      const surfaceSliderMobile = document.getElementById('surfaceSliderMobile');
      if (surfaceSliderMobile) surfaceSliderMobile.value = this.value;
      state.page = 1;
      renderGrid();
    });
  }

  if (floorSlider) {
    floorSlider.addEventListener('input', function () {
      const val = Number(this.value);
      state.floor = val === -1 ? 'all' : val;
      const text = val === -1 ? 'Tous les niveaux' : (val === 0 ? 'Rez-de-chaussée (RDC)' : (val === 0.5 ? 'Mezzanine' : `Étage R+${val}`));
      const shortText = val === -1 ? 'Tous les niveaux' : (val === 0 ? 'RDC' : (val === 0.5 ? 'Mezzanine' : `R+${val}`));
      if (floorMaxLabel) floorMaxLabel.textContent = shortText;
      const floorBadge = document.getElementById('floorBadgeLabelMobile');
      if (floorBadge) floorBadge.textContent = text;
      const floorSliderMobile = document.getElementById('floorSliderMobile');
      if (floorSliderMobile) floorSliderMobile.value = this.value;
      state.page = 1;
      renderGrid();
    });
  }

  function resetFilters() {
    state.type = 'all';
    state.minSurface = 40;
    state.maxSurface = 450;
    state.floor = 'all';
    state.wing = 'all';
    state.page = 1;

    updateTypeButtonsUI();
    updateFloorButtonsUI();
    updateWingButtonsUI();

    if (surfaceSlider) {
      surfaceSlider.value = 450;
      if (surfaceMaxLabel) surfaceMaxLabel.textContent = '450';
    }
    const surfaceSliderMobile = document.getElementById('surfaceSliderMobile');
    const surfaceMaxLabelMobile = document.getElementById('surfaceMaxLabelMobile');
    if (surfaceSliderMobile) {
      surfaceSliderMobile.value = 450;
      if (surfaceMaxLabelMobile) surfaceMaxLabelMobile.textContent = '450';
    }

    if (floorSlider) {
      floorSlider.value = -1;
      if (floorMaxLabel) floorMaxLabel.textContent = 'Tous les niveaux';
    }
    const floorSliderMobile = document.getElementById('floorSliderMobile');
    const floorBadgeLabelMobile = document.getElementById('floorBadgeLabelMobile');
    if (floorSliderMobile) {
      floorSliderMobile.value = -1;
      if (floorBadgeLabelMobile) floorBadgeLabelMobile.textContent = 'Tous les niveaux';
    }

    renderGrid();
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
  if (resetFiltersBtnMobile) resetFiltersBtnMobile.addEventListener('click', resetFilters);

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      state.page++;
      renderGrid();
    });
  }

  // ==========================================
  // 6. UNIT DETAIL MODAL & BLUEPRINT LIGHTBOX
  // ==========================================
  const modalBackdrop = document.getElementById('unitDetailBackdrop');
  const modalBody = document.getElementById('unitDetailBody');
  const closeModalBtn = document.getElementById('closeUnitModalBtn');

  const blueprintModal = document.getElementById('blueprintModal');
  const blueprintModalImg = document.getElementById('blueprintModalImg');
  const blueprintModalTitle = document.getElementById('blueprintModalTitle');
  const closeBlueprintBtn = document.getElementById('closeBlueprintBtn');

  function openBlueprintModal(src, title) {
    if (blueprintModal && blueprintModalImg) {
      blueprintModalImg.src = src;
      if (blueprintModalTitle) {
        blueprintModalTitle.textContent = title || 'Plan Architectural Officiel';
      }
      blueprintModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBlueprintModal() {
    if (blueprintModal) {
      blueprintModal.classList.remove('is-open');
      if (!modalBackdrop || !modalBackdrop.classList.contains('is-active')) {
        document.body.style.overflow = '';
      }
    }
  }

  if (closeBlueprintBtn) closeBlueprintBtn.addEventListener('click', closeBlueprintModal);
  if (blueprintModal) {
    blueprintModal.addEventListener('click', (e) => {
      if (e.target === blueprintModal) closeBlueprintModal();
    });
  }

  function getVisualsForUnit(unit) {
    let renderImg = '/business/retail/magasin_1_boutique.jpg';
    if (unit.id.includes('MAGASIN 2')) renderImg = '/business/retail/magasin_2_flagship.jpg';
    else if (unit.id.includes('MAGASIN 3')) renderImg = '/business/retail/magasin_3_concept.jpg';
    else if (unit.id.includes('MAGASIN 4')) renderImg = '/business/retail/magasin_4_showroom.jpg';
    else if (unit.type === 'Office' || unit.category === 'Office' || unit.id.includes('BUREAU') || unit.id.includes('CORPORATE')) {
      renderImg = '/business/retail/bureau_executive_suite_bali.jpg';
    } else if (unit.id.includes('MEZZANINE')) {
      renderImg = '/business/retail/magasin_4_showroom.jpg';
    } else if (unit.id.includes('FLAGSHIP')) {
      renderImg = '/business/retail/magasin_2_flagship.jpg';
    } else if (unit.id.includes('ROOFTOP')) {
      renderImg = '/jardins_de_bali/10_rooftop_piscines_solarium.jpg';
    }

    return [
      { label: 'Plan Unité', src: unit.layoutImg },
      { label: 'Plan Niveau (HD)', src: unit.planPdf },
      { label: 'Visuel 3D', src: renderImg },
      { label: 'Façade Menara', src: '/jardins_de_bali/14_rendu_3d_facade_rue.jpg' },
      { label: 'Patio & Fontaine', src: '/jardins_de_bali/09_patio_interieur_fontaine.jpg' }
    ];
  }

  function openUnitModal(unitId) {
    const unit = retailData.find((u) => u.id === unitId);
    if (!unit || !modalBackdrop || !modalBody) return;

    const visuals = getVisualsForUnit(unit);
    let currentVisualSrc = visuals[0].src;

    modalBody.innerHTML = `
      <div class="modal-content-grid">
        <!-- Left: Large Blueprint & Architectural Plan -->
        <div class="modal-visuals-col">
          <div class="modal-main-img-wrap" id="unitModalMainImgWrap" style="cursor: zoom-in;" title="Cliquer pour afficher en plein écran">
            <img id="unitModalMainImg" src="${visuals[0].src}" alt="${unit.name} Architectural Plan" class="modal-main-img" />
            <div class="modal-img-badge">
              TF 34 603 / M — Lot B5
            </div>
          </div>

          <!-- Interactive Thumbnails -->
          <div class="modal-thumbs-row" id="unitModalThumbsRow">
            ${visuals.map((v, idx) => `
              <img src="${v.src}" class="modal-thumb ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}" alt="${v.label}" title="${v.label}" />
            `).join('')}
          </div>

          <div class="flex items-center justify-between text-xs px-1 pt-1" style="color: rgba(46, 58, 38, 0.75);">
            <span>Cabinet AMA ARCHITECTURE (Guéliz, Marrakech)</span>
            <button type="button" id="unitOpenHdPlanBtn" class="font-medium bg-transparent border-0 cursor-pointer text-xs" style="color: var(--arbor-golden, #C5A880); text-decoration: underline;">
              Consulter le plan officiel (HD) ↗
            </button>
          </div>
        </div>

        <!-- Right: Unit Specs & Inquiry Form Trigger -->
        <div class="modal-info-col">
          <div>
            <span class="text-xs uppercase tracking-widest font-medium" style="color: var(--arbor-golden, #C5A880);">${unit.typeLabel} — ${unit.wing}</span>
            <h2 class="modal-lot-id">
              ${unit.name}
            </h2>
            <p class="font-workSans text-base mb-3" style="color: rgba(46, 58, 38, 0.9); font-weight: 300;">${unit.title}</p>

            <!-- Key Metrics Grid Table -->
            <table class="modal-specs-table">
              <tbody>
                <tr>
                  <td class="label">Surface Commerciale</td>
                  <td class="value">${unit.surfaceFormatted}</td>
                </tr>
                <tr>
                  <td class="label">Niveau / Étage</td>
                  <td class="value">${unit.floorLabel}</td>
                </tr>
                <tr>
                  <td class="label">Hauteur sous plafond</td>
                  <td class="value">${unit.ceilingHeight}</td>
                </tr>
                <tr>
                  <td class="label">Linéaire Vitrine</td>
                  <td class="value">${unit.linearFacade || '7.50 m'}</td>
                </tr>
                <tr>
                  <td class="label">Stationnement</td>
                  <td class="value">${unit.parkingSpots}</td>
                </tr>
                <tr>
                  <td class="label">Accès Logistique</td>
                  <td class="value">${unit.deliveryAccess || 'Accès direct rue'}</td>
                </tr>
              </tbody>
            </table>

            <!-- Features list pills -->
            <div class="modal-features-list">
              ${unit.features.slice(0, 4).map(f => `<span class="modal-feature-pill">${f}</span>`).join('')}
            </div>

            <!-- Ideal for callout -->
            <div class="p-3 bg-golden/10 border-l-2 border-golden rounded-r-md text-xs mt-3" style="background: rgba(197, 168, 128, 0.12); border-left: 2px solid var(--arbor-golden, #C5A880); padding: 0.75rem; border-radius: 0 0.5rem 0.5rem 0;">
              <strong class="uppercase font-medium" style="color: var(--arbor-golden, #C5A880); display: block;">Activités recommandées :</strong>
              <p style="color: rgba(46, 58, 38, 0.9); margin-top: 0.25rem;">${unit.idealFor}</p>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="modal-actions-row">
            <button id="inquireUnitBtn" class="modal-inquire-btn" data-unit-name="${unit.name}">
              Demander la grille tarifaire & disponibilité
            </button>
            <a href="https://wa.me/212665644391?text=Bonjour%20BaytImmo%2C%20je%20souhaite%20des%20informations%20sur%20le%20lot%20${encodeURIComponent(unit.name)}%20(${encodeURIComponent(unit.surfaceFormatted)})%20aux%20Jardins%20de%20Bali." target="_blank" rel="noopener noreferrer" class="modal-whatsapp-btn" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Interactive thumbnail switching
    const mainImgEl = document.getElementById('unitModalMainImg');
    const thumbsRow = document.getElementById('unitModalThumbsRow');
    if (thumbsRow && mainImgEl) {
      thumbsRow.querySelectorAll('.modal-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          thumbsRow.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
          const idx = parseInt(thumb.getAttribute('data-idx') || '0', 10);
          const chosen = visuals[idx] || visuals[0];
          currentVisualSrc = chosen.src;
          mainImgEl.src = chosen.src;
        });
      });
    }

    // HD Blueprint Lightbox Triggers
    const openHdPlanBtn = document.getElementById('unitOpenHdPlanBtn');
    const mainImgWrap = document.getElementById('unitModalMainImgWrap');
    if (openHdPlanBtn) {
      openHdPlanBtn.addEventListener('click', () => {
        openBlueprintModal(unit.planPdf, `Plan Architectural Officiel — ${unit.name}`);
      });
    }
    if (mainImgWrap) {
      mainImgWrap.addEventListener('click', () => {
        openBlueprintModal(currentVisualSrc, `Plan Architectural — ${unit.name}`);
      });
    }

    modalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Hook CTA to contact modal
    const inqBtn = document.getElementById('inquireUnitBtn');
    if (inqBtn) {
      inqBtn.addEventListener('click', () => {
        closeModal();
        openContactModal(`Demande de disponibilité et grille tarifaire pour le lot : ${unit.name} (${unit.surfaceFormatted} - ${unit.floorLabel})`);
      });
    }
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-active');
    if (!blueprintModal || !blueprintModal.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
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
  // 7. CONTACT / INQUIRY MODAL
  // ==========================================
  const contactModalBackdrop = document.getElementById('contactModalBackdrop');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const contactMessageInput = document.getElementById('contactMessage');
  const contactForm = document.getElementById('contactForm');
  const toastNotice = document.getElementById('toastNotice');

  function openContactModal(prefillMsg = '') {
    if (!contactModalBackdrop) return;
    if (contactMessageInput && prefillMsg) {
      contactMessageInput.value = prefillMsg;
    }
    contactModalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    if (!contactModalBackdrop) return;
    contactModalBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', closeContactModal);
  if (contactModalBackdrop) {
    contactModalBackdrop.addEventListener('click', (e) => {
      if (e.target === contactModalBackdrop) closeContactModal();
    });
  }

  // Trigger from top navbar "INQUIRE" buttons
  document.querySelectorAll('.open-contact-btn, [data-open-contact]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeArborMenu();
      openContactModal('Demande générale pour les espaces commerciaux & bureaux Jardins de Bali.');
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeContactModal();
      if (toastNotice) {
        toastNotice.classList.add('show');
        toastNotice.classList.add('is-show');
        setTimeout(() => {
          toastNotice.classList.remove('show');
          toastNotice.classList.remove('is-show');
        }, 4000);
      }
      contactForm.reset();
    });
  }

  const arborFooterForm = document.getElementById('arborFooterForm');
  if (arborFooterForm) {
    arborFooterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      arborFooterForm.reset();
      if (toastNotice) {
        toastNotice.classList.add('show');
        toastNotice.classList.add('is-show');
        setTimeout(() => {
          toastNotice.classList.remove('show');
          toastNotice.classList.remove('is-show');
        }, 4000);
      }
    });
  }

  // ==========================================
  // 8. MOBILE FILTER DRAWER & FLOATING PILL (1:1 BELGRADE ARBOR)
  // ==========================================
  const mobileFilterBar = document.getElementById('mobileFilterBar');
  const mobileFilterTrigger = document.getElementById('mobileFilterTrigger');
  const mobileFilterDrawer = document.getElementById('mobileFilterDrawer');
  const closeMobileFilterBtn = document.getElementById('closeMobileFilterBtn');
  const closeMobileFilterBackdrop = document.getElementById('closeMobileFilterBackdrop');
  const applyMobileFilterBtn = document.getElementById('applyMobileFilterBtn');
  const pickerSection = document.getElementById('Picker');

  // Sliders for mobile drawer
  const surfaceSliderMobile = document.getElementById('surfaceSliderMobile');
  const surfaceMaxLabelMobile = document.getElementById('surfaceMaxLabelMobile');
  const floorSliderMobile = document.getElementById('floorSliderMobile');
  const floorMaxLabelMobile = document.getElementById('floorMaxLabelMobile');

  if (surfaceSliderMobile) {
    surfaceSliderMobile.addEventListener('input', function () {
      state.maxSurface = Number(this.value);
      if (surfaceMaxLabelMobile) surfaceMaxLabelMobile.textContent = `${this.value}`;
      if (surfaceMaxLabel) surfaceMaxLabel.textContent = `${this.value}`;
      if (surfaceSlider) surfaceSlider.value = this.value;
      state.page = 1;
      renderGrid();
    });
  }

  if (floorSliderMobile) {
    floorSliderMobile.addEventListener('input', function () {
      const val = Number(this.value);
      state.floor = val === -1 ? 'all' : val;
      const text = val === -1 ? 'Tous les niveaux' : (val === 0 ? 'Rez-de-chaussée (RDC)' : (val === 0.5 ? 'Mezzanine' : `Étage R+${val}`));
      const shortText = val === -1 ? 'Tous les niveaux' : (val === 0 ? 'RDC' : (val === 0.5 ? 'Mezzanine' : `R+${val}`));
      const floorBadge = document.getElementById('floorBadgeLabelMobile');
      if (floorBadge) floorBadge.textContent = text;
      if (floorMaxLabel) floorMaxLabel.textContent = shortText;
      if (floorSlider) floorSlider.value = this.value;
      state.page = 1;
      renderGrid();
    });
  }

  const mobileFilterSheet = document.getElementById('mobileFilterSheet');
  const filterDragHandle = document.getElementById('filterDragHandle');
  const mobileFilterHeader = document.getElementById('mobileFilterHeader');
  const mobileFilterContent = document.getElementById('mobileFilterContent');

  function openFilterDrawer() {
    if (!mobileFilterDrawer) return;
    mobileFilterDrawer.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (mobileFilterSheet) {
      mobileFilterSheet.classList.remove('is-expanded', 'is-dragging');
      mobileFilterSheet.style.transform = '';
      mobileFilterSheet.style.height = '';
      mobileFilterSheet.style.transition = '';
    }
    if (closeMobileFilterBackdrop) {
      closeMobileFilterBackdrop.style.opacity = '';
      closeMobileFilterBackdrop.style.transition = '';
    }
  }

  function closeFilterDrawer() {
    if (!mobileFilterDrawer) return;
    mobileFilterDrawer.classList.remove('is-active');
    document.body.style.overflow = '';
    if (mobileFilterSheet) {
      mobileFilterSheet.classList.remove('is-expanded', 'is-dragging');
      mobileFilterSheet.style.transform = '';
      mobileFilterSheet.style.height = '';
      mobileFilterSheet.style.transition = '';
    }
    if (closeMobileFilterBackdrop) {
      closeMobileFilterBackdrop.style.opacity = '';
      closeMobileFilterBackdrop.style.transition = '';
    }
  }

  // ==========================================
  // INTERACTIVE BOTTOM SHEET GESTURES (DRAG UP / DOWN)
  // ==========================================
  if (mobileFilterSheet) {
    let startY = 0;
    let currentY = 0;
    let startHeight = 0;
    let startTime = 0;
    let isDragging = false;

    function expandToFull() {
      mobileFilterSheet.classList.add('is-expanded');
      mobileFilterSheet.style.height = '95vh';
      mobileFilterSheet.style.transform = 'translateY(0)';
      if (closeMobileFilterBackdrop) closeMobileFilterBackdrop.style.opacity = '1';
    }

    function collapseToStandard() {
      mobileFilterSheet.classList.remove('is-expanded');
      mobileFilterSheet.style.height = '84vh';
      mobileFilterSheet.style.transform = 'translateY(0)';
      if (closeMobileFilterBackdrop) closeMobileFilterBackdrop.style.opacity = '1';
    }

    function dismissSheet() {
      mobileFilterSheet.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
      mobileFilterSheet.style.transform = 'translateY(100%)';
      if (closeMobileFilterBackdrop) {
        closeMobileFilterBackdrop.style.transition = 'opacity 0.28s ease';
        closeMobileFilterBackdrop.style.opacity = '0';
      }
      setTimeout(() => {
        closeFilterDrawer();
        mobileFilterSheet.style.transition = '';
      }, 280);
    }

    function handleStart(clientY) {
      isDragging = true;
      startY = clientY;
      currentY = clientY;
      startHeight = mobileFilterSheet.offsetHeight;
      startTime = Date.now();
      mobileFilterSheet.classList.add('is-dragging');
      mobileFilterSheet.style.transition = 'none';
      document.body.style.userSelect = 'none';
      if (closeMobileFilterBackdrop) {
        closeMobileFilterBackdrop.style.transition = 'none';
      }
    }

    function handleMove(clientY) {
      if (!isDragging) return;
      currentY = clientY;
      const deltaY = clientY - startY;

      if (deltaY > 0) {
        // Dragging DOWN -> slide sheet downwards
        mobileFilterSheet.style.transform = `translateY(${deltaY}px)`;
        if (closeMobileFilterBackdrop) {
          const progress = Math.max(0, 1 - deltaY / (window.innerHeight * 0.5));
          closeMobileFilterBackdrop.style.opacity = progress.toFixed(2);
        }
      } else {
        // Dragging UP -> expand sheet height
        const maxH = window.innerHeight * 0.95;
        const newHeight = Math.min(maxH, startHeight - deltaY);
        mobileFilterSheet.style.height = `${newHeight}px`;
        mobileFilterSheet.style.transform = 'translateY(0px)';
        if (closeMobileFilterBackdrop) {
          closeMobileFilterBackdrop.style.opacity = '1';
        }
      }
    }

    function handleEnd() {
      if (!isDragging) return;
      isDragging = false;
      mobileFilterSheet.classList.remove('is-dragging');
      mobileFilterSheet.style.transition = '';
      document.body.style.userSelect = '';
      if (closeMobileFilterBackdrop) {
        closeMobileFilterBackdrop.style.transition = '';
      }

      const deltaY = currentY - startY;
      const elapsed = Date.now() - startTime;
      const velocity = deltaY / Math.max(1, elapsed);

      if (mobileFilterSheet.classList.contains('is-expanded')) {
        // In expanded mode:
        if (deltaY > 180 || (deltaY > 100 && velocity > 0.6)) {
          dismissSheet();
        } else if (deltaY > 40) {
          collapseToStandard();
        } else {
          expandToFull();
        }
      } else {
        // In standard mode:
        if (deltaY > 110 || (deltaY > 60 && velocity > 0.5)) {
          dismissSheet();
        } else if (deltaY < -35 || (deltaY < -15 && velocity < -0.4)) {
          expandToFull();
        } else {
          collapseToStandard();
        }
      }
    }

    // Pointer events on grab handle & header
    function onPointerDown(e) {
      if (e.target.closest('button, input, a, select, textarea')) return;
      handleStart(e.clientY);
      if (e.target.setPointerCapture && e.pointerId) {
        try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
      }
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      handleMove(e.clientY);
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      if (e.target.releasePointerCapture && e.pointerId) {
        try { e.target.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      handleEnd();
    }

    if (filterDragHandle) {
      filterDragHandle.addEventListener('pointerdown', onPointerDown);
      // Tap on drag handle toggles expanded / collapsed
      filterDragHandle.addEventListener('click', () => {
        if (Math.abs(currentY - startY) > 6) return;
        if (mobileFilterSheet.classList.contains('is-expanded')) {
          collapseToStandard();
        } else {
          expandToFull();
        }
      });
    }

    if (mobileFilterHeader) {
      mobileFilterHeader.addEventListener('pointerdown', onPointerDown);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Touch events fallback for mobile Safari / content pull-down
    if (mobileFilterContent) {
      let touchStartY = 0;
      let pullingContent = false;

      mobileFilterContent.addEventListener('touchstart', (e) => {
        if (mobileFilterContent.scrollTop <= 0) {
          touchStartY = e.touches[0].clientY;
          pullingContent = true;
        } else {
          pullingContent = false;
        }
      }, { passive: true });

      mobileFilterContent.addEventListener('touchmove', (e) => {
        if (!pullingContent) return;
        const currentYTouch = e.touches[0].clientY;
        const delta = currentYTouch - touchStartY;
        if (delta > 0 && mobileFilterContent.scrollTop <= 0) {
          mobileFilterSheet.classList.add('is-dragging');
          mobileFilterSheet.style.transition = 'none';
          mobileFilterSheet.style.transform = `translateY(${delta * 0.85}px)`;
          if (closeMobileFilterBackdrop) {
            const p = Math.max(0, 1 - delta / (window.innerHeight * 0.5));
            closeMobileFilterBackdrop.style.opacity = p.toFixed(2);
          }
        }
      }, { passive: true });

      mobileFilterContent.addEventListener('touchend', (e) => {
        if (!pullingContent) return;
        pullingContent = false;
        mobileFilterSheet.classList.remove('is-dragging');
        mobileFilterSheet.style.transition = '';
        const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
        const delta = endY - touchStartY;
        if (delta > 85) {
          dismissSheet();
        } else {
          mobileFilterSheet.style.transform = 'translateY(0)';
          if (closeMobileFilterBackdrop) closeMobileFilterBackdrop.style.opacity = '1';
        }
      }, { passive: true });
    }
  }

  if (mobileFilterTrigger) mobileFilterTrigger.addEventListener('click', openFilterDrawer);
  if (closeMobileFilterBtn) closeMobileFilterBtn.addEventListener('click', closeFilterDrawer);
  if (closeMobileFilterBackdrop) closeMobileFilterBackdrop.addEventListener('click', closeFilterDrawer);
  if (applyMobileFilterBtn) {
    applyMobileFilterBtn.addEventListener('click', () => {
      closeFilterDrawer();
      if (pickerSection) lenis.scrollTo(pickerSection, { offset: -30, duration: 0.8 });
    });
  }

  // Only show the floating filter pill when user scrolls down towards/into #Picker and not over the footer!
  function updateMobileFilterBar() {
    if (!mobileFilterBar || !pickerSection) return;
    const rect = pickerSection.getBoundingClientRect();
    const footer = document.getElementById('footer');
    const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

    // Show when inside Picker, but hide when nearing footer or past the grid
    if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= 250 && footerTop > window.innerHeight - 80) {
      mobileFilterBar.classList.add('is-visible');
    } else {
      mobileFilterBar.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateMobileFilterBar, { passive: true });
  if (lenis && typeof lenis.on === 'function') {
    lenis.on('scroll', updateMobileFilterBar);
  }
  updateMobileFilterBar();

  // Initialize
  renderGrid();
});

