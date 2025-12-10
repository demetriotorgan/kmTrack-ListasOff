import { useState } from "react";
import api from "../api/api";
import { dateToIso, isoToDateEdit } from "../util/time";

export function useSalvarDiario({carregarDiario}) {
    const hojeISO = new Date().toISOString();

    const [titulo, setTitulo] = useState('');
    const [texto, setTexto] = useState('');
    const [data, setData] = useState(isoToDateEdit(hojeISO));

    const handleSalvarDiario = async()=>{        
        const payload = {
            titulo: titulo,
            texto: texto,
            data: dateToIso(data)
        };        

        const confirmar = window.confirm('Deseja salvar este registro?');
        if(!confirmar) return

        try {
            const response = await api.post('/salvar-diario', payload);
            console.log(response.data);
            alert('Registro Salvo com sucesso');
            setTitulo('');
            setTexto('');
            carregarDiario();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        titulo,
        setTitulo,        
        texto,
        setTexto,
        data,
        setData,
        handleSalvarDiario
    }
}