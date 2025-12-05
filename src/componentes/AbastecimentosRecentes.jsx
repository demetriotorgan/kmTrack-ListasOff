import React from 'react'
import { Fuel, TrafficCone } from "lucide-react";
import { formatarMoeda } from '../util/moeda';


const AbastecimentosRecentes = ({ abastecimentos, carregandoAbastecimentos }) => {
  return (
    <div className='container'>
      <h2><Fuel /> Abastecimentos</h2>
      <p className='trecho-total'>Total Abastecimento: {formatarMoeda(abastecimentos?.totalValor ?? 0)}</p>
      {carregandoAbastecimentos && <Carregando label='Carregando' />}

      {abastecimentos.ultimosAbastecimentos?.map((item) => (
        <div className="card-recente" key={item._id}>
          <p className="titulo-recente"><TrafficCone />{item.local}</p>
          <p className="info-recente"><strong>Valor:</strong> {formatarMoeda(item.valor)}</p>
          <p className="info-recente"><strong>Litros:</strong>{formatarMoeda(item.litros)}</p>
          <p className='info-recente'><strong>Valor por litro:</strong> {item.valorLitro}L</p>
        </div>
      ))}
    </div>
  )
}

export default AbastecimentosRecentes