import settings from './settings';

const messages = {
    noperm: `${settings.emojis.non} » Vous n'avez pas la permission de faire ceci !`,
    oops: `${settings.emojis.non} » Une erreur est survenue ! Merci de rééssayer ou de contacter un membre du staff !`,
    unbanError: `${settings.emojis.non} » Une erreur est survenue lors du déban de <@{victim}> ({victim}) !`,

    prompt: {
        start: `${settings.emojis.info} » Merci de renseigner {required}.`,
        retry: `${settings.emojis.non} » Argument invalide ! Merci de renseigner {required}.`,

        timeout: `${settings.emojis.non} » Le temps est écoulé. La commande a été annulée.`,
        ended: `${settings.emojis.non} » Tu as fais trop d'erreurs. La commande a été annulée.`,
        stopWord: 'stop',
        cancel: `${settings.emojis.oui} » Commande annulée !`,
        cancelWord: 'cancel',
        footer: 'Pour annuler, écrivez \'cancel\'.',
    },
};

export default messages;
