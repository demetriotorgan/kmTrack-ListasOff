import React from 'react'
import Carregando from './Carregando'
import { Flag, Map, Timer,MapPinCheckInside  } from "lucide-react";
import { duracaoFormatada, hhmmToIso, isoToHHMM } from '../util/time';
import api from '../api/api';

const TrechosRecentes = ({trechos, carregando, onAtualizarTrechos }) => {

  // ⛔ Só mostra enquanto não está carregando e não tem dados
  if (!carregando && (!trechos?.ultimosTrechos || trechos.ultimosTrechos.length === 0)) {
    return null;
  }

  const handleEncerrar = async(item)=>{
    const hoje = new Date().toISOString();

    const payload = {
      nomeTrecho: item.nomeTrecho,
      distancia: item.distancia,
      inicio: item.inicio,
      fim: hoje,
      data: item.data
    }
    const confirmar = window.confirm('Deseja encerrar este trecho?');
    if(!confirmar) return

    try {
      const response = await api.put(`/editar-trecho/${item._id}`, payload);
      console.log(response.data);
      alert('Trecho encerrado com sucesso');

        if (typeof onAtualizarTrechos === "function") {
        onAtualizarTrechos();
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='container'>
        {carregando && <Carregando label='Carregando' />}
        <h2><Map /> Trechos Recentes</h2>
        <p className='trecho-total'>Total Percorrido: {trechos?.distanciaPercorrida ?? 0} km</p>

        {trechos?.ultimosTrechos?.map((item, index) => (
          <div className="card-recente" key={index}>
            <p className="titulo-recente"><Flag /> {item.nomeTrecho}</p>
            <p className="info-recente"><strong>Distância:</strong> {item.distancia} km</p>
            <p className='info-recente'><strong>Partida:</strong> {isoToHHMM(item.inicio)}</p>
            <p className='info-recente'><strong>Chegada:</strong> {isoToHHMM(item.fim)}</p>
            <p className='info-duracao'>
              <Timer size={16} style={{ marginRight: 6 }} />
              {duracaoFormatada(item.inicio, item.fim, item.distancia)}
            </p>
            <button className='botao-principal' onClick={()=>handleEncerrar(item)}><MapPinCheckInside /> Encerrar</button>
        </div>
        ))}
      </div>

  )
}

export default TrechosRecentes