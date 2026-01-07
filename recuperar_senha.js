const URL_API = "SUA_URL_DO_GOOGLE_SCRIPT_AQUI"; // Cole a mesma URL aqui

// 1. Pegar o CPF que está na URL (ex: ...html?cpf=123)
const params = new URLSearchParams(window.location.search);
const cpfUrl = params.get('cpf');

if (!cpfUrl) {
    alert("Link inválido. Tente solicitar a recuperação novamente.");
    window.location.href = "recuperar.html";
} else {
    carregarDadosUsuario();
}

function carregarDadosUsuario() {
    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            action: "buscarUsuario", // Chama a função nova do Google
            cpf: cpfUrl
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('msgBoasVindas').innerText = `Olá, ${data.usuario.nome}`;
            document.getElementById('senhaAtual').innerText = data.usuario.senhaAtual;
        } else {
            alert("Erro ao buscar usuário: " + data.erro);
        }
    });
}

document.getElementById('formNovaSenha').addEventListener('submit', function(e) {
    e.preventDefault();

    const nova = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;

    if (nova !== confirma) {
        alert("As senhas não coincidem!");
        return;
    }

    // Salvar no Google
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
            window.location.href = "index.html"; // Manda pro login
        } else {
            alert("Erro: " + data.erro);
            btn.innerText = "Salvar Alteração";
            btn.disabled = false;
        }
    });
});