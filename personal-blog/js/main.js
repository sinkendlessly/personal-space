  // ===== Lenis Smooth Scroll =====
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    wheelMultiplier: 0,
    touchMultiplier: 0,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // ===== Section Snap (FullPage scroll) =====
  const SNAP_IDS = ['hero', 'about', 'programming', 'basketball', 'life', 'footer'];
  let snapIndex = 0;
  let isSnapping = false;

  function snapToSection(index) {
    const el = document.getElementById(SNAP_IDS[index]);
    if (!el) return;
    isSnapping = true;
    snapIndex = index;
    lenis.scrollTo(el, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setTimeout(() => { isSnapping = false; }, 1400);
  }

  // Wheel → snap
  document.addEventListener('wheel', (e) => {
    if (e.target.closest('[data-lenis-prevent]')) return;
    e.preventDefault();
    if (isSnapping) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    const next = Math.max(0, Math.min(SNAP_IDS.length - 1, snapIndex + dir));
    if (next === snapIndex) return;
    snapToSection(next);
  }, { capture: true, passive: false });

  // Touch → snap
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isSnapping) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 30) return;
    const dir = diff > 0 ? 1 : -1;
    const next = Math.max(0, Math.min(SNAP_IDS.length - 1, snapIndex + dir));
    if (next === snapIndex) return;
    snapToSection(next);
  }, { passive: true });

  // ===== Loading Screen =====
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 800);

  // ===== Language System (init before DOM manipulation) =====
  (function initLang() {
    const STORAGE_KEY = 'blog-lang';
    document.querySelectorAll('.section-subtitle, .section-tagline, .about-text, .hero-subtitle, .avatar-label, .scroll-text, .bball-quote, .footer-tagline, .footer-copy, .stat-label, .skill-name, .skill-desc, .team-info h4, .team-info p, .life-title, .life-desc, .footer-col-title').forEach(el => {
      el.dataset.i18nOrig = el.innerHTML;
    });
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh') {
      document.documentElement.lang = 'zh-CN';
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.classList.add('lang-en');
    }
  })();

  // ===== Text Reveal Animation =====
  // 将 subtitle 文本拆分为单个词
  document.querySelectorAll('.section-subtitle').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((word, i) => `<span class="reveal-word" style="--word-index:${i}">${word}</span>`)
      .join(' ');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 标题已有 .char 子元素，逐个触发
        const chars = entry.target.querySelectorAll('.char');
        chars.forEach((char, i) => {
          setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0)';
          }, i * 60);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.section-title, .section-subtitle').forEach(el => revealObserver.observe(el));

  // ===== Section Tagline 渐进式从左到右出现 =====
  document.querySelectorAll('.section-tagline').forEach(el => {
    const section = el.closest('.section');
    if (section) {
      // Resolve animation on scroll into view
      const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
            tagObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      tagObserver.observe(section);
    }
  });

  // ===== Section Background Transition =====
  const sections = document.querySelectorAll('.section[data-bg]');
  let currentBg = '#ffffff';

  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newBg = entry.target.dataset.bg;
        const newColor = entry.target.dataset.color || '#ffffff';
        if (newBg && newBg !== currentBg) {
          document.body.style.backgroundColor = newBg;
          document.body.style.color = newColor;
          // Update nav color with smooth transition
          document.querySelectorAll('.nav-link, .logo').forEach(el => {
            if (newColor === '#000000') {
              el.style.color = '#000000';
              el.style.mixBlendMode = 'normal';
            } else {
              el.style.color = '#ffffff';
              el.style.mixBlendMode = 'exclusion';
            }
          });
          currentBg = newBg;
        }
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => bgObserver.observe(s));

  // ===== Background Slide Up Animation =====
  const bgSlideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('bg-visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.hero-section, .about-section, .programming-section, .basketball-section').forEach(s => {
    bgSlideObserver.observe(s);
  });

  // ===== Smooth Full-Width Carousel (edge-peek, infinite) =====
  const carouselTrack = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  let cards = document.querySelectorAll('.skill-card');
  let totalSlides = cards.length;
  let currentSlide = 0;
  let carouselReady = false;
  let isJumping = false; // prevents transitionend re-entry during clone jump

  const CAROUSEL_GAP = 60;

  /** Clone first & last card for seamless infinite wrapping */
  function setupInfiniteLoop() {
    const first = cards[0];
    const last = cards[totalSlides - 1];
    const firstClone = first.cloneNode(true);
    const lastClone = last.cloneNode(true);
    carouselTrack.appendChild(firstClone);   // append clone of first at end
    carouselTrack.insertBefore(lastClone, first); // prepend clone of last at start
    // Re-query to include clones
    cards = document.querySelectorAll('.skill-card');
    totalSlides = cards.length;
    currentSlide = 1; // first REAL slide (index 0 is the prepended clone)
  }

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width;
  }

  function getOffsetFor(index) {
    const cardW = getCardWidth();
    const EDGE_PEEK = 30; // px — adjacent card visible at viewport edge
    return -(index * (cardW + CAROUSEL_GAP)) + EDGE_PEEK;
  }

  function updateCarousel(animate) {
    if (!carouselReady) return;
    const offset = getOffsetFor(currentSlide);

    carouselTrack.style.transition = animate !== false
      ? 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none';
    carouselTrack.style.transform = `translateX(${offset}px)`;

    cards.forEach((c, i) => {
      const dist = Math.abs(i - currentSlide);
      c.classList.toggle('active', i === currentSlide);
      c.dataset.dist = dist;
      c.style.zIndex = totalSlides - dist;
    });
  }

  function goToSlide(index, instant) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    if (index === currentSlide) return;
    currentSlide = index;
    updateCarousel(!instant);
  }

  // Seamless wrap: after animated transition end, if at a clone → instant-jump to real card
  carouselTrack.addEventListener('transitionend', () => {
    if (isJumping) return;
    if (currentSlide === 0) {
      // At prepended clone of last card → jump to real last card
      isJumping = true;
      currentSlide = totalSlides - 2;
      updateCarousel(false);
      isJumping = false;
    } else if (currentSlide === totalSlides - 1) {
      // At appended clone of first card → jump to real first card
      isJumping = true;
      currentSlide = 1;
      updateCarousel(false);
      isJumping = false;
    }
  });

  // ===== Momentum / Inertia Drag =====
  let dragData = null;

  function dragStart(clientX) {
    dragData = {
      startX: clientX,
      startOffset: getOffsetFor(currentSlide),
      lastX: clientX,
      lastTime: Date.now(),
      velocity: 0,
      moved: false
    };
    carouselTrack.style.transition = 'none';
    carouselTrack.style.cursor = 'grabbing';
  }

  function dragMove(clientX) {
    if (!dragData) return;
    const now = Date.now();
    const dx = clientX - dragData.lastX;
    const dt = now - dragData.lastTime;
    if (dt > 0) dragData.velocity = dx / dt;
    dragData.lastX = clientX;
    dragData.lastTime = now;
    const totalDx = clientX - dragData.startX;
    if (Math.abs(totalDx) > 5) dragData.moved = true;
    carouselTrack.style.transform = `translateX(${dragData.startOffset + totalDx}px)`;
  }

  function dragEnd() {
    if (!dragData) return;
    carouselTrack.style.cursor = '';

    if (dragData.moved) {
      const slideWidth = getCardWidth() + CAROUSEL_GAP;
      const vel = dragData.velocity || 0;
      let target = currentSlide;

      if (Math.abs(vel) > 0.3) {
        target += vel < 0 ? 1 : -1;
      } else {
        const currentOffset = parseFloat(carouselTrack.style.transform.replace('translateX(', ''));
        const dx = currentOffset - getOffsetFor(currentSlide);
        if (Math.abs(dx) > slideWidth * 0.2) {
          target += dx < 0 ? 1 : -1;
        }
      }

      if (target < 0) target = totalSlides - 1;
      if (target >= totalSlides) target = 0;
      if (target !== currentSlide) currentSlide = target;
      updateCarousel(true);
    } else {
      updateCarousel(true);
    }
    dragData = null;
  }

  // Mouse events
  viewport.addEventListener('mousedown', (e) => dragStart(e.clientX));
  document.addEventListener('mousemove', (e) => { if (dragData) dragMove(e.clientX); });
  document.addEventListener('mouseup', () => { if (dragData) dragEnd(); });
  document.addEventListener('mouseleave', () => { if (dragData) dragEnd(); });

  // Touch events
  viewport.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchmove', (e) => { if (dragData) dragMove(e.touches[0].clientX); }, { passive: true });
  viewport.addEventListener('touchend', () => { if (dragData) dragEnd(); }, { passive: true });

  // ===== Mouse Wheel Horizontal Scroll =====
  viewport.addEventListener('wheel', (e) => {
    const prog = document.getElementById('programming');
    if (!prog) return;
    const rect = prog.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (!viewport._wheelAccum) viewport._wheelAccum = 0;
    viewport._wheelAccum += e.deltaY;

    if (Math.abs(viewport._wheelAccum) >= 80) {
      goToSlide(viewport._wheelAccum < 0 ? currentSlide - 1 : currentSlide + 1);
      viewport._wheelAccum = 0;
    }
    e.preventDefault();
  }, { passive: false });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const prog = document.getElementById('programming');
    if (!prog) return;
    const rect = prog.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
  });

  // Init — wait until programming section is visible
  const progSection = document.getElementById('programming');
  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !carouselReady) {
        carouselReady = true;
        setupInfiniteLoop();
        updateCarousel(false); // instant initial position, no animation
        progObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01 });
  if (progSection) progObserver.observe(progSection);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (carouselReady) updateCarousel(); }, 100);
  });

  // ===== Smooth Scroll Nav =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      if (id !== '#') {
        const target = document.querySelector(id);
        if (target) {
          lenis.scrollTo(target, { duration: 1.5 });
          const idx = SNAP_IDS.indexOf(target.id);
          if (idx !== -1) {
            snapIndex = idx;
          }
        }
      }
    });
  });

  // ===== Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Back to Top =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.2 });
      snapIndex = 0;
    });
  }

  // ===== 3D Tilt for Skill Cards (compatible with carousel) =====
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      // Read base scale from data-dist (set by carousel)
      const dist = parseInt(card.dataset.dist || '99');
      const baseScale = dist === 0 ? 1 : dist === 1 ? 0.88 : 0.78;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${baseScale})`;
      card.style.transition = 'transform 0.08s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      // Clear inline transform → falls back to CSS [data-dist] rule
      card.style.transform = '';
      card.style.transition = '';
    });
  });

  // ===== 3D Tilt Effect for Images =====
  document.querySelectorAll('.about-image-wrap, .project-img, .bball-img').forEach(wrapper => {
    const img = wrapper.querySelector('img');
    if (!img) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;
      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      img.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ===== Life Card 3D Tilt (背景图直接倾斜) =====
  document.querySelectorAll('.life-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ===== 360° 3D Tilt Effect for Titles =====
  document.querySelectorAll('[data-tilt="title"]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * -20;
      const rotateX = ((y - centerY) / centerY) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      el.style.transition = 'transform 0.2s ease-out';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  document.querySelectorAll('[data-tilt="subtitle"]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * -12;
      const rotateX = ((y - centerY) / centerY) * 6;
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      el.style.transition = 'transform 0.2s ease-out';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ===== Lightbox for Life Cards =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.life-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const bg = card.style.backgroundImage;
      if (bg && bg !== 'none') {
        const url = bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        if (url) {
          lightboxImg.src = url;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', closeLightbox);
  document.getElementById('lightboxClose').addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ===== Dot Navigation =====
  const dotLinks = document.querySelectorAll('.dot-link');
  const navSections = ['hero', 'about', 'programming', 'basketball', 'life', 'footer'];

  // ===== Section Label (bottom-left text reveal) =====
  function updateActiveDot() {
    let current = 'hero';
    navSections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          current = id;
        }
      }
    });
    dotLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === current);
    });
  }

  if (lenis && lenis.on) {
    lenis.on('scroll', updateActiveDot);
  }
  window.addEventListener('scroll', updateActiveDot);
  updateActiveDot();

  // ===== Cyber Avatar — 3D Mouse Tracking & Expression Toggle =====
  (function initAvatar() {
    const coin = document.getElementById('avatarCoin');
    if (!coin) return;

    const face = document.getElementById('avatarFace');
    const ring = coin.querySelector('.avatar-ring');
    const label = document.querySelector('.avatar-label');
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let rafId = null;
    let isHovering = false;

    // ---- Mouse tracking with position mapping ----
    function onMouseMove(e) {
      const rect = coin.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX == null) return;
      const maxDeg = 15;
      targetRotY = ((clientX - cx) / (rect.width / 2)) * maxDeg;
      targetRotX = -((clientY - cy) / (rect.height / 2)) * maxDeg;
      isHovering = true;
    }

    function onMouseLeave() {
      targetRotX = 0;
      targetRotY = 0;
      isHovering = false;
    }

    // ---- Smooth animation loop ----
    function animate() {
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;

      const rotX = currentRotX;
      const rotY = currentRotY;

      coin.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // Face gets subtle extra depth
      if (face) {
        face.style.transform =
          `translateZ(20px) rotateX(${rotX * 0.6}deg) rotateY(${rotY * 0.6}deg)`;
      }

      // Ring counter-rotates for parallax depth
      if (ring) {
        ring.style.transform =
          `translateZ(-10px) rotateX(${-rotX * 0.3}deg) rotateY(${-rotY * 0.3}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    }
    animate();

    // ---- Attach/detach listeners based on viewport ----
    function bindEvents() {
      coin.addEventListener('mousemove', onMouseMove);
      coin.addEventListener('mouseleave', onMouseLeave);
      coin.addEventListener('touchmove', onMouseMove, { passive: true });
      coin.addEventListener('touchend', onMouseLeave);
    }

    function unbindEvents() {
      coin.removeEventListener('mousemove', onMouseMove);
      coin.removeEventListener('mouseleave', onMouseLeave);
      coin.removeEventListener('touchmove', onMouseMove);
      coin.removeEventListener('touchend', onMouseLeave);
      onMouseLeave();
    }

    // ---- Expression cycling: normal → smile → surprised → normal ----
    const states = ['normal', 'smile', 'surprised', 'monster'];
    let stateIndex = 0;

    coin.addEventListener('click', () => {
      stateIndex = (stateIndex + 1) % states.length;
      coin.dataset.state = states[stateIndex];
    });

    // ---- Pause animation when scrolled out of view ----
    const avatarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bindEvents();
        } else {
          unbindEvents();
        }
      });
    }, { threshold: 0.1 });

    avatarObserver.observe(coin);

    // ---- Cleanup on page unload (optional but good practice) ----
    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
      avatarObserver.disconnect();
    });
  })();

  // ===== Music Player =====
  const playerAudio = document.getElementById('playerAudio');
  const playerToggle = document.getElementById('playerToggle');
  const playerEl = document.getElementById('musicPlayer');

  if (playerAudio && playerToggle && playerEl) {
    // Start in paused state
    playerEl.classList.add('paused');

    playerToggle.addEventListener('click', () => {
      if (playerAudio.paused) {
        playerAudio.play();
        playerEl.classList.remove('paused');
        playerEl.classList.add('playing');
        playerToggle.textContent = '⏸';
      } else {
        playerAudio.pause();
        playerEl.classList.remove('playing');
        playerEl.classList.add('paused');
        playerToggle.textContent = '▶';
      }
    });

    // Reset when audio ends
    playerAudio.addEventListener('ended', () => {
      playerEl.classList.remove('playing');
      playerEl.classList.add('paused');
      playerToggle.textContent = '▶';
    });
  }

  // ===== Language Switch =====
  const LANG_KEY = 'blog-lang';
  const langToggle = document.getElementById('langToggle');
  let isEnglish = document.documentElement.classList.contains('lang-en');

  const enTexts = {
    '.hero-subtitle': 'Code · Basketball · Life · Growth',
    '.avatar-label': 'Click me',
    '.programming-section .section-tagline': 'Keep evolving · Do the hard right thing',
    '.basketball-section .section-tagline': 'Ball Hard · Game of Life · Keep Evolving',
    '.life-section .section-tagline': 'Find beauty · Stay curious',
    '.bball-quote': '"Devin 10000 hours:<br>IN THE LAB<br>Focus on one specific field for 10000 hours<br>The path to mastery."',
    '.footer-tagline': 'A digital space about code, basketball, and life.<br>Document growth, share thoughts, explore infinite possibilities.',
    '.footer-copy': '© 2026 Sinkendlessly. All rights reserved.',
  };

  const enSubtitles = {
    '.programming-section .section-subtitle': 'Full-stack, AI is the trend, one step at a time.',
    '.basketball-section .section-subtitle': 'Basketball is more than a sport — it\'s an attitude toward life. On the court, I\'ve learned teamwork, perseverance, and never giving up.',
    '.life-section .section-subtitle': 'Life is more than just code and basketball. There are countless wonders to explore.',
  };

  const enHtmls = {
    '.about-text': '<p>Name: Yu Xinbai<br>Of course, my online alias is <span class="about-highlight">Sinkendlessly</span><br>I\'m a late <span class="about-highlight">tech</span> enthusiast.</p><p>I believe code can change the world<br>basketball builds character<br>and <span class="about-highlight">patience</span> is the key to life.<br><span class="about-highlight">Step by step. Patience is key in life.💗</span></p><p>My first demo blog<br>Always improving<br>Tech insights, basketball thoughts<br>and bits of daily life<br>Keep evolving and growing<br><span class="about-highlight">Please bear with me🙏</span></p>',
  };

  const enGroups = {
    '.stat-label': ['Years Coding', 'Age', 'Learning Passion', 'Stay Curious'],
    '.skill-name': ['Frontend', 'Backend', 'UI/UX Design', 'Mobile', 'AI', 'Cloud'],
    '.skill-desc': [
      'React, Vue, TypeScript<br>Modern Web Apps',
      'Node.js, Python<br>Database & API Design',
      'UI Design, Interaction<br>Visual Aesthetics',
      'React Native, Flutter<br>Cross-platform Dev',
      'Machine Learning, LLM<br>AI Systems',
      'AWS, Docker, CI/CD<br>Cloud Native',
    ],
    '.team-info h4': ['Point Guard', '3PT Shooter', 'Lockdown Defender', 'Jared McCain'],
    '.team-info p': ['Run the offense', 'Outside shooting', 'Lock in on D', 'Step by step. Patience is key in life.💗'],
    '.life-title': ['Music', 'Travel', 'Reading', 'Anime', 'Photography', 'Fitness'],
    '.life-desc': [
      'Hip-hop, R&B, Jazz — another expression beyond code',
      'Love hiking, exploring unknown scenery',
      'Learn, think, create, change',
      'A 2.5D world, my own hobbies too',
      'Capture moments, time can’t flow backward',
      'Stay active, fuel a better life',
    ],
  };

  const enColTitles = ['Navigation', 'Social', 'Contact'];

  function reSplitWords() {
    document.querySelectorAll('.section-subtitle').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((word, i) => '<span class="reveal-word" style="--word-index:' + i + '">' + word + '</span>')
        .join(' ');
    });
  }

  function applyLang(en) {
    isEnglish = en;
    document.documentElement.classList.toggle('lang-en', en);
    document.documentElement.lang = en ? 'en' : 'zh-CN';
    localStorage.setItem(LANG_KEY, en ? 'en' : 'zh');

    if (en) {
      Object.entries(enTexts).forEach(([sel, val]) => {
        const el = document.querySelector(sel);
        if (el) el.innerHTML = val;
      });
      Object.entries(enSubtitles).forEach(([sel, val]) => {
        const el = document.querySelector(sel);
        if (el) el.innerHTML = val;
      });
      Object.entries(enHtmls).forEach(([sel, val]) => {
        const el = document.querySelector(sel);
        if (el) el.innerHTML = val;
      });
      Object.entries(enGroups).forEach(([sel, vals]) => {
        document.querySelectorAll(sel).forEach((el, i) => {
          if (vals[i]) el.innerHTML = vals[i];
        });
      });
      document.querySelectorAll('.footer-col-title').forEach((el, i) => {
        if (enColTitles[i]) el.textContent = enColTitles[i];
      });
    } else {
      document.querySelectorAll('[data-i18n-orig]').forEach(el => {
        el.innerHTML = el.dataset.i18nOrig;
      });
    }

    reSplitWords();

    // Re-trigger subtitle visibility
    document.querySelectorAll('.section-subtitle').forEach(el => {
      el.classList.remove('visible');
      if (el.closest('.section')) {
        const rect = el.closest('.section').getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      }
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLang(!isEnglish);
    });
    if (isEnglish) applyLang(true);
  }

  // ===== Custom Cursor =====
  const cursor = document.getElementById('customCursor');
  if (cursor && !('ontouchstart' in window)) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.add('visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));

    function tickCursor() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%)';
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    document.querySelectorAll('a, button, .skill-card, .life-card, .nav-link, .dot-link, .back-to-top, .player-toggle, .lang-float, .carousel-viewport, .about-image-wrap, .bball-img, .team-card, .stat-item, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover-btn'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover-btn'));
    });
  }
