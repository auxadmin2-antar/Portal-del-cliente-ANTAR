import { readFileSync, existsSync } from 'node:fs';
import { parseEnv } from 'node:util';

// Match production-build dotenv precedence; exported environment wins.
export function buildEnvironment() {
  const values = {};
  for (const file of ['.env', '.env.production', '.env.local', '.env.production.local']) {
    if (existsSync(file)) Object.assign(values, parseEnv(readFileSync(file, 'utf8')));
  }
  return { ...values, ...process.env };
}
