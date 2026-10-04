module.exports = {
    comandos: ['linkgp','link','linkgrupo','linkg'],
    descricao: 'Gera link do grupo',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: "❌ Só em grupos." }, { quoted: msg });

            const metadata = await sock.groupMetadata(from);
            const sender = msg.key.participant || from;
            const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;

            if (!isAdmin) return sock.sendMessage(from, { text: "❌ Só admins podem gerar link!" }, { quoted: msg });

            const botId = sock.user.id.split(':')[0]+'@s.whatsapp.net';
            const isBotAdmin = metadata.participants.find(p => p.id.includes(sock.user.id.split('@')[0]))?.admin;
            if (!isBotAdmin) return sock.sendMessage(from, { text: "🤖 Preciso ser admin pra gerar link!" }, { quoted: msg });

            await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

            const code = await sock.groupInviteCode(from);
            const groupLink = `https://chat.whatsapp.com/${code}`;

            let groupPicture = null;
            try { groupPicture = await sock.profilePictureUrl(from, 'image'); } catch {}

            const linkMessage = `╔═══════════════════════╗
║ 📲 LINK DO GRUPO ║
╚═══════════════════════╝

🏷️ *Nome:* ${metadata.subject}
👥 *Participantes:* ${metadata.participants.length}
🔗 *Link:*
${groupLink}

💡 Compartilhe para convidar!`;

            if (groupPicture) {
                await sock.sendMessage(from, { image: { url: groupPicture }, caption: linkMessage }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: linkMessage }, { quoted: msg });
            }
            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

        } catch (error) {
            console.error("Erro linkgp:", error);
            await sock.sendMessage(from, { text: "❌ Erro ao gerar link. Sou admin?" }, { quoted: msg });
        }
    }
}
