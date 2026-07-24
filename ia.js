// ===============================
// SISTEMA AI - INTELIGÊNCIA
// ===============================


function analisarLoja(){


let produtos = JSON.parse(
localStorage.getItem("produtos")
) || [];


let vendas = JSON.parse(
localStorage.getItem("vendas")
) || [];



let mensagens = [];



// VERIFICA ESTOQUE

produtos.forEach(produto=>{


    if(Number(produto.quantidade) <= 5){


        mensagens.push(

        "⚠️ O produto " 
        + produto.nome 
        + " está com estoque baixo."

        );


    }


});




// ANALISA VENDAS

if(vendas.length === 0){


    mensagens.push(

    "📊 Ainda não existem vendas registradas."

    );


}else{


    mensagens.push(

    "✅ A loja possui "
    + vendas.length
    + " vendas cadastradas."

    );


}




// MOSTRA AVISOS


let caixa = document.getElementById("avisoIA");


if(caixa){


caixa.innerHTML = mensagens.join("<br><br>");


}



}




window.onload=function(){


analisarLoja();


};