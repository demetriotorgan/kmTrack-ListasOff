import React from 'react'
import Carregando from './Carregando'
import { Flag, Map, Timer,Gauge   } from "lucide-react";
import { duracaoFormatada, isoToHHMM } from '../util/time';

const TrechosRecentes = ({trechos, carregando}) => {

  // ⛔ Só mostra enquanto não está carregando e não tem dados
  if (!carregando && (!trechos?.ultimosTrechos || trechos.ultimosTrechos.length === 0)) {
    return null;
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
        </div>
        ))}
      </div>

  )
}

export default TrechosRecentes