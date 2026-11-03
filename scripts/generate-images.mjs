// Generates the stylised placeholder "photographs" in public/images/*.svg.
//
// WHY: this project was built without internet access to stock photography, so the demo uses
// consistent illustrated scenes instead. They share one visual treatment (emerald/gold/ivory).
// TO REPLACE WITH REAL PHOTOS: drop .jpg/.webp files into public/images and change the `src`
// values in src/config/venue.ts (gallery) and src/data/*.ts (rooms, spaces). Nothing else changes.
//
// Run: node scripts/generate-images.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 1200, H = 800;
mkdirSync('public/images', { recursive: true });

const defs = (id, top, bottom) => `
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <radialGradient id="glow${id}" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#F3DCA8" stop-opacity=".55"/><stop offset="1" stop-color="#F3DCA8" stop-opacity="0"/></radialGradient>
    <linearGradient id="floor${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B3B35"/><stop offset="1" stop-color="#0A1D19"/></linearGradient>
  </defs>`;

// Reusable pieces ------------------------------------------------------------
const arch = (x, y, w, h, stroke = '#C5A46D') =>
  `<path d="M${x} ${y + h} V${y + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y + h}" fill="#0E241F" stroke="${stroke}" stroke-width="3" opacity=".9"/>`;
const chandelier = (cx, cy, s = 1) => {
  let d = `<g stroke="#E8CC94" fill="#F3DCA8" stroke-width="2">`;
  d += `<line x1="${cx}" y1="0" x2="${cx}" y2="${cy}"/>`;
  d += `<ellipse cx="${cx}" cy="${cy + 10 * s}" rx="${60 * s}" ry="${14 * s}" fill="none"/>`;
  for (let i = -3; i <= 3; i++) d += `<circle cx="${cx + i * 18 * s}" cy="${cy + (10 - Math.abs(i) * 1.5) * s}" r="${4 * s}"/><line x1="${cx + i * 18 * s}" y1="${cy + 14 * s}" x2="${cx + i * 12 * s}" y2="${cy + 46 * s}" opacity=".6"/>`;
  return d + `</g>`;
};
const table = (cx, cy, r = 46) =>
  `<g><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.32}" fill="#F8F5EF"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.5}" ry="${r * 0.16}" fill="#C5A46D" opacity=".8"/>` +
  [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return `<circle cx="${cx + Math.cos(a) * (r + 14)}" cy="${cy + Math.sin(a) * (r * 0.32 + 8)}" r="9" fill="#DDE5DC" opacity=".9"/>`; }).join('') + `</g>`;
const stars = (n, seed = 3) => { let s = seed, d = ''; for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; const x = (s / 233280) * W; s = (s * 9301 + 49297) % 233280; const y = (s / 233280) * 260; d += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(s % 3) * 0.5 + 0.8}" fill="#F3DCA8" opacity=".7"/>`; } return d; };
const frame = (id, body, top = '#17403A', bottom = '#0A1D19') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${defs(id, top, bottom)}<rect width="${W}" height="${H}" fill="url(#bg${id})"/><rect width="${W}" height="${H}" fill="url(#glow${id})"/>${body}<rect width="${W}" height="${H}" fill="none" stroke="#C5A46D" stroke-opacity=".25" stroke-width="2"/></svg>`;
const floor = (id, y = 560) => `<rect y="${y}" width="${W}" height="${H - y}" fill="url(#floor${id})"/><line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#C5A46D" stroke-opacity=".5"/>`;

