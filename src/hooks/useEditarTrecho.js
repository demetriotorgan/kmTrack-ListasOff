import { useState } from "react";
import { dateToIso, hhmmToIso, isoToDateEdit, isoToHHMM } from "../util/time";
import api from "../api/api";

/**
 * useEditarTrecho
 * Edição somente ONLINE (não entra no fluxo offline/IDB)
 */
export function useEditarTrecho({
  setDadosTrecho,
  dadosTrecho,
  setListarTrechos,
  trechoInicial
}) {
  const [editando, setEditando] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [idEditado, setIdEditado] = useState("");

  // =======================================================
  // 1) Usuário escolhe um trecho para editar
  // =======================================================
  const handleEditando = (item) => {
    console.log("✏️ [EDITAR] Abrindo edição para item:", item);

    // 🚫 Verificação imediata OFFLINE
    if (!navigator.onLine) {
      console.warn("❌ [EDITAR] Usuário offline — edição bloqueada");
      alert(
        "❌ Você está offline.\nA edição só pode ser realizada quando a conexão estiver ativa."
      );
      return;
    }

    setEditando(true);

    // Preenche formulário com dados convertidos
    setDadosTrecho({
      nomeTrecho: item.nomeTrecho,
      distancia: item.distancia,
      inicio: isoToHHMM(item.inicio),
      fim: isoToHHMM(item.fim),
      data: isoToDateEdit(item.data)
    });

    setIdEditado(item._id);

    console.log("🟦 [EDITAR] Formulário preenchido e modo edição ativado");
  };

  // =======================================================
  // 2) Usuário salva atualização
  // =======================================================
  const handleAtualizarTrecho = async () => {
    console.log("📤 [EDITAR] Solicitado salvar edição do trecho:", idEditado);

    // 🚫 Verificação OFFLINE (segurança dupla)
    if (!navigator.onLine) {
      console.warn("❌ [EDITAR] Tentativa de salvar offline — bloqueado");
      alert("❌ Você está offline.\nNão é possível salvar alterações agora.");
      return;
    }

    const confirmar = window.confirm("Deseja salvar as alterações?");
    if (!confirmar) {
      console.log("⚪ [EDITAR] Usuário cancelou a atualização");
      return;
    }

    setSalvandoEdicao(true);

    const payloadEditado = {
      nomeTrecho: dadosTrecho.nomeTrecho,
      distancia: dadosTrecho.distancia,
      inicio: hhmmToIso(dadosTrecho.inicio),
      fim: hhmmToIso(dadosTrecho.fim),
      data: dateToIso(dadosTrecho.data)
    };

    console.log("📦 [EDITAR] Payload preparado:", payloadEditado);

    try {
      const response = await api.put(
        `/editar-trecho/${idEditado}`,
        payloadEditado
      );

      console.log("🟢 [EDITAR] Resposta da API:", response.data);

      alert("Registro atualizado com sucesso!");

      // Atualiza lista local substituindo item editado
      setListarTrechos((prev) =>
        prev.map((t) =>
          t._id === idEditado ? response.data.trecho : t
        )
      );

      // Limpa formulário e sai do modo edição
      setDadosTrecho(trechoInicial);
      setEditando(false);
      setIdEditado("");

      console.log("📉 [EDITAR] Lista atualizada e modo edição encerrado");

    } catch (error) {
      console.error("❌ [EDITAR] Erro ao salvar edição:", error);
      alert("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return {
    handleEditando,
    handleAtualizarTrecho,
    editando,
    salvandoEdicao,
    idEditado
  };
}
