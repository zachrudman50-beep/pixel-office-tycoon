/* ================= FURNITURE =================
   stats: e energy, c comfort, f fun, o focus, s style, cl cleanliness, jan janitor bots
   layer: f floor, w wall, r rug. req = office index you must have reached. */
const FURN = [];
function F(id, name, cat, w, h, layer, stats, cost, req, set, extra){ FURN.push(Object.assign({id, name, cat, w, h, layer, stats, cost, req, set}, extra || {})); }
// desks (2x2: chair row + desk row)
F('d_fold','Folding Table','desk',2,2,'f',{o:2},50,0,'basic');
F('d_office','Office Desk','desk',2,2,'f',{o:4,s:1},500,0,'basic');
F('d_stand','Standing Desk','desk',2,2,'f',{o:6,c:1,s:2},2e4,1,'modern');
F('d_wood','Oak Desk','desk',2,2,'f',{o:8,c:2,s:4},2e6,2,'retro');
F('d_game','Gaming Desk','desk',2,2,'f',{o:12,f:4,s:4},5e8,3,'tech');
F('d_glass','Glass Desk','desk',2,2,'f',{o:18,s:10},1e12,5,'modern');
F('d_exec','Executive Desk','desk',2,2,'f',{o:28,c:5,s:20},1e16,6,'luxury');
F('d_holo','Holo Desk','desk',2,2,'f',{o:45,s:30},1e24,9,'tech',{glow:[18,'#5ef0e6']});
F('d_quantum','Quantum Workstation','desk',2,2,'f',{o:80,s:50},1e34,13,'cosmic',{glow:[20,'#c89aff']});
F('d_void','Void Desk','desk',2,2,'f',{o:140,s:90},1e46,17,'cosmic',{glow:[22,'#ff5ab0']});
// seating
F('s_chair','Spare Chair','seat',1,1,'f',{c:2},150,0,'basic');
F('s_bean','Bean Bag','seat',1,1,'f',{c:4,f:2},3e3,0,'retro');
F('s_couch','Couch','seat',2,1,'f',{c:8,s:2},5e4,1,'basic');
F('s_leather','Leather Sofa','seat',2,1,'f',{c:16,s:10},5e7,3,'luxury');
F('s_massage','Massage Chair','seat',1,1,'f',{c:26,e:5},2e11,4,'tech',{glow:[10,'#7fb7e8']});
F('s_hammock','Hammock','seat',2,1,'f',{c:40,f:10},5e15,7,'nature');
F('s_pod','Nap Pod','seat',2,1,'f',{c:70,e:20},1e22,9,'tech',{glow:[12,'#7fd0ff']});
F('s_cloud','Cloud Couch','seat',2,1,'f',{c:150,s:40},1e38,14,'cosmic');
// plants
F('p_fern','Potted Fern','plant',1,1,'f',{c:2,o:1,s:1},80,0,'nature');
F('p_cactus','Cactus','plant',1,1,'f',{c:1,o:2,s:2},600,0,'nature');
F('p_monstera','Monstera','plant',1,1,'f',{c:5,s:4},3e4,1,'nature');
F('p_bonsai','Bonsai','plant',1,1,'f',{c:8,o:6,s:8},8e6,2,'nature');
F('p_palm','Indoor Palm','plant',1,1,'f',{c:14,s:10},3e10,4,'nature');
F('p_money','Money Tree','plant',1,1,'f',{c:20,s:30},5e14,6,'luxury');
F('p_glow','Glowing Space Fern','plant',1,1,'f',{c:60,o:20,s:50},1e30,13,'cosmic',{glow:[22,'#5fffb0']});
F('p_tree','Office Oak','plant',2,2,'f',{c:120,o:30,s:80},1e42,16,'nature');
// lights
F('l_floor','Floor Lamp','light',1,1,'f',{o:3,s:1},300,0,'basic',{glow:[46,'#ffd98a']});
F('l_lava','Lava Lamp','light',1,1,'f',{f:3,s:4},2e4,1,'retro',{glow:[30,'#ff7ab0']});
F('l_arc','Arc Lamp','light',1,1,'f',{o:10,s:8},3e9,3,'modern',{glow:[56,'#fff0c0']});
F('l_holo','Hologram Light','light',1,1,'f',{o:30,f:5,s:25},1e20,8,'tech',{glow:[60,'#5ef0e6']});
F('l_star','Captured Star','light',1,1,'f',{o:100,s:100},1e40,15,'cosmic',{glow:[80,'#fff7a0']});
F('l_neon','Neon Sign','light',2,1,'w',{f:4,s:10},5e6,2,'retro',{glow:[34,'#ff5ab0']});
F('l_chand','Chandelier','light',2,1,'w',{s:40,c:5},1e17,7,'luxury',{glow:[60,'#ffe9b0']});
// energy
F('e_cooler','Water Cooler','energy',1,1,'f',{e:3},200,0,'basic');
F('e_coffee','Coffee Maker','energy',1,1,'f',{e:6},2e3,0,'basic');
F('e_vend','Vending Machine','energy',1,1,'f',{e:10,f:2},1e5,1,'retro',{glow:[14,'#bfe9ff']});
F('e_fridge','Mini Fridge','energy',1,1,'f',{e:14,c:2},2e7,2,'basic');
F('e_espresso','Espresso Bar','energy',2,1,'f',{e:30,s:10},5e10,4,'luxury');
F('e_smoothie','Smoothie Station','energy',2,1,'f',{e:50,c:10},5e15,7,'nature');
F('e_reactor','Fusion Coffee Reactor','energy',1,1,'f',{e:120,o:20},1e28,11,'tech',{glow:[26,'#7fffe0']});
F('e_nebula','Nebula Juice Bar','energy',2,1,'f',{e:260,s:60},1e44,17,'cosmic',{glow:[24,'#c06aff']});
// fun
F('f_dart','Dartboard','fun',1,1,'w',{f:3},400,0,'retro');
F('f_arcade','Arcade Cabinet','fun',1,1,'f',{f:8},1e4,0,'retro',{glow:[16,'#7fb7ff']});
F('f_foos','Foosball Table','fun',2,1,'f',{f:14},2e6,1,'retro');
F('f_pingpong','Ping-Pong Table','fun',2,2,'f',{f:25},1e9,2,'modern');
F('f_tv','Big Screen TV','fun',2,1,'w',{f:20,s:5},3e8,3,'tech',{glow:[30,'#8fd0ff']});
F('f_jukebox','Jukebox','fun',1,1,'f',{f:30,s:15},1e12,4,'retro',{glow:[22,'#ffb341']});
F('f_pool','Pool Table','fun',2,2,'f',{f:40,s:10},1e13,5,'luxury');
F('f_vr','VR Station','fun',1,1,'f',{f:70,o:5},5e18,8,'tech',{glow:[18,'#c89aff']});
F('f_ballpit','Ball Pit','fun',2,2,'f',{f:110},1e25,10,'retro');
F('f_zerog','Zero-G Trampoline','fun',2,2,'f',{f:250},1e40,14,'cosmic',{glow:[26,'#9fb7ff']});
// focus
F('o_file','Filing Cabinet','focus',1,1,'f',{o:4},800,0,'basic');
F('o_shelf','Bookshelf','focus',1,1,'f',{o:5,s:2},1e3,0,'retro');
F('o_board','Whiteboard','focus',2,1,'w',{o:6},4e3,0,'basic');
F('u_printer','Printer','focus',1,1,'f',{o:6},5e3,0,'basic');
F('o_server','Server Rack','focus',1,1,'f',{o:16},1e8,3,'tech',{glow:[12,'#5fff8a']});
F('o_globe','Antique Globe','focus',1,1,'f',{o:20,s:15},1e11,4,'luxury');
F('o_pod','Quiet Pod','focus',2,2,'f',{o:45,c:10},1e17,7,'modern');
F('o_brain','Brain Scanner','focus',1,1,'f',{o:90},1e27,11,'tech',{glow:[18,'#ff7ab0']});
F('o_oracle','Data Oracle','focus',1,1,'f',{o:200,s:40},1e43,16,'cosmic',{glow:[30,'#7fd0ff']});
// art
F('a_poster','Motivational Poster','art',1,1,'w',{s:2,o:1},100,0,'basic');
F('a_clock','Wall Clock','art',1,1,'w',{s:2,o:1},250,0,'basic');
F('a_paint','Oil Painting','art',2,1,'w',{s:8},5e4,1,'luxury');
F('a_aqua','Aquarium','art',2,1,'f',{s:14,c:6},2e8,3,'nature',{glow:[16,'#5fb5ff']});
F('a_sword','Mounted Swordfish','art',2,1,'w',{s:12,f:2},1e9,3,'retro');
F('a_trophy','Trophy Case','art',1,1,'f',{s:20},5e10,4,'luxury');
F('a_statue','Gold Statue','art',1,1,'f',{s:40},1e14,6,'luxury');
F('a_logo','Company Logo','art',2,1,'w',{s:30},1e15,6,'modern');
F('a_fountain','Fountain','art',2,2,'f',{s:60,c:20},1e18,8,'luxury');
F('a_dino','Dino Skeleton','art',2,2,'f',{s:100,f:20},1e23,10,'retro');
F('a_rocket','Rocket Model','art',1,1,'f',{s:80,o:20},1e26,12,'tech');
F('a_portal','Mini Portal','art',1,1,'f',{s:220,f:40},1e41,15,'cosmic',{glow:[24,'#e05ab0']});
// rugs
F('r_basic','Basic Rug','rug',2,2,'r',{c:3,s:1},400,0,'basic');
F('r_persian','Persian Rug','rug',3,2,'r',{c:10,s:8},1e7,2,'luxury');
F('r_zen','Zen Garden','rug',2,2,'r',{o:12,c:8},1e12,4,'nature');
F('r_red','Red Carpet','rug',3,2,'r',{s:30},1e20,8,'luxury');
F('r_galaxy','Galaxy Rug','rug',3,2,'r',{c:40,s:60},1e36,14,'cosmic');
// utility
F('u_trash','Trash Can','util',1,1,'f',{cl:1},100,0,'basic');
F('u_recycle','Recycling Bin','util',1,1,'f',{cl:2,s:1},2e4,1,'nature');
F('u_janitor','Janitor Bot','util',1,1,'f',{jan:1},1e6,2,'tech');
F('u_purifier','Air Purifier','util',1,1,'f',{cl:2,c:6},1e8,3,'tech');
F('u_safe','Office Safe','util',1,1,'f',{s:5,ev:0.05},1e10,4,'luxury');
// seasonal (buyable only in their month, kept forever)
F('h_pumpkin',"Jack-o'-Lantern",'fun',1,1,'f',{f:6,s:8},5e3,0,'spooky',{month:9,glow:[24,'#ff9a3a']});
F('h_skeleton','Spooky Skeleton','fun',1,1,'f',{f:10,s:10},2e4,0,'spooky',{month:9});
F('h_cauldron','Witch Cauldron','energy',1,1,'f',{e:10,f:10},5e4,0,'spooky',{month:9,glow:[16,'#7fff6a']});
F('h_web','Cobwebs','art',2,1,'w',{s:6},2e3,0,'spooky',{month:9});
F('h_tomb','Tombstone','art',1,1,'f',{s:14},1e4,0,'spooky',{month:9});
F('x_tree','Holiday Tree','plant',2,2,'f',{c:20,s:30},5e4,0,'festive',{month:11,glow:[30,'#ffd98a']});
F('x_snowman','Snowman','fun',1,1,'f',{f:12},1e4,0,'festive',{month:11});
F('x_gifts','Gift Pile','fun',1,1,'f',{f:10,s:10},2e4,0,'festive',{month:11});
F('x_lights','String Lights','light',2,1,'w',{s:12},5e3,0,'festive',{month:11,glow:[30,'#ffb0d0']});
F('v_balloon','Heart Balloons','fun',1,1,'f',{f:8,s:8},5e3,0,'love',{month:1});
F('v_roses','Rose Vase','plant',1,1,'f',{c:10,s:10},1e4,0,'love',{month:1});
F('v_loveseat','Love Seat','seat',2,1,'f',{c:25,s:10},3e4,0,'love',{month:1});
F('m_umbrella','Beach Umbrella','seat',1,1,'f',{c:10,f:6},5e3,0,'summer',{month:6});
F('m_pool','Kiddie Pool','fun',2,2,'f',{f:30},3e4,0,'summer',{month:6});
F('m_grill','BBQ Grill','energy',1,1,'f',{e:20,f:10},1e4,0,'summer',{month:6});
// the CEO desk is always there and cannot be stored
F('ceo','CEO Desk','ceo',2,2,'f',{o:5,s:5},0,0,'');
const FURN_BY = Object.fromEntries(FURN.map(d => [d.id, d]));
const FCATS = [['all','ALL'],['desk','DESKS'],['seat','SEATING'],['plant','PLANTS'],['light','LIGHTS'],['energy','ENERGY'],['fun','FUN'],['focus','FOCUS'],['art','ART'],['rug','RUGS'],['util','UTILITY'],['season','SEASONAL']];
const SET_NAMES = {basic:'Basic',modern:'Modern',retro:'Retro',luxury:'Luxury',nature:'Nature',tech:'Tech',cosmic:'Cosmic',spooky:'Spooky',festive:'Festive',love:'Sweetheart',summer:'Summer'};
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const NEEDS = [['e','ENERGY','--n-e'],['c','COMFORT','--n-c'],['f','FUN','--n-f'],['o','FOCUS','--n-o']];
const STARTER = {d_fold:4, e_cooler:1, p_fern:1, u_trash:1, ceo:1};

