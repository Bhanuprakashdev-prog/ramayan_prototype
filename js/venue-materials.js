/**
 * RAMANYAN FARM — 3D VENUE MAP LUXURY ARCHITECTURAL MATERIALS & TEXTURES
 * Procedural & authentic photographic texture synthesis system for Three.js.
 * Samples genuine architectural aesthetics directly from Ramayan Farm reference images:
 * - Rajasthani honey sandstone palace facade with illuminated scalloped arches & jharokhas
 * - Royal Wedding Mandap with embroidered crimson/gold dais, golden pillars & crystal chandelier
 * - High-energy Sangeet concert stage with curved LED backdrop & teak waterfront decking
 * - Champagne tensile vaulted dining canopy with interior chandelier & draped banquet tables
 * - Grand Celebration Promenade with embroidered crimson runner & illuminated toran arches
 * - Valet parking plaza with dark asphalt, golden parking stalls & luxury wedding vehicles
 * - Natural botanical landscaping with textured palm trunks & organic deep green foliage
 */

class VenueMaterials {
  constructor(renderer) {
    this.renderer = renderer;
    this.maxAnisotropy = renderer ? Math.min(renderer.capabilities.getMaxAnisotropy(), 8) : 4;
    this.textureCache = new Map();
    this.materialCache = new Map();
  }

  configureTexture(texture) {
    if (typeof THREE !== 'undefined') {
      if (THREE.SRGBColorSpace) {
        texture.colorSpace = THREE.SRGBColorSpace;
      } else if (typeof THREE.sRGBEncoding !== 'undefined') {
        texture.encoding = THREE.sRGBEncoding;
      }
    }
    texture.anisotropy = this.maxAnisotropy;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  // =========================================================================
  // 1. MAIN PALACE VENUE — RAJASTHANI SANDSTONE ARCHITECTURE
  // =========================================================================

  /**
   * Generates high-resolution front facade for the central palace building
   * Based on: assets/farm-map/main-venue/01_Hero_Palace_Entrance_Enhanced.jpg
   */
  getPalaceFacadeTexture() {
    const key = 'palace_facade_main';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // 1. Warm Rajput Honey Sandstone Ashlar Masonry
    const baseGrad = ctx.createLinearGradient(0, 0, 0, H);
    baseGrad.addColorStop(0, '#caa266');
    baseGrad.addColorStop(0.5, '#ba8f52');
    baseGrad.addColorStop(1, '#9e733b');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, W, H);

    // Ashlar stone block courses with fine mortar joints
    ctx.fillStyle = 'rgba(74, 48, 20, 0.22)';
    const rowH = 32;
    for (let y = 0; y < H; y += rowH) {
      ctx.fillRect(0, y, W, 2);
      const offset = (y / rowH) % 2 === 0 ? 0 : 36;
      for (let x = offset; x < W; x += 72) {
        ctx.fillRect(x, y, 2, rowH);
      }
    }

    // Organic stone texture speckle
    ctx.fillStyle = 'rgba(255, 230, 180, 0.08)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, 2, 2);
    }
    ctx.fillStyle = 'rgba(40, 20, 5, 0.1)';
    for (let i = 0; i < 3000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // 2. Decorative Top Parapet & Kangura Battlements (Rajput cresting)
    ctx.fillStyle = '#8c602a';
    ctx.fillRect(0, 0, W, 28);
    ctx.fillStyle = '#caa266';
    for (let bx = 16; bx < W - 16; bx += 32) {
      ctx.beginPath();
      ctx.moveTo(bx - 10, 28);
      ctx.lineTo(bx, 8);
      ctx.lineTo(bx + 10, 28);
      ctx.fill();
    }
    // Gold parapet trim line
    ctx.strokeStyle = '#e6be64';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(W, 28);
    ctx.stroke();

    // 3. Sloping Chhajja (Eaves) with Shadow
    const chhajjaY = 160;
    ctx.fillStyle = 'rgba(30, 15, 5, 0.65)';
    ctx.fillRect(0, chhajjaY, W, 14); // Drop shadow under upper cornice
    ctx.fillStyle = '#8f652f';
    ctx.fillRect(0, chhajjaY - 14, W, 14);
    ctx.strokeStyle = '#ffd778';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, chhajjaY - 14, W, 14);

