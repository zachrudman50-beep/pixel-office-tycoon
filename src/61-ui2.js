/* --- Break Room mini-games --- */
let MG = {toss:null, zero:null, slot:null};
const SLOT_SYM = [['COFFEE',22,'#6b4420'],['DONUT',22,'#e07ab0'],['GOLD',16,'#efb341'],['STAR',14,'#5ef0e6'],['7',8,'#e05a4a'],['CASE',18,'#8a5a2b']];
const cdLeft = k => Math.max(0, (S.mg[k] || 0) - Date.now());
function startToss(){ if (cdLeft('tossCd') || (MG.toss && !MG.toss.done)) return; MG.toss = {throws:0, hits:0, power:0, pdir:1, ball:null, bin:rand(120, 220), wind:rand(-1, 1), done:false, wait:0}; }
function throwToss(){ const g = MG.toss; if (!g || g.done || g.ball || g.wait > 0) return; g.ball = {x:20, y:96, vx:40 + g.power * 170 + g.wind * 25, vy:-110 - g.power * 40}; }
function finishGame(kind, gold){ S.stats.games++; const g = gold > 0 ? addGold(gold, true) : 0; toast(kind + ' over! +' + g + ' gold bars', 'gold'); }
function startZero(){ if (cdLeft('zeroCd') || (MG.zero && MG.zero.t > 0)) return; MG.zero = {t:20, score:0, cells:new Array(12).fill(null), next:0}; }
function hitZero(i){ const g = MG.zero; if (!g || g.t <= 0 || !g.cells[i]) return; g.score += g.cells[i].type === 'spam' ? -2 : 1; g.cells[i] = null; }
function spinSlot(){
  if (S.gold < 10 || (MG.slot && MG.slot.end > performance.now() / 1000)) return;
  S.gold -= 10; S.stats.spins++;
  const reels = [0, 1, 2].map(() => SLOT_SYM.indexOf(wpick(SLOT_SYM, s => s[1])));
  MG.slot = {reels, end:performance.now() / 1000 + 1.2, paid:false, msg:''};
}
function payoutSlot(){
  const g = MG.slot, [a, b, c] = g.reels, n = SLOT_SYM[a][0];
  let msg;
  if (a === b && b === c){
    if (n === '7'){ S.stats.jackpots++; msg = 'JACKPOT! ' + fx.gold(250); }
    else if (n === 'GOLD') msg = fx.gold(60);
    else if (n === 'STAR'){ openCrate('premium', true); msg = 'Free Premium Crate!'; }
    else if (n === 'CASE') msg = fx.boost('income', 3, 300, 'Vending luck');
    else if (n === 'COFFEE') msg = fx.boost('click', 10, 120, 'Vending coffee');
    else msg = fx.gold(30);
  } else if (a === b || b === c || a === c) msg = fx.gold(12);
  else msg = 'No luck. Try again.';
  g.msg = msg; g.paid = true; S.stats.games++;
}
function mgTick(dt, t){
  const g = MG.toss;
  if (g && !g.done){
    if (!g.ball){ g.power += g.pdir * dt * 1.3; if (g.power > 1){ g.power = 1; g.pdir = -1; } if (g.power < 0){ g.power = 0; g.pdir = 1; } }
    if (g.wait > 0) g.wait -= dt;
    if (g.ball){ const b = g.ball; b.vy += 220 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y >= 100){ const hit = Math.abs(b.x - g.bin) < 9; if (hit) g.hits++; g.throws++; g.last = hit ? 'IN!' : 'MISS'; g.ball = null; g.wait = 0.6; g.bin = rand(110, 225); g.wind = rand(-1, 1);
        if (g.throws >= 5){ g.done = true; S.mg.tossCd = Date.now() + 10 * 60 * 1000; if (g.hits === 5) S.stats.tossPerfect++; finishGame('Paper Toss', g.hits * 3 + (g.hits === 5 ? 10 : 0)); dirty.break = true; } } }
  }
  const z = MG.zero;
  if (z && z.t > 0){
    z.t -= dt; z.next -= dt;
    z.cells.forEach((c, i) => { if (c && c.until < t) z.cells[i] = null; });
    if (z.next <= 0){ z.next = 0.42; const empty = z.cells.map((c, i) => c ? -1 : i).filter(i => i >= 0); if (empty.length) z.cells[pick(empty)] = {type:Math.random() < 0.18 ? 'spam' : 'mail', until:t + 1.0}; }
    if (z.t <= 0){ S.mg.zeroCd = Date.now() + 10 * 60 * 1000; S.stats.zeroBest = Math.max(S.stats.zeroBest, z.score); finishGame('Inbox Zero', Math.max(0, Math.floor(z.score / 3))); dirty.break = true; }
  }
  if (MG.slot && !MG.slot.paid && MG.slot.end <= t){ payoutSlot(); dirty.break = true; }
  if (S.tab === 'break') drawMinigames(t);
}
function drawMinigames(t){
  const tc = $('tossCv');
  if (tc){
    const c = tc.getContext('2d'); c.imageSmoothingEnabled = false; const g = MG.toss;
    R(c, 0, 0, 240, 120, '#cdbb8e'); R(c, 0, 104, 240, 16, '#6d7b8a'); R(c, 0, 100, 240, 4, '#8f7d55');
    for (let x = 0; x < 240; x += 4) R(c, x, 108 + (x % 8 ? 0 : 4), 1, 1, '#62707e');
    drawChar(c, 6, 84, bossLook(), {pose:'stand', t, idx:0, happy:true, dir:'right'});
    const bx = g ? g.bin : 170; R(c, bx - 8, 90, 16, 14, '#55606b'); R(c, bx - 9, 88, 18, 3, '#7a828c'); R(c, bx - 5, 93, 1, 9, '#3a3f47'); R(c, bx + 3, 93, 1, 9, '#3a3f47');
    if (g){
      if (g.ball){ disc(c, g.ball.x, g.ball.y, 2, '#f4efe2'); }
      R(c, 8, 8, 60, 6, '#2a2830'); R(c, 9, 9, Math.round(58 * g.power), 4, g.power > 0.8 ? '#e05a4a' : '#4fbf78');
      c.font = '8px Silkscreen, monospace'; c.fillStyle = '#2a2830'; c.textBaseline = 'top';
      c.fillText('WIND ' + (g.wind > 0 ? '>>' : '<<') + ' ' + Math.abs(g.wind * 10).toFixed(0), 80, 7);
      c.fillText('THROWS ' + g.throws + '/5  IN ' + g.hits, 150, 7);
      if (g.last && g.wait > 0) c.fillText(g.last, bx - 8, 74);
      if (g.done) c.fillText('DONE! ' + g.hits + '/5', 90, 50);
    } else { c.font = '8px Silkscreen, monospace'; c.fillStyle = '#2a2830'; c.textBaseline = 'top'; c.fillText(cdLeft('tossCd') ? 'BACK IN ' + fmtTime(cdLeft('tossCd') / 1000) : 'PRESS START', 80, 50); }
  }
  const sc = $('slotCv');
  if (sc){
    const c = sc.getContext('2d'); c.imageSmoothingEnabled = false; const g = MG.slot, spinning = g && g.end > t;
    R(c, 0, 0, 240, 120, '#b03a3a'); R(c, 10, 10, 220, 80, '#2a2830');
    c.font = '10px Silkscreen, monospace'; c.textBaseline = 'middle'; c.textAlign = 'center';
    for (let k = 0; k < 3; k++){
      R(c, 20 + k * 70, 20, 60, 60, '#f4efe2');
      const idx = spinning && t < g.end - (2 - k) * 0.25 ? Math.floor(t * 14 + k * 3) % SLOT_SYM.length : g ? g.reels[k] : k;
      c.fillStyle = SLOT_SYM[idx][2]; c.fillText(SLOT_SYM[idx][0], 50 + k * 70, 50);
    }
    c.fillStyle = '#ffe9a0'; c.fillText(g && g.paid ? g.msg.slice(0, 34) : spinning ? 'SPINNING...' : '10 GOLD A SPIN', 120, 104);
    c.textAlign = 'left';
  }
  const zg = $('zeroGrid');
  if (zg && MG.zero){ [...zg.children].forEach((b, i) => { const cell = MG.zero.cells[i]; const cls = cell ? cell.type : ''; if (b.className !== cls){ b.className = cls; b.textContent = cell ? (cell.type === 'spam' ? 'SPAM' : 'MAIL') : ''; } }); setText($('zeroInfo'), MG.zero.t > 0 ? 'Time ' + Math.ceil(MG.zero.t) + 's · score ' + MG.zero.score : 'Final score ' + MG.zero.score); }
}
RENDER.break = () => {
  pane.innerHTML = `<p class="hint">Quick games for gold bars. Paper Toss and Inbox Zero have a 10 minute cooldown.</p>
  <div class="card"><h3>Paper Toss</h3><div class="mini">Click the canvas or THROW when the power bar is right. Watch the wind. 3 gold per hit, +10 for a perfect 5.</div><canvas class="mgc" id="tossCv" width="240" height="120" data-act="toss"></canvas><div class="btn-row"><button class="btn sm go" data-act="tossstart">START</button><button class="btn sm" data-act="toss">THROW</button></div></div>
  <div class="card"><h3>Inbox Zero</h3><div class="mini">Delete emails as they pop up. Spam costs you 2 points. 1 gold for every 3 points.</div><div class="izgrid" id="zeroGrid">${new Array(12).fill(0).map((_, i) => `<button data-act="zero" data-id="${i}" aria-label="Inbox slot ${i + 1}"></button>`).join('')}</div><div class="bar-row"><span class="mini" id="zeroInfo"></span><button class="btn sm go" data-act="zerostart">START</button></div></div>
  <div class="card"><h3>Vending Machine</h3><div class="mini">Three of a kind: 7s pay 250 gold, GOLD 60, DONUT 30, STAR a Premium Crate, CASE triple income, COFFEE a click rush. Any pair pays 12.</div><canvas class="mgc" id="slotCv" width="240" height="120" data-act="spin"></canvas><div class="btn-row"><button class="btn sm gd" data-act="spin">SPIN · 10 GOLD</button></div></div>`;
};
UPDATE.break = () => {
  const ts = pane.querySelector('[data-act=tossstart]'); if (ts){ const cd = cdLeft('tossCd'); ts.disabled = !!cd || !!(MG.toss && !MG.toss.done); setText(ts, cd ? 'BACK IN ' + fmtTime(cd / 1000) : 'START'); }
  const zs = pane.querySelector('[data-act=zerostart]'); if (zs){ const cd = cdLeft('zeroCd'); zs.disabled = !!cd || !!(MG.zero && MG.zero.t > 0); setText(zs, cd ? 'BACK IN ' + fmtTime(cd / 1000) : 'START'); }
  if (!MG.zero) setText($('zeroInfo'), 'Press START');
  const sp = pane.querySelector('button[data-act=spin]'); if (sp) sp.disabled = S.gold < 10;
};

