import { propertiesData } from './data/properties.js';
import { translations } from './data/translations.js';

/* ==========================================================================
   APP STATE
   ========================================================================== */
const state = {
  currency: localStorage.getItem('kensington_currency') || 'MAD',
  language: localStorage.getItem('kensington_lang') || 'fr',
  filters: {
    location: '',
    type: '',
    budget: '',
    sort: 'recent'
  },
  visibleCount: 12,
  favorites: JSON.parse(localStorage.getItem('kensington_favs') || '[]')
};

const CURRENCY_RATES = {
  EUR: { symbol: '€', rate: 1, suffix: true },
  MAD: { symbol: 'DH', rate: 10.8, suffix: true },
  USD: { symbol: '$', rate: 1.09, suffix: false },
  GBP: { symbol: '£', rate: 0.86, suffix: false }
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initStickyHeader();
  initCurrencySwitcher();
  initLanguageSwitcher();
  initFilterToolbar();
  initModals();
  initMobileDrawer();
  initLoadMore();

  // Initial render
  renderVentesGrid();
});

function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  if (!stickyHeader) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 240) {
      stickyHeader.classList.add('visible');
    } else {
      stickyHeader.classList.remove('visible');
    }
  });
}

/* ==========================================================================
   PARSE URL PARAMS (e.g. ?city=Marrakech or ?type=villa)
   ========================================================================== */
function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const city = urlParams.get('city') || urlParams.get('location');
  if (city) {
    state.filters.location = city;
    const locSelect = document.getElementById('ventesLocationSelect');
    if (locSelect) locSelect.value = city;
  }

  const type = urlParams.get('type');
  if (type) {
    state.filters.type = type;
    const typeSelect = document.getElementById('ventesTypeSelect');
    if (typeSelect) typeSelect.value = type;
  }

  const budget = urlParams.get('budget');
  if (budget) {
    state.filters.budget = budget;
    const budgetSelect = document.getElementById('ventesBudgetSelect');
    if (budgetSelect) budgetSelect.value = budget;
  }
}

/* ==========================================================================
   CURRENCY FORMATTING & SWITCHER
   ========================================================================== */
function formatPrice(item) {
  if (item.isPSD) {
    return `<span class="card-price psd-price">Prix sur Demande</span>`;
  }

  const info = CURRENCY_RATES[state.currency] || CURRENCY_RATES.EUR;
  const converted = Math.round(item.priceEUR * info.rate);
  const formatted = new Intl.NumberFormat('fr-FR').format(converted);

  const priceStr = info.suffix 
    ? `${formatted} ${info.symbol}` 
    : `${info.symbol}${formatted}`;

  return `<div class="card-price">${priceStr}</div>`;
}

function initCurrencySwitcher() {
  const selector = document.getElementById('currencySelector');
  if (!selector) return;

  selector.value = state.currency;
  selector.addEventListener('change', (e) => {
    state.currency = e.target.value;
    localStorage.setItem('kensington_currency', state.currency);
    renderVentesGrid();
    showToast(`Devise changée en ${state.currency}`);
  });
}

/* ==========================================================================
   LANGUAGE SWITCHER
   ========================================================================== */
function initLanguageSwitcher() {
  const selector = document.getElementById('languageSelector');
  if (!selector) return;

  selector.value = state.language;
  selector.addEventListener('change', (e) => {
    state.language = e.target.value;
    localStorage.setItem('kensington_lang', state.language);
    applyTranslations(state.language);
    showToast(`Langue : ${state.language.toUpperCase()}`);
  });
}

function applyTranslations(lang) {
  const t = translations[lang] || translations.fr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

/* ==========================================================================
   FILTER TOOLBAR
   ========================================================================== */
function initFilterToolbar() {
  const locSelect = document.getElementById('ventesLocationSelect');
  const typeSelect = document.getElementById('ventesTypeSelect');
  const budgetSelect = document.getElementById('ventesBudgetSelect');
  const sortSelect = document.getElementById('ventesSortSelect');
  const resetBtn = document.getElementById('resetVentesFiltersBtn');

  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      state.filters.location = e.target.value;
      state.visibleCount = 12;
      renderVentesGrid();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      state.visibleCount = 12;
      renderVentesGrid();
    });
  }

  if (budgetSelect) {
    budgetSelect.addEventListener('change', (e) => {
      state.filters.budget = e.target.value;
      state.visibleCount = 12;
      renderVentesGrid();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      renderVentesGrid();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.filters = { location: '', type: '', budget: '', sort: 'recent' };
      state.visibleCount = 12;
      if (locSelect) locSelect.value = '';
      if (typeSelect) typeSelect.value = '';
      if (budgetSelect) budgetSelect.value = '';
      if (sortSelect) sortSelect.value = 'recent';
      renderVentesGrid();
      showToast('Filtres réinitialisés');
    });
  }
}

