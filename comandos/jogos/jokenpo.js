const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/jokenpo.json');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}), 'utf8');

function loadData() {
    try { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch { return {}; }
}
function saveData(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8'); }

const NIVEIS = [
    { nome: "Fácil", vitoriasNecessarias: 0, chanceVitoriaMaquina: 30, pontos: 10 },
    { nome: "Médio", vitoriasNecessarias: 5, chanceVitoriaMaquina: 40, pontos: 20 },
    { nome: "Difícil", vitoriasNecessarias: 10, chanceVitoriaMaquina: 50, pontos: 30 },
    { nome: "Expert", vitoriasNecessarias: 20, chanceVitoriaMaquina: 60, pontos: 50 },
    { nome: "Mestre", vitoriasNecessarias: 35, chanceVitoriaMaquina: 70, pontos: 75 },
    { nome: "Lendário", vitoriasNecessarias: 50, chanceVitoriaMaquina: 80, pontos: 100 }
];

function getStatus(userId) {
    const data = loadData();
    if (!data[userId]) {
        data[userId] = { vitorias: 0, derrotas: 0, empates: 0, pontos: 0, nivelAtual: "Fácil" };
        saveData(data);
    }
    return data[userId];
}
function getNivelInfo(vitorias) {
    let nivelAtual = NIVEIS[0];
    for (const nivel of NIVEIS) {
        if (vitorias >= nivel.vitoriasNecessarias) nivelAtual = nivel; else break;
    }
    return nivelAtual;
}

module.exports = {
    comandos: ['jokenpo','ppt','pedrapapel'],
    descricao: 'Jokenpo progressivo vs bot',
    categoria: 'jogos',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderName = msg.pushName || "Jogador";
        const escolhaJogador = args[0]?.toLowerCase();
        const status = getStatus(sender);
        const nivelInfo = getNivelInfo(status.vitorias);
        status.nivelAtual = nivelInfo.nome;

        if (!escolhaJogador ||!['pedra','papel','tesoura'].includes(escolhaJogador)) {
            let menu = `🎮 *JOKENPÔ - DESAFIO PROGRESSIVO* 🎮\n\n👤 *Jogador:* ${senderName}\n🏆 *Nível:* ${status.nivelAtual}\n📈 *Vitórias:* ${status.vitorias}\n💰 *Pontos:* ${status.pontos}\n\n*Como jogar:*\nDigite: *€jokenpo [pedra, papel ou tesoura]*\n\n*Dificuldade Atual:* ${nivelInfo.nome}\n🤖 Chance máquina: ${nivelInfo.chanceVitoriaMaquina}%\n`;
            const proximo = NIVEIS.find(n => n.vitoriasNecessarias > status.vitorias);
            if (proximo) menu += `🚀 Faltam ${proximo.vitoriasNecessarias - status.vitorias} vitórias para *${proximo.nome}*!`;
            else menu += `🔥 Nível máximo!`;
            return sock.sendMessage(from, { text: menu }, { quoted: msg });
        }

        const random = Math.floor(Math.random() * 101);
        const venceDe = { 'pedra':'papel', 'papel':'tesoura', 'tesoura':'pedra' };