/* ================= TALENT ================= */
const TRAITS = [
  ['workaholic','Workaholic','dept',0.5,v => 'Their department +' + pct(v)],
  ['mentor','Mentor','inc',0.03,v => 'All income +' + pct(v)],
  ['genius','Genius','xp',0.08,v => 'XP +' + pct(v)],
  ['lucky','Lucky','freq',0.06,v => 'Events ' + pct(v) + ' more often'],
  ['negotiator','Negotiator','cost',0.02,v => 'Staff ' + pct(v) + ' cheaper'],
  ['nightowl','Night Owl','night',0.12,v => 'Income +' + pct(v) + ' at night'],
  ['earlybird','Early Bird','morning',0.12,v => 'Income +' + pct(v) + ' before noon'],
  ['clicker','Click Fiend','click',0.25,v => 'Clicks +' + pct(v)],
  ['collector','Collector','luck',0.03,v => 'Crate luck +' + pct(v)],
  ['trader','Wolf of Cubicle St','trade',0.05,v => 'Market profits +' + pct(v)],
  ['designer','Tastemaker','style',0.08,v => 'Style +' + pct(v)],
  ['cleanfreak','Clean Freak','clean',0.1,v => 'Trash ' + pct(v) + ' less often'],
  ['zen','Zen Master','c',0.1,v => 'Comfort supply +' + pct(v)],
  ['caffeinated','Caffeinated','e',0.1,v => 'Energy supply +' + pct(v)],
  ['party','Party Animal','f',0.1,v => 'Fun supply +' + pct(v)],
  ['focused','Laser Focused','o',0.1,v => 'Focus supply +' + pct(v)],
  ['speedster','Speedster','rspeed',0.05,v => 'Research +' + pct(v) + ' faster'],
  ['charmer','Charmer','contract',0.08,v => 'Contract rewards +' + pct(v)],
  ['shark','Shark','shares',0.06,v => 'Shares +' + pct(v)],
  ['visionary','Visionary','offline',1,v => 'Offline cap +' + xf(v) + 'h'],
  ['golden','Golden Touch','gold',0.05,v => 'Gold bars +' + pct(v)],
];
const TRAIT_BY = Object.fromEntries(TRAITS.map(t => [t[0], t]));
const TRAR = [{n:'Temp',c:'#b9b3a0',pow:0.1},{n:'Specialist',c:'#5fbf6a',pow:0.2},{n:'Expert',c:'#4f8fe0',pow:0.35},{n:'Rockstar',c:'#a35fe0',pow:0.6},{n:'Legend',c:'#efb341',pow:1}];
const HUNTS = [{id:'std',name:'Job Board',cost:40,w:[60,28,9,2.5,0.5]},{id:'elite',name:'Elite Headhunter',cost:150,w:[0,40,40,16,4]}];
const FIRST = ['Barb','Chad','Doug','Kevin','Linda','Pam','Stan','Gary','Tina','Rhonda','Marcus','Priya','Yuki','Omar','Zoe','Hank','Wanda','Felix','Ingrid','Raj','Brenda','Dwayne','Karen','Luis','Mei','Nadia','Otto','Quinn','Rosa','Sven','Trish','Vince','Wes','Xena','Yolanda','Zed','Bjorn','Cleo','Dex','Esme'];
const LAST = ['Spreadsheet','McSynergy','Profitson','Deadline','Stapleton','Bottomline','Quarterly','Memo','Cubicle','Paperclip','Overtime','Dividend','Margin','Ledger','Pivot','Hustle','Bonus','Expense','Forecast','Leverage','Payroll','Pitchdeck','Roadmap','Inbox','Stakeholder','Bandwidth'];

