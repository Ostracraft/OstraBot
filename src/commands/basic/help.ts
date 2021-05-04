import { Command } from 'discord-akairo';
import type { PermissionResolvable } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { help as config } from '@app/config/commands/basic';
import settings from '@app/config/settings';
import type { GuildMessage } from '@app/types';
import type { HelpCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');


class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: config.settings.aliases,
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
            args: [{
                id: 'command',
                type: 'commandAlias',
            }],
        });
        this.details = config.details;
    }


    public exec(message: GuildMessage, args: HelpCommandArguments): void {
        const { command } = args;
        const { categories } = this.handler;
        if (command) {
            const { details } = command;

            const embed = new MessageEmbed()
                .setTitle(pupa(config.messages.command.title, { command: details.name }))
                .addField(config.messages.command.description, details.content)
                .addField(config.messages.command.aliases, command.aliases.join(', '))
                .addField(config.messages.command.usage, details.usage)
                .addField(config.messages.command.examples, details.examples)
                .setFooter(pupa(settings.embed.footer, message.author))
                .setColor(settings.colors.default)
                .setTimestamp();

            message.channel.send(embed).catch(noop);
        } else {
            const embed = new MessageEmbed()
                .setTitle(config.messages.global.title)
                .setFooter(pupa(settings.embed.footer,
                    { executor: message.member.nickname ?? message.member.user.username }))
                .setColor(settings.colors.default)
                .setTimestamp();
            for (const category of categories.array()) {
                const content = category.map(cmd => (this._isAllowed(cmd, message) ? `\`${cmd.aliases[0]}\`` : `~~\`${cmd.aliases[0]}\`~~`)).join(config.messages.global.field.separator);
                embed.addField(pupa(config.messages.global.field.title, { category: category.id.toUpperCase() }),
                            pupa(config.messages.global.field.content, { content }));
            }
            message.channel.send(embed).catch(noop);
        }
    }

    private _isAllowed(command: Command, message: GuildMessage): boolean {
        if (typeof command.userPermissions === 'function') {
            return command.userPermissions(message) === null;
        } else if (message.guild) {
            const userPermissions: PermissionResolvable = command.userPermissions as PermissionResolvable;
            const userMissing = message.channel.permissionsFor(message.author).missing(userPermissions);
            return userMissing.length <= 0;
        }
        return true;
    }
}

export default HelpCommand;
