import React from 'react'
import { formatarMoeda } from '../util/moeda'
import { isoToDate } from '../util/time'
import Carregando from './Carregando'
import { DollarSign, PiggyBank } from 'lucide-react'

const CustosRecentes = ({custos, carregandoCustos}) => {
  return (
    <div className='container'>
        <h2><PiggyBank /> Gastos Recentes</h2>
        <p className='trecho-total'>Total Gasto: {formatarMoeda(custos?.totalValor ?? 0)}</p>
      {carregandoCustos && <Carregando label='Carregando' />}

      {custos.ultimosCustos?.map((item) => (
        <div className="card-recente" key={item._id}>
          <p className="titulo-recente"><DollarSign /> {item.descricao}</p>
          <p className="info-recente"><strong>Valor:</strong> {formatarMoeda(item.valor)}</p>
          <p className="info-recente"><strong>Tipo:</strong> {item.tipo}</p>
          <p className='info-recente'><strong>Data:</strong> {isoToDate(item.data)}</p>
        </div>
      ))}
    </div>
  )
}

export default CustosRecentes