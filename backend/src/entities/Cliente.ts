export class Cliente {
  constructor(
    public id: string,
    public nome: string,
    public telefone: string,
    public limiteCredito: number = 0
  ) {}

  validar() {
    if (!this.nome) throw new Error("Nome é obrigatório");
    if (!this.telefone) throw new Error("Telefone é obrigatório");
  }
}