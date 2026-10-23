/* ================= CORE ACTIONS ================= */
let crewDirty = true, petsDirty = true, bossBump = 0, ev = null, nextEvent = 0, autoAcc = 0;
const coins = [];
function earn(v){ if (!(v > 0) || !isFinite(v)) return; S.cash += v; S.run += v; S.total += v; }
function addGold(n, silent){ const g = Math.max(1, Math.round(n * M.goldMult)); S.gold += g; S.goldTotal += g; if (!silent) toast('+' + g + ' gold bars', 'gold'); return g; }
function addXP(raw){ gainXP(raw * M.xpMult); }
function gainXP(x){
  if (!(x > 0)) return;
  S.xp += x;
  let ups = 0;
  while (S.xp >= xpNeed(S.level) && ups < 500){ S.xp -= xpNeed(S.level); S.level++; ups++; }
  if (ups){
    const g = addGold(2 * ups, true);
    toast('LEVEL UP! Career level ' + S.level + '. +' + ups + ' skill point' + (ups > 1 ? 's' : '') + ', +' + g + ' gold', 'lvl');
    dirty.skills = true;
  }
}
function work(lx, ly, auto){
  const v = M.clickVal;
  earn(v); S.stats.clicks++; addXP(auto ? 0.5 : 1); bossBump = 0.25;
  if (!auto) floater('+' + money(v), lx, ly);
  const b = bossPos();
  if (S.opt.particles && b) for (let i = 0; i < (auto ? 1 : 3); i++) coins.push({x:b.x + 4 + Math.random() * 10, y:b.y + 6, vx:(Math.random() - 0.5) * 30, vy:-30 - Math.random() * 20, life:0.8});
}
function buyStaff(s, k, silent){
  const c = costFor(s, k);
  if (!k || S.cash < c || !unlocked(s.req)) return false;
  S.cash -= c; S.emp[s.id] = (S.emp[s.id] || 0) + k;
  S.stats.hires += k; S.stats.maxRole[s.id] = Math.max(S.stats.maxRole[s.id] || 0, S.emp[s.id]);
  if (k >= 100) S.stats.bulk = Math.max(S.stats.bulk, k);
  addXP((s.tier + 1) * 2 * k);
  crewDirty = true;
  if (!silent) recalc();
  return true;
}
function hire(id){ const s = STAFF_BY[id]; if (buyStaff(s, hireAmount(s))) updateUI(); }
function fire(id){
  if (!(S.emp[id] > 0)) return;
  S.emp[id]--; S.stats.fires++; crewDirty = true; recalc();
  toast('Fired one ' + STAFF_BY[id].name + '. A seat opened up.');
  updateUI();
}
function moveOffice(i, silent){
  const o = OFFICES[i];
  if (i <= S.office || !unlocked(o.req) || S.cash < o.cost) return false;
  S.cash -= o.cost; S.office = i; S.stats.maxOffice = Math.max(S.stats.maxOffice, i);
  S.trash = []; officeChanged();
  if (!silent) toast('Moved into ' + o.name + '! Income ×' + o.mult + ', ' + fmt(M.seats) + ' seats.', 'gold');
  dirty.offices = true; dirty.decor = true;
  return true;
}
function officeChanged(){ crewDirty = true; decorDirty = true; layoutDirty = true; petsDirty = true; ev = null; recalc(); }
const upReady = u => !S.up[u.id] && unlocked(u.req) && (u.kind !== 'role' || (S.emp[u.role] || 0) >= u.need);
function buyUpgrade(id, silent){
  const u = UP_BY[id];
  if (!u || !upReady(u) || S.cash < u.cost) return false;
  S.cash -= u.cost; S.up[id] = true; S.stats.ups++;
  if (u.kind === 'decor') decorDirty = true;
  recalc();
  if (!silent) toast('Bought ' + u.name + '.');
  dirty.upgrades = true;
  return true;
}
function buyAllUpgrades(){
  const list = UPGRADES.filter(upReady).sort((a, b) => a.cost - b.cost);
  let n = 0; for (const u of list){ if (S.cash >= u.cost){ buyUpgrade(u.id, true); n++; } }
  if (n) toast('Bought ' + n + ' upgrade' + (n > 1 ? 's' : '') + '.');
  return n;
}
function buyShop(defs, lv, cur, id){
  const d = defs.find(x => x.id === id), l = lv[id] || 0;
  if (!d || l >= d.max) return;
  const c = shopCost(d, l);
  if (S[cur] < c) return;
  S[cur] -= c; lv[id] = l + 1;
  if (['stylist','cosmicdecor'].includes(id)) decorDirty = true;
  if (id === 'roster') talentDirty = true;
  recalc(); updateUI(true);
}
function applyStartBonuses(){
  S.cash = seedCash(sh('seed'));
  recalc();
  if (sh('army')) S.emp.intern = Math.min(5 * sh('army'), M.seats);
  crewDirty = true; recalc();
}
function resetRun(){
  S.run = 0; S.emp = {}; S.boosts = []; S.trash = [];
  if (!st('keepoff')) S.office = 0;
  if (!st('keepup')) S.up = {};
  ev = null; coins.length = 0;
  officeChanged();
  applyStartBonuses();
  markAll();
}
function liquidate(){
  let v = 0;
  for (const s in S.market.hold){ const h = S.market.hold[s]; if (h && h.u){ v += h.u * (S.market.p[s] || 100); } }
  S.market.hold = {};
  if (v > 0){ S.cash += v; S.run += v; }
  return v;
}
function doSell(auto){
  if (!canSell()) return;
  const lq = liquidate();
  const g = shareGain(), val = S.run;
  if (val >= sellTarget() * 100) S.stats.bigSale = true;
  S.stats.bestRun = Math.max(S.stats.bestRun, val);
  S.shares += g; S.sharesCycle += g; S.rebirths++; S.tr++;
  resetRun();
  toast('SOLD for ' + money(val) + (lq ? ' (stocks cashed out)' : '') + '! +' + fmt(g) + ' shares. Money and XP ×' + xf(M.reb), 'lvl');
  if (!auto) save();
}
function doIPO(auto){
  if (!canIPO()) return;
  liquidate();
  const g = stockGain();
  S.stock += g; S.stockCycle += g; S.ipos++; S.ti++;
  S.rebirths = Math.min(2 * st('startreb'), ipoReq() - 5); S.shares = 0; S.sharesCycle = 0;
  if (!ms('keepshares')) S.sh = {};
  resetRun();
  toast('YOU WENT PUBLIC! +' + fmt(g) + ' stock. Spend it in the IPO shop.', 'lvl');
  if (!auto) save();
}
function doMerge(){
  if (!canMerge()) return;
  liquidate();
  const g = creditGain();
  S.credits += g; S.mergers++;
  S.st = {}; S.stock = 0; S.stockCycle = 0;
  S.ipos = Math.min(ms('startipo'), mergeReq() - 1); S.rebirths = 0; S.shares = 0; S.sharesCycle = 0;
  if (!ms('keepshares')) S.sh = {};
  talentDirty = true;
  resetRun();
  toast('MEGA MERGER COMPLETE! +' + g + ' cosmic credits.', 'lvl');
  save();
}

