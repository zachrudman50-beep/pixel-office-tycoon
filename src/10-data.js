const W = 384, H = 224, TS = 16, FY = 48, COLS = 24, ROWS = 11;
const SAVE_KEY = 'pixel-office-tycoon-v3', OLD_KEY = 'pixel-office-tycoon-v2';
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const $ = id => document.getElementById(id);
let S, M = {};

/* ================= NUMBERS ================= */
const SUF = ['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','UDc','DDc','TDc','QaDc','QiDc','SxDc','SpDc','OcDc','NoDc','Vg'];
function fmt(n){
  if (n == null || isNaN(n)) return '0';
  if (!isFinite(n)) return '∞';
  if (n < 0) return '-' + fmt(-n);
  if (n < 1000) return (n < 100 && n % 1 !== 0) ? String(Math.round(n * 10) / 10) : String(Math.floor(n));
  const e = Math.floor(Math.log10(n) / 3);
  if (!(S && S.opt && S.opt.sci) && e < SUF.length){
    const v = n / Math.pow(1000, e);
    return (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : String(Math.floor(v))) + SUF[e];
  }
  const ex = Math.floor(Math.log10(n));
  return (n / Math.pow(10, ex)).toFixed(2) + 'e' + ex;
}
const money = n => '$' + fmt(n);
const xf = v => v < 1000 ? (v < 10 ? v.toFixed(2) : v.toFixed(1)) : fmt(v);
const pct = v => { const p = v * 100; return (p >= 100 ? fmt(p) : (Math.round(p * 10) / 10)) + '%'; };
function fmtTime(s){
  s = Math.max(0, Math.ceil(s));
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  if (d) return d + 'd ' + h + 'h'; if (h) return h + 'h ' + m + 'm'; if (m) return m + 'm ' + x + 's'; return x + 's';
}
function hash(str){ let h = 2166136261; for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function wpick(list, wf){ let r = Math.random() * list.reduce((a, x) => a + wf(x), 0); for (const x of list){ r -= wf(x); if (r <= 0) return x; } return list[list.length - 1]; }
const esc = s => String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));

