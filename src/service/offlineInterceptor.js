import { idbService } from "../service/idbService";

export const STORES = {
  TRECHO: "trechosPendentes",
  PARADA: "paradasPendentes",
  PEDAGIO: "pedagiosPendentes",
  ABASTECIMENTO: "abastecimentosPendentes",
};

export const ROUTES = [
  { r: /^\/salvar-trecho/, store: STORES.TRECHO },
  { r: /^\/salvar-parada/, store: STORES.PARADA },
  { r: /^\/salvar-pedagio/, store: STORES.PEDAGIO },
  { r: /^\/salvar-abastecimento/, store: STORES.ABASTECIMENTO },
];

function findStore(url) {
  const clean = url.replace(window.location.origin, "");
  return ROUTES.find(r => clean.match(r.r))?.store || null;
}

function listStore(url) {
  if (url.includes("listar-trechos")) return "cacheTrechos";
  if (url.includes("listar-parada")) return "cacheParadas";
  if (url.includes("listar-pedagio")) return "cachePedagios";
  if (url.includes("listar-abastecimento")) return "cacheAbastecimentos";
  return null;
}

export default function setupOfflineInterceptor(api) {

  // ============================
  // REQUEST INTERCEPTOR
  // ============================
  api.interceptors.request.use(async (config) => {
    console.log("📤 [REQUEST]", config.method.toUpperCase(), "→", config.url);

    const method = config.method;

    // GET offline → retornar cache
    if (method === "get" && /\/listar-/.test(config.url) && !navigator.onLine) {
      const store = listStore(config.url);
      const cached = await idbService.listItems(store);

      console.warn("📦 [OFFLINE-LIST] Sem conexão → devolvendo cache da store:", store);
      return Promise.reject({ offlineList: true, cached });
    }

    // POST/PUT/DELETE offline → armazenar pendência
    if (!navigator.onLine && ["post", "put", "delete"].includes(method)) {
      const store = findStore(config.url);

      if (store) {
        const item = {
          idTemp: crypto.randomUUID(),
          method,
          endpoint: config.url,
          body: config.data,
          timestamp: new Date().toISOString(),
        };

        await idbService.saveItem(store, item);

        console.warn("🟥 [OFFLINE-MUTATION] Operação salva offline em", store, item);
        return Promise.reject({ offlineMutation: true });
      }
    }

    return config;
  });

  // ============================
  // RESPONSE INTERCEPTOR
  // ============================
  api.interceptors.response.use(
    (res) => {
      console.log("📩 [RESPONSE]", res.config.url, res.data);
      return res;
    },
    (err) => {
      console.warn("❗ [RESPONSE-ERROR] Interceptado", err);

      if (err.offlineList) {
        console.log("📦 [RESPONSE] Entregando cache offline");
        return Promise.resolve({ data: err.cached });
      }

      if (err.offlineMutation) {
        console.log("🟠 [RESPONSE] Marca offline → operação salva nos pendentes");
        return Promise.resolve({ data: { offline: true } });
      }

      return Promise.reject(err);
    }
  );
}
