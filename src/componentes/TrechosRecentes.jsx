import React from 'react'
import Carregando from './Carregando'
import { Save, Trash2, Map } from "lucide-react";

const TrechosRecentes = ({trechos, carregando}) => {
  return (
    <div className='container'>
        {carregando && <Carregando label='Carregando' />}
        <h2><Map /> Trechos Recentes</h2>
        <p className='trecho-total'>Total Percorrido: {trechos?.distanciaPercorrida ?? 0} km</p>

        {trechos?.ultimosTrechos?.map((item, index) => (
          <div className="card-recente" key={index}>
            <p className="titulo-recente">{item.nomeTrecho}</p>
            <p className="info-recente"><strong>Distância:</strong> {item.distancia} km</p>
            <p className="info-recente"><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>
        </div>
        ))}
      </div>

  )
}

export default TrechosRecentes