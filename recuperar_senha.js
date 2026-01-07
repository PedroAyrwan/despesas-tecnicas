// ⚠️ VERIFIQUE SE ESTA URL É A MESMA QUE VOCÊ USA NO RECUPERAR.JS
const URL_API = "https://script.google.com/macros/s/AKfycbwbG88IJCicebFVp2r3YYVbCb8MgGWKCRu23PzA6cHkr966ku1eSkbHakIkbmxBlJVT/exec"; 

// 1. Pegar o CPF que está na URL
const params = new URLSearchParams(window.location.search);
const cpfUrl = params.get('cpf');

// Mostra um alerta se não tiver CPF na URL (para você saber se o link veio certo)
if (!cpfUrl) {
    alert("⚠️ Atenção: O Link não trouxe o CPF. \n\nMotivo: Você provavelmente abriu o arquivo direto sem clicar no e-mail.");
} else {
    // Se tiver CPF, tenta buscar os dados
    carregarDadosUsuario();
}

function carregarDadosUsuario() {
    console.log("Iniciando busca para o CPF:", cpfUrl);

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            action: "buscarUsuario", // Essa é a ação que vamos chamar lá no Google
            cpf: cpfUrl
        })
    })
    .then(r => r.json())
    .then(data => {
        // ALERTA DE DIAGNÓSTICO (Vai te mostrar o que o servidor respondeu)
        // Depois que funcionar, você pode apagar essa linha:
        alert("Resposta do Servidor:\n" + JSON.stringify(data));

        if (data.sucesso) {
            // Se deu certo, preenche a tela
            document.getElementById('msgBoasVindas').innerText = `Olá, ${data.usuario.nome}`;
            document.getElementById('senhaAtual').innerText = data.usuario.senhaAtual;
            
            // Remove o aviso de "Carregando..." se existir
            const aviso = document.querySelector('p:contains("Carregando")'); 
            if(aviso) aviso.style.display = 'none';
        } else {
            alert("❌ Erro do Google: " + data.erro);
        }
    })
    .catch(error => {
        alert("❌ Erro de Conexão: \nO site não conseguiu falar com o Google.\n\nDetalhe: " + error);
        console.error(error);
    });
}

// Lógica do Botão de Salvar
document.getElementById('formNovaSenha').addEventListener('submit', function(e) {
    e.preventDefault();

    const nova = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;

    if (nova !== confirma) {
        alert("As senhas não coincidem!");
        return;
    }

    const btn = document.querySelector('button');
    btn.innerText = "Salvando...";
    btn.disabled = true;

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            action: "alterarSenha",
            cpf: cpfUrl,
            novaSenha: nova
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.sucesso) {
            alert("✅ Senha alterada com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Erro: " + data.erro);
            btn.innerText = "Salvar Alteração";
            btn.disabled = false;
        }
    });
});