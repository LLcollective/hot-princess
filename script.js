// script.js — Lace & Lime nav + dropdowns + scroll reveal
(function () {
  // -------- Mobile hamburger toggle + auto-close --------
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav-links');

  if (menuBtn && nav) {
    const toggleMenu = () => {
      const open = nav.classList.toggle('open');
      nav.style.display = open ? 'flex' : '';
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', toggleMenu);

    // Auto-close after clicking any link (mobile only)
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (getComputedStyle(menuBtn).display !== 'none') {
          nav.classList.remove('open');
          nav.style.display = '';
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------- Submenus: click on mobile, hover-friendly on desktop --------
  const groups = document.querySelectorAll('.has-sub');
  const mqDesktop = window.matchMedia('(min-width:860px)');

  groups.forEach((group) => {
    const btn = group.querySelector('.sub-toggle');
    if (!btn) return;

    // Mobile: toggle open on click (and don't bubble to page)
    btn.addEventListener('click', (e) => {
      if (!mqDesktop.matches) {
        e.preventDefault();
        e.stopPropagation();
        const open = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });

    // Desktop: keep open while moving mouse into submenu (with small delay)
    let timer;
    group.addEventListener('mouseenter', () => {
      if (!mqDesktop.matches) return;
      clearTimeout(timer);
      group.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('mouseleave', () => {
      if (!mqDesktop.matches) return;
      timer = setTimeout(() => {
        group.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }, 180); // grace period prevents flicker on the gap
    });
  });

  // Close any open submenu when clicking elsewhere (mobile + desktop)
  document.addEventListener('click', (e) => {
    // ignore clicks inside any .has-sub
    if (e.target.closest('.has-sub')) return;
    groups.forEach((g) => {
      g.classList.remove('open');
      const b = g.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  // -------- Active link highlight + keep About open on subpages --------
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const file = (a.getAttribute('href') || '').split('/').pop();
    if (file === current) a.classList.add('active');
  });
  if (current === 'who-we-are.html' || current === 'founder.html') {
    const about = document.querySelector('.has-sub');
    if (about) {
      about.classList.add('open');
      const b = about.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'true');
    }
  }

  // -------- Scroll-reveal for cards/sections --------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // fallback
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();









// Mobile nav toggle
const toggle = document.querySelector('.menu-toggle');
const links  = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Accessible submenus
document.querySelectorAll('.has-sub > .sub-toggle').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const li = btn.closest('.has-sub');
    const open = li.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});





<script>
  const btn = document.querySelector('.hamburger');
  const list = document.getElementById('primary-nav');
  if (btn && list) {
    btn.addEventListener('click', () => {
      const open = list.classList.toggle('show');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }


</script>

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});



// mobile nav toggle
(function () {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;

  function toggle(open) {
    const isOpen = open ?? !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  }

  btn.addEventListener('click', () => toggle());

  // close when a link is tapped
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) toggle(false);
  });

  // close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();
