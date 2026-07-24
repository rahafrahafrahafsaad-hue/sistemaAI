import { supabase } from "./firebase.js";


// ===============================
// SISTEMA AI - LOGIN JS
// ===============================


async function entrar() {


    let email = document
        .getElementById("usuario")
        .value;


    let senha = document
        .getElementById("senha")
        .value;



    if(email === "" || senha === ""){

        alert("Preencha todos os campos.");

        return;

    }



    const { data, error } = await supabase.auth
        .signInWithPassword({

            email: email,

            password: senha

        });



    if(error){

        console.log(error);

        alert("Usuário ou senha incorretos.");

        return;

    }



    // Usuário logado


    window.location.href = "dashboard.html";


}



// liberar para o botão HTML

window.entrar = entrar;