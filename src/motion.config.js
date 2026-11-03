/**
 * MOTION & SCROLL CENTRAL CONFIGURATION
 * Single source of truth for app-wide motion, easing, inertial scroll, and reveals.
 * Tweak values here to adjust the entire application's motion feel.
 */

export const MOTION_CONFIG = {
  // Lenis Inertial Smooth Scroll
  scroll: {
    lerp: 0.082,             // Inertial damping (0.07 = very heavy, 0.09 = responsive)
    wheelMultiplier: 0.8,     // Wheel speed control (smooth, controlled momentum)
    touchMultiplier: 1.4,     // Natural mobile touch scroll
    syncTouch: false,
    duration: 1.2,
  },

  // Soft Reveal on Scroll (ScrollTrigger based)
  reveal: {
    duration: 1.1,            // Duration of reveal animation (1.0 - 1.4s)
    distance: 40,             // Vertical distance in pixels (translateY)
    ease: 'power3.out',       // Premium weighted ease
    easeSnappy: 'expo.out',
    stagger: 0.08,            // Stagger between sequential children
    start: 'top 88%',         // Trigger position relative to viewport
    once: true,               // Keep revealed once triggered
  },

  // Parallax & Scrubbed Elements (Inertial trailing)
  scrub: {
    factor: 1,                // 1 second of inertial trailing
    ease: 'none',
  },

  // Typewriter Animation
  typewriter: {
    minDelay: 35,             // Min typing delay per character (ms)
    maxDelay: 70,             // Max typing delay per character (ms)
    cursorBlinkSpeed: 0.75,   // Cursor blink cycle (seconds)
    cursorChar: '|',
  },

  // Accessibility Check
  isReducedMotion() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
};

export default MOTION_CONFIG;

