/* =======================================
   TIGHTER HOME PAGE SPIRAL NAVIGATION
   ======================================= */
function drawSpiral() {
  const base = document.getElementById("spiral");
  const overlay = document.getElementById("spiral-overlay");
  const svg = document.getElementById("spiral-svg");
  const container = document.querySelector(".spiral-container");

  if (!base || !overlay || !svg || !container) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  // Spiral parameters (tightened)
  let a = isDesktop ? 8 : 6;
  let b = isDesktop ? 18 : 14;
  let turns = isDesktop ? 9 : 8;

  // Generate spiral points
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

  // Animation helper
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

  // Base + overlay animation sequence
  animatePath(base, length, 6000, true, () => {
    function animateOverlayLoop(forward = true) {
      animatePath(overlay, length, 6000, forward, () => {
        setTimeout(() => animateOverlayLoop(!forward), 400);
      });
    }
    animateOverlayLoop(true);
  });

  // Remove old links
  document.querySelectorAll(".spiral-link").forEach(el => el.remove());

  // Spiral nav link positions
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

  // Create clickable link elements
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

/* ===== Initial draw & redraw (debounced) ===== */
drawSpiral();
["resize", "orientationchange"].forEach(evt => {
  window.addEventListener(evt, () => {
    clearTimeout(window._spiralResize);
    window._spiralResize = setTimeout(drawSpiral, 200);
  });
});

/* =======================================
   SCROLL PROGRESS BAR
   ======================================= */
window.addEventListener("scroll", () => {
  window.requestAnimationFrame(() => {
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById("progress-fill").style.width = (st / sh) * 100 + "%";
  });
});

/* =======================================
   ANIMATE ON SCROLL
   ======================================= */
document.addEventListener("DOMContentLoaded", () => {
  const observers = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observers.forEach(el => observer.observe(el));
});

/* =======================================
   BREATHING COIL SPIRAL
   ======================================= */
(function(){
  const svg = document.getElementById('sn-spiral');
  const path = document.getElementById('sn-path');
  const cue = document.getElementById('breathCue');
  if (!svg || !path || !cue) return;

  const centerX = 300, centerY = 300;
  const turns = 6;
  const points = 800;
  const baseRadius = 30;
  const maxRadius = 240;

  const duration = 16000;
  let startTime = null;
  let inhale = true;

  function setCue(isInhale){
    cue.textContent = isInhale ? "Breathe in ·" : "Breathe out ·";
    cue.style.color = isInhale ? "#e9edf7" : "#aeb6c9";
  }

  setCue(true);

  function drawSpiral(radiusScale){
    let d = "";
    for (let i = 0; i <= points; i++){
      const angle = (i / points) * Math.PI * 2 * turns;
      const radius = baseRadius + (maxRadius - baseRadius) * (i / points) * radiusScale;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      d += (i === 0 ? "M" : "L") + x + "," + y + " ";
    }
    path.setAttribute("d", d);
  }

  function animate(t){
    if (!startTime) startTime = t;
    const elapsed = (t - startTime) % duration;
    const half = duration / 2;
    const progress = (elapsed < half ? elapsed / half : (elapsed - half) / half);
    const easing = 0.5 - 0.5 * Math.cos(progress * Math.PI);

    if (elapsed < half){
      if (!inhale){ inhale = true; setCue(true); }
      drawSpiral(easing);
    } else {
      if (inhale){ inhale = false; setCue(false); }
      drawSpiral(1 - easing);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

/* =======================================
   WAITLIST RESPONSE SPEEDUP
   ======================================= */
(function() {
  const form = document.getElementById("waitlist-form");
  const success = document.getElementById("waitlist-success");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Adding...";
    success.textContent = "Submitting...";
    success.classList.add("visible");

    setTimeout(() => {
      success.textContent = "✓ You're on the list!";
      success.style.color = "#d87a94";
    }, 700);

    fetch(form.action, { method: "POST", body: data })
      .then((resp) => {
        if (!resp.ok) throw new Error("Bad response");
        form.reset();
        setTimeout(() => {
          button.disabled = false;
          button.textContent = "Join Waitlist →";
        }, 1500);
      })
      .catch(() => {
        success.textContent = "Network issue — try again soon.";
        success.style.color = "#b34a4a";
        button.disabled = false;
        button.textContent = "Join Waitlist →";
      });
  });
})();
