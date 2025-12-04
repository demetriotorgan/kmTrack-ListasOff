import { useState } from "react";
import { dateToIso, hhmmToIso, isoToDateEdit, isoToHHMM } from "../util/time";
import api from "../api/api";

export function useSalvarTrecho({ setList }) {
const hojeISO = new Date().toISOString();

  const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: isoToHHMM(hojeISO),
    fim: "",
    data: isoToDateEdit(hojeISO),
  };

  const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
  const [salvando, setSalvando] = useState(false);

  /* ---------------------------------------------
      Atualiza campos do formulário
  --------------------------------------------- */
  const handleDadosTrecho = (e) => {
    const { name, value } = e.target;
    setDadosTrecho((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------------------------------------
      Validação dos campos obrigatórios
  --------------------------------------------- */
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

  /* ---------------------------------------------
      Payload padronizado
  --------------------------------------------- */
  const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
  });

  /* ---------------------------------------------
      Salvar online/offline — padrão idêntico ao Pedágio
  --------------------------------------------- */
  const salvarTrecho = async () => {
    if (!validarCampos()) return;

    if (!window.confirm("Deseja realmente salvar este trecho?")) return;

    try {
      setSalvando(true);

      const payload = criarPayload();
      const response = await api.post("/salvar-trecho", payload);

      /* =====================
         ONLINE
      ===================== */
      if (!response.data.offline) {
        setList((prev) => [response.data.trecho, ...prev]);
        alert("Trecho salvo com sucesso!");
        setDadosTrecho(trechoInicial);
        return;
      }

      /* =====================
         OFFLINE
      ===================== */
      const tempItem = {
        ...payload,
        _id: "temp-" + Date.now(),
        offline: true,
      };

      setList((prev) => [tempItem, ...prev]);

      alert("Sem conexão! O trecho foi salvo offline.");

      setDadosTrecho(trechoInicial);

    } catch (error) {
      console.error("Erro ao salvar trecho:", error);
      alert("Erro ao salvar trecho.");
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
