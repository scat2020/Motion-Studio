import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const StudioTitle = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const line = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#070a0e' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(60% 55% at 50% 40%, rgba(87,169,255,0.14), transparent 70%)',
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: out }}>
        <div
          style={{
            fontFamily: 'ui-monospace, Consolas, monospace',
            fontSize: 13,
            letterSpacing: 8,
            color: '#7fb3e6',
            opacity: fade,
            marginBottom: 22,
          }}
        >
          20 REPOS · 1 STAGE
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 96,
            letterSpacing: 10,
            color: '#eaf2fa',
            fontWeight: 700,
            opacity: fade,
            transform: `translateY(${(1 - rise) * 70}px)`,
          }}
        >
          MOTION STUDIO
        </h1>
        <div
          style={{
            height: 2,
            width: `${line * 560}px`,
            marginTop: 26,
            background: 'linear-gradient(90deg, transparent, #57a9ff, #8b6cff, transparent)',
          }}
        />
        <div style={{ marginTop: 26, fontSize: 18, color: '#8c99a8', opacity: fade }}>
          想法 → 关键帧 → 运动 → 打磨 → 渲染
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
