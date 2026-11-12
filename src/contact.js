import './arbor.css';
import './business.css';
import { initMotion, initScrollReveals } from './motion.js';
import { submitToWeb3Forms } from './web3forms.js';

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
  // 4. CONTACT FORM SUBMISSION & EMAIL / WHATSAPP
  // ==========================================
  const contactForm = document.getElementById('mainContactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const toastNotice = document.getElementById('toastNotice');

  function showToast(msg) {
    if (!toastNotice) return;
    const txt = toastNotice.querySelector('#toastMsg');
    if (txt) txt.textContent = msg;
    toastNotice.classList.add('is-visible');
    setTimeout(() => {
      toastNotice.classList.remove('is-visible');
    }, 6000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const firstName = (formData.get('firstName') || '').toString().trim();
      const lastName = (formData.get('lastName') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const callTime = (formData.get('callTime') || '').toString().trim();
      const propertyType = (formData.get('propertyType') || '').toString().trim();
      const whatsappConsent = contactForm.querySelector('#callback-whatsappConsent')?.checked;

      // 1. Bouton en état de chargement "Envoi en cours..."
      const btnContent = contactSubmitBtn?.querySelector('.contact-btn-content');
      const originalBtnHTML = btnContent ? btnContent.innerHTML : (contactSubmitBtn?.innerHTML || '');
      
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        if (btnContent) {
          btnContent.innerHTML = `
            <span class="contact-btn-spinner"></span>
            <span class="contact-btn-text">Envoi en cours...</span>
          `;
        }
      }

      // 2. Préparation des données d'email
      const emailPayload = {
        subject: `[BaytImmo] Nouvelle Demande - ${firstName} ${lastName} (${propertyType})`,
        from_name: `${firstName} ${lastName}`,
        reply_to: email,
        nom_complet: `${firstName} ${lastName}`,
        prenom: firstName,
        nom: lastName,
        telephone: phone,
        email: email,
        type_de_bien: propertyType,
        creneau_de_rappel: callTime,
        contact_whatsapp_souhaite: whatsappConsent ? 'Oui' : 'Non',
      };

      // 3. Envoi via l'API Web3Forms partagée
      const emailSent = await submitToWeb3Forms(emailPayload);

      // 4. Ouverture WhatsApp si le client a coché l'option
      if (whatsappConsent) {
        const text = `Bonjour BaytImmo, je m'appelle ${firstName} ${lastName} (Tél: ${phone}, Email: ${email}). ` +
                     `Je suis intéressé(e) par: ${propertyType}. ` +
                     `Créneau souhaité pour l'appel: ${callTime}.`;

        window.open(`https://wa.me/212665644391?text=${encodeURIComponent(text)}`, '_blank');
      }

      // 5. Restauration du bouton et confirmation
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        if (btnContent) {
          btnContent.innerHTML = originalBtnHTML;
        }
      }

      contactForm.reset();

      if (emailSent) {
        showToast(`Merci ${firstName} ! Votre demande a été transmise directement par email à contact@bayti-immo.com.`);
      } else {
        showToast(`Merci ${firstName} ! Votre demande pour les Jardins de Bali a bien été enregistrée.`);
      }
    });
  }

  // ==========================================
  // 5. ULTRA-LUXURY CUSTOM SELECT COMPONENT
  // ==========================================
  function initCustomSelects() {
    const wrappers = document.querySelectorAll('.custom-select-wrapper');

    wrappers.forEach((wrapper) => {
      const trigger = wrapper.querySelector('.custom-select-trigger');
      const valueSpan = wrapper.querySelector('.custom-select-value');
      const dropdown = wrapper.querySelector('.custom-select-dropdown');
      const options = wrapper.querySelectorAll('.custom-select-option');
      const nativeSelect = wrapper.querySelector('select');

      if (!trigger || !dropdown || !nativeSelect) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('is-open');
        // Close all other selects
        wrappers.forEach((w) => {
          if (w !== wrapper) {
            w.classList.remove('is-open');
            w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });

        wrapper.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.getAttribute('data-value') || '';
          const labelText = opt.querySelector('span')?.textContent || val;

          // Update trigger text
          if (valueSpan) valueSpan.textContent = labelText;

          // Update native select
          nativeSelect.value = val;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Update active class
          options.forEach((o) => o.classList.remove('is-selected'));
          opt.classList.add('is-selected');

          // Close dropdown
          wrapper.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrapper')) {
        wrappers.forEach((w) => {
          w.classList.remove('is-open');
          w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        wrappers.forEach((w) => {
          w.classList.remove('is-open');
          w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Reset support
    if (contactForm) {
      contactForm.addEventListener('reset', () => {
        setTimeout(() => {
          wrappers.forEach((w) => {
            const firstOpt = w.querySelector('.custom-select-option');
            const valueSpan = w.querySelector('.custom-select-value');
            if (firstOpt && valueSpan) {
              w.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('is-selected'));
              firstOpt.classList.add('is-selected');
              valueSpan.textContent = firstOpt.querySelector('span')?.textContent || '';
            }
          });
        }, 10);
      });
    }
  }

  initCustomSelects();

  // Soft stagger reveal for contact form elements
  initScrollReveals('#mainContactForm .grid > div', { stagger: 0.06 });
});

