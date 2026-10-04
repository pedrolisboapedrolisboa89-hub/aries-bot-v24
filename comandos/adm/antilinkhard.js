const { TEXTOS_GERAL } = require('../../mensagens/texto_geral');

// Guarda os grupos com antilink ativo
let gruposAtivos = new Set();

module.exports = {
    comandos: ['antilinkhard', 'antilink', 'antlink'],
    descricao: 'Liga/desliga anti-link hard',
    categoria: 'adm',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');

        if (!isGroup) {
            return await sock.sendMessage(from, {
                text: '⚠️ Este comando só funciona em grupos!'
            }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderParticipant = metadata.participants.find(p => p.id === senderJid);
            const isSenderAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin';
            const isSenderOwner = metadata.owner === senderJid;

            if (!isSenderAdmin &&!isSenderOwner) {
                return await sock.sendMessage(from, {
                    text: '🚫 Apenas administradores podem alterar o *AntiLinkHard*!'
                }, { quoted: msg });
            }

            const option = args[0]?.toLowerCase();

            if (option === 'on' || option === 'ativar' || option === '1') {
                gruposAtivos.add(from);
                return await sock.sendMessage(from, {
                    text: '✅ *AntiLinkHard* foi *ativado* neste grupo.\n\n♈ ÁRIES-BOT V24 vai apagar todos links!'
                }, { quoted: msg });

            } else if (option === 'off' || option === 'desativar' || option === '0') {
                gruposAtivos.delete(from);
                return await sock.sendMessage(from, {
                    text: '❌ *AntiLinkHard* foi *desativado* neste grupo.'
                }, { quoted: msg });

            } else {
                const ativo = gruposAtivos.has(from);
                const status = ativo? '🟢 Ativado' : '🔴 Desativado';
                return await sock.sendMessage(from, {
                    text: `📡 *Status do AntiLinkHard:*\n${status}\n\nUse:\n• €antilinkhard on - para ativar\n• €antilinkhard off - para desativar`
                }, { quoted: msg });
            }

        } catch (err) {
            console.error('Erro no antilinkhard:', err);
            await sock.sendMessage(from, {
                text: '❌ Erro ao alterar AntiLinkHard.'
            }, { quoted: msg });
        }
    },

    // Função pra verificar se grupo tá com antilink ativo (vai ser usada no index.js)
    isAtivo: (groupId) => gruposAtivos.has(groupId)
        }
