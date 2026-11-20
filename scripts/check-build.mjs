import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('[check-build] Error: dist/ directory does not exist!');
  process.exit(1);
}

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(distDir);
console.log(`[check-build] Checking ${htmlFiles.length} HTML files in dist/...`);

let failed = false;
const titles = new Map();

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file);
  const content = fs.readFileSync(file, 'utf-8');

  // Strip <noscript> contents before checking <h1> to avoid counting fallback noscript h1
  const contentWithoutNoscript = content.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

  const errors = [];

  // 1. Check title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push('Missing or empty <title>');
  } else {
    const titleText = titleMatch[1].trim();
    if (titles.has(titleText)) {
      errors.push(`Duplicate <title>: "${titleText}" (also in ${titles.get(titleText)})`);
    } else {
      titles.set(titleText, relPath);
    }
  }

  // 2. Check meta description
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    content.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    errors.push('Missing or empty meta description');
  }

  // 3. Check canonical
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                         content.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (!canonicalMatch || !canonicalMatch[1].trim()) {
    errors.push('Missing or empty <link rel="canonical">');
  }

  // 4. Check exactly one <h1>
  const h1Matches = contentWithoutNoscript.match(/<h1[^>]*>/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;
  if (h1Count !== 1) {
    errors.push(`Expected exactly 1 <h1>, found ${h1Count}`);
  }

  // 5. Check og:image
  const ogImageMatch = content.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                       content.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (!ogImageMatch || !ogImageMatch[1].trim()) {
    errors.push('Missing or empty og:image');
  }

  // 6. Check JSON-LD
  const jsonLdMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!jsonLdMatch || !jsonLdMatch[1].trim()) {
    errors.push('Missing JSON-LD <script type="application/ld+json">');
  } else {
    try {
      JSON.parse(jsonLdMatch[1].trim());
    } catch (e) {
      errors.push(`Invalid JSON-LD syntax: ${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ ${relPath}:`);
    errors.forEach(e => console.error(`   - ${e}`));
    failed = true;
  } else {
    console.log(`✅ ${relPath}`);
  }
}

if (failed) {
  console.error('\n[check-build] Build check FAILED. One or more pages do not meet SEO standards.');
  process.exit(1);
} else {
  console.log('\n[check-build] All HTML pages passed validation: unique title, meta description, canonical, single h1, og:image, and JSON-LD.');
}
