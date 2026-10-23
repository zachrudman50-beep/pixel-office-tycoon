/* ================= CHARACTERS ================= */
function drawChar(c, x, y, L, o){
  const skin = L.skin, hair = L.hair, shirt = L.shirt, pants = L.pants || '#2f3446', t = o.t || 0, dir = o.dir || 'down';
  if (L.glow) alpha(c, 0.3 + 0.15 * Math.sin(t * 3 + (o.idx || 0)), () => R(c, x, y - 2, 12, 16, L.glow));
  if (o.pose !== 'sit'){
    alpha(c, 0.25, () => R(c, x + 2, y + 17, 8, 2, '#000'));
    const f = o.pose === 'walk' ? Math.floor(t * 8 + (o.idx || 0)) % 2 : 0;
    R(c, x + 3, y + 13, 2, 4 - f, pants); R(c, x + 7, y + 13, 2, 3 + f, pants);
    R(c, x + 3, y + 17 - f, 2, 1, '#222'); R(c, x + 7, y + 16 + f, 2, 1, '#222');
  }
  R(c, x + 2, y + 7, 8, 6, shirt); R(c, x + 2, y + 12, 8, 1, 'rgba(0,0,0,.2)');
  if (L.tie && dir !== 'up') R(c, x + 5, y + 7, 2, 4, L.tie);
  const hand = L.robot ? '#8d959e' : skin;
  if (o.pose === 'sit'){
    const ph = Math.floor((RM ? 0 : t) * (o.fast ? 22 : 7) + (o.idx || 0) * 1.7) % 2;
    R(c, x + 1, y + 9, 2, 4, shirt); R(c, x + 9, y + 9, 2, 4, shirt);
    R(c, x + 1, y + 13 - ph, 2, 2, hand); R(c, x + 9, y + 12 + ph, 2, 2, hand);
  } else {
    const sw = o.pose === 'walk' ? (Math.floor(t * 8 + (o.idx || 0)) % 2 ? 1 : -1) : 0;
    R(c, x + 1, y + 8 + sw, 1, 4, shirt); R(c, x + 10, y + 8 - sw, 1, 4, shirt);
    R(c, x + 1, y + 12 + sw, 1, 1, hand); R(c, x + 10, y + 12 - sw, 1, 1, hand);
    if (o.hold === 'coffee'){ R(c, x + 10, y + 10, 2, 3, '#f1ede4'); }
  }
  R(c, x + 2, y, 8, 7, skin);
  if (L.robot){
    R(c, x + 6, y - 3, 1, 3, '#7a828c'); R(c, x + 6, y - 4, 1, 1, '#ff5a4a');
    if (dir !== 'up'){ const blink = ((t * 0.9 + (o.idx || 0) * 0.41) % 3) < 0.12; R(c, x + 3, y + 2, 6, 2, blink ? '#3a3f47' : (L.tie || '#5ef0e6')); R(c, x + 4, y + 5, 4, 1, '#8d959e'); }
  } else {
    if (dir === 'up') R(c, x + 2, y, 8, 6, hair);
    else {
      if (!L.helmet && !L.hat && !L.witch && !L.pumpkin) R(c, x + 2, y - 1, 8, 3, hair);
      R(c, x + 2, y + 2, 1, 3, hair); R(c, x + 9, y + 2, 1, 3, hair);
      const blink = ((t * 0.7 + (o.idx || 0) * 0.37) % 4) < 0.1;
      if (L.shades) R(c, x + 3, y + 3, 6, 2, '#0d0d12');
      else if (!blink){
        if (dir === 'left') R(c, x + 3, y + 3, 1, 2, '#2a2228');
        else if (dir === 'right') R(c, x + 8, y + 3, 1, 2, '#2a2228');
        else { R(c, x + 4, y + 3, 1, 2, '#2a2228'); R(c, x + 7, y + 3, 1, 2, '#2a2228'); }
      }
      if (o.happy) R(c, x + 5, y + 5, 2, 1, '#8a4a3a');
    }
  }
  if (L.helmet){ R(c, x + 1, y - 2, 10, 3, '#efb341'); R(c, x + 5, y - 2, 2, 1, '#fff7c0'); }
  if (L.hat){ R(c, x, y - 1, 12, 1, L.hat); R(c, x + 2, y - 3, 8, 2, L.hat); R(c, x + 3, y - 5, 6, 2, L.hat); R(c, x + 4, y - 8, 4, 3, L.hat); R(c, x + 5, y - 4, 1, 1, '#efb341'); }
  if (L.witch){ R(c, x, y - 1, 12, 1, '#2a1a3a'); R(c, x + 2, y - 4, 8, 3, '#2a1a3a'); R(c, x + 4, y - 7, 5, 3, '#2a1a3a'); R(c, x + 7, y - 9, 3, 2, '#2a1a3a'); R(c, x + 2, y - 2, 8, 1, '#7d5bd0'); }
  if (L.pumpkin){ R(c, x + 1, y - 2, 10, 4, '#e07a1a'); R(c, x + 5, y - 4, 2, 2, '#4f6a2a'); }
  if (L.crown){ R(c, x + 2, y - 3, 8, 2, '#efb341'); R(c, x + 2, y - 4, 1, 1, '#efb341'); R(c, x + 5, y - 4, 2, 1, '#efb341'); R(c, x + 9, y - 4, 1, 1, '#efb341'); }
  if (L.tophat){ R(c, x + 1, y - 1, 10, 1, '#111'); R(c, x + 3, y - 7, 6, 6, '#111'); R(c, x + 3, y - 3, 6, 1, '#b03a3a'); }
  if (L.halo){ R(c, x + 3, y - 5, 6, 1, '#fff7c0'); R(c, x + 2, y - 4, 1, 1, '#fff7c0'); R(c, x + 9, y - 4, 1, 1, '#fff7c0'); }
}
function staffLook(s, idx){
  const L = {skin:s.skin || (s.robot ? '#b9c1c9' : SKIN[idx % SKIN.length]), hair:s.hair || HAIR[(idx * 3 + 1) % HAIR.length], shirt:s.shirt, tie:s.tie, robot:s.robot, shades:s.shades, glow:s.glow, hat:s.hat, helmet:s.helmet, pants:['#2f3446','#3a2f28','#2a3a2f','#46403a'][idx % 4]};
  if (month() === 9 && !s.robot && !s.hat && !s.helmet){ if (idx % 7 === 0) L.witch = true; else if (idx % 7 === 3) L.pumpkin = true; }
  return L;
}
function bossLook(){
  return {skin:SKIN[0], hair:'#2b1d14', shirt:S.mergers ? '#c0407a' : S.ti ? '#2f6fb5' : '#6a4bb8', tie:'#efb341', pants:'#2a2830',
    halo:S.mergers >= 1, tophat:!S.mergers && S.ti >= 1, crown:!S.mergers && !S.ti && S.tr >= 1, shades:S.tr >= 3, glow:S.mergers >= 3 ? '#fff7c0' : null};
}

