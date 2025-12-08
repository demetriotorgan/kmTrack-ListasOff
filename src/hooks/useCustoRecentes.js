import { useEffect, useState } from "react";
import api from "../api/api";


export function useCustoRecentes() {
    const [custos, setCustos] = useState({});
    const [carregandoCustos, setCarregandoCustos] = useState(false);

      const carregarCustos = async()=>{
        try {
          setCarregandoCustos(true);
          const response = await api.get('/custos-recentes');
          setCustos(response.data);
        } catch (error) {
          console.log(error);
        }finally{
          setCarregandoCustos(false);
        }
      };
    
      useEffect(()=>{
        carregarCustos();
      },[]);      
    
    return {
        custos,
        carregandoCustos,
        carregarCustos
    }
}