import React, { useMemo, useState } from 'react';
import { GROUPS, ITEMS } from './registry.jsx';
import { DemoCard } from './components.jsx';

export default function App() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [active, setActive] = useState('');

  const ordered = useMemo(
    () => [...ITEMS].sort((a, b) => Number(a.no) - Number(b.no)),
    []
  );

  const visible = useMemo(() => {
    const key = q.trim().toLowerCase();
    return ordered.filter((it) => {
      const inGroup = group === 'all' || it.group === group;
      const hit = !key || [it.name, it.desc, it.repo, it.tagLabel, it.no].join(' ').toLowerCase().includes(key);
      return inGroup && hit;
    });
  }, [q, group, ordered]);

  const jump = (id) => {
    setActive(id);
    const el = document.getElementById('card-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="wrap">
      <aside className="side">
        <div className="brand">
          <div className="mark" />
          <div>
            <h1>Motion Studio</h1>
            <small>20 repos · 1 stage</small>
          </div>
        </div>
        <p className="side-note">
          左边是工具柜，右边是舞台。<br />
          带 LIVE 的能直接改参数看效果；带 PIPELINE 的在终端出片。所有产物汇总到 assets/，由 Remotion 总装。
        </p>
        {GROUPS.filter((g) => g.id !== 'all').map((g) => (
          <div className="nav-group" key={g.id}>
            <h3>{g.label}</h3>
            {ordered.filter((it) => it.group === g.id).map((it) => (
              <div
                key={it.id}
                className={'nav-item' + (active === it.id ? ' active' : '')}
                onClick={() => jump(it.id)}
              >
                <span className="no">{it.no}</span>
                <span className="nm">{it.name}</span>
              </div>
            ))}
          </div>
        ))}
      </aside>

      <main className="main">
        <div className="top">
          <div>
            <h2>动效工作室</h2>
            <div className="sub">20 个开源仓库 —— 从想法到成片的一条链</div>
          </div>
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜工具 / 用途，如 SVG、粒子、3D"
            />
          </div>
          <div className="pipeline">
            <span>想法</span><i>→</i><span>关键帧</span><i>→</i><span>运动</span>
            <i>→</i><span>打磨</span><i>→</i><span>渲染</span>
          </div>
        </div>

        <div className="chips">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              className={'chip' + (group === g.id ? ' on' : '')}
              onClick={() => setGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
          <span className="hint" style={{ marginLeft: 'auto', alignSelf: 'center' }}>
            显示 {visible.length} / 20
          </span>
        </div>

        <div className="grid">
          {visible.map((it) => (
            <DemoCard key={it.id} item={it} active={active === it.id} />
          ))}
        </div>

        {visible.length === 0 ? (
          <div style={{ padding: '60px 32px', color: '#5d6a78' }}>没有匹配的工具，换个关键词试试。</div>
        ) : null}
      </main>
    </div>
  );
}
