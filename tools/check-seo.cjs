const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const pages=require('../research/pages.json');
const {origin,url}=require('../src/seo.cjs');
const titles=new Set(),descriptions=new Set(),sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const slug of pages){
 const html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];
 const description=html.match(/<meta name="description" content="([^"]*)">/)?.[1];
 assert.ok(title&&description,`${slug}: title/description missing`);
 assert.ok(!titles.has(title)&&!descriptions.has(description),`${slug}: duplicate metadata`);
 titles.add(title);descriptions.add(description);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${slug}: expected one H1`);
 assert.ok(html.includes(`<link rel="canonical" href="${url(slug)}">`),`${slug}: canonical`);
 assert.ok(sitemap.includes(`<loc>${url(slug)}</loc>`),`${slug}: sitemap`);
 assert.ok(html.includes('<meta property="og:url"')&&html.includes('<meta name="twitter:card"'),`${slug}: social metadata`);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(graph['@context'],'https://schema.org');
 assert.ok(graph['@graph'].some(node=>node.url===url(slug)),`${slug}: page schema URL`);
 for(const image of [...html.matchAll(/<img[^>]*src="([^"]+)"/g),...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)]){
  const local=image[1].startsWith(origin)?new URL(image[1]).pathname.slice(1):image[1];
  if(!/^https?:/.test(local))assert.ok(fs.existsSync(path.join(root,local)),`${slug}: missing image ${local}`);
 }
 assert.ok(fs.readFileSync(path.join(root,'dist',slug+'.html'),'utf8').includes(url(slug)),`${slug}: deployment output stale`);
}
assert.equal((sitemap.match(/<url>/g)||[]).length,pages.length);
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes(origin+'/sitemap.xml'));
for(const file of ['robots.txt','sitemap.xml'])assert.ok(fs.existsSync(path.join(root,'dist',file)),`${file}: missing deployment artifact`);
const redirects=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).redirects;
for(const r of redirects){assert.equal(r.permanent,true);assert.ok(r.destination==='/'||fs.existsSync(path.join(root,r.destination.slice(1))),`redirect target missing: ${r.destination}`);}
console.log(`SEO verificado: ${pages.length} páginas, metadados únicos, um H1 por página, canonical, sitemap, JSON-LD, imagens e ${redirects.length} redirecionamentos.`);
