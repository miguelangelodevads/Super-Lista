// --- LÓGICA DO PWA (INSTALAÇÃO E OFFLINE) ---
let deferredPrompt;
const installBtnContainer = document.getElementById("install-btn-container");
const installBtn = document.getElementById("pwa-install-btn");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("Service Worker registrado!", reg))
      .catch((err) => console.log("Falha no Service Worker:", err));
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtnContainer.classList.add("show");
});

installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      deferredPrompt = null;
      installBtnContainer.classList.remove("show");
    }
  } else {
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIos) {
      document.getElementById("ios-install-modal").classList.remove("hidden");
    } else {
      alert(
        'Para instalar, procure a opção "Adicionar à Tela Inicial" no menu do seu navegador.',
      );
    }
  }
});

function closeIosModal() {
  document.getElementById("ios-install-modal").classList.add("hidden");
}

window.addEventListener("appinstalled", () => {
  installBtnContainer.classList.remove("show");
  deferredPrompt = null;
  console.log("App instalado com sucesso!");
});

// --- LÓGICA PRINCIPAL DO APP ---

let selectedNewEmoji = "🛒";

const emojiDatabase = [
  {
    icon: "🧴",
    tags: "desodorante creme shampoo condicionador hidratante loção limpeza",
  },
  { icon: "🧼", tags: "sabonete sabao banho limpeza maos" },
  { icon: "🪥", tags: "escova dente bucal higiene" },
  { icon: "🦷", tags: "pasta dente bucal" },
  { icon: "🧻", tags: "papel higienico banheiro" },
  { icon: "🪒", tags: "barbeador gilette depilação" },
  { icon: "💄", tags: "maquiagem batom beleza" },
  { icon: "💅", tags: "esmalte unha manicure" },
  { icon: "🛁", tags: "banho banheira espuma" },
  { icon: "🚿", tags: "chuveiro banho" },
  { icon: "🩹", tags: "curativo bandaid machucado" },
  { icon: "💊", tags: "remedio farmacia comprimido" },
  { icon: "🩸", tags: "absorvente intimo menstruacao" },
  { icon: "🧵", tags: "fio dental costura" },
  { icon: "🍺", tags: "cerveja bebida alcool bar lata" },
  { icon: "🍻", tags: "cerveja brinde bebida bar chopp" },
  { icon: "🍷", tags: "vinho bebida taça tinto" },
  { icon: "🥤", tags: "refrigerante refri copo bebida soda" },
  { icon: "🧃", tags: "suco caixinha bebida achocolatado" },
  { icon: "🥛", tags: "leite copo bebida branco integral desnatado" },
  { icon: "☕", tags: "cafe xicara quente manha" },
  { icon: "🍵", tags: "cha xicara verde" },
  { icon: "🧉", tags: "chimarrao mate cha" },
  { icon: "🍾", tags: "champanhe espumante garrafa ano novo" },
  { icon: "🥃", tags: "whisky dose bebida destilado" },
  { icon: "🍸", tags: "drink coquetel martine" },
  { icon: "🍹", tags: "drink tropical suco" },
  { icon: "💧", tags: "agua gota mineral galao" },
  { icon: "🥥", tags: "coco agua fruta" },
  { icon: "🍎", tags: "maca fruta vermelha" },
  { icon: "🍏", tags: "maca verde fruta" },
  { icon: "🍐", tags: "pera fruta" },
  { icon: "🍊", tags: "laranja fruta citrica suco" },
  { icon: "🍋", tags: "limao fruta citrica azedo" },
  { icon: "🍌", tags: "banana fruta" },
  { icon: "🍉", tags: "melancia fruta" },
  { icon: "🍇", tags: "uva fruta vinho" },
  { icon: "🍓", tags: "morango fruta" },
  { icon: "🫐", tags: "mirtilo fruta" },
  { icon: "🍈", tags: "melao fruta" },
  { icon: "🍒", tags: "cereja fruta" },
  { icon: "🍑", tags: "pessego fruta" },
  { icon: "🥭", tags: "manga fruta" },
  { icon: "🍍", tags: "abacaxi fruta" },
  { icon: " kiwi", tags: "kiwi fruta" },
  { icon: "🥑", tags: "abacate avocado fruta" },
  { icon: "🍆", tags: "berinjela legume" },
  { icon: "🥔", tags: "batata legume inglesa" },
  { icon: "🥕", tags: "cenoura legume" },
  { icon: "🌽", tags: "milho pipoca legume" },
  { icon: "🌶️", tags: "pimenta tempero picante" },
  { icon: "🫑", tags: "pimentao legume" },
  { icon: "🥒", tags: "pepino legume salada" },
  { icon: "🥬", tags: "alface verdura salada folha couve" },
  { icon: "🥦", tags: "brocolis legume verde" },
  { icon: "🧄", tags: "alho tempero" },
  { icon: "🧅", tags: "cebola tempero" },
  { icon: "🍄", tags: "cogumelo champignon fungo" },
  { icon: "🥜", tags: "amendoim castanha noz" },
  { icon: "🍅", tags: "tomate fruta salada molho" },
  { icon: "🥩", tags: "carne bife vermelho churrasco picanha" },
  { icon: "🍗", tags: "frango coxa carne assado" },
  { icon: "🍖", tags: "carne osso costela" },
  { icon: " hotdog", tags: "salsicha cachorro quente hotdog" },
  { icon: "🍔", tags: "hamburguer carne lanche" },
  { icon: "🥓", tags: "bacon carne frito" },
  { icon: "🍤", tags: "camarao fruto mar peixe" },
  { icon: "🐟", tags: "peixe carne mar" },
  { icon: "🍣", tags: "sushi peixe japones" },
  { icon: "🥚", tags: "ovo ovos duzia" },
  { icon: "🍞", tags: "pao padaria cafe forma" },
  { icon: "🥐", tags: "croissant pao" },
  { icon: "🥖", tags: "pao baguete frances" },
  { icon: "🥨", tags: "pretzel pao salgado" },
  { icon: "🥯", tags: "bagel pao rosquinha" },
  { icon: "🥞", tags: "panqueca cafe" },
  { icon: "🧇", tags: "waffle cafe" },
  { icon: "🧀", tags: "queijo laticinio mussarela" },
  { icon: "🧈", tags: "manteiga margarina" },
  { icon: "🍚", tags: "arroz comida grao" },
  { icon: "🍛", tags: "arroz prato comida" },
  { icon: "🍝", tags: "macarrao massa espaguete" },
  { icon: "🍜", tags: "miojo sopa ramen" },
  { icon: "🍕", tags: "pizza lanche" },
  { icon: "🍟", tags: "batata frita lanche" },
  { icon: "🥪", tags: "sanduiche lanche pao" },
  { icon: "🥫", tags: "molho lata conserva extrato" },
  { icon: "🧂", tags: "sal tempero acucar" },
  { icon: "🥣", tags: "cereal mingau pote" },
  { icon: "🍯", tags: "mel doce pote" },
  { icon: "🫒", tags: "azeitona azeite oliva" },
  { icon: "🌻", tags: "oleo girassol azeite" },
  { icon: "🍫", tags: "chocolate doce barra cacau" },
  { icon: "🍬", tags: "bala doce acucar" },
  { icon: "🍭", tags: "pirulito doce" },
  { icon: "🍪", tags: "biscoito bolacha cookie" },
  { icon: "🍩", tags: "rosquinha donut doce" },
  { icon: "🍦", tags: "sorvete doce gelado casquinha" },
  { icon: "🍨", tags: "sorvete pote sobremesa" },
  { icon: "🍰", tags: "bolo doce festa fatia" },
  { icon: "🎂", tags: "bolo aniversario festa" },
  { icon: " cupcake", tags: "cupcake bolo doce" },
  { icon: "🥧", tags: "torta doce" },
  { icon: "🍮", tags: "pudim doce sobremesa" },
  { icon: "🍿", tags: "pipoca milho cinema" },
  { icon: "🧹", tags: "vassoura limpeza casa varrer" },
  { icon: "🧺", tags: "roupa cesto lavar lavanderia" },
  { icon: "🧽", tags: "esponja limpeza louca banho" },
  { icon: "🫧", tags: "bolha sabao espuma" },
  { icon: "🪣", tags: "balde limpeza agua" },
  { icon: "🌡️", tags: "termometro febre remedio" },
  { icon: "🕯️", tags: "vela cheiro casa" },
  { icon: "💡", tags: "lampada luz casa" },
  { icon: " flashlight", tags: "lanterna luz pilha" },
  { icon: "🔋", tags: "pilha bateria energia" },
  { icon: "🔌", tags: "tomada eletrica extensao" },
  { icon: "🪴", tags: "planta vaso flor" },
  { icon: "💐", tags: "flores buque presente" },
  { icon: "🍼", tags: "bebe mamadeira leite" },
  { icon: "🧸", tags: "urso pelucia brinquedo crianca" },
  { icon: "👶", tags: "bebe fralda crianca" },
  { icon: "🐶", tags: "cachorro racao pet" },
  { icon: "🐱", tags: "gato racao pet" },
  { icon: "🦴", tags: "osso cachorro pet" },
  { icon: "🥄", tags: "colher talher cozinha" },
  { icon: "🍴", tags: "garfo faca talher" },
  { icon: "🍽️", tags: "prato refeicao" },
  { icon: "🔪", tags: "faca corte cozinha" },
  { icon: "🥡", tags: "marmita comida caixa" },
  { icon: "🛒", tags: "carrinho compras mercado" },
  { icon: "🛍️", tags: "sacola compras" },
  { icon: "🎁", tags: "presente caixa" },
  { icon: "📦", tags: "caixa pacote" },
  { icon: "🏷️", tags: "etiqueta preco" },
  { icon: "✨", tags: "brilho limpeza novo especial" },
  { icon: "🗑️", tags: "lixo saco lixeira" },
  { icon: "🔥", tags: "fogo carvao churrasco" },
  { icon: "🧊", tags: "gelo agua gelada" },
];

