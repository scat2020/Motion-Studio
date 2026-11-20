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
  /* ===================== ① 编排与渲染 ===================== */
  {
    id: 'remotion', no: '01', name: 'Remotion', group: 'stage', kind: 'pipe',
    repo: 'github.com/remotion-dev/skills', tagLabel: '视频合成',
    desc: '用 React 写视频：一切按帧可定址，Chromium 渲染出 MP4。它是整条流水线的总装车间，其它工具的产物在这里排版、配音、出片。',
    steps: [
      {
        title: '建项目', lang: 'bash', code: `npx create-video@latest --yes --blank --no-tailwind studio-clip
cd studio-clip
npm run dev          # 打开 Remotion Studio 实时预览`,
      },
      {
        title: '写合成', lang: 'tsx', code: `// src/StudioTitle.tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const StudioTitle = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 14 } });
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // 用 rise / fade 驱动样式，一切按帧计算，可重排
  return <AbsoluteFill style={{ background: '#070a0e', opacity: fade }} />;
};`,
      },
      {
        title: '注册 + 出片', lang: 'bash', code: `# src/Root.tsx 里注册：
# <Composition id="StudioTitle" component={StudioTitle}
#   durationInFrames={90} fps={30} width={1920} height={1080} />

npx remotion render StudioTitle out/title.mp4
npx remotion still  StudioTitle out/title.png   # 抽静帧做封面`,
      },
    ],
    note: '本仓库 remotion-starter/ 已备好可直接粘贴的三件套（Root / StudioTitle / index）。桌面工具导出的 PNG 序列放进 assets/ 后，用 <Img src={staticFile(...)} /> 或 <OffthreadVideo> 接入时间轴。',
    output: '产物 → out/*.mp4',
  },
  {
    id: 'motioncanvas', no: '05', name: 'Motion Canvas', group: 'stage', kind: 'pipe',
    repo: 'github.com/motion-canvas/motion-canvas', tagLabel: '代码动画',
    desc: '生成器写法（yield*）编排时间轴，天生适合技术讲解、流程图、逐句出现的字幕。比 Remotion 更像"写程序做动画"。',
    steps: [
      {
        title: '建场景', lang: 'bash', code: `npm init @motion-canvas@latest studio-scene
cd studio-scene
npm start          # 打开编辑器，改代码即时预览`,
      },
      {
        title: '最小场景', lang: 'tsx', code: `// src/scenes/example.tsx
import { makeScene2D, Circle, Txt } from '@motion-canvas/2d';
import { createRef, waitFor, easeOutBack } from '@motion-canvas/core';

export const Intro = makeScene2D(function* (view) {
  const ring = createRef<Circle>();
  view.add(<Circle ref={ring} size={120} lineWidth={6} stroke="#57a9ff" fill="#0a0c10" />);
  yield* ring().scale(1.4, 0.8, easeOutBack);
  yield* waitFor(0.5);
});`,
      },
      {
        title: '导出', lang: 'text', code: `编辑器右侧 Render 面板 → Image Sequence / Video
选 1920×1080 / 60fps，输出 PNG 序列到 assets/motioncanvas/
（需要嵌进 Remotion 时，导出序列而不是成片，方便逐帧对齐）`,
      },
    ],
    output: '产物 → PNG 序列 / MP4',
  },
  {
    id: 'manim', no: '06', name: 'Manim', group: 'stage', kind: 'pipe',
    repo: 'github.com/ManimCommunity/manim', tagLabel: '数学动画',
    desc: '数学可视化的事实标准：坐标系、公式变形、几何证明。它输出干净的 MP4，适合放进讲解片的知识段落。',
    steps: [
      { title: '安装', lang: 'bash', code: `pip install manim\n# 需要 ffmpeg 与 LaTeX（Windows 用 winget install ffmpeg / MikTeX）` },
      {
        title: '场景', lang: 'python', code: `# scene.py
from manim import *

class StudioIntro(Scene):
    def construct(self):
        title = Text("MOTION STUDIO", weight=BOLD).scale(1.1)
        ring = Circle(radius=1.4, color=BLUE, stroke_width=4)
        self.play(Create(ring), Write(title), run_time=2)
        self.play(ring.animate.scale(0.6).set_fill(BLUE, opacity=0.2))
        self.wait(0.6)`,
      },
      { title: '渲染', lang: 'bash', code: `manim -pqh scene.py StudioIntro
# 产物：media/videos/scene/1080p60/StudioIntro.mp4
# 想透明底：加 -t（输出 .mov，再在 Remotion 里叠）` },
    ],
    output: '产物 → MP4 / 透明 MOV',
  },
  {
    id: 'godot', no: '18', name: 'Godot', group: 'stage', kind: 'pipe',
    repo: 'github.com/godotengine/godot', tagLabel: '交互与游戏',
    desc: '当动效需要状态机、物理反馈、可交互预览时用它。AnimationPlayer / AnimationTree 做角色与 UI 动作，Movie Maker 直接录成视频。',
    steps: [
      { title: '动画系统', lang: 'text', code: `AnimationPlayer：关键帧轨道（位置 / 缩放 / 材质 / 方法调用）
AnimationTree：状态机 + BlendTree，做走路→跑步→跳跃的过渡
根节点挂 AnimationTree，参数用 set("parameters/...") 驱动` },
      {
        title: '录音级导出', lang: 'bash',
        code: `# Movie Maker：按固定帧率录制，不丢帧、可含音轨
godot --path . --write-movie out/anim.avi --fixed-fps 60 --quit-after 600
# 再用 ffmpeg 转 mp4（Remotion 也能直接读 avi）`,
      },
    ],
    note: 'Godot 的价值在于"可玩"，不在出片画质：交互 Demo 录屏 → 进 Remotion 当素材，或直接导出 Web 版给客户拖拽体验。',
    output: '产物 → AVI / Web 版',
  },

  /* ===================== ② 动效原语 ===================== */
  {
    id: 'animejs', no: '02', name: 'Anime.js', group: 'micro', kind: 'live',
    Component: AnimeDemo, stage: 'stagger · loop',
    repo: 'github.com/juliangarnier/anime', tagLabel: '时间线',
    desc: '轻量到可以塞进任何页面：一个 animate() 管住时间线、交错延迟和缓动。做节奏型动效（等化器、卡片依次入场）最快。',
    code: `import { animate, stagger } from 'animejs';

animate('.bar', {
  scaleY: [0.12, 1],
  duration: 900,
  delay: stagger(55),    // 交错：每根柱子晚 55ms
  loop: true,
  alternate: true,
  ease: 'inOutSine',
});`,
  },
  {
    id: 'motion', no: '03', name: 'Motion', group: 'micro', kind: 'live',
    Component: MotionDemo, stage: 'stagger · spring',
    repo: 'github.com/motiondivision/motion', tagLabel: '布局过渡',
    desc: 'Framer Motion 的原生版：命令式 animate() 和布局动画（layout）都强。适合列表重排、面板展开这类"位置会变"的过渡。',
    code: `import { animate, stagger } from 'motion';

animate('.dot',
  { y: [0, -26], opacity: [0.45, 1], scale: [1, 1.25] },
  { duration: 0.55, delay: stagger(0.06), repeat: Infinity,
    repeatType: 'reverse', ease: 'easeInOut' }
);`,
  },
  {
    id: 'spring', no: '04', name: 'React Spring', group: 'micro', kind: 'live',
    Component: SpringDemo, stage: 'useTrail · tension',
    repo: 'github.com/pmndrs/react-spring', tagLabel: '弹簧物理',
    desc: '把状态交给物理：tension / friction 决定手感，不用写关键帧。连续拖拽、跟手交互、trail 依次弹入的首选。',
    code: `import { useTrail, animated } from '@react-spring/web';

const springs = useTrail(6, {
  config: { tension: 290, friction: 17 },
  opacity: open ? 1 : 0.4,
  y: open ? 0 : 28,
  scale: open ? 1 : 0.86,
});

return springs.map((s, i) => (
  <animated.div style={s} key={i}>{i + 1}</animated.div>
));`,
  },
  {
    id: 'mojs', no: '07', name: 'mo.js', group: 'micro', kind: 'live',
    Component: MojsDemo, stage: 'burst · replay',
    repo: 'github.com/mojs/mojs', tagLabel: '爆发特效',
    desc: '为"一击即中"的特效而生：burst、swirl、shape 都能一行参数起爆。点赞、点击、成功反馈这类瞬时爆发很省事。',
    code: `import mojs from '@mojs/core';

new mojs.Burst({
  parent: stage, left: '50%', top: '50%',
  count: 12, radius: { 0: 78 },
  children: {
    shape: 'circle', radius: 5,
    fill: ['#57a9ff', '#8b6cff', '#3ddc97'],
    scale: { 0.5: 1.2 }, opacity: { 1: 0 },
    duration: 780, easing: 'cubic.out',
  },
}).play();`,
  },
  {
    id: 'kute', no: '09', name: 'KUTE.js', group: 'micro', kind: 'live',
    Component: KuteDemo, stage: 'fromTo · svg',
    repo: 'github.com/thednp/kute.js', tagLabel: 'SVG 补间',
    desc: '原生 JS 补间引擎：SVG 属性、CSS 变换、颜色都能 tween。体积极小（~40KB），适合放进对包体敏感的落地页。',
    code: `import * as kute from 'kute.js';
const KUTE = kute.default ?? kute;

KUTE.fromTo('#card',
  { opacity: 0.3, rotate: 0, scale: 0.55 },
  { opacity: 1, rotate: 360, scale: 1 },
  { duration: 1100, easing: 'easingCubicInOut' }
).start();`,
  },
  {
    id: 'animxyz', no: '10', name: 'AnimXYZ', group: 'micro', kind: 'live',
    Component: AnimxyzDemo, stage: 'css · utilities',
    repo: 'github.com/ingram-projects/animxyz', tagLabel: 'CSS 编排',
    desc: '用 CSS 变量编排：一个 xyz="fade flip-up" 就是一套入场动画，加 stagger 自动依次出现。零运行时开销。',
    code: `import '@animxyz/core/dist/animxyz.css';
import { XyzTransitionGroup } from '@animxyz/react';

<XyzTransitionGroup
  xyz="fade flip-up duration-3 stagger-1 ease-in-out-back"
  visible={on}
>
  {boxes.map((b) => <div className="box" key={b} />)}
</XyzTransitionGroup>`,
  },
  {
    id: 'lottie', no: '11', name: 'Lottie Web', group: 'micro', kind: 'live',
    Component: LottieDemo, stage: 'bodymovin json',
    repo: 'github.com/airbnb/lottie-web', tagLabel: '矢量播放',
    desc: '设计师在 AE 里做好，Bodymovin 导出 JSON，前端按帧渲染。跨端一致、可换色，插画型动效的主流方案。',
    code: `import lottie from 'lottie-web';

const anim = lottie.loadAnimation({
  container: el,
  renderer: 'svg',      // 也支持 canvas
  loop: true,
  autoplay: true,
  animationData,        // AE + Bodymovin 导出
});`,
  },
  {
    id: 'rive', no: '12', name: 'Rive Runtime', group: 'micro', kind: 'live',
    Component: RiveDemo, stage: 'state machine',
    repo: 'github.com/rive-app/rive-wasm', tagLabel: '状态机',
    desc: '不是播动画，是驱动状态机：输入参数（悬停、点击、速度）决定角色走哪条分支。交互角色、图标按钮的最强解。',
    code: `import { useRive, Layout, Fit } from '@rive-app/react-canvas';

const { RiveComponent } = useRive({
  src: '/assets/character.riv',
  stateMachine: 'bump',     // 状态机名（Rive 编辑器里命名）
  autoplay: true,
  layout: new Layout({ fit: Fit.Contain }),
});

return <RiveComponent />;`,
  },

  /* ===================== ③ 形变与模拟 ===================== */
  {
    id: 'flubber', no: '08', name: 'Flubber', group: 'phys', kind: 'live',
    Component: FlubberDemo, stage: 'path morph',
    repo: 'github.com/veltman/flubber', tagLabel: '形状变形',
    desc: '把两条 SVG 路径插值成一条平滑过渡路径。图标形态转换（播放→暂停、加法→对勾）靠它，不用做两套序列帧。',
    code: `import { interpolate } from 'flubber';

const mix = interpolate(blobPath, starPath, { maxSegmentLength: 2 });

// t: 0 → 1，逐帧写入 d 属性即可
pathEl.setAttribute('d', mix(t));`,
  },
  {
    id: 'three', no: '17', name: 'Three.js', group: 'phys', kind: 'live',
    Component: ThreeDemo, stage: 'webgl · procedural',
    repo: 'github.com/mrdoob/three.js', tagLabel: '3D 场景',
    desc: '浏览器里的 3D 底座：程序化几何 + 灯光就能出质感，不依赖模型文件。做产品旋转展示、空间背景的首选。',
    code: `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
camera.position.set(0, 0.4, 4.2);

const geo = new THREE.IcosahedronGeometry(1.05, 1);
const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
  color: 0x1d3f63, metalness: 0.65, roughness: 0.28, flatShading: true,
}));
const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(geo),
  new THREE.LineBasicMaterial({ color: 0x79c2ff })
);

const tick = () => {
  mesh.rotation.y += 0.011;
  wire.rotation.y += 0.011;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};`,
  },
  {
    id: 'matter', no: '19', name: 'Matter.js', group: 'phys', kind: 'live',
    Component: MatterDemo, stage: '2d rigid body',
    repo: 'github.com/liabru/matter-js', tagLabel: '2D 刚体',
    desc: '2D 刚体物理：重力、碰撞、约束。把"掉落的元素""可拖拽的积木"交给引擎，比自己写抛物线更稳、更好玩。',
    code: `import Matter from 'matter-js';

const engine = Matter.Engine.create();
const render = Matter.Render.create({
  element, engine,
  options: { width, height, wireframes: false, background: 'transparent' },
});
Matter.Composite.add(engine.world, [
  Matter.Bodies.circle(x, y, r, { restitution: 0.55, friction: 0.12 }),
  Matter.Bodies.rectangle(w / 2, h + 12, w, 24, { isStatic: true }), // 地面
]);
Matter.Render.run(render);
Matter.Runner.run(Matter.Runner.create(), engine);`,
  },
  {
    id: 'particles', no: '20', name: 'tsParticles', group: 'phys', kind: 'live',
    Component: ParticlesDemo, stage: 'links · hover grab',
    repo: 'github.com/tsparticles/tsparticles', tagLabel: '粒子',
    desc: '粒子系统的开箱版：连线、吸附、碰撞、鼠标交互全是配置项。背景氛围、加载等待、数据流动感的低成本做法。',
    code: `import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// v4 用 Provider 注册插件，不再有 initParticlesEngine
<ParticlesProvider init={async (engine) => { await loadSlim(engine); }}>
  <Particles
    id="bg"
    options={{
      particles: {
        number: { value: 46 },
        links: { enable: true, distance: 118, opacity: 0.42 },
        move: { speed: 1.5, outModes: { default: 'bounce' } },
      },
    }}
  />
</ParticlesProvider>`,
  },
  {
    id: 'inochi2d', no: '13', name: 'Inochi2D', group: 'phys', kind: 'pipe',
    repo: 'github.com/Inochi2D/inochi2d', tagLabel: '2D 木偶',
    desc: 'PSD 分层 → 网格绑定 → 参数化驱动，做出可眨眼、可对口型的 Live2D 式角色。配合面捕可实时驱动。',
    steps: [
      { title: '装 Inochi Creator', lang: 'text', code: `下载 Windows 版：https://inochi2d.com/download
打开后 New Project，导入分层 PSD（每层一个图层组）` },
      { title: '绑定与驱动', lang: 'text', code: `Deform 网格：给脸部/身体刷网格权重
Parameters：blink（眨眼）、mouthOpen（口型）、bodyAngleX（转头）
Inochi Session 可接 VMC / 面捕实时驱动` },
      { title: '导出给 Remotion', lang: 'text', code: `File → Export → PNG Sequence（30fps，透明底）
→ assets/inochi/pose_0001.png …
Remotion 里用 <Img src={staticFile('inochi/pose_' + frame + '.png')} /> 逐帧读`,
      },
    ],
    note: '逐帧序列比录屏可控得多：想改节奏只调 timeRemap，想改颜色只换导出设置。体积大时优先压 PNG（pngquant）。',
    output: '产物 → 透明 PNG 序列',
  },
  {
    id: 'opentoonz', no: '14', name: 'OpenToonz', group: 'phys', kind: 'pipe',
    repo: 'github.com/opentoonz/opentoonz', tagLabel: '手绘',
    desc: '专业手绘动画软件（吉卜力在用）：矢量/栅格描线、上色、摄影表（Xsheet）。手绘质感段落交给它。',
    steps: [
      { title: '准备', lang: 'text', code: `下载：https://opentoonz.github.io/
新建 Scene → 设置 1920×1080 / 24fps
画在 Toonz Raster 或 Toonz Vector Level 上` },
      { title: '上色与摄影表', lang: 'text', code: `Palette 里建色板 → 填色（Fill）
Xsheet 排帧，控制每张原画的持续时间` },
      { title: '导出', lang: 'text', code: `File → Export → Image Sequence（PNG，透明底）
注意：手绘常用 24fps，进 30fps 的片子要 3:2 拉长或补帧` },
    ],
    output: '产物 → 透明 PNG 序列',
  },
  {
    id: 'synfig', no: '15', name: 'Synfig', group: 'phys', kind: 'pipe',
    repo: 'github.com/synfig/synfig', tagLabel: '矢量补间',
    desc: '开源矢量动画：靠参数补间（形状、描边、渐变）出片，做扁平风格转场、无限循环背景很合适，可命令行批量渲染。',
    steps: [
      { title: '安装', lang: 'bash', code: `下载：https://www.synfig.org/
# 或包管理器：winget install Synfig.SynfigStudio` },
      { title: '做补间', lang: 'text', code: `新建 1920×1080
画形状 → 在 0s 和 2s 各打一个关键帧，改参数（半径/描边/位置）
Waypoints 默认 TCB 平滑，需要匀速改 Linear` },
      { title: '命令行渲染', lang: 'bash', code: `synfig render -o assets/synfig/frame_####.png --sequence-sep _ scene.sifz
# 或直接出片：synfig render out/loop.mp4 scene.sifz` },
    ],
    output: '产物 → PNG 序列 / MP4',
  },
  {
    id: 'blender', no: '16', name: 'Blender', group: 'phys', kind: 'pipe',
    repo: 'github.com/blender/blender', tagLabel: '3D 角色',
    desc: '唯一能把建模、绑定、角色动画、渲染全做齐的开源套件。角色循环动作（walk cycle）和 3D 转场都在这里出。',
    steps: [
      { title: '安装', lang: 'bash', code: `winget install BlenderFoundation.Blender
# 或官网下载：https://www.blender.org/download/` },
      { title: '绑定与动画', lang: 'text', code: `Rigify 生成骨架 → 蒙皮（自动权重）→ 修权重
Action 里 K 帧做 walk cycle，用 NLA 叠成可循环动作
Camera / 材质用 EEVEE 预览，出片切 Cycles` },
      { title: '无头渲染 & 导出', lang: 'bash', code: `# PNG 序列（透明底，直接进 Remotion）
blender -b rig.blend -o //assets/blender/#### -F PNG -s 1 -e 90 -a

# glTF 给 three.js 用
blender -b model.blend --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='assets/model.glb', export_format='GLB')"` },
    ],
    note: 'Blender 最容易被浪费的地方是"直接出成片"：先出 PNG 序列，剪辑与配乐都在 Remotion 里做，返工成本低一个数量级。',
    output: '产物 → PNG 序列 / GLB',
  },
];
