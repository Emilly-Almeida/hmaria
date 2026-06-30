export type CategoriaProduto = "Normal" | "Prime" | "Relógio";

export type Produto = {
  id: string;
  codigoHmaria: string;
  nome: string;
  categoria: CategoriaProduto;
  preco: number;
  cadastradoHmaria: boolean;
};