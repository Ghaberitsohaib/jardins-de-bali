// ==========================================================================
// BAYTIMMO - BUSINESS SPACES SPECIFIC INTERACTIONS & SCROLL (1:1 BELGRADE ARBOR)
// ==========================================================================

import './arbor.css';
import './business.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion, initScrollReveals, MOTION_CONFIG } from './motion.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED INERTIAL SMOOTH SCROLL (LENIS + GSAP)
  // ==========================================
  const lenis = initMotion({ pageName: 'business' });

  // Soft reveals for business highlights & sections
  initScrollReveals('.biz-option-item, .business-card, #businessSpecsGrid > div', {
    distance: MOTION_CONFIG.reveal.distance,
    duration: MOTION_CONFIG.reveal.duration,
    ease: MOTION_CONFIG.reveal.ease,
  });

  // ==========================================
  // 2. GOLDEN SILK CURSOR TRAIL (#canvas)
  // Exact 10-trail quadraticCurveTo physics
  // ==========================================
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numPoints = 14;
    const trail = [];
    for (let i = 0; i < numPoints; i++) {
      trail.push({ x: width / 2, y: height / 2 });
    }

    let mouse = { x: width / 2, y: height / 2 };
    let isMoving = false;
    let idleTimer = null;

    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 500);
    });

    function renderTrail() {
      ctx.clearRect(0, 0, width, height);

      let p0 = trail[0];
      p0.x += (mouse.x - p0.x) * 0.35;
      p0.y += (mouse.y - p0.y) * 0.35;

      for (let i = 1; i < numPoints; i++) {
        const p = trail[i];
        const prev = trail[i - 1];
        p.x += (prev.x - p.x) * 0.32;
        p.y += (prev.y - p.y) * 0.32;
      }

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < numPoints - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }

      ctx.strokeStyle = 'rgba(195, 163, 102, 0.45)';
      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      requestAnimationFrame(renderTrail);
    }
    renderTrail();
  }

  // ==========================================
  // 3. FLOATING EXPANDABLE PILL HEADER & MENU
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

  if (arborMenuToggle) {
    arborMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (arborHeader && arborHeader.classList.contains('is-open')) {
        closeArborMenu();
      } else {
        openArborMenu();
      }
    });
  }

  if (arborMenuBackdrop) {
    arborMenuBackdrop.addEventListener('click', closeArborMenu);
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          closeArborMenu();
          lenis.scrollTo(el, { offset: -30, duration: 1.2 });
        }
      }
    });
  });

  // ==========================================
  // 4. HERO SECTION PARALLAX SCRUB
  // ==========================================
  const heroSec = document.getElementById('Hero');
  if (heroSec) {
    const heroBg = heroSec.querySelector('.background');
    if (heroBg) {
      gsap.to(heroBg, {
        y: '8rem',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSec,
          start: 'top top',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      });
    }
  }

  // ==========================================
  // 5. BUSINESS & RETAIL SPACES OPTIONS (#BusinessSpacesOptions)
  // ==========================================
  const busSection = document.getElementById('BusinessSpacesOptions');
  if (busSection) {
    const retailTrigger = busSection.querySelector('.retail-spaces-trigger') || busSection;

    // Image Parallax (Desktop only to keep mobile pristine)
    const slideImgs = Array.from(busSection.querySelectorAll('.biz-slide-img'));
    if (slideImgs.length && window.innerWidth >= 1024) {
      gsap.to(slideImgs, {
        y: '5rem',
        ease: 'none',
        scrollTrigger: {
          trigger: retailTrigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      });
    }

    // Tab Switcher with is-active class & Blueprint mapping
    const optionItems = Array.from(busSection.querySelectorAll('.biz-option-item'));
    const detailPanels = Array.from(busSection.querySelectorAll('.biz-detail-panel'));
    const blueprintBtn = document.getElementById('bizBlueprintBtn');

    const blueprintData = [
      { 
        url: '/jardins_de_bali/plan_03_rez_de_chaussee.jpg', 
        title: 'Plan RDC — 4 Grands Magasins Flagships (56 m² à 221 m²)', 
        img: '/business/retail/magasin_2_flagship.jpg',
        alt: 'Magasins Flagships RDC Jardins de Bali'
      },
      { 
        url: '/jardins_de_bali/plan_04_mezzanine.jpg', 
        title: 'Plan Mezzanine — 4 Mezzanines Commerciales (244 m²)', 
        img: '/business/retail/magasin_4_showroom.jpg',
        alt: 'Mezzanines Showrooms Jardins de Bali'
      },
      { 
        url: '/jardins_de_bali/plan_03_rez_de_chaussee.jpg', 
        title: 'Plan RDC & Mezzanine — Esplanade & 19 Duplexes (101 à 234 m²)', 
        img: '/business/retail/bureau_executive_suite_bali.jpg',
        alt: 'Esplanade et Duplex RDC Jardins de Bali'
      },
      { 
        url: '/jardins_de_bali/plan_02_sous_sol_1.jpg', 
        title: 'Plan Sous-Sol 1 & 2 — 234 Places de Parking & 15 Boxes', 
        img: '/business/retail/parking_prestige_jardins_bali.jpg',
        alt: 'Parkings Sécurisés et Sous-Sols Jardins de Bali'
      },
    ];

    let currentOptionIdx = 0;
    let autoPlayTimer = null;
    const AUTOPLAY_INTERVAL = 3500; // 3.5s smooth, calm luxury rhythm (Zero lag)

    const setActiveOption = (idx) => {
      currentOptionIdx = idx;

      // 1. Update tab indicators & text style
      optionItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      // 2. Update detail panels
      detailPanels.forEach((panel, i) => {
        if (i === idx) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });

      // 3. Pure GPU hardware-accelerated crossfade (zero decode lag)
      slideImgs.forEach((img, i) => {
        if (i === idx) {
          img.classList.add('is-active');
        } else {
          img.classList.remove('is-active');
        }
      });
    };

    const nextOption = () => {
      const nextIdx = (currentOptionIdx + 1) % optionItems.length;
      setActiveOption(nextIdx);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextOption, AUTOPLAY_INTERVAL);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    // User click switches immediately and resets the timer
    optionItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        setActiveOption(idx);
        startAutoPlay();
      });
    });

    if (blueprintBtn) {
      blueprintBtn.addEventListener('click', () => {
        const bp = blueprintData[currentOptionIdx] || blueprintData[0];
        if (typeof window.openBlueprintModal === 'function') {
          window.openBlueprintModal(bp.url, bp.title);
        }
      });
    }

    // Initialize with index 0
    setActiveOption(0);

    // Auto-cycle only when in view, pause when out of view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAutoPlay();
            } else {
              stopAutoPlay();
            }
          });
        },
        { rootMargin: '50px 0px 50px 0px', threshold: 0.1 }
      );
      observer.observe(busSection);
    } else {
      startAutoPlay();
    }
  }

  // ==========================================
  // 7. PANORAMA SECTION PARALLAX
  // ==========================================
  const panoSection = document.getElementById('Panorama');
  if (panoSection) {
    const panoBg = panoSection.querySelector('.background');
    if (panoBg) {
      gsap.to(panoBg, {
        y: '8rem',
        ease: 'none',
        scrollTrigger: {
          trigger: panoSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      });
    }
  }

  // ==========================================
  // 8. FOOTER FADE-IN ANIMATION
  // ==========================================
  const footer = document.querySelector('footer');
  if (footer) {
    const fadeEls = footer.querySelectorAll('.fadeElement');
    if (fadeEls.length) {
      gsap.from(fadeEls, {
        opacity: 0,
        y: '1.5rem',
        stagger: MOTION_CONFIG.reveal.stagger,
        duration: MOTION_CONFIG.reveal.duration,
        ease: MOTION_CONFIG.reveal.ease,
        scrollTrigger: {
          trigger: footer.querySelector('.wrapper') || footer,
          start: 'top 80%',
        },
      });
    }
  }

  // ==========================================
  // 9. MODALS: PROMO VIDEO & BLUEPRINT LIGHTBOX
  // ==========================================
  const openVideoBtn = document.getElementById('openPromoVideoBtn');
  const closeVideoBtn = document.getElementById('closePromoVideoBtn');
  const videoModal = document.getElementById('promoVideoModal');
  const videoPlayer = document.getElementById('promoVideoPlayer');

  if (openVideoBtn && videoModal && videoPlayer) {
    openVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('is-open');
      videoPlayer.play().catch(() => {});
    });
  }

  const closeVideo = () => {
    if (videoModal && videoPlayer) {
      videoModal.classList.remove('is-open');
      videoPlayer.pause();
    }
  };

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideo();
    });
  }

  const blueprintModal = document.getElementById('blueprintModal');
  const blueprintModalImg = document.getElementById('blueprintModalImg');
  const blueprintModalTitle = document.getElementById('blueprintModalTitle');
  const closeBlueprintBtn = document.getElementById('closeBlueprintBtn');

  window.openBlueprintModal = (src, title) => {
    if (blueprintModal && blueprintModalImg) {
      blueprintModalImg.src = src;
      if (blueprintModalTitle) {
        blueprintModalTitle.textContent = title || 'Plan Architectural Officiel';
      }
      blueprintModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBlueprint = () => {
    if (blueprintModal) {
      blueprintModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  if (closeBlueprintBtn) closeBlueprintBtn.addEventListener('click', closeBlueprint);
  if (blueprintModal) {
    blueprintModal.addEventListener('click', (e) => {
      if (e.target === blueprintModal) closeBlueprint();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (blueprintModal && blueprintModal.classList.contains('is-open')) closeBlueprint();
      if (videoModal && videoModal.classList.contains('is-open')) closeVideo();
    }
  });

  // ==========================================
  // 6. BUSINESS FOOTER FORM & TOAST
  // ==========================================
  const businessFooterForm = document.getElementById('businessFooterForm');
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

  if (businessFooterForm) {
    businessFooterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      businessFooterForm.reset();
      showToast('Merci pour votre intérêt. Notre équipe commerciale vous contactera dans les plus brefs délais.');
    });
  }
});
