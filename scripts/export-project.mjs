import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { components } from '../app/data/components.js';

const input = process.argv[2];
if (!input) throw new Error('Uso: node scripts/export-project.mjs <archivo.ui-vault.json>');

const project = JSON.parse(await readFile(resolve(input), 'utf8'));
if (!Array.isArray(project.blocks)) throw new Error('El archivo no es un proyecto válido de UI Vault.');

const root = resolve(import.meta.dirname, '..');
const slug = String(project.title || 'ui-vault-page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ui-vault-page';
const output = resolve(root, 'output', slug);
const sourcePath = (block) => block.sourcePath || components.find(({ id }) => id === block.componentId)?.path;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const className = (value) => ['paper', 'ink', 'muted'].includes(value) ? value : 'paper';
const isolateUrl = (block, path) => `./app/isolate.html?source=${encodeURIComponent(`../${path.replace(/^\.\//, '')}`)}&selector=${encodeURIComponent(block.selector)}`;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const usedPaths = [...new Set(project.blocks.map(sourcePath).filter(Boolean).map((path) => path.replace(/^\.\//, '').replace(/\/index\.html$/, '')))];
await Promise.all(usedPaths.map((path) => cp(resolve(root, path), resolve(output, path), { recursive: true })));
await Promise.all(['app/isolate.html', 'app/js/isolate.js'].map(async (path) => { const destination = resolve(output, path); await mkdir(dirname(destination), { recursive: true }); await cp(resolve(root, path), destination); }));

const blocks = project.blocks.map((block) => {
  const path = sourcePath(block); if (!path) return '';
  const height = Math.max(220, Math.min(860, Number(block.height) || 430));
  const source = block.selector ? isolateUrl(block, path) : `./${path.replace(/^\.\//, '')}`;
  return `<section class="block block--${className(block.background)}" style="--height:${height}px"><iframe src="${escapeHtml(source)}" title="${escapeHtml(block.name || 'Componente UI Vault')}" loading="lazy" allow="fullscreen"></iframe></section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(project.title || 'Página sin título')}</title><style>
*{box-sizing:border-box}html,body{margin:0;background:#f4f1ea}.block{height:var(--height);overflow:hidden;background:#fff}.block--ink{background:#1e211f}.block--muted{background:#e6e2d9}.block iframe{display:block;width:100%;height:100%;border:0;background:#fff}@media(max-width:580px){.block{height:min(var(--height),70vh)}}
</style></head><body>${blocks || '<main style="min-height:100vh;display:grid;place-items:center;font-family:system-ui"><p>Esta página no tiene bloques.</p></main>'}</body></html>`;
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, 'README.txt'), `Preview exportado desde UI Vault.\n\nÁbrelo con un servidor estático desde esta carpeta:\n  npx serve .\n\nLos componentes originales se han copiado sin modificar.\n`);
console.log(`Preview exportado: ${output}`);
