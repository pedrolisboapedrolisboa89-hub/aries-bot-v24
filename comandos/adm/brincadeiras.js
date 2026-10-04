const brincadeirasManager = require('../../database/sistema/brincadeirasManager');
const generateBrincadeirasMenu = require('../../settings/menus/menu-brincadeiras');

module.exports = {
    comandos: ['brincadeiras','brincadeira','games'],
    descricao: 'Ativa/desativa brincadeiras',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const subCommand = args[0]?.toLowerCase();

        if (!subCommand || (subCommand!== 'on' && subCommand!== 'off')) {
            const menuText = generateBrincadeirasMenu();
            const status = brincadeirasManager.estaAtivo(from)? "✅ Ativado" : "❌ Desativado";
            const finalMenu = menuText + `\n\n*Status:* ${status}\n_Use €brincadeiras on/off_`;
            return sock.sendMessage(from, { text: finalMenu }, { quoted: msg });
        }

        const metadata = await sock.groupMetadata(from).catch(()=>null);
        const senderJid = msg.key.participant || from;
        const p = metadata?.participants?.find(x=>x.id===senderJid);
        const isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin';
        if (!isAdmin) return sock.sendMessage(from, { text: "🚫 Só admins!" }, { quoted: msg });

        if (subCommand === 'on') {
            brincadeirasManager.ativar(from);
            return sock.sendMessage(from, { text: "✅ *Brincadeiras Ativadas!*" }, { quoted: msg });
        }
        if (subCommand === 'off') {
            brincadeirasManager.desativar(from);
            return sock.sendMessage(from, { text: "❌ *Brincadeiras Desativadas!*" }, { quoted: msg });
        }
    }
}
