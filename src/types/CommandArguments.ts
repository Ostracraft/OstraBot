/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Command } from 'discord-akairo';
import type { GuildMember, User, VoiceChannel } from 'discord.js';


import type { Duration } from '.';

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
    user: User;
    duration: Duration;
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
