const path = require('path');
const express = require('express');

const app = express();
const PORT = 8006;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    app: 'sample-app',
    startedAt: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sample app is running on 0.0.0.0:${PORT}`);
});
