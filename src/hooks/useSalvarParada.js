import { useState } from "react";
import { hhmmToIso, isoToHHMM } from "../util/time";
import api from "../api/api";
import { triggerRefresh } from "../util/refreshEvent";


export function useSalvarParada({setList}){
const hojeISO = new Date().toISOString();

const paradaInicial = {
  local:'',
  tipo:'',
  horaInicio: isoToHHMM(hojeISO),
  horaFinal:''
}

const [dadosParada, setDadosParada] = useState(paradaInicial);
const [salvando, setSalvando] = useState(false);

const handleDadosParada = (e)=>{
  const {name, value} = e.target;
  setDadosParada((prev)=>({...prev, [name]:value}));
};

const criarPayload = ()=>({
  local: dadosParada.local,
  tipo: dadosParada.tipo,
  horaInicio: hhmmToIso(dadosParada.horaInicio),
  horaFinal: hhmmToIso(dadosParada.horaFinal)
});

const salvarParada = async()=>{
const confirmar = window.confirm('Deseja realmente salvar esta parada?');
if(!confirmar) return;

try {
  setSalvando(true);

  const payload = criarPayload();
  console.log('Payload criado: ', payload);

  const response = await api.post('/salvar-parada', payload);  
  triggerRefresh();
  
  console.log('Resposta da API: ', response);

  if(!response.data.offline){
    console.log("🟢 [PAG] Salvamento ONLINE concluído");
    setList(prev => [response.data.parada, ...prev]);
    alert('Parada salva com sucesso');
    setDadosParada(paradaInicial);
    return;
  }

  // 🔹 OFFLINE — salvo em IndexedDB via offlineInterceptor
      if (response.data.offline === true) {
        console.log("🟠 [PAG] Salvamento OFFLINE");

        const pedagioOffline = {
          ...payload,
          _id: "temp-" + Date.now(),
          offline: true,
        };

        setList(prev => [pedagioOffline, ...prev]);

        alert("Sem conexão! O registro foi salvo offline e será sincronizado automaticamente.");

        setDadosParada(paradaInicial);        
      }
} catch (error) {
  console.log("❌ [PAG] Erro inesperado:", error);
  alert("Erro ao salvar pedágio. Veja o console para mais detalhes.");
}finally{
  setSalvando(false);
  }
};
    return{
        salvando,
        dadosParada,
        handleDadosParada,
        salvarParada
    }
}