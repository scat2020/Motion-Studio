# remotion-starter · 总装车间

把各工具产出的 PNG 序列 / 视频 / 3D 渲染拼成一条成片的地方。

## 起项目

```bash
# 本目录已经是一个可用的 Remotion 项目骨架
cd remotion-starter
npm i
npm run dev          # 打开 Remotion Studio 预览 StudioTitle
npm run render       # 出片 → out/title.mp4
npm run still        # 抽静帧 → out/title.png
```

若想从零起一个新项目（带官方模板与 Agent Skills）：

```bash
npx create-video@latest --yes --blank --no-tailwind studio-clip
```

## 三个关键文件

| 文件 | 作用 |
|---|---|
| `src/index.ts` | `registerRoot`，Remotion 入口 |
| `src/Root.tsx` | 注册 `<Composition>`：id、帧数、fps、分辨率 |
| `src/StudioTitle.tsx` | 具体画面。用 `useCurrentFrame()` 拿帧号，纯函数式渲染 |

`src/Promo.tsx` 是那支 30 秒宣传片（900 帧，六段分镜）。

## 素材从哪儿来

`Promo` 里的截图引用 `public/promo/promo-*.jpg`（约 2.9 MB），为了不把仓库塞满，
位图不随代码分发。想重渲这道片子，得先生成素材：

```bash
# 1) 在仓库根目录把工作室打成单文件
npm run build                     # → dist/index.html

# 2) 用无头 Chrome 从这条页面截出素材
node scripts/capture-promo-card.mjs   # → remotion-starter/public/promo/*.jpg

# 3) 再进 Remotion 渲染
cd remotion-starter && npx remotion render Promo out/promo.mp4
```

只想看片子结构、不打算重渲的话，只跑 `StudioTitle` 就行：它不依赖任何外部图片。

## 接入外部素材

```tsx
import { Img, staticFile, OffthreadVideo } from 'remotion';

// 桌面工具的 PNG 序列 → 放 public/ 下，逐帧读
<Img src={staticFile(`inochi/pose_${String(frame).padStart(4, '0')}.png`)} />

// Manim / Godot / Blender 出的视频
<OffthreadVideo src={staticFile('manim/intro.mp4')} />
```

规则：**凡是能逐帧定址的，就走序列帧**；只有已经拍好、无法重排的东西才用 `<OffthreadVideo>`。

## 常用参数

```bash
# 只出一段（调试）
npx remotion render StudioTitle out/test.mp4 --frames=0-30

# 换分辨率 / 帧率
npx remotion render StudioTitle out/prores.mp4 --width=3840 --height=2160 --fps=60

# 透明底（ProRes 4444）
npx remotion render StudioTitle out/alpha.mov --codec=prores --prores-profile=4444
```
