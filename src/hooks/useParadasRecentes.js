import { useEffect, useState } from "react";
import api from "../api/api";

export function useParadasRecentes(){
const [paradas, setParadas] = useState([]);
const [carregandoParadas, setCarregandoParadas] = useState(false);

const carregarParadas = async()=>{
  try {
    setCarregandoParadas(true);
    const response = await api.get('/paradas-recentes');
    setParadas(response.data);    
  } catch (error) {
    console.log(error);
  }finally{
    setCarregandoParadas(false);
  }
};

useEffect(()=>{
  carregarParadas();
},[])

    return{
        paradas,
        carregandoParadas,
        carregarParadas
    }
}