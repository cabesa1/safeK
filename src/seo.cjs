const {applications,articles}=require('./content.cjs');
const origin=new URL(process.env.SEO_SITE_URL||'https://safek.com.br').origin;
const url=slug=>origin+(slug==='index'?'/':'/'+slug+'.html');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const metadata={
 index:['SAFE-K | Bolsa para celular em escolas, empresas e eventos','Crie ambientes sem uso de celular com a bolsa SAFE-K. O aparelho permanece com seu dono e é acessado nos pontos de desbloqueio. Conheça a solução.'],
 sobre:['Sobre a SAFE-K | Solução para ambientes sem celular','Conheça a SAFE-K, solução da GlobalK para guardar o celular com seu dono durante aulas, reuniões e eventos, com acesso em bases de desbloqueio.'],
 'como-funciona':['Como funciona a bolsa para celular SAFE-K','Entenda como guardar e travar o celular na bolsa SAFE-K, manter o aparelho com você e desbloqueá-lo nas bases indicadas pela organização.'],
 'onde-usar':['Onde usar a SAFE-K | Escolas, empresas e eventos','Veja as aplicações da bolsa SAFE-K em escolas, empresas, eventos privados e festas. Conheça como organizar momentos sem uso de celular no seu espaço.'],
 escolas:['Bolsa para celular nas escolas | SAFE-K','Organize uma rotina sem uso de celular na escola com a SAFE-K. O aluno mantém o aparelho consigo, com acesso nos pontos de desbloqueio definidos pela equipe.'],
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
function enrich(slug,html){
 const [title,description]=metadata[slug];
 const canonical=url(slug),article=articles.find(a=>a.slug===slug),application=applications.find(a=>a.slug===slug);
 const image=origin+'/assets/'+(article?article.image+'.webp':application?application.slug+'.webp':'identidade-horizontal.png');
 const graph=[
  {'@type':'Organization','@id':origin+'/#organization',name:'SAFE-K',url:origin+'/',logo:origin+'/assets/identidade-preta.png',sameAs:['https://www.instagram.com/safek.vc'],telephone:'+551531424183',email:'safek@globalk.com.br',address:{'@type':'PostalAddress',streetAddress:'Rod. Raposo Tavares, km 99 — Galpão E, Vila Artura',addressLocality:'Sorocaba',addressRegion:'SP',addressCountry:'BR'}},
  {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'SAFE-K',inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}},
  {'@type':slug==='contato'?'ContactPage':slug==='sobre'?'AboutPage':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'pt-BR',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#organization'}}
 ];
 if(slug!=='index'){
  const trail=[{name:'Início',item:url('index')}];
  if(application)trail.push({name:'Onde usar',item:url('onde-usar')});
  if(article)trail.push({name:'Imprensa',item:url('imprensa')});
  trail.push({name:application?application.name:article?article.title:title.replace(/ \| SAFE-K$/,''),item:canonical});
  graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumbs',itemListElement:trail.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))});
  graph[2].breadcrumb={'@id':canonical+'#breadcrumbs'};
 }
 if(slug==='como-funciona')graph.push({'@type':'Product','@id':canonical+'#product',name:'Bolsa SAFE-K para celular',description:'Bolsa com fechamento para guardar o celular durante atividades, mantendo o aparelho com seu dono e permitindo abertura nas bases de desbloqueio.',image:origin+'/assets/produto-real-2026-09.png',brand:{'@type':'Brand',name:'SAFE-K'}});
 if(article)graph.push({'@type':'Article','@id':canonical+'#article',headline:article.title,description:article.intro,image,mainEntityOfPage:{'@id':canonical+'#webpage'},publisher:{'@id':origin+'/#organization'},inLanguage:'pt-BR'});
 const head=`<link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="SAFE-K"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${escape(article?article.title:application?application.name+' — SAFE-K':'SAFE-K — Resgatando o foco e presença')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${image}"><link rel="icon" type="image/png" href="/assets/identidade-preta.png"><script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`;
 return html.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(description)}">`).replace('</head>',head+'</head>').replaceAll('href="index.html"','href="/"');
}
module.exports={enrich,url,origin,metadata};