/* --- Research --- */
RENDER.research = () => {
  if (S.tr < 1){ pane.innerHTML = `<div class="lock-note"><b>The research lab is locked</b>It opens after you sell the company for the first time. Research keeps running while the game is closed and is never reset.</div>`; sig.research = 'locked'; return; }
  const act = S.research.active;
  const avail = RESEARCH.filter(p => !S.research.done[p.id] && !act.some(a => a.id === p.id) && resAvailable(p));
  const lockedN = RESEARCH.filter(p => !S.research.done[p.id] && !resAvailable(p)).length;
  pane.innerHTML = `<div class="bar-row"><p class="hint">${researchDone()} of ${RESEARCH.length} projects done · speed ×${xf(M.rspeed)} · keeps running offline, never resets.</p><span class="chip" style="color:var(--case-hi)">SLOTS ${act.length}/${M.slots}</span></div>
  ${act.length ? `<div class="grid2">${act.map(a => { const p = RES_BY[a.id]; return `<div class="card dark" data-ract="${a.id}"><h3>${p.name}</h3><div class="mini">${RDESC[p.type](p.val)}</div><div class="pbar gold"><i></i></div><div class="kv"><span class="tl"></span></div><button class="btn sm gd" data-act="rskip" data-id="${a.id}">FINISH NOW<span></span></button></div>`; }).join('')}</div>` : ''}
  <div class="list">${avail.map(p => `<div class="row noico"><div class="mid"><div class="nm">${p.name}</div><div class="ds">${RDESC[p.type](p.val)}</div></div><div class="act"><button class="btn buy" data-act="rstart" data-id="${p.id}">START<span>${fmtTime(p.dur / M.rspeed)}</span></button></div></div>`).join('')}
  ${lockedN ? `<div class="row locked noico"><div class="mid"><div class="nm">${lockedN} more projects</div><div class="ds">Finish earlier tiers to reveal the next. Tier II needs 5 sales, tier III an IPO, tier IV a merger.</div></div><div></div></div>` : ''}
  ${!avail.length && !lockedN && !act.length ? '<div class="lock-note"><b>Every project is done</b>You are the smartest company in the multiverse.</div>' : ''}</div>`;
  refs.research = {act:act.map(a => ({a, el:pane.querySelector(`[data-ract="${a.id}"]`)})), starts:[...pane.querySelectorAll('[data-act=rstart]')]};
  sig.research = act.map(a => a.id).join() + '|' + researchDone() + '|' + M.slots + '|' + S.tr + S.ti + S.mergers;
};
UPDATE.research = () => {
  const s = S.tr < 1 ? 'locked' : S.research.active.map(a => a.id).join() + '|' + researchDone() + '|' + M.slots + '|' + S.tr + S.ti + S.mergers;
  if (s !== sig.research) return RENDER.research();
  if (S.tr < 1) return;
  const full = S.research.active.length >= M.slots, t = Date.now();
  refs.research.act.forEach(({a, el}) => {
    const p = RES_BY[a.id], total = a.len || p.dur / M.rspeed * 1000, left = Math.max(0, a.end - t);
    setBar(el.querySelector('i'), 1 - left / total); setText(el.querySelector('.tl'), fmtTime(left / 1000) + ' left');
    const b = el.querySelector('button'), c = skipCost(a); setText(b.querySelector('span'), c + ' gold'); b.disabled = S.gold < c;
  });
  refs.research.starts.forEach(b => b.disabled = full);
};

