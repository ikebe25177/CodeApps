#!/usr/bin/env node

const {
  DEFAULT_OPTIONS,
  runPrepare,
  runBuildAndPush,
  startDevServer,
  stopDevServer,
} = require('./src/codeAppsRunner');

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  const options = { ...DEFAULT_OPTIONS };

  for (let i = 1; i < args.length; i += 1) {
    const token = args[i];
    const value = args[i + 1];

    if (!token.startsWith('--')) continue;
    if (!value || value.startsWith('--')) continue;

    const key = token.slice(2);
    if (key === 'workspace') options.workspace = value;
    if (key === 'environmentId') options.environmentId = value;
    if (key === 'repoUrl') options.repoUrl = value;
    if (key === 'sampleRel') options.sampleRel = value;
    if (key === 'authMode') options.authMode = value;
  }

  return { command, options };
}

function printHelp() {
  console.log(`CodeApps Node CLI

Usage:
  node codeapps-cli.js prepare [--workspace PATH] [--sampleRel PATH]
  node codeapps-cli.js buildAndPush [--environmentId ID] [--authMode deviceCode|interactive|none]
  node codeapps-cli.js startDev
  node codeapps-cli.js stopDev
`);
}

(async () => {
  const { command, options } = parseArgs(process.argv);
  const log = (line) => console.log(line);

  try {
    if (command === 'prepare') {
      await runPrepare(options, log);
      return;
    }

    if (command === 'buildAndPush') {
      await runBuildAndPush(options, log);
      return;
    }

    if (command === 'startDev') {
      await startDevServer(options, log);
      console.log('Dev server started. Keep this process running.');
      return;
    }

    if (command === 'stopDev') {
      const stopped = await stopDevServer();
      console.log(stopped ? 'Dev server stopped.' : 'No dev server process found.');
      return;
    }

    printHelp();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
