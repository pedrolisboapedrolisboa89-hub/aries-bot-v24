const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../dados/familias.json');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ familias: {}, pedidos: {} }, null, 2));

function load() { return JSON.parse(fs.readFileSync(dbPath)); }
function save(d) { fs.writeFileSync(dbPath, JSON.stringify(d, null, 2)); }

function getJid(sock, msg) {
    let jid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (jid) return jid;
    // pega se respondeu mensagem
    let participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    return participant || null;
}

const nomesBebes = ["Enzo ♈", "Luna ♈", "Áries Jr", "Ayla", "Gael", "Maya", "Noah", "Sophia", "Theo", "Liz"];
const animais = ["🐶 Dog", "🐱 Gato", "🐰 Coelho", "🐹 Hamster", "🦜 Papagaio"];

module.exports = {
    comandos: ['namorar', 'casar', 'terfilhos', 'terfilho', 'filhos', 'familia', 'aceitar', 'recusar', 'divorciar', 'adotaranimal'],
    descricao: 'Sistema de família Áries',
    categoria: 'familia',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const cmd = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').split(' ')[0].replace('€','').toLowerCase();

        let db = load();
        let alvoJid = getJid(sock, msg);

        const getNome = async (jid) => {
            if (!isGroup) return jid.split('@')[0];
            try {
                let meta = await sock.groupMetadata(from);
                let p = meta.participants.find(x => x.id === jid);
                return p?.id?.split('@')[0] || jid.split('@')[0];
            } catch { return jid.split('@')[0]; }
        };

        // ===== NAMORAR =====
        if (cmd === 'namorar') {
            if (!alvoJid) return sock.sendMessage(from, { text: `❌ Marca a pessoa que queres namorar! Ex: €namorar @ela` }, { quoted: msg });
            if (alvoJid === sender) return sock.sendMessage(from, { text: `😂 Não dá pra namorar a ti mesmo!` }, { quoted: msg });
            if (db.familias[sender]?.parceiro) return sock.sendMessage(from, { text: `💔 Tu já tá namorando/casado! Usa €divorciar primeiro.` }, { quoted: msg });

            db.pedidos[alvoJid] = { tipo: 'namoro', de: sender, para: alvoJid, data: Date.now() };
            save(db);

            let nomeAlvo = await getNome(alvoJid);
            return await sock.sendMessage(from, {
                text: `💘 *PEDIDO DE NAMORO* 💘\n\n@${sender.split('@')[0]} pediu @${nomeAlvo} em namoro!\n\n@${nomeAlvo} digite:\n✅ €aceitar - para aceitar\n❌ €recusar - para recusar`,
                mentions: [sender, alvoJid]
            }, { quoted: msg });
        }

        // ===== CASAR =====
        if (cmd === 'casar') {
            if (!alvoJid) return sock.sendMessage(from, { text: `❌ Marca teu amor! Ex: €casar @ela` }, { quoted: msg });
            let minhaFamilia = db.familias[sender];
            if (!minhaFamilia || minhaFamilia.parceiro!== alvoJid) return sock.sendMessage(from, { text: `💔 Vocês precisam estar namorando primeiro! Usa €namorar` }, { quoted: msg });
            if (minhaFamilia.status === 'casado') return sock.sendMessage(from, { text: `💍 Vocês já são casados!` }, { quoted: msg });

            db.pedidos[alvoJid] = { tipo: 'casamento', de: sender, para: alvoJid, data: Date.now() };
            save(db);
            let nomeAlvo = await getNome(alvoJid);
            return await sock.sendMessage(from, {
                text: `💍 *PEDIDO DE CASAMENTO* 💍\n\n@${sender.split('@')[0]} pediu @${nomeAlvo} em CASAMENTO!\n\n@${nomeAlvo} aceita?\n✅ €aceitar\n❌ €recusar`,
                mentions: [sender, alvoJid]
            }, { quoted: msg });
        }

        // ===== ACEITAR / RECUSAR =====
        if (cmd === 'aceitar') {
            let pedido = db.pedidos[sender];
            if (!pedido) return sock.sendMessage(from, { text: `❌ Ninguém te pediu nada 😅` }, { quoted: msg });
            if (Date.now() - pedido.data > 60000*5) { delete db.pedidos[sender]; save(db); return sock.sendMessage(from, { text: `⏰ Pedido expirou (5 min)` }, { quoted: msg }); }

            if (pedido.tipo === 'namoro') {
                db.familias[pedido.de] = { parceiro: pedido.para, status: 'namorando', filhos: [], animais: [], casa: 0, desde: Date.now() };
                db.familias[pedido.para] = { parceiro: pedido.de, status: 'namorando', filhos: [], animais: [], casa: 0, desde: Date.now() };
                delete db.pedidos[sender]; save(db);
                return await sock.sendMessage(from, {
                    text: `💖 *VIRARAM CASAL!* 💖\n\n@${pedido.de.split('@')[0]} e @${pedido.para.split('@')[0]} agora estão NAMORANDO! ♈\n\nPróximo passo: €casar @`,
                    mentions: [pedido.de, pedido.para]
                });
            }
            if (pedido.tipo === 'casamento') {
                db.familias[pedido.de].status = 'casado';
                db.familias[pedido.para].status = 'casado';
                db.familias[pedido.de].casa = 1;
                db.familias[pedido.para].casa = 1;
                delete db.pedidos[sender]; save(db);
                return await sock.sendMessage(from, {
                    text: `💒 *CASARAM!* 💒\n\n@${pedido.de.split('@')[0]} e @${pedido.para.split('@')[0]} se CASARAM! Que o amor do Áries abençoe! ♈\n\nAgora vocês podem:\n👶 €terfilhos - ter um bebê\n🐶 €adotaranimal - adotar um pet\n🏠 €familia - ver sua família`,
                    mentions: [pedido.de, pedido.para]
                });
            }
        }

        if (cmd === 'recusar') {
            let pedido = db.pedidos[sender];
            if (!pedido) return sock.sendMessage(from, { text: `❌ Ninguém te pediu nada` }, { quoted: msg });
            let de = pedido.de;
            delete db.pedidos[sender]; save(db);
            return await sock.sendMessage(from, {
                text: `💔 @${sender.split('@')[0]} recusou o pedido de @${de.split('@')[0]} 😢`,
                mentions: [sender, de]
            });
        }

        // ===== TER FILHOS =====
        if (['terfilhos','terfilho','filhos'].includes(cmd)) {
            let f = db.familias[sender];
            if (!f || f.status!== 'casado') return sock.sendMessage(from, { text: `❌ Só quem é CASADO pode ter filhos! Casa primeiro com €casar` }, { quoted: msg });

            let nomeBebe = nomesBebes[Math.floor(Math.random()*nomesBebes.length)];
            let bebe = { nome: nomeBebe, nasc: Date.now() };
            db.familias[sender].filhos.push(bebe);
            db.familias[f.parceiro].filhos.push(bebe);
            db.familias[sender].casa += 1;
            db.familias[f.parceiro].casa += 1;
            save(db);

            return await sock.sendMessage(from, {
                text: `👶 *NASCEU UM BEBÊ!* 👶\n\nA família de @${sender.split('@')[0]} e @${f.parceiro.split('@')[0]} cresceu!\n\n👶 Nome: *${nomeBebe}*\n🏠 Casa nível: ${f.casa+1}\n\nVocês agora podem adotar um animal: €adotaranimal`,
                mentions: [sender, f.parceiro]
            });
        }

        if (cmd === 'adotaranimal') {
            let f = db.familias[sender];
            if (!f || f.status!== 'casado') return sock.sendMessage(from, { text: `❌ Só casados adotam pets` }, { quoted: msg });
            let pet = animais[Math.floor(Math.random()*animais.length)];
            db.familias[sender].animais.push(pet);
            db.familias[f.parceiro].animais.push(pet);
            save(db);
            return await sock.sendMessage(from, {
                text: `🐾 *NOVO PET!* 🐾\nFamília adotou um ${pet}!\n\nUse €familia para ver todos.`,
                mentions: [sender, f.parceiro]
            });
        }

        // ===== VER FAMILIA =====
        if (cmd === 'familia') {
            let alvo = alvoJid || sender;
            let f = db.familias[alvo];
            if (!f) return sock.sendMessage(from, { text: `👤 @${alvo.split('@')[0]} está solteiro(a) 😅`, mentions: [alvo] }, { quoted: msg });

            let parceiroNome = await getNome(f.parceiro);
            let filhosTxt = f.filhos.length? f.filhos.map(b=>` - ${b.nome}`).join('\n') : 'Nenhum ainda';
            let animaisTxt = f.animais.length? f.animais.join(', ') : 'Nenhum ainda';

            return await sock.sendMessage(from, {
                text: `👨‍👩‍👧‍👦 *FAMÍLIA ÁRIES* ♈\n\n💑 Casal: @${alvo.split('@')[0]} & @${parceiroNome}\n💌 Status: ${f.status.toUpperCase()}\n🏠 Casa Nível: ${f.casa}\n\n👶 Filhos (${f.filhos.length}):\n${filhosTxt}\n\n🐾 Pets: ${animaisTxt}\n\n💖 Juntos desde: ${new Date(f.desde).toLocaleDateString()}`,
                mentions: [alvo, f.parceiro]
            });
        }

        if (cmd === 'divorciar') {
            let f = db.familias[sender];
            if (!f) return sock.sendMessage(from, { text: `Tu nem namora 😅` }, { quoted: msg });
            let parceiro = f.parceiro;
            delete db.familias[sender];
            delete db.familias[parceiro];
            save(db);
            return await sock.sendMessage(from, {
                text: `💔 Divórcio feito. @${sender.split('@')[0]} e @${parceiro.split('@')[0]} se separaram.`,
                mentions: [sender, parceiro]
            });
        }
    }
};
