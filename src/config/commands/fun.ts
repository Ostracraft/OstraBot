import { noPermissions, permissions } from '@app/config/configUtil';
import settings from '@app/config/settings';

export const betrayal = {
    settings: {
        aliases: ['betrayal', 'bt'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'Betrayal',
        content: 'Permet de lancer le jeu Betrayal.io dans un vocal',
        usage: 'betrayal',
        examples: ['betrayal'],
    },
    messages: {
        notInChannel: `${settings.emojis.non} » Vous devez vous trouver dans un salon vocal ou préciser l'id du salon !`,
        success: `${settings.emojis.oui} » Très bien ! Voici le lien d'invitation: {link}`,
    },

};

export const poker = {
    settings: {
        aliases: ['poker', 'pk'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'Poker',
        content: 'Permet de lancer le jeu Poker dans un vocal',
        usage: 'poker',
        examples: ['poker'],
    },
    messages: {
        notInChannel: `${settings.emojis.non} » Vous devez vous trouver dans un salon vocal ou préciser l'id du salon !`,
        success: `${settings.emojis.oui} » Très bien ! Voici le lien d'invitation: {link}`,
    },

};


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
        success: `${settings.emojis.oui} » Très bien ! Voici le lien d'invitation: {link}`,
    },

};