/* ================= MARKET ================= */
const STOCKS = [
  ['PIZZA','Pizza Planet',0.025],['CHAIR','ChairCorp',0.018],['MEMO','MemoSoft',0.03],['BEAN','BeanBucks Coffee',0.022],
  ['ROBO','RoboWorks',0.04],['ROCKT','Space Elevator Co',0.05],['DUCK','Rubber Duck Holdings',0.035],['VOID','Void Capital',0.07],
].map(([sym, name, vol]) => ({sym, name, vol}));
const NEWS = [
  [1,'%s beats earnings estimates!'],[1,'%s announces a surprise dividend.'],[1,'Influencer can\'t stop talking about %s.'],[1,'%s lands a giant government contract.'],
  [-1,'%s CEO caught napping in a board meeting.'],[-1,'%s recalls ten million units.'],[-1,'Regulators are looking into %s.'],[-1,'%s headquarters overrun by raccoons.'],
];

/* ================= RIVALS ================= */
const RIVALS = [
  ["Larry's Lemonade",'Lemonade Larry',1e4],["Chad's Crypto Hut",'Chad Profitson',1e6],["Karen's Kombucha",'Karen Kale',1e8],['Synergex','Dirk Synergy',1e11],
  ['MegaMart','Moe Mega',1e14],['Profitson Industries','Chad Profitson Sr.',1e18],['Globex','Hank Scorpio',1e23],['Omni Consumer Co','Dick Jones',1e28],
  ['Hyperion Holdings','Helena Hype',1e34],['Stellar Dynamics','Orion Vale',1e40],['Nebula Holdings','Nova Quill',1e47],['Galactic Omnicorp','Zorg Prime',1e55],
  ['The Void Syndicate','The Faceless One',1e64],['Multiverse Inc','Infinite Chad',1e75],['The Final Boss Corp','???',1e90],
].map(([name, ceo, worth], i) => ({name, ceo, worth, i}));
const TAUNTS = ['Enjoy it while it lasts.','I let you win.','My lawyers will be in touch.','This is a temporary setback.','Fine. FINE.','I was going to retire anyway.','You got lucky.','We should do lunch. Business lunch.','I am buying a bigger yacht to cope.','Impossible.','I have underestimated you.','The board will hear about this.','You are not supposed to be here.','How?','Well played. Truly.'];

