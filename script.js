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
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    threeParticles: null,
    threeGeometry: null,
    activeTheme: 'violet'
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
    initThemeAccentSwitcher();
    initInteractiveTerminal();
    initCommandPalette();
    initProjectSpecsModal();
    initSkillCrossHighlighting();
    initConfettiEngine();
    initAvailabilityEasterEgg();
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

    // Save particles reference in state for dynamic accent theme switching
    state.threeParticles = particles;
    state.threeGeometry = geometry;

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
        triggerConfetti();

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

  // -------------------------------------------------------------
  // 16. LIVE THEME ACCENT SWITCHER
  // -------------------------------------------------------------
  function initThemeAccentSwitcher() {
    const switcher = document.getElementById('theme-accent-switcher');
    const dotBtns = document.querySelectorAll('.accent-dot-btn');

    const themes = {
      violet: {
        name: 'Cosmic Violet & Cyan (Default)',
        colors: [0x38bdf8, 0xc084fc, 0x60a5fa]
      },
      orange: {
        name: 'Solar Orange (Palak Enterprises style)',
        colors: [0xf97316, 0xfbbf24, 0xf59e0b]
      },
      emerald: {
        name: 'Matrix Emerald',
        colors: [0x10b981, 0x34d399, 0x06b6d4]
      },
      cyan: {
        name: 'Cyber Aqua',
        colors: [0x06b6d4, 0x22d3ee, 0x0284c7]
      },
      rose: {
        name: 'Electric Rose',
        colors: [0xf43f5e, 0xfb7185, 0xc084fc]
      }
    };

    function setTheme(themeKey, notify = true) {
      if (!themes[themeKey]) return;
      state.activeTheme = themeKey;

      if (themeKey === 'violet') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', themeKey);
      }

      dotBtns.forEach((btn) => {
        if (btn.getAttribute('data-theme') === themeKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      localStorage.setItem('shivam_portfolio_theme', themeKey);

      // Recolor Three.js background particles in real time
      if (state.threeParticles && state.threeGeometry && typeof THREE !== 'undefined') {
        const colorsAttr = state.threeGeometry.attributes.color;
        if (colorsAttr) {
          const count = colorsAttr.count;
          const [c1Hex, c2Hex, c3Hex] = themes[themeKey].colors;
          const color1 = new THREE.Color(c1Hex);
          const color2 = new THREE.Color(c2Hex);
          const color3 = new THREE.Color(c3Hex);

          for (let i = 0; i < count; i++) {
            const rand = Math.random();
            let mixed;
            if (rand < 0.5) {
              mixed = color1.clone().lerp(color3, Math.random());
            } else {
              mixed = color3.clone().lerp(color2, Math.random());
            }
            colorsAttr.setXYZ(i, mixed.r, mixed.g, mixed.b);
          }
          colorsAttr.needsUpdate = true;
        }
      }

      if (notify) {
        soundEngine.play('toggle');
        showToast(`Theme switched: ${themes[themeKey].name}`, 'info');
      }
    }

    // Attach click listeners to dots
    dotBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-theme');
        setTheme(key, true);
      });
    });

    // Expose globally for Command Palette and Terminal
    window.setThemeAccent = setTheme;
    window.cycleTheme = function () {
      const keys = Object.keys(themes);
      const currentIndex = keys.indexOf(state.activeTheme);
      const nextIndex = (currentIndex + 1) % keys.length;
      setTheme(keys[nextIndex], true);
    };

    // Load saved preference
    const savedTheme = localStorage.getItem('shivam_portfolio_theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme, false);
    }
  }


  // -------------------------------------------------------------
  // 17. INTERACTIVE TERMINAL REPL & TABS
  // -------------------------------------------------------------
  function initInteractiveTerminal() {
    const tabBtnConfig = document.getElementById('tab-btn-config');
    const tabBtnCli = document.getElementById('tab-btn-cli');
    const paneConfig = document.getElementById('pane-config');
    const paneCli = document.getElementById('pane-cli');
    const cliOutput = document.getElementById('cli-output');
    const cliInput = document.getElementById('cli-input');
    const cliSendBtn = document.getElementById('cli-send-btn');
    const chips = document.querySelectorAll('.cli-chip');

    if (!tabBtnConfig || !tabBtnCli || !paneConfig || !paneCli) return;

    // Tab Switcher
    function switchTab(tabName) {
      soundEngine.play('filter');
      if (tabName === 'config') {
        tabBtnConfig.classList.add('active');
        tabBtnConfig.setAttribute('aria-selected', 'true');
        tabBtnCli.classList.remove('active');
        tabBtnCli.setAttribute('aria-selected', 'false');
        paneConfig.classList.add('active');
        paneCli.classList.remove('active');
      } else {
        tabBtnCli.classList.add('active');
        tabBtnCli.setAttribute('aria-selected', 'true');
        tabBtnConfig.classList.remove('active');
        tabBtnConfig.setAttribute('aria-selected', 'false');
        paneCli.classList.add('active');
        paneConfig.classList.remove('active');
        if (cliInput) {
          setTimeout(() => cliInput.focus(), 80);
        }
      }
    }

    tabBtnConfig.addEventListener('click', () => switchTab('config'));
    tabBtnCli.addEventListener('click', () => switchTab('cli'));

    // Command History
    const history = [];
    let historyIndex = -1;

    function appendOutputLine(htmlContent) {
      if (!cliOutput) return;
      const line = document.createElement('div');
      line.className = 'cli-line';
      line.innerHTML = htmlContent;
      cliOutput.appendChild(line);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function runCommand(rawCmd) {
      const cmd = (rawCmd || '').trim();
      if (!cmd) return;

      history.push(cmd);
      historyIndex = history.length;

      // Echo user command
      appendOutputLine(`<div class="cli-user-command"><span class="cmd-arrow">&gt;</span> <span>${escapeHtml(cmd)}</span></div>`);
      soundEngine.play('hover');

      const parts = cmd.toLowerCase().split(/\s+/);
      const action = parts[0];
      const arg = parts.slice(1).join(' ');

      switch (action) {
        case 'help':
          appendOutputLine(`
            <div class="cli-output-text">
              Available commands:<br>
              &bull; <span class="cli-cmd-pill" data-cli="palak">palak</span> &mdash; Palak Enterprises live website details<br>
              &bull; <span class="cli-cmd-pill" data-cli="devsload">devsload</span> &mdash; DevsLoad online tools platform<br>
              &bull; <span class="cli-cmd-pill" data-cli="projects">projects</span> &mdash; List all 7 engineering projects<br>
              &bull; <span class="cli-cmd-pill" data-cli="skills">skills</span> &mdash; Vue.js, Nuxt, React &amp; core technologies<br>
              &bull; <span class="cli-cmd-pill" data-cli="experience">experience</span> &mdash; Career overview at PHP Infosec<br>
              &bull; <span class="cli-cmd-pill" data-cli="contact">contact</span> &mdash; Email, phone &amp; socials<br>
              &bull; <span class="cli-cmd-pill" data-cli="hire">hire</span> &mdash; Say hello &amp; start a project (with confetti!)<br>
              &bull; <span class="cli-cmd-pill" data-cli="theme orange">theme [color]</span> &mdash; Set theme (orange, emerald, cyan, violet, rose)<br>
              &bull; <span class="cli-cmd-pill" data-cli="clear">clear</span> &mdash; Clear terminal screen
            </div>
          `);
          break;

        case 'palak':
        case 'palak-enterprises':
          appendOutputLine(`
            <div class="cli-output-text">
              <span class="cli-output-highlight">&#9881; Palak Enterprises &mdash; Precision Machine Parts Manufacturer</span><br>
              &bull; <strong>Live URL:</strong> <a href="https://palak-enterprises.in" target="_blank" class="cli-link">https://palak-enterprises.in <i class="fa-solid fa-arrow-up-right-from-square"></i></a><br>
              &bull; <strong>Stack:</strong> Nuxt.js, Vue 3, Vite, Modern CSS, Schema.org SEO<br>
              &bull; <strong>Catalogue:</strong> 13+ Precision Product Showcases (Chain wheels, circular loom parts, stepped shafts, bushes, precision sleeves, flanges)<br>
              &bull; <strong>Features:</strong> Interactive hero slider, dynamic quote inquiry funnel, high-performance SSR rendering.
            </div>
          `);
          break;

        case 'devsload':
          appendOutputLine(`
            <div class="cli-output-text">
              <span class="cli-output-highlight">&#128640; DevsLoad &mdash; Free Online Tools Platform</span><br>
              &bull; <strong>Live URL:</strong> <a href="https://devsload.com" target="_blank" class="cli-link">https://devsload.com <i class="fa-solid fa-arrow-up-right-from-square"></i></a><br>
              &bull; <strong>Stack:</strong> Nuxt.js, Node.js, Express.js, Tailwind CSS<br>
              &bull; <strong>Utilities:</strong> 28+ In-browser engineering tools (DNS/IP probes, QR utilities, subnet calculators).
            </div>
          `);
          break;

        case 'projects':
          appendOutputLine(`
            <div class="cli-output-text">
              <strong>All 7 Projects &amp; Systems:</strong><br>
              1. <a href="https://palak-enterprises.in" target="_blank" class="cli-link">Palak Enterprises &mdash; Corporate Platform &amp; Parts Catalogue</a> [Live]<br>
              2. <a href="https://devsload.com" target="_blank" class="cli-link">DevsLoad &mdash; Online Developer Tools</a> [Live]<br>
              3. <strong>AdvoClock</strong> &mdash; Advocate Case Management System<br>
              4. <strong>Palak Enterprises</strong> &mdash; GST Billing &amp; Invoicing Platform<br>
              5. <strong>PHP Radius</strong> &mdash; AAA Bandwidth Telemetry System<br>
              6. <strong>FusionSpot</strong> &mdash; Wi-Fi Captive Portal &amp; Management<br>
              7. <strong>PHP GST</strong> &mdash; Enterprise Tax &amp; Multi-Branch Ledgers
            </div>
          `);
          break;

        case 'skills':
          appendOutputLine(`
            <div class="cli-output-text">
              <span class="cli-output-highlight">Core Technical Competencies:</span><br>
              &bull; <strong>Frontend:</strong> Vue.js 2/3 (Composition API), Nuxt.js, React.js, Vuetify 2/3, Tailwind CSS, Vite<br>
              &bull; <strong>Backend:</strong> Node.js, Express.js, MongoDB, RESTful APIs, WebSockets<br>
              &bull; <strong>Data &amp; Animation:</strong> Chart.js, D3.js, GSAP 3, Three.js, Lenis Smooth Scroll
            </div>
          `);
          break;

        case 'experience':
          appendOutputLine(`
            <div class="cli-output-text">
              <span class="cli-output-highlight">Software Developer @ PHP Infosec (Nov 2023 &ndash; Present)</span><br>
              &bull; 3+ years delivering scalable enterprise web applications.<br>
              &bull; Engineered ISP bandwidth telemetry, hotspot portals, and accounting engines.<br>
              &bull; Standardized modular Vue/Nuxt component libraries and high-throughput REST APIs.
            </div>
          `);
          break;

        case 'contact':
          appendOutputLine(`
            <div class="cli-output-text">
              &bull; <strong>Email:</strong> <a href="mailto:shivam.r.vatham@gmail.com" class="cli-link">shivam.r.vatham@gmail.com</a><br>
              &bull; <strong>Phone:</strong> +91 94089 54477<br>
              &bull; <strong>Location:</strong> Ahmedabad, Gujarat, India<br>
              &bull; <strong>GitHub:</strong> github.com/shivamvatham | <strong>LinkedIn:</strong> Shivam Vatham
            </div>
          `);
          break;

        case 'hire':
          appendOutputLine(`
            <div class="cli-output-text" style="color: #34d399;">
              &#127881; <strong>Let's build something extraordinary together!</strong><br>
              Scrolling to contact section and launching celebration...
            </div>
          `);
          triggerConfetti();
          soundEngine.play('success');
          setTimeout(() => scrollToTarget('#contact'), 700);
          break;

        case 'theme':
          if (arg && window.setThemeAccent) {
            window.setThemeAccent(arg, true);
            appendOutputLine(`<div class="cli-output-text">Theme accent set to <strong>${escapeHtml(arg)}</strong></div>`);
          } else {
            appendOutputLine(`<div class="cli-output-text">Usage: <code>theme [orange|emerald|cyan|violet|rose]</code></div>`);
          }
          break;

        case 'visit':
          if (arg.includes('palak')) {
            window.open('https://palak-enterprises.in', '_blank');
            appendOutputLine(`<div class="cli-output-text">Opening https://palak-enterprises.in...</div>`);
          } else if (arg.includes('devsload')) {
            window.open('https://devsload.com', '_blank');
            appendOutputLine(`<div class="cli-output-text">Opening https://devsload.com...</div>`);
          } else {
            appendOutputLine(`<div class="cli-output-text">Usage: <code>visit palak</code> or <code>visit devsload</code></div>`);
          }
          break;

        case 'clear':
        case 'cls':
          if (cliOutput) {
            cliOutput.innerHTML = `
              <div class="cli-line cli-welcome">
                <span class="cli-prompt-sym">&#10140;</span> Welcome to <span class="cli-hi">shivam-shell v2.4</span>. Type <span class="cli-cmd-hint">help</span> for commands.
              </div>
              <div class="cli-line cli-tip">
                <i class="fa-solid fa-lightbulb"></i> Tip: Try running <span class="cli-cmd-pill" data-cli="palak">palak</span> or <span class="cli-cmd-pill" data-cli="hire">hire</span>!
              </div>
            `;
          }
          break;

        default:
          appendOutputLine(`
            <div class="cli-output-text" style="color: #f87171;">
              Command not found: <code>${escapeHtml(cmd)}</code>. Type <span class="cli-cmd-pill" data-cli="help">help</span> for available commands.
            </div>
          `);
          soundEngine.play('error');
          break;
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    if (cliInput) {
      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = cliInput.value;
          cliInput.value = '';
          runCommand(val);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (history.length && historyIndex > 0) {
            historyIndex--;
            cliInput.value = history[historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (history.length && historyIndex < history.length - 1) {
            historyIndex++;
            cliInput.value = history[historyIndex] || '';
          } else {
            historyIndex = history.length;
            cliInput.value = '';
          }
        }
      });
    }

    if (cliSendBtn && cliInput) {
      cliSendBtn.addEventListener('click', () => {
        const val = cliInput.value;
        cliInput.value = '';
        runCommand(val);
      });
    }

    // Quick Command Chips Click
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cli');
        if (cmd) {
          switchTab('cli');
          runCommand(cmd);
        }
      });
    });

    // Delegate inline cmd pill clicks inside cliOutput
    if (cliOutput) {
      cliOutput.addEventListener('click', (e) => {
        const pill = e.target.closest('.cli-cmd-pill');
        if (pill) {
          const cmd = pill.getAttribute('data-cli');
          if (cmd) {
            runCommand(cmd);
          }
        }
      });
    }
  }


  // -------------------------------------------------------------
  // 18. COMMAND PALETTE HUD (Ctrl+K / Cmd+K)
  // -------------------------------------------------------------
  function initCommandPalette() {
    const modal = document.getElementById('command-palette-modal');
    const input = document.getElementById('palette-input');
    const resultsContainer = document.getElementById('palette-results');
    const triggerBtn = document.getElementById('hud-trigger-btn');
    const mobileTriggerBtn = document.getElementById('mobile-hud-btn');
    const backdrop = document.getElementById('palette-backdrop');
    const escBadge = document.getElementById('palette-close-esc');

    if (!modal || !input || !resultsContainer) return;

    let selectedIndex = 0;
    let filteredItems = [];

    const items = [
      // Projects
      { id: 'proj-palak', title: 'Palak Enterprises — Precision Machine Parts Website', desc: 'https://palak-enterprises.in (Live Client Website)', group: 'Featured Projects', icon: 'fa-industry', action: () => window.open('https://palak-enterprises.in', '_blank') },
      { id: 'proj-palak-specs', title: 'Palak Enterprises — View Specifications & Viewports', desc: 'Nuxt 3, Vite, 13+ Product Catalogue, SEO Schema', group: 'Featured Projects', icon: 'fa-layer-group', action: () => openProjectSpecs('palak') },
      { id: 'proj-devsload', title: 'DevsLoad — Online Tools Platform', desc: 'https://devsload.com (Live Independent Platform)', group: 'Featured Projects', icon: 'fa-rocket', action: () => window.open('https://devsload.com', '_blank') },
      { id: 'proj-devsload-specs', title: 'DevsLoad — View Specifications & Viewports', desc: 'Nuxt.js, Node.js, 28+ Engineering Utilities', group: 'Featured Projects', icon: 'fa-layer-group', action: () => openProjectSpecs('devsload') },
      { id: 'proj-advoclock', title: 'AdvoClock — Advocate Management System', desc: 'Vue.js 3, Vuetify 3, Node, Express, MongoDB', group: 'Personal Projects', icon: 'fa-scale-balanced', action: () => openProjectSpecs('advoclock') },
      { id: 'proj-gst', title: 'Palak Enterprises — GST Invoicing Platform', desc: 'Vue.js 2, Vuetify 2, Express, Automated Tax Ledgers', group: 'Personal Projects', icon: 'fa-file-invoice-dollar', action: () => openProjectSpecs('gst-billing') },
      { id: 'proj-radius', title: 'PHP Radius — Bandwidth Telemetry System', desc: 'Vue 3, Vuetify, Chart.js, D3.js, AAA Infrastructure', group: 'Enterprise Projects', icon: 'fa-tower-broadcast', action: () => openProjectSpecs('php-radius') },
      { id: 'proj-fusion', title: 'FusionSpot — Wi-Fi Captive Portal', desc: 'Vue 3, Vuetify, Chart.js, OTP Multi-Venue Hotspots', group: 'Enterprise Projects', icon: 'fa-wifi', action: () => openProjectSpecs('fusion-spot') },
      { id: 'proj-phpgst', title: 'PHP GST — Enterprise Invoicing Suite', desc: 'Vue 3, Vuetify, Multi-Branch Accounting Ledgers', group: 'Enterprise Projects', icon: 'fa-coins', action: () => openProjectSpecs('php-gst') },

      // Navigation
      { id: 'nav-home', title: 'Jump to Home / Hero Section', desc: 'Developer profile & live interactive terminal', group: 'Navigation', icon: 'fa-house', action: () => scrollToTarget('#hero') },
      { id: 'nav-about', title: 'Jump to About Me', desc: 'Architectural pillars, IST live clock, languages', group: 'Navigation', icon: 'fa-user', action: () => scrollToTarget('#about') },
      { id: 'nav-experience', title: 'Jump to Work Experience', desc: 'PHP Infosec Software Developer milestone timeline', group: 'Navigation', icon: 'fa-briefcase', action: () => scrollToTarget('#experience') },
      { id: 'nav-projects', title: 'Jump to Projects Showcase', desc: 'All 7 production & client applications', group: 'Navigation', icon: 'fa-code', action: () => scrollToTarget('#projects') },
      { id: 'nav-skills', title: 'Jump to Technical Expertise', desc: 'Vue 3, Nuxt, React, Node, MongoDB, D3', group: 'Navigation', icon: 'fa-microchip', action: () => scrollToTarget('#skills') },
      { id: 'nav-education', title: 'Jump to Education & Certifications', desc: 'MCA, BCA, and engineering milestones', group: 'Navigation', icon: 'fa-graduation-cap', action: () => scrollToTarget('#education') },
      { id: 'nav-contact', title: 'Jump to Contact Section', desc: 'Reach out for full-time roles & projects', group: 'Navigation', icon: 'fa-paper-plane', action: () => scrollToTarget('#contact') },

      // Quick Actions
      { id: 'act-email', title: 'Copy Email Address (shivam.r.vatham@gmail.com)', desc: 'Instant clipboard copy with toast confirmation', group: 'Quick Actions', icon: 'fa-envelope', action: () => copyEmailDirect() },
      { id: 'act-resume', title: 'Download Resume (PDF)', desc: 'Official Shivam Vatham CV document', group: 'Quick Actions', icon: 'fa-file-arrow-down', action: () => downloadResumeDirect() },
      { id: 'act-sound', title: 'Toggle UI Web Audio Sound Effects', desc: 'Switch synthesizer audio engine on/off', group: 'Quick Actions', icon: 'fa-volume-high', action: () => toggleSoundDirect() },
      { id: 'act-theme', title: 'Cycle Ambient Glow Theme', desc: 'Switch between Violet, Solar Orange, Emerald, Cyan, Rose', group: 'Quick Actions', icon: 'fa-palette', action: () => window.cycleTheme && window.cycleTheme() },
      { id: 'act-confetti', title: 'Launch Celebration Confetti 🎊', desc: 'Sparkling particle burst animation', group: 'Quick Actions', icon: 'fa-sparkles', action: () => triggerConfetti() }
    ];

    function openPalette() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      input.value = '';
      selectedIndex = 0;
      renderResults('');
      soundEngine.play('filter');
      setTimeout(() => input.focus(), 60);
    }

    function closePalette() {
      if (!modal.classList.contains('active')) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      soundEngine.play('click');
    }

    function renderResults(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        filteredItems = [...items];
      } else {
        filteredItems = items.filter((item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
        );
      }

      if (selectedIndex >= filteredItems.length) {
        selectedIndex = Math.max(0, filteredItems.length - 1);
      }

      if (!filteredItems.length) {
        resultsContainer.innerHTML = `
          <div class="palette-empty">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; opacity: 0.5; margin-bottom: 8px;"></i>
            <p>No commands or projects matching "<strong>${escapePalette(query)}</strong>"</p>
          </div>
        `;
        return;
      }

      // Group by group name
      let html = '';
      let currentGroup = '';

      filteredItems.forEach((item, index) => {
        if (item.group !== currentGroup) {
          currentGroup = item.group;
          html += `<div class="palette-group-title">${currentGroup}</div>`;
        }

        const isSelected = index === selectedIndex;
        html += `
          <div class="palette-item ${isSelected ? 'selected' : ''}" data-index="${index}" role="option" aria-selected="${isSelected}">
            <div class="palette-item-left">
              <i class="fa-solid ${item.icon} palette-item-icon"></i>
              <div>
                <div style="font-weight: 600; color: #fff;">${item.title}</div>
                <div style="font-size: 0.74rem; color: #94a3b8;">${item.desc}</div>
              </div>
            </div>
            <span class="palette-item-tag">${item.group}</span>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;
    }

    function escapePalette(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function executeItem(index) {
      const item = filteredItems[index];
      if (item && typeof item.action === 'function') {
        closePalette();
        soundEngine.play('nav');
        setTimeout(() => item.action(), 100);
      }
    }

    function copyEmailDirect() {
      navigator.clipboard.writeText('shivam.r.vatham@gmail.com').then(() => {
        soundEngine.play('copy');
        showToast('Email address copied: shivam.r.vatham@gmail.com', 'success');
      });
    }

    function downloadResumeDirect() {
      const link = document.createElement('a');
      link.href = 'shivam_vatham_CV.pdf';
      link.download = 'Shivam_Vatham_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloading Shivam Vatham CV (PDF)...', 'info');
    }

    function toggleSoundDirect() {
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn) soundBtn.click();
    }

    // Input Search Listener
    input.addEventListener('input', () => {
      selectedIndex = 0;
      renderResults(input.value);
    });

    // Keyboard Navigation within Palette
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredItems.length) {
          selectedIndex = (selectedIndex + 1) % filteredItems.length;
          renderResults(input.value);
          ensureItemVisible();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredItems.length) {
          selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
          renderResults(input.value);
          ensureItemVisible();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeItem(selectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });

    function ensureItemVisible() {
      const selectedEl = resultsContainer.querySelector('.palette-item.selected');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }

    // Click on item
    resultsContainer.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.palette-item');
      if (itemEl) {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        executeItem(idx);
      }
    });

    // Global Keydown Listener (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) {
          closePalette();
        } else {
          openPalette();
        }
      }
    });

    if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
    if (mobileTriggerBtn) mobileTriggerBtn.addEventListener('click', openPalette);
    if (backdrop) backdrop.addEventListener('click', closePalette);
    if (escBadge) escBadge.addEventListener('click', closePalette);
  }


  // -------------------------------------------------------------
  // 19. PROJECT QUICK SPECS & DEVICE PREVIEW MODAL
  // -------------------------------------------------------------
  const projectsData = {
    palak: {
      title: 'Palak Enterprises — Precision Machine Parts',
      tag: 'Featured Live Client Platform',
      url: 'https://palak-enterprises.in',
      displayUrl: 'https://palak-enterprises.in',
      screenshot: 'assets/projects/palak-enterprises.png',
      isLive: true,
      overview: {
        summary: 'Official corporate website and interactive digital product catalogue engineered for Palak Enterprises, an Ahmedabad-based leader in precision CNC turning, chain wheels, and machine components.',
        challenge: 'The client needed a modern, ultra-fast web presence to showcase their comprehensive catalogue of 13+ industrial components to nationwide machinery manufacturers, with frictionless quote inquiry generation and high local search ranking.',
        solution: 'Architected a lightweight Nuxt.js/Vue 3 SSR application delivering lightning-fast page transitions, an interactive hero slideshow showcasing manufactured parts, categorized component galleries, and Schema.org LocalBusiness structured data for search engine visibility.'
      },
      architecture: {
        frontend: 'Nuxt.js & Vue 3 with Composition API for modular, component-driven UI architecture.',
        styling: 'Custom modern CSS design system with industrial obsidian theme, warm amber/orange highlights, and glassmorphic elevations.',
        performance: 'Pre-rendered static assets, responsive WebP image pipelines, and async component hydration ensuring 98+ Lighthouse score.',
        seo: 'Full Schema.org LocalBusiness markup, OpenGraph social cards, dynamic sitemaps, and optimized semantic HTML tags.'
      },
      metrics: [
        { label: 'Lighthouse Performance', value: '98/100', icon: 'fa-gauge-high' },
        { label: 'Component Lines Cataloged', value: '13+ Types', icon: 'fa-gears' },
        { label: 'Average Page Load Time', value: '< 650 ms', icon: 'fa-bolt' },
        { label: 'SEO & Accessibility Score', value: '100%', icon: 'fa-shield-halved' }
      ]
    },
    devsload: {
      title: 'DevsLoad — Online Tools Platform',
      tag: 'Featured Live Platform',
      url: 'https://devsload.com',
      displayUrl: 'https://devsload.com',
      screenshot: 'assets/projects/devsload.png',
      isLive: true,
      overview: {
        summary: 'Comprehensive multi-tool developer web platform offering zero-latency utilities for web development, network diagnostics, QR codes, subnet calculators, and media utilities.',
        challenge: 'Building a multi-utility platform that executes complex diagnostics, calculations, and conversions directly in the browser without server bottlenecking or sacrificing data privacy.',
        solution: 'Engineered an in-browser sandbox architecture in Nuxt.js where calculations and diagnostics run entirely client-side with instant cold-start and zero user tracking.'
      },
      architecture: {
        frontend: 'Nuxt.js with modular tool routing and dynamic lazy-loaded utility micro-frontends.',
        backend: 'Node.js / Express microservices for DNS, IP geolocation, and remote header probes.',
        privacy: '100% zero-log architecture where user inputs and parsed files never leave client memory.'
      },
      metrics: [
        { label: 'Active Developer Tools', value: '28+ Utilities', icon: 'fa-toolbox' },
        { label: 'Cold-Start Latency', value: '0 ms', icon: 'fa-bolt' },
        { label: 'Client Privacy', value: '100% In-Browser', icon: 'fa-lock' },
        { label: 'Global Languages', value: '3 Languages', icon: 'fa-globe' }
      ]
    },
    advoclock: {
      title: 'AdvoClock — Advocate Management System',
      tag: 'Legal Tech Solution',
      url: '#',
      displayUrl: 'advoclock.app',
      screenshot: 'assets/projects/advoclock.png',
      isLive: false,
      overview: {
        summary: 'End-to-end legal case management and calendar scheduling platform tailored for practicing advocates and law firms to streamline daily judicial operations.',
        challenge: 'Lawyers struggled with fragmented paper diaries, missed court date notices, and disorganized client filing records across multi-bench courts.',
        solution: 'Constructed an integrated case tracker with court hearing alerts, client expense ledgers, and centralized digital document management.'
      },
      architecture: {
        frontend: 'Vue.js 3 + Vuetify 3 with reactive case status tables and calendar schedule viewports.',
        backend: 'Express.js REST APIs with MongoDB indexes for rapid case number and party queries.'
      },
      metrics: [
        { label: 'Case Lookup Speed', value: '< 120 ms', icon: 'fa-gauge-high' },
        { label: 'Schedule Automation', value: '100% Automated', icon: 'fa-calendar-check' },
        { label: 'Component Modularity', value: '35+ Components', icon: 'fa-cubes' }
      ]
    },
    'gst-billing': {
      title: 'Palak Enterprises — GST Invoicing Platform',
      tag: 'FinTech & Invoicing',
      url: '#',
      displayUrl: 'palak-enterprises.internal',
      screenshot: 'assets/projects/gst-billing.png',
      isLive: false,
      overview: {
        summary: 'GST-compliant billing and invoice generation platform that automates tax compliance, itemized ledger entries, and payment reconciliations.',
        challenge: 'Manual spreadsheet accounting caused tax calculation discrepancies, delayed payment reconciliations, and cumbersome quarterly filing.',
        solution: 'Built an automated billing system with automatic SGST/CGST/IGST tax splits, client ledgers, and 1-click printable PDF invoices.'
      },
      architecture: {
        frontend: 'Vue.js 2 with Vuetify components for clean, dense accounting data grids.',
        backend: 'Node/Express invoice aggregation pipeline with PDF report generation.'
      },
      metrics: [
        { label: 'Tax Calculation Error', value: '0% Automated', icon: 'fa-circle-check' },
        { label: 'Invoice Generation', value: '< 2 Seconds', icon: 'fa-file-invoice' },
        { label: 'Monthly Overhead Saved', value: '40+ Hours', icon: 'fa-clock' }
      ]
    },
    'php-radius': {
      title: 'PHP Radius — Bandwidth Management System',
      tag: 'Telecom Infrastructure',
      url: '#',
      displayUrl: 'radius.phpinfosec.enterprise',
      screenshot: '',
      isLive: false,
      overview: {
        summary: 'High-scale AAA (Authentication, Authorization, and Accounting) bandwidth management and subscriber policy system developed at PHP Infosec.',
        challenge: 'ISPs handling thousands of concurrent subscribers needed low-latency visual telemetry for live traffic bursts, quota enforcement, and node outages.',
        solution: 'Developed dynamic D3.js and Chart.js dashboards in Vue 3 that render thousands of live data points with 60 FPS performance.'
      },
      architecture: {
        frontend: 'Vue.js 3 with canvas-optimized chart rendering for real-time throughput metrics.',
        telecom: 'Integration with RADIUS protocol servers and enterprise database backends.'
      },
      metrics: [
        { label: 'Peak ISP Throughput', value: '10 Gbps Trunk', icon: 'fa-network-wired' },
        { label: 'Dashboard Frame Rate', value: '60 FPS', icon: 'fa-gauge-high' },
        { label: 'Concurrent Sessions', value: '10,000+ Users', icon: 'fa-users' }
      ]
    },
    'fusion-spot': {
      title: 'FusionSpot — Wi-Fi Management & Captive Portal',
      tag: 'Enterprise Hotspot Suite',
      url: '#',
      displayUrl: 'fusionspot.hotspot.enterprise',
      screenshot: '',
      isLive: false,
      overview: {
        summary: 'Enterprise Wi-Fi hotspot management system and dynamic captive portal platform engineered for hospitality, corporate campuses, and public venue networks.',
        challenge: 'Multi-venue hotspot operations required customized tenant branding, OTP authentication, and tamper-proof bandwidth accounting.',
        solution: 'Crafted a white-labelable captive portal engine and administrator management console in Vue 3 with voucher management and real-time visitor demographics.'
      },
      architecture: {
        frontend: 'Responsive mobile-first captive portal and deep analytics console.',
        security: 'Rate-limiting, SMS OTP verification, and time-based access control.'
      },
      metrics: [
        { label: 'Active Hotspots Managed', value: '4,850+ Venues', icon: 'fa-wifi' },
        { label: 'Captive Portal Uptime', value: '99.9%', icon: 'fa-shield-halved' }
      ]
    },
    'php-gst': {
      title: 'PHP GST — Enterprise Billing Suite',
      tag: 'Enterprise FinTech',
      url: '#',
      displayUrl: 'gst-enterprise.phpinfosec.app',
      screenshot: '',
      isLive: false,
      overview: {
        summary: 'Enterprise billing and taxation management software suite designed to streamline multi-company accounts, tax invoices, and accounting compliance.',
        challenge: 'Multi-branch organizations needed consolidated tax summaries and automated ledger reconciliations across disparate business entities.',
        solution: 'Built high-throughput ledger tables, multi-company accounting switcher, and automatic tax return calculation modules in Vue 3.'
      },
      architecture: {
        frontend: 'Vue 3 component library with virtual scrolling for tables exceeding 100k rows.',
        reports: 'Dynamic financial health visualizations with Chart.js and high-res PDF generation.'
      },
      metrics: [
        { label: 'GST Accuracy Match', value: '100% Verified', icon: 'fa-calculator' },
        { label: 'Multi-Branch Support', value: 'Unlimited', icon: 'fa-building' }
      ]
    }
  };

  function openProjectSpecs(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    const modal = document.getElementById('project-specs-modal');
    const tagEl = document.getElementById('specs-modal-tag');
    const titleEl = document.getElementById('specs-modal-title');
    const linkEl = document.getElementById('specs-modal-link');
    const frameUrlEl = document.getElementById('specs-frame-url');
    const frameImgEl = document.getElementById('specs-frame-img');
    const deviceFrame = document.getElementById('device-frame');

    const tabOverview = document.getElementById('specs-tab-overview');
    const tabArchitecture = document.getElementById('specs-tab-architecture');
    const tabMetrics = document.getElementById('specs-tab-metrics');

    if (tagEl) tagEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${data.tag}`;
    if (titleEl) titleEl.textContent = data.title;
    if (frameUrlEl) frameUrlEl.textContent = data.displayUrl;

    if (linkEl) {
      if (data.isLive) {
        linkEl.href = data.url;
        linkEl.style.display = 'inline-flex';
        linkEl.innerHTML = `<span>Visit Live</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
      } else {
        linkEl.style.display = 'none';
      }
    }

    if (frameImgEl) {
      if (data.screenshot) {
        frameImgEl.src = data.screenshot;
        frameImgEl.style.display = 'block';
      } else {
        frameImgEl.src = 'assets/projects/devsload.png';
        frameImgEl.style.display = 'block';
      }
    }

    // Populate Overview Tab
    if (tabOverview) {
      tabOverview.innerHTML = `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-file-lines" style="color: var(--accent-cyan);"></i> Executive Summary</div>
          <p>${data.overview.summary}</p>
        </div>
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-amber);"></i> Engineering Challenge</div>
          <p>${data.overview.challenge}</p>
        </div>
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-lightbulb" style="color: #34d399;"></i> Architectural Solution</div>
          <p>${data.overview.solution}</p>
        </div>
      `;
    }

    // Populate Architecture Tab
    if (tabArchitecture) {
      tabArchitecture.innerHTML = `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-code" style="color: var(--accent-cyan);"></i> Frontend Engineering</div>
          <p>${data.architecture.frontend}</p>
        </div>
        ${data.architecture.styling ? `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-palette" style="color: var(--accent-violet);"></i> Design System &amp; CSS</div>
          <p>${data.architecture.styling}</p>
        </div>` : ''}
        ${data.architecture.backend ? `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-server" style="color: var(--accent-blue);"></i> Backend Services</div>
          <p>${data.architecture.backend}</p>
        </div>` : ''}
        ${data.architecture.performance ? `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-bolt" style="color: var(--accent-amber);"></i> Performance Optimization</div>
          <p>${data.architecture.performance}</p>
        </div>` : ''}
        ${data.architecture.seo ? `
        <div class="specs-section-box">
          <div class="specs-section-title"><i class="fa-solid fa-globe" style="color: #34d399;"></i> Search Engine Optimization (SEO)</div>
          <p>${data.architecture.seo}</p>
        </div>` : ''}
      `;
    }

    // Populate Metrics Tab
    if (tabMetrics) {
      tabMetrics.innerHTML = `
        <div class="specs-metric-grid">
          ${data.metrics.map(m => `
            <div class="specs-metric-card">
              <i class="fa-solid ${m.icon}" style="font-size: 1.2rem; color: var(--accent-cyan); margin-bottom: 6px;"></i>
              <div class="specs-metric-val">${m.value}</div>
              <div class="specs-metric-lbl">${m.label}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Reset device frame to desktop
    if (deviceFrame) {
      deviceFrame.className = 'device-frame desktop';
    }
    document.querySelectorAll('.device-btn').forEach((b, idx) => {
      if (idx === 0) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Reset tabs to overview
    document.querySelectorAll('.specs-tab-btn').forEach((b, idx) => {
      if (idx === 0) b.classList.add('active');
      else b.classList.remove('active');
    });
    if (tabOverview) tabOverview.classList.add('active');
    if (tabArchitecture) tabArchitecture.classList.remove('active');
    if (tabMetrics) tabMetrics.classList.remove('active');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    soundEngine.play('filter');
  }

  function initProjectSpecsModal() {
    const modal = document.getElementById('project-specs-modal');
    const closeBtn = document.getElementById('specs-close-btn');
    const backdrop = document.getElementById('specs-backdrop');
    const deviceBtns = document.querySelectorAll('.device-btn');
    const tabBtns = document.querySelectorAll('.specs-tab-btn');
    const deviceFrame = document.getElementById('device-frame');

    if (!modal) return;

    function closeSpecs() {
      if (!modal.classList.contains('active')) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      soundEngine.play('click');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSpecs);
    if (backdrop) backdrop.addEventListener('click', closeSpecs);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeSpecs();
      }
    });

    // Device Viewport Switcher
    deviceBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.play('hover');
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.getAttribute('data-device');
        if (deviceFrame) {
          deviceFrame.className = `device-frame ${device}`;
        }
      });
    });

    // Specs Tab Switcher
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.play('filter');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');

        const tabOverview = document.getElementById('specs-tab-overview');
        const tabArchitecture = document.getElementById('specs-tab-architecture');
        const tabMetrics = document.getElementById('specs-tab-metrics');

        if (tabOverview) tabOverview.classList.toggle('active', targetTab === 'overview');
        if (tabArchitecture) tabArchitecture.classList.toggle('active', targetTab === 'architecture');
        if (tabMetrics) tabMetrics.classList.toggle('active', targetTab === 'metrics');
      });
    });

    // Delegate click to all .project-specs-btn
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.project-specs-btn');
      if (btn) {
        e.preventDefault();
        const pId = btn.getAttribute('data-project');
        if (pId) {
          openProjectSpecs(pId);
        }
      }
    });
  }


  // -------------------------------------------------------------
  // 20. SKILL -> PROJECT CROSS-HIGHLIGHTING
  // -------------------------------------------------------------
  function initSkillCrossHighlighting() {
    // When a tech tag is clicked, pulse all matching project cards
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.tech-tag[data-tech], .skill-tag, .flagship-pill');
      if (!tag) return;

      const techName = tag.getAttribute('data-tech') || tag.textContent.trim();
      if (!techName) return;

      const cards = document.querySelectorAll('.project-card');
      let matchCount = 0;

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(techName.toLowerCase())) {
          matchCount++;
          card.classList.add('highlight-pulse');
          setTimeout(() => {
            card.classList.remove('highlight-pulse');
          }, 3600);
        }
      });

      if (matchCount > 0) {
        soundEngine.play('filter');
        showToast(`Found ${matchCount} projects built with ${techName}!`, 'success');
        scrollToTarget('#projects', -60);
      }
    });
  }


  // -------------------------------------------------------------
  // 21. ULTRA-LIGHTWEIGHT CANVAS CONFETTI ENGINE
  // -------------------------------------------------------------
  function initConfettiEngine() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function triggerConfetti() {
      if (state.prefersReducedMotion) return;
      resize();

      const particleCount = state.isTouchDevice ? 60 : 110;
      const palette = ['#00f2fe', '#38bdf8', '#c084fc', '#f97316', '#fbbf24', '#10b981', '#f43f5e', '#ffffff'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: window.innerWidth * (0.3 + Math.random() * 0.4),
          y: window.innerHeight * 0.4,
          vx: (Math.random() - 0.5) * 18,
          vy: -Math.random() * 16 - 6,
          size: Math.random() * 8 + 4,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          opacity: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }

      if (!animationId) {
        update();
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }

      if (particles.length > 0) {
        animationId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId = null;
      }
    }

    window.triggerConfetti = triggerConfetti;
  }


  // -------------------------------------------------------------
  // 22. AVAILABILITY & STATUS EASTER EGG
  // -------------------------------------------------------------
  function initAvailabilityEasterEgg() {
    const statusPill = document.querySelector('.status-pill');
    const brandDot = document.querySelector('.brand-status-dot');

    function celebrateStatus() {
      if (window.triggerConfetti) window.triggerConfetti();
      soundEngine.play('success');
      showToast('Shivam is currently available for full-time engineering roles & projects! 🚀', 'success');
    }

    if (statusPill) {
      statusPill.style.cursor = 'pointer';
      statusPill.title = 'Click to celebrate & see availability';
      statusPill.addEventListener('click', celebrateStatus);
    }
    if (brandDot) {
      brandDot.style.cursor = 'pointer';
      brandDot.addEventListener('click', celebrateStatus);
    }
  }

})();
