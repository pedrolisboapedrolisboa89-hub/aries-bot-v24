import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  isActiveGroupRestriction,
  updateIsActiveGroupRestriction,
} from "../../utils/database.js";
import { isFalse, isTrue } from "../../utils/index.js";

export default {
  name: "anti-status-grupo",
  description:
    "Ativa/desativa o anti-status-grupo no grupo, removendo quem marcar status.",
  commands: [
    "anti-status-grupo",
    "anti-marcacao-status-grupo",
    "anti-marcação-status-grupo",
  ],
  usage: `${PREFIX}anti-status-grupo on/off`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply, sendReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando só deve ser usado em grupos!");
    }

    // Se digitar sem args, mostra status
    if (!args.length) {
      const ativo = isActiveGroupRestriction(remoteJid, "anti-status-grupo");
      const status = ativo? "🟢 ATIVADO" : "🔴 DESATIVADO";
      return await sendReply(
        `⚙️ *ANTI-STATUS-GRUPO:* ${status}\n\n` +
        `📝 *Uso:*\n` +
        `${PREFIX}anti-status-grupo on = ativar\n` +
        `${PREFIX}anti-status-grupo off = desativar\n` +
        `${PREFIX}anti-status-grupo 1 = ativar\n` +
        `${PREFIX}anti-status-grupo 0 = desativar`
      );
    }

    const arg = args[0].toLowerCase();

    // ACEITA on/off/1/0/ativar/desativar
    let ligar = false;
    let desligar = false;

    if (["on", "1", "ativar", "ligar", "ativo"].includes(arg)) ligar = true;
    if (["off", "0", "desativar", "desligar", "desativo"].includes(arg)) desligar = true;

    // fallback pros utils antigos
    if (!ligar &&!desligar) {
      ligar = isTrue(args[0]);
      desligar = isFalse(args[0]);
    }

    if (!ligar &&!desligar) {
      throw new InvalidParameterError(
        `Use: ${PREFIX}anti-status-grupo on/off\n\nEx: ${PREFIX}anti-status-grupo on`
      );
    }

    const jaAtivo = isActiveGroupRestriction(remoteJid, "anti-status-grupo");

    if (ligar && jaAtivo) {
      throw new WarningError(`O anti-status-grupo já está 🟢 ATIVADO!`);
    }
    if (desligar &&!jaAtivo) {
      throw new WarningError(`O anti-status-grupo já está 🔴 DESATIVADO!`);
    }

    updateIsActiveGroupRestriction(
      remoteJid,
      "anti-status-grupo",
      ligar? true : false
    );

    const status = ligar? "🟢 ATIVADO" : "🔴 DESATIVADO";
    const acao = ligar? "não poderá marcar status" : "poderá marcar status novamente";
    await sendSuccessReply(
      `${status} com sucesso!\n\nAgora quem marcar status no grupo ${acao}.`
    );
  },
};
