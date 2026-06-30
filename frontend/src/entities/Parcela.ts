export type StatusParcela = "PENDENTE" | "PAGA";

export type Parcela = {
  id: string;
  vendaId: string;
  numero: number;
  valor: number;
  vencimento: string;
  status: StatusParcela;
  dataPagamento?: string;
};