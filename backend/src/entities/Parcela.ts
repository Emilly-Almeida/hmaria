export class Parcela {
  constructor(
    public id: string,
    public vendaId: string,
    public numero: number,
    public valor: number,
    public vencimento: Date,
    public pago: boolean = false
  ) {}

  validar() {
    if (this.valor <= 0) throw new Error("Parcela inválida");
  }
}