module.exports = {
    comandos: ['foda','sexo','transar'],
    descricao: 'Fazer amor com alguém (brincadeira)',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            if (!from.endsWith("@g.us")) {
                return await sock.sendMessage(from, { text: '❌ Só em grupos!' }, { quoted: msg });
            }
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let mentioned = [];
            if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) mentioned = ctx.mentionedJid;
            else if (ctx?.participant) mentioned = [ctx.participant];

            if (mentioned.length === 0) {
                return await sock.sendMessage(from, { text: '❌ Marca alguém! Ex: €foda @pessoa' }, { quoted: msg });
            }

            const alvo = mentioned[0];
            const pushname = msg.pushName || "Usuário";

            await sock.sendMessage(from, {
                text: `Você acabou de fazer sexo com(a) @${alvo.split('@')[0]} 🥵\n\nAguarde enquanto calculamos a chance...`,
                mentions: [alvo]
            }, { quoted: msg });

            setTimeout(async () => {
                const randomChance = Math.floor(Math.random() * 100);
                const randomPregnancyChance = Math.floor(Math.random() * 50);
                await sock.sendMessage(from, {
                    video: { url: "https://files.catbox.moe/8dt8w7.mp4" },
                    caption: `> *[👤] Olá,@${pushname}*\n\n> Você Acabou de fazer sexo com(a) @${alvo.split('@')[0]} 🥵\n\n> *[💦] Chance de você ter ejaculado dentro:* _${randomChance}%_\n\n> *[🤱] Possíveis chances do @${alvo.split('@')[0]} ter engravidado é:* _${randomPregnancyChance}%_`,
                    gifPlayback: true,
                    mentions: [alvo, msg.key.participant || msg.key.remoteJid]
                });
            }, 7000);

        } catch (e) {
            console.log('Erro foda:', e);
            await sock.sendMessage(from, { text: '⚠️ Erro!' }, { quoted: msg });
        }
    }
}
