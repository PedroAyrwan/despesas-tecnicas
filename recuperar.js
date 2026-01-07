const URL_API = "https://script.google.com/macros/s/AKfycbwbG88IJCicebFVp2r3YYVbCb8MgGWKCRu23PzA6cHkr966ku1eSkbHakIkbmxBlJVT/exec"; 

document.getElementById('formRecuperar').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cpf = document.getElementById('cpf').value;
    const btn = document.querySelector('button');
    
    // Pega a URL atual do site (ex: https://usuario.github.io/projeto/)
    // Remove o nome do arquivo (recuperar.html) para ficar só a pasta base
    let urlBase = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);

    btn.innerText = "Enviando...";
    btn.disabled = true;

    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            action: "recuperarSenha",
            cpf: cpf,
            urlBase: urlBase // Envia a base do link para o Google
        })
    })
    .then(r => r.json())
    .then(data => {
        if(data.sucesso) {
            alert("✅ E-mail enviado!\nVerifique sua caixa de entrada (e spam).");
            window.location.href = "index.html";
        } else {
            alert("Erro: " + data.erro);
            btn.innerText = "Enviar Link";
            btn.disabled = false;
        }
    });
});