/* ================= INBOX: DECISIONS ================= */
const DECISIONS = [
  {id:'pizza',from:'HR Hannah',title:'Pizza Friday?',body:'The team is asking for pizza. It is not even Friday.',opts:[['Order pizza for everyone',() => fx.cash(-0.05) + fx.boost('income',2,180,'Pizza party')],['Tell them to eat salad',() => fx.trash(3) + 'Morale dipped. Someone left a sad salad on the floor.']]},
  {id:'poach',from:'Chad Profitson',title:'I am poaching your staff',body:'My recruiters are calling your best people. Counter-offer or let them walk.',opts:[['Counter-offer',() => fx.cash(-0.08) + fx.gold(6)],['Let them go',() => fx.loseStaff(0.05)]]},
  {id:'meme',from:'Marketing',title:'A meme opportunity',body:'We could post a meme about our quarterly earnings. It might go viral. It might go terribly.',opts:[['Post it',() => Math.random() < 0.55 ? fx.boost('income',4,120,'Meme went viral') : 'Nobody laughed. Nothing happened.'],['Too risky',() => 'You played it safe.']]},
  {id:'audit',from:'The Tax Office',title:'Surprise audit',body:'An auditor is in the lobby holding a very large binder.',opts:[['Hire a lawyer',() => fx.cash(-0.03) + 'The lawyer handled it.'],['Wing it',() => Math.random() < 0.5 ? fx.cash(-0.2) + 'That went badly.' : fx.gold(10) + 'They found an overpayment and refunded you.']]},
  {id:'pitch',from:'Angel Investor',title:'Pitch me in an elevator',body:'You have 30 seconds and one elevator ride.',opts:[['Give the pitch',() => fx.gold(randi(5, 15))],['Take the stairs',() => 'You got some cardio.']]},
  {id:'freefurn',from:'Liquidation Sale',title:'Free furniture',body:'A company down the street went bust. Their furniture is on the curb.',opts:[['Grab something',() => fx.furn()],['Leave it',() => 'Someone else took it.']]},
  {id:'retreat',from:'Your Team',title:'Team retreat?',body:'Everyone wants a weekend retreat in the mountains.',opts:[['Approve it',() => fx.cash(-0.15) + fx.xp(0.5)],['Deny it',() => fx.trash(5) + 'Grumbling. Trash everywhere.']]},
  {id:'coffeebroke',from:'Facilities',title:'Coffee machine broke',body:'People are staring at the empty pot in silence.',opts:[['Emergency repair',() => fx.cash(-0.02) + 'Crisis averted.'],['Wait for the part',() => fx.boost('income',0.8,300,'Coffee crisis')]]},
  {id:'celeb',from:'Talent Agent',title:'A celebrity wants to visit',body:'A famous actor wants to shadow your CEO for a movie role.',opts:[['Roll out the red carpet',() => fx.boost('income',3,60,'Celebrity visit') + fx.gold(5)],['Too busy',() => 'The actor picked your rival instead.']]},
  {id:'crate',from:'Unknown Sender',title:'A mysterious crate',body:'A crate arrived with no return address. It is humming.',opts:[['Open it',() => fx.crate()],['Return to sender',() => fx.gold(3)]]},
  {id:'invent',from:'An Intern',title:'I invented something',body:'An intern built a gadget out of paperclips and ambition.',opts:[['Fund it',() => fx.cash(-0.05) + fx.research(600)],['Ignore it',() => 'The intern is sad but fine.']]},
  {id:'spill',from:'Janitor Joe',title:'Coffee spill in aisle 3',body:'It is spreading. It might be sentient.',opts:[['Clean it now',() => fx.cash(-0.01) + fx.clean()],['Leave it',() => fx.trash(8) + 'It got worse.']]},
  {id:'hack',from:'Dev Team',title:'Hackathon this weekend?',body:'48 hours, unlimited energy drinks, questionable code.',opts:[['Host it',() => fx.cash(-0.05) + fx.xp(0.3)],['No thanks',() => 'Everyone went home on time.']]},
  {id:'lottery',from:'A Guy',title:'Lottery ticket?',body:'A guy in the parking lot is selling lottery tickets. One gold bar each.',opts:[['Buy one (1 gold)',() => { if (S.gold < 1) return 'You are broke.'; S.gold -= 1; return Math.random() < 0.06 ? fx.gold(50) + 'JACKPOT!' : 'Not a winner.'; }],['Walk away',() => 'Probably wise.']]},
  {id:'mom',from:'Mom',title:'Call me back',body:'Your mother would like to know if you are eating enough.',opts:[['Call her',() => fx.gold(10) + 'She is proud of you.'],['Let it ring',() => 'She left a 9 minute voicemail.']]},
  {id:'gala',from:'Charity Board',title:'Charity gala tonight',body:'Black tie. Big donors. Bigger photo ops.',opts:[['Donate 10% of cash',() => fx.cash(-0.1) + fx.gold(25)],['Skip it',() => 'You stayed in and watched TV.']]},
  {id:'overtime',from:'Your Managers',title:'Mandatory overtime?',body:'We can push hard this week. It will get messy.',opts:[['Approve overtime',() => fx.boost('income',2,300,'Overtime') + fx.trash(6)],['Deny it',() => 'Everyone thanked you.']]},
  {id:'robots',from:'AI Robot #7',title:'A minor robot uprising',body:'The robots have formed a union. Their demands are reasonable.',opts:[['Negotiate',() => fx.gold(5) + fx.boost('income',1.5,180,'Robot union')],['Unplug them',() => 'They rebooted and forgot everything.']]},
  {id:'walkin',from:'Reception',title:'A walk-in candidate',body:'Someone walked in with a resume printed on gold paper.',opts:[['Interview them',() => fx.talent()],['Pass',() => 'They went to work for Chad.']]},
  {id:'influencer',from:'Marketing',title:'Influencer collab',body:'A big influencer will feature us. It costs money.',opts:[['Pay 5% of cash',() => fx.cash(-0.05) + fx.boost('income',3,120,'Influencer collab')],['Decline',() => 'You kept your dignity.']]},
  {id:'outage',from:'Facilities',title:'Power outage',body:'The lights are out. The servers are screaming.',opts:[['Run the generator',() => fx.cash(-0.05) + 'Back online.'],['Light candles',() => fx.boost('income',0.7,180,'Candlelight') + fx.xp(0.15)]]},
  {id:'raccoon',from:'Janitor Joe',title:'Raccoon in the vents',body:'It has been living up there for weeks. It looks well fed.',opts:[['Call an exterminator',() => fx.cash(-0.01) + 'Gone.'],['Name it Gary',() => fx.gold(5) + 'Gary is now the office mascot.']]},
  {id:'timewarn',from:'Future You',title:'Listen carefully',body:'I came back from the future. Do not ignore this email.',opts:[['Listen',() => fx.xp(0.25)],['Ignore it',() => 'You feel like you missed something.']]},
  {id:'designer',from:'Interior Designer',title:'Free makeover consult',body:'A famous interior designer wants to feature your office.',opts:[['Let them in',() => fx.boost('income',2,240,'Makeover buzz') + fx.gold(4)],['Keep it private',() => 'The office stays a mystery.']]},
  {id:'stocktip',from:'Your Broker',title:'Hot stock tip',body:'I have a feeling about ' + 'this one. Trust me.',opts:[['Follow the tip',() => fx.stockTip()],['Ignore the broker',() => 'Your broker sighed loudly.']]},
  {id:'ghost',from:'Night Guard',title:'Ghost in the break room',body:'Something keeps moving the stapler at 3 AM.',month:9,opts:[['Call ghost hunters',() => fx.cash(-0.02) + fx.gold(10)],['Hire the ghost',() => fx.furn('spooky')]]},
  {id:'snowday',from:'HR Hannah',title:'Snow day?',body:'It is snowing. Half the staff are building a snowman outside.',month:11,opts:[['Join them',() => fx.boost('click',5,120,'Snowball fight') + fx.gold(5)],['Back to work',() => fx.boost('income',1.3,180,'Grinding')]]},
];

