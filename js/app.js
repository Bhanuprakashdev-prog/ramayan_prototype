/**
 * RAMANYAN FARM — Main Application Controller
 * Premium GSAP Animations, Hero Interactions, Cinematic Reveals & Page Transitions
 * Light Luxury Aesthetic (#FFFFFF + Dark Charcoal + Warm Gold)
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. PAGE TRANSITIONS ---
  initPageTransitions();

  // --- 2. LENIS SMOOTH SCROLL ---
  initLenis();

  // --- 3. HERO SECTION GSAP ANIMATIONS (HOME PAGE) ---
  initHeroAnimations(isReducedMotion);

  // --- 4. HOME STACKING INITIALIZATION (ONLY ON HOME PAGE) ---
  try {
    const stackContainer = document.getElementById('home-stack') || document.querySelector('.home-stack-container');
    if (typeof HomeStackingManager !== 'undefined' && stackContainer && !window.stackingManager) {
      window.stackingManager = new HomeStackingManager();
    }
  } catch (e) {
    console.warn('Stacking init:', e);
  }

  // --- 5. HEADER LIGHT GLASSMORPHISM ON SCROLL ---
  initHeaderScroll();

  // --- 6. MOBILE DRAWER & ACTIVE NAV ---
  initMobileDrawer();
  initNavigationActiveState();

  // --- 7. NUMBER COUNTERS ---
  initCounters();

  // --- 8. VIDEO & LIGHTBOX MODALS ---
  initModals();

  // --- 9. GALLERY FILTER & INTERACTION ---
  initGallery();

  // --- 10. PAGE-SPECIFIC UNIQUE ANIMATION SUITES ---
  // A. About Page: Editorial Clip-Path Reveal
  initAboutPageAnimations(isReducedMotion);

  // B. Venue Page: 3D Camera Explorer & Parallax Motion
  initVenuePageAnimations(isReducedMotion);

  // C. Events Page: Staggered Card Reveal with Lift & Zoom
  initEventsPageAnimations(isReducedMotion);

  // D. Gallery Page: Horizontal Scroll Scrub & Frame Hover Zoom
  initGalleryPageAnimations(isReducedMotion);

  // E. Contact Page: Sequential Form Field Reveal & Magnetic Submit
  initContactPageAnimations(isReducedMotion);

  // F. General Component Animations & Magnetic Cursor Buttons
  initScrollAnimations(isReducedMotion);
  initAllMagneticButtons();
});

/**
 * 1. Page Transition Curtain
 */
function initPageTransitions() {
  let curtain = document.querySelector('.page-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    document.body.appendChild(curtain);
  }

  // Fade out curtain on page entry
  requestAnimationFrame(() => {
    curtain.classList.remove('active');
  });

  // Intercept local HTML navigation links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('https://wa.me') &&
      !link.getAttribute('target') &&
      (href.endsWith('.html') || href === '/' || href.includes('.html'))
    ) {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        curtain.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 340);
      });
    }
  });
}

/**
 * 2. Lenis Smooth Scrolling
 */
function initLenis() {
  try {
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
      });

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
      window.lenisInstance = lenis;
    }
  } catch (e) {
    console.warn('Lenis scroll init:', e);
  }
}

/**
 * 3. Hero Section GSAP Animations & Interactions (HOME PAGE)
 * Requirement 5:
 * On page load: opacity 0 -> 1, scale 0.96 -> 1, x: 40px -> 0, GSAP power3.out, 1.4s
 * Subtle mouse parallax: 5–12px max movement
 * On hover: scale 1 -> 1.02 without cropping
 */
function initHeroAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined') return;

  const heroPanel = document.getElementById('hero-panel');
  const heroImg = document.querySelector('.hero-farm-img');
  const heroWrapper = document.querySelector('.hero-img-mask-wrapper');
  const badge = document.querySelector('.hero-badge-label');
  const lineTexts = document.querySelectorAll('.hero-line-text');
  const subtitle = document.querySelector('.hero-subtitle');
  const btnRow = document.querySelector('.hero-btn-row');

  // A. Hero Text Animation (Independent from image) - Requirements 3, 4, 6
  const textTl = gsap.timeline({ delay: 0.1 });

  // 1. Eyebrow/tag -> fade + slide up
  if (badge) {
    textTl.fromTo(badge,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
      0.05
    );
  }

  // 2. Heading -> staggered line reveal (2 visual lines)
  if (lineTexts.length > 0) {
    textTl.fromTo(lineTexts,
      { opacity: 0, yPercent: 100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out'
      },
      0.2
    );
  } else {
    const title = document.querySelector('.hero-title');
    if (title) {
      textTl.fromTo(title,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        0.2
      );
    }
  }

  // 3. Subtitle -> fade up
  if (subtitle) {
    textTl.fromTo(subtitle,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      0.55
    );
  }

  // 4. Buttons -> fade up with slight delay
  if (btnRow) {
    textTl.fromTo(btnRow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
      0.72
    );
  }

  // B. Hero Image Interactive Animation - Requirement 5
  if (heroImg) {
    // On page load: subtle fade + scale from 0.96 to 1
    gsap.fromTo(heroImg,
      {
        opacity: 0,
        scale: 0.96
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.35,
        ease: 'power2.out',
        delay: 0.2
      }
    );

    if (!isReducedMotion) {
      let isHovering = false;
      const quickX = gsap.quickTo(heroImg, 'x', { duration: 0.65, ease: 'power2.out' });
      const quickY = gsap.quickTo(heroImg, 'y', { duration: 0.65, ease: 'power2.out' });
      const quickRotX = gsap.quickTo(heroImg, 'rotationX', { duration: 0.75, ease: 'power2.out' });
      const quickRotY = gsap.quickTo(heroImg, 'rotationY', { duration: 0.75, ease: 'power2.out' });

      // On mouse hover & move: subtle 3D / parallax movement following mouse
      if (heroPanel && window.innerWidth >= 992) {
        heroPanel.addEventListener('mousemove', (e) => {
          const rect = heroPanel.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          // Subtle parallax: max ±16px movement, max ±3.5deg tilt
          quickX(normX * 16);
          quickY(normY * 12);
          quickRotY(normX * 3.5);
          quickRotX(-normY * 2.5);
        });

        heroPanel.addEventListener('mouseleave', () => {
          quickX(0);
          quickY(0);
          quickRotX(0);
          quickRotY(0);
        });
      }

      // On mouse hover: image slightly scales around 1.02–1.04
      if (heroWrapper) {
        heroWrapper.addEventListener('mouseenter', () => {
          isHovering = true;
          gsap.to(heroImg, { scale: 1.03, duration: 0.5, ease: 'power2.out' });
        });

        heroWrapper.addEventListener('mouseleave', () => {
          isHovering = false;
          gsap.to(heroImg, { scale: 1, duration: 0.6, ease: 'power2.out' });
        });

        // On click: subtle scale-down feedback (0.985), then return to normal
        heroWrapper.addEventListener('click', (e) => {
          e.preventDefault();
          gsap.killTweensOf(heroImg, 'scale');
          gsap.timeline()
            .to(heroImg, {
              scale: 0.985,
              duration: 0.15,
              ease: 'power1.inOut'
            })
            .to(heroImg, {
              scale: isHovering ? 1.03 : 1,
              duration: 0.45,
              ease: 'power2.out'
            });
        });
      }
    }
  }
}

/**
 * 4. Header Dark Glassmorphism on Scroll
 */
function initHeaderScroll() {
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.style.padding = '0.85rem 3.5rem';
        siteHeader.style.background = 'rgba(16, 23, 19, 0.96)';
        siteHeader.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.45)';
        siteHeader.style.borderColor = 'rgba(201, 154, 82, 0.25)';
      } else {
        siteHeader.style.padding = '1.1rem 3.5rem';
        siteHeader.style.background = 'rgba(16, 23, 19, 0.88)';
        siteHeader.style.boxShadow = 'none';
        siteHeader.style.borderColor = 'rgba(201, 154, 82, 0.15)';
      }
    });
  }
}

/**
 * 5. Mobile Drawer
 */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }
  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }
}

/**
 * Active Navigation Indicator across all pages (Desktop & Mobile)
 */
