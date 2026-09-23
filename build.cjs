const fs=require('node:fs'),path=require('node:path');
const views=require('./src/templates.cjs');
const {applications,articles}=require('./src/content.cjs');
const pages={index:views.home(),sobre:views.about(),'como-funciona':views.how(),'onde-usar':views.applicationsPage(),imprensa:views.press(),contato:views.contact(),duvidas:views.faqPage()};
for(const item of applications)pages[item.slug]=views.applicationPage(item);
for(const item of articles)pages[item.slug]=views.article(item);
for(const [name,html] of Object.entries(pages))fs.writeFileSync(path.join(__dirname,name+'.html'),html);
const aliases={'sobre-nos':'sobre',...Object.fromEntries(applications.map(a=>[a.slug,a.slug])),'onde-usar':'onde-usar'};
for(const a of articles)aliases[new URL(a.original).pathname.split('/').filter(Boolean)[0]]=a.slug;
for(const [from,to] of Object.entries(aliases)){const dir=path.join(__dirname,from);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=../${to}.html"><title>SAFE-K</title></head><body><a href="../${to}.html">Acessar a página SAFE-K</a></body></html>`);}
fs.writeFileSync(path.join(__dirname,'research','pages.json'),JSON.stringify(Object.keys(pages),null,2));
console.log(`${Object.keys(pages).length} páginas geradas. ${Object.keys(aliases).length} endereços anteriores preservados.`);
