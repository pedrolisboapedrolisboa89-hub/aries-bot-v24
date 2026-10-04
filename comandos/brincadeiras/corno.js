module.exports = {
    comandos: ['corno','rankcorno','cornos'],
    descricao: 'Ranking dos cornos do grupo',
    categoria: 'brincadeiras',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            if (!from.endsWith("@g.us")) {
                return await sock.sendMessage(from, { text: "❌ Só em grupos!" }, { quoted: msg });
            }

            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;

            if (!participants || participants.length === 0) {
                return await sock.sendMessage(from, { text: "❌ Sem membros!" }, { quoted: msg });
            }

            const embaralhar = arr => arr.sort(() => Math.random() - 0.5);
            const participantesAleatorios = embaralhar(participants).slice(0, 5);

            const porcentagens = [99, 87, 72, 58, 43];
            const titulos = [
                "👑 *KORNO SUPREMO*",
                "🥈 *KORNO DE LUXO*",
                "🥉 *KORNO BRONZEADO*",
                "🪓 *KORNO SOFREDOR*",
                "🧢 *KORNO RECRUTA*"
            ];
            const frasesExtras = [
                "💔 Pegou a morena com o motoboy e ainda pediu carona!",
                "😵 Descobriu a traição, mas perdoou e virou padrasto.",
                "😂 Já foi corno 3 vezes e ainda chama de 'minha princesa'.",
                "😭 Disse que é mentira, mas o print não mente!",
                "😬 Disse que 'amor verdadeiro supera tudo'... e tomou mais um chifre!"
            ];

            let legenda = `╔══════════════════════════╗
║   🐮 *RANKING DOS KORNOS 2025* 🐮   ║
╚══════════════════════════╝

📸 *Análise feita com base em dados do grupo*  
📆 ${new Date().toLocaleDateString("pt-BR")}
───────────────────────────────
`;

            const mencionados = [];
            for (let i = 0; i < participantesAleatorios.length; i++) {
                const p = participantesAleatorios[i];
                const numero = p.id.split("@")[0];
                mencionados.push(p.id);
                legenda += `
${titulos[i]}
@${numero}
🔥 *Nível de cornice:* ${porcentagens[i]}%
${frasesExtras[i]}
───────────────────────────────`;
            }

            legenda += `
🏆 *Conclusão da Análise:*  
Esses são os *Top 5 Cornos Oficiais* do grupo!  
😂 Nenhum chifre foi poupado!

📷 *Eis a prova dos fatos abaixo!*`;

            await sock.sendMessage(from, {
                image: { url: "https://xatimg.com/image/tWO07MRj1mj8.jpg" },
                caption: legenda,
                mentions: mencionados
            }, { quoted: msg });

        } catch (e) {
            console.log('Erro corno:', e);
            await sock.sendMessage(from, { text: '⚠️ Erro no ranking 😂' }, { quoted: msg });
        }
    }
}
