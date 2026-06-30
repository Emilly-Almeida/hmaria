import type { Parcela } from "./Parcela";

export type Venda = {
  id: string;
  clienteId: string;
  produtoId: string;

  dataVenda: string;

  valorTotal: number;
  valorEntrada: number;
  valorParcelado: number;

  quantidadeParcelas: number;
  primeiroVencimento: string;

  parcelas: Parcela[];
};