/* ================= WORKER SIMULATION ================= */
let workers = [], wanderers = [], blocked = null, blockedFor = -1;
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
function blockedGrid(){
  if (blocked && !layoutDirty && blockedFor === S.office) return blocked;
  const L = layout();
  blocked = Array.from({length:ROWS}, () => new Array(COLS).fill(false));
  for (const p of L.f){ const d = FURN_BY[p.id]; if (!d || d.layer === 'r') continue; for (let dy = 0; dy < d.h; dy++) for (let dx = 0; dx < d.w; dx++){ const yy = p.y + dy, xx = p.x + dx; if (yy >= 0 && yy < ROWS && xx >= 0 && xx < COLS) blocked[yy][xx] = true; } }
  layoutDirty = false; blockedFor = S.office;
  return blocked;
}
function bfs(starts, isGoal){
  const A = areaOf(S.office), B = blockedGrid(), key = (x, y) => y * COLS + x, prev = new Map(), q = [];
  for (const [x, y] of starts){ prev.set(key(x, y), -1); q.push([x, y]); }
  let head = 0;
  while (head < q.length){
    const [x, y] = q[head++];
    if (isGoal(x, y) && !starts.some(s => s[0] === x && s[1] === y)){
      const path = []; let k = key(x, y); while (k !== -1){ path.push([k % COLS, Math.floor(k / COLS)]); k = prev.get(k); } return path.reverse();
    }
    for (const [dx, dy] of DIRS){
      const nx = x + dx, ny = y + dy;
      if (nx < A.x0 || nx >= A.x0 + A.w || ny < 0 || ny >= A.h) continue;
      const k = key(nx, ny); if (prev.has(k)) continue;
      if (B[ny][nx] && !isGoal(nx, ny)) continue;
      prev.set(k, key(x, y)); q.push([nx, ny]);
    }
  }
  return null;
}
const tilePx = (tx, ty) => ({x:tx * TS + 2, y:FY + ty * TS - 4});
function goalSetFor(cats){
  const L = layout(), B = blockedGrid(), A = areaOf(S.office), set = new Set();
  for (const p of L.f){
    const d = FURN_BY[p.id]; if (!d || d.layer === 'r' || !cats.includes(d.cat)) continue;
    for (let dy = 0; dy < d.h; dy++) for (let dx = 0; dx < d.w; dx++) for (const [ox, oy] of DIRS){
      const nx = p.x + dx + ox, ny = p.y + dy + oy;
      if (nx >= A.x0 && nx < A.x0 + A.w && ny >= 0 && ny < A.h && !B[ny][nx]) set.add(ny * COLS + nx);
    }
  }
  return set;
}
function buildWorkers(){
  const L = layout();
  const desks = L.f.filter(p => FURN_BY[p.id] && FURN_BY[p.id].cat === 'desk').sort((a, b) => b.y - a.y || a.x - b.x);
  const n = Math.min(desks.length, totalEmp(), 40);
  const owned = STAFF.map(s => ({s, c:S.emp[s.id] || 0})).filter(o => o.c > 0).reverse();
  const total = owned.reduce((a, o) => a + o.c, 0), list = [];
  if (total <= n) owned.forEach(o => { for (let i = 0; i < o.c; i++) list.push(o.s); });
  else {
    const pk = owned.slice(0, n), rem = n - pk.length, tot = pk.reduce((a, o) => a + o.c, 0);
    const alloc = pk.map(o => ({o, k:1 + Math.floor(rem * o.c / tot), f:(rem * o.c / tot) % 1}));
    let left = n - alloc.reduce((a, x) => a + x.k, 0);
    [...alloc].sort((a, b) => b.f - a.f).forEach(x => { if (left > 0){ x.k++; left--; } });
    alloc.forEach(x => { for (let i = 0; i < x.k; i++) list.push(x.o.s); });
  }
  workers = desks.slice(0, n).map((p, i) => ({desk:p, s:list[i] || STAFF[0], look:staffLook(list[i] || STAFF[0], i + p.x * 3 + p.y), idx:i, state:'sit', timer:rand(5, 60), x:0, y:0, path:null, emote:null, emoteT:0, dir:'down'}));
  wanderers = S.talent.roster.filter(t => t.role).slice(0, 4).map((t, i) => { const f = freeTile() || [areaOf(S.office).x0, 0]; const p = tilePx(f[0], f[1]); return {tal:t, look:Object.assign({}, t.look), idx:50 + i, state:'idle', timer:rand(1, 5), x:p.x, y:p.y, tx:f[0], ty:f[1], path:null, dir:'down'}; });
  crewDirty = false;
}
const NEED_TRIP = [['e',['energy'],'coffee'],['f',['fun'],'game'],['c',['seat'],'zzz'],['s',['plant','art'],'heart']];
function stepPath(w, dt){
  const sp = 28 * dt;
  while (w.path && w.path.length){
    const [tx, ty] = w.path[0], p = tilePx(tx, ty), dx = p.x - w.x, dy = p.y - w.y, dist = Math.hypot(dx, dy);
    if (dist <= sp){ w.x = p.x; w.y = p.y; w.tx = tx; w.ty = ty; w.path.shift(); continue; }
    w.x += dx / dist * sp; w.y += dy / dist * sp;
    w.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    return false;
  }
  return true;
}
function updateWorkers(dt){
  if (crewDirty) buildWorkers();
  const sat = M.dec ? M.dec.sat : {e:1, c:1, f:1, o:1};
  for (const w of workers){
    if (w.emoteT > 0) w.emoteT -= dt;
    if (w.state === 'sit'){
      w.timer -= dt;
      if (w.timer <= 0){
        const trip = wpick(NEED_TRIP, n => n[0] === 's' ? 0.3 : Math.max(0.2, 1.5 - (sat[n[0]] || 0)));
        const goals = goalSetFor(trip[1]);
        const starts = [[w.desk.x, w.desk.y], [w.desk.x + 1, w.desk.y]];
        const path = goals.size ? bfs(starts, (x, y) => goals.has(y * COLS + x)) : null;
        if (path && path.length > 1){ const p = tilePx(path[0][0], path[0][1]); w.x = p.x; w.y = p.y; w.path = path.slice(1); w.state = 'walk'; w.trip = trip; }
        else {
          w.timer = rand(20, 50);
          const low = NEEDS.find(([k]) => sat[k] < 0.6);
          if (low && Math.random() < 0.6){ w.emote = '!' + low[0]; w.emoteT = 2.5; }
        }
      }
    } else if (w.state === 'walk' || w.state === 'back'){
      if (stepPath(w, dt)){
        if (w.state === 'back'){ w.state = 'sit'; w.timer = rand(25, 90); }
        else { w.state = 'use'; w.timer = rand(3, 6); w.emote = w.trip[2]; w.emoteT = w.timer; }
      }
    } else if (w.state === 'use'){
      w.timer -= dt;
      if (w.timer <= 0){
        const cx = w.desk.x, cy = w.desk.y;
        const path = bfs([[w.tx, w.ty]], (x, y) => y === cy && (x === cx || x === cx + 1));
        if (path && path.length > 1){ w.path = path.slice(1); w.state = 'back'; w.hold = w.trip[0] === 'e' ? 'coffee' : null; }
        else { w.state = 'sit'; w.timer = rand(25, 90); }
      }
    }
  }
  for (const w of wanderers){
    if (w.state === 'idle'){
      w.timer -= dt;
      if (w.timer <= 0){
        const f = freeTile();
        const path = f ? bfs([[w.tx, w.ty]], (x, y) => x === f[0] && y === f[1]) : null;
        if (path && path.length > 1){ w.path = path.slice(1); w.state = 'walk'; } else w.timer = rand(2, 5);
      }
    } else if (stepPath(w, dt)){ w.state = 'idle'; w.timer = rand(3, 9); w.dir = 'down'; }
  }
}
function bossPos(){ const p = layout().f.find(x => x.id === 'ceo'); return p ? {x:p.x * TS + 10, y:FY + p.y * TS + 1} : null; }

