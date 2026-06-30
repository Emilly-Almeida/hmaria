import type { Venda } from "../../entities/Venda";

export function marcarParcelaComoPaga(vendas: Venda[], parcelaId: string) {
  return vendas.map((venda) => ({
    ...venda,
    parcelas: venda.parcelas.map((parcela) =>
      parcela.id === parcelaId
        ? {
            ...parcela,
            status: "PAGA" as const,
            dataPagamento: new Date().toISOString().slice(0, 10),
          }
        : parcela
    ),
  }));
}