import { useState } from "react";
import api from "../api/api";
import { triggerRefresh } from "../util/refreshEvent";

export function useExcluirParada({setList}){
const [excluindo, setExcluindo] = useState(false);

const handleExcluir = async(item)=>{
// ▶️ 1. Verificação imediata OFFLINE
      if (!navigator.onLine) {
        alert(
          "❌ Você está offline.\nA exclusão só pode ser realizada quando a conexão estiver ativa."
        );
        return;
      }
  const confirmar = window.confirm('Deseja realmente excluir este registro?');
  if(!confirmar) return

  try {
    setExcluindo(true);
    const response = await api.delete(`/deletar-parada/${item._id}`);
    triggerRefresh();
    console.log(response.data);
    alert('Registro excluido com sucesso');
    setList((prev) => prev.filter((p) => p._id !== item._id));
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