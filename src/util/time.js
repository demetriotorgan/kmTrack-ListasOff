// src/util/time.js

// converte ISO (UTC) -> "HH:mm" (horário local)
export function isoToHHMM(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

// converte "HH:mm" 
export function hhmmToIso(hhmm, isoBase = null) {
  if (!hhmm) return null;
  const [hStr, mStr] = hhmm.split(':');
  const hours = Number(hStr);
  const minutes = Number(mStr);

  const base = isoBase ? new Date(isoBase) : new Date();
  base.setHours(hours);
  base.setMinutes(minutes);
  base.setSeconds(0);
  base.setMilliseconds(0);

  return base.toISOString();
}

// converte "YYYY-MM-DD" → ISO (UTC) com hora zero
export function dateToIso(dateStr) {
  if (!dateStr) return null;

  // Garantindo que o formato esteja correto
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);

  // Criando sempre como UTC
  const date = new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0, 0));

  return date.toISOString();
}

// converte ISO → "DD/MM/YYYY"
export function isoToDate(iso) {
  if (!iso) return '';

  const d = new Date(iso);

  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function isoToDateEdit(iso) {
  if (!iso) return '';

  const d = new Date(iso);

  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();

  return `${yyyy}-${mm}-${dd}`;
}

// util/time.js (ou onde você mantém utilitários)
function pad2(n) {
  return n.toString().padStart(2, "0");
}

function minutesToHHMM(totalMinutes) {
  const horas = Math.floor(totalMinutes / 60);
  const minutos = Math.floor(totalMinutes % 60);
  return `${pad2(horas)}:${pad2(minutos)}`;
}

// função principal exportada
export function duracaoFormatada(inicio, fim, distancia) {
  try {
    if (!inicio) return "Sem horário de partida";
    if (!fim) return "Aguardando finalização";

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    if (isNaN(inicioDate) || isNaN(fimDate)) {
      return "Horários inválidos";
    }

    const diffMs = fimDate.getTime() - inicioDate.getTime();
    if (diffMs < 0) {
      return "Horário inconsistente";
    }

    // converte ms -> minutos totais (arredonda para cima/baixo conforme desejar)
    const totalMinutes = Math.floor(diffMs / 1000 / 60); // minutos inteiros
    // Se quiser incluir segundos, pode calcular com Math.round(diffMs/1000/60)

    // Formata hh:mm sem tocar em Date/Timezone
    const hhmm = minutesToHHMM(totalMinutes);

    // Calcular velocidade média se distância válida
    const distanciaNum = Number(distancia);
    if (!Number.isNaN(distanciaNum) && distanciaNum > 0) {
      const horas = diffMs / 1000 / 3600; // ms -> horas (float)
      if (horas > 0) {
        const velocidade = (distanciaNum / horas).toFixed(2);
        return `${hhmm} horas • Velocidade média: ${velocidade} km/h`;
      } else {
        return `${hhmm} horas • Aguardando dados finais do percurso para calcular velocidade`;
      }
    }

    // Apenas duração
    return `${hhmm} horas`;
  } catch (error) {
    console.warn("Erro ao calcular duração:", error);
    return "Erro ao calcular";
  }
}

export function duracaoParada(horaInicio, horaFinal) {
  if (!horaInicio || !horaFinal) return "Dados indisponíveis";

  const inicio = new Date(horaInicio);
  const fim = new Date(horaFinal);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return "Dados indisponíveis";
  }

  let diff = fim - inicio; // diferença em milissegundos

  if (diff < 0) return "Dados indisponíveis"; // evita valores invertidos

  const totalMin = Math.floor(diff / 1000 / 60);
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;

  // Formata HH:MM sempre com 2 dígitos
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}