/* Research */
const resAvailable = p => unlocked(p.req) && (!p.prev || S.research.done[p.prev]);
function startResearch(id){
  const p = RES_BY[id];
  if (!p || S.research.done[id] || S.research.active.some(a => a.id === id)) return;
  if (S.research.active.length >= M.slots || !resAvailable(p)) return;
  S.research.active.push({id, end:Date.now() + p.dur / M.rspeed * 1000, len:p.dur / M.rspeed * 1000});
  updateUI(true);
}
const skipCost = a => Math.max(1, Math.ceil((a.end - Date.now()) / 1000 / 120));
function skipResearch(id){
  const a = S.research.active.find(x => x.id === id); if (!a) return;
  const c = skipCost(a); if (S.gold < c) return;
  S.gold -= c; a.end = Date.now(); checkResearch(); updateUI(true);
}
function checkResearch(){
  const t = Date.now(); let doneAny = false;
  S.research.active = S.research.active.filter(a => {
    if (a.end <= t){ S.research.done[a.id] = true; doneAny = true; toast('Research finished: ' + RES_BY[a.id].name, 'gold'); return false; }
    return true;
  });
  if (doneAny){ decorDirty = true; talentDirty = true; recalc(); dirty.research = true; }
}

/* Contracts */
const CTYPES = [
  {t:'earn', ok:() => true, gen:() => { const x = Math.max(500, M.income * randi(300, 900) + M.clickVal * 50); return {target:x, desc:'Earn ' + money(x) + ' in total'}; }, prog:() => S.total},
  {t:'hire', ok:() => true, gen:() => { const n = randi(10, 40); return {target:n, desc:'Hire ' + n + ' staff'}; }, prog:() => S.stats.hires},
  {t:'click', ok:() => true, gen:() => { const n = randi(15, 60) * 10; return {target:n, desc:'Click ' + n + ' times'}; }, prog:() => S.stats.clicks},
  {t:'event', ok:() => true, gen:() => { const n = randi(1, 3); return {target:n, desc:'Grab ' + n + ' office event' + (n > 1 ? 's' : '')}; }, prog:() => S.stats.events},
  {t:'ups', ok:() => UPGRADES.some(upReady), gen:() => { const n = randi(2, 5); return {target:n, desc:'Buy ' + n + ' upgrades'}; }, prog:() => S.stats.ups},
  {t:'sell', ok:() => S.tr >= 1, gen:() => ({target:1, desc:'Sell the company once'}), prog:() => S.tr},
  {t:'level', ok:() => true, gen:() => ({target:1, desc:'Gain a career level'}), prog:() => S.level},
  {t:'research', ok:() => S.tr >= 1, gen:() => ({target:1, desc:'Finish a research project'}), prog:() => researchDone()},
  {t:'crate', ok:() => S.gold >= 30, gen:() => ({target:1, desc:'Open a crate'}), prog:() => S.stats.crates},
  {t:'clean', ok:() => true, gen:() => { const n = randi(3, 10); return {target:n, desc:'Pick up ' + n + ' pieces of trash'}; }, prog:() => S.stats.cleaned},
  {t:'furn', ok:() => true, gen:() => { const n = randi(1, 3); return {target:n, desc:'Buy ' + n + ' piece' + (n > 1 ? 's' : '') + ' of furniture'}; }, prog:() => S.stats.furnBought},
  {t:'trade', ok:() => true, gen:() => { const n = randi(2, 5); return {target:n, desc:'Make ' + n + ' stock trades'}; }, prog:() => S.market.trades},
  {t:'decide', ok:() => true, gen:() => ({target:1, desc:'Answer an inbox decision'}), prog:() => S.inbox.decisions},
  {t:'game', ok:() => true, gen:() => ({target:1, desc:'Play a Break Room game'}), prog:() => S.stats.games},
];
function newContract(){
  const c = pick(CTYPES.filter(x => x.ok())), g = c.gen();
  const reward = Math.round((8 + randi(0, 14) + S.ti * 2 + S.mergers * 5) * M.contractMult);
  return {t:c.t, base:c.prog(), target:g.target, desc:g.desc, reward};
}
function contractProg(c){ const type = CTYPES.find(x => x.t === c.t); return type ? clamp((type.prog() - c.base) / c.target, 0, 1) : 0; }
function claimContract(i){
  const c = S.contracts.slots[i]; if (!c || c.cool || contractProg(c) < 1) return;
  const g = addGold(c.reward, true); gainXP(xpNeed(S.level) * 0.2);
  S.contracts.done++;
  S.contracts.slots[i] = {cool:Date.now() + 20 * 60 * 1000};
  toast('Contract done! +' + g + ' gold and XP', 'gold');
  updateUI(true);
}
function rerollContract(i){ if (S.gold < 5) return; S.gold -= 5; S.contracts.slots[i] = newContract(); updateUI(true); }
function tickContracts(){ S.contracts.slots.forEach((c, i) => { if (!c || (c.cool && c.cool <= Date.now())) S.contracts.slots[i] = newContract(); }); }

