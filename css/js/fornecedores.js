import { supabase } from "./firebase.js";


// ===============================
// SISTEMA AI - FORNECEDORES JS
// ===============================


let fornecedores = [];



// ===============================
// CARREGAR FORNECEDORES
// ===============================


async function carregarFornecedores(){


    const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("id",{ascending:true});



    if(error){

        console.log(error);
        alert("Erro ao carregar fornecedores");
        return;

    }



    fornecedores = data || [];


    mostrarFornecedores();

}





// ===============================
// ADICIONAR FORNECEDOR
// ===============================


async function adicionarFornecedor(){


    let nome =
    document.getElementById("nome").value;


    let telefone =
    document.getElementById("telefone").value;


    let email =
    document.getElementById("email").value;


    let cidade =
    document.getElementById("cidade").value;



    if(nome==""){

        alert("Digite o nome da empresa.");
        return;

    }



    const { error } = await supabase
        .from("fornecedores")
        .insert([{

            nome,
            telefone,
            email,
            cidade

        }]);



    if(error){

        console.log(error);
        alert("Erro ao cadastrar fornecedor");
        return;

    }



    carregarFornecedores();



    document.getElementById("nome").value="";
    document.getElementById("telefone").value="";
    document.getElementById("email").value="";
    document.getElementById("cidade").value="";


}





// ===============================
// MOSTRAR FORNECEDORES
// ===============================


function mostrarFornecedores(){


    let tabela =
    document.getElementById("listaFornecedores");



    if(!tabela) return;



    tabela.innerHTML="";



    let pesquisa =
    document.getElementById("pesquisa")
    ?.value
    .toLowerCase() || "";



    fornecedores.forEach((fornecedor)=>{


        if(
            pesquisa &&
            !fornecedor.nome.toLowerCase().includes(pesquisa)
        ){

            return;

        }



        tabela.innerHTML += `


<tr>

<td>${fornecedor.nome}</td>

<td>${fornecedor.telefone}</td>

<td>${fornecedor.email}</td>

<td>${fornecedor.cidade}</td>


<td>

<button onclick="excluirFornecedor(${fornecedor.id})">

🗑️

</button>

</td>


</tr>


`;



    });


}





// ===============================
// EXCLUIR FORNECEDOR
// ===============================


async function excluirFornecedor(id){


    if(!confirm("Deseja excluir este fornecedor?")){

        return;

    }



    const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id",id);



    if(error){

        console.log(error);
        alert("Erro ao excluir fornecedor");
        return;

    }



    carregarFornecedores();


}





window.adicionarFornecedor = adicionarFornecedor;

window.excluirFornecedor = excluirFornecedor;



window.onload = function(){

    carregarFornecedores();

};