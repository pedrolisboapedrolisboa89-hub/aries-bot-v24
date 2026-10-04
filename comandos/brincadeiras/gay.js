const GAY_IMAGE_URL = "https://files.catbox.moe/6z8xwy.jpg";

function getGayPhrase(p) {
    if (p === 0) return "🌈 ZERO GAY! Macho alfa absoluto 😎";
    if (p <= 20) return "🏳️‍🌈 Quase nada… só amizade colorida 😉";
    if (p <= 40) return "🏳️‍🌈 Suspeito em dias alternados 👀";
    if (p <= 60) return "🏳️‍🌈 Meio termo… crocs detectado 💅";
    if (p <= 80) return "🏳️‍🌈 Forte presença arco-íris ✨";
    if (p < 100) return "🏳️‍🌈 Termômetro quase explodindo 🦄";
    return "👑 100% GAY! ÍCONE SUPREMO 💃✨";
}

module.exports = {
    comandos: ['gay','viado','gaymetro'],
    descricao: 'Mede o nível gay',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            await sock.sendMessage(from, { react: { text: "🏳️‍🌈", key: msg.key } }).catch(()=>{});

            const sender = msg.key.participant || msg.key.remoteJid;
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let target = ctx?.mentionedJid?.[0] || ctx?.participant || sender;

            if (!target.endsWith("@s.whatsapp.net")) {
                const num = target.replace(/\D/g, "");
                target = num + "@s.whatsapp.net";
            }

            const botNum = sock.user.id.split(":")[0];
            if (target.includes(botNum)) target = sender;

            let nomeAlvo = "Você";
            if (from.endsWith("@g.us")) {
                try {
                    const meta = await sock.groupMetadata(from);
                    const membro = meta.participants.find(p => p.id === target);
                    nomeAlvo = membro?.notify || membro?.name || `@${target.split("@")[0]}`;
                } catch {
                    nomeAlvo = `@${target.split("@")[0]}`;
                }
            }

            const porcentagem = Math.floor(Math.random() * 101);

            await sock.sendMessage(from, {
                image: { url: GAY_IMAGE_URL },
                caption: `\n🏳️‍🌈 *Medidor de Gay — TED BOT* 🏳️‍🌈\n\n👤 *Alvo:* ${nomeAlvo}\n📊 *Nível:* ${porcentagem}%\n\n📝 *Diagnóstico:*\n${getGayPhrase(porcentagem)}\n`,
                mentions: [target]
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro gay:', e);
            await sock.sendMessage(from, { text: '❌ Erro ao executar.' }, { quoted: msg });
        }
    }
}
