import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { tempban as config } from '@app/config/commands/moderation';
import messages from '@app/config/messages';
import settings from '@app/config/settings';
import SanctionsManager from '@app/moderation/SanctionsManager';
import type { GuildMessage } from '@app/types';
import type { TempBanCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');


class TempBanCommand extends Command {
    constructor() {
        super('tempban', {
            aliases: config.settings.aliases,
            args: [{
                id: 'user',
                type: 'user',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le membre à avertir' }),
                    retry: pupa(messages.prompt.retry, { required: 'le membre à avertir' }),
                },
            },
            {
                id: 'duration',
                type: 'duration',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'la durée (Ex: 2d <=> 2 jours / 10m <=> 10 minutes)' }),
                    retry: pupa(messages.prompt.retry, { required: 'la durée (Ex: 2d <=> 2 jours / 10m <=> 10 minutes)' }),
                },
            },
            {
                id: 'reason',
                type: 'string',
                match: 'rest',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'la raison' }),
                    retry: pupa(messages.prompt.retry, { required: 'la raison' }),
                },
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
        });
        this.details = config.details;
    }

    public async exec(message: GuildMessage, args: TempBanCommandArguments): Promise<void> {
        const { user, duration, reason } = args;

        if (user == null) {
            message.channel.send(config.messages.notfound).catch(noop);
            return;
        }

        const member = message.guild.members.cache.get(user.id);
        if (member.roles.highest.position >= message.member.roles.highest.position) {
            message.channel.send(config.messages.noperm).catch(noop);
            return;
        }

        const processing = await message.channel.send(config.messages.processing);
        const success = await SanctionsManager.tempban(user, reason, duration, message.member);
        await processing.delete();
        if (success) {
            const embed = new MessageEmbed()
                .setTitle(config.embed.title)
                .addField(config.embed.username, (member.nickname == null ? user.username : `${member.nickname} (${user.username})`))
                .addField(config.embed.duration, duration.humanReadable())
                .addField(config.embed.reason, reason)
                .setColor(settings.colors.default)
                .setFooter(pupa(settings.embed.footer,
                    { executor: (message.member.nickname ?? message.member.user.username) }))
                .setTimestamp();
            message.channel.send(embed).catch(noop);
        } else {
            message.channel.send(messages.oops).catch(noop);
        }
    }
}

export default TempBanCommand;
