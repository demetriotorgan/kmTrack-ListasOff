import axios from "axios";
import { idbService } from "../service/idbService";
import { STORES } from "../service/offlineInterceptor";
import api from "../api/api";

/**
 * Envia 1 item pendente para a API.
 */
async function syncSingleItem(item) {
  return axios({
    method: item.method,
    url: api.defaults.baseURL + item.endpoint,
    data: item.body,
  });
}

/**
 * Sincroniza uma store completa
 */
export async function syncStore(storeName) {
  // CORRIGIDO
  const pendentes = await idbService.listItems(storeName);

  if (!pendentes || pendentes.length === 0) {
    console.log(`⚪ [SYNC] Nenhum item para sincronizar → ${storeName}`);
    return;
  }

  console.group(`📤 [SYNC] Iniciando sync da store: ${storeName}`);
  console.log(`Total pendentes: ${pendentes.length}`);

  let enviados = 0;

  for (const item of pendentes) {
    try {
      await syncSingleItem(item);

      // CORRIGIDO
      await idbService.removeItem(storeName, item.idTemp);

      enviados++;
      console.log(`✔ Enviado: ${item.endpoint}`);
    } catch (err) {
      console.warn(`❌ Falha ao enviar: ${item.endpoint}`);
      console.warn("Motivo:", err.message);
    }
  }

  console.groupEnd();
  console.log(`📦 [SYNC] ${enviados}/${pendentes.length} enviados com sucesso`);
}

/**
 * Sincroniza todas as stores
 */
export async function syncAll() {
  console.group("🔁 [SYNC] Iniciando sincronização geral…");

  for (const storeName of Object.values(STORES)) {
    await syncStore(storeName);
  }

  console.groupEnd();
  console.log("✨ [SYNC] Concluído.");
}

/**
 * Listener automático quando volta a internet
 */
export function initSyncOnReconnect() {
  window.addEventListener("online", () => {
    console.log("🌐 Conexão restaurada — iniciando sync automático…");
    syncAll();
  });
}