function initNavigationActiveState() {
  const currentPath = window.location.pathname.toLowerCase();
  const pageMap = [
    { key: 'about', file: 'about.html' },
    { key: 'venue', file: 'venue.html' },
    { key: 'events', file: 'events.html' },
    { key: 'gallery', file: 'gallery.html' },
    { key: 'contact', file: 'contact.html' },
    { key: 'index', file: 'index.html' }
  ];

  let activeFile = 'index.html';
  for (const page of pageMap) {
    if (currentPath.includes(page.key)) {
      activeFile = page.file;
      break;
    }
  }
  if (currentPath.endsWith('/') || currentPath === '' || currentPath.endsWith('bhanu')) {
    activeFile = 'index.html';
  }

  // Desktop navigation links
  document.querySelectorAll('.site-header .nav-item').forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === activeFile || (activeFile === 'index.html' && (href === 'index.html' || href === './' || href === '/'))) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Mobile navigation drawer links
  document.querySelectorAll('.mobile-nav-list li').forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === activeFile || (activeFile === 'index.html' && (href === 'index.html' || href === './' || href === '/'))) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * 6. Number Counter Animation for Stats
 */
function initCounters() {
  const statBoxes = document.querySelectorAll('.stat-number');
  statBoxes.forEach(stat => {
    const targetVal = parseFloat(stat.getAttribute('data-target') || '0');
    const suffix = stat.getAttribute('data-suffix') || '';

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetVal,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = (targetVal % 1 !== 0 ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
            }
          });
        }
      });
    }
  });
}

/**
 * 7. Video and Lightbox Modals
 */
function initModals() {
  const videoModal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('modal-video-player');
  const closeVideo = document.getElementById('video-modal-close');

  function openVideo(src) {
    if (videoPlayer) {
      videoPlayer.src = src || 'assets/videos/Mandap murat dom.mp4';
      videoPlayer.play().catch(() => {});
    }
    if (videoModal) videoModal.classList.add('open');
  }

  function closeVideoModal() {
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.src = '';
    }
    if (videoModal) videoModal.classList.remove('open');
  }

  document.querySelectorAll('[data-action="open-video"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoSrc = btn.getAttribute('data-video') || 'assets/videos/Mandap murat dom.mp4';
      openVideo(videoSrc);
    });
  });

  if (closeVideo) closeVideo.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
}

/**
 * 8. Gallery Filter & Lightbox
 */
function initGallery() {
  const cards = document.querySelectorAll('.gallery-card');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentCardIndex = 0;
  const cardDataList = [];

  cards.forEach((card, index) => {
    const img = card.querySelector('img');
    const title = card.querySelector('.gallery-card-title')?.textContent || 'Ramanyan Farm';
    const category = card.getAttribute('data-category') || 'all';

    cardDataList.push({
      src: img ? img.src : '',
      title: title,
      category: category
    });

    card.addEventListener('click', () => {
      currentCardIndex = index;
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    const data = cardDataList[index];
    if (!data || !lightboxModal || !lightboxImg) return;

    lightboxImg.src = data.src;
    if (lightboxCaption) lightboxCaption.textContent = data.title;
    lightboxModal.classList.add('open');

    gsap.fromTo(lightboxImg,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    );
  }

  function closeLightboxModal() {
    if (lightboxModal) lightboxModal.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxModal);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightboxModal();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCardIndex = (currentCardIndex - 1 + cardDataList.length) % cardDataList.length;
      openLightbox(currentCardIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCardIndex = (currentCardIndex + 1) % cardDataList.length;
      openLightbox(currentCardIndex);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightboxModal();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            display: 'block',
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.92,
            duration: 0.3,
            display: 'none',
            ease: 'power2.in'
          });
        }
      });
    });
  });
}

/**
 * 10. ABOUT PAGE — EDITORIAL SCROLL REVEAL (Page-Specific Identity)
 * - Section tag: opacity 0 -> 1, y: 30 -> 0
 * - Heading: opacity 0 -> 1, y: 50 -> 0
 * - Paragraph: opacity 0 -> 1, y: 25 -> 0
 * - Images: smooth clip-path reveal from bottom to top (inset(100% 0 0 0) -> inset(0% 0 0 0))
 * - 3 Pillars: staggered reveal (0.16s) + hover translateY(-6px), border highlight & subtle glow
 */
function initAboutPageAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;
  const isAbout = window.location.pathname.includes('about') || document.querySelector('.about-pillars-grid');
  if (!isAbout) return;

  // 1. Editorial Section Tag Reveal (y: 30 -> 0, opacity: 0 -> 1)
  document.querySelectorAll('main .section-tag-gold').forEach(tag => {
    gsap.fromTo(tag,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tag,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  // 2. Editorial Headings Reveal (y: 50 -> 0, opacity: 0 -> 1)
  document.querySelectorAll('main h1, main h2').forEach(heading => {
    gsap.fromTo(heading,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 86%',
          once: true
        }
      }
    );
  });

  // 3. Editorial Paragraphs Content Reveal (y: 25 -> 0, opacity: 0 -> 1)
  document.querySelectorAll('main p').forEach(para => {
    if (para.classList.contains('page-header-desc')) return;
    gsap.fromTo(para,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: para,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  // 4. Smooth Bottom-to-Top Clip-Path Reveal for Images (inset(100% 0 0 0) -> inset(0% 0 0 0))
  document.querySelectorAll('main img').forEach(img => {
    if (img.classList.contains('header-logo-img') || img.classList.contains('footer-logo-img')) return;
    const parent = img.parentElement;
    gsap.fromTo(img,
      { clipPath: 'inset(100% 0 0 0)', scale: 1.05 },
      {
        clipPath: 'inset(0% 0 0 0)',
        scale: 1,
        duration: 1.35,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: parent || img,
          start: 'top 82%',
          once: true
        }
      }
    );
  });

  // 5. 3 Pillars Staggered Reveal (0.16s stagger) & Subtle Hover Interaction
  const pillarCards = document.querySelectorAll('.about-pillar-card');
  if (pillarCards.length > 0) {
    gsap.fromTo(pillarCards,
      { opacity: 0, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.05,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-pillars-grid',
          start: 'top 82%',
          once: true
        }
      }
    );

    pillarCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -6,
          borderColor: 'rgba(201, 154, 82, 0.45)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35), 0 0 15px rgba(201, 154, 82, 0.12)',
          duration: 0.35,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          borderColor: 'var(--color-border-dark)',
          boxShadow: 'none',
          duration: 0.35,
          ease: 'power2.out'
        });
      });
    });
  }
}

/**
 * 11. VENUE PAGE — SIGNATURE 3D MANDAP REVEAL & CINEMATIC SCROLL ANIMATION
 * 1. Heading reveals
 * 2. Subtitle reveals
 * 3. 3D mandap container appears with smooth scale
 * 4. Architectural experience badge & HUD controls reveal
 * 5. Magnetic hover on atmosphere pills and CTA button
 */
function initVenuePageAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;
  const isVenue = window.location.pathname.includes('venue') || document.getElementById('mandap-canvas-container') || document.getElementById('venue-canvas-container');
  if (!isVenue) return;

  const mandapBox = document.querySelector('.mandap-3d-wrapper') || document.querySelector('.venue-explorer-box');
  const badgeOverlay = document.querySelector('.mandap-badge-overlay');
  const hudBar = document.querySelector('.mandap-hud-bar');

  const tl = gsap.timeline({ delay: 0.2 });

  if (mandapBox) {
    tl.fromTo(mandapBox,
      { opacity: 0, scale: 0.94, y: 35 },
      { opacity: 1, scale: 1, y: 0, duration: 1.25, ease: 'power3.out' }
    );
  }

  if (badgeOverlay) {
    tl.fromTo(badgeOverlay,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    );
  }

  if (hudBar) {
    tl.fromTo(hudBar,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
      '-=0.5'
    );
  }

  // Magnetic hover on interactive pills
  document.querySelectorAll('.lighting-pill-btn, .btn-view-moments').forEach(btn => {
    initMagneticElement(btn, 8);
  });

  // Venue Space Breakdown Rows & Images Cinematic Animation
  const spaceRows = document.querySelectorAll('.venue-space-row');
  spaceRows.forEach((row) => {
    const media = row.querySelector('.venue-space-media');
    const img = row.querySelector('.venue-space-img');
    const content = row.querySelector('.venue-space-content');

    // 1. Cinematic Image Reveal via Clip-Path & Scale
    if (img && media) {
      gsap.fromTo(img,
        { clipPath: 'inset(0 100% 0 0)', scale: 1.15 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1.35,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: media,
            start: 'top 82%',
            once: true
          }
        }
      );

      // Subtle scroll scrub parallax
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // 2. Text Content Staggered Entrance
    if (content) {
      const items = Array.from(content.children);
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
  });
}

