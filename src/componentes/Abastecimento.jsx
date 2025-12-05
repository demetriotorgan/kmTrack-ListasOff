import React, { useState } from 'react'
import '../style/Abastecimento.css'
import { dateToIso, isoToDate } from '../util/time';
import { Save, Trash2 } from "lucide-react";
import api from '../api/api';
import { useEntityList } from '../hooks/useEntityList';
import ModalCarregamento from '../componentes/ModalCarregamento';
import { useSalvarAbastecimento } from '../hooks/useSalvarAbastecimento';
import { triggerRefresh } from '../util/refreshEvent';

const Abastecimento = () => {
  const [excluindo, setExcluindo] = useState(false);

  const {
      data: list,
      loading,
      setLocal: setList,
      refresh: reload
    } = useEntityList("abastecimentos");

  const {
        dadosAbastecimento,
        salvando,
        handleDadosAbastecimento,
        salvarAbastecimento
    } = useSalvarAbastecimento({setList});

  const handleExcluir = async(item)=>{
    // ▶️ 1. Verificação imediata OFFLINE
      if (!navigator.onLine) {
        alert(
          "❌ Você está offline.\nA exclusão só pode ser realizada quando a conexão estiver ativa."
        );
        return;
      }
  const confirmar = window.confirm('Deseja realmente excluir este registro?');
  if(!confirmar) return

  try {
    setExcluindo(true)
    const response = await api.delete(`/deletar-abastecimento/${item._id}`);
    console.log(response.data);
    alert('Regsitro excluido com sucesso');
    triggerRefresh();

    setList((prev) => prev.filter((p) => p._id !== item._id));
  } catch (error) {
    console.log(error);
  }finally{
    setExcluindo(false);
  }

  }
  return (
    <>
    {(salvando || excluindo) && (<ModalCarregamento label={salvando ? 'Salvando' : 'Excluindo'} />)}
    <div className='container'>
      <h2>Novo Abastecimento</h2>
      <label>
        Local
        <input 
        name='local'
        type='text'
        value={dadosAbastecimento.local}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Valor
        <input 
        name='valor'
        value={dadosAbastecimento.valor}
        type='number'
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Litros
        <input 
        name='litros'
        type='number'
        value={dadosAbastecimento.litros}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Odometro
        <input 
        name='odometro'
        type='number'
        value={dadosAbastecimento.odometro}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Valor Litro
        <input 
        name='valorLitro'
        type='number'
        value={dadosAbastecimento.valorLitro}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Data
        <input 
        name='data'
        type='date'
        value={dadosAbastecimento.data}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <button className='botao-principal' onClick={salvarAbastecimento}>Salvar <Save /></button>
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
            className={`card-abastecimento ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-abastecimento">{item.local}</p>
            <p><strong>Valor:</strong> {item.valor} R$</p>
            <p><strong>Litros:</strong> {item.litros} Litros</p>
            <p><strong>Odometro:</strong> {item.odometro}</p>
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
  )
}

export default Abastecimento