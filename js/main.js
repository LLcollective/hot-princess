


// ===== BURGER + SIDEBAR =====
const burger  = document.querySelector('.burger');
const sidebar = document.querySelector('nav.sidebar');
const scrim   = document.querySelector('.scrim');

function closeSidebar() {
  burger?.classList.remove('open');
  sidebar?.classList.remove('show');
  scrim?.classList.remove('active');
  if (scrim) scrim.hidden = true;
}

function openSidebar() {
  burger?.classList.add('open');
  sidebar?.classList.add('show');
  scrim?.classList.add('active');
  if (scrim) scrim.hidden = false;
}

if (burger && sidebar && scrim) {
  burger.addEventListener('click', () => {
    const open = !sidebar.classList.contains('show');
    if (open) openSidebar(); else closeSidebar();
  });

  scrim.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
  window.addEventListener('pageshow', closeSidebar);
}

// ===== DROPDOWN TOGGLE =====
// ===== DROPDOWN TOGGLE =====
const dropdownButtons = document.querySelectorAll('.dropdown > button');

function closeAllDropdowns() {
  dropdownButtons.forEach(btn => {
    btn.setAttribute("aria-expanded", "false");
    const dropdownContent = btn.nextElementSibling;
    if (dropdownContent) {
      dropdownContent.style.maxHeight = null;
    }
  });
}

dropdownButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dropdownContent = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";

    // Close everything first
    closeAllDropdowns();

    if (!expanded) {
      // Open the one just clicked
      button.setAttribute("aria-expanded", "true");
      if (dropdownContent) {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
      }
    }
  });
});

// ===== CLOSE SIDEBAR + DROPDOWNS ON LINK CLICK =====
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    closeAllDropdowns();
    closeSidebar();
  });
});

document.querySelectorAll('.sidebar .dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    closeAllDropdowns();
    closeSidebar();
  });
});





/*PROGRESS BAR*/

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-fill").style.width = scrolled + "%";
});




/* ======================
   MODAL HANDLING (Index + Limeboard)
   ====================== */
document.addEventListener("DOMContentLoaded", () => {
  function openModalById(id) {
    const modal = document.querySelector(id);
    if (modal) modal.classList.add("show");
  }

  // Trigger via data-modal-target
  document.querySelectorAll("[data-modal-target]").forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      openModalById(trigger.getAttribute("data-modal-target"));
    });
  });

  // Trigger via href="#id" (old pattern)
  document.querySelectorAll('a[href^="#"]').forEach(trigger => {
    const targetId = trigger.getAttribute("href");
    if (targetId && targetId.startsWith("#") && targetId.length > 1) {
      trigger.addEventListener("click", e => {
        const modal = document.querySelector(targetId);
        if (modal && modal.classList.contains("modal")) {
          e.preventDefault();
          openModalById(targetId);
        }
      });
    }
  });

  // Close modal when clicking close button
  document.querySelectorAll(".modal .close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").classList.remove("show");
    });
  });

  // Close modal when clicking outside modal-box
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.classList.remove("show");
    });
  });

  // Close modal on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
    }
  });
});






  // Modal controls founder/
  const openBtn = document.getElementById('systems-btn');
  const modal = document.getElementById('systems-modal');
  const closeBtn = modal?.querySelector('.modal-close');

  openBtn?.addEventListener('click', () => modal.style.display = 'flex');
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.style.display = 'none'; });



/*animate on scroll*/
document.addEventListener("DOMContentLoaded", () => {
  const observers = document.querySelectorAll(".animate-on-scroll");
  const options = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animate once
      }
    });
  }, options);

  observers.forEach(el => observer.observe(el));
});


// Founder bio toggle
  function toggleFounderBio() {
    const mobile = document.querySelector('.founder-mobile');
    const desktop = document.querySelector('.founder-desktop');
    if (!mobile || !desktop) return;

    if (window.innerWidth <= 768) {
      mobile.style.display = 'block';
      desktop.style.display = 'none';
    } else {
      mobile.style.display = 'none';
      desktop.style.display = 'block';
    }
  }
  // run on load + resize
  toggleFounderBio();
  window.addEventListener('resize', toggleFounderBio);

 