const scenes = {
  // Main hall: arches, chandeliers, banquet tables
  hall: frame('a', arch(120, 180, 150, 380) + arch(525, 150, 150, 410) + arch(930, 180, 150, 380) + floor('a') + chandelier(300, 90, 1.1) + chandelier(900, 90, 1.1) + chandelier(600, 60, 1.4) + table(250, 640) + table(600, 700, 56) + table(950, 640)),
  // Wedding stage: floral arch + sofa
  stage: frame('b', stars(40) + floor('b', 600) +
    `<path d="M300 600 V300 a300 300 0 0 1 600 0 V600" fill="none" stroke="#C5A46D" stroke-width="6"/>` +
    Array.from({ length: 26 }, (_, i) => { const a = Math.PI + (i / 25) * Math.PI; return `<circle cx="${600 + Math.cos(a) * 300}" cy="${300 + Math.sin(a) * 300}" r="${12 + (i % 3) * 4}" fill="${i % 2 ? '#F8F5EF' : '#DDE5DC'}" opacity=".95"/>`; }).join('') +
    `<rect x="480" y="470" width="240" height="90" rx="18" fill="#F8F5EF"/><rect x="480" y="440" width="240" height="40" rx="14" fill="#E9E2D3"/><rect x="440" y="600" width="320" height="16" fill="#C5A46D" opacity=".7"/>` + chandelier(200, 80, 0.8) + chandelier(1000, 80, 0.8), '#1F544C', '#0A1D19'),
  // Decoration: draped fabric and candles
  decor: frame('c', Array.from({ length: 9 }, (_, i) => `<path d="M${i * 150} 0 Q${i * 150 + 75} 160 ${i * 150 + 150} 0" fill="#F8F5EF" opacity=".16" stroke="#C5A46D" stroke-opacity=".5"/>`).join('') + floor('c', 600) +
    Array.from({ length: 11 }, (_, i) => `<g><rect x="${90 + i * 100}" y="${520 - (i % 3) * 30}" width="14" height="${80 + (i % 3) * 30}" fill="#F8F5EF"/><ellipse cx="${97 + i * 100}" cy="${505 - (i % 3) * 30}" rx="9" ry="16" fill="#F3DCA8"/><circle cx="${97 + i * 100}" cy="${505 - (i % 3) * 30}" r="34" fill="#F3DCA8" opacity=".12"/></g>`).join('') + table(600, 690, 120), '#17403A', '#0A1D19'),
  // Dining: long table with place settings
  dining: frame('d', chandelier(300, 80, 1) + chandelier(900, 80, 1) + floor('d', 520) +
    `<polygon points="150,640 1050,640 1120,720 80,720" fill="#F8F5EF"/><polygon points="150,640 1050,640 1000,590 200,590" fill="#E9E2D3"/>` +
    Array.from({ length: 8 }, (_, i) => `<ellipse cx="${260 + i * 100}" cy="615" rx="26" ry="8" fill="#fff" stroke="#C5A46D"/><rect x="${255 + i * 100}" y="565" width="10" height="40" rx="5" fill="#DDE5DC"/>`).join('') + arch(60, 200, 120, 320) + arch(1020, 200, 120, 320)),
  // Hotel room: bed, windows
  room: frame('e', `<rect x="760" y="140" width="300" height="330" fill="#0E241F" stroke="#C5A46D" stroke-width="3"/><line x1="910" y1="140" x2="910" y2="470" stroke="#C5A46D" stroke-width="2"/><line x1="760" y1="305" x2="1060" y2="305" stroke="#C5A46D" stroke-width="2"/>` + floor('e', 520) +
    `<rect x="140" y="380" width="520" height="150" rx="10" fill="#F8F5EF"/><rect x="140" y="330" width="520" height="70" rx="10" fill="#C5A46D" opacity=".85"/><rect x="170" y="395" width="150" height="60" rx="14" fill="#DDE5DC"/><rect x="340" y="395" width="150" height="60" rx="14" fill="#DDE5DC"/><rect x="140" y="520" width="520" height="14" fill="#0A1D19"/>` +
    `<rect x="700" y="470" width="50" height="60" fill="#C5A46D" opacity=".8"/><ellipse cx="725" cy="455" rx="36" ry="14" fill="#F3DCA8"/>`),
  // Suite: lounge, larger
  suite: frame('f', arch(80, 160, 140, 380) + arch(980, 160, 140, 380) + floor('f', 540) +
    `<rect x="300" y="430" width="600" height="110" rx="26" fill="#F8F5EF"/><rect x="300" y="380" width="600" height="70" rx="26" fill="#E9E2D3"/><rect x="520" y="560" width="160" height="60" rx="8" fill="#C5A46D" opacity=".85"/>` + chandelier(600, 70, 1.2), '#1F544C', '#0A1D19'),
  // Exterior: building facade at dusk
  exterior: frame('g', stars(60, 7) + `<circle cx="960" cy="150" r="46" fill="#F3DCA8" opacity=".9"/>` + floor('g', 640) +
    `<rect x="200" y="260" width="800" height="380" fill="#F8F5EF" opacity=".95"/><rect x="200" y="240" width="800" height="30" fill="#C5A46D"/>` +
    Array.from({ length: 6 }, (_, i) => `<path d="M${250 + i * 125} 640 V${420} a40 40 0 0 1 80 0 V640 Z" fill="#F3DCA8"/>`).join('') +
    `<path d="M480 640 V360 a120 120 0 0 1 240 0 V640" fill="#102B26" stroke="#C5A46D" stroke-width="4"/><path d="M200 260 L600 110 L1000 260" fill="#17403A" stroke="#C5A46D" stroke-width="3"/>` +
    Array.from({ length: 8 }, (_, i) => `<circle cx="${130 + i * 135}" cy="690" r="26" fill="#1F544C"/><rect x="${126 + i * 135}" y="690" width="8" height="40" fill="#0A1D19"/>`).join(''), '#1B2F4A', '#102B26'),
  // Conference: rows of chairs facing a screen
  conference: frame('h', `<rect x="300" y="150" width="600" height="280" fill="#F8F5EF" stroke="#C5A46D" stroke-width="4"/><rect x="330" y="180" width="540" height="220" fill="#17403A"/><rect x="380" y="220" width="200" height="14" fill="#C5A46D"/><rect x="380" y="250" width="320" height="8" fill="#DDE5DC" opacity=".6"/><rect x="380" y="270" width="260" height="8" fill="#DDE5DC" opacity=".6"/>` + floor('h', 470) +
    [0, 1, 2].map((r) => Array.from({ length: 9 }, (_, i) => `<rect x="${150 + i * 105 + r * 10}" y="${540 + r * 80}" width="70" height="${40 + r * 6}" rx="10" fill="${r % 2 ? '#DDE5DC' : '#F8F5EF'}" opacity=".92"/>`).join('')).join(''), '#173F38', '#0A1D19'),
  // Lobby: columns + reception
  lobby: frame('i', Array.from({ length: 5 }, (_, i) => `<rect x="${100 + i * 240}" y="80" width="40" height="480" fill="#F8F5EF" opacity=".9"/><rect x="${90 + i * 240}" y="70" width="60" height="20" fill="#C5A46D"/>`).join('') + floor('i', 560) + `<rect x="420" y="470" width="360" height="90" fill="#C5A46D" opacity=".9"/><rect x="420" y="455" width="360" height="22" fill="#F8F5EF"/>` + chandelier(600, 70, 1.3)),
  // Garden terrace for the hero of the marketing site: skyline + string lights
  hero: frame('j', stars(90, 11) + `<circle cx="900" cy="140" r="60" fill="#F3DCA8" opacity=".85"/>` + floor('j', 600) +
    arch(80, 200, 160, 400) + arch(290, 160, 160, 440) + arch(500, 120, 200, 480) + arch(750, 160, 160, 440) + arch(960, 200, 160, 400) +
    `<path d="M0 120 Q300 220 600 120 T1200 120" fill="none" stroke="#E8CC94" stroke-width="2"/>` +
    Array.from({ length: 25 }, (_, i) => `<circle cx="${i * 50 + 10}" cy="${120 + Math.sin(i * 0.52) * 60 + 40}" r="5" fill="#F3DCA8"/>`).join('') + table(300, 690) + table(900, 690), '#1B2F4A', '#102B26'),
};

for (const [name, svg] of Object.entries(scenes)) writeFileSync(`public/images/${name}.svg`, svg);
console.log(`Generated ${Object.keys(scenes).length} placeholder images in public/images/`);
