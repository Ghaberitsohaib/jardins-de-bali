import './arbor.css';
import './business.css';
import { initMotion, initScrollReveals } from './motion.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. UNIFIED LENIS + GSAP MOTION ENGINE
  // ==========================================
  const { lenis } = initMotion({ pageName: 'contact' });

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
  // 4. CONTACT FORM SUBMISSION & WHATSAPP SYNC
  // ==========================================
  const contactForm = document.getElementById('mainContactForm');
  const toastNotice = document.getElementById('toastNotice');

  function showToast(msg) {
    if (!toastNotice) return;
    const txt = toastNotice.querySelector('#toastMsg');
    if (txt) txt.textContent = msg;
    toastNotice.classList.add('is-visible');
    setTimeout(() => {
      toastNotice.classList.remove('is-visible');
    }, 5500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const firstName = formData.get('firstName') || '';
      const lastName = formData.get('lastName') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const callTime = formData.get('callTime') || '';
      const propertyType = formData.get('propertyType') || '';
      const whatsappConsent = contactForm.querySelector('#callback-whatsappConsent')?.checked;

      // Construct WhatsApp message if user consented
      if (whatsappConsent) {
        const text = `Bonjour BaytImmo, je m'appelle ${firstName} ${lastName} (Tél: ${phone}, Email: ${email}). ` +
                     `Je suis intéressé(e) par: ${propertyType}. ` +
                     `Créneau souhaité pour l'appel: ${callTime}.`;

        window.open(`https://wa.me/212661550905?text=${encodeURIComponent(text)}`, '_blank');
      }

      contactForm.reset();
      showToast(`Merci ${firstName} ! Votre demande pour les Jardins de Bali Marrakech a été transmise avec succès à notre équipe commerciale.`);
    });
  }

  // Soft stagger reveal for contact form elements
  initScrollReveals('#mainContactForm .grid > div', { stagger: 0.06 });
});

