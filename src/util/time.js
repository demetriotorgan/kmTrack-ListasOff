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

export function duracaoFormatada(inicio, fim) {
  try {
    if (!inicio) return "Sem horário de partida";
    if (!fim) return "Aguardando finalização";

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    if (isNaN(inicioDate) || isNaN(fimDate)) {
      return "Horários inválidos";
    }

    const diffMs = fimDate - inicioDate;
    if (diffMs < 0) {
      return "Horário inconsistente";
    }

    const diffISO = new Date(diffMs).toISOString();
    const formatado = isoToHHMM(diffISO);

    if (!formatado) return "Duração indisponível";

    return `${formatado} horas`;

  } catch (error) {
    console.warn("Erro ao calcular duração:", error);
    return "Erro ao calcular";
  }
}
