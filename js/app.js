// ==========================================================================
// CineCatálogo — lógica de listagem, busca/filtro e detalhes via AJAX
// ==========================================================================

// Referências aos elementos da página
const listaFilmesEl = document.getElementById('lista-filmes');
const campoBusca = document.getElementById('campo-busca');
const campoCategoria = document.getElementById('campo-categoria');

const estadoCarregando = document.getElementById('estado-carregando');
const estadoVazio = document.getElementById('estado-vazio');
const estadoErro = document.getElementById('estado-erro');
const btnTentarNovamente = document.getElementById('btn-tentar-novamente');

const modalDetalhesEl = document.getElementById('modalDetalhes');
const modalTitulo = document.getElementById('modalDetalhesTitulo');
const modalCarregando = document.getElementById('modal-carregando');
const modalErro = document.getElementById('modal-erro');
const modalConteudo = document.getElementById('modal-conteudo');
const btnModalTentarNovamente = document.getElementById('btn-modal-tentar-novamente');

let modalDetalhes = null;
if (window.bootstrap) {
  modalDetalhes = new bootstrap.Modal(modalDetalhesEl);
}

// Cache dos filmes já carregados (usado pela busca/filtro local)
let filmesCarregados = [];
let idSelecionadoAtual = null;

// --------------------------------------------------------------------------
// Estados da interface (carregando / vazio / erro)
// --------------------------------------------------------------------------
function mostrarCarregando() {
  estadoCarregando.hidden = false;
  estadoVazio.hidden = true;
  estadoErro.hidden = true;
  listaFilmesEl.innerHTML = '';
}

function mostrarErro() {
  estadoCarregando.hidden = true;
  estadoVazio.hidden = true;
  estadoErro.hidden = false;
  listaFilmesEl.innerHTML = '';
}

function mostrarVazio() {
  estadoCarregando.hidden = true;
  estadoVazio.hidden = false;
  estadoErro.hidden = true;
}

function esconderEstados() {
  estadoCarregando.hidden = true;
  estadoVazio.hidden = true;
  estadoErro.hidden = true;
}

// --------------------------------------------------------------------------
// Carrega a listagem de filmes (AJAX #1 — Fetch API)
// --------------------------------------------------------------------------
async function carregarCatalogo() {
  mostrarCarregando();
  try {
    const resposta = await fetch('data/catalogo.json');
    if (!resposta.ok) {
      throw new Error('Falha ao buscar catalogo.json: ' + resposta.status);
    }
    const dados = await resposta.json();
    filmesCarregados = dados;
    preencherOpcoesCategoria(dados);
    renderizarFilmes(dados);
  } catch (erro) {
    console.error(erro);
    mostrarErro();
  }
}

// Popula o <select> de categorias a partir dos dados recebidos
function preencherOpcoesCategoria(filmes) {
  const categorias = [...new Set(filmes.map((f) => f.categoria))].sort();
  campoCategoria.innerHTML = '<option value="">Todas as categorias</option>';
  categorias.forEach((categoria) => {
    const opcao = document.createElement('option');
    opcao.value = categoria;
    opcao.textContent = categoria;
    campoCategoria.appendChild(opcao);
  });
}

// --------------------------------------------------------------------------
// Renderização dos cards (Bootstrap grid + cards)
// --------------------------------------------------------------------------
function renderizarFilmes(filmes) {
  if (filmes.length === 0) {
    mostrarVazio();
    listaFilmesEl.innerHTML = '';
    return;
  }
  esconderEstados();

  listaFilmesEl.innerHTML = filmes
    .map((filme) => {
      const inicial = filme.titulo.charAt(0).toUpperCase();
      return `
        <div class="col-12 col-md-6 col-lg-4">
          <article class="card card-filme h-100">
            <div class="poster-placeholder" style="background-color:#0f4c81" aria-hidden="true">
              ${inicial}
            </div>
            <div class="card-body d-flex flex-column">
              <h3 class="h5 card-title">${escapeHTML(filme.titulo)}</h3>
              <span class="badge text-bg-primary align-self-start mb-2">${escapeHTML(filme.categoria)}</span>
              <p class="card-text flex-grow-1">${escapeHTML(filme.resumo)}</p>
              <button type="button"
                      class="btn btn-primary mt-auto btn-ver-detalhes"
                      data-id="${filme.id}"
                      data-titulo="${escapeHTML(filme.titulo)}">
                Ver detalhes
              </button>
            </div>
          </article>
        </div>
      `;
    })
    .join('');
}

