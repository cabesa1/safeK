# Editar Insights

Os artigos ficam em arquivos JSON separados, sem CMS ou dependências de runtime. Edite o conteúdo aqui, não o HTML gerado. Execute `npm.cmd run build` depois.

- `slug`: minúsculas, números e hífens; determina `/insights/<slug>.html`.
- `title`, `seoTitle`, `description`, `summary`, `category`: textos únicos em pt-BR.
- `sections`: identificador único, título, parágrafos, lista opcional e IDs das fontes utilizadas.
- `sources`: título e URL HTTPS verificáveis; não invente referências.
- `image`: nome de um WebP existente em assets; `imageAlt` deve descrever a imagem real.
- `author`: autoria institucional aprovada pelo usuário: Organization / Equipe SAFE-K.
- `sourcesCheckedAt`: data real da conferência das fontes. Não é data de publicação.

## Fluxo de aprovação

1. Mantenha `status: draft`, `approvedForPublication: false` e datas de publicação/modificação nulas durante a revisão.
2. A prévia local mostra os rascunhos com aviso; eles não recebem BlogPosting e não entram no sitemap.
3. Após aprovação editorial explícita, conferir novamente legislação e fontes, definir datas reais `YYYY-MM-DD`, alterar status para published e marcar approvedForPublication e sourcesVerified como true.
4. O validador bloqueia publicação sem autor, fontes conferidas, aprovação ou datas válidas. Isso é uma trava de fluxo, não prova independente da veracidade das informações.
5. O build de produção ou Vercel exclui fisicamente os artigos draft do pacote dist, inclusive seus atalhos HTML e cards sociais. Se não houver artigos publicados, o menu Insights permanece oculto; a listagem vazia fica noindex.
6. Novos artigos published entram automaticamente na listagem, links relacionados, metadados e sitemap de produção. Gerar também seu card social com `tools/build-social.cjs` antes do empacotamento.

Os arquivos .env não são carregados automaticamente: as variáveis devem estar exportadas no processo do build. Não ative produção, analytics ou publique sem autorização.
