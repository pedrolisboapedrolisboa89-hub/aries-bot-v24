module.exports = {
    comandos: ['chutar','chute','kick'],
    descricao: 'Dá um chute em alguém',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let mentioned = [];
            if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) mentioned = ctx.mentionedJid;
            else if (ctx?.participant) mentioned = [ctx.participant];

            if (mentioned.length === 0) {
                return await sock.sendMessage(from, { text: '❌ Marca alguém! Ex: €chutar @pessoa' }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const mensagem = `Você acabou de dar um chute em @${alvo.split('@')[0]}! 🦵💥`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/frmdr2n10719.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro chutar:', e);
            await sock.sendMessage(from, { text: '⚠️ Erro ao chutar 😂' }, { quoted: msg });
        }
    }
}
