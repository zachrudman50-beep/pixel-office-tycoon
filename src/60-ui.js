/* ================= UI FRAMEWORK ================= */
const CATS = [['biz','BUSINESS',['staff','upgrades','offices']],['office','OFFICE',['decor','talent','break']],['grow','GROWTH',['research','skills','prestige']],['money','MONEY',['market','contracts','inbox']],['prog','PROGRESS',['collection','rivals','awards','more']]];
const TABNAME = {staff:'STAFF',upgrades:'UPGRADES',offices:'OFFICES',decor:'DECOR',talent:'TALENT',break:'BREAK ROOM',research:'LAB',skills:'SKILLS',prestige:'PRESTIGE',market:'MARKET',contracts:'JOBS',inbox:'INBOX',collection:'CRATES',rivals:'RIVALS',awards:'AWARDS',more:'MORE'};
const ALL_TABS = CATS.flatMap(c => c[2]);
const pane = $('pane');
let dirty = {}, refs = {}, sig = {};
const markAll = () => ALL_TABS.forEach(k => dirty[k] = true);
const setText = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
const setHTML = (el, v) => { if (el && el._h !== v){ el.innerHTML = v; el._h = v; } };
const setBar = (el, f) => { if (el) el.style.width = clamp(f * 100, 0, 100) + '%'; };
const btnLabel = (b, top, sub) => { if (!b) return; if (b.firstChild && b.firstChild.nodeType === 3){ if (b.firstChild.nodeValue !== top) b.firstChild.nodeValue = top; } setText(b.querySelector('span'), sub); };
const RENDER = {}, UPDATE = {};
function buildNav(){
  $('cats').innerHTML = CATS.map(([k, n]) => `<button class="cat" role="tab" data-cat="${k}" aria-selected="false">${n}<span class="dot" hidden></span></button>`).join('');
}
function showCat(k){
  const c = CATS.find(x => x[0] === k) || CATS[0];
  S.cat = c[0];
  document.querySelectorAll('.cat').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === c[0])));
  $('tabs').innerHTML = c[2].map(t => `<button class="tab" role="tab" data-tab="${t}" aria-selected="false">${TABNAME[t]}<span class="dot" hidden></span></button>`).join('');
  showTab(c[2].includes(S.tab) ? S.tab : c[2][0]);
}
function showTab(k){
  const cat = CATS.find(c => c[2].includes(k));
  if (cat && cat[0] !== S.cat){ S.tab = k; return showCat(cat[0]); }
  S.tab = k;
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === k)));
  RENDER[k](); dirty[k] = false; UPDATE[k]();
}
function fitIcon(cnv, off){
  const c = cnv.getContext('2d'); c.imageSmoothingEnabled = false; c.clearRect(0, 0, cnv.width, cnv.height);
  R(c, 0, 0, cnv.width, cnv.height, '#272c44');
  const s = Math.min(cnv.width / off.width, cnv.height / off.height), w = off.width * s, h = off.height * s;
  c.drawImage(off, Math.floor((cnv.width - w) / 2), Math.floor((cnv.height - h) / 2), w, h);
}
function makeFurnIcon(cnv, d){
  const off = document.createElement('canvas'); off.width = d.w * TS + 8; off.height = d.layer === 'w' ? 28 : d.h * TS + 14;
  furnIcon(off, d); fitIcon(cnv, off);
}
function staffIcon(cnv, s){
  const c = cnv.getContext('2d'); c.imageSmoothingEnabled = false;
  R(c, 0, 0, 24, 22, '#272c44'); R(c, 0, 16, 24, 6, '#3a4060');
  drawChar(c, 6, 4, staffLook(s, s.tier + 2), {pose:'sit', t:0, idx:s.tier});
  R(c, 1, 15, 22, 2, '#a57a4c'); R(c, 2, 17, 20, 4, '#8a6138');
}
function talentIcon(cnv, t){ const c = cnv.getContext('2d'); c.imageSmoothingEnabled = false; R(c, 0, 0, 24, 24, '#272c44'); R(c, 0, 0, 24, 2, TRAR[t.r].c); drawChar(c, 6, 5, t.look, {pose:'stand', t:0, idx:1, happy:true}); }
function lockIcon(cnv){
  const c = cnv.getContext('2d'); R(c, 0, 0, cnv.width, cnv.height, '#272c44');
  const x = Math.floor(cnv.width / 2) - 4, y = Math.floor(cnv.height / 2) - 3;
  R(c, x, y, 8, 7, '#7a7f95'); R(c, x + 1, y - 4, 6, 1, '#7a7f95'); R(c, x + 1, y - 4, 1, 4, '#7a7f95'); R(c, x + 6, y - 4, 1, 4, '#7a7f95'); R(c, x + 3, y + 2, 2, 3, '#272c44');
}
const officeThumbs = {};
function officeIcon(cnv, o, locked){
  if (!officeThumbs[o.i]){
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const oc = off.getContext('2d'); oc.imageSmoothingEnabled = false;
    const saved = S.weather; S.weather = {type:'sunny', until:0};
    drawWall(oc, o.th, 0, 0); drawFloor(oc, o.th); S.weather = saved;
    officeThumbs[o.i] = off;
  }
  const c = cnv.getContext('2d'); c.imageSmoothingEnabled = false;
  c.drawImage(officeThumbs[o.i], 0, 0, cnv.width, cnv.height);
  if (locked){ c.fillStyle = 'rgba(28,32,50,.72)'; c.fillRect(0, 0, cnv.width, cnv.height); }
}
function upgradeIcon(cnv, u){
  const c = cnv.getContext('2d'); R(c, 0, 0, 24, 22, '#272c44');
  if (u.kind === 'role'){ const s = STAFF_BY[u.role]; drawChar(c, 2, 6, staffLook(s, s.tier + 2), {pose:'sit', t:0, idx:1}); R(c, 15, 1, 8, 7, '#efb341'); R(c, 17, 3, 4, 1, '#272c44'); R(c, 18, 2, 2, 5, '#272c44'); }
  else if (u.kind === 'click'){ R(c, 7, 6, 10, 11, '#f1ede4'); R(c, 17, 8, 3, 5, '#f1ede4'); R(c, 8, 7, 8, 3, '#6b4420'); }
  else if (u.kind === 'xp'){ R(c, 5, 5, 14, 12, '#7d5bd0'); R(c, 7, 7, 10, 2, '#a387ea'); R(c, 9, 10, 6, 5, '#efb341'); }
  else if (u.kind === 'case'){ R(c, 9, 4, 6, 2, '#3a2a1a'); R(c, 4, 6, 16, 11, '#8a5a2b'); R(c, 11, 9, 2, 3, '#efb341'); }
  else if (u.kind === 'seats'){ R(c, 3, 8, 8, 8, '#3e4452'); R(c, 13, 8, 8, 8, '#3e4452'); R(c, 2, 15, 20, 2, '#a57a4c'); }
  else if (u.kind === 'cost'){ R(c, 5, 5, 14, 12, '#f4efe2'); R(c, 7, 8, 10, 1, '#b8443a'); R(c, 9, 11, 6, 3, '#4fbf78'); }
  else if (u.kind === 'decor'){ DRAW.p_monstera(c, 4, 4, 0); }
  else { R(c, 4, 16, 3, 3, '#4fbf78'); R(c, 9, 12, 3, 7, '#4fbf78'); R(c, 14, 8, 3, 11, '#4fbf78'); R(c, 19, 4, 3, 15, '#efb341'); }
}