/* --- Skills --- */
RENDER.skills = () => {
  pane.innerHTML = `<div class="bar-row"><p class="hint">1 skill point per career level. ${skillSpent()} of ${SKILL_MAX} ranks bought. Refunds are free.</p><button class="link" data-act="refund">Refund all points</button></div>
  <div class="card dark"><div class="kv"><span>SKILL POINTS</span><span class="pts"></span></div></div>
  <div class="list">${SKILLS.map(d => `<div class="row noico" data-sk="${d.id}"><div class="mid"><div class="nm">${d.name} <span class="cnt"></span></div><div class="ds eff"></div></div><div class="act h"><button class="btn sm" data-act="skill" data-id="${d.id}">+1</button><button class="btn sm" data-act="skill10" data-id="${d.id}">+10</button></div></div>`).join('')}</div>`;
  refs.skills = SKILLS.map(d => { const r = pane.querySelector(`[data-sk="${d.id}"]`); return {d, cnt:r.querySelector('.cnt'), eff:r.querySelector('.eff'), b1:r.querySelector('[data-act=skill]'), b10:r.querySelector('[data-act=skill10]')}; });
};
UPDATE.skills = () => {
  const pts = skillPoints(); setText(pane.querySelector('.pts'), String(pts));
  refs.skills.forEach(r => { const l = sk(r.d.id); setText(r.cnt, l + '/' + r.d.max); setText(r.eff, (l ? r.d.eff(l) : 'Not learned') + (l < r.d.max ? '  →  next: ' + r.d.eff(l + 1) : '')); r.b1.disabled = r.b10.disabled = pts < 1 || l >= r.d.max; });
};