/* ==========================================================================
   FILTER & SORT LOGIC
   ========================================================================== */
function getFilteredAndSortedProperties() {
  // 1. Only sales properties
  let list = propertiesData.filter(p => p.category === 'ventes');

  // 2. Filter by location
  if (state.filters.location) {
    const targetLoc = state.filters.location.toLowerCase();
    list = list.filter(p => p.city.toLowerCase() === targetLoc);
  }

  // 3. Filter by type
  if (state.filters.type) {
    const targetType = state.filters.type.toLowerCase();
    list = list.filter(p => p.type.toLowerCase() === targetType);
  }

  // 4. Filter by budget
  if (state.filters.budget) {
    const b = state.filters.budget;
    if (b === 'under2m') {
      list = list.filter(p => !p.isPSD && p.priceEUR < 2000000);
    } else if (b === '2m-5m') {
      list = list.filter(p => !p.isPSD && p.priceEUR >= 2000000 && p.priceEUR <= 5000000);
    } else if (b === '5m-10m') {
      list = list.filter(p => !p.isPSD && p.priceEUR > 5000000 && p.priceEUR <= 10000000);
    } else if (b === 'above10m') {
      list = list.filter(p => !p.isPSD && p.priceEUR > 10000000);
    } else if (b === 'psd') {
      list = list.filter(p => p.isPSD === true);
    }
  }

  // 5. Sorting
  const sort = state.filters.sort;
  if (sort === 'price-asc') {
    list.sort((a, b) => {
      if (a.isPSD && !b.isPSD) return 1;
      if (!a.isPSD && b.isPSD) return -1;
      return (a.priceEUR || 0) - (b.priceEUR || 0);
    });
  } else if (sort === 'price-desc') {
    list.sort((a, b) => {
      if (a.isPSD && !b.isPSD) return -1;
      if (!a.isPSD && b.isPSD) return 1;
      return (b.priceEUR || 0) - (a.priceEUR || 0);
    });
  } else if (sort === 'title-asc') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  return list;
}

/* ==========================================================================
   RENDER VENTES GRID
   ========================================================================== */
