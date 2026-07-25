import { supabase } from "./firebase.js";

// ===============================
// SISTEMA AI - VENDAS JS
// ===============================

let produtos = [];

// ===============================
// CARREGAR PRODUTOS
// ===============================

async function carregarProdutosVenda() {

    const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log(error);
        alert("Erro ao carregar produtos");
        return;
    }

    produtos = data || [];

    let select = document.getElementById("produtoVenda");

    if (!select) return;

    select.innerHTML = "";

    produtos.forEach((produto, index) => {

        let option = document.createElement("option");

        option.value = index;

        option.innerHTML =
            produto.nome +
            " - Estoque: " +
            produto.quantidade;

        select.appendChild(option);

    });

}

// ===============================
// REGISTRAR VENDA
// ===============================

async function registrarVenda() {

    let indice = Number(
        document.getElementById("produtoVenda").value
    );

    let quantidade = Number(
        document.getElementById("quantidadeVenda").value
    );

    let pagamento =
        document.getElementById("pagamento").value;

    let produto = produtos[indice];

    if (!produto) {
        alert("Produto não encontrado");
        return;
    }

    if (quantidade <= 0) {
        alert("Quantidade inválida");
        return;
    }

    if (quantidade > produto.quantidade) {
        alert("Estoque insuficiente");
        return;
    }

    let valor =
        Number(produto.preco) * quantidade;

    let lucro =
        (Number(produto.preco) -
        Number(produto.preco_compra)) *
        quantidade;

    // SALVAR VENDA

    const { error } = await supabase
        .from("vendas")
        .insert([{

            nome: produto.nome,
            quantidade: quantidade,
            valor: valor,
            lucro: lucro,
            pagamento: pagamento,
            data: new Date().toISOString()

        }]);

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

    // BAIXAR ESTOQUE

    const { error: erroEstoque } = await supabase
        .from("produtos")
        .update({
            quantidade: produto.quantidade - quantidade
        })
        .eq("id", produto.id);

    if (erroEstoque) {
        console.log(erroEstoque);
        alert("Venda salva, mas erro ao atualizar o estoque.");
        return;
    }

    alert("Venda registrada com sucesso!");

    carregarProdutosVenda();
    mostrarVendas();

}

// ===============================
// MOSTRAR VENDAS
// ===============================

async function mostrarVendas() {

    const { data, error } = await supabase
        .from("vendas")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    let tabela = document.getElementById("listaVendas");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach((venda) => {

        tabela.innerHTML += `
        <tr>
            <td>${venda.nome}</td>
            <td>${venda.quantidade}</td>
            <td>R$ ${Number(venda.valor).toFixed(2)}</td>
            <td>${venda.pagamento}</td>
            <td>
                <button onclick="excluirVenda(${venda.id})">
                    🗑 Excluir
                </button>
            </td>
        </tr>
        `;

    });

}

// ===============================
// EXCLUIR VENDA
// ===============================

async function excluirVenda(id) {

    if (!confirm("Deseja excluir esta venda?")) {
        return;
    }

    const { error } = await supabase
        .from("vendas")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error);
        alert("Erro ao excluir venda");
        return;
    }

    alert("Venda excluída!");

    mostrarVendas();

}

// ===============================
// LIBERAR BOTÕES HTML
// ===============================

window.registrarVenda = registrarVenda;
window.excluirVenda = excluirVenda;

// ===============================
// INICIAR
// ===============================

window.onload = function () {

    carregarProdutosVenda();
    mostrarVendas();

};