import { Command } from "discord-akairo";
import { poker as config } from "@app/config/commands/fun";
import { GuildMessage } from "@app/types";
import { YoutuberCommandArguments } from "@app/types/CommandArguments";
import { GuildMember } from "discord.js";
import fetch from "node-fetch"
import { Channel } from "discord.js";
import pupa = require('pupa');

class PokerCommand extends Command {
    constructor() {
        super('poker', {
            aliases: config.settings.aliases,
            args: [{
                id: "channel",
                type: "channel",
            }],
            clientPermissions: config.settings.clientPermissions,
            userPermissions: config.settings.userPermissions,
        });
        this.details = config.details;
    }

    
    public async exec(message: GuildMessage, args: YoutuberCommandArguments): Promise<void> {
        const member: GuildMember = message.member;
        let voiceChannel: Channel = message.member.voice.channel;
        if(!voiceChannel) {
            if(args.channel == null) {
                message.channel.send(config.messages.notInChannel);
                return;
            }
            voiceChannel = args.channel;
            if(voiceChannel.type != "voice") {
                message.channel.send(config.messages.notInChannel);
                return;
            }
        }
        const res = await fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755827207812677713", // poker
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${process.env.TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        const json = await res.json();
        const link = `https://discord.com/invite/${json.code}`;
        message.channel.send(pupa(config.messages.success, { link }));
    }
}

export default PokerCommand;