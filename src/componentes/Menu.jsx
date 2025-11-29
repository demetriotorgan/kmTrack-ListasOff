import React from 'react'

const Menu = ({onChangeOption}) => {
    const handleChange = (e) => {
    onChangeOption(e.target.value)
  }
  return (
    <div className='container'>
        <select onChange={handleChange}>
            <option value="">Selecione uma opção</option>
            <option value="trecho">Trecho</option>
            <option value="parada">Parada</option>
            <option value="pedagio">Pedágio</option>
            <option value="abastecimento">Abastecimento</option>
        </select>
    </div>
  )
}

export default Menu