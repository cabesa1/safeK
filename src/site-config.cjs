function configuration(env=process.env){
 const environment=env.SAFEK_SITE_ENV||'staging';
 if(!['staging','production'].includes(environment))throw new Error('SAFEK_SITE_ENV deve ser staging ou production.');
 function origin(value){
  const parsed=new URL(value);
  if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw new Error('A URL do site deve ser uma origem HTTP(S), sem caminho, credenciais ou parâmetros.');
  return parsed.origin;
 }
 const productionOrigin=origin(env.PRODUCTION_SITE_URL||'https://safek.com.br');
 if(productionOrigin!=='https://safek.com.br')throw new Error('O domínio de produção aprovado é https://safek.com.br.');
 const stagingOrigin=origin(env.SEO_SITE_URL||'https://safek-one.vercel.app');
 if(environment==='staging'&&/(^|\.)safek\.com\.br$/.test(new URL(stagingOrigin).hostname))throw new Error('A prévia não deve usar o domínio oficial como origem.');
 const indexable=environment==='production'&&env.SEO_ALLOW_INDEXING==='true';
 const measurementId=env.SAFEK_GA_MEASUREMENT_ID||'';
 const analyticsEnabled=environment==='production'&&indexable&&env.SAFEK_ANALYTICS_ENABLED==='true';
 if(analyticsEnabled&&!/^G-[A-Z0-9]+$/.test(measurementId))throw new Error('Configure um ID GA4 válido antes de ativar analytics.');
 return {environment,productionOrigin,origin:environment==='production'?productionOrigin:stagingOrigin,indexable,
  includeDrafts:environment==='staging'&&env.VERCEL!=='1'&&env.SAFEK_INCLUDE_DRAFTS!=='false',
  analytics:{enabled:analyticsEnabled,measurementId:analyticsEnabled?measurementId:null}};
}
module.exports={configuration,...configuration()};
