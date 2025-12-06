import { useEffect, useState } from "react";
import api from "../api/api";

export function useAbastecimentosRecentes() {
    const [carregandoAbastecimentos, setCarregandoAbastecimentos] = useState(false);
    const [abastecimentos, setAbastecimentos] = useState({
        ultimosAbastecimentos: [],
        totalValor: 0
    });

    const carregarAbastecimentos = async()=>{
      try {
        const response = await api.get('/abastecimentos-recentes');
        setAbastecimentos(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
    carregarAbastecimentos();
  }, []);

    return {
        carregandoAbastecimentos,
        abastecimentos,
        carregarAbastecimentos
    }
}