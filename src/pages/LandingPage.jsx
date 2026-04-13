// ═══════════════════════════════════════════════════════
//  LandingPage — 3D Three.js Hero + Feature Showcase
// ═══════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// ── Feature data ──
const features = [
  {
    icon: '🧭',
    title: 'Smart Navigation',
    desc: 'AI-powered wayfinding with live crowd data to find the fastest routes.',
    color: '#3b82f6',
  },
  {
    icon: '🍔',
    title: 'Food Ordering',
    desc: 'Browse menus, order ahead, and skip the lines at every food stall.',
    color: '#f97316',
  },
  {
    icon: '⏱️',
    title: 'Queue Management',
    desc: 'Real-time queue tracking with browser notifications for your turn.',
    color: '#00d4ff',
  },
  {
    icon: '🚻',
    title: 'Washroom Booking',
    desc: 'Book washroom slots in advance and avoid crowded restrooms.',
    color: '#22c55e',
  },
  {
    icon: '🎮',
    title: 'Games & Rewards',
    desc: 'Spin the wheel, earn points, and win exclusive stadium prizes.',
    color: '#a855f7',
  },
  {
    icon: '🛡️',
    title: 'Emergency SOS',
    desc: 'Instant emergency alerts with nearest safe exit routes.',
    color: '#ef4444',
  },
];

// ── Three.js Scene Setup ──
function initThreeScene(canvasEl) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Particles ──
  const particleCount = 600;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyan = new THREE.Color('#00d4ff');
  const violet = new THREE.Color('#7c3aed');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const mixFactor = Math.random();
    const color = cyan.clone().lerp(violet, mixFactor);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ── Glowing Stadium Torus (Ring) ──
  const torusGeometry = new THREE.TorusGeometry(2.2, 0.07, 32, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: '#00d4ff',
    transparent: true,
    opacity: 0.4,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.rotation.x = Math.PI * 0.45;
  scene.add(torus);

  // Inner ring
  const innerTorusGeometry = new THREE.TorusGeometry(1.5, 0.04, 32, 80);
  const innerTorusMaterial = new THREE.MeshBasicMaterial({
    color: '#7c3aed',
    transparent: true,
    opacity: 0.3,
  });
  const innerTorus = new THREE.Mesh(innerTorusGeometry, innerTorusMaterial);
  innerTorus.rotation.x = Math.PI * 0.45;
  scene.add(innerTorus);

  // ── Orbiting dots ──
  const orbitDots = [];
  for (let i = 0; i < 6; i++) {
    const dotGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? '#00d4ff' : '#7c3aed',
      transparent: true,
      opacity: 0.9,
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.userData = {
      angle: (i / 6) * Math.PI * 2,
      radius: 2.2,
      speed: 0.3 + Math.random() * 0.2,
    };
    scene.add(dot);
    orbitDots.push(dot);
  }

  // ── Mouse tracking ──
  const mouse = { x: 0, y: 0 };
  const handleMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', handleMouseMove);

  // ── Animation loop ──
  const clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Rotate particles
    particles.rotation.y = elapsed * 0.05;
    particles.rotation.x = elapsed * 0.02;

    // Float torus
    torus.rotation.z = elapsed * 0.15;
    torus.position.y = Math.sin(elapsed * 0.5) * 0.15;

    innerTorus.rotation.z = -elapsed * 0.2;
    innerTorus.position.y = Math.sin(elapsed * 0.5 + 1) * 0.1;

    // Orbit dots
    orbitDots.forEach((dot) => {
      const { angle, radius, speed } = dot.userData;
      const currentAngle = angle + elapsed * speed;
      dot.position.x = Math.cos(currentAngle) * radius;
      dot.position.z = Math.sin(currentAngle) * radius * 0.4;
      dot.position.y =
        Math.sin(currentAngle) * radius * Math.sin(Math.PI * 0.45) +
        Math.sin(elapsed * 0.5) * 0.15;
    });

    // Mouse parallax
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize handler ──
  const handleResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  // ── Cleanup ──
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    torusGeometry.dispose();
    torusMaterial.dispose();
    innerTorusGeometry.dispose();
    innerTorusMaterial.dispose();
    orbitDots.forEach((d) => {
      d.geometry.dispose();
      d.material.dispose();
    });
  };
}

