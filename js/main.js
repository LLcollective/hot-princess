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
