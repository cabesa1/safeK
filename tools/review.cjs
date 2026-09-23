const { chromium } = require(process.env.SAFEK_PLAYWRIGHT || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const out = path.resolve(__dirname,'../qa'); fs.mkdirSync(out,{recursive:true});
  const errors=[]; const results=[];
  for (const width of [320,390,768,1024,1440,1920]) {
    const page = await browser.newPage({viewport:{width,height:width<600?844:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:3014/',{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode();}));});
    const data=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.querySelector(a.getAttribute('href'))).length}));
    assert.equal(data.scrollWidth,width,`Horizontal overflow at ${width}`); assert.equal(data.h1,1);assert.deepEqual(data.missingImages,[]);assert.equal(data.brokenAnchors,0);
    if(width===390){
      await page.getByRole('button',{name:'Abrir menu'}).click(); assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
      await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
      await page.getByRole('button',{name:'Abrir menu'}).click();await page.locator('dialog a[href="#como-funciona"]').click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
      for(const step of [1,2,0]){await page.locator(`[data-step="${step}"]`).click();assert.equal(await page.locator(`[data-step="${step}"]`).getAttribute('aria-expanded'),'true');await page.waitForFunction(()=>document.querySelector('#step-image').complete&&document.querySelector('#step-image').naturalWidth>0);}
      await page.locator('summary').nth(2).click();assert.equal(await page.locator('details').nth(2).evaluate(d=>d.open),true);
      await page.locator('.use-card[data-segment="Empresas"]').click();assert.equal(await page.locator('#segment').inputValue(),'Empresas');
      assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),false);
      await page.locator('#name').fill('Pessoa de teste');await page.locator('#email').fill('teste@example.com');await page.locator('#institution').fill('Instituição de teste');await page.locator('#message').fill('Prévia local, sem envio.');
      assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),true);
      await page.getByRole('button',{name:'Preparar meu e-mail'}).click();const href=await page.locator('#form-status a').getAttribute('href');assert(href.startsWith('mailto:safek@safek.com.br?'));assert(decodeURIComponent(href).includes('Instituição de teste'));
      await page.goto('http://127.0.0.1:3014/',{waitUntil:'networkidle'});
      await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
    }
    if([390,1440].includes(width)){await page.screenshot({path:path.join(out,`safek-${width}.png`),fullPage:true});await page.screenshot({path:path.join(out,`hero-${width}.png`)});}
    results.push(data);await page.close();
  }
  // Verify the self-contained file without a local web server.
  const offline=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await offline.route(/^https?:/,r=>r.abort());
  await offline.goto('file:///'+path.resolve(__dirname,'../index.html').replaceAll('\\','/'));
  await offline.locator('[data-step="2"]').click();await offline.waitForFunction(()=>document.querySelector('#step-image').complete&&document.querySelector('#step-image').naturalWidth>0);
  assert.equal(await offline.evaluate(()=>document.documentElement.scrollWidth),390);
  assert.deepEqual(errors,[]);await browser.close();
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors,offline:true,checked:['menu open, Escape and anchor close','three product steps','FAQ','segment preselection','native form validation','mailto draft contents; no email sent','images and anchors','self-contained offline file']},null,2));
  console.log(JSON.stringify({results,errors,offline:true},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
