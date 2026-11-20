import React from 'react';

/* ---------------- error boundary ---------------- */
export class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err: err };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="center-stage">
          <div className="rive-fallback">
            该示例在当前环境未能启动
            <br />
            <span style={{ color: '#f0b429' }}>{String(this.state.err.message || this.state.err)}</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------------- code block ---------------- */
export function Code({ text, open }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  if (!open) return null;
  return (
    <div className="code-panel">
      <pre>{text}</pre>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px 10px' }}>
        <button className="btn" onClick={copy}>{copied ? '已复制' : '复制代码'}</button>
      </div>
    </div>
  );
}

/* ---------------- live demo card ---------------- */
export function DemoCard({ item, active }) {
  const [showCode, setShowCode] = React.useState(false);
  const [key, setKey] = React.useState(0);
  return (
    <section className={'card' + (active ? ' active' : '')} id={'card-' + item.id}>
      <div className="card-head">
        <div className="card-title">
          <span className="no-badge">{item.no}</span>
          <h4>{item.name}</h4>
          <span className={'tag ' + (item.kind === 'live' ? 'live' : 'pipe')}>
            {item.kind === 'live' ? 'LIVE' : 'PIPELINE'}
          </span>
        </div>
        <p className="card-desc">{item.desc}</p>
        <div className="repo">{item.repo}</div>
      </div>

      {item.kind === 'live' ? (
        <div className="stage">
          <Boundary key={key}>
            <item.Component />
          </Boundary>
          <span className="stage-badge">stage · {item.stage}</span>
        </div>
      ) : (
        <div className="pipe-body">
          {item.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-h">
                <span className="dot" />
                <b>{s.title}</b>
                <em>{s.lang}</em>
              </div>
              <pre>{s.code}</pre>
            </div>
          ))}
        </div>
      )}

      {item.note ? <p className="note" style={{ marginTop: 12 }}>{item.note}</p> : null}

      <div className="card-foot">
        {item.kind === 'live' ? (
          <button className="btn primary" onClick={() => setKey((k) => k + 1)}>重播</button>
        ) : (
          <span className="hint">在终端执行上面的命令，产物放进 assets/ 供 Remotion 引用</span>
        )}
        {item.kind === 'live' && item.code ? (
          <button className="btn" onClick={() => setShowCode((v) => !v)}>
            {showCode ? '收起代码' : '看代码'}
          </button>
        ) : null}
        {item.output ? <span className="hint" style={{ marginLeft: 'auto' }}>{item.output}</span> : null}
      </div>

      {item.kind === 'live' ? <Code text={item.code} open={showCode} /> : null}
    </section>
  );
}
