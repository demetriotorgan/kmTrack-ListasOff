import React from "react";
import '../style/Pedagio.css'
import { Save, Trash2, HandCoins } from "lucide-react";
import { isoToDate } from "../util/time";

import ModalCarregamento from "./ModalCarregamento";

// NOVOS HOOKS
import { useEntityList } from "../hooks/useEntityList";
import { useSalvarPedagio } from "../hooks/useSalvarPedagio";
import { useExcluirPedagio } from "../hooks/useExcluirPedagio";

const Pedagio = () => {

  // 🔹 Lista unificada online + offline + cache
  const {
  data: list,
  loading,
  setLocal: setList,
  refresh: reload
} = useEntityList("pedagios");

  // 🔹 Salvar pedágio
  const {
    salvarPedagio,
    handleDadosPedagio,
    dadosPedagio,
    salvando
  } = useSalvarPedagio({ setList });

  // 🔹 Excluir pedágio
  const {
    excluindo,
    handleExcluir
  } = useExcluirPedagio({ setList });

  return (
    <>
      {(salvando || excluindo) && (
        <ModalCarregamento label={salvando ? "Salvando" : "Excluindo"} />
      )}

      {/* =================================================== */}
      {/* FORMULÁRIO */}
      {/* =================================================== */}

      <div className="container">
        <h2><HandCoins /> Salvar Pedágio</h2>

        <label>
          Local
          <input
            name="local"
            type="text"
            value={dadosPedagio.local}
            onChange={handleDadosPedagio}
          />
        </label>

        <label>
          Valor
          <input
            name="valor"
            type="number"
            value={dadosPedagio.valor}
            onChange={handleDadosPedagio}
          />
        </label>

        <label>
          Data
          <input
            name="data"
            type="date"
            value={dadosPedagio.data}
            onChange={handleDadosPedagio}
          />
        </label>

        <button
          className="botao-principal"
          onClick={salvarPedagio}
        >
          Salvar
          <Save />
        </button>
      </div>

      {/* =================================================== */}
      {/* LISTA DE PEDÁGIOS */}
      {/* =================================================== */}

      <div className="container">

        {loading && <ModalCarregamento label="Carregando" />}

        <h2>Pedágios Salvos</h2>

        {Array.isArray(list) && list.map((item, index) => (
          <div
            key={item._id || index}
            className={`card-pedagio ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-pedagio">{item.local}</p>
            <p><strong>Valor:</strong> {item.valor} R$</p>
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

export default Pedagio;
