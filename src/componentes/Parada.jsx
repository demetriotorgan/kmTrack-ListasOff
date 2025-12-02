import React, { useState } from 'react'
import { Save, Trash2 } from "lucide-react";
import { useSalvarParada } from '../hooks/useSalvarParada';
import ModalCarregamento from './ModalCarregamento';

const Parada = () => {

const {salvando, dadosParada, handleDadosParada, salvarParada} = useSalvarParada();

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
    </>
  )
}

export default Parada