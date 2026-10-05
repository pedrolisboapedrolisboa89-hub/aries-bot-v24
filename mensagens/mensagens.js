const { TEXTOS_GERAL } = require('./texto_geral.js');

module.exports = {
  comandoNaoExiste: (prefixo, comando) => {
    // Pega a mensagem que tu adicionou no texto_geral.js
    let txt = TEXTOS_GERAL.MENSAGEM_COMANDO_NAO_EXISTE || `❌ O comando *#prefixo##comando#* não existe!`;
    
    return txt
      .replace(/#prefixo#/g, prefixo)
      .replace(/{prefixo}/g, prefixo) // se tu usar {prefixo} também funciona
      .replace(/#comando#/g, comando)
      .replace(/{comando}/g, comando);
  }
};
