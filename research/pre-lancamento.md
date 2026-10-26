Registro do primeiro lote local. Para o estado e os resultados atuais, consulte research/seo-geo-report.md. As contagens abaixo descrevem aquele lote, não a revisão com Insights.

# SAFE-K — otimizações aprovadas e pré-lançamento

## Escopo deste lote

Aprovado para revisão local, sem publicação. Layout, título da home, identidade visual, fotos e segmentos existentes preservados. Universidades e a foto IMG_2963 continuam fora.

- Home: explicação direta da restrição de acesso físico e do desbloqueio por base.
- CTA comercial: Solicitar demonstração. A ação de preparar o e-mail mantém seu rótulo específico.
- Formulário: nome, e-mail profissional, instituição e segmento obrigatórios; telefone/WhatsApp, participantes e mensagem opcionais. E-mails pessoais continuam aceitos.
- Telefone opcional com validação no navegador; quando preenchido, integra a mensagem preparada.
- Aviso de uso dos dados e acesso à política de privacidade junto ao formulário.
- FAQ: explicações confirmadas sobre posse do celular, base, planejamento de implantação, escolas e solicitação de demonstração.
- Imagem institucional: exportação WebP do PNG existente, sem alteração de composição.

## Integração comercial pendente

O site prepara um link mailto para safek@globalk.com.br. Não há API de captação, banco de leads, envio automático ou integração com CRM. Não há estado de sucesso que confirme recebimento pela equipe.

Para ativar o CRM próprio, a equipe precisa fornecer o contrato do endpoint, os campos aceitos, o mecanismo de autenticação no servidor, o destino dos leads e as regras de atribuição. Depois da aprovação dessa integração, implementar validação no servidor, proteção contra abuso e estados de envio, erro e recebimento confirmado. Segredos devem ficar no servidor, nunca no navegador.

## Perguntas que dependem da equipe comercial

Não publicar respostas antes de confirmar:

- Existe quantidade mínima de bolsas ou usuários? Há compra, locação ou ambos?
- Quais condições e prazos se aplicam a eventos temporários?
- Quais canais, horários e responsabilidades compõem o suporte?
- Qual é o procedimento oficial em emergências e exceções? Quem autoriza o acesso?
- Há limites de capacidade e referências operacionais documentadas para grandes instituições?
- Qual documento comprova a patente informada pela empresa? Não acrescentar número ou registro sem esse material.

Depoimentos e casos com clientes continuam aguardando material e autorização. Nenhum indicador, cliente ou capacidade comercial foi inventado.

## Indexação

O domínio definitivo já foi confirmado pelo usuário: https://safek.com.br.

O build agora gera `noindex,follow,max-image-preview:large` por padrão. Para o lançamento autorizado, configurar `SAFEK_SITE_ENV=production e SEO_ALLOW_INDEXING=true` no ambiente de produção e gerar um novo build. Títulos, canonical, sitemap e dados estruturados continuam preparados para o domínio definitivo.

O `vercel.json` contém uma regra de X-Robots-Tag para hosts `*.vercel.app`, mantendo esses endereços com noindex mesmo após liberar o domínio oficial. A regra foi preparada em código; seu funcionamento na borda da Vercel precisa ser conferido no deploy autorizado.

O servidor local também envia X-Robots-Tag: noindex, follow. robots.txt permite rastreamento para que o robô consiga ler a diretiva noindex; bloquear com Disallow não substitui essa proteção.

Noindex não é autenticação nem torna o site privado. O material permanece acessível a quem tem o link. Não promete exclusão instantânea de URLs já indexadas.

Referências: https://developers.google.com/search/docs/crawling-indexing/block-indexing ; https://vercel.com/docs/project-configuration/vercel-json#headers .

## Checklist antes da publicação oficial

- [ ] Aprovar visualmente este lote no localhost.
- [ ] Autorizar explicitamente GitHub e deploy. A prévia publicada não foi alterada neste lote.
- [ ] Aprovar e validar a integração com o CRM antes de anunciar envio automático.
- [ ] Confirmar políticas comerciais e de emergência antes de ampliar o FAQ.
- [ ] Conferir domínio, HTTPS e redirecionamento www para safek.com.br.
- [ ] Habilitar SAFEK_SITE_ENV=production e SEO_ALLOW_INDEXING=true apenas para o lançamento aprovado.
- [ ] Conferir canonical, sitemap.xml, robots.txt e metadados no domínio oficial.
- [ ] Conferir que os endereços vercel.app continuam com noindex.
- [ ] Verificar propriedade no Search Console e enviar o sitemap somente após o lançamento.
- [ ] Verificar o acervo editorial antigo e os links de fonte, evitando referências que redirecionem à própria síntese.
- [ ] Definir se haverá analytics e quais eventos medir; revisar a política se novas ferramentas forem aprovadas.
- [ ] Medir Core Web Vitals em produção; testes locais não representam desempenho real de campo.
- [ ] Revisar teclado, foco, formulários e contraste; os testes básicos não equivalem a uma certificação WCAG.
- [ ] Manter conteúdo, contatos e dados estruturados consistentes. Não há garantia de destaque em buscas tradicionais ou por IA.

## Verificação local

Resultado deste lote: build estático concluído; SEO e metadados conferidos nas 15 páginas; 60 combinações de página e viewport sem falhas, imagens ausentes ou erros de JavaScript. Navegação desktop e mobile, FAQ e preparação do e-mail passaram. O teste específico confirmou envio sem os campos opcionais, rejeição de telefone inválido, inclusão do telefone quando preenchido, edição da mensagem e acesso à política de privacidade. Nenhuma mensagem externa foi enviada.

Noindex confirmado no HTML e na resposta HTTP do localhost. A liberação de indexação com SAFEK_SITE_ENV=production e SEO_ALLOW_INDEXING=true foi testada em processo separado, sem modificar o build de revisão. O filtro por host vercel.app foi validado na configuração; a execução dessa regra na borda permanece pendente do deploy autorizado.

Imagem institucional: 1.500.359 bytes em PNG para 84.698 bytes em WebP, redução de 94,4% no tamanho desse arquivo. Isso não é uma medição de melhora de Core Web Vitals.

Executar `node build.cjs`, `node tools/build-static.cjs`, `node tools/check-seo.cjs` e os testes de navegador em `tools/review-v2.cjs` e `tools/check-prelaunch.cjs`. Não há lint ou checagem TypeScript configurados neste projeto estático; a sintaxe JavaScript pode ser validada com `node --check`.
