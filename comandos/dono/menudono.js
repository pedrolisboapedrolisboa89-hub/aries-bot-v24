module.exports = {
    comandos: ['menudono', 'dono'],
    run: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const prefix = '€';
        const txt = `
╭───〔 👑 MENU DONO 〕───
│ • ${prefix}configbot
│ • ${prefix}dono
│ • ${prefix}modoalugel
╰──────────────────
┃ ainda terá mais atualizações
┃ fiquem ligado - Këvēn smïlēr
╰──────────────────`.trim();
        await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
};
