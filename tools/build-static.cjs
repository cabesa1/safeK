const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),generated=path.resolve(process.env.SAFEK_BUILD_DIR||root),out=path.join(generated,'dist');
const manifest=JSON.parse(fs.readFileSync(path.join(generated,'research/build-manifest.json'),'utf8'));
for(const image of manifest.social)if(!fs.existsSync(path.join(root,'assets/social',image)))throw Error('Missing social image '+image+'. Generate branded cards with tools/build-social.cjs before packaging.');
if(path.resolve(out)!==path.resolve(generated,'dist')||out===root||path.basename(out)!=='dist')throw Error('Unsafe output directory');
// Only generated build artifacts under the validated dist target are replaced.
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of [...manifest.html,'robots.txt','sitemap.xml']){
 const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(generated,file),target);
}
for(const file of ['styles.css','app.js','privacy.js','analytics.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for(const file of fs.readdirSync(path.join(out,'assets/social')))if(!manifest.social.includes(file))fs.rmSync(path.join(out,'assets/social',file));
console.log('Static output: '+out+'; '+manifest.html.length+' explicitly listed HTML artifacts; no stale drafts copied.');
