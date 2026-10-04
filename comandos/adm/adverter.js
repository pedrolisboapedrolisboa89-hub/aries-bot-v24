module.exports = {
    comandos: ['adverter', 'advertir', 'warn'],
    descricao: 'Adverte membro (3 warns = ban)',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ Só em grupos!' }, { quoted: msg });
        const fs = require('fs');
        const path = require('path');
        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderPart = participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderPart?.admin === 'admin' || senderPart?.admin === 'superadmin';
            const botPart = participants.find(p => p.id.includes(sock.user.id.split('@')[0]));
            const isBotAdmin = botPart?.admin === 'admin' || botPart?.admin === 'superadmin';

            if (!isSenderAdmin) {
                return await sock.sendMessage(from, { text: '❌ Apenas ADM pode advertir!' }, { quoted: msg });
            }
            if (!isBotAdmin) {
                return await sock.sendMessage(from, { text: '🤖 Preciso ser ADM pra advertir!' }, { quoted: msg });
            }

            // Alvo
            let alvo = null;
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid?.[0]) alvo = ctx.mentionedJid[0];
            else if (ctx?.participant) alvo = ctx.participant;
            if (!alvo) return await sock.sendMessage(from, { text: '❌ Marca alguém! Ex: €warn @pessoa' }, { quoted: msg });

            const targetPart = participants.find(p => p.id === alvo);
            if (!targetPart) return await sock.sendMessage(from, { text: '⚠️ Usuário não está no grupo.' }, { quoted: msg });
            if (alvo === senderJid) return await sock.sendMessage(from, { text: '❌ Não pode se auto-advertir!' }, { quoted: msg });
            if (alvo.includes(sock.user.id.split('@')[0])) return await sock.sendMessage(from, { text: '🤖 Não posso me advertir 😅' }, { quoted: msg });

            const isTargetAdmin = targetPart.admin === 'admin' || targetPart.admin === 'superadmin';
            if (isTargetAdmin) return await sock.sendMessage(from, { text: '⛔ Não pode advertir outro ADM!' }, { quoted: msg });

            // Sistema de advertencias
            const dir = './database/adverte';
            const file = path.join(dir, 'adverte.json');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            let data = {};
            if (fs.existsSync(file)) {
                try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { data = {}; }
            }
            if (!data[from]) data[from] = {};
            const atual = data[from][alvo] || 0;
            const novo = atual + 1;
            data[from][alvo] = novo;
            fs.writeFileSync(file, JSON.stringify(data, null, 2));

            const alvoTag = alvo.split('@')[0];
            await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });

            if (novo === 1) {
                await sock.sendMessage(from, {
                    text: `⚠️ *PRIMEIRA ADVERTÊNCIA*\n\n👤 Membro: @${alvoTag}\n📊 Warns: 1/3\n📝 Status: Aviso\n\n💡 Na 3ª você é banido!`,
                    mentions: [alvo]
                }, { quoted: msg });
            } else if (novo === 2) {
                await sock.sendMessage(from, {
                    text: `🚨 *SEGUNDA ADVERTÊNCIA*\n\n👤 Membro: @${alvoTag}\n📊 Warns: 2/3\n📝 Status: Último Aviso\n\n⚠️ Próxima = BAN!`,
                    mentions: [alvo]
                }, { quoted: msg });
            } else if (novo >= 3) {
                await sock.sendMessage(from, {
                    text: `🔨 *BAN AUTOMÁTICO*\n\n👤 Membro: @${alvoTag}\n📊 Warns: 3/3\n📝 Status: BANIDO\n\nMotivo: 3 advertências`,
                    mentions: [alvo]
                }, { quoted: msg });
                await sock.groupParticipantsUpdate(from, [alvo], "remove");
                delete data[from][alvo];
                fs.writeFileSync(file, JSON.stringify(data, null, 2));
                await sock.sendMessage(from, { react: { text: '🔨', key: msg.key } });
                return;
            }
            await sock.sendMessage(from, { react: { text: '⚠️', key: msg.key } });

        } catch (e) {
            console.log('Erro adverter:', e);
            await sock.sendMessage(from, { text: '❌ Erro ao advertir!' }, { quoted: msg });
        }
    }
}
