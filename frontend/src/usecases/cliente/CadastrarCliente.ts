export async function cadastrarCliente(cliente: {
  nome: string;
  telefone: string;
  limiteCredito?: number;
}) {
  const resposta = await fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  return resposta.json();
}