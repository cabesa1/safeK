const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const {chromium}=require(process.env.SAFEK_PLAYWRIGHT||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa/insights');fs.mkdirSync(out,{recursive:true});
const {configuration}=require('../src/site-config.cjs'),{all,validate,route}=require('../src/insights.cjs');
const run=(file,env)=>{const r=spawnSync(process.execPath,[file],{cwd:root,env:{...process.env,...env},encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout;};
(async()=>{
 assert.equal(configuration({SEO_ALLOW_INDEXING:'true'}).indexable,false);
 assert.equal(configuration({SAFEK_SITE_ENV:'production'}).indexable,false);
 assert.equal(configuration({SAFEK_SITE_ENV:'production',SEO_ALLOW_INDEXING:'true'}).indexable,true);
 assert.equal(configuration({VERCEL:'1'}).includeDrafts,false);
 assert.throws(()=>configuration({SEO_SITE_URL:'https://www.safek.com.br'}));
 for(const a of all){assert.equal(a.author.name,'Equipe SAFE-K');assert.equal(a.status,'draft');assert.throws(()=>validate({...a,status:'published'}));}
 const deploymentConfig=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
 for(const a of all)assert(!deploymentConfig.redirects.some(r=>r.destination==='/'+route(a)+'.html'),'checked-in redirect exposes a draft-only destination');
 // Isolated fixture proves the published schema branch without publishing real articles.
 const original={...all[0]};
 try{
  Object.assign(all[0],{status:'published',approvedForPublication:true,publishedAt:'2025-01-01',modifiedAt:'2025-01-02'});validate(all[0]);
  const views=require('../src/templates.cjs'),seo=require('../src/seo.cjs');
  const html=seo.enrich(route(all[0]),views.insightArticle(all[0]));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const schema=graph['@graph'].find(n=>n['@type']==='BlogPosting');
  assert.equal(schema.author.name,'Equipe SAFE-K');assert.equal(schema.datePublished,'2025-01-01');assert(html.includes('datetime="2025-01-01"'));
 }finally{Object.assign(all[0],original);}
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'safek-production-'));
 const env={SAFEK_BUILD_DIR:temporary,SAFEK_SITE_ENV:'production',SEO_ALLOW_INDEXING:'true',SAFEK_ANALYTICS_ENABLED:'false'};
 run('build.cjs',env);run('tools/build-static.cjs',env);run('tools/check-seo.cjs',env);
 const production=JSON.parse(fs.readFileSync(path.join(temporary,'research/build-manifest.json'),'utf8'));
 assert.equal(production.pages.length,16);assert.equal(production.indexablePages.length,15);
 for(const a of all)assert(!fs.existsSync(path.join(temporary,'dist',route(a)+'.html')),'draft leaked');
 const prodHome=fs.readFileSync(path.join(temporary,'dist/index.html'),'utf8');assert(prodHome.includes('href="https://safek.com.br/"'));assert(!prodHome.includes('href="insights.html"'));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results={productionBuildDirectory:temporary,productionPages:16,productionIndexable:15,unpublishedArticlesExcluded:true,analytics:{},visual:[],performance:[]};
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page=await context.newPage(),requests=[];page.on('request',r=>{if(/google-analytics|googletagmanager/.test(r.url()))requests.push(r.url());});
  await page.addInitScript(()=>{sessionStorage.setItem('safek_privacy_notice','dismissed');window.__vitals={lcp:null,cls:0};try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__vitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__vitals.cls+=e.value;}).observe({type:'layout-shift',buffered:true});}catch{}});
  for(const slug of ['index','insights',route(all[0])]){
   for(const width of [390,1050,1440]){await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3014/'+slug+'.html');await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})));});await page.waitForTimeout(250);
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,headerOverlap:(()=>{const c=document.querySelector('.header-cta').getBoundingClientRect(),n=document.querySelector('.desktop-nav').getBoundingClientRect();return innerWidth>=1050&&n.right>c.left;})(),...window.__vitals}));assert(!result.overflow&&!result.headerOverlap);assert.equal(result.h1,1);results.visual.push({slug,width,...result});
    if(width!==1050)await page.screenshot({path:path.join(out,slug.replaceAll('/','-')+'-'+width+'.png'),fullPage:true});
    if(slug==='index')results.performance.push({width,lcpMs:result.lcp,cls:result.cls,conditions:'Local Edge, sem limitação de CPU/rede; observação curta; não representa Core Web Vitals de campo.'});
   }
  }
  await page.evaluate(()=>{window.safekAnalytics.setConsent(true);window.safekAnalytics.track('demo_cta_click');});assert.deepEqual(requests,[]);assert.equal(await page.evaluate(()=>window.dataLayer),undefined);
  results.analytics.disabledEvenWithConsent=true;
  // Test the prepared integration with a non-networked fixture and a fake test ID.
  await page.route('https://www.googletagmanager.com/**',r=>r.fulfill({status:200,body:'/* intercepted test fixture; no vendor code */',contentType:'text/javascript'}));
  await page.route('**/analytics-fixture.html*',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><head><script type="application/json" id="safek-analytics-config">{"enabled":true,"measurementId":"G-TESTONLY"}</script><script src="/analytics.js" defer></script></head><body><a href="/contato.html#solicitar-demonstracao">Solicitar demonstração</a></body></html>'}));
  await page.goto('http://127.0.0.1:3014/analytics-fixture.html?email=private@example.org#secret');
  assert.equal(await page.evaluate(()=>window.dataLayer),undefined);
  await page.evaluate(()=>{window.safekAnalytics.setConsent(true);window.safekAnalytics.setConsent(true);window.safekAnalytics.track('demo_cta_click',{email:'private@example.org'});window.safekAnalytics.track('lead_received');});
  const data=await page.evaluate(()=>JSON.stringify(window.dataLayer));assert(!data.includes('private@example.org')&&!data.includes('#secret')&&!data.includes('lead_received'));assert.equal(JSON.parse(data).filter(e=>e[0]==='event'&&e[1]==='page_view').length,1);
  await page.evaluate(()=>window.safekAnalytics.setConsent(false));const count=await page.evaluate(()=>window.dataLayer.length);await page.evaluate(()=>window.safekAnalytics.track('demo_cta_click'));assert.equal(await page.evaluate(()=>window.dataLayer.length),count);
  results.analytics={...results.analytics,consentGate:true,noFormPayload:true,queryAndFragmentRemoved:true,noDuplicatePageview:true,withdrawalStopsNewEvents:true,vendorRequestsIntercepted:true,realAnalyticsDelivery:'Not tested; credentials and privacy approval pending'};
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
