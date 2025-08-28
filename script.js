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
// Universal Carousel Logic
// ==============================
document.querySelectorAll(".carousel-section").forEach(section => {
  const track = section.querySelector(".carousel-track");
  const cards = section.querySelectorAll(".carousel-card");
  const prevBtn = section.querySelector(".prev-btn");
  const nextBtn = section.querySelector(".next-btn");

  if (!track || cards.length === 0) return;

  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % cards.length;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  // Buttons
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Swipe (mobile)
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchmove", e => {
    if (!isDragging) return;
    e.preventDefault(); // prevent vertical scroll hijack in Chrome
    const dx = e.touches[0].clientX - startX;
    if (dx > 50) { prevSlide(); isDragging = false; }
    if (dx < -50) { nextSlide(); isDragging = false; }
  }, { passive: false });

  track.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Initialize
  updateCarousel();
});
