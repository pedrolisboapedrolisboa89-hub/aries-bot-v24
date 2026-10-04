const config = require('../../settings/config');

module.exports = {
    comandos: ['configbot','configurar'],
    descricao: 'Mostra como configurar o bot',
    categoria: 'dono',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const prefixo = config.bot.prefixo || '€';
        
        const texto = `⚙️ *CONFIGURAR O BOT*
━━━━━━━━━━━━━━━━━

🔑 *SER DONO DO BOT*
📌 Já configurado:
• Nome: ${config.dono.nome}
• Número: ${config.dono.numero_puro}
• Bot: ${config.bot.nome}

━━━━━━━━━━━━━━━━━
👥 *SUB-DONOS*
━━━━━━━━━━━━━━━━━
📌 ${prefixo}dono2 <nº> — 2º dono
📌 ${prefixo}dono3 <nº> — 3º dono

━━━━━━━━━━━━━━━━━
✏️ *PERSONALIZAR*
━━━━━━━━━━━━━━━━━
📌 ${prefixo}nome-bot <nome>
📌 ${prefixo}nick-dono <apelido>
📌 ${prefixo}prefixo-bot <símbolo>

🖼️ *MUDAR FOTO DO MENU*
📌 ${prefixo}fotomenu — Marque uma foto

━━━━━━━━━━━━━━━━━
🔄 *ATIVAÇÕES*
━━━━━━━━━━━━━━━━━
📌 ${prefixo}modoregistro
📌 ${prefixo}aniversario
📌 ${prefixo}modogold
📌 ${prefixo}status`;

        await sock.sendMessage(from, { text: texto }, { quoted: msg });
    }
}
