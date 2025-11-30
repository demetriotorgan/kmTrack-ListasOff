import React, { useEffect, useState } from 'react'
import { Save, Pencil,Trash2 } from 'lucide-react'
import { dateToIso, isoToDate, isoToDateEdit, isoToHHMM } from '../util/time';
import ModalCarregamento from './ModalCarregamento';
import api from '../api/api';
import { useSalvarPedagio } from '../hooks/useSalvarPedagio';

const Pedagio = () => {
const [listarPedagios, setListarPedagios] = useState([]);
const [carregando, setCarregando] = useState(false);

const { salvarTrecho, handleDadosPedagio, dadosPedagio, setDadosPedagio, salvando} = useSalvarPedagio({setListarPedagios});

const carregarPedagios = async()=>{
  try {
    const response = await api.get('/listar-pedagio');
    setListarPedagios(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

useEffect(()=>{
  carregarPedagios();
},[]);

  return (
    <>
    {salvando && (<ModalCarregamento label='Salvando' />)}
    <div className='container'>
      <h2>Salvar Pedágio</h2>
      <label>
        Local
        <input 
          name='local'
          type='text'
          value={dadosPedagio.local}          
          onChange={handleDadosPedagio}
        />
      </label>
      <label>
        Valor
        <input 
        name='valor'
        type='number'
        value={dadosPedagio.valor}
        onChange={handleDadosPedagio}
        />
      </label>
      <label>
        Data
        <input 
        name='data'
        type='date'
        value={dadosPedagio.data}
        onChange={handleDadosPedagio}
        />
      </label>
      <button className='botao-principal' onClick={salvarTrecho}>Salvar<Save /></button>
    </div>

      <div className="container">
        {(carregando) && (<ModalCarregamento label='Carregando' />)}
        <h2>Trechos Salvos</h2>
        {Array.isArray(listarPedagios) && listarPedagios.map((item, index) => (
          <div className="card-trecho" key={index}>
            <p className="titulo-trecho">{item.local}</p>
            <p><strong>Valor:</strong> {item.distancia} km</p>            
            <p><strong>Data:</strong> {isoToDate(item.data)}</p>
            <button className='botao-atencao'>Excluir <Trash2 /></button>
            <button className='botao-secundario'>Editar <Pencil /></button>
          </div>
        ))}
      </div>
    
    </>
  )
}

export default Pedagio