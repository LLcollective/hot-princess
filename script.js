/* ==============================
   Progress Bar
   ============================== */
(function () {
  const bar = document.querySelector('.progress span');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const percent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = percent + '%';
  }, { passive: true });
})();

/* ==============================
   Headline Glitter (fixed)
   ============================== */
(function () {
  const tl = document.querySelector('.tagline');
  if (!tl) return;

  function play() {
    tl.classList.remove('glitter'); // reset
    void tl.offsetWidth;            // force reflow so animation restarts
    tl.classList.add('glitter');
  }

  // shimmer once when page loads
  window.addEventListener('load', play);

  // shimmer again on click/tap
  tl.addEventListener('click', play);
  tl.addEventListener('touchstart', play, { passive: true });
})();

/* ==============================
   Theme Switcher
   ============================== */
(function () {
  const saved = localStorage.getItem('theme');
  const initial = saved || document.body.dataset.theme || 'fresh-lime';
  document.body.dataset.theme = initial;
  setActive(initial);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-set-theme]');
    if (!btn) return;
    const theme = btn.dataset.setTheme;
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    setActive(theme);
  });

  function setActive(theme) {
    document.querySelectorAll('.theme-switch [data-set-theme]')
      .forEach(b => b.classList.toggle('active', b.dataset.setTheme === theme));
  }
})();