const defaultProducts = [
  { id: 1, name: "Arroz", cat: "Despensa", icon: "🍚" },
  { id: 2, name: "Feijão", cat: "Despensa", icon: "🫘" },
  { id: 3, name: "Macarrão", cat: "Despensa", icon: "🍝" },
  { id: 4, name: "Óleo", cat: "Despensa", icon: "🌻" },
  { id: 5, name: "Açúcar", cat: "Despensa", icon: "🧂" },
  { id: 6, name: "Café", cat: "Despensa", icon: "☕" },
  { id: 7, name: "Pão", cat: "Despensa", icon: "🍞" },
  { id: 8, name: "Leite", cat: "Frios", icon: "🥛" },
  { id: 9, name: "Queijo", cat: "Frios", icon: "🧀" },
  { id: 10, name: "Manteiga", cat: "Frios", icon: "🧈" },
  { id: 11, name: "Iogurte", cat: "Frios", icon: "🥣" },
  { id: 12, name: "Presunto", cat: "Frios", icon: "🥓" },
  { id: 13, name: "Banana", cat: "Hortifruti", icon: "🍌" },
  { id: 14, name: "Maçã", cat: "Hortifruti", icon: "🍎" },
  { id: 15, name: "Alface", cat: "Hortifruti", icon: "🥬" },
  { id: 16, name: "Tomate", cat: "Hortifruti", icon: "🍅" },
  { id: 17, name: "Batata", cat: "Hortifruti", icon: "🥔" },
  { id: 18, name: "Cebola", cat: "Hortifruti", icon: "🧅" },
  { id: 19, name: "Sabão em Pó", cat: "Limpeza", icon: "🧼" },
  { id: 20, name: "Detergente", cat: "Limpeza", icon: "🧴" },
  { id: 21, name: "Papel Hig.", cat: "Limpeza", icon: "🧻" },
  { id: 22, name: "Desinfetante", cat: "Limpeza", icon: "✨" },
  { id: 23, name: "Esponja", cat: "Limpeza", icon: "🧽" },
  { id: 24, name: "Refrigerante", cat: "Bebidas", icon: "🥤" },
  { id: 25, name: "Suco", cat: "Bebidas", icon: "🧃" },
  { id: 26, name: "Água", cat: "Bebidas", icon: "💧" },
];

