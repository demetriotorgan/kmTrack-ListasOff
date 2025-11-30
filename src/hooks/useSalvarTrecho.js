import { useState } from "react";
import { dateToIso, hhmmToIso } from "../util/time";
import api from "../api/api";

export function useSalvarTrecho(){
const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: "",
    fim: "",
    data: "",
}
const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
const [salvando, setSalvando] = useState(false);

const handleDadosTrecho =(e)=>{
  const {name, value} = e.target;
  setDadosTrecho((prev)=>({...prev,[name]:value}));
}

const validarCampos = () => {
    const erros = [];

    if (!dadosTrecho.nomeTrecho.trim()) erros.push("Nome do trecho");
    if (!dadosTrecho.distancia.trim()) erros.push("Distância");
    if (!dadosTrecho.inicio.trim()) erros.push("Horário de início");    
    if (!dadosTrecho.data.trim()) erros.push("Data");

    if (erros.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n" +
        erros.map((e) => `• ${e}`).join("\n")
      );
      return false;
    }

    return true;
  };


const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
  });

    const salvarTrecho = async()=>{
    if(!validarCampos()) return;

    const confirmar = window.confirm('Deseja realmente salvar este trecho?');
    if(!confirmar) return

    try {
    setSalvando(true);
      const response = await api.post('/salvar-trecho', criarPayload());
      console.log(response.data);
      alert('Registro salvo com sucesso');
      setDadosTrecho(trechoInicial);
    } catch (error) {
      console.log(error);
    }finally{
        setSalvando(false);
    }    
        
    };

    return {
        dadosTrecho,
        setDadosTrecho,
        handleDadosTrecho,
        salvarTrecho,
        salvando
    };
}