import React from 'react'
import IconeMapa from '../assets/maps.png'
import { Car } from "lucide-react"
import '../style/NavBar.css'

const NavBar = () => {
  return (
     <div className='barra-principal'>
        <div className='barra-icone'>
        <img src={IconeMapa} alt="" />
        </div>
        <div className='barra-titulo'>
         
         <h1>KmTrack <Car /></h1>
         <small>Diário de Bordo</small>
        </div>
        
    </div>
  )
}

export default NavBar