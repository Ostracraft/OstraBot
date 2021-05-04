import { Argument, Command } from 'discord-akairo';
import { GuildMember, MessageEmbed } from 'discord.js';
import { userInfo as config } from '@app/config/commands/basic';
import messages from '@app/config/messages';
import settings from '@app/config/settings';
import type { GuildMessage } from '@app/types';
import type { UserInfoCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');

class UserInfoCommand extends Command {
    constructor() {
        super('userinfo', {
            aliases: config.settings.aliases,
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
            args: [{
                id: 'member',
                type: Argument.union('member', 'user'),
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le membre que vous souhaitez' }),
                    retry: pupa(messages.prompt.retry, { required: 'le membre que vous souhaitez' }),
                },
            }],
        });
        this.details = config.details;
    }


    public exec(message: GuildMessage, args: UserInfoCommandArguments): void {
        const { member } = args;

        if (typeof member === 'undefined' || member == null) {
            message.channel.send(config.messages.notfound).catch(noop);
            return;
        }

        const finalMember: GuildMember = member instanceof GuildMember
            ? member
            : message.guild.members.cache.get(member.id);

        if (typeof finalMember === 'undefined') {
            message.channel.send(messages.oops).catch(noop);
            return;
        }

        const embed = new MessageEmbed()
            .setTitle(pupa(config.embed.title, { member: finalMember }))
            .setThumbnail(finalMember.user.avatarURL())
            .addField(config.embed.username, finalMember.user.username)
            .addField(config.embed.discriminator, finalMember.user.discriminator)
            .addField(config.embed.userId, finalMember.user.id)
            .addField(config.embed.nickname, finalMember.nickname ?? '*aucun*')
            .setFooter(pupa(settings.embed.footer,
                { executor: message.member.nickname ?? message.member.user.username }))
            .setColor(settings.colors.default)
            .setTimestamp();

        message.channel.send(embed).catch(noop);
    }
}

export default UserInfoCommand;
