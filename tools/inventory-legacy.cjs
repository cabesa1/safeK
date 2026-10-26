// Read-only public crawl. Does not submit forms or mutate the old site.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),origin='https://safek.com.br';
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#8211;','–').replaceAll('&#8217;',"'").replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const extract=(html,regex)=>decode(html.match(regex)?.[1]||'');
async function read(url){const response=await fetch(url,{signal:AbortSignal.timeout(25000)});return {status:response.status,url:response.url,text:await response.text()};}
(async()=>{
 const robots=await read(origin+'/robots.txt'),index=await read(origin+'/wp-sitemap.xml');
 const sitemaps=[...index.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const urls=new Set();
 for(const sitemap of sitemaps.filter(s=>/posts-(post|page)-\d+\.xml$/.test(s))){const result=await read(sitemap);for(const m of result.text.matchAll(/<loc>(.*?)<\/loc>/g))urls.add(m[1]);}
 const records=[];
 for(const url of urls){try{const r=await read(url);records.push({url,status:r.status,finalUrl:r.url,title:extract(r.text,/<title[^>]*>([\s\S]*?)<\/title>/i),description:extract(r.text,/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i),canonical:extract(r.text,/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i),robots:extract(r.text,/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i),h1:[...r.text.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>decode(m[1])),excerpt:decode(r.text.match(/<article\b[\s\S]*?<\/article>/i)?.[0]||'').slice(0,1200)});}catch(e){records.push({url,error:e.message});}}
 const aliases=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).redirects;
 const mapping=records.map(r=>{const pathname=new URL(r.url).pathname,clean=pathname.replace(/\/$/,'')||'/';const rule=aliases.find(a=>a.source===clean);const target=clean==='/'?'/':rule?.destination;return {oldUrl:r.url,target:target||null,status:target?'proposed-review':'pending-content-review',reason:target?'Equivalente ou consolidação na arquitetura atual; revisar antes da migração.':'Sem equivalente confirmado. Avaliar conteúdo, tráfego e backlinks antes de preservar, redirecionar ou retirar.'};});
 const report={checkedAt:new Date().toISOString(),source:origin,robots:robots.text,sitemapIndex:origin+'/wp-sitemap.xml',sitemaps,excludedSitemaps:sitemaps.filter(s=>!/posts-(post|page)-\d+\.xml$/.test(s)),records,mapping,limitations:['Sem acesso ao Search Console, logs ou backlinks.','GET com redirecionamentos automáticos registra URL final; cadeia intermediária não inspecionada.','Mapeamento proposto não autoriza alterações no site antigo ou no DNS.']};
 fs.writeFileSync(path.join(root,'research/legacy-inventory.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({urls:records.length,statuses:records.map(r=>[new URL(r.url).pathname,r.status]),pending:mapping.filter(r=>!r.target).map(r=>r.oldUrl)},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
