let aluguelAtivo = true;

module.exports = {
    comandos: ['modoaluguel','aluguelmodo'],
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const acao = args[0]?.toLowerCase();

        if (acao === 'off' || acao === 'desligar') {
            aluguelAtivo = false;
            global.modoAluguel = false;
            return sock.sendMessage(from, { text: "🔴 *Modo aluguel DESATIVADO*\nBot não vai sair dos grupos vencidos!" }, { quoted: msg });
        }

        if (acao === 'on' || acao === 'ligar') {
            aluguelAtivo = true;
            global.modoAluguel = true;
            return sock.sendMessage(from, { text: "🟢 *Modo aluguel ATIVADO*\nBot vai controlar vencimentos!" }, { quoted: msg });
        }

        return sock.sendMessage(from, { text: `⚙️ *MODO ALUGUEL*\nStatus: ${aluguelAtivo? "🟢 ATIVO":"🔴 DESATIVADO"}\n\nUse:\n€modoaluguel on - ligar\n€modoaluguel off - desligar` }, { quoted: msg });
    }
}
