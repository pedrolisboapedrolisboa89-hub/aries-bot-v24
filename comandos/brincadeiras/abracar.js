module.exports = {
    comandos: ['abracar','abraço','abraçar','hug'],
    descricao: 'Dá um abraço em alguém',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let mentioned = [];
            if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) mentioned = ctx.mentionedJid;
            else if (ctx?.participant) mentioned = [ctx.participant];

            if (mentioned.length === 0) {
                return await sock.sendMessage(from, { text: '❌ Marca alguém ou responde a mensagem! Ex: €abracar @pessoa' }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const mensagem = `Você deu um abraço bem apertado em @${alvo.split('@')[0]}! 🤗💖✨`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/j6f7lp6h7809.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro abraçar:', e);
            await sock.sendMessage(from, { text: '⚠️ Erro ao abraçar 😂' }, { quoted: msg });
        }
    }
  }
