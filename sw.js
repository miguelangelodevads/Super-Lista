const CACHE_NAME = "super-lista-v4"; // Mude o número da versão sempre que atualizar o app

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
];

// Instalação e Cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Tenta rede, se falhar (offline), usa o cache
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a rede funcionar, atualiza o cache e retorna a resposta
        const clonaRes = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonaRes);
        });
        return response;
      })
      .catch(() => {
        // Se a rede falhar (estiver offline), tenta o cache
        return caches.match(event.request);
      })
  );
});