/* --- Staff --- */
RENDER.staff = () => {
  const vis = STAFF.filter(s => unlocked(s.req)), next = STAFF.find(s => !unlocked(s.req));
  pane.innerHTML = `<div class="bar-row"><p class="hint">Every 50 of one role doubles that role, up to 1,000. Only staff with a desk show up in the office.</p><div class="seg">${[1,10,100,'max'].map(a => `<button data-act="amt" data-id="${a}" aria-pressed="${String(S.amt) === String(a)}">${a === 'max' ? 'MAX' : '×' + a}</button>`).join('')}</div></div>
  <div class="list">${vis.map(s => `<div class="row" data-row="${s.id}"><canvas class="ico" width="24" height="22"></canvas><div class="mid"><div class="nm">${s.name}<span class="cnt"></span></div><div class="ds">${s.desc}</div><div class="st"></div></div><div class="act"><button class="btn buy" data-act="hire" data-id="${s.id}">HIRE<span></span></button><button class="link" data-act="fire" data-id="${s.id}">Fire one</button></div></div>`).join('')}
  ${next ? `<div class="row locked"><canvas class="ico" width="24" height="22" data-lock="1"></canvas><div class="mid"><div class="nm">???</div><div class="ds">Your next role unlocks after ${reqText(next.req)}. ${STAFF.length - vis.length} roles still hidden.</div></div><div></div></div>` : ''}</div>`;
  pane.querySelectorAll('[data-row]').forEach(r => staffIcon(r.querySelector('canvas'), STAFF_BY[r.dataset.row]));
  const lk = pane.querySelector('[data-lock]'); if (lk) lockIcon(lk);
  refs.staff = vis.map(s => { const r = pane.querySelector(`[data-row="${s.id}"]`); return {s, cnt:r.querySelector('.cnt'), st:r.querySelector('.st'), btn:r.querySelector('[data-act=hire]'), fire:r.querySelector('[data-act=fire]')}; });
  sig.staff = vis.length;
};
UPDATE.staff = () => {
  if (STAFF.filter(s => unlocked(s.req)).length !== sig.staff) return RENDER.staff();
  const free = M.seats - totalEmp();
  refs.staff.forEach(r => {
    const c = S.emp[r.s.id] || 0, head = S.talent.roster.find(t => t.role === r.s.id);
    setText(r.cnt, '×' + fmt(c));
    setHTML(r.st, `<em>${money(roleRate(r.s))}/s</em> each · ${c >= 1000 ? 'maxed' : 'next ×2 at ' + ((Math.floor(c / 50) + 1) * 50)}${head ? ' · head: ' + esc(head.name) + ' ×' + xf(TAL.dept[r.s.id] || 1) : ''}`);
    if (free <= 0){ btnLabel(r.btn, 'NO SEATS', 'move offices'); r.btn.disabled = true; }
    else { const k = hireAmount(r.s), cost = costFor(r.s, k); btnLabel(r.btn, 'HIRE ×' + fmt(k), money(cost)); r.btn.disabled = !(S.cash >= cost); }
    r.fire.disabled = c === 0;
  });
};

