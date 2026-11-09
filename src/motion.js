import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_CONFIG } from './motion.config.js';

export { MOTION_CONFIG };

gsap.registerPlugin(ScrollTrigger);

let globalLenis = null;
let isMotionInitialized = false;

/**
 * Injects official recommended Lenis styles if not already in document
 */
function injectLenisStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('lenis-core-styles')) return;

  const style = document.createElement('style');
  style.id = 'lenis-core-styles';
  style.textContent = `
    html.lenis, html.lenis body {
      height: auto;
    }
    .lenis.lenis-smooth {
      scroll-behavior: auto !important;
    }
    .lenis.lenis-smooth [data-lenis-prevent] {
      overscroll-behavior: contain;
    }
    .lenis.lenis-stopped {
      overflow: hidden;
    }
    .lenis.lenis-scrolling iframe {
      pointer-events: none;
    }
    /* Smooth cursor blink for typewriter */
    @keyframes typewriterCursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .motion-typewriter-cursor {
      display: inline-block;
      margin-left: 2px;
      font-weight: 300;
      color: inherit;
      animation: typewriterCursorBlink 0.8s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Automatically flags internal scroll containers with data-lenis-prevent
 */
function protectInternalScrollContainers() {
  if (typeof document === 'undefined') return;
  const selectors = [
    '#singleAppartmentModal',
    '[role="dialog"]',
    '.modal-body',
    '.overflow-y-auto',
    '.overflow-y-scroll',
    '.arbor-menu-drawer',
    '#mobileMenuDrawer'
  ];

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.hasAttribute('data-lenis-prevent')) {
        el.setAttribute('data-lenis-prevent', '');
      }
    });
  });
}

/**
 * Initializes app-wide Lenis + GSAP synchronization once
 */
export function initMotion(options = {}) {
  if (typeof window === 'undefined') return null;

  injectLenisStyles();
  protectInternalScrollContainers();

  // If Lenis already exists on window, return it
  if (globalLenis) {
    return globalLenis;
  }

  const isReduced = MOTION_CONFIG.isReducedMotion();

  // Create Lenis instance with config
  const lenis = new Lenis({
    lerp: isReduced ? 1 : MOTION_CONFIG.scroll.lerp,
    wheelMultiplier: MOTION_CONFIG.scroll.wheelMultiplier,
    touchMultiplier: MOTION_CONFIG.scroll.touchMultiplier,
    syncTouch: MOTION_CONFIG.scroll.syncTouch,
    smoothWheel: !isReduced,
    duration: MOTION_CONFIG.scroll.duration,
  });

  globalLenis = lenis;
  window.__lenis = lenis;

  // Sync with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  // Use optimal lagSmoothing to prevent frame-drop stutter/jumps on mobile touch scroll
  gsap.ticker.lagSmoothing(500, 33);

  // Clean up on page navigation/unload
  window.addEventListener('beforeunload', () => {
    try {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf('*');
      lenis.destroy();
    } catch (_) {}
  });

  // Re-observe any dynamically inserted modals
  const observer = new MutationObserver(() => {
    protectInternalScrollContainers();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  isMotionInitialized = true;
  return lenis;
}

/**
 * Fluid ScrollTrigger Reveal helper
 * Applies soft fade + translateY(40px) with power3.out ease.
 * Uses ScrollTrigger.batch for superior performance with multiple elements.
 * Uses only transform (y) and opacity (autoAlpha), clears will-change upon finish.
 */
export function initScrollReveals(targetSelector = '[data-reveal]', customOptions = {}) {
  if (typeof document === 'undefined') return;

  const elements = typeof targetSelector === 'string'
    ? gsap.utils.toArray(targetSelector)
    : (Array.isArray(targetSelector) ? targetSelector : [targetSelector]);

  if (!elements || elements.length === 0) return;

  const isReduced = MOTION_CONFIG.isReducedMotion();
  const opts = { ...MOTION_CONFIG.reveal, ...customOptions };

  if (isReduced) {
    gsap.set(elements, { autoAlpha: 1, y: 0, clearProps: 'all' });
    return;
  }

  // Pre-set initial hidden state (use opacity: 0 without visibility: hidden so text remains accessible)
  gsap.set(elements, {
    opacity: 0,
    y: opts.distance,
    willChange: 'transform, opacity',
  });

  ScrollTrigger.batch(elements, {
    start: opts.start || 'top 92%',
    once: opts.once !== undefined ? opts.once : true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: opts.duration,
        ease: opts.ease,
        stagger: opts.stagger,
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(batch, { clearProps: 'willChange' });
        },
      });
    },
  });
}

/**
 * Reusable Inertial Parallax with scrub: 1
 * Strictly animates transform (y or yPercent), never top/left/height.
 */
export function initParallax(elementSelector, { yPercent = 15, trigger, start = 'top bottom', end = 'bottom top' } = {}) {
  if (typeof document === 'undefined') return;
  if (MOTION_CONFIG.isReducedMotion()) return;

  const elements = gsap.utils.toArray(elementSelector);
  if (!elements.length) return;

  elements.forEach((el) => {
    const trig = trigger || el.closest('.trigger') || el.parentElement || el;
    gsap.fromTo(
      el,
      { yPercent: -Math.abs(yPercent), willChange: 'transform' },
      {
        yPercent: Math.abs(yPercent),
        ease: 'none',
        scrollTrigger: {
          trigger: trig,
          start,
          end,
          scrub: MOTION_CONFIG.scrub.factor,
        },
        onComplete: () => {
          gsap.set(el, { clearProps: 'willChange' });
        },
      }
    );
  });
}

/**
 * Natural, fluid typewriter animation
 * - Uses textContent (never innerHTML +=)
 * - Variable delay per character
 * - Reserves layout space to prevent cumulative layout shift (CLS)
 * - Uses requestAnimationFrame
 */
export function createTypewriter(element, options = {}) {
  if (!element) return;

  const fullText = options.text || element.getAttribute('data-typewriter') || element.textContent.trim();
  if (!fullText) return;

  const isReduced = MOTION_CONFIG.isReducedMotion();
  if (isReduced) {
    element.textContent = fullText;
    return;
  }

  const minDelay = options.minDelay || MOTION_CONFIG.typewriter.minDelay;
  const maxDelay = options.maxDelay || MOTION_CONFIG.typewriter.maxDelay;

  // Reserve space to prevent layout shifts
  const originalWidth = element.offsetWidth;
  const originalHeight = element.offsetHeight;
  if (originalHeight > 0) element.style.minHeight = `${originalHeight}px`;

  element.textContent = '';
  
  const textSpan = document.createElement('span');
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'motion-typewriter-cursor';
  cursorSpan.textContent = MOTION_CONFIG.typewriter.cursorChar;
  cursorSpan.setAttribute('aria-hidden', 'true');

  element.appendChild(textSpan);
  element.appendChild(cursorSpan);

  let charIndex = 0;
  let lastTimestamp = performance.now();
  let nextDelay = Math.random() * (maxDelay - minDelay) + minDelay;

  function step(currentTimestamp) {
    if (charIndex >= fullText.length) {
      if (options.onComplete) options.onComplete();
      return;
    }

    if (currentTimestamp - lastTimestamp >= nextDelay) {
      charIndex++;
      textSpan.textContent = fullText.slice(0, charIndex);
      lastTimestamp = currentTimestamp;
      nextDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      
      // Slight pause on punctuation
      const lastChar = fullText[charIndex - 1];
      if (['.', ',', '!', '?', ':'].includes(lastChar)) {
        nextDelay += 140;
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default {
  initMotion,
  initScrollReveals,
  initParallax,
  createTypewriter,
  MOTION_CONFIG,
};
