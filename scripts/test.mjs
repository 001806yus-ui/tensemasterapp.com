import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
const temp = mkdtempSync(join(import.meta.dirname, '.test-'));
try {
  for (const file of ['tutor-retry.test.tsx', 'tutor-response.test.ts', 'chat.test.ts', 'localization.test.tsx', 'speech.test.tsx', 'transcribe.test.tsx', 'recorded-dictation.test.tsx', 'first-week.test.tsx', 'responsive-layout.test.tsx']) {
  const outfile = join(temp, file + '.mjs');
  await build({ entryPoints: [join(import.meta.dirname, '../tests', file)], outfile, bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: { '.jpg': 'dataurl', '.css': 'empty' }, define: { 'import.meta.env': JSON.stringify({ DEV: false }) }, jsx: 'automatic' });
  const result = spawnSync(process.execPath, [outfile], { stdio: 'inherit' });
  if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
  }
} finally { rmSync(temp, { recursive: true, force: true }); }
