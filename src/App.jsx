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

function App() {
  const [selected, setSelected] = useState(''); 
  
  const { trechos,carregando,carregarTrechos} = useTrechoRecentes();
  const online = useOnlineStatus(carregarTrechos);
  
  const handleSelectChange = (value) => {
    setSelected(value);
  };

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
        <TrechosRecentes 
      trechos={trechos}
      carregando={carregando}
      />
      )}
      
      {!online && selected === '' && (
         <p className="offline-msg">Sem conexão — dados recentes indisponíveis</p>
      )}
      <Footer />
    </>
  );
}

export default App
