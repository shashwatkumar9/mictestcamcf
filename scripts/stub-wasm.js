#!/usr/bin/env node
/**
 * Replaces @vercel/og WASM and related files with minimal stubs.
 *
 * WHY: Next.js core bundles @vercel/og (resvg.wasm, yoga.wasm, index.edge.js)
 * unconditionally when building for edge runtimes. These files add ~2 MB to the
 * Cloudflare Worker bundle, pushing it over the free-plan 3 MiB gzip limit.
 * Since this project does NOT use next/og, replacing them with tiny stubs is safe.
 *
 * This script is run automatically via the "postinstall" npm hook.
 */

const fs = require('fs');
const path = require('path');

const OG_DIR = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'compiled',
  '@vercel',
  'og'
);

if (!fs.existsSync(OG_DIR)) {
  console.log('[stub-wasm] @vercel/og directory not found — skipping.');
  process.exit(0);
}

// Minimal valid WASM module (magic + version = 8 bytes)
const WASM_STUB = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

// JavaScript stub for index.edge.js — must not crash when imported
const JS_STUB = `// stub: @vercel/og not used in this project
export default null;
export const Resvg = null;
`;

const stubs = [
  { file: 'resvg.wasm', content: WASM_STUB },
  { file: 'yoga.wasm', content: WASM_STUB },
  { file: 'index.edge.js', content: Buffer.from(JS_STUB) },
  { file: 'noto-sans-v27-latin-regular.ttf.bin', content: Buffer.alloc(0) },
];

let changed = 0;
for (const { file, content } of stubs) {
  const filePath = path.join(OG_DIR, file);
  if (!fs.existsSync(filePath)) continue;

  const current = fs.readFileSync(filePath);
  if (current.equals(content)) continue; // already stubbed

  fs.writeFileSync(filePath, content);
  console.log(`[stub-wasm] Stubbed ${file} (${current.length} → ${content.length} bytes)`);
  changed++;
}

if (changed === 0) {
  console.log('[stub-wasm] @vercel/og files already stubbed — nothing to do.');
} else {
  console.log(`[stub-wasm] Done. Stubbed ${changed} file(s).`);
}
