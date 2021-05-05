
import { Command } from 'discord-akairo';
import type { GuildMember } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { unban as config } from '@app/config/commands/moderation';
import messages from '@app/config/messages';
import settings from '@app/config/settings';
import Sanction from '@app/models/sanction';
import SanctionsManager from '@app/moderation/SanctionsManager';
import type { GuildMessage, SanctionDocument } from '@app/types';
import { SanctionTypes } from '@app/types';
import type { UnBanCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');

class UnBanCommand extends Command {
    constructor() {
        super('unban', {
            aliases: config.settings.aliases,
            args: [{
                id: 'user',
                type: 'user',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le membre à unban' }),
                    retry: pupa(messages.prompt.retry, { required: 'le membre à unban' }),
                },
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
        });
        this.details = config.details;
    }

    public async exec(message: GuildMessage, args: UnBanCommandArguments): Promise<void> {
        const { user } = args;

        if (user == null) {
            message.channel.send(config.messages.notfound).catch(noop);
            return;
        }

        const doc: SanctionDocument = await Sanction.findOne({
            memberId: user.id,
            type: SanctionTypes.TEMPBAN,
            revoked: false,
        });
        if (doc == null) {
            message.channel.send(config.messages.notbanned).catch(noop);
            return;
        }

        const success = await SanctionsManager.unban(this.client, doc, message.member);
        if (success) {
            const member: GuildMember = await this.client.guild.members.fetch(user.id);
            if (message.channel.id !== doc.channel) {
                const embed = new MessageEmbed()
                    .setTitle(config.embed.title)
                    .addField(config.embed.username,
                        (member.nickname == null ? member.user.username : member.nickname))
                    .setColor(settings.colors.default)
                    .setTimestamp()
                    .setFooter(pupa(settings.embed.footer,
                        { executor: message.member.nickname ?? message.member.user.username }));
                message.channel.send(embed).catch(noop);
            }
        } else {
            message.channel.send(messages.oops).catch(noop);
        }
    }
}

export default UnBanCommand;
