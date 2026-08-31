// 引擎数核数：DEFAULT_ENGINES 全量展开，查重复、查无 %s 的坏 url
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../scripts/config.js', 'utf8');
const tail = `
;globalThis.__A = Object.entries(DEFAULT_ENGINES).flatMap(([k, v]) => (v.engines || v).map(e => ({ ...e, cat: k })));
;globalThis.__DUP = {}; globalThis.__A.forEach(e => globalThis.__DUP[e.id] = (globalThis.__DUP[e.id] || 0) + 1);
`;
new Function(src + tail)();
const all = globalThis.__A;
const dup = globalThis.__DUP;
console.log('TOTAL:', all.length);
console.log('DUPES:', JSON.stringify(Object.entries(dup).filter(([, v]) => v > 1)));
const nos = all.filter(e => !e.url || !e.url.includes('%s'));
console.log('NO_QUERY_URL:', nos.map(e => `${e.id}(${e.name})`).join(', ') || 'none');
