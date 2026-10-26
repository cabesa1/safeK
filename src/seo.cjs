const {applications,articles}=require('./content.cjs');
const config=require('./site-config.cjs');
const {origin,indexable}=config;
const insights=require('./insights.cjs');
const robots=indexable?'index,follow,max-image-preview:large':'noindex,follow,max-image-preview:large';
const url=slug=>origin+(slug==='index'?'/':'/'+slug+'.html');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const metadata={
 index:['SAFE-K | Controle de celulares em escolas, empresas e eventos','Crie ambientes sem uso de celular com a bolsa SAFE-K. O aparelho permanece com seu dono e é acessado nos pontos de desbloqueio. Conheça a solução.'],
 sobre:['Sobre a SAFE-K | Solução para ambientes sem celular','Conheça a SAFE-K, solução da GlobalK para guardar o celular com seu dono durante aulas, reuniões e eventos, com acesso em bases de desbloqueio.'],
 'como-funciona':['Como funciona a bolsa para celular SAFE-K','Entenda como guardar e travar o celular na bolsa SAFE-K, manter o aparelho com você e desbloqueá-lo nas bases indicadas pela organização.'],
 'onde-usar':['Onde usar a SAFE-K | Escolas, empresas e eventos','Veja as aplicações da bolsa SAFE-K em escolas, empresas, eventos privados e festas. Conheça como organizar momentos sem uso de celular no seu espaço.'],
 escolas:['Controle de celulares nas escolas | Bolsa com trava SAFE-K','Organize uma rotina sem uso de celular na escola com a SAFE-K. O aluno mantém o aparelho consigo, com acesso nos pontos de desbloqueio definidos pela equipe.'],
 empresas:['Bolsa para celular em empresas e reuniões | SAFE-K','Conheça a bolsa SAFE-K para reuniões, treinamentos e ambientes de trabalho. Organize a guarda e o acesso ao celular mantendo o aparelho com o colaborador.'],
 eventos:['Eventos privados e festas sem celular | SAFE-K','Crie eventos privados e festas com mais presença. A bolsa SAFE-K fica com o convidado e permite acesso ao celular nos pontos de desbloqueio do evento.'],
 contato:['Contato SAFE-K | Solicite uma demonstração','Solicite uma demonstração da bolsa SAFE-K para sua escola, empresa ou evento. Fale com a equipe e veja como chegar à GlobalK em Sorocaba, São Paulo.'],
 duvidas:['Dúvidas sobre a bolsa para celular SAFE-K','Saiba quem fica com o celular, como desbloquear a bolsa SAFE-K e como organizar o acesso ao aparelho durante aulas, reuniões e eventos.'],
 imprensa:['Imprensa e conteúdo sobre ambientes sem celular | SAFE-K','Explore o acervo editorial SAFE-K sobre celulares nas escolas, atenção, convivência e experiências sem distrações digitais.'],
 privacidade:['Privacidade e cookies | SAFE-K','Entenda as preferências de cookies, o formulário de contato e o carregamento opcional de mapas no site da SAFE-K.'],
 'celulares-nas-escolas':['Celulares nas escolas: atenção e convivência | SAFE-K','Leia a síntese editorial do acervo SAFE-K sobre celulares nas escolas, atenção nas atividades e convivência entre os estudantes.'],
 'educacao-e-tecnologia':['Celulares e educação: o debate sobre o uso | SAFE-K','Conheça perspectivas do acervo editorial SAFE-K sobre o uso consciente da tecnologia, os celulares na escola e a atenção às atividades pedagógicas.'],
 'festas-sem-celulares':['Festas sem celulares: presença entre convidados | SAFE-K','Conheça uma referência editorial sobre festas sem celulares e a importância de explicar a guarda e o acesso ao aparelho aos convidados.'],
 'presenca-nos-shows':['Experiências sem celulares: música e presença | SAFE-K','Leia a síntese editorial do acervo SAFE-K sobre música, convivência e experiências com pausa no uso de celulares.']
};
function pageIsIndexable(slug){
 const insight=insights.all.find(a=>insights.route(a)===slug);
 return indexable&&(!insight||insight.status==='published')&&(slug!=='insights'||insights.visible.some(a=>a.status==='published'));
}
function pageMetadata(slug){
 const insight=insights.all.find(a=>insights.route(a)===slug);
 return insight?[insight.seoTitle,insight.description]:slug==='insights'?['Insights SAFE-K | Celulares e rotina escolar','Orientações para escolas sobre celulares, legislação e implementação de políticas institucionais. Conheça os artigos educativos da SAFE-K.']:metadata[slug];
}
function enrich(slug,html){
 html=html.replace('<link rel="stylesheet" href="assets/fonts/fonts.css">','<link rel="preload" href="assets/fonts/manrope-0.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/manrope-4.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="assets/fonts/fonts.css">');
 if(config.environment==='production')html=html.replace(/<p class="source-note">.*?<\/p><a class="button button-secondary"[^>]*>.*?<\/a>/s,'<p class="source-note">Síntese editorial do acervo SAFE-K. A preservação dos textos completos e referências deve ser revisada antes da migração do acervo.</p>');
 const [title,description]=pageMetadata(slug);
 const insight=insights.all.find(a=>insights.route(a)===slug);
 const pageRobots=pageIsIndexable(slug)?'index,follow,max-image-preview:large':'noindex,follow,max-image-preview:large';
 const robots=pageRobots;
 const canonical=url(slug),article=articles.find(a=>a.slug===slug),application=applications.find(a=>a.slug===slug);
 const image=origin+'/assets/social/'+slug.replaceAll('/','-')+'.png';
 const graph=[
  {'@type':'Organization','@id':origin+'/#organization',name:'SAFE-K',url:origin+'/',logo:origin+'/assets/identidade-preta.png',sameAs:['https://www.instagram.com/safek.vc'],telephone:'+551531424183',email:'safek@globalk.com.br',address:{'@type':'PostalAddress',streetAddress:'Rod. Raposo Tavares, km 99 — Galpão E, Vila Artura',addressLocality:'Sorocaba',addressRegion:'SP',addressCountry:'BR'}},
  {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'SAFE-K',inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}},
  {'@type':slug==='contato'?'ContactPage':slug==='sobre'?'AboutPage':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'pt-BR',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#organization'}}
 ];
 graph[0].contactPoint={'@type':'ContactPoint',contactType:'customer service',email:'safek@globalk.com.br',telephone:'+551531424183',availableLanguage:'pt-BR'};
 if(slug!=='index'){
  const trail=[{name:'Início',item:url('index')}];
  if(application)trail.push({name:'Onde usar',item:url('onde-usar')});
  if(article)trail.push({name:'Imprensa',item:url('imprensa')});
  if(insight)trail.push({name:'Insights',item:url('insights')});
  trail.push({name:application?application.name:article?article.title:title.replace(/ \| SAFE-K$/,''),item:canonical});
  graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumbs',itemListElement:trail.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))});
  graph[2].breadcrumb={'@id':canonical+'#breadcrumbs'};
 }
 if(slug==='como-funciona')graph.push({'@type':'Product','@id':canonical+'#product',name:'Bolsa SAFE-K para celular',description:'Bolsa com fechamento para guardar o celular durante atividades, mantendo o aparelho com seu dono e permitindo abertura nas bases de desbloqueio.',image:origin+'/assets/produto-real-2026-09.webp',brand:{'@type':'Brand',name:'SAFE-K'}});
 // Legacy archive summaries remain WebPage entities: original author/dates are unavailable.
 if(insight?.status==='published')graph.push({'@type':'BlogPosting','@id':canonical+'#article',headline:insight.title,description,image,author:{'@type':insight.author.type,name:insight.author.name},datePublished:insight.publishedAt,dateModified:insight.modifiedAt,mainEntityOfPage:{'@id':canonical+'#webpage'},publisher:{'@id':origin+'/#organization'},inLanguage:'pt-BR'});
 const head=`<link rel="canonical" href="${canonical}"><meta name="robots" content="${robots}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="SAFE-K"><meta property="og:type" content="${article||insight?.status==='published'?'article':'website'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${escape(insight?insight.title:article?article.title:application?application.name+' — SAFE-K':'SAFE-K — Resgatando o foco e presença')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${image}"><link rel="icon" type="image/png" href="/assets/identidade-preta.png"><script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`;
 const verification=[['GOOGLE_SITE_VERIFICATION','google-site-verification'],['BING_SITE_VERIFICATION','msvalidate.01']].filter(([env])=>process.env[env]).map(([env,name])=>`<meta name="${name}" content="${escape(process.env[env])}">`).join('');
 const integration=`<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">${verification}<script type="application/json" id="safek-analytics-config">${json(config.analytics)}</script><script src="/analytics.js" defer></script>`;
 let result=html.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(description)}">`).replace('</head>',head+integration+'</head>').replaceAll('href="index.html"','href="/"');
 if(slug.includes('/'))result=result.replace(/\b(href|src)="(?![a-z]+:|\/|#)([^"]+)"/gi,'$1="/$2"').replace(/srcset="([^"]+)"/g,(_,set)=>'srcset="'+set.split(',').map(item=>'/'+item.trim()).join(', ')+'"');
 return result;
}
module.exports={enrich,url,origin,metadata,indexable,robots,pageIsIndexable,pageMetadata};
