# SEO SAFE-K — referência atual

O relatório completo e vigente está em [seo-geo-report.md](seo-geo-report.md), incluindo configuração, páginas, fontes, testes, migração e pendências.

- Arquitetura estática Node/CommonJS, sem biblioteca SEO ou framework.
- Prévia padrão: origem https://safek-one.vercel.app, noindex, sitemap vazio e sem submissão.
- Produção futura: origem https://safek.com.br, exige SAFEK_SITE_ENV=production E SEO_ALLOW_INDEXING=true após autorização.
- A variável SEO_SITE_URL define somente a origem de staging; não pode usar o domínio oficial.
- Artigos draft são locais, excluídos de produção e Vercel. Menu Insights só aparece em publicação quando houver artigos aprovados.
- Metadados e schemas em src/seo.cjs; ambientes em src/site-config.cjs; artigos em content/insights.
- Sitemap automático inclui somente canonical indexável; não inventa datas de modificação.
- Organização, site, página, breadcrumbs e produto verificados. BlogPosting apenas quando há artigo publicado com autor e datas válidos.
- Social cards em assets/social, 1200 × 630; fontes WOFF2 locais; conteúdo renderizado no HTML.
- Não houve publicação deste lote. A validação de noindex no localhost não confirma que o deployment público já recebeu as mudanças.

Comandos: npm.cmd run build; node tools/build-static.cjs; node tools/check-seo.cjs. Testes de navegador: tools/review-v2.cjs, tools/check-prelaunch.cjs e tools/check-insights.cjs, com Playwright disponível para desenvolvimento. O projeto não depende dele em runtime.

Não há garantia de ranking, indexação ou citações por IA. Pesquisa de demanda, Search Console, CRM e autorização de domínio ainda são dependências externas.
