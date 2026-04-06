import { build } from 'esbuild';

const requireShim = "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'cli/index.js',
  target: 'node22',
  minify: true,
  charset: 'utf8',
  legalComments: 'none',
  drop: ['debugger'],
  external: ['mysql2', 'pino-pretty'],
  sourcemap: false,
  banner: { js: `#!/usr/bin/env node\n${requireShim}` },
});