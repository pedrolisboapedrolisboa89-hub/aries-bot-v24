// 📁 settings/commands/revelar.js
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "revelar",
  alias: ["view", "show", "see", "👁️revelar", "rv"],
  description: "Reenvia imagens ou vídeos de visualização única como mídia normal",
  category: "Utilidades",

  async execute(sock, from, msg, args, command, config, BOT_PHONE) {
    try {
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
      let quotedMsg = contextInfo?.quotedMessage;

      if (!quotedMsg) {
        return sock.sendMessage(from, {
          text: "❌ *Como usar:* Responda uma imagem/vídeo de *visualização única* com *!revelar*"
        }, { quoted: msg });
      }

      // 🔓 DESBLOQUEIA O VIEW ONCE - aqui tá o segredo
      if (quotedMsg.viewOnceMessageV2) {
        quotedMsg = quotedMsg.viewOnceMessageV2.message;
      } else if (quotedMsg.viewOnceMessage) {
        quotedMsg = quotedMsg.viewOnceMessage.message;
      }

      const quotedSender = contextInfo.participant;
      const quotedSenderNumber = quotedSender?.split('@')[0] || 'desconhecido';

      const isImage = quotedMsg.imageMessage;
      const isVideo = quotedMsg.videoMessage;
      const isSticker = quotedMsg.stickerMessage;

      if (!isImage &&!isVideo &&!isSticker) {
        return sock.sendMessage(from, {
          text: "❌ Isso não é mídia de visualização única!"
        }, { quoted: msg });
      }

      let buffer;

      if (isImage) {
        const media = isImage;
        const stream = await downloadContentFromMessage(media, 'image');
        buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(from, {
          image: buffer,
          caption: `👁️ *IMAGEM REVELADA*\n\n📝 ${media.caption || ''}\n\n📨 De: @${quotedSenderNumber}`,
          mentions: [quotedSender]
        }, { quoted: msg });

      } else if (isVideo) {
        const media = isVideo;
        const stream = await downloadContentFromMessage(media, 'video');
        buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(from, {
          video: buffer,
          caption: `👁️ *VÍDEO REVELADO*\n\n📝 ${media.caption || ''}\n\n📨 De: @${quotedSenderNumber}`,
          mentions: [quotedSender]
        }, { quoted: msg });

      } else if (isSticker) {
        const media = isSticker;
        const stream = await downloadContentFromMessage(media, 'sticker');
        buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
      }

    } catch (err) {
      console.error("Erro no comando revelar:", err);
      await sock.sendMessage(from, { text: "❌ Erro ao revelar. O WhatsApp pode ter bloqueado." }, { quoted: msg });
    }
  }
};