/* --- Upgrades --- */
function visibleUpgrades(){
  return UPGRADES.filter(u => !S.up[u.id] && unlocked(u.req) && (u.kind !== 'role' || (S.emp[u.role] || 0) >= u.need * 0.4 || (S.stats.maxRole[u.role] || 0) >= u.need)).sort((a, b) => a.cost - b.cost).slice(0, 30);
}
RENDER.upgrades = () => {
  const list = visibleUpgrades(), owned = Object.keys(S.up).length;
  pane.innerHTML = `<div class="bar-row"><p class="hint">${owned} of ${UPGRADES.length} owned this run. Upgrades reset when you sell.</p><button class="btn sm go" data-act="buyall">BUY ALL AFFORDABLE</button></div>
  <div class="list">${list.length ? list.map(u => `<div class="row" data-up="${u.id}"><canvas class="ico" width="24" height="22"></canvas><div class="mid"><div class="nm">${u.name}</div><div class="ds">${u.desc()}</div><div class="st"></div></div><div class="act"><button class="btn buy" data-act="up" data-id="${u.id}">BUY<span>${money(u.cost)}</span></button></div></div>`).join('') : '<div class="lock-note"><b>Nothing to buy right now</b>Hire more staff to reveal their upgrades.</div>'}</div>`;
  pane.querySelectorAll('[data-up]').forEach(r => upgradeIcon(r.querySelector('canvas'), UP_BY[r.dataset.up]));
  refs.upgrades = list.map(u => { const r = pane.querySelector(`[data-up="${u.id}"]`); return {u, st:r.querySelector('.st'), btn:r.querySelector('button')}; });
  sig.upgrades = list.map(u => u.id).join();
};
UPDATE.upgrades = () => {
  if (visibleUpgrades().map(u => u.id).join() !== sig.upgrades) return RENDER.upgrades();
  refs.upgrades.forEach(r => {
    const need = r.u.kind === 'role' && (S.emp[r.u.role] || 0) < r.u.need;
    setText(r.st, need ? 'Needs ' + r.u.need + ' ' + STAFF_BY[r.u.role].name + 's (you have ' + (S.emp[r.u.role] || 0) + ')' : '');
    r.btn.disabled = need || S.cash < r.u.cost;
  });
};

