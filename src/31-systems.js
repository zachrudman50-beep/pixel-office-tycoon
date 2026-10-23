/* ================= FURNITURE AND LAYOUTS ================= */
let layoutDirty = true;
function layout(i){ if (i == null) i = S.office; return S.decor.layouts[i] || (S.decor.layouts[i] = autoLayout(i)); }
const placedCount = (id, L) => L.f.filter(p => p.id === id).length + L.w.filter(p => p.id === id).length;
const inSeason = d => d.month == null || d.month === month();
function canPlace(d, x, y, L, i, ignore){
  const A = areaOf(i);
  if (d.layer === 'w'){
    if (x < A.x0 || x + d.w > A.x0 + A.w) return false;
    for (let k = 0; k < d.w; k++) if (wallBlocked(i, x + k)) return false;
    return !L.w.some(p => p !== ignore && FURN_BY[p.id] && x < p.x + FURN_BY[p.id].w && p.x < x + d.w);
  }
  if (x < A.x0 || y < 0 || x + d.w > A.x0 + A.w || y + d.h > A.h) return false;
  const b = {x, y, w:d.w, h:d.h};
  for (const p of L.f){
    if (p === ignore) continue;
    const e = FURN_BY[p.id]; if (!e) continue;
    if ((e.layer === 'r') !== (d.layer === 'r')) continue;
    if (overlaps(b, {x:p.x, y:p.y, w:e.w, h:e.h})) return false;
  }
  return true;
}
function autoLayout(i, owned){
  owned = owned || S.decor.owned;
  const A = areaOf(i), L = {f:[], w:[]};
  const put = (id, x, y) => { const d = FURN_BY[id]; if (d && canPlace(d, x, y, L, i)){ (d.layer === 'w' ? L.w : L.f).push(d.layer === 'w' ? {id, x} : {id, x, y}); return true; } return false; };
  put('ceo', A.x0 + Math.floor(A.w / 2) - 1, A.h - 2);
  const expand = filter => { const out = []; FURN.filter(filter).sort((a, b) => b.cost - a.cost).forEach(d => { for (let k = 0; k < (owned[d.id] || 0); k++) out.push(d.id); }); return out; };
  const desks = expand(d => d.cat === 'desk');
  let k = 0;
  for (let y = 1; y + 2 <= A.h - 2 && k < desks.length; y += A.h <= 8 ? 2 : 3) for (let x = A.x0 + 1; x + 2 <= A.x0 + A.w - 1 && k < desks.length; x += 3) if (put(desks[k], x, y)) k++;
  const spots = [];
  for (let x = A.x0; x < A.x0 + A.w; x++) spots.push([x, 0]);
  for (let y = 1; y < A.h; y++){ spots.push([A.x0, y]); spots.push([A.x0 + A.w - 1, y]); }
  for (let y = 1; y < A.h; y++) for (let x = A.x0 + 1; x < A.x0 + A.w - 1; x++) spots.push([x, y]);
  for (const id of expand(d => d.layer === 'f' && d.cat !== 'desk' && d.cat !== 'ceo')) for (const [x, y] of spots) if (put(id, x, y)) break;
  for (const id of expand(d => d.layer === 'r')) for (const [x, y] of spots) if (put(id, x, y)) break;
  for (const id of expand(d => d.layer === 'w')) for (let x = A.x0; x < A.x0 + A.w; x++) if (put(id, x, 0)) break;
  return L;
}
function furnCost(d){ return d.cost * Math.pow(1.6, Math.max(0, fOwned(d.id) - (STARTER[d.id] || 0))); }
function furnLvCost(d){ return Math.max(100, d.cost) * 4 * Math.pow(5, fLevel(d.id) - 1); }
const furnUnlocked = d => S.stats.maxOffice >= d.req && d.cat !== 'ceo';
function buyFurn(id){
  const d = FURN_BY[id]; if (!d || !furnUnlocked(d) || !inSeason(d)) return;
  const c = furnCost(d); if (S.cash < c) return;
  S.cash -= c; S.decor.owned[id] = fOwned(id) + 1; S.stats.furnBought++;
  toast('Bought ' + d.name + '. Press PLACE to put it in your office.');
  updateUI(true);
}
function levelFurn(id){
  const d = FURN_BY[id]; if (!d || fLevel(id) >= 25) return;
  const c = furnLvCost(d); if (S.cash < c) return;
  S.cash -= c; S.decor.lv[id] = fLevel(id) + 1; decorDirty = true; recalc(); updateUI(true);
}
let placing = null, selected = null, decorMode = false, hoverTile = null;
function setDecorMode(on){
  decorMode = on; if (!on){ placing = null; selected = null; }
  $('wrap').classList.toggle('decor', on);
  $('decorBtn').classList.toggle('on', on);
  $('decorBtn').textContent = on ? 'DONE DECORATING' : 'DECORATE';
  updateDecorHint(); dirty.decor = true; updateUI(true);
}
function updateDecorHint(){
  const h = $('decorHint');
  if (!decorMode){ h.hidden = true; return; }
  h.hidden = false;
  h.textContent = placing ? 'PLACING ' + FURN_BY[placing].name.toUpperCase() + ' · click a green spot · right-click to cancel'
    : selected ? 'SELECTED ' + FURN_BY[selected.id].name.toUpperCase() + ' · use the Decor tab to move, store or upgrade'
    : 'DECORATE MODE · click furniture to select it, or pick an item in Office → Decor';
}
function startPlacing(id){
  const d = FURN_BY[id], L = layout();
  if (!d || placedCount(id, L) >= fOwned(id)) return toast('You have placed every ' + d.name + ' you own.');
  placing = id; selected = null; if (!decorMode) setDecorMode(true); else { updateDecorHint(); updateUI(true); }
}
function placeAt(tx, ty){
  const d = FURN_BY[placing], L = layout();
  const x = tx - Math.floor((d.w - 1) / 2), y = d.layer === 'w' ? 0 : ty - Math.floor((d.h - 1) / 2);
  if (!canPlace(d, x, y, L, S.office)) return false;
  if (d.layer === 'w') L.w.push({id:d.id, x}); else L.f.push({id:d.id, x, y});
  decorDirty = true; layoutDirty = true; crewDirty = true;
  S.stats.placedMax = Math.max(S.stats.placedMax, L.f.length + L.w.length);
  if (placedCount(d.id, L) >= fOwned(d.id)) placing = null;
  recalc(); updateDecorHint(); dirty.decor = true;
  return true;
}
function itemAt(lx, ly){
  const L = layout();
  if (ly < FY){ const tx = Math.floor(lx / TS); return L.w.find(p => FURN_BY[p.id] && tx >= p.x && tx < p.x + FURN_BY[p.id].w) || null; }
  const tx = Math.floor(lx / TS), ty = Math.floor((ly - FY) / TS);
  const hit = L.f.filter(p => { const d = FURN_BY[p.id]; return d && tx >= p.x && tx < p.x + d.w && ty >= p.y && ty < p.y + d.h; });
  return hit.find(p => FURN_BY[p.id].layer !== 'r') || hit[0] || null;
}
function storeItem(p){
  const L = layout(); if (!p || p.id === 'ceo') return;
  L.f = L.f.filter(x => x !== p); L.w = L.w.filter(x => x !== p);
  if (selected === p) selected = null;
  decorDirty = true; layoutDirty = true; crewDirty = true; recalc(); updateDecorHint(); updateUI(true);
}
function moveItem(p){ if (!p) return; const id = p.id; if (id === 'ceo'){ layout().f = layout().f.filter(x => x !== p); } else storeItem(p); placing = id; selected = null; if (id === 'ceo') S.decor.owned.ceo = 1; decorDirty = true; layoutDirty = true; updateDecorHint(); updateUI(true); }
function storeAll(){ const L = layout(); L.f = L.f.filter(p => p.id === 'ceo'); L.w = []; selected = null; decorDirty = true; layoutDirty = true; crewDirty = true; recalc(); updateUI(true); }
function autoArrange(){ S.decor.layouts[S.office] = autoLayout(S.office); selected = null; placing = null; decorDirty = true; layoutDirty = true; crewDirty = true; recalc(); toast('Furniture arranged.'); updateUI(true); }

