import type { Venda } from "../../entities/Venda";

export function listarParcelasVencidas(vendas: Venda[]) {
  const hoje = new Date().toISOString().slice(0, 10);

  return vendas
    .flatMap((venda) =>
      venda.parcelas.map((parcela) => ({
        venda,
        parcela,
      }))
    )
    .filter(
      (item) =>
        item.parcela.status === "PENDENTE" &&
        item.parcela.vencimento < hoje
    );
}