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
    return msg.message?.extendedTextMessage?.contextInfo?.participant || null;
}

const nomesBebes = ["Enzo ♈", "Luna ♈", "Áries Jr", "Ayla", "Gael", "Maya", "Noah", "Sophia", "Theo", "Liz", "Heitor", "Helena"];
const animais = ["🐶 Dog", "🐱 Gato", "🐰 Coelho", "🐹 Hamster", "🦜 Papagaio", "🐢 Tartaruga"];

module.exports = {
    comandos: ['namorar', 'casar', 'terfilhos', 'terfilho', 'filhos', 'familia', 'aceitar', 'recusar', 'divorciar', 'adotaranimal'],
    descricao: 'Sistema de família Áries',
    categoria: 'familia',

    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const textoCompleto = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const cmd = textoCompleto.split(' ')[0].replace('€','').toLowerCase();

        let db = load();
        let alvoJid = getJid(sock, msg);

        // ===== NAMORAR =====
        if (cmd === 'namorar') {
            if (!alvoJid) return sock.sendMessage(from, { text: `❌ Marca a pessoa!\nEx: €namorar @Maria` }, { quoted: msg });
            if (alvoJid === sender) return sock.sendMessage(from, { text: `😂 Não dá pra namorar você mesmo!` }, { quoted: msg });
            if (db.familias[sender]?.parceiro) return sock.sendMessage(from, { text: `💔 Você já tem família! Use €divorciar para terminar.` }, { quoted: msg });
            if (db.familias[alvoJid]?.parceiro) return sock.sendMessage(from, { text: `💔 Essa pessoa já está comprometida!` }, { quoted: msg });

            db.pedidos[alvoJid] = { tipo: 'namoro', de: sender, para: alvoJid, data: Date.now() };
            save(db);
            return await sock.sendMessage(from, {
                text: `💘 *PEDIDO DE NAMORO* 💘\n\n@${sender.split('@')[0]} pediu @${alvoJid.split('@')[0]} em namoro!\n\n@${alvoJid.split('@')[0]} digite:\n✅ €aceitar\n❌ €recusar`,
                mentions: [sender, alvoJid]
            }, { quoted: msg });
        }

        // ===== CASAR =====
        if (cmd === 'casar') {
            if (!alvoJid) return sock.sendMessage(from, { text: `❌ Marca teu amor!\nEx: €casar @Maria` }, { quoted: msg });
            let minhaFamilia = db.familias[sender];
            if (!minhaFamilia || minhaFamilia.parceiro!== alvoJid) return sock.sendMessage(from, { text: `💔 Vocês precisam estar NAMORANDO primeiro!\nUse €namorar @` }, { quoted: msg });
            if (minhaFamilia.status === 'casado') return sock.sendMessage(from, { text: `💍 Vocês já são casados! Use €familia` }, { quoted: msg });

            db.pedidos[alvoJid] = { tipo: 'casamento', de: sender, para: alvoJid, data: Date.now() };
            save(db);
            return await sock.sendMessage(from, {
                text: `💍 *PEDIDO DE CASAMENTO* 💍\n\n@${sender.split('@')[0]} pediu @${alvoJid.split('@')[0]} em CASAMENTO! 💒\n\n@${alvoJid.split('@')[0]} aceita?\n✅ €aceitar\n❌ €recusar`,
                mentions: [sender, alvoJid]
            }, { quoted: msg });
        }

        // ===== ACEITAR / RECUSAR =====
        if (cmd === 'aceitar') {
            let pedido = db.pedidos[sender];
            if (!pedido) return sock.sendMessage(from, { text: `❌ Ninguém te pediu em namoro/casamento 😅\n\nUse €namorar @alguém para começar.` }, { quoted: msg });
            if (Date.now() - pedido.data > 1000*60*5) { delete db.pedidos[sender]; save(db); return sock.sendMessage(from, { text: `⏰ Pedido expirou (5 min)` }, { quoted: msg }); }

            if (pedido.tipo === 'namoro') {
                db.familias[pedido.de] = { parceiro: pedido.para, status: 'namorando', filhos: [], animais: [], casa: 1, desde: Date.now() };
                db.familias[pedido.para] = { parceiro: pedido.de, status: 'namorando', filhos: [], animais: [], casa: 1, desde: Date.now() };
                delete db.pedidos[sender]; save(db);
                return await sock.sendMessage(from, {
                    text: `💖 *VIRARAM CASAL!* 💖\n\n@${pedido.de.split('@')[0]} ❤️ @${pedido.para.split('@')[0]} agora estão NAMORANDO! ♈\n\nPróximo passo: €casar @${pedido.para.split('@')[0]}`,
                    mentions: [pedido.de, pedido.para]
                });
            }
            if (pedido.tipo === 'casamento') {
                db.familias[pedido.de].status = 'casado';
                db.familias[pedido.para].status = 'casado';
                db.familias[pedido.de].casa = 2;
                db.familias[pedido.para].casa = 2;
                delete db.pedidos[sender]; save(db);
                return await sock.sendMessage(from, {
                    text: `💒 *CASAMENTO ÁRIES!* 💒\n\n@${pedido.de.split('@')[0]} e @${pedido.para.split('@')[0]} se CASARAM! ♈💍\n\n🏠 Casa própria adquirida!\n👶 Agora use €terfilhos\n🐾 €adotaranimal\n👨‍👩‍👧 €familia para ver`,
                    mentions: [pedido.de, pedido.para]
                });
            }
        }

        if (cmd === 'recusar') {
            let pedido = db.pedidos[sender];
            if (!pedido) return sock.sendMessage(from, { text: `❌ Ninguém te pediu nada 😅` }, { quoted: msg });
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
            if (!f) return sock.sendMessage(from, { text: `👤 *VOCÊ NÃO TEM FAMÍLIA* ♈\n\nVocê está SOLTEIRO(A) 😅\n\n💡 Comece assim:\n1️⃣ €namorar @alguém\n2️⃣ €casar @alguém\n3️⃣ €terfilhos` }, { quoted: msg });
            if (f.status!== 'casado') return sock.sendMessage(from, { text: `💍 Vocês precisam CASAR antes de ter filhos!\nUse €casar @${f.parceiro.split('@')[0]}`, mentions: [f.parceiro] }, { quoted: msg });

            let nomeBebe = nomesBebes[Math.floor(Math.random()*nomesBebes.length)];
            let bebe = { nome: nomeBebe, nasc: Date.now() };
            db.familias[sender].filhos.push(bebe);
            db.familias[f.parceiro].filhos.push(bebe);
            db.familias[sender].casa += 1;
            db.familias[f.parceiro].casa += 1;
            save(db);

            return await sock.sendMessage(from, {
                text: `👶 *NASCEU UM BEBÊ!* 👶\n\nFamília de @${sender.split('@')[0]} & @${f.parceiro.split('@')[0]}\n\n👶 Nome: *${nomeBebe}*\n🏠 Casa nível: ${f.casa+1}\n\n🐾 Adote um pet: €adotaranimal`,
                mentions: [sender, f.parceiro]
            });
        }

        if (cmd === 'adotaranimal') {
            let f = db.familias[sender];
            if (!f) return sock.sendMessage(from, { text: `👤 Você não tem família ainda! Use €namorar` }, { quoted: msg });
            if (f.status!== 'casado') return sock.sendMessage(from, { text: `❌ Só casados podem adotar pets!` }, { quoted: msg });
            let pet = animais[Math.floor(Math.random()*animais.length)];
            db.familias[sender].animais.push(pet);
            db.familias[f.parceiro].animais.push(pet);
            save(db);
            return await sock.sendMessage(from, {
                text: `🐾 *NOVO PET!* 🐾\nFamília adotou um ${pet}!\n\n👨‍👩‍👧 €familia para ver`,
                mentions: [sender, f.parceiro]
            });
        }

        // ===== VER FAMILIA - AQUI TAVA A FALHA =====
        if (cmd === 'familia') {
            let alvo = alvoJid || sender;
            let f = db.familias[alvo];

            // MENSAGEM QUANDO NÃO TEM FAMÍLIA
            if (!f) {
                return await sock.sendMessage(from, {
                    text: `👤 *FAMÍLIA ÁRIES* ♈\n\n@${alvo.split('@')[0]} está *SOLTEIRO(A)* 😅💔\n\nAinda não tem nenhuma família!\n\n💡 Começa tua história de amor:\n\n💘 €namorar @alguém - pede em namoro\n💍 €casar @alguém - pede em casamento\n👶 €terfilhos - tenha um bebê (só casados)\n🐾 €adotaranimal - adote um pet\n💔 €divorciar - termina tudo\n\n♈ Áries-Bot V24 te ajuda a construir!`,
                    mentions: [alvo]
                }, { quoted: msg });
            }

            let filhosTxt = f.filhos.length? f.filhos.map(b=>` • ${b.nome}`).join('\n') : ' _Nenhum ainda, use €terfilhos_ ';
            let animaisTxt = f.animais.length? f.animais.join(', ') : ' _Nenhum ainda, use €adotaranimal_ ';

            return await sock.sendMessage(from, {
                text: `👨‍👩‍👧‍👦 *FAMÍLIA ÁRIES* ♈\n\n💑 Casal: @${alvo.split('@')[0]} & @${f.parceiro.split('@')[0]}\n💌 Status: *${f.status.toUpperCase()}*\n🏠 Casa Nível: ${f.casa}\n\n👶 Filhos (${f.filhos.length}):\n${filhosTxt}\n\n🐾 Pets (${f.animais.length}): ${animaisTxt}\n\n💖 Juntos desde: ${new Date(f.desde).toLocaleDateString('pt-AO')}\n\n♈ Áries-Bot V24`,
                mentions: [alvo, f.parceiro]
            }, { quoted: msg });
        }

        if (cmd === 'divorciar') {
            let f = db.familias[sender];
            if (!f) return sock.sendMessage(from, { text: `😅 Você nem tem família para divorciar!\nUse €namorar @alguém` }, { quoted: msg });
            let parceiro = f.parceiro;
            delete db.familias[sender];
            delete db.familias[parceiro];
            save(db);
            return await sock.sendMessage(from, {
                text: `💔 *DIVÓRCIO* 💔\n\n@${sender.split('@')[0]} e @${parceiro.split('@')[0]} se separaram e a família acabou 😢\n\nAgora estão solteiros novamente.`,
                mentions: [sender, parceiro]
            });
        }
    }
};
