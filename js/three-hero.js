/**
 * RAMANYAN FARM — 3D Hero Interactive Scene
 * WebGL, Three.js, GSAP ScrollTrigger Integration
 */

class Hero3DExperience {
  constructor(canvasContainerId, fallbackId) {
    this.container = document.getElementById(canvasContainerId);
    this.fallback = document.getElementById(fallbackId);
    this.isWebGLAvailable = this.checkWebGL();
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mandapGroup = null;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    this.scrollProgress = 0;
    this.animationFrameId = null;
    this.isVisible = true;

    if (this.isWebGLAvailable && this.container) {
      try {
        this.init();
      } catch (err) {
        console.warn('Three.js Hero initialization error, falling back to 2D image:', err);
        this.showFallback();
      }
    } else {
      this.showFallback();
    }
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

  showFallback() {
    if (this.fallback) {
      this.fallback.style.opacity = '1';
    }
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene - NO DENSE BLACK FOG so everything is crisp and clear
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.baseCameraPos = { x: 0, y: 3.5, z: 26 };
    this.camera.position.set(this.baseCameraPos.x, this.baseCameraPos.y, this.baseCameraPos.z);
    this.cameraTarget = new THREE.Vector3(0, 3.5, 0);

    // 3. Renderer with transparent alpha
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // 100% transparent canvas!
    this.container.appendChild(this.renderer.domElement);

    // 4. Build 3D Royal Mandap Pavilion & Lighted Elements
    this.buildScene();

    // 5. Build 3D Floating Fairy Light Particles
    this.buildFairyLights();

    // 6. Lights
    this.setupLighting();

    // 7. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // 8. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xC99A52, 1.6);
    dirLight.position.set(15, 25, 20);
    this.scene.add(dirLight);

    // Warm golden central pointlights
    const mandapLight = new THREE.PointLight(0xFFAA44, 3.0, 35);
    mandapLight.position.set(0, 6, 2);
    this.scene.add(mandapLight);
  }

  buildScene() {
    this.mandapGroup = new THREE.Group();
    this.scene.add(this.mandapGroup);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x5a4515,
      emissiveIntensity: 0.35
    });

    const glowTrimMat = new THREE.MeshBasicMaterial({
      color: 0xFFE082
    });

    // Elevated Stage Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 14), goldMat);
    plinth.position.set(0, 0.6, 0);
    this.mandapGroup.add(plinth);

    // Front illuminated decorative scalloped arches
    for (let x = -9; x <= 9; x += 3) {
      const archRing = new THREE.TorusGeometry(1.2, 0.08, 12, 24, Math.PI);
      const archMesh = new THREE.Mesh(archRing, glowTrimMat);
      archMesh.position.set(x, 0.8, 7.05);
      this.mandapGroup.add(archMesh);
    }

    // Four Grand Ornate Carved Pillars
    const pillarPositions = [
      [-6, 0, 4], [6, 0, 4],
      [-6, 0, -4], [6, 0, -4],
      [-2.5, 0, 4.5], [2.5, 0, 4.5]
    ];

    pillarPositions.forEach(pos => {
      // Column Base
      const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.95, 0.8, 16), goldMat);
      baseMesh.position.set(pos[0], 1.6, pos[2]);
      this.mandapGroup.add(baseMesh);

      // Carved Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 6, 16), goldMat);
      shaft.position.set(pos[0], 4.8, pos[2]);
      this.mandapGroup.add(shaft);

      // Capital
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.6, 0.9, 16), goldMat);
      cap.position.set(pos[0], 8.2, pos[2]);
      this.mandapGroup.add(cap);
    });

    // Main Canopy Beam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(16, 0.9, 11), goldMat);
    beam.position.set(0, 8.8, 0);
    this.mandapGroup.add(beam);

    // Golden Central Royal Dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), goldMat);
    dome.position.set(0, 9.2, 0);
    this.mandapGroup.add(dome);

    // Dome Spire
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.2, 16), goldMat);
    spire.position.set(0, 13.5, 0);
    this.mandapGroup.add(spire);

    // Central Grand Floral Chandelier
    const chandelierMat = new THREE.MeshBasicMaterial({ color: 0xFFE082 });
    const chandelier = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 0.2, 3.2, 24, 1, true), chandelierMat);
    chandelier.position.set(0, 7.2, 0);
    this.mandapGroup.add(chandelier);
  }

  buildFairyLights() {
    // 500 shimmering golden particles
    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldPalette = [
      new THREE.Color(0xFFD700),
      new THREE.Color(0xFFA500),
      new THREE.Color(0xFFF8DC)
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 16 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const col = goldPalette[i % goldPalette.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, pMaterial);
    this.scene.add(this.particles);
  }

  onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    this.targetMouseX = normX * 1.2;
    this.targetMouseY = normY * 0.8;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    if (!this.isVisible) return;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Apply parallax
    this.camera.position.x = this.baseCameraPos.x + this.mouseX;
    this.camera.position.y = this.baseCameraPos.y + this.mouseY * 0.6;
    this.camera.position.z = this.baseCameraPos.z;

    this.camera.lookAt(this.cameraTarget);

    // Gently float fairy light particles
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const len = positions.length / 3;
      const time = performance.now() * 0.001;

      for (let i = 0; i < len; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.005;
        positions[i * 3] += Math.cos(time * 0.5 + i) * 0.003;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  pause() { this.isVisible = false; }
  resume() { this.isVisible = true; }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }
}

window.Hero3DExperience = Hero3DExperience;
