module.exports = {
    comandos: ['promover', 'promote', 'daradm'],
    descricao: 'Dar ADM pra alguém',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ Só em grupos!' }, { quoted: msg });
        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderPart = participants.find(p => p.id === senderJid);
            if (senderPart?.admin!== 'admin' && senderPart?.admin!== 'superadmin') {
                return await sock.sendMessage(from, { text: '❌ Só ADM pode promover!' }, { quoted: msg });
            }
            const botPart = participants.find(p => p.id.includes(sock.user.id.split('@')[0]));
            if (botPart?.admin!== 'admin' && botPart?.admin!== 'superadmin') {
                return await sock.sendMessage(from, { text: '🤖 Preciso ser ADM!' }, { quoted: msg });
            }
            let alvo = null;
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
            else if (ctx?.participant) alvo = ctx.participant;
            if (!alvo) return await sock.sendMessage(from, { text: '❌ Marca alguém! Ex: €promover @pessoa' }, { quoted: msg });
            const targetPart = participants.find(p => p.id === alvo);
            if (targetPart?.admin === 'admin' || targetPart?.admin === 'superadmin') {
                return await sock.sendMessage(from, { text: '⚠️ Ele já é ADM!' }, { quoted: msg });
            }
            await sock.groupParticipantsUpdate(from, [alvo], "promote");
            await sock.sendMessage(from, { text: `👑 @${alvo.split('@')[0]} agora é ADM!`, mentions: [alvo] }, { quoted: msg });
        } catch (e) {
            console.log('Erro promover:', e);
            await sock.sendMessage(from, { text: '❌ Erro ao promover!' }, { quoted: msg });
        }
    }
              }
