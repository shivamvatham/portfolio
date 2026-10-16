/**
 * SHIVAM VATHAM — PREMIUM ANIMATED PORTFOLIO
 * Vanilla JavaScript Core Engine (Optimized & Enhanced)
 * Integrations: Lenis Smooth Scroll, GSAP 3 + ScrollTrigger, Three.js, Typed.js, Web Audio API Sound Engine
 */

(function () {
  'use strict';

  // -------------------- GLOBAL STATE & CONFIG --------------------
  const state = {
    soundEnabled: false,
    audioCtx: null,
    lenis: null,
    isTouchDevice: window.matchMedia('(hover: none) and (pointer: coarse)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // -------------------- INITIALIZATION ON DOM READY --------------------
  document.addEventListener('DOMContentLoaded', () => {
    initLenisScroll();
    initThreeBackground();
    initCustomCursor();
    initTypedSubtitle();
    initGsapAnimations();
    initLiveClock();
    initProjectsFilter();
    initSkillSearch();
    initTerminalCopy();
    initAudioEngine();
    initContactForm();
    initNavigation();
    initFooter();
    initScreenshotLightbox();
  });


  // -------------------------------------------------------------
  // HELPER: UNIFIED SMOOTH SCROLL TO DESTINATION TARGET
  // -------------------------------------------------------------
  function scrollToTarget(target, offset = -60) {
    if (!target) return;
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetEl) return;

    // 1. Immediately ensure body and root are unlocked for scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // 2. Ensure Lenis is running if stopped
    if (state.lenis) {
      state.lenis.start();
    }

    // 3. Scroll to target element with Lenis or native smooth fallback
    if (state.lenis && typeof state.lenis.scrollTo === 'function' && !state.prefersReducedMotion) {
      requestAnimationFrame(() => {
        state.lenis.scrollTo(targetEl, {
          offset: offset,
          duration: 1.0
        });
      });
    } else {
      const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({
        top: Math.max(0, topPos),
        behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }


  // -------------------------------------------------------------
  // 1. LENIS SMOOTH SCROLLING & GSAP SYNCHRONIZATION
  // -------------------------------------------------------------
  function initLenisScroll() {
    if (state.prefersReducedMotion || typeof Lenis === 'undefined') {
      return;
    }

    try {
      state.lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
        infinite: false
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        state.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          state.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          state.lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Smooth scroll for anchor links with compact offset (excluding mobile drawer links)
      document.querySelectorAll('a[href^="#"]:not(.mobile-nav-link)').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              soundEngine.play('nav');
              scrollToTarget(targetEl, -58);
            }
          }
        });
      });
    } catch (err) {
      console.warn('Lenis smooth scroll initialization skipped:', err);
    }
  }


  // -------------------------------------------------------------
  // 2. THREE.JS INTERACTIVE 3D BACKGROUND
  // -------------------------------------------------------------
  function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined' || state.prefersReducedMotion) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Helper: Generate circular soft glowing particle sprite (eliminates square blocks)
    function createCircleTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(120, 220, 255, 0.75)');
      grad.addColorStop(0.65, 'rgba(90, 160, 255, 0.18)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(pCanvas);
      return texture;
    }

    // Create Organic Particle Constellation
    const particleCount = state.isTouchDevice ? 250 : 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color palette: Cyan (#38bdf8) to Electric Sky (#60a5fa) & Lilac (#c084fc)
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorViolet = new THREE.Color(0xc084fc);
    const colorBlue = new THREE.Color(0x60a5fa);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.5) * 90;
      // Keep particles strictly in background so they NEVER collide with foreground text
      positions[i3 + 2] = -15 - Math.random() * 45;

      const randColor = Math.random();
      let mixedColor;
      if (randColor < 0.5) {
        mixedColor = colorCyan.clone().lerp(colorBlue, Math.random());
      } else {
        mixedColor = colorBlue.clone().lerp(colorViolet, Math.random());
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: state.isTouchDevice ? 1.0 : 1.4,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Mouse coordinates tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Window Resize Handling
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Pause rendering when tab is inactive
    let isRendering = true;
    document.addEventListener('visibilitychange', () => {
      isRendering = !document.hidden;
    });

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isRendering) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Gentle rotation
      particles.rotation.y = elapsedTime * 0.035 + currentMouseX * 0.25;
      particles.rotation.x = Math.sin(elapsedTime * 0.025) * 0.08 - currentMouseY * 0.16;

      renderer.render(scene, camera);
    }

    animate();
  }


  // -------------------------------------------------------------
  // 3. CUSTOM MAGNETIC CURSOR & HOVER INTERACTIONS
  // -------------------------------------------------------------
  function initCustomCursor() {
    if (state.isTouchDevice) return;

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');
    const customCursor = document.getElementById('custom-cursor');

    if (!cursorDot || !cursorRing) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      if (cursorLabel) {
        cursorLabel.style.left = `${ringX}px`;
        cursorLabel.style.top = `${ringY}px`;
      }

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hoverable elements logic
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-chip, .bento-card, .stat-card, .filter-btn');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        customCursor.classList.add('cursor-hover');

        const labelText = target.getAttribute('data-cursor');
        if (labelText && cursorLabel) {
          cursorLabel.textContent = labelText;
          customCursor.classList.add('cursor-has-label');
        }
      });

      target.addEventListener('mouseleave', () => {
        customCursor.classList.remove('cursor-hover');
        customCursor.classList.remove('cursor-has-label');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - btnCenterX) * 0.25;
        const deltaY = (e.clientY - btnCenterY) * 0.25;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }


  // -------------------------------------------------------------
  // 4. TYPED.JS HERO SUBTITLE
  // -------------------------------------------------------------
  function initTypedSubtitle() {
    const typedElement = document.getElementById('typed-element');
    if (!typedElement || typeof Typed === 'undefined') return;

    new Typed('#typed-element', {
      strings: [
        'Vue.js & Nuxt.js Apps',
        'High-Performance Web Apps',
        'Scalable Frontend Systems',
        'Modern React Interfaces',
        'Resilient RESTful APIs'
      ],
      typeSpeed: 45,
      backSpeed: 28,
      backDelay: 1800,
      startDelay: 300,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }


  // -------------------------------------------------------------
  // 5. GSAP & SCROLLTRIGGER ANIMATIONS (TIGHT & SNAPPY)
  // -------------------------------------------------------------
  function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (state.prefersReducedMotion) {
      document.querySelectorAll('.counter').forEach((c) => {
        c.textContent = c.getAttribute('data-target') || '0';
      });
      return;
    }

    // Hero Section Snappy Staggered Reveal
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    heroTl
      .from('.hero-badge-wrap', { opacity: 0, y: 15, duration: 0.5, delay: 0.1 })
      .from('.hero-greeting', { opacity: 0, y: 15, duration: 0.4 }, '-=0.25')
      .from('.hero-name', { opacity: 0, y: 20, duration: 0.6 }, '-=0.25')
      .from('.hero-role-wrapper', { opacity: 0, y: 15, duration: 0.45 }, '-=0.25')
      .from('.hero-description', { opacity: 0, y: 15, duration: 0.5, clearProps: 'all' }, '-=0.25')
      .from('.hero-actions', { opacity: 0, y: 15, duration: 0.5, clearProps: 'all' }, '-=0.25')
      .from('.hero-quick-stack', { opacity: 0, y: 12, duration: 0.45, clearProps: 'all' }, '-=0.15')
      .from('.code-terminal-card', { opacity: 0, scale: 0.96, y: 20, duration: 0.7 }, '-=0.5')
      .from('.floating-stat-badge', { opacity: 0, scale: 0.85, stagger: 0.12, duration: 0.5 }, '-=0.35')
      .from('.stats-grid .stat-card', { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 }, '-=0.25');

    // Animated Counter Numbers on Scroll
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              duration: 1.8,
              innerHTML: target,
              roundProps: 'innerHTML',
              ease: 'power2.out',
              onUpdate: function () {
                counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
              }
            });
          }
        });
      } else {
        counter.textContent = target;
      }
    });

    // Section Headers Reveal
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out'
        });
      });

      // Bento Grid Cards Reveal
      gsap.utils.toArray('.bento-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 25,
          duration: 0.55,
          delay: (index % 2) * 0.08,
          ease: 'power2.out'
        });
      });

      // Timeline Progress Line Fill
      const timelineLine = document.querySelector('.timeline-line');
      const timelineProgress = document.getElementById('timeline-progress');
      if (timelineLine && timelineProgress) {
        ScrollTrigger.create({
          trigger: '.timeline-wrapper',
          start: 'top 75%',
          end: 'bottom 80%',
          scrub: true,
          onUpdate: (self) => {
            timelineProgress.style.height = `${self.progress * 100}%`;
          }
        });
      }

      const isMobile = window.innerWidth < 768;

      // Timeline Cards Reveal
      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item.querySelector('.timeline-card'), {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          x: isMobile ? 0 : 25,
          y: isMobile ? 20 : 0,
          duration: 0.6,
          ease: 'power2.out'
        });

        gsap.from(item.querySelector('.timeline-node'), {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          scale: 0,
          duration: 0.4,
          ease: 'back.out(1.8)'
        });
      });

      // Project Cards Reveal & 3D Interactive Tilt
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 25,
          duration: 0.55,
          delay: (i % 2) * 0.08,
          ease: 'power2.out'
        });

        // 3D Card Tilt on Mouse Move
        card.addEventListener('mousemove', (e) => {
          if (state.isTouchDevice) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -4.5;
          const rotateY = ((x - centerX) / centerX) * 4.5;

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.35,
            ease: 'power1.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      });

      // Flagship Skills Reveal
      gsap.utils.toArray('.flagship-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 22,
          duration: 0.55,
          delay: (index % 4) * 0.08,
          ease: 'power2.out'
        });
      });

      // Tech Matrix Cards Reveal
      gsap.utils.toArray('.tech-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 93%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 18,
          duration: 0.45,
          delay: (index % 4) * 0.04,
          ease: 'power2.out'
        });
      });

      // Telemetry Banner Reveal
      const telemetryBanner = document.querySelector('.skills-telemetry-banner');
      if (telemetryBanner) {
        gsap.from(telemetryBanner, {
          scrollTrigger: {
            trigger: telemetryBanner,
            start: 'top 92%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      // Education & Achievement Cards Reveal
      gsap.utils.toArray('.edu-card, .achieve-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      // Contact Column Reveal
      gsap.from('.contact-info-col', {
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: isMobile ? 0 : -25,
        y: isMobile ? 20 : 0,
        duration: 0.65,
        ease: 'power2.out'
      });

      gsap.from('.contact-form-col', {
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: isMobile ? 0 : 25,
        y: isMobile ? 20 : 0,
        duration: 0.65,
        ease: 'power2.out'
      });
    }
  }


  // -------------------------------------------------------------
  // 6. LIVE AHMEDABAD (IST) CLOCK
  // -------------------------------------------------------------
  function initLiveClock() {
    const clockEl = document.getElementById('live-ist-time');
    if (!clockEl) return;

    function updateTime() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        clockEl.textContent = `${formatter.format(now)} IST`;
      } catch (e) {
        clockEl.textContent = 'UTC+5:30 (Ahmedabad)';
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }


  // -------------------------------------------------------------
  // 7. PROJECTS FILTER TABS
  // -------------------------------------------------------------
  function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.play('filter');

        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategories = card.getAttribute('data-category') || '';
          const matches = (filterValue === 'all') || cardCategories.includes(filterValue);

          if (matches) {
            card.style.display = 'flex';
            if (card.classList.contains('featured-project') && window.innerWidth > 900) {
              card.style.display = 'grid';
            }
            gsap.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          } else {
            card.style.display = 'none';
          }
        });

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    });
  }


  // -------------------------------------------------------------
  // 8. INTERACTIVE SKILL SEARCH & CATEGORY FILTER
  // -------------------------------------------------------------
  function initSkillSearch() {
    const searchInput = document.getElementById('skill-search-input');
    const clearBtn = document.getElementById('clear-skill-search');
    const matchCounterText = document.getElementById('match-counter-text');
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const techCards = document.querySelectorAll('.tech-card');

    if (!techCards.length) return;

    let activeCategory = 'all';

    function updateFiltering() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
      }

      let visibleCount = 0;

      techCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardSkill = (card.getAttribute('data-skill') || '') + ' ' + (card.textContent || '');
        
        const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
        const matchesQuery = !query || cardSkill.toLowerCase().includes(query);

        if (matchesCategory && matchesQuery) {
          card.classList.remove('dimmed');
          if (query.length > 0) {
            card.classList.add('highlight');
          } else {
            card.classList.remove('highlight');
          }
          card.style.display = '';
          visibleCount++;
        } else {
          card.classList.add('dimmed');
          card.classList.remove('highlight');
          if (!matchesCategory) {
            card.style.display = 'none';
          } else {
            card.style.display = '';
          }
        }
      });

      if (matchCounterText) {
        matchCounterText.textContent = `Showing ${visibleCount} of ${techCards.length} technologies`;
      }
    }

    // Category Buttons Click
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.play('filter');
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        updateFiltering();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', updateFiltering);
    }

    // Clear Search Button
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        soundEngine.play('click');
        searchInput.value = '';
        updateFiltering();
        searchInput.focus();
      });
    }

    // Interactive Hover on Tech Cards
    techCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        soundEngine.play('hover');
      });
    });
  }


  // -------------------------------------------------------------
  // 9. TERMINAL CODE CARD COPY
  // -------------------------------------------------------------
  function initTerminalCopy() {
    const copyBtn = document.getElementById('terminal-copy-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      soundEngine.play('copy');

      const codeText = `const developer = {
  name: "Shivam Vatham",
  role: "Software Developer",
  experience: "3+ Years",
  location: "Ahmedabad, India",
  coreStack: ["Vue.js 2/3", "Nuxt.js", "React.js", "Vuetify", "Node.js", "Express.js"],
  impact: {
    productionApps: 5,
    apiEndpoints: "1000+",
    reusableComponents: "Standardized"
  },
  passion() {
    return "Building lightning-fast, accessible UIs";
  }
};`;

      navigator.clipboard.writeText(codeText).then(() => {
        showToast('Developer profile snippet copied to clipboard!', 'success');
        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      }).catch(() => {
        showToast('Unable to copy to clipboard', 'error');
      });
    });
  }


  // -------------------------------------------------------------
  // 10. ADVANCED WEB AUDIO API SOUND ENGINE
  // -------------------------------------------------------------
  const soundEngine = {
    play(type) {
      if (!state.soundEnabled) return;
      try {
        this.ensureContext();
        if (!state.audioCtx) return;

        const ctx = state.audioCtx;
        const now = ctx.currentTime;

        switch (type) {
          case 'hover': {
            // Soft acoustic micro-tick (~1800Hz, ultra short)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, now);
            gain.gain.setValueAtTime(0.012, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.02);
            break;
          }

          case 'click': {
            // Tactile haptic thud (520Hz down to 120Hz)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
          }

          case 'toggle': {
            // Rising two-tone arpeggio (C5 to E5)
            [523.25, 659.25].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + idx * 0.06;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.03, startTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.08);
            });
            break;
          }

          case 'nav': {
            // Soft frequency glide
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
            break;
          }

          case 'filter': {
            // Crisp tab pop (620Hz)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(620, now);
            gain.gain.setValueAtTime(0.025, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
            break;
          }

          case 'copy': {
            // Double chime (880Hz then 1174Hz)
            [880, 1174.66].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + idx * 0.07;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.03, startTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.09);
            });
            break;
          }

          case 'success': {
            // Sparkling major triad (C5 - E5 - G5)
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + idx * 0.07;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.035, startTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.18);
            });
            break;
          }

          case 'error': {
            // Soft double low pulse
            [240, 180].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              const startTime = now + idx * 0.09;
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.04, startTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.08);
            });
            break;
          }
        }
      } catch (e) {
        // Autoplay policy or unsupported audio fallback
      }
    },

    ensureContext() {
      if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          state.audioCtx = new AudioContext();
        }
      }
      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
    }
  };

  function initAudioEngine() {
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = soundToggle ? soundToggle.querySelector('.sound-label') : null;

    // Load saved sound preference
    const savedSound = localStorage.getItem('shivam_portfolio_sound');
    if (savedSound === 'enabled') {
      state.soundEnabled = true;
      if (soundToggle) soundToggle.classList.add('active');
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
      if (soundLabel) soundLabel.textContent = 'Audio: On';
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem('shivam_portfolio_sound', state.soundEnabled ? 'enabled' : 'disabled');

        if (state.soundEnabled) {
          soundEngine.ensureContext();
          soundToggle.classList.add('active');
          soundIcon.className = 'fa-solid fa-volume-high';
          if (soundLabel) soundLabel.textContent = 'Audio: On';
          soundEngine.play('toggle');
          showToast('Interactive UI audio enabled', 'info');
        } else {
          soundToggle.classList.remove('active');
          soundIcon.className = 'fa-solid fa-volume-xmark';
          if (soundLabel) soundLabel.textContent = 'Audio: Off';
          showToast('UI audio muted', 'info');
        }
      });
    }

    // Attach subtle sounds to all interactive elements
    document.querySelectorAll('.btn, .nav-link, .filter-btn, .social-pill, .skill-chip').forEach((elem) => {
      elem.addEventListener('mouseenter', () => {
        soundEngine.play('hover');
      });
      elem.addEventListener('click', () => {
        soundEngine.play('click');
      });
    });
  }


  // -------------------------------------------------------------
  // 11. INTERACTIVE CONTACT FORM & DIRECT ACTIONS
  // -------------------------------------------------------------
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');

    // 1-Click Copy Email to Clipboard
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        soundEngine.play('copy');
        const email = 'shivam.r.vatham@gmail.com';

        navigator.clipboard.writeText(email).then(() => {
          showToast('Copied email to clipboard: shivam.r.vatham@gmail.com', 'success');
          copyEmailBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
          setTimeout(() => {
            copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
          }, 2500);
        }).catch(() => {
          window.location.href = `mailto:${email}`;
        });
      });
    }

    // Interactive Form Validation & Submission
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');

        // Reset errors
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
          if (input) input.classList.remove('invalid');
        });
        [nameError, emailError, subjectError, messageError].forEach((err) => {
          if (err) err.textContent = '';
        });

        let isValid = true;

        if (!nameInput.value.trim()) {
          nameInput.classList.add('invalid');
          nameError.textContent = 'Please enter your name.';
          isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
          emailInput.classList.add('invalid');
          emailError.textContent = 'Please enter your email address.';
          isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.add('invalid');
          emailError.textContent = 'Please provide a valid email format.';
          isValid = false;
        }

        if (!subjectInput.value.trim()) {
          subjectInput.classList.add('invalid');
          subjectError.textContent = 'Please provide a subject.';
          isValid = false;
        }

        if (!messageInput.value.trim()) {
          messageInput.classList.add('invalid');
          messageError.textContent = 'Please enter your message.';
          isValid = false;
        } else if (messageInput.value.trim().length < 10) {
          messageInput.classList.add('invalid');
          messageError.textContent = 'Message should be at least 10 characters.';
          isValid = false;
        }

        if (!isValid) {
          soundEngine.play('error');
          showToast('Please correct highlighted fields before submitting.', 'error');
          return;
        }

        soundEngine.play('success');

        const recipient = 'shivam.r.vatham@gmail.com';
        const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
        const bodyContent = `Hello Shivam,

My name is ${nameInput.value.trim()} (${emailInput.value.trim()}).

${messageInput.value.trim()}

---
Sent via portfolio contact form.`;

        const body = encodeURIComponent(bodyContent);
        const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

        window.location.href = mailtoUrl;

        showToast('Launching email client with your pre-filled message!', 'success');

        setTimeout(() => {
          showToast('Message ready to send to shivam.r.vatham@gmail.com', 'info');
        }, 1500);

        contactForm.reset();
      });
    }
  }


  // -------------------------------------------------------------
  // 12. TOAST NOTIFICATION UTILITY
  // -------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideToastOut 0.25s forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 3800);
  }


  // -------------------------------------------------------------
  // 13. NAVIGATION SCROLL-SPY & MOBILE MENU
  // -------------------------------------------------------------
  function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    const sections = document.querySelectorAll('section[id]');
    function updateScrollSpy() {
      const scrollY = window.pageYOffset;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });

          mobileLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateScrollSpy, { passive: true });

    function closeMobileMenu() {
      if (!mobileToggle || !mobileDrawer) return;
      mobileToggle.classList.remove('open');
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (state.lenis) {
        state.lenis.start();
      }
    }

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        soundEngine.play('click');
        const isOpen = mobileToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        document.body.style.overflow = isOpen ? 'hidden' : '';
        document.documentElement.style.overflow = isOpen ? 'hidden' : '';
        if (state.lenis) {
          if (isOpen) state.lenis.stop();
          else state.lenis.start();
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');
          if (targetId && targetId.startsWith('#') && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              soundEngine.play('nav');

              // 1. Immediately close the drawer and unlock page scroll
              closeMobileMenu();

              // 2. Perform smooth scroll to target after drawer animation begins
              setTimeout(() => {
                scrollToTarget(targetEl, -58);
              }, 60);
            }
          }
        });
      });

      // Handle resume button click inside mobile drawer
      const mobileResumeBtn = mobileDrawer.querySelector('.btn-primary');
      if (mobileResumeBtn) {
        mobileResumeBtn.addEventListener('click', () => {
          closeMobileMenu();
        });
      }
    }
  }


  // -------------------------------------------------------------
  // 14. FOOTER DYNAMIC YEAR & BACK TO TOP
  // -------------------------------------------------------------
  function initFooter() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }


  // -------------------------------------------------------------
  // 15. SCREENSHOT LIGHTBOX MODAL
  // -------------------------------------------------------------
  function initScreenshotLightbox() {
    const modal = document.getElementById('image-lightbox-modal');
    if (!modal) return;

    const modalImg = document.getElementById('lightbox-img');
    const modalTitle = document.getElementById('lightbox-title');
    const modalOpenNew = document.getElementById('lightbox-open-new');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const backdrop = document.getElementById('lightbox-backdrop');

    function openLightbox(src, title) {
      if (!src) return;
      if (modalImg) {
        modalImg.src = src;
        modalImg.alt = title || 'Project Screenshot';
      }
      if (modalTitle) {
        modalTitle.textContent = title || 'Project Screenshot';
      }
      if (modalOpenNew) {
        modalOpenNew.href = src;
      }
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      soundEngine.play('filter');
    }

    function closeLightbox() {
      if (!modal.classList.contains('active')) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      soundEngine.play('click');
    }

    // Attach click triggers to all screenshot wraps with data-lightbox
    document.querySelectorAll('.mockup-screen-img-wrap[data-lightbox]').forEach((wrap) => {
      wrap.style.cursor = 'zoom-in';
      wrap.addEventListener('click', (e) => {
        e.preventDefault();
        const src = wrap.getAttribute('data-lightbox');
        const title = wrap.getAttribute('data-title') || 'Project Screenshot';
        openLightbox(src, title);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

})();
