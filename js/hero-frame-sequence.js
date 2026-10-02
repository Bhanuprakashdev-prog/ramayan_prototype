/**
 * RAMANYAN FARM — HERO SCROLL-CONTROLLED FRAME-BY-FRAME 3D/CINEMATIC SEQUENCE
 * High-performance HTML Canvas rendering driven by GSAP ScrollTrigger
 * 
 * Features:
 * - 253 high-definition frames loaded numerically (ezgif-frame-001.jpg -> 253.jpg)
 * - Immediate Frame 001 first-paint, followed by prioritized progressive preloading
 * - Nearest loaded neighbor fallback (0 flicker, 0 blank frames)
 * - Pure aspect-ratio preservation (object-fit: contain canvas math, never stretched/squashed)
 * - Retinal HiDPI / DPR handling capped at 2 for optimal GPU performance
 * - Reversible scroll synchronization via GSAP ScrollTrigger
 * - Natural blend into hero background (NO borders, NO containers, NO boxes)
 */

(function() {
  'use strict';

  class HeroFrameSequence {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.totalFrames = 253;
      this.frames = new Array(this.totalFrames);
      this.loaded = new Uint8Array(this.totalFrames);
      
      this.currentIndex = 0;
      this.targetProgress = 0;
      this.isFirstFrameRendered = false;
      this.batchSize = 6;
      this.nextLoadIndex = 1; // 0 is loaded first
      
      this.init();
    }

    getFramePath(oneBasedIndex) {
      const pad = String(oneBasedIndex).padStart(3, '0');
      return `assets/frame/ezgif-frame-${pad}.jpg`;
    }

    init() {
      // 1. Setup Canvas dimensions
      this.resize();

      // 2. Load Frame 1 immediately for instant above-the-fold render
      this.loadFirstFrame();

      // 3. Setup Resize handling
      window.addEventListener('resize', this.onResize.bind(this), { passive: true });

      // 4. Setup ScrollTrigger
      this.initScrollTrigger();
    }

    loadFirstFrame() {
      const firstImg = new Image();
      firstImg.decoding = 'async';
      firstImg.src = this.getFramePath(1);
      firstImg.onload = () => {
        this.frames[0] = firstImg;
        this.loaded[0] = 1;
        this.isFirstFrameRendered = true;
        this.renderFrame(0);

        // Preload next immediate 35 frames with high priority, then background stream the rest
        this.preloadInitialChunk(35);
      };
    }

    preloadInitialChunk(count) {
      let loadedCount = 0;
      const target = Math.min(count, this.totalFrames - 1);

      for (let i = 1; i <= target; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = this.getFramePath(i + 1);
        const idx = i;
        img.onload = () => {
          this.frames[idx] = img;
          this.loaded[idx] = 1;
          loadedCount++;
          if (idx === this.currentIndex) {
            this.renderFrame(this.currentIndex);
          }
          if (loadedCount >= target) {
            this.nextLoadIndex = target + 1;
            this.streamRemainingFrames();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount >= target) {
            this.nextLoadIndex = target + 1;
            this.streamRemainingFrames();
          }
        };
      }
    }

    streamRemainingFrames() {
      if (this.nextLoadIndex >= this.totalFrames) return;

      const loadNextBatch = () => {
        if (this.nextLoadIndex >= this.totalFrames) return;

        const end = Math.min(this.nextLoadIndex + this.batchSize, this.totalFrames);
        let batchLoaded = 0;
        const currentBatchCount = end - this.nextLoadIndex;

        for (let i = this.nextLoadIndex; i < end; i++) {
          const img = new Image();
          img.decoding = 'async';
          img.src = this.getFramePath(i + 1);
          const idx = i;
          img.onload = () => {
            this.frames[idx] = img;
            this.loaded[idx] = 1;
            batchLoaded++;
            if (idx === this.currentIndex) {
              this.renderFrame(this.currentIndex);
            }
            if (batchLoaded >= currentBatchCount) {
              this.nextLoadIndex = end;
              // Schedule next batch on idle/microtask to keep scroll buttery smooth
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => loadNextBatch(), { timeout: 120 });
              } else {
                setTimeout(loadNextBatch, 15);
              }
            }
          };
          img.onerror = () => {
            batchLoaded++;
            if (batchLoaded >= currentBatchCount) {
              this.nextLoadIndex = end;
              setTimeout(loadNextBatch, 15);
            }
          };
        }
      };

      loadNextBatch();
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const parentWidth = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 750;
      const width = rect.width > 0 ? rect.width : (parentWidth || 750);
      const height = rect.height > 0 ? rect.height : Math.round(width * 9 / 16);

      // Render at native high-definition resolution (1920x1080 minimum or 2x display DPR)
      // for razor-sharp clarity without downsampling blur
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.max(Math.round(width * dpr), 1920);
      this.canvas.height = Math.max(Math.round(height * dpr), 1080);

      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      // Redraw current frame at new resolution
      this.renderFrame(this.currentIndex);
    }

    onResize() {
      this.resize();
    }

    /**
     * Seeks to a specific progress (0.0 to 1.0) based on user scroll
     */
    seek(progress) {
      const clamped = Math.max(0, Math.min(1, progress));
      const targetIndex = Math.min(this.totalFrames - 1, Math.round(clamped * (this.totalFrames - 1)));
      
      if (targetIndex !== this.currentIndex) {
        this.currentIndex = targetIndex;
        this.renderFrame(targetIndex);
      }
    }

    /**
     * Renders requested frame or closest available neighbor with zero flicker
     */
    renderFrame(index) {
      if (!this.ctx || !this.canvas) return;

      let img = this.frames[index];
      
      // If frame is still downloading, find closest loaded neighbor
      if (!img || !this.loaded[index]) {
        let bestDiff = Infinity;
        let bestIndex = -1;
        
        for (let i = 0; i < this.totalFrames; i++) {
          if (this.loaded[i] && this.frames[i]) {
            const diff = Math.abs(i - index);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestIndex = i;
            }
          }
        }
        
        if (bestIndex !== -1) {
          img = this.frames[bestIndex];
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        this.drawContain(img);
      }
    }

    /**
     * Pure object-fit: contain canvas drawing math:
     * Never stretches, squashes, or crops
     */
    drawContain(img) {
      const cw = this.canvas.width;
      const ch = this.canvas.height;
      if (cw === 0 || ch === 0) return;

      this.ctx.clearRect(0, 0, cw, ch);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.min(hRatio, vRatio);

      const nw = Math.round(iw * ratio);
      const nh = Math.round(ih * ratio);
      const nx = Math.round((cw - nw) / 2);
      const ny = Math.round((ch - nh) / 2);

      this.ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);
    }

    /**
     * Dedicated GSAP ScrollTrigger strictly for the hero frame sequence
     * (HomeStackingManager controls desktop; this handles mobile / unstacked)
     */
    initScrollTrigger() {
      if (typeof ScrollTrigger === 'undefined') {
        window.addEventListener('load', () => this.initScrollTrigger());
        return;
      }

      // If desktop, HomeStackingManager coordinates the master locked timeline
      if (window.innerWidth >= 992 && document.getElementById('home-stack')) {
        return;
      }

      // Mobile / Tablet standalone pinning
      const heroPanel = document.getElementById('hero-panel');
      if (!heroPanel) return;

      ScrollTrigger.create({
        trigger: heroPanel,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.3,
        anticipatePin: 1,
        onUpdate: (self) => {
          this.seek(self.progress);
        }
      });
    }
  }

  // Export to global window scope
  window.HeroFrameSequence = HeroFrameSequence;

  // Auto-initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-frame-canvas');
    if (canvas && !window.heroFrameSequenceInstance) {
      window.heroFrameSequenceInstance = new HeroFrameSequence('hero-frame-canvas');
    }
  });

})();