/* --- Prestige --- */
function shopRows(defs){ return defs.map(d => `<div class="row noico" data-shop="${d.id}"><div class="mid"><div class="nm">${d.name} <span class="cnt"></span></div><div class="ds eff"></div></div><div class="act"><button class="btn buy" data-act="shop" data-id="${d.id}">BUY<span></span></button></div></div>`).join(''); }
function shopUpdate(defs, lv, cur){
  defs.forEach(d => {
    const r = pane.querySelector(`[data-shop="${d.id}"]`); if (!r) return;
    const l = lv[d.id] || 0, maxed = l >= d.max;
    setText(r.querySelector('.cnt'), d.max === Infinity ? 'Lv ' + l : l + '/' + d.max);
    setText(r.querySelector('.eff'), d.max === 1 ? d.eff(l) : (l ? d.eff(l) : 'Not bought') + (!maxed ? '  →  next: ' + d.eff(l + 1) : ''));
    const b = r.querySelector('button');
    if (maxed){ btnLabel(b, 'MAXED', '—'); b.disabled = true; } else { const c = shopCost(d, l); btnLabel(b, 'BUY', fmt(c) + ' ' + cur); b.disabled = S[cur] < c; }
  });
}
const PSHOP = {sell:[SHARE_SHOP, () => S.sh, 'shares'], ipo:[STOCK_SHOP, () => S.st, 'stock'], merge:[MERGE_SHOP, () => S.ms, 'credits']};
const prestigeSig = () => S.ptab + (S.tr >= 10 || S.ti > 0) + (S.ti >= 2 || S.mergers > 0) + st('keepoff') + st('keepup') + ms('keepshares');
RENDER.prestige = () => {
  const p = S.ptab, ipoOpen = S.tr >= 10 || S.ti > 0, mergeOpen = S.ti >= 2 || S.mergers > 0;
  let body = '';
  if (p === 'sell') body = `<div class="card"><h3>Sell the company (rebirth)</h3><p class="mini" style="margin:0">A bigger company buys you out. You restart in the garage, but each sale makes you earn money and XP 50% faster and pays shares. Furniture, talent, research, collectibles and levels are kept. Stocks are cashed out first.</p>
      <div class="kv"><span class="v1"></span><span class="v2"></span></div><div class="pbar rb"><i class="b1"></i></div>
      <div class="grid2 compare"><div><b>NOW</b><span class="now"></span></div><div class="after"><b>AFTER SALE</b><span class="aft"></span></div></div>
      <div class="mini">Resets cash, staff${st('keepoff') ? '' : ', office'}${st('keepup') ? '' : ', upgrades'} and trash.</div>
      <div class="btn-row"><button class="btn rb" data-act="sell1">SELL COMPANY</button><button class="btn rb" data-act="sellyes" hidden>YES, SELL IT</button><button class="btn" data-act="sellno" hidden>KEEP RUNNING IT</button></div></div>
      <h3 class="h3">SHARE SHOP · <span class="curv"></span> SHARES</h3><div class="list">${shopRows(SHARE_SHOP)}</div>`;
  else if (p === 'ipo') body = !ipoOpen ? `<div class="lock-note"><b>IPO is locked</b>Sell the company 10 times to see Wall Street.</div>` : `<div class="card"><h3>Go public (IPO)</h3><p class="mini" style="margin:0">Trade your sales and shares for stock. Resets rebirths, shares${ms('keepshares') ? '' : ' and the Share Shop'} plus your run.</p>
      <div class="kv"><span class="v1"></span><span class="v2"></span></div><div class="pbar ipo"><i class="b1"></i></div>
      <div class="btn-row"><button class="btn ipo" data-act="ipo1">GO PUBLIC</button><button class="btn ipo" data-act="ipoyes" hidden>YES, GO PUBLIC</button><button class="btn" data-act="ipono" hidden>NOT YET</button></div></div>
      <h3 class="h3">STOCK EXCHANGE · <span class="curv"></span> STOCK</h3><div class="list">${shopRows(STOCK_SHOP)}</div>`;
  else body = !mergeOpen ? `<div class="lock-note"><b>Mega mergers are locked</b>Go public twice to unlock cosmic-scale deals.</div>` : `<div class="card"><h3>Mega merger</h3><p class="mini" style="margin:0">Merge with a rival empire for cosmic credits. Resets IPOs, stock and the Stock Exchange plus everything an IPO resets. Unlocks space offices and cosmic staff.</p>
      <div class="kv"><span class="v1"></span><span class="v2"></span></div><div class="pbar mg"><i class="b1"></i></div>
      <div class="btn-row"><button class="btn mg" data-act="merge1">MERGE</button><button class="btn mg" data-act="mergeyes" hidden>YES, MERGE</button><button class="btn" data-act="mergeno" hidden>NOT YET</button></div></div>
      <h3 class="h3">COSMIC BOARDROOM · <span class="curv"></span> CREDITS</h3><div class="list">${shopRows(MERGE_SHOP)}</div>`;
  pane.innerHTML = `<div class="seg">${[['sell','SELL · SHARES'],['ipo','IPO · STOCK'],['merge','MERGER · CREDITS']].map(([k, n]) => `<button data-act="ptab" data-id="${k}" aria-pressed="${p === k}">${n}</button>`).join('')}</div>${body}`;
  sig.prestige = prestigeSig();
};
UPDATE.prestige = () => {
  if (prestigeSig() !== sig.prestige) return RENDER.prestige();
  const p = S.ptab, q = s => pane.querySelector(s);
  if (p === 'sell'){
    const tgt = sellTarget(), val = S.run + marketValue();
    setText(q('.v1'), money(val) + ' this run'); setText(q('.v2'), 'buyers want ' + money(tgt)); setBar(q('.b1'), val / tgt);
    const nb = M.rbase;
    setHTML(q('.now'), `Money ×${xf(Math.pow(nb, S.rebirths))}<br>XP ×${xf(Math.pow(nb, S.rebirths))}`);
    setHTML(q('.aft'), `Money ×${xf(Math.pow(nb, S.rebirths + 1))}<br>XP ×${xf(Math.pow(nb, S.rebirths + 1))}<br>+${fmt(shareGain())} shares`);
    const b = q('[data-act=sell1]'); b.disabled = !canSell(); setText(b, canSell() ? 'SELL FOR ' + money(val) : 'NOT READY YET');
  } else if (p === 'ipo' && q('.v1')){
    setText(q('.v1'), S.rebirths + ' sales this cycle'); setText(q('.v2'), 'need ' + ipoReq() + ' · +' + fmt(stockGain()) + ' stock'); setBar(q('.b1'), S.rebirths / ipoReq()); q('[data-act=ipo1]').disabled = !canIPO();
  } else if (p === 'merge' && q('.v1')){
    setText(q('.v1'), S.ipos + ' IPOs this cycle'); setText(q('.v2'), 'need ' + mergeReq() + ' · +' + fmt(creditGain()) + ' credits'); setBar(q('.b1'), S.ipos / mergeReq()); q('[data-act=merge1]').disabled = !canMerge();
  }
  const [defs, lv, cur] = PSHOP[p];
  if (q('.curv')) setText(q('.curv'), fmt(S[cur]));
  shopUpdate(defs, lv(), cur);
};

/* --- Market --- */
RENDER.market = () => {
  pane.innerHTML = `<div class="card dark"><div class="kv"><span>PORTFOLIO <span class="pv"></span></span><span>PROFIT <span class="pp"></span></span></div><div class="mini mn"></div></div>
  <div class="bar-row"><p class="hint">Buy with a slice of your cash and sell for a profit. Prices drift back toward 100 over time. Sale fee ${(M.fee * 100).toFixed(1)}%. Stocks are cashed out when you sell the company.</p><div class="seg">${[0.1,0.25,0.5,1].map(f => `<button data-act="frac" data-id="${f}" aria-pressed="${S.market.frac === f}">${f * 100}%</button>`).join('')}</div></div>
  <div class="list">${STOCKS.map(s => `<div class="row" data-stk="${s.sym}" style="grid-template-columns:96px minmax(0,1fr) auto"><canvas class="spark" width="96" height="30"></canvas><div class="mid"><div class="nm">${s.sym} <span class="cnt"></span></div><div class="ds">${s.name}</div><div class="st"></div></div><div class="act h"><button class="btn sm go" data-act="sbuy" data-id="${s.sym}">BUY</button><button class="btn sm" data-act="ssell" data-id="${s.sym}">SELL</button></div></div>`).join('')}</div>`;
};
UPDATE.market = () => {
  const q = s => pane.querySelector(s);
  setText(q('.pv'), money(marketValue())); setText(q('.pp'), (S.market.profit < 0 ? '-' : '') + money(Math.abs(S.market.profit))); setText(q('.mn'), 'NEWS: ' + S.market.news);
  STOCKS.forEach(s => {
    const r = q(`[data-stk="${s.sym}"]`); if (!r) return;
    const p = S.market.p[s.sym], h = S.market.hist[s.sym] || [p], old = h[Math.max(0, h.length - 13)], ch = (p / old - 1) * 100, hold = S.market.hold[s.sym];
    setHTML(r.querySelector('.cnt'), `${p.toFixed(1)} <span class="${ch >= 0 ? 'up' : 'down'}">${ch >= 0 ? '+' : ''}${ch.toFixed(1)}%</span>`);
    setText(r.querySelector('.st'), hold ? 'You hold ' + money(hold.u * p) + ' (' + (hold.u * p >= hold.cost ? '+' : '-') + money(Math.abs(hold.u * p - hold.cost)) + ')' : 'No position');
    r.querySelector('[data-act=sbuy]').disabled = !(S.cash > 0); r.querySelector('[data-act=ssell]').disabled = !hold;
    const cv2 = r.querySelector('canvas'), c = cv2.getContext('2d'); R(c, 0, 0, 96, 30, '#272c44');
    const mn = Math.min(...h), mx = Math.max(...h), sp = Math.max(1e-6, mx - mn);
    c.fillStyle = ch >= 0 ? '#4fbf78' : '#e05a4a';
    h.forEach((v, i) => c.fillRect(Math.round(i / Math.max(1, h.length - 1) * 93) + 1, 27 - Math.round((v - mn) / sp * 24), 2, 2));
  });
};

