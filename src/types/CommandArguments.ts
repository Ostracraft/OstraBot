import type { Command } from "discord-akairo";
import { VoiceChannel } from "discord.js";
import { User } from "discord.js";
import { GuildMember } from "discord.js";
import { Duration } from ".";

export interface HelpCommandArguments {
    command: Command;
}

export interface PingCommandArguments {}

export interface PurgeCommandArguments {
    amount: number;
    member: GuildMember | User;
    force: boolean;
}

export interface TempBanCommandArguments {
    member: GuildMember | User;
    duration: Duration,
    reason: string;
}

export interface UserInfoCommandArguments {
    member: GuildMember | User;
}

export interface WarnCommandArguments {
    user: User;
    reason: string;
}

export interface YoutuberCommandArguments {
    channel: VoiceChannel;
}