/**
 * 12. EVENTS PAGE — HORIZONTAL EVENT SHOWCASE (Page-Specific Identity)
 * - Alternating card entrance: Card 1/3 from left (x: -80), Card 2/4 from right (x: 80)
 * - Staggered entrance with ScrollTrigger
 * - Image subtle scroll parallax
 * - On hover: image zoom 1.04, content moves slightly upward (translateY -4px), gold accent highlight, button/arrow shifts
 * - Subtle magnetic effect on CTA buttons
 */
function initEventsPageAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;
  const isEvents = window.location.pathname.includes('events');
  if (!isEvents) return;

  // 1. Events Header Load Reveal
  const heroHeader = document.querySelector('.dedicated-page-header');
  if (heroHeader) {
    const tag = heroHeader.querySelector('.section-tag-gold');
    const title = heroHeader.querySelector('.page-header-title');
    const desc = heroHeader.querySelector('.page-header-desc');
    const heroTl = gsap.timeline({ delay: 0.15 });
    if (tag) heroTl.fromTo(tag, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (title) heroTl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.5');
    if (desc) heroTl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.6');
  }

  // 2. Alternating Horizontal Event Cards Entrance (Card 1 from left, Card 2 from right...)
  const eventRows = document.querySelectorAll('.event-showcase-row');
  eventRows.forEach((row, i) => {
    const isFromLeft = i % 2 === 0;
    const initialX = isFromLeft ? -80 : 80;
    const imgWrap = row.querySelector('.event-media-wrap');
    const img = row.querySelector('.event-media-img');
    const content = row.querySelector('.event-content-wrap');
    const linkBtn = row.querySelector('.btn-brown-pill') || row.querySelector('a');

    // Horizontal alternating entrance
    gsap.fromTo(row,
      { x: initialX, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.15,
        delay: (i % 2) * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 82%',
          once: true
        }
      }
    );

    // Subtle scroll scrub parallax
    if (img && imgWrap) {
      gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: imgWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    // 3. Hover Interaction: image zoom 1.04, content lift (-4px), gold accent highlight, button/arrow shift
    if (row && img) {
      row.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.04, duration: 0.45, ease: 'power2.out' });
        if (content) gsap.to(content, { y: -4, duration: 0.35, ease: 'power2.out' });
        if (imgWrap) gsap.to(imgWrap, { boxShadow: '0 20px 45px rgba(201, 154, 82, 0.22)', duration: 0.35, ease: 'power2.out' });
        if (linkBtn) gsap.to(linkBtn, { x: 5, duration: 0.3, ease: 'power2.out' });
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.45, ease: 'power2.out' });
        if (content) gsap.to(content, { y: 0, duration: 0.35, ease: 'power2.out' });
        if (imgWrap) gsap.to(imgWrap, { boxShadow: '0 15px 40px rgba(48, 38, 27, 0.12)', duration: 0.35, ease: 'power2.out' });
        if (linkBtn) gsap.to(linkBtn, { x: 0, duration: 0.3, ease: 'power2.out' });
      });
    }

    // Subtle magnetic hover effect on CTA
    if (linkBtn) {
      initMagneticElement(linkBtn, 8);
    }
  });
}

/**
 * 13. GALLERY PAGE — CINEMATIC IMAGE REVEAL & LIGHTBOX (Page-Specific Identity)
 * - Load entrance: images reveal with staggered scale/clip-path
 * - On scroll: images have subtle parallax (yPercent: -7)
 * - On hover: image scale 1.05, overlay appears, title/location appears, subtle dark gradient
 * - On click: opens premium fullscreen lightbox with keyboard navigation
 */
function initGalleryPageAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;
  const isGallery = window.location.pathname.includes('gallery');
  if (!isGallery) return;

  const cards = document.querySelectorAll('.gallery-card');

  // 1. Cinematic Staggered Scale & Clip-Path Reveal
  cards.forEach((card, idx) => {
    const img = card.querySelector('img');
    const overlay = card.querySelector('.gallery-card-overlay');

    gsap.fromTo(card,
      { opacity: 0, scale: 0.94, clipPath: 'inset(10% 10% 10% 10%)' },
      {
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        delay: (idx % 3) * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true
        }
      }
    );

    // 2. Subtle Scroll Parallax on Images
    if (img) {
      gsap.to(img, {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1
        }
      });

      // 3. Hover Interaction: image scale 1.05, overlay appears with smooth gradient
      card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.05, duration: 0.5, ease: 'power2.out' });
        if (overlay) gsap.to(overlay, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
        if (overlay) gsap.to(overlay, { opacity: 0, y: 6, duration: 0.35, ease: 'power2.out' });
      });
    }
  });
}

/**
 * 14. CONTACT PAGE — SOFT LUXURY FADE (Page-Specific Identity)
 * - Sequential form fields reveal (opacity 0 -> 1, y: 22 -> 0, staggered)
 * - Input focus: warm gold glow + border accent
 * - Subtle icon movement on hover for information blocks (phone, email, address, whatsapp)
 * - Smooth submission feedback
 */
function initContactPageAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;
  const isContact = window.location.pathname.includes('contact');
  if (!isContact) return;

  const formPanel = document.querySelector('.contact-form-panel');
  const formElements = document.querySelectorAll('.contact-form .form-group, .contact-form .form-row-2, .form-submit-btn');

  // 1. Soft Luxury Sequential Form Fields Reveal
  if (formElements.length > 0 && formPanel) {
    gsap.fromTo(formElements,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: formPanel,
          start: 'top 80%',
          once: true
        }
      }
    );
  }

  // 2. Contact Information Cards Entrance & Subtle Icon Hover Movement
  const channelCards = document.querySelectorAll('.contact-channel-card');
  channelCards.forEach((card, index) => {
    const icon = card.querySelector('.channel-icon');
    
    // Soft fade entrance
    gsap.fromTo(card,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
          once: true
        }
      }
    );

    // Subtle icon movement on hover
    if (icon) {
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, { y: -4, scale: 1.08, duration: 0.3, ease: 'power2.out' });
        gsap.to(card, { borderColor: 'rgba(201, 154, 82, 0.4)', duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(icon, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(card, { borderColor: 'var(--color-border-dark)', duration: 0.3, ease: 'power2.out' });
      });
    }
  });

  // 3. Magnetic Submit Button + Arrow Shift
  const submitBtn = document.getElementById('inquiry-submit-btn') || document.querySelector('.form-submit-btn');
  if (submitBtn) {
    initMagneticElement(submitBtn, 10);
    const arrow = submitBtn.querySelector('svg');
    if (arrow) {
      submitBtn.addEventListener('mouseenter', () => {
        gsap.to(arrow, { x: 5, duration: 0.3, ease: 'power2.out' });
      });
      submitBtn.addEventListener('mouseleave', () => {
        gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' });
      });
    }
  }
}

/**
 * 15. Constrained Magnetic Element Helper (8–12px max constraint) (Requirement 33)
 */
function initMagneticElement(el, maxDist = 10) {
  if (!el || window.innerWidth < 992) return;
  const quickX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' });
  const quickY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' });

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    quickX(Math.max(-maxDist, Math.min(maxDist, x * 0.35)));
    quickY(Math.max(-maxDist, Math.min(maxDist, y * 0.35)));
  });

  el.addEventListener('mouseleave', () => {
    quickX(0);
    quickY(0);
  });
}

function initAllMagneticButtons() {
  document.querySelectorAll('.btn-gold-pill, .btn-brown-pill, .btn-dark-pill-full').forEach(btn => {
    initMagneticElement(btn, 10);
  });
}