/* --- Offices --- */
RENDER.offices = () => {
  pane.innerHTML = `<p class="hint">Bigger offices hold more staff, give you more floor space to decorate and multiply all income. Each office keeps its own furniture layout.</p>
  <div class="list">${OFFICES.map(o => { const lk = !unlocked(o.req); return `<div class="row wide-ico${lk ? ' locked' : ''}${o.i === S.office ? ' here' : ''}" data-off="${o.i}"><canvas class="ico" width="72" height="42"></canvas><div class="mid"><div class="nm">${o.name}</div><div class="ds">${o.desc}</div><div class="st">Income <em>×${o.mult}</em> · ${fmt(o.seats)} seats · ${o.size[0]}×${o.size[1]} floor${Object.keys(o.req).length ? ' · needs ' + reqText(o.req) : ''}</div></div><div class="act"><button class="btn buy" data-act="move" data-id="${o.i}">MOVE<span></span></button></div></div>`; }).join('')}</div>`;
  pane.querySelectorAll('[data-off]').forEach(r => { const o = OFFICES[+r.dataset.off]; officeIcon(r.querySelector('canvas'), o, !unlocked(o.req)); });
  refs.offices = OFFICES.map(o => ({o, btn:pane.querySelector(`[data-off="${o.i}"] button`)}));
  sig.offices = S.office + '|' + S.tr + '|' + S.ti + '|' + S.mergers;
};
UPDATE.offices = () => {
  if (S.office + '|' + S.tr + '|' + S.ti + '|' + S.mergers !== sig.offices) return RENDER.offices();
  refs.offices.forEach(({o, btn}) => {
    if (o.i === S.office){ btnLabel(btn, 'YOU ARE', 'HERE'); btn.disabled = true; }
    else if (o.i < S.office){ btnLabel(btn, 'MOVED', 'OUT'); btn.disabled = true; }
    else if (!unlocked(o.req)){ btnLabel(btn, 'LOCKED', reqText(o.req)); btn.disabled = true; }
    else { btnLabel(btn, 'MOVE IN', money(o.cost)); btn.disabled = S.cash < o.cost; }
  });
};

