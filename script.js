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

/* ==============================
   Universal Carousel (Infinite Loop + Swipe)
   Works for: .carousel-section (about, journal, sessions, explore…)
============================== */
document.querySelectorAll('.carousel-section').forEach(section => {
  const track = section.querySelector('.carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const prevBtn = section.querySelector('.prev-btn, .carousel-btn.prev');
  const nextBtn = section.querySelector('.next-btn, .carousel-btn.next');

  if (slides.length === 0) return;

  // Clone first and last slides
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  let currentIndex = 1; // start at "real" first slide
  let slideWidth = slides[0].getBoundingClientRect().width;

  // Initial position
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  function moveToSlide(i) {
    track.style.transition = 'transform 0.5s ease-in-out';
    currentIndex = i;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  function snapWithoutAnimation(i) {
    track.style.transition = 'none';
    currentIndex = i;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  // Next
  nextBtn?.addEventListener('click', () => {
    moveToSlide(currentIndex + 1);
  });

  // Prev
  prevBtn?.addEventListener('click', () => {
    moveToSlide(currentIndex - 1);
  });

  // Handle looping
  track.addEventListener('transitionend', () => {
    if (currentIndex >= slides.length + 1) {
      snapWithoutAnimation(1); // loop back to start
    }
    if (currentIndex <= 0) {
      snapWithoutAnimation(slides.length); // loop to end
    }
  });

  // Resize handling
  window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width;
    snapWithoutAnimation(currentIndex);
  });

  // Swipe for mobile
  let startX = 0;
  track.addEventListener('touchstart', e => (startX = e.touches[0].clientX));
  track.addEventListener('touchend', e => {
    let dx = e.changedTouches[0].clientX - startX;
    if (dx > 50) prevBtn?.click();
    if (dx < -50) nextBtn?.click();
  });
});
