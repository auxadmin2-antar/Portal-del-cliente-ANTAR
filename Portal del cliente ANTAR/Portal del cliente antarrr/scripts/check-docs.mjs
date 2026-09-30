import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
}
const files = [...await walk('docs'), 'README.md', 'START_HERE.md', 'AGENTS.md', 'MASTER_PROMPT.md', 'STARTER_STATUS.md', 'supabase/README.md'];
let errors = 0;
for (const file of files.filter(name => name.endsWith('.md'))) {
  const text = await readFile(file, 'utf8');
  const refs = new Set(text.match(/(?:docs|supabase)\/[A-Za-z0-9_./-]+\.md\b/g) ?? []);
  for (const ref of refs) {
    try { await access(ref); }
    catch { console.error(`${file}: missing reference ${ref}`); errors++; }
  }
}
if (errors) process.exitCode = 1;
else console.log('Documentation references: OK');
