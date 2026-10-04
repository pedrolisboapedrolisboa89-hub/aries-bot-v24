module.exports = {
    comandos: ['tapa','tapabunda','nalgada'],
    descricao: 'Da um tapa na raba',
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
                    text: "❌ Marque a mensagem de alguém ou use @ para dar um tapa!"
                }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const mensagem = `Você acabou de dar um tapa na raba da 😏 @${alvo.split("@")[0]} 🔥`;
            const videoUrl = "https://chat.tedzinho.com.br/uploads2/vf9h1tvu6036.mp4";

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log("Erro tapa:", e);
            await sock.sendMessage(from, { text: "⚠️ Erro ao dar tapa! 😂" }, { quoted: msg });
        }
    }
}
