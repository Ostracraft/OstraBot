import { Listener } from 'discord-akairo';
import type { Command } from 'discord-akairo';
import type { Message } from 'discord.js';
import messages from '@app/config/messages';
import { noop } from '@app/utils';

class MissingPermissionListener extends Listener {
    constructor() {
        super('missingPermissions', {
            event: 'missingPermissions',
            emitter: 'commandHandler',
        });
    }

    public async exec(message: Message, _command: Command, _type: string, _missing: string[]): Promise<void> {
        const sended = await message.channel.send(messages.noperm);
        setTimeout(() => {
            message.delete().catch(noop);
            sended.delete().catch(noop);
        }, 5000);
    }
}

export default MissingPermissionListener;
