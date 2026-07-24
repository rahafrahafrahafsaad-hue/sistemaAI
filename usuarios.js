import { supabase } from "./firebase.js";


// ===============================
// SISTEMA AI - USUÁRIOS JS
// ===============================


let usuarios = [];



// ===============================
// CARREGAR USUÁRIOS
// ===============================


async function carregarUsuarios(){


    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("id",{ascending:true});



    if(error){

        console.log(error);
        alert("Erro ao carregar usuários");
        return;

    }



    usuarios = data || [];


    mostrarUsuarios();

}




// ===============================
// ADICIONAR USUÁRIO
// ===============================


async function adicionarUsuario(){


    let nome =
    document.getElementById("nome").value;


    let login =
    document.getElementById("login").value;


    let senha =
    document.getElementById("senha").value;


    let cargo =
    document.getElementById("cargo").value;



    if(nome=="" || login=="" || senha==""){

        alert("Preencha todos os campos!");

        return;

    }



    // CRIAR LOGIN NO SUPABASE AUTH


    const { data: authData, error: authError } =
    await supabase.auth.signUp({

        email: login,

        password: senha

    });



    if(authError){

        console.log(authError);

        alert("Erro ao criar usuário");

        return;

    }



    // SALVAR DADOS DO USUÁRIO


    const { error } = await supabase
        .from("usuarios")
        .insert([{

            nome: nome,

            login: login,

            cargo: cargo,

            auth_id: authData.user.id

        }]);



    if(error){

        console.log(error);

        alert("Erro ao salvar usuário");

        return;

    }



    alert("Usuário criado com sucesso!");



    carregarUsuarios();



    document.getElementById("nome").value="";
    document.getElementById("login").value="";
    document.getElementById("senha").value="";
    document.getElementById("cargo").selectedIndex=0;


}





// ===============================
// MOSTRAR USUÁRIOS
// ===============================


function mostrarUsuarios(){


    let tabela =
    document.getElementById("listaUsuarios");



    if(!tabela) return;



    tabela.innerHTML="";



    let pesquisa =
    document.getElementById("pesquisa")
    ?.value
    .toLowerCase() || "";



    usuarios.forEach((usuario)=>{


        if(
            pesquisa &&
            !usuario.nome.toLowerCase().includes(pesquisa) &&
            !usuario.login.toLowerCase().includes(pesquisa)
        ){

            return;

        }



        tabela.innerHTML += `

<tr>

<td>${usuario.nome}</td>

<td>${usuario.login}</td>

<td>${usuario.cargo}</td>


<td>

<button onclick="excluirUsuario(${usuario.id})">
🗑️
</button>


</td>

</tr>

`;



    });


}





// ===============================
// EXCLUIR USUÁRIO
// ===============================


async function excluirUsuario(id){



    if(!confirm("Deseja excluir este usuário?")){

        return;

    }



    const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id",id);



    if(error){

        console.log(error);

        alert("Erro ao excluir usuário");

        return;

    }



    carregarUsuarios();


}





window.adicionarUsuario = adicionarUsuario;

window.excluirUsuario = excluirUsuario;



window.onload = function(){

    carregarUsuarios();

};