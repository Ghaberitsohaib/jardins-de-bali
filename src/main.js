import './arbor.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import * as THREE from 'three';
import { initMotion, MOTION_CONFIG } from './motion.js';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, SplitText);
window.__gsap = gsap;
window.__ScrollTrigger = ScrollTrigger;

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED INERTIAL SMOOTH SCROLL (LENIS + GSAP)
  // ==========================================
  const lenis = initMotion({ pageName: 'home' });

  // Flag to know whether the hero video has finished / final 3D image revealed
  let heroVideoFinished = false;

  // ==========================================
  // 2. TEXT SPLITTING UTILITY (Words & Chars)
  // ==========================================
  function splitText(element, { words = true, chars = true } = {}) {
    if (!element || element.dataset.splitDone === 'true') {
      return {
        words: element ? Array.from(element.querySelectorAll('.word')) : [],
        chars: element ? Array.from(element.querySelectorAll('.char')) : [],
      };
    }
    element.dataset.splitDone = 'true';

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (!text.trim()) return document.createTextNode(text);

        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            if (chars) {
              Array.from(part).forEach((ch) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = ch;
                wordSpan.appendChild(charSpan);
              });
            } else {
              wordSpan.textContent = part;
            }
            frag.appendChild(wordSpan);
          }
        });
        return frag;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          return node.cloneNode(false);
        }
        const clone = node.cloneNode(false);
        Array.from(node.childNodes).forEach((child) => {
          clone.appendChild(processNode(child));
        });
        return clone;
      }

      return node.cloneNode(true);
    };

    const children = Array.from(element.childNodes);
    element.innerHTML = '';
    children.forEach((child) => {
      element.appendChild(processNode(child));
    });

    return {
      words: Array.from(element.querySelectorAll('.word')),
      chars: Array.from(element.querySelectorAll('.char')),
    };
  }

  // ==========================================
  // 3. EXACT 10-TRAIL SILK CURSOR (#canvas)
  // Matching Belgrade Arbor quadraticCurveTo physics
  // ==========================================
  const cursorCanvas = document.getElementById('canvas');
  if (cursorCanvas && window.matchMedia('(min-width: 1121px)').matches) {
    const ctx = cursorCanvas.getContext('2d');
    if (ctx) {
      let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let lines = [];
      const config = {
        friction: 0.5,
        trails: 10,
        size: 10,
        dampening: 0.1,
        tension: 0.98,
      };

      function Node() {
        this.x = pointer.x;
        this.y = pointer.y;
        this.vy = 0;
        this.vx = 0;
      }

      function TrailLine(options) {
        this.spring = options.spring + 0.1 * Math.random() - 0.02;
        this.friction = config.friction + 0.01 * Math.random() - 0.002;
        this.nodes = [];
        for (let i = 0; i < config.size; i++) {
          this.nodes.push(new Node());
        }
      }

      TrailLine.prototype = {
        update: function () {
          // Prevent any stray chords or offscreen line stretches
          const dist = Math.hypot(pointer.x - this.nodes[0].x, pointer.y - this.nodes[0].y);
          if (dist > 350) {
            for (let k = 0; k < this.nodes.length; k++) {
              this.nodes[k].x = pointer.x;
              this.nodes[k].y = pointer.y;
              this.nodes[k].vx = 0;
              this.nodes[k].vy = 0;
            }
            return;
          }

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
        ctx.strokeStyle = 'hsla(34.19, 34.96%, 48.24%, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < lines.length; i++) {
          lines[i].update();
          lines[i].draw();
        }
        requestAnimationFrame(renderTrail);
      }

      function initTrailOnMove(e) {
        pointer.x = e.clientX || (e.touches && e.touches[0].pageX) || pointer.x;
        pointer.y = e.clientY || (e.touches && e.touches[0].pageY) || pointer.y;

        window.removeEventListener('mousemove', initTrailOnMove);
        window.removeEventListener('touchstart', initTrailOnMove);

        lines = [];
        for (let i = 0; i < config.trails; i++) {
          lines.push(new TrailLine({ spring: 0.4 + (i / config.trails) * 0.025 }));
        }

        window.addEventListener('mousemove', (ev) => {
          pointer.x = ev.clientX;
          pointer.y = ev.clientY;
        }, { passive: true });

        window.addEventListener('touchmove', (ev) => {
          if (ev.touches && ev.touches[0]) {
            pointer.x = ev.touches[0].pageX;
            pointer.y = ev.touches[0].pageY;
          }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
          for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].nodes.length; j++) {
              lines[i].nodes[j].vx = 0;
              lines[i].nodes[j].vy = 0;
            }
          }
          ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        });

        document.addEventListener('mouseenter', (ev) => {
          pointer.x = ev.clientX;
          pointer.y = ev.clientY;
          for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].nodes.length; j++) {
              lines[i].nodes[j].x = pointer.x;
              lines[i].nodes[j].y = pointer.y;
              lines[i].nodes[j].vx = 0;
              lines[i].nodes[j].vy = 0;
            }
          }
        });

        running = true;
        renderTrail();
      }

      window.addEventListener('mousemove', initTrailOnMove);
      window.addEventListener('touchstart', initTrailOnMove);

      window.addEventListener('focus', () => {
        if (!running && lines.length > 0) {
          running = true;
          renderTrail();
        }
      });
      window.addEventListener('blur', () => {
        running = true;
      });
    }
  }

  // ==========================================
  // 4. HERO PRELOADER, VIDEO CUT & HEADER PILL
  // ==========================================
  const arborHeader = document.getElementById('overlayHeader') || document.querySelector('.arbor-header');
  const arborMenuToggle = document.getElementById('mobileMenuToggle') || document.getElementById('arborMenuToggle') || document.querySelector('.arbor-menu-btn');
  const arborMenuBackdrop = document.getElementById('arborMenuBackdrop');
  const arborLoader = document.getElementById('arborLoader');
  const arborLoaderPercent = document.getElementById('arborLoaderPercent');
  const arborLoaderFill = document.getElementById('arborLoaderFill');
  const heroVideo = document.getElementById('arborHeroVideo');
  const heroFinalImg = document.getElementById('arborHeroFinalImg');
  const heroTitleOverlay = document.getElementById('arborGiantTitle');
  const heroTitleHeading = document.getElementById('arborHeroHeading');

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
    arborMenuBackdrop.addEventListener('click', () => {
      closeArborMenu();
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && arborHeader && arborHeader.classList.contains('is-open')) {
      closeArborMenu();
    }
  });

  // Clicking outside the floating card closes it
  document.addEventListener('click', (e) => {
    if (arborHeader && arborHeader.classList.contains('is-open')) {
      if (!arborHeader.contains(e.target)) {
        closeArborMenu();
      }
    }
  });

  // Smooth Lenis scrolling for menu items
  document.querySelectorAll('.arbor-nav-item').forEach((link) => {
    link.addEventListener('click', (e) => {
      const scrollTarget = link.getAttribute('data-scroll-to') || link.getAttribute('href');
      if (scrollTarget && scrollTarget.startsWith('#')) {
        e.preventDefault();
        closeArborMenu();
        const targetElement = document.querySelector(scrollTarget);
        if (targetElement) {
          setTimeout(() => {
            if (window.__lenis) {
              window.__lenis.scrollTo(targetElement, { offset: -25, duration: 1.2 });
            } else {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 260);
        }
      } else if (link.classList.contains('open-contact-btn')) {
        closeArborMenu();
      }
    });
  });

  document.querySelectorAll('.arbor-mobile-inquire-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeArborMenu();
    });
  });

  // Preloader count-up 0% to 100%
  let count = 18;
  let preloaderDone = false;

  const finishPreloader = () => {
    if (preloaderDone) return;
    preloaderDone = true;
    if (arborLoaderPercent) arborLoaderPercent.textContent = '100%';
    if (arborLoaderFill) arborLoaderFill.style.width = '100%';

    setTimeout(() => {
      if (arborLoader) {
        arborLoader.classList.add('is-hidden');
        gsap.to(arborLoader, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            arborLoader.style.display = 'none';
          },
        });
      }
      if (arborHeader) {
        arborHeader.classList.remove('opacity-0', '-translate-y-6', 'pointer-events-none');
      }
      if (heroVideo) {
        heroVideo.play().catch(() => { });
      }
    }, 100);
  };

  if (arborLoader && arborLoaderPercent) {
    arborLoaderPercent.textContent = '18%';
    if (arborLoaderFill) arborLoaderFill.style.width = '18%';

    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 8;
      if (count >= 100) {
        clearInterval(interval);
        finishPreloader();
      } else {
        arborLoaderPercent.textContent = count + '%';
        if (arborLoaderFill) arborLoaderFill.style.width = count + '%';
      }
    }, 22);

    // Safety fallback: guaranteed to unlock within 800ms
    setTimeout(() => {
      clearInterval(interval);
      finishPreloader();
    }, 800);
  } else {
    finishPreloader();
  }

  // Video completion / scroll switch to final image
  if (heroVideo && heroFinalImg) {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const targetSrc = isMobile ? '/home/hero-m.webm' : '/home/hero.mp4';
    if (!heroVideo.src.includes(targetSrc)) {
      heroVideo.src = targetSrc;
      heroVideo.load();
      heroVideo.play().catch(() => { });
    }

    let finalShown = false;
    let titleScrub = null;

    function initTitleScrub() {
      if (titleScrub || !heroTitleOverlay) return;
      // Kill any running entrance tweens so there is zero conflict
      gsap.killTweensOf(heroTitleOverlay);

      const isMob = window.matchMedia('(max-width: 768px)').matches;

      // Ultra-clean, hardware-accelerated scroll scrub:
      // Starts right at 0 scroll ('top top') so returning to top naturally restores 100% opacity smoothly
      titleScrub = gsap.fromTo(
        heroTitleOverlay,
        { opacity: 1, yPercent: 0 },
        {
          opacity: 0,
          yPercent: isMob ? -10 : -20,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: '#top',
            start: 'top top',
            end: isMob ? '45% top' : '55% top',
            scrub: isMob ? true : 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    const showFinalImage = () => {
      if (finalShown) return;
      finalShown = true;
      heroVideoFinished = true;

      // Kill any running tweens to prevent fighting animations
      if (heroTitleOverlay) gsap.killTweensOf(heroTitleOverlay);
      gsap.killTweensOf(heroFinalImg);

      // Reveal final 3D realistic facade image
      heroFinalImg.classList.add('is-visible');
      gsap.to(heroFinalImg, { opacity: 1, duration: 0.6, ease: 'power2.out' });

      // Reveal the giant title
      if (heroTitleOverlay) {
        heroTitleOverlay.classList.add('is-visible');

        if (window.scrollY <= 5) {
          // User is resting at the top watching: gentle, lightweight fade-in
          gsap.fromTo(
            heroTitleOverlay,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'transform',
              onComplete: () => {
                initTitleScrub();
              },
            }
          );
        } else {
          // User has already scrolled down: attach scrub immediately with 0 latency
          initTitleScrub();
        }
      }

      setTimeout(() => {
        if (heroVideo) {
          heroVideo.pause();
          heroVideo.style.opacity = '0';
        }
      }, 400);
    };

    heroVideo.addEventListener('timeupdate', () => {
      if (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 0.4) {
        showFinalImage();
      }
    });
    heroVideo.addEventListener('ended', showFinalImage);

    // If user starts scrolling at all, switch to final image immediately
    ScrollTrigger.create({
      trigger: '#top',
      start: 'top -10px',
      once: true,
      onEnter: showFinalImage,
    });

    // If user starts scrolling after video finishes, attach scrub immediately
    window.addEventListener('scroll', () => {
      if (heroVideoFinished && !titleScrub) {
        initTitleScrub();
      }
    }, { passive: true });

    // High-end Hero Stage Parallax on Scroll: DESKTOP ONLY
    // On mobile devices, disabling container scaling/lag gives 100% native 60fps touch fluidity ("khfif")
    if (window.matchMedia('(min-width: 769px)').matches) {
      gsap.to('#arborStage', {
        yPercent: 18,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '#top',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  // ==========================================
  // 5. #Introduction (CONTINUOUS HIGH-END STORYTELLING)
  // Master Scrub Timeline:
  // - 0.0 -> 0.8: Scene 1 active (BaytImmo Design)
  // - 0.8 -> 1.3: Crossfade & 3D frame float into Scene 2 (Curated Urban Ecosystem)
  // - 1.3 -> 1.9: Scene 2 active
  // - 1.9 -> 2.4: Crossfade into Scene 3 (A New Chapter in Prestigious Living)
  // - 2.4 -> 3.0: Scene 3 active
  // - Zero empty dead zones, continuous 1:1 tactile scrub, GPU transforms
  // ==========================================
  // ==========================================
  // 5. INTRODUCTION SECTION (1:1 EXACT FROM BELGRADEARBOR.RS)
  // Master scrub on .scroller (h-[900vh]), SVG MorphSVGPlugin, Frame transforms,
  // responsive matchMedia (Desktop / Laptop / Tablet), and Screen 1/2/3 timelines.
  // ==========================================
  const introSection = document.getElementById('Introduction');
  if (introSection) {
    const scroller = introSection.querySelector('.scroller');

    // SplitText for Screen 1, Screen 2, Screen 3
    const preheading1 = introSection.querySelector('.preheading1');
    const heading1 = introSection.querySelector('.heading1');
    const heading2 = introSection.querySelector('.heading2');
    const heading3 = introSection.querySelector('.heading3');
    const paragraph1 = introSection.querySelector('.paragraph1');

    const splitPre1 = new SplitText(preheading1, { type: 'chars, words' });
    const splitHead1 = new SplitText(heading1, { type: 'words' });
    const splitHead2 = new SplitText(heading2, { type: 'words' });
    const splitHead3 = new SplitText(heading3, { type: 'chars, words' });
    const splitPara1 = new SplitText(paragraph1, { type: 'words' });

    const j = {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      ease: 'power1.inOut',
      pointerEvents: 'auto',
      overwrite: 'auto'
    };
    const y = {
      opacity: 0,
      y: '2rem',
      filter: 'blur(4px)',
      ease: 'power1.inOut',
      pointerEvents: 'none',
      overwrite: 'auto'
    };

    const N = 0;
    const k = 0.1;
    const M = 0.15;
    const T = 0.33;
    const P = 0.22;
    const E = 0.68;
    const L = 0.1;
    const O = 1;
    const $ = 0.33;
    const z = 0.75;
    const S = 0.14;

    const C = {
      trigger: scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: MOTION_CONFIG.scrub.factor
    };

    function W(pct) {
      return `${100 * pct}% top`;
    }

    const s = {
      desktop: {
        morph1Width: '20rem',
        morph1Height: '27rem',
        morph1Right: '16.66%',
        morph1Top: '14%',
        morph2Width: '35rem',
        morph2Height: '35rem',
        morph2Left: '0',
        morph2Bottom: '20%',
        xPercent: -100
      },
      laptop: {
        morph1Width: '15rem',
        morph1Height: '20rem',
        morph1Right: '16.66%',
        morph1Top: '14%',
        morph2Width: '26.375rem',
        morph2Height: '26.188rem',
        morph2Left: '0',
        morph2Bottom: '20%',
        xPercent: -100
      },
      tablet: {
        morph1Width: '30vh',
        morph1Height: '35vh',
        morph1Right: '0',
        morph1Top: '5vh',
        morph2Width: '42vh',
        morph2Height: '42vh',
        morph2Left: '-2vh',
        morph2Bottom: '55vh',
        xPercent: 0
      }
    };

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1441px)',
      isLaptop: '(min-width: 1121px) and (max-width: 1440px)',
      isTablet: '(min-width: 768px) and (max-width: 1120px)'
    }, (context) => {
      const bp = context.conditions.isTablet ? 'tablet' : context.conditions.isLaptop ? 'laptop' : 'desktop';
      const cfg = s[bp];

      // Initial sets
      gsap.set([
        splitPre1.chars,
        splitHead1.words,
        splitHead2.words,
        splitHead3.chars,
        splitPara1.words,
        introSection.querySelector('.button1Wrap'),
        introSection.querySelector('.button2Wrap'),
        introSection.querySelector('.screen3 .link')
      ], y);

      gsap.set(introSection.querySelector('.morphWrapper'), {
        scale: 1.1,
        filter: 'blur(4px)',
        opacity: 0,
        xPercent: 0
      });
      gsap.set([
        introSection.querySelector('.screen1'),
        introSection.querySelector('.screen2'),
        introSection.querySelector('.screen3')
      ], { pointerEvents: 'none' });
      gsap.set(introSection.querySelector('.progress-num-1'), { y: 0, opacity: 1, filter: 'blur(0px)' });
      gsap.set([introSection.querySelector('.progress-num-2'), introSection.querySelector('.progress-num-3')], {
        y: '1rem',
        opacity: 0,
        filter: 'blur(4px)'
      });

      // Master Timeline
      const masterTl = gsap.timeline({ scrollTrigger: C });

      masterTl
        .set(introSection.querySelector('.screen1'), { pointerEvents: 'auto' })
        .to(introSection.querySelector('.morphWrapper'), {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power1.inOut',
          duration: k
        }, N);

      masterTl
        .to('#morphClip1 path', {
          morphSVG: 'M612.999 748.068V103C612.999 53.8486 568.667 17.6575 522.631 29.2268L295.544 86.2962C274.234 91.6517 256.362 106.645 246.852 127.146L7.28559 616.516C-13.3912 661.088 11.8848 713.945 58.5972 723.818L525.25 822.446C570.586 832.028 612.999 796.077 612.999 748.068Z',
          ease: 'none',
          duration: T
        }, M)
        .to('#frame1', {
          width: cfg.morph1Width,
          right: cfg.morph1Right,
          top: cfg.morph1Top,
          height: cfg.morph1Height,
          ease: 'power1.inOut',
          duration: T
        }, M)
        .to(introSection.querySelector('.morph1ImgA'), { opacity: 0, duration: T }, M)
        .to(introSection.querySelector('.morph1ImgB'), { opacity: 1, duration: T }, M)
        .to(introSection.querySelector('.morph2ImgA'), { opacity: 0, duration: T }, M)
        .to(introSection.querySelector('.morph2ImgB'), { opacity: 1, duration: T }, M)
        .to('#morphClip2 path', {
          morphSVG: 'M536.07 261.245L562.89 534.277C564.225 547.866 553.215 559.504 539.519 558.983L39.3218 539.961C27.4842 539.511 18.0011 530.038 17.5825 518.245L0.0149346 23.3565C-0.589468 6.32949 17.2665 -5.17794 32.6102 2.35034L523.555 243.229C530.574 246.673 535.308 253.488 536.07 261.245Z',
          ease: 'none',
          duration: T
        }, M)
        .to('#frame2', {
          width: cfg.morph2Width,
          left: cfg.morph2Left,
          bottom: cfg.morph2Bottom,
          height: cfg.morph2Height,
          ease: 'power1.inOut',
          duration: T
        }, M)
        .to(introSection.querySelector('.morphWrapper'), {
          xPercent: cfg.xPercent,
          ease: 'power1.inOut',
          duration: T
        }, M);

      masterTl
        .set(introSection.querySelector('.screen1'), { pointerEvents: 'none' })
        .set(introSection.querySelector('.screen2'), { pointerEvents: 'auto' });

      masterTl
        .to(introSection.querySelector('.morphWrapper'), {
          scale: 1.1,
          filter: 'blur(4px)',
          opacity: 0,
          ease: 'power1.inOut',
          duration: L
        }, E)
        .to({}, { duration: 1 - E })
        .set(introSection.querySelector('.screen2'), { pointerEvents: 'none' })
        .set(introSection.querySelector('.screen3'), { pointerEvents: 'auto' });

      // Screen Timelines
      const tl1 = gsap.timeline({ paused: true })
        .to(splitPre1.chars, { ...j, duration: 0.7, stagger: 0.1 }, 0)
        .to(splitHead1.words, { ...j, duration: 0.7, stagger: 0.05 }, 0)
        .to(introSection.querySelector('.button1Wrap'), { ...j, duration: 0.7 }, 0);

      const tl2 = gsap.timeline({ paused: true })
        .to(splitHead2.words, { ...j, duration: 0.7, stagger: 0.05 }, 0)
        .to(introSection.querySelector('.button2Wrap'), { ...j, duration: 0.7 }, 0);

      const tl3 = gsap.timeline({ paused: true })
        .to(splitHead3.chars, { ...j, duration: 0.7, stagger: 0.05 }, 0)
        .to(splitPara1.words, { ...j, duration: 0.9, stagger: 0.05 }, 0)
        .to(introSection.querySelector('.screen3 .link'), { ...j, duration: 0.9 }, 0);

      function q(st, tl) {
        if (st && st.isActive) tl.play();
      }

      q(ScrollTrigger.create({
        trigger: scroller,
        start: W(N),
        end: W(P),
        onEnter: () => tl1.play(),
        onLeave: () => tl1.reverse(),
        onEnterBack: () => tl1.play(),
        onLeaveBack: () => tl1.reverse()
      }), tl1);

      q(ScrollTrigger.create({
        trigger: scroller,
        start: W(0.33),
        end: W(0.6),
        onEnter: () => tl2.play(),
        onLeave: () => tl2.reverse(),
        onEnterBack: () => tl2.play(),
        onLeaveBack: () => tl2.reverse()
      }), tl2);

      q(ScrollTrigger.create({
        trigger: scroller,
        start: W(0.75),
        end: 'bottom top',
        onEnter: () => tl3.play(),
        onLeave: () => tl3.reverse(),
        onEnterBack: () => tl3.play(),
        onLeaveBack: () => tl3.reverse()
      }), tl3);

      // Progress bar & number counter timeline
      const progTl = gsap.timeline({ scrollTrigger: C });
      progTl
        .to(introSection.querySelector('.progress-fill'), { width: '100%', ease: 'none', duration: O }, 0)
        .to(introSection.querySelector('.progress-num-1'), { y: '-1rem', opacity: 0, filter: 'blur(4px)', ease: 'power1.inOut', duration: S }, $)
        .to(introSection.querySelector('.progress-num-2'), { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.inOut', duration: S }, $)
        .to(introSection.querySelector('.progress-num-2'), { y: '-1rem', opacity: 0, filter: 'blur(4px)', ease: 'power1.inOut', duration: S }, z)
        .to(introSection.querySelector('.progress-num-3'), { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.inOut', duration: S }, z);

      // Parallax scroll on ambient background container
      const introParallax = introSection.querySelector('.intro-parallax');
      if (introParallax) {
        gsap.to(introParallax, {
          scrollTrigger: {
            trigger: scroller,
            start: () => `bottom-=${window.innerHeight} top`,
            end: 'bottom top',
            scrub: MOTION_CONFIG.scrub.factor
          },
          y: '10rem',
          ease: 'power1.inOut'
        });
      }
    });

    // Ambient floating leaves
    const leafs = introSection.querySelector('.leafs');
    if (leafs) {
      gsap.to(leafs, { repeat: -1, yoyo: true, duration: 4, ease: 'power1.inOut', rotate: 5 });
    }
  }

  // ==========================================
  // INTRODUCTION MOBILE (1:1 EXACT FROM BELGRADEARBOR.RS)
  // ==========================================
  const introMobile = document.getElementById('IntroductionMobile');
  if (introMobile) {
    const F = '#IntroductionMobile';
    const G = `${F} .scroller-mobile`;
    const D = { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power1.inOut', pointerEvents: 'auto', overwrite: 'auto' };
    const V = { opacity: 0, y: '2rem', filter: 'blur(4px)', ease: 'power1.inOut', pointerEvents: 'none', overwrite: 'auto' };
    const U = { opacity: 1, filter: 'blur(0px)', scale: 1.1, ease: 'power1.inOut' };
    const Z = { opacity: 0, filter: 'blur(4px)', scale: 1, ease: 'power1.inOut' };

    function Y(ratio, dist) {
      return `top+=${Math.round(ratio * dist)} top`;
    }

    const scrollerMobEl = introMobile.querySelector('.scroller-mobile');
    const scrubDist = (scrollerMobEl?.offsetHeight ?? 0) > 0
      ? Math.max(1, scrollerMobEl.offsetHeight - window.innerHeight)
      : Math.max(1, 6 * window.innerHeight);

    const mPre1 = new SplitText(`${F} .mobile-preheading1`, { type: 'chars, words' });
    const mHead1 = new SplitText(`${F} .mobile-heading1`, { type: 'words' });
    const mHead2 = new SplitText(`${F} .mobile-heading2`, { type: 'words' });
    const mHead3 = new SplitText(`${F} .mobile-heading3`, { type: 'chars, words' });
    const mPara1 = new SplitText(`${F} .mobile-paragraph1`, { type: 'words' });

    gsap.set([mPre1.chars, mHead1.words, mHead2.words, mHead3.chars, mPara1.words, `${F} .mobile-link`], V);
    gsap.set(`${F} .mobile-image`, Z);
    gsap.set(`${F} .progress-num-1`, { y: 0, opacity: 1, filter: 'blur(0px)' });
    gsap.set([`${F} .progress-num-2`, `${F} .progress-num-3`, `${F} .progress-num-4`, `${F} .progress-num-5`], {
      y: '1rem',
      opacity: 0,
      filter: 'blur(4px)'
    });

    // Mobile Images pairs reveal
    [
      `${F} .screen2 .mobile-image`,
      `${F} .screen4 .mobile-image`
    ].forEach((imgSelector, idx) => {
      const step = idx === 0 ? 2 : 4;
      const imgTl = gsap.timeline({ paused: true }).to(imgSelector, { ...U, duration: 0.7, stagger: 0.03 });
      const st = ScrollTrigger.create({
        trigger: G,
        start: Y((step - 1) * 0.2, scrubDist),
        end: Y(0.2 * step, scrubDist),
        onEnter: () => imgTl.play(),
        onLeave: () => imgTl.reverse(),
        onEnterBack: () => imgTl.play(),
        onLeaveBack: () => imgTl.reverse()
      });
      if (st.isActive) imgTl.play();
    });

    const mTl1 = gsap.timeline({ paused: true })
      .to(mPre1.chars, { ...D, duration: 0.7, stagger: 0.1 }, 0)
      .to(mHead1.words, { ...D, duration: 0.7, stagger: 0.05 }, 0);

    const mTl2 = gsap.timeline({ paused: true })
      .to(mHead2.words, { ...D, duration: 0.7, stagger: 0.05 }, 0);

    const mTl3 = gsap.timeline({ paused: true })
      .to(mHead3.chars, { ...D, duration: 0.7, stagger: 0.05 }, 0)
      .to(mPara1.words, { ...D, duration: 0.9, stagger: 0.05 }, 0)
      .to(`${F} .mobile-link`, { ...D, duration: 0.9 }, 0);

    const mst1 = ScrollTrigger.create({
      trigger: G,
      start: 'top top',
      end: Y(0.2 - 0.05, scrubDist),
      onEnter: () => mTl1.play(),
      onLeave: () => mTl1.reverse(),
      onEnterBack: () => mTl1.play(),
      onLeaveBack: () => mTl1.reverse()
    });
    if (mst1.isActive) mTl1.play();

    const mst2 = ScrollTrigger.create({
      trigger: G,
      start: Y(0.4, scrubDist),
      end: Y(0.55, scrubDist),
      onEnter: () => mTl2.play(),
      onLeave: () => mTl2.reverse(),
      onEnterBack: () => mTl2.play(),
      onLeaveBack: () => mTl2.reverse()
    });
    if (mst2.isActive) mTl2.play();

    const mst3 = ScrollTrigger.create({
      trigger: G,
      start: Y(0.8, scrubDist),
      end: 'bottom bottom',
      onEnter: () => mTl3.play(),
      onLeave: () => mTl3.reverse(),
      onEnterBack: () => mTl3.play(),
      onLeaveBack: () => mTl3.reverse()
    });
    if (mst3.isActive) mTl3.play();

    // Mobile Progress Bar
    const mProgTl = gsap.timeline({
      scrollTrigger: {
        trigger: G,
        start: 'top top',
        end: 'bottom bottom',
        scrub: MOTION_CONFIG.scrub.factor
      }
    });
    mProgTl.to(`${F} .progress-fill`, { width: '100%', ease: 'none', duration: 1 }, 0);
    for (let e = 1; e < 5; e++) {
      const a = 0.2 * e;
      mProgTl
        .to(`${F} .progress-num-${e}`, { y: '-1rem', opacity: 0, filter: 'blur(4px)', ease: 'power1.inOut', duration: 0.12 }, a)
        .to(`${F} .progress-num-${e + 1}`, { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.inOut', duration: 0.12 }, a);
    }

    const mLeafs = introMobile.querySelector('.leafs');
    if (mLeafs) {
      gsap.to(mLeafs, { repeat: -1, yoyo: true, duration: 4, ease: 'power1.inOut', rotate: 5 });
    }
  }

  // ==========================================
  // 6. SHOWCASE SECTIONS: #Residences, #BusinessSpaces, #Amenities
  // Parallax scrub + clip-path reveal
  // ==========================================
  ['#Residences', '#BusinessSpaces', '#Amenities'].forEach((secId) => {
    const sec = document.querySelector(secId);
    if (!sec) return;

    const trigger = sec.querySelector('.trigger') || sec;
    const bg = sec.querySelector('.background');
    const portrait = sec.querySelector('.portrait');
    const videoWrap = sec.querySelector('.videoWrap');
    const kicker = sec.querySelector('.preheading, .kicker, .detail, span.text-golden');
    const heading = sec.querySelector('.hero, .heading, h1, h2');
    const paragraph = sec.querySelector('.paragraph, p');
    const actionBtn = sec.querySelector('.menu, .button, a.inline-flex');

    // 1. GPU-accelerated Parallax on background (matches Belgrade Arbor: top scrub, preserving -translate-y-1/2)
    if (bg) {
      gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          scrub: true,
        },
      }).to(bg, {
        top: '+=20rem',
        ease: 'power1.inOut',
      });
    }

    // 2. Optical counter-parallax on floating portrait
    if (portrait) {
      gsap.to(portrait, {
        top: '+=10rem',
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: trigger,
          scrub: true,
        },
      });
    }

    // 3. Cinematic Curtain Reveal + Image counter-zoom (100% persistent on reverse scroll)
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top 80%',
        once: true,
      },
      onComplete: () => {
        // Permanently clear clipPath override so section background never disappears
        gsap.set(trigger, { clearProps: 'clipPath' });
      },
    });

    revealTl
      .fromTo(
        trigger,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut' },
        0
      )
      .fromTo(
        bg,
        { scale: 1.08 },
        { scale: 1, duration: 1.4, ease: 'power2.inOut' },
        0
      );

    // 4. Staggered 3D text entrance triggered when the heading ITSELF enters viewport
    if (heading) {
      const headingSplit = splitText(heading, { words: true, chars: true });
      const targets = headingSplit.chars.length ? headingSplit.chars : headingSplit.words;
      gsap.fromTo(
        targets,
        { yPercent: 75, opacity: 0, rotateX: -50, scale: 0.9, filter: 'blur(8px)' },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.15,
          stagger: 0.03,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            toggleActions: 'play none none reset',
          },
          onComplete: () => {
            gsap.set(targets, { clearProps: 'filter' });
          },
        }
      );
    }

    if (kicker) {
      gsap.fromTo(
        kicker,
        { opacity: 0, y: 15, letterSpacing: '0.1em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.3em',
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: kicker,
            start: 'top 92%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }

    const paragraphs = sec.querySelectorAll('.paragraph, p.paragraph');
    paragraphs.forEach((pEl) => {
      gsap.fromTo(
        pEl,
        { opacity: 0, y: 28, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pEl,
            start: 'top 92%',
            toggleActions: 'play none none reset',
          },
          onComplete: () => {
            gsap.set(pEl, { clearProps: 'filter' });
          },
        }
      );
    });

    if (actionBtn) {
      gsap.fromTo(
        actionBtn,
        { opacity: 0, y: 15, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: actionBtn,
            start: 'top 92%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }

    // 5. Video wrap reveal
    if (videoWrap) {
      gsap.fromTo(
        videoWrap,
        { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.15, filter: 'blur(6px)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: videoWrap,
            start: 'top 80%',
          },
        }
      );
    }
  });

  // ==========================================
  // 7. #ResidenceOptions (GALLERY + SLIDER + INDICATOR)
  // ==========================================
  const resOptionsSection = document.getElementById('ResidenceOptions');
  if (resOptionsSection) {
    const firstCol = resOptionsSection.querySelector('.reveal-content');
    const secondCol = resOptionsSection.querySelector('.reveal-image');
    const optionItems = Array.from(resOptionsSection.querySelectorAll('.res-option-item'));
    const indicator = document.getElementById('resListIndicator');
    const detailPanels = Array.from(resOptionsSection.querySelectorAll('.res-detail-panel'));
    const galleryTrack = document.getElementById('resGalleryTrack');
    const prevBtn = document.getElementById('resPrevBtn');
    const nextBtn = document.getElementById('resNextBtn');

    gsap.timeline({
      scrollTrigger: {
        trigger: resOptionsSection.querySelector('.trigger') || resOptionsSection,
        start: 'top 70%',
      },
    })
      .fromTo(firstCol, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0)
      .fromTo(secondCol, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0);

    let currentSlide = 0;
    const totalSlides = 12;

    const goToSlide = (slideIdx) => {
      currentSlide = (slideIdx + totalSlides) % totalSlides;
      if (galleryTrack) {
        galleryTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
      }
    };

    const setActiveResOption = (idx) => {
      const targetItem = optionItems[idx];
      if (indicator && targetItem) {
        const h = targetItem.offsetHeight * 0.8;
        const t = targetItem.offsetTop + (targetItem.offsetHeight - h) / 2;
        indicator.style.opacity = '1';
        indicator.style.height = `${h}px`;
        indicator.style.transform = `translate3d(0, ${t}px, 0)`;
      }
      optionItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
      detailPanels.forEach((panel, i) => {
        panel.style.opacity = i === idx ? '1' : '0';
        panel.style.pointerEvents = i === idx ? 'auto' : 'none';
      });
      goToSlide(idx * 2);
    };

    optionItems.forEach((item, idx) => {
      item.addEventListener('click', () => setActiveResOption(idx));
      item.addEventListener('mouseenter', () => setActiveResOption(idx));
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }
  }

  // ==========================================
  // 9. #BusinessSpacesOptions
  // ==========================================
  const busOptionsSection = document.getElementById('BusinessSpacesOptions');
  if (busOptionsSection) {
    const firstCol = busOptionsSection.querySelector('.retail-spaces-reveal-image');
    const secondCol = busOptionsSection.querySelector('.retail-spaces-reveal-content');
    const parallaxImg = busOptionsSection.querySelector('.retail-spaces-parallax');
    const optionItems = Array.from(busOptionsSection.querySelectorAll('.biz-option-item'));
    const indicator = document.getElementById('bizListIndicator');
    const detailPanels = Array.from(busOptionsSection.querySelectorAll('.biz-detail-panel'));

    if (window.innerWidth >= 1024) {
      gsap.timeline({
        scrollTrigger: {
          trigger: busOptionsSection.querySelector('.trigger') || busOptionsSection,
          start: 'top 70%',
        },
      })
        .fromTo(firstCol, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0)
        .fromTo(secondCol, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0);
    }

    if (parallaxImg) {
      gsap.fromTo(
        parallaxImg,
        { yPercent: -50, y: '-5rem' },
        {
          yPercent: -50,
          y: '5rem',
          ease: 'none',
          scrollTrigger: {
            trigger: busOptionsSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    const setActiveBusOption = (idx) => {
      optionItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
      detailPanels.forEach((panel, i) => {
        if (i === idx) {
          panel.classList.add('is-active');
          panel.style.opacity = '1';
          panel.style.pointerEvents = 'auto';
        } else {
          panel.classList.remove('is-active');
          panel.style.opacity = '0';
          panel.style.pointerEvents = 'none';
        }
      });
    };

    // Initialize with index 0 (Wing A) active
    setActiveBusOption(0);

    optionItems.forEach((item, idx) => {
      item.addEventListener('click', () => setActiveBusOption(idx));
      item.addEventListener('mouseenter', () => setActiveBusOption(idx));
    });
  }

  // ==========================================
  // 10. #Roots (THE WAY OF LIVING - YOUR ROOTS)
  // Belgrade Arbor exact transforms, masks & mouse parallax
  // ==========================================
  const rootsSection = document.getElementById('Roots');
  if (rootsSection) {
    const hugeHeading = rootsSection.querySelector('.huge');
    const masks = rootsSection.querySelectorAll('.mask');
    const kickerWraps = rootsSection.querySelectorAll('.roots-kicker-wrap');
    const layer1 = document.getElementById('rootsLayer1');
    const layer2 = document.getElementById('rootsLayer2');
    const layer3 = document.getElementById('rootsLayer3');

    const hugeSplit = splitText(hugeHeading, { words: true, chars: true });

    if (hugeSplit.chars.length) {
      gsap.fromTo(
        hugeSplit.chars,
        { x: '35vw', opacity: 0, filter: 'blur(8px)' },
        {
          x: '0vw',
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.05,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootsSection.querySelector('.trigger') || rootsSection,
            start: 'top 75%',
          },
        }
      );
    }

    if (masks.length) {
      gsap.fromTo(
        masks,
        { maskSize: '0%', webkitMaskSize: '0%' },
        {
          maskSize: '100%',
          webkitMaskSize: '100%',
          stagger: 0.25,
          ease: 'power3.inOut',
          duration: 1.6,
          scrollTrigger: {
            trigger: rootsSection.querySelector('.trigger') || rootsSection,
            start: 'top 70%',
          },
        }
      );
    }

    if (kickerWraps.length) {
      gsap.fromTo(
        kickerWraps,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: rootsSection.querySelector('.trigger') || rootsSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    // Precise layer transforms matching Belgrade Arbor
    if (layer1) gsap.set(layer1, { xPercent: -50, yPercent: -50 });
    if (layer3) gsap.set(layer3, { yPercent: -50 });

    if (layer1 && layer2 && layer3) {
      const layerConfigs = [
        { el: layer1, strength: 0.09, xTo: gsap.quickTo(layer1, 'x', { duration: 1.2, ease: 'power3' }), yTo: gsap.quickTo(layer1, 'y', { duration: 1.2, ease: 'power3' }) },
        { el: layer2, strength: 0.06, xTo: gsap.quickTo(layer2, 'x', { duration: 1.2, ease: 'power3' }), yTo: gsap.quickTo(layer2, 'y', { duration: 1.2, ease: 'power3' }) },
        { el: layer3, strength: 0.035, xTo: gsap.quickTo(layer3, 'x', { duration: 1.2, ease: 'power3' }), yTo: gsap.quickTo(layer3, 'y', { duration: 1.2, ease: 'power3' }) },
      ];

      const onMouseMoveRoots = (e) => {
        const dx = e.clientX - window.innerWidth / 2;
        const dy = e.clientY - window.innerHeight / 2;
        layerConfigs.forEach(({ xTo, yTo, strength }) => {
          xTo(dx * strength);
          yTo(dy * strength);
        });
      };

      window.addEventListener('mousemove', onMouseMoveRoots);
    }
  }

  // ==========================================
  // 10B. #RootsMobile (1:1 FROM BELGRADEARBOR.RS)
  // ==========================================
  const rootsMobile = document.getElementById('RootsMobile');
  if (rootsMobile) {
    const scroller = rootsMobile.querySelector('.roots-scroller');
    const hugeHeading = rootsMobile.querySelector('.roots-huge');
    const paragraph = rootsMobile.querySelector('.roots-paragraph');
    const rootsImages = rootsMobile.querySelectorAll('.roots-image');
    const rootsButton = rootsMobile.querySelector('.roots-button');
    const progressFill = rootsMobile.querySelector('.progress-fill');
    const progressNum1 = rootsMobile.querySelector('.progress-num-1');
    const progressNum2 = rootsMobile.querySelector('.progress-num-2');
    const rootsVideo = rootsMobile.querySelector('video');

    if (rootsVideo) {
      rootsVideo.play().catch(() => { });
    }

    const hugeSplit = splitText(hugeHeading, { words: true, chars: true });
    const paragraphSplit = splitText(paragraph, { words: true, chars: false });

    const stateVisible = { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power1.inOut', pointerEvents: 'auto', overwrite: 'auto' };
    const stateHidden = { opacity: 0, y: '2rem', filter: 'blur(4px)', ease: 'power1.inOut', pointerEvents: 'none', overwrite: 'auto' };

    // Initial state
    if (hugeSplit.chars && hugeSplit.chars.length) {
      gsap.set(hugeSplit.chars, { x: '100vw', opacity: 0, filter: 'blur(4px)' });
    }
    gsap.set(rootsImages, { scale: 1.1, opacity: 0, filter: 'blur(4px)' });
    const targetWords = (paragraphSplit.words && paragraphSplit.words.length) ? paragraphSplit.words : paragraph;
    if (paragraphSplit.words && paragraphSplit.words.length) {
      gsap.set(paragraphSplit.words, stateHidden);
    } else if (paragraph) {
      gsap.set(paragraph, stateHidden);
    }
    if (rootsButton) {
      gsap.set(rootsButton, stateHidden);
    }
    if (progressNum1) gsap.set(progressNum1, { y: 0, opacity: 1, filter: 'blur(0px)' });
    if (progressNum2) gsap.set(progressNum2, { y: '1rem', opacity: 0, filter: 'blur(4px)' });

    // Timeline `a`: huge heading characters slide in from right
    const tlHeading = gsap.timeline({ paused: true }).to(hugeSplit.chars, {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.5,
      stagger: 0.08,
      ease: 'power2.inOut',
    });

    // Timeline `r`: images scale in with delay
    const tlImages = gsap.timeline({ paused: true }).to(rootsImages, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: 0.3,
      ease: 'power2.inOut',
      delay: 0.6,
    });

    // ScrollTrigger 1: Screen 1 active between 0% and 45% of scroller
    ScrollTrigger.create({
      trigger: scroller,
      start: 'top top',
      end: '45% top',
      onEnter: () => { tlHeading.restart(); tlImages.restart(); },
      onEnterBack: () => { tlHeading.restart(); tlImages.restart(); },
      onLeave: () => { tlHeading.reverse(); tlImages.reverse(); },
      onLeaveBack: () => { tlHeading.reverse(); tlImages.reverse(); },
    });

    // Timeline `s`: paragraph words + button reveal for Screen 2
    const tlParagraph = gsap.timeline({ paused: true })
      .to(targetWords, { ...stateVisible, duration: 0.8, stagger: 0.05 })
      .to(rootsButton, { ...stateVisible, duration: 0.8 }, 0.15);

    // ScrollTrigger 2: Screen 2 active between 50% and bottom bottom
    ScrollTrigger.create({
      trigger: scroller,
      start: '50% top',
      end: 'bottom bottom',
      onEnter: () => tlParagraph.play(),
      onEnterBack: () => tlParagraph.play(),
      onLeaveBack: () => tlParagraph.reverse(),
    });

    // Timeline 3: Progress line and 01/02 scrubbed with scroll
    gsap.timeline({
      scrollTrigger: {
        trigger: scroller,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })
      .to(progressFill, { width: '100%', ease: 'none', duration: 1 }, 0)
      .to(progressNum1, { y: '-1rem', opacity: 0, filter: 'blur(4px)', ease: 'power1.inOut', duration: 0.14 }, 0.5)
      .to(progressNum2, { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.inOut', duration: 0.14 }, 0.5);
  }

  // ==========================================
  // 11. #AmenitiesOptions
  // ==========================================
  const amenOptionsSection = document.getElementById('AmenitiesOptions');
  if (amenOptionsSection) {
    const firstCol = amenOptionsSection.querySelector('.amenities-options-reveal-content');
    const secondCol = amenOptionsSection.querySelector('.amenities-options-reveal-image');
    const parallaxWraps = amenOptionsSection.querySelectorAll('.amenities-parallaxWrap');
    const optionItems = Array.from(amenOptionsSection.querySelectorAll('.amen-option-item'));
    const indicator = document.getElementById('amenListIndicator');
    const detailPanels = Array.from(amenOptionsSection.querySelectorAll('.amen-detail-panel'));
    const imagePanes = Array.from(amenOptionsSection.querySelectorAll('.amen-image-pane'));

    if (window.innerWidth >= 1024) {
      gsap.timeline({
        scrollTrigger: {
          trigger: amenOptionsSection.querySelector('.trigger') || amenOptionsSection,
          start: 'top 70%',
        },
      })
        .fromTo(firstCol, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0)
        .fromTo(secondCol, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0);
    }

    if (parallaxWraps.length) {
      gsap.fromTo(
        parallaxWraps,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: amenOptionsSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    const setActiveAmenOption = (idx) => {
      const targetItem = optionItems[idx];
      if (indicator && targetItem) {
        const h = targetItem.offsetHeight * 0.8;
        const t = targetItem.offsetTop + (targetItem.offsetHeight - h) / 2;
        indicator.style.opacity = '1';
        indicator.style.height = `${h}px`;
        indicator.style.transform = `translate3d(0, ${t}px, 0)`;
      }
      optionItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
      detailPanels.forEach((panel, i) => {
        panel.style.opacity = i === idx ? '1' : '0';
        panel.style.pointerEvents = i === idx ? 'auto' : 'none';
      });
      imagePanes.forEach((pane, i) => {
        if (i === idx) {
          pane.classList.remove('w-0', 'right-0', 'left-auto');
          pane.classList.add('w-full', 'left-0', 'right-auto');
          pane.style.zIndex = '2';
        } else {
          pane.classList.remove('w-full', 'left-0', 'right-auto');
          pane.classList.add('w-0', 'right-0', 'left-auto');
          pane.style.zIndex = '1';
        }
      });
    };

    optionItems.forEach((item, idx) => {
      item.addEventListener('click', () => setActiveAmenOption(idx));
      item.addEventListener('mouseenter', () => setActiveAmenOption(idx));
    });
  }

  // ==========================================
  // 12. #Horizontal (A VIEW FROM ABOVE PANORAMA)
  // Belgrade Arbor exact timing:
  // - markers width matches scrollWidth
  // - heading chars reveal at top 80%
  // - heading chars fade out at timeline position 0.3 (NOT immediately at 0!)
  // ==========================================
  const horizontalSection = document.getElementById('Horizontal');
  if (horizontalSection) {
    const heading = horizontalSection.querySelector('.heading');
    const horizontalImg = horizontalSection.querySelector('.horizontal-image');
    const horizontalMarkers = horizontalSection.querySelector('.horizontal-markers');
    const cloud1 = horizontalSection.querySelector('.cloud1');
    const cloud2 = horizontalSection.querySelector('.cloud2');
    const cloud3 = horizontalSection.querySelector('.cloud3');
    const reveals = horizontalSection.querySelectorAll('.reveal');

    const headingSplit = splitText(heading, { words: true, chars: true });

    const getShiftConfig = () => {
      if (window.matchMedia('(max-width: 600px)').matches) return { start: 0.22, end: 0.78 };
      if (window.matchMedia('(max-width: 1120px)').matches) return { start: 0.15, end: 0.85 };
      return { start: 0, end: 1 };
    };

    const updateMarkersWidth = () => {
      if (horizontalImg && horizontalMarkers) {
        horizontalMarkers.style.width = `${horizontalImg.scrollWidth}px`;
      }
    };

    updateMarkersWidth();
    if (horizontalImg) {
      if (horizontalImg.complete && horizontalImg.naturalWidth !== 0) {
        updateMarkersWidth();
      } else {
        horizontalImg.addEventListener('load', () => {
          updateMarkersWidth();
          ScrollTrigger.refresh();
        }, { once: true });
      }
    }

    // Heading chars entrance at top 80%
    if (headingSplit.chars.length) {
      gsap.set(headingSplit.chars, { opacity: 0, y: '25%', filter: 'blur(10px)' });
      gsap.to(headingSplit.chars, {
        opacity: 1,
        y: '0%',
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.035,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: horizontalSection.querySelector('.trigger') || horizontalSection,
          start: 'top 80%',
        },
      });
    }

    // Curtain reveal at top 70% (both left & right curtains part open full-screen)
    if (reveals.length) {
      gsap.to(reveals, {
        width: '0%',
        ease: 'power2.inOut',
        duration: 1.2,
        scrollTrigger: {
          trigger: horizontalSection.querySelector('.trigger') || horizontalSection,
          start: 'top 70%',
        },
      });
    }

    // Main pinned scrub timeline
    const calcOffset = (progressFactor) => {
      if (!horizontalImg) return 0;
      return -(horizontalImg.scrollWidth - window.innerWidth) * progressFactor;
    };

    const horizTl = gsap.timeline({
      scrollTrigger: {
        trigger: horizontalSection.querySelector('.trigger') || horizontalSection,
        start: 'top top',
        end: () => `+=${2 * ((horizontalImg ? horizontalImg.scrollWidth : 2000) - window.innerWidth)}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: updateMarkersWidth,
      },
    });

    horizTl
      .fromTo(
        [horizontalImg, horizontalMarkers],
        { x: () => calcOffset(getShiftConfig().start) },
        { x: () => calcOffset(getShiftConfig().end), ease: 'none', duration: 1 },
        0
      )
      .to(cloud1, { xPercent: -20, ease: 'none', duration: 1 }, 0)
      .to(cloud2, { xPercent: -35, ease: 'none', duration: 1 }, 0)
      .to(cloud3, { xPercent: -55, ease: 'none', duration: 1 }, 0)
      .to(heading, { xPercent: -15, ease: 'none', duration: 1 }, 0)
      // Heading chars fade out smoothly into the scroll (clean and readable at entrance!)
      .to(
        headingSplit.chars,
        { opacity: 0, scale: 0.8, filter: 'blur(8px)', stagger: 0.03, ease: 'power2.inOut', duration: 0.35 },
        0.28
      );
  }

  // ==========================================
  // 13. #Installment (INSTALLMENT PLAN)
  // ==========================================
  const installmentSection = document.getElementById('Installment');
  if (installmentSection) {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const instTrigger = installmentSection.querySelector('.installment-trigger') || installmentSection;
    const revImg = installmentSection.querySelector('.installment-reveal-image');
    const revContents = installmentSection.querySelectorAll('.installment-reveal-content');
    const revZoom = installmentSection.querySelector('.reveal-image-zoom');
    const parallaxes = installmentSection.querySelectorAll('.installment-parallax');

    gsap.timeline({
      scrollTrigger: {
        trigger: instTrigger,
        start: 'top 70%',
      },
    })
      .fromTo(revImg, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0)
      .fromTo(revContents, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0)
      .fromTo(revZoom, { scale: 1.1 }, { scale: 1, duration: 1.2, ease: 'power2.inOut' }, 0);

    if (parallaxes.length) {
      gsap.set(parallaxes, { top: isMobile ? '-=5rem' : '-=10rem' });
      gsap.to(parallaxes, {
        top: isMobile ? '+=10rem' : '+=20rem',
        scrollTrigger: {
          trigger: instTrigger,
          scrub: true,
        },
      });
    }
  }

  // ==========================================
  // 14. FOOTER PARALLAX & FADE ELEMENTS
  // ==========================================
  const footer = document.getElementById('footer');
  if (footer) {
    const fadeEls = footer.querySelectorAll('.fadeElement');
    const frontImg = footer.querySelector('.front');

    // Staggered batch entrance for footer items (GSAP ScrollTrigger skill best practice)
    if (fadeEls.length) {
      gsap.set(fadeEls, { opacity: 0, y: 30, filter: 'blur(4px)' });
      ScrollTrigger.batch(fadeEls, {
        interval: 0.08,
        batchMax: 5,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            y: 30,
            filter: 'blur(4px)',
            duration: 0.4,
            overwrite: 'auto',
          }),
      });
    }

    if (frontImg) {
      gsap.fromTo(
        frontImg,
        { yPercent: -10, scale: 1.05 },
        {
          yPercent: 12,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footer.querySelector('.scroller') || footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        }
      );
    }
  }

  // ==========================================
  // 15. CONTACT MODAL & TOAST NOTIFICATION
  // ==========================================
  const contactModalBackdrop = document.getElementById('contactModalBackdrop');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const contactForm = document.getElementById('contactForm');
  const arborFooterForm = document.getElementById('arborFooterForm');
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');

  const showToast = (msg) => {
    if (!toastNotice) return;
    if (toastMsg) toastMsg.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3800);
  };

  document.querySelectorAll('.open-contact-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (arborHeader && arborHeader.classList.contains('is-open')) {
        arborHeader.classList.remove('is-open');
        if (arborMenuToggle) arborMenuToggle.setAttribute('aria-expanded', 'false');
        if (arborMenuText) arborMenuText.textContent = 'Menu';
      }
      if (contactModalBackdrop) {
        contactModalBackdrop.classList.add('open');
      }
    });
  });

  if (closeContactModalBtn && contactModalBackdrop) {
    closeContactModalBtn.addEventListener('click', () => {
      contactModalBackdrop.classList.remove('open');
    });
    contactModalBackdrop.addEventListener('click', (e) => {
      if (e.target === contactModalBackdrop) {
        contactModalBackdrop.classList.remove('open');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (contactModalBackdrop) {
        contactModalBackdrop.classList.remove('open');
      }
      contactForm.reset();
      showToast('Thank you! A BaytImmo advisor will contact you shortly.');
    });
  }

  if (arborFooterForm) {
    arborFooterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      arborFooterForm.reset();
      showToast('Thank you for subscribing to BaytImmo updates.');
    });
  }

  // ==========================================
  // 16. LAZY LOAD OFF-SCREEN MP4 VIDEOS (Save ~60MB on Initial Load)
  // ==========================================
  const lazyVideos = Array.from(document.querySelectorAll('.lazy-video'));
  if (lazyVideos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const vid = entry.target;
          if (vid.dataset.src && !vid.src) {
            vid.src = vid.dataset.src;
            vid.load();
            vid.play().catch(() => { });
          }
          observer.unobserve(vid);
        }
      });
    }, { rootMargin: '300px 0px' });

    lazyVideos.forEach((v) => videoObserver.observe(v));
  }

  // Ensure accurate ScrollTrigger calculation once all images, fonts, and assets load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
