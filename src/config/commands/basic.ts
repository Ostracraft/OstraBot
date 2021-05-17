import settings from '@app/config/settings';
import { noPermissions, permissions } from '@app/config/configUtil';

export const help = {
    settings: {
        aliases: ['help', 'aide'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'Help',
        content: 'Permet d\'obtenir de l\'aide sur les commandes',
        usage: 'help [commande]',
        examples: ['help', 'help ban'],
    },
    messages: {
        command: {
            title: `${settings.emojis.info} Aide: {command}`,
            description: '» Description',
            aliases: '» Aliases',
            usage: '» Usage',
            examples: '» Exemples',
        },
        global: {
            title: `${settings.emojis.info} Aide`,
            field: {
                title: '» Catégorie: {category}',
                content: '{content}',
                separator: ' • ',
            },
        },
    },
};

export const ping = {
    settings: {
        aliases: ['ping'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'Ping',
        content: 'Permet de connaître la latence du bot et de l\'API',
        usage: 'ping',
        examples: ['ping'],
    },
    messages: {
        firstMessage: ':green_circle: Calcul du ping en cours...',
        embedDescription: `:robot: ${settings.bot.name} : {botPing} ms {botIndic}

        ${settings.emojis.discord} API Discord : {discordPing} ms {discordIndic}`,
    },

};

export const userInfo = {
    settings: {
        aliases: ['userInfo', 'user'],
        clientPermissions: permissions.SEND_MESSAGES,
        userPermissions: noPermissions,
    },
    details: {
        name: 'UserInfo',
        content: 'Permet d\'obtenir des informations sur un membre du Discord',
        usage: 'userinfo <membre>',
        examples: [
            'userinfo Gleush',
            'userinfo 435756597168308225',
            'userinfo @Arthuroklm',
        ],
    },
    embed: {
        title: 'Informations: {member.displayName}',
        username: '» Username:',
        discriminator: '» Discriminant:',
        userId: '» ID:',
        nickname: '» Surnom:',
    },
    messages: {
        notfound: `${settings.emojis.non} » Ce membre n'a pas été trouvé !`,
    },
};
