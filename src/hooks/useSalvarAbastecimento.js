import { useState } from "react";
import api from "../api/api";
import { dateToIso, isoToDateEdit } from "../util/time";
import { triggerRefresh } from "../util/refreshEvent";

export function useSalvarAbastecimento({setList}){
const hojeISO = new Date().toISOString();

const abastecimentoInicial = {
    local: '',
    valor: '',
    litros: '',
    odometro: '',
    valorLitro: '',
    data: isoToDateEdit(hojeISO)
  }

  const [dadosAbastecimento, setDadosAbastecimento] = useState(abastecimentoInicial);
  const [salvando, setSalvando] = useState(false);

  const handleDadosAbastecimento = (e)=>{
    const {name, value} = e.target;
    setDadosAbastecimento((prev) => ({...prev, [name]:value}));
  };

  const criarPayload = () => ({
    local: dadosAbastecimento.local,
    valor: dadosAbastecimento.valor,
    litros: dadosAbastecimento.litros,
    odometro: dadosAbastecimento.odometro,
    valorLitro: dadosAbastecimento.valorLitro,
    data: dateToIso(dadosAbastecimento.data)
  });

  const salvarAbastecimento = async() =>{
    if(!window.confirm('Deja salvar este abastecimento?')) return;

    try {
      setSalvando(true);

      const payload = criarPayload();
      const response = await api.post('/salvar-abastecimento', payload);
      triggerRefresh();

      if(!response.data.offline){
        setList((prev) => [response.data.abastecimento, ...prev]);
        alert('Abastecimento salvo com sucesso!');
        setDadosAbastecimento(abastecimentoInicial);
        return;
      }

      const tempItem = {
        ...payload,
        _id: "temp-" + Date.now(),
        offline:true,
      };

      setList((prev) => [tempItem, ...prev]);
      alert('Sem conexão! O abastecimento foi salvo offline;');
      setDadosAbastecimento(abastecimentoInicial);

    } catch (error) {
      console.error('Erro ao salvar abastecimento: ', error);
      alert('Erro ao salvar Abastecimento');      
    }finally{
      setSalvando(false);
    }
  }

    return{
        dadosAbastecimento,
        salvando,
        handleDadosAbastecimento,
        salvarAbastecimento
    }
}