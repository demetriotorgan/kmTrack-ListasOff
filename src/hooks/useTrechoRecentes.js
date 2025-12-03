import { useCallback, useEffect, useState } from "react";
import api from "../api/api";


export function useTrechoRecentes(){
const [trechos, setTrechos] = useState({
    ultimosTrechos: [],
    distanciaPercorrida: 0
  });
  const [carregando, setCarregando] = useState(false);

  const carregarTrechos = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await api.get('/trechos-recentes');

      setTrechos({
        ultimosTrechos: response.data.ultimosTrechos,
        distanciaPercorrida: response.data.totalDistancia
      });

    } catch (error) {
      console.log(error);
    }finally{
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTrechos();
  }, []);

    return{
        trechos,
        carregando,
        carregarTrechos
    }
}