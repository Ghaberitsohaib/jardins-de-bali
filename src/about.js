import './arbor.css';
import './business.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion, initScrollReveals, MOTION_CONFIG } from './motion.js';
import { bindFooterWeb3Form } from './web3forms.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED LENIS + GSAP MOTION ENGINE
  // ==========================================
  const { lenis } = initMotion({ pageName: 'about' });

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
    if (e.key === 'Escape') closeArborMenu();
  });

  // Scroll down button
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      lenis.scrollTo('#Static1', { offset: 0, duration: 1.2 });
    });
  }

  // ==========================================
  // 3. EXACT 10-TRAIL SILK CURSOR (#canvas)
  // Matching Belgrade Arbor quadraticCurveTo physics
  // ==========================================
  const cursorCanvas = document.getElementById('canvas');
  if (cursorCanvas && window.matchMedia('(min-width: 1024px)').matches) {
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
        ctx.strokeStyle = 'hsla(34.19, 34.96%, 48.24%, 0.25)';
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
    }
  }

  // ==========================================
  // 4. GSAP ANIMATIONS: HERO & PARALLAX (1:1 BELGRADE ARBOR)
  // ==========================================
  const heroTrigger = document.querySelector('#Hero .trigger');
  if (heroTrigger) {
    gsap.timeline({
      scrollTrigger: {
        trigger: heroTrigger,
        start: 'top top',
        end: 'bottom top',
        scrub: MOTION_CONFIG.scrub.factor,
      },
    }).to('#Hero .background', { y: '12rem', ease: 'none' });

    // Infinite bouncing arrow
    gsap.timeline({ repeat: -1, ease: 'power2.inOut', duration: 0.9 })
      .fromTo('#Hero .arrow-icon', { y: '-0.5rem', opacity: 0.2 }, { y: 0, opacity: 1 })
      .to('#Hero .arrow-icon', { y: '0.5rem', opacity: 0.2 });
  }

  // ==========================================
  // 5. GSAP ANIMATIONS: STATIC 1 DUAL MASKS
  // ==========================================
  const static1Trigger = document.querySelector('#Static1 .trigger');
  if (static1Trigger) {
    gsap.fromTo(
      '#Static1 .image1',
      { yPercent: -10, scale: 1.15 },
      {
        yPercent: 10,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: static1Trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      }
    );

    gsap.fromTo(
      '#Static1 .image2',
      { yPercent: 12, scale: 1.15 },
      {
        yPercent: -12,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: static1Trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      }
    );

    initScrollReveals('#Static1 .animatedText', { trigger: static1Trigger, stagger: 0.1 });
  }

  // ==========================================
  // 6. GSAP ANIMATIONS: PINNED PROJECTS SLIDESHOW (1:1 BELGRADE ARBOR)
  // ==========================================
  const projectsSection = document.getElementById('Projects');
  if (projectsSection && window.innerWidth >= 1024) {
    const contents = gsap.utils.toArray('#Projects .content');
    const imageContainers = gsap.utils.toArray('#Projects .imageContainer');
    const progressNums = gsap.utils.toArray('#Projects .progress-num');

    // Initial state
    gsap.set(contents, { opacity: 0, y: '1.5rem', pointerEvents: 'none' });
    gsap.set(contents[0], { opacity: 1, y: '0', pointerEvents: 'auto' });

    gsap.set(imageContainers, { width: 0, zIndex: 0 });
    gsap.set(imageContainers[0], { width: '100%', zIndex: 1, left: 'auto', right: 0 });

    gsap.set(progressNums, { opacity: 0, y: '1rem' });
    gsap.set(progressNums[0], { opacity: 1, y: '0' });

    gsap.set('#Projects .progress', { width: '0%' });

    let activeIndex = 0;

    // Pinning and transition timeline
    ScrollTrigger.create({
      trigger: '#Projects .wrapper',
      start: 'top top',
      pin: true,
      end: () => '+=' + (contents.length * 900),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIndex = Math.min(contents.length - 1, Math.floor(self.progress * contents.length));
        if (nextIndex === activeIndex) return;

        const isForward = nextIndex > activeIndex;

        // Content text transitions
        gsap.to(contents[activeIndex], { opacity: 0, y: isForward ? '-1rem' : '1rem', duration: 0.5, pointerEvents: 'none' });
        gsap.to(contents[nextIndex], { opacity: 1, y: '0', duration: 0.5, pointerEvents: 'auto' });

        // Ensure all other contents are cleanly hidden
        contents.forEach((c, idx) => {
          if (idx !== activeIndex && idx !== nextIndex) {
            gsap.set(c, { opacity: 0, pointerEvents: 'none' });
          }
        });

        // Image container clip/width transition
        const currImg = imageContainers[activeIndex];
        const nextImg = imageContainers[nextIndex];

        if (isForward) {
          gsap.set(currImg, { left: 0, right: 'auto', zIndex: 1 });
          gsap.set(nextImg, { left: 'auto', right: 0, zIndex: 2 });
        } else {
          gsap.set(currImg, { left: 'auto', right: 0, zIndex: 1 });
          gsap.set(nextImg, { left: 0, right: 'auto', zIndex: 2 });
        }

        gsap.to(currImg, { width: 0, ease: 'power2.inOut', duration: 0.7 });
        gsap.to(nextImg, { width: '100%', ease: 'power2.inOut', duration: 0.7 });

        // Clean up all other images
        imageContainers.forEach((img, idx) => {
          if (idx !== activeIndex && idx !== nextIndex) {
            gsap.set(img, { width: 0, zIndex: 0 });
          }
        });

        // Progress numbers transition
        gsap.to(progressNums[activeIndex], {
          opacity: 0,
          y: isForward ? '-1rem' : '1rem',
          duration: 0.4,
        });
        gsap.fromTo(
          progressNums[nextIndex],
          { opacity: 0, y: isForward ? '1rem' : '-1rem' },
          { opacity: 1, y: '0', duration: 0.4 }
        );

        activeIndex = nextIndex;
      },
    });

    // Scrub progress bar
    gsap.timeline({
      scrollTrigger: {
        trigger: '#Projects',
        start: 'top top',
        end: () => '+=' + (contents.length * 900),
        scrub: MOTION_CONFIG.scrub.factor,
      },
    }).to('#Projects .progress', { width: '100%', ease: 'none' });
  }

  // ==========================================
  // 7. GSAP ANIMATIONS: STATIC 2 (DESK MASK & MANIFESTO)
  // ==========================================
  const static2Trigger = document.querySelector('#Static2 .trigger');
  if (static2Trigger) {
    gsap.fromTo(
      '#Static2 .image',
      { yPercent: -15, scale: 1.15 },
      {
        yPercent: 15,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: static2Trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION_CONFIG.scrub.factor,
        },
      }
    );

    initScrollReveals('#Static2 .animatedText', { trigger: static2Trigger, stagger: 0.1 });
  }

  // Footer Newsletter Form
  const footerForm = document.getElementById('arborFooterForm');
  bindFooterWeb3Form(footerForm, {
    sourceLabel: "L'Investisseur Footer",
    successMessage: 'Merci pour votre inscription ! Votre demande a bien été transmise à BaytImmo.',
    notify: (msg) => alert(msg),
  });
});

