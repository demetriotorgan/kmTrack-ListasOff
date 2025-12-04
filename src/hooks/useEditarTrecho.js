import { useState } from "react";
import { dateToIso, hhmmToIso, isoToDateEdit, isoToHHMM } from "../util/time";
import api from "../api/api";

export function useEditarTrecho({ setList, setFormState, trechoInicial }) {
  
  const [editando, setEditando] = useState(false);
  const [idEditado, setIdEditado] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Iniciar modo edição
  const iniciarEdicao = (item) => {
    if (!navigator.onLine) {
      alert("Você está offline! Só é possível editar quando estiver online.");
      return;
    }

    setEditando(true);
    setIdEditado(item._id);

    setFormState({
      nomeTrecho: item.nomeTrecho,
      distancia: item.distancia,
      inicio: item.inicio ? isoToHHMM(item.inicio) : "",
      fim: item.fim ? isoToHHMM(item.fim) : "",
      data: isoToDateEdit(item.data)
    });
  };

  // Salvar atualização
  const salvarEdicao = async (dadosAtuais) => {
    if (!navigator.onLine) {
      alert("Você está offline! Conecte-se para salvar.");
      return;
    }

    if (!window.confirm("Confirmar atualização?")) return;

    setSalvandoEdicao(true);

    const payload = {
      nomeTrecho: dadosAtuais.nomeTrecho,
      distancia: dadosAtuais.distancia,
      inicio: hhmmToIso(dadosAtuais.inicio),
      fim: hhmmToIso(dadosAtuais.fim),
      data: dateToIso(dadosAtuais.data)
    };

    try {
      const { data } = await api.put(`/editar-trecho/${idEditado}`, payload);

      setList(prev => prev.map(item =>
        item._id === idEditado ? data.trecho : item
      ));

      alert("Trecho atualizado!");
      setEditando(false);
      setIdEditado("");
      setFormState(trechoInicial);

    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o trecho!");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return {
    iniciarEdicao,
    salvarEdicao,
    editando,
    salvandoEdicao
  };
}