/* --- Decor --- */
const STATN = {e:'energy',c:'comfort',f:'fun',o:'focus',s:'style',cl:'tidiness',jan:'janitor bot',ev:'event rewards'};
const statText = (d, lv) => Object.entries(d.stats).map(([k, v]) => k === 'ev' ? '+' + pct(v) + ' event rewards' : k === 'jan' ? 'cleans trash by itself' : '+' + xf(v * (k === 'cl' ? 1 : 1 + 0.25 * (lv - 1))) + ' ' + STATN[k]).join(' · ');
function ratingStars(){ if (!M.dec || !M.emp) return ''; const avg = NEEDS.reduce((a, [k]) => a + Math.min(1.5, M.dec.sat[k]), 0) / 4; const s = clamp(Math.round(avg * 3 + Math.log10(1 + M.dec.style) * 0.6), 0, 5); return '★'.repeat(s) + '☆'.repeat(5 - s); }
function decorList(){
  const f = S.opt.fcat || 'all';
  return FURN.filter(d => d.cat !== 'ceo' && (f === 'all' || (f === 'season' ? d.month != null : d.cat === f && d.month == null)) && (d.month == null || inSeason(d) || fOwned(d.id) > 0)).sort((a, b) => a.cost - b.cost);
}
RENDER.decor = () => {
  const list = decorList(), synNames = {breakroom:'Break room (energy near seating)', game:'Game corner (fun next to fun)', window:'Window plants', lamp:'Desk lamps', zen:'Quiet focus zone', gallery:'Gallery wall', rug:'Furniture on rugs'};
  const syns = Object.entries(DEC.syn).filter(([, n]) => n).map(([k, n]) => synNames[k] + ' ×' + n).join(' · ') || 'None yet. Put coffee near couches, lamps near desks, plants against the wall.';
  const sets = Object.entries(DEC.sets).filter(([k, n]) => n >= 5 && SET_NAMES[k]).map(([k, n]) => SET_NAMES[k] + ' ' + n + ' (+' + (n >= 20 ? 50 : n >= 10 ? 25 : 10) + '%)').join(' · ') || 'Place 5, 10 or 20 pieces from one set for a bonus.';
  pane.innerHTML = `<div class="card dark"><div class="bar-row"><h3>OFFICE RATING <span class="stars dr"></span></h3><span class="kv"><span class="dm"></span></span></div>
    <div class="meters">${NEEDS.map(([k, n, col]) => `<div class="need"><span>${n} <span class="nv" data-nv="${k}"></span></span><div class="nb"><i data-nb="${k}" style="background:var(${col})"></i></div></div>`).join('')}</div>
    <div class="mini ds2"></div></div>
  <div class="card"><div class="mini"><b>Synergies:</b> ${syns}</div><div class="mini"><b>Set bonuses:</b> ${sets}</div><div class="mini">Furniture stays yours forever. Every office keeps its own layout, and an office's needs grow as you hire.</div></div>
  <div class="btn-row"><button class="btn sm ${decorMode ? 'gd' : 'go'}" data-act="decor">${decorMode ? 'DONE DECORATING' : 'DECORATE MODE'}</button><button class="btn sm" data-act="arrange">AUTO-ARRANGE</button><button class="btn sm" data-act="storeall">STORE ALL</button></div>
  ${placing ? `<div class="card gold"><h3>Placing: ${FURN_BY[placing].name}</h3><div class="mini">Click a green spot in the office. Right-click or press Cancel to stop.</div><div class="btn-row"><button class="btn sm" data-act="cancelplace">CANCEL</button></div></div>` : ''}
  ${selected ? `<div class="card gold"><h3>Selected: ${FURN_BY[selected.id].name}</h3><div class="mini">${statText(FURN_BY[selected.id], fLevel(selected.id))}</div><div class="btn-row"><button class="btn sm" data-act="movesel">MOVE</button>${selected.id !== 'ceo' ? '<button class="btn sm" data-act="storesel">STORE</button>' : ''}<button class="btn sm" data-act="desel">DESELECT</button></div></div>` : ''}
  <div class="seg">${FCATS.map(([k, n]) => `<button data-act="fcat" data-id="${k}" aria-pressed="${(S.opt.fcat || 'all') === k}">${n}</button>`).join('')}</div>
  <div class="list">${list.map(d => { const lk = !furnUnlocked(d); return `<div class="row${lk ? ' locked' : ''}" data-fu="${d.id}"><canvas class="ico" width="48" height="44"></canvas><div class="mid"><div class="nm">${d.name} <span class="cnt"></span></div><div class="ds">${SET_NAMES[d.set] || ''} · ${d.w}×${d.h}${d.layer === 'w' ? ' wall' : d.layer === 'r' ? ' rug' : ''}${d.month != null ? ' · ' + MONTHS[d.month] + ' only' : ''}${lk ? ' · unlocks in ' + OFFICES[d.req].name : ''}</div><div class="st"></div></div><div class="act"><button class="btn buy sm" data-act="fbuy" data-id="${d.id}">BUY<span></span></button><button class="btn sm" data-act="fplace" data-id="${d.id}">PLACE</button><button class="btn buy sm" data-act="flv" data-id="${d.id}">LV UP<span></span></button></div></div>`; }).join('')}</div>`;
  pane.querySelectorAll('[data-fu]').forEach(r => makeFurnIcon(r.querySelector('canvas'), FURN_BY[r.dataset.fu]));
  refs.decor = list.map(d => { const r = pane.querySelector(`[data-fu="${d.id}"]`); return {d, cnt:r.querySelector('.cnt'), st:r.querySelector('.st'), buy:r.querySelector('[data-act=fbuy]'), place:r.querySelector('[data-act=fplace]'), lv:r.querySelector('[data-act=flv]')}; });
};
UPDATE.decor = () => {
  const q = s => pane.querySelector(s), dc = M.dec; if (!dc) return;
  setText(q('.dr'), ratingStars());
  setText(q('.dm'), 'Office ×' + xf(M.decorMult));
  NEEDS.forEach(([k]) => { setBar(q(`[data-nb="${k}"]`), dc.sat[k] / 1.5); setText(q(`[data-nv="${k}"]`), xf(DEC.sup[k]) + ' / ' + xf(dc.demand) + ' · ' + Math.round(dc.sat[k] * 100) + '%'); });
  setText(q('.ds2'), 'Style ' + fmt(dc.style) + ' → income ×' + xf(dc.styleMult) + ' · Trash ' + S.trash.length + ' → ' + (dc.cleanF < 1 ? '−' + Math.round((1 - dc.cleanF) * 100) + '%' : 'spotless') + (dc.night > 0.3 ? ' · Night: ' + DEC.lamps + ' lamp' + (DEC.lamps === 1 ? '' : 's') + ' keeping focus up' : ''));
  const L = layout();
  refs.decor.forEach(r => {
    const d = r.d, own = fOwned(d.id), pl = placedCount(d.id, L), lv = fLevel(d.id), lk = !furnUnlocked(d);
    setText(r.cnt, own ? 'Lv ' + lv : '');
    setText(r.st, statText(d, lv) + ' · owned ' + own + ', placed here ' + pl);
    const c = furnCost(d); btnLabel(r.buy, 'BUY', money(c)); r.buy.disabled = lk || !inSeason(d) || S.cash < c;
    r.place.disabled = pl >= own;
    const lc = furnLvCost(d); btnLabel(r.lv, 'LV UP', lv >= 25 ? 'MAX' : money(lc)); r.lv.disabled = !own || lv >= 25 || S.cash < lc;
  });
};

