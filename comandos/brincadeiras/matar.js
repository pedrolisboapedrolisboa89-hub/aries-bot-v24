module.exports = {
    comandos: ['matar','kill'],
    descricao: 'Mata alguém (brincadeira)',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            let mentioned = [];
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
                mentioned = ctx.mentionedJid;
            } else if (ctx?.participant) {
                mentioned = [ctx.participant];
            }

            if (mentioned.length === 0) {
                return sock.sendMessage(from, {
                    text: "❌ Marque a mensagem de alguém ou use @ para matar!"
                }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const numeroAlvo = alvo.split("@")[0];
            const mensagem = `Você acabou de matar @${numeroAlvo}! 💀⚰️🥀`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/fes65rsy3175.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log("Erro matar:", e);
            await sock.sendMessage(from, { text: "⚠️ Erro ao tentar matar! 😂" }, { quoted: msg });
        }
    }
}
