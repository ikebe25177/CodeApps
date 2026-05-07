const path = require('path');
const express = require('express');
const { randomUUID } = require('crypto');
const {
  DEFAULT_OPTIONS,
  runPrepare,
  runBuildAndPush,
  startDevServer,
  stopDevServer,
  getDevState,
} = require('./src/codeAppsRunner');

const app = express();
const PORT = 8006;
const tasks = new Map();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    app: 'codeapps-tool',
    startedAt: new Date().toISOString(),
  });
});

app.get('/api/config', (_req, res) => {
  res.json(DEFAULT_OPTIONS);
});

app.get('/api/dev', (_req, res) => {
  res.json(getDevState());
});

app.post('/api/dev/start', async (req, res) => {
  const options = { ...DEFAULT_OPTIONS, ...(req.body || {}) };
  const lines = [];
  const log = (line) => {
    lines.push(line);
    if (lines.length > 200) lines.shift();
  };

  try {
    await startDevServer(options, log);
    return res.json({ ok: true, message: 'dev server started', logs: lines });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message, logs: lines });
  }
});

app.post('/api/dev/stop', async (_req, res) => {
  try {
    const stopped = await stopDevServer();
    res.json({ ok: true, stopped });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/tasks', (req, res) => {
  const action = req.body && req.body.action;
  const options = { ...DEFAULT_OPTIONS, ...((req.body && req.body.options) || {}) };
  if (!action || !['prepare', 'buildAndPush'].includes(action)) {
    return res.status(400).json({ ok: false, error: 'Unsupported action' });
  }

  const id = randomUUID();
  const task = {
    id,
    action,
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: null,
    logs: [],
    error: null,
  };
  tasks.set(id, task);

  const appendLog = (line) => {
    task.logs.push(line);
    if (task.logs.length > 500) task.logs.shift();
  };

  const runner = action === 'prepare' ? runPrepare : runBuildAndPush;
  runner(options, appendLog)
    .then(() => {
      task.status = 'succeeded';
      task.finishedAt = new Date().toISOString();
    })
    .catch((err) => {
      task.status = 'failed';
      task.error = err.message;
      task.finishedAt = new Date().toISOString();
      appendLog(`[error] ${err.message}`);
    });

  return res.status(202).json({ ok: true, id });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ ok: false, error: 'Task not found' });
  }
  return res.json(task);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeApps tool is running on 0.0.0.0:${PORT}`);
});
