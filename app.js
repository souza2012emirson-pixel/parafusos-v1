/* ============================================================================
   MÓDULO JS — 1. ESTADO / "BANCO DE DADOS" EM MEMÓRIA
   Preparado para futuramente ser substituído por chamadas fetch() a uma
   API REST (Node.js + Express + PostgreSQL) sem alterar a camada de UI:
   basta trocar as funções em "CAMADA DE DADOS" por chamadas assíncronas.
   ============================================================================ */

// Contador para gerar IDs internos únicos (independentes do código do item)
let proximoId = 1;
function gerarId(){ return "it_" + (proximoId++); }

// Itens migrados do sistema original, adaptados ao novo modelo de dados
// (prateleira + box, unidade, quantidade mínima/máxima, valor unitário).
// O "setor" preserva a localização original (corredor/balcão) como
// informação legada, sem afetar a nova organização por prateleira/box.
let itens = [
  ["PRF-001","Parafuso sextavado M6x20 zincado","Parafusos","UN",250,50,600,"A",3,"Depósito de Fixação · Corredor 1 / Balcão 1",2.5],
  ["PRF-002","Parafuso sextavado M8x30 zincado","Parafusos","UN",180,40,500,"A",7,"Depósito de Fixação · Corredor 1 / Balcão 1",3.1],
  ["PRF-003","Parafuso sextavado M8x40 zincado","Parafusos","UN",6,20,400,"B",2,"Depósito de Fixação · Corredor 1 / Balcão 1",3.4],
  ["PRF-004","Parafuso sextavado M10x50 zincado","Parafusos","UN",0,20,300,"B",5,"Depósito de Fixação · Corredor 1 / Balcão 1",4.2],
  ["PRF-005","Parafuso Phillips autoatarraxante 3,5x25","Parafusos","UN",400,80,900,"A",1,"Depósito de Fixação · Corredor 1 / Balcão 2",0.4],
  ["PRF-006","Parafuso Allen M5x16 aço inox","Parafusos","UN",90,30,300,"A",9,"Depósito de Fixação · Corredor 1 / Balcão 2",1.1],
  ["PRF-007","Parafuso rosca soberba 4,2x32","Parafusos","UN",3,15,200,"B",4,"Depósito de Fixação · Corredor 1 / Balcão 2",0.6],
  ["PRF-008","Parafuso francês M8x60 com porca","Parafusos","UN",40,10,150,"C",6,"Depósito de Fixação · Corredor 1 / Balcão 2",5.3],
  ["POR-001","Porca sextavada M6","Porcas","UN",500,100,1200,"A",2,"Depósito de Fixação · Corredor 1 / Balcão 3",0.3],
  ["POR-002","Porca sextavada M8","Porcas","UN",320,80,900,"A",8,"Depósito de Fixação · Corredor 1 / Balcão 3",0.4],
  ["POR-003","Porca sextavada M10","Porcas","UN",5,25,500,"B",1,"Depósito de Fixação · Corredor 1 / Balcão 3",0.6],
  ["POR-004","Porca borboleta M6","Porcas","UN",0,20,300,"B",10,"Depósito de Fixação · Corredor 1 / Balcão 3",0.8],
  ["POR-005","Porca sextavada nylon autotravante M8","Porcas","UN",60,20,250,"C",3,"Depósito de Fixação · Corredor 1 / Balcão 3",1.2],
  ["ARR-001","Arruela lisa M6","Arruelas","UN",600,100,1500,"A",1,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 1",0.15],
  ["ARR-002","Arruela lisa M8","Arruelas","UN",450,90,1200,"A",6,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 1",0.2],
  ["ARR-003","Arruela de pressão M8","Arruelas","UN",4,20,400,"B",2,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 1",0.25],
  ["ARR-004","Arruela lisa M10","Arruelas","UN",200,60,700,"B",9,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 1",0.3],
  ["ARR-005","Arruela de pressão M6","Arruelas","UN",0,20,300,"C",5,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 1",0.18],
  ["LIX-001","Lixa d'água grão 220","Lixas e Abrasivos","UN",80,20,200,"A",3,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 2",1.8],
  ["LIX-002","Lixa para madeira grão 100","Lixas e Abrasivos","UN",35,15,150,"A",11,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 2",1.6],
  ["LIX-003","Lixa de ferro grão 80","Lixas e Abrasivos","UN",2,10,100,"B",4,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 2",1.7],
  ["LIX-004","Disco de lixa 115mm grão 60","Lixas e Abrasivos","UN",0,15,150,"B",12,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 2",4.5],
  ["LIX-005","Disco de corte 4.1/2 polegadas","Lixas e Abrasivos","UN",22,15,120,"C",7,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 2",6.2],
  ["ABR-001","Abraçadeira de nylon 200mm","Abraçadeiras","UN",300,60,700,"A",1,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 3",0.35],
  ["ABR-002","Abraçadeira de nylon 300mm","Abraçadeiras","UN",150,40,500,"A",8,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 3",0.55],
  ["ABR-003","Abraçadeira metálica worm drive 3/4 polegada","Abraçadeiras","UN",5,15,200,"B",3,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 3",3.9],
  ["ABR-004","Abraçadeira tipo D 1/2 polegada","Abraçadeiras","UN",0,15,150,"B",14,"Depósito de Abrasivos e Amarração · Corredor 2 / Balcão 3",2.4],
  ["BUC-001","Bucha de nylon S6","Buchas e Fixação","UN",220,50,500,"A",2,"Depósito de Complementos · Corredor 3 / Balcão 1",0.2],
  ["BUC-002","Bucha de nylon S8","Buchas e Fixação","UN",190,50,500,"A",9,"Depósito de Complementos · Corredor 3 / Balcão 1",0.25],
  ["BUC-003","Chumbador parabolt 3/8 polegada","Buchas e Fixação","UN",3,15,150,"B",1,"Depósito de Complementos · Corredor 3 / Balcão 1",8.9],
  ["REB-001","Rebite pop 4,8x12","Rebites e Pregos","UN",500,100,1000,"A",4,"Depósito de Complementos · Corredor 3 / Balcão 2",0.12],
  ["REB-002","Prego 18x30 com cabeça","Rebites e Pregos","KG",8,10,80,"A",13,"Depósito de Complementos · Corredor 3 / Balcão 2",14.0],
  ["REB-003","Prego para concreto 2x17","Rebites e Pregos","KG",0,10,60,"B",6,"Depósito de Complementos · Corredor 3 / Balcão 2",16.5],
  ["CON-001","Fita veda-rosca 18mm","Consumíveis","UN",65,20,200,"A",1,"Depósito de Complementos · Corredor 3 / Balcão 3",1.1],
  ["CON-002","Broca aço rápido 6mm","Consumíveis","UN",4,15,100,"A",10,"Depósito de Complementos · Corredor 3 / Balcão 3",6.3],
  ["CON-003","Broca para concreto 8mm","Consumíveis","UN",12,15,100,"B",2,"Depósito de Complementos · Corredor 3 / Balcão 3",6.8],
  ["CON-004","Estopa para limpeza 1kg","Consumíveis","KG",0,10,60,"B",15,"Depósito de Complementos · Corredor 3 / Balcão 3",9.5],
].map(([codigo,descricao,categoria,unidade,quantidade,qtdMin,qtdMax,prateleira,box,setor,valorUnit]) => ({
  id: gerarId(), codigo, descricao, categoria, unidade,
  quantidade, qtdMin, qtdMax, prateleira, box,
  observacoes:"", codigoBarras:"", foto:null, setor,
  valorUnit, criadoEm:new Date().toISOString(), atualizadoEm:new Date().toISOString()
}));

// Histórico completo de alterações (quem, quando, campo, valor anterior/novo)
let historico = [];

// Configurações gerais do sistema (usuário logado, simulação do servidor)
let config = {
  usuario: "Administrador",
  serverOnline: true,
  autoBackupLembrete: true,
};
window.config = config; // exposto para o auth.js poder definir o usuário logado
let ultimaSync = new Date();

// Termo de pesquisa atual, para re-renderizar a lista filtrada sempre que
// um item é adicionado, removido ou tem seus dados alterados.
let currentTerm = "";

/* ============================================================================
   2. REFERÊNCIAS DE ELEMENTOS DO DOM
   ============================================================================ */
const searchInput  = document.getElementById("searchInput");
const clearBtn      = document.getElementById("clearBtn");
const resultsEl     = document.getElementById("results");
const resultCountEl = document.getElementById("resultCount");
const modalRoot      = document.getElementById("modalRoot");
const toastRoot       = document.getElementById("toastRoot");

/* ============================================================================
   3. FUNÇÕES AUXILIARES DE TEXTO / FORMATAÇÃO
   ============================================================================ */
function normalizar(texto){
  return texto.toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}
function escapeRegExp(texto){ return texto.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}
function destacar(texto, termo){
  const textoEscapado = escapeHTML(texto);
  if (!termo) return textoEscapado;
  const regex = new RegExp("(" + escapeRegExp(termo) + ")", "gi");
  return textoEscapado.replace(regex, "<mark>$1</mark>");
}
function formatarBox(box){ return String(box).padStart(2,"0"); }
function formatarMoeda(v){
  return (v||0).toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
}
function formatarDataHora(d){
  return d.toLocaleString("pt-BR");
}

// Define o status do estoque a partir da quantidade e da quantidade mínima do item.
function statusEstoque(item){
  if (item.quantidade === 0) return { classe:"status-sem",    texto:"Sem estoque"   };
  if (item.quantidade <= item.qtdMin) return { classe:"status-baixo",  texto:"Estoque baixo" };
  return { classe:"status-normal", texto:"Estoque normal" };
}

/* ============================================================================
   4. TOAST — notificação de confirmação
   ============================================================================ */
let toastTimeout = null;
function toast(mensagem){
  clearTimeout(toastTimeout);
  toastRoot.innerHTML = `
    <div class="toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${escapeHTML(mensagem)}</span>
    </div>`;
  toastTimeout = setTimeout(() => { toastRoot.innerHTML = ""; }, 3200);
}

/* ============================================================================
   5. MODAL — abrir / fechar genérico
   ============================================================================ */
function abrirModal(innerHtml, wide){
  modalRoot.innerHTML = `<div class="modal-overlay" id="overlayAtual"><div class="modal ${wide?'modal-wide':''}">${innerHtml}</div></div>`;
  document.getElementById("overlayAtual").addEventListener("click", (e) => {
    if (e.target.id === "overlayAtual") fecharModal();
  });
}
function fecharModal(){ modalRoot.innerHTML = ""; }
window.fecharModal = fecharModal;

/* ============================================================================
   6. CAMADA DE DADOS — CRUD e histórico
   (Ponto único de mutação do array "itens" — no futuro, cada função aqui
   viraria uma chamada fetch() para a API REST.)
   ============================================================================ */
function registrarHistorico(item, campo, valorAnterior, valorNovo){
  historico.unshift({
    codigo: item.codigo,
    descricao: item.descricao,
    campo,
    valorAnterior: String(valorAnterior),
    valorNovo: String(valorNovo),
    usuario: config.usuario,
    data: new Date(),
  });
}

function salvarItem(dados, itemExistente){
  const agora = new Date().toISOString();
  if (itemExistente){
    // Edição: compara campo a campo e registra no histórico o que mudou
    const camposComparar = ["codigo","descricao","categoria","unidade","quantidade","qtdMin","qtdMax","prateleira","box","observacoes","codigoBarras","valorUnit"];
    camposComparar.forEach(campo => {
      if (String(itemExistente[campo]) !== String(dados[campo])){
        registrarHistorico(itemExistente, campo, itemExistente[campo], dados[campo]);
      }
    });
    Object.assign(itemExistente, dados, { atualizadoEm: agora });
    return itemExistente;
  } else {
    const novo = { id:gerarId(), ...dados, foto:dados.foto||null, criadoEm:agora, atualizadoEm:agora };
    itens.push(novo);
    registrarHistorico(novo, "cadastro", "-", "Item criado");
    return novo;
  }
}

/* ============================================================================
   7. BUSCA
   ============================================================================ */
function buscarItens(termo){
  if (!termo) return itens;
  const termoNorm = normalizar(termo.trim());
  if (!termoNorm) return itens;
  return itens.filter(item => {
    const campos = [
      item.codigo, item.descricao, item.categoria, item.prateleira,
      formatarBox(item.box), item.codigoBarras, item.observacoes, item.unidade
    ];
    return campos.some(c => c && normalizar(c).includes(termoNorm));
  });
}

/* ============================================================================
   8. DASHBOARD — KPIs e gráficos (SVG desenhado à mão, sem dependências)
   ============================================================================ */
function renderDashboard(){
  const total = itens.length;
  const baixo = itens.filter(i => i.quantidade > 0 && i.quantidade <= i.qtdMin).length;
  const zerado = itens.filter(i => i.quantidade === 0).length;
  const normal = total - baixo - zerado;
  const valorTotal = itens.reduce((acc,i) => acc + (i.quantidade * (i.valorUnit||0)), 0);
  const categorias = new Set(itens.map(i => i.categoria)).size;

  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiTotalSub").textContent = `${categorias} categoria${categorias===1?'':'s'}`;
  document.getElementById("kpiBaixo").textContent = baixo;
  document.getElementById("kpiZerado").textContent = zerado;
  document.getElementById("kpiValor").textContent = formatarMoeda(valorTotal);
  document.getElementById("hstatItens").textContent = total;

  // --- Donut de status ---
  const dados = [
    { label:"Normal", valor:normal, cor:"#22C55E" },
    { label:"Baixo",  valor:baixo,  cor:"#F97316" },
    { label:"Zerado", valor:zerado, cor:"#EF4444" },
  ];
  const somaTotal = Math.max(1, normal+baixo+zerado);
  let acumulado = 0;
  const raio = 46, circunf = 2*Math.PI*raio;
  const arcos = dados.map(d => {
    const frac = d.valor/somaTotal;
    const dash = frac*circunf;
    const offset = circunf - acumulado*circunf;
    acumulado += frac;
    return `<circle cx="60" cy="60" r="${raio}" fill="none" stroke="${d.cor}" stroke-width="14"
      stroke-dasharray="${dash} ${circunf-dash}" stroke-dashoffset="${offset}" transform="rotate(-90 60 60)"/>`;
  }).join("");

  document.getElementById("donutWrap").innerHTML = `
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="${raio}" fill="none" stroke="#242424" stroke-width="14"/>
      ${arcos}
      <text x="60" y="56" text-anchor="middle" font-size="20" font-weight="800" fill="#F2F2F2">${total}</text>
      <text x="60" y="72" text-anchor="middle" font-size="9" fill="#7C7C7C">itens</text>
    </svg>
    <div class="donut-legend">
      ${dados.map(d => `<div class="leg-item"><span class="sw" style="background:${d.cor}"></span>${d.label} &middot; ${d.valor}</div>`).join("")}
    </div>`;

  // --- Barras por categoria ---
  const porCategoria = {};
  itens.forEach(i => { porCategoria[i.categoria] = (porCategoria[i.categoria]||0) + i.quantidade; });
  const entradas = Object.entries(porCategoria).sort((a,b) => b[1]-a[1]).slice(0,7);
  const maxVal = Math.max(1, ...entradas.map(e => e[1]));
  document.getElementById("barChart").innerHTML = entradas.map(([cat,val]) => `
    <div class="bar-row">
      <span class="bar-label" title="${escapeHTML(cat)}">${escapeHTML(cat)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(val/maxVal*100).toFixed(1)}%"></div></div>
      <span class="bar-num">${val}</span>
    </div>`).join("") || `<p style="color:var(--text-faint); font-size:12px;">Nenhum item cadastrado.</p>`;
}

/* ============================================================================
   9. RENDERIZAÇÃO DOS CARDS
   ============================================================================ */
function classeQty(item){
  if (item.quantidade === 0) return "qty-danger";
  if (item.quantidade <= item.qtdMin) return "qty-warn";
  return "qty-ok";
}

function renderizar(lista, termoOriginal){
  resultCountEl.textContent = `${lista.length} de ${itens.length} itens`;

  if (lista.length === 0){
    resultsEl.innerHTML = `
      <div class="empty-state">
        <strong>Nenhum item encontrado.</strong>
        <span>Tente pesquisar pelo código, descrição, categoria, prateleira, box ou código de barras.</span>
      </div>`;
    return;
  }

  resultsEl.innerHTML = lista.map(item => {
    const status = statusEstoque(item);
    const fotoHtml = item.foto
      ? `<img src="${item.foto}" alt="${escapeHTML(item.codigo)}">`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5.5-5.5L9 18"/></svg>`;

    return `
      <div class="item-card ${status.classe}">
        <div class="status-bar"></div>
        <div class="card-photo-row">
          <div class="card-photo" data-action="verfoto" data-id="${item.id}" title="Ampliar foto">${fotoHtml}</div>
          <div class="card-top-info">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
              <div>
                <div class="card-codigo">${escapeHTML(item.codigo)}</div>
                <div class="card-nome">${destacar(item.descricao, termoOriginal)}</div>
              </div>
              <span class="badge-status">${status.texto}</span>
            </div>
            <div class="card-categoria">${escapeHTML(item.categoria)}</div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-meta-grid">
            <div class="meta-cell">
              <span class="m-lbl">Quantidade</span>
              <span class="m-val ${classeQty(item)}">${item.quantidade} ${escapeHTML(item.unidade)}</span>
            </div>
            <div class="meta-cell">
              <span class="m-lbl">Mínimo / Máximo</span>
              <span class="m-val">${item.qtdMin} / ${item.qtdMax}</span>
            </div>
          </div>

          <div class="loc-tags">
            <span class="loc-tag">Prateleira ${escapeHTML(item.prateleira)}</span>
            <span class="loc-tag">Box ${formatarBox(item.box)}</span>
          </div>

          <div class="card-actions">
            <button type="button" class="act-btn" data-action="editar" data-id="${item.id}" title="Editar item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> Editar
            </button>
            <button type="button" class="act-btn" data-action="saldo" data-id="${item.id}" title="Ajustar saldo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20V4M6 10l6-6 6 6"/></svg> Saldo
            </button>
            <button type="button" class="act-btn" data-action="movimentacao" data-id="${item.id}" title="Ver movimentação/histórico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg> Movim.
            </button>
            <button type="button" class="act-btn" data-action="pedido" data-id="${item.id}" title="Adicionar ao pedido de compra">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2l1 5h10l1-5"/><path d="M3 7h18l-1.5 12.5A2 2 0 0 1 17.5 21h-11a2 2 0 0 1-2-1.5z"/></svg> Pedido
            </button>
            <button type="button" class="act-btn" data-action="qrcode" data-id="${item.id}" title="Gerar QR Code / código de barras">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM19 14v3M14 19h3M19 19h.01"/></svg> QR
            </button>
            <button type="button" class="act-btn" data-action="duplicar" data-id="${item.id}" title="Duplicar item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg> Duplicar
            </button>
            <button type="button" class="act-btn act-danger" data-action="remover" data-id="${item.id}" title="Excluir item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 7h16"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg> Excluir
            </button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function atualizarTela(){
  renderizar(buscarItens(currentTerm), currentTerm);
  renderDashboard();
}

/* ============================================================================
   10. UPLOAD DE FOTO (upload / arrastar / trocar / excluir)
   ============================================================================ */
function montarUploaderFoto(fotoAtual){
  return `
    <div class="photo-uploader">
      <label>Foto do item</label>
      <div class="drop-zone" id="dropZone">
        <div class="drop-preview" id="dropPreview">
          ${fotoAtual ? `<img src="${fotoAtual}" alt="Prévia">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5.5-5.5L9 18"/></svg>`}
        </div>
        <div class="drop-text">
          <b>Arraste uma imagem aqui</b>
          ou clique para selecionar do computador (PNG/JPG)
        </div>
        <div class="drop-actions">
          <button type="button" class="btn btn-sm btn-outline" id="btnTrocarFoto">Trocar</button>
          <button type="button" class="btn btn-sm btn-outline" id="btnExcluirFoto">Excluir</button>
        </div>
      </div>
      <input type="file" id="inputFoto" accept="image/*" hidden>
    </div>`;
}

function ativarUploaderFoto(getFotoAtual, setFotoAtual){
  const dropZone = document.getElementById("dropZone");
  const inputFoto = document.getElementById("inputFoto");
  const preview = document.getElementById("dropPreview");
  const btnTrocar = document.getElementById("btnTrocarFoto");
  const btnExcluir = document.getElementById("btnExcluirFoto");

  function lerArquivo(file){
    if (!file || !file.type.startsWith("image/")){
      toast("Selecione um arquivo de imagem válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFotoAtual(reader.result);
      preview.innerHTML = `<img src="${reader.result}" alt="Prévia">`;
    };
    reader.readAsDataURL(file);
  }

  dropZone.addEventListener("click", (e) => {
    if (e.target === btnExcluir) return;
    inputFoto.click();
  });
  inputFoto.addEventListener("change", () => lerArquivo(inputFoto.files[0]));

  ["dragenter","dragover"].forEach(ev => dropZone.addEventListener(ev, (e) => {
    e.preventDefault(); dropZone.classList.add("dragover");
  }));
  ["dragleave","drop"].forEach(ev => dropZone.addEventListener(ev, (e) => {
    e.preventDefault(); dropZone.classList.remove("dragover");
  }));
  dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    lerArquivo(file);
  });

  btnTrocar.addEventListener("click", (e) => { e.stopPropagation(); inputFoto.click(); });
  btnExcluir.addEventListener("click", (e) => {
    e.stopPropagation();
    setFotoAtual(null);
    preview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5.5-5.5L9 18"/></svg>`;
  });
}

function verFotoAmpliada(id){
  const item = itens.find(i => i.id === id);
  if (!item || !item.foto){ toast("Este item ainda não possui foto cadastrada."); return; }
  abrirModal(`
    <div class="modal-item-tag" style="margin-bottom:14px;"><b>${escapeHTML(item.codigo)}</b> — ${escapeHTML(item.descricao)}</div>
    <div class="image-viewer"><img src="${item.foto}" alt="${escapeHTML(item.codigo)}"></div>
    <div class="modal-actions"><button type="button" class="btn btn-primary" onclick="fecharModal()">Fechar</button></div>
  `);
}

/* ============================================================================
   11. FORMULÁRIO — ADICIONAR / EDITAR ITEM
   ============================================================================ */
function formularioItem(item){
  const categoriasExistentes = [...new Set(itens.map(i => i.categoria))];
  const unidadesExistentes = [...new Set(itens.map(i => i.unidade))];
  const ehEdicao = !!item;

  abrirModal(`
    <h2>${ehEdicao ? "Editar item" : "Adicionar item"}</h2>
    <p class="modal-sub">${ehEdicao ? "Atualize os dados do item selecionado." : "Preencha os dados do novo item e sua localização no almoxarifado."}</p>

    ${montarUploaderFoto(item ? item.foto : null)}

    <form id="formItem">
      <div class="field-row">
        <div class="field">
          <label for="fCodigo">Código</label>
          <input id="fCodigo" type="text" placeholder="Ex: PRF-009" value="${item?escapeHTML(item.codigo):''}" required>
        </div>
        <div class="field">
          <label for="fCategoria">Categoria</label>
          <input id="fCategoria" list="listaCategorias" type="text" placeholder="Ex: Parafusos" value="${item?escapeHTML(item.categoria):''}" required>
          <datalist id="listaCategorias">${categoriasExistentes.map(c => `<option value="${escapeHTML(c)}">`).join("")}</datalist>
        </div>
      </div>

      <div class="field">
        <label for="fDescricao">Descrição</label>
        <input id="fDescricao" type="text" placeholder="Ex: Parafuso sextavado M6x25" value="${item?escapeHTML(item.descricao):''}" required>
      </div>

      <div class="field-row3">
        <div class="field">
          <label for="fUnidade">Unidade</label>
          <input id="fUnidade" list="listaUnidades" type="text" placeholder="UN / KG / CX" value="${item?escapeHTML(item.unidade):'UN'}" required>
          <datalist id="listaUnidades">${unidadesExistentes.map(u => `<option value="${escapeHTML(u)}">`).join("")}</datalist>
        </div>
        <div class="field">
          <label for="fPrateleira">Prateleira</label>
          <select id="fPrateleira" required>
            ${["A","B","C","D","E","F"].map(p => `<option value="${p}" ${item&&item.prateleira===p?'selected':''}>${p}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="fBox">Box</label>
          <input id="fBox" type="number" min="1" placeholder="1" value="${item?item.box:''}" required>
        </div>
      </div>

      <div class="field-row3">
        <div class="field">
          <label for="fQuantidade">Quantidade atual</label>
          <input id="fQuantidade" type="number" min="0" placeholder="0" value="${item?item.quantidade:0}" required>
        </div>
        <div class="field">
          <label for="fQtdMin">Quantidade mínima</label>
          <input id="fQtdMin" type="number" min="0" placeholder="0" value="${item?item.qtdMin:0}" required>
        </div>
        <div class="field">
          <label for="fQtdMax">Quantidade máxima</label>
          <input id="fQtdMax" type="number" min="0" placeholder="0" value="${item?item.qtdMax:0}" required>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="fValorUnit">Valor unitário (R$)</label>
          <input id="fValorUnit" type="number" min="0" step="0.01" placeholder="0,00" value="${item?item.valorUnit:0}">
        </div>
        <div class="field">
          <label for="fCodigoBarras">Código de barras</label>
          <input id="fCodigoBarras" type="text" placeholder="Ex: 7891234567890" value="${item?escapeHTML(item.codigoBarras):''}">
        </div>
      </div>

      <div class="field">
        <label for="fObservacoes">Observações</label>
        <textarea id="fObservacoes" placeholder="Observações adicionais sobre o item...">${item?escapeHTML(item.observacoes):''}</textarea>
      </div>

      <div class="field-error" id="erroItem"></div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="fecharModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${ehEdicao?'Salvar alterações':'Adicionar item'}</button>
      </div>
    </form>
  `);

  let fotoTemp = item ? item.foto : null;
  ativarUploaderFoto(() => fotoTemp, (v) => { fotoTemp = v; });

  document.getElementById("formItem").addEventListener("submit", (e) => {
    e.preventDefault();
    const erroEl = document.getElementById("erroItem");

    const dados = {
      codigo: document.getElementById("fCodigo").value.trim().toUpperCase(),
      categoria: document.getElementById("fCategoria").value.trim(),
      descricao: document.getElementById("fDescricao").value.trim(),
      unidade: document.getElementById("fUnidade").value.trim().toUpperCase() || "UN",
      prateleira: document.getElementById("fPrateleira").value,
      box: parseInt(document.getElementById("fBox").value, 10),
      quantidade: parseInt(document.getElementById("fQuantidade").value, 10),
      qtdMin: parseInt(document.getElementById("fQtdMin").value, 10),
      qtdMax: parseInt(document.getElementById("fQtdMax").value, 10),
      valorUnit: parseFloat(document.getElementById("fValorUnit").value) || 0,
      codigoBarras: document.getElementById("fCodigoBarras").value.trim(),
      observacoes: document.getElementById("fObservacoes").value.trim(),
      foto: fotoTemp,
      setor: item ? item.setor : "",
    };

    if (!dados.codigo || !dados.categoria || !dados.descricao || isNaN(dados.box) || isNaN(dados.quantidade) || isNaN(dados.qtdMin) || isNaN(dados.qtdMax)){
      erroEl.textContent = "Preencha todos os campos obrigatórios corretamente.";
      erroEl.classList.add("show");
      return;
    }
    const duplicado = itens.some(i => i.codigo.toUpperCase() === dados.codigo && (!item || i.id !== item.id));
    if (duplicado){
      erroEl.textContent = `Já existe um item com o código "${dados.codigo}".`;
      erroEl.classList.add("show");
      return;
    }

    salvarItem(dados, item);
    fecharModal();
    atualizarTela();
    toast(ehEdicao ? `Item "${dados.codigo}" atualizado com sucesso.` : `Item "${dados.codigo}" adicionado com sucesso.`);
  });
}

/* ============================================================================
   12. AJUSTE DE SALDO (movimentação de entrada/saída)
   ============================================================================ */
function abrirModalSaldo(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;

  abrirModal(`
    <h2>Ajustar saldo</h2>
    <p class="modal-sub">Registre uma entrada, saída ou defina diretamente o novo saldo do item.</p>
    <div class="modal-item-tag"><b>${escapeHTML(item.codigo)}</b> — ${escapeHTML(item.descricao)} &middot; saldo atual: <b>${item.quantidade} ${escapeHTML(item.unidade)}</b></div>
    <form id="formSaldo">
      <div class="field">
        <label for="fTipoMov">Tipo de movimentação</label>
        <select id="fTipoMov">
          <option value="entrada">Entrada (somar)</option>
          <option value="saida">Saída (subtrair)</option>
          <option value="definir">Definir novo saldo</option>
        </select>
      </div>
      <div class="field">
        <label for="fQtdMov">Quantidade</label>
        <input id="fQtdMov" type="number" min="0" value="0" required autofocus>
      </div>
      <div class="field-error" id="erroSaldo"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="fecharModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Confirmar</button>
      </div>
    </form>
  `);

  document.getElementById("formSaldo").addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = document.getElementById("fTipoMov").value;
    const qtd = parseInt(document.getElementById("fQtdMov").value, 10);
    const erroEl = document.getElementById("erroSaldo");
    if (isNaN(qtd) || qtd < 0){
      erroEl.textContent = "Informe uma quantidade válida (0 ou maior).";
      erroEl.classList.add("show");
      return;
    }
    const anterior = item.quantidade;
    let novo = anterior;
    if (tipo === "entrada") novo = anterior + qtd;
    if (tipo === "saida")   novo = Math.max(0, anterior - qtd);
    if (tipo === "definir") novo = qtd;

    item.quantidade = novo;
    item.atualizadoEm = new Date().toISOString();
    registrarHistorico(item, "quantidade", anterior, novo);
    fecharModal();
    atualizarTela();
    toast(`Saldo de "${item.codigo}" atualizado: ${anterior} → ${novo}.`);
  });
}

/* ============================================================================
   13. AÇÕES RÁPIDAS — duplicar / remover
   ============================================================================ */
function duplicarItem(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;
  let novoCodigo = item.codigo + "-COPIA";
  let sufixo = 1;
  while (itens.some(i => i.codigo === novoCodigo)){
    sufixo++;
    novoCodigo = `${item.codigo}-COPIA${sufixo}`;
  }
  const copia = { ...item, id:gerarId(), codigo:novoCodigo, criadoEm:new Date().toISOString(), atualizadoEm:new Date().toISOString() };
  itens.push(copia);
  registrarHistorico(copia, "cadastro", "-", `Duplicado a partir de ${item.codigo}`);
  atualizarTela();
  toast(`Item duplicado como "${novoCodigo}".`);
}

function confirmarRemocao(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;
  abrirModal(`
    <h2>Excluir item</h2>
    <p class="modal-sub">O item será removido permanentemente da lista. Esta ação não pode ser desfeita.</p>
    <div class="modal-item-tag"><b>${escapeHTML(item.codigo)}</b> — ${escapeHTML(item.descricao)}</div>
    <div class="modal-actions">
      <button type="button" class="btn btn-outline" onclick="fecharModal()">Cancelar</button>
      <button type="button" class="btn btn-danger" id="confirmaRemoverBtn">Excluir item</button>
    </div>
  `);
  document.getElementById("confirmaRemoverBtn").addEventListener("click", () => {
    itens = itens.filter(i => i.id !== id);
    registrarHistorico(item, "exclusao", "Cadastrado", "Excluído");
    fecharModal();
    atualizarTela();
    toast(`Item "${item.codigo}" removido.`);
  });
}

/* ============================================================================
   14. QR CODE / CÓDIGO DE BARRAS
   ============================================================================ */
function abrirModalCodigos(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;

  abrirModal(`
    <h2>QR Code &amp; Código de barras</h2>
    <p class="modal-sub">Identificação visual para etiquetagem de prateleira.</p>
    <div class="modal-item-tag"><b>${escapeHTML(item.codigo)}</b> — ${escapeHTML(item.descricao)}</div>
    <div style="display:flex; gap:24px; flex-wrap:wrap; justify-content:center; padding:10px 0;">
      <div style="text-align:center;">
        <div id="qrContainer" style="background:#fff; padding:10px; border-radius:10px; display:inline-block;"></div>
        <div style="margin-top:8px;"><button type="button" class="btn btn-sm" id="btnBaixarQr">Baixar QR</button></div>
      </div>
      <div style="text-align:center;">
        <svg id="barcodeSvg" style="background:#fff; border-radius:10px;"></svg>
        <div style="margin-top:8px;"><button type="button" class="btn btn-sm" id="btnBaixarBarras">Baixar código de barras</button></div>
      </div>
    </div>
    <div class="modal-actions"><button type="button" class="btn btn-primary" onclick="fecharModal()">Fechar</button></div>
  `);

  try{
    new QRCode(document.getElementById("qrContainer"), {
      text: item.codigoBarras || item.codigo,
      width: 140, height: 140,
      colorDark: "#0D0D0D", colorLight: "#ffffff",
    });
  }catch(err){ document.getElementById("qrContainer").textContent = "QR indisponível."; }

  try{
    JsBarcode("#barcodeSvg", item.codigoBarras || item.codigo, { width:2, height:70, fontSize:13, margin:8 });
  }catch(err){ /* código inválido para geração de barras */ }

  document.getElementById("btnBaixarQr").addEventListener("click", () => {
    const img = document.querySelector("#qrContainer img") || document.querySelector("#qrContainer canvas");
    const url = img.tagName === "IMG" ? img.src : img.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = `qrcode-${item.codigo}.png`; a.click();
  });
  document.getElementById("btnBaixarBarras").addEventListener("click", () => {
    const svg = document.getElementById("barcodeSvg");
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type:"image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `codigobarras-${item.codigo}.svg`; a.click();
    URL.revokeObjectURL(url);
  });
}

/* ============================================================================
   15. RELATÓRIO — agrupado por Prateleira → Box (não por código)
   ============================================================================ */
function gerarRelatorio(){
  const grupos = {};
  itens.forEach(item => {
    if (!grupos[item.prateleira]) grupos[item.prateleira] = {};
    const boxKey = formatarBox(item.box);
    if (!grupos[item.prateleira][boxKey]) grupos[item.prateleira][boxKey] = [];
    grupos[item.prateleira][boxKey].push(item);
  });

  const prateleirasOrdenadas = Object.keys(grupos).sort();
  let contador = 0;
  let blocos = "";

  prateleirasOrdenadas.forEach(prat => {
    const boxesOrdenados = Object.keys(grupos[prat]).sort();
    let linhasPrateleira = "";
    boxesOrdenados.forEach(boxKey => {
      grupos[prat][boxKey].forEach(item => {
        contador++;
        linhasPrateleira += `
          <tr>
            <td>${contador}</td>
            <td>${item.foto ? `<img class="thumb" src="${item.foto}">` : ""}</td>
            <td class="mono">${escapeHTML(item.codigo)}</td>
            <td>${escapeHTML(item.descricao)}</td>
            <td class="mono">Prat. ${escapeHTML(prat)} / Box ${boxKey}</td>
            <td class="num">${item.quantidade}</td>
            <td class="blank"></td>
            <td class="blank"></td>
            <td class="blank"></td>
          </tr>`;
      });
    });
    blocos += `
      <tr class="group-row"><td colspan="9">Prateleira ${escapeHTML(prat)}</td></tr>
      ${linhasPrateleira}`;
  });

  const dataGeracao = formatarDataHora(new Date());
  const paginaHtml = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório de Contagem — Almoxarifado</title>
<style>
  * { box-sizing: border-box; }
  body{ font-family:-apple-system,Arial,sans-serif; color:#1c2430; padding:28px; }
  h1{ font-size:20px; margin:0 0 4px; }
  .sub{ font-size:12.5px; color:#5c6673; margin:0 0 18px; }
  table{ width:100%; border-collapse:collapse; font-size:11.5px; }
  th, td{ border:1px solid #d8dce2; padding:6px 8px; text-align:left; vertical-align:middle; }
  th{ background:#f1f3f6; text-transform:uppercase; font-size:10px; letter-spacing:.04em; }
  td.mono{ font-family:ui-monospace,Consolas,monospace; }
  td.num{ text-align:right; font-weight:700; }
  td.blank{ min-width:60px; }
  tr.group-row td{ background:#e8590c; color:#fff; font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:.05em; }
  img.thumb{ width:32px; height:32px; object-fit:cover; border-radius:4px; }
  .no-print{ margin-top:18px; display:flex; gap:10px; }
  .no-print button{ font-size:13px; padding:8px 16px; border-radius:8px; border:1px solid #d8dce2; background:#fff; cursor:pointer; }
  @media print{ .no-print{ display:none; } body{ padding:0; } }
</style></head>
<body>
  <h1>Relatório de Contagem de Estoque</h1>
  <p class="sub">Gerado em ${dataGeracao} &middot; ${itens.length} itens &middot; agrupado por Prateleira → Box (crescente)</p>
  <table>
    <thead><tr>
      <th>#</th><th>Foto</th><th>Código</th><th>Descrição</th><th>Localização</th>
      <th>Saldo sistema</th><th>Contagem física</th><th>Diferença</th><th>Observações</th>
    </tr></thead>
    <tbody>${blocos}</tbody>
  </table>
  <div class="no-print">
    <button onclick="window.print()">Imprimir / Salvar como PDF</button>
  </div>
</body></html>`;

  const janela = window.open("", "_blank");
  if (!janela){ toast("Não foi possível abrir o relatório. Verifique o bloqueador de pop-ups."); return; }
  janela.document.write(paginaHtml);
  janela.document.close();
}

/* ============================================================================
   16. PEDIDO DE COMPRA — tela exclusiva com itens abaixo do mínimo
   ============================================================================ */
function abrirTelaPedidoCompra(){
  const abaixoMinimo = itens.filter(i => i.quantidade <= i.qtdMin);

  if (abaixoMinimo.length === 0){
    abrirModal(`
      <h2>Pedido de Compra</h2>
      <p class="modal-sub">Nenhum item está abaixo da quantidade mínima no momento.</p>
      <div class="modal-actions"><button type="button" class="btn btn-primary" onclick="fecharModal()">Fechar</button></div>
    `, true);
    return;
  }

  const linhas = abaixoMinimo.map(item => {
    const sugerida = Math.max(item.qtdMax - item.quantidade, item.qtdMin);
    return `
      <tr data-id="${item.id}">
        <td><input type="checkbox" class="chk chk-pedido" data-id="${item.id}" checked></td>
        <td class="mono">${escapeHTML(item.codigo)}</td>
        <td>${escapeHTML(item.descricao)}</td>
        <td class="mono">Prat. ${escapeHTML(item.prateleira)} / Box ${formatarBox(item.box)}</td>
        <td class="num">${item.quantidade}</td>
        <td class="num">${item.qtdMin}</td>
        <td class="num"><input type="number" min="1" value="${sugerida}" class="input-sugerida" data-id="${item.id}" style="width:70px; padding:5px 7px; border-radius:6px; border:1px solid var(--border); background:var(--menu); color:var(--text);"></td>
      </tr>`;
  }).join("");

  abrirModal(`
    <h2>Pedido de Compra</h2>
    <p class="modal-sub">Itens abaixo da quantidade mínima — selecione os itens e ajuste a quantidade sugerida.</p>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr>
          <th><input type="checkbox" class="chk" id="chkTodos" checked></th>
          <th>Código</th><th>Descrição</th><th>Localização</th><th>Saldo</th><th>Mínimo</th><th>Qtd. sugerida</th>
        </tr></thead>
        <tbody id="tbodyPedido">${linhas}</tbody>
      </table>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn btn-outline" onclick="fecharModal()">Fechar</button>
      <button type="button" class="btn" id="btnPedidoExcel">Exportar Excel</button>
      <button type="button" class="btn btn-primary" id="btnGerarPedidoDoc">Gerar Pedido (PDF)</button>
    </div>
  `, true);

  document.getElementById("chkTodos").addEventListener("change", (e) => {
    document.querySelectorAll(".chk-pedido").forEach(c => c.checked = e.target.checked);
  });

  function coletarSelecionados(){
    return [...document.querySelectorAll(".chk-pedido")].filter(c => c.checked).map(c => {
      const id = c.dataset.id;
      const item = itens.find(i => i.id === id);
      const qtdInput = document.querySelector(`.input-sugerida[data-id="${id}"]`);
      return { item, qtdSugerida: parseInt(qtdInput.value, 10) || 0 };
    });
  }

  document.getElementById("btnGerarPedidoDoc").addEventListener("click", () => {
    const selecionados = coletarSelecionados();
    if (selecionados.length === 0){ toast("Selecione ao menos um item."); return; }
    const dataGeracao = formatarDataHora(new Date());
    const linhasDoc = selecionados.map((s,i) => `
      <tr><td>${i+1}</td><td class="mono">${escapeHTML(s.item.codigo)}</td><td>${escapeHTML(s.item.descricao)}</td>
      <td class="num">${s.qtdSugerida}</td><td>${escapeHTML(s.item.observacoes||"")}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Pedido de Compra</title>
    <style>
      body{ font-family:-apple-system,Arial,sans-serif; color:#1c2430; padding:28px; }
      h1{ font-size:20px; margin:0 0 4px; } .sub{ font-size:12.5px; color:#5c6673; margin:0 0 18px; }
      table{ width:100%; border-collapse:collapse; font-size:12px; }
      th,td{ border:1px solid #d8dce2; padding:7px 9px; text-align:left; }
      th{ background:#f1f3f6; text-transform:uppercase; font-size:10px; }
      td.mono{ font-family:ui-monospace,Consolas,monospace; } td.num{ text-align:right; font-weight:700; }
      .no-print{ margin-top:18px; } .no-print button{ font-size:13px; padding:8px 16px; border-radius:8px; border:1px solid #d8dce2; background:#fff; cursor:pointer; }
      @media print{ .no-print{ display:none; } }
    </style></head><body>
      <h1>Pedido de Compra</h1>
      <p class="sub">Gerado em ${dataGeracao} &middot; ${selecionados.length} itens</p>
      <table><thead><tr><th>#</th><th>Código</th><th>Descrição</th><th>Qtd. sugerida</th><th>Observações</th></tr></thead>
      <tbody>${linhasDoc}</tbody></table>
      <div class="no-print"><button onclick="window.print()">Imprimir / Salvar como PDF</button></div>
    </body></html>`;
    const janela = window.open("", "_blank");
    if (!janela){ toast("Verifique o bloqueador de pop-ups."); return; }
    janela.document.write(html); janela.document.close();
  });

  document.getElementById("btnPedidoExcel").addEventListener("click", () => {
    const selecionados = coletarSelecionados();
    if (selecionados.length === 0){ toast("Selecione ao menos um item."); return; }
    const dadosPlanilha = selecionados.map(s => ({
      Codigo:s.item.codigo, Descricao:s.item.descricao, "Qtd Sugerida":s.qtdSugerida, Observacoes:s.item.observacoes||""
    }));
    const ws = XLSX.utils.json_to_sheet(dadosPlanilha);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedido de Compra");
    XLSX.writeFile(wb, "pedido-de-compra.xlsx");
    toast("Planilha do pedido exportada.");
  });
}

/* ============================================================================
   17. IMPORTAÇÃO DE EXCEL / CSV
   ============================================================================ */
function importarPlanilha(file){
  const reader = new FileReader();
  reader.onload = (e) => {
    try{
      const wb = XLSX.read(e.target.result, { type:"binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const linhas = XLSX.utils.sheet_to_json(ws, { defval:"" });

      let atualizados = 0, criados = 0;
      linhas.forEach(l => {
        const codigo = String(l.Codigo || l.codigo || l["Código"] || "").trim().toUpperCase();
        if (!codigo) return;
        const dados = {
          codigo,
          descricao: String(l.Descricao || l.descricao || l["Descrição"] || ""),
          categoria: String(l.Categoria || l.categoria || "Geral"),
          unidade: String(l.Unidade || l.unidade || "UN").toUpperCase(),
          quantidade: parseInt(l.Quantidade || l.quantidade || 0, 10) || 0,
          qtdMin: parseInt(l.QtdMinima || l["Qtd Minima"] || l.qtdMin || 0, 10) || 0,
          qtdMax: parseInt(l.QtdMaxima || l["Qtd Maxima"] || l.qtdMax || 0, 10) || 0,
          prateleira: String(l.Prateleira || l.prateleira || "A"),
          box: parseInt(l.Box || l.box || 1, 10) || 1,
          valorUnit: parseFloat(l.ValorUnitario || l["Valor Unitario"] || l.valorUnit || 0) || 0,
          codigoBarras: String(l.CodigoBarras || l["Codigo de Barras"] || ""),
          observacoes: String(l.Observacoes || l.observacoes || ""),
        };
        const existente = itens.find(i => i.codigo === codigo);
        if (existente){
          dados.foto = existente.foto; dados.setor = existente.setor;
          salvarItem(dados, existente);
          atualizados++;
        } else {
          dados.foto = null; dados.setor = "";
          salvarItem(dados, null);
          criados++;
        }
      });
      atualizarTela();
      toast(`Importação concluída: ${criados} criado(s), ${atualizados} atualizado(s).`);
    }catch(err){
      toast("Erro ao importar a planilha. Verifique o formato do arquivo.");
    }
  };
  reader.readAsBinaryString(file);
}

/* ============================================================================
   18. EXPORTAÇÃO — Excel / CSV / JSON
   ============================================================================ */
function itensParaPlanilha(){
  return itens.map(i => ({
    Codigo:i.codigo, Descricao:i.descricao, Categoria:i.categoria, Unidade:i.unidade,
    Quantidade:i.quantidade, QtdMinima:i.qtdMin, QtdMaxima:i.qtdMax,
    Prateleira:i.prateleira, Box:formatarBox(i.box), ValorUnitario:i.valorUnit,
    CodigoBarras:i.codigoBarras, Observacoes:i.observacoes,
  }));
}
function exportarExcel(){
  const ws = XLSX.utils.json_to_sheet(itensParaPlanilha());
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estoque");
  XLSX.writeFile(wb, "almoxarifado.xlsx");
  toast("Exportado para almoxarifado.xlsx");
}
function exportarCSV(){
  const ws = XLSX.utils.json_to_sheet(itensParaPlanilha());
  const csv = XLSX.utils.sheet_to_csv(ws);
  baixarArquivo(csv, "almoxarifado.csv", "text/csv;charset=utf-8;");
  toast("Exportado para almoxarifado.csv");
}
function exportarJSON(){
  const json = JSON.stringify(itens, null, 2);
  baixarArquivo(json, "almoxarifado.json", "application/json");
  toast("Exportado para almoxarifado.json");
}
function baixarArquivo(conteudo, nomeArquivo, mime){
  const blob = new Blob([conteudo], { type:mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = nomeArquivo; a.click();
  URL.revokeObjectURL(url);
}

function abrirModalExportar(){
  abrirModal(`
    <h2>Exportar dados</h2>
    <p class="modal-sub">Escolha o formato de exportação do estoque atual.</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <button type="button" class="btn" id="expExcel" style="justify-content:flex-start;">Exportar Excel (.xlsx)</button>
      <button type="button" class="btn" id="expCsv" style="justify-content:flex-start;">Exportar CSV (.csv)</button>
      <button type="button" class="btn" id="expJson" style="justify-content:flex-start;">Exportar JSON (.json)</button>
    </div>
    <div class="modal-actions"><button type="button" class="btn btn-outline" onclick="fecharModal()">Fechar</button></div>
  `);
  document.getElementById("expExcel").addEventListener("click", exportarExcel);
  document.getElementById("expCsv").addEventListener("click", exportarCSV);
  document.getElementById("expJson").addEventListener("click", exportarJSON);
}

/* ============================================================================
   19. BACKUP / RESTAURAÇÃO
   ============================================================================ */
function fazerBackup(){
  const pacote = { itens, historico, config, geradoEm:new Date().toISOString(), versao:"2.0" };
  baixarArquivo(JSON.stringify(pacote, null, 2), `backup-almoxarifado-${Date.now()}.json`, "application/json");
  ultimaSync = new Date();
  toast("Backup gerado com sucesso.");
}
function restaurarBackup(file){
  const reader = new FileReader();
  reader.onload = (e) => {
    try{
      const pacote = JSON.parse(e.target.result);
      if (!Array.isArray(pacote.itens)) throw new Error("formato inválido");
      itens = pacote.itens;
      historico = Array.isArray(pacote.historico) ? pacote.historico.map(h => ({...h, data:new Date(h.data)})) : [];
      if (pacote.config) config = { ...config, ...pacote.config };
      proximoId = Math.max(1, ...itens.map(i => parseInt(String(i.id).replace(/\D/g,""))||0)) + 1;
      atualizarTela();
      atualizarUsuarioHeader();
      toast(`Backup restaurado: ${itens.length} itens carregados.`);
    }catch(err){
      toast("Arquivo de backup inválido.");
    }
  };
  reader.readAsText(file);
}

/* ============================================================================
   20. HISTÓRICO
   ============================================================================ */
function abrirModalHistorico(){
  const linhas = historico.slice(0,300).map(h => `
    <tr>
      <td class="mono">${escapeHTML(h.codigo)}</td>
      <td>${escapeHTML(h.campo)}</td>
      <td>${escapeHTML(h.valorAnterior)}</td>
      <td>${escapeHTML(h.valorNovo)}</td>
      <td>${escapeHTML(h.usuario)}</td>
      <td class="mono">${formatarDataHora(new Date(h.data))}</td>
    </tr>`).join("");

  abrirModal(`
    <h2>Histórico de alterações</h2>
    <p class="modal-sub">Registro completo de quem alterou, quando e o que mudou.</p>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Código</th><th>Campo</th><th>Valor anterior</th><th>Novo valor</th><th>Usuário</th><th>Data/Hora</th></tr></thead>
        <tbody>${linhas || `<tr><td colspan="6" style="text-align:center; color:var(--text-faint);">Nenhuma alteração registrada ainda.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="modal-actions"><button type="button" class="btn btn-primary" onclick="fecharModal()">Fechar</button></div>
  `, true);
}

/* ============================================================================
   21. CONFIGURAÇÕES
   ============================================================================ */
function abrirModalConfiguracoes(){
  abrirModal(`
    <h2>Configurações</h2>
    <p class="modal-sub">Preferências do sistema e da sessão atual.</p>
    <div class="field">
      <label for="fUsuarioConfig">Nome do usuário logado</label>
      <input id="fUsuarioConfig" type="text" value="${escapeHTML(config.usuario)}">
    </div>
    <div class="switch-row">
      <div>
        <div class="sw-label">Status do servidor</div>
        <div class="sw-desc">Simula a conexão do sistema com o servidor central</div>
      </div>
      <label class="switch">
        <input type="checkbox" id="fServerStatus" ${config.serverOnline?'checked':''}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="switch-row">
      <div>
        <div class="sw-label">Lembrete de backup</div>
        <div class="sw-desc">Exibe um aviso periódico para realizar backup manual</div>
      </div>
      <label class="switch">
        <input type="checkbox" id="fAutoBackup" ${config.autoBackupLembrete?'checked':''}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn btn-outline" onclick="fecharModal()">Cancelar</button>
      <button type="button" class="btn btn-primary" id="btnSalvarConfig">Salvar configurações</button>
    </div>
  `);
  document.getElementById("btnSalvarConfig").addEventListener("click", () => {
    config.usuario = document.getElementById("fUsuarioConfig").value.trim() || "Administrador";
    config.serverOnline = document.getElementById("fServerStatus").checked;
    config.autoBackupLembrete = document.getElementById("fAutoBackup").checked;
    atualizarUsuarioHeader();
    atualizarIndicadorServidor();
    fecharModal();
    toast("Configurações salvas.");
  });
}

/* ============================================================================
   22. CABEÇALHO — relógio, usuário e indicador de servidor
   ============================================================================ */
function atualizarUsuarioHeader(){
  document.getElementById("userName").textContent = config.usuario;
  document.getElementById("userAvatar").textContent = config.usuario.trim().charAt(0).toUpperCase() || "A";
}
function atualizarIndicadorServidor(){
  const dot = document.getElementById("serverDot");
  const label = document.getElementById("serverLabel");
  const ping = document.getElementById("serverPing");
  if (config.serverOnline){
    dot.className = "dot online"; label.textContent = "Online";
    ping.textContent = `· ${18 + Math.round(Math.random()*40)}ms`;
  } else {
    dot.className = "dot offline"; label.textContent = "Offline";
    ping.textContent = "· sem conexão";
  }
}
function atualizarRelogio(){
  const agora = new Date();
  document.getElementById("userClock").textContent = formatarDataHora(agora);
}
function atualizarSincronizacao(){
  document.getElementById("hstatSync").textContent = ultimaSync.toLocaleTimeString("pt-BR");
}

/* ============================================================================
   23. EVENTOS
   ============================================================================ */
searchInput.addEventListener("input", () => {
  currentTerm = searchInput.value;
  clearBtn.hidden = currentTerm.length === 0;
  atualizarTela();
});
clearBtn.addEventListener("click", () => {
  searchInput.value = ""; currentTerm = ""; clearBtn.hidden = true;
  atualizarTela(); searchInput.focus();
});

document.getElementById("btnNovoItem").addEventListener("click", () => formularioItem(null));
document.getElementById("btnRelatorio").addEventListener("click", gerarRelatorio);
document.getElementById("btnPedidoCompra").addEventListener("click", abrirTelaPedidoCompra);
document.getElementById("btnExportar").addEventListener("click", abrirModalExportar);
document.getElementById("btnHistorico").addEventListener("click", abrirModalHistorico);
document.getElementById("btnBackup").addEventListener("click", fazerBackup);
document.getElementById("btnConfig").addEventListener("click", abrirModalConfiguracoes);

const fileImportar = document.getElementById("fileImportar");
document.getElementById("btnImportar").addEventListener("click", () => fileImportar.click());
fileImportar.addEventListener("change", () => {
  if (fileImportar.files[0]) importarPlanilha(fileImportar.files[0]);
  fileImportar.value = "";
});

const fileRestaurar = document.getElementById("fileRestaurar");
document.getElementById("btnRestaurar").addEventListener("click", () => fileRestaurar.click());
fileRestaurar.addEventListener("change", () => {
  if (fileRestaurar.files[0]) restaurarBackup(fileRestaurar.files[0]);
  fileRestaurar.value = "";
});

// Delegação de eventos para os botões de ação de cada cartão
resultsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  const item = itens.find(i => i.id === id);
  if (action === "verfoto")       verFotoAmpliada(id);
  if (action === "editar")        formularioItem(item);
  if (action === "saldo")         abrirModalSaldo(id);
  if (action === "movimentacao")  abrirModalHistoricoItem(id);
  if (action === "pedido")        abrirModalAdicionarPedidoRapido(id);
  if (action === "qrcode")        abrirModalCodigos(id);
  if (action === "duplicar")      duplicarItem(id);
  if (action === "remover")       confirmarRemocao(id);
});

// Histórico filtrado por item específico (botão "Movim." do card)
function abrirModalHistoricoItem(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;
  const registros = historico.filter(h => h.codigo === item.codigo);
  const linhas = registros.map(h => `
    <tr><td>${escapeHTML(h.campo)}</td><td>${escapeHTML(h.valorAnterior)}</td><td>${escapeHTML(h.valorNovo)}</td>
    <td>${escapeHTML(h.usuario)}</td><td class="mono">${formatarDataHora(new Date(h.data))}</td></tr>`).join("");
  abrirModal(`
    <h2>Movimentação — ${escapeHTML(item.codigo)}</h2>
    <p class="modal-sub">${escapeHTML(item.descricao)}</p>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Campo</th><th>Valor anterior</th><th>Novo valor</th><th>Usuário</th><th>Data/Hora</th></tr></thead>
        <tbody>${linhas || `<tr><td colspan="5" style="text-align:center; color:var(--text-faint);">Nenhuma movimentação registrada para este item.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="modal-actions"><button type="button" class="btn btn-primary" onclick="fecharModal()">Fechar</button></div>
  `, true);
}

// Atalho rápido no card: se o item já está abaixo do mínimo, abre direto a
// tela de Pedido de Compra; caso contrário avisa que ainda não é necessário.
function abrirModalAdicionarPedidoRapido(id){
  const item = itens.find(i => i.id === id);
  if (!item) return;
  if (item.quantidade > item.qtdMin){
    toast(`"${item.codigo}" ainda está acima da quantidade mínima.`);
    return;
  }
  abrirTelaPedidoCompra();
}

/* ============================================================================
   24. INICIALIZAÇÃO
   Chamada por auth.js (window.initApp) somente após o login ser confirmado.
   O guard "appJaInicializado" evita duplicar os setInterval caso o usuário
   faça logout e login novamente na mesma aba.
   ============================================================================ */
let appJaInicializado = false;
function initApp(){
  atualizarUsuarioHeader();
  atualizarIndicadorServidor();
  atualizarRelogio();
  atualizarSincronizacao();
  atualizarTela();

  if (appJaInicializado) return;
  appJaInicializado = true;

  setInterval(atualizarRelogio, 1000);
  // Simula sincronização periódica com o servidor a cada 60s
  setInterval(() => {
    ultimaSync = new Date();
    atualizarSincronizacao();
    atualizarIndicadorServidor();
  }, 60000);
}
window.initApp = initApp;