// Evita injeção de HTML a partir dos dados (mesmo vindo de arquivo local)
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// --------------------------------------------------------------------------
// Busca por texto e filtro por categoria (sobre os dados já carregados)
// --------------------------------------------------------------------------
function aplicarFiltros() {
  const termo = campoBusca.value.trim().toLowerCase();
  const categoria = campoCategoria.value;

  const filtrados = filmesCarregados.filter((filme) => {
    const combinaTexto =
      !termo ||
      filme.titulo.toLowerCase().includes(termo) ||
      filme.resumo.toLowerCase().includes(termo);
    const combinaCategoria = !categoria || filme.categoria === categoria;
    return combinaTexto && combinaCategoria;
  });

  renderizarFilmes(filtrados);
}

campoBusca.addEventListener('input', aplicarFiltros);
campoCategoria.addEventListener('change', aplicarFiltros);
btnTentarNovamente.addEventListener('click', carregarCatalogo);

// --------------------------------------------------------------------------
// Consulta de detalhes (AJAX #2 — nova requisição por item selecionado)
// --------------------------------------------------------------------------
listaFilmesEl.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.btn-ver-detalhes');
  if (!botao) return;

  const id = botao.dataset.id;
  const titulo = botao.dataset.titulo;
  abrirModalDetalhes(id, titulo);
});

function abrirModalDetalhes(id, titulo) {
  idSelecionadoAtual = id;
  modalTitulo.textContent = titulo;
  modalDetalhes.show();
  carregarDetalhes(id);
}

async function carregarDetalhes(id) {
  modalCarregando.classList.remove('d-none');
  modalErro.classList.add('d-none');
  modalConteudo.classList.add('d-none');

  try {
    const resposta = await fetch(`data/detalhes/${id}.json`);
    if (!resposta.ok) {
      throw new Error('Falha ao buscar detalhes do filme ' + id);
    }
    const dados = await resposta.json();
    renderizarDetalhes(dados);
  } catch (erro) {
    console.error(erro);
    modalCarregando.classList.add('d-none');
    modalErro.classList.remove('d-none');
  }
}

function renderizarDetalhes(dados) {
  modalCarregando.classList.add('d-none');
  modalErro.classList.add('d-none');
  modalConteudo.classList.remove('d-none');

  modalConteudo.innerHTML = `
    <div class="d-flex align-items-start gap-3 mb-3">
      <div class="poster-placeholder flex-shrink-0"
           style="background-color:${dados.corTema}; width:90px; height:120px; font-size:1.5rem;"
           aria-hidden="true">
        ${modalTitulo.textContent.charAt(0).toUpperCase()}
      </div>
      <dl class="row mb-0 flex-grow-1">
        <dt class="col-5 col-sm-4">Direção</dt>
        <dd class="col-7 col-sm-8">${escapeHTML(dados.diretor)}</dd>

        <dt class="col-5 col-sm-4">Ano</dt>
        <dd class="col-7 col-sm-8">${dados.ano}</dd>

        <dt class="col-5 col-sm-4">Duração</dt>
        <dd class="col-7 col-sm-8">${dados.duracaoMin} min</dd>

        <dt class="col-5 col-sm-4">Nota média</dt>
        <dd class="col-7 col-sm-8">${dados.notaMedia} / 10</dd>
      </dl>
    </div>
    <p><strong>Elenco:</strong> ${escapeHTML(dados.elenco.join(', '))}</p>
    <p>${escapeHTML(dados.sinopseCompleta)}</p>
  `;
}

btnModalTentarNovamente.addEventListener('click', () => {
  if (idSelecionadoAtual) {
    carregarDetalhes(idSelecionadoAtual);
  }
});

// --------------------------------------------------------------------------
// Inicialização
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', carregarCatalogo);