/* ================= PETS, TRASH, EVENTS ================= */
let pets = [];
function buildPets(){
  const A = areaOf(S.office);
  pets = ITEMS.filter(it => it.pet && (S.items[it.id] || {}).lv).map((it, i) => {
    const fly = ['parrot','dragon','phoenix'].includes(it.pet);
    return {kind:it.pet, fly, x:A.x0 * TS + 20 + i * 40, y:fly ? FY + 14 + i * 9 : FY + A.h * TS - 9, vx:(fly ? 16 : 9) * (i % 2 ? -1 : 1), t0:i};
  });
  petsDirty = false;
}
function movePets(dt, t){
  const A = areaOf(S.office), lo = A.x0 * TS + 4, hi = (A.x0 + A.w) * TS - 16;
  for (const p of pets){
    p.x += p.vx * dt;
    if (p.fly) p.y = FY + 12 + (p.t0 * 9) % 50 + Math.sin(t * 1.5 + p.t0) * 6;
    if (p.x < lo){ p.x = lo; p.vx = Math.abs(p.vx); }
    if (p.x > hi){ p.x = hi; p.vx = -Math.abs(p.vx); }
    if (!p.fly && Math.random() < dt * 0.15) p.vx = -p.vx;
  }
}
function drawPet(c, p, t){
  const d = p.vx >= 0 ? 1 : -1;
  const P = (dx, dy, w, h, col, len) => R(c, d > 0 ? p.x + dx : p.x + (len - dx - w), p.y + dy, w, h, col);
  const flap = Math.floor(t * 8 + p.t0) % 2;
  if (p.kind === 'cat'){ P(0,1,6,3,'#e0a050',9); P(6,0,3,3,'#e0a050',9); P(6,-1,1,1,'#e0a050',9); P(8,-1,1,1,'#e0a050',9); P(7,1,1,1,'#2a2228',9); P(-1,flap,1,2,'#e0a050',9); P(1,4,1,1,'#c07a30',9); P(4,4,1,1,'#c07a30',9); }
  else if (p.kind === 'dog'){ P(0,1,7,3,'#8a5a2b',10); P(7,-1,3,4,'#8a5a2b',10); P(7,-1,1,3,'#5a3a1a',10); P(9,0,1,1,'#2a2228',10); P(10,1,1,1,'#2a2228',10); P(-1,flap ? 0 : 1,1,2,'#8a5a2b',10); P(1,4,1,1,'#5a3a1a',10); P(5,4,1,1,'#5a3a1a',10); }
  else if (p.kind === 'parrot'){ P(0,0,3,4,'#3fbf4a',5); P(3,1,1,1,'#efb341',5); P(1,flap ? -1 : 2,2,2,'#e05a4a',5); P(2,0,1,1,'#111',5); P(-1,3,1,2,'#3a7bd5',5); }
  else if (p.kind === 'dragon'){ P(0,2,8,3,'#a35fe0',12); P(8,1,3,3,'#a35fe0',12); P(10,2,1,1,'#ffcf6b',12); P(-2,3,2,1,'#a35fe0',12); P(3,flap ? -1 : 0,4,2,'#c89aff',12); if (flap) P(11,3,2,1,'#ff7a2a',12); }
  else if (p.kind === 'phoenix'){ P(0,2,6,3,'#ff7a2a',10); P(6,1,3,3,'#ff9a3a',10); P(8,2,1,1,'#111',10); P(2,flap ? -2 : 0,4,2,'#efb341',10); for (let k = 0; k < 3; k++) P(-2 - k * 2, 3 + ((k + flap) % 2), 1, 1, k % 2 ? '#efb341' : '#ff5a2a', 10); }
}
function drawTrash(c, tr){
  const x = tr.x * TS + 4 + tr.r, y = FY + tr.y * TS + 6 + tr.r;
  alpha(c, 0.2, () => R(c, x, y + 5, 8, 2, '#000'));
  if (tr.k === 'paper'){ R(c, x + 1, y, 6, 5, '#f4efe2'); R(c, x + 2, y + 1, 3, 1, '#cfc6b8'); R(c, x + 4, y + 3, 2, 1, '#cfc6b8'); }
  else if (tr.k === 'can'){ R(c, x + 1, y + 2, 6, 3, '#c0392b'); R(c, x + 1, y + 2, 1, 3, '#cfd3da'); }
  else if (tr.k === 'peel'){ R(c, x, y + 3, 8, 2, '#efd34a'); R(c, x + 1, y + 1, 2, 2, '#efd34a'); R(c, x + 5, y + 1, 2, 2, '#efd34a'); }
  else if (tr.k === 'cup'){ R(c, x + 2, y, 4, 5, '#ffffff'); R(c, x + 2, y + 1, 4, 1, '#2f8f55'); }
  else { R(c, x, y + 1, 8, 4, '#b08a55'); R(c, x + 3, y + 1, 2, 4, '#9c7746'); }
}
function drawEvent(c, e, t){
  const bob = RM ? 0 : Math.round(Math.sin(t * 5) * 1.5), x = e.x, y = e.y + bob;
  alpha(c, 0.3, () => R(c, x, e.y + 9, 10, 2, '#000'));
  if (e.t === 'case'){ R(c, x + 3, y - 2, 4, 2, '#3a2a1a'); R(c, x, y, 10, 7, '#8a5a2b'); R(c, x, y + 3, 10, 1, '#6b4420'); R(c, x + 4, y + 2, 2, 2, '#efb341'); }
  else if (e.t === 'viral'){ R(c, x + 2, y - 3, 7, 11, '#222'); R(c, x + 3, y - 2, 5, 8, '#7fb7e8'); R(c, x + 4, y, 1, 1, '#e05a7a'); R(c, x + 6, y, 1, 1, '#e05a7a'); R(c, x + 4, y + 1, 3, 1, '#e05a7a'); R(c, x + 5, y + 2, 1, 1, '#e05a7a'); }
  else if (e.t === 'investor'){ R(c, x + 1, y, 9, 8, '#c9a24a'); R(c, x + 3, y - 2, 5, 2, '#a8862e'); R(c, x + 5, y + 2, 1, 5, '#6b4a10'); R(c, x + 4, y + 3, 3, 1, '#6b4a10'); R(c, x + 4, y + 5, 3, 1, '#6b4a10'); }
  else if (e.t === 'rush'){ R(c, x + 1, y + 1, 8, 7, '#f1ede4'); R(c, x + 9, y + 3, 2, 3, '#f1ede4'); R(c, x + 2, y + 2, 6, 2, '#6b4420'); const s = Math.floor(t * 4) % 2; R(c, x + 3 + s, y - 2, 1, 2, '#e8e8e8'); R(c, x + 6 - s, y - 3, 1, 2, '#e8e8e8'); }
  else if (e.t === 'headhunt'){ R(c, x, y + 1, 11, 7, '#f4efe2'); R(c, x + 1, y + 2, 3, 3, '#4f8fe0'); R(c, x + 5, y + 2, 5, 1, '#5d5849'); R(c, x + 5, y + 4, 4, 1, '#5d5849'); R(c, x + 1, y + 6, 8, 1, '#efb341'); }
  if (Math.floor(t * 4) % 2){ R(c, x - 3, y - 3, 1, 1, '#fff3c0'); R(c, x + 12, y + 1, 1, 1, '#fff3c0'); R(c, x + 6, y - 6, 1, 1, '#fff3c0'); }
}
function drawEmote(c, x, y, kind){
  R(c, x, y, 11, 9, '#ffffff'); R(c, x + 3, y + 9, 2, 2, '#ffffff'); R(c, x, y, 11, 1, 'rgba(0,0,0,.15)');
  const k = kind[0] === '!' ? kind.slice(1) : kind;
  if (kind[0] === '!'){ R(c, x + 1, y + 2, 1, 4, '#b8443a'); R(c, x + 1, y + 7, 1, 1, '#b8443a'); }
  const ox = kind[0] === '!' ? x + 3 : x + 2;
  if (k === 'coffee' || k === 'e'){ R(c, ox + 1, y + 3, 5, 4, '#6b4420'); R(c, ox + 6, y + 4, 1, 2, '#6b4420'); }
  else if (k === 'game' || k === 'f'){ R(c, ox, y + 3, 7, 4, '#4f4f8a'); R(c, ox + 1, y + 4, 1, 1, '#ffffff'); R(c, ox + 5, y + 4, 1, 1, '#e05a4a'); }
  else if (k === 'zzz' || k === 'c'){ R(c, ox, y + 2, 4, 1, '#4f8fe0'); R(c, ox + 2, y + 3, 1, 1, '#4f8fe0'); R(c, ox, y + 4, 4, 1, '#4f8fe0'); R(c, ox + 4, y + 5, 3, 1, '#4f8fe0'); R(c, ox + 5, y + 6, 1, 1, '#4f8fe0'); R(c, ox + 4, y + 7, 3, 1, '#4f8fe0'); }
  else if (k === 'heart' || k === 'o'){ R(c, ox, y + 3, 2, 2, '#e05a7a'); R(c, ox + 3, y + 3, 2, 2, '#e05a7a'); R(c, ox, y + 4, 5, 2, '#e05a7a'); R(c, ox + 1, y + 6, 3, 1, '#e05a7a'); R(c, ox + 2, y + 7, 1, 1, '#e05a7a'); }
}

