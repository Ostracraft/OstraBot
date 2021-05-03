import { Command } from "discord-akairo";
import { purge as config } from "@app/config/commands/moderation";
import { GuildMessage } from "@app/types";
import { PurgeCommandArguments } from "@app/types/CommandArguments";
import { Argument } from "discord-akairo";
import settings from "@app/config/settings";
import pupa = require('pupa');
import { Message } from "discord.js";

class PurgeCommand extends Command {
    constructor() {
        super("purge", {
            aliases: config.settings.aliases,
            args: [{
                id: 'amount',
                type: Argument.range('integer', 0, settings.moderation.purgeLimit + 1),
                prompt: {
                    start: config.messages.startPrompt,
                    retry: config.messages.retryPrompt,
                },
            },
            {
                id: 'member',
                type: Argument.union('member', 'user'),
                unordered: true,
            },
            {
                id: 'force',
                match: 'flag',
                flag: ['--force', '-f'],
                unordered: true,
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
            channel: 'guild',
        });
        this.details = config.details;
    }

    public async exec(message: GuildMessage, args: PurgeCommandArguments): Promise<void> {
        const { amount, member, force } = args;
        const channel = message.channel;
        const messages = (await channel.messages.fetch({ limit: amount + 1 }))
            .filter(msg => (member ? msg.author.id === member.id : true))
            .filter(msg => (force || !msg.member?.roles.cache.has(settings.roles.staff)));
        const deleted = await channel.bulkDelete(messages, true);
        let msg: Message;
        if (amount < 2)
            msg = await channel.send(config.messages.single);
        else
            msg = await channel.send(pupa(config.messages.several, { amount: deleted.size }));
        setTimeout(() => {
            msg.delete();
        }, 2000);
    }

}

export default PurgeCommand;