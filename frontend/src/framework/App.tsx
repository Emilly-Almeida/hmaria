import { useEffect, useMemo, useState } from "react";
import type { Cliente } from "../entities/Cliente";
import type { Produto } from "../entities/Produto";
import type { Venda } from "../entities/Venda";
import { LocalStorageRepository } from "../adapters/repositories/LocalStorageRepository";
import { gerarLinkWhatsApp } from "../adapters/services/WhatsappService";
import { registrarVenda } from "../usecases/venda/RegistrarVenda";
import { marcarParcelaComoPaga } from "../usecases/financeiro/MarcarParcelaComoPaga";
import { obterResumoFinanceiro } from "../usecases/financeiro/ObterResumoFinanceiro";
import { gerarProjecao } from "../usecases/projecao/GerarProjecao";
import { listarParcelasVencidas } from "../usecases/inadimplencia/ListarParcelasVencidas";
import "./App.css";

function dinheiro(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function App() {
  const [aba, setAba] = useState("dashboard");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const [clienteForm, setClienteForm] = useState({
    nomeCompleto: "",
    telefone: "",
    email: "",
  });

  const [produtoForm, setProdutoForm] = useState({
    codigoHmaria: "",
    nome: "",
    categoria: "Normal",
    preco: "",
  });

  const [vendaForm, setVendaForm] = useState({
    clienteId: "",
    produtoId: "",
    teveEntrada: "nao",
    valorEntrada: "",
    quantidadeParcelas: "3",
    primeiroVencimento: "",
  });

  useEffect(() => {
    setClientes(LocalStorageRepository.buscarClientes());
    setProdutos(LocalStorageRepository.buscarProdutos());
    setVendas(LocalStorageRepository.buscarVendas());
  }, []);

  useEffect(() => {
    LocalStorageRepository.salvarClientes(clientes);
  }, [clientes]);

  useEffect(() => {
    LocalStorageRepository.salvarProdutos(produtos);
  }, [produtos]);

  useEffect(() => {
    LocalStorageRepository.salvarVendas(vendas);
  }, [vendas]);

  const resumo = useMemo(() => obterResumoFinanceiro(vendas), [vendas]);

  const projecao = useMemo(() => gerarProjecao(vendas), [vendas]);

  const inadimplentes = useMemo(
    () => listarParcelasVencidas(vendas),
    [vendas]
  );

  const todasParcelas = vendas.flatMap((venda) =>
    venda.parcelas.map((parcela) => ({
      venda,
      parcela,
    }))
  );

  function cadastrarCliente() {
    if (
      !clienteForm.nomeCompleto ||
      !clienteForm.telefone ||
      !clienteForm.email
    ) {
      alert("Preencha nome completo, telefone e e-mail.");
      return;
    }

    const novoCliente: Cliente = {
      id: crypto.randomUUID(),
      nomeCompleto: clienteForm.nomeCompleto,
      telefone: clienteForm.telefone,
      email: clienteForm.email,
    };

    setClientes([...clientes, novoCliente]);

    setClienteForm({
      nomeCompleto: "",
      telefone: "",
      email: "",
    });
  }

  function cadastrarProduto() {
    if (!produtoForm.codigoHmaria || !produtoForm.nome || !produtoForm.preco) {
      alert("Preencha código HMaria, nome e preço.");
      return;
    }

    const novoProduto: Produto = {
      id: crypto.randomUUID(),
      codigoHmaria: produtoForm.codigoHmaria,
      nome: produtoForm.nome,
      categoria: produtoForm.categoria as Produto["categoria"],
      preco: Number(produtoForm.preco),
      cadastradoHmaria: false,
    };

    setProdutos([...produtos, novoProduto]);

    setProdutoForm({
      codigoHmaria: "",
      nome: "",
      categoria: "Normal",
      preco: "",
    });
  }

  function realizarVenda() {
    const produto = produtos.find((produto) => produto.id === vendaForm.produtoId);

    if (!produto) {
      alert("Selecione uma joia.");
      return;
    }

    const valorEntrada =
      vendaForm.teveEntrada === "sim"
        ? Number(vendaForm.valorEntrada || 0)
        : 0;

    try {
      const novaVenda = registrarVenda({
        clienteId: vendaForm.clienteId,
        produtoId: vendaForm.produtoId,
        valorTotal: produto.preco,
        valorEntrada,
        quantidadeParcelas: Number(vendaForm.quantidadeParcelas),
        primeiroVencimento: vendaForm.primeiroVencimento,
      });

      setVendas([...vendas, novaVenda]);

      setVendaForm({
        clienteId: "",
        produtoId: "",
        teveEntrada: "nao",
        valorEntrada: "",
        quantidadeParcelas: "3",
        primeiroVencimento: "",
      });
    } catch (erro) {
      alert((erro as Error).message);
    }
  }

  function pagarParcela(parcelaId: string) {
    const vendasAtualizadas = marcarParcelaComoPaga(vendas, parcelaId);
    setVendas(vendasAtualizadas);
  }

  function sincronizarHmaria() {
    const produtosAtualizados = produtos.map((produto) => ({
      ...produto,
      cadastradoHmaria: true,
    }));

    setProdutos(produtosAtualizados);
    alert("Produtos sincronizados com o controle HMaria.");
  }

  function buscarCliente(id: string) {
    return clientes.find((cliente) => cliente.id === id);
  }

  function buscarProduto(id: string) {
    return produtos.find((produto) => produto.id === id);
  }

  return (
    <main className="container">
      <header className="topo">
        <p className="tag">Sistema de Gestão</p>
        <h1>HMaria Joias</h1>
        <p>Controle de clientes, joias, vendas parceladas e cobranças.</p>
      </header>

      <nav className="menu">
        <button onClick={() => setAba("dashboard")}>Dashboard</button>
        <button onClick={() => setAba("clientes")}>Clientes</button>
        <button onClick={() => setAba("produtos")}>Joias</button>
        <button onClick={() => setAba("vendas")}>Vendas</button>
        <button onClick={() => setAba("financeiro")}>Financeiro</button>
        <button onClick={() => setAba("inadimplencia")}>Inadimplência</button>
        <button onClick={() => setAba("projecao")}>Projeção</button>
        <button onClick={() => setAba("hmaria")}>Sync HMaria</button>
      </nav>

      {aba === "dashboard" && (
        <section>
          <h2>Dashboard administrativo</h2>

          <div className="cards">
            <div className="card">
              <span>Total vendido</span>
              <strong>{dinheiro(resumo.totalVendido)}</strong>
            </div>

            <div className="card">
              <span>Recebido</span>
              <strong>{dinheiro(resumo.totalRecebido)}</strong>
            </div>

            <div className="card">
              <span>A receber</span>
              <strong>{dinheiro(resumo.totalAReceber)}</strong>
            </div>

            <div className="card alerta">
              <span>Parcelas vencidas</span>
              <strong>{inadimplentes.length}</strong>
            </div>
          </div>
        </section>
      )}

      {aba === "clientes" && (
        <section>
          <h2>Cadastro de clientes</h2>

          <div className="form">
            <input
              placeholder="Nome completo"
              value={clienteForm.nomeCompleto}
              onChange={(e) =>
                setClienteForm({
                  ...clienteForm,
                  nomeCompleto: e.target.value,
                })
              }
            />

            <input
              placeholder="Telefone"
              value={clienteForm.telefone}
              onChange={(e) =>
                setClienteForm({
                  ...clienteForm,
                  telefone: e.target.value,
                })
              }
            />

            <input
              placeholder="E-mail"
              value={clienteForm.email}
              onChange={(e) =>
                setClienteForm({
                  ...clienteForm,
                  email: e.target.value,
                })
              }
            />

            <button onClick={cadastrarCliente}>Cadastrar cliente</button>
          </div>

          <div className="lista">
            {clientes.map((cliente) => (
              <div className="item" key={cliente.id}>
                <strong>{cliente.nomeCompleto}</strong>
                <span>Telefone: {cliente.telefone}</span>
                <span>E-mail: {cliente.email}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {aba === "produtos" && (
        <section>
          <h2>Cadastro de joias</h2>

          <div className="form">
            <input
              placeholder="Código HMaria"
              value={produtoForm.codigoHmaria}
              onChange={(e) =>
                setProdutoForm({
                  ...produtoForm,
                  codigoHmaria: e.target.value,
                })
              }
            />

            <input
              placeholder="Nome da joia"
              value={produtoForm.nome}
              onChange={(e) =>
                setProdutoForm({
                  ...produtoForm,
                  nome: e.target.value,
                })
              }
            />

            <select
              value={produtoForm.categoria}
              onChange={(e) =>
                setProdutoForm({
                  ...produtoForm,
                  categoria: e.target.value,
                })
              }
            >
              <option>Normal</option>
              <option>Prime</option>
              <option>Relógio</option>
            </select>

            <input
              type="number"
              placeholder="Preço"
              value={produtoForm.preco}
              onChange={(e) =>
                setProdutoForm({
                  ...produtoForm,
                  preco: e.target.value,
                })
              }
            />

            <button onClick={cadastrarProduto}>Cadastrar joia</button>
          </div>

          <div className="lista">
            {produtos.map((produto) => (
              <div className="item" key={produto.id}>
                <strong>{produto.nome}</strong>
                <span>Código HMaria: {produto.codigoHmaria}</span>
                <span>Categoria: {produto.categoria}</span>
                <span>Preço: {dinheiro(produto.preco)}</span>
                <span>
                  Status HMaria:{" "}
                  {produto.cadastradoHmaria ? "Cadastrado" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {aba === "vendas" && (
        <section>
          <h2>Realizar venda</h2>

          <p className="explicacao">
            A data informada abaixo é a data em que a cliente vai pagar a
            primeira parcela.
          </p>

          <div className="form">
            <select
              value={vendaForm.clienteId}
              onChange={(e) =>
                setVendaForm({
                  ...vendaForm,
                  clienteId: e.target.value,
                })
              }
            >
              <option value="">Selecione a cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nomeCompleto}
                </option>
              ))}
            </select>

            <select
              value={vendaForm.produtoId}
              onChange={(e) =>
                setVendaForm({
                  ...vendaForm,
                  produtoId: e.target.value,
                })
              }
            >
              <option value="">Selecione a joia</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - {dinheiro(produto.preco)}
                </option>
              ))}
            </select>

            <select
              value={vendaForm.teveEntrada}
              onChange={(e) =>
                setVendaForm({
                  ...vendaForm,
                  teveEntrada: e.target.value,
                  valorEntrada: e.target.value === "nao" ? "" : vendaForm.valorEntrada,
                })
              }
            >
              <option value="nao">Não teve entrada</option>
              <option value="sim">Teve entrada</option>
            </select>

            {vendaForm.teveEntrada === "sim" && (
              <input
                type="number"
                placeholder="Valor da entrada"
                value={vendaForm.valorEntrada}
                onChange={(e) =>
                  setVendaForm({
                    ...vendaForm,
                    valorEntrada: e.target.value,
                  })
                }
              />
            )}

            <input
              type="number"
              placeholder="Quantidade de parcelas restantes"
              value={vendaForm.quantidadeParcelas}
              onChange={(e) =>
                setVendaForm({
                  ...vendaForm,
                  quantidadeParcelas: e.target.value,
                })
              }
            />

            <label className="campo-data">
              Data da primeira parcela
              <input
                type="date"
                value={vendaForm.primeiroVencimento}
                onChange={(e) =>
                  setVendaForm({
                    ...vendaForm,
                    primeiroVencimento: e.target.value,
                  })
                }
              />
            </label>

            <button onClick={realizarVenda}>Registrar venda</button>
          </div>

          <div className="lista">
            {vendas.map((venda) => {
              const cliente = buscarCliente(venda.clienteId);
              const produto = buscarProduto(venda.produtoId);

              return (
                <div className="item" key={venda.id}>
                  <strong>{cliente?.nomeCompleto}</strong>
                  <span>Joia: {produto?.nome}</span>
                  <span>Total da venda: {dinheiro(venda.valorTotal)}</span>
                  <span>Entrada recebida: {dinheiro(venda.valorEntrada)}</span>
                  <span>
                    Valor parcelado: {dinheiro(venda.valorParcelado)}
                  </span>
                  <span>
                    Parcelamento: {venda.quantidadeParcelas}x
                  </span>
                  <span>
                    Primeira parcela: {venda.primeiroVencimento}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {aba === "financeiro" && (
        <section>
          <h2>Controle financeiro</h2>

          <div className="cards">
            <div className="card">
              <span>Entradas recebidas</span>
              <strong>{dinheiro(resumo.totalEntradasRecebidas)}</strong>
            </div>

            <div className="card">
              <span>Parcelas pagas</span>
              <strong>{dinheiro(resumo.totalParcelasPagas)}</strong>
            </div>

            <div className="card">
              <span>Total recebido</span>
              <strong>{dinheiro(resumo.totalRecebido)}</strong>
            </div>

            <div className="card">
              <span>Ainda a receber</span>
              <strong>{dinheiro(resumo.totalAReceber)}</strong>
            </div>
          </div>

          <h3>Parcelas das vendas</h3>

          <div className="lista">
            {todasParcelas.map(({ venda, parcela }) => {
              const cliente = buscarCliente(venda.clienteId);
              const produto = buscarProduto(venda.produtoId);

              return (
                <div className="item" key={parcela.id}>
                  <strong>
                    {cliente?.nomeCompleto} - Parcela {parcela.numero}
                  </strong>
                  <span>Joia: {produto?.nome}</span>
                  <span>Valor: {dinheiro(parcela.valor)}</span>
                  <span>Vencimento: {parcela.vencimento}</span>
                  <span>Status: {parcela.status}</span>

                  {parcela.status === "PENDENTE" && (
                    <button onClick={() => pagarParcela(parcela.id)}>
                      Marcar como paga
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {aba === "inadimplencia" && (
        <section>
          <h2>Controle de inadimplência</h2>

          {inadimplentes.length === 0 && (
            <p>Nenhuma parcela vencida e pendente no momento.</p>
          )}

          <div className="lista">
            {inadimplentes.map(({ venda, parcela }) => {
              const cliente = buscarCliente(venda.clienteId);
              const produto = buscarProduto(venda.produtoId);

              const mensagem = `Olá, ${cliente?.nomeCompleto}! Tudo bem? Estou passando para lembrar da parcela ${parcela.numero} da joia ${produto?.nome}, no valor de ${dinheiro(parcela.valor)}, vencida em ${parcela.vencimento}.`;

              return (
                <div className="item vencido" key={parcela.id}>
                  <strong>{cliente?.nomeCompleto}</strong>
                  <span>Joia: {produto?.nome}</span>
                  <span>Parcela: {parcela.numero}</span>
                  <span>Valor: {dinheiro(parcela.valor)}</span>
                  <span>Vencimento: {parcela.vencimento}</span>

                  <a
                    href={gerarLinkWhatsApp(cliente?.telefone || "", mensagem)}
                    target="_blank"
                  >
                    Cobrar pelo WhatsApp
                  </a>

                  <button onClick={() => pagarParcela(parcela.id)}>
                    Marcar como paga
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {aba === "projecao" && (
        <section>
          <h2>Projeção de recebimentos</h2>

          <div className="lista">
            {projecao.map((item) => (
              <div className="item" key={item.mes}>
                <strong>{item.mes}</strong>
                <span>Valor previsto: {dinheiro(item.previsto)}</span>
                <span>Já pago: {dinheiro(item.pago)}</span>
                <span>Pendente: {dinheiro(item.pendente)}</span>
                <span>Parcelas no mês: {item.quantidadeParcelas}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {aba === "hmaria" && (
        <section>
          <h2>Sync com sistema HMaria</h2>

          <p className="explicacao">
            Essa área simula a conferência das joias cadastradas no controle da
            HMaria.
          </p>

          <button onClick={sincronizarHmaria}>Sincronizar produtos</button>

          <div className="lista">
            {produtos.map((produto) => (
              <div className="item" key={produto.id}>
                <strong>{produto.nome}</strong>
                <span>Código HMaria: {produto.codigoHmaria}</span>
                <span>
                  Status:{" "}
                  {produto.cadastradoHmaria
                    ? "Cadastrado na HMaria"
                    : "Pendente de cadastro"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}