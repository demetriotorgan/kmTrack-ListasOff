import { useState } from "react";
import { dateToIso, hhmmToIso, isoToDateEdit, isoToHHMM } from "../util/time";
import api from "../api/api";


export function useEditarTrecho({setDadosTrecho, dadosTrecho,setListarTrechos,trechoInicial}) {

    const [editando, setEditando] = useState(false);
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);
    const [idEditado, setIdEditado] = useState('');

    const handleEditando = (item)=>{
      // ▶️ 1. Verificação imediata OFFLINE
      if (!navigator.onLine) {
        alert(
          "❌ Você está offline.\nA exclusão só pode ser realizada quando a conexão estiver ativa."
        );
        return;
      }
      
    setEditando(true);

    setDadosTrecho({
    nomeTrecho: item.nomeTrecho,
    distancia: item.distancia,
    inicio: isoToHHMM(item.inicio),
    fim: isoToHHMM(item.fim),
    data: isoToDateEdit(item.data),
    });
    setIdEditado(item._id);
  };

  const handleAtualizarTrecho = async(idEditado)=>{
    
    const confirmar = window.confirm('Deseja salvar atualização?');
    if(!confirmar) return

    const payloadEditado = ()=>({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: dadosTrecho.distancia,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
    })

    try { 
      console.log(payloadEditado());
      const response = await api.put(`/editar-trecho/${idEditado}`, payloadEditado());      
      console.log(response.data);
      alert('Registro editado com sucesso');
      setListarTrechos((prev) => [response.data.trecho, ...prev]);
      setDadosTrecho(trechoInicial)
    } catch (error) {
      console.log(error)
    }
  }


    return {
        handleEditando,
        handleAtualizarTrecho,
        editando,
        salvandoEdicao,
        idEditado
    }
}