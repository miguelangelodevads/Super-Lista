const CACHE_NAME = "super-lista-v3"; // Versão nova para forçar atualização

// Arquivos do próprio app (Essenciais)
const APP_SHELL = [
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
];

// Arquivos externos (CDNs)
const EXTERNAL_ASSETS = [
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
];

// 1. Instalação: Cacheia arquivos locais e tenta os externos sem quebrar
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Instalando cache...");

      // Passo 1: Cachear arquivos locais (Se falhar, o app não instala)
      try {
        await cache.addAll(APP_SHELL);
      } catch (e) {
        console.error("Erro crítico ao cachear arquivos locais:", e);
      }

      // Passo 2: Cachear externos com modo 'no-cors' (para evitar erro de CORS/Vermelho)
      // Usamos map para tentar um por um, sem travar a instalação se um falhar
      const externalPromises = EXTERNAL_ASSETS.map(async (url) => {
        try {
          // 'no-cors' permite cachear arquivos de outros domínios (CDNs) mesmo sem permissão explícita
          const request = new Request(url, { mode: "no-cors" });
          const response = await fetch(request);
          await cache.put(request, response);
        } catch (err) {
          console.warn(
            "Aviso: Falha ao cachear recurso externo (o app funcionará offline, mas sem estilo se não tiver internet):",
            url,
          );
        }
      });

      await Promise.all(externalPromises);
    }),
  );
  self.skipWaiting(); // Ativa imediatamente
});

// 2. Ativação: Limpa caches antigos (v1, v2, etc)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// 3. Interceptação (Fetch): Serve do cache ou baixa
self.addEventListener("fetch", (event) => {
  // CORREÇÃO CRÍTICA: Ignora extensões do Chrome e outros protocolos não-http
  // Isso remove o erro "Request scheme 'chrome-extension' is unsupported"
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se achou no cache, retorna
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não, busca na rede
      return fetch(event.request).catch(() => {
        // Se falhar (offline e sem cache), não faz nada (ou retorna página de erro customizada)
        // console.log('Offline:', event.request.url);
      });
    }),
  );
});
