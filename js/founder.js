document.addEventListener("DOMContentLoaded", () => {
  /* ===== Progress Bar ===== */
  const fill = document.getElementById("progress-fill");
  const header = document.querySelector(".ll-nav");

  function place() {
    const h = header?.getBoundingClientRect().height || 56;
    document.documentElement.style.setProperty("--progress-top", h + "px");
  }
  function pct() {
    const doc = document.documentElement;
    const sc = Math.max(doc.scrollTop, document.body.scrollTop);
    const max = (doc.scrollHeight || document.body.scrollHeight) - innerHeight;
    const r = max > 0 ? Math.min(1, Math.max(0, sc / max)) : 0;
    if (fill) fill.style.width = (r * 100).toFixed(2) + "%";
  }
  place();
  pct();
  addEventListener("resize", place, { passive: true });
  addEventListener("scroll", pct, { passive: true });

  /* ===== Systems Modal ===== */
  const systemsModal = document.getElementById("systems-modal");
  const openSystems = document.getElementById("systems-btn");
  const closeSystems = systemsModal?.querySelector(".modal-close");

  if (systemsModal && openSystems && closeSystems) {
    openSystems.addEventListener("click", () => {
      systemsModal.style.display = "flex";
    });
    closeSystems.addEventListener("click", () => {
      systemsModal.style.display = "none";
    });
    systemsModal.addEventListener("click", (e) => {
      if (e.target === systemsModal) systemsModal.style.display = "none";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && systemsModal.style.display === "flex") {
        systemsModal.style.display = "none";
      }
    });
  }
});
