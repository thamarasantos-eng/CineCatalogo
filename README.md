# CineCatálogo

**Nome completo:** [PREENCHER COM SEU NOME COMPLETO]
**Disciplina:** Desenvolvimento Web — FACET-SNP-307 (Turma 01, 2026/2)
**Professor:** Dr. Ivan Luiz Pedroso Pires
**Avaliação:** Avaliação prática individual — Construção de um website AJAX com Bootstrap

## Tema

Catálogo interativo de filmes, com listagem, busca por texto, filtro por categoria e
consulta de detalhes (direção, ano, duração, elenco e sinopse completa) carregada sob demanda.

## Funcionalidades

- Listagem de 10 filmes carregada por AJAX (Fetch API) a partir de `data/catalogo.json`.
- Consulta de detalhes: ao clicar em "Ver detalhes", uma nova requisição AJAX busca o arquivo
  `data/detalhes/{id}.json` correspondente e exibe as informações em um modal do Bootstrap.
- Busca por texto (título/resumo) e filtro por categoria, aplicados sobre os dados já carregados,
  sem recarregar a página.
- Estados de interface: indicador de carregamento (spinner), mensagem de "nenhum resultado" e
  aviso de erro com botão "Tentar novamente" — tanto na listagem quanto no modal de detalhes.
- Layout responsivo com o grid do Bootstrap 5 (1 coluna no celular, 2 no tablet, 3 no desktop).
- Navbar responsiva, cards, formulário de busca/filtro e modal como componente interativo do
  Bootstrap, integrado à função de exibir detalhes.
- HTML semântico (`header`, `nav`, `main`, `section`, `article`, `footer`), hierarquia de títulos,
  rótulos associados aos campos e `alt`/`aria-*` onde aplicável.
- Skip link, foco visível (`:focus-visible`) e bloco `prefers-reduced-motion` para acessibilidade.

## Fonte dos dados

Dados fictícios criados para esta atividade, servidos como arquivos JSON locais:

- `data/catalogo.json` — fonte da listagem (id, título, categoria, resumo).
- `data/detalhes/{id}.json` — fonte das informações adicionais de cada filme (um arquivo por id).

## Bibliotecas e recursos utilizados

- [Bootstrap 5.3.3](https://getbootstrap.com/) — via CDN (jsDelivr), CSS e JS bundle.
- Ícones e ilustrações: SVG desenhado manualmente (sem bibliotecas externas de ícones).
- Nenhuma imagem externa foi utilizada — os "pôsteres" são placeholders coloridos em CSS/SVG.

## Como executar o projeto localmente

O projeto **não pode** ser aberto diretamente como arquivo (`file://`), pois o `fetch` dos
arquivos JSON exige que a página seja servida por HTTP. Duas opções simples:

**Opção 1 — VS Code + Live Server**
1. Abra a pasta do projeto no VS Code.
2. Instale a extensão "Live Server", se ainda não tiver.
3. Clique com o botão direito em `index.html` → "Open with Live Server".

**Opção 2 — Servidor HTTP do Python**
1. Abra um terminal na pasta do projeto.
2. Rode: `python3 -m http.server 5500`
3. Acesse `http://localhost:5500` no navegador.

## Roteiro de testes

1. **Listagem:** ao abrir a página, o indicador de carregamento aparece brevemente e depois os
   10 cards de filmes são exibidos.
2. **Detalhes:** clique em "Ver detalhes" em qualquer card — o modal abre, mostra um spinner e
   em seguida exibe direção, ano, duração, elenco, nota e sinopse completa daquele filme.
3. **Busca:** digite um termo (ex.: "robô") no campo de busca — a lista é filtrada instantaneamente.
4. **Filtro por categoria:** selecione uma categoria no campo de filtro — apenas os filmes daquela
   categoria permanecem visíveis. Busca e filtro podem ser combinados.
5. **Estado vazio:** busque por um termo inexistente (ex.: "xyz123") — a mensagem de "nenhum filme
   encontrado" é exibida.
6. **Estado de erro:** renomeie ou mova temporariamente `data/catalogo.json` e recarregue a
   página — o aviso de erro com o botão "Tentar novamente" deve aparecer. Restaure o arquivo e
   clique em "Tentar novamente" para confirmar que a listagem volta a carregar.
7. **Responsividade:** com o DevTools em modo dispositivo (F12), verifique que os cards se
   reorganizam em 1 coluna no celular e que a navbar colapsa no botão "hambúrguer".

## Estrutura de arquivos

```
catalogo-filmes/
├── index.html
├── css/
│   └── estilo.css
├── js/
│   └── app.js
├── data/
│   ├── catalogo.json
│   └── detalhes/
│       ├── 1.json
│       ├── 2.json
│       └── ... (até 10.json)
└── README.md
```
