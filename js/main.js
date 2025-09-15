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
function closeAllDropdowns() {
  document.querySelectorAll('.sidebar .dropdown > button')
    .forEach(b => b.setAttribute('aria-expanded', 'false'));
}

document.querySelectorAll('.sidebar .dropdown > button').forEach(button => {
  button.addEventListener('click', e => {
    e.stopPropagation();
    const expanded = button.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns();
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

// Close on outside click (ignore clicks on buttons or menus)
document.addEventListener('click', e => {
  if (
    !e.target.closest('.sidebar .dropdown-menu') &&
    !e.target.closest('.sidebar .dropdown > button')
  ) {
    closeAllDropdowns();
  }
});

// Escape closes everything
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeAllDropdowns();
  }
});


/* === CAROUSEL LOGIC (Universal) ============================ */
document.querySelectorAll('.carousel').forEach(carousel => {
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const cards = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dots = Array.from(carousel.querySelectorAll('.carousel-dots button'));

  let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap) || 0;
  let index = 0;

  // Update card width if window resizes
  const computePositions = () => {
    cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap) || 0;
  };

  // Scroll to given index
  const scrollToIndex = (i) => {
    if (i < 0) i = 0;
    if (i >= cards.length) i = cards.length - 1;
    index = i;
    viewport.scrollTo({ left: i * cardWidth, behavior: 'smooth' });

    dots.forEach((dot, di) => {
      dot.setAttribute("aria-current", di === i ? "true" : "false");
    });
  };

  // Nearest index based on scroll position
  const nearestIndex = () => {
    return Math.round(viewport.scrollLeft / cardWidth);
  };

  // Button events
  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToIndex(index - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToIndex(index + 1));
  }

  // Dot events
  dots.forEach((dot, di) => {
    dot.addEventListener('click', () => scrollToIndex(di));
  });

  // Snap on scroll end
  let isScrolling;
  viewport.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      scrollToIndex(nearestIndex());
    }, 120);
  });

  // Adjust on resize
  window.addEventListener('resize', () => {
    computePositions();
    scrollToIndex(nearestIndex());
  });
});
