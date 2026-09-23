const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.SAFEK_SHARP||'sharp');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets');
const urls={
 'escolas':'https://safek.com.br/wp-content/uploads/2025/05/desafios-da-adolescencia-como-a-escola-pode-ajudar-o-aluno-1-scaled-1.jpg',
 'universidades':'https://safek.com.br/wp-content/uploads/2025/09/woman-is-sitting-table-library-reading-book-scaled.jpg',
 'empresas':'https://safek.com.br/wp-content/uploads/2025/09/smiling-multiracial-coworkers-working-together-office-meeting-have-discussion-scaled.jpg',
 'eventos':'https://safek.com.br/wp-content/uploads/2025/09/shows-ao-vivo.jpg',
 'festas':'https://safek.com.br/wp-content/uploads/2025/09/groom-carries-charming-bride-his-arms-1-scaled.jpg',
 'tribunais':'https://safek.com.br/wp-content/uploads/2025/09/advocacia-publica-municipal-scaled-1.webp',
 'acampamentos':'https://safek.com.br/wp-content/uploads/2025/09/playing-park-together-kids-children-together-scaled.jpg',
 'hospitais':'https://safek.com.br/wp-content/uploads/2025/09/team-young-specialist-doctors-standing-corridor-hospital-scaled.jpg',
 'imprensa-escolas':'https://safek.com.br/wp-content/uploads/2025/09/de2e1230-e25a-11ef-9895-2b17c6c3968e.jpg.webp',
 'imprensa-festas':'https://safek.com.br/wp-content/uploads/2025/09/istockphoto-1495390702-612x612-1.jpg',
 'imprensa-musica':'https://safek.com.br/wp-content/uploads/2025/09/download-1024x683.jpg'
};
(async()=>{
 const entries=Object.entries(urls);
 for(let i=0;i<entries.length;i+=4) await Promise.all(entries.slice(i,i+4).map(async([name,url])=>{
  if(fs.existsSync(path.join(dir,`${name}.webp`))&&fs.existsSync(path.join(dir,`${name}-small.webp`)))return;
  let r;for(let attempt=0;attempt<2;attempt++){try{r=await fetch(url,{signal:AbortSignal.timeout(30000)});break;}catch(e){if(attempt===1)throw e;}}
  if(!r.ok)throw Error(`${name}: ${r.status}`);
  const buf=Buffer.from(await r.arrayBuffer());await sharp(buf).resize({width:1400,withoutEnlargement:true}).webp({quality:84}).toFile(path.join(dir,`${name}.webp`));
  await sharp(buf).resize({width:700,withoutEnlargement:true}).webp({quality:80}).toFile(path.join(dir,`${name}-small.webp`));console.log(name);
 }));
 await sharp(path.join(dir,'produto-studio-v2.png')).resize({width:1100,withoutEnlargement:true}).webp({quality:90}).toFile(path.join(dir,'produto-studio-v2.webp'));
 await sharp(path.join(dir,'produto-studio-v2.png')).resize({width:650,withoutEnlargement:true}).webp({quality:86}).toFile(path.join(dir,'produto-studio-v2-small.webp'));
 // Download the font CSS and all referenced subsets, preserving the vendor CSS.
 const url='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
 const css=await(await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}})).text();
 const fontDir=path.join(dir,'fonts');fs.mkdirSync(fontDir,{recursive:true});let local=css;
 const fonts=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
 for(let i=0;i<fonts.length;i++){const name=`manrope-${i}.${fonts[i].includes('.woff2')?'woff2':'ttf'}`;const r=await fetch(fonts[i]);if(!r.ok)throw Error('Font download failed');fs.writeFileSync(path.join(fontDir,name),Buffer.from(await r.arrayBuffer()));local=local.split(fonts[i]).join(name);}
 fs.writeFileSync(path.join(fontDir,'fonts.css'),local);fs.writeFileSync(path.join(root,'research','image-sources.json'),JSON.stringify(urls,null,2));
 console.log(`Prepared ${entries.length} contextual photos, product, and ${fonts.length} local font files.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