let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let history = JSON.parse(localStorage.getItem("history")) || [];
let currentFilter = "Todos";

function init() {
  router("home");
  updateCartBadge();
}

function router(page) {
  const app = document.getElementById("app-content");
  const headerTotal = document.getElementById("header-total");
  document
    .querySelectorAll(".bottom-nav-item")
    .forEach((el) => el.classList.remove("active", "text-pink-500"));
  document
    .getElementById(`nav-${page}`)
    .classList.add("active", "text-pink-500");

  if (page === "home") {
    headerTotal.classList.add("hidden");
    renderHome(app);
  } else if (page === "cart") {
    headerTotal.classList.remove("hidden");
    renderCart(app);
  } else if (page === "history") {
    headerTotal.classList.add("hidden");
    renderHistory(app);
  } else if (page === "stats") {
    headerTotal.classList.add("hidden");
    renderStats(app);
  }
}

function renderHome(container) {
  const categories = [
    "Todos",
    "Despensa",
    "Frios",
    "Hortifruti",
    "Limpeza",
    "Higiene",
    "Bebidas",
    "Outros",
  ];
  let html = `
        <div class="p-4 sticky top-0 bg-gray-50 z-10 shadow-sm">
            <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                ${categories.map((cat) => `<button onclick="filterCategory('${cat}')" class="category-chip px-4 py-2 rounded-full text-sm whitespace-nowrap bg-white border border-gray-200 text-gray-600 ${currentFilter === cat ? "active" : ""}">${cat}</button>`).join("")}
            </div>
            <div class="mt-2 flex gap-2">
                    <input type="text" id="search-box" oninput="renderProductGrid()" placeholder="🔍 O que você procura hoje?" class="flex-1 p-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:border-pink-400">
                    <button onclick="openModal()" class="bg-pink-100 text-pink-600 p-3 rounded-xl font-bold shadow-sm hover:bg-pink-200"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
        <div id="product-grid" class="p-4 grid grid-cols-2 gap-4 pb-20"></div>
    `;
  container.innerHTML = html;
  renderProductGrid();
}

