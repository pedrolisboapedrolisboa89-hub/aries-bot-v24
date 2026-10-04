module.exports = {
    comandos: ['rebaixar', 'demote', 'tiraradm'],
    descricao: 'Tirar ADM de alguém',
    categoria: 'adm',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            return await sock.sendMessage(from, { text: '❌ Só funciona em grupos!' }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderPart = participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderPart?.admin === 'admin' || senderPart?.admin === 'superadmin';

            if (!isSenderAdmin) {
                return await sock.sendMessage(from, { text: '❌ Apenas ADMs podem usar!' }, { quoted: msg });
            }

            const botPart = participants.find(p => p.id.includes(sock.user.id.split('@')[0]));
            const isBotAdmin = botPart?.admin === 'admin' || botPart?.admin === 'superadmin';

            if (!isBotAdmin) {
                return await sock.sendMessage(from, { text: '🤖 Preciso ser ADM!' }, { quoted: msg });
            }

            let alvo = null;
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid && ctx.mentionedJid[0]) alvo = ctx.mentionedJid[0];
            else if (ctx?.participant) alvo = ctx.participant;

            if (!alvo) {
                return await sock.sendMessage(from, { text: '❌ Marca alguém pra rebaixar!\n\nEx: €rebaixar @pessoa' }, { quoted: msg });
            }

            const targetPart = participants.find(p => p.id === alvo);
            if (!targetPart) {
                return await sock.sendMessage(from, { text: '⚠️ Usuário não encontrado!' }, { quoted: msg });
            }

            if (targetPart.admin!== 'admin' && targetPart.admin!== 'superadmin') {
                return await sock.sendMessage(from, { text: '⚠️ Ele já não é ADM!' }, { quoted: msg });
            }

            // Não deixa rebaixar dono 933353188 nem criador do grupo
            if (alvo.includes('244933353188') || alvo.includes('244958137017') || targetPart.admin === 'superadmin') {
                return await sock.sendMessage(from, { text: '🚫 Não posso rebaixar o dono/criador!' }, { quoted: msg });
            }

            await sock.groupParticipantsUpdate(from, [alvo], "demote");
            await sock.sendMessage(from, {
                text: `✅ @${alvo.split('@')[0]} não é mais ADM!`,
                mentions: [alvo]
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro rebaixar:', e);
            await sock.sendMessage(from, { text: '❌ Erro ao rebaixar!' }, { quoted: msg });
        }
    }
              }
