export class Produto {
  constructor(
    public id: string,
    public codigoHmaria: string,
    public nome: string,
    public categoria: string,
    public preco: number
  ) {}

  validar() {
    if (!this.codigoHmaria) throw new Error("Código HMaria é obrigatório");
    if (this.preco <= 0) throw new Error("Preço deve ser maior que zero");
  }
}