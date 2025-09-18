// ===== BURGER + SIDEBAR =====
const burger = document.querySelector('.burger');
const sidebar = document.querySelector('.sidebar');
const scrim = document.querySelector('.scrim');
const sidebarLinks = document.querySelectorAll('nav.sidebar a, nav.sidebar .dropdown > button');

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

    // Animate links when opening
    if (sidebar.classList.contains('show')) {
      sidebarLinks.forEach((link, i) => {
        link.style.opacity = "0";
        link.style.transform = "translateX(20px)";
        link.style.transition = `opacity 0.35s ease ${i * 0.05}s, transform 0.35s ease ${i * 0.05}s`;
        setTimeout(() => {
          link.style.opacity = "1";
          link.style.transform = "translateX(0)";
        }, 10);
      });
    }
  });

  scrim.addEventListener('click', closeSidebar);
}

// ===== DESKTOP SIDEBAR TOGGLE =====
const sidebarToggle = document.querySelector('.sidebar-toggle');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
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

    // Animate dropdown children if opening
    const menu = button.nextElementSibling;
    if (!expanded && menu) {
      const links = menu.querySelectorAll('a');
      links.forEach((link, i) => {
        link.classList.remove('show'); // reset
        setTimeout(() => {
          link.classList.add('show');
        }, i * 70); // stagger each child
      });
    } else if (menu) {
      menu.querySelectorAll('a').forEach(link => link.classList.remove('show'));
    }
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

// ===== CLOSE SIDEBAR & DROPDOWNS ON LINK CLICK =====
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    // Close all dropdowns
    closeAllDropdowns();

    // Collapse the sidebar if open
    closeSidebar();
  });
});

// ===== NEW: CLOSE DROPDOWN WHEN A CHILD LINK IS CLICKED =====
document.querySelectorAll('.sidebar .dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    const dropdownButton = link.closest('.dropdown').querySelector('button');
    if (dropdownButton) {
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });
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

  const computePositions = () => {
    cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap) || 0;
  };

  const scrollToIndex = (i) => {
    if (i < 0) i = 0;
    if (i >= cards.length) i = cards.length - 1;
    index = i;
    viewport.scrollTo({ left: i * cardWidth, behavior: 'smooth' });

    dots.forEach((dot, di) => {
      dot.setAttribute("aria-current", di === i ? "true" : "false");
    });
  };

  const nearestIndex = () => Math.round(viewport.scrollLeft / cardWidth);

  if (prevBtn) prevBtn.addEventListener('click', () => scrollToIndex(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToIndex(index + 1));
  dots.forEach((dot, di) => dot.addEventListener('click', () => scrollToIndex(di)));

  let isScrolling;
  viewport.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      scrollToIndex(nearestIndex());
    }, 120);
  });

  window.addEventListener('resize', () => {
    computePositions();
    scrollToIndex(nearestIndex());
  });
});

/* === POLISH: Magnetic Hover Effect with CSS Vars ================== */
function addMagneticHover(elements, strength = 6) {
  elements.forEach(el => {
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
      el.style.setProperty("--hover-x", `${x}px`);
      el.style.setProperty("--hover-y", `${y}px`);
    });
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--hover-x", "0px");
      el.style.setProperty("--hover-y", "0px");
    });
  });
}

addMagneticHover(document.querySelectorAll(
  "nav.sidebar a, nav.sidebar .dropdown > button, nav.sidebar .dropdown-menu a"
));



// ===== PROGRESS BAR =====
(() => {
  const fill = document.getElementById('progress-fill');
  const header = document.querySelector('.ll-nav');

  function place() {
    const h = header?.getBoundingClientRect().height || 56;
    document.documentElement.style.setProperty('--progress-top', h + 'px');
  }

  function pct() {
    const doc = document.documentElement;
    const sc = Math.max(doc.scrollTop, document.body.scrollTop);
    const max = (doc.scrollHeight || document.body.scrollHeight) - innerHeight;
    const r = max > 0 ? Math.min(1, Math.max(0, sc / max)) : 0;
    if (fill) fill.style.width = (r * 100).toFixed(2) + '%';
  }

  place();
  pct();
  addEventListener('resize', place, { passive: true });
  addEventListener('scroll', pct, { passive: true });
})();
