import { File, Trash2 } from 'lucide-react'
import '../style/Diario.css';
import { useSalvarDiario } from '../hooks/useSalvarDiario';
import ModalCarregamento from './ModalCarregamento';
import { useCarregarDiario } from '../hooks/useCarregarDiario';
import { useExcluirDiario } from '../hooks/useExcluirDiario';

const Diario = () => {
    const { loading, diarios, carregarDiario } = useCarregarDiario();
    const { titulo, setTitulo, texto, setTexto, data, setData, handleSalvarDiario,salvando } = useSalvarDiario({ carregarDiario });
    const {excluindo, handleExcluir} = useExcluirDiario({carregarDiario});

    return (
        <>
            <div>
                <label>
                    Titulo
                    <input
                        type='text'
                        name='titulo'
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </label>
                <label>
                    Texto
                    <textarea
                        name='texto'
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        rows='10'
                        cols='50'
                        maxLength={500} />
                </label>
                <label>
                    Data
                    <input
                        type='date'
                        name='data'
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </label>

                <button className='botao-atencao' onClick={handleSalvarDiario}>Salvar</button>
            </div>

            <div className="diario">
                {(loading || excluindo || salvando) && <ModalCarregamento label="Carregando" />}
                <h2>Diários Salvos</h2>

                {Array.isArray(diarios) && diarios.map((item, index) => (
                    <div className="diario-card" key={item._id || index}>
                        <h3 className="diario-title">{item.titulo}</h3>
                        <p className="diario-texto">{item.texto}</p>

                        <div className="diario-footer">
                            <small className="diario-data">
                                {new Date(item.data).toLocaleDateString("pt-BR")}
                            </small>

                            <button
                                className="botao-excluir"
                                onClick={() => handleExcluir(item)}
                            >
                                Excluir <Trash2 />
                            </button>
                        </div>
                    </div>

                ))}
            </div>

        </>
    )
}

export default Diario