/* ================= TALENT ================= */
let lastTalent = null;
function rollTalent(w){
  const r = rollRarity(w, M.tluck);
  const n = r >= 4 ? 3 : r >= 2 ? 2 : 1, traits = [];
  while (traits.length < n){ const t = pick(TRAITS)[0]; if (!traits.includes(t)) traits.push(t); }
  return {id:S.talent.next++, name:pick(FIRST) + ' ' + pick(LAST), r, traits, lv:1, role:null,
    look:{skin:pick(SKIN), hair:pick(HAIR), shirt:'hsl(' + randi(0, 359) + ',45%,' + randi(35, 55) + '%)', pants:pick(['#2f3446','#3a2f28','#2a3a2f','#46403a'])}};
}
function hireTalent(t){
  if (S.talent.roster.length >= M.roster){ toast('Your talent roster is full. Release someone first.'); return false; }
  S.talent.roster.push(t); S.stats.talents++; lastTalent = t; talentDirty = true; layoutDirty = true; recalc();
  toast('Hired ' + t.name + ', a ' + TRAR[t.r].n + '!', t.r >= 3 ? 'lvl' : 'gold');
  return true;
}
function headhunt(id){
  const h = HUNTS.find(x => x.id === id); if (!h || S.gold < h.cost || S.talent.roster.length >= M.roster) return;
  S.gold -= h.cost; hireTalent(rollTalent(h.w)); dirty.talent = true; updateUI(true);
}
const trainCost = t => Math.max(1000, M.income * 20) * Math.pow(1.35, t.lv);
function trainTalent(id){ const t = S.talent.roster.find(x => x.id === id); if (!t || t.lv >= 50) return; const c = trainCost(t); if (S.cash < c) return; S.cash -= c; t.lv++; talentDirty = true; recalc(); updateUI(); }
function assignTalent(id, role){
  const t = S.talent.roster.find(x => x.id === id); if (!t) return;
  if (role) S.talent.roster.forEach(o => { if (o !== t && o.role === role) o.role = null; });
  t.role = role || null; talentDirty = true; layoutDirty = true; recalc(); updateUI(true);
}
function releaseTalent(id){ S.talent.roster = S.talent.roster.filter(x => x.id !== id); S.gold += 10; talentDirty = true; layoutDirty = true; recalc(); toast('Released. +10 gold severance refund.'); updateUI(true); }

