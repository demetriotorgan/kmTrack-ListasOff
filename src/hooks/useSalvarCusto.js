import { useState } from "react";
import api from "../api/api";
import { dateToIso } from "../util/time";

export function useSalvarCusto({setList}){
const custoInicial = {
  descricao:'',
  valor:'',
  tipo:'debito',
  data:''
}

const [dadosCusto, setDadosCusto] = useState(custoInicial);
const [salvandoCusto, setSalvandoCusto] = useState(false);

const handleDadosCusto = (e)=>{
  const {name, value} = e.target;
  setDadosCusto((prev)=>({...prev,[name]:value}));
}

const handleSalvarCusto = async()=>{
  const payload = {
    descricao:dadosCusto.descricao,
    valor:dadosCusto.valor,
    tipo:dadosCusto.tipo,
    data:dateToIso(dadosCusto.data)
  }

  const confirmar = window.confirm('Deseja salvar este registro?');
  if(!confirmar) return

  try {
    setSalvandoCusto(true);
    const response = await api.post('/salvar-custo', payload);
    // console.log(response.data);    
    

    /* =====================
         ONLINE
      ===================== */
      if (!response.data.offline) {
        setList(prev => [response.data.custo, ...prev]);
        alert('Registro salvo com sucesso');
        setDadosCusto(custoInicial);        
        return;
      }

      /* =====================
         OFFLINE
      ===================== */
      const tempItem = {
        ...payload,
        _id: "temp-" + Date.now(),
        offline: true
      };

      setList(prev => [tempItem, ...prev]);

      alert("Sem conexão! O registro foi salvo offline.");
      setDadosCusto(custoInicial);        

  } catch (error) {
    console.log(error);
  }finally{
    setSalvandoCusto(false);
  }
};

    return{
        dadosCusto,
        salvandoCusto,
        handleDadosCusto,
        handleSalvarCusto
    }
}