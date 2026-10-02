/**
 * RAMANYAN FARM — Home Page Panel Stacking System
 * GSAP ScrollTrigger Pinned Layer Scrubbing (ONLY on Home Page)
 * Enhances panel transitions with coordinated staggered reveals:
 * - Hero -> About -> Services -> Venue
 * - Service Cards Reveal via Clip-Path & Stagger (Requirement 18)
 */

class HomeStackingManager {
  constructor() {
    this.container = document.getElementById('home-stack') || document.querySelector('.home-stack-container');
    this.panels = [
      document.getElementById('hero-panel'),
      document.getElementById('about-panel'),
      document.getElementById('services-panel'),
      document.getElementById('venue-panel')
    ].filter(Boolean);

    this.timeline = null;

    if (this.container && this.panels.length === 4) {
      this.init();
    }
  }

  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Mobile / Tablet fallback to normal sequential flow
    if (window.innerWidth < 992 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.disableForMobile();
      return;
    }

    const [hero, about, services, venue] = this.panels;

    // Apply absolute pinned stacking geometry
    gsap.set(hero, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1, yPercent: 0 });
    gsap.set(about, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 2, yPercent: 100 });
    gsap.set(services, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 3, yPercent: 100 });
    gsap.set(venue, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 4, yPercent: 100 });

    this.container.style.position = 'relative';
    this.container.style.height = '100vh';
    this.container.style.overflow = 'hidden';

    // Pinned scrub timeline (Hero Frame Sequence -> About -> Services -> Venue)
    // CRITICAL PAGE LOCK: Hero stays pinned alone and plays the complete 253 frame sequence (0% -> 100%)
    // BEFORE About is allowed to begin sliding over the hero!
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: '+=550%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    });

    // 0. HERO FRAME SEQUENCE: Lock Hero pinned alone while 253 frames scrub 0% to 100%
    const heroSeq = { progress: 0 };
    this.timeline.to(heroSeq, {
      progress: 1,
      duration: 2.5,
      ease: 'none',
      onUpdate: () => {
        if (window.heroFrameSequenceInstance) {
          window.heroFrameSequenceInstance.seek(heroSeq.progress);
        }
      }
    });

    // Fade out minimal scroll down indicator early in hero scroll
    const scrollIndicator = document.querySelector('.hero-scroll-minimal');
    if (scrollIndicator) {
      this.timeline.to(scrollIndicator, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out'
      }, 0);
    }

    // 1. About moves upward covering Hero (ONLY after complete 100% frame sequence finishes!)
    this.timeline.to(about, {
      yPercent: 0,
      ease: 'none',
      duration: 1
    });

    // Animate About content subtly as it settles
    const aboutContent = about.querySelector('.about-content-col');
    const aboutArch = about.querySelector('.about-arch-frame');
    if (aboutContent && aboutArch) {
      this.timeline.fromTo([aboutContent, aboutArch],
        { opacity: 0.8, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      );
    }

    // 2. Services moves upward covering About
    this.timeline.to(services, {
      yPercent: 0,
      ease: 'none',
      duration: 1
    });

    // Requirement 18: Service Cards Reveal using clip-path + opacity + subtle scale with stagger
    const serviceCards = services.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      this.timeline.fromTo(serviceCards,
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          scale: 0.95
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power2.out'
        },
        '-=0.5'
      );
    }

    // 3. Venue moves upward covering Services
    this.timeline.to(venue, {
      yPercent: 0,
      ease: 'none',
      duration: 1
    });

    // Animate Venue collage items
    const collageItems = venue.querySelectorAll('.collage-item');
    if (collageItems.length > 0) {
      this.timeline.fromTo(collageItems,
        { opacity: 0.6, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      );
    }

    window.addEventListener('resize', this.onResize.bind(this));
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  disableForMobile() {
    if (this.container) {
      this.container.style.height = 'auto';
      this.container.style.position = 'relative';
      this.container.style.overflow = 'visible';
    }
    this.panels.forEach(panel => {
      panel.style.position = 'relative';
      panel.style.top = 'auto';
      panel.style.left = 'auto';
      panel.style.height = 'auto';
      panel.style.minHeight = '100vh';
      panel.style.transform = 'none';
      panel.style.overflow = 'visible';
    });
  }

  onResize() {
    if (window.innerWidth < 992) {
      if (this.timeline && this.timeline.scrollTrigger) {
        this.timeline.scrollTrigger.kill();
        this.timeline.kill();
      }
      this.disableForMobile();
    }
  }
}

window.HomeStackingManager = HomeStackingManager;

// Auto-instantiate safely when DOM is ready
if (typeof document !== 'undefined') {
  const initStacking = () => {
    if ((document.getElementById('home-stack') || document.querySelector('.home-stack-container')) && !window.stackingManager) {
      window.stackingManager = new HomeStackingManager();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStacking);
  } else {
    initStacking();
  }
}
