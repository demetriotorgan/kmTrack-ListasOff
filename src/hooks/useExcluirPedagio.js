import { useState } from "react";
import api from "../api/api";

export function useExcluirPedagio({setListarPedagios}){
const [excluindo, setExcluindo] = useState(false);

const handleExcluir = async(item)=>{
  const confirmar = window.confirm('Deseja realmente excluir este registro?');
  if(!confirmar) return
  
try {
  setExcluindo(true);
  const response = await api.delete(`/deletar-pedagio/${item._id}`);
  console.log(response.data);
  alert('Registro excluido com sucesso');
  setListarPedagios(prev => prev.filter(trecho => trecho._id !== item._id))
} catch (error) {
  console.log(error);
}finally{
  setExcluindo(false);
}
}
    return{
        excluindo,
        handleExcluir
    }
}