/* ================= LIGHTING ================= */
const lcv = document.createElement('canvas'); lcv.width = W; lcv.height = H;
const lctx = lcv.getContext('2d');
function hexA(hex, a){ const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
function lightSources(){
  const L = layout(), out = [];
  for (const p of L.f){ const d = FURN_BY[p.id]; if (!d) continue; const cx = p.x * TS + d.w * 8, cy = FY + p.y * TS + d.h * 8 - 4;
    if (d.glow) out.push({x:cx, y:cy, r:d.glow[0], col:d.glow[1]});
    if (d.cat === 'desk' || d.cat === 'ceo') out.push({x:p.x * TS + 9, y:FY + p.y * TS + 12, r:d.cat === 'ceo' ? 30 : 12, col:d.cat === 'ceo' ? '#ffe9a0' : '#8fd0ff'}); }
  for (const p of L.w){ const d = FURN_BY[p.id]; if (d && d.glow) out.push({x:p.x * TS + d.w * 8, y:24, r:d.glow[0], col:d.glow[1]}); }
  return out;
}
function drawLighting(c, night){
  if (night < 0.05) return;
  const ls = lightSources();
  lctx.globalCompositeOperation = 'source-over'; lctx.clearRect(0, 0, W, H);
  lctx.fillStyle = 'rgba(6,8,28,' + (0.62 * night) + ')'; lctx.fillRect(0, 0, W, H);
  lctx.globalCompositeOperation = 'destination-out';
  for (const s of ls){ const g = lctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); lctx.fillStyle = g; lctx.beginPath(); lctx.arc(s.x, s.y, s.r, 0, 7); lctx.fill(); }
  lctx.globalCompositeOperation = 'source-over';
  c.drawImage(lcv, 0, 0);
  c.globalCompositeOperation = 'lighter';
  for (const s of ls){ const g = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r); g.addColorStop(0, hexA(s.col, 0.2 * night)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(s.x, s.y, s.r, 0, 7); c.fill(); }
  c.globalCompositeOperation = 'source-over';
}