/* Crates */
let lastReveal = [];
function rollRarity(w, luck){ const L = 1 + luck * 0.5; const ww = w.map((x, k) => x * Math.pow(L, k)); let r = Math.random() * ww.reduce((a, b) => a + b, 0); for (let k = 0; k < ww.length; k++){ r -= ww[k]; if (r <= 0) return k; } return 0; }
function grantItem(it){
  const o = S.items[it.id] || (S.items[it.id] = {lv:0, c:0});
  if (!o.lv){ o.lv = 1; o.c = 0; if (it.pet) petsDirty = true; return 'NEW'; }
  if (o.lv < RAR[it.r].max){ o.c++; if (o.c >= o.lv){ o.lv++; o.c = 0; return 'LEVEL ' + o.lv; } return '+1 COPY'; }
  S.gold += 2; return 'MAXED +2 GOLD';
}
function openCrate(id, free){
  const cr = CRATES.find(c => c.id === id); if (!cr || (!free && S.gold < cr.cost)) return;
  if (!free) S.gold -= cr.cost;
  S.stats.crates++;
  lastReveal = [];
  for (let n = 0; n < cr.n; n++){ const r = rollRarity(cr.w, M.luck), it = pick(ITEMS.filter(x => x.r === r)); lastReveal.push({id:it.id, note:grantItem(it)}); }
  recalc(); dirty.collection = true; updateUI(true);
}

