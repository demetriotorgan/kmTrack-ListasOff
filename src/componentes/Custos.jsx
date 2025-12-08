import React, { useState } from 'react'
import { Save,Trash2 } from "lucide-react";
import { dateToIso, isoToDate } from '../util/time';
import api from '../api/api';
import ModalCarregamento from './ModalCarregamento';
import { useSalvarCusto } from '../hooks/useSalvarCusto';
import { useEntityList } from '../hooks/useEntityList';

const Custos = () => {
  const {
 data: list,
  loading,
  setLocal: setList,
  refresh: reload
} = useEntityList("custos");   

const {dadosCusto, salvandoCusto, handleDadosCusto, handleSalvarCusto} = useSalvarCusto({setList});


  return (
    <>
    <div className='container'>
      {salvandoCusto && <ModalCarregamento label='Salvando' />}
        <h2>Gastos e Custos</h2>
        <label>
          Descrição
          <input 
          type='text'
          name='descricao'
          value={dadosCusto.descricao}
          onChange={handleDadosCusto}
          />
        </label>
        <label>
          Valor
          <input 
          type='number'
          name='valor'
          value={dadosCusto.valor}
          onChange={handleDadosCusto}
          />
        </label>
        <label>
          Tipo
          <select 
          name='tipo' 
          value={dadosCusto.tipo} 
          onChange={handleDadosCusto}>
            <option value='debito'>Débito</option>
            <option value='credito'>Crédio</option>
            <option value='pix'>Pix</option>
          </select>
        </label>
        <label>
          Data
          <input 
          type='date'
          name='data'          
          value={dadosCusto.data}
          onChange={handleDadosCusto}          
          />
        </label>
        <button className='botao-principal' onClick={handleSalvarCusto}><Save/> Salvar</button>
    </div>
    <div className='container'>
      <h2>Custos Salvos</h2>
      {loading && <ModalCarregamento label="Carregando" />}

      {Array.isArray(list) && list.map((item, index) => (
          <div
            key={item._id || index}
            className={`card-parada ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-parada">{item.descricao}</p>
            <p><strong>Valor:</strong> {item.valor  }</p>
            <p><strong>Tipo:</strong> {item.tipo}</p>
            <p><strong>Data:</strong> {isoToDate(item.data)}</p>           

            <button
              className="botao-atencao"
              // onClick={()=>handleExcluir(item)}
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

export default Custos