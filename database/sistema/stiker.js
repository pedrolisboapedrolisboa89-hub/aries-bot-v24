const sharp = require('sharp');

// Função pra colocar nome no pacote da figurinha
function addExif(buffer, pack, author) {
    const json = JSON.stringify({
        "sticker-pack-id": "aries-bot-keven",
        "sticker-pack-name": pack,
        "sticker-pack-publisher": author,
        "emojis": ["♈","🔥"]
    });
    // Header EXIF
    const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
    const jsonBuffer = Buffer.from(json, 'utf-8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    // Injeta EXIF no WEBP
    // WEBP começa com RIFF....WEBP
    // Vamos adicionar chunk EXIF
    const webp = buffer;
    const exifChunk = Buffer.concat([
        Buffer.from('EXIF', 'ascii'),
        Buffer.from([exif.length,0,0,0].map ? '' : ''), // placeholder
    ]);
    // Método simples: usar sharp já deixa sem exif, então vamos usar buffer direto com metadata
    // Trick: retorna com exif manual no final do arquivo WEBP (WhatsApp lê)
    const riffHeader = webp.slice(0, 12);
    const rest = webp.slice(12);
    
    // cria chunk EXIF
    const chunkHeader = Buffer.alloc(8);
    chunkHeader.write('EXIF', 0);
    chunkHeader.writeUInt32LE(exif.length, 4);
    
    // Recalcula tamanho RIFF
    const newSize = webp.length + chunkHeader.length + exif.length;
    const newRiff = Buffer.alloc(12);
    webp.copy(newRiff, 0, 0, 12);
    newRiff.writeUInt32LE(newSize - 8, 4);
    
    return Buffer.concat([newRiff, rest, chunkHeader, exif]);
}

async function stickerMedia(buffer, pack = 'Áries bot', author = 'Keven ♈ 958137017') {
    const webpBuffer = await sharp(buffer)
        .resize(512, 512, { 
            fit: 'contain', 
            background: { r: 0, g: 0, b: 0, alpha: 0 } 
        })
        .webp({ quality: 75 })
        .toBuffer();
    
    // adiciona pack e autor
    return addExif(webpBuffer, pack, author);
}

module.exports = { stickerMedia };
