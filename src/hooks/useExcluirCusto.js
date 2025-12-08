import api from "../api/api";
import { triggerRefresh } from "../util/refreshEvent";

export function useExcluirCusto({setList}){

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
    const response = await api.delete(`/deletar-custo/${item._id}`);
    console.log(response.data);
    alert('Registro excluido com sucesso');
    setList((prev) => prev.filter((p) => p._id !== item._id));
    triggerRefresh();
  } catch (error) {
    console.log(error);
  }
}

    return{
        handleExcluir        
    }
}