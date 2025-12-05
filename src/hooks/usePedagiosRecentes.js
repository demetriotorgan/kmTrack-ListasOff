import { useEffect, useState } from "react";
import api from "../api/api";

export function usePedagiosRecentes(){
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

    return{
        pedagios,
        carregandoPedagios,
        carregarPedagios
    }
}