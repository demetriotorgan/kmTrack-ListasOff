import React from "react";
import "../style/Trecho.css";
import { Save, Trash2, Map } from "lucide-react";
import { isoToDate, isoToHHMM } from "../util/time";

import ModalCarregamento from "./ModalCarregamento";

// NOVOS HOOKS PADRONIZADOS
import { useEntityList } from "../hooks/useEntityList";
import { useSalvarTrecho } from "../hooks/useSalvarTrecho";
import { useExcluirTrecho } from "../hooks/useExcluirTrecho";

const Trecho = () => {

  /* ===================================================
     LISTA UNIFICADA (online + cache + offline)
  =================================================== */
  const {
    data: list,
    loading,
    setLocal: setList,
    refresh: reload
  } = useEntityList("trechos");

  /* ===================================================
     SALVAR TRECHO
  =================================================== */
  const {
    salvarTrecho,
    handleDadosTrecho,
    dadosTrecho,
    salvando
  } = useSalvarTrecho({ setList });

  /* ===================================================
     EXCLUIR TRECHO
  =================================================== */
  const {
    excluindo,
    handleExcluir
  } = useExcluirTrecho({ setList });

  return (
    <>
      {(salvando || excluindo) && (
        <ModalCarregamento label={salvando ? "Salvando" : "Excluindo"} />
      )}

      {/* =================================================== */}
      {/* FORMULÁRIO */}
      {/* =================================================== */}

      <div className="container">
        <h2>
          Salvar Trecho <Map />
        </h2>

        <label>
          Nome do Trecho
          <input
            name="nomeTrecho"
            type="text"
            value={dadosTrecho.nomeTrecho}
            onChange={handleDadosTrecho}
          />
        </label>

        <label>
          Distância (km)
          <input
            name="distancia"
            type="number"
            value={dadosTrecho.distancia}
            onChange={handleDadosTrecho}
          />
        </label>

        <label>
          Início
          <input
            name="inicio"
            type="time"
            value={dadosTrecho.inicio}
            onChange={handleDadosTrecho}
          />
        </label>

        <label>
          Fim
          <input
            name="fim"
            type="time"
            value={dadosTrecho.fim}
            onChange={handleDadosTrecho}
          />
        </label>

        <label>
          Data
          <input
            name="data"
            type="date"
            value={dadosTrecho.data}
            onChange={handleDadosTrecho}
          />
        </label>

        <button className="botao-principal" onClick={salvarTrecho}>
          Salvar
          <Save />
        </button>
      </div>

      {/* =================================================== */}
      {/* LISTA DE TRECHOS */}
      {/* =================================================== */}

      <div className="container">
        {loading && <ModalCarregamento label="Carregando" />}

        <h2>Trechos Salvos</h2>

        {Array.isArray(list) && list.map((item, index) => (
          <div
            key={item._id || index}
            className={`card-trecho ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-trecho">{item.nomeTrecho}</p>
            <p><strong>Distância:</strong> {item.distancia} km</p>
            <p><strong>Início:</strong> {isoToHHMM(item.inicio)}</p>
            <p><strong>Fim:</strong> {isoToHHMM(item.fim)}</p>
            <p><strong>Data:</strong> {isoToDate(item.data)}</p>

            <button
              className="botao-atencao"
              onClick={() => handleExcluir(item)}
            >
              Excluir <Trash2 />
            </button>

            {item.offline && (
              <small style={{ color: "orange" }}>
                Aguardando sincronização...
              </small>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Trecho;
