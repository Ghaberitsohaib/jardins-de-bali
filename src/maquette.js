import './arbor.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Menu Toggle (Belgrade Arbor Floating Pill)
  const arborHeader = document.getElementById('overlayHeader');
  const arborMenuToggle = document.getElementById('mobileMenuToggle');
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
      if (arborHeader.classList.contains('is-open')) {
        closeArborMenu();
      } else {
        openArborMenu();
      }
    });
  }

  if (arborMenuBackdrop) {
    arborMenuBackdrop.addEventListener('click', closeArborMenu);
  }

  // 2. Exact Direct URLs (No top bar collision, pure full-screen views)
  const URLS = {
    model: 'https://www.vertex-france.com/PACKAGE/KISMOGOOD/JARDINS_DE_BALI/navigation/model/index.html',
    gallery: 'https://www.vertex-france.com/PACKAGE/KISMOGOOD/JARDINS_DE_BALI/navigation/gallery/index.html?appGalleryMode=true&nbImage=4',
    plan: 'https://www.vertex-france.com/PACKAGE/KISMOGOOD/JARDINS_DE_BALI/navigation/plan/index.html',
    visit: 'https://tour.panoee.net/68f5170ad87e791af81b2938/68f618fc9b0fc47052dcb548',
    bookmarks: 'https://www.vertex-france.com/PACKAGE/KISMOGOOD/JARDINS_DE_BALI/navigation/bookmark/index.html',
  };

  const iframe = document.getElementById('vertexIframe');
  const loader = document.getElementById('viewerLoader');
  const modePills = document.querySelectorAll('[data-vertex-mode]');

  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 450);
  }

  function showLoader() {
    if (!loader) return;
    loader.style.display = 'flex';
    requestAnimationFrame(() => {
      loader.style.opacity = '1';
    });
  }

  if (iframe) {
    iframe.addEventListener('load', () => {
      hideLoader();
    });
  }

  // 3. Bottom Pill Navigation Handler
  modePills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = pill.getAttribute('data-vertex-mode');
      const targetUrl = URLS[mode];

      if (!targetUrl || !iframe) return;

      // Avoid reloading if clicking current mode
      if (iframe.getAttribute('data-current-mode') === mode) return;

      modePills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      showLoader();
      iframe.setAttribute('data-current-mode', mode);
      iframe.src = targetUrl;
    });
  });
});
