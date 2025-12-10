import { useEffect, useState } from "react";
import api from "../api/api";


export function useCarregarDiario(){
const [loading, setLoading] = useState(false);
 const [diarios, setDiarios] = useState([]);

 const carregarDiario = async()=>{
        try {
            setLoading(true);
            const response = await api.get('/listar-diario');
            console.log(response.data);
            setDiarios(response.data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        carregarDiario();
    },[]);

    return{
        loading,
        diarios,
        carregarDiario
    }
}