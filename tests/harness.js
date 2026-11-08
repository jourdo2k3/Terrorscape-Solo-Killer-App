// Test harness: runs the app's script with a stub DOM and a bot that plays the survivors honestly.
// Usage (from the repo root):
//   node tests/extract-app.js
//   node tests/harness.js <games> <difficulty|all> [forcedTrait|all|none]
const fs = require('fs');
const vm = require('vm');
const appSrc = fs.readFileSync(__dirname + '/app.js', 'utf8');

const harness = `
;(function(){
const SIM = globalThis.__SIM;
const tick = () => new Promise(r => setImmediate(r));
const rint = n => Math.floor(Math.random()*n);
function survStepNbs(id, loc, pos){
  const n = NB[loc].filter(x => !S.blocks.includes(ekey(loc,x)));
  if(id==='sophia' && PASS[loc]) n.push(PASS[loc]);
  return n;
}
function randomWalk(id, loc, steps){
  for(let k=0;k<steps;k++){ const n = survStepNbs(id, loc); if(!n.length) break; loc = n[rint(n.length)]; }
  return loc;
}
function check(tag){
  // invariants
  let t=0, bad=false; for(let s=0;s<NS;s++){ const p=S.belief[s]; if(!(p>=0)) bad=true; t+=p; }
  if(bad || Math.abs(t-1)>1e-6) SIM.err(tag+': belief not a distribution (sum '+t+')');
  if(S.hand.length>5) SIM.err(tag+': hand over limit '+S.hand.length);
  if(new Set(S.blocks).size!==S.blocks.length) SIM.err(tag+': duplicate block');
  if(S.blocks.length>7) SIM.err(tag+': too many blocks '+S.blocks.length);
  if(S.level<1||S.level>5) SIM.err(tag+': bad level '+S.level);
  if(strength()>10||strength()<1) SIM.err(tag+': bad strength '+strength());
  const all = [...S.deck, ...S.hand, ...S.discard];
  const n = all.length; if(n>13) SIM.err(tag+': card count '+n);
  for(const b of S.blocks){ const [a,c]=b.split('|'); if(!EDGE[b]||!EDGE[b].door) SIM.err(tag+': block on non-door '+b); }
}
async function playGame(surv, diff, forced){
  if(forced){ pickTraits = () => ({drawn:forced.slice(), kept:forced.slice()}); }
  newGame(surv, diff, false);
  const pos = {}; surv.forEach(id => pos[id] = MAP.survivorStart);
  const fear = {}; surv.forEach(id => fear[id] = 0);
  let rescueRounds = -1;
  SIM.surprises = 0;
  for(let round=0; round<60; round++){
    if(S.phase==='over') break;
    if(S.phase!=='survivors'){ SIM.err('expected survivors phase, got '+S.phase); return; }
    // ---- survivors' turn (random but legal) ----
    if(rescueRounds>0){ rescueRounds--; if(rescueRounds===0){ gameOver('survivors'); SIM.result('survivors-rescue'); return; } }
    if(S.keys>=5 && surv.every(id=>pos[id]===MAP.mainExit)){ gameOver('survivors'); SIM.result('survivors-escape'); return; }
    const noise = new Set();
    for(const id of surv){
      const r = Math.random();
      const kHere = !S.stealth && S.killerLoc===pos[id];
      if(r<0.55){ pos[id] = randomWalk(id, pos[id], id==='william' && Math.random()<0.3 ? 3 : 1+rint(2)); if(id==='william' && Math.random()<0.2) noise.add(pos[id]); }
      else if(r<0.7){ fear[id]=0; S.fear[id]=0; }
      else if(r<0.8){ // remove a block in own location
        const bs = S.blocks.filter(b=>b.split('|').includes(pos[id]) && !S.report.removed.includes(b));
        if(bs.length) S.report.removed.push(bs[0]);
      } else if(!kHere && MAP.search.includes(pos[id])){ if(id!=='anna') noise.add(pos[id]); if(Math.random()<0.4 && S.keys<5) S.keys++; }
      else if(!kHere && pos[id]===MAP.radio && !S.rescue){ noise.add(pos[id]); if(Math.random()<0.25){ S.rescue=true; rescueRounds=5; } }
      else if(Math.random()<0.1) noise.add(pos[id]);
    }
    if(Math.random()<0.15) noise.add(pos[surv[rint(3)]]); // discover-step noise
    if(Math.random()<0.03) S.report.firecracker = true;
    S.report.noise = [...noise];
    // removed blocks are removed by survivors before moving in reality; the sim moved first, fine for a smoke test
    SIM.truth = pos;
    submitReport();
    // ---- killer's turn: answer prompts honestly ----
    let idle = 0;
    while(S.phase==='killer'){
      await tick();
      if(!PROMPT){ if(++idle>2000){ SIM.err('stuck: killer phase with no prompt'); return; } continue; }
      idle = 0;
      const P = PROMPT, m = P.meta||{};
      let ans;
      if(P.type==='multi' && m.kind==='overwhelm'){
        ans = []; for(const it of P.items){ fear[it.value]++; if(fear[it.value]>=3){ ans.push(it.value); fear[it.value]=0; } }
      } else if(P.type==='multi' && m.locs){
        ans = surv.filter(id => m.locs.includes(pos[id]) && !(m.sense && id==='anna'));
      } else if(P.type==='multi'){ SIM.err('unknown multi prompt '+P.title); ans=[]; }
      else if(P.type==='choice' && m.kind==='where'){
        const v = pos[m.id]; if(!P.options.some(o=>o.value===v)) SIM.err('overwhelm: true location not offered ('+v+') in '+P.title); ans = P.options.some(o=>o.value===v)?v:P.options[0].value;
      } else if(P.type==='choice' && m.kind==='defender'){ ans = P.options[rint(P.options.length)].value; }
      else if(P.type==='choice' && m.kind==='defence'){ ans = Math.random()<0.5?'ok':'fail'; }
      else if(P.type==='roster' && m.kind==='damage-all'){ ans={}; P.items.forEach(it=>ans[it.value]= (it.value==='dylan'&&Math.random()<0.5)?'safe':'hurt'); }
      else if(P.type==='roster' && m.locs){ ans={}; P.items.forEach(it=>ans[it.value]= m.locs.includes(pos[it.value]) ? (Math.random()<0.2?'safe':'hurt') : 'no'); }
      else { SIM.err('unknown prompt '+P.type+' '+P.title); return; }
      const res = P.resolve; PROMPT = null; res(ans);
      // after an encounter, flee x1 for everyone who was there (approximates "may move")
      if(P.type==='choice' && m.kind==='defence') {}
    }
    // after encounters the app models a 1-step flee; let present survivors maybe step
    for(const id of surv) if(S.phase!=='over' && pos[id]===S.killerLoc && Math.random()<0.5) pos[id]=randomWalk(id,pos[id],1);
    check('round '+S.round);
    for(const t of S.log) for(const l of t.lines){ if(l.text.includes('Something went wrong')) { SIM.err('app error: '+l.text); return; } }
  }
  SIM.surprises = S.log.reduce((n,t)=>n+t.lines.filter(l=>l.text.includes('surprised')).length,0);
  SIM.result(S.phase==='over' ? (S.winner||'?') : 'timeout');
}
globalThis.__play = playGame;
globalThis.__traitIds = Object.keys(TRAITS);
globalThis.__S = () => S;
})();
`;

