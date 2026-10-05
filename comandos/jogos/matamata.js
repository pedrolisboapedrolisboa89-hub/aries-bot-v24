const jogos = new Map();

const EMOJIS = [
  { emoji: "🐶", nomes: ["cachorro", "cao", "dog"] },
  { emoji: "🐱", nomes: ["gato", "cat"] },
  { emoji: "🐭", nomes: ["rato", "rat"] },
  { emoji: "🐹", nomes: ["hamster"] },
  { emoji: "🐰", nomes: ["coelho", "bunny"] },
  { emoji: "🦊", nomes: ["raposa", "fox"] },
  { emoji: "🐻", nomes: ["urso", "bear"] },
  { emoji: "🐼", nomes: ["panda"] },
  { emoji: "🐨", nomes: ["coala"] },
  { emoji: "🐯", nomes: ["tigre", "tiger"] },
  { emoji: "🦁", nomes: ["leao", "leão", "lion"] },
  { emoji: "🐮", nomes: ["vaca", "cow"] },
  { emoji: "🐷", nomes: ["porco", "pig"] },
  { emoji: "🐸", nomes: ["sapo", "frog"] },
  { emoji: "🐵", nomes: ["macaco", "monkey"] },
  { emoji: "🐔", nomes: ["galinha", "frango", "chicken"] },
  { emoji: "🐧", nomes: ["pinguim", "penguin"] },
  { emoji: "🐦", nomes: ["passaro", "pássaro", "bird"] },
  { emoji: "🐤", nomes: ["pintinho"] },
  { emoji: "🦆", nomes: ["pato", "duck"] },
  { emoji: "🦅", nomes: ["aguia", "águia", "eagle"] },
  { emoji: "🦉", nomes: ["coruja", "owl"] },
  { emoji: "🦇", nomes: ["morcego", "bat"] },
  { emoji: "🐺", nomes: ["lobo", "wolf"] },
  { emoji: "🐗", nomes: ["javali"] },
  { emoji: "🐴", nomes: ["cavalo", "horse"] },
  { emoji: "🦄", nomes: ["unicornio", "unicórnio"] },
  { emoji: "🐝", nomes: ["abelha", "bee"] },
  { emoji: "🐛", nomes: ["lagarta", "worm"] },
  { emoji: "🦋", nomes: ["borboleta", "butterfly"] },
  { emoji: "🐌", nomes: ["caracol", "lesma", "snail"] },
  { emoji: "🐞", nomes: ["joaninha"] },
  { emoji: "🐜", nomes: ["formiga", "ant"] },
  { emoji: "🦟", nomes: ["mosquito"] },
  { emoji: "🦀", nomes: ["caranguejo", "crab"] },
  { emoji: "🐍", nomes: ["cobra", "snake"] },
  { emoji: "🐢", nomes: ["tartaruga", "turtle"] },
  { emoji: "🍏", nomes: ["maca verde", "maçã verde"] },
  { emoji: "🍎", nomes: ["maca", "maçã", "apple"] },
  { emoji: "🍐", nomes: ["pera", "pear"] },
  { emoji: "🍊", nomes: ["laranja", "orange"] },
  { emoji: "🍋", nomes: ["limao", "limão", "lemon"] },
  { emoji: "🍌", nomes: ["banana"] },
  { emoji: "🍉", nomes: ["melancia", "watermelon"] },
  { emoji: "🍇", nomes: ["uva", "uvas", "grape"] },
  { emoji: "🍓", nomes: ["morango", "strawberry"] },
  { emoji: "🫐", nomes: ["mirtilo", "blueberry"] },
  { emoji: "🍈", nomes: ["melao", "melão"] },
  { emoji: "🍒", nomes: ["cereja", "cherry"] },
  { emoji: "🍑", nomes: ["pessego", "pêssego", "peach"] },
  { emoji: "🥭", nomes: ["manga"] },
  { emoji: "🍍", nomes: ["abacaxi", "pineapple"] },
  { emoji: "🥥", nomes: ["coco", "coconut"] },
  { emoji: "🥝", nomes: ["kiwi"] },
  { emoji: "🍅", nomes: ["tomate", "tomato"] },
  { emoji: "🍆", nomes: ["berinjela", "eggplant"] },
  { emoji: "🥑", nomes: ["abacate", "avocado"] },
  { emoji: "🥦", nomes: ["brocolis", "brócolis", "broccoli"] },
  { emoji: "🥬", nomes: ["alface", "lettuce"] },
  { emoji: "🌽", nomes: ["milho", "corn"] },
  { emoji: "🌶️", nomes: ["pimenta", "pepper"] },
  { emoji: "🍄", nomes: ["cogumelo", "mushroom"] },
  { emoji: "🥜", nomes: ["amendoim", "peanut"] },
  { emoji: "🍞", nomes: ["pao", "pão", "bread"] },
  { emoji: "🥐", nomes: ["croissant"] },
  { emoji: "🥖", nomes: ["baguete"] },
  { emoji: "🧀", nomes: ["queijo", "cheese"] },
  { emoji: "🥚", nomes: ["ovo", "egg"] },
  { emoji: "🍳", nomes: ["ovo frito", "fritada"] },
  { emoji: "🧈", nomes: ["manteiga", "butter"] },
  { emoji: "🥞", nomes: ["panqueca", "pancake"] },
  { emoji: "🍗", nomes: ["coxa", "frango"] },
  { emoji: "🍖", nomes: ["carne", "meat"] },
  { emoji: "🌭", nomes: ["cachorro quente", "hotdog"] },
  { emoji: "🍔", nomes: ["hamburguer", "hambúrguer", "burger"] },
  { emoji: "🍟", nomes: ["batata frita", "batata"] },
  { emoji: "🍕", nomes: ["pizza"] },
  { emoji: "🥪", nomes: ["sanduiche", "sanduíche"] },
  { emoji: "🌮", nomes: ["taco"] },
  { emoji: "🌯", nomes: ["burrito"] },
  { emoji: "🥗", nomes: ["salada", "salad"] },
  { emoji: "🍿", nomes: ["pipoca", "popcorn"] },
  { emoji: "⚽", nomes: ["bola", "futebol", "soccer"] },
  { emoji: "🏀", nomes: ["basquete", "basket"] },
  { emoji: "🏈", nomes: ["futebol americano"] },
  { emoji: "⚾", nomes: ["beisebol", "baseball"] },
  { emoji: "🎾", nomes: ["tenis", "tênis", "tennis"] },
  { emoji: "🏐", nomes: ["volei", "vôlei", "volley"] },
  { emoji: "🎱", nomes: ["sinuca", "bilhar", "8ball"] },
  { emoji: "🥊", nomes: ["boxe", "luva"] },
  { emoji: "🏆", nomes: ["trofeu", "troféu", "taça", "trophy"] },
  { emoji: "🚗", nomes: ["carro", "car"] },
  { emoji: "🚕", nomes: ["taxi", "táxi"] },
  { emoji: "🚙", nomes: ["suv", "carro"] },
  { emoji: "🚌", nomes: ["onibus", "ônibus", "bus"] },
  { emoji: "🚓", nomes: ["policia", "polícia", "police"] },
  { emoji: "🚑", nomes: ["ambulancia", "ambulância"] },
  { emoji: "🚒", nomes: ["bombeiro", "fire"] },
  { emoji: "🚜", nomes: ["trator", "tractor"] },
  { emoji: "✈️", nomes: ["aviao", "avião", "plane"] },
  { emoji: "🚀", nomes: ["foguete", "rocket"] },
  { emoji: "💀", nomes: ["caveira", "morte", "skull"] },
  { emoji: "👻", nomes: ["fantasma", "ghost"] },
];