/* --- Contracts --- */
RENDER.contracts = () => {
  pane.innerHTML = `<p class="hint">Contracts pay gold bars and XP. A new one arrives 20 minutes after you claim. Login streak: <b>${S.daily.streak}</b> day${S.daily.streak === 1 ? '' : 's'}.</p>
  <div class="grid3">${S.contracts.slots.map((c, i) => `<div class="card" data-con="${i}"><h3 class="ct"></h3><div class="mini cd"></div><div class="pbar gold"><i></i></div><div class="kv"><span class="cp"></span><span class="cr"></span></div><div class="btn-row" style="padding:3px 0"><button class="btn sm go" data-act="claim" data-id="${i}">CLAIM</button><button class="btn sm" data-act="reroll" data-id="${i}">NEW · 5 GOLD</button></div></div>`).join('')}</div>
  <div class="card"><h3>Ways to earn gold bars</h3><div class="mini"><ul><li>Contracts, the inbox and Break Room games</li><li>Achievements (20 to 250 each) and beating rivals</li><li>Every career level (+2)</li><li>Angel investors and lucky briefcases</li><li>Daily login streak, up to 60 a day</li></ul></div></div>`;
  refs.contracts = S.contracts.slots.map((c, i) => pane.querySelector(`[data-con="${i}"]`));
};
UPDATE.contracts = () => {
  S.contracts.slots.forEach((c, i) => {
    const el = refs.contracts[i]; if (!el || !c) return;
    const claim = el.querySelector('[data-act=claim]'), reroll = el.querySelector('[data-act=reroll]');
    if (c.cool){ setText(el.querySelector('.ct'), 'NEW CONTRACT SOON'); setText(el.querySelector('.cd'), 'Your next client calls in ' + fmtTime((c.cool - Date.now()) / 1000) + '.'); setBar(el.querySelector('i'), 0); setText(el.querySelector('.cp'), ''); setText(el.querySelector('.cr'), ''); claim.disabled = true; reroll.hidden = true; }
    else { const p = contractProg(c); setText(el.querySelector('.ct'), p >= 1 ? 'DONE! CLAIM IT' : 'CONTRACT'); setText(el.querySelector('.cd'), c.desc); setBar(el.querySelector('i'), p); setText(el.querySelector('.cp'), Math.floor(p * 100) + '%'); setText(el.querySelector('.cr'), Math.round(c.reward * M.goldMult) + ' gold'); claim.disabled = p < 1; reroll.hidden = false; reroll.disabled = S.gold < 5; }
  });
};

/* --- Inbox --- */
const ago = ms => { const s = (Date.now() - ms) / 1000; return s < 60 ? 'just now' : fmtTime(s) + ' ago'; };
RENDER.inbox = () => {
  const ms2 = S.inbox.msgs;
  pane.innerHTML = `<p class="hint">Decisions arrive every few minutes and expire after 15. Story emails show up as you hit milestones.</p>
  <div class="list">${ms2.length ? ms2.map(m => {
    const d = m.kind === 'dec' ? DECISIONS.find(x => x.id === m.did) : null;
    return `<div class="mail${m.read ? '' : ' unread'}" data-mail="${m.id}"><div class="from"><span>${esc(m.from)}</span><span class="tm">${ago(m.time)}</span></div><h4>${esc(m.title)}</h4><p>${esc(m.body)}</p>
      ${d && !m.done ? `<div class="btn-row">${d.opts.map((o, k) => `<button class="btn sm ${k ? '' : 'go'}" data-act="decide" data-id="${m.id}:${k}">${esc(o[0])}</button>`).join('')}</div><div class="mini ex"></div>` : ''}
      ${m.res ? `<div class="res">${m.choice ? esc(m.choice) + ': ' : ''}${esc(m.res)}</div>` : ''}
      ${m.kind === 'story' && m.gold && !m.claimed ? `<div class="btn-row"><button class="btn sm gd" data-act="claimmail" data-id="${m.id}">CLAIM ${m.gold} GOLD</button></div>` : ''}</div>`; }).join('') : '<div class="lock-note"><b>Inbox zero</b>New emails arrive as you play.</div>'}</div>`;
  ms2.forEach(m => { if (m.kind === 'story' && (!m.gold || m.claimed)) m.read = true; });
  sig.inbox = ms2.map(m => m.id + (m.done ? 'd' : '') + (m.claimed ? 'c' : '')).join();
};
UPDATE.inbox = () => {
  if (S.inbox.msgs.map(m => m.id + (m.done ? 'd' : '') + (m.claimed ? 'c' : '')).join() !== sig.inbox) return RENDER.inbox();
  S.inbox.msgs.forEach(m => { const el = pane.querySelector(`[data-mail="${m.id}"]`); if (!el) return; setText(el.querySelector('.tm'), ago(m.time)); const ex = el.querySelector('.ex'); if (ex) setText(ex, 'Expires in ' + fmtTime((m.exp - Date.now()) / 1000)); });
};

