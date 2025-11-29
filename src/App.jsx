import { useState } from 'react'
import './App.css'
import Abastecimento from './componentes/Abastecimento'
import Footer from './componentes/Footer'
import Menu from './componentes/Menu'
import NavBar from './componentes/NavBar'
import Parada from './componentes/Parada'
import Pedagio from './componentes/Pedagio'
import Trecho from './componentes/Trecho'


function App() {
  const [selected, setSelected] = useState('');

  const handleSelectChange = (value) =>{
    setSelected(value);
  }

  return (
    <>
      <NavBar />     
      <Menu onChangeOption = {handleSelectChange} /> 
      {selected === 'trecho' && <Trecho />}
      {selected === 'parada' && <Parada />}
      {selected === 'pedagio' && <Pedagio />}
      {selected === 'abastecimento' && <Abastecimento />}
      <Footer />    
    </>
  )
}

export default App
