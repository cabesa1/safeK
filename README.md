# SAFEK — site institucional

Site institucional mobile first com 19 páginas reais, CSS e JavaScript compartilhados, imagens otimizadas e tipografia Manrope local.

Abra `index.html` diretamente ou execute `npm start` e acesse http://localhost:3014.

## Estrutura e edição

- `src/content.cjs`: conteúdo das oito aplicações, dúvidas e quatro leituras de imprensa.
- `src/templates.cjs`: estrutura das páginas, navegação, rodapé e contato.
- `styles.css` e `app.js`: apresentação responsiva e interações.
- `assets/`: imagens e fontes locais. Mantenha a pasta junto dos arquivos HTML.
- `node build.cjs` ou `npm run build`: gera as 19 páginas e 14 redirecionamentos de endereços anteriores.

Início, A SAFE-K, Como funciona, Onde usar, Escolas, Universidades, Empresas, Eventos, Festas, Tribunais, Acampamentos, Hospitais e clínicas, Imprensa, quatro leituras, Contato e Dúvidas frequentes.

## Direção e conteúdo

- Nova identidade fornecida pelo usuário, em preto, azul-marinho e azul vivo.
- Conteúdo e contatos conferidos em https://safek.com.br/ em 23/09/2026.
- A revisão substituiu a fonte condensada, ampliou os textos e criou profundidade com fotografia, iluminação azul, camadas e sombras.
- A bolsa agora tem uma visualização de estúdio alta e retangular, criada com a ferramenta nativa de imagens a partir da foto original. A página de funcionamento também apresenta a fotografia do site atual.
- Fontes: Manrope 400, 500, 600, 700 e 800, armazenadas localmente.
- Diretório Onde usar com oito aplicações, filtros, busca e páginas detalhadas para cada contexto.
- Referências, arquivo da imagem e prompt integral: `research/direcao-visual.md`.

## Contato e publicação

O formulário valida os dados e prepara uma mensagem editável na própria página. O visitante pode copiá-la ou abrir seu aplicativo de e-mail para revisar e enviar. Os canais institucionais e de vendas B2B também têm links diretos. Nenhuma mensagem é enviada automaticamente ou durante os testes.

Esta é uma prévia local. O site em produção não foi alterado.

## Revisão

`tools/review-v2.cjs` verifica as 19 páginas em quatro larguras (320, 390, 768 e 1440 px), menus, busca, filtros, FAQ, seleção de contexto, validação, mensagem editável, links e imagens. Requer Playwright e Edge; a variável `SAFEK_PLAYWRIGHT` pode indicar o módulo instalado. Resultados e capturas atuais ficam em `qa/v2/`.

Verificação final: 76 combinações de página/largura, sem falhas de layout, links locais ou imagens; sem erros de JavaScript. Os arquivos antigos em `qa/` e os scripts da primeira revisão são históricos. A versão atual usa os assets locais compartilhados.
