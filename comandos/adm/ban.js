module.exports = {
    comandos: ['ban', 'kick', 'remover', 'tirar'],
    descricao: 'Banir membro do grupo',
    categoria: 'adm',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');

        if (!isGroup) {
            return await sock.sendMessage(from, { text: '⚠️ Só funciona em grupos!' }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderParticipant = participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin';
            const isSenderOwner = metadata.owner === senderJid;

            if (!isSenderAdmin &&!isSenderOwner) {
                return await sock.sendMessage(from, { text: '❌ Apenas administradores podem usar este comando.' }, { quoted: msg });
            }

            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const botParticipant = participants.find(p => p.id === botJid || p.id.includes(sock.user.id.split('@')[0]));
            const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

            if (!isBotAdmin) {
                return await sock.sendMessage(from, { text: '🤖 Preciso ser admin para remover alguém!' }, { quoted: msg });
            }

            // Pega quem foi marcado
            let mencionados = [];
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid) mencionados = ctx.mentionedJid;
            if (ctx?.participant &&!mencionados.includes(ctx.participant)) mencionados.push(ctx.participant);

            if (mencionados.length === 0) {
                return await sock.sendMessage(from, { text: '❌ Marque a mensagem da pessoa ou use @ para banir.\n\nEx: €ban @pessoa' }, { quoted: msg });
            }

            let mentions = [];
            let mensagem = `🔥 *BAN - ${metadata.subject}* 🔥\n\n`;

            for (const alvo of mencionados) {
                const targetParticipant = participants.find(p => p.id === alvo);
                const displayName = alvo.split("@")[0];

                if (!targetParticipant) {
                    mensagem += `⚠️ @${displayName} não encontrado no grupo\n`;
                    mentions.push(alvo);
                    continue;
                }

                // Não deixa banir o dono 933353188
                if (alvo.includes('244933353188') || alvo.includes('244958137017')) {
                    mensagem += `👑 @${displayName} é o dono, não pode ser banido! ♈\n`;
                    mentions.push(alvo);
                    continue;
                }

                try {
                    await sock.groupParticipantsUpdate(from, [alvo], "remove");
                    mensagem += `🚨 @${displayName} foi *REMOVIDO COM SUCESSO* ✅\n`;
                    mentions.push(alvo);
                } catch {
                    mensagem += `❌ @${displayName} não pôde ser removido\n`;
                    mentions.push(alvo);
                }
            }

            await sock.sendMessage(from, {
                text: mensagem.trim(),
                mentions
            }, { quoted: msg });

        } catch (err) {
            console.log('Erro ban:', err);
            await sock.sendMessage(from, { text: '❌ Erro ao tentar banir.' }, { quoted: msg });
        }
    }
        }
