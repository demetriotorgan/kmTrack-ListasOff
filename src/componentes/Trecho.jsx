import React, { useEffect, useState } from 'react'
import '../style/Trecho.css'
import {dateToIso, hhmmToIso, isoToHHMM} from '../util/time'
import { Map, Save, Trash2 } from 'lucide-react'
import api from '../api/api'
import { useSalvarTrecho } from '../hooks/useSalvarTrecho'
import ModalCarregamento from './ModalCarregamento'
import { useListarTrechos } from '../hooks/useListarTrechos'

const Trecho = () => { 

  const { dadosTrecho, setDadosTrecho, handleDadosTrecho, salvarTrecho,salvando } = useSalvarTrecho();
  const { listarTrechos, setListarTrechos, carregando} = useListarTrechos();
  
  return (
     <>
     {salvando && (<ModalCarregamento label='Salvando' />)} 

    <div className='container'>
        <h2>Novo Trecho <Map /></h2>
        <label>
        Nome do Trecho
            <input
            name='nomeTrecho'
            type='text'
            value={dadosTrecho.nomeTrecho}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Distância
            <input
            name='distancia'
            type='number'
            value={dadosTrecho.distancia}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Início
            <input
            name='inicio'
            type='time'
            value={dadosTrecho.inicio}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Fim
            <input
            name='fim'
            type='time'
            value={dadosTrecho.fim}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Data
            <input
            name='data'
            type='date'
            value={dadosTrecho.data}
            onChange={handleDadosTrecho}
            />
        </label>
        <button className='botao-principal' onClick={salvarTrecho}>Salvar <Save /></button>
    </div>
     
    <div className="container">
        {carregando && (<ModalCarregamento label='Carregando' />)}
      <h2>Trechos Salvos</h2>
      {Array.isArray(listarTrechos) && listarTrechos.map((item, index) => (
        <div className="card-trecho" key={index}>
          <p className="titulo-trecho">{item.nomeTrecho}</p>
          <p><strong>Distância:</strong> {item.distancia} km</p>
          <p><strong>Início:</strong> {isoToHHMM(item.inicio)}</p>
          <p><strong>Fim:</strong> {isoToHHMM(item.fim)}</p>
          <button className='botao-atencao'>Excluir <Trash2 /></button>
        </div>    
      ))}
    </div>
    </>
  )
}

export default Trecho