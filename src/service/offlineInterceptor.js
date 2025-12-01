// service/offlineInterceptor.js

import { idbService } from "../service/idbService";

//
// STORES APENAS PARA PENDÊNCIAS (mutations)
//
export const STORES = {
  TRECHO: "trechosPendentes",
  PARADA: "paradasPendentes",
  PEDAGIO: "pedagiosPendentes",
  ABASTECIMENTO: "abastecimentosPendentes",
};

//
// Rotas que geram pendências (POST/PUT/DELETE)
//
export const ROUTE_TO_STORE = [
  // Trechos
  { route: /^\/salvar-trecho/, store: STORES.TRECHO },
  { route: /^\/editar-trecho/, store: STORES.TRECHO },
  { route: /^\/deletar-trecho/, store: STORES.TRECHO },

  // Pedágios
  { route: /^\/salvar-pedagio/, store: STORES.PEDAGIO },
  { route: /^\/editar-pedagio/, store: STORES.PEDAGIO },
  { route: /^\/deletar-pedagio/, store: STORES.PEDAGIO },

  // Paradas
  { route: /^\/salvar-parada/, store: STORES.PARADA },
  { route: /^\/editar-parada/, store: STORES.PARADA },
  { route: /^\/deletar-parada/, store: STORES.PARADA },

  // Abastecimentos
  { route: /^\/salvar-abastecimento/, store: STORES.ABASTECIMENTO },
  { route: /^\/editar-abastecimento/, store: STORES.ABASTECIMENTO },
  { route: /^\/deletar-abastecimento/, store: STORES.ABASTECIMENTO },
];

//
// Mapa de /listar-* → para cache local
//
function mapListRouteToStore(url) {
  if (url.includes("/listar-trecho")) return "cacheTrechos";
  if (url.includes("/listar-parada")) return "cacheParadas";
  if (url.includes("/listar-pedagio")) return "cachePedagios";
  if (url.includes("/listar-abastecimento")) return "cacheAbastecimentos";
  return null;
}

//
// Descobrir qual store registrar a pendência
//
function identifyStore(url) {
  const clean = url.replace(window.location.origin, "");
  const match = ROUTE_TO_STORE.find((item) => clean.match(item.route));
  return match?.store ?? null;
}

//
// Interceptor principal
//
export default function setupOfflineInterceptor(api) {
  //
  // REQUEST INTERCEPTOR
  //
  api.interceptors.request.use(async (config) => {
    const isMutation = ["post", "put", "delete"].includes(config.method);
    const isListGet = config.method === "get" && /\/listar-/.test(config.url);

    // 🔸 GET /listar-* offline → retornar cache imediatamente
    if (!navigator.onLine && isListGet) {
      const store = mapListRouteToStore(config.url);
      if (store) {
        const cached = await idbService.listItems(store);
        console.log(`📦 GET OFFLINE (${store}) → retornando cache`);
        return Promise.reject({
          offlineGet: true,
          cachedData: cached,
        });
      }
      return config;
    }

    // 🔸 Se não for mutation → deixar passar normal
    if (!isMutation) return config;

    // 🔸 Se estiver online → mutation passa normalmente
    if (navigator.onLine) return config;

    // 🔸 Offline mutation → guardar no IDB
    const store = identifyStore(config.url);
    if (!store) return config;

    const payload = {
      idTemp: crypto.randomUUID(),
      method: config.method,
      endpoint: config.url.replace(window.location.origin, ""),
      body: config.data ?? null,
      timestamp: new Date().toISOString(),
    };

    await idbService.saveItem(store, payload);

    console.log("💾 Mutation offline registrada:", payload);

    // Bloqueia request real e sinaliza offline
    return Promise.reject({
      offlineStored: true,
    });
  });

  //
  // RESPONSE INTERCEPTOR
  //
  api.interceptors.response.use(
    async (response) => {
      const url = response.config?.url;
      const method = response.config?.method;

      // 🔸 SE FOR GET online → atualizar cache local
      if (method === "get" && /\/listar-/.test(url)) {
        const store = mapListRouteToStore(url);
        if (store) {
          console.log(`💾 Atualizando cache (${store}) a partir da API`);
          await idbService.replaceAll(store, response.data);
        }
      }

      return response;
    },

    // 🔸 TRATAMENTO DE ERROS
    async (error) => {
      // GET offline retornando cache
      if (error.offlineGet) {
        return Promise.resolve({ data: error.cachedData });
      }

      // Mutation armazenada offline
      if (error.offlineStored) {
        return Promise.resolve({ data: { offline: true } });
      }

      return Promise.reject(error);
    }
  );
}