/* ================= STAFF / OFFICES ================= */
const STAFF = [
  ['intern','Intern','Fetches coffee. Mostly.',15,0.5,{shirt:'#e8c84a'},{}],
  ['dev','Junior Dev','Ships features and bugs at scale.',120,4,{shirt:'#4f7fd1'},{}],
  ['acct','Accountant','Finds money in the couch cushions.',1300,20,{shirt:'#ecebe4',tie:'#b03a3a'},{}],
  ['design','Designer','Makes the logo bigger.',14000,100,{shirt:'#d46a9f'},{}],
  ['sales','Sales Rep','Always be closing.',1.6e5,550,{shirt:'#e07a35'},{}],
  ['mgr','Manager','Books the meeting about meetings.',2e6,3000,{shirt:'#47664c',tie:'#e8c84a'},{}],
  ['exec','Senior Exec','Golfs all week. Somehow profitable.',3e7,18000,{shirt:'#33333f',tie:'#c23b3b'},{}],
  ['lawyer','Lawyer','Bills you for reading this.',5e8,1.1e5,{shirt:'#2d3a5c',tie:'#9aa3b5'},{r:1}],
  ['data','Data Scientist','Turns spreadsheets into prophecy.',8e9,7e5,{shirt:'#3c8f8f'},{r:2}],
  ['guru','Marketing Guru','Two million followers. Mostly bots.',1.5e11,4.5e6,{shirt:'#e0d24a',shades:true},{r:3}],
  ['vp','VP of Synergy','Nobody knows what they do. Profits rise.',3e12,3e7,{shirt:'#7a3d8f',tie:'#efb341'},{r:5}],
  ['robot','AI Robot','Never takes lunch. Never sleeps.',7e13,2e8,{shirt:'#a3acb6',robot:true},{r:7}],
  ['hacker','Hacker','Types fast in a dark hoodie.',2e15,1.4e9,{shirt:'#1e2a22',shades:true,hair:'#1a1a1a'},{r:10}],
  ['board','Board Member','Votes yes on everything.',6e16,1e10,{shirt:'#4a2a2a',tie:'#d9d0c0',hair:'#d9d0c0'},{r:13}],
  ['wizard','Hedge Fund Wizard','Literally a wizard. Pays well.',2e18,7.5e10,{shirt:'#3b3ba8',hat:'#3b3ba8'},{r:16}],
  ['clone','CEO Clone','You, but more of you.',8e19,6e11,{shirt:'#17171f',tie:'#efb341',shades:true,hair:'#2b1d14'},{i:1}],
  ['timetrav','Time Traveler','Shows up to meetings yesterday.',4e21,5e12,{shirt:'#b8c4d0',tie:'#5ef0e6'},{i:1,r:25}],
  ['quantum','Quantum Analyst','Both hired and not hired.',2e23,4e13,{shirt:'#2a6f9e',glow:'#8fe0ff'},{i:2}],
  ['cyborg','Cyborg Exec','Half human. Half quarterly report.',1.2e25,3.5e14,{shirt:'#55606b',robot:true,tie:'#ff5a4a'},{i:3}],
  ['alien','Alien Consultant','Charges by the light-year.',8e26,3e15,{shirt:'#6b3fa0',skin:'#8fd16a'},{i:5}],
  ['miner','Moon Miner','Digs up cheese and profit.',6e28,2.8e16,{shirt:'#c9a24a',helmet:true},{m:1}],
  ['broker','Galaxy Broker','Trades planets before breakfast.',5e30,2.6e17,{shirt:'#1f3b6b',tie:'#efb341',skin:'#9fb7ff'},{m:1,i:10}],
  ['hopper','Dimension Hopper','Commutes from another reality.',4.5e32,2.5e18,{shirt:'#e05ab0',glow:'#ffd0f0'},{m:2}],
  ['cosmic','Cosmic Entity','An HR nightmare made of pure light.',5e34,2.5e19,{shirt:'#ffffff',skin:'#ffe9a0',glow:'#fff7c0'},{m:3}],
  ['algo','The Algorithm','It decided you should be rich.',6e36,2.5e20,{shirt:'#0b0b1a',robot:true,skin:'#2a2d33',tie:'#4fbf78'},{m:5}],
].map(([id,name,desc,base,rate,look,req],tier) => Object.assign({id,name,desc,base,rate,req,tier}, look));
const STAFF_BY = Object.fromEntries(STAFF.map(s => [s.id, s]));

