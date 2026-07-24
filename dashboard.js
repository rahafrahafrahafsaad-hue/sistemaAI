// ===============================
// SISTEMA AI - DASHBOARD JS
// ===============================

import { supabase } from "./firebase.js";

let produtos = [];
let vendas = [];
let clientes = [];
let fornecedores = [];

// CARREGAR DADOS

async function carregarDados(){

    const produtosBanco = await supabase
        .from("produtos")
        .select("*");


    const vendasBanco = await supabase
        .from("vendas")
        .select("*");


    const clientesBanco = await supabase
        .from("clientes")
        .select("*");


    const fornecedoresBanco = await supabase
        .from("fornecedores")
        .select("*");



    produtos = produtosBanco.data || [];

    vendas = vendasBanco.data || [];

    clientes = clientesBanco.data || [];

    fornecedores = fornecedoresBanco.data || [];

}

// ATUALIZAR CARDS

async function atualizarDashboard(){

await carregarDados();
    let faturamento = 0;

    let lucro = 0;

    let valorEstoque = 0;

    let estoqueBaixo = 0;



    produtos.forEach(produto=>{


        let preco = Number(produto.preco) || 0;

        let quantidade = Number(produto.quantidade) || 0;



        valorEstoque += preco * quantidade;



        if(quantidade <= 5){

            estoqueBaixo++;

        }


    });



    vendas.forEach(venda=>{


        faturamento += Number(venda.valor) || 0;


        lucro += Number(venda.lucro) || 0;


    });



    document.getElementById("faturamento").innerHTML =
    "R$ " + faturamento.toFixed(2);



    document.getElementById("lucro").innerHTML =
    "R$ " + lucro.toFixed(2);



    document.getElementById("estoque").innerHTML =
    "R$ " + valorEstoque.toFixed(2);



    document.getElementById("vendas").innerHTML =
    vendas.length;



    document.getElementById("clientes").innerHTML =
    clientes.length;



    document.getElementById("fornecedores").innerHTML =
    fornecedores.length;



    document.getElementById("produtos").innerHTML =
    produtos.length;



    document.getElementById("baixo").innerHTML =
    estoqueBaixo;


}
// ===============================
// GRÁFICOS
// ===============================


let graficoVendas;

let graficoProdutos;

let graficoLucro;



async function criarGraficos(){


    await carregarDados();



    if(graficoVendas){

        graficoVendas.destroy();

    }


    if(graficoProdutos){

        graficoProdutos.destroy();

    }


    if(graficoLucro){

        graficoLucro.destroy();

    }



    // -------- VENDAS --------


    let datas = [];

    let valores = [];



    vendas.forEach(venda=>{


        datas.push(venda.data || "Venda");


        valores.push(
            Number(venda.valor) || 0
        );


    });



    graficoVendas = new Chart(

        document.getElementById("graficoVendas"),

        {

            type:"line",

            data:{


                labels:datas,


                datasets:[{

                    label:"Faturamento",

                    data:valores,

                    borderWidth:3

                }]

            }

        }

    );




    // -------- PRODUTOS --------


    let nomes = [];

    let quantidades = [];



    produtos.forEach(produto=>{


        nomes.push(produto.nome);


        quantidades.push(
            Number(produto.quantidade) || 0
        );


    });



    graficoProdutos = new Chart(

        document.getElementById("graficoProdutos"),

        {

            type:"bar",


            data:{


                labels:nomes,


                datasets:[{

                    label:"Estoque",

                    data:quantidades,

                    borderWidth:2

                }]

            }

        }

    );





    // -------- LUCRO --------


    let datasLucro = [];

    let valoresLucro = [];



    vendas.forEach(venda=>{


        datasLucro.push(
            venda.data || "Venda"
        );


        valoresLucro.push(
            Number(venda.lucro) || 0
        );


    });



    graficoLucro = new Chart(

        document.getElementById("graficoLucro"),

        {

            type:"line",


            data:{


                labels:datasLucro,


                datasets:[{

                    label:"Lucro",

                    data:valoresLucro,

                    borderWidth:3

                }]

            }

        }

    );


}
// ===============================
// IA DE AVISOS
// ===============================


async function analisarIA(){


    await carregarDados();

    let aviso = document.getElementById("avisoIA");


    if(!aviso) return;



    let baixos = produtos.filter(produto =>

        Number(produto.quantidade) <= 5

    );



    if(baixos.length > 0){


        aviso.innerHTML =

        "⚠️ Atenção! " +

        baixos.length +

        " produto(s) estão com estoque baixo.";


    }else{


        aviso.innerHTML =

        "✅ Estoque saudável. Nenhum alerta encontrado.";


    }


}





// ===============================
// RELATÓRIO
// ===============================


function gerarRelatorio(){


    carregarDados();


    let faturamento = 0;

    let lucro = 0;



    vendas.forEach(venda=>{


        faturamento += Number(venda.valor) || 0;


        lucro += Number(venda.lucro) || 0;


    });



    let area = document.getElementById("relatorio");



    if(area){


        area.innerHTML = `


<h3>📊 Relatório Geral</h3>


<p>📦 Produtos: ${produtos.length}</p>


<p>🛒 Vendas: ${vendas.length}</p>


<p>👥 Clientes: ${clientes.length}</p>


<p>🚚 Fornecedores: ${fornecedores.length}</p>


<p>💰 Faturamento: R$ ${faturamento.toFixed(2)}</p>


<p>📈 Lucro: R$ ${lucro.toFixed(2)}</p>


`;

    }


}




// ===============================
// INICIAR SISTEMA
// ===============================


window.onload = async function(){


    await atualizarDashboard();


    await criarGraficos();


    await analisarIA();


};



// Atualização automática

setInterval(async ()=>{


    await atualizarDashboard();


    await criarGraficos();


    await analisarIA();


},5000);