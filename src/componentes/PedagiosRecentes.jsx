import React, { useEffect, useState } from 'react'
import { HandCoins, BadgeDollarSign,Coins } from "lucide-react";
import api from '../api/api'
import Carregando from './Carregando';
import { formatarMoeda } from '../util/moeda';

const PedagiosRecentes = () => {
  const [pedagios, setPedagios] = useState({
  ultimosPedagios: [],
  totalValor: 0
  });
  const[carregandoPedagios, setCarregandoPedagios] = useState(false);

  const carregarPedagios = async()=>{
    setCarregandoPedagios(true);
    try {
    const response = await api.get('/pedagios-recentes');
    console.log(response.data);
    setPedagios(response.data);  
    } catch (error) {
      console.log(error);
    }finally{
      setCarregandoPedagios(false);
    }    
  };

  useEffect(()=>{
    carregarPedagios();
  },[]);



  return (
    <div className='container'>
        <h2><HandCoins /> Pedágios Recentes</h2>
        {carregandoPedagios && <Carregando label='Carregando' />}        
        <p className='trecho-total'>
          <BadgeDollarSign /> Total Gasto: {formatarMoeda(pedagios.totalValor) ?? 0}
        </p>

{pedagios.ultimosPedagios?.map((item) => (
  <div className="card-recente" key={item._id}>
    <p className="titulo-recente">{item.local}</p>
    <p className="info-recente"><strong>Valor:</strong> <Coins /> {formatarMoeda(item.valor)}</p>
    <p className='info-recente'><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>
  </div>
))}
    </div>
  )
}

export default PedagiosRecentes