import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { idbService } from "../service/idbService";

const ENTITY_CONFIG = {
  trechos: { store: "cacheTrechos", endpoint: "/listar-trechos" },
  paradas: { store: "cacheParadas", endpoint: "/listar-parada" },
  pedagios: { store: "cachePedagios", endpoint: "/listar-pedagio" },
  abastecimentos: { store: "cacheAbastecimentos", endpoint: "/listar-abastecimentos" },
  custos: { store: "cacheCustos", endpoint: "/listar-custos" },
};

export function useEntityList(entityName) {
  const config = ENTITY_CONFIG[entityName];
  if (!config) throw new Error(`Entidade desconhecida: ${entityName}`);

  const { store, endpoint } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------
  // CARREGAR CACHE
  // ---------------------
  const loadFromCache = useCallback(async () => {
    const cached = await idbService.listItems(store);
    console.log(`💾 [CACHE→${entityName}]`, cached);
    setData(Array.isArray(cached) ? cached : []);
    return cached || [];
  }, [store, entityName]);

  // ---------------------
  // CARREGAR API
  // ---------------------
  const loadFromAPI = useCallback(async () => {
    console.log(`🌐 [API→${entityName}] GET ${endpoint}`);

    try {
      const response = await api.get(endpoint);
      const arr = Array.isArray(response.data) ? response.data : [];

      console.log(`🔎 [API-DATA→${entityName}]`, arr);

      setData(arr);
      await idbService.replaceAll(store, arr);

      return arr;

    } catch (err) {
      console.warn(`⚠️ [API-FAIL→${entityName}] usando cache`, err);
      return loadFromCache();
    }
  }, [endpoint, store, entityName, loadFromCache]);

  // ---------------------
  // REFRESH
  // ---------------------
  const refresh = useCallback(async () => {
    console.log(`♻️ [REFRESH→${entityName}]`);
    setLoading(true);
    navigator.onLine ? await loadFromAPI() : await loadFromCache();
    setLoading(false);
  }, [loadFromCache, loadFromAPI, entityName]);

  // ---------------------
  // LOAD INICIAL
  // ---------------------
  useEffect(() => {
    (async () => {
      await loadFromCache();
      if (navigator.onLine) await loadFromAPI();
      setLoading(false);
    })();
  }, [loadFromCache, loadFromAPI]);

  // ---------------------
  // EVENTO DE SINCRONIZAÇÃO
  // ---------------------
  useEffect(() => {
    function onSyncRefresh() {
      console.log(`♻️ [ENTITY:${entityName}] sync-refresh → atualizando lista`);
      refresh();
    }

    window.addEventListener("sync-refresh", onSyncRefresh);
    return () => window.removeEventListener("sync-refresh", onSyncRefresh);

  }, [refresh, entityName]);

  // ---------------------
  // SET LOCAL (criação offline)
  // ---------------------
  const setLocal = async (items) => {
    console.log(`✏️ [LOCAL-UPDATE→${entityName}]`, items);

    const arr = typeof items === "function" ? items(data) : items;
    const safe = Array.isArray(arr) ? arr : [arr];

    setData(safe);
    await idbService.replaceAll(store, safe);
  };

  return { data, loading, refresh, setLocal };
}