const OFFICE_SIZE = [[12,7],[14,8],[16,8],[18,9],[20,9],[22,10]];
const OFFICES = [
  ["Mom's Garage",0,1,15,{},'Smells like motor oil and ambition.',{wall:'#857463',trim:'#5e5145',floor:'#5f5952',floor2:'#544e47',style:'concrete',win:'garage'}],
  ['Strip Mall Suite',25e3,1.5,40,{},'Between a nail salon and a vape shop.',{wall:'#cdbb8e',trim:'#8f7d55',floor:'#6d7b8a',floor2:'#62707e',style:'carpet',win:'parking'}],
  ['Business Park',1.5e6,2,75,{r:1},'Real cubicles. A ping-pong table.',{wall:'#b6c6c4',trim:'#6f8583',floor:'#4f6a6f',floor2:'#466064',style:'carpet',win:'trees'}],
  ['Downtown Floor',8e7,3,125,{r:2},'A whole floor with a city view.',{wall:'#d8d0bf',trim:'#8d7f66',floor:'#8a6342',floor2:'#7a5839',style:'plank',win:'city'}],
  ['Tech Campus',4e9,4,175,{r:3},'Nap pods, slides and free kombucha.',{wall:'#e8e4d8',trim:'#4f9e52',floor:'#c9b48a',floor2:'#bba57a',style:'plank',win:'campus'}],
  ['Glass Tower',3e11,6,250,{r:5},'Floor-to-ceiling windows. Nowhere to nap.',{wall:'#9ab7c4',trim:'#5b7886',floor:'#3f4a5d',floor2:'#384253',style:'tile',win:'clouds'}],
  ['Skyscraper HQ',4e13,9,350,{r:8},'Above the clouds. Your name on the roof.',{wall:'#323850',trim:'#20253a',floor:'#cfc6b8',floor2:'#bfb5a5',style:'tile',win:'sunset'}],
  ['Island Resort HQ',8e15,13,450,{r:12},'Meetings are held in the pool.',{wall:'#f0e2c0',trim:'#3fa3a0',floor:'#e6d3a3',floor2:'#d9c391',style:'sand',win:'beach'}],
  ['Arctic Data Center',2e18,18,600,{r:16},'Free cooling. Bring a coat.',{wall:'#dfe9f0',trim:'#7f9fb5',floor:'#c4d4e0',floor2:'#b5c7d5',style:'tile',win:'arctic'}],
  ['Desert Megaplex',8e20,25,800,{i:1},'A pyramid with a parking garage.',{wall:'#d9b77a',trim:'#a3763d',floor:'#c99f5f',floor2:'#bb9052',style:'sand',win:'desert'}],
  ['Underwater Dome',5e23,35,1000,{i:2},'The fish are on the payroll.',{wall:'#2f5f7a',trim:'#1d3d52',floor:'#8a9aa0',floor2:'#7d8d93',style:'metal',win:'ocean'}],
  ['Volcano Lair',4e26,50,1300,{i:3},'Every evil exec needs a lair.',{wall:'#3a2a2a',trim:'#1f1515',floor:'#4a3a36',floor2:'#3f302c',style:'rock',win:'volcano'}],
  ['Sky Fortress',5e29,70,1600,{i:5},'Floats above the tax code.',{wall:'#e8e2f0',trim:'#9a8ab8',floor:'#d0c8e0',floor2:'#c2b9d5',style:'tile',win:'sky'}],
  ['Orbital Station',8e32,100,2000,{m:1},'Zero-gravity water cooler talk.',{wall:'#c9ced6',trim:'#6a7380',floor:'#8f97a3',floor2:'#838b97',style:'metal',win:'orbit'}],
  ['Moon Campus',2e36,140,2500,{m:1},'Low gravity. High margins.',{wall:'#3b3654',trim:'#262238',floor:'#9b9aa8',floor2:'#8a8997',style:'moon',win:'moon'}],
  ['Mars Colony',6e39,200,3000,{m:2},'The commute is seven months.',{wall:'#c9b8a8',trim:'#8a4a32',floor:'#b5603a',floor2:'#a55533',style:'mars',win:'mars'}],
  ['Jupiter Cloud City',3e43,280,3600,{m:3},'Storm season lasts 300 years.',{wall:'#e8d8c0',trim:'#b5764a',floor:'#d9b890',floor2:'#cdaa80',style:'tile',win:'jupiter'}],
  ['Dyson Sphere Office',2e47,400,4300,{m:5},'Solar powered. Very solar powered.',{wall:'#2a2420',trim:'#efb341',floor:'#4a3f30',floor2:'#3f3528',style:'metal',win:'dyson'}],
  ['Galactic Core Tower',2e51,560,5000,{m:7},'Rent is a black hole.',{wall:'#1d1530',trim:'#7d5bd0',floor:'#2e2448',floor2:'#271e3e',style:'tile',win:'galaxy'}],
  ['The Multiverse Lobby',3e55,800,6000,{m:10},'Every version of you works here.',{wall:'#141418',trim:'#e05ab0',floor:'#202028',floor2:'#1a1a22',style:'void',win:'multiverse'}],
].map(([name,cost,mult,seats,req,desc,th],i) => ({name,cost,mult,seats,req,desc,th,i,size:OFFICE_SIZE[i] || [24,11]}));
const SPACE_SKY = new Set(['orbit','moon','mars','jupiter','dyson','galaxy','multiverse']);
const WIN_COLS = [[2,5],[10,13],[18,21]];