/**
 * 16. General Component ScrollTrigger Animations (Home & Subpages)
 */
function initScrollAnimations(isReducedMotion) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;

  // A. Dedicated Page Headers
  document.querySelectorAll('.dedicated-page-header').forEach(header => {
    const title = header.querySelector('.page-header-title');
    const desc = header.querySelector('.page-header-desc');
    const tag = header.querySelector('.section-tag-gold');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%'
      }
    });

    if (tag) tl.fromTo(tag, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.5');
    if (desc) tl.fromTo(desc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, '-=0.7');
  });

  // B. Home About Section Preview
  const aboutSection = document.getElementById('about-panel');
  if (aboutSection) {
    const aboutContent = aboutSection.querySelector('.about-content-col');
    const aboutArch = aboutSection.querySelector('.about-arch-frame');
    const aboutBadges = aboutSection.querySelectorAll('.feature-badge-item');

    if (aboutContent) {
      gsap.fromTo(aboutContent.children,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            once: true
          }
        }
      );
    }

    if (aboutArch) {
      gsap.fromTo(aboutArch,
        { clipPath: 'inset(0 100% 0 0)', scale: 1.08 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          duration: 1.35,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            once: true
          }
        }
      );
    }
  }

  // C. Home Services Section: Header & Service Cards Entrance + Hover (Requirements 15–18)
  const servicesSection = document.getElementById('services-panel');
  const servicesGrid = document.querySelector('.services-cards-grid');
  if (servicesGrid) {
    const serviceCards = servicesGrid.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      // Requirement 18: Reveal using clip-path + opacity + subtle scale with stagger (Card 1 -> 2 -> 3 -> 4)
      gsap.fromTo(serviceCards,
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          scale: 0.95
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: servicesGrid,
            start: 'top 82%',
            once: true
          }
        }
      );

      // Requirements 16 & 17: Service Card Hover Interactions
      serviceCards.forEach(card => {
        const img = card.querySelector('.service-card-img');
        const icon = card.querySelector('.service-card-icon');
        const arrow = card.querySelector('.service-card-tag svg') || card.querySelector('svg');

        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -4, duration: 0.35, ease: 'power2.out' });
          if (img) gsap.to(img, { scale: 1.06, filter: 'brightness(1.05)', duration: 0.45, ease: 'power2.out' });
          if (icon) gsap.to(icon, { y: -3, duration: 0.3, ease: 'power2.out' });
          if (arrow) gsap.to(arrow, { x: 4, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
          if (img) gsap.to(img, { scale: 1, filter: 'brightness(1)', duration: 0.45, ease: 'power2.out' });
          if (icon) gsap.to(icon, { y: 0, duration: 0.3, ease: 'power2.out' });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' });
        });
      });
    }
  }

  // D. Home Venue Preview Section
  const venueSection = document.getElementById('venue-panel');
  if (venueSection) {
    const venueHeader = venueSection.querySelector('.venue-header-center');
    if (venueHeader) {
      gsap.fromTo(venueHeader.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: venueSection,
            start: 'top 75%',
            once: true
          }
        }
      );
    }
  }

  // E. Stats & Venue Collage
  const otherContainers = [
    document.querySelector('.stats-grid'),
    document.querySelector('.venue-collage-grid')
  ];

  otherContainers.forEach(container => {
    if (!container) return;
    const items = container.children;
    if (items.length > 0) {
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            once: true
          }
        }
      );
    }
  });

  // F. Final CTA Section
  const ctaSection = document.querySelector('.final-cta-section');
  if (ctaSection) {
    const ctaLeft = ctaSection.querySelector('.cta-left');
    const ctaCard = ctaSection.querySelector('.booking-floating-card');
    if (ctaLeft) {
      gsap.fromTo(ctaLeft.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaSection, start: 'top 80%', once: true }
        }
      );
    }
    if (ctaCard) {
      gsap.fromTo(ctaCard,
        { opacity: 0, scale: 0.94, y: 35 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaSection, start: 'top 80%', once: true }
        }
      );
    }
  }

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
}
