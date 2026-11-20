import React, { useEffect, useRef } from 'react';
import Particles, { ParticlesProvider, useParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

/* ---------- 17 Three.js ---------- */
export function ThreeDemo() {
  const holder = useRef(null);
  useEffect(() => {
    let dead = false;
    let cleanup = () => {};
    import('three').then((THREE) => {
      if (dead || !holder.current) return;
      const el = holder.current;
      const w = el.clientWidth || 400;
      const h = el.clientHeight || 200;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 0.4, 4.2);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      el.appendChild(renderer.domElement);

      const geo = new THREE.IcosahedronGeometry(1.05, 1);
      const solid = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0x1d3f63, metalness: 0.65, roughness: 0.28, flatShading: true })
      );
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x79c2ff, transparent: true, opacity: 0.7 })
      );
      const group = new THREE.Group();
      group.add(solid, wire);

      scene.add(group);
      scene.add(new THREE.AmbientLight(0x22384f, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.PointLight(0x8b6cff, 12, 12);
      rim.position.set(-3, -2, 3);
      scene.add(rim);

      let raf = 0;
      const tick = () => {
        group.rotation.y += 0.011;
        group.rotation.x += 0.0045;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };

      const resize = () => {
        const nw = el.clientWidth;
        const nh = el.clientHeight;
        if (!nw || !nh) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh, false);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        geo.dispose();
        solid.material.dispose();
        wire.geometry.dispose();
        wire.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { dead = true; cleanup(); };
  }, []);
  return <div className="stage-fill" ref={holder} />;
}

/* ---------- 19 Matter.js ---------- */
export function MatterDemo() {
  const holder = useRef(null);
  useEffect(() => {
    let dead = false;
    let cleanup = () => {};
    let raf = 0;
    import('matter-js').then((mod) => {
      const M = mod.default || mod;
      if (dead || !holder.current) return;
      const el = holder.current;
      const W = Math.round(el.clientWidth) || 480;
      const H = Math.round(el.clientHeight) || 200;
      const dpr = Math.min(window.devicePixelRatio, 2);

      const canvas = document.createElement('canvas');
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      el.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const engine = M.Engine.create({ gravity: { y: 1 } });
      const wallOpt = { isStatic: true };
      const walls = [
        M.Bodies.rectangle(W / 2, H - 6, W, 12, wallOpt),
        M.Bodies.rectangle(4, H / 2, 8, H * 2, wallOpt),
        M.Bodies.rectangle(W - 4, H / 2, 8, H * 2, wallOpt),
      ];
      const palette = ['#57a9ff', '#8b6cff', '#3ddc97', '#f0b429'];
      const balls = [];
      for (let i = 0; i < 9; i += 1) {
        const r = 9 + Math.random() * 9;
        const b = M.Bodies.circle(30 + Math.random() * (W - 60), -20 - i * 40, r, {
          restitution: 0.5,
          friction: 0.08,
          density: 0.0012,
        });
        b.fill = palette[i % palette.length];
        balls.push(b);
      }
      M.Composite.add(engine.world, [...walls, ...balls]);

      const kick = () => {
        const b = balls[Math.floor(Math.random() * balls.length)];
        M.Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.06, y: -0.05 });
      };
      canvas.addEventListener('pointerdown', kick);

      const loop = () => {
        M.Engine.update(engine, 1000 / 60);
        ctx.clearRect(0, 0, W, H);

        ctx.fillStyle = 'rgba(36, 50, 68, 0.55)';
        ctx.fillRect(0, H - 12, W, 12);
        ctx.fillStyle = 'rgba(36, 50, 68, 0.3)';
        ctx.fillRect(0, 0, 4, H);
        ctx.fillRect(W - 4, 0, 4, H);

        for (let i = 0; i < balls.length; i += 1) {
          const b = balls[i];
          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, b.circleRadius, 0, Math.PI * 2);
          ctx.fillStyle = b.fill;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.28)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        canvas.removeEventListener('pointerdown', kick);
        M.Engine.clear(engine);
        canvas.remove();
      };
    });
    return () => { dead = true; cleanup(); };
  }, []);
  return <div className="stage-fill" ref={holder} />;
}

/* ---------- 20 tsParticles ---------- */
const PARTICLE_OPTIONS = {
  fullScreen: { enable: false },
  background: { color: 'transparent' },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 46, density: { enable: false } },
    color: { value: ['#57a9ff', '#8b6cff', '#3ddc97'] },
    links: { enable: true, distance: 118, color: '#57a9ff', opacity: 0.42, width: 1 },
    move: { enable: true, speed: 1.5, outModes: { default: 'bounce' } },
    size: { value: { min: 1, max: 3.2 } },
    opacity: { value: { min: 0.35, max: 0.9 } },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: 'grab' }, resize: { enable: true } },
    modes: { grab: { distance: 130, links: { opacity: 0.6 } } },
  },
};

export function ParticlesDemo() {
  return (
    <div className="stage-fill">
      <ParticlesProvider init={slimInit}>
        <ParticlesInner />
      </ParticlesProvider>
    </div>
  );
}

async function slimInit(engine) {
  await loadSlim(engine);
}

function ParticlesInner() {
  const { loaded } = useParticlesProvider();
  if (!loaded) {
    return <div className="center-stage"><div className="rive-fallback">粒子引擎启动中…</div></div>;
  }
  return (
    <Particles
      id="studio-particles"
      options={PARTICLE_OPTIONS}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
