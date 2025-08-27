/* ==============================
   Progress Bar
   ============================== */
(function () {
  const bar = document.querySelector('.progress span');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const percent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = percent + '%';
  }, { passive: true });
})();

/* ==============================
   Headline Glitter (fixed)
   ============================== */
(function () {
  const tl = document.querySelector('.tagline');
  if (!tl) return;

  function play() {
    tl.classList.remove('glitter'); // reset
    void tl.offsetWidth;            // force reflow so animation restarts
    tl.classList.add('glitter');
  }

  // shimmer once when page loads
  window.addEventListener('load', play);

  // shimmer again on click/tap
  tl.addEventListener('click', play);
  tl.addEventListener('touchstart', play, { passive: true });
})();

/* ==============================
   Theme Switcher
   ============================== */
(function () {
  const saved = localStorage.getItem('theme');
  const initial = saved || document.body.dataset.theme || 'fresh-lime';
  document.body.dataset.theme = initial;
  setActive(initial);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-set-theme]');
    if (!btn) return;
    const theme = btn.dataset.setTheme;
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    setActive(theme);
  });

  function setActive(theme) {
    document.querySelectorAll('.theme-switch [data-set-theme]')
      .forEach(b => b.classList.toggle('active', b.dataset.setTheme === theme));
  }
})();

/* ==============================
   Infinite Carousel
============================== */
document.querySelectorAll('.carousel-section').forEach(section => {
  const track = section.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prev = section.querySelector('.prev-btn');
  const next = section.querySelector('.next-btn');
  let index = 0;

  // Clone first/last for infinite effect
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  const allSlides = Array.from(track.children);
  index = 1; // start at real first slide
  track.style.transform = `translateX(-${index * 100}%)`;

  function moveToSlide() {
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => {
    if (index >= allSlides.length - 1) return;
    index++;
    moveToSlide();
  });

  prev.addEventListener('click', () => {
    if (index <= 0) return;
    index--;
    moveToSlide();
  });

  track.addEventListener('transitionend', () => {
    if (allSlides[index] === firstClone) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    if (allSlides[index] === lastClone) {
      track.style.transition = "none";
      index = allSlides.length - 2;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
  });
});


 // Contact form -> POST /api/send
    (function () {
      const form=document.getElementById('contactForm');
      const status=document.getElementById('formStatus');
      const btn=document.getElementById('submitBtn');
      const ENDPOINT='/api/send';
      if(!form) return;

      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        status.textContent='';
        if(!form.reportValidity()) return;

        const payload={
          firstName:form.firstName.value.trim(),
          lastName:form.lastName.value.trim(),
          email:form.email.value.trim(),
          subject:form.subject.value.trim(),
          message:form.message.value.trim(),
          page:location.pathname
        };

        btn.disabled=true; btn.textContent='Sending…';
        try{
          const res=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
          if(!res.ok) throw new Error('Send failed');
          form.reset(); status.className='status ok'; status.textContent='✅ Message sent successfully!';
        }catch(err){
          console.error(err); status.className='status err';
          status.textContent='❌ Could not send. Please email laceandlime.llc@gmail.com for additional support.';
        }finally{ btn.disabled=false; btn.textContent='Send'; }
      });
    })();