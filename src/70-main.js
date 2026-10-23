/* ================= INPUT ================= */
const confirmPair = (a, on) => { const q = s => pane.querySelector(`[data-act=${s}]`); q(a + '1').hidden = on; q(a + 'yes').hidden = !on; q(a + 'no').hidden = !on; };
let resetArmed = 0;
function ensureCeo(){ const L = layout(); if (!L.f.some(p => p.id === 'ceo')){ const A = areaOf(S.office); for (let y = A.h - 2; y >= 0; y--) for (let x = A.x0; x < A.x0 + A.w - 1; x++) if (canPlace(FURN_BY.ceo, x, y, L, S.office)){ L.f.push({id:'ceo', x, y}); decorDirty = layoutDirty = true; return; } } }
function cancelPlacing(){ placing = null; ensureCeo(); updateDecorHint(); updateUI(true); }
const ACT = {
  amt:id => { S.amt = id === 'max' ? 'max' : +id; RENDER.staff(); UPDATE.staff(); },
  hire:id => hire(id), fire:id => fire(id),
  up:id => { if (buyUpgrade(id)) updateUI(true); }, buyall:() => { if (buyAllUpgrades()) updateUI(true); },
  move:id => { if (moveOffice(+id)) updateUI(true); },
  rstart:id => startResearch(id), rskip:id => skipResearch(id),
  claim:id => claimContract(+id), reroll:id => rerollContract(+id),
  crate:id => openCrate(id),
  skill:id => addSkill(id, 1), skill10:id => addSkill(id, 10), refund:() => refundSkills(),
  ptab:id => { S.ptab = id; RENDER.prestige(); UPDATE.prestige(); },
  shop:id => { const [defs, lv, cur] = PSHOP[S.ptab]; buyShop(defs, lv(), cur, id); },
  sell1:() => confirmPair('sell', true), sellno:() => confirmPair('sell', false), sellyes:() => { doSell(); updateUI(true); },
  ipo1:() => confirmPair('ipo', true), ipono:() => confirmPair('ipo', false), ipoyes:() => { doIPO(); updateUI(true); },
  merge1:() => confirmPair('merge', true), mergeno:() => confirmPair('merge', false), mergeyes:() => { doMerge(); updateUI(true); },
  achf:id => { S.opt.achFilter = id; RENDER.awards(); },
  decor:() => setDecorMode(!decorMode), arrange:() => autoArrange(), storeall:() => storeAll(),
  cancelplace:() => cancelPlacing(), movesel:() => moveItem(selected), storesel:() => storeItem(selected), desel:() => { selected = null; updateDecorHint(); updateUI(true); },
  fcat:id => { S.opt.fcat = id; RENDER.decor(); UPDATE.decor(); },
  fbuy:id => buyFurn(id), fplace:id => startPlacing(id), flv:id => levelFurn(id),
  hunt:id => headhunt(id), train:id => trainTalent(+id), release:id => releaseTalent(+id),
  frac:id => { S.market.frac = +id; RENDER.market(); UPDATE.market(); },
  sbuy:id => buyStock(id), ssell:id => sellStock(id),
  decide:id => { const [m, k] = id.split(':').map(Number); decide(m, k); },
  claimmail:id => claimMail(+id),
  tossstart:() => { startToss(); updateUI(); }, toss:() => { if (!MG.toss || MG.toss.done) startToss(); else throwToss(); updateUI(); },
  zerostart:() => { startZero(); updateUI(); }, zero:id => hitZero(+id),
  spin:() => { spinSlot(); updateUI(); },
  export:() => { $('saveBox').value = encodeSave(); $('saveBox').select(); },
  copysave:() => { const box = $('saveBox'); if (!box.value) box.value = encodeSave(); box.select(); const p = navigator.clipboard && navigator.clipboard.writeText(box.value); if (p) p.then(() => toast('Save code copied.'), () => toast('Select the code and copy it yourself.')); else toast('Select the code and copy it yourself.'); },
  import:() => { try { const v = $('saveBox').value; if (!v.trim()) return toast('Paste a save code first.'); S = decodeSave(v); afterLoad(); toast('Save loaded.', 'gold'); } catch(e){ toast('That save code is not valid. Check that you copied all of it.'); } },
  dlsave:() => { const blob = new Blob([encodeSave()], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pixel-office-tycoon-save-' + new Date().toISOString().slice(0, 10) + '.txt'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); },
  ulsave:() => $('fileIn').click(),
  reset:(id, b) => {
    if (Date.now() - resetArmed < 4000){ S = fresh(); save(); afterLoad(); toast('Progress erased. Back to the garage.'); resetArmed = 0; }
    else { resetArmed = Date.now(); b.textContent = 'Click again within 4 seconds to erase everything'; setTimeout(() => { if (b.isConnected) b.textContent = 'Erase all progress'; }, 4000); }
  },
};
function canvasPoint(e){ const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function onCanvasDown(e){
  if (e.button === 2) return;
  const [lx, ly] = canvasPoint(e);
  if (ev && lx > ev.x - 6 && lx < ev.x + 17 && ly > ev.y - 9 && ly < ev.y + 13){ claimEvent(lx, ly); updateHUD(); return; }
  const ti = S.trash.findIndex(tr => { const x = tr.x * TS + 4 + tr.r, y = FY + tr.y * TS + 6 + tr.r; return lx > x - 4 && lx < x + 12 && ly > y - 4 && ly < y + 10; });
  if (ti >= 0){ cleanTrash(ti, lx, ly); updateHUD(); return; }
  if (decorMode){
    const tx = Math.floor(lx / TS), ty = ly < FY ? -1 : Math.floor((ly - FY) / TS);
    if (placing){ if (placeAt(tx, ty)) updateUI(true); else toast('That spot is blocked. Try a green one.'); }
    else { selected = itemAt(lx, ly); updateDecorHint(); updateUI(true); }
    return;
  }
  const pet = pets.find(p => Math.abs(lx - (p.x + 4)) < 8 && Math.abs(ly - (p.y + 2)) < 7);
  if (pet){ S.stats.pets++; floater(pet.kind === 'dog' ? 'WOOF!' : pet.kind === 'cat' ? 'PURR' : pet.kind === 'parrot' ? 'SQUAWK!' : 'RAWR!', lx, ly); return; }
  work(lx, ly); updateHUD();
}
function wire(){
  buildNav(); buildNeeds();
  $('cats').addEventListener('click', e => { const b = e.target.closest('.cat'); if (b) showCat(b.dataset.cat); });
  $('tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) showTab(b.dataset.tab); });
  pane.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b || b.disabled) return; const f = ACT[b.dataset.act]; if (f) f(b.dataset.id, b); });
  pane.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset && el.dataset.assign){ assignTalent(+el.dataset.assign, el.value); return; }
    const path = el.dataset && el.dataset.set; if (!path) return;
    const [a, k] = path.split('.');
    S[a][k] = el.type === 'checkbox' ? el.checked : Math.max(1, +el.value || 1);
    if (a === 'opt'){ markAll(); recalc(); }
    updateUI();
  });
  $('fileIn').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { try { S = decodeSave(String(rd.result)); afterLoad(); toast('Save file loaded.', 'gold'); } catch(err){ toast('That file is not a Pixel Office Tycoon save.'); } };
    rd.readAsText(f); e.target.value = '';
  });
  $('workBtn').addEventListener('click', () => { work(); updateHUD(); });
  $('decorBtn').addEventListener('click', () => setDecorMode(!decorMode));
  $('wrap').addEventListener('pointerdown', onCanvasDown);
  $('wrap').addEventListener('pointermove', e => { if (!decorMode) return; const [lx, ly] = canvasPoint(e); hoverTile = [Math.floor(lx / TS), ly < FY ? -1 : Math.floor((ly - FY) / TS)]; });
  $('wrap').addEventListener('pointerleave', () => { hoverTile = null; });
  $('wrap').addEventListener('contextmenu', e => { if (decorMode){ e.preventDefault(); if (placing) cancelPlacing(); else { selected = null; updateDecorHint(); updateUI(true); } } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && decorMode){ if (placing) cancelPlacing(); else setDecorMode(false); } });
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
}

