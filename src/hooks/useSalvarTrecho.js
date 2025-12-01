import { useState } from "react";
import { dateToIso, hhmmToIso } from "../util/time";
import api from "../api/api";

export function useSalvarTrecho({ setListarTrechos }) {
  const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: "",
    fim: "",
    data: "",
  };

  const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
  const [salvando, setSalvando] = useState(false);

  // ⏺ Atualiza campos do formulário
  const handleDadosTrecho = (e) => {
    const { name, value } = e.target;
    setDadosTrecho((prev) => ({ ...prev, [name]: value }));
  };

  // ⏺ Validação simples
  const validarCampos = () => {
    const erros = [];

    if (!dadosTrecho.nomeTrecho.trim()) erros.push("Nome do trecho");
    if (!dadosTrecho.distancia.trim()) erros.push("Distância");
    if (!dadosTrecho.inicio.trim()) erros.push("Horário de início");
    if (!dadosTrecho.data.trim()) erros.push("Data");

    if (erros.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n" +
        erros.map((e) => `• ${e}`).join("\n")
      );
      return false;
    }
    return true;
  };

  // ⏺ Formata o payload para API ou offline
  const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
  });

  // ⏺ Opera salvar online / offline
  const salvarTrecho = async () => {
    if (!validarCampos()) return;

    if (!window.confirm("Deseja realmente salvar este trecho?")) return;

    try {
      setSalvando(true);

      const payload = criarPayload();
      const response = await api.post("/salvar-trecho", payload);

      // ===============================
      // 1) ONLINE → registro real vindo da API
      // ===============================
      if (!response.data.offline) {
        alert("Registro salvo com sucesso!");

        // adiciona o trecho oficial retornado pela API
        setListarTrechos((prev) => [response.data.trecho, ...prev]);

        setDadosTrecho(trechoInicial);
        return;
      }

      // ===============================
      // 2) OFFLINE → interceptado pelo offlineInterceptor
      // ===============================
      if (response.data.offline === true) {
        alert(
          "Sem conexão! O registro foi salvo offline e será sincronizado automaticamente quando a internet voltar."
        );

        const itemOffline = {
          ...payload,
          _id: "temp-" + Date.now(), // id para feedback visual
          offline: true,
        };

        setListarTrechos((prev) => [itemOffline, ...prev]);
        setDadosTrecho(trechoInicial);
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar trecho:", error);
    } finally {
      setSalvando(false);
    }
  };

  return {
    dadosTrecho,
    setDadosTrecho,
    handleDadosTrecho,
    salvarTrecho,
    salvando,
    trechoInicial,
  };
}
