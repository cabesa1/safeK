# SEO da SAFE-K

Domínio definitivo confirmado: https://safek.com.br.

## Implementado

- Títulos e descrições específicos para as 15 páginas.
- URL canônica por página; início em `/`, demais páginas em `/*.html`.
- Sitemap e robots gerados junto das páginas e incluídos no pacote publicado.
- Open Graph e Twitter Cards com imagem local e texto da página.
- Dados estruturados de Organization, WebSite, WebPage, BreadcrumbList, Product e Article conforme o conteúdo visível. Sem avaliações, preços, autores ou datas inventadas.
- Redirecionamentos permanentes na Vercel dos caminhos antigos e páginas retiradas para destinos ativos.
- Conteúdo principal disponível no HTML sem depender do JavaScript.

Configuração central: `src/seo.cjs`. `SEO_SITE_URL` pode substituir o domínio durante um build; o padrão é o domínio definitivo.

Validação: `node build.cjs`, `node tools/build-static.cjs`, `node tools/check-seo.cjs`.

## Intenção por página

Início: bolsa para celular e ambientes sem uso de celular.
Como funciona: funcionamento, trava, posse e desbloqueio.
Escolas: bolsa para celular nas escolas.
Empresas: guarda do celular em reuniões e treinamentos.
Eventos: eventos privados e festas sem celular.
Contato: demonstração e localização em Sorocaba.
Acervo: buscas informativas sobre atenção, educação e experiências sem telas.

## Publicação e indexação

Antes da troca do domínio, registrar no Search Console as URLs atuais e o desempenho do site antigo, se houver acesso. Conferir caminhos importantes além dos preservados no projeto e criar redirecionamentos adicionais se necessário.

Ao publicar: vincular safek.com.br à hospedagem, escolher esse domínio como principal e redirecionar a variante www. Verificar HTTPS, respostas HTTP, redirecionamentos, imagens de compartilhamento e sitemap no domínio público. O build local não comprova essas etapas.

No Search Console: verificar a propriedade do domínio pelo DNS, enviar https://safek.com.br/sitemap.xml e inspecionar as páginas principais. Monitorar indexação, erros e Core Web Vitals após a publicação.

Os artigos são sínteses editoriais do acervo, não depoimentos nem casos comerciais. Conferir os links para as publicações completas ao migrar o acervo antigo para evitar links que retornem à própria síntese.

Não há garantia de posição ou prazo de indexação. As alterações locais precisam chegar ao domínio definitivo para produzir efeito no site público.

Referências: https://developers.google.com/search/docs/fundamentals/get-started-developers ; https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/appearance/structured-data/organization .
