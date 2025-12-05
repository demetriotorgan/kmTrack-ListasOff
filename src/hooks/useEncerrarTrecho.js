import api from "../api/api";

export function useEncerrarTrecho({onAtualizarTrechos}){

    const handleEncerrar = async(item)=>{
    const hoje = new Date().toISOString();

    const payload = {
      nomeTrecho: item.nomeTrecho,
      distancia: item.distancia,
      inicio: item.inicio,
      fim: hoje,
      data: item.data
    }
    const confirmar = window.confirm('Deseja encerrar este trecho?');
    if(!confirmar) return

    try {
      const response = await api.put(`/editar-trecho/${item._id}`, payload);
      console.log(response.data);
      alert('Trecho encerrado com sucesso');

        if (typeof onAtualizarTrechos === "function") {
        onAtualizarTrechos();
      }
    } catch (error) {
      console.log(error);
    }
  }

    return{
        handleEncerrar
    }
}