import settings from "./settings";

const messages = {
    noperm: `${settings.emojis.non} » Vous n'avez pas la permission de faire ceci !`,
    oops: `${settings.emojis.non} » Une erreur est survenue ! Merci de rééssayer ou de contacter un membre du staff !`,
    unbanError: `${settings.emojis.non} » Une erreur est survenue lors du déban de <@{victim}> ({victim}) !`,
    
    startPrompt: `${settings.emojis.info} » Merci de renseigner {required}`,
    retryPrompt: `${settings.emojis.non} » Argument invalide ! Merci de renseigner {required}`,
}

export default messages;