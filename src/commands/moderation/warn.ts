import { warn as config } from "@app/config/commands/moderation";
import messages from "@app/config/messages";
import SanctionsManager from "@app/moderation/SanctionsManager";
import { GuildMessage } from "@app/types";
import { WarnCommandArguments } from "@app/types/CommandArguments";
import { Command, Argument } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import { User } from "discord.js";
import settings from "@app/config/settings";
import pupa = require('pupa');

class WarnCommand extends Command {
    constructor() {
        super('warn', {
            aliases: config.settings.aliases,
            args: [{
                id: 'user',
                type: 'user',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le membre à avertir' }),
                    retry: pupa(messages.prompt.retry, { required: 'le membre à avertir' }),
                }
            },
            {
                id: 'reason',
                type: 'string',
                match: 'rest',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'la raison' }),
                    retry: pupa(messages.prompt.retry, { required: 'la raison' }),
                }
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
        });
        this.details = config.details;
    }

    public async exec(message: GuildMessage, args: WarnCommandArguments): Promise<void> {
        const { user, reason } = args;

        if (user == null) {
            message.channel.send(config.messages.notfound);
            return;
        }

        const member = message.guild.members.cache.get(user.id);
        if(member.roles.highest.position >= message.member.roles.highest.position) {
            message.channel.send(config.messages.noperm);
            return;
        }

        const processing = await message.channel.send(config.messages.processing);
        const success = await SanctionsManager.warn(user, reason, message.member);
        await processing.delete();
        if (success) {
                const embed = new MessageEmbed()
                    .setTitle(config.embed.title)
                    .addField(config.embed.username, member.nickname == null ? user.username : `${member.nickname} (${user.username})`)
                    .addField(config.embed.reason, reason)
                    .setColor(settings.colors.default)
                    .setFooter(pupa(settings.embed.footer, { executor: (message.member.nickname ?? message.member.user.username) }))
                    .setTimestamp();
                message.channel.send(embed);
        } else {
            message.channel.send(messages.oops);
        }
    }

}

export default WarnCommand;