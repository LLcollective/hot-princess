// Lace & Lime — single source of truth for nav + submenus
(() => {
  // We support either .hamburger or .menu-toggle (use whichever your markup has)
  const burger = document.querySelector('.hamburger, .menu-toggle');
  const panel  = document.querySelector('#primary-nav.nav-links');
  if (!burger || !panel) return;

  // A11y hooks
  burger.setAttribute('aria-controls', 'primary-nav');
  burger.setAttribute('aria-expanded', 'false');

  const openMenu  = () => { document.body.classList.add('nav-open');  burger.setAttribute('aria-expanded','true'); };
  const closeMenu = () => { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded','false'); };
  const toggle    = () => (document.body.classList.contains('nav-open') ? closeMenu() : openMenu());

  // Toggle the mobile menu
  burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

  // Auto-close when a nav link is tapped
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Close if you click outside the header area
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (e.target.closest('.nav-wrap')) return; // clicks inside header are OK
    closeMenu();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // ---------- Submenus: click on mobile, hover handled by CSS on desktop ----------
  const desktopMQ = window.matchMedia('(min-width: 860px)');
  document.querySelectorAll('.has-sub > .sub-toggle').forEach((btn) => {
    const li = btn.closest('.has-sub');
    if (!li) return;
    btn.addEventListener('click', (e) => {
      if (desktopMQ.matches) return; // desktop hover is handled in CSS
      e.preventDefault();
      e.stopPropagation();
      const open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // ---------- Active link highlight ----------
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const file = (a.getAttribute('href') || '').split('/').pop();
    if (file === current) a.classList.add('active');
  });
})();


//--------------------


const hamburger = document.querySelector('.hamburger');
const drawer = document.getElementById('drawer');

hamburger.addEventListener('click', () => {
  drawer.classList.toggle('open');
});


//--------------------
