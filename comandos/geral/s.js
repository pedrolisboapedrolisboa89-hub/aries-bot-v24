const { stickerMedia } = require('../../database/sistema/sticker');

module.exports = {
    comandos: ['s','sticker','fig','figurinha'],
    descricao: 'Cria figurinha',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        
        // pega a mensagem com mídia
        let mediaType = null;
        if (msg.message.imageMessage) mediaType = 'image';
        if (msg.message.videoMessage) mediaType = 'video';
        if (quoted?.imageMessage) mediaType = 'quotedImage';
        if (quoted?.videoMessage) mediaType = 'quotedVideo';
        
        if (!mediaType) return sock.sendMessage(from, { text: '❌ Marca uma foto ou vídeo!\nEx: responde a foto com €s' }, { quoted: msg });

        try {
            await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });
            
            // baixa a mídia
            const buffer = await sock.downloadMediaMessage(
                quoted ? { message: quoted } : msg
            );

            const stickerBuffer = await stickerMedia(buffer);

            await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });
            await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
        } catch(e) {
            console.log(e);
            await sock.sendMessage(from, { text: '❌ Erro: '+e.message }, { quoted: msg });
        }
    }
}
