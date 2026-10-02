/**
 * RAMANYAN FARM — TRUE 3D ARCHITECTURAL VENUE MAP EXPLORER
 * Built with Three.js & GSAP
 * Integrates authentic Dusk Venue Map asset with real 3D architectural geometry:
 * - Multi-tier Sandstone Heritage Palace (Main Venue) with chhatris, arches, central dome & finial
 * - Elevated Royal Wedding Lawn with 4-pillar Mandap canopy & amphitheater seating
 * - Grand Promenade with 3D royal entrance archway & palm avenues
 * - Circular Dining Pavilion with translucent tensile dome & glowing chandelier
 * - Waterfront Celebration Deck with reflective lake & circular concert truss
 * - Parking, roadways, perimeter boundary walls, and sculpted miniature landscape
 * - OrbitControls with damping & clamps, GSAP camera glide, 3D pins & idle drift
 */

class Venue3DExplorer {
  constructor(canvasContainerId, popoverId) {
    this.container = document.getElementById(canvasContainerId);
    this.popover = document.getElementById(popoverId);

    // Initial Overview Camera & Target coordinates
    this.overviewCamPos = { x: 0, y: 25, z: 31 };
    this.overviewTarget = { x: 0, y: 0.5, z: 0 };

    this.activeHotspotId = null;
    this.markers = [];
    this.interactiveObjects = [];
    this.isUserInteracting = false;
    this.idleResumeTimeout = null;
    this.camTween = null;
    this.targetTween = null;

    // Calibrated Hotspot Spatial Data on the 3D Estate Plinth (7 Distinct Locations)
    this.hotspots = [
      {
        id: 1,
        num: '01',
        tag: 'MAIN VENUE',
        name: 'The Main Palace Venue',
        subtitle: 'Grand Royal Entrance',
        pos: { x: 1.25, y: 1.2, z: -6.2 },
        camPos: { x: 2.8, y: 10.5, z: 4.8 },
        target: { x: 1.25, y: 1.5, z: -6.2 },
        capacity: '2,500 Guests Capacity',
        features: 'Heritage Sandstone Facade • Royal Courtyard • Grand Stage',
        image: 'assets/farm-map/main-venue/01_Hero_Palace_Entrance_Enhanced.jpg',
        desc: 'A majestic heritage entrance and palatial courtyard designed for unforgettable royal celebrations, illuminated baraat arrivals, and luxury receptions.'
      },
      {
        id: 2,
        num: '02',
        tag: 'WEDDING LAWN',
        name: 'Royal Wedding Lawn & Mandap',
        subtitle: 'Outdoor Wedding Lawn',
        pos: { x: -11.2, y: 1.0, z: 3.4 },
        camPos: { x: -9.5, y: 9.8, z: 14.5 },
        target: { x: -11.2, y: 1.2, z: 3.4 },
        capacity: '1,500+ Seated Guests',
        features: 'Permanent Golden Mandap • Tiered Seating • Crystal Chandeliers',
        image: 'assets/farm-map/wedding-lawn/Golden Indian Wedding Mandap at Night.png',
        desc: 'Sprawling manicured open-air lawn centered around our iconic permanent royal carved mandap with crystal chandeliers for starlit pheras.'
      },
      {
        id: 3,
        num: '03',
        tag: 'SANGEET GROUND',
        name: 'Sangeet Ground & Concert Arena',
        subtitle: 'Celebration & Music',
        pos: { x: 11.8, y: 0.9, z: -3.6 },
        camPos: { x: 13.5, y: 9.8, z: 6.8 },
        target: { x: 11.8, y: 1.2, z: -3.6 },
        capacity: '1,000+ Guests Sangeet & Cocktails',
        features: 'Concert Truss Rig • Waterfront Floating Stage • Party Lawns',
        image: 'assets/farm-map/sangeet-ground/02_Sangeet_Main_Stage_Enhanced.png',
        desc: 'High-energy musical arena equipped with moving-head lighting rigs, concert-grade sound, and waterfront reflection views for celebration nights.'
      },
      {
        id: 4,
        num: '04',
        tag: 'DINING AREA',
        name: 'Royal Banquet Dining Pavilion',
        subtitle: 'Luxury Dining',
        pos: { x: -9.7, y: 1.0, z: -7.2 },
        camPos: { x: -7.8, y: 10.0, z: 3.6 },
        target: { x: -9.7, y: 1.2, z: -7.2 },
        capacity: '1,200 Dining Covers',
        features: 'Grand Canopy • Industrial Catering Kitchen • Live Gourmet Counters',
        image: 'assets/farm-map/dining-area/04_Wedding_Lawn_Canopy_Enhanced.png',
        desc: 'An exquisite culinary pavilion offering five-star catering infrastructure, candlelit banquet tables, live gourmet plazas, and royal feast presentation.'
      },
      {
        id: 5,
        num: '05',
        tag: 'CELEBRATION SPACE',
        name: 'Celebration Space & Courtyard',
        subtitle: 'Grand Celebration Area',
        pos: { x: -1.8, y: 0.8, z: 6.8 },
        camPos: { x: -1.8, y: 9.2, z: 17.5 },
        target: { x: -1.8, y: 1.0, z: 6.8 },
        capacity: '800+ Guests Multi-Tiered',
        features: 'Botanical Palms • Illuminated Fountains • Promenade Walkway',
        image: 'assets/farm-map/sangeet-ground/03_Sangeet_Aerial_Overview_Enhanced.png',
        desc: 'A versatile open-air celebration sanctuary featuring lit floral archways, shimmering fountains, and wide red-carpet walkways for pre-wedding galas.'
      },
      {
        id: 6,
        num: '06',
        tag: 'PARKING',
        name: 'Valet Plaza & Guest Parking',
        subtitle: 'Guest Parking',
        pos: { x: 10.5, y: 0.8, z: 7.5 },
        camPos: { x: 11.2, y: 11.0, z: 18.0 },
        target: { x: 10.5, y: 1.0, z: 7.5 },
        capacity: '1,000+ Vehicles with Valet',
        features: 'Dedicated Ingress / Egress • Security Guard Post • Valet Desks',
        image: 'assets/farm-map/aerial/06_Venue_Aerial_Wide_Enhanced.png',
        desc: 'Extensive, well-paved arrival grounds ensuring rapid, stress-free vehicle flow, dedicated VIP drop-offs, and professional valet staging.'
      },
      {
        id: 7,
        num: '07',
        tag: 'AERIAL OVERVIEW',
        name: '14-Acre Estate Sanctuary',
        subtitle: 'Panoramic Overview',
        pos: { x: 0, y: 1.5, z: 0 },
        camPos: { x: 0, y: 26, z: 32 },
        target: { x: 0, y: 0.5, z: 0 },
        capacity: 'Full 14-Acre Private Buyout',
        features: 'Complete Privacy • Palatial Perimeter • 360° Illuminated Grounds',
        image: 'assets/farm-map/aerial/05_Venue_Aerial_Night_Enhanced.png',
        desc: 'Gujarat\'s premier destination wedding estate combining royal Rajasthani architecture, lush botanical lawns, and complete family seclusion.'
      }
    ];

    if (this.container && typeof THREE !== 'undefined') {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = '';

    const width = this.container.clientWidth || 1200;
    const height = this.container.clientHeight || 600;

    // 1. Scene & Architectural Model Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1411); // Deep dusk studio background
    this.scene.fog = new THREE.FogExp2(0x0e1411, 0.011);

    // 2. Camera Setup (Elevated architectural viewing perspective)
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 500);
    this.camera.position.set(this.overviewCamPos.x, this.overviewCamPos.y + 12, this.overviewCamPos.z + 10);

    // 3. WebGL Renderer with Soft Shadow Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.ACESFilmicToneMapping) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
    }
    if (THREE.sRGBEncoding) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls with Damping & Viewing Limits
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.055;
      this.controls.maxPolarAngle = Math.PI / 2.18; // Cannot see underneath the plinth
      this.controls.minPolarAngle = Math.PI / 6;    // Prevent awkward zenith disorientation
      this.controls.minDistance = 10;
      this.controls.maxDistance = 55;
      this.controls.target.set(this.overviewTarget.x, this.overviewTarget.y, this.overviewTarget.z);

      // Idle movement configuration
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.38;

      // Handle interaction pause & resume
      this.controls.addEventListener('start', () => {
        this.isUserInteracting = true;
        this.controls.autoRotate = false;
        if (this.idleResumeTimeout) clearTimeout(this.idleResumeTimeout);
      });

