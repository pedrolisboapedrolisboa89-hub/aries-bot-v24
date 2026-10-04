module.exports = {
    comandos: ['beijo','beijar','kiss'],
    descricao: 'Dá um beijo em alguém',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let mentioned = [];
            if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) mentioned = ctx.mentionedJid;
            else if (ctx?.participant) mentioned = [ctx.participant];

            if (mentioned.length === 0) {
                return await sock.sendMessage(from, { text: '❌ Marca alguém! Ex: €beijo @pessoa' }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const mensagem = `Você acabou de dar um beijo em @${alvo.split('@')[0]}! 💋😘✨`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/5lflyp7l3090.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro beijo:', e);
            await sock.sendMessage(from, { text: '⚠️ Erro ao beijar 😂' }, { quoted: msg });
        }
    }
}
