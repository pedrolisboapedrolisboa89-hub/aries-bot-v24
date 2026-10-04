module.exports = {
    comandos: ['autoresposta', 'auto', 'autoresponder'],
    descricao: 'Configura resposta automática',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ Só em grupos!' }, { quoted: msg });
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(__dirname, '../../database/sistema/autoRespostas.json');

        function loadDB() {
            try { if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch {}
            return {};
        }
        function saveDB(db) {
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderPart = metadata.participants.find(p => p.id === senderJid);
            const isAdmin = senderPart?.admin === 'admin' || senderPart?.admin === 'superadmin';
            if (!isAdmin) return await sock.sendMessage(from, { text: '🚫 Só ADM pode configurar!' }, { quoted: msg });

            if (args.length === 0) {
                return await sock.sendMessage(from, {
                    text: `🤖 *AUTO RESPOSTA V24*\n\n✅ Adicionar: €auto [palavra] | [resposta]\n❌ Remover: €auto del [palavra]\n📋 Listar: €auto lista\n\nEx: €auto oi | Olá, sou o ÁRIES-BOT ♈`
                }, { quoted: msg });
            }

            const db = loadDB();
            if (!db[from]) db[from] = {};
            const sub = args[0].toLowerCase();

            if (sub === 'lista') {
                const keys = Object.keys(db[from]);
                if (keys.length === 0) return await sock.sendMessage(from, { text: '📋 Nenhuma auto-resposta configurada.' }, { quoted: msg });
                let lista = '📋 *AUTO RESPOSTAS:*\n\n';
                keys.forEach((k, i) => { lista += `${i+1}. *${k}* -> ${db[from][k].substring(0,40)}\n`; });
                return await sock.sendMessage(from, { text: lista }, { quoted: msg });
            }

            if (sub === 'del' || sub === 'apagar') {
                const keyword = args.slice(1).join(' ').toLowerCase();
                if (!keyword) return await sock.sendMessage(from, { text: '❌ Informe a palavra pra remover.' }, { quoted: msg });
                if (db[from][keyword]) {
                    delete db[from][keyword];
                    saveDB(db);
                    return await sock.sendMessage(from, { text: `✅ Removido *${keyword}*` }, { quoted: msg });
                } else return await sock.sendMessage(from, { text: `❌ Não achei *${keyword}*` }, { quoted: msg });
            }

            // Adicionar
            let keyword, response;
            const full = args.join(' ');
            if (full.includes('|')) {
                const parts = full.split('|');
                keyword = parts[0].trim().toLowerCase();
                response = parts.slice(1).join('|').trim();
            } else {
                keyword = args[0].toLowerCase();
                response = args.slice(1).join(' ');
            }
            if (!response) return await sock.sendMessage(from, { text: `❌ Defina a resposta!\nEx: €auto ${keyword} | sua resposta` }, { quoted: msg });

            db[from][keyword] = response;
            saveDB(db);
            await sock.sendMessage(from, { text: `✅ Sucesso!\nQuando falarem *"${keyword}"* vou responder.` }, { quoted: msg });

        } catch (e) {
            console.log('Erro auto:', e);
            await sock.sendMessage(from, { text: '❌ Erro no auto-resposta' }, { quoted: msg });
        }
    }
}
