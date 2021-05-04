import { tempban as config } from "@app/config/commands/moderation";
import messages from "@app/config/messages";
import settings from "@app/config/settings";
import SanctionsManager from "@app/moderation/SanctionsManager";
import { GuildMessage } from "@app/types";
import { TempBanCommandArguments } from "@app/types/CommandArguments";
import { Command, Argument } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import { User } from "discord.js";
import pupa = require('pupa');

class TempBanCommand extends Command {
    constructor() {
        super('tempban', {
            aliases: config.settings.aliases,
            args: [{
                id: 'member',
                type: Argument.union('member', 'user'),
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le membre à avertir' }),
                    retry: pupa(messages.prompt.retry, { required: 'le membre à avertir' }),
                }
            },
            {
                id: 'duration',
                type: 'duration',
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'la durée (Ex: 2d <=> 2 jours / 10m <=> 10 minutes)' }),
                    retry: pupa(messages.prompt.retry, { required: 'la durée (Ex: 2d <=> 2 jours / 10m <=> 10 minutes)' }),
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

    public async exec(message: GuildMessage, args: TempBanCommandArguments): Promise<void> {
        const { member, duration, reason } = args;

        if (member == null) {
            message.channel.send(config.messages.notfound);
            return;
        }

        if(member instanceof User) {
            const gmember = message.guild.members.cache.get(member.id);
            if(gmember.roles.highest.position >= message.member.roles.highest.position) {
                message.channel.send(config.messages.noperm);
                return;
            }
        } else {
            if(member.roles.highest.position >= message.member.roles.highest.position) {
                message.channel.send(config.messages.noperm);
                return;
            }
        }

        const processing = await message.channel.send(config.messages.processing);
        const success = await SanctionsManager.tempban(member, reason, duration, message.member);
        await processing.delete();
        if (success) {
            const username = member instanceof GuildMember ?
                ((member as GuildMember).nickname == null ?
                    member.user.username :
                    member.nickname) :
                member.username;
            const embed = new MessageEmbed()
                .setTitle(config.embed.title)
                .addField(config.embed.username, username)
                .addField(config.embed.duration, duration.humanReadable())
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

export default TempBanCommand;