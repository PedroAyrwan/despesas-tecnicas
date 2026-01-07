// ================= CONFIGURAÇÃO =================
const ID_PLANILHA = '1V3SmdN1vKarVdrVx8MSbbnOMdmZZq5HCyIP4P_whQsM'; 
const ID_PASTA_DRIVE = '1Dyxr2ifaXx89ZYG42OjAXGcBONTgjzEj'; 

// ================= ROTAS =================
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Gestão Financeira')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Funções para carregar as páginas
function carregarViewLogin() { return include('Login'); } // O arquivo no Google deve chamar "Login"
function carregarViewTecnico() { return include('Tec'); }     // O arquivo no Google deve chamar "Tec"

// ================= LOGIN =================
function tentarLogin(usuario, senha) {
  try {
    const ss = SpreadsheetApp.openById(ID_PLANILHA);
    const ws = ss.getSheetByName('Usuarios');
    const dados = ws.getDataRange().getValues();
    
    for (let i = 1; i < dados.length; i++) {
      let uLogin = String(dados[i][1]).trim().toLowerCase();
      let uSenha = String(dados[i][2]).trim();
      
      if (uLogin == String(usuario).toLowerCase() && uSenha == String(senha)) {
        return { 
          sucesso: true, 
          dados: { 
            nome: dados[i][0], 
            perfil: dados[i][3], 
            empresa: dados[i][4] 
          }
        };
      }
    }
    return { sucesso: false, erro: 'Credenciais inválidas.' };
  } catch (e) {
    return { sucesso: false, erro: e.message };
  }
}

// ================= SALVAR NO DRIVE E PLANILHA =================
function salvarDespesaBackend(dados, arquivoBase64, nomeArquivo, mimeType) {
  try {
    let linkArquivo = 'Sem anexo';
    if (arquivoBase64 && nomeArquivo) {
      const pasta = DriveApp.getFolderById(ID_PASTA_DRIVE);
      const blob = Utilities.newBlob(Utilities.base64Decode(arquivoBase64), mimeType, nomeArquivo);
      const arquivo = pasta.createFile(blob);
      arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      linkArquivo = arquivo.getUrl();
    }

    const ss = SpreadsheetApp.openById(ID_PLANILHA);
    const ws = ss.getSheetByName('Despesas');
    const idUnico = Utilities.formatDate(new Date(), "GMT-3", "yyyyMMddHHmmss");

    ws.appendRow([
      idUnico, new Date(), dados.data, dados.empresa, dados.usuario, 
      dados.tipo, dados.valor, dados.descricao, linkArquivo, 'Pendente'
    ]);
    
    return { sucesso: true };
    
  } catch (e) {
    return { sucesso: false, erro: 'Erro no servidor: ' + e.toString() };
  }
}