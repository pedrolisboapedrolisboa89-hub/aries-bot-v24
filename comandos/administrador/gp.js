module.exports = {
    comandos: ['gp', 'grupo', 'abrirgrupo', 'fechargrupo'],
    descricao: 'Abre e fecha o grupo',
    categoria: 'adm',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            return await sock.sendMessage(from, { text: "❌ Este comando só funciona em grupos." }, { quoted: msg });
        }

        if (!args[0]) {
            return await sock.sendMessage(from, {
                text: `❌ Uso incorreto!\n\n💡 Utilize:\n• *€gp a* para ABRIR o grupo\n• *€gp f* para FECHAR o grupo`
            }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderParticipant = metadata.participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin';

            if (!isSenderAdmin) {
                return await sock.sendMessage(from, { text: "❌ Apenas administradores podem usar este comando!" }, { quoted: msg });
            }

            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const botParticipant = metadata.participants.find(p => p.id.includes(sock.user.id.split('@')[0]));
            const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

            if (!isBotAdmin) {
                return await sock.sendMessage(from, { text: "🤖 Preciso ser administrador para fazer isso!" }, { quoted: msg });
            }

            const option = args[0].toLowerCase();

            if (option === 'a' || option === 'abrir' || option === 'open') {
                await sock.sendMessage(from, { react: { text: "🔓", key: msg.key } });
                await sock.groupSettingUpdate(from, 'not_announcement');
                await sock.sendMessage(from, {
                    text: "✅ *O grupo foi ABERTO!*\nTodos podem enviar mensagens agora. ♈"
                }, { quoted: msg });

            } else if (option === 'f' || option === 'fechar' || option === 'close') {
                await sock.sendMessage(from, { react: { text: "🔒", key: msg.key } });
                await sock.groupSettingUpdate(from, 'announcement');
                await sock.sendMessage(from, {
                    text: "✅ *O grupo foi FECHADO!*\nApenas ADMs podem enviar mensagens."
                }, { quoted: msg });

            } else {
                return await sock.sendMessage(from, {
                    text: `❌ Opção inválida!\n\n💡 Use:\n• *€gp a* - abrir\n• *€gp f* - fechar`
                }, { quoted: msg });
            }

        } catch (error) {
            console.log("Erro no gp:", error);
            await sock.sendMessage(from, { text: "❌ Erro ao executar gp." }, { quoted: msg });
        }
    }
                                       }