function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  const search = document.getElementById("search-box")
    ? document.getElementById("search-box").value.toLowerCase()
    : "";

  let filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesCat = currentFilter === "Todos" || p.cat === currentFilter;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-2 text-center text-gray-400 py-10">
            <p class="text-4xl mb-2">🤷‍♀️</p>
            <p>Não achei esse produto.</p>
            <button onclick="openModal()" class="mt-4 text-pink-500 font-bold underline">Criar novo?</button>
        </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((p) => {
      const inCart = cart[p.id];
      return `
        <div onclick="toggleCart(${p.id})" class="item-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative cursor-pointer ${inCart ? "selected" : ""}">
            ${inCart ? '<div class="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>' : ""}
            <div class="text-4xl mb-2">${p.icon}</div>
            <h3 class="font-bold text-gray-700 text-center leading-tight">${p.name}</h3>
            <span class="text-xs text-gray-400 mt-1">${p.cat}</span>
        </div>
    `;
    })
    .join("");
}

// Função renderCart atualizada com botão de exclusão
function renderCart(container) {
  const cartIds = Object.keys(cart);
  if (cartIds.length === 0) {
    container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center p-8"><div class="text-6xl mb-4 text-pink-200">🛒</div><h2 class="text-xl font-bold text-gray-600">Lista vazia!</h2><p class="text-gray-400 mt-2">Vá em "Produtos" e clique no que está precisando comprar.</p><button onclick="router('home')" class="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-pink-200">Ir às compras</button></div>`;
    updateTotalHeader();
    return;
  }
  let itemsHtml = cartIds
    .map((id) => {
      const item = products.find((p) => p.id == id);
      const cartItem = cart[id];
      if (!item) return "";
      return `
      <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-3 flex items-center gap-3 ${cartItem.checked ? "opacity-60 bg-gray-50" : ""}">
          <div onclick="toggleCheck(${id})" class="w-10 h-10 rounded-full border-2 ${cartItem.checked ? "bg-green-500 border-green-500" : "border-gray-300"} flex items-center justify-center shrink-0 cursor-pointer transition-colors">
              ${cartItem.checked ? '<i class="fa-solid fa-check text-white"></i>' : ""}
          </div>
          <div class="flex-1">
              <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                      <span class="text-xl">${item.icon}</span>
                      <span class="font-bold ${cartItem.checked ? "line-through text-gray-400" : "text-gray-700"}">${item.name}</span>
                  </div>
                  <button onclick="removeFromCart(${id})" class="text-gray-400 hover:text-red-500 p-2 transition-colors">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
              </div>
              <div class="flex items-center gap-3 mt-1 text-sm">
                  <button onclick="changeQty(${id}, -1)" class="w-6 h-6 bg-gray-100 rounded text-gray-600 font-bold">-</button>
                  <span>${cartItem.qty} un</span>
                  <button onclick="changeQty(${id}, 1)" class="w-6 h-6 bg-gray-100 rounded text-gray-600 font-bold">+</button>
              </div>
          </div>
          <div class="flex flex-col items-end">
              <span class="text-xs text-gray-400 mb-1">Preço un.</span>
              <div class="relative w-24">
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input type="number" step="0.01" value="${cartItem.price > 0 ? cartItem.price : ""}" placeholder="0,00" onchange="updatePrice(${id}, this.value)" class="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold focus:outline-none focus:border-pink-400 text-gray-700">
              </div>
          </div>
      </div>`;
    })
    .join("");
  container.innerHTML = `<div class="p-4 pb-24"><div class="flex justify-between items-center mb-4"><h2 class="text-lg font-bold text-gray-700">🛒 No Carrinho</h2><button onclick="clearCart()" class="text-red-400 text-sm font-semibold">Limpar Tudo</button></div>${itemsHtml}<div class="mt-8 p-4 bg-white rounded-2xl shadow-lg border border-pink-100 text-center"><p class="text-gray-500 mb-2">Já pegou tudo?</p><button onclick="finishShopping()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-green-200 transition-transform active:scale-95 flex justify-center items-center gap-2"><i class="fa-solid fa-check-double"></i> Finalizar Compra</button></div></div>`;
  updateTotalHeader();
}

