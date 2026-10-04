const fs = require("fs");
const path = require("path");
const ARQUIVO = path.join(__dirname, "../aluguel.json");

// cria se não existir
if (!fs.existsSync(ARQUIVO)) fs.writeFileSync(ARQUIVO, "[]");

function getAluguel() {
    try { return JSON.parse(fs.readFileSync(ARQUIVO, "utf-8")); } catch { return []; }
}
function setAluguel(data) { fs.writeFileSync(ARQUIVO, JSON.stringify(data, null, 2)); }

function getAluguelByGrupo(groupId) {
    return getAluguel().find(i => i.id_gp === groupId) || null;
}

function adicionarContrato({ id_gp, nome_, link, responsavel_nome, responsavel_contato, plano_dias, valor, cadastrado_por }) {
    const lista = getAluguel();
    const idx = lista.findIndex(i => i.id_gp === id_gp);
    const agora = Date.now()/1000;
    const venc = agora + (plano_dias*86400);

    const contrato = {
        id_gp, nome_, link,
        responsavel_nome: responsavel_nome || "Não informado",
        responsavel_contato: responsavel_contato || "Não informado",
        data_aluguel: new Date().toISOString(),
        vencimento: venc,
        plano_dias: Number(plano_dias),
        valor: valor || "Não informado",
        aviso_3d_enviado: false,
        aviso_1d_enviado: false,
        cadastrado_por: cadastrado_por || "Dono",
    };
    if (idx >= 0) lista[idx] = contrato; else lista.push(contrato);
    setAluguel(lista);
    return contrato;
}

function renovarContrato(id_gp, dias) {
    const lista = getAluguel();
    const idx = lista.findIndex(i => i.id_gp === id_gp);
    if (idx < 0) return false;
    const c = lista[idx];
    const agora = Date.now()/1000;
    const base = c.vencimento > agora? c.vencimento : agora;
    c.vencimento = base + (dias*86400);
    c.plano_dias += Number(dias);
    c.aviso_3d_enviado = false; c.aviso_1d_enviado = false;
    lista[idx] = c; setAluguel(lista);
    return c;
}

function removerContrato(busca) {
    const lista = getAluguel();
    let idx = lista.findIndex(i => i.id_gp === busca);
    if (idx < 0 && busca.includes("chat.whatsapp.com")) {
        const code = busca.split("chat.whatsapp.com/").pop().trim();
        idx = lista.findIndex(i => i.link && i.link.includes(code));
    }
    if (idx < 0) {
        const b = busca.toLowerCase().trim();
        idx = lista.findIndex(i => i.nome_ && i.nome_.toLowerCase() === b);
    }
    if (idx < 0) return false;
    const r = lista[idx]; lista.splice(idx,1); setAluguel(lista);
    return r;
}

function formatarContrato(c) {
    const agora = Date.now()/1000;
    const rest = c.vencimento - agora;
    const dias = Math.floor(rest/86400);
    let status = rest < 0? "🔴 VENCIDO" : dias <=3? `🟡 VENCENDO em ${dias}d` : `🟢 ATIVO ${dias}d restantes`;
    return `📋 *CONTRATO*\n🏘️ ${c.nome_}\n${status}\n👤 ${c.responsavel_nome}\n📞 ${c.responsavel_contato}\n⏳ Vence: ${new Date(c.vencimento*1000).toLocaleString()}\n💰 ${c.valor}`;
}

function initAluguelScheduler(sock, numeroDono) {
    console.log("[ALUGUEL] Iniciado ✅");
    async function verificar() {
        if (!sock.sendMessage) return;
        const lista = getAluguel();
        const agora = Date.now()/1000;
        const donoJid = numeroDono+"@s.whatsapp.net";
        for (let i=0;i<lista.length;i++) {
            const c = lista[i];
            const rest = c.vencimento - agora;
            if (rest <= 0) {
                try { await sock.sendMessage(c.id_gp, { text: "⏰ *ALUGUEL ENCERRADO* - Bot saindo!" }); } catch {}
                try { await sock.groupLeave(c.id_gp); } catch {}
                try { await sock.sendMessage(donoJid, { text: `🔴 *ALUGUEL ENCERRADO*\n🏘️ ${c.nome_}\n👤 ${c.responsavel_nome}` }); } catch {}
                lista.splice(i,1); i--; setAluguel(lista);
            }
        }
    }
    verificar();
    setInterval(verificar, 3600*1000);
}

module.exports = { getAluguel, adicionarContrato, renovarContrato, removerContrato, formatarContrato, initAluguelScheduler, getAluguelByGrupo };
