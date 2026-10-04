module.exports = {
    comandos: ['dono','userinfo','infodono','id'],
    descricao: 'Painel info do usuário',
    categoria: 'dono',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            const sender = msg.key?.participant || msg.key?.remoteJid || "";
            const numero = sender?.split("@")[0] || "Desconhecido";
            const nome = msg.pushName || "Desconhecido";

            let cargo = "Membro";
            let grupoId = from;
            let grupoNome = "Privado";

            if (from.endsWith("@g.us")) {
                const meta = await sock.groupMetadata(from).catch(()=>null);
                if (meta) {
                    grupoNome = meta.subject || "Grupo";
                    const participante = meta.participants.find(p => p.id === sender);
                    if (participante?.admin === "admin") cargo = "Admin";
                    if (participante?.admin === "superadmin") cargo = "Dono do grupo";
                }
            }

            let foto = null;
            try { foto = await sock.profilePictureUrl(sender, "image"); } catch {}

            const botNome = sock.user?.name || "Bot";
            const botId = sock.user?.id || "—";
            const msgId = msg.key?.id || "Desconhecido";
            const timestamp = msg.messageTimestamp? new Date(msg.messageTimestamp * 1000).toLocaleString() : "";

            const painel = `
╔══════════════╗
║ 👤 USER INFO ║
╚══════════════╝

🪪 IDENTIDADE
━━━━━━━━━━━━━━━━
• Nome: ${nome}
• ID: ${sender}
• Número: ${numero}

👥 GRUPO
━━━━━━━━━━━━━━━━
• Nome: ${grupoNome}
• Cargo: ${cargo}
• ID: ${grupoId}

📨 EVENTO
━━━━━━━━━━━━━━━━
• Msg ID: ${msgId}
• Horário: ${timestamp}

📱 CONTA
━━━━━━━━━━━━━━━━
• Nome: ${botNome}
• ID: ${botId}

══════════════════════
🔍 Diagnóstico completo
══════════════════════
`;

            if (foto) {
                await sock.sendMessage(from, { image: { url: foto }, caption: painel }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: painel }, { quoted: msg });
            }

        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Erro ao gerar relatório:\n" + err.message }, { quoted: msg });
        }
    }
}
