document.addEventListener('DOMContentLoaded', () => {

  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));

  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

 
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const words = ['Student','Developer', 'C++ Enthusiast', 'Designer', 'Web Content Writer'];
    let wordIndex = 0, charIndex = 0, deleting = false;
    function typeLoop() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        charIndex--;
        typewriterEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
      }
      setTimeout(typeLoop, deleting ? 35 : 70);
    }
    typeLoop();
  }


  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  }

  /* ---------- SCROLL-SPY NAV HIGHLIGHTING ----------
     Uses a thin horizontal detection band at the vertical center of the
     viewport (rootMargin "-45% top/bottom") instead of a fixed visibility
     threshold. A percentage-based threshold breaks on tall sections like
     Projects or Journey, since their total height makes it impossible for
     40% of them to ever be visible at once — the center-band approach works
     regardless of how tall a section is. */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((sec) => spyObserver.observe(sec));


  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalBadge = document.getElementById('modalBadge');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalClose = document.querySelector('.video-modal-close');
  const thumbWraps = document.querySelectorAll('.project-thumb-wrap');

  function openVideoModal(wrap) {
    const src = wrap.dataset.video;
    if (!videoModal || !modalVideo) return;
    modalVideo.src = src || '';
    if (modalBadge) modalBadge.textContent = wrap.dataset.badge || '';
    if (modalChallenge) modalChallenge.textContent = wrap.dataset.challenge || '';
    videoModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    modalVideo.play().catch(() => {});
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideo) return;
    videoModal.classList.remove('is-open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow = '';
  }

  thumbWraps.forEach((wrap) => {
    wrap.addEventListener('click', () => openVideoModal(wrap));
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideoModal(wrap);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });

});



  const journalSection = document.getElementById('journal');
  if (journalSection) {
    const journalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;


        document.querySelectorAll('.journal-page').forEach((page) => {
          page.classList.add('is-visible');
          const bar = page.querySelector('.progress-fill');
          if (bar) bar.style.width = bar.dataset.fill + '%';
        });

        
        const ringFill = document.querySelector('.ring-fill');
        const percentLabel = document.querySelector('.progress-percent');
        if (ringFill) {
          const percent = parseInt(ringFill.dataset.percent, 10) || 0;
          const circumference = 2 * Math.PI * 60; // r=60
          const offset = circumference - (percent / 100) * circumference;
          ringFill.style.strokeDashoffset = offset;

          if (percentLabel) {
            let current = 0;
            const step = Math.max(1, Math.round(percent / 40));
            const countUp = setInterval(() => {
              current += step;
              if (current >= percent) { current = percent; clearInterval(countUp); }
              percentLabel.textContent = current + '%';
            }, 30);
          }
        }


        const trackFill = document.querySelector('.jt-track-fill');
        if (trackFill) trackFill.style.width = '100%';
        document.querySelectorAll('.jt-step').forEach((step, i) => {
          setTimeout(() => step.classList.add('active'), i * 220);
        });

        journalObserver.disconnect();
      });
    }, { threshold: 0.2 });

    journalObserver.observe(journalSection);
  }

  const journalQuotes = [
    "One page every day becomes a book.",
    "Small steps, every day, still move you forward.",
    "Progress, not perfection.",
    "Every bug fixed is a lesson learned.",
    "Consistency beats intensity.",
    "Still learning. Still building. Excited for what's next."
  ];
  const quoteTextEl = document.querySelector('.daily-quote .quote-text');
  const refreshBtn = document.querySelector('.refresh-quote-btn');
  if (refreshBtn && quoteTextEl) {
    refreshBtn.addEventListener('click', () => {
      const next = journalQuotes[Math.floor(Math.random() * journalQuotes.length)];
      quoteTextEl.textContent = `"${next}"`;
      const sparkle = refreshBtn.querySelector('.sparkle-icon');
      if (sparkle) {
        sparkle.classList.remove('spin');
        void sparkle.offsetWidth; 
        sparkle.classList.add('spin');
      }
    });
  }