function makeContext(){
  const sim = { errors: [], err(m){ this.errors.push(m); }, result(r){ this.res = r; } };
  const store = {};
  const ctx = {
    console, setImmediate, Math, JSON, Float64Array, Uint8Array, Promise, Object, Array, Set,
    __SIM: sim,
    localStorage: { getItem:k=>store[k]??null, setItem:(k,v)=>{store[k]=String(v);}, removeItem:k=>{delete store[k];} },
    window: { innerWidth: 1200 },
    document: { getElementById: () => ({ set innerHTML(v){}, get innerHTML(){return '';} }), addEventListener(){}, querySelector(){ return null; } },
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(appSrc + harness, ctx);
  return { ctx, sim };
}

(async () => {
  const games = +process.argv[2] || 50;
  const diffArg = process.argv[3] || 'all';
  const traitArg = process.argv[4] || 'none';
  const diffs = diffArg==='all' ? ['vanilla','easy','normal','hard','nightmare'] : [diffArg];
  const allSurv = ['anna','caleb','dylan','george','johnson','marco','ophelia','sophia','william'];
  const { ctx: probe } = makeContext();
  const traitIds = probe.__traitIds;
  const traitRuns = traitArg==='all' ? traitIds.map(t=>[t]) : traitArg==='none' ? [null] : [[traitArg]];
  const tally = {}; let errs = []; let surprises = 0, total = 0, rounds = 0;
  for(const forced of traitRuns) for(const diff of diffs) for(let g=0; g<games; g++){
    const { ctx, sim } = makeContext();
    const surv = allSurv.slice().sort(()=>Math.random()-.5).slice(0,3);
    try { await ctx.__play(surv, forced? 'normal' : diff, forced); }
    catch(e){ sim.err('exception: '+(e.stack||e)); }
    const key = (forced?forced[0]:diff);
    tally[key] = tally[key] || {};
    tally[key][sim.res||'none'] = (tally[key][sim.res||'none']||0)+1;
    surprises += ctx.__SIM.surprises||0; total++; rounds += ctx.__S().round;
    if(sim.errors.length) errs.push(`[${key} ${surv.join(',')}] ` + sim.errors.slice(0,3).join(' | '));
  }
  console.log(JSON.stringify(tally));
  console.log(`games ${total}, avg rounds ${(rounds/total).toFixed(1)}, games with errors ${errs.length}, belief "surprised" events/game ${(surprises/total).toFixed(2)}`);
  errs.slice(0,15).forEach(e=>console.log(e));
})();
