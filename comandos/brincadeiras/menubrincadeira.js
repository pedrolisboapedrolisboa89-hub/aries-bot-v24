module.exports = {
    comandos: ['menubrincadeiras', 'brincadeiras'],
    run: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const prefix = '€';
        const txt = `
╭───〔 🎭 MENU BRINCADEIRAS 〕───
│ • ${prefix}abracar
│ • ${prefix}acenar
│ • ${prefix}aplaudir
│ • ${prefix}atirar
│ • ${prefix}beijo
│ • ${prefix}chutar
│ • ${prefix}comer
│ • ${prefix}corno
│ • ${prefix}foda
│ • ${prefix}gay
│ • ${prefix}matar
│ • ${prefix}morder
│ • ${prefix}tapa
╰──────────────────
┃ ainda terá mais atualizações
┃ fiquem ligado - Këvēn smïlēr
╰──────────────────`.trim();
        await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
};
