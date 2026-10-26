# SAFE-K — implementação SEO, GEO, Insights e pré-migração

## Atualização editorial — 26/10/2026

Após o primeiro deploy, o usuário aprovou expressamente os três artigos e pediu sua presença online. Os três passaram de draft para published, com autoria Equipe SAFE-K e publicação/modificação em 26/10/2026. Insights passa a aparecer na navegação, listagem e links de escolas. Cada artigo passa a ter BlogPosting e datas visíveis. Os testes de produção simulada passam a esperar 19 páginas e 19 URLs elegíveis no sitemap futuro, em vez de 16/15. No ambiente Vercel atual o site permanece staging/noindex e o sitemap continua vazio. Não houve autorização para mudar domínio/DNS, ativar analytics ou inventar credenciais/prova social. As seções abaixo registram o lote original e suas pendências na ocasião; a pendência de aprovação destes três artigos está resolvida.

Revisão local em 26/10/2026. Não houve commit, push, deploy, alteração de domínio/DNS, submissão a buscadores ou modificação do WordPress antigo. Este relatório substitui as orientações de ambiente dos relatórios anteriores.

## A. SEO técnico

Arquitetura confirmada: HTML estático, CSS e JavaScript, gerados por Node/CommonJS, sem framework nem dependências de runtime. Reutilizados shell, navegação, identidade, componentes de CTA, fontes e imagens existentes. Sem CMS, Next.js ou biblioteca SEO adicionada.

Arquivos centrais:

- `src/site-config.cjs`: configuração e travas de ambiente, origem e analytics.
- `src/seo.cjs`: títulos, descrições, canonical, Open Graph, Twitter Cards, entidades e verificação opcional dos buscadores.
- `build.cjs`: HTML, sitemap, robots, atalhos e manifesto explícito dos arquivos gerados.
- `tools/build-static.cjs`: empacotamento por manifesto, substituindo somente o diretório dist validado. Evita copiar HTML antigo ou rascunhos remanescentes.
- `.env.example`: variáveis documentadas, sem credenciais.
- `server.cjs`: localhost com X-Robots-Tag noindex. `vercel.json`: regra por host vercel.app preparada; execução na borda ainda não validada porque não houve deploy.

Staging é o padrão: canonical e URLs sociais em `https://safek-one.vercel.app`, páginas noindex, sitemap XML vazio válido, sem referência a sitemap no robots. Crawling não é bloqueado para que o robô possa ler noindex. Robots não é autenticação: se houver necessidade de confidencialidade, aprovar proteção do deployment. O staging público atualmente publicado não recebeu este lote; não se pode atribuir a ele a proteção validada no localhost.

Produção exige **duas mudanças explícitas**, somente após autorização: `SAFEK_SITE_ENV=production` e `SEO_ALLOW_INDEXING=true`. Usa exclusivamente `https://safek.com.br`; ignora a origem de staging. Apenas URLs elegíveis entram no sitemap; não são inventadas datas para páginas institucionais. Artigos publicados usam sua data real de modificação. Rascunhos são excluídos fisicamente do pacote de produção e dos builds Vercel. O menu/listagem de artigos só é promovido quando houver conteúdo publicado; a listagem vazia permanece noindex.

## B. SEO on-page e intenções

Títulos e descrições únicos centralizados; um H1 por página. Hipóteses de intenção por relevância comercial, **sem dados de volume, competição ou promessa de posição**:

| Rota | Intenção prioritária |
| --- | --- |
| `/` | Controle de celulares em escolas, empresas e eventos; apresentação da solução |
| `/escolas.html` | Controle de celulares nas escolas; bolsa com trava |
| `/como-funciona.html` | Guarda, trava, posse do aparelho e abertura na base |
| `/sobre.html` | Identidade SAFE-K e relação com GlobalK |
| `/onde-usar.html` | Comparação dos três contextos atendidos |
| `/empresas.html` | Reuniões e treinamentos com controle de acesso ao aparelho |
| `/eventos.html` | Eventos privados e festas; organização da experiência |
| `/contato.html` | Solicitar demonstração, contato e localização |
| `/duvidas.html` | Respostas sobre operação, acesso e implantação |
| `/privacidade.html` | Preferências e funcionamento dos dados/canais |
| `/imprensa.html` | Acervo editorial, separado de Insights |
| `/celulares-nas-escolas.html` | Síntese de acervo sobre celulares na escola |
| `/educacao-e-tecnologia.html` | Síntese de acervo sobre educação e tecnologia |
| `/festas-sem-celulares.html` | Síntese de acervo sobre presença em festas |
| `/presenca-nos-shows.html` | Síntese de acervo sobre música e presença |
| `/insights.html` | Orientação educativa para gestores escolares |
| `/insights/lei-15100-2025-celulares-escolas.html` | Alcance, exceções e implementação da legislação |
| `/insights/politica-uso-celulares-escola.html` | Planejamento institucional, comunicação e acesso |
| `/insights/reduzir-distracoes-digitais-sala-aula.html` | Rotina de aula e organização do uso de dispositivos |

