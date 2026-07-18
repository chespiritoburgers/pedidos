// ============================================================
// Chespirito Burger's — Service Worker
// Estrategia: Cache First para assets estáticos,
//             Network First para el menú JSON.
// ============================================================

const CACHE_NAME = "chespirito-v1";

// Archivos que se cachean en la instalación (shell de la app)
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./data/menu.json",
  "./assets/images/logo.png",
  "./assets/images/e-campeona.jpg",
  "./assets/images/e-mega.jpg",
  "./assets/images/h-chavito.jpg",
  "./assets/images/h-doble-carne.jpg",
  "./assets/images/h-mixta.jpg",
  "./assets/images/h-patacon.jpg",
  "./assets/images/h-sencilla.jpg",
  "./assets/images/lp-la-perra.jpg",
  "./assets/images/p-americano.jpg",
  "./assets/images/p-chompiperro.jpg",
  "./assets/images/p-sencillo.jpg",
  "./assets/images/pe-plato-especial.jpg",
  "./assets/images/pl-papas-locas.jpg",
  "https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700;800&display=swap"
];

// ── Instalación: pre-cachear el shell ──────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll falla si alguna petición falla; usamos add individual
      // para tolerar imágenes que aún no existen.
      return Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activación: limpiar caches viejos ─────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: estrategia según tipo de recurso ───────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptamos peticiones GET
  if (request.method !== "GET") return;

  // menu.json → Network First (para que el menú se pueda actualizar)
  if (url.pathname.endsWith("menu.json")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Google Fonts → Cache First con fallback silencioso
  if (url.hostname.includes("fonts.g")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Todo lo demás → Cache First (imágenes, CSS, JS, HTML)
  event.respondWith(cacheFirst(request));
});

// ── Helpers ───────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Sin red y sin cache: devuelve respuesta vacía para no romper la app
    return new Response("", { status: 408, statusText: "Offline" });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("", { status: 408, statusText: "Offline" });
  }
}
