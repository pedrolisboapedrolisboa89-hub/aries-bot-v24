module.exports = {
    comandos: ['menu', 'help'],
    run: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushname = msg.pushName || 'Usuário';
        const prefix = '€';
        const isDono = sender.includes('958137017');
        const saudacao = isDono? `Seja bem-vindo ao meu menu mestre @${sender.split('@')[0]} 👑` : `Seja bem-vindo ao meu menu @${sender.split('@')[0]} ✨`;
        const txt = `
╭━━━━〔 ♈ ÁRIES V24 - ANIME 〕━━━━╮
┃ ${saudacao}
┃ • Dono: Këvēn smïlēr
┃ • User: ${pushname}
╰━━━━━━━━━━━━━━━━━━━━━━╯
╭───〔 📜 MEUS MENUS 〕───
│ • ${prefix}menuadm
│ • ${prefix}menudono
│ • ${prefix}menubrincadeiras
│ • ${prefix}menujogos
│ • ${prefix}menufamilia
│ • ${prefix}menugeral
╰──────────────────
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ ainda terá mais atualizações
┃ fiquem ligado
┃ Këvēn smïlēr ✨
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();
        await sock.sendMessage(from, { text: txt, mentions: [sender] }, { quoted: msg });
    }
};