    // 4. Upper Floor — 5 Jharokha Scalloped Arches with Jali Windows
    const drawJharokha = (cx, cy, w, h) => {
      // Arch frame
      ctx.save();
      ctx.fillStyle = '#8a5e29';
      ctx.fillRect(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16);

      // Glowing interior hall (warm amber uplight)
      const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, w * 0.7);
      glow.addColorStop(0, '#ffe899');
      glow.addColorStop(0.35, '#ffaa33');
      glow.addColorStop(0.7, '#cc6600');
      glow.addColorStop(1, '#2b1405');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

      // Scalloped multi-foil arch contour
      ctx.strokeStyle = '#e8be66';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy);
      // Cusped arch curve
      ctx.bezierCurveTo(cx - w / 2, cy - h * 0.45, cx - w * 0.15, cy - h * 0.6, cx, cy - h * 0.55);
      ctx.bezierCurveTo(cx + w * 0.15, cy - h * 0.6, cx + w / 2, cy - h * 0.45, cx + w / 2, cy);
      ctx.lineTo(cx + w / 2, cy + h / 2);
      ctx.stroke();

      // Jali lattice diamond pattern
      ctx.strokeStyle = 'rgba(70, 35, 10, 0.45)';
      ctx.lineWidth = 1.5;
      for (let lx = cx - w / 2 + 6; lx < cx + w / 2; lx += 12) {
        ctx.beginPath();
        ctx.moveTo(lx, cy - h / 2 + 10);
        ctx.lineTo(lx + 8, cy + h / 2 - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx + 8, cy - h / 2 + 10);
        ctx.lineTo(lx, cy + h / 2 - 6);
        ctx.stroke();
      }
      ctx.restore();
    };

    [140, 320, 512, 704, 884].forEach(x => {
      drawJharokha(x, 90, 72, 85);
    });

    // 5. Ground Floor — Triple Grand Royal Entrance Arches (Central Grand Portal)
    const drawGrandArch = (cx, cy, w, h, isCentral) => {
      ctx.save();
      // Stone portal frame
      ctx.fillStyle = isCentral ? '#7a4e1e' : '#855622';
      ctx.fillRect(cx - w / 2 - 16, cy - h / 2 - 16, w + 32, h + 32);

      // Golden decorative border
      ctx.strokeStyle = '#f5c662';
      ctx.lineWidth = isCentral ? 5 : 3.5;
      ctx.strokeRect(cx - w / 2 - 16, cy - h / 2 - 16, w + 32, h + 32);

      // Deep glowing interior palace hall
      const intGlow = ctx.createRadialGradient(cx, cy + h * 0.1, 10, cx, cy, w);
      intGlow.addColorStop(0, '#fff4cc');
      intGlow.addColorStop(0.25, '#ffae38');
      intGlow.addColorStop(0.65, '#e06000');
      intGlow.addColorStop(1, '#1f0d04');
      ctx.fillStyle = intGlow;

      // Scalloped Multi-foil Arch shape
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy - h * 0.1);
      // Multi-cusp scalloped top
      ctx.arc(cx - w * 0.35, cy - h * 0.18, w * 0.15, Math.PI * 0.7, -Math.PI * 0.1, false);
      ctx.arc(cx, cy - h * 0.35, w * 0.22, Math.PI * 0.95, Math.PI * 0.05, false);
      ctx.arc(cx + w * 0.35, cy - h * 0.18, w * 0.15, Math.PI * 1.1, Math.PI * 0.3, false);
      ctx.lineTo(cx + w / 2, cy + h / 2);
      ctx.closePath();
      ctx.fill();

      // Carved gold arch outline
      ctx.strokeStyle = '#ffd87a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Royal carved teak entrance doors in center
      if (isCentral) {
        ctx.fillStyle = 'rgba(50, 25, 10, 0.75)';
        ctx.fillRect(cx - w * 0.35, cy + h * 0.12, w * 0.7, h * 0.38);
        ctx.strokeStyle = '#c89b4a';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - w * 0.35, cy + h * 0.12, w * 0.7, h * 0.38);
        ctx.beginPath();
        ctx.moveTo(cx, cy + h * 0.12);
        ctx.lineTo(cx, cy + h * 0.5);
        ctx.stroke();
        // Brass boss studs on door
        ctx.fillStyle = '#ffd700';
        for (let dy = cy + h * 0.18; dy < cy + h * 0.48; dy += 22) {
          ctx.beginPath();
          ctx.arc(cx - 16, dy, 3.5, 0, Math.PI * 2);
          ctx.arc(cx + 16, dy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Flanking Carved Pilasters / Columns with Capitals
      ctx.fillStyle = '#ba8f52';
      ctx.fillRect(cx - w / 2 - 20, cy - h / 2 - 16, 12, h + 32);
      ctx.fillRect(cx + w / 2 + 8, cy - h / 2 - 16, 12, h + 32);
      ctx.fillStyle = '#ffd778';
      ctx.fillRect(cx - w / 2 - 24, cy - h / 2 - 20, 20, 8);
      ctx.fillRect(cx + w / 2 + 4, cy - h / 2 - 20, 20, 8);

      ctx.restore();
    };

    drawGrandArch(512, 340, 180, 260, true);
    drawGrandArch(230, 345, 140, 230, false);
    drawGrandArch(794, 345, 140, 230, false);

    // Blend authentic reference photograph if available
    try {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(img, 0, 0, W, H);
        ctx.restore();
        texture.needsUpdate = true;
      };
      img.src = 'assets/farm-map/main-venue/01_Hero_Palace_Entrance_Enhanced.jpg';
    } catch (e) {}

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Generates front facade for side wings of the palace
   */
  getPalaceWingFacadeTexture() {
    const key = 'palace_facade_wing';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Sandstone Base
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#caa266');
    grad.addColorStop(0.5, '#ba8f52');
    grad.addColorStop(1, '#9e733b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Ashlar masonry
    ctx.fillStyle = 'rgba(74, 48, 20, 0.22)';
    for (let y = 0; y < H; y += 28) {
      ctx.fillRect(0, y, W, 2);
      const offset = (y / 28) % 2 === 0 ? 0 : 30;
      for (let x = offset; x < W; x += 60) {
        ctx.fillRect(x, y, 2, 28);
      }
    }

    // Top kangura battlements
    ctx.fillStyle = '#8c602a';
    ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#caa266';
    for (let bx = 12; bx < W - 12; bx += 24) {
      ctx.beginPath();
      ctx.moveTo(bx - 8, 20);
      ctx.lineTo(bx, 6);
      ctx.lineTo(bx + 8, 20);
      ctx.fill();
    }

    // Two scalloped illuminated arches with warm interior
    const drawWingArch = (cx, cy, w, h) => {
      ctx.fillStyle = '#855622';
      ctx.fillRect(cx - w / 2 - 10, cy - h / 2 - 10, w + 20, h + 20);

      const glow = ctx.createRadialGradient(cx, cy, 6, cx, cy, w * 0.8);
      glow.addColorStop(0, '#fff4cc');
      glow.addColorStop(0.3, '#ffaa33');
      glow.addColorStop(0.7, '#d46a00');
      glow.addColorStop(1, '#261205');
      ctx.fillStyle = glow;

      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy - h * 0.1);
      ctx.arc(cx - w * 0.28, cy - h * 0.15, w * 0.14, Math.PI * 0.7, -Math.PI * 0.1, false);
      ctx.arc(cx, cy - h * 0.28, w * 0.18, Math.PI * 0.95, Math.PI * 0.05, false);
      ctx.arc(cx + w * 0.28, cy - h * 0.15, w * 0.14, Math.PI * 1.1, Math.PI * 0.3, false);
      ctx.lineTo(cx + w / 2, cy + h / 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffd87a';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Jali lattice in wing arch
      ctx.strokeStyle = 'rgba(70, 35, 10, 0.4)';
      ctx.lineWidth = 1.5;
      for (let lx = cx - w / 2 + 8; lx < cx + w / 2; lx += 14) {
        ctx.beginPath();
        ctx.moveTo(lx, cy - h * 0.2);
        ctx.lineTo(lx + 8, cy + h / 2);
        ctx.stroke();
      }
    };

    drawWingArch(145, 210, 140, 220);
    drawWingArch(367, 210, 140, 220);

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Dressed Sandstone Ashlar Wall Texture (for sides and back of palace)
   */
  getSandstoneAshlarTexture() {
    const key = 'sandstone_ashlar';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#bfa06b';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(74, 48, 20, 0.25)';
    const rowH = 32;
    for (let y = 0; y < H; y += rowH) {
      ctx.fillRect(0, y, W, 2);
      const offset = (y / rowH) % 2 === 0 ? 0 : 36;
      for (let x = offset; x < W; x += 72) {
        ctx.fillRect(x, y, 2, rowH);
      }
    }

    // Varied subtle shade on blocks
    for (let y = 0; y < H; y += rowH) {
      const offset = (y / rowH) % 2 === 0 ? 0 : 36;
      for (let x = offset; x < W; x += 72) {
        const rand = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        if (rand > 0.5) {
          ctx.fillStyle = 'rgba(255, 230, 180, 0.12)';
          ctx.fillRect(x + 2, y + 2, 70, rowH - 2);
        } else if (rand < -0.3) {
          ctx.fillStyle = 'rgba(40, 20, 5, 0.12)';
          ctx.fillRect(x + 2, y + 2, 70, rowH - 2);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Roof Terrace Texture (Terracotta and sandstone paving)
   */
  getRoofTerraceTexture() {
    const key = 'roof_terrace';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Terracotta roof paving tiles
    ctx.fillStyle = '#a65d3b';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(50, 20, 10, 0.4)';
    const tileSize = 24;
    for (let y = 0; y < H; y += tileSize) {
      ctx.fillRect(0, y, W, 2);
      for (let x = 0; x < W; x += tileSize) {
        ctx.fillRect(x, y, 2, tileSize);
      }
    }

    // Gold/sandstone parapet coping around perimeter
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, W - 14, H - 14);

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 2. WEDDING LAWN & ROYAL MANDAP
  // =========================================================================

  /**
   * Generates authentic royal crimson velvet & gold embroidered mandap dais carpet
   * Based on: assets/farm-map/wedding-lawn/Golden Indian Wedding Mandap at Night.png
   */
  getMandapDaisTexture() {
    const key = 'mandap_dais';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Royal Crimson Velvet Base
    const radGrad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.7);
    radGrad.addColorStop(0, '#a31c1c');
    radGrad.addColorStop(0.65, '#821313');
    radGrad.addColorStop(1, '#5e0b0b');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, W, H);

    // Intricate Gold Zari Embroidered Border
    ctx.strokeStyle = '#e6be44';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    ctx.strokeStyle = '#ffd778';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Border paisley / floral scallop repeats
    ctx.fillStyle = '#ffd778';
    for (let x = 32; x < W - 32; x += 24) {
      ctx.beginPath();
      ctx.arc(x, 26, 5, 0, Math.PI * 2);
      ctx.arc(x, H - 26, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let y = 32; y < H - 32; y += 24) {
      ctx.beginPath();
      ctx.arc(26, y, 5, 0, Math.PI * 2);
      ctx.arc(W - 26, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central Royal Mandala / Floral Rangoli medallion
    const cx = W / 2;
    const cy = H / 2;
    ctx.strokeStyle = '#ffd778';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.stroke();

    // 16 Petals in central mandala
    ctx.fillStyle = '#fce28b';
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      const px = cx + Math.cos(ang) * 75;
      const py = cy + Math.sin(ang) * 75;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center Gold Lotus Core
    ctx.fillStyle = '#e6be44';
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#821313';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Generates golden pagoda canopy fabric texture for the Mandap roof
   */
  getMandapRoofTexture() {
    const key = 'mandap_roof';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Rich Gold-leaf metallic sheen gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#f2d87e');
    grad.addColorStop(0.3, '#d4af37');
    grad.addColorStop(0.6, '#b8860b');
    grad.addColorStop(1, '#8a6208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Scalloped Crimson Velvet Valance along bottom skirt
    ctx.fillStyle = '#9e1919';
    ctx.fillRect(0, H - 70, W, 70);

    // Scalloped gold embroidered fringes
    ctx.fillStyle = '#ffd778';
    for (let x = 0; x < W; x += 32) {
      ctx.beginPath();
      ctx.arc(x + 16, H - 70, 16, 0, Math.PI);
      ctx.fill();
      // Hanging golden tassel
      ctx.fillRect(x + 14, H - 54, 4, 28);
      ctx.beginPath();
      ctx.arc(x + 16, H - 24, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Manicured emerald lawn grass texture with subtle mowing striping
   */
  getLawnGrassTexture() {
    const key = 'lawn_grass';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#224d2d';
    ctx.fillRect(0, 0, W, H);

    // Alternating lawn mowing strips
    ctx.fillStyle = 'rgba(45, 95, 55, 0.45)';
    for (let y = 0; y < H; y += 32) {
      if ((y / 32) % 2 === 0) {
        ctx.fillRect(0, y, W, 16);
      }
    }

    // Grass blade speckle
    ctx.fillStyle = 'rgba(75, 140, 85, 0.25)';
    for (let i = 0; i < 5000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, 2, 3);
    }
    ctx.fillStyle = 'rgba(15, 35, 20, 0.35)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 3. SANGEET GROUND & WATERFRONT CONCERT ARENA
  // =========================================================================

  /**
   * Generates dynamic concert LED screen backdrop texture
   * Based on: assets/farm-map/sangeet-ground/02_Sangeet_Main_Stage_Enhanced.png
   */
  getConcertLedBackdropTexture() {
    const key = 'concert_led_backdrop';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Deep Stage Night Ambiance
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, W, H);

    // Radiating Concert Stage Beams & Visuals
    const beamGrad = ctx.createRadialGradient(W / 2, H * 0.8, 20, W / 2, H / 2, W * 0.7);
    beamGrad.addColorStop(0, '#ff0077');
    beamGrad.addColorStop(0.3, '#7928ca');
    beamGrad.addColorStop(0.65, '#0070f3');
    beamGrad.addColorStop(1, '#05070a');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, 0, W, H);

    // Concert Light Beams Fan
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const numBeams = 18;
    for (let b = 0; b < numBeams; b++) {
      const angle = ((b / (numBeams - 1)) - 0.5) * Math.PI * 0.75;
      const bx = W / 2 + Math.sin(angle) * W * 0.8;
      const by = 0;
      const bGrad = ctx.createLinearGradient(W / 2, H * 0.85, bx, by);
      bGrad.addColorStop(0, 'rgba(255, 230, 100, 0.85)');
      bGrad.addColorStop(0.5, b % 2 === 0 ? 'rgba(255, 0, 128, 0.45)' : 'rgba(0, 220, 255, 0.45)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 20, H * 0.85);
      ctx.lineTo(bx - 35, by);
      ctx.lineTo(bx + 35, by);
      ctx.lineTo(W / 2 + 20, H * 0.85);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Central Concert Graphics & Ramayan Farm Branding
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 38px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#ffd778';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 25;
    ctx.fillText('RAMANYAN FARM', W / 2, H * 0.4);

    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 18;
    ctx.fillText('SANGEET & CONCERT CELEBRATION ARENA', W / 2, H * 0.48);
    ctx.restore();

    // High-tech LED Screen Grid Lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let y = 0; y < H; y += 8) {
      ctx.fillRect(0, y, W, 1);
    }

    // Try blending real stage photograph
    try {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, 0, 0, W, H);
        ctx.restore();
        texture.needsUpdate = true;
      };
      img.src = 'assets/farm-map/sangeet-ground/02_Sangeet_Main_Stage_Enhanced.png';
    } catch (e) {}

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Rich Teak Wood Decking Texture for Waterfront & Concert Arena
   */
  getTeakWoodDeckTexture() {
    const key = 'teak_wood_deck';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Warm Teak Base
    ctx.fillStyle = '#6e4424';
    ctx.fillRect(0, 0, W, H);

    // Individual teak planks
    const plankW = 32;
    for (let x = 0; x < W; x += plankW) {
      const tone = (Math.sin(x * 7.12) * 0.5 + 0.5) * 20 - 10;
      ctx.fillStyle = `rgb(${110 + tone}, ${68 + tone * 0.8}, ${36 + tone * 0.6})`;
      ctx.fillRect(x + 2, 0, plankW - 4, H);

      // Wood grain lines
      ctx.fillStyle = 'rgba(40, 20, 10, 0.25)';
      for (let g = 0; g < 4; g++) {
        const gx = x + 4 + g * 6;
        ctx.fillRect(gx, 0, 1.5, H);
      }

      // Plank joint dark line
      ctx.fillStyle = 'rgba(25, 12, 5, 0.7)';
      ctx.fillRect(x, 0, 2, H);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 4. ROYAL DINING CANOPY & BANQUET PAVILION
  // =========================================================================

  /**
   * Champagne pleated tensile fabric texture with radial seams
   * Based on: assets/farm-map/dining-area/04_Wedding_Lawn_Canopy_Enhanced.png
   */
  getCanopyFabricTexture() {
    const key = 'canopy_fabric';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Warm Champagne / Ivory Fabric Gradient
    const rad = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.5);
    rad.addColorStop(0, '#fff6e5');
    rad.addColorStop(0.5, '#eedfc4');
    rad.addColorStop(0.85, '#d8c29e');
    rad.addColorStop(1, '#bfa47c');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // Radial gold tensile ribs & pleated fabric folds
    const cx = W / 2;
    const cy = H / 2;
    const numRibs = 16;
    for (let r = 0; r < numRibs; r++) {
      const ang = (r / numRibs) * Math.PI * 2;
      const x2 = cx + Math.cos(ang) * (W * 0.5);
      const y2 = cy + Math.sin(ang) * (H * 0.5);

      // Gold rib line
      ctx.strokeStyle = '#c89b4a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Shadowed fabric pleat fold
      const angMid = ang + (Math.PI / numRibs);
      const mx = cx + Math.cos(angMid) * (W * 0.5);
      const my = cy + Math.sin(angMid) * (H * 0.5);
      ctx.strokeStyle = 'rgba(100, 75, 45, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(mx, my);
      ctx.stroke();
    }

    // Concentric gold tension rings
    [W * 0.15, W * 0.32, W * 0.46].forEach(radius => {
      ctx.strokeStyle = '#ffd87a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Italian Botticino Marble Terrace Floor for Dining Pavilion
   */
  getMarbleTerraceTexture() {
    const key = 'marble_terrace';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#dcd2be';
    ctx.fillRect(0, 0, W, H);

    // Marble veins
    ctx.strokeStyle = 'rgba(150, 130, 105, 0.35)';
    ctx.lineWidth = 2;
    for (let v = 0; v < 8; v++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, 0);
      ctx.bezierCurveTo(Math.random() * W, H * 0.3, Math.random() * W, H * 0.7, Math.random() * W, H);
      ctx.stroke();
    }

    // Circular concentric paver rings
    const cx = W / 2;
    const cy = H / 2;
    ctx.strokeStyle = 'rgba(180, 140, 80, 0.45)';
    ctx.lineWidth = 2;
    for (let r = 40; r < W * 0.48; r += 45) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 5. CELEBRATION PROMENADE & VALET PARKING
  // =========================================================================

  /**
   * Royal crimson ceremonial carpet runner with gold brocade border
   */
  getRedCarpetRunnerTexture() {
    const key = 'red_carpet_runner';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Deep crimson velvet
    ctx.fillStyle = '#821616';
    ctx.fillRect(0, 0, W, H);

    // Gold embroidered ribbon edges along sides
    ctx.fillStyle = '#e6be44';
    ctx.fillRect(12, 0, 10, H);
    ctx.fillRect(W - 22, 0, 10, H);

    ctx.fillStyle = '#ffd778';
    ctx.fillRect(26, 0, 3, H);
    ctx.fillRect(W - 29, 0, 3, H);

    // Floral motifs along gold border
    for (let y = 16; y < H; y += 32) {
      ctx.fillStyle = '#ffd778';
      ctx.beginPath();
      ctx.arc(17, y, 4, 0, Math.PI * 2);
      ctx.arc(W - 17, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Dark Asphalt Tarmac with Golden/Yellow Stalls & VIP Markings
   * Based on: assets/farm-map/aerial/06_Venue_Aerial_Wide_Enhanced.png
   */
  getAsphaltParkingTexture() {
    const key = 'asphalt_parking';
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Dark aggregate tarmac
    ctx.fillStyle = '#222524';
    ctx.fillRect(0, 0, W, H);

    // Asphalt fine noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 8000; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 6000; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }

    // Outer boundary curb
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Golden Parking Bay Lines
    ctx.strokeStyle = '#f5c642';
    ctx.lineWidth = 5;

    // Top parking row
    for (let x = 70; x < W - 70; x += 85) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, 240);
      ctx.stroke();
    }

    // Bottom parking row
    for (let x = 70; x < W - 70; x += 85) {
      ctx.beginPath();
      ctx.moveTo(x, H - 40);
      ctx.lineTo(x, H - 240);
      ctx.stroke();
    }

    // VIP Valet Drop-off Staging Zone in Center
    ctx.fillStyle = 'rgba(200, 155, 74, 0.12)';
    ctx.fillRect(180, 360, W - 360, 300);
    ctx.strokeStyle = '#ffd778';
    ctx.lineWidth = 4;
    ctx.strokeRect(180, 360, W - 360, 300);

    // Directional White Chevron Arrows
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 6;
    [320, 512, 700].forEach(ax => {
      ctx.beginPath();
      ctx.moveTo(ax - 28, 520);
      ctx.lineTo(ax, 490);
      ctx.lineTo(ax + 28, 520);
      ctx.stroke();
    });

    // Crosswalk zebra stripes
    ctx.fillStyle = '#e0e0e0';
    for (let zx = 220; zx < W - 220; zx += 44) {
      ctx.fillRect(zx, 670, 24, 60);
    }

    // VALET VIP Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 28px "Inter", sans-serif';
    ctx.fillStyle = '#f5c642';
    ctx.fillText('VALET VIP DROP-OFF', W / 2, 450);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    this.configureTexture(texture);
    this.textureCache.set(key, texture);
    return texture;
  }

  // =========================================================================
  // 6. THREE.JS MATERIAL PALETTES (Standard & Physical Materials)
  // =========================================================================

  /**
   * Central Palace multi-material for BoxGeometry
   * [0: Right, 1: Left, 2: Top, 3: Bottom, 4: Front (+Z), 5: Back (-Z)]
   */
  getPalaceBoxMaterials() {
    const frontMat = new THREE.MeshStandardMaterial({
      map: this.getPalaceFacadeTexture(),
      roughness: 0.65,
      metalness: 0.12,
      emissive: 0x332010,
      emissiveIntensity: 0.35
    });

    const sideMat = new THREE.MeshStandardMaterial({
      map: this.getSandstoneAshlarTexture(),
      roughness: 0.75,
      metalness: 0.08
    });

    const roofMat = new THREE.MeshStandardMaterial({
      map: this.getRoofTerraceTexture(),
      roughness: 0.7,
      metalness: 0.1
    });

    return [sideMat, sideMat, roofMat, sideMat, frontMat, sideMat];
  }

  /**
   * Palace Wing multi-material for BoxGeometry
   */
  getPalaceWingMaterials() {
    const frontMat = new THREE.MeshStandardMaterial({
      map: this.getPalaceWingFacadeTexture(),
      roughness: 0.65,
      metalness: 0.12,
      emissive: 0x2e1c0c,
      emissiveIntensity: 0.3
    });

    const sideMat = new THREE.MeshStandardMaterial({
      map: this.getSandstoneAshlarTexture(),
      roughness: 0.75,
      metalness: 0.08
    });

    const roofMat = new THREE.MeshStandardMaterial({
      map: this.getRoofTerraceTexture(),
      roughness: 0.7,
      metalness: 0.1
    });

    return [sideMat, sideMat, roofMat, sideMat, frontMat, sideMat];
  }

  /**
   * Dressed sandstone molding & architectural detail material
   */
  getSandstoneMoldingMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0xba8e54,
      roughness: 0.68,
      metalness: 0.15
    });
  }

  /**
   * Carved golden Rajput kalash & finial metallic material
   */
  getRoyalGoldMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.88,
      emissive: 0x4a3b12,
      emissiveIntensity: 0.25
    });
  }

  /**
   * Wedding Mandap Dais Plinth multi-material
   */
  getMandapDaisMaterials() {
    const topMat = new THREE.MeshStandardMaterial({
      map: this.getMandapDaisTexture(),
      roughness: 0.6,
      metalness: 0.18,
      emissive: 0x220505,
      emissiveIntensity: 0.25
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xc89b4a,
      roughness: 0.35,
      metalness: 0.8
    });

    return [rimMat, rimMat, topMat, rimMat, rimMat, rimMat];
  }

  /**
   * Pagoda Mandap Canopy Roof Material
   */
  getMandapRoofMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getMandapRoofTexture(),
      roughness: 0.35,
      metalness: 0.65,
      emissive: 0x3d2908,
      emissiveIntensity: 0.35
    });
  }

  /**
   * Manicured Wedding Lawn Material
   */
  getWeddingLawnMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getLawnGrassTexture(),
      roughness: 0.78,
      metalness: 0.05
    });
  }

  /**
   * Sangeet Concert Stage Glossy Performance Surface
   */
  getConcertStageMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0x111413,
      roughness: 0.18,
      metalness: 0.6,
      emissive: 0x080c10,
      emissiveIntensity: 0.2
    });
  }

  /**
   * Sangeet Concert LED Video Wall Material (Emissive)
   */
  getConcertLedMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getConcertLedBackdropTexture(),
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0xffffff,
      emissiveMap: this.getConcertLedBackdropTexture(),
      emissiveIntensity: 0.75
    });
  }

  /**
   * Teak Wood Plank Decking Material
   */
  getTeakDeckMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getTeakWoodDeckTexture(),
      roughness: 0.65,
      metalness: 0.15
    });
  }

  /**
   * Vaulted Tensile Dining Canopy Material
   */
  getDiningCanopyMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getCanopyFabricTexture(),
      roughness: 0.42,
      metalness: 0.15,
      emissive: 0x554022,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide
    });
  }

  /**
   * Marble Dining Terrace Floor Material
   */
  getMarbleTerraceMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getMarbleTerraceTexture(),
      roughness: 0.4,
      metalness: 0.2
    });
  }

  /**
   * Royal Crimson Red Carpet Material
   */
  getRedCarpetMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getRedCarpetRunnerTexture(),
      roughness: 0.72,
      metalness: 0.15
    });
  }

  /**
   * Asphalt Valet Parking Material
   */
  getAsphaltParkingMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.getAsphaltParkingTexture(),
      roughness: 0.85,
      metalness: 0.12
    });
  }

  /**
   * Automotive High-Gloss Clearcoat Material for Valet Vehicles
   */
  getCarBodyMaterial(colorHex) {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.15,
      metalness: 0.85
    });
  }

  /**
   * Natural Date Palm Trunk Material
   */
  getPalmTrunkMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0x4a3220,
      roughness: 0.92,
      metalness: 0.05
    });
  }

  /**
   * Natural Emerald Palm Foliage Material with subtle organic variation
   */
  getFoliageMaterial(tint = 0) {
    const colors = [0x1e4a28, 0x265831, 0x183d20, 0x2b6138];
    const c = colors[tint % colors.length];
    return new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.75,
      metalness: 0.05
    });
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.VenueMaterials = VenueMaterials;
}
