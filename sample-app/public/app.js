const { useEffect, useMemo, useState } = React;

function App() {
  const [status, setStatus] = useState('未確認');
  const [config, setConfig] = useState({
    workspace: '',
    environmentId: '',
    repoUrl: '',
    sampleRel: '',
    authMode: 'deviceCode',
  });
  const [taskId, setTaskId] = useState('');
  const [taskState, setTaskState] = useState('idle');
  const [taskLogs, setTaskLogs] = useState([]);
  const [devState, setDevState] = useState({ running: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadDefaults();
    refreshStatus();
    refreshDevState();
  }, []);

  useEffect(() => {
    if (!taskId) return undefined;

    const timer = setInterval(async () => {
      const res = await fetch(`/api/tasks/${taskId}`);
      if (!res.ok) return;
      const task = await res.json();
      setTaskState(task.status);
      setTaskLogs(task.logs || []);
      if (task.status !== 'running') {
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [taskId]);

  const canRunTask = useMemo(() => !busy && taskState !== 'running', [busy, taskState]);

  async function loadDefaults() {
    const res = await fetch('/api/config');
    const data = await res.json();
    setConfig(data);
  }

  async function refreshStatus() {
    setStatus('確認中...');
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('status failed');
      const data = await res.json();
      setStatus(`OK: ${data.app}`);
    } catch (_err) {
      setStatus('エラー');
    }
  }

  async function refreshDevState() {
    const res = await fetch('/api/dev');
    const data = await res.json();
    setDevState(data);
  }

  function updateConfig(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function runTask(action) {
    setBusy(true);
    setTaskLogs([]);
    setTaskState('running');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, options: config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'task start failed');
      setTaskId(data.id);
    } catch (err) {
      setTaskState('failed');
      setTaskLogs([`[error] ${err.message}`]);
    } finally {
      setBusy(false);
    }
  }

  async function startDev() {
    setBusy(true);
    try {
      const res = await fetch('/api/dev/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'start dev failed');
      setTaskLogs(data.logs || []);
      await refreshDevState();
    } catch (err) {
      setTaskLogs([`[error] ${err.message}`]);
    } finally {
      setBusy(false);
    }
  }

  async function stopDev() {
    setBusy(true);
    try {
      await fetch('/api/dev/stop', { method: 'POST' });
      await refreshDevState();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <p className="eyebrow">NODE CLI + REACT UI</p>
      <h1>CodeApps 実行コントロール</h1>
      <p className="lead">
        旧 PowerShell の処理を Node.js 側に寄せ、React UI から Prepare / Build&Push / Dev 起動を操作できます。
      </p>

      <section className="grid">
        <article className="panel">
          <h2>接続設定</h2>
          <label>
            Workspace
            <input value={config.workspace || ''} onChange={(e) => updateConfig('workspace', e.target.value)} />
          </label>
          <label>
            Environment ID
            <input value={config.environmentId || ''} onChange={(e) => updateConfig('environmentId', e.target.value)} />
          </label>
          <label>
            Repo URL
            <input value={config.repoUrl || ''} onChange={(e) => updateConfig('repoUrl', e.target.value)} />
          </label>
          <label>
            Sample Path
            <input value={config.sampleRel || ''} onChange={(e) => updateConfig('sampleRel', e.target.value)} />
          </label>
          <label>
            Auth Mode
            <select value={config.authMode || 'deviceCode'} onChange={(e) => updateConfig('authMode', e.target.value)}>
              <option value="deviceCode">deviceCode</option>
              <option value="interactive">interactive</option>
              <option value="none">none</option>
            </select>
          </label>
        </article>

        <article className="panel">
          <h2>アクション</h2>
          <div className="actions">
            <button disabled={!canRunTask} onClick={() => runTask('prepare')}>Prepare</button>
            <button disabled={!canRunTask} onClick={() => runTask('buildAndPush')}>Build & Push</button>
          </div>
          <div className="actions">
            <button disabled={busy || devState.running} onClick={startDev}>Start Dev</button>
            <button disabled={busy || !devState.running} onClick={stopDev}>Stop Dev</button>
          </div>
          <p className="meta">API status: {status}</p>
          <p className="meta">Task state: {taskState}</p>
          <p className="meta">Dev process: {devState.running ? `running (pid: ${devState.pid})` : 'stopped'}</p>
          <div className="actions">
            <button disabled={busy} onClick={refreshStatus}>APIステータス更新</button>
            <button disabled={busy} onClick={refreshDevState}>Dev状態更新</button>
          </div>
        </article>
      </section>

      <section className="panel log-panel">
        <h2>ログ</h2>
        <pre>{taskLogs.length ? taskLogs.join('\n') : 'ログはまだありません。'}</pre>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
