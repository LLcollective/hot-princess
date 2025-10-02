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

 



/* ===== Draw Spiral (Cross-Browser Safe) ===== */
function drawSpiral() {
  const base = document.getElementById("spiral");
  const overlay = document.getElementById("spiral-overlay");
  const svg = document.getElementById("spiral-svg");
  const container = document.querySelector(".spiral-container");

  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2, cy = height / 2;

  // Spiral params
  const a = 10, b = 20;
  const turns = 8;

  // Update viewBox to full viewport
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Generate spiral points
  const points = [];
  for (let t = 0; t < Math.PI * 2 * turns; t += 0.1) {
    const r = a + b * t;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    points.push([x, y]);
  }

  const d = "M" + points.map(p => p.join(",")).join(" L");
  base.setAttribute("d", d);
  overlay.setAttribute("d", d);

  const length = base.getTotalLength();
  [base, overlay].forEach(path => {
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  /* ===== Cross-browser animation helper ===== */
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

    // ---- Fallback for browsers without Web Animations API ----
    const start = performance.now();
    function frame(time) {
      const progress = Math.min((time - start) / duration, 1);
      const offset = forward
        ? length * (1 - progress)
        : length * progress;
      path.setAttribute("stroke-dashoffset", offset);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(frame);
  }

  // Black spiral draws first
  animatePath(base, length, 6000, true, () => {
    function animateOverlayLoop(forward = true) {
      animatePath(overlay, length, 6000, forward, () => {
        setTimeout(() => animateOverlayLoop(!forward), 400);
      });
    }
    animateOverlayLoop(true);
  });

  // Clear old links
  document.querySelectorAll(".spiral-link").forEach(el => el.remove());

  // Spiral nav links with manual multipliers
  const linkLabels = [
    { text: "Laced Together", href: "founder.html", factor: 0.05 },
    { text: "", href: "lacednotes.html", factor: 0.10 },
    { text: "Experiences", href: "booknow.html", factor: 0.16 },
    { text: "Limeboard", href: "limeboard.html", factor: 0.23 },
    { text: "Approach", href: "approach.html", factor: 0.21 },
    { text: "Contact", href: "contact.html", factor: 0.29 }
  ];

  // Each factor = % along spiral path (0 = center, 1 = edge)
  linkLabels.forEach((link, i) => {
    const idx = Math.floor(points.length * link.factor);
    const [x, y] = points[idx];
    const el = document.createElement("div");
    el.className = "spiral-link";
    el.textContent = link.text;
    el.style.left = (x / width * 100) + "%";
    el.style.top = (y / height * 100) + "%";
    el.style.animationDelay = `${1 + i * 0.4}s`;
    el.onclick = () => location.href = link.href;
    container.appendChild(el);
  });
}

// Initial draw
drawSpiral();
// Redraw on resize/rotation
window.addEventListener("resize", drawSpiral);








/* FOUNDER PAGE*/
document.documentElement.classList.add("no-js"); // fallback until JS runs

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.remove("no-js");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // Animate chips in sequence
        if (entry.target.classList.contains("chips")) {
          const chips = entry.target.querySelectorAll("span.animate");
          chips.forEach((chip, i) => {
            setTimeout(() => chip.classList.add("reveal"), i * 150);
          });
          obs.unobserve(entry.target);
        }

        // Animate proof timeline milestones (left → right)
        else if (entry.target.classList.contains("proof-timeline")) {
          entry.target.classList.add("reveal"); // trigger line
          const milestones = entry.target.querySelectorAll(".milestone");
          milestones.forEach((ms, i) => {
            setTimeout(() => ms.classList.add("reveal"), i * 400);
          });
          obs.unobserve(entry.target);
        }

        // Animate journey steps in sequence
        else if (entry.target.classList.contains("journey-container")) {
          const steps = entry.target.querySelectorAll(".journey-step.animate");
          steps.forEach((step, i) => {
            setTimeout(() => step.classList.add("reveal"), i * 250);
          });
          const circle = entry.target.querySelector(".completion-circle.animate");
          if (circle) {
            setTimeout(() => circle.classList.add("reveal"), steps.length * 250);
          }
          obs.unobserve(entry.target);
        }

        // Normal reveal
        else {
          entry.target.classList.add("reveal");
          obs.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.2 });

  // Observe containers only (not each milestone)
  document.querySelectorAll(
    ".chips, .journey-container, .proof-timeline"
  ).forEach(el => observer.observe(el));
});