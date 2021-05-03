import messages from "@app/config/messages";
import settings from "@app/config/settings";
import { Command } from "discord-akairo";
import { Listener } from "discord-akairo";
import { Message } from "discord.js";

class MissingPermissionListener extends Listener {
    constructor() {
        super('missingPermissions', {
            event: 'missingPermissions',
            emitter: 'commandHandler',
        });
    }

    public async exec(message: Message, command: Command, type: string, missing: string[]): Promise<void> {
        const sended = await message.channel.send(messages.noperm);
        setTimeout(() => {
            message.delete();
            sended.delete();
        }, 5000);
    }
}

export default MissingPermissionListener;