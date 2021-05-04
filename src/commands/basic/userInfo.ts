import { Command } from "discord-akairo";
import { userInfo as config } from "@app/config/commands/basic";
import { Argument } from "discord-akairo";
import { GuildMessage } from "@app/types";
import { UserInfoCommandArguments } from "@app/types/CommandArguments";
import { GuildMember } from "discord.js";
import settings from "@app/config/settings";
import messages from "@app/config/messages";
import { MessageEmbed } from "discord.js";
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
            }],
        });
        this.details = config.details;
    }

    
    public async exec(message: GuildMessage, args: UserInfoCommandArguments): Promise<void> {
        const { member } = args;

        if(typeof member === 'undefined' || member == null) {
            message.channel.send(config.messages.notfound);
            return;
        }

        let finalMember: GuildMember;
        if(member instanceof GuildMember)
            finalMember = member;
        else
            finalMember = message.guild.members.cache.get(member.id);
            
        if(typeof finalMember === 'undefined') {
            message.channel.send(messages.oops);
            return;
        }
        
        const embed = new MessageEmbed()
            .setTitle(pupa(config.embed.title, { member: finalMember }))
            .setThumbnail(finalMember.user.avatarURL())
            .addField(config.embed.username, finalMember.user.username)
            .addField(config.embed.discriminator, finalMember.user.discriminator)
            .addField(config.embed.userId, finalMember.user.id)
            .addField(config.embed.nickname, finalMember.nickname ?? '*aucun*')
            .setFooter(pupa(settings.embed.footer, { executor: message.member.nickname ?? message.member.user.username }))
            .setColor(settings.colors.default)
            .setTimestamp();

        message.channel.send(embed);

    }

}

export default UserInfoCommand;