const fs=require('node:fs'),path=require('node:path');
const config=require('./site-config.cjs');
const directory=path.join(__dirname,'..','content','insights');
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
function validate(article){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)||!['draft','published'].includes(article.status))throw new Error('Slug ou status inválido no Insights.');
 for(const key of ['title','seoTitle','description','summary','category'])if(typeof article[key]!=='string'||!article[key].trim())throw new Error(`Campo ${key} ausente: ${article.slug}`);
 if(!Array.isArray(article.sections)||!article.sections.length||!Array.isArray(article.sources))throw new Error(`Conteúdo ou fontes ausentes: ${article.slug}`);
 const sourceIds=new Set(article.sources.map(source=>source.id));
 if(sourceIds.size!==article.sources.length||!validDate(article.sourcesCheckedAt))throw new Error('Fontes duplicadas ou data de consulta inválida.');
 const sectionIds=new Set();
 for(const source of article.sources)if(new URL(source.url).protocol!=='https:')throw new Error('Fontes devem usar HTTPS.');
 for(const section of article.sections){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id)||sectionIds.has(section.id))throw new Error('Identificador de seção inválido ou duplicado.');
  sectionIds.add(section.id);
  if(!section.heading||!Array.isArray(section.paragraphs))throw new Error(`Seção inválida: ${article.slug}`);
  for(const id of section.sourceIds||[])if(!sourceIds.has(id))throw new Error(`Fonte desconhecida: ${id}`);
 }
 if(article.status==='published'){
  if(!article.approvedForPublication||!article.sourcesVerified||!article.author?.name||!['Person','Organization'].includes(article.author.type)||!validDate(article.publishedAt)||!validDate(article.modifiedAt)||article.modifiedAt<article.publishedAt)throw new Error(`Publicação exige aprovação, fontes, autor e datas válidas: ${article.slug}`);
 }
 return article;
}
function loadInsights(options={}){
 const all=fs.readdirSync(options.directory||directory).filter(file=>file.endsWith('.json')).sort().map(file=>validate(JSON.parse(fs.readFileSync(path.join(options.directory||directory,file),'utf8'))));
 if(new Set(all.map(article=>article.slug)).size!==all.length)throw new Error('Slugs duplicados no Insights.');
 return all.filter(article=>article.status==='published'||options.includeDrafts);
}
const all=loadInsights({includeDrafts:true});
const visible=all.filter(article=>article.status==='published'||config.includeDrafts);
module.exports={all,visible,loadInsights,validate,validDate,route:article=>'insights/'+article.slug};
