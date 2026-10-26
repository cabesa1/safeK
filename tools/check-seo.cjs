const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.SAFEK_BUILD_DIR||path.resolve(__dirname,'..'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'research/build-manifest.json'),'utf8'));
const seo=require('../src/seo.cjs'),insights=require('../src/insights.cjs');
const titles=new Set(),descriptions=new Set(),sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const slug of manifest.pages){
 const html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/<meta name="description" content="([^"]*)">/)?.[1];
 assert(title&&description&&!titles.has(title)&&!descriptions.has(description),slug+': unique metadata');titles.add(title);descriptions.add(description);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,slug+': one H1');
 assert(html.includes('<link rel="canonical" href="'+seo.url(slug)+'">'),slug+': canonical');
 assert(html.includes('name="robots" content="'+(seo.pageIsIndexable(slug)?'index,':'noindex,')),slug+': robots');
 assert.equal(sitemap.includes('<loc>'+seo.url(slug)+'</loc>'),seo.pageIsIndexable(slug),slug+': sitemap membership');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(graph['@context'],'https://schema.org');assert(graph['@graph'].some(n=>n.url===seo.url(slug)));
 const insight=insights.all.find(a=>insights.route(a)===slug);
 if(insight?.status==='draft')assert(!graph['@graph'].some(n=>n['@type']==='BlogPosting'));
 for(const image of [...html.matchAll(/<img[^>]*src="([^"]+)"/g),...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)]){
  const local=new URL(image[1],'https://local.test/'+slug+'.html').pathname.slice(1);
  assert(fs.existsSync(path.join(root,'dist',local)),slug+': deployed image '+local);
  if(local.startsWith('assets/social/')){const png=fs.readFileSync(path.join(root,'dist',local));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);}
 }
 assert(fs.readFileSync(path.join(root,'dist',slug+'.html'),'utf8').includes(seo.url(slug)),slug+': artifact');
}
assert.equal((sitemap.match(/<url>/g)||[]).length,manifest.indexablePages.length);
assert.equal(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap:'),manifest.indexable);
const redirects=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).redirects;
assert.equal(new Set(redirects.map(r=>r.source)).size,redirects.length);
for(const r of redirects){assert(r.permanent);assert(r.destination==='/'||fs.existsSync(path.join(root,'dist',r.destination.slice(1))),r.source+': redirect target');}
console.log(JSON.stringify({pages:manifest.pages.length,indexable:manifest.indexablePages.length,redirects:redirects.length,uniqueMetadata:true,canonical:true,schemaSyntax:true,images:true},null,2));
