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
import { useAbastecimentosRecentes } from './hooks/useAbastecimentosRecentes'
import CustosRecentes from './componentes/CustosRecentes'
import Custos from './componentes/Custos'
import { useCustoRecentes } from './hooks/useCustoRecentes'
import Diario from './componentes/Diario'
import { File } from 'lucide-react'

function App() {
  const [selected, setSelected] = useState('');  
  const [onDiario, setOnDiario] = useState(false);

  const { trechos, carregando, carregarTrechos } = useTrechoRecentes();
  const { pedagios, carregandoPedagios, carregarPedagios } = usePedagiosRecentes();
  const { paradas, carregandoParadas, carregarParadas } = useParadasRecentes();
  const {carregandoAbastecimentos, abastecimentos, carregarAbastecimentos} = useAbastecimentosRecentes();
  const {custos, carregandoCustos, carregarCustos} = useCustoRecentes();

  const online = useOnlineStatus(carregarTrechos);
  

  const handleSelectChange = (value) => {
    setSelected(value);
  };

  useEffect(() => {
    const unsub = subscribeRefresh(() => {
      carregarTrechos();
      carregarPedagios();
      carregarParadas();
      carregarAbastecimentos();
      carregarCustos();
    });
    return unsub;
  }, [carregarTrechos, carregarPedagios, carregarParadas, carregarAbastecimentos, carregarCustos]);

  const handleDiario = ()=>{
    setOnDiario(!onDiario);
  }

  return (
    <>
      <NavBar />
      <StatusConexao />
      <Menu onChangeOption={handleSelectChange} />

      {selected === 'trecho' && <Trecho />}
      {selected === 'parada' && <Parada />}
      {selected === 'pedagio' && <Pedagio />}
      {selected === 'abastecimento' && <Abastecimento />}
      {selected === 'custos' && <Custos />}

      {online && selected === '' && (
        <>
          <CustosRecentes 
          custos={custos}
          carregandoCustos={carregandoCustos}
          />

          <AbastecimentosRecentes
            abastecimentos={abastecimentos}
            carregandoAbastecimentos={carregandoAbastecimentos}
          />

          <PedagiosRecentes
            pedagios={pedagios}
            carregandoPedagios={carregandoPedagios}
          />

          <TrechosRecentes
            trechos={trechos}
            carregando={carregando}
            onAtualizarTrechos={carregarTrechos}
          />          

          <ParadasRecentes
            paradas={paradas}
            carregandoParadas={carregandoParadas}
            onAtualizarParada={carregarParadas}
          />

          <div className='container'>
            <button className='botao-principal' onClick={handleDiario}><File />Diário de Bordo</button>
            {onDiario && <Diario />}
          </div>          
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