/* ================= LOOP ================= */
let lastT = 0, lastUI = 0, lastSec = 0, lastSaveT = 0, lastAuto = 0;
function frame(nowMs){
  const dt = Math.min(3600, Math.max(0, (nowMs - lastT) / 1000)); lastT = nowMs;
  const t = nowMs / 1000;
  recalc();
  if (M.income > 0) earn(M.income * dt);
  if (M.emp) addXP(0.1 * M.emp * dt);
  S.stats.play += Math.min(dt, 5);
  if (M.auto > 0){ autoAcc += M.auto * Math.min(dt, 60); let n = 0; while (autoAcc >= 1 && n < 600){ autoAcc -= 1; n++; } if (n){ earn(M.clickVal * n); S.stats.clicks += n; addXP(0.5 * n); bossBump = 0.2; } }
  if (!nextEvent) scheduleEvent(t);
  if (!ev && t > nextEvent) spawnEvent(t);
  if (ev && t > ev.until){ ev = null; scheduleEvent(t); }
  if (S.research.active.length) checkResearch();
  if (S.boosts.length && S.boosts.some(b => b.end <= Date.now())) S.boosts = S.boosts.filter(b => b.end > Date.now());
  tickTrash(Math.min(dt, 60));
  if (nowMs - lastAuto > 500){ lastAuto = nowMs; runAutomation(); }
  if (nowMs - lastMarket > 5000){ lastMarket = nowMs; tickMarket(); }
  S.stats.maxEmp = Math.max(S.stats.maxEmp, M.emp);
  mgTick(Math.min(dt, 0.1), t);
  draw(t, Math.min(dt, 0.1));
  if (nowMs - lastUI > 200){ lastUI = nowMs; updateUI(); }
  if (nowMs - lastSec > 1000){ lastSec = nowMs; checkAchievements(); tickContracts(); tickInbox(); checkRivals(); tickWeather(); }
  if (nowMs - lastSaveT > 10000){ lastSaveT = nowMs; save(); }
  requestAnimationFrame(frame);
}
function dailyBonus(){
  const today = new Date().toDateString();
  if (S.daily.last === today) return;
  const y = new Date(Date.now() - 86400000).toDateString();
  S.daily.streak = S.daily.last === y ? S.daily.streak + 1 : 1;
  S.daily.last = today;
  const g = addGold(10 + 5 * Math.min(S.daily.streak, 10), true);
  setTimeout(() => toast('Daily bonus: +' + g + ' gold bars (day ' + S.daily.streak + ' streak)', 'gold'), 900);
}
function afterLoad(){
  crewDirty = true; petsDirty = true; decorDirty = true; talentDirty = true; layoutDirty = true; blocked = null;
  ev = null; coins.length = 0; lastReveal = []; lastTalent = null; placing = null; selected = null;
  if (decorMode) setDecorMode(false);
  achN = Object.keys(S.ach).length;
  initMarket(); layout(); ensureCeo();
  recalc(); tickContracts();
  markAll(); showCat(S.cat || 'biz');
}
function start(){
  S = loadSaved() || fresh();
  achN = Object.keys(S.ach).length;
  initMarket();
  recalc();
  const away = Math.min(M.offCap, Math.max(0, (Date.now() - (S.lastSave || Date.now())) / 1000));
  if (away > 30 && (M.income > 0 || M.emp)){
    const v = M.income * away * M.offRate;
    earn(v); addXP(0.1 * M.emp * away * M.offRate);
    for (let i = 0; i < Math.min(12, Math.floor(away / 300)); i++) spawnTrash();
    setTimeout(() => toast('While you were away (' + fmtTime(away) + ') your staff earned ' + money(v), 'gold'), 400);
  }
  checkResearch(); dailyBonus();
  wire(); afterLoad();
  if (migrated) setTimeout(() => toast('Imported your v2 progress. Welcome to v3!', 'lvl'), 1400);
  if (month() === 9) setTimeout(() => toast('Spooky season! Halloween furniture is in the Decor shop this month.', 'mail'), 2200);
  requestAnimationFrame(t => { lastT = t; requestAnimationFrame(frame); });
}
window.__POT = {get S(){ return S; }, get M(){ return M; }, get DEC(){ return DEC; }, ACH, UPGRADES, RESEARCH, ITEMS, STAFF, OFFICES, FURN, recalc, doSell, doIPO, doMerge, openCrate, showTab, showCat, ALL_TABS, layout, autoArrange, setDecorMode, startPlacing, placeAt, buyFurn, headhunt, buyStock, sellStock, spawnDecision, decide, startToss, throwToss, startZero, spinSlot, checkAchievements, checkRivals, checkStory, tickMarket, spawnTrash,
  forceDirty:() => { decorDirty = true; talentDirty = true; crewDirty = true; layoutDirty = true; petsDirty = true; }};
start();
