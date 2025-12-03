import React, { useState } from 'react'
import '../style/Abastecimento.css'
import { dateToIso, isoToDate } from '../util/time';
import { Save, Trash2 } from "lucide-react";
import api from '../api/api';
import { useEntityList } from '../hooks/useEntityList';
import ModalCarregamento from '../componentes/ModalCarregamento';

const Abastecimento = () => {
  const abastecimentoInicial = {
    local: '',
    valor: '',
    litros: '',
    odometro: '',
    valorLitro: '',
    data:''
  }

  const [dadosAbastecimento, setDadosAbastecimento] = useState(abastecimentoInicial);
  const [salvando, setSalvando] = useState(false);

  const {
      data: list,
      loading,
      setLocal: setList,
      refresh: reload
    } = useEntityList("abastecimentos");

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

  return (
    <>
    <div className='container'>
      <h2>Novo Abastecimento</h2>
      <label>
        Local
        <input 
        name='local'
        type='text'
        value={dadosAbastecimento.local}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Valor
        <input 
        name='valor'
        value={dadosAbastecimento.valor}
        type='number'
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Litros
        <input 
        name='litros'
        type='number'
        value={dadosAbastecimento.litros}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Odometro
        <input 
        name='odometro'
        type='number'
        value={dadosAbastecimento.odometro}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Valor Litro
        <input 
        name='valorLitro'
        type='number'
        value={dadosAbastecimento.valorLitro}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <label>
        Data
        <input 
        name='data'
        type='date'
        value={dadosAbastecimento.data}
        onChange={handleDadosAbastecimento}
        />
      </label>
      <button className='botao-principal' onClick={salvarAbastecimento}>Salvar <Save /></button>
    </div>    

    {/* =================================================== */}
      {/* LISTA DE TRECHOS */}
      {/* =================================================== */}

      <div className="container">
        {loading && <ModalCarregamento label="Carregando" />}

        <h2>Trechos Salvos</h2>

        {Array.isArray(list) && list.map((item, index) => (
          <div
            key={item._id || index}
            className={`card-abastecimento ${item.offline ? "card-offline" : ""}`}
          >
            <p className="titulo-abastecimento">{item.local}</p>
            <p><strong>Valor:</strong> {item.valor} R$</p>
            <p><strong>Litros:</strong> {item.litros} Litros</p>
            <p><strong>Odometro:</strong> {item.odometro}</p>
            <p><strong>Data:</strong> {isoToDate(item.data)}</p>

            <button
              className="botao-atencao"
              onClick={() => handleExcluir(item)}
            >
              Excluir <Trash2 />
            </button>

            {item.offline && (
              <small style={{ color: "orange" }}>
                Aguardando sincronização...
              </small>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default Abastecimento