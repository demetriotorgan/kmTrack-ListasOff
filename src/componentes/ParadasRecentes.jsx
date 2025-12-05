import React, { useState } from 'react'
import { Hourglass,Hand,ThumbsUp } from "lucide-react";
import Carregando from './Carregando';
import { duracaoParada, isoToHHMM } from '../util/time';
import api from '../api/api';

const ParadasRecentes = ({paradas, carregandoParadas,onAtualizarParada}) => {
const [encerrandoParada, setEncerrandoParada] = useState(false);

  const handleEncerrar = async(item)=>{
  const hoje = new Date().toISOString();

    const payload = {
      local: item.local,
      tipo: item.tipo,
      horaInicio: item.horaInicio,
      horaFinal: hoje
    }

    const confirmar = window.confirm('Deseja encerrar esta parada?');
    if(!confirmar)  return

    try {
      setEncerrandoParada(true);
      const response = await api.put(`/editar-parada/${item._id}`, payload);
      alert('Trecho encerrado com sucesso');
      console.log(response.data);
       if (typeof onAtualizarParada === "function") {
        onAtualizarParada();
       }

    } catch (error) {
      console.log(error);
    }finally{
      setEncerrandoParada(false);
    }
  };

  return (
    <div className='container'>
        <h2><Hourglass /> Paradas Recentes</h2>

        {(carregandoParadas || encerrandoParada) && <Carregando label='Carregando' />}        
        
{paradas.ultimasParadas?.map((item) => (
  <div className="card-recente" key={item._id}>
    <p className="titulo-recente"><Hand /> {item.local}</p>
    <p className="info-recente"><strong>Tipo:</strong> {item.tipo}</p>  
    <p className="info-recente"><strong>Início:</strong> {isoToHHMM(item.horaInicio)}</p>  
    <p className='info-recente'><strong>Duração:</strong> {duracaoParada(item.horaInicio, item.horaFinal)}</p>
    <button 
      className='botao-principal' 
      onClick={()=>handleEncerrar(item)}
      disabled={!!item.horaFinal}>
      <ThumbsUp />Encerrar
      </button>
  </div>
))}
    </div>
  )
}

export default ParadasRecentes