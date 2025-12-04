export function formatarMoeda(valor) {
  if (valor === undefined || valor === null || isNaN(valor)) {
    return "R$ 0,00";
  }

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
