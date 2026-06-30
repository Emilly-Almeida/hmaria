export async function buscarClientes() {
  const resposta = await fetch("http://localhost:3000/clientes");
  return resposta.json();
}