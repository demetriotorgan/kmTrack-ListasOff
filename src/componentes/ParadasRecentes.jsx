import React from 'react'
import { Hourglass } from "lucide-react";
import Carregando from './Carregando';
import { duracaoParada } from '../util/time';

const ParadasRecentes = ({paradas, carregandoParadas}) => {
  return (
    <div className='container'>
        <h2><Hourglass /> Paradas Recentes</h2>

        {carregandoParadas && <Carregando label='Carregando' />}        
        
{paradas.ultimasParadas?.map((item) => (
  <div className="card-recente" key={item._id}>
    <p className="titulo-recente">{item.local}</p>
    <p className="info-recente"><strong>Tipo:</strong> {item.tipo}</p>    
    <p className='info-recente'><strong>Duração:</strong> {duracaoParada(item.horaInicio, item.horaFinal)}h</p>
  </div>
))}
    </div>
  )
}

export default ParadasRecentes