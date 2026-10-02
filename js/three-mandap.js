/**
 * RAMANYAN FARM — SIGNATURE 3D WEDDING MANDAP EXPERIENCE
 * Premium Architectural 3D Visualization of the Iconic Royal Wedding Mandap
 * Built with Three.js, GSAP & ScrollTrigger
 * 
 * Modular Architecture:
 * - MandapMaterials: Procedural PBR materials & high-res procedural canvas textures
 * - MandapScene: Full luxury Indian wedding mandap geometry & festive details
 * - MandapLighting: Cinematic Day -> Golden Hour -> Night Wedding lighting transitions
 * - MandapCamera: Cinematic perspective, camera glide & framing
 * - MandapInteraction: Subtle cursor parallax & responsive touch handling
 * - RealMomentsGallery: Authentic photograph gallery modal controller
 * - SignatureMandap3D: Master orchestrator & lifecycle coordinator
 */

(function() {
  'use strict';

  /* =========================================================================
   * 1. MANDAP MATERIALS & PROCEDURAL TEXTURES
   * ========================================================================= */
  class MandapMaterials {
    constructor() {
      this.textures = {};
      this.materials = {};
      this.initTextures();
      this.initMaterials();
    }

    initTextures() {
      this.textures.marble = this.createMarbleTexture();
      this.textures.carpet = this.createCarpetTexture();
      this.textures.jaali = this.createJaaliTexture();
      this.textures.carvedStone = this.createCarvedStoneTexture();
    }

    createMarbleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Deep emerald-charcoal polished stone base
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#0e1612');
      grad.addColorStop(0.5, '#14201a');
      grad.addColorStop(1, '#0b120f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Fine golden and pearl mineral veins
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        let x = Math.random() * 512;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 512) {
          x += (Math.random() - 0.5) * 45;
          y += Math.random() * 55 + 20;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(218, 175, 105, 0.22)' : 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    createCarpetTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Royal crimson field
      ctx.fillStyle = '#6b0d19';
      ctx.fillRect(0, 0, 512, 512);

      // Outer gold filigree border
      ctx.strokeStyle = '#deb878';
      ctx.lineWidth = 16;
      ctx.strokeRect(18, 18, 476, 476);
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 440, 440);

      // Ornate corner spandrels
      ctx.fillStyle = '#c99a52';
      const corners = [[45, 45], [467, 45], [45, 467], [467, 467]];
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central Royal Medallion
      ctx.beginPath();
      ctx.arc(256, 256, 85, 0, Math.PI * 2);
      ctx.fillStyle = '#8a1322';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#deb878';
      ctx.stroke();

      // Radiating lotus petals
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        const px = 256 + Math.cos(a) * 65;
        const py = 256 + Math.sin(a) * 65;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#deb878';
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 2);
      return texture;
    }

    createJaaliTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Transparent cutout background
      ctx.clearRect(0, 0, 256, 256);

      // Glowing warm gold filigree framework
      ctx.fillStyle = 'rgba(235, 185, 100, 0.95)';
      ctx.fillRect(0, 0, 256, 14);
      ctx.fillRect(0, 242, 256, 14);
      ctx.fillRect(0, 0, 14, 256);
      ctx.fillRect(242, 0, 14, 256);

      // Trellis lattice arches
      ctx.strokeStyle = 'rgba(255, 205, 120, 0.85)';
      ctx.lineWidth = 5;
      for (let x = 20; x < 240; x += 44) {
        for (let y = 20; y < 240; y += 44) {
          ctx.beginPath();
          ctx.arc(x + 22, y + 22, 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + 22, y + 22, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 235, 175, 0.7)';
          ctx.fill();
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 1);
      return texture;
    }

    createCarvedStoneTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Warm sandstone relief
      ctx.fillStyle = '#f4ede1';
      ctx.fillRect(0, 0, 256, 512);

      // Fluted stone grooves
      ctx.fillStyle = '#e5dbca';
      for (let x = 12; x < 256; x += 22) {
        ctx.fillRect(x, 0, 8, 512);
      }

      // Ornamental horizontal bands
      ctx.fillStyle = '#deb878';
      ctx.fillRect(0, 80, 256, 14);
      ctx.fillRect(0, 250, 256, 14);
      ctx.fillRect(0, 420, 256, 14);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 1);
      return texture;
    }

    initMaterials() {
      // 1. Champagne Gold & Warm Metallics
      this.materials.champagneGold = new THREE.MeshStandardMaterial({
        color: 0xdeb878,
        metalness: 0.86,
        roughness: 0.22
      });

      this.materials.brightGold = new THREE.MeshStandardMaterial({
        color: 0xffd988,
        metalness: 0.92,
        roughness: 0.16,
        emissive: 0x442c05,
        emissiveIntensity: 0.25
      });

      // 2. Architectural Framework & Carved Ivory
      this.materials.carvedIvory = new THREE.MeshStandardMaterial({
        color: 0xfbf8f1,
        roughness: 0.38,
        metalness: 0.08,
        map: this.textures.carvedStone
      });

      this.materials.pureWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.04
      });

      // 3. Reflective Stage Marble
      this.materials.reflectiveMarble = new THREE.MeshStandardMaterial({
        color: 0x141d18,
        roughness: 0.16,
        metalness: 0.26,
        map: this.textures.marble,
        bumpMap: this.textures.marble,
        bumpScale: 0.02
      });

      // 4. Royal Ceremonial Carpet
      this.materials.ceremonialCarpet = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.72,
        metalness: 0.12,
        map: this.textures.carpet
      });

      // 5. Luminous Backlit Jaali Panels
      this.materials.luminousJaali = new THREE.MeshStandardMaterial({
        color: 0xffe5b4,
        roughness: 0.25,
        metalness: 0.3,
        emissive: 0xffaa44,
        emissiveIntensity: 0.85,
        map: this.textures.jaali,
        transparent: true,
        side: THREE.DoubleSide
      });

      // 6. Royal Crimson Velvet & Silk Drapes
      this.materials.royalVelvet = new THREE.MeshStandardMaterial({
        color: 0x730e1a,
        roughness: 0.82,
        metalness: 0.14
      });

      this.materials.sheerOrganza = new THREE.MeshStandardMaterial({
        color: 0xffeed5,
        roughness: 0.42,
        metalness: 0.2,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide
      });

      // 7. Crystal Chandelier Prisms
      this.materials.crystal = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.12,
        transparent: true,
        opacity: 0.88,
        emissive: 0xffdfaa,
        emissiveIntensity: 0.4
      });

      // 8. Extravagant Wedding Florals
      this.materials.roseRed = new THREE.MeshStandardMaterial({
        color: 0x9b1122,
        roughness: 0.65,
        metalness: 0.04
      });

      this.materials.marigoldOrange = new THREE.MeshStandardMaterial({
        color: 0xeb7700,
        roughness: 0.72,
        metalness: 0.04
      });

      this.materials.marigoldYellow = new THREE.MeshStandardMaterial({
        color: 0xf5b800,
        roughness: 0.7,
        metalness: 0.04
      });

      this.materials.jasmineWhite = new THREE.MeshStandardMaterial({
        color: 0xfffcf5,
        roughness: 0.58,
        metalness: 0.02,
        emissive: 0xfff2d4,
        emissiveIntensity: 0.18
      });

      this.materials.eucalyptusGreen = new THREE.MeshStandardMaterial({
        color: 0x2d5233,
        roughness: 0.78,
        metalness: 0.05
      });

      // 9. Ceremonial Sacred Embers (Havan Kund)
      this.materials.sacredEmbers = new THREE.MeshStandardMaterial({
        color: 0xff4800,
        emissive: 0xff5511,
        emissiveIntensity: 1.8,
        roughness: 0.3
      });
    }
  }

  /* =========================================================================
   * 2. MANDAP SCENE BUILDER
   * ========================================================================= */
  class MandapScene {
    constructor(materials) {
      this.mat = materials.materials;
      this.rootGroup = new THREE.Group();
      this.rootGroup.name = 'SignatureMandapRoot';

      // Collections for animation hooks
      this.hangingFlorals = [];
      this.floatingEmbers = null;
      this.chandelierGroup = null;
      this.emissiveMeshes = [];

      this.buildAll();
    }

    buildAll() {
      this.buildStagePodium();
      this.buildGlowingJaaliArchSkirt();
      this.buildColonnadePillars();
      this.buildCanopyAndVaultedDome();
      this.buildCrownShikhara();
      this.buildSilkValancesAndDrapes();
      this.buildGrandFloralGarlands();
      this.buildCascadingHangingFlowers();
      this.buildMultiTierCrystalChandelier();
      this.buildCeremonialRoyalSeating();
      this.buildAtmosphericFireflyParticles();
    }

    /**
     * 1. Multi-tier reflective stage platform with beveled gold rims
     */
    buildStagePodium() {
      const stageGroup = new THREE.Group();

      // Lower Plinth Base
      const baseGeo = new THREE.CylinderGeometry(11.8, 12.0, 0.45, 52);
      const baseMesh = new THREE.Mesh(baseGeo, this.mat.carvedIvory);
      baseMesh.position.y = 0.225;
      baseMesh.receiveShadow = true;
      stageGroup.add(baseMesh);

      // Gold Beveled Trim on Plinth
      const trimGeo = new THREE.TorusGeometry(11.9, 0.07, 12, 52);
      trimGeo.rotateX(Math.PI / 2);
      const trimMesh = new THREE.Mesh(trimGeo, this.mat.brightGold);
      trimMesh.position.y = 0.45;
      stageGroup.add(trimMesh);

      // Main Raised Platform (Glossy reflective marble)
      const platformGeo = new THREE.CylinderGeometry(10.8, 10.9, 0.35, 52);
      const platformMesh = new THREE.Mesh(platformGeo, this.mat.reflectiveMarble);
      platformMesh.position.y = 0.625;
      platformMesh.receiveShadow = true;
      stageGroup.add(platformMesh);

      // Upper Stage Gold Inlay Ring
      const ringGeo = new THREE.RingGeometry(8.2, 8.35, 48);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, this.mat.champagneGold);
      ringMesh.position.y = 0.805;
      stageGroup.add(ringMesh);

      // Ceremonial Royal Carpet Runner
      const carpetGeo = new THREE.PlaneGeometry(5.8, 9.4);
      carpetGeo.rotateX(-Math.PI / 2);
      const carpetMesh = new THREE.Mesh(carpetGeo, this.mat.ceremonialCarpet);
      carpetMesh.position.set(0, 0.81, 1.2);
      carpetMesh.receiveShadow = true;
      stageGroup.add(carpetMesh);

      // Front Grand Steps (3 curved tiers leading down)
      for (let i = 0; i < 3; i++) {
        const stepRadius = 11.2 - i * 0.45;
        const stepHeight = 0.16;
        const stepGeo = new THREE.CylinderGeometry(stepRadius, stepRadius + 0.15, stepHeight, 32, 1, false, Math.PI * 0.28, Math.PI * 0.44);
        const stepMesh = new THREE.Mesh(stepGeo, this.mat.pureWhite);
        stepMesh.position.set(0, (2 - i) * stepHeight + 0.08, 0);
        stageGroup.add(stepMesh);

        // Luminous warm LED edge strip under each step
        const stripGeo = new THREE.TorusGeometry(stepRadius + 0.05, 0.025, 8, 32, Math.PI * 0.44);
        stripGeo.rotateX(Math.PI / 2);
        stripGeo.rotateZ(Math.PI * 0.28);
        const stripMesh = new THREE.Mesh(stripGeo, this.mat.brightGold);
        stripMesh.position.set(0, (2 - i) * stepHeight + 0.16, 0);
        stageGroup.add(stripMesh);
      }

      this.rootGroup.add(stageGroup);
    }

    /**
     * 2. Glowing jaali arch fascia along the stage front
     * Directly inspired by the reference photo: luminous curved panels lining the base
     */
    buildGlowingJaaliArchSkirt() {
      const skirtGroup = new THREE.Group();
      const numArches = 10;
      const radius = 10.9;
      const startAngle = Math.PI * 0.18;
      const totalAngle = Math.PI * 0.64;

      for (let i = 0; i < numArches; i++) {
        const angle = startAngle + (i / (numArches - 1)) * totalAngle;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const panelGeo = new THREE.PlaneGeometry(1.6, 0.65);
        const panelMesh = new THREE.Mesh(panelGeo, this.mat.luminousJaali);
        panelMesh.position.set(x, 0.45, z);
        panelMesh.rotation.y = -angle + Math.PI / 2;
        skirtGroup.add(panelMesh);
        this.emissiveMeshes.push(panelMesh);

        // Gold arched frame molding
        const frameGeo = new THREE.TorusGeometry(0.8, 0.035, 8, 24, Math.PI);
        const frameMesh = new THREE.Mesh(frameGeo, this.mat.brightGold);
        frameMesh.position.set(x, 0.45, z);
        frameMesh.rotation.y = -angle + Math.PI / 2;
        skirtGroup.add(frameMesh);
      }

      this.rootGroup.add(skirtGroup);
    }

    /**
     * 3. Colonnade of 8 monumental carved architectural pillars
     */
    buildColonnadePillars() {
      const colonnadeGroup = new THREE.Group();
      this.pillarCount = 8;
      this.pillarRadius = 7.0;

      // Positions around the stage offset by Math.PI / 8 to create wide symmetrical front entrance arch
      const angularOffset = Math.PI / this.pillarCount;
      for (let i = 0; i < this.pillarCount; i++) {
        const theta = (i / this.pillarCount) * Math.PI * 2 + angularOffset;
        const px = Math.cos(theta) * this.pillarRadius;
        const pz = Math.sin(theta) * this.pillarRadius;

        const pillar = this.createSinglePillar();
        pillar.position.set(px, 0.8, pz);
        pillar.rotation.y = -theta + Math.PI / 2;
        colonnadeGroup.add(pillar);
      }

      this.rootGroup.add(colonnadeGroup);
    }

    createSinglePillar() {
      const pGroup = new THREE.Group();

      // Plinth Base (Octagonal stepped pedestal)
      const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.35, 8), this.mat.champagneGold);
      base1.position.y = 0.175;
      pGroup.add(base1);

      const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.68, 0.4, 8), this.mat.carvedIvory);
      base2.position.y = 0.55;
      pGroup.add(base2);

      // Fluted Ivory Pillar Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.36, 0.42, 4.0, 24);
      const shaft = new THREE.Mesh(shaftGeo, this.mat.carvedIvory);
      shaft.position.y = 2.75;
      shaft.castShadow = true;
      pGroup.add(shaft);

      // Champagne Gold Accent Rings (Molding Collars)
      const ringHeights = [1.2, 2.5, 3.8];
      ringHeights.forEach(h => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 12, 24), this.mat.brightGold);
        ring.rotateX(Math.PI / 2);
        ring.position.y = h;
        pGroup.add(ring);
      });

      // Capital (Ornate Lotus Bracket Capital)
      const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.36, 0.3, 16), this.mat.champagneGold);
      cap1.position.y = 4.9;
      pGroup.add(cap1);

      const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.55, 0.35, 8), this.mat.brightGold);
      cap2.position.y = 5.2;
      pGroup.add(cap2);

      // Embedded Capital Light Beacon
      const beaconGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const beaconMesh = new THREE.Mesh(beaconGeo, this.mat.brightGold);
      beaconMesh.position.y = 5.35;
      pGroup.add(beaconMesh);
      this.emissiveMeshes.push(beaconMesh);

      return pGroup;
    }

    /**
     * 4. Grand Canopy with curved structural ribs & golden filigree lattice
     * Inspired by 04_Wedding_Lawn_Canopy_Enhanced.png
     */
    buildCanopyAndVaultedDome() {
      const canopyGroup = new THREE.Group();
      const angularOffset = Math.PI / this.pillarCount;

      // Lower Architrave Ring connecting all 8 pillars
      const architraveGeo = new THREE.TorusGeometry(this.pillarRadius, 0.16, 16, 52);
      architraveGeo.rotateX(Math.PI / 2);
      const architraveMesh = new THREE.Mesh(architraveGeo, this.mat.champagneGold);
      architraveMesh.position.y = 6.18;
      canopyGroup.add(architraveMesh);

      // Outer Scalloped Mughal Arch Trim between pillars
      for (let i = 0; i < this.pillarCount; i++) {
        const a1 = (i / this.pillarCount) * Math.PI * 2 + angularOffset;
        const a2 = ((i + 1) / this.pillarCount) * Math.PI * 2 + angularOffset;
        const midA = (a1 + a2) / 2;

        const chordDist = 2 * this.pillarRadius * Math.sin(Math.PI / this.pillarCount);
        const archCurveGeo = new THREE.TorusGeometry(chordDist * 0.52, 0.06, 12, 32, Math.PI);
        const archMesh = new THREE.Mesh(archCurveGeo, this.mat.brightGold);

        const mx = Math.cos(midA) * (this.pillarRadius * Math.cos(Math.PI / this.pillarCount));
        const mz = Math.sin(midA) * (this.pillarRadius * Math.cos(Math.PI / this.pillarCount));
        archMesh.position.set(mx, 6.18, mz);
        archMesh.rotation.y = -midA + Math.PI / 2;
        canopyGroup.add(archMesh);
      }

      // Vaulted Curved Ribs (16 golden structural ribs curving inward to the central crown)
      const numRibs = 16;
      for (let r = 0; r < numRibs; r++) {
        const angle = (r / numRibs) * Math.PI * 2 + angularOffset;
        const startX = Math.cos(angle) * this.pillarRadius;
        const startZ = Math.sin(angle) * this.pillarRadius;

        const midX = Math.cos(angle) * (this.pillarRadius * 0.58);
        const midZ = Math.sin(angle) * (this.pillarRadius * 0.58);

        const endX = Math.cos(angle) * 1.8;
        const endZ = Math.sin(angle) * 1.8;

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(startX, 6.18, startZ),
          new THREE.Vector3(midX, 7.35, midZ),
          new THREE.Vector3(endX, 8.1, endZ)
        ]);

        const ribGeo = new THREE.TubeGeometry(curve, 28, 0.055, 8, false);
        const ribMesh = new THREE.Mesh(ribGeo, this.mat.champagneGold);
        canopyGroup.add(ribMesh);
      }

      // 3 Concentric Circular Golden Lattice Rings spanning across the ribs
      const ringsConfig = [
        { r: 5.6, y: 6.75 },
        { r: 4.1, y: 7.35 },
        { r: 2.6, y: 7.82 }
      ];

      ringsConfig.forEach(cfg => {
        const ringGeo = new THREE.TorusGeometry(cfg.r, 0.045, 12, 48);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, this.mat.brightGold);
        ringMesh.position.y = cfg.y;
        canopyGroup.add(ringMesh);
      });

      // High Apex Gold-Leaf Ceiling Cupola (Elegantly rests above chandelier at dome apex)
      const cupolaGeo = new THREE.SphereGeometry(2.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const cupolaMesh = new THREE.Mesh(cupolaGeo, this.mat.brightGold);
      cupolaMesh.position.y = 8.1;
      canopyGroup.add(cupolaMesh);

      this.rootGroup.add(canopyGroup);
    }

    /**
     * 5. Crown Shikhara & Golden Kalash Finial
     */
    buildCrownShikhara() {
      const crownGroup = new THREE.Group();

      // Octagonal Crown Drum
      const drumGeo = new THREE.CylinderGeometry(1.85, 2.0, 0.45, 8);
      const drumMesh = new THREE.Mesh(drumGeo, this.mat.champagneGold);
      drumMesh.position.y = 8.25;
      crownGroup.add(drumMesh);

      // Tiered Golden Dome (Kalash base)
      const domeGeo = new THREE.SphereGeometry(1.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const domeMesh = new THREE.Mesh(domeGeo, this.mat.brightGold);
      domeMesh.position.y = 8.45;
      crownGroup.add(domeMesh);

      // Stepped Tier Rings
      for (let s = 0; s < 3; s++) {
        const stepR = 1.3 - s * 0.35;
        const stepMesh = new THREE.Mesh(new THREE.CylinderGeometry(stepR - 0.1, stepR, 0.16, 16), this.mat.champagneGold);
        stepMesh.position.y = 9.45 + s * 0.22;
        crownGroup.add(stepMesh);
      }

      // Golden Apex Finial (Kalash)
      const finialGeo = new THREE.ConeGeometry(0.28, 1.1, 16);
      const finialMesh = new THREE.Mesh(finialGeo, this.mat.brightGold);
      finialMesh.position.y = 10.55;
      crownGroup.add(finialMesh);

      // Gilded Sphere Crown
      const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), this.mat.brightGold);
      sphereMesh.position.y = 11.18;
      crownGroup.add(sphereMesh);

      this.rootGroup.add(crownGroup);
    }

    /**
     * 6. Royal Crimson & Gold Silk Drapes
     */
    buildSilkValancesAndDrapes() {
      const drapesGroup = new THREE.Group();
      const angularOffset = Math.PI / this.pillarCount;

      // Scalloped velvet valances hanging between each pair of pillars
      for (let i = 0; i < this.pillarCount; i++) {
        const a1 = (i / this.pillarCount) * Math.PI * 2 + angularOffset;
        const a2 = ((i + 1) / this.pillarCount) * Math.PI * 2 + angularOffset;
        const midA = (a1 + a2) / 2;

        const chordDist = 2 * this.pillarRadius * Math.sin(Math.PI / this.pillarCount);

        // Curved velvet swag
        const swagGeo = new THREE.TorusGeometry(chordDist * 0.48, 0.14, 12, 28, Math.PI * 0.88);
        swagGeo.rotateX(Math.PI);
        const swagMesh = new THREE.Mesh(swagGeo, this.mat.royalVelvet);

        const mx = Math.cos(midA) * (this.pillarRadius * Math.cos(Math.PI / this.pillarCount));
        const mz = Math.sin(midA) * (this.pillarRadius * Math.cos(Math.PI / this.pillarCount));
        swagMesh.position.set(mx, 6.0, mz);
        swagMesh.rotation.y = -midA + Math.PI / 2;
        drapesGroup.add(swagMesh);

        // Gold fringe trimming on valance
        const fringeGeo = new THREE.TorusGeometry(chordDist * 0.48, 0.03, 8, 28, Math.PI * 0.88);
        fringeGeo.rotateX(Math.PI);
        const fringeMesh = new THREE.Mesh(fringeGeo, this.mat.brightGold);
        fringeMesh.position.set(mx, 5.92, mz);
        fringeMesh.rotation.y = -midA + Math.PI / 2;
        drapesGroup.add(fringeMesh);
      }

      // Elegant Side Curtains gathered at flanking pillars
      const sideAngles = [
        Math.PI * 0.25 + angularOffset,
        Math.PI * 0.75 + angularOffset,
        Math.PI * 1.25 + angularOffset,
        Math.PI * 1.75 + angularOffset
      ];
      sideAngles.forEach(sa => {
        const cx = Math.cos(sa) * (this.pillarRadius - 0.25);
        const cz = Math.sin(sa) * (this.pillarRadius - 0.25);

        const drapeGeo = new THREE.CylinderGeometry(0.18, 0.42, 3.8, 12);
        const drapeMesh = new THREE.Mesh(drapeGeo, this.mat.royalVelvet);
        drapeMesh.position.set(cx, 3.1, cz);
        drapesGroup.add(drapeMesh);

        // Gold cord tie-back
        const cordMesh = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 8, 16), this.mat.brightGold);
        cordMesh.rotateX(Math.PI / 2);
        cordMesh.position.set(cx, 2.9, cz);
        drapesGroup.add(cordMesh);
      });

      this.rootGroup.add(drapesGroup);
    }

    /**
     * 7. Extravagant Wedding Floral Garlands (Canopy Cornice & Pillar Wraps)
     */
    buildGrandFloralGarlands() {
      const floralGroup = new THREE.Group();
      const numFloralClusters = 56;

      // Dense perimeter garland around the canopy cornice
      for (let i = 0; i < numFloralClusters; i++) {
        const theta = (i / numFloralClusters) * Math.PI * 2;
        const fx = Math.cos(theta) * (this.pillarRadius + 0.12);
        const fz = Math.sin(theta) * (this.pillarRadius + 0.12);
        const fy = 6.18 + (Math.sin(i * 1.5) * 0.08);

        // Alternate red roses, marigolds, and white jasmine blossoms
        const flowerType = i % 4;
        let flowerMat = this.mat.roseRed;
        if (flowerType === 1) flowerMat = this.mat.marigoldOrange;
        else if (flowerType === 2) flowerMat = this.mat.marigoldYellow;
        else if (flowerType === 3) flowerMat = this.mat.jasmineWhite;

        const blossomGeo = new THREE.SphereGeometry(0.14 + (Math.random() * 0.06), 8, 8);
        const blossom = new THREE.Mesh(blossomGeo, flowerMat);
        blossom.position.set(fx, fy, fz);
        floralGroup.add(blossom);

        // Green foliage leaves
        if (i % 2 === 0) {
          const leafGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
          const leaf = new THREE.Mesh(leafGeo, this.mat.eucalyptusGreen);
          leaf.position.set(fx * 0.98, fy - 0.12, fz * 0.98);
          leaf.rotation.x = Math.PI;
          floralGroup.add(leaf);
        }
      }

      // Mid-pillar floral clusters on each pillar
      const angularOffset = Math.PI / this.pillarCount;
      for (let p = 0; p < this.pillarCount; p++) {
        const pTheta = (p / this.pillarCount) * Math.PI * 2 + angularOffset;
        const px = Math.cos(pTheta) * this.pillarRadius;
        const pz = Math.sin(pTheta) * this.pillarRadius;

        for (let b = 0; b < 6; b++) {
          const bAngle = (b / 6) * Math.PI * 2;
          const bx = px + Math.cos(bAngle) * 0.46;
          const bz = pz + Math.sin(bAngle) * 0.46;
          const flowerMat = b % 2 === 0 ? this.mat.roseRed : this.mat.marigoldOrange;

          const clusterBloom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), flowerMat);
          clusterBloom.position.set(bx, 2.75 + (b % 2) * 0.15, bz);
          floralGroup.add(clusterBloom);
        }
      }

      this.rootGroup.add(floralGroup);
    }

    /**
     * 8. Cascading Vertical Jasmine & Marigold Hanging Garlands (Ladi Strings)
     * Suspended around the central ceremonial space
     */
    buildCascadingHangingFlowers() {
      const hangingGroup = new THREE.Group();
      const numStrings = 24;
      const stringRadius = 3.6;

      for (let s = 0; s < numStrings; s++) {
        const theta = (s / numStrings) * Math.PI * 2;
        const sx = Math.cos(theta) * stringRadius;
        const sz = Math.sin(theta) * stringRadius;
        const stringLen = 2.4 + (Math.sin(s * 2.2) * 0.6); // varied natural lengths

        const strandGroup = new THREE.Group();
        strandGroup.position.set(sx, 7.3, sz);

        const beadsCount = Math.floor(stringLen / 0.14);
        for (let b = 0; b < beadsCount; b++) {
          const by = -b * 0.14;
          const isJasmine = (b % 3 !== 0);
          const mat = isJasmine ? this.mat.jasmineWhite : this.mat.marigoldOrange;
          const beadGeo = new THREE.SphereGeometry(isJasmine ? 0.05 : 0.075, 6, 6);
          const bead = new THREE.Mesh(beadGeo, mat);
          bead.position.y = by;
          strandGroup.add(bead);
        }

        hangingGroup.add(strandGroup);
        this.hangingFlorals.push({
          group: strandGroup,
          baseX: sx,
          baseZ: sz,
          phase: Math.random() * Math.PI * 2,
          speed: 1.2 + Math.random() * 0.8
        });
      }

      this.rootGroup.add(hangingGroup);
    }

    /**
     * 9. Multi-tier Grand Crystal Waterfall Chandelier
     * Suspended directly from the central dome apex
     */
    buildMultiTierCrystalChandelier() {
      this.chandelierGroup = new THREE.Group();
      this.chandelierGroup.position.set(0, 7.4, 0);

      // Central Suspension Chain & Gold Rose Plate
      const roseGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 16);
      const roseMesh = new THREE.Mesh(roseGeo, this.mat.brightGold);
      this.chandelierGroup.add(roseMesh);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
      const stemMesh = new THREE.Mesh(stemGeo, this.mat.brightGold);
      stemMesh.position.y = -1.1;
      this.chandelierGroup.add(stemMesh);

      // 3 Concentric Crystal Rings (Waterfall tiers)
      const tiers = [
        { radius: 1.25, y: -0.65, count: 28, prismLen: 0.55 },
        { radius: 0.82, y: -1.25, count: 20, prismLen: 0.65 },
        { radius: 0.42, y: -1.85, count: 12, prismLen: 0.75 }
      ];

      tiers.forEach(t => {
        // Gold Mounting Ring
        const ringGeo = new THREE.TorusGeometry(t.radius, 0.035, 8, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, this.mat.brightGold);
        ringMesh.position.y = t.y;
        this.chandelierGroup.add(ringMesh);

        // Hanging Crystal Prisms
        for (let c = 0; c < t.count; c++) {
          const a = (c / t.count) * Math.PI * 2;
          const cx = Math.cos(a) * t.radius;
          const cz = Math.sin(a) * t.radius;

          const prismGeo = new THREE.CylinderGeometry(0.032, 0.015, t.prismLen, 6);
          const prism = new THREE.Mesh(prismGeo, this.mat.crystal);
          prism.position.set(cx, t.y - t.prismLen * 0.5, cz);
          this.chandelierGroup.add(prism);
        }
      });

      // Bottom Central Crystal Pendant Finial
      const pendantGeo = new THREE.OctahedronGeometry(0.18, 1);
      const pendant = new THREE.Mesh(pendantGeo, this.mat.crystal);
      pendant.position.y = -2.85;
      this.chandelierGroup.add(pendant);

      this.rootGroup.add(this.chandelierGroup);
    }

    /**
     * 10. Ceremonial Royal Wedding Seating & Sacred Havan Kund
     */
    buildCeremonialRoyalSeating() {
      const seatingGroup = new THREE.Group();
      seatingGroup.position.set(0, 0.81, 0.4);

      // Pair of Royal Thrones for Bride & Groom
      const chairSpacing = 1.05;
      [-chairSpacing / 2, chairSpacing / 2].forEach(offsetX => {
        const chair = this.createRoyalThrone();
        chair.position.set(offsetX, 0, -0.6);
        seatingGroup.add(chair);
      });

      // Sacred Havan Kund (Fire Altar in front of the couple)
      const kundGroup = new THREE.Group();
      kundGroup.position.set(0, 0, 1.4);

      // 3 Stepped Brass Tiers
      for (let k = 0; k < 3; k++) {
        const kw = 1.2 - k * 0.22;
        const kh = 0.12;
        const kMesh = new THREE.Mesh(new THREE.BoxGeometry(kw, kh, kw), this.mat.champagneGold);
        kMesh.position.y = k * kh + kh / 2;
        kundGroup.add(kMesh);
      }

      // Glowing Sacred Embers
      const emberMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), this.mat.sacredEmbers);
      emberMesh.position.y = 0.38;
      kundGroup.add(emberMesh);
      this.emissiveMeshes.push(emberMesh);

      // Ceremonial Brass Thalis with Petals
      const thaliGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.03, 16);
      const thali1 = new THREE.Mesh(thaliGeo, this.mat.brightGold);
      thali1.position.set(0.9, 0.05, 1.35);
      kundGroup.add(thali1);

      const petalMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 12), this.mat.roseRed);
      petalMesh.position.set(0.9, 0.08, 1.35);
      kundGroup.add(petalMesh);

      // Silk Bolster Cushions (Gaddi / Masand)
      [-1.8, 1.8].forEach(bx => {
        const bolsterGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.1, 16);
        bolsterGeo.rotateZ(Math.PI / 2);
        const bolster = new THREE.Mesh(bolsterGeo, this.mat.royalVelvet);
        bolster.position.set(bx, 0.22, -0.4);
        seatingGroup.add(bolster);
      });

      seatingGroup.add(kundGroup);
      this.rootGroup.add(seatingGroup);
    }

    createRoyalThrone() {
      const throne = new THREE.Group();

      // Carved Gold Legs
      const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.45, 8);
      const legCoords = [[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]];
      legCoords.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, this.mat.brightGold);
        leg.position.set(lx, 0.225, lz);
        throne.add(leg);
      });

      // Velvet Padded Seat Cushion
      const seatGeo = new THREE.BoxGeometry(0.9, 0.16, 0.85);
      const seat = new THREE.Mesh(seatGeo, this.mat.royalVelvet);
      seat.position.y = 0.52;
      throne.add(seat);

      // Carved Gold Seat Frame Trim
      const trimGeo = new THREE.BoxGeometry(0.94, 0.06, 0.89);
      const trim = new THREE.Mesh(trimGeo, this.mat.brightGold);
      trim.position.y = 0.43;
      throne.add(trim);

      // Royal High Arched Backrest
      const backGeo = new THREE.BoxGeometry(0.85, 1.1, 0.12);
      const back = new THREE.Mesh(backGeo, this.mat.royalVelvet);
      back.position.set(0, 1.15, -0.38);
      throne.add(back);

      // Ornate Gold Crown Cresting on Backrest
      const crestGeo = new THREE.TorusGeometry(0.42, 0.06, 8, 16, Math.PI);
      const crest = new THREE.Mesh(crestGeo, this.mat.brightGold);
      crest.position.set(0, 1.7, -0.38);
      throne.add(crest);

      // Curved Gold Armrests
      [-0.46, 0.46].forEach(ax => {
        const armGeo = new THREE.BoxGeometry(0.08, 0.28, 0.7);
        const arm = new THREE.Mesh(armGeo, this.mat.brightGold);
        arm.position.set(ax, 0.74, 0);
        throne.add(arm);
      });

      return throne;
    }

    /**
     * 11. Atmospheric Firefly Particles (Floating warm embers/fairy lights)
     */
    buildAtmosphericFireflyParticles() {
      const particleCount = 180;
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Dispersed in a wide dome cylinder around the mandap
        const rad = 2.0 + Math.random() * 11.0;
        const ang = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(ang) * rad;
        positions[i * 3 + 1] = 0.8 + Math.random() * 8.5;
        positions[i * 3 + 2] = Math.sin(ang) * rad;
        scales[i] = 0.4 + Math.random() * 0.8;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Golden glowing sprite material
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 235, 175, 1)');
      grad.addColorStop(0.35, 'rgba(255, 185, 80, 0.75)');
      grad.addColorStop(0.8, 'rgba(255, 140, 20, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const pTexture = new THREE.CanvasTexture(canvas);

      const pMat = new THREE.PointsMaterial({
        size: 0.35,
        map: pTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffd180
      });

      this.floatingEmbers = new THREE.Points(pGeo, pMat);
      this.rootGroup.add(this.floatingEmbers);
    }

    /**
     * Animation frame hook for gentle swaying of hanging florals & particle drift
     */
    update(time) {
      // Gentle natural swaying of floral tassels
      if (this.hangingFlorals) {
        this.hangingFlorals.forEach(h => {
          const sway = Math.sin(time * h.speed + h.phase) * 0.05;
          h.group.rotation.z = sway;
          h.group.rotation.x = Math.cos(time * (h.speed * 0.8) + h.phase) * 0.035;
        });
      }

      // Floating fairy lights subtle oscillation
      if (this.floatingEmbers) {
        const positions = this.floatingEmbers.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 1.5 + positions[i]) * 0.003;
          if (positions[i + 1] > 9.5) positions[i + 1] = 1.0;
        }
        this.floatingEmbers.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  /* =========================================================================
   * 3. MANDAP LIGHTING CONTROLLER
   * Smooth Cinematic Transition: Daylight -> Golden Hour -> Radiant Night Wedding
   * ========================================================================= */
  class MandapLighting {
    constructor(scene) {
      this.scene = scene;
      this.lights = {};
      this.currentMode = 'night';
      this.setupLights();
    }

    setupLights() {
      // 1. Directional Key Light (Simulates sun / warm moonlight)
      this.lights.sun = new THREE.DirectionalLight(0xfff6ea, 1.4);
      this.lights.sun.position.set(16, 24, 14);
      this.lights.sun.castShadow = true;
      this.lights.sun.shadow.mapSize.width = 1024;
      this.lights.sun.shadow.mapSize.height = 1024;
      this.lights.sun.shadow.bias = -0.0005;
      this.scene.add(this.lights.sun);

      // 2. Ambient Sky Fill
      this.lights.ambient = new THREE.AmbientLight(0xf2ece4, 0.85);
      this.scene.add(this.lights.ambient);

      // 3. Golden Rim Accent Light
      this.lights.rim = new THREE.DirectionalLight(0xffb866, 0.7);
      this.lights.rim.position.set(-18, 16, -14);
      this.scene.add(this.lights.rim);

      // 4. Central Crystal Chandelier Warm Point Light
      this.lights.chandelier = new THREE.PointLight(0xffc866, 2.2, 18, 1.6);
      this.lights.chandelier.position.set(0, 5.8, 0);
      this.scene.add(this.lights.chandelier);

      // 5. Ceremonial Sacred Altar Warm Glow
      this.lights.altar = new THREE.PointLight(0xff7722, 1.4, 8, 1.8);
      this.lights.altar.position.set(0, 1.4, 1.8);
      this.scene.add(this.lights.altar);

      // 6. Colonnade Uplights (Warm golden beams radiating up pillars)
      this.lights.uplights = [];
      const uplightCount = 4;
      for (let u = 0; u < uplightCount; u++) {
        const uAngle = (u / uplightCount) * Math.PI * 2 + Math.PI / 4;
        const ux = Math.cos(uAngle) * 6.6;
        const uz = Math.sin(uAngle) * 6.6;

        const uplight = new THREE.PointLight(0xffa834, 1.2, 9, 2);
        uplight.position.set(ux, 1.2, uz);
        this.scene.add(uplight);
        this.lights.uplights.push(uplight);
      }
    }

    /**
     * Smoothly blend lighting parameters based on scroll progress (0.0 to 1.0)
     * 0.0 - 0.35: Soft Daylight
     * 0.35 - 0.7: Warm Golden Hour
     * 0.7 - 1.0: Luxurious Evening Wedding (Night)
     */
    applyScrollLighting(progress) {
      progress = Math.max(0, Math.min(1, progress));

      let sunColor, ambientColor, rimColor, chandelierIntensity, uplightIntensity;

      if (progress < 0.45) {
        // Daylight phase (0.0 to 0.45)
        const t = progress / 0.45;
        sunColor = new THREE.Color(0xfff6ea).lerp(new THREE.Color(0xffaa44), t * 0.7);
        ambientColor = new THREE.Color(0xf2ece4).lerp(new THREE.Color(0xf5d2a8), t);
        rimColor = new THREE.Color(0xffeedd).lerp(new THREE.Color(0xff9933), t);
        this.lights.sun.intensity = 1.4 - t * 0.35;
        this.lights.ambient.intensity = 0.85 - t * 0.25;
        this.lights.rim.intensity = 0.6 + t * 0.6;
        chandelierIntensity = 0.4 + t * 0.6;
        uplightIntensity = 0.3 + t * 0.7;
      } else {
        // Golden Hour to Starlight Wedding Night phase (0.45 to 1.0)
        const t = (progress - 0.45) / 0.55;
        sunColor = new THREE.Color(0xffaa44).lerp(new THREE.Color(0x7c9bc2), t);
        ambientColor = new THREE.Color(0xf5d2a8).lerp(new THREE.Color(0x131d18), t);
        rimColor = new THREE.Color(0xff9933).lerp(new THREE.Color(0xffaa44), t);
        this.lights.sun.intensity = 1.05 - t * 0.65;
        this.lights.ambient.intensity = 0.6 - t * 0.28;
        this.lights.rim.intensity = 1.2 - t * 0.35;
        chandelierIntensity = 1.0 + t * 1.4;
        uplightIntensity = 1.0 + t * 0.6;
      }

      this.lights.sun.color.copy(sunColor);
      this.lights.ambient.color.copy(ambientColor);
      this.lights.rim.color.copy(rimColor);
      this.lights.chandelier.intensity = chandelierIntensity;
      this.lights.altar.intensity = 0.8 + progress * 0.8;

      this.lights.uplights.forEach(ul => {
        ul.intensity = uplightIntensity;
      });
    }

    /**
     * Direct toggle between presets: 'day', 'golden', 'night'
     */
    setPreset(modeName, duration = 1.2) {
      if (typeof gsap === 'undefined') return;
      this.currentMode = modeName;

      let targetProgress = 1.0;
      if (modeName === 'day') targetProgress = 0.0;
      else if (modeName === 'golden') targetProgress = 0.5;
      else if (modeName === 'night') targetProgress = 1.0;

      const obj = { p: this.lastProgress || 1.0 };
      gsap.to(obj, {
        p: targetProgress,
        duration: duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.applyScrollLighting(obj.p);
          this.lastProgress = obj.p;
        }
      });
    }
  }

  /* =========================================================================
   * 4. MANDAP CAMERA CONTROLLER
   * Elevated 3/4 perspective, cinematic entry glide & smooth cursor parallax
   * ========================================================================= */
  class MandapCamera {
    constructor(container) {
      this.container = container;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || 650;

      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 400);

      // Base framing coordinates (architectural visualization composition)
      this.basePos = { x: 5.5, y: 5.4, z: 25.0 };
      this.targetPos = { x: 0, y: 4.4, z: 0 };

      this.camera.position.set(this.basePos.x, this.basePos.y, this.basePos.z);
      this.camera.lookAt(this.targetPos.x, this.targetPos.y, this.targetPos.z);

      // Smooth parallax offsets
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    }

    updateAspect() {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || 650;
      this.camera.aspect = width / height;

      // Adjust distance on mobile viewports so mandap stays fully framed
      if (width < 768) {
        this.basePos.z = 29.5;
        this.basePos.y = 5.8;
      } else if (width < 1024) {
        this.basePos.z = 27.0;
        this.basePos.y = 5.6;
      } else {
        this.basePos.z = 25.0;
        this.basePos.y = 5.4;
      }

      this.camera.updateProjectionMatrix();
    }

    /**
     * Interpolates camera closer and at a more intimate eye-level as user scrolls
     */
    applyScrollCamera(progress, mandapRoot) {
      progress = Math.max(0, Math.min(1, progress));

      // Camera slowly glides forward and slightly orbits
      const currentZ = this.basePos.z - progress * 5.2;
      const currentY = this.basePos.y - progress * 1.1;
      const currentX = this.basePos.x - progress * 2.8;

      this.currentBaseX = currentX;
      this.currentBaseY = currentY;
      this.currentBaseZ = currentZ;

      // Mandap root performs a very slow, elegant rotation (no excessive spinning)
      if (mandapRoot) {
        mandapRoot.rotation.y = -0.15 + progress * 0.28;
      }
    }

    updateParallax() {
      // Damped lerp for silky smooth cursor reaction
      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

      const baseX = this.currentBaseX !== undefined ? this.currentBaseX : this.basePos.x;
      const baseY = this.currentBaseY !== undefined ? this.currentBaseY : this.basePos.y;
      const baseZ = this.currentBaseZ !== undefined ? this.currentBaseZ : this.basePos.z;

      this.camera.position.x = baseX + this.parallax.x;
      this.camera.position.y = baseY + this.parallax.y;
      this.camera.position.z = baseZ;

      this.camera.lookAt(this.targetPos.x, this.targetPos.y, this.targetPos.z);
    }
  }

  /* =========================================================================
   * 5. MANDAP INTERACTION CONTROLLER
   * Desktop mouse tracking & touch handling that never locks normal page scroll
   * ========================================================================= */
  class MandapInteraction {
    constructor(container, cameraRig) {
      this.container = container;
      this.cameraRig = cameraRig;
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      this.initEvents();
    }

    initEvents() {
      if (!this.isTouch) {
        // Desktop gentle cursor parallax (max 1.4m range)
        window.addEventListener('mousemove', (e) => {
          const normX = (e.clientX / window.innerWidth) * 2 - 1;
          const normY = -(e.clientY / window.innerHeight) * 2 + 1;

          this.cameraRig.parallax.targetX = normX * 1.35;
          this.cameraRig.parallax.targetY = normY * 0.75;
        }, { passive: true });
      } else {
        // Mobile touch subtle gentle tilt with passive touch listener
        let startX = 0;
        this.container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) startX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
          if (e.touches.length === 1) {
            const diffX = e.touches[0].clientX - startX;
            this.cameraRig.parallax.targetX = Math.max(-0.6, Math.min(0.6, diffX * 0.005));
          }
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
          this.cameraRig.parallax.targetX = 0;
        }, { passive: true });
      }
    }
  }

  /* =========================================================================
   * 6. REAL MOMENTS GALLERY CONTROLLER
   * Modal Lightbox showcasing authentic project wedding photographs
   * ========================================================================= */
  class RealMomentsGallery {
    constructor() {
      // 100% authentic local photographs from Ramayan Farm
      this.moments = [
        {
          src: 'assets/hero section frame images/Golden Indian Wedding Mandap at Night.png',
          title: 'The Signature Royal Wedding Mandap',
          tag: 'CENTRAL WEDDING LAWN',
          desc: 'Our iconic permanent architectural mandap illuminated with gold domes, crystal waterfall chandeliers, and starlit royal floral ceilings.'
        },
        {
          src: 'assets/farm-map/dining-area/04_Wedding_Lawn_Canopy_Enhanced.png',
          title: 'The Grand Curved Floral Canopy',
          tag: 'BANQUET LAWN & CANOPY',
          desc: 'Bespoke curved golden pavilion framework with cascading blossoms, candlelit banquet seating, and panoramic wedding dining views.'
        },
        {
          src: 'assets/farm-map/sangeet-ground/02_Sangeet_Main_Stage_Enhanced.png',
          title: 'Sangeet Ground Concert Arena & Main Stage',
          tag: 'SANGEET ARENA',
          desc: 'High-octane concert staging equipped with moving head light rigs, acoustic amphitheater lawns, and waterfront reflection views.'
        },
        {
          src: 'assets/farm-map/sangeet-ground/03_Sangeet_Aerial_Overview_Enhanced.png',
          title: 'Celebration Plaza & Illuminated Water Features',
          tag: 'CELEBRATION DECK',
          desc: 'Sprawling outdoor promenade connecting illuminated fountains, royal gazebos, and grand guest arrival pathways.'
        },
        {
          src: 'assets/farm-map/main-venue/01_Hero_Palace_Entrance_Enhanced.jpg',
          title: 'Palatial Courtyard & Grand Arrival Portico',
          tag: 'HERITAGE PALACE',
          desc: 'Sandstone heritage facade with carved chhatris and illuminated red carpet entrance designed for unforgettable baraat receptions.'
        },
        {
          src: 'assets/farm-map/aerial/05_Venue_Aerial_Night_Enhanced.png',
          title: '14-Acre Estate Aerial Illumination at Night',
          tag: 'FULL ESTATE BUYOUT',
          desc: 'Gujarat\'s premier private destination wedding sanctuary, secluded in lush nature with full perimeter lighting.'
        },
        {
          src: 'assets/farm-map/aerial/06_Venue_Aerial_Wide_Enhanced.png',
          title: 'Panoramic Grounds & Manicured Lawns',
          tag: 'ESTATE OVERVIEW',
          desc: 'Expansive private lawns, botanical palm avenues, and dedicated valet parking infrastructure for over 1,000 guest vehicles.'
        }
      ];

      this.currentIndex = 0;
      this.modal = document.getElementById('lightbox-modal');
      this.img = document.getElementById('lightbox-img');
      this.caption = document.getElementById('lightbox-caption');
      this.prevBtn = document.getElementById('lightbox-prev');
      this.nextBtn = document.getElementById('lightbox-next');
      this.closeBtn = document.getElementById('lightbox-close');

      this.initEvents();
    }

    initEvents() {
      // Connect existing lightbox controls if present
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.prev();
        });
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.next();
        });
      }
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (!this.modal || !this.modal.classList.contains('open')) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    open(index = 0) {
      if (!this.modal) return;
      this.currentIndex = (index + this.moments.length) % this.moments.length;
      this.render();
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    close() {
      if (!this.modal) return;
      this.modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.moments.length;
      this.render();
    }

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.moments.length) % this.moments.length;
      this.render();
    }

    render() {
      const item = this.moments[this.currentIndex];
      if (!item) return;

      if (this.img) {
        this.img.style.opacity = '0';
        this.img.src = item.src;
        this.img.onload = () => {
          this.img.style.opacity = '1';
        };
      }

      if (this.caption) {
        this.caption.innerHTML = `
          <div style="font-size:0.75rem; letter-spacing:0.14em; color:var(--color-warm-gold,#c99a52); text-transform:uppercase; margin-bottom:0.25rem;">${item.tag} • ${this.currentIndex + 1} of ${this.moments.length}</div>
          <div style="font-family:var(--font-serif,'Cormorant Garamond',serif); font-size:1.55rem; color:#fff; line-height:1.2; margin-bottom:0.4rem;">${item.title}</div>
          <div style="font-size:0.9rem; color:#d1ccc4; line-height:1.5;">${item.desc}</div>
        `;
      }
    }
  }

  /* =========================================================================
   * 7. SIGNATURE MANDAP 3D ORCHESTRATOR
   * Master class coordinating WebGL lifecycle, ScrollTrigger, and HUD controls
   * ========================================================================= */
  class SignatureMandap3D {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.warn(`[SignatureMandap3D] Container #${containerId} not found.`);
        return;
      }

      this.isWebGLAvailable = this.checkWebGL();
      if (!this.isWebGLAvailable) {
        console.warn('[SignatureMandap3D] WebGL not supported, showing fallback.');
        return;
      }

      this.clock = new THREE.Clock();
      this.animationFrameId = null;
      this.isVisible = true;

      this.init();
    }

    checkWebGL() {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    init() {
      this.container.innerHTML = '';
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || 650;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0b110e);
      this.scene.fog = new THREE.FogExp2(0x0b110e, 0.015);

      // 2. Camera Rig
      this.cameraRig = new MandapCamera(this.container);
      this.camera = this.cameraRig.camera;

      // 3. Renderer with device pixel ratio limits
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.container.appendChild(this.renderer.domElement);

      // 4. Build Modular Systems
      this.materials = new MandapMaterials();
      this.mandapScene = new MandapScene(this.materials);
      this.scene.add(this.mandapScene.rootGroup);

      this.lighting = new MandapLighting(this.scene);
      this.interaction = new MandapInteraction(this.container, this.cameraRig);
      this.gallery = new RealMomentsGallery();

      // 5. Setup ScrollTrigger Integration
      this.initScrollAnimation();

      // 6. Setup HUD & UI Button Hooks
      this.initUIHooks();

      // 7. Window Resize Listener
      window.addEventListener('resize', this.onResize.bind(this));

      // 8. Performance Optimization: Intersection Observer
      this.initVisibilityObserver();

      // 9. Start Render Loop
      this.animate();
    }

    initScrollAnimation() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback: apply evening wedding lighting immediately
        this.lighting.applyScrollLighting(1.0);
        return;
      }

      // Smooth section ScrollTrigger animation
      ScrollTrigger.create({
        trigger: this.container,
        start: 'top 85%',
        end: 'bottom 20%',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          // 1. Camera approach & framing glide
          this.cameraRig.applyScrollCamera(progress, this.mandapScene.rootGroup);
          // 2. Lighting transition (Day -> Golden -> Night)
          this.lighting.applyScrollLighting(progress);
          // 3. Update HUD pills active state automatically
          this.updateHUDPillState(progress);
        }
      });
    }

    updateHUDPillState(progress) {
      const dayPill = document.querySelector('.lighting-pill-btn[data-mode="day"]');
      const goldenPill = document.querySelector('.lighting-pill-btn[data-mode="golden"]');
      const nightPill = document.querySelector('.lighting-pill-btn[data-mode="night"]');

      if (!dayPill || !goldenPill || !nightPill) return;

      [dayPill, goldenPill, nightPill].forEach(p => p.classList.remove('active'));

      if (progress < 0.35) {
        dayPill.classList.add('active');
      } else if (progress < 0.72) {
        goldenPill.classList.add('active');
      } else {
        nightPill.classList.add('active');
      }
    }

    initUIHooks() {
      // 1. Lighting atmosphere buttons
      document.querySelectorAll('.lighting-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.lighting-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mode = btn.getAttribute('data-mode') || 'night';
          this.lighting.setPreset(mode);
        });
      });

      // 2. View Real Moments button -> Opens authentic photo modal
      const viewMomentsBtn = document.getElementById('btn-view-moments');
      if (viewMomentsBtn) {
        viewMomentsBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.gallery.open(0);
        });
      }
    }

    initVisibilityObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.05 });
        this.observer.observe(this.container);
      }
    }

    onResize() {
      if (!this.container || !this.renderer || !this.cameraRig) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 650;
      this.renderer.setSize(width, height);
      this.cameraRig.updateAspect();
    }

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

      // Throttled pause when completely off-screen to preserve battery & CPU
      if (!this.isVisible) return;

      const elapsedTime = this.clock.getElapsedTime();

      // Update hanging flowers & atmospheric particles
      this.mandapScene.update(elapsedTime);

      // Update smooth cursor parallax camera movement
      this.cameraRig.updateParallax();

      // Render frame
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      if (this.observer) this.observer.disconnect();
      window.removeEventListener('resize', this.onResize);
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }

  // Export to global window scope
  window.MandapMaterials = MandapMaterials;
  window.MandapScene = MandapScene;
  window.MandapLighting = MandapLighting;
  window.MandapCamera = MandapCamera;
  window.MandapInteraction = MandapInteraction;
  window.RealMomentsGallery = RealMomentsGallery;
  window.SignatureMandap3D = SignatureMandap3D;

})();
