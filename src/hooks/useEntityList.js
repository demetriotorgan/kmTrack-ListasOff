// hooks/useEntityList.js
import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { idbService } from "../service/idbService";

/**
 * Mapa das entidades para stores + endpoints
 */
const ENTITY_CONFIG = {
  trechos: {
    store: "cacheTrechos",
    endpoint: "/listar-trecho",
  },
  paradas: {
    store: "cacheParadas",
    endpoint: "/listar-parada",
  },
  pedagios: {
    store: "cachePedagios",
    endpoint: "/listar-pedagio",
  },
  abastecimentos: {
    store: "cacheAbastecimentos",
    endpoint: "/listar-abastecimento",
  },
};

export function useEntityList(entityName) {
  const config = ENTITY_CONFIG[entityName];

  if (!config) {
    throw new Error(`useEntityList: entidade desconhecida: ${entityName}`);
  }

  const { store, endpoint } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------------------
     CARREGAR DO INDEXEDDB
  ------------------------------------- */
  const loadFromCache = useCallback(async () => {
    try {
      const cached = await idbService.listItems(store);
      console.log(`📦 loadFromCache(${store}) → ${Array.isArray(cached) ? cached.length : typeof cached}`);
      setData(Array.isArray(cached) ? cached : []);
      return Array.isArray(cached) ? cached : [];
    } catch (err) {
      console.error(`❌ Erro ao ler cache (${store}):`, err);
      // fallback para array vazio
      setData([]);
      return [];
    }
  }, [store]);

  /* -------------------------------------
     CARREGAR DA API
  ------------------------------------- */
  const loadFromAPI = useCallback(async () => {
    try {
      console.log(`🌐 loadFromAPI → ${endpoint}`);
      const response = await api.get(endpoint);

      console.log("🔎 Response cru da API:", response);

      // Caso o interceptor tenha marcado como offline (mutation handler) → usar cache
      if (response?.data?.offline) {
        console.log(`📡 ${endpoint} respondeu offline → usando cache local (${store})`);
        const cached = await idbService.listItems(store);
        setData(Array.isArray(cached) ? cached : []);
        return Array.isArray(cached) ? cached : [];
      }

      // Se a API já devolveu um array
      if (Array.isArray(response.data)) {
        setData(response.data);

        // proteger replaceAll com try/catch para não quebrar a UI
        try {
          await idbService.replaceAll(store, response.data);
          console.log(`💾 replaceAll(${store}) OK — ${response.data.length} itens`);
        } catch (e) {
          console.error(`❌ Falha ao gravar cache (${store}) com replaceAll`, e);
        }

        return response.data;
      }

      // Caso o backend retorne { lista: [...] } ou outro wrapper
      const list = Array.isArray(response.data?.lista) ? response.data.lista : [];

      setData(list);

      try {
        await idbService.replaceAll(store, list);
        console.log(`💾 replaceAll(${store}) OK — ${list.length} itens (via lista)`);
      } catch (e) {
        console.error(`❌ Falha ao gravar cache (${store}) com replaceAll (via lista)`, e);
      }

      return list;
    } catch (err) {
      // log completo para depuração
      console.error(`⚠ Não foi possível carregar ${endpoint} (catch):`, err);

      // setamos error para UI se quiser exibir
      setError(err);

      // fallback: tentar carregar do cache mesmo em erro real
      try {
        const cached = await idbService.listItems(store);
        console.warn(`⚠ Fallback: carregando cache (${store}) após erro da API — itens: ${Array.isArray(cached) ? cached.length : 0}`);
        setData(Array.isArray(cached) ? cached : []);
        return Array.isArray(cached) ? cached : [];
      } catch (e2) {
        console.error(`❌ Falha ao carregar cache (${store}) no fallback:`, e2);
        // devolve array vazio como última opção
        setData([]);
        return [];
      }
    }
  }, [endpoint, store]);

  /* -------------------------------------
     REFRESH MANUAL (força reload da API)
  ------------------------------------- */
  const refresh = useCallback(async () => {
    setLoading(true);

    if (navigator.onLine) {
      await loadFromAPI();
    } else {
      await loadFromCache();
    }

    setLoading(false);
  }, [loadFromCache, loadFromAPI]);

  /* -------------------------------------
     EFEITO PRINCIPAL → Primeira carga
  ------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    (async () => {
      // Sempre começa carregando o cache (mais rápido)
      await loadFromCache();

      // Se online → atualiza via API
      if (navigator.onLine && isMounted) {
        await loadFromAPI();
      }

      if (isMounted) setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [loadFromCache, loadFromAPI]);

  /* -------------------------------------
     RECARREGAR AUTOMATICAMENTE AO VOLTAR ONLINE
  ------------------------------------- */
  useEffect(() => {
    const handler = () => {
      console.log(`🔄 Online novamente → recarregando ${entityName}`);
      refresh();
    };

    window.addEventListener("online", handler);
    return () => window.removeEventListener("online", handler);
  }, [refresh, entityName]);

  /* -------------------------------------
     FUNÇÕES DE ALTERAÇÃO LOCAL
  ------------------------------------- */

  // Atualiza lista inteira localmente
  const setLocal = async (items) => {
    setData(items);
    try {
      await idbService.replaceAll(store, items);
    } catch (e) {
      console.error(`❌ setLocal → erro ao gravar cache (${store}):`, e);
    }
  };

  // Atualiza somente um item (comparando por _id ou id)
  const updateLocalItem = async (id, updates) => {
    const updated = data.map((item) =>
      item._id === id || item.id === id ? { ...item, ...updates } : item
    );
    await setLocal(updated);
  };

  // Remove 1 item localmente
  const removeLocalItem = async (id) => {
    const updated = data.filter((item) => !(item._id === id || item.id === id));
    await setLocal(updated);
  };

  return {
    data,
    loading,
    error,
    refresh,
    setLocal,
    updateLocalItem,
    removeLocalItem,
  };
}
