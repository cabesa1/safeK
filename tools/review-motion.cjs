const {chromium}=require(process.env.SAFEK_PLAYWRIGHT || 'playwright');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:3014/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('.hero').evaluate(el=>getComputedStyle(el).position),'sticky');
    await page.mouse.move(1080,350);
    await page.waitForFunction(()=>document.querySelector('.pouch-wrap').style.transform.includes('rotateY'));
    await page.locator('.desktop-nav a[href="#como-funciona"]').click();
    await page.waitForFunction(()=>{const r=document.querySelector('#como-funciona').getBoundingClientRect();return r.top>=0&&r.top<35;});
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('#como-title')).opacity==='1');
    await page.locator('.how').screenshot({path:path.resolve(__dirname,'../qa/how-desktop.png')});
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.hero').evaluate(el=>getComputedStyle(el).position),'relative');
    assert.deepEqual(errors,[]);
    console.log('PASS: desktop sticky transition, spring interaction, anchor navigation, reveals, reduced-motion change, no JS errors.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
