export async function atualizarCliente(id: string, cliente: any) {
  const resposta = await fetch(`http://localhost:3000/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  return resposta.json();
}