/* --- Collection --- */
RENDER.collection = () => {
  const found = ITEMS.filter(it => (S.items[it.id] || {}).lv).length, maxed = ITEMS.filter(it => (S.items[it.id] || {}).lv >= RAR[it.r].max).length;
  const bonus = {}; ITEMS.forEach(it => { const o = S.items[it.id]; if (o && o.lv) bonus[it.type] = (bonus[it.type] || 0) + it.per * o.lv; });
  pane.innerHTML = `<p class="hint">${found}/${ITEMS.length} found · ${maxed} maxed · crate luck +${pct(M.luck)}. Duplicates level items up. Pets roam your office.</p>
  <div class="grid3">${CRATES.map(c => `<div class="card"><h3>${c.name}</h3><div class="mini">${c.n} items · Epic ${c.w[3]}% · Legendary ${c.w[4]}% · Mythic ${c.w[5]}%</div><button class="btn sm gd" data-act="crate" data-id="${c.id}">OPEN · ${c.cost} GOLD</button></div>`).join('')}</div>
  ${lastReveal.length ? `<div class="card dark"><h3>You got</h3><div class="reveal">${lastReveal.map((r, i) => { const it = ITEM_BY[r.id]; return `<div class="item" style="box-shadow:0 0 0 2px ${RAR[it.r].c}"><canvas width="10" height="10" data-rv="${i}"></canvas><div><div class="in">${it.name}</div><div class="rar" style="color:var(--ink-soft)">${r.note}</div></div></div>`; }).join('')}</div></div>` : ''}
  <div class="card"><h3>Collection bonuses</h3><div class="mini">${Object.keys(bonus).length ? ITYPES.filter(([t]) => bonus[t]).map(([t, label]) => t === 'offline' ? '+' + Math.round(bonus[t]) + ' min offline cap' : '+' + pct(bonus[t]) + ' ' + label).join(' · ') : 'Open crates to start your collection.'}</div></div>
  <div class="items">${ITEMS.map(it => { const o = S.items[it.id] || {lv:0, c:0}, known = o.lv > 0, mx = RAR[it.r].max; return `<div class="item${known ? '' : ' unknown'}" style="box-shadow:0 0 0 2px ${known ? RAR[it.r].c : 'var(--ink)'}"><canvas width="10" height="10" data-it="${it.id}"></canvas><div class="mid"><div class="in">${known ? it.name : '???'}</div><div class="rar" style="color:${it.r ? RAR[it.r].c : 'var(--ink-soft)'}">${RAR[it.r].n}${it.pet ? ' · PET' : ''}</div><div>${known ? 'Lv ' + o.lv + '/' + mx + ' · ' + itemEffText(it, o.lv) : 'Not found yet'}</div>${known && o.lv < mx ? `<div class="pbar"><i style="width:${o.c / o.lv * 100}%"></i></div>` : ''}</div></div>`; }).join('')}</div>`;
  pane.querySelectorAll('[data-it]').forEach(cn => { const it = ITEM_BY[cn.dataset.it]; itemIcon(cn, it, (S.items[it.id] || {}).lv > 0); });
  pane.querySelectorAll('[data-rv]').forEach(cn => itemIcon(cn, ITEM_BY[lastReveal[+cn.dataset.rv].id], true));
};
UPDATE.collection = () => { pane.querySelectorAll('[data-act=crate]').forEach(b => { b.disabled = S.gold < CRATES.find(x => x.id === b.dataset.id).cost; }); };
const spriteCache = {};
function itemSprite(it){
  if (spriteCache[it.id]) return spriteCache[it.id];
  let seed = hash(it.id + it.name) || 1;
  const rnd = () => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) / 16777216; };
  const g = [];
  for (let y = 0; y < 8; y++){ g[y] = []; for (let x = 0; x < 4; x++){ const v = rnd() < (y === 0 || y === 7 ? 0.35 : 0.6) ? (rnd() < 0.3 ? 2 : 1) : 0; g[y][x] = v; g[y][7 - x] = v; } }
  for (let y = 1; y < 7; y++) if (!g[y][3]){ g[y][3] = 1; g[y][4] = 1; }
  const cnv = document.createElement('canvas'); cnv.width = 10; cnv.height = 10; const c = cnv.getContext('2d');
  const main = RAR[it.r].c, alt = 'hsl(' + (hash(it.name) % 360) + ',65%,58%)';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (g[y][x]) for (const [dx, dy] of DIRS){ const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx > 7 || ny > 7 || !g[ny][nx]) R(c, nx + 1, ny + 1, 1, 1, '#14141c'); }
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (g[y][x]) R(c, x + 1, y + 1, 1, 1, g[y][x] === 2 ? alt : main);
  R(c, 3, 2, 1, 1, 'rgba(255,255,255,.7)');
  spriteCache[it.id] = cnv; return cnv;
}
function itemIcon(cnv, it, known){
  const c = cnv.getContext('2d'); c.imageSmoothingEnabled = false; R(c, 0, 0, 10, 10, '#272c44');
  if (known) c.drawImage(itemSprite(it), 0, 0); else { R(c, 3, 2, 4, 1, '#4c5170'); R(c, 6, 3, 1, 2, '#4c5170'); R(c, 4, 5, 2, 1, '#4c5170'); R(c, 4, 7, 2, 1, '#4c5170'); }
}

/* --- Rivals --- */
RENDER.rivals = () => {
  const rows = RIVALS.map(r => ({name:r.name, sub:'CEO ' + r.ceo, worth:rivalWorth(r), beat:!!S.rivals.beat[r.i], r})).concat([{name:'YOU', sub:office().name, worth:S.total, you:true}]).sort((a, b) => b.worth - a.worth);
  const next = RIVALS.find(r => !S.rivals.beat[r.i]);
  pane.innerHTML = `<p class="hint">Rival companies ranked by lifetime earnings. Each one you pass pays gold and gives +5% income forever. They keep growing slowly over time.</p>
  ${next ? `<div class="card dark"><h3>Next rival: ${next.name}</h3><div class="pbar gold"><i style="width:${clamp(Math.log10(1 + S.total) / Math.log10(1 + rivalWorth(next)) * 100, 0, 100)}%"></i></div><div class="mini">${money(S.total)} of ${money(rivalWorth(next))}</div></div>` : ''}
  <div class="list">${rows.map((x, i) => `<div class="rival${x.you ? ' you' : x.beat ? ' beat' : ''}"><span class="rk">#${i + 1}</span><div class="mid"><b>${esc(x.name)}</b><div class="mini">${esc(x.sub)}${x.beat ? ' · beaten' : ''}</div></div><span class="kv">${money(x.worth)}</span></div>`).join('')}</div>`;
};
UPDATE.rivals = () => {};

