module.exports = {
    comandos: ['marcar','todos','hidetag'],
    descricao: 'Marca todos do grupo',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            const metadata = await sock.groupMetadata(from);
            if (!metadata.participants) {
                return sock.sendMessage(from, { text: "❌ Só em grupos." }, { quoted: msg });
            }
            const participants = metadata.participants;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderParticipant = participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin';

            if (!isSenderAdmin) {
                return sock.sendMessage(from, { text: "❌ Só admins podem marcar todos." }, { quoted: msg });
            }

            const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
            const additionalText = args.join(" ");

            let message = `╔═══════════════════╗\n║   *MENÇÃO GERAL* 📢   ║\n╚═══════════════════╝\n\n`;
            if (additionalText) message += `💬 *Mensagem:* ${additionalText}\n\n`;
            message += `*Marcando ${participants.length} membros:*\n\n`;

            let mentions = [];
            participants.forEach(p => {
                message += `• @${p.id.split('@')[0]}\n`;
                mentions.push(p.id);
            });

            await sock.sendMessage(from, { text: message, mentions: mentions }, { quoted: msg });

        } catch (e) {
            console.log("Erro marcar:", e);
            await sock.sendMessage(from, { text: "❌ Erro ao marcar. Verifique se sou admin." }, { quoted: msg });
        }
    }
}