/* ================= STORY EMAILS ================= */
const STORY = [
  ['intro','Mom','Welcome to the garage','I cleared out the garage for you, sweetie. Try not to blow anything up. Love, Mom.',10,() => true],
  ['hire1','Mom','Your first employee!','I saw someone walking into the garage. Is that your intern? Give them a snack.',5,() => totalEmp() > 0],
  ['decor1','Interior Designer','Your office needs love','Employees work better in a nice space. Open Office → Decor and press DECORATE to place furniture. Watch the four need meters under your office.',10,() => totalEmp() >= 5],
  ['move1','Landlord Lou','Lease signed','The strip mall suite is yours. The vape shop next door says hi.',10,() => S.stats.maxOffice >= 1],
  ['sale1','Chad Profitson','Heard you sold your company','Cute. I sell three companies before breakfast. See you on the leaderboard.',15,() => S.tr >= 1],
  ['lab1','Dr. Beaker','The lab is open','Now that you have sold once, the research lab is running. Projects keep going even while the game is closed.',10,() => S.tr >= 1],
  ['talent1','HR Hannah','Star employees','Regular staff are fine, but stars change everything. Headhunt talent in Office → Talent and make them department heads.',10,() => S.tr >= 1 || S.gold >= 40],
  ['sale5','Mom','Five companies?!','Your aunt does not believe me. Please send a photo of you being rich.',20,() => S.tr >= 5],
  ['decor25','Interior Designer','The vibe is immaculate','Twenty-five pieces placed. Try matching sets for bonuses and putting coffee next to couches.',15,() => S.stats.placedMax >= 25],
  ['trade1','Your Broker','Welcome to the market','Buy low, sell high. That is all the advice I am legally allowed to give.',5,() => S.market.trades >= 1],
  ['lvl25','Future You','Level 25','You are doing great. Keep spending skill points. Trust me, I am you.',15,() => S.level >= 25],
  ['ipo1','The Board','Welcome to Wall Street','You rang the bell. The stock exchange is open to you now.',50,() => S.ti >= 1],
  ['lvl50','Future You','Level 50','Halfway to somewhere. Have you tried the Break Room games?',25,() => S.level >= 50],
  ['res25','Dr. Beaker','25 projects done','The lab is humming. I may have also created a small black hole. Unrelated.',25,() => researchDone() >= 25],
  ['ipo5','The Board','Five IPOs','The financial press is calling you the Serial Bell Ringer.',60,() => S.ti >= 5],
  ['merge1','The Cosmic Council','You have been noticed','Your mergers have reached the attention of the Council. Space awaits.',100,() => S.mergers >= 1],
  ['orbit','Mission Control','Orbital Station online','Remember to strap your desk down.',40,() => S.stats.maxOffice >= 13],
  ['lvl100','Future You','Level 100','We made it. Now keep going.',50,() => S.level >= 100],
  ['trash','Janitor Joe','I quit (not really)','A thousand pieces of trash. You owe me a raise. Or a Janitor Bot.',25,() => S.stats.cleaned >= 1000],
  ['merge5','The Cosmic Council','Five mergers','You are now legally a small galaxy.',150,() => S.mergers >= 5],
  ['multiverse','Every Version of You','Welcome to the lobby','We are all here. We have been waiting. Pull up a chair.',500,() => S.stats.maxOffice >= 19],
];
