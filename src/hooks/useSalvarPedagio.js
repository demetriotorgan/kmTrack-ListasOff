import { useState } from "react";
import { dateToIso, isoToDateEdit } from "../util/time";
import api from "../api/api";

export function useSalvarPedagio({setListarPedagios}){
    const hoje = new Date().toISOString();
    const pedagioInicial = {
      local:'',
      valor:'',
      data:isoToDateEdit(hoje)
    }
    
    const [dadosPedagio, setDadosPedagio] = useState(pedagioInicial);
    const [salvando, setSalvando] = useState(false);
    
    const handleDadosPedagio = (e)=>{
  const {name, value} = e.target;
  setDadosPedagio((prev) => ({...prev, [name]:value}));
}

const criarPayload = ()=>({
  local: dadosPedagio.local,
  valor:dadosPedagio.valor,
  data: dateToIso(dadosPedagio.data)
});

const salvarTrecho = async()=>{
  const confirmar = window.confirm('Deseja salvar este pedágio?');
  if(!confirmar) return

  try {
    setSalvando(true);
    const payload = criarPayload();
    const response = await api.post('/salvar-pedagio', payload);
    console.log(response.data);
    alert('Pedágio salvo com sucesso');
    setListarPedagios((prev) => [response.data.pedagio, ...prev]);
    setDadosPedagio(pedagioInicial);
  } catch (error) {
    console.log(error);
  }finally{
    setSalvando(false);
  }
}
    return{
        salvarTrecho,
        handleDadosPedagio,
        dadosPedagio,
        setDadosPedagio,
        salvando
    }
}