/* --- Awards --- */
RENDER.awards = () => {
  const f = S.opt.achFilter, got = achN;
  const list = ACH.filter(a => f === 'all' || (f === 'got' ? S.ach[a.id] : !S.ach[a.id]));
  pane.innerHTML = `<div class="bar-row"><p class="hint">${got} of ${ACH.length} earned. Each one adds +2% income (now ×${xf(M.achMult)}).</p><div class="seg">${[['todo','TO DO'],['got','EARNED'],['all','ALL']].map(([k, n]) => `<button data-act="achf" data-id="${k}" aria-pressed="${f === k}">${n}</button>`).join('')}</div></div>
  <div class="pbar"><i style="width:${got / ACH.length * 100}%"></i></div>
  <div class="list"><div class="ach-grid">${list.slice(0, 300).map(a => `<div class="ach${S.ach[a.id] ? ' got' : ''}"><b>${a.name}</b><span>${a.desc()} · ${a.gold} gold</span></div>`).join('')}</div>${list.length > 300 ? `<p class="hint">Showing 300 of ${list.length}.</p>` : ''}</div>`;
};
UPDATE.awards = () => {};

/* --- More --- */
RENDER.more = () => {
  const autos = [['hire','Auto-Hire Bot',sh('autohire'),'Share Shop'],['up','Auto-Upgrader',sh('autoup'),'Share Shop'],['move','Auto-Mover',sh('automove'),'Share Shop'],['sell','Auto-Seller',st('autosell'),'Stock Exchange'],['ipo','Auto-IPO',ms('autoipo'),'Cosmic Boardroom']];
  pane.innerHTML = `<div class="card"><h3>Automation</h3>${autos.map(([k, n, has, from]) => has ? `<label class="tog"><input type="checkbox" id="auto-${k}" data-set="auto.${k}" ${S.auto[k] ? 'checked' : ''}> ${n}</label>` : `<div class="mini">${n}: buy it in the ${from}.</div>`).join('')}
    ${st('autosell') ? `<label class="tog">Auto-sell at <input type="number" id="auto-sellx" min="1" step="1" data-set="auto.sellX" value="${S.auto.sellX}"> × the asking price</label>` : ''}</div>
  <div class="card"><h3>Settings</h3>
    <label class="tog"><input type="checkbox" id="opt-sci" data-set="opt.sci" ${S.opt.sci ? 'checked' : ''}> Scientific notation (1.23e45)</label>
    <label class="tog"><input type="checkbox" id="opt-particles" data-set="opt.particles" ${S.opt.particles ? 'checked' : ''}> Coin particles</label>
    <label class="tog"><input type="checkbox" id="opt-daylock" data-set="opt.daylock" ${S.opt.daylock ? 'checked' : ''}> Always daytime (the office normally follows your real clock)</label></div>
  <div class="card"><h3>Save file</h3><p class="mini" style="margin:0">Your progress lives in this browser. Back it up so a cleared cache can't wipe months of work. Old v2 save codes load here too.</p>
    <div class="btn-row"><button class="btn sm go" data-act="dlsave">DOWNLOAD SAVE FILE</button><button class="btn sm" data-act="ulsave">LOAD SAVE FILE</button><button class="btn sm" data-act="export">SHOW SAVE CODE</button></div>
    <textarea id="saveBox" placeholder="Paste a save code here and press LOAD CODE" spellcheck="false"></textarea>
    <div class="btn-row"><button class="btn sm" data-act="copysave">COPY</button><button class="btn sm" data-act="import">LOAD CODE</button></div></div>
  <div class="card"><h3>Stats</h3><div class="stats" id="statsBox"></div></div>
  <div class="card"><h3>Danger zone</h3><div class="btn-row"><button class="link" data-act="reset">Erase all progress</button></div></div>`;
};
UPDATE.more = () => {
  const rows = [['Total earned', money(S.total)], ['This run', money(S.run)], ['Best sale', money(S.stats.bestRun)], ['Play time', fmtTime(S.stats.play)],
    ['Clicks', fmt(S.stats.clicks)], ['Staff hired', fmt(S.stats.hires)], ['Most staff at once', fmt(S.stats.maxEmp)], ['Sales / IPOs / mergers', S.tr + ' / ' + S.ti + ' / ' + S.mergers],
    ['Office events', fmt(S.stats.events)], ['Research done', researchDone() + '/' + RESEARCH.length], ['Crates opened', fmt(S.stats.crates)], ['Contracts', fmt(S.contracts.done)],
    ['Achievements', achN + '/' + ACH.length], ['Furniture bought', fmt(S.stats.furnBought)], ['Trash cleaned', fmt(S.stats.cleaned)], ['Talent hired', fmt(S.stats.talents)],
    ['Trades / profit', fmt(S.market.trades) + ' / ' + money(S.market.profit)], ['Decisions', fmt(S.inbox.decisions)], ['Rivals beaten', Object.keys(S.rivals.beat).length + '/' + RIVALS.length], ['Gold earned', fmt(S.goldTotal)],
    ['Offline cap', fmtTime(M.offCap) + ' at ' + Math.round(M.offRate * 100) + '%'], ['Click value', money(M.clickVal)], ['Auto-clicks', xf(M.auto) + '/s'], ['Seats', fmt(M.seats)]];
  setHTML($('statsBox'), rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join(''));
};

