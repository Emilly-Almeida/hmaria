import type { Venda } from "../../entities/Venda";

export type ProjecaoMensal = {
  mes: string;
  previsto: number;
  pago: number;
  pendente: number;
  quantidadeParcelas: number;
};

export function gerarProjecao(vendas: Venda[]): ProjecaoMensal[] {
  const mapa: Record<string, ProjecaoMensal> = {};

  vendas.forEach((venda) => {
    venda.parcelas.forEach((parcela) => {
      const mes = parcela.vencimento.slice(0, 7);

      if (!mapa[mes]) {
        mapa[mes] = {
          mes,
          previsto: 0,
          pago: 0,
          pendente: 0,
          quantidadeParcelas: 0,
        };
      }

      mapa[mes].previsto += parcela.valor;
      mapa[mes].quantidadeParcelas += 1;

      if (parcela.status === "PAGA") {
        mapa[mes].pago += parcela.valor;
      } else {
        mapa[mes].pendente += parcela.valor;
      }
    });
  });

  return Object.values(mapa).sort((a, b) => a.mes.localeCompare(b.mes));
}