import { Command } from "discord-akairo";
import { ping as config } from "@app/config/commands/basic";
import { GuildMessage } from "@app/types";
import { PingCommandArguments } from "@app/types/CommandArguments";
import { MessageEmbed } from "discord.js";
import settings from "@app/config/settings";
import pupa = require('pupa');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: config.settings.aliases,
      clientPermissions: config.settings.clientPermissions,
      userPermissions: config.settings.userPermissions,
      channel: 'guild',
    });
    this.details = config.details;
  }

  public async exec(message: GuildMessage, args: PingCommandArguments): Promise<void> {
    const firstMessage = await message.channel.send(config.messages.firstMessage);
    const botPing = (firstMessage.createdAt || firstMessage.editedAt).getTime() - (message.createdAt || message.editedAt).getTime();
    const discordPing = Math.round(this.client.ws.ping);

    const description = pupa(config.messages.embedDescription, {
      botPing,
      discordPing,
      botIndic: this._getColorFromPing(botPing),
      discordIndic: this._getColorFromPing(discordPing),
    });

    const embed = new MessageEmbed()
      .setColor(settings.colors.default)
      .setDescription(description)
      .setFooter(pupa(settings.embed.footer, { executor: message.author.username }))
      .setTimestamp();

    await firstMessage.delete();
    await message.channel.send(embed);
  }

  private _getColorFromPing(ping: number): string {
    if (ping > 600)
      return ':red_circle:';
    if (ping > 400)
      return ':orange_circle:';
    if (ping > 200)
      return ':yellow_circle:';
    return ':green_circle:';
  }

}

export default PingCommand;