/* ================= UPGRADES ================= */
const UPGRADES = [];
const ROLE_UP = [[10,2,'Free Snacks',20],[25,2,'Better Gear',200],[50,3,'Stock Options',3e3],[100,3,'Corner Offices',6e5],[200,5,'Legendary Status',1e10],[300,5,'Hall of Fame',1e16]];
STAFF.forEach(s => ROLE_UP.forEach(([need,x,nm,cm],k) => UPGRADES.push({id:s.id + '_' + k, name:s.name + ': ' + nm, kind:'role', role:s.id, need, val:x, cost:s.base * cm, req:s.req, desc:() => s.name + 's earn ×' + x + '.'})));
function addUps(kind, names, costFn, valFn, descFn, reqFn){
  names.forEach((n, k) => UPGRADES.push({id:kind + k, name:n, kind, val:valFn(k), cost:costFn(k), req:reqFn ? reqFn(k) : {}, desc:() => descFn(valFn(k))}));
}
addUps('click',['Coffee Machine','Mechanical Keyboard','Espresso Bar','Gaming Mouse','Energy Drinks','Caffeine IV Drip','Ergonomic Wrist Rest','Neural Keyboard','Telepathic Typing','Time-Stop Clicking','Finger of Midas','Click of the Gods'],
  k => 100 * Math.pow(150, k), k => k % 2 ? 3 : 2, v => 'Your clicks earn ×' + v + '.');
addUps('all',['Open Plan Office','Team Building','Four-Day Week','Free Lunch','Unlimited PTO','Company Jet','Offshore Account','Lobbyists','Monopoly','Market Manipulation','Global Franchise','Planetary Brand','Interstellar Logistics','Galactic Patent','Reality Patent'],
  k => 4e8 * Math.pow(10, 3.5 * k), k => k % 2 ? 2 : 1.5, v => 'All income ×' + v + '.', k => k >= 12 ? {m:1} : k >= 9 ? {i:1} : {});
addUps('xp',['Mentorship Program','Online Courses','Mesh Wi-Fi','Conference Tickets','MBA Sponsorship','Brain Training','Hivemind Wiki','Akashic Records'], k => 2e4 * Math.pow(1e4, k), () => 1.5, v => 'All XP gain ×' + v + '.');
addUps('hustle',['Hustle Culture','Grindset','Main Character Energy'], k => [2.5e7,1e15,1e25][k], k => [0.02,0.03,0.05][k], v => 'Each click also earns ' + (v * 100) + '% of your income per second.');
addUps('case',['Lost & Found Box','Metal Detector','Treasure Map','Golden Radar','Midas Vault'], k => 5e4 * Math.pow(1e6, k), () => 2, v => 'Office event rewards ×' + v + '.');
addUps('seats',['Bunk Desks','Hammock Rows','Stacked Cubicles','Pocket Dimension Closets'], k => [1e6,1e14,1e24,1e36][k], () => 0.1, () => '+10% seats in every office.');
addUps('cost',['Bulk Hiring Deals','Recruitment Agency','Headhunter Network'], k => [5e5,1e13,1e23][k], () => 0.9, v => 'Staff cost ×' + v + '.');
addUps('decor',['Interior Design Course','Feng Shui Consultant','Architectural Digest Feature','Reality-Bending Decor'], k => [3e5,1e12,1e22,1e34][k], () => 1.25, v => 'All furniture stats ×' + v + '.');
const UP_BY = Object.fromEntries(UPGRADES.map(u => [u.id, u]));

