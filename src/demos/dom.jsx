import React, { useEffect, useRef, useState } from 'react';
import '@animxyz/core/dist/animxyz.css';
import { XyzTransitionGroup } from '@animxyz/react';
import { useTrail, animated } from '@react-spring/web';

/* ---------- 02 Anime.js ---------- */
export function AnimeDemo() {
  const ref = useRef(null);
  useEffect(() => {
    let anim = null;
    let dead = false;
    import('animejs').then(({ animate, stagger }) => {
      if (dead || !ref.current) return;
      anim = animate(ref.current.querySelectorAll('.bar'), {
        scaleY: [0.12, 1],
        duration: 900,
        delay: stagger(55),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      });
    });
    return () => {
      dead = true;
      try { anim && anim.cancel(); } catch (e) { /* noop */ }
    };
  }, []);
  return (
    <div className="center-stage">
      <div className="bars" ref={ref}>
        {[0, 1, 2, 3, 4, 5, 7].map((i) => <div className="bar" key={i} />)}
      </div>
    </div>
  );
}

/* ---------- 03 Motion ---------- */
export function MotionDemo() {
  const ref = useRef(null);
  useEffect(() => {
    let controls = null;
    let dead = false;
    import('motion').then(({ animate, stagger }) => {
      if (dead || !ref.current) return;
      controls = animate(
        ref.current.querySelectorAll('.motion-dot'),
        { y: [0, -26], opacity: [0.45, 1], scale: [1, 1.25] },
        { duration: 0.55, delay: stagger(0.06), repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
      );
    });
    return () => {
      dead = true;
      try { controls && controls.stop(); } catch (e) { /* noop */ }
    };
  }, []);
  return (
    <div className="center-stage">
      <div className="dots" ref={ref}>
        {[0, 1, 2, 3, 4, 5].map((i) => <div className="dot motion-dot" key={i} />)}
      </div>
    </div>
  );
}

/* ---------- 04 React Spring ---------- */
export function SpringDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setOpen((v) => !v), 850);
    return () => clearInterval(t);
  }, []);
  return <TrailBody open={open} />;
}

function TrailBody({ open }) {
  const items = [0, 1, 2, 3, 4, 5];
  const springs = useTrail(items.length, {
    config: { tension: 290, friction: 17 },
    opacity: open ? 1 : 0.4,
    y: open ? 0 : 28,
    scale: open ? 1 : 0.86,
  });
  return (
    <div className="center-stage">
      <div className="pill-row">
        {springs.map((s, i) => (
          <animated.div className="pill" key={i} style={s}>{String(i + 1).padStart(2, '0')}</animated.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 07 mo.js ---------- */
export function MojsDemo() {
  const ref = useRef(null);
  useEffect(() => {
    let dead = false;
    let burst = null;
    let timer = null;
    import('@mojs/core').then((mod) => {
      const mojs = mod.default || mod;
      if (dead || !ref.current) return;
      burst = new mojs.Burst({
        parent: ref.current,
        left: '50%',
        top: '50%',
        count: 12,
        radius: { 0: 78 },
        angle: { 0: 360 },
        children: {
          shape: 'circle',
          radius: 5,
          fill: ['#57a9ff', '#8b6cff', '#3ddc97'],
          scale: { 0.5: 1.2 },
          opacity: { 1: 0 },
          duration: 780,
          easing: 'cubic.out',
        },
      });
      const ring = new mojs.Shape({
        parent: ref.current,
        left: '50%',
        top: '50%',
        shape: 'circle',
        radius: { 0: 34 },
        stroke: '#57a9ff',
        strokeWidth: 2,
        opacity: { 0.9: 0 },
        duration: 900,
        easing: 'cubic.out',
      });
      burst.play();
      ring.play();
      timer = setInterval(() => { try { burst.replay(); ring.replay(); } catch (e) { /* noop */ } }, 1300);
    });
    return () => {
      dead = true;
      clearInterval(timer);
      try { burst && burst.el && burst.el.remove(); } catch (e) { /* noop */ }
    };
  }, []);
  return <div className="mojs-stage" ref={ref} />;
}

/* ---------- 09 KUTE.js ---------- */
export function KuteDemo() {
  const ref = useRef(null);
  useEffect(() => {
    let tween = null;
    let timer = null;
    let dead = false;
    import('kute.js').then((mod) => {
      const KUTE = mod.default || mod;
      if (dead || !ref.current) return;
      tween = KUTE.fromTo(
        ref.current,
        { opacity: 0.3, rotate: 0, scale: 0.55 },
        { opacity: 1, rotate: 360, scale: 1 },
        { duration: 1100, easing: 'easingCubicInOut' }
      ).start();
      timer = setInterval(() => { try { tween.start(); } catch (e) { /* noop */ } }, 1500);
    });
    return () => {
      dead = true;
      clearInterval(timer);
      try { tween && tween.stop(); } catch (e) { /* noop */ }
    };
  }, []);
  return (
    <div className="center-stage">
      <div
        ref={ref}
        style={{
          width: 92, height: 92, borderRadius: 16, display: 'grid', placeItems: 'center',
          background: 'linear-gradient(160deg, #57a9ff, #2a4f7d)',
          boxShadow: '0 0 26px rgba(87,169,255,.35)',
          font: '11px/1 ui-monospace, Consolas, monospace', color: '#dceeff',
        }}
      >
        KUTE
      </div>
    </div>
  );
}

/* ---------- 10 AnimXYZ ---------- */
export function AnimxyzDemo() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 1150);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="center-stage">
      <XyzTransitionGroup
        className="xyz-boxes"
        appear={false}
        xyz="fade flip-up duration-3 stagger-1 ease-in-out-back"
        visible={on}
      >
        {[0, 1, 2, 3, 4].map((i) => <div className="xyz-box" key={i} />)}
      </XyzTransitionGroup>
    </div>
  );
}