function renderVentesGrid() {
  const grid = document.getElementById('ventesPropertiesGrid');
  const countEl = document.getElementById('ventesCountNumber');
  const loadMoreBtn = document.getElementById('loadMoreVentesBtn');

  if (!grid) return;

  const allFiltered = getFilteredAndSortedProperties();

  // Update counter
  if (countEl) {
    countEl.textContent = allFiltered.length;
  }

  if (allFiltered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 4px; border: 1px solid var(--color-border);">
        <i class="fa-solid fa-house-chimney-crack" style="font-size: 3rem; margin-bottom: 16px; color: var(--color-accent-gold);"></i>
        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 10px; color: var(--color-primary);">
          Aucune propriété ne correspond à ces critères exacts
        </h3>
        <p style="color: var(--color-text-muted); max-width: 540px; margin: 0 auto 24px auto;">
          Notre portefeuille compte également des biens hors-marché (Off-Market) sous clause de confidentialité. Contactez nos directeurs d'agence pour une sélection sur mesure.
        </p>
        <button class="btn-outline-gold open-contact-btn" style="background-color: var(--color-primary); color: #ffffff;">
          <i class="fa-solid fa-lock"></i> Demander le catalogue confidentiel Off-Market
        </button>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  // Slice visible items
  const visibleItems = allFiltered.slice(0, state.visibleCount);

  grid.innerHTML = visibleItems.map(prop => createPropertyCardHTML(prop)).join('');

  // Handle load more button visibility
  if (loadMoreBtn) {
    if (visibleItems.length < allFiltered.length) {
      loadMoreBtn.style.display = 'inline-flex';
      const remaining = allFiltered.length - visibleItems.length;
      loadMoreBtn.querySelector('span').textContent = `Charger plus de propriétés (${remaining} restantes)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  attachCardEvents();
}

function createPropertyCardHTML(item) {
  const isFav = state.favorites.includes(item.id);
  const formattedPriceHTML = formatPrice(item);

  return `
    <article class="property-card" data-id="${item.id}">
      <div class="card-media-wrap">
        <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy" />
        ${item.badge ? `<span class="card-badge ${item.badge === 'Exclusivité' || item.isPSD ? 'gold' : ''}">${item.badge}</span>` : ''}
        <span class="card-category-tag">${item.typeLabel || 'Propriété de Prestige'}</span>
        <button class="card-favorite-btn ${isFav ? 'active' : ''}" data-fav-id="${item.id}" aria-label="Ajouter aux favoris">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>

      <div class="card-content">
        <div class="card-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${item.city}${item.district ? ' • ' + item.district : ''}</span>
        </div>
        
        <h3 class="card-title">${item.title}</h3>

        <div class="card-specs">
          ${item.bedrooms ? `<span class="spec-item"><i class="fa-solid fa-bed"></i> ${item.bedrooms} ch.</span>` : ''}
          ${item.bathrooms ? `<span class="spec-item"><i class="fa-solid fa-bath"></i> ${item.bathrooms} sdb</span>` : ''}
          ${item.surface ? `<span class="spec-item"><i class="fa-solid fa-vector-square"></i> ${item.surface} m²</span>` : ''}
          ${item.landSurface ? `<span class="spec-item"><i class="fa-solid fa-tree"></i> ${item.landSurface} m²</span>` : ''}
        </div>

        <div class="card-footer">
          <div class="card-price-wrap">
            <span class="price-label">Prix</span>
            ${formattedPriceHTML}
          </div>

          <div class="card-actions">
            <button class="btn-card-view view-prop-detail" data-id="${item.id}">
              Voir
            </button>
            <a href="https://wa.me/212665644391?text=Bonjour%20BaytImmo,%20je%20souhaite%20des%20informations%20sur%20la%20propriété%20${encodeURIComponent(item.title)}%20(Réf:%20${item.id})." target="_blank" rel="noopener" class="btn-card-whatsapp" title="Contacter par WhatsApp VIP">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents() {
  // Favorite buttons
  document.querySelectorAll('.card-favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      const idx = state.favorites.indexOf(id);
      if (idx > -1) {
        state.favorites.splice(idx, 1);
        btn.classList.remove('active');
        btn.querySelector('i').className = 'fa-regular fa-heart';
        showToast('Propriété retirée des favoris');
      } else {
        state.favorites.push(id);
        btn.classList.add('active');
        btn.querySelector('i').className = 'fa-solid fa-heart';
        showToast('Propriété ajoutée aux favoris');
      }
      localStorage.setItem('kensington_favs', JSON.stringify(state.favorites));
    });
  });

  // Card view buttons and card click
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-favorite-btn') || e.target.closest('.btn-card-whatsapp')) {
        return;
      }
      const id = card.getAttribute('data-id');
      openPropertyModal(id);
    });
  });
}

/* ==========================================================================
   LOAD MORE / PAGINATION
   ========================================================================== */
function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreVentesBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += 9;
      renderVentesGrid();
    });
  }
}

/* ==========================================================================
   MODALS SYSTEM
   ========================================================================== */
