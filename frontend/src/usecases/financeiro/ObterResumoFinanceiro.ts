import type { Venda } from "../../entities/Venda";

export function obterResumoFinanceiro(vendas: Venda[]) {
  const totalVendido = vendas.reduce(
    (soma, venda) => soma + venda.valorTotal,
    0
  );

  const totalEntradasRecebidas = vendas.reduce(
    (soma, venda) => soma + venda.valorEntrada,
    0
  );

  const parcelas = vendas.flatMap((venda) => venda.parcelas);

  const totalParcelasPagas = parcelas
    .filter((parcela) => parcela.status === "PAGA")
    .reduce((soma, parcela) => soma + parcela.valor, 0);

  const totalParcelasPendentes = parcelas
    .filter((parcela) => parcela.status === "PENDENTE")
    .reduce((soma, parcela) => soma + parcela.valor, 0);

  return {
    totalVendido,
    totalEntradasRecebidas,
    totalParcelasPagas,
    totalRecebido: totalEntradasRecebidas + totalParcelasPagas,
    totalAReceber: totalParcelasPendentes,
  };
}