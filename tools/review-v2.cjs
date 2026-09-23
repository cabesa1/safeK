const {chromium}=require(process.env.SAFEK_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa','v2');fs.mkdirSync(out,{recursive:true});
const pages=JSON.parse(fs.readFileSync(path.join(root,'research','pages.json'),'utf8'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const failures=[],errors=[],checks=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const name of pages){
   await page.goto(`http://127.0.0.1:3014/${name}.html`,{waitUntil:'load'});
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:width<600?844:1000});
    const result=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,missingImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),font:getComputedStyle(document.querySelector('h1')).fontFamily,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));
    if(result.documentWidth>width||result.h1!==1||result.missingImages.length||result.brokenAnchors.length)failures.push({name,...result});
    checks.push({page:name,width,pass:result.documentWidth===width&&result.h1===1&&!result.missingImages.length&&!result.brokenAnchors.length});
    if(['index','onde-usar','escolas','contato'].includes(name)&&[390,1440].includes(width)){
     await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});
     if(name==='index')await page.screenshot({path:path.join(out,`hero-${width}.png`)});
    }
   }
   const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).filter(h=>h&&!/^(?:https?:|mailto:|tel:|#)/.test(h)));
   for(const link of links){const file=link.split(/[?#]/)[0];if(!fs.existsSync(path.join(root,file)))failures.push({page:name,brokenLink:link});}
   console.log(`Checked ${name} at 4 widths`);
  }
  await page.goto('http://127.0.0.1:3014/index.html');
  await page.getByRole('button',{name:'Abrir aplicações',exact:true}).click();assert.equal(await page.locator('#applications-menu').isVisible(),true);assert.equal(await page.locator('.mega-links a').count(),8);await page.keyboard.press('Escape');assert.equal(await page.locator('#applications-menu').isVisible(),false);
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Abrir menu',exact:true}).click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
  await page.goto('http://127.0.0.1:3014/onde-usar.html');await page.locator('[data-filter="educacao"]').click();assert.equal(await page.locator('.application-grid .application-card:visible').count(),2);
  await page.locator('[data-filter="all"]').click();await page.locator('#application-search').fill('hospitais');assert.equal(await page.locator('.application-grid .application-card:visible').count(),1);await page.locator('#application-search').fill('nenhumresultado');assert.equal(await page.locator('#empty-state').isVisible(),true);await page.locator('#reset-filters').click();assert.equal(await page.locator('.application-grid .application-card:visible').count(),8);
  await page.goto('http://127.0.0.1:3014/contato.html?ambiente=Escolas');assert.equal(await page.locator('#segment').inputValue(),'Escolas');assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),false);
  await page.locator('[name="name"]').fill('Pessoa de teste');await page.locator('[name="email"]').fill('teste@example.com');await page.locator('[name="institution"]').fill('Instituição de teste');await page.locator('[name="message"]').fill('Verificação local, sem envio de mensagem.');await page.getByRole('button',{name:'Preparar mensagem',exact:true}).click();assert.equal(await page.locator('#message-preview').isVisible(),true);assert((await page.locator('#draft-email').getAttribute('href')).startsWith('mailto:safek@safek.com.br?'));await page.locator('#draft-text').fill('Mensagem revisada localmente');assert(decodeURIComponent(await page.locator('#draft-email').getAttribute('href')).includes('Mensagem revisada localmente'));
  await page.goto('http://127.0.0.1:3014/duvidas.html');await page.locator('.faq-list summary').first().click();assert.equal(await page.locator('.faq-list details').first().evaluate(d=>d.open),true);
  await page.goto('http://127.0.0.1:3014/escolas/');await page.waitForURL('**/escolas.html');
  // Verify a direct-file opening with network disabled; every visual asset and font is local.
  await page.route(/^https?:/,r=>r.abort());await page.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/'));await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('h1').count(),1);
  const results={pages:pages.length,layouts:checks.length,failures,errors,checks,interactions:'Menu desktop e móvel, oito aplicações, filtros e busca, FAQ, seleção de contexto, validação, mensagem editável, link de e-mail, redirecionamento e arquivo local. Nenhuma mensagem enviada.'};
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({pages:pages.length,layouts:checks.length,failures,errors},null,2));assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
