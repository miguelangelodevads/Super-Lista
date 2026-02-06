// Alteração da versão do cache para forçar a atualização dos arquivos no navegador
const CACHE_NAME = "super-lista-v4"; // Mudei de v3 para v4

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

// 1. Instalação
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Instalando cache...");
      try {
        await cache.addAll(APP_SHELL);
      } catch (e) {
        console.error("Erro crítico ao cachear arquivos locais:", e);
      }
      const externalPromises = EXTERNAL_ASSETS.map(async (url) => {
        try {
          const request = new Request(url, { mode: "no-cors" });
          const response = await fetch(request);
          await cache.put(request, response);
        } catch (err) {
          console.warn("Aviso: Falha ao cachear recurso externo:", url);
        }
      });
      await Promise.all(externalPromises);
    }),
  );
  self.skipWaiting();
});

// 2. Ativação (Limpa o cache antigo v3)
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

// 3. Interceptação
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => {});
    }),
  );
});
