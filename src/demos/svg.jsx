import React, { useEffect, useRef, useState } from 'react';

/* ---------- 08 Flubber ---------- */
const BLOB =
  'M 50 8 C 68 8 92 24 92 50 C 92 76 70 92 50 92 C 30 92 8 74 8 50 C 8 26 30 8 50 8 Z';
const STAR =
  'M 50 6 L 61 36 L 94 37 L 68 58 L 78 92 L 50 72 L 22 92 L 32 58 L 6 37 L 39 36 Z';

export function FlubberDemo() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    let dead = false;
    import('flubber').then(({ interpolate }) => {
      if (dead || !ref.current) return;
      const mix = interpolate(BLOB, STAR, { maxSegmentLength: 2 });
      const t0 = performance.now();
      const tick = (now) => {
        const p = ((now - t0) / 2400) % 1;
        const t = (1 - Math.cos(p * Math.PI * 2)) / 2;
        ref.current && ref.current.setAttribute('d', mix(t));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="center-stage">
      <svg viewBox="0 0 100 100" width="150" height="150">
        <defs>
          <linearGradient id="flub-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#57a9ff" />
            <stop offset="100%" stopColor="#8b6cff" />
          </linearGradient>
        </defs>
        <path ref={ref} d={BLOB} fill="url(#flub-g)" opacity="0.9" />
      </svg>
    </div>
  );
}

/* ---------- 11 Lottie ---------- */
const LOTTIE_DATA = {
  v: '5.7.4', fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: 'studio-pulse', ddd: 0, assets: [], markers: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: 'ring', sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [40, 40, 100], e: [140, 140, 100], i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } },
            { t: 40, s: [140, 140, 100], e: [40, 40, 100], i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } },
            { t: 60, s: [40, 40, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr', nm: 'ring-group', it: [
            { ty: 'el', nm: 'ellipse', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [96, 96] } },
            { ty: 'st', nm: 'stroke', c: { a: 0, k: [0.35, 0.66, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2 },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0, op: 60, st: 0, bm: 0,
    },
  ],
};

export function LottieDemo() {
  const holder = useRef(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    let anim = null;
    let dead = false;
    import('lottie-web').then((mod) => {
      const lottie = mod.default || mod;
      if (dead || !holder.current) return;
      try {
        anim = lottie.loadAnimation({
          container: holder.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: JSON.parse(JSON.stringify(LOTTIE_DATA)),
        });
      } catch (e) {
        setErr(String(e.message || e));
      }
    });
    return () => { dead = true; if (anim) anim.destroy(); };
  }, []);
  return (
    <div className="center-stage">
      <div ref={holder} style={{ width: 170, height: 170 }} />
      {err ? <div className="rive-fallback">{err}</div> : null}
    </div>
  );
}

/* ---------- 12 Rive ---------- */
export function RiveDemo() {
  const [mod, setMod] = useState(null);
  const [failed, setFailed] = useState('');
  useEffect(() => {
    let dead = false;
    import('@rive-app/react-canvas')
      .then((m) => { if (!dead) setMod(m); })
      .catch((e) => setFailed(String(e.message || e)));
    return () => { dead = true; };
  }, []);
  if (failed) {
    return <div className="center-stage"><div className="rive-fallback">Rive 运行时加载失败<br />{failed}</div></div>;
  }
  if (!mod) return <div className="center-stage"><div className="rive-fallback">正在载入 Rive 运行时…</div></div>;
  return <RiveStage mod={mod} onFail={setFailed} />;
}

function RiveStage({ mod, onFail }) {
  const { useRive, Layout, Fit } = mod;
  const [ready, setReady] = useState(false);
  const { RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain }),
    onLoad: () => setReady(true),
    onLoadError: () => onFail('示例 .riv 资源需要联网加载（cdn.rive.app）'),
  });
  return (
    <div className="stage-fill" style={{ position: 'absolute' }}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
      {!ready ? (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            color: '#5d6a78', font: '12px/1.7 -apple-system, "PingFang SC", sans-serif',
            background: '#070a0e', textAlign: 'center', padding: '0 20px',
          }}
        >
          正在载入官方示例 .riv …
        </div>
      ) : null}
    </div>
  );
}
