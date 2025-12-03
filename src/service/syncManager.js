import axios from "axios";
import { idbService } from "../service/idbService";
import { STORES } from "./offlineInterceptor";
import api from "../api/api";

// -------------------------------
// Envia um único item pendente
// -------------------------------
async function syncSingle(item) {
  console.log("🟦 [SYNC] Enviando item pendente:", item);

  return axios({
    method: item.method,
    url: api.defaults.baseURL + item.endpoint,
    data: item.body,
  });
}

// -------------------------------
// Sincroniza uma store
// -------------------------------
export async function syncStore(storeName) {
  console.group(`🚀 [SYNC] Rodando syncStore para ${storeName}`);

  const pendentes = await idbService.listItems(storeName);
  console.log("📥 [SYNC] Lidos pendentes:", pendentes);

  if (!pendentes || pendentes.length === 0) {
    console.log(`⚪ [SYNC] Nenhum item para sincronizar → ${storeName}`);
    console.groupEnd();
    return;
  }

  console.log(`📤 [SYNC] Iniciando sync (${pendentes.length} itens)`);

  let enviados = 0;

  for (const item of pendentes) {
    try {
      const resp = await syncSingle(item);
      console.log("🟢 [SYNC] Resposta API:", resp.data);

      await idbService.removeItem(storeName, item.idTemp);

      const remaining = await idbService.listItems(storeName);
      console.log("📉 [SYNC] Restante na store:", remaining);

      enviados++;
      console.log(`✔ Enviado: ${item.endpoint}`);

    } catch (err) {
      console.warn(`❌ Falha ao enviar: ${item.endpoint}`, err.message);
    }
  }

  console.log(`📦 [SYNC] ${enviados}/${pendentes.length} enviados com sucesso (store: ${storeName})`);
  console.groupEnd();
}

// -------------------------------
// Sincroniza todas as stores
// -------------------------------
export async function syncAll() {
  console.group("🔁 [SYNC] Iniciando sincronização geral…");

  for (const s of Object.values(STORES)) {
    await syncStore(s);
  }

  console.log("✨ [SYNC] Concluído.");
  console.groupEnd();

  // 🔥 AVISA OS HOOKS PARA RECARREGAR AS LISTAS
  console.log("♻️ [SYNC] Disparando evento → sync-refresh");
  window.dispatchEvent(new CustomEvent("sync-refresh"));
}

// -------------------------------
// Inicializar escuta online
// -------------------------------
export function initSyncOnReconnect() {
  window.addEventListener("online", () => {
    console.log("🌐 [SYNC] Evento 'online' detectado — iniciando syncAll()");
    syncAll();
  });
}
