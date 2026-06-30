import { Cliente } from "../../entities/Cliente";
import { ClienteRepository } from "../../adapters/repositories/ClienteRepository";
import { ClienteDTO } from "../../adapters/dto/ClienteDTO";

export class CadastrarCliente {
  constructor(private clienteRepository: ClienteRepository) {}

  executar(dto: ClienteDTO) {
    const cliente = new Cliente(
      crypto.randomUUID(),
      dto.nome,
      dto.telefone,
      dto.limiteCredito ?? 0
    );

    cliente.validar();

    return this.clienteRepository.salvar(cliente);
  }
}