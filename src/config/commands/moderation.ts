import { hasStaffRole, permissions } from "../configUtil";
import settings from "../settings";

export const purge = {
    settings: {
        aliases: ['purge'],
        clientPermissions: permissions.SEND_MESSAGES || permissions.MANAGE_MESSAGES,
        userPermissions: hasStaffRole,
    },
    details: {
        name: 'Purge',
        content: 'Permet de supprimer une grosse quantité de messages dans un channel',
        usage: 'purge <number> [membre] [--force|-f]',
        examples: [
            'purge 10',
            'purge 10 --force'
        ],
    },
    messages: {
        startPrompt: `${settings.emojis.info} » Merci de renseigner le nombre de messages à supprimer.`,
        retryPrompt: `${settings.emojis.non} » Erreur: Ce nombre est invalide ! Il doit être compris entre 1 et ${settings.moderation.purgeLimit} !`,
        single: `${settings.emojis.oui} » 1 message a été supprimé !`,
        several: `${settings.emojis.oui} » {amount} messages ont été supprimés !`,
    },
}

export const tempban = {
    settings: {
        aliases: ['tempban', 'tban', 'sdb'],
        clientPermissions: permissions.SEND_MESSAGES && permissions.BAN_MEMBERS,
        userPermissions: hasStaffRole,
    },
    details: {
        name: 'Tempban',
        content: 'Permet de bannir temporairement un membre',
        usage: 'tempban <membre> <durée> <raison>',
        examples: [
            'tempban @Skylyxx 2d Trop fort',
            'tempban Arthuroklm 10m Le sel !'
        ],
    },
    messages: {
        notfound: `${settings.emojis.non} » Ce membre n'a pas été trouvé !`,
        processing: `${settings.emojis.info} » Traitement en cours...`,
        noperm: `${settings.emojis.non} » Vous ne pouvez pas sanctionner cet utilisateur !`
    },
    embed: {
        title: `${settings.emojis.oui} Membre sanctionné`,
        username: '» Membre:',
        duration: '» Durée:',
        reason: '» Raison:'
    },
    private: {
        title: `{username} vous avez été sanctionné`,
        duration: '» Durée:',
        reason: '» Raison:',
        message: `${settings.emojis.info} » Si vous vous déconnectez avant la fin de votre sanction, vous subirez un bannissement définitif de notre Discord d'Ostracraft. Si vous souhaitez discuter de votre sanction avec le staff, vous pouvez le faire dans ce salon même.`
    }
}

export const warn = {
    settings: {
        aliases: ['warn'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: hasStaffRole,
    },
    details: {
        name: 'Warn',
        content: 'Permet d\'avertir un membre',
        usage: 'warn <member> <raison>',
        examples: [
            'warn @Skylyxx Spam',
            'purge Gleush Insultes'
        ],
    },
    messages: {
        notfound: `${settings.emojis.non} » Ce membre n'a pas été trouvé !`,
        processing: `${settings.emojis.info} » Traitement en cours...`,
        noperm: `${settings.emojis.non} » Vous ne pouvez pas avertir cet utilisateur !`,
        dm: `${settings.emojis.info} » Vous avez reçu un avertissement de la part d'un membre du staff d'Ostracraft. Nous vous invitons à revoir votre comportement. Raison: *{reason}*`
    },
    embed: {
        title: `${settings.emojis.oui} Membre averti`,
        username: '» Membre:',
        reason: '» Raison:',
    },
}

export const unban = {
    settings: {
        aliases: ['unban'],
        clientPermissions: permissions.SEND_MESSAGES && permissions.BAN_MEMBERS,
        userPermissions: hasStaffRole,
    },
    details: {
        name: 'Unban',
        content: 'Permet d\'unban un membre',
        usage: 'tempban <membre>',
        examples: [
            'unban @Baldark',
        ],
    },
    messages: {
        notfound: `${settings.emojis.non} » Ce membre n'a pas été trouvé !`,
        processing: `${settings.emojis.info} » Traitement en cours...`,
    },
    embed: {
        title: `${settings.emojis.oui} Membre unban`,
        username: '» Membre:',
    },
}