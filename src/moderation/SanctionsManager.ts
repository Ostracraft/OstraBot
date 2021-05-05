import type { AkairoClient } from 'discord-akairo';
import { MessageEmbed, Permissions } from 'discord.js';
import type { GuildMember, TextChannel, User } from 'discord.js';
import * as moderationConfig from '@app/config/commands/moderation';
import settings from '@app/config/settings';
import Sanction from '@app/models/sanction';
import Logger from '@app/structures/Logger';
import type { Duration, SanctionBase, SanctionDocument } from '@app/types';
import { SanctionTypes } from '@app/types';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');


async function warn(user: User, reason: string, moderator: GuildMember): Promise<boolean> {
    const document: SanctionBase = {
        memberId: user.id,
        type: SanctionTypes.WARN,
        reason,
        start: Date.now(),
        moderatorId: moderator.id,
        revoked: false,
    };
    user.send(pupa(moderationConfig.warn.messages.dm, { reason })).catch(noop);
    try {
        await Sanction.create(document);
        return true;
    } catch (unknownError: unknown) {
        Logger.warn('Error while trying to warn a user:');
        Logger.warn(`\t» User ID: ${user.id}`);
        Logger.warn(`\t» Moderator ID: ${moderator.id}`);
        Logger.warn(`\t» Reason: ${reason}`);
        Logger.warn('Error: ' + (unknownError as Error).name);
        Logger.warn((unknownError as Error).message);
        return false;
    }
}

async function tempban(user: User, reason: string, duration: Duration, moderator: GuildMember): Promise<boolean> {
    const role = moderator.guild.roles.cache.get(settings.roles.banned);
    const member = moderator.guild.members.cache.get(user.id);
    member.roles.add(role).catch(noop);
    const channel: TextChannel = await moderator.guild.channels.create('ban-' + member.nickname ?? member.user.username, {
        type: 'text',
        topic: `Salon du bannissement de ${member.nickname ?? member.user.username} (${member.id})`,
        parent: settings.categories.banned,
        permissionOverwrites: [
            {
                id: settings.roles.everyone,
                deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE],
            },
            {
                id: settings.roles.staff,
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE],
            },
            {
                id: member.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
        ],
    });
    const gmember: GuildMember = moderator.guild.members.cache.get(member.id);
    const embed = new MessageEmbed()
        .setTitle(pupa(moderationConfig.tempban.private.title,
            { username: (gmember.nickname == null ? gmember.user.username : gmember.nickname) }))
        .addField(moderationConfig.tempban.private.duration, duration.humanReadable())
        .addField(moderationConfig.tempban.private.reason, reason)
        .setColor(settings.colors.default)
        .setFooter(gmember.nickname ?? gmember.user.username)
        .setTimestamp();
    channel.send(embed).catch(noop);
    channel.send(pupa(moderationConfig.tempban.private.message, { user })).catch(noop);

    const document: SanctionBase = {
        memberId: member.id,
        type: SanctionTypes.TEMPBAN,
        reason,
        start: Date.now(),
        duration: duration.asMillis(),
        moderatorId: moderator.id,
        revoked: false,
        channel: channel.id,
    };

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

async function unban(client: AkairoClient, doc: SanctionDocument, moderator?: GuildMember): Promise<boolean> {
    try {
        // Update database
        doc = await Sanction.findOneAndUpdate(
            { _id: doc.id },
            { $set: { revoked: true } },
        );
        // Unban user
        const member: GuildMember = await client.guild.members.fetch(doc.memberId);
        member.roles.remove(settings.roles.banned).catch(noop);
        const channel: TextChannel = client.guild.channels.cache.get(doc.channel) as TextChannel;
        await channel.edit({
            name: 'un' + (channel).name,
            permissionOverwrites: [
                {
                    id: settings.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
                {
                    id: settings.roles.staff,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CREATE_INSTANT_INVITE],
                },
            ],
        });
        const embed = new MessageEmbed()
            .setTitle(moderationConfig.unban.embed.title)
            .addField(moderationConfig.unban.embed.username,
                (member.nickname == null ? member.user.username : member.nickname))
            .setColor(settings.colors.default)
            .setTimestamp()
            .setFooter(moderator == null
                ? 'Unban automatique'
                : pupa(settings.embed.footer, { executor: moderator.nickname ?? moderator.user.username }));
        channel.send(embed).catch(noop);
        return true;
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    } catch (_unknownError: unknown) {
        return false;
    }
}

export default {
    warn,
    tempban,
    unban,
};