/* ================= PRESTIGE SHOPS ================= */
const SHARE_SHOP = [
  {id:'investor',name:'Investor Relations',max:Infinity,base:5,g:1.45,eff:l => 'All income ×' + xf(Math.pow(1.12, l))},
  {id:'seed',name:'Seed Capital',max:25,base:3,g:2,eff:l => 'Start each run with ' + money(seedCash(l))},
  {id:'army',name:'Intern Army',max:20,base:25,g:1.7,eff:l => 'Start each run with ' + (l * 5) + ' free Interns'},
  {id:'work',name:'Workaholic',max:50,base:2,g:1.5,eff:l => 'Clicks ×' + xf(1 + 0.5 * l)},
  {id:'learn',name:'Fast Learner',max:50,base:4,g:1.5,eff:l => 'XP ×' + xf(1 + 0.1 * l)},
  {id:'desk',name:'Hot Desking',max:30,base:8,g:1.6,eff:l => '+' + (l * 10) + '% seats in every office'},
  {id:'recruit',name:'Recruiter',max:25,base:6,g:1.55,eff:l => 'Staff cost ×' + Math.pow(0.98, l).toFixed(3)},
  {id:'radar',name:'Event Radar',max:20,base:10,g:1.6,eff:l => 'Office events appear ' + (l * 5) + '% more often'},
  {id:'parachute',name:'Golden Parachute',max:100,base:15,g:1.35,eff:l => 'Shares from sales ×' + xf(1 + 0.05 * l)},
  {id:'overtime',name:'Overtime Pay',max:10,base:20,g:1.8,eff:l => 'Offline earnings at ' + (50 + 5 * l) + '%'},
  {id:'weekend',name:'Long Weekend',max:22,base:12,g:1.5,eff:l => 'Offline cap +' + l + 'h'},
  {id:'insider',name:'Insider Trading',max:50,base:50,g:1.4,eff:l => 'Rebirth multiplier base +' + (0.01 * l).toFixed(2)},
  {id:'stylist',name:'House Stylist',max:30,base:10,g:1.55,eff:l => 'Furniture stats +' + (l * 5) + '%'},
  {id:'autohire',name:'Auto-Hire Bot',max:1,base:40,g:1,eff:l => l ? 'Unlocked. Switch it on in More.' : 'Hires the best-value staff for you'},
  {id:'autoup',name:'Auto-Upgrader',max:1,base:150,g:1,eff:l => l ? 'Unlocked. Switch it on in More.' : 'Buys affordable upgrades for you'},
  {id:'automove',name:'Auto-Mover',max:1,base:400,g:1,eff:l => l ? 'Unlocked. Switch it on in More.' : 'Moves to bigger offices for you'},
];
const STOCK_SHOP = [
  {id:'bluechip',name:'Blue Chip Status',max:Infinity,base:1,g:1.6,eff:l => 'All income ×' + xf(Math.pow(2, l))},
  {id:'sharemult',name:'Share Split',max:25,base:2,g:1.7,eff:l => 'Shares ×' + xf(Math.pow(1.5, l))},
  {id:'rbase',name:'Activist Investors',max:10,base:3,g:2,eff:l => 'Rebirth multiplier base +' + (0.05 * l).toFixed(2)},
  {id:'lab',name:'Lab Expansion',max:2,base:5,g:4,eff:l => '+' + l + ' research slot' + (l === 1 ? '' : 's')},
  {id:'rspeed',name:'Research Grants',max:20,base:2,g:1.5,eff:l => 'Research ' + (l * 10) + '% faster'},
  {id:'gold',name:'Gold Reserves',max:20,base:2,g:1.5,eff:l => 'Gold bars +' + (l * 10) + '%'},
  {id:'startreb',name:'Head Start',max:10,base:4,g:1.8,eff:l => 'Begin each IPO cycle with ' + (l * 2) + ' sales done'},
  {id:'keepup',name:'Institutional Memory',max:1,base:8,g:1,eff:l => l ? 'Upgrades stay when you sell' : 'Keep upgrades when you sell'},
  {id:'keepoff',name:'Long Lease',max:1,base:15,g:1,eff:l => l ? 'Your office stays when you sell' : 'Keep your office when you sell'},
  {id:'autosell',name:'Auto-Seller',max:1,base:5,g:1,eff:l => l ? 'Unlocked. Switch it on in More.' : 'Sells the company for you'},
  {id:'xpboost',name:'Executive Coaching',max:20,base:2,g:1.6,eff:l => 'XP ×' + xf(Math.pow(1.5, l))},
  {id:'luck',name:'Crate Insurance',max:10,base:5,g:1.8,eff:l => 'Crate luck +' + (l * 5) + '%'},
  {id:'offline2',name:'Night Shift',max:10,base:3,g:1.7,eff:l => 'Offline cap +' + (l * 2) + 'h'},
  {id:'roster',name:'Talent Agency',max:10,base:3,g:1.6,eff:l => '+' + (l * 3) + ' talent roster slots'},
];
const MERGE_SHOP = [
  {id:'galactic',name:'Galactic Monopoly',max:Infinity,base:1,g:1.8,eff:l => 'All income ×' + xf(Math.pow(10, l))},
  {id:'stockmult',name:'Hostile Takeovers',max:15,base:1,g:1.8,eff:l => 'Stock ×' + xf(Math.pow(2, l))},
  {id:'lab2',name:'Interstellar Labs',max:2,base:3,g:3,eff:l => '+' + l + ' research slot' + (l === 1 ? '' : 's')},
  {id:'keepshares',name:'Trust Fund',max:1,base:4,g:1,eff:l => l ? 'Share Shop levels stay on IPO and merger' : 'Keep Share Shop levels on IPO and merger'},
  {id:'autoipo',name:'Auto-IPO',max:1,base:3,g:1,eff:l => l ? 'Unlocked. Switch it on in More.' : 'Goes public for you when ready'},
  {id:'timedil',name:'Time Dilation',max:5,base:2,g:2,eff:l => 'Offline earnings +' + (l * 10) + '% and cap +' + (l * 12) + 'h'},
  {id:'cosmicluck',name:'Cosmic Luck',max:5,base:3,g:2,eff:l => 'Crate and talent luck +' + (l * 10) + '%'},
  {id:'cosmicxp',name:'Universal Wisdom',max:10,base:1,g:1.7,eff:l => 'XP ×' + xf(Math.pow(3, l))},
  {id:'startipo',name:'Shell Companies',max:5,base:4,g:2,eff:l => 'Begin each merger cycle with ' + l + ' IPOs done'},
  {id:'goldm',name:'Asteroid Gold',max:10,base:2,g:1.6,eff:l => 'Gold bars +' + (l * 25) + '%'},
  {id:'cosmicdecor',name:'Cosmic Interior',max:10,base:2,g:1.8,eff:l => 'Furniture stats ×' + xf(Math.pow(1.5, l))},
];
const SKILLS = [
  {id:'boss',name:'Boss Energy',max:50,eff:r => 'Income +' + (r * 3) + '%'},
  {id:'hustler',name:'Hustler',max:50,eff:r => 'Clicks +' + (r * 10) + '%'},
  {id:'reader',name:'Speed Reader',max:40,eff:r => 'XP +' + (r * 4) + '%'},
  {id:'negot',name:'Negotiator',max:30,eff:r => 'Staff ' + r + '% cheaper'},
  {id:'lucky',name:'Lucky Find',max:30,eff:r => 'Office event rewards +' + (r * 10) + '%'},
  {id:'dealer',name:'Deal Maker',max:50,eff:r => 'Shares +' + (r * 3) + '%'},
  {id:'mad',name:'Mad Scientist',max:40,eff:r => 'Research ' + (r * 2) + '% faster'},
  {id:'owl',name:'Night Owl',max:20,eff:r => 'Offline cap +' + (r * 0.5) + 'h'},
  {id:'contract',name:'Contract Pro',max:30,eff:r => 'Contract rewards +' + (r * 5) + '%'},
  {id:'treasure',name:'Treasure Hunter',max:40,eff:r => 'Gold bars +' + (r * 2) + '%'},
  {id:'collector',name:'Collector',max:30,eff:r => 'Crate luck +' + r + '%'},
  {id:'synergy',name:'Synergy',max:20,eff:r => '+' + (r * 0.2).toFixed(1) + '% income per 100 staff'},
  {id:'multi',name:'Multitasker',max:25,eff:r => (r * 0.2).toFixed(1) + ' auto-clicks per second'},
  {id:'bigshot',name:'Big Shot',max:20,eff:r => '+' + (r * 2) + '% income per office tier'},
  {id:'interior',name:'Interior Designer',max:40,eff:r => 'Furniture stats +' + (r * 4) + '%'},
  {id:'scout',name:'Talent Scout',max:25,eff:r => 'Talent luck +' + (r * 2) + '%'},
  {id:'trader',name:'Day Trader',max:20,eff:r => 'Market profits +' + (r * 2) + '%, fees −' + (r * 0.1).toFixed(1) + '%'},
  {id:'neat',name:'Neat Freak',max:20,eff:r => 'Trash appears ' + (r * 3) + '% less often'},
];
const SKILL_MAX = SKILLS.reduce((a, s) => a + s.max, 0);

