import React, { useState } from 'react'
import '../style/Parada.css'
import { Save, Trash2 } from "lucide-react";
import { useSalvarParada } from '../hooks/useSalvarParada';
import ModalCarregamento from './ModalCarregamento';
import { useEntityList } from '../hooks/useEntityList';
import { isoToDate } from '../util/time';

const Parada = () => {

const{
  data: list,
  loading,
  setLocal: setList,
  refresh: reload
} = useEntityList("paradas");

const {
  salvando, 
  dadosParada, 
  handleDadosParada, 
  salvarParada} = useSalvarParada({setList});

const handleExcluir = async(item)=>{

}

  return (
    <>
    {salvando && (<ModalCarregamento label='Salvando' />)}

    <div className='container'>
      <h2>Cadastrar Parada</h2>
      <label>
        Local
        <input 
        name='local'
        type='text'
        value={dadosParada.local}
        onChange={handleDadosParada}
        />
      </label>
      <label>
        Tipo
        <select
        name='tipo'
        value={dadosParada.tipo}
        onChange={handleDadosParada}>
          <option>Selecione um Tipo</option>
          <option value='abastecimento'>Abastecimento</option>
          <option value='descanço'>Descanço</option>
          <option value='alimentação'>Alimentação</option>
          <option value='atrativo'>Atrativo</option>
          <option value='pernoite'>Pernoite</option>
        </select>
      </label>
      <label>
        Hora Inicial
        <input 
        name='horaInicio'        
        type='time'
        value={dadosParada.horaInicio}
        onChange={handleDadosParada}
        />
      </label>
      <label>
        Hora Final
        <input 
        name='horaFinal'
        type='time'
        value={dadosParada.horaFinal}
        onChange={handleDadosParada}
        />
      </label>
      <button className='botao-principal' onClick={salvarParada}>Salvar <Save /></button>
    </div>
    {/* =================================================== */}
      {/* LISTA DE Paradas */}
      {/* =================================================== */}

      <div className="container">

        {loading && <ModalCarregamento label="Carregando" />}

        <h2>Pedágios Salvos</h2>

        {Array.isArray(list) && list.map((item, index) => (
          <div
            key={item._id || index}
            className={`card-parada ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-parada">{item.local}</p>
            <p><strong>Local:</strong> {item.local}</p>
            <p><strong>Tipo:</strong> {item.tipo}</p>
            <p><strong>Hora de Início:</strong> {isoToDate(item.horaInicio)}</p>
            <p><strong>Hora de Final:</strong> {isoToDate(item.horaFinal)}</p>

            <button
              className="botao-atencao"
              onClick={()=>handleExcluir(item)}
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

export default Parada