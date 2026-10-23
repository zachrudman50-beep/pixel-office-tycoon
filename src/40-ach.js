/* ================= ACHIEVEMENTS ================= */
const ACH = [];
const A = (id, name, desc, check, gold) => ACH.push({id, name, desc, check, gold});
const EARN_NAMES = ['Pocket Change','Lemonade Stand','Small Business','Millionaire','Big Spender','Hundred Millionaire','Billionaire','Tycoon','Trillionaire','Mogul','Plutocrat','Quadrillionaire','Market Maker','Economy Itself','Money Printer'];
for (let e = 3; e <= 150; e += 3){ const x = Math.pow(10, e); A('earn' + e, EARN_NAMES[e / 3 - 1] || 'Net Worth 1e' + e, () => 'Earn ' + money(x) + ' in total', () => S.total >= x, 5 + Math.floor(e / 5)); }
for (let e = 1; e <= 90; e += 3){ const x = Math.pow(10, e); A('inc' + e, 'Cash Flow 1e' + e, () => 'Make ' + money(x) + ' per second', () => (M.income || 0) >= x, 5 + Math.floor(e / 6)); }
[1,10,25,50,100,200,300,500].forEach((n, k) => STAFF.forEach(s => A('role_' + s.id + '_' + n, n === 1 ? 'First ' + s.name : n + ' ' + s.name + 's', () => 'Have ' + n + ' ' + s.name + (n > 1 ? 's' : '') + ' at once', () => (S.stats.maxRole[s.id] || 0) >= n, 3 + s.tier + k * 2)));
[100,1e3,1e4,5e4,1e5,5e5,1e6,5e6].forEach((n, k) => A('click' + n, ['Clicker','Busy Fingers','Carpal Tunnel','Click Machine','Click Lord','Click Deity','Million Clicks','Clickpocalypse'][k], () => 'Click ' + fmt(n) + ' times', () => S.stats.clicks >= n, 5 + k * 3));
[1,2,3,5,10,15,20,30,50,75,100,150,200,300,500].forEach((n, k) => A('reb' + n, n === 1 ? 'Sold Out' : 'Serial Founder ' + n, () => 'Sell the company ' + n + ' time' + (n > 1 ? 's' : ''), () => S.tr >= n, 10 + k * 4));
[1,2,3,5,8,10,15,20,30,50].forEach((n, k) => A('ipo' + n, n === 1 ? 'Ring the Bell' : 'Wall Street Regular ' + n, () => 'Go public ' + n + ' time' + (n > 1 ? 's' : ''), () => S.ti >= n, 25 + k * 10));
[1,2,3,5,7,10,15,20].forEach((n, k) => A('merge' + n, n === 1 ? 'Too Big To Fail' : 'Cosmic Conglomerate ' + n, () => 'Complete ' + n + ' mega merger' + (n > 1 ? 's' : ''), () => S.mergers >= n, 50 + k * 25));
[5,10,15,20,30,40,50,75,100,125,150,200,250,300,400,500].forEach((n, k) => A('lvl' + n, 'Career Level ' + n, () => 'Reach career level ' + n, () => S.level >= n, 5 + k * 3));
OFFICES.slice(1).forEach(o => A('office' + o.i, 'Welcome to ' + o.name, () => 'Move into ' + o.name, () => S.stats.maxOffice >= o.i, 5 + o.i * 3));
[1,10,50,100,250,500,1000,2500,5000].forEach((n, k) => A('ev' + n, ['Lucky Break','Opportunist','Event Hunter','Office Legend','Event Magnet','Golden Touch','Event Horizon','Fortune Favored','Destiny'][k], () => 'Grab ' + n + ' office event' + (n > 1 ? 's' : ''), () => S.stats.events >= n, 5 + k * 4));
[1,5,10,20,30,40,50,60,70,80,90,100].forEach((n, k) => A('res' + n, n === 100 ? 'Mad Genius' : 'Researcher ' + n, () => 'Finish ' + n + ' research project' + (n > 1 ? 's' : ''), () => researchDone() >= n, 5 + k * 5));
[1,5,10,20,30,40,50,60].forEach((n, k) => A('found' + n, n === 60 ? 'Completionist' : 'Collector ' + n, () => 'Discover ' + n + ' collectible' + (n > 1 ? 's' : ''), () => Object.values(S.items).filter(o => o.lv).length >= n, 5 + k * 5));
[1,5,10,20,40,60].forEach((n, k) => A('maxit' + n, n === 60 ? 'Museum of Everything' : 'Maxed Out ' + n, () => 'Max out ' + n + ' collectible' + (n > 1 ? 's' : ''), () => ITEMS.filter(it => (S.items[it.id] || {}).lv >= RAR[it.r].max).length >= n, 10 + k * 15));
A('legend1', 'Legendary Pull', () => 'Find a Legendary collectible', () => ITEMS.some(it => it.r === 4 && (S.items[it.id] || {}).lv), 25);
A('myth1', 'Myth Made Real', () => 'Find a Mythic collectible', () => ITEMS.some(it => it.r === 5 && (S.items[it.id] || {}).lv), 50);
[1,10,50,100,250,500,1000,2500].forEach((n, k) => A('crate' + n, 'Unboxer ' + n, () => 'Open ' + n + ' crate' + (n > 1 ? 's' : ''), () => S.stats.crates >= n, 5 + k * 4));
[1,10,25,50,100,250,500,1000].forEach((n, k) => A('con' + n, 'Contractor ' + n, () => 'Finish ' + n + ' contract' + (n > 1 ? 's' : ''), () => S.contracts.done >= n, 5 + k * 4));
[[3600,'Clocked In'],[18000,'Full Shift'],[86400,'Day One'],[259200,'Long Weekend'],[604800,'One Week'],[1209600,'Two Weeks'],[2592000,'Employee of the Month'],[5184000,'Two Months'],[7776000,'Quarterly Review'],[15552000,'Half a Year']].forEach(([s, n], k) => A('time' + s, n, () => 'Play for ' + fmtTime(s), () => S.stats.play >= s, 5 + k * 5));
[10,25,50,100,150,200].forEach((n, k) => A('upg' + n, 'Upgraded ' + n, () => 'Own ' + n + ' upgrades at once', () => Object.keys(S.up).length >= n, 5 + k * 5));
[100,1000,1e4,1e5].forEach((n, k) => A('gold' + n, 'Gold Hoarder ' + fmt(n), () => 'Earn ' + fmt(n) + ' gold bars in total', () => S.goldTotal >= n, 10 + k * 10));
[1,10,50,100,200,300,400,SKILL_MAX].forEach((n, k) => A('skill' + n, n === SKILL_MAX ? 'Master of Everything' : 'Skilled ' + n, () => 'Spend ' + n + ' skill points', () => skillSpent() >= n, 5 + k * 6));
[10,50,100,250,500,1000,2500,5000,10000].forEach((n, k) => A('emp' + n, 'Headcount ' + fmt(n), () => 'Have ' + fmt(n) + ' staff at once', () => S.stats.maxEmp >= n, 5 + k * 4));
// decor
const ownedTypes = () => FURN.filter(d => d.cat !== 'ceo' && fOwned(d.id) > 0).length;
[1,10,25,50,75,FURN.length - 1].forEach((n, k) => A('ftype' + n, n === FURN.length - 1 ? 'Owns One of Everything' : 'Furnished ' + n, () => 'Own ' + n + ' different kinds of furniture', () => ownedTypes() >= n, 5 + k * 8));
[10,25,50,100,150].forEach((n, k) => A('placed' + n, 'Interior Decorator ' + n, () => 'Place ' + n + ' pieces in one office', () => S.stats.placedMax >= n, 5 + k * 8));
[25,100,1e3,1e4,1e5,1e6].forEach((n, k) => A('style' + n, 'Style Score ' + fmt(n), () => 'Reach a style score of ' + fmt(n), () => S.stats.styleMax >= n, 5 + k * 8));
[5,10,25,50,100].forEach((n, k) => A('syn' + n, 'Synergy ' + n, () => 'Have ' + n + ' furniture synergies active at once', () => S.stats.synMax >= n, 5 + k * 8));
A('perfect', 'Perfect Office', () => 'Get all four needs to 100% or more at once', () => S.stats.perfect, 30);
[5,10,25].forEach((n, k) => A('flv' + n, 'Upholstered ' + n, () => 'Upgrade any furniture to level ' + n, () => Object.values(S.decor.lv).some(v => v >= n), 10 + k * 15));
[5,10,20].forEach((n, k) => A('set' + n, 'Matching Set ' + n, () => 'Place ' + n + ' pieces of one furniture set in an office', () => DEC && Object.values(DEC.sets).some(v => v >= n), 10 + k * 12));
[['spooky','Spooky Season'],['festive','Festive Spirit'],['love','Sweetheart'],['summer','Summer Vibes']].forEach(([s, n]) => A('season_' + s, n, () => 'Own a piece of ' + SET_NAMES[s] + ' furniture', () => FURN.some(d => d.set === s && fOwned(d.id) > 0), 15));
// talent
[1,10,25,50,100].forEach((n, k) => A('tal' + n, 'Recruiter ' + n, () => 'Hire ' + n + ' talent', () => S.stats.talents >= n, 5 + k * 8));
TRAR.forEach((r, k) => A('trar' + k, 'Hired a ' + r.n, () => 'Hire a ' + r.n + ' talent', () => S.talent.roster.some(t => t.r >= k) || (k === 0 && S.stats.talents > 0), 5 + k * 10));
[10,25,50].forEach((n, k) => A('tlv' + n, 'Mentor Level ' + n, () => 'Train a talent to level ' + n, () => S.talent.roster.some(t => t.lv >= n), 10 + k * 15));
[3,8,15,25].forEach((n, k) => A('heads' + n, 'Org Chart ' + n, () => 'Have ' + n + ' department heads', () => TAL && TAL.heads >= n, 10 + k * 12));
// market
[1,10,100,1000,5000].forEach((n, k) => A('trade' + n, 'Trader ' + n, () => 'Make ' + n + ' stock trades', () => S.market.trades >= n, 5 + k * 6));
for (let e = 3; e <= 63; e += 6){ const x = Math.pow(10, e); A('profit' + e, 'Market Profit 1e' + e, () => 'Make ' + money(x) + ' total profit on the market', () => S.market.profit >= x, 5 + Math.floor(e / 4)); }
A('double', 'Doubled Up', () => 'Make 100% profit on a single trade', () => S.market.bestTrade >= 1, 25);
// inbox, rivals, trash, games, weather, time
[1,10,50,200,500].forEach((n, k) => A('dec' + n, 'Decision Maker ' + n, () => 'Answer ' + n + ' inbox decisions', () => S.inbox.decisions >= n, 5 + k * 6));
[5,10,STORY.length].forEach((n, k) => A('story' + n, n === STORY.length ? 'The Whole Story' : 'Pen Pal ' + n, () => 'Receive ' + n + ' story emails', () => Object.keys(S.inbox.story).length >= n, 10 + k * 15));
RIVALS.forEach(r => A('rival' + r.i, 'Beat ' + r.name, () => 'Earn more in total than ' + r.name, () => !!S.rivals.beat[r.i], 10 + r.i * 6));
[10,100,1000,10000].forEach((n, k) => A('clean' + n, 'Tidy ' + fmt(n), () => 'Pick up ' + fmt(n) + ' pieces of trash', () => S.stats.cleaned >= n, 5 + k * 8));
A('toss5', 'Nothing But Bin', () => 'Land all 5 throws in Paper Toss', () => S.stats.tossPerfect >= 1, 25);
A('zero30', 'Inbox Zero Hero', () => 'Score 30 in Inbox Zero', () => S.stats.zeroBest >= 30, 25);
A('jackpot', 'Jackpot!', () => 'Hit 7-7-7 on the vending machine', () => S.stats.jackpots >= 1, 50);
[10,100,1000].forEach((n, k) => A('spin' + n, 'Snack Gambler ' + n, () => 'Spin the vending machine ' + n + ' times', () => S.stats.spins >= n, 5 + k * 10));
[10,100,500].forEach((n, k) => A('games' + n, 'Break Time ' + n, () => 'Play ' + n + ' Break Room games', () => S.stats.games >= n, 5 + k * 10));
A('storm', 'Storm Chaser', () => 'Work through a thunderstorm', () => S.stats.storms >= 1, 10);
A('snow', 'Snow Day', () => 'Work through a snowfall', () => S.stats.snows >= 1, 10);
A('night', 'Graveyard Shift', () => 'Play between midnight and 4 AM', () => S.stats.nightPlay >= 1, 15);
// specials
A('fire1', "You're Fired!", () => 'Fire someone', () => S.stats.fires >= 1, 5);
A('fire100', 'Hatchet Job', () => 'Fire 100 people', () => S.stats.fires >= 100, 15);
A('bulk', 'Hiring Spree', () => 'Hire 100 staff in one click', () => S.stats.bulk >= 100, 15);
A('bigsale', 'Overachiever', () => 'Sell the company for 100× the asking price', () => S.stats.bigSale, 25);
A('pet', 'Good Boy', () => 'Pet an office pet', () => S.stats.pets >= 1, 10);
A('pet100', 'Pet Whisperer', () => 'Pet office pets 100 times', () => S.stats.pets >= 100, 25);
A('streak7', 'Regular', () => 'Log in 7 days in a row', () => S.daily.streak >= 7, 25);
A('streak30', 'Lifer', () => 'Log in 30 days in a row', () => S.daily.streak >= 30, 100);
A('allup', 'Every Upgrade', () => 'Own all ' + UPGRADES.length + ' upgrades at once', () => Object.keys(S.up).length >= UPGRADES.length, 200);
A('multiverse', 'Endgame', () => 'Move into The Multiverse Lobby', () => S.stats.maxOffice >= 19, 250);
function checkAchievements(){
  let n = 0;
  if (M.dec){ S.stats.styleMax = Math.max(S.stats.styleMax, M.dec.style); if (NEEDS.every(([k]) => M.dec.sat[k] >= 1)) S.stats.perfect = true; }
  if (DEC) S.stats.synMax = Math.max(S.stats.synMax, DEC.synTotal);
  const h = new Date().getHours(); if (h < 4) S.stats.nightPlay = 1;
  for (const a of ACH){
    if (S.ach[a.id]) continue;
    let ok = false; try { ok = a.check(); } catch(e){}
    if (ok){ S.ach[a.id] = 1; n++; const g = addGold(a.gold, true); if (n <= 3) toast('ACHIEVEMENT: ' + a.name + ' (+' + g + ' gold)', 'ach'); }
  }
  if (n > 3) toast('+' + (n - 3) + ' more achievements', 'ach');
  if (n){ achN = Object.keys(S.ach).length; recalc(); dirty.awards = true; }
}
