#!/usr/bin/env node
// Compare two PNG screenshots and report how much actually changed.
//
// Zero dependencies — Node stdlib only. PNG decoding is ~50 lines of zlib.inflateSync
// plus unfiltering, which is cheaper than owning a dependency for it.
//
// Usage:
//   node ssim.mjs before.png after.png
//   node ssim.mjs before.png after.png --json --threshold 0.98
//   node ssim.mjs --selftest
//
// Exits 1 when content-masked SSIM falls below the threshold, so it works in CI.

import { readFileSync } from 'node:fs';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';

const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };   // greyscale, RGB, greyscale+A, RGBA

function decodePNG(buf) {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) throw new Error('not a PNG file');

  let off = 8, hdr = null;
  const idat = [];
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') hdr = { w: data.readUInt32BE(0), h: data.readUInt32BE(4),
                                 depth: data[8], color: data[9], interlace: data[12] };
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  if (!hdr) throw new Error('PNG has no IHDR chunk');
  // Screenshots from Chrome/Playwright/Firefox are always 8-bit non-interlaced. Anything
  // else is out of scope — fail loudly rather than decode it wrong and report a bogus score.
  if (hdr.depth !== 8) throw new Error(`unsupported bit depth ${hdr.depth} (need 8)`);
  if (hdr.interlace !== 0) throw new Error('interlaced PNG not supported');
  const ch = CHANNELS[hdr.color];
  if (!ch) throw new Error(`unsupported colour type ${hdr.color} (palette PNGs not supported)`);

  const raw = inflateSync(Buffer.concat(idat));
  const { w, h } = hdr, stride = w * ch;
  if (raw.length < h * (stride + 1)) throw new Error('PNG data truncated');

  const out = new Uint8Array(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1, dst = y * stride, up = dst - stride;
    for (let x = 0; x < stride; x++) {
      const rv = raw[src + x];
      const a = x >= ch ? out[dst + x - ch] : 0;
      const b = y > 0 ? out[up + x] : 0;
      const c = (x >= ch && y > 0) ? out[up + x - ch] : 0;
      let v;
      switch (filter) {
        case 0: v = rv; break;
        case 1: v = rv + a; break;
        case 2: v = rv + b; break;
        case 3: v = rv + ((a + b) >> 1); break;
        case 4: {                                   // Paeth
          const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v = rv + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break;
        }
        default: throw new Error(`bad PNG filter type ${filter} on row ${y}`);
      }
      out[dst + x] = v & 0xff;
    }
  }
  return { w, h, ch, px: out };
}

function toGrey({ w, h, ch, px }) {
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const p = i * ch;
    g[i] = ch < 3 ? px[p] : 0.299 * px[p] + 0.587 * px[p + 1] + 0.114 * px[p + 2];
  }
  return g;
}

const C1 = 6.5025, C2 = 58.5225;   // (0.01·255)² and (0.03·255)²

// Windowed SSIM. The content mask is the important part: on a page that is mostly flat
// background, whole-image SSIM is dominated by agreeing about empty space, so a real
// regression can hide behind a 0.99. Masking to windows that contain something exposes it.
function compare(a, b, w, h, { win = 8, stride = 4, contentStd = 6 } = {}) {
  let sumAll = 0, nAll = 0, sumC = 0, nC = 0;
  const worst = [];
  const n = win * win;
  for (let y = 0; y + win <= h; y += stride) {
    for (let x = 0; x + win <= w; x += stride) {
      let ma = 0, mb = 0;
      for (let j = 0; j < win; j++) {
        const row = (y + j) * w + x;
        for (let i = 0; i < win; i++) { ma += a[row + i]; mb += b[row + i]; }
      }
      ma /= n; mb /= n;
      let va = 0, vb = 0, cov = 0;
      for (let j = 0; j < win; j++) {
        const row = (y + j) * w + x;
        for (let i = 0; i < win; i++) {
          const da = a[row + i] - ma, db = b[row + i] - mb;
          va += da * da; vb += db * db; cov += da * db;
        }
      }
      va /= n - 1; vb /= n - 1; cov /= n - 1;
      const s = ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      sumAll += s; nAll++;
      if (Math.sqrt(Math.max(va, vb)) > contentStd) { sumC += s; nC++; worst.push([x, y, s]); }
    }
  }
  worst.sort((p, q) => p[2] - q[2]);
  return {
    full: nAll ? sumAll / nAll : 1,
    content: nC ? sumC / nC : 1,
    contentWindows: nC,
    changed: nC ? worst.filter(r => r[2] < 0.9).length / nC : 0,
    worst: worst.slice(0, 5),
  };
}

