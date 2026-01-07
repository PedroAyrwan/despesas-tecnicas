// ⚠️ Mantenha sua URL correta aqui
const URL_API = "https://script.google.com/macros/s/AKfycbwbG88IJCicebFVp2r3YYVbCb8MgGWKCRu23PzA6cHkr966ku1eSkbHakIkbmxBlJVT/exec"; 

// 1. Pegar o CPF da URL
const params = new URLSearchParams(window.location.search);
const cpfUrl = params.get('cpf');

// Se não tiver CPF na URL, manda voltar (segurança básica)
if (!cpfUrl) {
    alert("Link inválido. Por favor, solicite a recuperação novamente.");
    window.location.href = "recuperar.html";
} else {
    carregarDadosUsuario();
}

function carregarDadosUsuario() {
    // Feedback visual (opcional, pois já está no HTML)
    document.getElementById('msgBoasVindas').innerText = "Buscando seus dados...";

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            action: "buscarUsuario",
            cpf: cpfUrl
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.sucesso) {
            // ✅ SUCESSO: Preenche os dados na tela
            // O texto "Carregando..." é substituído pelo nome do usuário aqui:
            document.getElementById('msgBoasVindas').innerText = `Olá, ${data.usuario.nome}`;
            
            // Mostra a senha atual
            document.getElementById('senhaAtual').innerText = data.usuario.senhaAtual;
        } else {
            alert("Erro: " + data.erro);
            document.getElementById('msgBoasVindas').innerText = "Erro ao carregar usuário.";
        }
    })
    .catch(error => {
        console.error(error);
        alert("Erro de conexão. Tente recarregar a página.");
    });
}

// 2. Lógica do Botão de Salvar Nova Senha
document.getElementById('formNovaSenha').addEventListener('submit', function(e) {
    e.preventDefault();

    const nova = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;

    if (nova !== confirma) {
        alert("As senhas digitadas não coincidem!");
        return;
    }

    const btn = document.querySelector('button');
    const textoOriginal = btn.innerText;
    
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
            window.location.href = "index.html"; // Manda o usuário fazer login com a senha nova
        } else {
            alert("Erro ao salvar: " + data.erro);
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
    })
    .catch(error => {
        alert("Erro de conexão ao salvar.");
        btn.innerText = textoOriginal;
        btn.disabled = false;
    });
});