import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const load = source => import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const helperUrl = 'data:text/javascript;base64,' + Buffer.from(readFileSync(new URL('lib/form-security.js', root))).toString('base64');
const handlers = {};
for (const name of ['contact', 'sponsorship']) {
  const source = readFileSync(new URL(`api/${name}.js`, root), 'utf8').replace('../lib/form-security.js', helperUrl);
  handlers[name] = (await load(source)).default;
}
const valid = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.test', message: 'Hello', team: 'Team', discipline: 'BMX' };
function response() { return { headers: {}, code: 200, setHeader(k,v) { this.headers[k.toLowerCase()]=v; }, status(code) { this.code=code; return this; }, json(body) { this.body=body; return this; } }; }
async function invoke(handler, changes={}) {
 const req = { method:'POST', headers:{'content-type':'application/json', origin:'https://mattisco.com'}, body:{...valid}, ...changes };
 const res = response(); await handler(req,res); return res;
}
for (const [name, handler] of Object.entries(handlers)) {
 test(`${name}: invalid submissions never reach CRM`, async () => {
  const originalFetch=global.fetch; let calls=0; global.fetch=async()=>{ calls++; throw new Error('Unexpected CRM request'); };
  try {
   for (const [changes,status] of [
    [{method:'GET'},405], [{body:null},400], [{body:[]},400],
    [{body:{...valid, firstName:{bad:'type'}}},400],
    [{body:{...valid, message:' '}},400], [{body:{...valid, email:'invalid'}},400],
    [{body:{...valid, message:'x'.repeat(5001)}},400],
    [{body:{...valid, other:'x'.repeat(17000)}},413],
    [{headers:{'content-type':'text/plain'}},415],
    [{headers:{'content-type':'application/json',origin:'https://evil.example'}},403],
    [{body:{...valid,website:'spam.example'}},200]
   ]) { const res=await invoke(handler,changes); assert.equal(res.code,status); assert.equal(res.headers['cache-control'],'no-store'); }
   assert.equal(calls,0);
  } finally { global.fetch=originalFetch; }
 });
 test(`${name}: successful CRM flow escapes HTML and keeps tokens out of URLs`, async () => {
  process.env.PIPEDRIVE_DOMAIN='test-company'; process.env.PIPEDRIVE_API_TOKEN='test-token-never-real';
  const originalFetch=global.fetch; const calls=[];
  global.fetch=async(url,options)=>{ calls.push({url,options}); return {ok:true,json:async()=>({success:true,data:{id:calls.length}})}; };
  try {
   const res=await invoke(handler,{body:{...valid,message:'<img src=x onerror=alert(1)>\nHello & goodbye'}});
   assert.equal(res.code,200); assert.equal(res.body.success,true); assert.equal(res.body.personId,undefined); assert.equal(res.body.leadId,undefined);
   assert.equal(calls.length,3);
   for(const {url,options} of calls) { assert.ok(!url.includes('test-token')); assert.ok(!url.includes('?')); assert.equal(options.headers['x-api-token'],'test-token-never-real'); assert.equal(options.redirect,'error'); assert.ok(options.signal instanceof AbortSignal); }
   const content=JSON.parse(calls[2].options.body).content;
   assert.ok(content.includes('&lt;img')); assert.ok(content.includes('&amp; goodbye')); assert.ok(!content.includes('<img')); assert.ok(content.includes('<br>'));
  } finally { global.fetch=originalFetch; }
 });
 test(`${name}: provider failures return a generic error without leaking details`, async () => {
  const originalFetch=global.fetch; const originalError=console.error; const logged=[];
  global.fetch=async()=>{throw new Error('secret-provider-detail')}; console.error=(...args)=>logged.push(args.join(' '));
  try { const res=await invoke(handler); assert.equal(res.code,500); assert.ok(!JSON.stringify(res.body).includes('secret-provider-detail')); assert.ok(!logged.join(' ').includes('secret-provider-detail')); }
  finally { global.fetch=originalFetch; console.error=originalError; }
 });
}
test('security headers retain API configuration and block executable inline scripts', () => {
 const config=JSON.parse(readFileSync(new URL('vercel.json',root),'utf8'));
 assert.equal(config.functions['api/**/*.js'].maxDuration,10);
 assert.ok(config.redirects.length>0);
 const headers=Object.fromEntries(config.headers[0].headers.map(({key,value})=>[key,value]));
 const csp=headers['Content-Security-Policy'];
 for(const value of ["script-src 'self'", "frame-ancestors 'none'", "object-src 'none'", "form-action 'self'"]) assert.ok(csp.includes(value));
 assert.ok(!/script-src[^;]*unsafe/.test(csp));
});
