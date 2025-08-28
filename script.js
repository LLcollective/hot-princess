/* ==============================
   Progress Bar
============================== */
(function () {
  const bar = document.querySelector('.progress span');
  if (!bar) return;
  window.addEventListener(
    'scroll',
    () => {
      const h = document.documentElement;
      const percent =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = percent + '%';
    },
    { passive: true }
  );
})();

/* ==============================
   Headline Glitter (restartable)
============================== */
(function () {
  const tl = document.querySelector('.tagline');
  if (!tl) return;

  function play() {
    tl.classList.remove('glitter');
    void tl.offsetWidth; // force reflow
    tl.classList.add('glitter');
  }

  window.addEventListener('load', play);
  tl.addEventListener('click', play);
  tl.addEventListener('touchstart', play, { passive: true });
})();

/* ==============================
   Theme Switcher (persisted)
============================== */
(function () {
  const DEFAULT_THEME = 'lacelime';
  const KEY = 'll_theme';

  const applyTheme = (name) => {
    document.body.setAttribute('data-theme', name);
    document.querySelectorAll('.theme-switch [data-set-theme]').forEach(b => {
      const isActive = b.getAttribute('data-set-theme') === name;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
    try { localStorage.setItem(KEY, name); } catch (_) {}
  };

  const saved = (() => { try { return localStorage.getItem(KEY); } catch (_) { return null; } })();
  applyTheme(saved || document.body.getAttribute('data-theme') || DEFAULT_THEME);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-switch [data-set-theme]');
    if (!btn) return;
    const theme = btn.getAttribute('data-set-theme');
    applyTheme(theme);
  }, { passive: true });
})();

/* ==============================
   Contact Form Handler
============================== */
(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');
  const ENDPOINT = '/api/send';

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    status.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const payload = {
      firstName: form.firstName?.value.trim(),
      lastName: form.lastName?.value.trim(),
      email: form.email?.value.trim(),
      subject: form.subject?.value.trim(),
      message: form.message?.value.trim(),
      page: location.pathname,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Send failed');
      form.reset();
      status.className = 'status ok';
      status.textContent = '✅ Message sent successfully!';
    } catch (err) {
      console.error(err);
      status.className = 'status err';
      status.textContent =
        '❌ Could not send. Please email laceandlime.llc@gmail.com for support.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  });
})();

// ==============================
// Universal Carousel (buttons + swipe + responsive width)
// ==============================
document.querySelectorAll('.carousel-section').forEach(section => {
  const track  = section.querySelector('.carousel-track');
  const cards  = section.querySelectorAll('.carousel-card');
  const prev   = section.querySelector('.prev-btn');
  const next   = section.querySelector('.next-btn');
  if (!track || cards.length < 1) return;

  let index = 0;

  function go(i) {
    // clamp to valid range first
    index = (i + cards.length) % cards.length;
    const cardWidth = cards[0].offsetWidth;   // responsive width
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  const nextSlide = () => go(index + 1);
  const prevSlide = () => go(index - 1);

  next && next.addEventListener('click', nextSlide);
  prev && prev.addEventListener('click', prevSlide);

  // Chrome-mobile swipe (preventDefault only on real horizontal move)
  let startX = 0, dragging = false;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive:true });

  track.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - startX;
    if (Math.abs(dx) > 10) e.preventDefault(); // block only if real swipe
    if (dx > 50)  { prevSlide(); dragging = false; }
    if (dx < -50) { nextSlide(); dragging = false; }
  }, { passive:false });

  track.addEventListener('touchend', () => { dragging = false; });

  // Recalculate on resize
  window.addEventListener('resize', () => go(index));

  // Init
  go(0);
});
