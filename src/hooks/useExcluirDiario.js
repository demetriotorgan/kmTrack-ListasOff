import { useState } from "react";
import api from "../api/api";

export function useExcluirDiario({carregarDiario}){
const [excluindo, setExcluindo] = useState(false);

const handleExcluir = async(item)=>{
        const confirmar = window.confirm('Deseja excluir este registro?');
        if(!confirmar) return

        try {
            setExcluindo(true);
            const response = await api.delete(`/deletar-diario/${item._id}`);
            console.log(response.data);
            alert('Registro excluido com sucesso!');
            carregarDiario();
        } catch (error) {
            console.log(error);
        }finally{
            setExcluindo(false);
        }
    };


    return{
        excluindo,
        handleExcluir
    }
}