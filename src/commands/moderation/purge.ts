import { Argument, Command } from 'discord-akairo';
import type { Message } from 'discord.js';
import { purge as config } from '@app/config/commands/moderation';
import messages from '@app/config/messages';
import settings from '@app/config/settings';
import type { GuildMessage } from '@app/types';
import type { PurgeCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');

class PurgeCommand extends Command {
    constructor() {
        super('purge', {
            aliases: config.settings.aliases,
            args: [{
                id: 'amount',
                type: Argument.range('integer', 0, settings.moderation.purgeLimit + 1),
                prompt: {
                    start: pupa(messages.prompt.start, { required: 'le nombre de messages' }),
                    retry: pupa(messages.prompt.retry, { required: 'le nombre de messages' }),
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
        const { channel } = message;
        const list = (await channel.messages.fetch({ limit: amount + 1 }))
            .filter(msg => (member ? msg.author.id === member.id : true))
            .filter(msg => (force || !msg.member?.roles.cache.has(settings.roles.staff)));
        const deleted = await channel.bulkDelete(list, true);
        const msg: Message = await (amount < 2
            ? channel.send(config.messages.single)
            : channel.send(pupa(config.messages.several, { amount: deleted.size })));
        setTimeout(() => {
            msg.delete().catch(noop);
        }, 2000);
    }
}

export default PurgeCommand;
