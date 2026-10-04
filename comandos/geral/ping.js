const { TEXTOS_GERAL } = require('../../mensagens/texto_geral');

module.exports = {
    comandos: ['ping', 'p'],
    descricao: 'Ver se o bot tá online',
    
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const inicio = Date.now();
        
        let lista = TEXTOS_GERAL.MENSAGENS_DE_AGUARDE;
        let texto = lista[Math.floor(Math.random() * lista.length)];

        await sock.sendMessage(from, { text: `♈ ${texto}...` }, { quoted: msg });
        
        let ping = Date.now() - inicio;
        
        await sock.sendMessage(from, { 
            text: `♈ *PONG!* \n\n> Velocidade: ${ping}ms\n> Bot: ÁRIES-BOT V24 ONLINE ♈` 
        }, { quoted: msg });
    }
}
