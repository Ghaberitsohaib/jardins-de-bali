import './arbor.css';
import './business.css';
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
    const countText = `${total} Results`;
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
      <div class="retail-card-item cursor-pointer border-grey space-y-10 border px-6 pt-8 pb-10 transition duration-300 hover:bg-[#DCDCDC]/50 max-lg:space-y-8 max-lg:px-4 max-lg:pt-6 max-lg:pb-6 group relative bg-white/40" data-unit-id="${u.id}">
        <!-- Architectural Plan Image -->
        <div class="relative overflow-hidden bg-sand/20 rounded-sm p-4 flex items-center justify-center min-h-[220px]">
          <img
            alt="${u.name} Plan Architectural"
            loading="lazy"
            width="514"
            height="380"
            class="h-auto w-full max-w-none mix-blend-darken object-contain transition duration-500 group-hover:scale-102"
            src="${u.layoutImg}"
          />
          <!-- Badge Top Right -->
          <div class="absolute top-3 right-3 flex items-center gap-1.5 bg-vanilla/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-golden/40">
            <span class="inline-block size-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span class="text-[0.65rem] tracking-wider uppercase text-pine-green font-medium">${u.status}</span>
          </div>
          <!-- Type Badge Top Left -->
          <div class="absolute top-3 left-3 bg-pine-green/90 text-sand text-[0.65rem] tracking-widest uppercase px-2.5 py-1 rounded-full">
            ${u.typeLabel}
          </div>
        </div>

        <!-- Typography & Specs (1:1 Match with Belgrade Arbor) -->
        <div class="gap-5 space-y-6 max-lg:flex max-lg:space-y-0">
          <h3 class="text-golden font-serif text-[3.8rem] xl:text-[4.8rem] leading-none max-lg:w-2/3 max-lg:text-[2.8rem] tracking-tight group-hover:text-pine-green transition-colors">
            ${u.name}
          </h3>
          <div class="flex items-end justify-between max-lg:w-1/3">
            <div class="w-2/3 max-lg:w-full space-y-1">
              <div class="item">
                <p class="paragraph text-dark-grey font-medium text-lg">${u.surfaceFormatted}</p>
              </div>
              <div class="item">
                <p class="small text-dark-grey/80">${u.floorLabel}</p>
              </div>
              <div class="item">
                <p class="text-xs text-golden tracking-wider uppercase font-medium">${u.wingLabel.split('(')[0]}</p>
              </div>
            </div>
            <!-- See more button -->
            <span class="link text-sm uppercase tracking-wider text-golden group-hover:text-pine-green font-medium flex items-center gap-2 transition max-lg:hidden">
              See more
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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

    // Reveal newly rendered cards with soft fade and subtle vertical movement
    initScrollReveals(document.querySelectorAll('.retail-card-item'), {
      distance: 25,
      stagger: 0.05,
      duration: 0.9,
    });
    ScrollTrigger.refresh();

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
        b.classList.add('border-golden', 'bg-golden', 'text-sand');
        b.classList.remove('border-grey', 'text-pine-green');
      } else {
        b.classList.remove('is-active');
        b.classList.remove('border-golden', 'bg-golden', 'text-sand');
        b.classList.add('border-grey', 'text-pine-green');
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

  function updateWingButtonsUI() {
    wingButtons.forEach((b) => {
      const bWing = b.getAttribute('data-filter-wing');
      const check = b.querySelector('.wing-check-icon');
      if (bWing === state.wing) {
        b.classList.add('is-active');
        b.classList.add('border-golden', 'bg-golden/10');
        if (check) check.classList.remove('opacity-0');
      } else {
        b.classList.remove('is-active');
        b.classList.remove('border-golden', 'bg-golden/10');
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
      if (floorMaxLabel) floorMaxLabel.textContent = val === -1 ? 'All' : (val === 0 ? 'RDC' : `R+${val}`);
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
      if (floorMaxLabel) floorMaxLabel.textContent = 'All';
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
  // 6. UNIT DETAIL MODAL
  // ==========================================
  const modalBackdrop = document.getElementById('unitDetailBackdrop');
  const modalBody = document.getElementById('unitDetailBody');
  const closeModalBtn = document.getElementById('closeUnitModalBtn');

  function openUnitModal(unitId) {
    const unit = retailData.find((u) => u.id === unitId);
    if (!unit || !modalBackdrop || !modalBody) return;

    modalBody.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Left: Large Blueprint & Architectural Plan -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-sand/30 border border-golden/30 rounded-lg p-6 flex flex-col items-center justify-center relative">
            <img src="${unit.layoutImg}" alt="${unit.name} Architectural Plan" class="w-full max-h-[440px] object-contain mix-blend-darken" />
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-serif text-golden border border-golden/40">
              TF 34 603 / M — Lot B5
            </div>
          </div>
          <div class="flex items-center justify-between text-xs text-pine-green/70 px-1">
            <span>Cabinet AMA ARCHITECTURE (Guéliz, Marrakech)</span>
            <a href="${unit.planPdf}" target="_blank" class="text-golden underline hover:text-pine-green font-medium">
              Consulter le plan de niveau officiel (HD) →
            </a>
          </div>
        </div>

        <!-- Right: Unit Specs & Inquiry Form Trigger -->
        <div class="lg:col-span-5 space-y-6">
          <div>
            <span class="text-xs uppercase tracking-widest text-golden font-medium">${unit.typeLabel} — ${unit.wing}</span>
            <h2 class="font-editorialOld text-4xl lg:text-5xl text-pine-green uppercase leading-tight mt-1">
              ${unit.name}
            </h2>
            <p class="font-workSans text-lg text-pine-green/90 mt-1 font-light">${unit.title}</p>
          </div>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 gap-3 py-4 border-y border-pine-green/15 text-sm">
            <div class="bg-vanilla/60 p-3 rounded-md">
              <span class="text-xs uppercase text-golden block font-medium">Surface</span>
              <span class="text-xl font-editorialOld text-pine-green font-semibold">${unit.surfaceFormatted}</span>
            </div>
            <div class="bg-vanilla/60 p-3 rounded-md">
              <span class="text-xs uppercase text-golden block font-medium">Niveau / Étage</span>
              <span class="text-xl font-editorialOld text-pine-green font-semibold">${unit.floorLabel}</span>
            </div>
            <div class="bg-vanilla/60 p-3 rounded-md">
              <span class="text-xs uppercase text-golden block font-medium">Hauteur sous plafond</span>
              <span class="text-base font-workSans text-pine-green font-medium">${unit.ceilingHeight}</span>
            </div>
            <div class="bg-vanilla/60 p-3 rounded-md">
              <span class="text-xs uppercase text-golden block font-medium">Stationnement</span>
              <span class="text-base font-workSans text-pine-green font-medium">${unit.parkingSpots}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="font-workSans text-sm text-pine-green/80 leading-relaxed">
            ${unit.description}
          </p>

          <!-- Features list -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase tracking-widest text-golden font-medium">Caractéristiques & Prestations :</h4>
            <ul class="grid grid-cols-1 gap-1.5 text-xs text-pine-green/80 font-workSans">
              ${unit.features.map(f => `<li class="flex items-center gap-2"><svg class="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${f}</li>`).join('')}
            </ul>
          </div>

          <!-- Ideal for -->
          <div class="p-3 bg-golden/10 border-l-2 border-golden rounded-r-md text-xs">
            <strong class="text-golden uppercase font-medium">Activités recommandées :</strong>
            <p class="text-pine-green/90 mt-0.5">${unit.idealFor}</p>
          </div>

          <!-- CTA Buttons -->
          <div class="pt-4 flex flex-col gap-3">
            <button id="inquireUnitBtn" class="w-full py-4 rounded-full bg-pine-green text-sand uppercase text-xs tracking-widest font-medium hover:bg-golden transition duration-300 flex items-center justify-center gap-3 shadow-md" data-unit-name="${unit.name}">
              Demander la grille tarifaire & disponibilité
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <a href="tel:+212661550905" class="w-full py-3 rounded-full border border-pine-green text-pine-green uppercase text-xs tracking-widest font-medium text-center hover:bg-pine-green/5 transition">
              Contacter le service commercial (+212 661 55 09 05)
            </a>
          </div>
        </div>
      </div>
    `;

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
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

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
      const floorBadge = document.getElementById('floorBadgeLabelMobile');
      if (floorBadge) floorBadge.textContent = text;
      if (floorMaxLabel) floorMaxLabel.textContent = val === -1 ? 'All' : (val === 0 ? 'RDC' : `R+${val}`);
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

  // Only show the floating filter pill when user scrolls down towards/into #Picker!
  function updateMobileFilterBar() {
    if (!mobileFilterBar || !pickerSection) return;
    const rect = pickerSection.getBoundingClientRect();
    // When the top of Picker is in or approaching viewport and bottom is not passed
    if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= 150) {
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