/* =======================================
  TIGHTER HOME PAGE SPIRAL NAVIGATION
   ======================================= */
function drawSpiral() {
  const base = document.getElementById("spiral");
  const overlay = document.getElementById("spiral-overlay");
  const svg = document.getElementById("spiral-svg");
  const container = document.querySelector(".spiral-container");

  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;

  /* ===== Detect device type ===== */
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  /* ===== Spiral parameters ===== */
  // Baseline (mobile) — tighter than before
  let a = 6;   // smaller center offset
  let b = 14;  // smaller step between loops
  let turns = 8;

  // Desktop — slightly wider but still tighter overall
  if (isDesktop) {
    a = 8;     // modestly larger center
    b = 18;    // still controlled growth
    turns = 9;
  }

  /* ===== Generate spiral points ===== */
  const points = [];
  for (let t = 0; t < Math.PI * 2 * turns; t += 0.1) {
    const r = a + b * t;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    points.push([x, y]);
  }

  const d = "M" + points.map(p => p.join(",")).join(" L");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  base.setAttribute("d", d);
  overlay.setAttribute("d", d);

  const length = base.getTotalLength();
  [base, overlay].forEach(path => {
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  /* ===== Animation helper ===== */
  function animatePath(path, length, duration, forward = true, callback) {
    if (path.animate) {
      const anim = path.animate(
        forward
          ? [{ strokeDashoffset: length }, { strokeDashoffset: 0 }]
          : [{ strokeDashoffset: 0 }, { strokeDashoffset: length }],
        { duration, easing: "ease-in-out", fill: "forwards" }
      );
      if (callback) anim.onfinish = callback;
      return;
    }

    const start = performance.now();
    function frame(time) {
      const progress = Math.min((time - start) / duration, 1);
      const offset = forward ? length * (1 - progress) : length * progress;
      path.setAttribute("stroke-dashoffset", offset);
      if (progress < 1) requestAnimationFrame(frame);
      else if (callback) callback();
    }
    requestAnimationFrame(frame);
  }

  animatePath(base, length, 6000, true, () => {
    function animateOverlayLoop(forward = true) {
      animatePath(overlay, length, 6000, forward, () => {
        setTimeout(() => animateOverlayLoop(!forward), 400);
      });
    }
    animateOverlayLoop(true);
  });

  /* ===== Clear old links ===== */
  document.querySelectorAll(".spiral-link").forEach(el => el.remove());

  /* ===== Spiral nav link positions ===== */
  const linkLabels = isDesktop
    ? [
  { text: "Founder", href: "founder.html", factor: 0.16 },
  { text: "Contact", href: "contact.html", factor: 0.32 },
  { text: "Let's Spiral", href: "Spiral.html", factor: 0.08 },
  { text: "Approach", href: "approach.html", factor: 0.29 },
  { text: "Business Path", href: "b-energy-aligned.html", factor: 0.22 },
  { text: "Individual Path", href: "i-energy-aligned.html", factor: 0.25 },

      ]
    : [
  { text: "Founder", href: "founder.html", factor: 0.23 },
  { text: "Contact", href: "contact.html", factor: 0.40 },
  { text: "Let's Spiral", href: "Spiral.html", factor: 0.08 },
  { text: "Approach", href: "approach.html", factor: 0.335 },
 { text: "Individual Path", href: "i-energy-aligned.html", factor: 0.17 },
 { text: "Business Path", href: "b-energy-aligned.html", factor: 0.28 },

      ];

  /* ===== Create clickable link elements ===== */
  linkLabels.forEach((link, i) => {
    const idx = Math.floor(points.length * link.factor);
    const [x, y] = points[idx];
    const el = document.createElement("div");
    el.className = "spiral-link";
    el.textContent = link.text;
    el.style.left = (x / width) * 100 + "%";
    el.style.top = (y / height) * 100 + "%";
    el.style.animationDelay = `${1 + i * 0.4}s`;
    el.onclick = () => (location.href = link.href);
    container.appendChild(el);
  });

  console.log(isDesktop ? "Desktop Spiral Active" : "Mobile Spiral Active");
}

/* ===== Initial draw & redraw ===== */
drawSpiral();
window.addEventListener("resize", drawSpiral);
window.addEventListener("orientationchange", drawSpiral);
