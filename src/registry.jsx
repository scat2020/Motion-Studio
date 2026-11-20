import {
  AnimeDemo, MotionDemo, SpringDemo, MojsDemo, KuteDemo, AnimxyzDemo,
} from './demos/dom.jsx';
import { FlubberDemo, LottieDemo, RiveDemo } from './demos/svg.jsx';
import { ThreeDemo, MatterDemo, ParticlesDemo } from './demos/canvas.jsx';

export const GROUPS = [
  { id: 'all', label: '全部 20' },
  { id: 'stage', label: '① 编排与渲染' },
  { id: 'micro', label: '② 动效原语' },
  { id: 'phys', label: '③ 形变与模拟' },
];

export const ITEMS = [
  /* ---------------- 01 Remotion ---------------- */
  {
    id: 'remotion',
    no: '01',
    name: 'Remotion',
    group: 'stage',
    kind: 'pipe',
    repo: 'github.com/remotion-dev/remotion',
    desc: '用 React 写视频：每一帧都是一个组件，时间轴就是 props。工作室的“渲染总装线”就在这里。',
    steps: [
      {
        title: '建工程',
        lang: 'bash',
        code: `npm create video@latest motion-starter
cd motion-starter && npm i`,
      },
      {
        title: '一支 3 秒片头',
        lang: 'tsx',
        code: `import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Title = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  const track = interpolate(frame, [0, 12], [30, 8], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#070a0e', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{
        color: '#e9f0f8', fontSize: 92, letterSpacing: track, margin: 0,
        transform: \`translateY(\${(1 - rise) * 40}px)\`, opacity: rise,
      }}>MOTION STUDIO</h1>
    </AbsoluteFill>
  );
};`,
      },
      {
        title: '注册 + 出片',
        lang: 'bash',
        code: `# Root.tsx 里 <Composition id="Title" component={Title} durationInFrames={90} fps={30}
#            width={1920} height={1080} />
npx remotion studio                 # 浏览器里逐帧预览
npx remotion render Title out/title.mp4`,
      },
    ],
    note: '首次渲染会自动下载约 150 MB 的 headless Chromium，属正常现象；之后走缓存。',
    output: 'out/title.mp4',
  },

  /* ---------------- 02 Anime.js ---------------- */
  {
    id: 'anime',
    no: '02',
    name: 'Anime.js',
    group: 'micro',
    kind: 'live',
    stage: 'DOM · 时间轴',
    repo: 'github.com/juliangarnier/anime',
    desc: '最省事的 DOM 时间轴：一组目标、一串关键帧、一个 stagger，条与条之间自然错开。',
    Component: AnimeDemo,
    code: `import { animate, stagger } from 'animejs';

animate('.bar', {
  scaleY: [0.12, 1],
  duration: 900,
  delay: stagger(55),
  loop: true,
  alternate: true,
  ease: 'inOutSine',
});`,
  },

  /* ---------------- 03 Motion ---------------- */
  {
    id: 'motion',
    no: '03',
    name: 'Motion',
    group: 'micro',
    kind: 'live',
    stage: 'DOM · 手势',
    repo: 'github.com/motiondivision/motion',
    desc: 'Framer Motion 的独立版本。animate() 能直接吃 DOM 节点，也能吃 React 组件；手势与布局动画是它的强项。',
    Component: MotionDemo,
    code: `import { animate, stagger } from 'motion';

animate(
  '.motion-dot',
  { y: [0, -26], opacity: [0.45, 1], scale: [1, 1.25] },
  {
    duration: 0.55,
    delay: stagger(0.06),
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  }
);`,
  },

  /* ---------------- 04 React Spring ---------------- */
  {
    id: 'spring',
    no: '04',
    name: 'React Spring',
    group: 'micro',
    kind: 'live',
    stage: 'React · 物理弹簧',
    repo: 'github.com/pmndrs/react-spring',
    desc: '不写时长，只写目标值和弹簧参数。useTrail 让一组元素依次出发，尾巴自然拖出来。',
    Component: SpringDemo,
    code: `import { useTrail, animated } from '@react-spring/web';

const springs = useTrail(6, {
  config: { tension: 290, friction: 17 },
  opacity: open ? 1 : 0.4,
  y: open ? 0 : 28,
  scale: open ? 1 : 0.86,
});

return springs.map((s, i) => <animated.div style={s} key={i} />);`,
  },

  /* ---------------- 05 Motion Canvas ---------------- */
  {
    id: 'motion-canvas',
    no: '05',
    name: 'Motion Canvas',
    group: 'stage',
    kind: 'pipe',
    repo: 'github.com/motion-canvas/motion-canvas',
    desc: '面向“讲解型”视频的编排器：用 generator 函数写时间线，yield 一下就是等一段时间，适合做技术解说。',
    steps: [
      {
        title: '建工程',
        lang: 'bash',
        code: `npm init @motion-canvas@latest
cd my-animation && npm i`,
      },
      {
        title: '时间线写成函数',
        lang: 'tsx',
        code: `import { makeScene2D } from '@motion-canvas/2d';
import { Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  view.add(<Txt ref={title} text="MOTION CANVAS" fontSize={90} fill="#e9f0f8" />);

  yield* title().opacity(0, 0).to(1, 1);       // 淡入 1 秒
yield* title().scale(0.9).to(1, 0.6);        // 放大 0.6 秒
  yield* waitFor(1);
});`,
      },
      {
        title: '出片',
        lang: 'bash',
        code: `npm start          # 打开编辑器逐帧调
yarn render        # 导出 mp4，默认进 output/`,
      },
    ],
    output: 'output/*.mp4',
  },

  /* ---------------- 06 Manim ---------------- */
  {
    id: 'manim',
    no: '06',
    name: 'Manim',
    group: 'stage',
    kind: 'pipe',
    repo: 'github.com/ManimCommunity/manim',
    desc: '3Blue1Brown 那套数学动画引擎。公式、坐标系、几何关系的动态推导，没有比它更顺手的。',
    steps: [
      {
        title: '装环境',
        lang: 'bash',
        code: `pip install manim           # 需要 ffmpeg + LaTeX
manim --version`,
      },
      {
        title: '一场推导',
        lang: 'python',
        code: `from manim import *

class Derive(Scene):
    def construct(self):
        formula = MathTex(r"e^{i\\pi} + 1 = 0")
        self.play(Write(formula), run_time=2)
        self.wait(1)
        self.play(formula.animate.set_color(YELLOW).scale(1.2))`,
      },
      {
        title: '渲段',
        lang: 'bash',
        code: `manim -pqh scene.py Derive      # -q 质量, -h 1080p, -p 自动播放
# 产物：media/videos/scene/1080p60/Derive.mp4`,
      },
    ],
    output: 'media/videos/**/*.mp4',
  },

  /* ---------------- 07 mo.js ---------------- */
  {
    id: 'mojs',
    no: '07',
    name: 'mo.js',
    group: 'micro',
    kind: 'live',
    stage: 'DOM/SVG · 爆发',
    repo: 'github.com/mojs/mojs',
    desc: '专为“爆一下”而生的动效库：Burst、Shape、Timeline，写庆祝动画时比手搓关键帧快得多。',
    Component: MojsDemo,
    code: `import mojs from '@mojs/core';

const burst = new mojs.Burst({
  left: '50%', top: '50%',
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

burst.play();`,
  },

  /* ---------------- 08 Flubber ---------------- */
  {
    id: 'flubber',
    no: '08',
    name: 'Flubber',
    group: 'phys',
    kind: 'live',
    stage: 'SVG · 形变',
    repo: 'github.com/veltman/flubber',
    desc: '把两个形状差异很大的 SVG 路径揉成一条可插值的路径，于是“一团变一颗星”变成 t 从 0 到 1 的事。',
    Component: FlubberDemo,
    code: `import { interpolate } from 'flubber';

const mix = interpolate(blobPath, starPath, { maxSegmentLength: 2 });

// 每帧：
path.setAttribute('d', mix(t));   // t: 0 → 1`,
  },

  /* ---------------- 09 KUTE.js ---------------- */
  {
    id: 'kute',
    no: '09',
    name: 'KUTE.js',
    group: 'micro',
    kind: 'live',
    stage: 'DOM · 补间',
    repo: 'github.com/thednp/kute.js',
    desc: '轻量补间引擎，transform 与属性动画都吃得下。浏览器里零依赖跑，适合当“最小可用”的兜底方案。',
    Component: KuteDemo,
    code: `import KUTE from 'kute.js';

KUTE.fromTo(
  box,
  { opacity: 0.3, rotate: 0, scale: 0.55 },
  { opacity: 1, rotate: 360, scale: 1 },
  { duration: 1100, easing: 'easingCubicInOut' }
).start();`,
  },

  /* ---------------- 10 AnimXYZ ---------------- */
  {
    id: 'animxyz',
    no: '10',
    name: 'AnimXYZ',
    group: 'micro',
    kind: 'live',
    stage: 'CSS · 声明式',
    repo: 'github.com/ingram-projects/animxyz',
    desc: '用一串类名描述动画：fade flip-up duration-3 stagger-1。不想写 JS 的时候，它最省事。',
    Component: AnimxyzDemo,
    code: `import { XyzTransitionGroup } from '@animxyz/react';
import '@animxyz/core/dist/animxyz.css';

<XyzTransitionGroup
  xyz="fade flip-up duration-3 stagger-1 ease-in-out-back"
  visible={on}
>
  {items.map((i) => <div className="box" key={i} />)}
</XyzTransitionGroup>`,
  },

  /* ---------------- 11 Lottie ---------------- */
  {
    id: 'lottie',
    no: '11',
    name: 'Lottie',
    group: 'micro',
    kind: 'live',
    stage: 'SVG · 设计交付',
    repo: 'github.com/airbnb/lottie-web',
    desc: '设计师在 AE 里做完，导出 JSON，前端一句 loadAnimation 就还原。这卡里的圆环是手写的 Lottie JSON，不依赖外网。',
    Component: LottieDemo,
    code: `import lottie from 'lottie-web';

lottie.loadAnimation({
  container: holder,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/anim/pulse.json',   // 或 animationData: {...}
});`,
  },

  /* ---------------- 12 Rive ---------------- */
  {
    id: 'rive',
    no: '12',
    name: 'Rive',
    group: 'micro',
    kind: 'live',
    stage: 'Canvas · 交互状态机',
    repo: 'github.com/rive-app/rive-react',
    desc: '带状态机的矢量动画：一个 .riv 文件里有 idle / hover / click 几条分支，运行时按输入切换。',
    Component: RiveDemo,
    code: `import { useRive, Layout, Fit } from '@rive-app/react-canvas';

const { RiveComponent } = useRive({
  src: '/anim/button.riv',
  stateMachines: 'Hover',
  autoplay: true,
  layout: new Layout({ fit: Fit.Contain }),
});

return <RiveComponent style={{ width: '100%', height: '100%' }} />;`,
    note: '这张卡加载的是 Rive 官方 CDN 上的示例 .riv，需要联网；离线时会显示提示文案。',
  },

  /* ---------------- 13 Inochi2D ---------------- */
  {
    id: 'inochi',
    no: '13',
    name: 'Inochi2D',
    group: 'phys',
    kind: 'pipe',
    repo: 'github.com/Inochi2D/inochi2d',
    desc: '实时 2D 骨骼绑定，专为“会呼吸的角色”设计：分层网格 + 变形参数，导出 PNG 序列后交给总装线。',
    steps: [
      {
        title: '装工具',
        lang: 'bash',
        code: `# 下载 Inochi Creator（Windows/macOS 发行版）
# 或从源码构建：
git clone https://github.com/Inochi2D/inochi-creator && cd inochi-creator
dub build`,
      },
      {
        title: '导出帧序列',
        lang: 'text',
        code: `Inochi Creator → File → Export Animation
  格式：PNG Sequence（透明底）
  帧率：30 fps
  输出：assets/inochi/`,
      },
    ],
    note: '命名规则必须是 frame_0001.png 这种补零格式，Remotion 才能按帧号顺序引用。',
    output: 'assets/inochi/*.png',
  },

  /* ---------------- 14 OpenToonz ---------------- */
  {
    id: 'opentoonz',
    no: '14',
    name: 'OpenToonz',
    group: 'phys',
    kind: 'pipe',
    repo: 'github.com/opentoonz/opentoonz',
    desc: '吉卜力在用的 2D 逐帧与特效合成软件。手绘、上色、摄影机移动、粒子特效，传统流程一条龙。',
    steps: [
      {
        title: '装软件',
        lang: 'bash',
        code: `# 官方发行版：opentoonz.github.io
# Linux 也可直接从源码：
git clone https://github.com/opentoonz/opentoonz && cd opentoonz
# 依赖 Qt5 + boost，照 CI 脚本里的 configure 跑`,
      },
      {
        title: '导出透明序列',
        lang: 'text',
        code: `Output Settings → 选 PNG序列
  Alpha Channel：勾选
  分辨率：按合成尺寸
  帧范围：与 Remotion 里的一致`,
      },
    ],
    output: 'assets/opentoonz/*.png',
  },

  /* ---------------- 15 Synfig ---------------- */
  {
    id: 'synfig',
    no: '15',
    name: 'Synfig',
    group: 'phys',
    kind: 'pipe',
    repo: 'github.com/synfig/synfig',
    desc: '参数化矢量动画：形状由数值驱动，改一个参数整条动画跟着变。适合做可复用的图表与图标动效。',
    steps: [
      {
        title: '装软件',
        lang: 'bash',
        code: `sudo apt install synfigstudio      # 或下载官方安装包
synfig --version`,
      },
      {
        title: '命令行渲帧',
        lang: 'bash',
        code: `synfig render \
  --target assets/synfig/frame_####.png \
  --quality 9 \
  scene.sifz`,
      },
    ],
    output: 'assets/synfig/frame_####.png',
  },

  /* ---------------- 16 Blender ---------------- */
  {
    id: 'blender',
    no: '16',
    name: 'Blender',
    group: 'phys',
    kind: 'pipe',
    repo: 'github.com/blender/blender',
    desc: '3D 场景、材质、粒子、摄像机运动。命令行 -b 无头模式可以批渲，把 PNG 序列丢给 Remotion 做合成。',
    steps: [
      {
        title: '无头批渲',
        lang: 'bash',
        code: `blender -b scene.blend \
  -o //assets/blender/frame_#### \
  -F PNG -x 1 \
  -s 1 -e 120 -a`,
      },
      {
        title: '透明底',
        lang: 'text',
        code: `Render Properties → Film → Transparent（勾上）
Output → RGBA
Color Management → 选 Standard，避免线性色彩进合成后发灰`,
      },
    ],
    note: '-o 后面是输出模板，#### 会被自动替换成帧号；-x 1 表示附加扩展名。',
    output: 'assets/blender/frame_####.png',
  },

  /* ---------------- 17 Three.js ---------------- */
  {
    id: 'three',
    no: '17',
    name: 'Three.js',
    group: 'phys',
    kind: 'live',
    stage: 'WebGL · 3D',
    repo: 'github.com/mrdoob/three.js',
    desc: '浏览器 3D 的事实标准。卡里是一个二十面体：实体 + 线框双层，两盏灯打轮廓，随帧自转。',
    Component: ThreeDemo,
    code: `import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
camera.position.z = 4.2;

const geo = new THREE.IcosahedronGeometry(1.05, 1);
const mesh = new THREE.Mesh(
  geo,
  new THREE.MeshStandardMaterial({ metalness: 0.65, roughness: 0.28, flatShading: true })
);
const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(geo),
  new THREE.LineBasicMaterial({ color: 0x79c2ff, transparent: true, opacity: 0.7 })
);
scene.add(new THREE.Group().add(mesh, wire));

const tick = () => {
  mesh.rotation.y += 0.011;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();`,
  },

  /* ---------------- 18 Godot ---------------- */
  {
    id: 'godot',
    no: '18',
    name: 'Godot',
    group: 'stage',
    kind: 'pipe',
    repo: 'github.com/godotengine/godot',
    desc: '开源游戏引擎，但它的 AnimationPlayer + Movie Maker 模式是一台很好的离线动效机：渲动画、渲 UI 过场、渲交互演示。',
    steps: [
      {
        title: '准备场景',
        lang: 'text',
        code: `新建 2D 场景 → 放节点 → AnimationPlayer 打关键帧
Project Settings → Editor → Movie Maker
  Movie Writer：PNG Sequence（或 MP4）
  FPS：30`,
      },
      {
        title: '命令行渲',
        lang: 'bash',
        code: `godot --path . --rendering-driver opengl3 \
  --write-movie assets/godot/frame_0001.png \
  res://main.tscn`,
      },
    ],
    note: 'Godot 4 的 --write-movie 会自动按帧号补零，和 assets/<tool>/frame_0001.png 的约定刚好对上。',
    output: 'assets/godot/frame_0001.png',
  },

  /* ---------------- 19 Matter.js ---------------- */
  {
    id: 'matter',
    no: '19',
    name: 'Matter.js',
    group: 'phys',
    kind: 'live',
    stage: 'Canvas · 2D 物理',
    repo: 'github.com/liabru/matter-js',
    desc: '2D 刚体物理引擎。小球下落、碰撞、堆叠，点一下舞台还能给它一脚力。做“东西掉下来”的镜头很好用。',
    Component: MatterDemo,
    code: `import Matter from 'matter-js';

const engine = Matter.Engine.create({ gravity: { y: 1 } });
const floor = Matter.Bodies.rectangle(W / 2, H - 6, W, 12, { isStatic: true });
const balls = Array.from({ length: 9 }, () =>
  Matter.Bodies.circle(rand(W), -20, rand(9, 18), { restitution: 0.5 })
);

Matter.Composite.add(engine.world, [floor, ...balls]);

const loop = () => {
  Matter.Engine.update(engine, 1000 / 60);
  draw();
  requestAnimationFrame(loop);
};`,
  },

  /* ---------------- 20 tsParticles ---------------- */
  {
    id: 'particles',
    no: '20',
    name: 'tsParticles',
    group: 'phys',
    kind: 'live',
    stage: 'Canvas · 粒子',
    repo: 'github.com/tsparticles/tsparticles',
    desc: '粒子系统全家桶：连线、斥力、吸附、爆散。背景氛围层用它铺，成本最低。',
    Component: ParticlesDemo,
    code: `import Particles, { ParticlesProvider, useParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

<ParticlesProvider init={async (e) => await loadSlim(e)}>
  <Particles
    options={{
      particles: {
        number: { value: 46 },
        links: { enable: true, distance: 118 },
        move: { enable: true, speed: 1.5 },
      },
      interactivity: { events: { onHover: { enable: true, mode: 'grab' } } },
    }}
  />
</ParticlesProvider>`,
  },
];
