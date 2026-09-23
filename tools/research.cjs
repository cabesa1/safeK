const fs=require('node:fs'),path=require('node:path');
const base='https://safek.com.br/';
const routes=['escolas/','universidades/','empresas/','eventos/','festas/','tribunais/','acampamentos/','onde-usar','lightskyblue-woodcock-698069-hostingersite-com-sobre','restricao-ao-uso-do-celular-nas-escolas-ja-esta-valendo','proibicao-de-celulares-nas-escolas-levanta-debate-sobre-educacao','convidando-seus-convidados-para-uma-festa-sem-convidar-seus-celulares','dentro-do-juke-joint-perfeito-e-misterioso-de-dave-chappelle-no-all-star-weekend'];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n));
const plain=s=>decode(s.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')).trim();
(async()=>{
 const out=path.resolve(__dirname,'../research');fs.mkdirSync(out,{recursive:true});const results=[];
 for(let i=0;i<routes.length;i+=4){await Promise.all(routes.slice(i,i+4).map(async route=>{
  try {const response=await fetch(base+route,{signal:AbortSignal.timeout(40000)});const html=await response.text();
   const css=[...html.matchAll(/href=['"]([^'"]+\/post-\d+\.css[^'"]*)/g)].map(x=>decode(x[1]));
   const cssText=(await Promise.all(css.map(async url=>{try{return await(await fetch(url,{signal:AbortSignal.timeout(20000)})).text()}catch{return ''}}))).join('\n');
   const images=[...new Set([...html.matchAll(/(?:src|data-src)=['"]([^'"]+\/uploads\/[^'"]+)['"]/g),...cssText.matchAll(/url\(['"]?([^)'"\s]+\/uploads\/[^)'"\s]+)['"]?\)/g)].map(x=>decode(x[1])))];
   const links=[...html.matchAll(/<a\b[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi)].map(x=>({url:decode(x[1]),text:plain(x[2])})).filter(x=>x.text);
   const item={route,status:response.status,url:response.url,text:plain(html),images,links};results.push(item);console.log(JSON.stringify(item));
  }catch(error){results.push({route,error:error.message});console.log(JSON.stringify({route,error:error.message}));}
 }));}
 fs.writeFileSync(path.join(out,'sources.json'),JSON.stringify(results,null,2));
})();
