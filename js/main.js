// ===== BURGER + SIDEBAR =====
const burger = document.querySelector('.burger');
const sidebar = document.querySelector('.sidebar');
const scrim = document.querySelector('.scrim');

function closeSidebar() {
  burger?.classList.remove('open');
  sidebar?.classList.remove('show');
  scrim?.classList.remove('active');
}

if (burger && sidebar && scrim) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    sidebar.classList.toggle('show');
    scrim.classList.toggle('active');
  });

  scrim.addEventListener('click', closeSidebar);
}

// ===== DROPDOWN TOGGLE =====
document.querySelectorAll('.sidebar .dropdown > button').forEach(button => {
  button.addEventListener('click', e => {
    e.stopPropagation();
    const expanded = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.sidebar .dropdown > button')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

// Close dropdowns on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.sidebar .dropdown')) {
    document.querySelectorAll('.sidebar .dropdown > button')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
});

// Escape closes everything
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    document.querySelectorAll('.sidebar .dropdown > button')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
});

// ===== TOUCH-SCROLL CAROUSEL (offset-based like original) =====
document.querySelectorAll('.carousel').forEach(carousel => {
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const cards = carousel.querySelectorAll('.c-card');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const dots = carousel.querySelectorAll('.carousel-dots button');

  let index = 0;
  let positions = [];

  // Compute left offsets of each card relative to the track
  function computePositions() {
    positions = Array.from(cards).map(el => el.offsetLeft);
  }

  function scrollToIndex(i) {
    if (i < 0) index = cards.length - 1;
    else if (i >= cards.length) index = 0;
    else index = i;

    viewport.scrollTo({
      left: positions[index],
      behavior: 'smooth'
    });

    dots.forEach((dot, dIdx) =>
      dot.toggleAttribute('aria-current', dIdx === index)
    );
  }

  function nearestIndex() {
    const x = viewport.scrollLeft;
    let best = 0, bestDist = Infinity;
    positions.forEach((p, i) => {
      const dist = Math.abs(p - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  // Button clicks
  nextBtn?.addEventListener('click', () => scrollToIndex(index + 1));
  prevBtn?.addEventListener('click', () => scrollToIndex(index - 1));

  // Dot clicks
  dots.forEach((dot, dIdx) =>
    dot.addEventListener('click', () => scrollToIndex(dIdx))
  );

  // Sync dots on manual scroll
  viewport.addEventListener('scroll', () => {
    const i = nearestIndex();
    if (i !== index) {
      index = i;
      dots.forEach((dot, dIdx) =>
        dot.toggleAttribute('aria-current', dIdx === index)
      );
    }
  });

  // Init
  window.addEventListener('load', () => {
    computePositions();
    scrollToIndex(0);
  });
  window.addEventListener('resize', () => {
    computePositions();
    scrollToIndex(nearestIndex());
  });
});
