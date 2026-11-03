import './arbor.css';
import './residences.css';
import residencesData from './data/residences-data.json';
import { initMotion, initScrollReveals, MOTION_CONFIG } from './motion.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    maxSurface: 234,
    features: [],
    searchQuery: '',
    sortBy: 'default',
    viewMode: 'grid',
    pageLimit: 24,
  };

  const resultsGrid = document.getElementById('residencesGrid');
  const resultsTable = document.getElementById('residencesTable');
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
        if (state.category === 'Commerce' && item.type !== 'Commerce') return false;
        if (state.category !== 'Commerce') {
          if (item.type === 'Commerce') return false;
          if (item.category !== state.category) return false;
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

      // Features filter
      if (state.features.length > 0) {
        const hasAllFeatures = state.features.every((f) => item.features.includes(f));
        if (!hasAllFeatures) return false;
      }

      // Search query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesFloor = item.floorName.toLowerCase().includes(q);
        if (!matchesId && !matchesFloor) return false;
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

    if (state.viewMode === 'grid') {
      if (resultsTable) resultsTable.style.display = 'none';
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
            // Pick an illustrative layout cutout or preview
            const planIdx = (index % 12) + 1;
            const layoutThumb = `/home/residences-options/${planIdx}.webp`;
            
            return `
              <div class="residence-card group" data-id="${item.id}" role="button" tabindex="0">
                <div class="card-top-preview">
                  <img src="${layoutThumb}" alt="${item.id}" class="card-preview-img" loading="lazy" />
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
                  <div class="flex items-baseline justify-between">
                    <h3 class="card-apartment-id">${item.id}</h3>
                    <span class="font-editorialOld text-2xl text-golden">${item.surface.toFixed(2)} m²</span>
                  </div>
                  <div class="card-details-row">
                    <div class="card-specs-list">
                      <span class="card-spec-item highlight">${item.floorName}</span>
                      <span class="card-spec-item">${item.roomsText}</span>
                      <span class="card-spec-item text-xs text-golden">${item.features[0] || 'Parking Sous-sol'}</span>
                    </div>
                    <div class="card-see-more">
                      <span>Détails</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    } else {
      // Table view mode
      if (resultsGrid) resultsGrid.style.display = 'none';
      if (resultsTable) {
        resultsTable.style.display = 'table';
        const tbody = resultsTable.querySelector('tbody');
        if (tbody) {
          tbody.innerHTML = itemsToDisplay.map((item) => `
            <tr class="cursor-pointer" data-id="${item.id}">
              <td><span class="table-lot-title">${item.id}</span></td>
              <td><strong>${item.surface.toFixed(2)} m²</strong></td>
              <td>${item.floorName}</td>
              <td>${item.roomsText}</td>
              <td>${item.features.slice(0, 2).join(', ')}</td>
              <td>
                <button type="button" class="filter-pill" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Voir</button>
              </td>
            </tr>
          `).join('');
        }
      }
    }

    // Toggle Load More button
    if (loadMoreWrapper) {
      loadMoreWrapper.style.display = itemsToDisplay.length < filtered.length ? 'flex' : 'none';
    }

    // Attach click listeners to cards and rows
    document.querySelectorAll('.residence-card, tr[data-id]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        const unit = residencesData.find((u) => u.id === id);
        if (unit) openModal(unit);
      });
    });

    // Reveal newly rendered cards with smooth soft fade
    initScrollReveals(document.querySelectorAll('.residence-card'), {
      distance: 25,
      stagger: 0.04,
      duration: 0.9,
    });
    ScrollTrigger.refresh();
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

  // View mode toggle
  const gridViewBtn = document.getElementById('gridViewBtn');
  const tableViewBtn = document.getElementById('tableViewBtn');

  if (gridViewBtn && tableViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      gridViewBtn.classList.add('is-active');
      tableViewBtn.classList.remove('is-active');
      state.viewMode = 'grid';
      renderList();
    });
    tableViewBtn.addEventListener('click', () => {
      tableViewBtn.classList.add('is-active');
      gridViewBtn.classList.remove('is-active');
      state.viewMode = 'table';
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
      state.maxSurface = 234;
      state.features = [];
      state.searchQuery = '';
      state.sortBy = 'default';
      state.pageLimit = 24;

      if (surfaceSlider) surfaceSlider.value = 234;
      if (surfaceBadge) surfaceBadge.textContent = '234 m²';
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
  // 5. APARTMENT DETAILS MODAL
  // ==========================================
  const modalBackdrop = document.getElementById('apartmentModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalLotId = document.getElementById('modalLotId');
  const modalMainImg = document.getElementById('modalMainImg');
  const modalThumbsRow = document.getElementById('modalThumbsRow');
  const modalSurface = document.getElementById('modalSurface');
  const modalFloor = document.getElementById('modalFloor');
  const modalRooms = document.getElementById('modalRooms');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalWaLink = document.getElementById('modalWaLink');
  const modalPlanDownload = document.getElementById('modalPlanDownload');

  function openModal(unit) {
    if (!modalBackdrop) return;
    if (modalLotId) modalLotId.textContent = unit.id;
    if (modalSurface) modalSurface.textContent = `${unit.surface.toFixed(2)} m²`;
    if (modalFloor) modalFloor.textContent = unit.floorName;
    if (modalRooms) modalRooms.textContent = unit.roomsText;
    if (modalFeatures) modalFeatures.textContent = unit.features.join(', ');

    // Main image defaults to architectural plan
    if (modalMainImg) {
      modalMainImg.src = unit.planImg;
      modalMainImg.alt = `Plan d'architecte ${unit.id}`;
    }

    // Download / Fullscreen plan link
    if (modalPlanDownload) {
      modalPlanDownload.href = unit.planImg;
      modalPlanDownload.setAttribute('target', '_blank');
    }

    // WhatsApp Direct Inquiry link
    if (modalWaLink) {
      const msg = encodeURIComponent(`Bonjour BaytImmo, je souhaite recevoir le dossier complet pour le lot ${unit.id} (${unit.surface} m², ${unit.floorName}) du projet Jardins de Bali à Marrakech.`);
      modalWaLink.href = `https://wa.me/212661550905?text=${msg}`;
    }

    // Populate thumbnails (Plan + Show apartment rooms)
    if (modalThumbsRow) {
      const gallery = [unit.planImg, ...unit.gallery];
      modalThumbsRow.innerHTML = gallery.map((src, i) => `
        <img src="${src}" alt="Visuel ${i + 1}" class="modal-thumb ${i === 0 ? 'is-active' : ''}" />
      `).join('');

      modalThumbsRow.querySelectorAll('.modal-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          modalThumbsRow.querySelectorAll('.modal-thumb').forEach((t) => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
          if (modalMainImg) modalMainImg.src = thumb.src;
        });
      });
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

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
      img: '/jardins_de_bali/plan_01_sous_sol_2.jpg'
    },
    'ss1': {
      title: 'Plan Sous-Sol -1 (Parking Niveau -1 & Locaux Techniques)',
      desc: 'Deuxième niveau de stationnement souterrain avec liaisons directes par ascenseurs vers les 4 cages d\'escaliers et les halls d\'entrée résidentiels.',
      img: '/jardins_de_bali/plan_02_sous_sol_1.jpg'
    },
    'rdc': {
      title: 'Plan Rez-de-Chaussée (Patio Central, 4 Magasins & 32 Résidences)',
      desc: 'Allée d\'accès arborée avec grande fontaine d\'eau, 4 grands magasins en façade sur rue et 32 appartements privatifs avec coursives intérieures.',
      img: '/jardins_de_bali/plan_03_rez_de_chaussee.jpg'
    },
    'mezz': {
      title: 'Plan Mezzanine (Extensions Commerciales & Bureaux)',
      desc: 'Espaces en mezzanine surplombant les locaux commerciaux du rez-de-chaussée pour boutiques de prestige et enseignes exclusives.',
      img: '/jardins_de_bali/plan_04_mezzanine.jpg'
    },
    'r1': {
      title: 'Plan 1er Étage (40 Appartements — App 33 à 72)',
      desc: 'Distribution optimisée autour des puits de lumière intérieurs et balcons extérieurs offrant une clarté naturelle tout au long de la journée.',
      img: '/jardins_de_bali/plan_05_1er_etage.jpg'
    },
    'r2': {
      title: 'Plan 2ème Étage (40 Appartements — App 73 à 112)',
      desc: 'Appartements d\'exception avec loggias et balcons paysagers, isolation acoustique renforcée et menuiseries aluminium à rupture thermique.',
      img: '/jardins_de_bali/plan_06_2eme_etage.jpg'
    },
    'r3': {
      title: 'Plan 3ème Étage (40 Appartements — App 113 à 152)',
      desc: 'Vues dégagées sur les jardins et le patio arboré, finitions soignées en travertin et marbre noble.',
      img: '/jardins_de_bali/plan_07_3eme_etage.jpg'
    },
    'r4': {
      title: 'Plan 4ème Étage (40 Appartements — App 153 à 192)',
      desc: 'Début des retraits architecturaux en gradins inspirés de l\'île de Bali avec terrasses suspendues arborées.',
      img: '/jardins_de_bali/plan_08_4eme_etage.jpg'
    },
    'r5': {
      title: 'Plan 5ème Étage (38 Appartements & Penthouses — App 193 à 230)',
      desc: 'Grand standing avec vastes terrasses panoramiques, suites de maître et accès direct au solarium et rooftop.',
      img: '/jardins_de_bali/plan_09_5eme_etage.jpg'
    },
    'toiture': {
      title: 'Plan Toiture-Terrasse & Rooftop (Double Piscine Suspendue)',
      desc: 'Espace bien-être d\'exception avec deux piscines à débordement, solarium en teck, transats panoramiques et vue imprenable sur Marrakech.',
      img: '/jardins_de_bali/plan_16_toiture_terrasse.jpg'
    },
    'facades': {
      title: 'Façade Principale & Coupes Longitudinales (AMA Architecture)',
      desc: 'Élévation de la façade avec ses lignes organiques courbes, ses brise-soleil verticaux et coupes structurelles AA et BB.',
      img: '/jardins_de_bali/plan_11_facade_principale.jpg'
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

  if (residencesFooterForm) {
    residencesFooterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      residencesFooterForm.reset();
      showToast("Merci ! Votre demande d'inscription aux Jardins de Bali a bien été enregistrée.");
    });
  }
});

