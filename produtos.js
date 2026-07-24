import { supabase } from "./firebase.js";

let produtos = [];

function gerarCodigo(categoria) {

    let ultimo = 1;

    produtos.forEach((produto) => {
        if (produto.categoria === categoria) {
            ultimo++;
        }
    });

    return categoria + "-" + String(ultimo).padStart(4, "0");
}

async function carregarProdutos() {

    const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
    console.error(error);
    alert(
        "Código: " + error.code +
        "\nMensagem: " + error.message +
        "\nDetalhes: " + error.details +
        "\nHint: " + error.hint
    );
    return;
}  

    produtos = data || [];

    mostrarProdutos();
}

async function adicionarProduto() {

    let nome = document.getElementById("nome").value;
    let categoria = document.getElementById("categoria").value;
    let precoCompra = Number(document.getElementById("precoCompra").value);
    let preco = Number(document.getElementById("preco").value);
    let quantidade = Number(document.getElementById("quantidade").value);
    let cor = document.getElementById("cor").value;
    let origem = document.getElementById("origem").value;
    let giga = document.getElementById("giga").value;

    if (nome === "" || preco <= 0 || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const produto = {

        codigo: gerarCodigo(categoria),
        nome,
        categoria,
        preco_compra: precoCompra,
        preco,
        quantidade,
        cor,
        origem,
        giga

    };

    const { error } = await supabase
        .from("produtos")
        .insert([produto]);

        if (error) {
    console.error(error);
    alert(
        "Código: " + error.code +
        "\nMensagem: " + error.message +
        "\nDetalhes: " + error.details +
        "\nHint: " + error.hint
    );
    return;
}

    carregarProdutos();

    document.getElementById("nome").value = "";
    document.getElementById("precoCompra").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("cor").value = "";
    document.getElementById("origem").value = "";
    document.getElementById("giga").value = "";
}
function mostrarProdutos() {

    let tabela = document.getElementById("listaProdutos");

    tabela.innerHTML = "";

    let pesquisa = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    let totalItens = 0;
    let valorEstoque = 0;
    let estoqueBaixo = 0;

    produtos.forEach((produto) => {

        if (
            !produto.nome.toLowerCase().includes(pesquisa) &&
            !produto.codigo.toLowerCase().includes(pesquisa)
        ) {
            return;
        }

        totalItens += Number(produto.quantidade);
        valorEstoque += Number(produto.preco) * Number(produto.quantidade);

        if (produto.quantidade <= 5) {
            estoqueBaixo++;
        }

        tabela.innerHTML += `
        <tr>
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>R$ ${Number(produto.preco_compra).toFixed(2)}</td>
            <td>R$ ${Number(produto.preco).toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.cor}</td>
            <td>${produto.origem}</td>
            <td>${produto.giga}</td>
            <td>
                <button onclick="excluirProduto(${produto.id})">
                    🗑 Excluir
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("totalProdutos").innerHTML = produtos.length;
    document.getElementById("totalItens").innerHTML = totalItens;
    document.getElementById("valorEstoque").innerHTML =
        "R$ " + valorEstoque.toFixed(2);
    document.getElementById("estoqueBaixo").innerHTML = estoqueBaixo;
}

async function excluirProduto(id) {

    if (!confirm("Deseja excluir este produto?")) {
        return;
    }

    const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error);
        alert("Erro ao excluir produto.");
        return;
    }

    carregarProdutos();
}

window.adicionarProduto = adicionarProduto;
window.excluirProduto = excluirProduto;
window.mostrarProdutos = mostrarProdutos;

carregarProdutos();