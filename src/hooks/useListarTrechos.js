import { useEffect, useState } from "react";
import api from "../api/api";

export function useListarTrechos() {
    const [listarTrechos, setListarTrechos] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const carregarTrechos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/listar-trechos');
            setListarTrechos(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarTrechos();
    }, [])

    return {
        listarTrechos,
        setListarTrechos,
        carregando
    }
}