      this.controls.addEventListener('end', () => {
        this.isUserInteracting = false;
        if (this.idleResumeTimeout) clearTimeout(this.idleResumeTimeout);
        this.idleResumeTimeout = setTimeout(() => {
          if (!this.isUserInteracting && this.controls) {
            this.controls.autoRotate = true;
          }
        }, 2500);
      });
    }

    // 5. Cinematic Architectural Lighting
    this.setupLighting();

    // 6. Build the True 3D Architectural Model
    this.buildArchitecturalModel();

    // 7. Create 3D Hotspot Beacons & Highlights
    this.createHotspotMarkers();

    // 8. Raycasting for direct 3D building/pin clicks
    this.setupRaycasting();

    // 9. Resize Handling
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 10. Start Animation Render Loop
    this.clock = new THREE.Clock();
    this.animate();

    // 11. Cinematic Entry Animation Sequence
    this.playEntranceAnimation();
  }

  setupLighting() {
    // Warm Ambient Light calibrated to prevent wash-out of lighter architectural materials
    const ambientLight = new THREE.AmbientLight(0xffeedb, 0.42);
    this.scene.add(ambientLight);

    // Main Golden Architectural Sunlight casting soft shadows
    this.sunLight = new THREE.DirectionalLight(0xffdf99, 1.25);
    this.sunLight.position.set(24, 38, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 120;
    this.sunLight.shadow.camera.left = -25;
    this.sunLight.shadow.camera.right = 25;
    this.sunLight.shadow.camera.top = 20;
    this.sunLight.shadow.camera.bottom = -20;
    this.sunLight.shadow.bias = -0.0006;
    this.scene.add(this.sunLight);

    // Cool Twilight Sky Fill Light
    const skyFill = new THREE.DirectionalLight(0x426888, 0.42);
    skyFill.position.set(-20, 25, -20);
    this.scene.add(skyFill);

    // Ground Bounce Light
    const hemiLight = new THREE.HemisphereLight(0x2f4336, 0x141a16, 0.42);
    this.scene.add(hemiLight);

    // Dynamic Focused Spotlight for Active Location
    this.activeSpotlight = new THREE.SpotLight(0xffd580, 0, 36, Math.PI / 4, 0.45, 1.2);
    this.activeSpotlight.position.set(0, 18, 0);
    this.scene.add(this.activeSpotlight);
    this.scene.add(this.activeSpotlight.target);
  }

  buildArchitecturalModel() {
    this.estateGroup = new THREE.Group();
    this.scene.add(this.estateGroup);

    const mapWidth = 36;
    const mapDepth = 24;

    // --- A. LUXURY EXHIBITION PLINTH (Museum Pedestal Base) ---
    const plinthGeo = new THREE.BoxGeometry(mapWidth + 0.8, 1.4, mapDepth + 0.8);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x141815,
      roughness: 0.8,
      metalness: 0.2
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -0.7;
    plinthMesh.receiveShadow = true;
    this.estateGroup.add(plinthMesh);

    // Gold Beveled Accent Trim
    const trimGeo = new THREE.BoxGeometry(mapWidth + 0.9, 0.08, mapDepth + 0.9);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xc89b4a,
      roughness: 0.3,
      metalness: 0.85
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.04;
    this.estateGroup.add(trimMesh);

    // --- B. GROUND TERRAIN SURFACE WITH REALISTIC ARCHITECTURAL SITE PLAN TEXTURE ---
    const terrainGeo = new THREE.PlaneGeometry(mapWidth, mapDepth, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    // Generate high-resolution, photorealistic architectural site plan texture matching real venue references
    const sitePlanCanvas = this.createArchitecturalSitePlanTexture();
    const sitePlanTexture = new THREE.CanvasTexture(sitePlanCanvas);
    sitePlanTexture.encoding = THREE.sRGBEncoding || 3001;
    sitePlanTexture.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8);
    sitePlanTexture.generateMipmaps = true;
    sitePlanTexture.minFilter = THREE.LinearMipmapLinearFilter;
    sitePlanTexture.magFilter = THREE.LinearFilter;
    sitePlanTexture.needsUpdate = true;
    this.sitePlanTexture = sitePlanTexture;

    const terrainMat = new THREE.MeshStandardMaterial({
      map: sitePlanTexture,
      roughness: 0.65,
      metalness: 0.1
    });

    this.terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrainMesh.receiveShadow = true;
    this.estateGroup.add(this.terrainMesh);

    // --- C. AUTHENTIC ARCHITECTURAL MATERIALS & PROCEDURAL TEXTURES ---
    // Initialize VenueMaterials synthesis helper (derived directly from real photographs)
    this.matHelper = (typeof VenueMaterials !== 'undefined') ? new VenueMaterials(this.renderer) : null;

    // 1. Materials Palette for 3D Structures
    const palaceBoxMats = this.matHelper ? this.matHelper.getPalaceBoxMaterials() : [
      new THREE.MeshStandardMaterial({ color: 0xb58f55, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xb58f55, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x9e5535, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xb58f55, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xcaa266, roughness: 0.65, emissive: 0x332010 }),
      new THREE.MeshStandardMaterial({ color: 0xb58f55, roughness: 0.7 })
    ];

    const palaceWingMats = this.matHelper ? this.matHelper.getPalaceWingMaterials() : palaceBoxMats;
    const sandstoneMoldingMat = this.matHelper ? this.matHelper.getSandstoneMoldingMaterial() : new THREE.MeshStandardMaterial({ color: 0xba8e54, roughness: 0.68, metalness: 0.15 });
    const royalGoldMat = this.matHelper ? this.matHelper.getRoyalGoldMaterial() : new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.22, metalness: 0.88, emissive: 0x3d2c0b });
    const mandapDaisMats = this.matHelper ? this.matHelper.getMandapDaisMaterials() : [
      sandstoneMoldingMat, sandstoneMoldingMat,
      new THREE.MeshStandardMaterial({ color: 0x8a1515, roughness: 0.65, emissive: 0x220505 }),
      sandstoneMoldingMat, sandstoneMoldingMat, sandstoneMoldingMat
    ];
    const mandapRoofMat = this.matHelper ? this.matHelper.getMandapRoofMaterial() : new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.65 });
    const weddingLawnMat = this.matHelper ? this.matHelper.getWeddingLawnMaterial() : new THREE.MeshStandardMaterial({ color: 0x224d2d, roughness: 0.8 });
    const concertStageMat = this.matHelper ? this.matHelper.getConcertStageMaterial() : new THREE.MeshStandardMaterial({ color: 0x111413, roughness: 0.18, metalness: 0.6 });
    const concertLedMat = this.matHelper ? this.matHelper.getConcertLedMaterial() : new THREE.MeshStandardMaterial({ color: 0x221133, emissive: 0x662244, roughness: 0.3 });
    const teakDeckMat = this.matHelper ? this.matHelper.getTeakDeckMaterial() : new THREE.MeshStandardMaterial({ color: 0x6e4424, roughness: 0.65, metalness: 0.15 });
    const diningCanopyMat = this.matHelper ? this.matHelper.getDiningCanopyMaterial() : new THREE.MeshStandardMaterial({ color: 0xf2ebd9, roughness: 0.4, emissive: 0x443318, transparent: true, opacity: 0.94 });
    const marbleTerraceMat = this.matHelper ? this.matHelper.getMarbleTerraceMaterial() : new THREE.MeshStandardMaterial({ color: 0xdcd2be, roughness: 0.45, metalness: 0.15 });
    const redCarpetMat = this.matHelper ? this.matHelper.getRedCarpetMaterial() : new THREE.MeshStandardMaterial({ color: 0x841818, roughness: 0.72, metalness: 0.15 });
    const asphaltParkingMat = this.matHelper ? this.matHelper.getAsphaltParkingMaterial() : new THREE.MeshStandardMaterial({ color: 0x222524, roughness: 0.85 });
    const waterLakeMat = new THREE.MeshStandardMaterial({ color: 0x142b36, roughness: 0.12, metalness: 0.85 });

    // --- C. 1. MAIN PALACE VENUE (Hotspot 01: Multi-tiered Rajasthani Heritage Palace) ---
    // Reference: assets/farm-map/main-venue/01_Hero_Palace_Entrance_Enhanced.jpg
    const palaceGroup = new THREE.Group();
    palaceGroup.position.set(1.25, 0, -6.2);
    palaceGroup.userData = { id: 1, name: 'The Main Palace Venue' };

    // Elevated Sandstone Plinth with Courtyard Paving
    const palacePlinth = new THREE.Mesh(new THREE.BoxGeometry(13, 0.45, 9.5), sandstoneMoldingMat);
    palacePlinth.position.y = 0.22;
    palacePlinth.receiveShadow = true;
    palacePlinth.castShadow = true;
    palaceGroup.add(palacePlinth);

    // Front Grand Steps with Dressed Stone
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.15, 1.2), sandstoneMoldingMat);
    step1.position.set(0, 0.08, 5.0);
    palaceGroup.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.15, 0.8), sandstoneMoldingMat);
    step2.position.set(0, 0.22, 4.8);
    palaceGroup.add(step2);

    // Central Palace Main Block with Authentic Illuminated Rajput Facade
    const centralBlock = new THREE.Mesh(new THREE.BoxGeometry(6.6, 3.2, 4.2), palaceBoxMats);
    centralBlock.position.set(0, 2.05, -1.2);
    centralBlock.castShadow = true;
    centralBlock.receiveShadow = true;
    palaceGroup.add(centralBlock);

    // Decorative Sloping Sandstone Cornice (Chhajja) with Gold Accent Trim
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.18, 5.0), sandstoneMoldingMat);
    cornice.position.set(0, 3.7, -1.2);
    cornice.castShadow = true;
    palaceGroup.add(cornice);
    const corniceTrim = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.05, 5.1), royalGoldMat);
    corniceTrim.position.set(0, 3.79, -1.2);
    palaceGroup.add(corniceTrim);

    // Symmetrical Left & Right Palace Wings with Arched Facades
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 3.6), palaceWingMats);
    leftWing.position.set(-4.8, 1.55, -1.2);
    leftWing.castShadow = true;
    palaceGroup.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 3.6), palaceWingMats);
    rightWing.position.set(4.8, 1.55, -1.2);
    rightWing.castShadow = true;
    palaceGroup.add(rightWing);

    // Wing Cornices with Gold Beveling
    const leftWingCornice = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 4.0), sandstoneMoldingMat);
    leftWingCornice.position.set(-4.8, 2.7, -1.2);
    palaceGroup.add(leftWingCornice);

    const rightWingCornice = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 4.0), sandstoneMoldingMat);
    rightWingCornice.position.set(4.8, 2.7, -1.2);
    palaceGroup.add(rightWingCornice);

    // Corner Octagonal Bastion Towers & Chhatris
    const towerGeo = new THREE.CylinderGeometry(0.65, 0.75, 3.8, 8);
    const towerDomeGeo = new THREE.SphereGeometry(0.72, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);

    [-6.3, 6.3].forEach(tx => {
      const tower = new THREE.Mesh(towerGeo, sandstoneMoldingMat);
      tower.position.set(tx, 1.9, -1.2);
      tower.castShadow = true;
      palaceGroup.add(tower);

      const chhatriDome = new THREE.Mesh(towerDomeGeo, sandstoneMoldingMat);
      chhatriDome.position.set(tx, 3.8, -1.2);
      palaceGroup.add(chhatriDome);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 8), royalGoldMat);
      finial.position.set(tx, 4.4, -1.2);
      palaceGroup.add(finial);
    });

    // Central Grand Royal Rajput Dome & Kalash Finial Spire
    const mainDome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), sandstoneMoldingMat);
    mainDome.position.set(0, 3.75, -1.2);
    mainDome.castShadow = true;
    palaceGroup.add(mainDome);

    // Dome Gold Fluted Rib Rings
    const domeRing = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.05, 8, 32), royalGoldMat);
    domeRing.rotation.x = Math.PI / 2;
    domeRing.position.set(0, 3.75, -1.2);
    palaceGroup.add(domeRing);

    const kalashBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.4, 16), royalGoldMat);
    kalashBase.position.set(0, 5.4, -1.2);
    palaceGroup.add(kalashBase);

    const kalashCone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 12), royalGoldMat);
    kalashCone.position.set(0, 5.9, -1.2);
    palaceGroup.add(kalashCone);

    // Front Grand Entrance Portico Canopy over Steps
    const porticoRoof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 1.6), sandstoneMoldingMat);
    porticoRoof.position.set(0, 2.2, 1.2);
    palaceGroup.add(porticoRoof);
    [-1.6, 1.6].forEach(px => {
      const porticoCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.8, 8), royalGoldMat);
      porticoCol.position.set(px, 1.3, 1.8);
      palaceGroup.add(porticoCol);
    });

    // Courtyard Central Lotus Fountain Basin
    const fountainBasin = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.28, 20), sandstoneMoldingMat);
    fountainBasin.position.set(0, 0.56, 2.2);
    palaceGroup.add(fountainBasin);

    const fountainRim = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.06, 8, 24), royalGoldMat);
    fountainRim.rotation.x = Math.PI / 2;
    fountainRim.position.set(0, 0.7, 2.2);
    palaceGroup.add(fountainRim);

    const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.26, 20), waterLakeMat);
    fountainWater.position.set(0, 0.58, 2.2);
    palaceGroup.add(fountainWater);

    const fountainJet = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 8), royalGoldMat);
    fountainJet.position.set(0, 0.82, 2.2);
    palaceGroup.add(fountainJet);

    // Courtyard Golden Lantern Posts
    [[-4.5, 3.2], [4.5, 3.2], [-4.5, -0.5], [4.5, -0.5]].forEach(lpos => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 8), royalGoldMat);
      post.position.set(lpos[0], 0.9, lpos[1]);
      palaceGroup.add(post);
      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.2), new THREE.MeshStandardMaterial({
        color: 0xffe099,
        emissive: 0xffaa22,
        roughness: 0.2
      }));
      lantern.position.set(lpos[0], 1.65, lpos[1]);
      palaceGroup.add(lantern);
    });

    // Warm Architectural Palace Courtyard PointLight
    this.palaceLight = new THREE.PointLight(0xffbe6b, 1.8, 16);
    this.palaceLight.position.set(0, 3.5, 0.5);
    palaceGroup.add(this.palaceLight);

    this.estateGroup.add(palaceGroup);
    this.interactiveObjects.push(palacePlinth);
    this.interactiveObjects.push(centralBlock);

    // --- C. 2. WEDDING LAWN & ROYAL MANDAP (Hotspot 02) ---
    // Reference: assets/farm-map/wedding-lawn/Golden Indian Wedding Mandap at Night.png
    const lawnGroup = new THREE.Group();
    lawnGroup.position.set(-11.2, 0, 3.4);
    lawnGroup.userData = { id: 2, name: 'Royal Wedding Lawn & Seating' };

    // Raised Manicured Lawn Plateau with Striped Emerald Turf
    const lawnPlateau = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.35, 9.0), weddingLawnMat);
    lawnPlateau.position.y = 0.18;
    lawnPlateau.receiveShadow = true;
    lawnPlateau.castShadow = true;
    lawnGroup.add(lawnPlateau);

    // Gold Beveled Curbing Rim
    const lawnCurb = new THREE.Mesh(new THREE.BoxGeometry(10.7, 0.1, 9.2), royalGoldMat);
    lawnCurb.position.y = 0.12;
    lawnGroup.add(lawnCurb);

    // 4-Pillar Royal Mandap on Elevated Embroidered Dais Plinth
    const mandapPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.28, 3.8), mandapDaisMats);
    mandapPlinth.position.set(0, 0.46, 0);
    mandapPlinth.castShadow = true;
    lawnGroup.add(mandapPlinth);

    // 4 Ornate Carved Golden Pillars with Floral Garland Bands
    const pillarGeo = new THREE.CylinderGeometry(0.10, 0.12, 2.2, 12);
    const garlandGeo = new THREE.TorusGeometry(0.13, 0.035, 6, 12);
    const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.8 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xb31515, roughness: 0.8 });

    const pillarPositions = [
      [-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]
    ];
    pillarPositions.forEach(pos => {
      const pillar = new THREE.Mesh(pillarGeo, royalGoldMat);
      pillar.position.set(pos[0], 1.6, pos[1]);
      pillar.castShadow = true;
      lawnGroup.add(pillar);

      // Floral Garland Rings on pillars
      const g1 = new THREE.Mesh(garlandGeo, marigoldMat);
      g1.rotation.x = Math.PI / 2;
      g1.position.set(pos[0], 1.2, pos[1]);
      lawnGroup.add(g1);

      const g2 = new THREE.Mesh(garlandGeo, roseMat);
      g2.rotation.x = Math.PI / 2;
      g2.position.set(pos[0], 2.0, pos[1]);
      lawnGroup.add(g2);
    });

    // Mandap Golden Pagoda Canopy Roof with Velvet Valance & Tassels
    const mandapRoof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.25, 4), mandapRoofMat);
    mandapRoof.rotation.y = Math.PI / 4;
    mandapRoof.position.set(0, 3.1, 0);
    mandapRoof.castShadow = true;
    lawnGroup.add(mandapRoof);

    // Golden Kalash Finial on Mandap Crest
    const mandapFinial = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.6, 8), royalGoldMat);
    mandapFinial.position.set(0, 3.95, 0);
    lawnGroup.add(mandapFinial);

    // Center Hanging Crystal Chandelier Mesh
    const chRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 6, 16), royalGoldMat);
    chRing1.rotation.x = Math.PI / 2;
    chRing1.position.set(0, 2.5, 0);
    lawnGroup.add(chRing1);
    const chRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 12), royalGoldMat);
    chRing2.rotation.x = Math.PI / 2;
    chRing2.position.set(0, 2.3, 0);
    lawnGroup.add(chRing2);

    // Royal Mandap Thrones (Bridal Couple Golden Seats)
    [-0.35, 0.35].forEach(cx => {
      const throneSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.25, 0.42), new THREE.MeshStandardMaterial({
        color: 0x8a1515,
        roughness: 0.7
      }));
      throneSeat.position.set(cx, 0.72, -0.3);
      lawnGroup.add(throneSeat);
      const throneBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.08), royalGoldMat);
      throneBack.position.set(cx, 0.95, -0.48);
      lawnGroup.add(throneBack);
    });

    // 4 Corner Gold Floral Kalash Urns on Mandap Dais
    pillarPositions.forEach(pos => {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.32, 10), royalGoldMat);
      urn.position.set(pos[0] * 1.15, 0.72, pos[1] * 1.15);
      lawnGroup.add(urn);
    });

    // Tiered Amphitheater Seating Rows with Royal Cushions
    [-2.8, -3.6, 2.8, 3.6].forEach(offsetZ => {
      const seatBase = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.16, 0.45), sandstoneMoldingMat);
      seatBase.position.set(0, 0.38, offsetZ);
      lawnGroup.add(seatBase);

      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.08, 0.38), new THREE.MeshStandardMaterial({
        color: 0xeee6d8,
        roughness: 0.8
      }));
      seatCushion.position.set(0, 0.48, offsetZ);
      lawnGroup.add(seatCushion);
    });

    // Mandap Golden Ambient Chandelier PointLight
    this.mandapLight = new THREE.PointLight(0xffc578, 1.8, 12);
    this.mandapLight.position.set(0, 2.4, 0);
    lawnGroup.add(this.mandapLight);

    this.estateGroup.add(lawnGroup);
    this.interactiveObjects.push(lawnPlateau);
    this.interactiveObjects.push(mandapPlinth);

    // --- C. 3. GRAND ENTRANCE PROMENADE & CELEBRATION SPACE (Hotspot 05) ---
    // Reference: assets/farm-map/sangeet-ground/03_Sangeet_Aerial_Overview_Enhanced.png
    const entranceGroup = new THREE.Group();
    entranceGroup.position.set(-1.8, 0, 7.2);
    entranceGroup.userData = { id: 5, name: 'Grand Entrance Promenade & Celebration Courtyard' };

    // Royal Crimson Red Carpet Runner with Gold Embroidery
    const redCarpet = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 9.2), redCarpetMat);
    redCarpet.position.y = 0.04;
    entranceGroup.add(redCarpet);

    // Grand Entrance Archway Gate Structure
    const archPillarGeo = new THREE.BoxGeometry(0.55, 2.9, 0.55);
    const archLeft = new THREE.Mesh(archPillarGeo, sandstoneMoldingMat);
    archLeft.position.set(-1.8, 1.45, 3.8);
    entranceGroup.add(archLeft);

    const archRight = new THREE.Mesh(archPillarGeo, sandstoneMoldingMat);
    archRight.position.set(1.8, 1.45, 3.8);
    entranceGroup.add(archRight);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 0.65), sandstoneMoldingMat);
    archTop.position.set(0, 3.0, 3.8);
    archTop.castShadow = true;
    entranceGroup.add(archTop);

    const archCrown = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.9, 4), royalGoldMat);
    archCrown.rotation.y = Math.PI / 4;
    archCrown.position.set(0, 3.65, 3.8);
    entranceGroup.add(archCrown);

    // 3 Illuminated Ceremonial Toran Rings Spanning Promenade
    const toranMat = new THREE.MeshStandardMaterial({
      color: 0xffd778,
      emissive: 0xffeeaa,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    [-0.5, -3.2, 1.8].forEach(tz => {
      const toran = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.07, 8, 20, Math.PI), toranMat);
      toran.position.set(0, 0.1, tz);
      toran.castShadow = true;
      entranceGroup.add(toran);
    });

    // Promenade Ambient Chandelier Light
    this.entranceLight = new THREE.PointLight(0xffcc77, 1.5, 10);
    this.entranceLight.position.set(0, 2.5, 1.5);
    entranceGroup.add(this.entranceLight);

    this.estateGroup.add(entranceGroup);
    this.interactiveObjects.push(redCarpet);

    // --- C. 4. ROYAL DINING CANOPY & BANQUET PAVILION (Hotspot 04) ---
    // Reference: assets/farm-map/dining-area/04_Wedding_Lawn_Canopy_Enhanced.png
    const diningGroup = new THREE.Group();
    diningGroup.position.set(-9.7, 0, -7.2);
    diningGroup.userData = { id: 4, name: 'Royal Dining Canopy & Lawns' };

    // Raised Circular Terrace Plinth with Italian Marble Pavers
    const diningPlinth = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.0, 0.35, 32), marbleTerraceMat);
    diningPlinth.position.y = 0.18;
    diningPlinth.receiveShadow = true;
    diningGroup.add(diningPlinth);

    // Perimeter Fluted Ivory Columns with Gold Capitals
    const numColumns = 8;
    const colGeo = new THREE.CylinderGeometry(0.09, 0.11, 2.3, 10);
    for (let c = 0; c < numColumns; c++) {
      const angle = (c / numColumns) * Math.PI * 2;
      const colX = Math.cos(angle) * 3.9;
      const colZ = Math.sin(angle) * 3.9;
      const col = new THREE.Mesh(colGeo, sandstoneMoldingMat);
      col.position.set(colX, 1.35, colZ);
      col.castShadow = true;
      diningGroup.add(col);

      // Gold capital on column top
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.24), royalGoldMat);
      cap.position.set(colX, 2.5, colZ);
      diningGroup.add(cap);
    }

    // Grand Vaulted Tensile Canopy Dome with Radiating Champagne Fabric
    const diningCanopy = new THREE.Mesh(new THREE.SphereGeometry(4.2, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.45), diningCanopyMat);
    diningCanopy.position.set(0, 2.1, 0);
    diningCanopy.castShadow = true;
    diningGroup.add(diningCanopy);

    // Tensile Gold Perimeter Crown Ring
    const canopyRim = new THREE.Mesh(new THREE.TorusGeometry(4.22, 0.06, 8, 36), royalGoldMat);
    canopyRim.rotation.x = Math.PI / 2;
    canopyRim.position.set(0, 2.1, 0);
    diningGroup.add(canopyRim);

    // Interior Warm Crystal Chandelier
    const chMain = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 6, 20), royalGoldMat);
    chMain.rotation.x = Math.PI / 2;
    chMain.position.set(0, 2.7, 0);
    diningGroup.add(chMain);

    this.diningLight = new THREE.PointLight(0xffae52, 2.0, 12);
    this.diningLight.position.set(0, 2.7, 0);
    diningGroup.add(this.diningLight);

    // Miniature Circular Banquet Dining Tables with Draped Linens & Gold Chairs
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xf5eedd, roughness: 0.7 });
    for (let t = 0; t < 6; t++) {
      const tAngle = (t / 6) * Math.PI * 2;
      const tx = Math.cos(tAngle) * 2.3;
      const tz = Math.sin(tAngle) * 2.3;

      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 12), tableMat);
      table.position.set(tx, 0.48, tz);
      diningGroup.add(table);

      // Gold runner accent on table
      const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.06, 12), royalGoldMat);
      runner.position.set(tx, 0.56, tz);
      diningGroup.add(runner);

      // Warm candle glow on each banquet table
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), new THREE.MeshStandardMaterial({
        color: 0xffeb99,
        emissive: 0xffaa22
      }));
      candle.position.set(tx, 0.68, tz);
      diningGroup.add(candle);
    }

    this.estateGroup.add(diningGroup);
    this.interactiveObjects.push(diningPlinth);

    // --- C. 5. SANGEET GROUND & WATERFRONT CONCERT ARENA (Hotspot 03) ---
    // Reference: assets/farm-map/sangeet-ground/02_Sangeet_Main_Stage_Enhanced.png
    const celebrationGroup = new THREE.Group();
    celebrationGroup.position.set(11.8, 0, -3.6);
    celebrationGroup.userData = { id: 3, name: 'Sangeet Ground & Concert Arena' };

    // Shimmering Deep Water Lake
    const lake = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 7.5), waterLakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(0, 0.06, 0);
    celebrationGroup.add(lake);

    // Rich Teak Waterfront Deck
    const timberDeck = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.28, 4.6), teakDeckMat);
    timberDeck.position.set(0, 0.2, 1.2);
    timberDeck.castShadow = true;
    timberDeck.receiveShadow = true;
    celebrationGroup.add(timberDeck);

    // Gold Deck Handrail
    const railMat = royalGoldMat;
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.06, 0.06), railMat);
    backRail.position.set(0, 0.65, -1.05);
    celebrationGroup.add(backRail);

    // High-Gloss Performance Concert Stage with Gold Border
    const stage = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.38, 2.0), concertStageMat);
    stage.position.set(0, 0.48, 0.15);
    celebrationGroup.add(stage);

    const stageBorder = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.08, 2.1), royalGoldMat);
    stageBorder.position.set(0, 0.65, 0.15);
    celebrationGroup.add(stageBorder);

    // Giant High-Resolution Concert LED Screen Video Wall (Emissive)
    const ledScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.12), concertLedMat);
    ledScreen.position.set(0, 1.75, -0.85);
    celebrationGroup.add(ledScreen);

    // Concert Aluminum Box Truss Rig
    const trussMat = new THREE.MeshStandardMaterial({ color: 0xb0b8c0, metalness: 0.9, roughness: 0.25 });
    const trussLegGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 6);
    [[-1.9, -0.8], [1.9, -0.8], [-1.9, 2.6], [1.9, 2.6]].forEach(pos => {
      const leg = new THREE.Mesh(trussLegGeo, trussMat);
      leg.position.set(pos[0], 1.8, pos[1]);
      celebrationGroup.add(leg);
    });

    // Circular Gold Overhead Truss Ring
    const trussRing = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 6, 24), royalGoldMat);
    trussRing.rotation.x = Math.PI / 2;
    trussRing.position.set(0, 3.3, 0.9);
    celebrationGroup.add(trussRing);

    // 6 Moving-head concert stage spotlights on truss
    for (let sp = 0; sp < 6; sp++) {
      const sAng = (sp / 6) * Math.PI * 2;
      const sx = Math.cos(sAng) * 2.4;
      const sz = 0.9 + Math.sin(sAng) * 2.4;
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.18, 6), new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8
      }));
      fixture.position.set(sx, 3.25, sz);
      celebrationGroup.add(fixture);
    }

    // Flanking Line Array Speaker Towers
    [-2.1, 2.1].forEach(spx => {
      const speakerStack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 0.35), new THREE.MeshStandardMaterial({
        color: 0x181818,
        roughness: 0.9
      }));
      speakerStack.position.set(spx, 2.2, 0.15);
      celebrationGroup.add(speakerStack);
    });

    // VIP Cocktail Round Tables on Deck
    [[-2.2, 2.4], [2.2, 2.4], [-1.2, 2.9], [1.2, 2.9]].forEach(cpos => {
      const cTable = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.45, 10), new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8
      }));
      cTable.position.set(cpos[0], 0.55, cpos[1]);
      celebrationGroup.add(cTable);
      const cLamp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshStandardMaterial({
        color: 0xffaa44,
        emissive: 0xff6622
      }));
      cLamp.position.set(cpos[0], 0.82, cpos[1]);
      celebrationGroup.add(cLamp);
    });

    // Sangeet Party Stage Ambient PointLight
    this.partyLight = new THREE.PointLight(0xe87a90, 1.8, 12);
    this.partyLight.position.set(0, 2.6, 0.8);
    celebrationGroup.add(this.partyLight);

    this.estateGroup.add(celebrationGroup);
    this.interactiveObjects.push(timberDeck);
    this.interactiveObjects.push(stage);

    // --- C. 6. VALET PLAZA & GUEST PARKING (Hotspot 06) ---
    // Reference: assets/farm-map/aerial/06_Venue_Aerial_Wide_Enhanced.png
    const parkingGroup = new THREE.Group();
    parkingGroup.position.set(10.5, 0, 7.5);
    parkingGroup.userData = { id: 6, name: 'Valet Plaza & Guest Parking' };

    // Textured Asphalt Parking Plinth with Gold Stalls & Arrows
    const parkingPlinth = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.28, 7.4), asphaltParkingMat);
    parkingPlinth.position.y = 0.14;
    parkingPlinth.receiveShadow = true;
    parkingGroup.add(parkingPlinth);

    // Valet Drop-off Porte-Cochère Canopy
    const valetCanopy = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 3.2), new THREE.MeshStandardMaterial({
      color: 0x2a322e,
      roughness: 0.4,
      metalness: 0.7
    }));
    valetCanopy.position.set(0, 1.85, 0);
    parkingGroup.add(valetCanopy);

    const canopyFascia = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.06, 3.3), royalGoldMat);
    canopyFascia.position.set(0, 1.88, 0);
    parkingGroup.add(canopyFascia);

    // 4 Steel Support Columns for Valet Canopy
    [[-1.8, -1.3], [1.8, -1.3], [-1.8, 1.3], [1.8, 1.3]].forEach(vpos => {
      const vcol = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), new THREE.MeshStandardMaterial({
        color: 0x889098,
        metalness: 0.9
      }));
      vcol.position.set(vpos[0], 1.05, vpos[1]);
      parkingGroup.add(vcol);
    });

    // Valet Security & Guard Kiosk
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.4), sandstoneMoldingMat);
    kiosk.position.set(3.4, 0.95, -2.2);
    parkingGroup.add(kiosk);

    const kioskRoof = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.6), royalGoldMat);
    kioskRoof.position.set(3.4, 1.8, -2.2);
    parkingGroup.add(kioskRoof);

    // Kiosk Glowing Window
    const kioskWin = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.6), new THREE.MeshStandardMaterial({
      color: 0xfff0aa,
      emissive: 0xffaa22,
      roughness: 0.1
    }));
    kioskWin.position.set(3.4, 1.1, -1.48);
    parkingGroup.add(kioskWin);

    // Barrier Gate Arm
    const barrier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      roughness: 0.4
    }));
    barrier.position.set(1.8, 0.55, -2.2);
    parkingGroup.add(barrier);

    // 4 Miniature Stylized Luxury Wedding Vehicles in Stalls
    const carColors = [0x151515, 0xf0f0f0, 0x6e1520, 0x828a90];
    const carPositions = [
      [-3.0, 0.45, -2.0],
      [-1.8, 0.45, -2.0],
      [-3.0, 0.45, 2.0],
      [-1.8, 0.45, 2.0]
    ];
    carPositions.forEach((cp, idx) => {
      const carGroup = new THREE.Group();
      carGroup.position.set(cp[0], cp[1], cp[2]);

      const carMat = this.matHelper ? this.matHelper.getCarBodyMaterial(carColors[idx]) : new THREE.MeshStandardMaterial({
        color: carColors[idx],
        metalness: 0.85,
        roughness: 0.2
      });

      // Lower Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.26, 2.1), carMat);
      carGroup.add(body);

      // Cabin / Glass
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.1), new THREE.MeshStandardMaterial({
        color: 0x1a2228,
        metalness: 0.9,
        roughness: 0.1
      }));
      cabin.position.set(0, 0.22, -0.1);
      carGroup.add(cabin);

      // Headlights
      const hlight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.04), new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffeeaa
      }));
      hlight.position.set(0, 0.05, 1.05);
      carGroup.add(hlight);

      parkingGroup.add(carGroup);
    });

    // 6 Driveway LED Light Bollards
    [[-4.0, -3.2], [4.0, -3.2], [-4.0, 3.2], [4.0, 3.2], [-4.0, 0], [4.0, 0]].forEach(bp => {
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.65, 8), royalGoldMat);
      bollard.position.set(bp[0], 0.5, bp[1]);
      parkingGroup.add(bollard);
      const bCap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshStandardMaterial({
        color: 0xffebaa,
        emissive: 0xffbb44
      }));
      bCap.position.set(bp[0], 0.85, bp[1]);
      parkingGroup.add(bCap);
    });

    // Valet Area Ambient PointLight
    this.parkingLight = new THREE.PointLight(0xffd580, 1.5, 10);
    this.parkingLight.position.set(0, 2.2, 0);
    parkingGroup.add(this.parkingLight);

    this.estateGroup.add(parkingGroup);
    this.interactiveObjects.push(parkingPlinth);

    // --- D. SCULPTED 3D MINIATURE LANDSCAPE (Perimeter Walls & Natural Trees) ---
    // 1. Boundary Perimeter Sandstone Wall
    const wallMat = sandstoneMoldingMat;
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(mapWidth, 0.6, 0.35), wallMat);
    northWall.position.set(0, 0.3, -mapDepth / 2 + 0.2);
    northWall.castShadow = true;
    this.estateGroup.add(northWall);

    const southWall = new THREE.Mesh(new THREE.BoxGeometry(mapWidth, 0.6, 0.35), wallMat);
    southWall.position.set(0, 0.3, mapDepth / 2 - 0.2);
    this.estateGroup.add(southWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, mapDepth), wallMat);
    westWall.position.set(-mapWidth / 2 + 0.2, 0.3, 0);
    this.estateGroup.add(westWall);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, mapDepth), wallMat);
    eastWall.position.set(mapWidth / 2 - 0.2, 0.3, 0);
    this.estateGroup.add(eastWall);

    // 2. 3D Miniature Date Palms & Cypress Trees with Natural Textures
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.6, 8);
    const trunkMat = this.matHelper ? this.matHelper.getPalmTrunkMaterial() : new THREE.MeshStandardMaterial({ color: 0x4a3220, roughness: 0.92 });
    const palmFrondGeo = new THREE.ConeGeometry(0.95, 1.25, 7);

    const treeCoords = [
      // Promenade Avenue
      [-3.4, 8.5], [0.2, 8.5], [-3.4, 5.5], [0.2, 5.5], [-3.4, 2.5], [0.2, 2.5],
      // Wedding Lawn Border
      [-16.0, 6.0], [-16.0, 1.0], [-16.0, -2.0], [-6.2, 6.5], [-6.2, 1.0],
      // Palace Flanks
      [-5.5, -4.5], [7.8, -4.5], [-5.5, -8.0], [7.8, -8.0],
      // Waterfront Garden
      [7.2, -1.0], [7.2, -5.5], [15.8, -1.0], [15.8, -5.5]
    ];

    treeCoords.forEach((coord, idx) => {
      const tree = new THREE.Group();
      tree.position.set(coord[0], 0, coord[1]);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.8;
      trunk.castShadow = true;
      tree.add(trunk);

      const fMat = this.matHelper ? this.matHelper.getFoliageMaterial(idx) : new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x1e4a28 : 0x265831,
        roughness: 0.75
      });

      const crown = new THREE.Mesh(palmFrondGeo, fMat);
      crown.position.y = 1.95;
      crown.castShadow = true;
      tree.add(crown);

      // Second tier of fronds for fuller canopy
      const crownLower = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.8, 7), fMat);
      crownLower.position.y = 1.65;
      crownLower.castShadow = true;
      tree.add(crownLower);

      this.estateGroup.add(tree);
    });

    // 3. Starlight / Firefly Evening Particle Drift
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 34;
      particlePositions[i + 1] = 0.8 + Math.random() * 4.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf5d996,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);
  }

  createHotspotMarkers() {
    this.hotspotGroup = new THREE.Group();
    this.scene.add(this.hotspotGroup);
    this.hitboxes = [];

    this.hotspots.forEach(item => {
      const markerRoot = new THREE.Group();
      markerRoot.position.set(item.pos.x, item.pos.y, item.pos.z);
      markerRoot.userData = { id: item.id, name: item.name };

      // 1. Ground Pulsing Ring
      const ringGeo = new THREE.RingGeometry(0.85, 1.25, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc89b4a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.05;
      markerRoot.add(ringMesh);

      // 2. Active Selection Halo (Hidden until focused)
      const haloGeo = new THREE.RingGeometry(0.6, 2.8, 32);
      haloGeo.rotateX(-Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffdf99,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.08;
      markerRoot.add(haloMesh);

      // 3. Vertical Gold Needle / Stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 16);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0xc89b4a,
        metalness: 0.9,
        roughness: 0.2
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = 1.0;
      markerRoot.add(stemMesh);

      // 4. Floating Rotating Diamond Jewel Pin
      const jewelGeo = new THREE.OctahedronGeometry(0.44, 0);
      const jewelMat = new THREE.MeshStandardMaterial({
        color: 0xf5d996,
        emissive: 0x78551f,
        metalness: 0.85,
        roughness: 0.15
      });
      const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
      jewelMesh.position.y = 2.25;
      markerRoot.add(jewelMesh);

      // 5. Invisible Hitbox for click raycasting
      const hitGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 1.4;
      hitMesh.userData = { id: item.id };
      markerRoot.add(hitMesh);
      this.hitboxes.push(hitMesh);

      this.markers.push({
        id: item.id,
        root: markerRoot,
        ringMesh,
        haloMesh,
        jewelMesh,
        initialY: 2.25
      });

      this.hotspotGroup.add(markerRoot);
    });
  }

  setupRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredHotspotId = null;
    this.tooltipEl = document.getElementById('venue-map-tooltip');
    let downPos = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('pointermove', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // 1. Subtle camera parallax on mouse movement (Requirement 1)
      if (!this.isUserInteracting && this.camera && window.innerWidth >= 992) {
        const parallaxX = this.mouse.x * 1.5;
        const parallaxY = this.mouse.y * 1.0;
        gsap.to(this.camera.position, {
          x: (this.activeHotspotId ? (this.hotspots.find(h => h.id === this.activeHotspotId)?.camPos.x || 0) : this.overviewCamPos.x) + parallaxX,
          y: (this.activeHotspotId ? (this.hotspots.find(h => h.id === this.activeHotspotId)?.camPos.y || 25) : this.overviewCamPos.y) + parallaxY,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      // 2. Hotspot hover raycasting (Requirement 3)
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.hitboxes);

      if (intersects.length > 0) {
        const hoveredId = intersects[0].object.userData.id;
        const spot = this.hotspots.find(h => h.id === hoveredId);
        this.renderer.domElement.style.cursor = 'pointer';

        if (this.hoveredHotspotId !== hoveredId && spot) {
          this.hoveredHotspotId = hoveredId;

          // Highlight location marker & gold glow
          this.markers.forEach(m => {
            if (m.id === hoveredId) {
              gsap.to(m.jewelMesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.3, ease: 'back.out(1.8)' });
              gsap.to(m.jewelMesh.position, { y: m.initialY + 0.35, duration: 0.3 });
              gsap.to(m.ringMesh.material, { opacity: 1, duration: 0.2 });
              gsap.to(m.ringMesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3 });
            } else if (m.id !== this.activeHotspotId) {
              gsap.to(m.jewelMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
              gsap.to(m.jewelMesh.position, { y: m.initialY, duration: 0.3 });
              gsap.to(m.ringMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            }
          });

          // Show floating tooltip
          if (this.tooltipEl) {
            const titleEl = this.tooltipEl.querySelector('.venue-map-tooltip-title');
            const subEl = this.tooltipEl.querySelector('.venue-map-tooltip-sub');
            if (titleEl) titleEl.textContent = spot.name;
            if (subEl) subEl.textContent = spot.subtitle;
            this.tooltipEl.classList.add('visible');
          }
        }

        // Update tooltip position relative to container
        if (this.tooltipEl) {
          this.tooltipEl.style.left = `${e.clientX - rect.left}px`;
          this.tooltipEl.style.top = `${e.clientY - rect.top}px`;
        }
      } else {
        if (this.hoveredHotspotId !== null) {
          this.renderer.domElement.style.cursor = 'grab';
          this.markers.forEach(m => {
            if (m.id !== this.activeHotspotId) {
              gsap.to(m.jewelMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
              gsap.to(m.jewelMesh.position, { y: m.initialY, duration: 0.3 });
              gsap.to(m.ringMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            }
          });
          this.hoveredHotspotId = null;
          if (this.tooltipEl) this.tooltipEl.classList.remove('visible');
        }
      }
    });

    this.renderer.domElement.addEventListener('pointerleave', () => {
      if (this.tooltipEl) this.tooltipEl.classList.remove('visible');
      this.hoveredHotspotId = null;
    });

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      // Only treat as click if user didn't drag
      if (dist < 6) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.hitboxes);

        if (intersects.length > 0) {
          const clickedId = intersects[0].object.userData.id;
          if (clickedId) {
            this.selectHotspot(clickedId);
          }
        }
      }
    });
  }

  selectHotspot(id) {
    const spot = this.hotspots.find(h => h.id === id);
    if (!spot) return;

    this.activeHotspotId = id;

    // Pause idle rotation during focused inspection
    if (this.controls) {
      this.controls.autoRotate = false;
    }

    // Update Pill Buttons Active State
    document.querySelectorAll('.hotspot-pill-btn').forEach(btn => {
      const btnId = parseInt(btn.getAttribute('data-id'));
      if (btnId === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update 3D Markers Visual Highlights
    this.markers.forEach(m => {
      if (m.id === id) {
        // Expand and brighten halo
        gsap.to(m.haloMesh.material, { opacity: 0.85, duration: 0.5 });
        gsap.to(m.haloMesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.8, ease: 'back.out(1.5)' });
        gsap.to(m.jewelMesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.4 });
      } else {
        gsap.to(m.haloMesh.material, { opacity: 0, duration: 0.3 });
        gsap.to(m.haloMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        gsap.to(m.jewelMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      }
    });

    // Point dynamic active spotlight toward the selected area
    if (this.activeSpotlight) {
      this.activeSpotlight.target.position.set(spot.pos.x, 0, spot.pos.z);
      gsap.to(this.activeSpotlight, {
        intensity: 2.4,
        duration: 0.8,
        ease: 'power2.out'
      });
      gsap.to(this.activeSpotlight.position, {
        x: spot.pos.x,
        y: 16,
        z: spot.pos.z + 4,
        duration: 1.2,
        ease: 'power3.out'
      });
    }

    // Enhance localized architectural illumination on the selected space
    if (this.palaceLight) gsap.to(this.palaceLight, { intensity: id === 1 ? 2.4 : 1.4, duration: 0.8 });
    if (this.mandapLight) gsap.to(this.mandapLight, { intensity: id === 2 ? 2.4 : 1.4, duration: 0.8 });
    if (this.partyLight) gsap.to(this.partyLight, { intensity: id === 3 ? 2.4 : 1.4, duration: 0.8 });
    if (this.diningLight) gsap.to(this.diningLight, { intensity: id === 4 ? 2.4 : 1.5, duration: 0.8 });
    if (this.entranceLight) gsap.to(this.entranceLight, { intensity: id === 5 ? 2.2 : 1.3, duration: 0.8 });
    if (this.parkingLight) gsap.to(this.parkingLight, { intensity: id === 6 ? 2.2 : 1.2, duration: 0.8 });

    // Smoothly Interpolate Camera & LookAt Target (1.35s power3.inOut)
    this.glideCamera(spot.camPos, spot.target, 1.35);

    // Update Popover Details with Local Image Preview & Content
    if (this.popover) {
      const img = this.popover.querySelector('.popover-img') || document.getElementById('popover-img');
      const tag = this.popover.querySelector('.popover-tag') || document.getElementById('popover-tag');
      const title = this.popover.querySelector('.popover-title') || document.getElementById('popover-title');
      const subtitle = this.popover.querySelector('.popover-subtitle') || document.getElementById('popover-subtitle');
      const desc = this.popover.querySelector('.popover-desc') || document.getElementById('popover-desc');

      if (img && spot.image) {
        img.src = spot.image;
        img.alt = `${spot.name} Preview`;
      }
      if (tag) tag.textContent = spot.tag || `HOTSPOT ${spot.num}`;
      if (title) title.textContent = spot.name;
      if (subtitle) subtitle.textContent = spot.subtitle || '';
      if (desc) desc.textContent = spot.desc;

      // Animate Popover Smoothly into view without page reload
      this.popover.classList.add('visible');
      gsap.fromTo(this.popover,
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }

  closePopover() {
    if (this.popover) {
      gsap.to(this.popover, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          this.popover.classList.remove('visible');
        }
      });
    }
    // Return camera smoothly to overview
    this.resetToOverview();
  }

  resetToOverview() {
    this.activeHotspotId = null;

    // Reset Pill Buttons
    document.querySelectorAll('.hotspot-pill-btn').forEach(btn => btn.classList.remove('active'));

    // Reset Marker Highlights
    this.markers.forEach(m => {
      gsap.to(m.haloMesh.material, { opacity: 0, duration: 0.4 });
      gsap.to(m.haloMesh.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
      gsap.to(m.jewelMesh.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    });

    // Dim dynamic spotlight
    if (this.activeSpotlight) {
      gsap.to(this.activeSpotlight, { intensity: 0, duration: 0.6 });
    }

    // Hide Popover
    if (this.popover) {
      this.popover.classList.remove('visible');
    }

    // Balance localized architectural lights for overall twilight view
    if (this.palaceLight) gsap.to(this.palaceLight, { intensity: 1.6, duration: 0.8 });
    if (this.mandapLight) gsap.to(this.mandapLight, { intensity: 1.5, duration: 0.8 });
    if (this.partyLight) gsap.to(this.partyLight, { intensity: 1.5, duration: 0.8 });
    if (this.diningLight) gsap.to(this.diningLight, { intensity: 1.6, duration: 0.8 });
    if (this.entranceLight) gsap.to(this.entranceLight, { intensity: 1.4, duration: 0.8 });
    if (this.parkingLight) gsap.to(this.parkingLight, { intensity: 1.3, duration: 0.8 });

    // Smoothly Return Camera to Overview
    this.glideCamera(this.overviewCamPos, this.overviewTarget, 1.4);

    // Re-enable idle auto-drift after overview return
    setTimeout(() => {
      if (!this.isUserInteracting && this.controls) {
        this.controls.autoRotate = true;
      }
    }, 1500);
  }

  glideCamera(targetCamPos, targetLookAt, duration = 1.35) {
    if (this.camTween) this.camTween.kill();
    if (this.targetTween) this.targetTween.kill();

    const startPos = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    };

    const startTarget = {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z
    };

    this.camTween = gsap.to(startPos, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      duration: duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.camera.position.set(startPos.x, startPos.y, startPos.z);
      }
    });

    this.targetTween = gsap.to(startTarget, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.controls.target.set(startTarget.x, startTarget.y, startTarget.z);
        this.controls.update();
      }
    });
  }

  playEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Heading & Subtitle
    const headerTitle = document.querySelector('.page-header-title');
    const headerDesc = document.querySelector('.page-header-desc');
    const headerTag = document.querySelector('.section-tag-gold');

    if (headerTag) tl.fromTo(headerTag, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
    if (headerTitle) tl.fromTo(headerTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.15);
    if (headerDesc) tl.fromTo(headerDesc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.3);

    // 2. 3D Container Reveal & Scale 0.92 -> 1
    tl.fromTo(this.container.parentElement,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out' },
      0.4
    );

    // Camera swoops smoothly down into overview position
    this.glideCamera(this.overviewCamPos, this.overviewTarget, 1.8);

    // 3. Location Controls Bar Reveal (Stagger)
    const navBar = document.querySelector('.venue-hotspots-nav');
    const resetBtn = document.getElementById('btn-reset-venue');
    const overlay = document.querySelector('.venue-controls-overlay');

    if (overlay) tl.fromTo(overlay, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.1);
    if (resetBtn) tl.fromTo(resetBtn, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.1);
    if (navBar) {
      tl.fromTo(navBar.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        1.2
      );
    }
  }

  /**
   * Generates a high-resolution, photorealistic master architectural site plan
   * texture for the top surface of the 3D venue map.
   * Matches the real venue references: Main Palace, Wedding Lawn, Sangeet Arena,
   * Dining Pavilion, Celebration Promenade, and Valet Parking.
   */
  createArchitecturalSitePlanTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const W = canvas.width;
    const H = canvas.height;

    // Helper: convert 3D coordinates (x: -18 to +18, z: -12 to +12) to canvas coordinates
    const toCanvasX = (x) => ((x + 18) / 36) * W;
    const toCanvasY = (z) => ((z + 12) / 24) * H;
    const toCanvasW = (w) => (w / 36) * W;
    const toCanvasH = (h) => (h / 24) * H;

    // 1. Base Estate Ground (Deep luxury botanical forest turf)
    const baseGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, W * 0.08, W * 0.5, H * 0.5, W * 0.72);
    baseGrad.addColorStop(0, '#1d3627');
    baseGrad.addColorStop(0.4, '#172b20');
    baseGrad.addColorStop(0.8, '#101e16');
    baseGrad.addColorStop(1, '#0c1611');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle lawn mowing bands / striations for manicured estate turf
    ctx.fillStyle = 'rgba(32, 62, 44, 0.35)';
    for (let y = 0; y < H; y += 16) {
      if ((y / 16) % 2 === 0) {
        ctx.fillRect(0, y, W, 8);
      }
    }

    // 2. Peripheral Landscape Foliage Buffer
    ctx.fillStyle = 'rgba(10, 20, 15, 0.8)';
    ctx.fillRect(0, 0, W, toCanvasH(1.2));
    ctx.fillRect(0, H - toCanvasH(1.2), W, toCanvasH(1.2));
    ctx.fillRect(0, 0, toCanvasW(1.2), H);
    ctx.fillRect(W - toCanvasW(1.2), 0, toCanvasW(1.2), H);

    // 3. Roads & Arrival Drives (Valet parking access & south-east roadways)
    ctx.fillStyle = '#222624';
    ctx.beginPath();
    ctx.moveTo(toCanvasX(7), H);
    ctx.lineTo(toCanvasX(16.5), H);
    ctx.lineTo(toCanvasX(16.5), toCanvasY(4.5));
    ctx.lineTo(toCanvasX(5.5), toCanvasY(4.5));
    ctx.lineTo(toCanvasX(5.5), toCanvasY(10.5));
    ctx.lineTo(toCanvasX(7), H);
    ctx.fill();

    // Roadway center dash lines
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.45)';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(11.5), H);
    ctx.lineTo(toCanvasX(11.5), toCanvasY(5.2));
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Interconnecting Sandstone Pedestrian Walkways
    ctx.lineWidth = toCanvasW(1.35);
    ctx.strokeStyle = '#c2ad8b'; // Sandstone tone
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Walkway drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    // Spine from Entrance Promenade to Palace
    ctx.moveTo(toCanvasX(-1.8), toCanvasY(7));
    ctx.lineTo(toCanvasX(1.25), toCanvasY(-1));
    ctx.lineTo(toCanvasX(1.25), toCanvasY(-6));
    // Branch to Wedding Lawn
    ctx.moveTo(toCanvasX(-0.5), toCanvasY(3.4));
    ctx.lineTo(toCanvasX(-11.2), toCanvasY(3.4));
    // Branch from Wedding Lawn to Dining Pavilion
    ctx.moveTo(toCanvasX(-11.2), toCanvasY(1.5));
    ctx.lineTo(toCanvasX(-9.7), toCanvasY(-4));
    ctx.lineTo(toCanvasX(-9.7), toCanvasY(-6.5));
    // Branch from Palace to Dining
    ctx.moveTo(toCanvasX(-4), toCanvasY(-6));
    ctx.lineTo(toCanvasX(-7), toCanvasY(-6.8));
    // Branch to Sangeet Ground & Waterfront
    ctx.moveTo(toCanvasX(5), toCanvasY(-4));
    ctx.lineTo(toCanvasX(11.8), toCanvasY(-3.6));
    // Branch from Sangeet to Parking
    ctx.moveTo(toCanvasX(11.8), toCanvasY(0));
    ctx.lineTo(toCanvasX(11.8), toCanvasY(5.5));
    ctx.stroke();

    // Inner paver detail on walkways
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = toCanvasW(1.05);
    ctx.strokeStyle = '#d7c5a7';
    ctx.stroke();

    // Walkway gold trim edges
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.4)';
    ctx.stroke();

    // 5. Zone Footprints:
    // A. Main Palace Venue Plinth & Courtyard (North-Center: 1.25, -6.2, size: 14x10)
    const px = toCanvasX(1.25 - 7);
    const py = toCanvasY(-6.2 - 5);
    const pw = toCanvasW(14);
    const ph = toCanvasH(10);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#bda480'; // Sandstone courtyard base
    ctx.fillRect(px, py, pw, ph);

    // Courtyard ornamental tile border
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.7)';
    ctx.lineWidth = 4;
    ctx.strokeRect(px + 12, py + 12, pw - 24, ph - 24);

    // Geometric diamond paver pattern inside courtyard
    ctx.strokeStyle = 'rgba(160, 134, 98, 0.35)';
    ctx.lineWidth = 1.5;
    for (let d = px + 20; d < px + pw - 20; d += 28) {
      ctx.beginPath();
      ctx.moveTo(d, py + 16);
      ctx.lineTo(d + (ph - 32), py + ph - 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(d, py + ph - 16);
      ctx.lineTo(d + (ph - 32), py + 16);
      ctx.stroke();
    }

    // Palace Building Foundation Footprint (North side of courtyard)
    ctx.fillStyle = '#7a6448';
    ctx.fillRect(px + pw * 0.15, py + 16, pw * 0.7, ph * 0.42);
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 3;
    ctx.strokeRect(px + pw * 0.15, py + 16, pw * 0.7, ph * 0.42);

    // Central Royal Fountain in Courtyard
    const fcx = toCanvasX(1.25);
    const fcy = toCanvasY(-4.2);
    const fr = toCanvasW(1.8);
    ctx.fillStyle = '#9b8364';
    ctx.beginPath();
    ctx.arc(fcx, fcy, fr + 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c4f63'; // Turquoise fountain pool
    ctx.beginPath();
    ctx.arc(fcx, fcy, fr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // B. Royal Wedding Lawn & Mandap (West: -11.2, 3.4, size: 11x9.5)
    const wx = toCanvasX(-11.2 - 5.5);
    const wy = toCanvasY(3.4 - 4.8);
    const ww = toCanvasW(11);
    const wh = toCanvasH(9.6);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#264e32'; // Vibrant manicured wedding lawn
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(wx, wy, ww, wh, 24);
    } else {
      ctx.rect(wx, wy, ww, wh);
    }
    ctx.fill();

    // Gold Curbing Rim around Lawn
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(wx, wy, ww, wh, 24);
    } else {
      ctx.rect(wx, wy, ww, wh);
    }
    ctx.stroke();

    // Concentric Floral Rangoli & Mandap Platform in Center
    const mcx = toCanvasX(-11.2);
    const mcy = toCanvasY(3.4);
    const mr = toCanvasW(2.2);

    ctx.fillStyle = '#1e3d27';
    ctx.beginPath();
    ctx.arc(mcx, mcy, mr + 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d5a85c';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mandap dais square
    ctx.fillStyle = '#992222'; // Royal crimson mandap carpet
    ctx.fillRect(mcx - toCanvasW(1.8), mcy - toCanvasH(1.8), toCanvasW(3.6), toCanvasH(3.6));
    ctx.strokeStyle = '#ffd073';
    ctx.lineWidth = 3;
    ctx.strokeRect(mcx - toCanvasW(1.8), mcy - toCanvasH(1.8), toCanvasW(3.6), toCanvasH(3.6));

    // Amphitheater Curved Seating Rows
    ctx.strokeStyle = 'rgba(224, 202, 164, 0.55)';
    ctx.lineWidth = 3.5;
    [-toCanvasH(2.8), -toCanvasH(3.6), toCanvasH(2.8), toCanvasH(3.6)].forEach(offsetY => {
      ctx.beginPath();
      ctx.moveTo(wx + 30, mcy + offsetY);
      ctx.lineTo(wx + ww - 30, mcy + offsetY);
      ctx.stroke();
    });

    // C. Royal Dining Canopy & Banquet Pavilion (North-West: -9.7, -7.2, size: 9x9)
    const dcx = toCanvasX(-9.7);
    const dcy = toCanvasY(-7.2);
    const dr = toCanvasW(4.6);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#bda480'; // Sandstone dining terrace
    ctx.beginPath();
    ctx.arc(dcx, dcy, dr, 0, Math.PI * 2);
    ctx.fill();

    // Canopy roof outline & radial tension ribs
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(dcx, dcy, dr - 8, 0, Math.PI * 2);
    ctx.stroke();

    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(dcx, dcy);
      ctx.lineTo(dcx + Math.cos(ang) * (dr - 8), dcy + Math.sin(ang) * (dr - 8));
      ctx.stroke();
    }

    // Banquet Tables layout
    ctx.fillStyle = '#ecdcb9';
    for (let t = 0; t < 6; t++) {
      const tang = (t / 6) * Math.PI * 2;
      const tx = dcx + Math.cos(tang) * (dr * 0.58);
      const ty = dcy + Math.sin(tang) * (dr * 0.58);
      ctx.beginPath();
      ctx.arc(tx, ty, toCanvasW(0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c89b4a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // D. Sangeet Ground & Waterfront Arena (East: 11.8, -3.6, size: 10x8)
    const scx = toCanvasX(11.8);
    const scy = toCanvasY(-3.6);
    const sw = toCanvasW(10);
    const sh = toCanvasH(8.5);

    // Reflective Water Pool
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#163a4a'; // Deep reflective water
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(scx - sw * 0.5, scy - sh * 0.45, sw, sh * 0.9, 16);
    } else {
      ctx.rect(scx - sw * 0.5, scy - sh * 0.45, sw, sh * 0.9);
    }
    ctx.fill();

    // Timber Waterfront Deck
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#634226'; // Rich teak wood decking
    ctx.fillRect(scx - sw * 0.35, scy - sh * 0.15, sw * 0.7, sh * 0.55);
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(scx - sw * 0.35, scy - sh * 0.15, sw * 0.7, sh * 0.55);

    // Timber plank lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;
    for (let plx = scx - sw * 0.32; plx < scx + sw * 0.32; plx += 18) {
      ctx.beginPath();
      ctx.moveTo(plx, scy - sh * 0.15);
      ctx.lineTo(plx, scy + sh * 0.4);
      ctx.stroke();
    }

    // Concert Stage Footprint & Circular Truss
    ctx.fillStyle = '#222524';
    ctx.fillRect(scx - toCanvasW(1.8), scy - sh * 0.05, toCanvasW(3.6), toCanvasH(1.8));
    ctx.strokeStyle = '#ff6b8b';
    ctx.lineWidth = 2;
    ctx.strokeRect(scx - toCanvasW(1.8), scy - sh * 0.05, toCanvasW(3.6), toCanvasH(1.8));

    // Circular lighting truss ring
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(scx, scy + toCanvasH(0.8), toCanvasW(2.2), 0, Math.PI * 2);
    ctx.stroke();

    // E. Grand Entrance Promenade & Celebration Space (South-Center: -1.8, 6.8)
    const ex = toCanvasX(-1.8);
    const ey = toCanvasY(6.8);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#7a1f1f'; // Royal Crimson Red Carpet
    ctx.fillRect(ex - toCanvasW(1.3), ey - toCanvasH(4.5), toCanvasW(2.6), toCanvasH(9));
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(ex - toCanvasW(1.3), ey - toCanvasH(4.5), toCanvasW(2.6), toCanvasH(9));

    // Arched Gate Threshold Line
    ctx.fillStyle = '#c2ad8b';
    ctx.fillRect(ex - toCanvasW(2.2), ey + toCanvasH(3.6), toCanvasW(4.4), toCanvasH(0.6));

    // F. Valet Plaza & Guest Parking (South-East: 10.5, 7.5, size: 9x7)
    const pkx = toCanvasX(10.5 - 4.5);
    const pky = toCanvasY(7.5 - 3.5);
    const pkw = toCanvasW(9);
    const pkh = toCanvasH(7);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#202422'; // Dark asphalt parking lot
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(pkx, pky, pkw, pkh, 14);
    } else {
      ctx.rect(pkx, pky, pkw, pkh);
    }
    ctx.fill();

    // Gold Parking Bays & Staging Lines
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(pkx + 6, pky + 6, pkw - 12, pkh - 12, 10);
    } else {
      ctx.rect(pkx + 6, pky + 6, pkw - 12, pkh - 12);
    }
    ctx.stroke();

    // Individual Parking Stall Markings
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.4)';
    ctx.lineWidth = 2;
    for (let bx = pkx + 24; bx < pkx + pkw - 24; bx += 32) {
      ctx.beginPath();
      ctx.moveTo(bx, pky + 8);
      ctx.lineTo(bx, pky + toCanvasH(2.2));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx, pky + pkh - 8);
      ctx.lineTo(bx, pky + pkh - toCanvasH(2.2));
      ctx.stroke();
    }

    // 6. Architectural Labels & Metadata
    const drawZoneLabel = (text, subtext, lx, ly) => {
      ctx.save();
      ctx.font = '600 22px "Cormorant Garamond", Georgia, serif';
      const tw = ctx.measureText(text).width + 36;
      ctx.fillStyle = 'rgba(16, 23, 19, 0.82)';
      ctx.strokeStyle = 'rgba(201, 154, 82, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(lx - tw / 2, ly - 22, tw, 42, 6);
      } else {
        ctx.rect(lx - tw / 2, ly - 22, tw, 42);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f5eedd';
      ctx.textAlign = 'center';
      ctx.fillText(text, lx, ly - 2);

      if (subtext) {
        ctx.font = '500 12px "Inter", sans-serif';
        ctx.fillStyle = '#c89b4a';
        ctx.fillText(subtext, lx, ly + 14);
      }
      ctx.restore();
    };

    drawZoneLabel('01 • MAIN PALACE VENUE', 'ROYAL COURTYARD & FAÇADE', toCanvasX(1.25), toCanvasY(-8.5));
    drawZoneLabel('02 • WEDDING LAWN', 'CEREMONY & MANDAP ARENA', toCanvasX(-11.2), toCanvasY(8.8));
    drawZoneLabel('03 • SANGEET ARENA', 'CONCERT STAGE & WATERFRONT', toCanvasX(11.8), toCanvasY(-8.2));
    drawZoneLabel('04 • DINING PAVILION', 'VAULTED CANOPY BANQUET', toCanvasX(-9.7), toCanvasY(-10.2));
    drawZoneLabel('05 • CELEBRATION SPACE', 'GRAND ARRIVAL PROMENADE', toCanvasX(-1.8), toCanvasY(11.8));
    drawZoneLabel('06 • VALET & GUEST PARKING', '1,000+ VEHICLES', toCanvasX(10.5), toCanvasY(11.4));

    // 7. Site Plan Title Cartouche (Top-Left Corner)
    ctx.save();
    ctx.fillStyle = 'rgba(16, 23, 19, 0.9)';
    ctx.strokeStyle = 'rgba(201, 154, 82, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(30, 30, 430, 110, 10);
    } else {
      ctx.rect(30, 30, 430, 110);
    }
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#c89b4a';
    ctx.fillText('RAMANYAN FARM', 52, 64);

    ctx.font = '500 13px "Inter", sans-serif';
    ctx.fillStyle = '#f5eedd';
    ctx.fillText('14-ACRE LUXURY DESTINATION MASTER PLAN', 52, 88);
    ctx.fillStyle = 'rgba(201, 154, 82, 0.8)';
    ctx.fillText('NAVSARI, GUJARAT • ARCHITECTURAL 3D SITE MODEL', 52, 108);

    // Compass Rose (Top-Right Corner)
    const crx = W - 80;
    const cry = 80;
    ctx.strokeStyle = '#c89b4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(crx, cry, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#c89b4a';
    ctx.beginPath();
    ctx.moveTo(crx, cry - 32);
    ctx.lineTo(crx - 6, cry);
    ctx.lineTo(crx + 6, cry);
    ctx.fill();
    ctx.fillStyle = '#f5eedd';
    ctx.font = '700 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', crx, cry - 42);
    ctx.restore();

    // Subtle composite blend with aerial reference image if available
    try {
      const aerialImg = new Image();
      aerialImg.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.globalCompositeOperation = 'soft-light';
        ctx.drawImage(aerialImg, 0, 0, W, H);
        ctx.restore();
        if (this.sitePlanTexture) {
          this.sitePlanTexture.needsUpdate = true;
        }
      };
      aerialImg.src = 'assets/farm-map/aerial/05_Venue_Aerial_Night_Enhanced.png';
    } catch (e) {
      // Safe fallback if local image restricted
    }

    return canvas;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // Subtle sinusoidal breathing on 3D rings & floating jewel rotation
    this.markers.forEach((m, idx) => {
      // Elegant slow pulse (opacity 0.5 -> 1 -> 0.5)
      const pulseOpacity = 0.55 + Math.sin(elapsedTime * 2.0 + idx) * 0.4;
      m.ringMesh.material.opacity = pulseOpacity;

      const pulseScale = 1 + Math.sin(elapsedTime * 2.2 + idx) * 0.08;
      m.ringMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Gemstone rotation & subtle levitation
      m.jewelMesh.rotation.y = elapsedTime * 1.1 + idx * 0.8;
      m.jewelMesh.rotation.x = Math.sin(elapsedTime * 1.4 + idx) * 0.12;
      m.jewelMesh.position.y = m.initialY + Math.sin(elapsedTime * 1.8 + idx) * 0.07;
    });

    // Subtle particle drift
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.015;
    }

    // OrbitControls update (damping & autoRotate)
    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize);
  }
}

// Make globally available
window.Venue3DExplorer = Venue3DExplorer;