/* --- Talent --- */
RENDER.talent = () => {
  const R0 = S.talent.roster, roles = STAFF.filter(s => unlocked(s.req));
  pane.innerHTML = `<p class="hint">Star employees with traits. Make one the head of a department to multiply that role, and their traits switch on. ${R0.length}/${M.roster} on the roster · ${TAL.heads} department head${TAL.heads === 1 ? '' : 's'}. Heads wander your office.</p>
  <div class="grid2">${HUNTS.map(h => `<div class="card"><h3>${h.name}</h3><div class="mini">Rockstar ${h.w[3]}% · Legend ${h.w[4]}% (before luck)</div><button class="btn sm gd" data-act="hunt" data-id="${h.id}">HEADHUNT · ${h.cost} GOLD</button></div>`).join('')}</div>
  ${lastTalent ? `<div class="card dark"><h3>Just hired</h3><div class="mini">${esc(lastTalent.name)}, ${TRAR[lastTalent.r].n} · ${lastTalent.traits.map(x => TRAIT_BY[x][1]).join(', ')}</div></div>` : ''}
  <div class="list">${R0.length ? R0.map(t => `<div class="talent" data-tal="${t.id}"><canvas class="ico" width="24" height="24"></canvas><div class="mid"><div class="nm" style="color:${t.r >= 3 ? TRAR[t.r].c : 'var(--ink)'}">${esc(t.name)} <span class="cnt"></span></div><div class="ds">${TRAR[t.r].n} · head power ×${xf(1 + TRAR[t.r].pow)} per level</div><div class="tf">${t.traits.map(x => `<span class="trait" title="${TRAIT_BY[x][4](TRAIT_BY[x][3])}">${TRAIT_BY[x][1]}</span>`).join('')}</div><div class="st te"></div>
    <div class="tf"><select data-assign="${t.id}" id="as-${t.id}"><option value="">No department</option>${roles.map(s => `<option value="${s.id}" ${t.role === s.id ? 'selected' : ''}>Head of ${s.name}s</option>`).join('')}</select><button class="btn sm buy" data-act="train" data-id="${t.id}">TRAIN<span></span></button><button class="link" data-act="release" data-id="${t.id}">Release (+10 gold)</button></div></div></div>`).join('') : '<div class="lock-note"><b>No talent yet</b>Headhunt with gold bars. Walk-in candidates also show up in your inbox.</div>'}</div>`;
  pane.querySelectorAll('[data-tal]').forEach(el => talentIcon(el.querySelector('canvas'), R0.find(t => t.id === +el.dataset.tal)));
  sig.talent = R0.map(t => t.id + ':' + t.role).join() + '|' + M.roster;
};
UPDATE.talent = () => {
  if (S.talent.roster.map(t => t.id + ':' + t.role).join() + '|' + M.roster !== sig.talent) return RENDER.talent();
  pane.querySelectorAll('[data-act=hunt]').forEach(b => { const h = HUNTS.find(x => x.id === b.dataset.id); b.disabled = S.gold < h.cost || S.talent.roster.length >= M.roster; });
  S.talent.roster.forEach(t => {
    const el = pane.querySelector(`[data-tal="${t.id}"]`); if (!el) return;
    setText(el.querySelector('.cnt'), 'Lv ' + t.lv);
    const scale = (1 + 0.5 * t.r) * (1 + 0.02 * t.lv);
    setText(el.querySelector('.te'), (t.role ? 'Leading ' + STAFF_BY[t.role].name + 's ×' + xf(TAL.dept[t.role] || 1) + ' · ' : 'Not leading a department, so traits are off · ') + t.traits.map(x => TRAIT_BY[x][4](TRAIT_BY[x][3] * scale)).join(' · '));
    const b = el.querySelector('[data-act=train]'), c = trainCost(t);
    btnLabel(b, 'TRAIN', t.lv >= 50 ? 'MAX' : money(c)); b.disabled = t.lv >= 50 || S.cash < c;
  });
};
