const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DEFAULT_OPTIONS = {
  workspace: path.resolve(__dirname, '../../testCodeApps/workspace'),
  environmentId: '91c808ac-8704-ea1c-bcd8-27eac0cddab8',
  repoUrl: 'https://github.com/microsoft/PowerAppsCodeApps.git',
  sampleRel: 'samples/HelloWorld',
  authMode: 'deviceCode',
};

let devProcess = null;
let devMeta = {
  running: false,
  startedAt: null,
  cwd: null,
  pid: null,
};

function logLine(logger, line) {
  if (logger) logger(line);
}

function runCommand(command, args, options = {}, logger) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...(options.env || {}) },
      shell: false,
      windowsHide: true,
    });

    child.stdout.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean);
      lines.forEach((line) => logLine(logger, line));
    });

    child.stderr.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean);
      lines.forEach((line) => logLine(logger, `[stderr] ${line}`));
    });

    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

async function commandExists(command) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  try {
    await runCommand(checker, [command]);
    return true;
  } catch (_err) {
    return false;
  }
}

async function requireCommands(commands, logger) {
  for (const command of commands) {
    const exists = await commandExists(command);
    if (!exists) {
      throw new Error(`${command} is not installed or not found in PATH.`);
    }
    logLine(logger, `[ok] ${command} found`);
  }
}

function buildSamplePath(options) {
  const repoName = path.basename(options.repoUrl, '.git');
  return {
    repoDir: path.join(options.workspace, repoName),
    samplePath: path.join(options.workspace, repoName, options.sampleRel),
  };
}

async function ensureRepo(options, logger) {
  if (!fs.existsSync(options.workspace)) {
    fs.mkdirSync(options.workspace, { recursive: true });
    logLine(logger, `[info] created workspace: ${options.workspace}`);
  }

  const { repoDir } = buildSamplePath(options);
  if (!fs.existsSync(repoDir)) {
    logLine(logger, `[run] git clone ${options.repoUrl}`);
    await runCommand('git', ['clone', options.repoUrl], { cwd: options.workspace }, logger);
  } else {
    logLine(logger, `[run] git pull`);
    await runCommand('git', ['pull'], { cwd: repoDir }, logger);
  }
}

async function installDependencies(options, logger) {
  const { samplePath } = buildSamplePath(options);
  if (!fs.existsSync(samplePath)) {
    throw new Error(`Sample path not found: ${samplePath}`);
  }

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  logLine(logger, '[run] npm install');
  await runCommand(npmCmd, ['install'], { cwd: samplePath }, logger);
}

async function ensurePowerConfig(options, logger) {
  const { samplePath } = buildSamplePath(options);
  const configPath = path.join(samplePath, 'power.config.json');
  if (fs.existsSync(configPath)) {
    logLine(logger, '[ok] power.config.json already exists');
    return;
  }

  const hasPac = await commandExists('pac');
  if (!hasPac) {
    logLine(logger, '[warn] pac not found; skip pac code init');
    return;
  }

  logLine(logger, "[run] pac code init --displayName 'HelloWorld Sample'");
  await runCommand('pac', ['code', 'init', '--displayName', 'HelloWorld Sample'], { cwd: samplePath }, logger);
}

async function ensurePacAuth(options, logger) {
  const hasPac = await commandExists('pac');
  if (!hasPac) {
    throw new Error('pac command not found. Please install Power Apps CLI.');
  }

  const args = ['auth', 'create', '--environment', options.environmentId];
  if (options.authMode === 'deviceCode') {
    args.push('--deviceCode');
  }
  if (options.authMode === 'none') {
    logLine(logger, '[warn] authMode=none selected; skip pac auth create');
    return;
  }

  logLine(logger, `[run] pac ${args.join(' ')}`);
  await runCommand('pac', args, {}, logger);
}

async function runPrepare(options = {}, logger) {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  await requireCommands(['git', 'node'], logger);
  await ensureRepo(merged, logger);
  await installDependencies(merged, logger);
  await ensurePowerConfig(merged, logger);
  logLine(logger, '[done] prepare completed');
}

async function runBuildAndPush(options = {}, logger) {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  await runPrepare(merged, logger);
  await ensurePacAuth(merged, logger);

  const { samplePath } = buildSamplePath(merged);
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  logLine(logger, '[run] npm run build');
  await runCommand(npmCmd, ['run', 'build'], { cwd: samplePath }, logger);

  logLine(logger, `[run] pac code push --environment ${merged.environmentId}`);
  await runCommand('pac', ['code', 'push', '--environment', merged.environmentId], { cwd: samplePath }, logger);

  logLine(logger, '[done] build and push completed');
}

async function startDevServer(options = {}, logger) {
  if (devProcess) {
    throw new Error('Dev server is already running.');
  }

  const merged = { ...DEFAULT_OPTIONS, ...options };
  await runPrepare(merged, logger);

  const { samplePath } = buildSamplePath(merged);
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  logLine(logger, '[run] npm run dev');
  devProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: samplePath,
    env: { ...process.env },
    shell: false,
    windowsHide: true,
  });

  devMeta = {
    running: true,
    startedAt: new Date().toISOString(),
    cwd: samplePath,
    pid: devProcess.pid,
  };

  devProcess.stdout.on('data', (data) => {
    data
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => logLine(logger, line));
  });

  devProcess.stderr.on('data', (data) => {
    data
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => logLine(logger, `[stderr] ${line}`));
  });

  devProcess.on('exit', () => {
    devProcess = null;
    devMeta = {
      running: false,
      startedAt: null,
      cwd: null,
      pid: null,
    };
  });
}

async function stopDevServer() {
  if (!devProcess) return false;
  devProcess.kill('SIGTERM');
  devProcess = null;
  devMeta = {
    running: false,
    startedAt: null,
    cwd: null,
    pid: null,
  };
  return true;
}

function getDevState() {
  return { ...devMeta };
}

module.exports = {
  DEFAULT_OPTIONS,
  runPrepare,
  runBuildAndPush,
  startDevServer,
  stopDevServer,
  getDevState,
};
