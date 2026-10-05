module.exports = {
    comandos: ['menuadm', 'adm'],
    run: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const prefix = '€';
        const txt = `
╭───〔 🛡️ MENU ADM 〕───
│ • ${prefix}adverter
│ • ${prefix}anti-status-grupo
│ • ${prefix}antilinkhard
│ • ${prefix}autoresposta
│ • ${prefix}banir
│ • ${prefix}brincadeiras
│ • ${prefix}gp
│ • ${prefix}limpe
│ • ${prefix}linkgp
│ • ${prefix}marcar
│ • ${prefix}mute
│ • ${prefix}promover
│ • ${prefix}rebaixar
│ • ${prefix}welcome
╰──────────────────
┃ ainda terá mais atualizações
┃ fiquem ligado - Këvēn smïlēr
╰──────────────────`.trim();
        await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
};
