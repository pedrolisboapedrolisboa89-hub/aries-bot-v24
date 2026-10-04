const { isAluguelAtivo, setAluguelAtivo } = require('../../database/sistema/aluguelManager');
module.exports = {
    comandos: ['modoaluguel','aluguel'],
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const acao = args[0]?.toLowerCase();

        if (acao === 'off') {
            setAluguelAtivo(false);
            return sock.sendMessage(from, { text: "🔴 *Aluguel DESATIVADO*\nBot NÃO vai sair dos grupos!" }, { quoted: msg });
        }
        if (acao === 'on') {
            setAluguelAtivo(true);
            return sock.sendMessage(from, { text: "🟢 *Aluguel ATIVADO*\nBot vai controlar vencimentos!" }, { quoted: msg });
        }
        const status = isAluguelAtivo()? "🟢 ATIVO" : "🔴 DESATIVADO";
        return sock.sendMessage(from, { text: `⚙️ *MODO ALUGUEL:* ${status}\n\n€modoaluguel on = ativar\n€modoaluguel off = desativar` }, { quoted: msg });
    }
}
