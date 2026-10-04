const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/jogoDaVelha.json');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}), 'utf8');

function loadData() {
    try { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch { return {}; }
}
function saveData(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8'); }

function checkWin(board) {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of winPatterns) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes(null)? null : 'draw';
}
function renderBoard(board) {
    const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
    const b = board.map((v,i) => v || emojis[i]);
    return ` ${b[0]} | ${b[1]} | ${b[2]} \n----------- \n ${b[3]} | ${b[4]} | ${b[5]} \n----------- \n ${b[6]} | ${b[7]} | ${b[8]} `;
}

module.exports = {
    comandos: ['velha','jogodavelha','jogo'],
    descricao: 'Jogo da velha PvP',
    categoria: 'jogos',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const prefix = "€";
        const data = loadData();

        if (body.startsWith(prefix + 'rv')) {
            if (data[from]) {
                delete data[from];
                saveData(data);
                return sock.sendMessage(from, { text: "> 🔄 Jogo resetado." }, { quoted: msg });
            }
            return sock.sendMessage(from, { text: "⚠️ Não há partida em andamento." }, { quoted: msg });
        }

        if (!data[from]) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mentioned) {
                return sock.sendMessage(from, { text: `🎮 *JOGO DA VELHA (PvP)*\n\nPara desafiar: *${prefix}velha @usuario*` }, { quoted: msg });
            }
            if (mentioned === sender) return sock.sendMessage(from, { text: "⚠️ Não pode desafiar a si mesmo!" }, { quoted: msg });

            data[from] = {
                p1: sender, p2: mentioned,
                board: Array(9).fill(null),
                turn: sender, status: 'waiting',
                symbols: { [sender]: '❌', [mentioned]: '⭕' }
            };
            saveData(data);
            return sock.sendMessage(from, {
                text: `『📌 ESPERANDO OPONENTE ⚔️』\n\n@${sender.split('@')[0]} desafiou @${mentioned.split('@')[0]}!\n\nUse S para aceitar ou N para recusar.\nReset:!rv`,
                mentions: [sender, mentioned]
            }, { quoted: msg });
        }

        const game = data[from];

        if (game.status === 'waiting') {
            if (sender!== game.p2) return;
            const response = body.trim().toUpperCase();
            if (response === 'S') {
                game.status = 'playing'; saveData(data);
                return sock.sendMessage(from, {
                    text: `✅ Aceito!\n\n❌: @${game.p1.split('@')[0]}\n⭕: @${game.p2.split('@')[0]}\n\n${renderBoard(game.board)}\n\n> 🎯 Vez de @${game.turn.split('@')[0]} (❌)`,
                    mentions: [game.p1, game.p2]
                }, { quoted: msg });
            } else if (response === 'N') {
                delete data[from]; saveData(data);
                return sock.sendMessage(from, { text: "> ❌ Desafio recusado." }, { quoted: msg });
            }
            return;
        }

        if (game.status === 'playing') {
            const input = body.trim().replace(/[^1-9]/g, '');
            if (/^[1-9]$/.test(input)) {
                if (sender!== game.p1 && sender!== game.p2) return;
                if (sender!== game.turn) return sock.sendMessage(from, { text: "⚠️ Não é sua vez!" }, { quoted: msg });
                const move = parseInt(input) - 1;
                if (game.board[move]!== null) return sock.sendMessage(from, { text: "⚠️ Posição ocupada!" }, { quoted: msg });

                game.board[move] = game.symbols[sender];
                const result = checkWin(game.board);
                if (result) {
                    let msgFinal = renderBoard(game.board) + "\n\n";
                    if (result === 'draw') msgFinal += "🤝 Empate!";
                    else msgFinal += `🏆 @${sender.split('@')[0]} venceu!`;
                    delete data[from]; saveData(data);
                    return sock.sendMessage(from, { text: msgFinal, mentions: [sender] }, { quoted: msg });
                }
                game.turn = game.turn === game.p1? game.p2 : game.p1;
                saveData(data);
                return sock.sendMessage(from, {
                    text: `${renderBoard(game.board)}\n\n> 🎯 Vez de @${game.turn.split('@')[0]} (${game.symbols[game.turn]})`,
                    mentions: [game.turn]
                }, { quoted: msg });
            }
        }
    }
}