/* ================= MARKET ================= */
let lastMarket = 0;
function initMarket(){ for (const s of STOCKS){ if (!S.market.p[s.sym]) S.market.p[s.sym] = 100; if (!Array.isArray(S.market.hist[s.sym])) S.market.hist[s.sym] = [S.market.p[s.sym]]; } }
function gauss(){ return (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 1.2; }
function tickMarket(){
  let news = null;
  for (const s of STOCKS){
    let p = S.market.p[s.sym] || 100;
    p *= Math.exp(0.004 * Math.log(100 / p) + 0.0008 + s.vol * gauss());
    if (!news && Math.random() < 0.012){ const [dir, line] = pick(NEWS); p *= dir > 0 ? rand(1.12, 1.4) : rand(0.65, 0.88); news = line.replace('%s', s.name); }
    p = clamp(p, 4, 2500);
    S.market.p[s.sym] = p;
    const h = S.market.hist[s.sym]; h.push(p); if (h.length > 60) h.shift();
  }
  if (news){ S.market.news = news; }
}
function buyStock(sym){
  const amt = S.cash * (S.market.frac || 0.25); if (!(amt > 0)) return;
  const p = S.market.p[sym], h = S.market.hold[sym] || (S.market.hold[sym] = {u:0, cost:0});
  S.cash -= amt; h.u += amt / p; h.cost += amt; S.market.trades++; updateUI();
}
function sellStock(sym, silent){
  const h = S.market.hold[sym]; if (!h || !h.u) return 0;
  const gross = h.u * S.market.p[sym];
  let net = gross * (1 - M.fee); const prof = net - h.cost;
  if (prof > 0) net = h.cost + prof * M.tradeMult;
  const ratio = h.cost > 0 ? (net - h.cost) / h.cost : 0;
  S.market.bestTrade = Math.max(S.market.bestTrade, ratio);
  S.market.profit += net - h.cost; S.market.trades++;
  delete S.market.hold[sym];
  S.cash += net; if (net > h.cost) { S.run += net - h.cost; S.total += net - h.cost; }
  if (!silent) toast((net >= h.cost ? 'Sold for a profit of ' : 'Sold at a loss of ') + money(Math.abs(net - h.cost)), net >= h.cost ? 'gold' : '');
  updateUI();
  return net;
}

/* ================= INBOX ================= */
const fx = {
  cash:p => { const v = Math.abs(S.cash * p); if (p < 0){ S.cash -= v; return 'Paid ' + money(v) + '. '; } earn(v); return 'Gained ' + money(v) + '. '; },
  boost:(k, mult, sec, name) => { S.boosts.push({k, mult, end:Date.now() + sec * 1000, name}); return (k === 'income' ? 'Income' : 'Clicks') + ' ×' + mult + ' for ' + fmtTime(sec) + '. '; },
  gold:n => '+' + addGold(n, true) + ' gold bars. ',
  xp:f => { gainXP(xpNeed(S.level) * f); return '+' + Math.round(f * 100) + '% of a level in XP. '; },
  trash:n => { for (let i = 0; i < n; i++) spawnTrash(); return ''; },
  clean:() => { const n = S.trash.length; S.trash = []; return 'Cleaned ' + n + ' pieces of trash. '; },
  crate:() => { openCrate('supply', true); return 'It was a free Supply Crate! Check Progress → Crates. '; },
  talent:() => { const t = rollTalent(HUNTS[0].w); return hireTalent(t) ? 'You hired ' + t.name + '. ' : 'Your roster was full, so they left. '; },
  furn:set => { const pool = FURN.filter(d => d.cat !== 'ceo' && (set ? d.set === set : furnUnlocked(d) && d.month == null)); const d = pick(pool.sort((a, b) => a.cost - b.cost).slice(0, Math.max(3, Math.ceil(pool.length * 0.6)))); S.decor.owned[d.id] = fOwned(d.id) + 1; return 'You got a free ' + d.name + '. Place it from Office → Decor. '; },
  research:sec => { const a = S.research.active[0]; if (!a) return 'There was nothing in the lab to speed up. '; a.end -= sec * 1000; checkResearch(); return 'Your lab project jumped ahead ' + fmtTime(sec) + '. '; },
  loseStaff:f => { let n = 0; for (const s of STAFF){ const c = S.emp[s.id] || 0, k = Math.floor(c * f); if (k){ S.emp[s.id] -= k; n += k; } } crewDirty = true; recalc(); return n ? 'You lost ' + n + ' staff. ' : 'Nobody actually left. '; },
  stockTip:() => { const s = pick(STOCKS); S.market.p[s.sym] *= Math.random() < 0.6 ? 1.35 : 0.7; return s.name + ' just moved sharply. Check the market. '; },
};
function pushMail(m){ m.id = S.inbox.nextId++; m.time = Date.now(); m.read = false; S.inbox.msgs.unshift(m); if (S.inbox.msgs.length > 40) S.inbox.msgs.length = 40; dirty.inbox = true; }
function spawnDecision(){
  const pool = DECISIONS.filter(d => d.month == null || d.month === month());
  const d = pick(pool);
  pushMail({kind:'dec', did:d.id, from:d.from, title:d.title, body:d.body, exp:Date.now() + 15 * 60 * 1000});
  toast('New email: ' + d.title, 'mail');
}
function decide(mid, k){
  const m = S.inbox.msgs.find(x => x.id === mid); if (!m || m.done || m.kind !== 'dec') return;
  const d = DECISIONS.find(x => x.id === m.did); if (!d) return;
  m.done = true; m.read = true; m.res = d.opts[k][1]() || 'Done.'; m.choice = d.opts[k][0];
  S.inbox.decisions++; addXP(10); recalc(); updateUI(true);
}
function claimMail(mid){ const m = S.inbox.msgs.find(x => x.id === mid); if (!m || m.claimed || !m.gold) return; m.claimed = true; m.read = true; m.res = '+' + addGold(m.gold, true) + ' gold bars claimed.'; updateUI(true); }
function checkStory(){
  for (const [id, from, title, body, gold, cond] of STORY){
    if (S.inbox.story[id]) continue;
    let ok = false; try { ok = cond(); } catch(e){}
    if (ok){ S.inbox.story[id] = 1; pushMail({kind:'story', from, title, body, gold}); toast('New email from ' + from, 'mail'); }
  }
}
function tickInbox(){
  const t = Date.now();
  S.inbox.msgs.forEach(m => { if (m.kind === 'dec' && !m.done && m.exp < t){ m.done = true; m.expired = true; m.res = 'You took too long. The moment passed.'; } });
  if (!S.inbox.nextDec) S.inbox.nextDec = t + 90 * 1000;
  if (t > S.inbox.nextDec && totalEmp() > 0){ spawnDecision(); S.inbox.nextDec = t + rand(4, 8) * 60 * 1000; }
  checkStory();
}

/* ================= RIVALS ================= */
const rivalWorth = r => r.worth * (1 + 0.1 * (Date.now() - S.created) / 86400000);
function checkRivals(){
  for (const r of RIVALS){
    if (S.rivals.beat[r.i] || S.total < rivalWorth(r)) continue;
    S.rivals.beat[r.i] = Date.now();
    const g = addGold(20 + 15 * r.i, true);
    pushMail({kind:'story', from:r.ceo + ', ' + r.name, title:'You passed ' + r.name, body:TAUNTS[r.i % TAUNTS.length] + ' (Permanent +5% income for beating a rival.)', gold:0});
    toast('You overtook ' + r.name + '! +' + g + ' gold, +5% income forever', 'lvl');
    recalc(); dirty.rivals = true;
  }
}

/* ================= TRASH, WEATHER ================= */
let trashAcc = 0, janAcc = 0;
const TRASH_KINDS = ['paper','can','peel','cup','box'];
function freeTile(){
  const A = areaOf(S.office), B = blockedGrid(), opts = [];
  for (let y = 0; y < A.h; y++) for (let x = A.x0; x < A.x0 + A.w; x++) if (!B[y][x] && !S.trash.some(t => t.x === x && t.y === y)) opts.push([x, y]);
  return opts.length ? pick(opts) : null;
}
function spawnTrash(){ if (S.trash.length >= 25) return; const t = freeTile(); if (t) S.trash.push({x:t[0], y:t[1], k:pick(TRASH_KINDS), r:randi(0, 3)}); }
function tickTrash(dt){
  const emp = M.emp; if (!emp) return;
  trashAcc += dt * Math.pow(emp + 1, 0.25) / 90 * M.trashRate;
  while (trashAcc >= 1){ trashAcc -= 1; spawnTrash(); }
  if (DEC.jan && S.trash.length){ janAcc += dt * DEC.jan / 20; while (janAcc >= 1 && S.trash.length){ janAcc -= 1; S.trash.shift(); S.stats.cleaned++; } } else janAcc = 0;
}
function cleanTrash(i, lx, ly){
  S.trash.splice(i, 1); S.stats.cleaned++;
  const v = M.income * 3 + M.clickVal; earn(v); addXP(3);
  floater('CLEAN +' + money(v), lx, ly);
  recalc();
}
function tickWeather(){
  if (Date.now() < S.weather.until) return;
  const w = office().th.win, mo = month();
  let opts;
  if (isSpace()) opts = [['clear',6],['meteors',2]];
  else if (w === 'arctic') opts = [['snow',6],['fog',2],['cloudy',2],['sunny',1]];
  else if (w === 'desert') opts = [['sunny',8],['cloudy',1],['storm',1]];
  else if (w === 'ocean') opts = [['clear',1]];
  else { const winter = mo === 11 || mo <= 1; opts = [['sunny',5],['cloudy',3],['rain',3],['storm',1],['fog',1],['snow',winter ? 3 : 0]]; }
  S.weather = {type:wpick(opts, o => o[1])[0], until:Date.now() + rand(8, 20) * 60 * 1000};
  if (S.weather.type === 'storm') S.stats.storms++;
  if (S.weather.type === 'snow') S.stats.snows++;
  recalc();
}
