import { supabase } from "./firebase.js";

async function cadastrar() {

    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha
    });

    if (error) {
        alert("Erro: " + error.message);
        console.log(error);
        return;
    }

    alert("Cadastro criado com sucesso!");

    window.location.href = "login.html";
}

window.cadastrar = cadastrar;