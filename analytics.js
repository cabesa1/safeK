/* Disabled until production configuration AND explicit analytics consent.
   Existing cookie-notice dismissal is intentionally not treated as consent. */
(()=>{
 'use strict';
 const config=JSON.parse(document.querySelector('#safek-analytics-config')?.textContent||'{}');
 const allowed=new Set(['demo_cta_click','contact_email_click','contact_phone_click','email_draft_prepared','email_draft_open_attempt','insight_open']);
 let consent=false,loaded=false;
 const enabled=()=>config.enabled===true&&/^G-[A-Z0-9]+$/.test(config.measurementId||'')&&consent;
 function send(name){
  if(!allowed.has(name)||!enabled())return;
  window.gtag('event',name,{page_location:location.origin+location.pathname,page_title:'SAFE-K',send_to:config.measurementId});
 }
 window.safekAnalytics={track:send,setConsent(value){
  consent=value===true;
  if(!enabled()){
   window['ga-disable-'+config.measurementId]=true;
   if(loaded)window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied'});
   return;
  }
  window['ga-disable-'+config.measurementId]=false;
  if(loaded){window.gtag('consent','update',{analytics_storage:'granted'});return;}
  loaded=true;window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  window.gtag('config',config.measurementId,{send_page_view:false,page_location:location.origin+location.pathname,page_referrer:'',page_title:'SAFE-K',allow_google_signals:false,allow_ad_personalization_signals:false,ignore_referrer:true});
  window.gtag('event','page_view',{page_location:location.origin+location.pathname,page_referrer:'',page_title:'SAFE-K',send_to:config.measurementId});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.measurementId);document.head.append(script);
  if(location.pathname.startsWith('/insights/'))send('insight_open');
 }};
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href]');if(!anchor)return;
  const href=anchor.getAttribute('href');
  if(anchor.id==='draft-email')send('email_draft_open_attempt');
  else if(href.startsWith('mailto:'))send('contact_email_click');
  else if(href.startsWith('tel:'))send('contact_phone_click');
  else if(href.includes('contato.html')&&href.includes('solicitar-demonstracao'))send('demo_cta_click');
 });
 document.querySelector('#contact-form')?.addEventListener('submit',()=>{
  if(document.querySelector('#contact-form').checkValidity())send('email_draft_prepared');
 });
})();