/* ── self-test: the decoder is the risky half, so round-trip a real PNG through it ── */
function encodePNG(w, h, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;                                  // filter: none
    rgba.copy ? rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
              : Buffer.from(rgba).copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

function selftest() {
  const ok = (cond, msg) => { if (!cond) { console.error(`FAIL: ${msg}`); process.exit(1); } };
  const W = 40, H = 24;
  // Stripes in a central band, flat background around it — the flat part is what the
  // content mask must throw away, so the fixture needs to have some.
  const mk = shift => {
    const px = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const band = y >= 8 && y < 20 && x >= 8 && x < 32;
      const v = band ? (((x + shift) >> 2) % 2 === 0 ? 240 : 12) : 18;
      px[i] = px[i + 1] = px[i + 2] = v; px[i + 3] = 255;
    }
    return px;
  };
  const a = mk(0);
  const dec = decodePNG(encodePNG(W, H, a));
  ok(dec.w === W && dec.h === H, 'decoded dimensions wrong');
  ok(Buffer.compare(Buffer.from(dec.px), a) === 0, 'PNG round-trip changed pixels');

  const ga = toGrey(dec);
  ok(Math.abs(compare(ga, ga, W, H).content - 1) < 1e-6, 'identical images must score 1.0');

  const gb = toGrey(decodePNG(encodePNG(W, H, mk(2))));
  const shifted = compare(ga, gb, W, H);
  ok(shifted.content < 0.9, `shifted image should score low, got ${shifted.content}`);
  ok(shifted.content < shifted.full, 'content mask must be stricter than full-frame here');
  console.log('selftest ok — png round-trip, ssim identity, shift detection, mask strictness');
}

/* ── cli ── */
const argv = process.argv.slice(2);
if (argv.includes('--selftest')) { selftest(); process.exit(0); }

const flag = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const files = argv.filter((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'));
if (files.length !== 2) {
  console.error('usage: node ssim.mjs <before.png> <after.png> [--threshold 0.95] [--json]');
  console.error('       node ssim.mjs --selftest');
  process.exit(2);
}

const threshold = Number(flag('--threshold', '0.95'));
const A = decodePNG(readFileSync(files[0]));
const B = decodePNG(readFileSync(files[1]));
if (A.w !== B.w || A.h !== B.h) {
  console.error(`size mismatch: ${A.w}×${A.h} vs ${B.w}×${B.h} — capture both at the same viewport`);
  process.exit(2);
}

const r = compare(toGrey(A), toGrey(B), A.w, A.h);
const pass = r.content >= threshold;

if (argv.includes('--json')) {
  console.log(JSON.stringify({ ...r, width: A.w, height: A.h, threshold, pass }, null, 2));
} else {
  const pct = n => `${(n * 100).toFixed(1)}%`;
  console.log(`\n${A.w}×${A.h}  ·  ${r.contentWindows} content windows\n`);
  console.log(`  full-frame SSIM       ${r.full.toFixed(4)}`);
  console.log(`  content-masked SSIM   ${r.content.toFixed(4)}   ← the one to read`);
  console.log(`  regions changed       ${pct(r.changed)}\n`);
  if (r.worst.length && r.worst[0][2] < 0.99) {
    console.log('  biggest differences (x, y, ssim):');
    for (const [x, y, s] of r.worst) console.log(`    ${String(x).padStart(5)}, ${String(y).padStart(5)}   ${s.toFixed(3)}`);
    console.log('');
  }
  console.log(pass ? `PASS  ${r.content.toFixed(4)} >= ${threshold}\n`
                   : `FAIL  ${r.content.toFixed(4)} < ${threshold}\n`);
}
process.exit(pass ? 0 : 1);
