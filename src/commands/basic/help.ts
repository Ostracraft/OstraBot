import { Command } from "discord-akairo";
import { help as config } from "@app/config/commands/basic";
import { GuildMessage } from "@app/types";
import { HelpCommandArguments } from "@app/types/CommandArguments";
import { MessageEmbed } from "discord.js";
import settings from "@app/config/settings";
import pupa = require('pupa');
import { PermissionResolvable } from "discord.js";

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


    public async exec(message: GuildMessage, args: HelpCommandArguments): Promise<void> {
        const { command } = args;
        const { categories } = this.handler;
        if (command) {
            const details = command.details;

            const embed = new MessageEmbed()
                .setTitle(pupa(config.messages.command.title, { command: details.name }))
                .addField(config.messages.command.description, details.content)
                .addField(config.messages.command.aliases, command.aliases.join(", "))
                .addField(config.messages.command.usage, details.usage)
                .addField(config.messages.command.examples, details.examples)
                .setFooter(pupa(settings.embed.footer, message.author))
                .setColor(settings.colors.default)
                .setTimestamp();

            message.channel.send(embed);

        } else {
            const embed = new MessageEmbed()
                .setTitle(config.messages.global.title)
                .setFooter(pupa(settings.embed.footer, { executor: message.member.nickname ?? message.member.user.username }))
                .setColor(settings.colors.default)
                .setTimestamp();
            for (const category of categories.array()) {
                const content = category.map(command => (this._isAllowed(command, message) ? `\`${command.aliases[0]}\`` : `~~\`${command.aliases[0]}\`~~`)).join(config.messages.global.field.separator);
                embed.addField(pupa(config.messages.global.field.title, { category: category.id.toUpperCase() }), pupa(config.messages.global.field.content, { content }));
            }
            message.channel.send(embed);
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