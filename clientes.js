import { supabase } from "./firebase.js";


// ===============================
// SISTEMA AI - CLIENTES JS
// ===============================


let clientes = [];


// ===============================
// CARREGAR CLIENTES
// ===============================


async function carregarClientes(){

    const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id", { ascending: true });


    if(error){

        console.log(error);
        alert("Erro ao carregar clientes");
        return;

    }


    clientes = data || [];

    console.log("Clientes carregados:", clientes);

    mostrarClientes();

}



// ===============================
// ADICIONAR CLIENTE
// ===============================


async function adicionarCliente(){


    let nome = document.getElementById("nome").value;
    let telefone = document.getElementById("telefone").value;
    let email = document.getElementById("email").value;
    let cidade = document.getElementById("cidade").value;



    if(nome.trim() === ""){

        alert("Digite o nome do cliente.");
        return;

    }



    const { error } = await supabase
        .from("clientes")
        .insert([{

            nome: nome,
            telefone: telefone,
            email: email,
            cidade: cidade

        }]);



    if(error){

        console.log(error);
        alert("Erro ao cadastrar cliente");
        return;

    }



    alert("Cliente cadastrado!");



    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cidade").value = "";



    carregarClientes();

}



// ===============================
// MOSTRAR CLIENTES
// ===============================

function mostrarClientes(){

    let tabela = document.getElementById("listaClientes");

    tabela.innerHTML = "";

    clientes.forEach((cliente)=>{

        tabela.innerHTML += `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.email}</td>
            <td>${cliente.cidade}</td>
            <td>
                <button onclick="excluirCliente(${cliente.id})">
                    🗑️
                </button>
            </td>
        </tr>
        `;

    });

}



// ===============================
// EXCLUIR CLIENTE
// ===============================


async function excluirCliente(id){


    if(!confirm("Deseja excluir este cliente?")){

        return;

    }



    const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);



    if(error){

        console.log(error);
        alert("Erro ao excluir cliente");
        return;

    }



    carregarClientes();


}



// ===============================
// PESQUISA
// ===============================


function pesquisarClientes(){


    let texto = document
    .getElementById("pesquisa")
    .value
    .toLowerCase();



    let filtrados = clientes.filter((cliente)=>{

        return cliente.nome
        .toLowerCase()
        .includes(texto);

    });



    let tabela = document.getElementById("listaClientes");

    tabela.innerHTML = "";



    filtrados.forEach((cliente)=>{


        tabela.innerHTML += `

        <tr>

            <td>${cliente.nome}</td>

            <td>${cliente.telefone}</td>

            <td>${cliente.email}</td>

            <td>${cliente.cidade}</td>


            <td>

                <button onclick="excluirCliente(${cliente.id})">

                🗑️

                </button>

            </td>

        </tr>

        `;


    });


}



// ===============================
// EXPORTAR PARA HTML
// ===============================


window.adicionarCliente = adicionarCliente;

window.excluirCliente = excluirCliente;

window.pesquisarClientes = pesquisarClientes;

window.mostrarClientes = mostrarClientes;

window.onload = function(){

    carregarClientes();

};