// Função renderHistory atualizada com botão de exclusão
function renderHistory(container) {
  if (history.length === 0) {
    container.innerHTML = `<div class="text-center p-8 mt-10"><i class="fa-solid fa-clock-rotate-left text-4xl text-gray-300 mb-4"></i><p class="text-gray-500">Nenhuma compra finalizada.</p></div>`;
    return;
  }
  const html = history
    .map((rec) => {
      const date = new Date(rec.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      return `
      <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-pink-400 mb-4 mx-4 mt-4">
          <div class="flex justify-between items-start mb-2">
              <div>
                  <h3 class="font-bold text-gray-800 capitalize">${date}</h3>
                  <p class="text-sm text-gray-500">${Object.keys(rec.items).length} itens</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                  <span class="font-bold text-green-600 text-lg">${rec.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  <button onclick="deleteHistoryItem(${rec.id})" class="text-red-400 hover:text-red-600 text-sm flex items-center gap-1 transition-colors">
                    <i class="fa-solid fa-trash"></i> Excluir
                  </button>
              </div>
          </div>
          <div class="mt-3 border-t pt-3 flex justify-end">
              <button onclick="reuseList(${rec.id})" class="text-pink-500 font-bold text-sm flex items-center gap-1 hover:bg-pink-50 px-3 py-1 rounded-lg transition-colors"><i class="fa-solid fa-repeat"></i> Repetir lista</button>
          </div>
      </div>`;
    })
    .join("");
  container.innerHTML =
    `<h2 class="p-4 text-xl font-bold text-gray-700">Minhas Compras</h2>` +
    html;
}

function renderStats(container) {
  const now = new Date();
  let totalMonth = 0,
    totalYear = 0,
    totalAll = 0;
  history.forEach((h) => {
    const d = new Date(h.date);
    totalAll += h.total;
    if (d.getFullYear() === now.getFullYear()) {
      totalYear += h.total;
      if (d.getMonth() === now.getMonth()) totalMonth += h.total;
    }
  });
  container.innerHTML = `<div class="p-6 space-y-6"><h2 class="text-2xl font-bold text-gray-700 mb-4">Controle Financeiro</h2><div class="bg-gradient-to-br from-pink-500 to-rose-400 rounded-3xl p-6 text-white shadow-lg shadow-pink-200"><p class="text-pink-100 text-sm font-semibold mb-1">Gasto neste Mês</p><p class="text-4xl font-extrabold">${totalMonth.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div><div class="grid grid-cols-2 gap-4"><div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2"><i class="fa-solid fa-calendar"></i></div><p class="text-gray-400 text-xs font-bold uppercase">Neste Ano</p><p class="text-xl font-bold text-gray-700">${totalYear.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div><div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-2"><i class="fa-solid fa-wallet"></i></div><p class="text-gray-400 text-xs font-bold uppercase">Total Geral</p><p class="text-xl font-bold text-gray-700">${totalAll.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div></div><div class="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4"><p class="text-yellow-700 text-sm"><i class="fa-solid fa-lightbulb mr-1"></i> <strong>Dica:</strong> Tente fazer compras semanais para ter um controle melhor do que gasta!</p></div></div>`;
}

function filterCategory(cat) {
  currentFilter = cat;
  renderHome(document.getElementById("app-content"));
}

function toggleCart(id) {
  if (cart[id]) delete cart[id];
  else cart[id] = { qty: 1, checked: false, price: 0 };
  saveData();
  renderProductGrid();
  updateCartBadge();
}

function toggleCheck(id) {
  cart[id].checked = !cart[id].checked;
  saveData();
  renderCart(document.getElementById("app-content"));
}

function changeQty(id, delta) {
  const newQty = cart[id].qty + delta;
  if (newQty > 0) {
    cart[id].qty = newQty;
    saveData();
    renderCart(document.getElementById("app-content"));
  }
}

function updatePrice(id, val) {
  cart[id].price = parseFloat(val);
  saveData();
  updateTotalHeader();
}

function updateTotalHeader() {
  let total = 0;
  Object.values(cart).forEach((item) => {
    if (item.price) total += item.price * item.qty;
  });
  document.getElementById("header-total").innerText = total.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
}

function clearCart() {
  if (confirm("Tem certeza que quer limpar sua lista?")) {
    cart = {};
    saveData();
    updateCartBadge();
    router("home");
  }
}

function finishShopping() {
  const total = Object.values(cart).reduce(
    (acc, item) => acc + (item.price || 0) * item.qty,
    0,
  );
  if (Object.keys(cart).length === 0) return;
  const shopRecord = {
    id: Date.now(),
    date: new Date().toISOString(),
    total: total,
    items: JSON.parse(JSON.stringify(cart)),
  };
  history.unshift(shopRecord);
  cart = {};
  saveData();
  updateCartBadge();
  alert(
    `🎉 Compra finalizada!\nTotal: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
  );
  router("history");
}

function reuseList(histId) {
  const record = history.find((h) => h.id === histId);
  if (!record) return;
  if (
    Object.keys(cart).length > 0 &&
    !confirm("Isso vai substituir sua lista atual. Pode ser?")
  )
    return;
  const newCart = {};
  Object.keys(record.items).forEach((key) => {
    newCart[key] = { qty: record.items[key].qty, checked: false, price: 0 };
  });
  cart = newCart;
  saveData();
  updateCartBadge();
  router("cart");
}

function updateCartBadge() {
  const count = Object.keys(cart).length;
  const badge = document.getElementById("cart-badge");
  badge.innerText = count;
  if (count > 0) badge.classList.remove("hidden");
  else badge.classList.add("hidden");
}

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("history", JSON.stringify(history));
}

function openModal() {
  document.getElementById("add-modal").classList.remove("hidden");
  document.getElementById("emoji-search-input").value = "";
  filterEmojis();
}

function closeModal() {
  document.getElementById("add-modal").classList.add("hidden");
  document.getElementById("new-prod-name").value = "";
  selectedNewEmoji = "🛒";
}

function selectNewEmoji(btn, emoji) {
  document.querySelectorAll(".emoji-opt").forEach((b) => {
    b.classList.remove("bg-pink-200", "border-pink-300");
    b.classList.add("border-transparent");
  });
  btn.classList.add("bg-pink-200", "border-pink-300");
  btn.classList.remove("border-transparent");
  selectedNewEmoji = emoji;
}

function filterEmojis() {
  const query = document
    .getElementById("emoji-search-input")
    .value.toLowerCase();
  const grid = document.getElementById("emoji-grid");
  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedQuery = normalize(query);

  let filtered = emojiDatabase.filter((e) =>
    normalize(e.tags).includes(normalizedQuery),
  );
  if (query === "" && filtered.length === 0) filtered = emojiDatabase;

  grid.innerHTML = filtered
    .map(
      (e) => `
        <button onclick="selectNewEmoji(this, '${e.icon}')" class="emoji-opt text-2xl p-2 rounded hover:bg-gray-100 border border-transparent transition-colors flex items-center justify-center h-10 w-10">
            ${e.icon}
        </button>
    `,
    )
    .join("");
}

function saveNewProduct() {
  const name = document.getElementById("new-prod-name").value;
  const cat = document.getElementById("new-prod-cat").value;
  if (!name) return alert("Dê um nome ao produto!");
  const newId = Date.now();
  products.push({ id: newId, name: name, cat: cat, icon: selectedNewEmoji });
  saveData();
  closeModal();
  renderProductGrid();
  alert("Produto adicionado! 🎉");
}

// --- NOVAS FUNÇÕES DE EXCLUSÃO ---

function removeFromCart(id) {
  if (confirm("Remover este item do carrinho?")) {
    delete cart[id];
    saveData();
    renderCart(document.getElementById("app-content"));
    updateCartBadge();
  }
}

function deleteHistoryItem(histId) {
  if (
    confirm(
      "Tem certeza que deseja apagar este registro do histórico? Isso não pode ser desfeito.",
    )
  ) {
    history = history.filter((h) => h.id !== histId);
    saveData();
    renderHistory(document.getElementById("app-content"));
  }
}

init();