/* ================= RESEARCH (25 x 4 = 100) ================= */
const RNAMES = [['Spreadsheet Macros','inc'],['Cloud Storage','offline'],['Ergonomic Studies','seats'],['Coffee Chemistry','click'],['Email Filters','xp'],['Remote Work','offrate'],['Open Source','cost'],['Big Data','inc'],['Machine Learning','auto'],['Blockchain Ledger','shares'],['Quantum Payroll','inc'],['Nano Paperclips','gold'],['Neural Interfaces','xp'],['Fusion Coffee','click'],['Teleconferencing','freq'],['Gene-Edited Interns','low'],['Time Zone Arbitrage','rspeed'],['Antigravity Chairs','seats'],['Dark Matter Mining','luck'],['Warp Logistics','inc'],['Feng Shui','decor'],['Talent Analytics','talent'],['Algorithmic Trading','trade'],['Self-Cleaning Floors','clean'],['Circadian Lighting','night']];
const RVALS = {inc:[1.5,2,3,5],click:[2,3,5,10],xp:[1.25,1.5,2,3],offline:[1,2,4,8],offrate:[0.05,0.05,0.1,0.1],seats:[0.05,0.1,0.15,0.2],cost:[0.97,0.95,0.92,0.9],auto:[1,2,4,8],shares:[1.25,1.5,2,3],gold:[0.05,0.1,0.15,0.25],freq:[0.05,0.1,0.1,0.15],low:[3,5,10,25],rspeed:[0.05,0.1,0.15,0.2],luck:[0.02,0.04,0.06,0.1],decor:[1.1,1.2,1.35,1.5],talent:[1.1,1.25,1.5,2],trade:[0.02,0.04,0.06,0.1],clean:[0.1,0.15,0.2,0.25],night:[0.1,0.2,0.3,0.4]};
const RDESC = {inc:v => 'All income ×' + v, click:v => 'Clicks ×' + v, xp:v => 'XP ×' + v, offline:v => 'Offline cap +' + v + 'h', offrate:v => 'Offline earnings +' + (v * 100) + '%', seats:v => '+' + (v * 100) + '% seats', cost:v => 'Staff cost ×' + v, auto:v => '+' + v + ' auto-clicks per second', shares:v => 'Shares ×' + v, gold:v => 'Gold bars +' + (v * 100) + '%', freq:v => 'Office events ' + (v * 100) + '% more often', low:v => 'First 7 staff roles earn ×' + v, rspeed:v => 'Research ' + (v * 100) + '% faster', luck:v => 'Crate luck +' + (v * 100) + '%', decor:v => 'Furniture stats ×' + v, talent:v => 'Talent department power ×' + v, trade:v => 'Market profits +' + (v * 100) + '%', clean:v => 'Trash appears ' + (v * 100) + '% less often', night:v => 'Night focus penalty −' + (v * 100) + '%'};
const TIERN = ['I','II','III','IV'], TIER_REQ = [{r:1},{r:5},{i:1},{m:1}];
const RESEARCH = [];
for (let t = 0; t < 4; t++) RNAMES.forEach(([name, type], j) => {
  const idx = t * 25 + j;
  RESEARCH.push({id:'r' + idx, name:name + ' ' + TIERN[t], type, val:RVALS[type][t], tier:t, dur:Math.round(60 * Math.pow(1.13, idx * 0.8)), req:TIER_REQ[t], prev:t ? 'r' + (idx - 25) : null});
});
const RES_BY = Object.fromEntries(RESEARCH.map(r => [r.id, r]));

