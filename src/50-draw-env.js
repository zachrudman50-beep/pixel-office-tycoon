/* ================= PIXEL DRAWING: ENVIRONMENT ================= */
const cv = $('cv'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const SKIN = ['#f2c9a0','#e0ac7e','#c68a5e','#8d5a3b','#f6d7b8','#b87a52'];
const HAIR = ['#2b1d14','#5a3a22','#c9a24a','#1a1a1a','#8c3b22','#d9d0c0','#3a2a4a','#b05a2a'];
function R(c, x, y, w, h, col){ c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }
function disc(c, cx, cy, r, col){ for (let dy = -r; dy <= r; dy++){ const hw = Math.floor(Math.sqrt(r * r - dy * dy)); R(c, cx - hw, cy + dy, hw * 2 + 1, 1, col); } }
function bands(c, y, h, cols){ const bh = h / cols.length; cols.forEach((col, i) => R(c, 0, y + i * bh, W, Math.ceil(bh) + 1, col)); }
function stars(c, y, h, t, n, seed){ for (let i = 0; i < n; i++){ const dim = ((t * 1.5 + i * 0.7) % 3) < 0.35; R(c, (i * 97 + seed) % W, y + (i * 53 + seed) % h, 1, 1, dim ? '#4c4c70' : '#ffffff'); } }
function cloud(c, x, y, col){ R(c, x, y, 22, 5, col); R(c, x + 4, y - 3, 12, 3, col); R(c, x + 8, y - 5, 6, 2, col); }
const wrapX = (v, span) => ((v % span) + span) % span;
function alpha(c, a, fn){ const o = c.globalAlpha; c.globalAlpha = o * a; fn(); c.globalAlpha = o; }

function drawSky(c, th, y, h, t){
  const b = y + h;
  switch (th.win){
    case 'parking':
      R(c, 0, y, W, h, '#9cc8e8'); R(c, 340, y + 4, 7, 7, '#fff2a8');
      cloud(c, wrapX(40 + t * 3, W + 40) - 30, y + 10, '#eef7fc');
      R(c, 0, b - 12, W, 12, '#7b7d83'); for (let lx = 0; lx < W; lx += 24) R(c, lx, b - 5, 10, 1, '#e8e2c0');
      [[36,'#c0392b'],[100,'#2f6fb5'],[172,'#e2c044'],[240,'#3b8a4a'],[300,'#dcdcdc']].forEach(([x, col]) => { R(c, x, b - 11, 14, 5, col); R(c, x + 3, b - 14, 8, 3, col); R(c, x + 4, b - 13, 6, 2, '#bfe3f5'); R(c, x + 2, b - 6, 3, 2, '#222'); R(c, x + 9, b - 6, 3, 2, '#222'); });
      break;
    case 'trees':
      R(c, 0, y, W, h, '#acd8f0'); cloud(c, wrapX(120 + t * 3, W + 40) - 30, y + 9, '#ffffff');
      for (let x = 0; x < W; x += 2){ const hg = 8 + Math.round(3 * Math.sin(x * 0.05)); R(c, x, b - hg, 2, hg, '#86b86a'); }
      for (let x = 4; x < W; x += 26){ R(c, x + 3, b - 9, 2, 6, '#6b4a2b'); R(c, x, b - 18, 8, 10, '#4b8a47'); R(c, x + 1, b - 20, 6, 2, '#4b8a47'); R(c, x + 1, b - 17, 2, 2, '#64a85c'); }
      break;
    case 'city':
      bands(c, y, h, ['#2e3a66','#3d4677','#4d4f86','#c9786e']); R(c, 60, y + 5, 4, 4, '#f4efd9');
      for (let x = 0; x < W; x += 11){ const hg = 10 + (x * 7919) % 20; R(c, x, b - hg, 10, hg, '#1f2440'); for (let wy = b - hg + 3; wy < b - 2; wy += 4) for (let wx = x + 2; wx < x + 9; wx += 3) if ((wx * 31 + wy * 17) % 5 < 2) R(c, wx, wy, 1, 2, '#f6d27a'); }
      break;
    case 'campus':
      R(c, 0, y, W, h, '#a8dcf0'); cloud(c, wrapX(80 + t * 3, W + 40) - 30, y + 8, '#ffffff');
      [[8,24,'#e05a4a'],[58,20,'#4f8fe0'],[116,28,'#efb341'],[170,18,'#4fbf78'],[230,24,'#e05a4a'],[290,22,'#4f8fe0'],[340,26,'#efb341']].forEach(([x, hh, col]) => { R(c, x, b - hh, 34, hh, col); for (let wy = b - hh + 4; wy < b - 6; wy += 6) for (let wx = x + 3; wx < x + 31; wx += 6) R(c, wx, wy, 3, 3, '#dff3ff'); });
      R(c, 0, b - 5, W, 5, '#7fc06a');
      break;
    case 'clouds':
      R(c, 0, y, W, h, '#bfe3f5'); R(c, 0, y + h * 0.6, W, h, '#d8eefa');
      for (let x = 0; x < W; x += 9){ const hg = 3 + (x * 131) % 7; R(c, x, b - hg, 8, hg, '#9fb3c2'); }
      for (let i = 0; i < 8; i++) cloud(c, wrapX(i * 61 + t * 5, W + 40) - 30, y + 10 + (i * 7) % (h - 14), '#ffffff');
      break;
    case 'sunset':
      bands(c, y, h, ['#3f3a78','#7a4f93','#d0687a','#f3a15d']); disc(c, 300, b - 14, 8, '#ffd98a');
      R(c, 0, b - 9, W, 9, '#f4d1c9'); for (let x = 0; x < W; x += 12) R(c, x, b - 11, 8, 2, '#f4d1c9');
      for (let i = 0; i < 5; i++) cloud(c, wrapX(i * 83 + t * 4, W + 40) - 30, y + 12 + (i * 5) % 12, '#f6b9b0');
      break;
    case 'beach':
      R(c, 0, y, W, h, '#8fd8f0'); disc(c, 64, y + 8, 4, '#fff2a8');
      R(c, 0, b - 16, W, 8, '#2f9ec8'); for (let x = Math.floor(wrapX(t * 6, 12)); x < W; x += 12) R(c, x, b - 13, 5, 1, '#bfe9f7');
      R(c, 0, b - 8, W, 8, '#f0dca0');
      [40,180,330].forEach(px => { for (let k = 0; k < 12; k++) R(c, px + Math.round(Math.sin(k * 0.25) * 2), b - 8 - k, 2, 1, '#8a6138'); const ty = b - 21; R(c, px - 7, ty, 16, 2, '#3f9a4a'); R(c, px - 9, ty + 2, 4, 2, '#3f9a4a'); R(c, px + 7, ty + 2, 4, 2, '#3f9a4a'); R(c, px - 2, ty - 2, 6, 2, '#3f9a4a'); });
      break;
    case 'arctic':
      R(c, 0, y, W, h, '#1d2a4a'); stars(c, y, h / 2, t, 30, 11);
      for (let x = 0; x < W; x += 2){ const yy = y + 5 + Math.round(Math.sin(x * 0.04 + t * 0.6) * 3); R(c, x, yy, 2, 4, '#5ff0a8'); R(c, x, yy + 4, 2, 2, '#3fa38a'); }
      for (let x = 0; x < W; x++){ const hh = 7 + Math.abs(((x * 3) % 80) - 40) / 4; R(c, x, b - hh, 1, hh, '#e8f0f8'); }
      R(c, 0, b - 4, W, 4, '#ffffff');
      break;
    case 'desert':
      bands(c, y, h, ['#f6c07a','#f6d08a','#f8dca0']); disc(c, 320, y + 10, 7, '#fff2c0');
      [[60,18],[120,26],[210,15],[300,22]].forEach(([px, ph]) => { for (let k = 0; k < ph; k++) R(c, px - k, b - ph + k, 2 * k + 1, 1, k % 4 === 0 ? '#b88a48' : '#c99a50'); });
      for (let x = 0; x < W; x += 2){ const hh = 4 + Math.round(Math.sin(x * 0.06) * 2); R(c, x, b - hh, 2, hh, '#e0b060'); }
      break;
    case 'ocean':
      bands(c, y, h, ['#2f7fb0','#25699a','#1d5682','#174870']);
      alpha(c, 0.12, () => { for (let i = 0; i < 5; i++) R(c, 30 + i * 80, y, 14, h, '#bfe9f7'); });
      for (let i = 0; i < 10; i++){ const fx = wrapX(i * 53 + t * (8 + i * 2), W + 20) - 10, fy = y + 6 + (i * 7) % (h - 14); const col = ['#efb341','#e05a4a','#5ef0e6'][i % 3]; R(c, fx, fy, 5, 3, col); R(c, fx - 2, fy, 2, 1, col); R(c, fx - 2, fy + 2, 2, 1, col); R(c, fx + 3, fy + 1, 1, 1, '#111'); }
      for (let i = 0; i < 14; i++) R(c, (i * 37) % W, b - wrapX(t * 10 + i * 23, h), 1, 1, '#cfefff');
      for (let x = 8; x < W; x += 22) for (let k = 0; k < 10; k++) R(c, x + Math.round(Math.sin(t * 2 + k * 0.6 + x) * 1.5), b - 4 - k, 2, 1, '#3f9a4a');
      R(c, 0, b - 4, W, 4, '#c9b080');
      break;
    case 'volcano':
      bands(c, y, h, ['#2a1018','#4a1a1a','#7a2a1a','#a8401a']);
      for (let k = 0; k < h - 6; k++){ const hw = 10 + k; R(c, 192 - hw, y + 6 + k, hw * 2, 1, '#2a1a1a'); }
      R(c, 182, y + 6, 20, 3, '#ff7a2a'); R(c, 188, y + 9, 2, 16, '#ff9a3a'); R(c, 198, y + 9, 2, 12, '#ff6a2a');
      for (let i = 0; i < 14; i++){ const ex = 182 + (i * 17) % 30 + Math.sin(t + i) * 8, ey = y + 26 - wrapX(t * 12 + i * 9, 26); R(c, ex, ey, 1, 1, '#ffcf6b'); }
      R(c, 0, b - 3, W, 3, '#ff6a2a');
      break;
    case 'sky':
      bands(c, y, h, ['#6fb5f0','#8fc8f8','#b5dcfa']);
      [[30,12],[180,18],[300,8]].forEach(([ix, iy]) => { const yy = y + iy + Math.round(Math.sin(t + ix) * 1.5); R(c, ix, yy, 26, 4, '#5fae4a'); R(c, ix + 3, yy + 4, 20, 3, '#8a6138'); R(c, ix + 7, yy + 7, 12, 2, '#6d4b2a'); });
      for (let i = 0; i < 4; i++){ const bx = wrapX(i * 90 + t * 12, W + 20) - 10, by = y + 6 + i * 5; R(c, bx, by, 2, 1, '#2a2830'); R(c, bx + 3, by, 2, 1, '#2a2830'); R(c, bx + 2, by + 1, 1, 1, '#2a2830'); }
      R(c, 0, b - 7, W, 7, '#ffffff'); for (let x = 0; x < W; x += 14) R(c, x + 2, b - 10, 10, 3, '#ffffff');
      break;
    case 'orbit':
      R(c, 0, y, W, h, '#05050f'); stars(c, y, h, t, 70, 3);
      for (let yy = b - 22; yy < b; yy++){ const dy = yy - (b + 110); const hw = Math.sqrt(Math.max(0, 132 * 132 - dy * dy)); R(c, 192 - hw, yy, hw * 2, 1, '#2f6fd0'); }
      R(c, 150, b - 10, 30, 5, '#3fa35a'); R(c, 220, b - 15, 26, 7, '#3fa35a'); R(c, 170, b - 19, 40, 2, '#e8f2ff');
      { const sx = wrapX(t * 10, W + 20) - 10; R(c, sx, y + 10, 4, 2, '#cfd3da'); R(c, sx - 3, y + 10, 2, 2, '#4f8fe0'); R(c, sx + 5, y + 10, 2, 2, '#4f8fe0'); }
      break;
    case 'moon': {
      R(c, 0, y, W, h, '#0a0a1c'); stars(c, y, h, t, 90, 0);
      const ex = 300, ey = y + 14, r = 9;
      disc(c, ex, ey, r, '#2f6fd0'); R(c, ex - 6, ey - 4, 5, 4, '#3fa35a'); R(c, ex + 1, ey + 1, 6, 4, '#3fa35a'); R(c, ex - 8, ey - 1, 11, 1, '#e8f2ff');
      R(c, 0, b - 6, W, 6, '#8a8997'); [[30,4],[110,6],[200,3],[260,5]].forEach(([x, w]) => R(c, x, b - 5, w * 2, 2, '#77768a'));
      break; }
    case 'mars':
      bands(c, y, h, ['#c97a5a','#d9906a','#e0a07a']); disc(c, 70, y + 8, 3, '#e8d8c0'); disc(c, 300, y + 12, 2, '#d0c0a8');
      for (let x = 0; x < W; x += 2){ const hh = 6 + Math.round(Math.abs(Math.sin(x * 0.03)) * 9); R(c, x, b - hh, 2, hh, '#a55533'); }
      R(c, 0, b - 4, W, 4, '#8a4a32');
      { const rx = wrapX(40 + t * 4, W + 20) - 10; R(c, rx, b - 8, 10, 4, '#d8dde3'); R(c, rx + 1, b - 4, 2, 2, '#333'); R(c, rx + 7, b - 4, 2, 2, '#333'); R(c, rx + 7, b - 11, 1, 3, '#999'); }
      break;
    case 'jupiter': {
      const cols = ['#e8c8a0','#c98a5a','#f0dcc0','#b5764a','#e0b890','#a8603a','#f0d8b0'], bh = h / cols.length;
      cols.forEach((col, i) => { R(c, 0, y + i * bh, W, Math.ceil(bh) + 1, col); for (let x = wrapX(t * (i % 2 ? 6 : -4) + i * 30, 24) - 24; x < W; x += 24) R(c, x, y + i * bh + bh / 2, 10, 1, 'rgba(255,255,255,.25)'); });
      const sx = wrapX(240 + t * 3, W + 40) - 20, sy = y + h * 0.6;
      R(c, sx - 8, sy - 3, 16, 6, '#c0503a'); R(c, sx - 5, sy - 4, 10, 8, '#c0503a'); R(c, sx - 4, sy - 1, 8, 2, '#e07a5a');
      break; }
    case 'dyson': {
      R(c, 0, y, W, h, '#120a04'); const cy = y + h / 2;
      disc(c, 192, cy, 24, '#ff8a2a'); disc(c, 192, cy, 18, '#ffb341'); disc(c, 192, cy, 11, '#ffe07a'); disc(c, 192, cy, 5, '#fff7d0');
      for (let x = 0; x < W; x += 16) R(c, x, y, 1, h, 'rgba(239,179,65,.35)');
      for (let yy = y; yy < b; yy += 10) R(c, 0, yy, W, 1, 'rgba(239,179,65,.35)');
      break; }
    case 'galaxy': {
      R(c, 0, y, W, h, '#0d0820'); stars(c, y, h, t, 80, 7);
      const cx = 192, cy = y + h / 2;
      for (let i = 0; i < 260; i++){ const arm = i % 2, k = i / 260 * 4.2, a = k * 2.2 + arm * Math.PI + t * 0.05, rr = k * 12; R(c, cx + Math.cos(a) * rr * 2.2, cy + Math.sin(a) * rr * 0.6, 1, 1, i % 5 ? '#b7a0ff' : '#ffd0f0'); }
      disc(c, cx, cy, 3, '#fff0c0');
      break; }
    case 'multiverse':
      for (let x = 0; x < W; x += 4){ c.fillStyle = 'hsl(' + ((x * 1.2 + t * 40) % 360) + ',70%,45%)'; c.fillRect(x, y, 4, h); }
      alpha(c, 0.5, () => R(c, 0, y, W, h, '#141418'));
      [[64,14],[192,22],[320,12]].forEach(([px, py], i) => { const r = 7 + Math.round(Math.sin(t * 2 + i) * 2); disc(c, px, y + py, r, 'hsl(' + ((t * 60 + i * 120) % 360) + ',90%,60%)'); disc(c, px, y + py, r - 3, '#141418'); });
      break;
  }
}
function drawNightAndWeather(c, th, y, h, t, night){
  const space = SPACE_SKY.has(th.win) || th.win === 'ocean';
  if (!space && night > 0){
    alpha(c, 0.7 * night, () => R(c, 0, y, W, h, '#0a0e2a'));
    alpha(c, night, () => { stars(c, y, h * 0.7, t, 40, 5); disc(c, 330, y + 8, 4, '#f4efd9'); disc(c, 332, y + 7, 3, 'rgba(10,14,42,1)'); });
    if (month() === 9) for (let i = 0; i < 3; i++){ const bx = wrapX(i * 140 + t * 18, W + 40) - 20, by = y + 8 + i * 6 + Math.sin(t * 6 + i) * 2, f = Math.floor(t * 8 + i) % 2; R(c, bx, by, 2, 2, '#111'); R(c, bx - 3, by - f, 3, 1, '#111'); R(c, bx + 2, by - f, 3, 1, '#111'); }
  }
  const wt = S.weather.type;
  if (wt === 'cloudy' || wt === 'rain' || wt === 'storm') alpha(c, wt === 'cloudy' ? 0.25 : 0.4, () => R(c, 0, y, W, h, '#6a7080'));
  if (wt === 'rain' || wt === 'storm'){ const n = wt === 'storm' ? 70 : 40; for (let i = 0; i < n; i++){ const rx = (i * 37 + Math.floor(t * 40) * 3) % W, ry = y + wrapX(i * 13 + t * 120, h); R(c, rx, ry, 1, 3, 'rgba(200,220,255,.7)'); } }
  if (wt === 'snow') for (let i = 0; i < 50; i++){ const sx = wrapX(i * 41 + Math.sin(t + i) * 6, W), sy = y + wrapX(i * 11 + t * 14, h); R(c, sx, sy, 1, 1, '#ffffff'); }
  if (wt === 'fog') alpha(c, 0.45, () => R(c, 0, y, W, h, '#e8ecf0'));
  if (wt === 'meteors') for (let i = 0; i < 3; i++){ const k = wrapX(t * 0.7 + i * 0.33, 1), mx = W * k, my = y + 4 + i * 8 + k * 14; for (let j = 0; j < 6; j++) R(c, mx - j * 2, my - j, 1, 1, j ? 'rgba(255,220,160,.6)' : '#ffffff'); }
}
let flash = 0;
function drawWall(c, th, t, night){
  R(c, 0, 0, W, 48, th.wall);
  for (let x = 0; x < W; x += 16) R(c, x, 0, 1, 44, 'rgba(0,0,0,.05)');
  R(c, 0, 0, W, 3, 'rgba(0,0,0,.22)');
  R(c, 0, 28, W, 1, 'rgba(255,255,255,.08)');
  if (th.win === 'garage'){
    R(c, 224, 4, 128, 40, '#6f6a63'); for (let y = 8; y < 44; y += 5) R(c, 224, y, 128, 1, '#57534d');
    R(c, 221, 2, 134, 3, '#4a4640'); R(c, 221, 2, 3, 42, '#4a4640'); R(c, 352, 2, 3, 42, '#4a4640');
    R(c, 16, 20, 64, 3, '#5b4630'); R(c, 16, 36, 64, 3, '#5b4630'); R(c, 18, 23, 2, 21, '#4a3826'); R(c, 76, 23, 2, 21, '#4a3826');
    R(c, 22, 12, 12, 8, '#b08a55'); R(c, 38, 14, 10, 6, '#9c7746'); R(c, 54, 13, 9, 7, '#c0583e'); R(c, 64, 16, 12, 4, '#7f8c9a');
    R(c, 22, 29, 9, 7, '#c0583e'); R(c, 36, 28, 14, 8, '#b08a55'); R(c, 54, 31, 18, 5, '#9c7746');
    R(c, 190, 0, 1, 10, '#222'); R(c, 188, 10, 5, 5, night > 0.3 ? '#fff4c0' : '#ffe9a0');
  } else {
    for (const [a, b2] of WIN_COLS){
      const x = a * TS, w = (b2 - a + 1) * TS, y = 6, h = 34;
      R(c, x - 3, y - 3, w + 6, h + 6, th.trim);
      c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
      drawSky(c, th, y, h, RM ? 0 : t); drawNightAndWeather(c, th, y, h, RM ? 0 : t, night);
      alpha(c, 0.18, () => { R(c, x + 4, y, 3, h, '#ffffff'); R(c, x + 10, y, 1, h, '#ffffff'); });
      c.restore();
      R(c, x + w / 2 - 1, y, 2, h, th.trim); R(c, x, y + h / 2, w, 1, th.trim);
      R(c, x - 5, y + h + 2, w + 10, 2, th.trim);
    }
  }
  R(c, 0, 44, W, 4, th.trim); R(c, 0, 44, W, 1, 'rgba(255,255,255,.15)');
}
function drawFloor(c, th){
  R(c, 0, FY, W, H - FY, th.floor);
  const f2 = th.floor2, y0 = FY;
  switch (th.style){
    case 'concrete': for (let i = 0; i < 220; i++) R(c, (i * 73) % W, y0 + (i * 37) % (H - FY), 1, 1, f2); R(c, 300, 200, 18, 5, '#3f3b37'); break;
    case 'carpet': for (let y = y0 + 2; y < H; y += 4) for (let x = (y % 8 ? 0 : 2); x < W; x += 4) R(c, x, y, 1, 1, f2); break;
    case 'plank': for (let y = y0, r = 0; y < H; y += 8, r++){ R(c, 0, y, W, 1, f2); for (let x = (r % 2) * 24; x < W; x += 48) R(c, x, y, 1, 8, f2); } break;
    case 'tile': for (let y = y0, iy = 0; y < H; y += 16, iy++) for (let x = 0, ix = 0; x < W; x += 16, ix++) if ((ix + iy) % 2) R(c, x, y, 16, 16, f2); break;
    case 'sand': for (let i = 0; i < 300; i++) R(c, (i * 71) % W, y0 + (i * 29) % (H - FY), 1, 1, f2); for (let y = y0 + 8; y < H; y += 14) for (let x = (y % 28 ? 0 : 7); x < W; x += 14) R(c, x, y, 6, 1, f2); break;
    case 'metal': for (let y = y0; y < H; y += 16) for (let x = 0; x < W; x += 32){ R(c, x, y, 32, 1, f2); R(c, x, y, 1, 16, f2); R(c, x + 2, y + 2, 1, 1, '#d0d5dc'); R(c, x + 29, y + 2, 1, 1, '#d0d5dc'); R(c, x + 2, y + 13, 1, 1, '#d0d5dc'); R(c, x + 29, y + 13, 1, 1, '#d0d5dc'); } break;
    case 'rock': for (let i = 0; i < 160; i++) R(c, (i * 61) % W, y0 + (i * 43) % (H - FY), 2, 1, f2); [[20,140,30],[180,200,40],[300,110,26]].forEach(([x, y, w]) => { for (let k = 0; k < w; k++) R(c, x + k, y + Math.round(Math.sin(k * 0.4) * 2), 1, 1, '#ff7a2a'); }); break;
    case 'moon': [[30,200,16],[110,92,10],[300,100,14],[220,180,9],[350,150,8]].forEach(([x, y, w]) => { R(c, x, y, w, 3, f2); R(c, x + 2, y - 1, w - 4, 1, f2); R(c, x + 2, y + 3, w - 4, 1, '#b3b2bf'); }); break;
    case 'mars': for (let i = 0; i < 240; i++) R(c, (i * 83) % W, y0 + (i * 31) % (H - FY), 1, 1, f2); break;
    case 'void': for (let x = 0; x < W; x += 16) R(c, x, y0, 1, H - FY, '#3a1a3a'); for (let y = y0; y < H; y += 16) R(c, 0, y, W, 1, '#3a1a3a'); break;
  }
  R(c, 0, FY, W, 3, 'rgba(0,0,0,.22)');
}
function drawAreaBounds(c, th){
  const A = areaOf(S.office), ax = A.x0 * TS, aw = A.w * TS, ah = A.h * TS;
  alpha(c, 0.62, () => { R(c, 0, FY, ax, H - FY, '#101320'); R(c, ax + aw, FY, W - ax - aw, H - FY, '#101320'); R(c, ax, FY + ah, aw, H - FY - ah, '#101320'); });
  if (ax > 0){ R(c, ax - 3, FY, 3, ah + 3, th.trim); R(c, ax + aw, FY, 3, ah + 3, th.trim); }
  if (FY + ah < H){ R(c, ax - 3, FY + ah, aw + 6, 3, th.trim); R(c, ax - 3, FY + ah, aw + 6, 1, 'rgba(255,255,255,.2)'); }
}
function drawWindowLight(c, night){
  if (night >= 1 || S.office === 0 || isSpace()) return;
  alpha(c, 0.08 * (1 - night) * (S.weather.type === 'sunny' ? 1.4 : 0.8), () => {
    c.fillStyle = '#fff4d0';
    for (const [a, b] of WIN_COLS){ const x = a * TS, w = (b - a + 1) * TS; c.beginPath(); c.moveTo(x, FY); c.lineTo(x + w, FY); c.lineTo(x + w + 26, FY + 70); c.lineTo(x + 14, FY + 70); c.closePath(); c.fill(); }
  });
}
