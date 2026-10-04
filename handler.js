const fs = require('fs');
const path = require('path');
const prefix = '€';
const listaComandos = [];
const mensagens = require('./mensagens/mensagens');

// CARREGA COMANDOS DE TODAS AS SUBPASTAS: geral, adm, dono
function carregarPasta(caminho) {
    if (!fs.existsSync(caminho)) return;
    for (let item of fs.readdirSync(caminho)) {
        let full = path.join(caminho, item);
        if (fs.statSync(full).isDirectory()) {
            carregarPasta(full); // entra nas subpastas
        } else if (item.endsWith('.js')) {
            try {
                let cmd = require(full);
                listaComandos.push(cmd);
                console.log(`[♈] Carregado: ${item}`);
            } catch (e) {
                console.log(`[❌] Erro em ${item}: ${e.message}`);
            }
        }
    }
}

const pasta = path.join(__dirname, 'comandos');
if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
carregarPasta(pasta);

async function handleMessage(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const txt = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || '';
        if (!txt.startsWith(prefix)) return;

        const nome = txt.slice(1).split(' ')[0].toLowerCase();
        const args = txt.slice(1).split(/ +/).slice(1);
        let achou = false;

        for (let c of listaComandos) {
            if (c.comandos && c.comandos.includes(nome)) {
                achou = true;
                await sock.sendMessage(from, { react: { text: '♈', key: msg.key } });
                await c.run(sock, msg, args);
                break;
            }
        }

        if (!achou) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            await sock.sendMessage(from, {
                text: mensagens.comandoNaoExiste(prefix, nome)
            }, { quoted: msg });
        }

    } catch (e) { console.log('ERRO HANDLE:', e.message) }
}

module.exports = { handleMessage };