/* ================= COLLECTIBLES ================= */
const RAR = [
  {n:'Common',c:'#b9b3a0',max:20,f:1},{n:'Uncommon',c:'#5fbf6a',max:15,f:1.6},{n:'Rare',c:'#4f8fe0',max:12,f:2.5},
  {n:'Epic',c:'#a35fe0',max:10,f:4},{n:'Legendary',c:'#efb341',max:8,f:7},{n:'Mythic',c:'#ff5a7a',max:5,f:12}];
const ITEM_LIST = [
  ['Sticky Notes',0],['Red Stapler',0],['Desk Plant',0],['Coffee Mug',0],['Rubber Duck',0],['Paperclip Chain',0],['Desk Fan',0],['Wall Calendar',0],['Stress Ball',0],['Mouse Pad',0],['Pen Cup',0],['Snack Drawer',0],['Whiteboard Marker',0],['Desk Lamp',0],['Swivel Chair',0],['Water Bottle',0],['Lanyard',0],['Tiny Cactus',0],
  ['Bobblehead',1],['Mini Fridge Magnet',1],['Lava Lamp',1],['Motivational Poster',1],['Fish Tank',1],['Standing Mat',1],['Neon Sign',1],['Bean Bag',1],['Office Cat',1,'cat'],['Record Player',1],['Arcade Token',1],['Bonsai Tree',1],['Massage Ball',1],['Office Dog',1,'dog'],['Espresso Cup',1],
  ['Golden Stapler',2],['Signed Baseball',2],['Crystal Ball',2],['Vintage Typewriter',2],['Gold Record',2],['Office Parrot',2,'parrot'],['Jukebox Coin',2],['Chess Set',2],['Telescope',2],['Grand Piano Key',2],['Shark Tooth',2],['Robot Butler',2],
  ['Diamond Mouse',3],['Platinum Trophy',3],['Time Machine Clock',3],['Meteorite',3],['Office Dragon',3,'dragon'],['Hologram Card',3],['Gold Bar Stack',3],['Dinosaur Tooth',3],
  ['Infinity Briefcase',4],['The First Dollar',4],['Crown of Commerce',4],['Phoenix Mascot',4,'phoenix'],['Quantum Chip',4],
  ['The Golden Ticket',5],['Pocket Universe',5],
];
const ITYPES = [['inc','income',0.02],['click','click value',0.04],['xp','XP',0.02],['shares','shares',0.015],['gold','gold bars',0.01],['rspeed','research speed',0.01],['luck','crate luck',0.005],['offline','offline cap',5],['case','event rewards',0.02]];
const ITEMS = ITEM_LIST.map(([name, r, pet], i) => { const [type, label, base] = ITYPES[i % ITYPES.length]; return {id:'it' + i, name, r, pet, type, label, per:base * RAR[r].f}; });
const ITEM_BY = Object.fromEntries(ITEMS.map(it => [it.id, it]));
const CRATES = [
  {id:'supply',name:'Supply Crate',cost:30,n:3,w:[60,26,10,3.2,0.7,0.1]},
  {id:'premium',name:'Premium Crate',cost:120,n:5,w:[30,35,22,9,3.3,0.7]},
  {id:'exec',name:'Executive Crate',cost:450,n:5,w:[0,15,42,30,10.5,2.5]},
];
const itemEffText = (it, lv) => it.type === 'offline' ? '+' + Math.round(it.per * lv) + ' min offline cap' : '+' + pct(it.per * lv) + ' ' + it.label;
const EVENTS = [
  {t:'case',w:46,name:'Briefcase of cash'},{t:'viral',w:16,name:'Viral post'},{t:'investor',w:14,name:'Angel investor'},
  {t:'rush',w:14,name:'Coffee rush'},{t:'headhunt',w:10,name:'Headhunter'},
];
