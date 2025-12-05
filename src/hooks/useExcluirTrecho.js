import { useState } from "react";
import api from "../api/api";
import { triggerRefresh } from "../util/refreshEvent";

export function useExcluirTrecho({ setList }) {
  const [excluindo, setExcluindo] = useState(false);

  const handleExcluir = async (item) => {
    console.log("🗑️ [EXCLUIR] Solicitado para item:", item);

    try {
      // 🔌 BLOQUEIA EXCLUSÃO OFFLINE
      if (!navigator.onLine) {
        alert(
          "❌ Você está offline.\nA exclusão só pode ser realizada quando a conexão estiver ativa."
        );
        return;
      }

      const confirmar = window.confirm("Deseja realmente excluir o registro?");
      if (!confirmar) return;

      setExcluindo(true);
      console.log("📤 [EXCLUIR] Enviando DELETE para API...");

      const response = await api.delete(`/deletar-trecho/${item._id}`);
      triggerRefresh();
      

      console.log("🟢 [EXCLUIR] Resposta da API:", response.data);

      alert("Registro excluído com sucesso");

      // 🔥 ATUALIZA LISTA USANDO O PADRÃO GLOBAL
      setList((prev) => prev.filter((t) => t._id !== item._id));
    } catch (error) {
      console.error("❌ [EXCLUIR] Erro ao excluir:", error);
    } finally {
      setExcluindo(false);
    }
  };

  return {
    handleExcluir,
    excluindo,
  };
}
