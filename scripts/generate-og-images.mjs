import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/og');
fs.mkdirSync(outDir, { recursive: true });

function createPng(width, height, drawFn) {
  const rowSize = width * 4 + 1;
  const raw = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter none
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    let c = 0xffffffff;
    for (let i = 0; i < body.length; i++) {
      c ^= body[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    c = (c ^ 0xffffffff) >>> 0;
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate 1200x630 synthwave artwork
function drawSynthwave(accentColor, type) {
  return (x, y, w, h) => {
    // Base gradient from dark night (#0a0418) to deep dusk (#241048)
    const yRatio = y / h;
    let r = Math.floor(10 + yRatio * 26);
    let g = Math.floor(4 + yRatio * 12);
    let b = Math.floor(24 + yRatio * 48);

    // Radial sunset/glow in the center-bottom
    const cx = w / 2;
    const cy = h * 0.65;
    const dx = (x - cx) / (w * 0.45);
    const dy = (y - cy) / (h * 0.45);
    const distSq = dx * dx + dy * dy;

    if (distSq < 1.0) {
      const glow = Math.pow(1.0 - Math.sqrt(distSq), 2);
      r = Math.min(255, r + Math.floor(accentColor[0] * glow * 0.8));
      g = Math.min(255, g + Math.floor(accentColor[1] * glow * 0.8));
      b = Math.min(255, b + Math.floor(accentColor[2] * glow * 0.8));
    }

    // Synthwave perspective grid lines at bottom 35%
    if (y > h * 0.65) {
      const gridY = y - h * 0.65;
      const rowStep = Math.floor(Math.pow(gridY / (h * 0.35), 2) * 15);
      if (gridY % 18 < 2) {
        r = Math.min(255, r + 45);
        g = Math.min(255, g + 20);
        b = Math.min(255, b + 65);
      }
      // Vertical converging lines
      const slope = (x - cx) / (gridY + 40);
      if (Math.abs(Math.sin(slope * 12)) > 0.96) {
        r = Math.min(255, r + 40);
        g = Math.min(255, g + 15);
        b = Math.min(255, b + 60);
      }
    }

    // Top border neon accent
    if (y < 4) {
      r = accentColor[0];
      g = accentColor[1];
      b = accentColor[2];
    }

    return [r, g, b, 255];
  };
}

const homePng = createPng(1200, 630, drawSynthwave([255, 46, 147], 'home'));
fs.writeFileSync(path.resolve(outDir, 'home.png'), homePng);

const cheatsPng = createPng(1200, 630, drawSynthwave([255, 138, 61], 'cheats'));
fs.writeFileSync(path.resolve(outDir, 'cheats.png'), cheatsPng);

const reviewsPng = createPng(1200, 630, drawSynthwave([139, 61, 255], 'reviews'));
fs.writeFileSync(path.resolve(outDir, 'reviews.png'), reviewsPng);

const charactersPng = createPng(1200, 630, drawSynthwave([255, 79, 122], 'characters'));
fs.writeFileSync(path.resolve(outDir, 'characters.png'), charactersPng);

const weaponsPng = createPng(1200, 630, drawSynthwave([255, 138, 61], 'weapons'));
fs.writeFileSync(path.resolve(outDir, 'weapons.png'), weaponsPng);

const mapPng = createPng(1200, 630, drawSynthwave([25, 230, 210], 'map'));
fs.writeFileSync(path.resolve(outDir, 'map.png'), mapPng);

console.log('[generate-og-images] Generated home.png, cheats.png, reviews.png, characters.png, weapons.png, map.png (1200x630)');
