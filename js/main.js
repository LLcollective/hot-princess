// ===== BURGER + SIDEBAR =====
const burger  = document.querySelector('.burger');
const sidebar = document.querySelector('.sidebar');
const scrim   = document.querySelector('.scrim');
const sidebarLinks = document.querySelectorAll('nav.sidebar a, nav.sidebar .dropdown > button');

function closeSidebar() {
  burger?.classList.remove('open');
  sidebar?.classList.remove('show');
  scrim?.classList.remove('active');
  if (scrim) scrim.hidden = true;   // keep scrim non-clickable when closed
}

if (burger && sidebar && scrim) {
  burger.addEventListener('click', () => {
    const open = !sidebar.classList.contains('show');
    sidebar.classList.toggle('show', open);
    burger.classList.toggle('open', open);
    scrim.classList.toggle('active', open);
    scrim.hidden = !open;

    // Animate links when opening
    if (open) {
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

  // Close via scrim
  scrim.addEventListener('click', closeSidebar);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('show') &&
        !e.target.closest('.sidebar') &&
        !e.target.closest('.burger')) {
      closeSidebar();
    }
  });

  // Close on ESC + reset on page restore
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
  window.addEventListener('pageshow', closeSidebar);
}

// ===== DROPDOWN TOGGLE =====
function closeAllDropdowns() {
  document.querySelectorAll('.sidebar .dropdown > button')
    .forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('.sidebar .dropdown-menu a')
    .forEach(a => a.classList.remove('show'));
}

document.querySelectorAll('.sidebar .dropdown > button').forEach(button => {
  button.addEventListener('click', e => {
    e.stopPropagation();
    const expanded = button.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns();
    button.setAttribute('aria-expanded', String(!expanded));

    const menu = button.nextElementSibling;
    if (!expanded && menu) {
      const links = menu.querySelectorAll('a');
      links.forEach((link, i) => {
        link.classList.remove('show'); // reset
        setTimeout(() => link.classList.add('show'), i * 70); // stagger open
      });
    } else if (menu) {
      menu.querySelectorAll('a').forEach(link => link.classList.remove('show'));
    }
  });
});

// Close dropdowns on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.sidebar .dropdown-menu') &&
      !e.target.closest('.sidebar .dropdown > button')) {
    closeAllDropdowns();
  }
});

// Escape closes dropdowns too
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeSidebar();
  }
});

// ===== CLOSE SIDEBAR & DROPDOWNS ON LINK CLICK =====
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    closeAllDropdowns();
    closeSidebar();
  });
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
