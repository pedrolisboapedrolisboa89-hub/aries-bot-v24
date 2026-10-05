const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function stickerMedia(buffer, pack = 'Áries bot', author = 'Keven') {
    const webpBuffer = await sharp(buffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 80 })
        .toBuffer();
    return webpBuffer;
}

module.exports = { stickerMedia };
