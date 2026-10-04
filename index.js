const fs = require('fs');
var qrcode = './qr-code';

const NUMERO_BOT = '244933353188';
const NUMERO_DONO = '244958137017';

async function start(){
  const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = await import('@systemzero/baileys');
  const { Boom } = await import('@hapi/boom');
  const NodeCache = (await import('node-cache')).default;
  const msgRetryCounterCache = new NodeCache();
  const pino = (await import('pino')).default;
  const logger = pino({level:'silent'});

  if(!fs.existsSync(qrcode)) fs.mkdirSync(qrcode, {recursive:true});
  const { state, saveCreds } = await useMultiFileAuthState(qrcode);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger, version, browser: Browsers.ubuntu('Chrome'),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
    msgRetryCounterCache,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  if(!sock.authState.creds.registered){
    console.log(`♈ Gerando codigo para BOT ${NUMERO_BOT}...`);
    await new Promise(r=>setTimeout(r,5000));
    try{
      const code = await sock.requestPairingCode(NUMERO_BOT);
      console.log(`\n\n======== CÓDIGO ÁRIES-BOT 933353188: ${code} ========\n`);
    }catch(e){
      console.log('ERRO: '+e.message);
      if(e.message.includes('405')){
        console.log('⚠️ 405 = Bloqueado, espera 1h!');
        return;
      }
    }
  }

  sock.ev.on('connection.update', async (u)=>{
    const { connection, lastDisconnect } = u;
    if(connection==='close'){
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log('Desconectado: '+code);
      if(code === 405){ console.log('Bloqueio 405, espera 1h!'); return; }
      if(code!= 401) setTimeout(start,5000);
    }
    if(connection==='open'){
      console.log(`♈ ÁRIES-BOT 933353188 ONLINE!!! ♈`);
      console.log(`♈ Dono: ${NUMERO_DONO} ♈`);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  const { handleMessage } = require('./manipulador');

  let antilinkModulo = null;
  try { antilinkModulo = require('./comandos/adm/antilinkhard'); } catch(e){}

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if(!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const senderJid = msg.key.participant || msg.key.remoteJid;

    // ===== 1. SISTEMA MUTE V24 - PRIORIDADE MAXIMA =====
    if (isGroup && global.mutados && global.mutados[from]) {
        if (global.mutados[from].includes(senderJid)) {
            try { await sock.sendMessage(from, { delete: msg.key }); } catch(e){}
            return;
        }
    }

    // ===== 2. AUTO RESPOSTA V24 =====
    if (isGroup) {
        try {
            const autoPath = './database/sistema/autoRespostas.json';
            if (fs.existsSync(autoPath)) {
                const db = JSON.parse(fs.readFileSync(autoPath, 'utf8'));
                if (db[from]) {
                    const textoMsg = (msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "").toLowerCase();
                    // Não responde comando
                    if (!textoMsg.startsWith('€') &&!textoMsg.startsWith('!') &&!textoMsg.startsWith('/')) {
                        for (let palavra in db[from]) {
                            if (textoMsg.includes(palavra.toLowerCase())) {
                                await sock.sendMessage(from, { text: db[from][palavra] }, { quoted: msg });
                                break;
                            }
                        }
                    }
                }
            }
        } catch(e){}
    }

    // ===== 3. ANTI-LINK HARD =====
    if (isGroup && antilinkModulo && antilinkModulo.isAtivo) {
        try {
            const textoMsg = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "";
            const temLink = /https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me|t\.me/i.test(textoMsg);
            if (temLink && antilinkModulo.isAtivo(from)) {
                const metadata = await sock.groupMetadata(from);
                const participant = metadata.participants.find(p => p.id === senderJid);
                const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
                if (!isAdmin) {
                    await sock.sendMessage(from, { delete: msg.key });
                    await sock.sendMessage(from, { text: `🚫 *ANTI-LINK HARD* - Link deletado @${senderJid.split('@')[0]}`, mentions: [senderJid] });
                    return;
                }
            }
        } catch(e){}
    }

    try{ await handleMessage(sock, msg); }catch(e){ console.log('Erro:', e.message) }
  });
}
start();
