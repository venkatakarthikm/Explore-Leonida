import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const envExamplePath = resolve(root, '.env.example');

function parseEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const fileEnv = parseEnv(envPath);
const exampleEnv = parseEnv(envExamplePath);

export const SITE_URL = (process.env.SITE_URL || fileEnv.SITE_URL || exampleEnv.SITE_URL || 'https://leonidaguide.com').replace(/\/$/, '');
export const SITE_NAME = process.env.SITE_NAME || fileEnv.SITE_NAME || exampleEnv.SITE_NAME || 'LeonidaGuide';
export const GA_ID = process.env.GA_ID || fileEnv.GA_ID || exampleEnv.GA_ID || '';
