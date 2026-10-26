const fs=require('node:fs'),path=require('node:path');
const root=__dirname,out=path.resolve(process.env.SAFEK_BUILD_DIR||root);
const views=require('./src/templates.cjs'),seo=require('./src/seo.cjs'),config=require('./src/site-config.cjs');
const {applications,articles}=require('./src/content.cjs'),insights=require('./src/insights.cjs');
const generated=[];
function write(file,text){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);if(file.endsWith('.html'))generated.push(file);}
const pages={index:views.home(),sobre:views.about(),'como-funciona':views.how(),'onde-usar':views.applicationsPage(),imprensa:views.press(),contato:views.contact(),duvidas:views.faqPage(),privacidade:views.privacy(),insights:views.listing()};
for(const item of applications){let html=views.applicationPage(item);if(item.slug==='escolas')html=html.replace('</main>',views.schoolLinks()+'</main>');pages[item.slug]=html;}
for(const item of articles)pages[item.slug]=views.article(item);
for(const item of insights.visible)pages[insights.route(item)]=views.insightArticle(item);
for(const [name,html] of Object.entries(pages))write(name+'.html',seo.enrich(name,html));
const eligible=Object.keys(pages).filter(seo.pageIsIndexable);
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+eligible.map(name=>{const a=insights.visible.find(a=>insights.route(a)===name);return '  <url><loc>'+seo.url(name)+'</loc>'+(a?'<lastmod>'+a.modifiedAt+'</lastmod>':'')+'</url>';}).join('\n')+'\n</urlset>\n');
write('robots.txt','User-agent: *\nAllow: /\n'+(config.indexable?'\nSitemap: '+seo.origin+'/sitemap.xml\n':''));
const retired={universidades:'onde-usar',festas:'eventos',tribunais:'onde-usar',acampamentos:'onde-usar',hospitais:'onde-usar'};
const aliases={'sobre-nos':'sobre','privacy-policy':'privacidade',...Object.fromEntries(applications.map(a=>[a.slug,a.slug])),'onde-usar':'onde-usar',insights:'insights',...retired};
for(const a of articles)aliases[new URL(a.original).pathname.split('/').filter(Boolean)[0]]=a.slug;
for(const a of insights.visible)aliases[insights.route(a)]=insights.route(a);
const aliasHtml=to=>'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=/'+to+'.html"><title>SAFE-K</title></head><body><a href="/'+to+'.html">Acessar a página SAFE-K</a></body></html>';
for(const [from,to] of Object.entries(retired))write(from+'.html',aliasHtml(to));
for(const [from,to] of Object.entries(aliases))write(from+'/index.html',aliasHtml(to));
write('research/pages.json',JSON.stringify(Object.keys(pages),null,2));
write('research/build-manifest.json',JSON.stringify({environment:config.environment,origin:config.origin,indexable:config.indexable,pages:Object.keys(pages),indexablePages:eligible,html:generated,social:Object.keys(pages).map(s=>s.replaceAll('/','-')+'.png')},null,2));
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
// Vercel reads redirects before running the build. Never ship draft-only redirects
// in the checked-in platform config, even when local review includes drafts.
const publishedAliases=Object.entries(aliases).filter(([,to])=>!insights.all.some(a=>insights.route(a)===to&&a.status!=='published'));
vercel.redirects=[{source:'/index.html',destination:'/',permanent:true},...Object.entries(retired).map(([from,to])=>({source:'/'+from+'.html',destination:'/'+to+'.html',permanent:true})),...publishedAliases.flatMap(([from,to])=>['/'+from,'/'+from+'/'].map(source=>({source,destination:'/'+to+'.html',permanent:true})))];
write('vercel.json',JSON.stringify(vercel,null,2)+'\n');
console.log(Object.keys(pages).length+' páginas geradas em '+out+'; ambiente '+config.environment+'; '+eligible.length+' URLs no sitemap.');
