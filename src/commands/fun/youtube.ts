/* eslint-disable @typescript-eslint/naming-convention */
import { Command } from 'discord-akairo';
import type { Channel } from 'discord.js';
import fetch from 'node-fetch';
import { youtube as config } from '@app/config/commands/fun';
import type { GuildMessage } from '@app/types';
import type { YoutuberCommandArguments } from '@app/types/CommandArguments';
import { noop } from '@app/utils';
// eslint-disable-next-line import/order
import pupa = require('pupa');


class YoutubeCommand extends Command {
    constructor() {
        super('youtube', {
            aliases: config.settings.aliases,
            args: [{
                id: 'channel',
                type: 'channel',
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
        });
        this.details = config.details;
    }


    public async exec(message: GuildMessage, args: YoutuberCommandArguments): Promise<void> {
        let voiceChannel: Channel = message.member.voice.channel;
        if (!voiceChannel) {
            if (args.channel == null) {
                message.channel.send(config.messages.notInChannel).catch(noop);
                return;
            }
            voiceChannel = args.channel;
            if (voiceChannel.type !== 'voice') {
                message.channel.send(config.messages.notInChannel).catch(noop);
                return;
            }
        }
        const res = await fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86_400,
                max_uses: 0,
                target_application_id: '755600276941176913', // Youtube together
                target_type: 2,
                temporary: false,
                validate: null,
            }),
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        const json = await res.json();
        const link = `https://discord.com/invite/${json.code}`;
        message.channel.send(pupa(config.messages.success, { link })).catch(noop);
    }
}

export default YoutubeCommand;
