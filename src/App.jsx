import { useEffect, useState } from 'react'
import './App.css'
import Abastecimento from './componentes/Abastecimento'
import Footer from './componentes/Footer'
import Menu from './componentes/Menu'
import NavBar from './componentes/NavBar'
import Parada from './componentes/Parada'
import Pedagio from './componentes/Pedagio'
import Trecho from './componentes/Trecho'
import StatusConexao from './componentes/StatusConexao'
import { useTrechoRecentes } from './hooks/useTrechoRecentes'
import TrechosRecentes from './componentes/TrechosRecentes'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import PedagiosRecentes from './componentes/PedagiosRecentes'
import ParadasRecentes from './componentes/ParadasRecentes'
import AbastecimentosRecentes from './componentes/AbastecimentosRecentes'
import { subscribeRefresh } from './util/refreshEvent'
import { usePedagiosRecentes } from './hooks/usePedagiosRecentes'
import api from './api/api'
import { useParadasRecentes } from './hooks/useParadasRecentes'

function App() {
  const [selected, setSelected] = useState(''); 
  const[carregandoAbastecimentos, setCarregandoAbastecimentos] = useState(false);
  const [abastecimentos, setAbastecimentos] = useState({
  ultimosAbastecimentos: [],
  totalValor: 0
  });  
  
  const { trechos,carregando,carregarTrechos} = useTrechoRecentes();
  const {pedagios, carregandoPedagios, carregarPedagios} = usePedagiosRecentes();
  const {paradas, carregandoParadas, carregarParadas} = useParadasRecentes();

  const online = useOnlineStatus(carregarTrechos);
  
  const handleSelectChange = (value) => {
    setSelected(value);
  };  

  const carregarAbastecimentos = async()=>{
  try {
    const response = await api.get('/abastecimentos-recentes');
    setAbastecimentos(response.data);
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
  const unsub = subscribeRefresh(() => {
    carregarTrechos();
    carregarPedagios();
    carregarParadas();
    carregarAbastecimentos();
  });
  return unsub;
}, [carregarTrechos,carregarPedagios,carregarParadas,carregarAbastecimentos]);


useEffect(()=>{
carregarAbastecimentos();
},[])

  return (
    <>
      <NavBar />
      <StatusConexao />
      <Menu onChangeOption={handleSelectChange} />

      {selected === 'trecho' && <Trecho />}
      {selected === 'parada' && <Parada />}
      {selected === 'pedagio' && <Pedagio />}
      {selected === 'abastecimento' && <Abastecimento />}

      {online && selected === '' && (
        <>
      <TrechosRecentes 
      trechos={trechos}
      carregando={carregando}
      onAtualizarTrechos={carregarTrechos}
      />
      <PedagiosRecentes
      pedagios={pedagios}
      carregandoPedagios={carregandoPedagios}      
      />

      <ParadasRecentes 
      paradas={paradas}
      carregandoParadas={carregandoParadas}
      onAtualizarParada={carregarParadas}
      />

      <AbastecimentosRecentes
      abastecimentos={abastecimentos}
      carregandoAbastecimentos={carregandoAbastecimentos}
      />
      </>
      )}
      
      {!online && selected === '' && (
         <p className="offline-msg">Sem conexão — dados recentes indisponíveis</p>
      )}
      <Footer />
    </>
  );
}

export default App
