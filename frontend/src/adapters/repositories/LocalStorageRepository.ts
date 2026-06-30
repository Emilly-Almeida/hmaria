import type { Cliente } from "../../entities/Cliente";
import type { Produto } from "../../entities/Produto";
import type { Venda } from "../../entities/Venda";

const CLIENTES_KEY = "hmaria_clientes";
const PRODUTOS_KEY = "hmaria_produtos";
const VENDAS_KEY = "hmaria_vendas";

export const LocalStorageRepository = {
  buscarClientes(): Cliente[] {
    return JSON.parse(localStorage.getItem(CLIENTES_KEY) || "[]");
  },

  salvarClientes(clientes: Cliente[]) {
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
  },

  buscarProdutos(): Produto[] {
    return JSON.parse(localStorage.getItem(PRODUTOS_KEY) || "[]");
  },

  salvarProdutos(produtos: Produto[]) {
    localStorage.setItem(PRODUTOS_KEY, JSON.stringify(produtos));
  },

  buscarVendas(): Venda[] {
    return JSON.parse(localStorage.getItem(VENDAS_KEY) || "[]");
  },

  salvarVendas(vendas: Venda[]) {
    localStorage.setItem(VENDAS_KEY, JSON.stringify(vendas));
  },
};