/* ================= MAIN SCENE ================= */
function draw(t, dt){
  const th = office().th, L = layout(), night = M.dec ? M.dec.night : 0;
  updateWorkers(dt);
  if (petsDirty) buildPets();
  drawWall(ctx, th, t, night);
  for (const p of L.w){ const d = FURN_BY[p.id]; if (d) drawFurn(ctx, d, p.x * TS, 8, t); }
  drawFloor(ctx, th);
  drawWindowLight(ctx, night);
  for (const p of L.f){ const d = FURN_BY[p.id]; if (d && d.layer === 'r') drawFurn(ctx, d, p.x * TS, FY + p.y * TS, t); }
  drawAreaBounds(ctx, th);
  const seated = new Map();
  workers.forEach(w => { if (w.state === 'sit') seated.set(w.desk, w); });
  const list = [];
  for (const p of L.f){
    const d = FURN_BY[p.id]; if (!d || d.layer === 'r') continue;
    list.push({y:FY + (p.y + d.h) * TS, f:() => {
      let sitter = null;
      if (d.cat === 'ceo') sitter = () => drawChar(ctx, p.x * TS + 10, FY + p.y * TS + 1, bossLook(), {pose:'sit', t, idx:0, fast:bossBump > 0, happy:true});
      else { const w = seated.get(p); if (w) sitter = () => drawChar(ctx, p.x * TS + 10, FY + p.y * TS + 1, w.look, {pose:'sit', t, idx:w.idx}); }
      drawFurn(ctx, d, p.x * TS, FY + p.y * TS, t, sitter);
    }});
  }
  for (const w of workers) if (w.state !== 'sit') list.push({y:w.y + 18, f:() => drawChar(ctx, w.x, w.y, w.look, {pose:w.state === 'use' ? 'stand' : 'walk', dir:w.state === 'use' ? 'up' : w.dir, t, idx:w.idx, hold:w.state === 'back' ? w.hold : null})});
  for (const w of wanderers) list.push({y:w.y + 18, f:() => { drawChar(ctx, w.x, w.y, w.look, {pose:w.state === 'walk' ? 'walk' : 'stand', dir:w.dir, t, idx:w.idx, happy:true}); R(ctx, w.x + 5, w.y - 6, 2, 2, TRAR[w.tal.r].c); }});
  S.trash.forEach(tr => list.push({y:FY + tr.y * TS + 8, f:() => drawTrash(ctx, tr)}));
  if (!RM) movePets(dt, t);
  pets.filter(p => !p.fly).forEach(p => list.push({y:p.y + 6, f:() => drawPet(ctx, p, t)}));
  if (ev) list.push({y:ev.y + 10, f:() => drawEvent(ctx, ev, t)});
  list.sort((a, b) => a.y - b.y).forEach(o => o.f());
  pets.filter(p => p.fly).forEach(p => drawPet(ctx, p, t));
  const filled = workers.filter(w => w.state === 'sit');
  if (S.opt.particles && !RM && filled.length && M.income > 0 && Math.random() < Math.min(0.3, 0.03 + Math.log10(M.income + 1) * 0.01)){
    const w = filled[(Math.random() * filled.length) | 0];
    coins.push({x:w.desk.x * TS + 14 + Math.random() * 4, y:FY + w.desk.y * TS + 2, vx:0, vy:-14, life:1});
  }
  for (let i = coins.length - 1; i >= 0; i--){
    const k = coins[i]; k.life -= dt; k.x += k.vx * dt; k.y += k.vy * dt;
    if (k.life <= 0){ coins.splice(i, 1); continue; }
    alpha(ctx, Math.min(1, k.life * 2), () => { R(ctx, k.x, k.y, 3, 3, '#efb341'); R(ctx, k.x + 1, k.y, 1, 1, '#fff3c0'); R(ctx, k.x + 1, k.y + 2, 2, 1, '#b07a1e'); });
  }
  if (coins.length > 80) coins.splice(0, coins.length - 80);
  drawLighting(ctx, night);
  if (S.weather.type === 'storm' && !RM && Math.random() < 0.004) flash = 1;
  if (flash > 0){ alpha(ctx, flash * 0.35, () => R(ctx, 0, 0, W, H, '#ffffff')); flash = Math.max(0, flash - dt * 3); }
  for (const w of workers){
    if (!(w.emoteT > 0) || !w.emote) continue;
    const ex = w.state === 'sit' ? w.desk.x * TS + 18 : w.x + 9, ey = w.state === 'sit' ? FY + w.desk.y * TS - 10 : w.y - 12;
    drawEmote(ctx, ex, ey, w.emote);
  }
  ctx.font = '8px Silkscreen, monospace'; ctx.textBaseline = 'top';
  for (const w of wanderers) if (w.state === 'idle'){ const nm = w.tal.name.split(' ')[0]; const tw = ctx.measureText(nm).width; R(ctx, w.x + 6 - tw / 2 - 2, w.y - 16, tw + 4, 9, 'rgba(28,32,50,.85)'); ctx.fillStyle = TRAR[w.tal.r].c; ctx.fillText(nm, w.x + 6 - tw / 2, w.y - 15); }
  if (decorMode) drawDecorOverlay(ctx, L, t);
  bossBump = Math.max(0, bossBump - dt);
}
function drawDecorOverlay(c, L, t){
  const A = areaOf(S.office);
  alpha(c, 0.18, () => { for (let x = A.x0; x <= A.x0 + A.w; x++) R(c, x * TS, FY, 1, A.h * TS, '#ffffff'); for (let y = 0; y <= A.h; y++) R(c, A.x0 * TS, FY + y * TS, A.w * TS, 1, '#ffffff'); });
  if (selected){
    const d = FURN_BY[selected.id];
    if (d){ const x = selected.x * TS, y = d.layer === 'w' ? 8 : FY + selected.y * TS, w = d.w * TS, h = d.layer === 'w' ? 24 : d.h * TS, on = Math.floor(t * 4) % 2;
      c.strokeStyle = on ? '#efb341' : '#ffffff'; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  }
  if (placing && hoverTile){
    const d = FURN_BY[placing];
    const x = hoverTile[0] - Math.floor((d.w - 1) / 2), y = d.layer === 'w' ? 0 : hoverTile[1] - Math.floor((d.h - 1) / 2);
    const ok = canPlace(d, x, y, L, S.office);
    const px = x * TS, py = d.layer === 'w' ? 8 : FY + y * TS, ph = d.layer === 'w' ? 24 : d.h * TS;
    alpha(c, 0.35, () => R(c, px, py, d.w * TS, ph, ok ? '#4fbf78' : '#e05a4a'));
    alpha(c, 0.75, () => drawFurn(c, d, px, py, t));
  }
}