/* Skills */
function addSkill(id, n){
  const d = SKILLS.find(x => x.id === id); if (!d) return;
  const k = Math.min(n, d.max - sk(id), skillPoints());
  if (k <= 0) return;
  S.skills[id] = sk(id) + k;
  if (id === 'interior') decorDirty = true;
  recalc(); updateUI(true);
}
function refundSkills(){ S.skills = {}; decorDirty = true; recalc(); toast('Skill points refunded.'); updateUI(true); }

/* Office events */
function spawnEvent(t){
  const e = wpick(EVENTS, x => x.w), spot = freeTile();
  if (!spot) return;
  ev = {t:e.t, name:e.name, x:spot[0] * TS + 3, y:FY + spot[1] * TS + 4, until:t + 13};
}
function scheduleEvent(t){ nextEvent = t + (45 + Math.random() * 60) / M.eventFreq; }
function claimEvent(lx, ly){
  const e = ev; ev = null; scheduleEvent(performance.now() / 1000);
  S.stats.events++; addXP(25);
  if (e.t === 'case'){
    const v = Math.max(M.income * 60, M.clickVal * 25, 50) * M.eventVal;
    earn(v); floater('+' + money(v), lx, ly, true); toast('Briefcase of cash: +' + money(v), 'gold');
    if (Math.random() < 0.1) addGold(1);
  } else if (e.t === 'viral'){
    S.boosts.push({k:'income', mult:5, end:Date.now() + 60000 * Math.sqrt(M.eventVal), name:'Viral'});
    floater('VIRAL!', lx, ly, true); toast('Your post went viral! Income ×5 for a while.', 'gold');
  } else if (e.t === 'investor'){
    addGold(randi(1, 3)); gainXP(xpNeed(S.level) * 0.1); floater('INVESTOR!', lx, ly, true);
  } else if (e.t === 'rush'){
    S.boosts.push({k:'click', mult:10, end:Date.now() + 30000 * Math.sqrt(M.eventVal), name:'Coffee rush'});
    floater('RUSH!', lx, ly, true); toast('Coffee rush! Clicks ×10 for a while.', 'gold');
  } else if (e.t === 'headhunt'){
    const owned = STAFF.filter(s => unlocked(s.req) && (S.emp[s.id] || 0) > 0);
    const s = owned.length ? owned[owned.length - 1] : STAFF[0];
    const k = Math.min(Math.max(1, Math.round(5 * Math.sqrt(M.eventVal))), M.seats - totalEmp());
    if (k > 0){ S.emp[s.id] = (S.emp[s.id] || 0) + k; S.stats.maxRole[s.id] = Math.max(S.stats.maxRole[s.id] || 0, S.emp[s.id]); crewDirty = true; toast('A headhunter brought you ' + k + ' free ' + s.name + (k > 1 ? 's' : '') + '!', 'gold'); }
    else { const v = M.income * 120 * M.eventVal; earn(v); toast('No free seats, so the headhunter paid ' + money(v) + ' instead.', 'gold'); }
    floater('HIRED!', lx, ly, true);
  }
  recalc();
}

/* Automation */
function runAutomation(){
  if (sh('autohire') && S.auto.hire){
    let n = 0;
    while (n < 200){
      if (M.seats - totalEmp() <= 0) break;
      let best = null, bv = 0;
      for (const s of STAFF){ if (!unlocked(s.req)) continue; const c = costFor(s, 1); if (c > S.cash) continue; const v = roleRate(s) / c; if (v > bv){ bv = v; best = s; } }
      if (!best) break;
      buyStaff(best, 1, true); n++;
    }
    if (n) recalc();
  }
  if (sh('autoup') && S.auto.up){ const list = UPGRADES.filter(upReady).sort((a, b) => a.cost - b.cost); for (const u of list){ if (S.cash >= u.cost) buyUpgrade(u.id, true); else break; } }
  if (sh('automove') && S.auto.move){ for (let i = OFFICES.length - 1; i > S.office; i--){ if (unlocked(OFFICES[i].req) && S.cash >= OFFICES[i].cost){ moveOffice(i, true); break; } } }
  if (st('autosell') && S.auto.sell && S.run + marketValue() >= sellTarget() * Math.max(1, +S.auto.sellX || 1)) doSell(true);
  if (ms('autoipo') && S.auto.ipo && canIPO()) doIPO(true);
}
