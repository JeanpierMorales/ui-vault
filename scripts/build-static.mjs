import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { components } from '../app/data/components.js';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const copy = async (from, to) => {
  const source = resolve(root, from);
  await stat(source);
  await mkdir(dirname(resolve(output, to)), { recursive: true });
  await cp(source, resolve(output, to), { recursive: true });
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  copy('index.html', 'index.html'),
  copy('app', 'app'),
  copy('.openai/hosting.json', '.openai/hosting.json'),
  ...components.map(({ path }) => {
    const directory = path.replace(/^\.\//, '').replace(/\/index\.html$/, '');
    return copy(directory, directory);
  }),
]);

console.log(`Static bundle ready: ${components.length} registered components.`);