/* --- HUD --- */
function buildNeeds(){ $('needs').innerHTML = NEEDS.map(([k, n, col]) => `<div class="need"><span>${n}</span><div class="nb"><i data-hn="${k}" style="background:var(${col})"></i></div></div>`).join('') + `<div class="need"><span>STYLE <span class="nv" id="hStyle"></span></span><div class="nb"><i id="hStyleB" style="background:var(--n-s)"></i></div></div><div class="need"><span>TIDY <span class="nv" id="hTidy"></span></span><div class="nb"><i id="hTidyB" style="background:var(--cash-hi)"></i></div></div>`; }
function goalText(free){
  const emp = totalEmp(), nextOff = OFFICES[S.office + 1], dc = M.dec;
  if (!emp && S.cash < 15 && !S.tr) return 'Click the office or WORK to earn cash. Your first Intern costs $15.';
  if (!emp && !S.tr) return 'Hire an Intern in Business → Staff. Staff earn money while you sit back.';
  if (canMerge()) return 'A mega merger is ready. Open Growth → Prestige → Merger.';
  if (canIPO()) return 'Wall Street wants you. Open Growth → Prestige → IPO.';
  if (canSell()) return 'Buyers are ready. Sell the company in Growth → Prestige for ' + money(S.run + marketValue()) + '.';
  if (S.inbox.msgs.some(m => m.kind === 'dec' && !m.done)) return 'You have an email waiting for a decision in Money → Inbox.';
  if (S.contracts.slots.some(c => c && !c.cool && contractProg(c) >= 1)) return 'A contract is done. Claim your gold in Money → Jobs.';
  if (dc && emp >= 5){ const low = NEEDS.filter(([k]) => dc.sat[k] < 0.6).sort((a, b) => dc.sat[a[0]] - dc.sat[b[0]])[0]; if (low) return 'Your staff need more ' + low[1].toLowerCase() + '. Buy and place ' + low[1].toLowerCase() + ' furniture in Office → Decor.'; }
  if (S.trash.length >= 8) return 'The office is getting messy. Click trash to clean it, or buy trash cans and a Janitor Bot.';
  if (S.tr >= 1 && S.research.active.length < M.slots && RESEARCH.some(p => !S.research.done[p.id] && !S.research.active.some(a => a.id === p.id) && resAvailable(p))) return 'A lab slot is free. Start a project in Growth → Lab.';
  if (free <= 0 && nextOff && unlocked(nextOff.req)) return 'Every seat is full. Save ' + money(nextOff.cost) + ' to move into ' + nextOff.name + '.';
  if (free <= 0) return 'Every seat is full. Sell the company to unlock a bigger office.';
  return 'Earn ' + money(sellTarget() - S.run - marketValue()) + ' more this run so buyers will purchase the company.';
}
function updateHUD(){
  const o = office(), emp = totalEmp(), dc = M.dec;
  setText($('hudCash'), money(S.cash)); setText($('hudRate'), money(M.income)); setText($('hudShares'), fmt(S.shares)); setText($('hudGold'), fmt(S.gold));
  setText($('lvlText'), 'CAREER LVL ' + fmt(S.level)); setText($('xpText'), fmt(S.xp) + ' / ' + fmt(xpNeed(S.level)) + ' XP'); setBar($('xpFill'), S.xp / xpNeed(S.level));
  setText($('officeName'), o.name); setText($('stars'), ratingStars());
  const chip = $('seatChip'); setText(chip, 'SEATS ' + fmt(emp) + '/' + fmt(M.seats)); chip.classList.toggle('full', emp >= M.seats);
  const h = dc ? dc.hr : 12, hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
  setText($('clockChip'), (S.opt.daylock ? 'DAY' : ((hh % 12) || 12) + ':' + String(mm).padStart(2, '0') + (hh < 12 ? ' AM' : ' PM')) + ' · ' + (WEATHER[S.weather.type] || WEATHER.sunny).n);
  setText($('workVal'), '+' + money(M.clickVal));
  if (dc){ NEEDS.forEach(([k]) => setBar(document.querySelector(`[data-hn="${k}"]`), dc.sat[k] / 1.5)); setText($('hStyle'), '×' + xf(dc.styleMult)); setBar($('hStyleB'), Math.log10(1 + dc.style) / 6); setText($('hTidy'), S.trash.length ? '−' + Math.round((1 - dc.cleanF) * 100) + '%' : 'OK'); setBar($('hTidyB'), dc.cleanF * 1.25 - 0.25); }
  const bs = S.boosts.filter(b => b.end > Date.now());
  setHTML($('mults'), `<span class="chip">Money ×${xf(M.global)}</span><span class="chip">Office ×${xf(M.decorMult)}</span><span class="chip">XP ×${xf(M.xpMult)}</span><span class="chip">Sales ${S.rebirths}${S.ipos ? ' · IPOs ' + S.ipos : ''}${S.mergers ? ' · Mergers ' + S.mergers : ''}</span>${bs.map(b => `<span class="chip boost">${b.name} ×${b.mult} · ${Math.ceil((b.end - Date.now()) / 1000)}s</span>`).join('')}`);
  const free = M.seats - emp;
  setText($('goalText'), goalText(free));
  const dots = {
    upgrades:UPGRADES.some(u => upReady(u) && S.cash >= u.cost), offices:OFFICES.some(o2 => o2.i > S.office && unlocked(o2.req) && S.cash >= o2.cost),
    research:S.tr >= 1 && S.research.active.length < M.slots && RESEARCH.some(p => !S.research.done[p.id] && !S.research.active.some(a => a.id === p.id) && resAvailable(p)),
    contracts:S.contracts.slots.some(c => c && !c.cool && contractProg(c) >= 1), collection:S.gold >= 30, skills:skillPoints() > 0, prestige:canSell() || canIPO() || canMerge(),
    inbox:S.inbox.msgs.some(m => !m.read && !(m.kind === 'dec' && m.done)), talent:S.gold >= 40 && S.talent.roster.length < M.roster, break:!cdLeft('tossCd') || !cdLeft('zeroCd'),
    decor:dc && emp >= 5 && NEEDS.some(([k]) => dc.sat[k] < 0.6),
  };
  document.querySelectorAll('.tab').forEach(b => { b.querySelector('.dot').hidden = !dots[b.dataset.tab]; });
  document.querySelectorAll('.cat').forEach(b => { const c = CATS.find(x => x[0] === b.dataset.cat); b.querySelector('.dot').hidden = !c[2].some(t => dots[t]); });
}
function updateUI(force){
  updateHUD();
  if (force || dirty[S.tab]){ dirty[S.tab] = false; RENDER[S.tab](); }
  UPDATE[S.tab]();
}
let floatSide = 0;
function floater(text, lx, ly, big){
  const el = document.createElement('div'); el.className = 'floater' + (big ? ' big' : ''); el.textContent = text;
  const b = bossPos(), x = lx != null ? lx : (b ? b.x + 6 : 192) + ((floatSide++ % 3) - 1) * 18, y = ly != null ? ly : (b ? b.y : 170);
  el.style.left = (x / W * 100) + '%'; el.style.top = (y / H * 100) + '%';
  $('floaters').appendChild(el); setTimeout(() => el.remove(), 950);
}
function toast(msg, kind){
  const box = $('toasts'), el = document.createElement('div');
  el.className = 'toast ' + (kind || ''); el.textContent = msg; box.appendChild(el);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => el.classList.add('out'), 3000); setTimeout(() => el.remove(), 3400);
}
