import { Body, Controller, Get, Post } from "@nestjs/common";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { CadastrarCliente } from "../../usecases/cliente/CadastrarCliente";
import { ClienteDTO } from "../dto/ClienteDTO";

@Controller("clientes")
export class ClienteController {
  private clienteRepository = new ClienteRepository();
  private cadastrarCliente = new CadastrarCliente(this.clienteRepository);

  @Post()
  cadastrar(@Body() body: ClienteDTO) {
    return this.cadastrarCliente.executar(body);
  }

  @Get()
  listar() {
    return this.clienteRepository.listar();
  }
}