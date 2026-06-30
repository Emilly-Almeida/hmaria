import type { Venda } from "../../entities/Venda";
import type { Parcela } from "../../entities/Parcela";

type RegistrarVendaInput = {
  clienteId: string;
  produtoId: string;
  valorTotal: number;
  valorEntrada: number;
  quantidadeParcelas: number;
  primeiroVencimento: string;
};

function arredondar(valor: number) {
  return Number(valor.toFixed(2));
}

function adicionarMeses(dataISO: string, meses: number) {
  const data = new Date(`${dataISO}T00:00:00`);
  data.setMonth(data.getMonth() + meses);
  return data.toISOString().slice(0, 10);
}

export function registrarVenda(input: RegistrarVendaInput): Venda {
  if (!input.clienteId) {
    throw new Error("Selecione uma cliente.");
  }

  if (!input.produtoId) {
    throw new Error("Selecione uma joia.");
  }

  if (input.valorTotal <= 0) {
    throw new Error("O valor total da joia precisa ser maior que zero.");
  }

  if (input.valorEntrada < 0) {
    throw new Error("O valor de entrada não pode ser negativo.");
  }

  if (input.valorEntrada > input.valorTotal) {
    throw new Error("A entrada não pode ser maior que o valor total.");
  }

  const valorParcelado = arredondar(input.valorTotal - input.valorEntrada);

  if (valorParcelado > 0 && input.quantidadeParcelas <= 0) {
    throw new Error("Informe a quantidade de parcelas.");
  }

  if (valorParcelado > 0 && !input.primeiroVencimento) {
    throw new Error("Informe a data da primeira parcela.");
  }

  const vendaId = crypto.randomUUID();

  const valorBaseParcela =
    input.quantidadeParcelas > 0
      ? arredondar(valorParcelado / input.quantidadeParcelas)
      : 0;

  const parcelas: Parcela[] = Array.from({
    length: input.quantidadeParcelas,
  }).map((_, index) => {
    const numero = index + 1;

    const valor =
      numero === input.quantidadeParcelas
        ? arredondar(
            valorParcelado - valorBaseParcela * (input.quantidadeParcelas - 1)
          )
        : valorBaseParcela;

    return {
      id: crypto.randomUUID(),
      vendaId,
      numero,
      valor,
      vencimento: adicionarMeses(input.primeiroVencimento, index),
      status: "PENDENTE",
    };
  });

  return {
    id: vendaId,
    clienteId: input.clienteId,
    produtoId: input.produtoId,
    dataVenda: new Date().toISOString().slice(0, 10),
    valorTotal: arredondar(input.valorTotal),
    valorEntrada: arredondar(input.valorEntrada),
    valorParcelado,
    quantidadeParcelas: input.quantidadeParcelas,
    primeiroVencimento: input.primeiroVencimento,
    parcelas,
  };
}