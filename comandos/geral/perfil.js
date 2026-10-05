import { ASSETS_DIR, PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { getProfileImageData } from "../../services/baileys.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "perfil",
  description: "Mostra informações de um usuário",
  commands: ["perfil", "profile", "p"],
  usage: `${PREFIX}perfil ou ${PREFIX}perfil @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    userLid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupo.");
    }

    // pega o alvo: se marcou @, se não, você mesmo
    let targetJid = userJid || userLid;
    if (args[0]) {
      const num = onlyNumbers(args[0]);
      // tenta achar no grupo pelo numero
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const found = groupMetadata.participants.find(p => p.id.includes(num) || p.id === `${num}@s.whatsapp.net` || p.id === `${num}@lid`);
      targetJid = found? found.id : `${num}@s.whatsapp.net`;
    }

    await sendWaitReply("Carregando perfil...");

    try {
      let profilePicUrl;
      try {
        const { profileImage } = await getProfileImageData(socket, targetJid);
        profilePicUrl = profileImage || `${ASSETS_DIR}/images/default-user.png`;
      } catch {
        profilePicUrl = `${ASSETS_DIR}/images/default-user.png`;
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === targetJid);

      let userRole = "Membro";
      if (participant?.admin === "superadmin") userRole = "Dono 👑";
      else if (participant?.admin === "admin") userRole = "Admin 🛡️";

      // zueira do Áries (pode tirar se quiser)
      const randomPercent = Math.floor(Math.random() * 100);
      const beautyLevel = Math.floor(Math.random() * 100) + 1;

      const nome = targetJid.split("@")[0];

      const mensagem = `╭───「 👤 *PERFIL* 」───╮
│
│ 📛 *User:* @${nome}
│ 🎖️ *Cargo:* ${userRole}
│ 🆔 *ID:* ${targetJid.split("@")[0]}
│
│ ✨ *Beleza:* ${beautyLevel}%
│ 🍀 *Sorte:* ${randomPercent}%
│
╰──────────────────╯`;

      await sendSuccessReact();

      await socket.sendMessage(remoteJid, {
        image: { url: profilePicUrl },
        caption: mensagem,
        mentions: [targetJid],
      });

    } catch (error) {
      errorLog(`Erro perfil ${targetJid}: ${error}`);
      sendErrorReply("Não consegui pegar o perfil desse usuário.");
    }
  },
};
