import React from 'react'
import '../style/Carregando.css'

const Carregando = ({label}) => {
  return (
     <div className="carregando-container">
      <div className="carregando-spinner"></div>
      <span className="carregando-label">{label}</span>
    </div>
  )
}

export default Carregando