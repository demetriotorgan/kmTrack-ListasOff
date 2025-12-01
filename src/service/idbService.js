// service/idbService.js

let db = null;
const DB_NAME = "travelAppDB";
const DB_VERSION = 5;

/**
 * Todas as stores usadas pelo app.
 * Stores com cache usam keyPath = "id"
 */
export const STORES_CONFIG = [
  { name: "trechosPendentes", keyPath: "idTemp" },
  { name: "paradasPendentes", keyPath: "idTemp" },
  { name: "pedagiosPendentes", keyPath: "idTemp" },
  { name: "abastecimentosPendentes", keyPath: "idTemp" },

  // cache offline de GETs
  { name: "cacheTrechos", keyPath: "id" },
  { name: "cacheParadas", keyPath: "id" },
  { name: "cachePedagios", keyPath: "id" },
  { name: "cacheAbastecimentos", keyPath: "id" }
];

/* -------------------------------------------------------------
   INIT
------------------------------------------------------------- */
export function initDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject("Erro ao abrir IndexedDB");

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      STORES_CONFIG.forEach((cfg) => {
        if (!db.objectStoreNames.contains(cfg.name)) {
          db.createObjectStore(cfg.name, { keyPath: cfg.keyPath });
        }
      });

      console.log("📦 IndexedDB atualizado (v" + DB_VERSION + ")");
    };
  });
}

/* -------------------------------------------------------------
   FUNÇÃO DE NORMALIZAÇÃO
------------------------------------------------------------- */
function normalizeItem(item, storeName) {
  if (!item) return item;

  const isCacheStore = storeName.startsWith("cache");

  // Para stores de cache, _id → id
  if (isCacheStore) {
    if (item._id && !item.id) {
      return { ...item, id: item._id };
    }
  }

  return item;
}

/* -------------------------------------------------------------
   OPERAÇÕES BÁSICAS
------------------------------------------------------------- */

export async function upsert(storeName, item) {
  await initDB();
  const normalized = normalizeItem(item, storeName);

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    tx.objectStore(storeName).put(normalized);

    tx.oncomplete = () => resolve(true);
    tx.onerror = (err) => reject("Erro no upsert: " + err.target.error);
  });
}

export async function saveItem(storeName, data) {
  if (!data.idTemp) data.idTemp = crypto.randomUUID();
  return upsert(storeName, data);
}

export async function listItems(storeName) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readonly");
    const req = tx.objectStore(storeName).getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject("Erro ao listar itens");
  });
}

export async function removeItem(storeName, id) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    tx.objectStore(storeName).delete(id);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Erro ao remover item");
  });
}

/* -------------------------------------------------------------
   OPERAÇÕES AVANÇADAS
------------------------------------------------------------- */

export async function clearStore(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    tx.objectStore(storeName).clear();

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Erro ao limpar store");
  });
}

export async function replaceAll(storeName, items = []) {
  await clearStore(storeName);
  return bulkPut(storeName, items);
}

export async function bulkPut(storeName, items = []) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    const store = tx.objectStore(storeName);

    items.forEach((item) => {
      const normalized = normalizeItem(item, storeName);

      if (!normalized.id && store.keyPath === "id") {
        console.warn("⚠ Item ignorado: não possui id", normalized);
        return;
      }

      store.put(normalized);
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = (error) => {
      console.error("❌ bulkPut FAILED:", error.target.error);
      reject("Erro no bulkPut");
    };
  });
}

/* -------------------------------------------------------------
   EXPORT
------------------------------------------------------------- */

export const idbService = {
  initDB,
  saveItem,
  listItems,
  removeItem,
  clearStore,
  replaceAll,
  bulkPut,
  upsert
};
