# Revisão visual — SAFE-K

## Correções solicitadas

- Bolsa alta e retangular, baseada na fotografia do site original. A apresentação anterior feita em CSS foi substituída.
- Tipografia Manrope, de 16 px no texto principal, títulos encorpados e fontes locais. Foram removidos os títulos condensados e os contornos de letras da primeira versão.
- Profundidade com fotografia, iluminação azul, sombras, superfícies sobrepostas e planos de fundo.
- Site com páginas reais: início, sobre, funcionamento, diretório de aplicações, oito aplicações, imprensa, quatro leituras, contato e dúvidas.
- Diretório com oito aplicações conferidas no site atual: escolas, universidades, empresas, eventos, festas, tribunais, acampamentos e hospitais/clínicas/maternidades. Outros espaços levam ao contato contextualizado.

## Imagem do produto

Modo: ferramenta nativa de geração de imagens, com referências locais. Sem API ou CLI alternativo.

Arquivo original gerado: `assets/produto-studio-v2.png`.
Versões otimizadas usadas no site: `assets/produto-studio-v2.webp` e `assets/produto-studio-v2-small.webp`.

O resultado é uma visualização da nova identidade, identificada assim no site. A página de funcionamento também apresenta a fotografia do produto que estava no site original, com sua identidade anterior.

### Prompt utilizado

Use case: product-mockup. Create a photorealistic premium studio product photograph for the institutional SAFE-K website. Image 1 is the physical product shape and fabric reference; Image 2 is the NEW wordmark style reference only. Preserve the tall narrow RECTANGULAR pouch proportions of Image 1: approximately 2.5 times as tall as its width, long straight sides, modest rounded lower corners, short rounded top flap and small black circular magnetic lock near the top. This is a soft flat fabric phone pouch, NOT a rigid square case, NOT a backpack, NOT a capsule. One single black textile pouch standing upright with a very slight 5 degree lean on a low dark charcoal rectangular plinth. Front face almost facing camera with a subtle three-quarter perspective, natural fine matte fabric texture and accurate stitched edges. Remove original orange branding and replace with a small crisp white SAFE wordmark and bright cyan K near the bottom following Image 2. Do NOT add the oversized icon in the center: keep the central face plain black fabric. Dark black/navy studio with architectural depth, soft cyan blue edge light from right and broad cool white softbox from left, subtle realistic contact shadow and falloff behind pouch, polished commercial photography, tactile not illustrated, no motion blur, no grain, no concentric circles, no decorative lines, no UI, no typography anywhere except the small product wordmark. Portrait 4:5 composition, product entirely visible and occupying 77% image height, generous room around product, clearly distinguish the black pouch from its background.

## Fontes de conteúdo

Site institucional: https://safek.com.br/ e páginas de aplicação, consultados em 23/09/2026. O inventário inicial foi salvo em `sources.json`; imagens em `image-sources.json`.

Também foram consultadas as páginas https://safek.com.br/sobre-nos/ e https://safek.com.br/hospitais/. A primeira apresenta o canal de vendas B2B usado na página de contato; a segunda confirma a oitava aplicação.

As leituras de imprensa são sínteses editoriais com acesso à publicação completa no acervo. Não foram reproduzidas matérias de terceiros integralmente. Artistas citados não são apresentados como clientes ou parceiros da SAFE-K.

## Verificação

`qa/v2/results.json` contém as verificações de layout, links, imagens, menu, filtros, busca, FAQ e preparo da mensagem. Capturas de tela ficam na mesma pasta.
