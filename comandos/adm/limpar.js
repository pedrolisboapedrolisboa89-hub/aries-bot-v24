module.exports = {
    comandos: ['limpar','clean','clear'],
    descricao: 'Limpa chat com bug grandão',
    categoria: 'adm',
    run: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        try {
            if (!from.endsWith("@g.us")) {
                return sock.sendMessage(from, { text: "❌ Só em grupos." }, { quoted: msg });
            }

            const metadata = await sock.groupMetadata(from).catch(()=>null);
            if (!metadata) return;

            const senderJid = msg.key.participant || from;
            const p = metadata.participants.find(x=>x.id===senderJid);
            const isAdmin = p?.admin === 'admin' || p?.admin === 'superadmin';
            if (!isAdmin) return sock.sendMessage(from, { text: "🚫 Só admins!" }, { quoted: msg });

            const botId = sock.user.id.split(':')[0]+'@s.whatsapp.net';
            const botPart = metadata.participants.find(x=>x.id===botId || x.id.includes(sock.user.id.split('@')[0]));
            const isBotAdmin = botPart?.admin === 'admin' || botPart?.admin === 'superadmin';
            if (!isBotAdmin) return sock.sendMessage(from, { text: "⚠️ Preciso ser admin pra limpar!" }, { quoted: msg });

            await sock.sendMessage(from, { react: { text: "🧹", key: msg.key } });
            await new Promise(r=>setTimeout(r,1000));

            try {
                const cleanMessage = {
                    botInvokeMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} },
                            imageMessage: {
                                url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f1/m234/up-oil-image-e1bbfe2b-334b-4c5d-b716-d80edff29301?ccb=9-4&oh=01_Q5AaID0uZoxsi9v2I7KJZEgeJ7IVkFPZkt2yeYf6ps0IWG2g&oe=66E7130B&_nc_sid=000000&mms3=true",
                                mimetype: "image/png",
                                caption: `🧹 LIMPO ✅️`,
                                fileSha256: "YVuPx9PoIxL0Oc3xsUc3n3uhttmVYlqUV97LKKvIjL8=",
                                fileLength: "999999999",
                                height: 10000000000000000,
                                width: 99999999999999999999999,
                                mediaKey: "4T8WJKuKvJ9FXSwldCXe5+/IA7aYi5ycf301J0xIZwA=",
                                fileEncSha256: "jfG3tesFLdqtCzO6cqU51HGGkEtd7+w22aJtaEm2yjE=",
                                directPath: "/v/t62.7118-24/29631950_1467571294644184_4827066390759523804_n.enc?ccb=11-4&oh=01_Q5AaIFPK_QoDRMR4vZIBbMTdy6GreGhSA2HHRAIu0-vAMgqN&oe=66E72F5E&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1723839207",
                                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
                                scansSidecar: "il8IxPgrhGdtn37jGMVgQVRKlPd/CERE+Nr822DZe2UT9r0YT3KPSQ==",
                                scanLengths: [5373, 24562, 15656, 22918],
                                midQualityFileSha256: "s8Li+/zg2VmzMvJtRAZHP
