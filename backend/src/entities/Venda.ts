import { Parcela } from "./Parcela";

export class Venda {
  constructor(
    public id: string,
    public clienteId: string,
    public produtoId: string,
    public valorTotal: number,
    public quantidadeParcelas: number,
    public data: Date,
    public parcelas: Parcela[] = []
  ) {}

  validar() {
    if (!this.clienteId) throw new Error("Cliente obrigatório");
    if (!this.produtoId) throw new Error("Produto obrigatório");
    if (this.valorTotal <= 0) throw new Error("Valor total inválido");
    if (this.quantidadeParcelas <= 0) throw new Error("Quantidade de parcelas inválida");
  }
}