// ── Landing Page Component ──
export default function LandingPage() {
  const mountRef = useRef(null);
  const { continueAsGuest, loading } = useAuth();
  const navigate = useNavigate();

  // Initialize Three.js scene
  useEffect(() => {
    if (loading || !mountRef.current) return;
    
    // Create canvas dynamically to avoid StrictMode double-initialization bugs
    const canvasEl = document.createElement('canvas');
    canvasEl.className = "landing-canvas";
    // Inline styles just to be absolutely sure it covers the screen
    canvasEl.style.position = "fixed";
    canvasEl.style.top = "0";
    canvasEl.style.left = "0";
    canvasEl.style.width = "100vw";
    canvasEl.style.height = "100vh";
    canvasEl.style.zIndex = "0";
    canvasEl.style.pointerEvents = "none";
    
    mountRef.current.appendChild(canvasEl);

    let cleanup;
    try {
      cleanup = initThreeScene(canvasEl);
    } catch (err) {
      console.error("ThreeJS Error:", err);
    }

    return () => {
      if (cleanup) cleanup();
      if (mountRef.current && mountRef.current.contains(canvasEl)) {
        mountRef.current.removeChild(canvasEl);
      }
    };
  }, [loading]);

  const handleGuest = () => {
    continueAsGuest();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="landing-loader">
        <div className="landing-loader-ring" />
      </div>
    );
  }

  return (
    <div className="landing-page" style={{ background: 'transparent' }}>
      {/* ── Three.js Canvas Container ── */}
      <div ref={mountRef} />

      {/* ── Hero Content ── */}
      <div className="landing-content" style={{ zIndex: 1, position: 'relative' }}>
        <header className="landing-hero">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            LIVE EVENT EXPERIENCE
          </div>

          <h1 className="landing-title">
            <span className="landing-title-gradient">Smart Stadium</span>
          </h1>

          <p className="landing-subtitle">
            Your AI-powered companion for live events. Navigate smarter, eat faster,
            skip queues, and stay safe — all from your phone.
          </p>

          {/* ── Enter as Guest ── */}
          <div className="landing-auth-buttons">
            <button
              className="landing-btn-enter"
              onClick={handleGuest}
              id="btn-guest-continue"
              aria-label="Enter Smart Stadium as a guest"
            >
              <span className="landing-btn-enter-glow" />
              Enter Stadium
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <p className="landing-guest-note">
              No sign-in required — explore all features instantly
            </p>
          </div>
        </header>

        {/* ── Features Section ── */}
        <section className="landing-features" aria-label="App features">
          <div className="landing-section-label">
            <span>What You Get</span>
          </div>

          <div className="landing-features-grid">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="landing-feature-card"
                style={{
                  '--feat-color': feat.color,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="landing-feature-icon">{feat.icon}</div>
                <h3 className="landing-feature-title">{feat.title}</h3>
                <p className="landing-feature-desc">{feat.desc}</p>
                <div
                  className="landing-feature-glow"
                  style={{
                    background: `radial-gradient(circle, ${feat.color}15, transparent 70%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="landing-bottom-cta">
          <p>Ready to experience the future of live events?</p>
          <button
            className="landing-btn-enter"
            onClick={handleGuest}
            id="btn-enter-bottom"
          >
            <span className="landing-btn-enter-glow" />
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* ── Footer ── */}
        <footer className="landing-footer">
          <p>Smart Stadium © 2026 — Built for the future of live events</p>
        </footer>
      </div>
    </div>
  );
}
