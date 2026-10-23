/* ================= STATE ================= */
const fresh = () => ({
  v:3, cash:0, run:0, total:0, emp:{}, office:0, up:{},
  level:1, xp:0, skills:{},
  rebirths:0, tr:0, shares:0, sharesCycle:0, sh:{},
  ipos:0, ti:0, stock:0, stockCycle:0, st:{},
  mergers:0, credits:0, ms:{},
  gold:0, goldTotal:0, items:{},
  research:{done:{}, active:[]},
  contracts:{slots:[null,null,null], done:0},
  ach:{},
  stats:{clicks:0, hires:0, fires:0, events:0, ups:0, crates:0, play:0, maxRole:{}, maxOffice:0, bestRun:0, maxEmp:0, bigSale:false, pets:0, bulk:0,
    cleaned:0, furnBought:0, placedMax:0, talents:0, storms:0, snows:0, nightPlay:0, spins:0, jackpots:0, tossPerfect:0, zeroBest:0, games:0, synMax:0, styleMax:0, perfect:false},
  boosts:[], auto:{hire:false, up:false, move:false, sell:false, sellX:1, ipo:false},
  opt:{sci:false, particles:true, achFilter:'todo', daylock:false, fcat:'all'},
  daily:{last:'', streak:0},
  decor:{owned:Object.assign({}, STARTER), lv:{}, layouts:{}},
  talent:{roster:[], next:1},
  market:{p:{}, hist:{}, hold:{}, profit:0, trades:0, bestTrade:0, news:'Markets are open.', frac:0.25},
  inbox:{msgs:[], story:{}, decisions:0, nextDec:0, nextId:1},
  rivals:{beat:{}},
  trash:[], weather:{type:'sunny', until:0},
  mg:{tossCd:0, zeroCd:0},
  lastSave:Date.now(), created:Date.now(), cat:'biz', tab:'staff', ptab:'sell', amt:1,
});
function normalize(d){
  const s = fresh();
  if (!d || typeof d !== 'object') return s;
  for (const k of Object.keys(d)){
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) s[k] = Object.assign(s[k], d[k]);
    else s[k] = d[k];
  }
  if (!Array.isArray(s.research.active)) s.research.active = [];
  if (!Array.isArray(s.contracts.slots) || s.contracts.slots.length !== 3) s.contracts.slots = [null,null,null];
  if (!Array.isArray(s.boosts)) s.boosts = [];
  if (!Array.isArray(s.trash)) s.trash = [];
  if (!Array.isArray(s.talent.roster)) s.talent.roster = [];
  if (!Array.isArray(s.inbox.msgs)) s.inbox.msgs = [];
  s.stats.maxRole = Object.assign({}, s.stats.maxRole);
  s.decor.owned = Object.assign({}, s.decor.owned); s.decor.owned.ceo = 1;
  for (const k in STARTER) if (!(s.decor.owned[k] >= STARTER[k])) s.decor.owned[k] = STARTER[k];
  if (!s.decor.layouts || typeof s.decor.layouts !== 'object') s.decor.layouts = {};
  if (s.v !== 3){ s.v = 3; s.cat = 'biz'; s.tab = 'staff'; }
  return s;
}
function encodeSave(){ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function decodeSave(str){ return normalize(JSON.parse(decodeURIComponent(escape(atob(str.trim()))))); }
function save(){ S.lastSave = Date.now(); try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch(e){} }
let migrated = false;
function loadSaved(){
  try {
    const raw = localStorage.getItem(SAVE_KEY); if (raw) return normalize(JSON.parse(raw));
    const old = localStorage.getItem(OLD_KEY); if (old){ migrated = true; return normalize(JSON.parse(old)); }
  } catch(e){}
  return null;
}

/* ================= FORMULAS ================= */
const sh = id => S.sh[id] || 0, st = id => S.st[id] || 0, ms = id => S.ms[id] || 0, sk = id => S.skills[id] || 0;
const unlocked = req => S.tr >= (req.r || 0) && S.ti >= (req.i || 0) && S.mergers >= (req.m || 0);
const reqText = req => [req.m && req.m + ' merger' + (req.m > 1 ? 's' : ''), req.i && req.i + ' IPO' + (req.i > 1 ? 's' : ''), req.r && req.r + ' sale' + (req.r > 1 ? 's' : '')].filter(Boolean).join(' + ');
const office = () => OFFICES[S.office];
const totalEmp = () => STAFF.reduce((a, s) => a + (S.emp[s.id] || 0), 0);
const seedCash = l => l ? 100 * Math.pow(10, l) : 0;
const xpNeed = L => Math.floor(50 * Math.pow(1.16, L - 1));
const sellTarget = () => 1e6 * Math.pow(4, S.rebirths);
const shareGain = () => Math.floor(5 * Math.pow(Math.max(0, S.run + marketValue()) / 1e6, 0.35) * M.shareMult);
const ipoReq = () => 15 + 5 * S.ipos;
const stockGain = () => Math.max(1, Math.floor(Math.pow(S.sharesCycle / 1000, 0.3) * M.stockMult));
const mergeReq = () => 3 + S.mergers;
const creditGain = () => Math.max(1, Math.floor(Math.pow(S.stockCycle / 10, 0.35)));
const canSell = () => S.run + marketValue() >= sellTarget();
const canIPO = () => S.rebirths >= ipoReq();
const canMerge = () => S.ipos >= mergeReq();
const shopCost = (d, l) => Math.ceil(d.base * Math.pow(d.g, l));
let achN = 0;
const skillSpent = () => Object.values(S.skills).reduce((a, b) => a + b, 0);
const skillPoints = () => (S.level - 1) - skillSpent();
const researchDone = () => Object.keys(S.research.done).length;
const boostMult = k => S.boosts.reduce((a, b) => b.k === k && b.end > Date.now() ? a * b.mult : a, 1);
const month = () => new Date().getMonth();
function gameHour(){ if (S.opt.daylock) return 13; const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
function nightness(h){ if (h >= 7 && h <= 18) return 0; if (h >= 20.5 || h <= 5) return 1; if (h > 18) return (h - 18) / 2.5; return (7 - h) / 2; }
const isSpace = () => SPACE_SKY.has(office().th.win);
function marketValue(){ let v = 0; for (const s in S.market.hold){ const h = S.market.hold[s]; if (h && h.u) v += h.u * (S.market.p[s] || 100); } return v; }

/* ================= DECOR AND TALENT AGGREGATES ================= */
let decorDirty = true, talentDirty = true, DEC = null, TAL = null;
function areaOf(i){ const [w, h] = OFFICES[i].size; return {x0:Math.floor((COLS - w) / 2), y0:0, w, h}; }
function wallBlocked(i, x){ if (i === 0) return (x >= 1 && x <= 4) || (x >= 14 && x <= 21); return WIN_COLS.some(([a, b]) => x >= a && x <= b); }
const fLevel = id => S.decor.lv[id] || 1;
const fOwned = id => S.decor.owned[id] || 0;
function boxOf(p, d){ return d.layer === 'w' ? {x:p.x, y:-1, w:d.w, h:1} : {x:p.x, y:p.y, w:d.w, h:d.h}; }
function gap(a, b){ const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w - 1, b.x + b.w - 1)); const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h - 1, b.y + b.h - 1)); return Math.max(dx, dy); }
function overlaps(a, b){ return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
function computeTalent(){
  const T = {dept:{}, inc:0, xp:0, freq:0, cost:0, night:0, morning:0, click:0, luck:0, trade:0, style:0, clean:0, c:0, e:0, f:0, o:0, rspeed:0, contract:0, shares:0, offline:0, gold:0, heads:0};
  const rmul = researchVal('talent');
  for (const t of S.talent.roster){
    const scale = (1 + 0.5 * t.r) * (1 + 0.02 * t.lv);
    let work = 0;
    for (const tr of t.traits){ const d = TRAIT_BY[tr]; if (!d) continue; if (d[2] === 'dept') work += d[3] * scale; else if (t.role) T[d[2]] += d[3] * scale; }
    if (t.role && STAFF_BY[t.role]){ T.heads++; T.dept[t.role] = Math.max(T.dept[t.role] || 1, (1 + TRAR[t.r].pow * t.lv * rmul) * (1 + work)); }
  }
  TAL = T; talentDirty = false;
}
const MULT_T = ['inc','click','xp','cost','shares','low','decor','talent'];
function researchVal(type){
  const mul = MULT_T.includes(type); let v = mul ? 1 : 0;
  for (const id in S.research.done){ const p = RES_BY[id]; if (p && p.type === type) v = mul ? v * p.val : v + p.val; }
  return v;
}
function computeDecor(){
  const L = layout(S.office), all = [];
  for (const p of L.f){ const d = FURN_BY[p.id]; if (d) all.push({p, d, b:boxOf(p, d)}); }
  for (const p of L.w){ const d = FURN_BY[p.id]; if (d) all.push({p, d, b:boxOf(p, d)}); }
  const sets = {};
  all.forEach(x => { if (x.d.set) sets[x.d.set] = (sets[x.d.set] || 0) + 1; });
  const setMult = s => { const n = sets[s] || 0; return n >= 20 ? 1.5 : n >= 10 ? 1.25 : n >= 5 ? 1.1 : 1; };
  const rugs = all.filter(x => x.d.layer === 'r');
  const syn = {breakroom:0, game:0, window:0, lamp:0, zen:0, gallery:0, rug:0};
  const sup = {e:0, c:0, f:0, o:0};
  let style = 0, clean = 0, jan = 0, lamps = 0, ev = 0;
  const gmul = researchVal('decor') * (1 + 0.04 * sk('interior')) * (1 + 0.05 * sh('stylist')) * Math.pow(1.5, ms('cosmicdecor')) * (M.decorUp || 1);
  for (const x of all){
    const d = x.d, stt = d.stats;
    let m = (1 + 0.25 * (fLevel(d.id) - 1)) * setMult(d.set) * gmul, om = 1, cm = 1;
    if (d.cat === 'energy' && all.some(y => y.d.cat === 'seat' && gap(x.b, y.b) <= 3)){ m *= 1.5; syn.breakroom++; }
    if (d.cat === 'fun' && all.some(y => y !== x && y.d.cat === 'fun' && y.d.id !== d.id && gap(x.b, y.b) <= 2)){ m *= 1.25; syn.game++; }
    if (d.cat === 'plant' && d.layer === 'f' && x.p.y === 0){ cm = 1.5; syn.window++; }
    if (d.cat === 'desk' && all.some(y => y.d.cat === 'light' && gap(x.b, y.b) <= 2)){ om = 1.3; syn.lamp++; }
    if (d.cat === 'focus' && !all.some(y => y.d.cat === 'fun' && gap(x.b, y.b) <= 3)){ m *= 1.25; syn.zen++; }
    if (d.cat === 'art' && all.some(y => y !== x && y.d.cat === 'art' && gap(x.b, y.b) <= 1)){ m *= 1.25; syn.gallery++; }
    if (d.layer === 'f' && rugs.some(r => overlaps(x.b, r.b))){ m *= 1.2; syn.rug++; }
    sup.e += (stt.e || 0) * m; sup.c += (stt.c || 0) * m * cm; sup.f += (stt.f || 0) * m; sup.o += (stt.o || 0) * m * om;
    style += (stt.s || 0) * m; clean += stt.cl || 0; jan += stt.jan || 0; ev += stt.ev || 0;
    if (d.cat === 'light') lamps++;
  }
  const synTotal = Object.values(syn).reduce((a, b) => a + b, 0);
  DEC = {sup, style, clean, jan, lamps, ev, sets, syn, synTotal, count:all.length, desks:L.f.filter(p => FURN_BY[p.id] && FURN_BY[p.id].cat === 'desk').length};
  decorDirty = false;
}
const WEATHER = {
  sunny:{n:'SUNNY', mod:{c:1.1}}, cloudy:{n:'CLOUDY', mod:{}}, rain:{n:'RAIN', mod:{o:1.1, f:0.95}}, storm:{n:'STORM', mod:{o:1.15, e:0.9}},
  snow:{n:'SNOW', mod:{c:0.9, f:1.1}}, fog:{n:'FOG', mod:{o:0.95, c:1.05}}, clear:{n:'CLEAR', mod:{}}, meteors:{n:'METEORS', mod:{f:1.1}},
};

function recalc(){
  if (talentDirty || !TAL) computeTalent();
  const m = {click:1, all:1, xp:1, seatsPct:0, cost:1, hustle:0, case:1, role:{}, decorUp:1};
  for (const id in S.up){
    const u = UP_BY[id]; if (!u) continue;
    if (u.kind === 'role') m.role[u.role] = (m.role[u.role] || 1) * u.val;
    else if (u.kind === 'click') m.click *= u.val;
    else if (u.kind === 'all') m.all *= u.val;
    else if (u.kind === 'xp') m.xp *= u.val;
    else if (u.kind === 'hustle') m.hustle += u.val;
    else if (u.kind === 'case') m.case *= u.val;
    else if (u.kind === 'seats') m.seatsPct += u.val;
    else if (u.kind === 'cost') m.cost *= u.val;
    else if (u.kind === 'decor') m.decorUp *= u.val;
  }
  if (M.decorUp !== m.decorUp) decorDirty = true;
  M.decorUp = m.decorUp;
  if (decorDirty || !DEC) computeDecor();
  const R = {inc:1, click:1, xp:1, offline:0, offrate:0, seats:0, cost:1, auto:0, shares:1, gold:0, freq:0, low:1, rspeed:0, luck:0, trade:0, clean:0, night:0};
  for (const id in S.research.done){
    const p = RES_BY[id]; if (!p || p.type === 'decor' || p.type === 'talent') continue;
    if (['inc','click','xp','cost','shares','low'].includes(p.type)) R[p.type] *= p.val; else R[p.type] += p.val;
  }
  const I = {inc:0, click:0, xp:0, shares:0, gold:0, rspeed:0, luck:0, offline:0, case:0};
  for (const id in S.items){ const it = ITEM_BY[id], o = S.items[id]; if (it && o && o.lv) I[it.type] += it.per * o.lv; }
  const T = TAL, emp = totalEmp();
  m.emp = emp; m.R = R; m.T = T;
  // office needs
  const hr = gameHour(), night = isSpace() ? 0.5 : nightness(hr);
  const wmod = (WEATHER[S.weather.type] || WEATHER.sunny).mod;
  const demand = 4 * Math.sqrt(Math.max(1, emp));
  const sat = {}; let needF = 1;
  for (const [k] of NEEDS){
    let s = DEC.sup[k] * (wmod[k] || 1) * (1 + (T[k] || 0));
    if (k === 'o' && night > 0.3) s *= Math.min(1, 0.7 + 0.1 * DEC.lamps + R.night);
    sat[k] = s / demand;
    needF *= 0.85 + 0.35 * Math.min(1.5, sat[k]);
  }
  const style = DEC.style * (1 + T.style);
  const styleMult = 1 + Math.sqrt(style) / 10;
  const cleanF = 1 - 0.008 * Math.min(25, S.trash.length);
  m.dec = {demand, sat, needF, style, styleMult, cleanF, night, hr};
  m.decorMult = needF * styleMult * cleanF;
  m.rbase = 1.5 + 0.01 * sh('insider') + 0.05 * st('rbase');
  m.reb = Math.pow(m.rbase, S.rebirths);
  m.achMult = 1 + 0.02 * achN;
  m.rivalMult = 1 + 0.05 * Object.keys(S.rivals.beat).length;
  m.levelMult = 1 + 0.05 * (S.level - 1);
  m.officeMult = office().mult;
  m.shopMult = Math.pow(1.12, sh('investor')) * Math.pow(2, st('bluechip')) * Math.pow(10, ms('galactic'));
  const timeMult = 1 + T.night * night + (hr >= 5 && hr < 12 ? T.morning : 0);
  m.global = m.reb * m.officeMult * m.levelMult * m.achMult * m.rivalMult * m.all * R.inc * (1 + I.inc) * (1 + 0.03 * sk('boss')) * (1 + T.inc)
    * m.shopMult * (1 + 0.002 * sk('synergy') * emp / 100) * (1 + 0.02 * sk('bigshot') * S.office) * boostMult('income') * m.decorMult * timeMult;
  m.low = R.low;
  m.xpMult = m.reb * m.xp * R.xp * (1 + I.xp) * (1 + 0.04 * sk('reader')) * (1 + 0.1 * sh('learn')) * Math.pow(1.5, st('xpboost')) * Math.pow(3, ms('cosmicxp')) * (1 + T.xp);
  m.clickMult = m.click * R.click * (1 + I.click) * (1 + 0.1 * sk('hustler')) * (1 + 0.5 * sh('work')) * boostMult('click') * (1 + T.click);
  m.costMult = m.cost * R.cost * (1 - 0.01 * sk('negot')) * Math.pow(0.98, sh('recruit')) * (1 - Math.min(0.5, T.cost));
  m.seats = Math.floor(office().seats * (1 + m.seatsPct + R.seats + 0.1 * sh('desk')));
  m.shareMult = R.shares * (1 + I.shares) * (1 + 0.03 * sk('dealer')) * (1 + 0.05 * sh('parachute')) * Math.pow(1.5, st('sharemult')) * (1 + T.shares);
  m.stockMult = Math.pow(2, ms('stockmult'));
  m.goldMult = (1 + R.gold) * (1 + I.gold) * (1 + 0.02 * sk('treasure')) * (1 + 0.1 * st('gold')) * (1 + 0.25 * ms('goldm')) * (1 + T.gold);
  m.rspeed = (1 + R.rspeed) * (1 + I.rspeed) * (1 + 0.02 * sk('mad')) * (1 + 0.1 * st('rspeed')) * (1 + T.rspeed);
  m.luck = R.luck + I.luck + 0.01 * sk('collector') + 0.05 * st('luck') + 0.1 * ms('cosmicluck') + T.luck;
  m.tluck = 0.02 * sk('scout') + 0.1 * ms('cosmicluck');
  m.offCap = 3600 * (2 + sh('weekend') + 2 * st('offline2') + 12 * ms('timedil') + 0.5 * sk('owl') + R.offline + T.offline) + I.offline * 60;
  m.offRate = Math.min(1, 0.5 + 0.05 * sh('overtime') + 0.1 * ms('timedil') + R.offrate);
  m.eventFreq = (1 + 0.05 * sh('radar')) * (1 + R.freq) * (1 + T.freq);
  m.eventVal = m.case * (1 + I.case) * (1 + 0.1 * sk('lucky')) * (1 + DEC.ev);
  m.auto = 0.2 * sk('multi') + R.auto;
  m.slots = 1 + st('lab') + ms('lab2');
  m.contractMult = (1 + 0.05 * sk('contract')) * (1 + T.contract);
  m.tradeMult = 1 + R.trade + 0.02 * sk('trader') + T.trade;
  m.fee = Math.max(0, 0.02 - 0.001 * sk('trader'));
  m.trashRate = Math.max(0.1, (1 - 0.03 * sk('neat') - R.clean - Math.min(0.5, T.clean)) * Math.pow(0.88, DEC.clean));
  m.roster = 12 + 3 * st('roster');
  M = m;
  let inc = 0;
  for (const s of STAFF){ const c = S.emp[s.id] || 0; if (c) inc += c * roleRate(s); }
  M.income = inc;
  M.clickVal = S.level * M.clickMult * M.global + M.hustle * inc;
}
function roleRate(s){
  const c = S.emp[s.id] || 0;
  return s.rate * (M.role[s.id] || 1) * Math.pow(2, Math.floor(Math.min(c, 1000) / 50)) * (s.tier < 7 ? M.low : 1) * (TAL.dept[s.id] || 1) * M.global;
}
function costFor(s, k){ const o = S.emp[s.id] || 0; return s.base * M.costMult * Math.pow(1.15, o) * (Math.pow(1.15, k) - 1) / 0.15; }
function maxAfford(s){
  const first = s.base * M.costMult * Math.pow(1.15, S.emp[s.id] || 0);
  if (!(S.cash >= first)) return 0;
  return Math.max(1, Math.floor(Math.log(S.cash * 0.15 / first + 1) / Math.log(1.15)));
}
function hireAmount(s){
  const free = M.seats - totalEmp();
  if (free <= 0) return 0;
  const k = S.amt === 'max' ? Math.max(1, maxAfford(s)) : S.amt;
  return Math.min(k, free);
}
