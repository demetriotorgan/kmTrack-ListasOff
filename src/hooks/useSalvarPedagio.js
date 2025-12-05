import { useState } from "react";
import { dateToIso, isoToDateEdit } from "../util/time";
import api from "../api/api";
import { triggerRefresh } from "../util/refreshEvent";

export function useSalvarPedagio({ setList }) {

  const hojeISO = new Date().toISOString();

  const pedagioInicial = {
    local: "",
    valor: "",
    data: isoToDateEdit(hojeISO),
  };

  const [dadosPedagio, setDadosPedagio] = useState(pedagioInicial);
  const [salvando, setSalvando] = useState(false);

  const handleDadosPedagio = (e) => {
    const { name, value } = e.target;
    setDadosPedagio((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    const erros = [];

    if (!dadosPedagio.local.trim()) erros.push("Local");
    if (!dadosPedagio.valor.trim()) erros.push("Valor");
    if (!dadosPedagio.data.trim()) erros.push("Data");

    if (erros.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n" +
        erros.map((e) => `• ${e}`).join("\n")
      );
      return false;
    }

    return true;
  };

  const criarPayload = () => ({
    local: dadosPedagio.local,
    valor: Number(dadosPedagio.valor) || 0,
    data: dateToIso(dadosPedagio.data),
  });

  const salvarPedagio = async () => {
    if (!validarCampos()) return;

    if (!window.confirm("Deseja realmente salvar este pedágio?")) return;

    try {
      setSalvando(true);

      const payload = criarPayload();
      const response = await api.post("/salvar-pedagio", payload);
      triggerRefresh();
      /* =====================
         ONLINE
      ===================== */
      if (!response.data.offline) {
        setList(prev => [response.data.pedagio, ...prev]);
        alert("Pedágio salvo com sucesso!");
        setDadosPedagio(pedagioInicial);
        return;
      }

      /* =====================
         OFFLINE
      ===================== */
      const tempItem = {
        ...payload,
        _id: "temp-" + Date.now(),
        offline: true
      };

      setList(prev => [tempItem, ...prev]);

      alert("Sem conexão! O registro foi salvo offline.");

      setDadosPedagio(pedagioInicial);

    } catch (error) {
      console.error("Erro ao salvar pedágio:", error);
      alert("Erro ao salvar pedágio.");
    } finally {
      setSalvando(false);
    }
  };

  return {
    dadosPedagio,
    setDadosPedagio,
    handleDadosPedagio,
    salvarPedagio,
    salvando,
    pedagioInicial,
  };
}