function getVidasTxt(vidas){
  return "❤️".repeat(vidas) + "💔".repeat(5 - vidas);
}

module.exports = {
  comandos: ["matamata", "mata-mata"],
  descricao: "Jogo mata-mata de emojis",

  async onMessage(sock, msg, from, txt) {
    let jogo = jogos.get(from);
    if (!jogo) return false;
    let lower = txt.toLowerCase().trim();

    if (!jogo.iniciado && lower.includes("up") && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      let id = msg.key.participant || msg.key.remoteJid;
      if (jogo.jogadores.has(id)) return false;
      jogo.jogadores.set(id, { id, vidas: 5, nome: msg.pushName || "Jogador" });
      await sock.sendMessage(from, { text: `✅ @${id.split('@')[0]} entrou! ${getVidasTxt(5)} (${jogo.jogadores.size} jog.)`, mentions: [id] });
      return true;
    }

    if (lower === "matamata inicio" || lower === "matamata início") {
      if (jogo.iniciado) return false;
      if (jogo.jogadores.size < 2) {
        await sock.sendMessage(from, { text: `❌ Precisa de no mínimo 2 jogadores com *up* marcando o bot` });
        return true;
      }
      jogo.iniciado = true;
      jogo.atual = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      jogo.respondido = false;
      await sock.sendMessage(from, { text: `🔥 *MATA-MATA INICIADO!* 🔥\n\nJogadores: ${jogo.jogadores.size}\nTodos com 5 vidas ❤️❤️❤️❤️❤️\n\nPrimeiro emoji:\n\n${jogo.atual.emoji}\n\nQual o nome? Digite rápido!` });
      return true;
    }

    if (jogo.iniciado &&!jogo.respondido && jogo.atual) {
      let id = msg.key.participant || msg.key.remoteJid;
      if (!jogo.jogadores.has(id)) return false;
      let jogador = jogo.jogadores.get(id);
      if (jogador.vidas <= 0) return false;
      if (jogo.atual.nomes.some(n => lower.includes(n))) {
        jogo.respondido = true;
        jogo.ultimoAcertador = id;
        await sock.sendMessage(from, { text: `🎯 @${id.split('@')[0]} acertou! É *${jogo.atual.emoji} = ${jogo.atual.nomes[0]}*\n\nAgora digite: *matar @pessoa* pra tirar 1 vida!`, mentions: [id] });
        return true;
      }
    }

    if (lower.startsWith("matar ")) {
      let jogo = jogos.get(from);
      if (!jogo ||!jogo.iniciado ||!jogo.ultimoAcertador) return false;
      let id = msg.key.participant || msg.key.remoteJid;
      if (id!== jogo.ultimoAcertador) {
        await sock.sendMessage(from, { text: `❌ Só quem acertou pode matar agora!` });
        return true;
      }
      let mencionados = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mencionados.length === 0) {
        await sock.sendMessage(from, { text: `❌ Marque quem quer matar. Ex: matar @fulano` });
        return true;
      }
      let alvoId = mencionados[0];
      if (!jogo.jogadores.has(alvoId) || alvoId === id) {
        await sock.sendMessage(from, { text: `❌ Alvo inválido.` });
        return true;
      }
      let alvo = jogo.jogadores.get(alvoId);
      alvo.vidas--;
      let texto = `💥 @${id.split('@')[0]} ATIROU em @${alvoId.split('@')[0]}!\n${alvo.nome} agora tem ${getVidasTxt(alvo.vidas)} (${alvo.vidas}/5)`;
      if (alvo.vidas <= 0) {
        texto += `\n\n💀 @${alvoId.split('@')[0]} MORREU!`;
        jogo.jogadores.delete(alvoId);
      }
      if (jogo.jogadores.size === 1) {
        let vencedor = [...jogo.jogadores.values()][0];
        texto += `\n\n🏆 *FIM DE JOGO!* Vencedor: @${vencedor.id.split('@')[0]} com ${getVidasTxt(vencedor.vidas)}`;
        jogos.delete(from);
        await sock.sendMessage(from, { text: texto, mentions: [id, alvoId, vencedor.id] });
        return true;
      }
      jogo.atual = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      jogo.respondido = false;
      jogo.ultimoAcertador = null;
      texto += `\n\nPróximo:\n${jogo.atual.emoji} - Qual o nome?`;
      await sock.sendMessage(from, { text: texto, mentions: [id, alvoId] });
      return true;
    }
    return false;
  },

  async run(sock, msg, args) {
    const from = msg.key.remoteJid;
    if (jogos.has(from)) {
      await sock.sendMessage(from, { text: `Já tem mata-mata rolando! Digite *up* marcando o bot pra entrar, ou *matamata inicio*` });
      return;
    }
    jogos.set(from, { jogadores: new Map(), iniciado: false, criador: msg.key.participant || msg.key.remoteJid, atual: null, respondido: false, ultimoAcertador: null });
    await sock.sendMessage(from, { text: `🎮 *MATA-MATA CRIADO!* 🎮\n\nQuem quiser jogar marque o bot e digite *up*\nEx: @bot up\n\nVidas: ❤️❤️❤️❤️❤️\n\nQuando todos entrarem:\n*matamata inicio*\n\nCriador: @${(msg.key.participant || msg.key.remoteJid).split('@')[0]}`, mentions: [msg.key.participant || msg.key.remoteJid] });
  }
};

global.matamataHandler = module.exports.onMessage;
