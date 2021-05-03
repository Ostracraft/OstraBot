import settings from "@app/config/settings";
import Logger from "@app/structures/Logger";
import { default as Sanction } from "@app/models/sanction";
import { Duration, SanctionBase, SanctionDocument, SanctionTypes } from "@app/types";
import { Permissions } from "discord.js";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { User } from "discord.js";
import { GuildMember } from "discord.js";
import * as moderationConfig from "@app/config/commands/moderation";
import pupa = require("pupa");
import { Channel } from "discord.js";
import { AkairoClient } from "discord-akairo";

async function warn(member: GuildMember | User, reason: string, moderator: GuildMember): Promise<boolean> {
    const document: SanctionBase = {
        memberId: member.id,
        type: SanctionTypes.WARN,
        reason: reason,
        start: Date.now(),
        moderatorId: moderator.id,
        revoked: false,
    }

    try {
        await Sanction.create(document);
        return true;
    } catch (unknownError: unknown) {
        Logger.warn('Error while trying to warn a user:');
        Logger.warn(`\t» Member ID: ${member.id}`);
        Logger.warn(`\t» Moderator ID: ${moderator.id}`);
        Logger.warn(`\t» Reason: ${reason}`);
        Logger.warn('Error: ' + (unknownError as Error).name);
        Logger.warn((unknownError as Error).message);
        return false;
    }
}

async function tempban(member: GuildMember | User, reason: string, duration: Duration, moderator: GuildMember): Promise<Boolean> {
    const role = moderator.guild.roles.cache.get(settings.roles.banned);
    let channel: TextChannel;
    if (member instanceof GuildMember) {
        member.roles.add(role);
        channel = await moderator.guild.channels.create('ban-' + member.nickname ?? member.user.username, {
            type: 'text',
            topic: `Salon du bannissement de ${member.nickname ?? member.user.username} (${member.id})`,
            parent: settings.categories.banned,
            permissionOverwrites: [
                {
                    id: settings.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                },
                {
                    id: settings.roles.staff,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                },
                {
                    id: member.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL]
                }
            ]
        });
    } else {
        const gmember: GuildMember = moderator.guild.members.cache.get(member.id);
        gmember.roles.add(role);
        channel = await moderator.guild.channels.create('ban-' + (gmember.nickname == null ? gmember.user.username : gmember.nickname), {
            type: 'text',
            topic: `Salon du bannissement de ${gmember.nickname == null ? gmember.user.username : gmember.nickname} (${gmember.id})`,
            parent: settings.categories.banned,
            permissionOverwrites: [
                {
                    id: settings.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                },
                {
                    id: settings.roles.staff,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                },
                {
                    id: gmember.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL]
                }
            ]
        });
    }
    const gmember: GuildMember = moderator.guild.members.cache.get(member.id);
    const embed = new MessageEmbed()
        .setTitle(pupa(moderationConfig.tempban.private.title, { username: (gmember.nickname == null ? gmember.user.username : gmember.nickname) }))
        .addField(moderationConfig.tempban.private.duration, duration.humanReadable())
        .addField(moderationConfig.tempban.private.reason, reason)
        .setColor(settings.colors.default)
        .setFooter(gmember.nickname ?? gmember.user.username)
        .setTimestamp();
    channel.send(embed);

    const document: SanctionBase = {
        memberId: member.id,
        type: SanctionTypes.TEMPBAN,
        reason: reason,
        start: Date.now(),
        duration: duration.asMillis(),
        moderatorId: moderator.id,
        revoked: false,
        channel: channel.id
    }

    try {
        await Sanction.create(document);
        return true;
    } catch (unknownError: unknown) {
        Logger.warn('Error while trying to tempban a user:');
        Logger.warn(`\t» Member ID: ${member.id}`);
        Logger.warn(`\t» Moderator ID: ${moderator.id}`);
        Logger.warn(`\t» Reason: ${reason}`);
        Logger.warn(`\t» Duration: ${duration.toString()}`);
        Logger.warn('Error: ' + (unknownError as Error).name);
        Logger.warn((unknownError as Error).message);
        return false;
    }
}

async function unban(client: AkairoClient, doc: SanctionDocument): Promise<boolean> {
    try {
        const member: GuildMember = client.guild.members.cache.get(doc.memberId);
        member.roles.remove(settings.roles.banned);
        const channel: TextChannel = client.guild.channels.cache.get(doc.channel) as TextChannel;
        channel.edit({
            name: 'un' + (channel as TextChannel).name,
            permissionOverwrites: [
                {
                    id: settings.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                },
                {
                    id: settings.roles.staff,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE]
                }
            ]
        });
        const embed = new MessageEmbed()
            .setTitle(moderationConfig.unban.embed.title)
            .addField(moderationConfig.unban.embed.username, (member.nickname == null ? member.user.username : member.nickname))
            .setColor(settings.colors.default)
            .setTimestamp()
            .setFooter('Unban automatique');
        channel.send(embed);
        return true;
    } catch (unknownError: unknown) {
        return false;
    }
}

export default {
    warn,
    tempban,
    unban,
}