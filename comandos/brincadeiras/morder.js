module.exports = {
    comandos: ['morder','mordida'],
    descricao: 'Morde alguém',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            let mentioned = [];
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid?.length > 0) mentioned = ctx.mentionedJid;
            else if (ctx?.participant) mentioned = [ctx.participant];

            if (mentioned.length === 0) {
                return sock.sendMessage(from, {
                    text: "❌ Marque a mensagem de alguém ou use @ para morder!"
                }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const numeroAlvo = alvo.split("@")[0];
            const mensagem = `Você acabou de dar uma mordida em @${numeroAlvo}! 🦷😈✨`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/wsux8bvo0940.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log("Erro morder:", e);
            await sock.sendMessage(from, { text: "⚠️ Erro ao tentar morder! 😂" }, { quoted: msg });
        }
    }
}