A comunicação diferencia **restrição de acesso físico** de bloqueio de sinal. Não foram acrescentadas capacidades técnicas não comprovadas. E-mail comercial padronizado no formulário, rodapé, imprensa e dados estruturados: safek@globalk.com.br, conforme informado pelo usuário.

## C. GEO

Conteúdo disponível no HTML gerado, sem hidratação para leitura. Respostas diretas, títulos semânticos, fontes visíveis, sumário navegável, links entre escolas/produto/artigos/contato e identidade consistente. Nenhum conteúdo oculto exclusivo para robôs, nenhum llms.txt experimental, nenhum dado inventado de clientes ou resultados.

Buscadores tradicionais e de IA podem usar fundamentos comuns de rastreabilidade e conteúdo útil; não há garantia de citação ou ranking. Referência: [guia do Google para recursos de IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Política de crawlers: busca/indexação, recuperação acionada pelo usuário e treinamento de modelos têm finalidades diferentes. Não foi criado bloqueio indiscriminado de agentes de busca por IA. Permitir ou impedir treinamento é decisão comercial separada; autenticação é o controle adequado para material confidencial. Noindex não é uma proibição geral de treinamento ou de acesso.

## D. Dados estruturados

Organization com contato, WebSite, WebPage/ContactPage/AboutPage e BreadcrumbList. Product apenas na página que explica a bolsa: sem preço, estoque, avaliações ou certificações inventadas. O acervo antigo fica como WebPage porque autoria e datas originais não estão confirmadas.

BlogPosting preparado para artigos **publicados**, com autor, datas, imagem e publisher correspondentes ao conteúdo visível. Rascunhos não recebem essa entidade. O teste de uma fixture isolada percorre o ramo publicado sem publicar um artigo real. Autoria aprovada nesta conversa: **Equipe SAFE-K**, como Organization.

Sintaxe JSON-LD e URLs conferidas nos testes locais. Rich Results Test, Schema Markup Validator externo e elegibilidade efetiva não foram executados. Product sem oferta/review pode não ser elegível a recursos comerciais; marcação semântica não é promessa de rich result.

## E. Insights

Criados os três artigos solicitados, em JSON separado dos componentes. Listagem editorial, cards discretos, template reutilizável, sumário, fontes, artigos relacionados e CTA contextual. Preservados preto, azul, Manrope e navegação mobile. Sem portal de notícias ou novo CMS.

Todos permanecem **draft**, `approvedForPublication=false`, datas de publicação/modificação nulas. A assinatura institucional está definida, mas não equivale à aprovação editorial. Localhost permite a revisão; produção não inclui seus HTMLs, atalhos ou cards sociais.

Fontes oficiais conferidas: [Lei 15.100/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15100.htm) e [Decreto 12.385/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12385.htm). Exceções e escopo de educação básica distinguidos de recomendações práticas. O texto não afirma obrigatoriedade de compra da SAFE-K, ganho clínico ou percentual de aprendizagem. Normas complementares da rede/CNE exigem conferência específica antes de adoção institucional; o acesso ao material do MEC encontrado exigiu CAPTCHA e não foi contornado. O artigo não se apresenta como parecer jurídico nem levantamento exaustivo dessas normas.

Guia de edição/publicação: `content/insights/README.md`. Novos artigos entram automaticamente no build e sitemap quando publicados e validados; gerar seu card social antes de empacotar. Foram preparados 19 cards PNG, 1200 × 630, usando a marca real e o design existente. Metadados e arquivos locais foram verificados; prévia em redes sociais externas não foi testada.

## F. Analytics e descoberta

Integração preparada em `analytics.js`, **desligada**. Não há ID GA4 nem coleta ativa. Ativar futuramente exigirá ambiente de produção indexável, `SAFEK_ANALYTICS_ENABLED=true`, ID válido e consentimento explícito. Fechar ou memorizar o aviso atual de cookies **não** concede consentimento de analytics.

Eventos permitidos: `demo_cta_click`, `contact_email_click`, `contact_phone_click`, `email_draft_prepared`, `email_draft_open_attempt`, `insight_open`. Apenas nomes fixos e URL de página sem query/fragmento; dados dos campos não são enviados. Não existe evento de lead recebido: o formulário prepara mailto, não envia ao CRM e não confirma recebimento. Futuro evento de submissão/conversão exige resposta real do backend e deduplicação própria.

Teste com requisições interceptadas confirmou consent gate, ausência de coleta com a configuração atual, remoção de parâmetros, ausência de payload pessoal, um page_view e interrupção dos novos eventos após revogação. Não foi testada entrega real ao GA4. Controle de page_view segue a [documentação GA4](https://developers.google.com/analytics/devguides/collection/ga4/views).

Antes de qualquer ativação: aprovar interface de consentimento granular e retirada, atualizar política de privacidade, configurar retenção e acesso na propriedade, desabilitar medição aprimorada automática de formulários/cliques/URLs na propriedade para evitar coleta paralela ou duplicada, revisar requisições reais e cookies e validar consentimento/remoção. O controlador ainda não está ligado ao aviso atual e não deve ser ativado isoladamente.

Preparadas metatags opcionais `GOOGLE_SITE_VERIFICATION` e `BING_SITE_VERIFICATION`, sem tokens fictícios. Não foi solicitada verificação nem submetido sitemap. IndexNow foi avaliado: requer prova de propriedade e notificação de URLs no domínio; nenhuma chave ou envio foi criado. Para um site estático pequeno, ativação não é requisito do lançamento e depende de aprovação. Referência: [protocolo IndexNow](https://www.indexnow.org/documentation).

## G. Migração do domínio

Inventário público somente leitura em `research/legacy-inventory.json`, reproduzível por `tools/inventory-legacy.cjs`. Encontrado sitemap real `/wp-sitemap.xml`, não `/sitemap_index.xml`. Foram obtidas **23 URLs de posts/páginas, todas HTTP 200**, com título, descrição, canonical, robots, H1 quando existente e URL final. Sitemaps de templates/formulários/taxonomias/autores estão registrados mas não foram tratados como páginas editoriais equivalentes. O inventário não substitui crawl de mídia, anexos e URLs fora do sitemap; acesso a Search Console/logs/backlinks segue pendente.

O campo `mapping` contém destino proposto por URL. Há 16 equivalências/consolidações propostas e sete sem equivalente confirmado: quatro posts genéricos em inglês, `/dasdeasd/`, `/restricao/` e `/blog-landing-page-business-v3/`. A aparência de conteúdo de template não demonstra ausência de valor SEO. Não aplicar 410 ou redirecionar tudo para a home sem análise e aprovação.

As regras permanentes existentes foram mantidas e preparadas também para barras finais e privacy-policy. Universidades, tribunais, hospitais e acampamentos continuam fora da navegação, conforme decisão anterior; consolidam em Onde usar. Festas aponta para Eventos. Aprovar estas consolidações com dados do site antigo antes do corte. Os quatro artigos antigos apontam para sínteses: preservar texto completo e referências antes de substituir o acervo; a produção preparada suprime o link de fonte que passaria a apontar para a própria síntese.

As regras têm destinos existentes e não apontam para outra origem de staging. Validação de configuração local não comprova execução HTTP 308 na borda. Cadeias intermediárias antigas não foram medidas pelo crawl; ele registra apenas URL final. Nada foi alterado no domínio oficial.

## H. Validação técnica

- Build local: 19 páginas; sitemap de staging sem URLs; 43 artefatos HTML explícitos, incluindo atalhos.
- Sintaxe: node --check passou nos 23 arquivos JavaScript/CommonJS verificados; git diff --check sem erros. Resposta final de localhost/insights.html confirmada HTTP 200 com X-Robots-Tag noindex.
- `tools/check-seo.cjs`: títulos/descrições únicos, H1, canonical, política de indexação, sitemap, JSON-LD, imagens e 38 regras permanentes sem fontes duplicadas e com destinos existentes. Atalhos de rascunhos não entram na configuração de borda, lida pela Vercel antes do build.
- `tools/review-v2.cjs`: 76 combinações de 19 páginas × 320/390/768/1440 px, sem overflow, imagem ausente, âncora quebrada ou erro de JavaScript. Navegação desktop/mobile, Escape, FAQ, contexto de escolas, formulário editável e atalhos testados.
- `tools/check-prelaunch.cjs`: campos opcionais, telefone válido/inválido, privacidade e rascunho de e-mail; zero mensagens externas enviadas.
- `tools/check-insights.cjs`: três condições de indexação, exclusão de drafts no pacote de produção isolado, autoria/datas/schema, consentimento e telas adicionais em 390/1050/1440. Produção simulada em pasta temporária: 16 páginas, 15 elegíveis no sitemap, zero artigos draft; origem oficial sem alterar o build local.
- Revisão visual de capturas da listagem mobile, artigo desktop e card social. Evidências em `qa/insights/`, `qa/v2/` e `qa/prelaunch/`. Não equivale a certificação WCAG.
- Fontes convertidas sem alteração de desenho de TTF para WOFF2: total de 475.744 para 150.456 bytes (aproximadamente 68,4% menor). Originais e licença preservados. Preload dos pesos de corpo e título; font-display swap mantido.
- WebP institucional preservado: 1.500.359 para 84.698 bytes. Imagens responsivas e dimensões continuam presentes. JavaScript permanece sem framework e sem dependências de runtime.
- Amostras curtas de LCP/CLS coletadas no Edge local, sem throttle; detalhes reais em `qa/insights/results.json`. Não são Lighthouse, INP nem dados de campo. Não há garantia de Core Web Vitals a partir de localhost. Ajustes de font delivery reduziram a instabilidade observada no teste; medir novamente no ambiente final.
- Cache atual preservado; não foram aplicados cabeçalhos immutable a assets sem hash. Localhost usa no-store; comportamento de CDN e HTTPS deve ser testado após deploy autorizado.
- Não há TypeScript, script de lint ou suíte de acessibilidade completa configurados. Validar sintaxe com node --check não substitui esses testes. Leitor de tela, contraste automatizado completo, dispositivos físicos, integração CRM e ferramentas externas de rich results ainda não foram verificados.

## I. Dependências pendentes

1. Revisão/aprovação dos três artigos e datas reais para publicação; autoria institucional já aprovada.
2. CRM/API e fluxo real de envio/retorno de lead, autenticação e proteção contra abuso, quando forem integrados.
3. Materiais reais de prova social e autorização de uso permanecem em standby.
4. Acesso a Search Console/Bing/logs/backlinks para decidir as sete URLs pendentes, revisar consolidações e preservar o acervo integral.
5. Aprovação da política de rastreadores/treinamento; IDs e política/interface de consentimento se analytics for desejado.
6. Aprovação expressa para GitHub/deploy e, separadamente, corte do domínio, DNS e indexação.

## J. Prontidão e checklist de lançamento

**Pronto para revisão local, não liberado para substituir o domínio oficial.** Testes de código e navegador passaram; aprovação editorial, mapeamento e operação de conversão precisam ser concluídos. O formulário mailto é funcional como preparação de mensagem, não como captação backend confirmada.

Após autorização, a sequência deve ser:

1. Registrar backup do WordPress, configuração DNS e dados de e-mail; não alterar MX/SPF/DKIM/DMARC por engano.
2. Fechar o mapeamento de URLs, preservar conteúdo integral e testar redirecionamentos em preview protegido com ambiente staging/noindex.
3. Aprovar conteúdo, publicar somente artigos revisados e testar CRM se incluído no escopo.
4. Vincular domínio e www no projeto correto, preparar rollback e validar HTTPS, destino canônico e redirecionamento www→apex. Não utilizar Change of Address automaticamente: o domínio permanece o mesmo.
5. Somente no lançamento aprovado configurar as duas variáveis de produção e executar novo build/deploy. Conferir HTML, origem oficial, sitemap, robots, redirects, navegação e assets. Continuar noindex em vercel.app.
6. Verificar propriedade Google/Bing com tokens reais e submeter apenas o sitemap oficial aprovado; não enviar localhost ou staging.
7. Conferir respostas 200/308/404, ausência de soft 404, canonical/sitemap, formulários e mapas em mobile; validar schemas e prévias sociais externamente.
8. Após o corte, acompanhar 404/redirects, páginas indexadas, sitemap, tráfego e conversões reais; comparar com baseline do site antigo, sem prometer prazo ou posição. Medir Core Web Vitals/INP de campo quando houver amostra e reavaliar conteúdo/fontes periodicamente.

Rollback: manter backup e registrar os valores DNS/deployment anteriores antes de qualquer corte futuro. Nenhum procedimento desta lista foi executado no domínio oficial neste lote.
