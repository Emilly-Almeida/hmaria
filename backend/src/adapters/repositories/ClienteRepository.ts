import { Cliente } from "../../entities/Cliente";

export class ClienteRepository {
  private clientes: Cliente[] = [];

  salvar(cliente: Cliente) {
    this.clientes.push(cliente);
    return cliente;
  }

  listar() {
    return this.clientes;
  }

  buscarPorId(id: string) {
    return this.clientes.find(cliente => cliente.id === id);
  }
}