function initModals() {
  // Property Quick View Modal
  const propModal = document.getElementById('propertyModalBackdrop');
  const closePropBtn = document.getElementById('closePropertyModalBtn');

  if (closePropBtn && propModal) {
    closePropBtn.addEventListener('click', () => {
      propModal.classList.remove('open');
    });

    propModal.addEventListener('click', (e) => {
      if (e.target === propModal) propModal.classList.remove('open');
    });
  }

  // Contact / Valuation Modal
  const contactModal = document.getElementById('contactModalBackdrop');
  const closeContactBtn = document.getElementById('closeContactModalBtn');
  const openValuationBtn = document.getElementById('openValuationModalBtn');
  const contactForm = document.getElementById('contactForm');

  if (openValuationBtn && contactModal) {
    openValuationBtn.addEventListener('click', () => {
      contactModal.classList.add('open');
    });
  }

  document.querySelectorAll('.open-contact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (contactModal) contactModal.classList.add('open');
    });
  });

  if (closeContactBtn && contactModal) {
    closeContactBtn.addEventListener('click', () => {
      contactModal.classList.remove('open');
    });

    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) contactModal.classList.remove('open');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactFullName')?.value || 'Client';
      if (contactModal) contactModal.classList.remove('open');
      contactForm.reset();
      showToast(`Merci ${name}, votre demande confidentielle a été transmise à nos conseillers Kensington.`);
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      closeMobileDrawer();
    }
  });
}

function openPropertyModal(id) {
  const item = propertiesData.find(p => p.id === id);
  if (!item) return;

  const modal = document.getElementById('propertyModalBackdrop');
  const mainImg = document.getElementById('modalMainImg');
  const thumbsWrap = document.getElementById('modalThumbs');

  // Populate data
  const titleEl = document.getElementById('modalTitle');
  if (titleEl) titleEl.textContent = item.title;

  const locEl = document.getElementById('modalLocation');
  if (locEl) locEl.textContent = `${item.city}, ${item.district || ''}`;

  const refEl = document.getElementById('modalRef');
  if (refEl) refEl.textContent = `Réf: ${item.id} • ${item.typeLabel}`;

  const priceEl = document.getElementById('modalPrice');
  if (priceEl) priceEl.innerHTML = formatPrice(item);

  const badgeEl = document.getElementById('modalBadge');
  if (badgeEl) badgeEl.textContent = item.badge || (item.isPSD ? 'Prix sur Demande' : 'Exclusivité');

  const bedEl = document.getElementById('modalBedrooms');
  if (bedEl) {
    const span = bedEl.querySelector('span');
    if (span) span.textContent = item.bedrooms || '—';
  }

  const roomEl = document.getElementById('modalRooms');
  if (roomEl) {
    const span = roomEl.querySelector('span');
    if (span) span.textContent = item.rooms || item.bathrooms || '—';
  }

  const surfEl = document.getElementById('modalSurface');
  if (surfEl) {
    const span = surfEl.querySelector('span');
    if (span) span.textContent = item.surface ? `${item.surface} m²` : '—';
  }

  const landEl = document.getElementById('modalLand');
  if (landEl) {
    const span = landEl.querySelector('span');
    if (span) span.textContent = item.landSurface ? `${item.landSurface} m²` : 'En copropriété';
  }

  const descEl = document.getElementById('modalDesc');
  if (descEl) descEl.textContent = item.description;

  // Amenities
  const amenGrid = document.getElementById('modalAmenities');
  if (amenGrid && item.amenities) {
    amenGrid.innerHTML = item.amenities.map(a => `
      <div class="amenity-chip">
        <i class="fa-solid fa-circle-check"></i>
        <span>${a}</span>
      </div>
    `).join('');
  }

  // Gallery
  if (mainImg) {
    mainImg.src = item.image;
    mainImg.alt = item.title;
  }

  if (thumbsWrap) {
    const gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
    thumbsWrap.innerHTML = gallery.map((gImg, idx) => `
      <img src="${gImg}" alt="${item.title}" class="prop-thumb ${idx === 0 ? 'active' : ''}" data-full="${gImg}" />
    `).join('');

    thumbsWrap.querySelectorAll('.prop-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbsWrap.querySelectorAll('.prop-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) mainImg.src = thumb.getAttribute('data-full');
      });
    });
  }

  // WhatsApp Link
  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/212665644391?text=Bonjour%20BaytImmo,%20je%20suis%20intéressé(e)%20par%20la%20propriété%20${encodeURIComponent(item.title)}%20(Réf:%20${item.id}).%20Pouvez-vous%20m'organiser%20une%20visite%20privée%20?`;
  }

  if (modal) modal.classList.add('open');
}

/* ==========================================================================
   MOBILE DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawer = document.getElementById('mobileDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      closeMobileDrawer();
    });
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) drawer.classList.remove('open');
}

/* ==========================================================================
   TOAST NOTICE
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

// Smooth scroll links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
