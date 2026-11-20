import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const FONT = '"Microsoft YaHei", "PingFang SC", -apple-system, "Helvetica Neue", sans-serif';
const MONO = 'ui-monospace, Consolas, "Cascadia Mono", monospace';
const BG = '#070a0e';
const TEXT = '#e9f0f8';
const MUTED = '#8c99a8';
const BLUE = '#57a9ff';
const PURPLE = '#8b6cff';
const OK = '#3ddc97';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Backdrop = () => (
  <>
    <AbsoluteFill
      style={{
        background: 'radial-gradient(62% 58% at 50% 38%, rgba(87,169,255,0.13), transparent 72%)',
      }}
    />
    <AbsoluteFill
      style={{
        background: 'radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  </>
);

/* ============ 1. 20 个仓库 → 一条线 ============ */
const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = new Array(20).fill(0).map((_, i) => {
    const h = 78 + ((i * 37) % 7) * 28;
    const grow = spring({ frame: frame - i * 2, fps, config: { damping: 18, mass: 0.6 } });
    return { h, grow, i };
  });

  const collapse = interpolate(frame, [56, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const lineW = interpolate(frame, [58, 84], [0, 680], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const tagOp = interpolate(frame, [74, 88], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const gap = 20;
  const barW = 12;
  const total = 20 * barW + 19 * gap;
  const startX = 960 - total / 2;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: interpolate(frame, [84, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}
    >
      {bars.map((b) => (
        <div
          key={b.i}
          style={{
            position: 'absolute',
            left: startX + b.i * (barW + gap),
            top: 540,
            width: barW,
            height: b.h,
            marginTop: -b.h,
            borderRadius: 4,
            background: `linear-gradient(180deg, ${BLUE}, ${PURPLE})`,
            transform: `scaleY(${b.grow * (1 - collapse)}) translateY(${collapse * 0}px)`,
            opacity: b.grow * (1 - collapse * 0.9),
            transformOrigin: 'center bottom',
            boxShadow: '0 0 18px rgba(87,169,255,0.35)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 540,
          width: lineW,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${BLUE}, ${PURPLE}, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 578,
          fontFamily: MONO,
          fontSize: 14,
          letterSpacing: 12,
          color: '#7fb3e6',
          opacity: tagOp,
        }}
      >
        20 REPOS
      </div>
    </AbsoluteFill>
  );
};

/* ============ 2. 标题 ============ */
const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const fade = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const track = interpolate(frame, [0, 40], [30, 8], { easing: ease, extrapolateRight: 'clamp' });
  const ruleW = interpolate(frame, [34, 66], [0, 640], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

  const chips = [
    { no: '①', label: '编排与渲染', tools: 'Remotion · Motion Canvas · Manim · Godot' },
    { no: '②', label: '动效原语', tools: 'Anime.js · Motion · Spring · mo.js · Lottie · Rive' },
    { no: '③', label: '形变与模拟', tools: 'Flubber · Three.js · Matter.js · 粒子 · 手绘 · 3D' },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 9, color: '#7fb3e6', opacity: fade, marginBottom: 26 }}>
        20 REPOS · 1 STAGE
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 96,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: track,
          opacity: fade,
          transform: `translateY(${(1 - rise) * 56}px)`,
        }}
      >
        MOTION STUDIO
      </div>
      <div style={{ width: ruleW, height: 2, marginTop: 26, background: `linear-gradient(90deg, transparent, ${BLUE}, ${PURPLE}, transparent)` }} />
      <div style={{ fontFamily: FONT, fontSize: 30, color: MUTED, marginTop: 26, opacity: fade }}>
        20 个开源仓库，一条从想法到成片的流水线
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 66 }}>
        {chips.map((c, i) => {
          const p = spring({ frame: frame - 62 - i * 8, fps, config: { damping: 16 } });
          return (
            <div
              key={c.no}
              style={{
                width: 470,
                padding: '20px 24px',
                borderRadius: 14,
                border: '1px solid rgba(87,169,255,0.22)',
                background: 'rgba(15,20,27,0.72)',
                transform: `translateY(${(1 - p) * 26}px)`,
                opacity: p,
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 15, color: '#9fc9ff', marginBottom: 8 }}>
                {c.no} {c.label}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{c.tools}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 3. 首屏实拍 → LIVE 区 ============ */
const HeroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const second = interpolate(frame, [112, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const zoomA = interpolate(frame, [0, 140], [1.02, 1.11], { easing: ease });
  const zoomB = interpolate(frame, [112, 180], [1.08, 1.0], { easing: ease });
  const cap = spring({ frame: frame - 18, fps, config: { damping: 15 } });
  const capB = spring({ frame: frame - 132, fps, config: { damping: 15 } });
  const win = spring({ frame: frame - 6, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ background: 'radial-gradient(64% 50% at 50% 34%, rgba(87,169,255,0.13), transparent 74%)' }} />

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: 92,
          height: 686,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(120,150,180,0.28)',
          boxShadow: '0 40px 110px rgba(0,0,0,0.65)',
          opacity: 0.55 + win * 0.45,
          transform: `translateY(${(1 - win) * 24}px)`,
        }}
      >
        <AbsoluteFill style={{ opacity: 1 - second }}>
          <Img
            src={staticFile('promo/promo-01-hero.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 16%', transform: `scale(${zoomA})`, filter: 'brightness(0.94)' }}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: second }}>
          <Img
            src={staticFile('promo/promo-02-live.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', transform: `scale(${zoomB})`, filter: 'brightness(0.94)' }}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(7,10,14,0.8), rgba(7,10,14,0) 16%)' }} />
        <AbsoluteFill style={{ boxShadow: 'inset 0 0 90px rgba(0,0,0,0.5)' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 846,
          opacity: (1 - second) * interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${(1 - cap) * 20}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 7, color: '#7fb3e6', marginBottom: 12 }}>THE STUDIO</div>
        <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: TEXT, letterSpacing: 1 }}>左边是工具柜，右边是舞台</div>
        <div style={{ fontFamily: FONT, fontSize: 25, color: '#a8b6c6', marginTop: 12 }}>
          20 个卡片，每张都能查到它的能力边界与命令
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 846,
          opacity: second * interpolate(frame, [120, 136], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${(1 - capB) * 20}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 7, color: '#a8e9cd', marginBottom: 12 }}>LIVE DEMOS · 12</div>
        <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: TEXT }}>参数、节奏、缓动，当场看得见</div>
        <div style={{ fontFamily: FONT, fontSize: 25, color: '#a8b6c6', marginTop: 12 }}>
          点「重播」换一次节奏，点「看代码」拿到可直接粘贴的源码
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 4. 教程三段 ============ */
const BEATS: {
  img: string;
  no: string;
  title: string;
  desc: string;
  note: string;
  zoom: number;
  origin: string;
  vigW: number;
  fit: 'cover' | 'contain' | 'fill';
}[] = [
  {
    img: 'promo/promo-07-anime-card.jpg',
    no: '01',
    title: '调参数',
    desc: '打开 LIVE 卡片，改一个数字就看到新节奏',
    note: 'anime.js · stagger 55 → 90',
    zoom: 1.0,
    origin: '50% 50%',
    vigW: 0,
    fit: 'contain',
  },
  {
    img: 'promo/promo-08-anime-code.jpg',
    no: '02',
    title: '抄代码',
    desc: '每张卡都带可复制源码，贴进你自己的项目',
    note: '一次性拿到最小可运行片段',
    zoom: 1.0,
    origin: '50% 50%',
    vigW: 0,
    fit: 'contain',
  },
  {
    img: 'promo/promo-04-pipeline.jpg',
    no: '03',
    title: '丢进总装',
    desc: '桌面端出序列帧，落进 assets/，Remotion 一次排片',
    note: 'manim → assets/manim/frame_0001.png',
    zoom: 1.0,
    origin: '50% 50%',
    vigW: 0,
    fit: 'contain',
  },
];

const TutorialScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(2, Math.floor(frame / 60));
  const local = frame - idx * 60;
  const b = BEATS[idx];

  const slide = spring({ frame: local, fps, config: { damping: 16 } });
  const fade = interpolate(local, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ background: 'radial-gradient(60% 60% at 30% 40%, rgba(139,108,255,0.12), transparent 70%)' }} />

      {/* 左栏文案 */}
      <div style={{ position: 'absolute', left: 96, top: 210, width: 620, opacity: fade, transform: `translateX(${(1 - slide) * -26}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 7, color: '#7fb3e6', marginBottom: 22 }}>
          HOW TO USE · {b.no}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 86, fontWeight: 700, color: TEXT, letterSpacing: 2 }}>{b.title}</div>
        <div style={{ fontFamily: FONT, fontSize: 30, color: '#c8d4e0', marginTop: 26, lineHeight: 1.5 }}>{b.desc}</div>
        <div
          style={{
            marginTop: 30,
            padding: '12px 18px',
            display: 'inline-block',
            borderRadius: 8,
            border: '1px solid rgba(87,169,255,0.24)',
            background: 'rgba(87,169,255,0.07)',
            fontFamily: MONO,
            fontSize: 15,
            color: '#9fc9ff',
          }}
        >
          {b.note}
        </div>
      </div>

      {/* 右栏截图 */}
      <div
        style={{
          position: 'absolute',
          right: 96,
          top: 150,
          width: 1020,
          height: 780,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          border: '1px solid rgba(120,150,180,0.25)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
          opacity: fade,
          transform: `translateY(${(1 - slide) * 26}px) scale(${0.985 + slide * 0.015})`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Img
            src={staticFile(b.img)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: b.fit,
              transform: `scale(${b.zoom * (0.98 + 0.02 * Math.min(1, local / 60))})`,
              transformOrigin: b.origin,
            }}
          />
        </div>
        {b.vigW > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, rgba(7,10,14,0.92), rgba(7,10,14,0.45) ${b.vigW / 2.2}%, rgba(7,10,14,0) ${b.vigW}%)`,
            }}
          />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.45)' }} />
      </div>

      {/* 进度点 */}
      <div style={{ position: 'absolute', left: 96, bottom: 96, display: 'flex', gap: 10 }}>
        {BEATS.map((x, i) => (
          <div
            key={x.no}
            style={{
              width: i === idx ? 46 : 14,
              height: 4,
              borderRadius: 2,
              background: i === idx ? BLUE : 'rgba(140,153,168,0.35)',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 5. 管线示意 ============ */
const PipelineScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  const boxes = [
    { x: 130, label: '① 桌面工具', sub: 'Manim · Blender\nOpenToonz · Synfig\nInochi2D · Godot' },
    { x: 730, label: '② 序列帧 / 视频', sub: 'assets/<工具>/\nframe_0001.png' },
    { x: 1330, label: '③ Remotion 出片', sub: 'out/*.mp4\n按时长任意重排' },
  ];

  const p1 = interpolate(frame, [14, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const p2 = interpolate(frame, [26, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const dot = (frame % 60) / 60;

  const clips = [
    { w: 360, c: BLUE, t: 'manim/frame_*' },
    { w: 270, c: PURPLE, t: 'blender/frame_*' },
    { w: 330, c: OK, t: 'lottie.json' },
    { w: 460, c: BLUE, t: 'promo 排片 · 900 帧' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        opacity: interpolate(frame, [138, 150], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}
    >
      <AbsoluteFill style={{ background: 'radial-gradient(70% 60% at 50% 42%, rgba(87,169,255,0.10), transparent 72%)' }} />

      <div style={{ position: 'absolute', top: 132, left: 0, right: 0, textAlign: 'center', opacity: fadeIn }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 8, color: '#7fb3e6', marginBottom: 20 }}>THE PIPELINE</div>
        <div style={{ fontFamily: FONT, fontSize: 62, fontWeight: 700, color: TEXT, letterSpacing: 1 }}>
          手绘、绑定、3D 都能进来，一条时间轴出片
        </div>
      </div>

      {boxes.map((b, i) => {
        const p = spring({ frame: frame - 6 - i * 8, fps, config: { damping: 16 } });
        return (
          <div
            key={b.label}
            style={{
              position: 'absolute',
              left: b.x,
              top: 400,
              width: 460,
              height: 176,
              borderRadius: 16,
              border: '1px solid rgba(87,169,255,0.22)',
              background: 'rgba(15,20,27,0.82)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
              padding: '24px 26px',
              transform: `translateY(${(1 - p) * 30}px)`,
              opacity: p,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: TEXT }}>{b.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, color: MUTED, marginTop: 16, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{b.sub}</div>
          </div>
        );
      })}

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {[
          { from: 592, to: 724, p: p1, color: BLUE },
          { from: 1192, to: 1324, p: p2, color: PURPLE },
        ].map((a) => (
          <g key={a.from} opacity={interpolate(a.p, [0, 0.15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <line
              x1={a.from}
              y1={488}
              x2={a.from + (a.to - a.from - 16) * a.p}
              y2={488}
              stroke={a.color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeOpacity={0.5}
            />
            {a.p > 0.6 ? <path d={`M ${a.to - 14} ${479} L ${a.to} ${488} L ${a.to - 14} ${497} Z`} fill={a.color} fillOpacity={0.85} /> : null}
            {a.p > 0.75 ? (
              <circle cx={a.from + dot * (a.to - a.from - 18)} cy={488} r={5.5} fill="#fff" opacity={0.9} />
            ) : null}
          </g>
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 636,
          width: 1660,
          opacity: interpolate(frame, [38, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 6, color: '#7fb3e6', marginBottom: 14 }}>
          TIMELINE · 30 SEC / 900 FR
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', height: 68 }}>
          {clips.map((c, i) => {
            const p = spring({ frame: frame - 44 - i * 6, fps, config: { damping: 17 } });
            return (
              <div
                key={c.t}
                style={{
                  width: c.w,
                  height: 68,
                  borderRadius: 10,
                  border: `1px solid ${c.c}55`,
                  background: `linear-gradient(180deg, ${c.c}26, ${c.c}0d)`,
                  padding: '12px 16px',
                  transform: `scaleX(${p})`,
                  transformOrigin: 'left center',
                  opacity: p,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 14, color: c.c, whiteSpace: 'nowrap' }}>{c.t}</div>
              </div>
            );
          })}
          <div
            style={{
              flex: 1,
              height: 68,
              borderRadius: 10,
              border: '1px dashed rgba(140,153,168,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: MONO,
              fontSize: 14,
              color: 'rgba(140,153,168,0.8)',
              opacity: interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            随时插新片段
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', opacity: interpolate(frame, [66, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div style={{ fontFamily: FONT, fontSize: 26, color: '#b9c6d4' }}>
          为什么不直接录屏？序列帧能重排节奏、改时长、补镜头 —— 返工不用回桌面软件
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 6. 落版 ============ */
const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 15 } });
  const fade = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: out }}>
      <div style={{ fontFamily: FONT, fontSize: 76, fontWeight: 700, color: TEXT, letterSpacing: 8, opacity: fade, transform: `translateY(${(1 - rise) * 40}px)` }}>
        MOTION STUDIO
      </div>
      <div style={{ width: interpolate(frame, [10, 40], [0, 560], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }), height: 2, margin: '26px 0 34px', background: `linear-gradient(90deg, transparent, ${BLUE}, ${PURPLE}, transparent)` }} />

      <div
        style={{
          fontFamily: MONO,
          fontSize: 26,
          color: '#9fc9ff',
          padding: '14px 26px',
          borderRadius: 10,
          border: '1px solid rgba(87,169,255,0.3)',
          background: 'rgba(87,169,255,0.08)',
          opacity: fade,
        }}
      >
        D:\AI Project\Video\motion-studio
      </div>

      <div style={{ display: 'flex', gap: 40, marginTop: 44, opacity: fade }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT, fontSize: 20, color: TEXT }}>双击即用</div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: MUTED, marginTop: 8 }}>motion-studio.html</div>
        </div>
        <div style={{ width: 1, background: 'rgba(140,153,168,0.25)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT, fontSize: 20, color: TEXT }}>要改代码</div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: MUTED, marginTop: 8 }}>npm run dev</div>
        </div>
        <div style={{ width: 1, background: 'rgba(140,153,168,0.25)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT, fontSize: 20, color: TEXT }}>要出片</div>
          <div style={{ fontFamily: MONO, fontSize: 15, color: MUTED, marginTop: 8 }}>remotion render</div>
        </div>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 8, color: 'rgba(140,153,168,0.7)', marginTop: 56, opacity: fade }}>
        20 REPOS · 1 STAGE · 想法 → 关键帧 → 运动 → 打磨 → 渲染
      </div>
    </AbsoluteFill>
  );
};

/* ============ 总装 ============ */
export const Promo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      <Backdrop />
      <Sequence durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <TitleScene />
      </Sequence>
      <Sequence from={270} durationInFrames={180}>
        <HeroScene />
      </Sequence>
      <Sequence from={450} durationInFrames={180}>
        <TutorialScene />
      </Sequence>
      <Sequence from={630} durationInFrames={150}>
        <PipelineScene />
      </Sequence>
      <Sequence from={780} durationInFrames={120}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
