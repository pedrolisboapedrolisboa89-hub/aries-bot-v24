const { getWelcomeConfig, setWelcomeStatus, setWelcomeCaption, setLeaveCaption } = require('../../database/sistema/welcomeManager');

module.exports = {
    comandos: ['welcome','bemvindo','bv'],
    descricao: 'Configura boas-vindas',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        if (!isGroup) return sock.sendMessage(from, { text: "❌ Só em grupos." }, { quoted: msg });

        const metadata = await sock.groupMetadata(from).catch(()=>null);
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const participant = metadata?.participants?.find(p => p.id === senderJid);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        if (!isAdmin) return sock.sendMessage(from, { text: "❌ Só admins." }, { quoted: msg });

        const opt = (args[0] || "").toLowerCase();
        const config = getWelcomeConfig(from);

        if (opt === "on" || opt === "off") {
            const status = opt === "on";
            setWelcomeStatus(from, status);
            return sock.sendMessage(from, { text: `🎉 Boas-vindas ${status? "✅ ATIVADO" : "❌ DESATIVADO"}` }, { quoted: msg });
        }
        if (opt === "legenda" || opt === "caption") {
            const newCaption = args.slice(1).join(" ");
            if (!newCaption) return sock.sendMessage(from, { text: `💡 Use: €welcome legenda Sua mensagem\nVariáveis: @user, #group` }, { quoted: msg });
            setWelcomeCaption(from, newCaption);
            return sock.sendMessage(from, { text: "✅ Legenda atualizada!" }, { quoted: msg });
        }
        if (opt === "saiu" || opt === "leave") {
            const newCaption = args.slice(1).join(" ");
            if (!newCaption) return sock.sendMessage(from, { text: `💡 Use: €welcome saiu Sua mensagem\nVariáveis: @user, #group` }, { quoted: msg });
            setLeaveCaption(from, newCaption);
            return sock.sendMessage(from, { text: "✅ Legenda de saída atualizada!" }, { quoted: msg });
        }
        if (opt === "status") {
            return sock.sendMessage(from, { text: `🎚️ *Status:*\n• ${config.enabled? "✅ ON" : "❌ OFF"}\n\n• *Entrada:*\n${config.caption}\n\n• *Saída:*\n${config.leaveCaption}` }, { quoted: msg });
        }
        if (opt === "test") {
            const sender = senderJid;
            const groupName = metadata?.subject || "Grupo";
            const welcomeMsg = config.caption.replace(/@user/g, `@${sender.split("@")[0]}`).replace(/#group/g, groupName);
            return sock.sendMessage(from, { text: welcomeMsg, mentions: [sender] }, { quoted: msg });
        }

        return sock.sendMessage(from, { text: `⚙️ *Welcome*\n\n• €welcome on/off\n• €welcome legenda <texto>\n• €welcome saiu <texto>\n• €welcome status\n• €welcome test\n\nVar: @user, #group` }, { quoted: msg });
    }
}
