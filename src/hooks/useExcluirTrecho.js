import { useState } from "react";
import api from "../api/api";

export function useExcluirTrecho({setListarTrechos}){
 const [excluindo, setExcluindo] = useState(false);

    const handleExcluir = async(item)=>{
    try {
      const confirmar = window.confirm('Deseja realmente excluir o registro?');
      if(!confirmar) return;

      setExcluindo(true);
      const response = await api.delete(`/deletar-trecho/${item._id}`);
      console.log(response.data);
      alert('Registro excluido com sucesso');
      setListarTrechos(prev => prev.filter(trecho => trecho._id !== item._id));
    } catch (error) {
      console.log(error);
    }finally{
      setExcluindo(false);
    }
    }

    return{
        handleExcluir,
        excluindo,


    }
}