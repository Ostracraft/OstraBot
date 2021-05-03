import { noPermissions, permissions } from "@app/config/configUtil";
import settings from "@app/config/settings";

export const youtube = {
    settings: {
        aliases: ['youtube', 'yt'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'Youtube',
        content: 'Permet de lancer une écoute de vidéo youtube à plusieurs',
        usage: 'youtube',
        examples: ['youtube'],
    },
    messages: {
        notInChannel: `${settings.emojis.non} » Vous devez vous trouver dans un salon vocal ou préciser l'id du salon !`,
        success: `${settings.emojis.oui} » Très bien ! Voici le lien d'invitation: {link}`
    },
    
}
